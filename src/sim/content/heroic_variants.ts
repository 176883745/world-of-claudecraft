// Heroic upgraded drop variants. When a mob dies in a HEROIC dungeon instance, its
// normal (base-table) epic and rare drops are swapped for a "Heroic" copy: the same
// item identity one tier up. Epics read item level 28, rares 25 (see
// HEROIC_VARIANT_SOURCE_LEVEL in ../item_level), with primary stats rescaled to the
// matching budget. The swap happens in loot/loot_roll.ts, and only when it is an
// UPGRADE (raid epics, already item level 29, are left alone).
//
// These are real ItemDefs merged into ITEMS (data.ts), so every downstream reader
// (tooltip, equip, itemScore, the server->client wire) treats a Heroic variant like
// any other item with no special handling. The one exception is the display name:
// the client composes it as "Heroic {base name}" from the `heroicOf` field
// (ui/entity_i18n.ts), so a variant never needs its own translated name key, and
// the entity manifest skips it.
import {
  HEROIC_VARIANT_SOURCE_LEVEL,
  normalizePrimaryStats,
  primaryStatBudget,
  QUALITY_ILVL_BONUS,
} from '../item_budget';
import type { ItemDef, MobTemplate } from '../types';

// The id of the Heroic variant of a base item (a stable, pure prefix).
export function heroicVariantId(baseId: string): string {
  return `heroic_${baseId}`;
}

function makeHeroicVariant(base: ItemDef): ItemDef {
  const quality = base.quality ?? 'common';
  const targetLevel = HEROIC_VARIANT_SOURCE_LEVEL + (QUALITY_ILVL_BONUS[quality] ?? 0);
  const budget = primaryStatBudget(targetLevel, base.quality, base.slot);
  // normalizePrimaryStats keeps the item's stat identity (its str/agi/int ratio)
  // and passes armor through untouched; only the primary-stat sum grows to the
  // heroic budget. Weapon damage and armor stay at the base value, so the variant
  // is never worse than its base.
  const stats = base.stats ? normalizePrimaryStats(base.stats, budget) : base.stats;
  return {
    ...base,
    id: heroicVariantId(base.id),
    name: `Heroic ${base.name}`,
    heroicOf: base.id,
    stats,
  };
}

// Build a Heroic variant for every epic/rare EQUIPPABLE item that drops from a mob's
// base loot table. Vendor jewelry, quest rewards, the item-level-31 heroic set
// (appended via HEROIC_BOSS_LOOT, never a mob-loot entry), and non-gear are excluded
// because they never appear in a MobTemplate.loot list.
export function buildHeroicVariants(
  items: Record<string, ItemDef>,
  mobs: Record<string, MobTemplate>,
): Record<string, ItemDef> {
  const eligible = new Set<string>();
  for (const mob of Object.values(mobs)) {
    for (const entry of mob.loot ?? []) {
      const id = entry.itemId;
      if (!id) continue;
      const def = items[id];
      if (!def || def.heroicOf) continue; // skip missing ids and already-variants
      if (def.quality !== 'epic' && def.quality !== 'rare') continue;
      if (!def.slot || (def.kind !== 'armor' && def.kind !== 'weapon')) continue;
      eligible.add(id);
    }
  }
  const out: Record<string, ItemDef> = {};
  for (const id of eligible) out[heroicVariantId(id)] = makeHeroicVariant(items[id]);
  return out;
}
