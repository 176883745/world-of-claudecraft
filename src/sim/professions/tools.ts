// Gathering tool tier gating (#1123, extended by #1135). A base gathering
// tool has a tier; the tool's tier gates which node tiers AND which monster
// material tiers it can gather/harvest, via one shared comparator. This
// module is a pure leaf: no SimContext state, just the comparison +
// item-shape helpers, so it is Vitest-importable directly (like
// threat.ts/spatial.ts).
//
// This repo has no durability mechanic anywhere in ItemDef (see types.ts):
// a base gathering tool never carries a durability field, so it can never
// become unusable from durability loss. That is a property of the item shape,
// not something this module enforces at runtime.

import {
  type GatheringProfessionId,
  TOOL_EFFECTS,
  type ToolEffectId,
} from '../content/professions';
import type { Rng } from '../rng';
import type { ItemDef, ItemUse } from '../types';
import type { MaterialRarity } from './gathering';

export interface GatherToolUse {
  type: 'gatherTool';
  professionId: GatheringProfessionId;
  tier: number;
}

export function isGatherToolUse(use: ItemUse | undefined): use is GatherToolUse {
  return !!use && use.type === 'gatherTool';
}

// Returns the tool's gathering tier, or undefined if the item is not a
// gathering tool for the given profession.
export function gatherToolTier(
  item: ItemDef | undefined,
  professionId: GatheringProfessionId,
): number | undefined {
  if (!item?.use || !isGatherToolUse(item.use)) return undefined;
  if (item.use.professionId !== professionId) return undefined;
  return item.use.tier;
}

// Shared pure comparator (#1135): a tool of a given tier covers its own tier and
// every tier below it, never above. Both node gating and monster-material
// gating reuse this single comparison so the semantics can never drift apart.
function toolTierCovers(toolTier: number, targetTier: number): boolean {
  return toolTier >= targetTier;
}

// True only when the player's tool tier is at least the node/material tier:
// a tier-1 tool cannot gather a tier-2+ node, a tier-2 tool can gather tier 1
// and tier 2, and so on. A tool's rarity (ItemDef `quality`) never enters this
// check: rarity is cosmetic/value only (#1135), gating is tier-only.
export function canGatherTier(playerToolTier: number, nodeTier: number): boolean {
  return toolTierCovers(playerToolTier, nodeTier);
}

// True only when the player's tool tier is at least the monster material's
// tier (#1135): e.g. skinning/harvesting a material off a slain monster. Same
// semantics as `canGatherTier`, reusing the one shared comparator so node
// gating and monster-material gating can never fall out of sync.
export function canHarvestMonsterMaterial(toolTier: number, materialTier: number): boolean {
  return toolTierCovers(toolTier, materialTier);
}

// Tool effect slotting (#1136). Durability is modeled as a standalone counter
// on a `ToolEffectSlot`, NOT as an `ItemDef`/item-instance field: this repo has
// no per-instance item payload merged anywhere near this branch (the closest
// candidate, #1165's item-instance charges, lives on a history that diverged
// long before this base and would drag in an unrelated inventory model for a
// bonus this module can track on its own). A slot is plain data the caller
// (a future per-tool-instance record, e.g. keyed by playerId+professionId, or
// a per-node harvest call site) owns and passes in; this module never stores
// slot state itself, keeping it a pure leaf like the rest of the file.
export interface ToolEffectSlot {
  effectId: ToolEffectId;
  /** Remaining charges. Reaches 0 when the effect is fully depleted. */
  durability: number;
}

// Attaches an effect from the catalog to a tool, at its full starting
// durability. Re-slotting (calling this again) always resets to full charges,
// same as installing a fresh effect.
export function slotEffect(effectId: ToolEffectId): ToolEffectSlot {
  return { effectId, durability: TOOL_EFFECTS[effectId].startingDurability };
}

// The outcome shape a harvest/craft action produces. `quantity`/`quality` are
// plain counts; `respawnTicks` is how many ticks until the node/resource can
// be harvested again (lower is faster). Kept minimal and host-agnostic so
// this module has no dependency on the node/harvest system that eventually
// calls it (see the integration note below).
export interface HarvestOutcome {
  quantity: number;
  quality: number;
  respawnTicks: number;
}

// Pure: returns a NEW outcome with the slotted effect's bonus applied, or the
// SAME outcome (by value, unchanged) when there is no slot or its durability
// has reached 0. The base tool's own tier/gating (canGatherTier /
// canHarvestMonsterMaterial above) is untouched either way: a depleted effect
// never blocks the base tool, it just stops contributing its bonus.
export function applyEffectBonus(
  slot: ToolEffectSlot | undefined,
  outcome: HarvestOutcome,
): HarvestOutcome {
  if (!slot || slot.durability <= 0) return outcome;
  const def = TOOL_EFFECTS[slot.effectId];
  switch (def.kind) {
    case 'quantity':
      return { ...outcome, quantity: outcome.quantity + def.bonus };
    case 'quality':
      return { ...outcome, quality: outcome.quality + def.bonus };
    case 'respawnSpeed':
      return { ...outcome, respawnTicks: Math.max(1, outcome.respawnTicks - def.bonus) };
  }
}

// Rarity-scaled effect durability consumption curve (#1139). The standard
// rarity ladder (MaterialRarity: common/uncommon/rare/epic/legendary, see
// gathering.ts) orders both a tool's own rarity (ItemDef `quality`) and the
// rarity of the target being worked (a harvested material's rolled rarity, a
// node's rarity, or any future rarity-bearing target). This fixed order is
// the only input to the consumption roll below.
const RARITY_ORDER: readonly MaterialRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

function rarityTierIndex(rarity: MaterialRarity): number {
  return RARITY_ORDER.indexOf(rarity);
}

// Chance floor: even a tool many tiers above its target still spends a charge
// sometimes, so a high-end tool never becomes fully "free" against trash
// targets.
export const CONSUMPTION_CHANCE_FLOOR = 0.1;

// Chance lost per tier of gap between the tool's rarity and the (lower)
// target's rarity. Tuned to the issue's worked example for an epic tool:
//   epic vs epic   (tierGap 0, tool NOT above target): 100% (1 - 0.4*0, but
//                    clamped to 1 below since a non-positive gap always consumes)
//   epic vs rare   (tierGap 1): 1 - 0.4*1 = 0.6  (60%)
//   epic vs common (tierGap 3): 1 - 0.4*3 = -0.2, floored to 0.1 (10%)
// A two-tier gap (e.g. epic vs uncommon) lands at 1 - 0.4*2 = 0.2 (20%),
// interpolating smoothly between the worked example's anchor points.
const CONSUMPTION_CHANCE_STEP = 0.4;

// Pure: the chance a single use spends one durability charge, given the
// tool's rarity and the rarity of what it is being used on. Against an
// equal-or-higher-rarity target (tierGap <= 0) a charge is ALWAYS spent: the
// curve only ever discounts consumption when the tool outclasses its target,
// never the reverse. See the worked example above for the anchor values this
// formula was tuned against.
export function effectConsumptionChance(
  toolRarity: MaterialRarity,
  targetRarity: MaterialRarity,
): number {
  const tierGap = rarityTierIndex(toolRarity) - rarityTierIndex(targetRarity);
  if (tierGap <= 0) return 1;
  return Math.max(CONSUMPTION_CHANCE_FLOOR, 1 - CONSUMPTION_CHANCE_STEP * tierGap);
}

// Rolls whether this use depletes the slotted effect by one charge. Depletion
// is PROBABILISTIC (per `effectConsumptionChance(toolRarity, targetRarity)`),
// not a flat -1 per use, so every decrement goes through `Rng.chance` (never
// Math.random): the draw always happens (even at durability 0, where it is a
// no-op) so calling this in a fixed order across a fixed rng seed always
// produces the same depletion sequence, independent of an effect's remaining
// charges. Mutates `slot.durability` in place and returns whether it
// decremented this call.
export function depleteEffect(
  slot: ToolEffectSlot | undefined,
  toolRarity: MaterialRarity,
  targetRarity: MaterialRarity,
  rng: Rng,
): boolean {
  if (!slot) return false;
  const rolled = rng.chance(effectConsumptionChance(toolRarity, targetRarity));
  if (rolled && slot.durability > 0) {
    slot.durability -= 1;
    return true;
  }
  return false;
}

// INTEGRATION NOTE (#1136, consumption curve added by #1139): the node-harvest
// outcome path (#1121) and the recipe-crafting outcome path (#1127) are not
// present on this branch (this branch is stacked directly on #1135, the
// crafted-tool-tiers PR), so there is no live call site to wire
// `applyEffectBonus`/`depleteEffect` into yet. Once either lands, its
// outcome-producing function should: build the base HarvestOutcome, call
// `applyEffectBonus(slot, outcome)` to get the bonused result, then call
// `depleteEffect(slot, toolRarity, targetRarity, rng)` using the SAME `Rng`
// the caller already draws from (never a fresh one) so the consumption roll
// takes its place in the one shared draw order. `toolRarity` is the base
// tool's own `ItemDef.quality`; `targetRarity` is the rarity of whatever is
// being worked (e.g. the harvested material's `rollMaterialRarity` result).
