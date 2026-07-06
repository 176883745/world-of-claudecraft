// Bank: the per-character deposit box, a second pooled item store alongside the
// carried backpack + bags. Like bags, capacity is POOLED (a flat slot budget over
// one inventory list, nothing pins an item to a fixed cell) and per-character: the
// state lives on PlayerMeta.bank and serializes INSIDE the character save, exactly
// like inventory/bags. The base 24 slots grow in 6-slot blocks bought with copper
// (BANK_EXPANSION_PRICES); server-stamped bonus slots wire in a later phase.
//
// This follows the bags.ts pattern: pure move/capacity math a Vitest imports
// directly, plus the three command bodies (bankDeposit/bankWithdraw/bankBuySlots)
// as free functions `fn(ctx, ...)` behind SimContext. Backing state stays on Sim
// (PlayerMeta.bank); Sim keeps thin same-named delegates. Each op has ONE entry
// point so a later phase can add the banker-proximity gate in one place each.
//
// `src/sim`-pure: no DOM/Three/render-ui-game-net imports, no Math.random/Date.now
// (enforced by tests/architecture.test.ts). This module draws NO rng.

import { addStacked, bagCapacity, bagsFullError, countFit } from './bags';
import { ITEMS } from './data';
import type { SimContext } from './sim_context';
import { cloneInvSlot, type InvSlot } from './types';

/** Slots every character's bank starts with, before any expansion. */
export const BANK_BASE_SLOTS = 24;
/** Slots one copper expansion adds; also the granularity purchasedSlots stays on. */
export const BANK_EXPANSION_SLOTS = 6;
/** Copper cost of each successive expansion, cheapest first. The entry count is the
 *  purchase cap, so the purchased ceiling is 24 + 12*6 = 96 (an absolute 112 once a
 *  later phase stamps the bonus slots). Data-as-code: the price is always this table
 *  lookup, never a client-supplied value, so it is inherently overflow-safe. */
export const BANK_EXPANSION_PRICES: readonly number[] = [
  500, 1000, 2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 600000, 1200000,
];

/** A character's bank: a pooled item list plus its two slot-budget contributions.
 *  `purchasedSlots` is always a multiple of BANK_EXPANSION_SLOTS in [0, 72];
 *  `bonusSlots` stays 0 until a later phase stamps server-granted bonus space. */
export interface BankState {
  inventory: InvSlot[];
  purchasedSlots: number;
  bonusSlots: number;
}

/** The bank's current slot budget. Over-capacity inventories are tolerated (a
 *  tampered/legacy save may overflow); capacity only blocks new deposits. */
export function bankCapacity(bank: BankState): number {
  return BANK_BASE_SLOTS + bank.purchasedSlots + bank.bonusSlots;
}

export type MoveRefusal = 'invalid' | 'no_fit';
export interface MoveResult {
  moved: number;
  refusal?: MoveRefusal;
}

/** Move one source slot's items into a destination container, ALL-OR-NOTHING: the
 *  full requested count moves or nothing does. Container-agnostic (no ctx, no pid,
 *  no policy: quest-deny is the caller's concern), so the guild-bank/loadout seam
 *  reuses it. Mutates the two arrays ONLY on success.
 *
 *  - `count` undefined = the whole stack.
 *  - An instanced slot (#1165 per-instance payload) moves as ONE indivisible unit
 *    regardless of count: it never merges with a dest stack (a deep clone is pushed
 *    into a fresh slot), so it needs one free dest slot or refuses 'no_fit'.
 *  - A fungible slot reuses the bags.ts stacking rules (countFit/addStacked): the
 *    move fits only when every requested copy fits, then tops up dest stacks and
 *    appends fresh ones. A partial count decrements the source; a whole-stack move
 *    splices the source entry out. */
export function moveBetweenContainers(
  source: InvSlot[],
  sourceIndex: number,
  count: number | undefined,
  dest: InvSlot[],
  destCapacity: number,
): MoveResult {
  if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex >= source.length) {
    return { moved: 0, refusal: 'invalid' };
  }
  const slot = source[sourceIndex];

  // Instanced: the whole slot moves as one unit (a per-instance payload can never be
  // split or merged), so it always needs a fresh dest slot.
  if (slot.instance) {
    if (dest.length >= destCapacity) return { moved: 0, refusal: 'no_fit' };
    dest.push(cloneInvSlot(slot));
    source.splice(sourceIndex, 1);
    return { moved: slot.count };
  }

  const want = count === undefined ? slot.count : Math.floor(count);
  if (!(want > 0) || want > slot.count) return { moved: 0, refusal: 'invalid' };
  if (countFit(dest, destCapacity, slot.itemId, want) < want) {
    return { moved: 0, refusal: 'no_fit' };
  }
  addStacked(dest, slot.itemId, want);
  if (want >= slot.count) source.splice(sourceIndex, 1);
  else slot.count -= want;
  return { moved: want };
}

/** Deposit a carried-inventory slot into the bank. Quest items are refused (they
 *  are quest-bound); everything else follows the pooled capacity rules. A counted
 *  fungible leaving the bags must un-credit any collect quest, so success pokes the
 *  quest-inventory recompute. noMarketList is NOT honored here: the bank is
 *  self-storage, not a player-to-player transfer, so only quest-kind is denied. */
export function bankDeposit(
  ctx: SimContext,
  slotIndex: number,
  count?: number,
  pid?: number,
): void {
  const r = ctx.resolve(pid);
  if (!r) return;
  const { meta } = r;
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= meta.inventory.length) return;
  const slot = meta.inventory[slotIndex];
  if (ITEMS[slot.itemId]?.kind === 'quest') {
    ctx.error(meta.entityId, 'You cannot store quest items in the bank.');
    return;
  }
  const result = moveBetweenContainers(
    meta.inventory,
    slotIndex,
    count,
    meta.bank.inventory,
    bankCapacity(meta.bank),
  );
  if (result.refusal === 'no_fit') {
    ctx.error(meta.entityId, 'Your bank is full.');
    return;
  }
  if (result.refusal) return; // 'invalid': malformed input (cheat/desync), no player line
  ctx.onInventoryChangedForQuests(meta);
}

/** Withdraw a bank slot back into the carried inventory: the mirror of deposit,
 *  gated by the bag capacity. A counted fungible returning to the bags must
 *  re-credit any collect quest, so success pokes the quest-inventory recompute. */
export function bankWithdraw(
  ctx: SimContext,
  slotIndex: number,
  count?: number,
  pid?: number,
): void {
  const r = ctx.resolve(pid);
  if (!r) return;
  const { meta } = r;
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= meta.bank.inventory.length) {
    return;
  }
  const result = moveBetweenContainers(
    meta.bank.inventory,
    slotIndex,
    count,
    meta.inventory,
    bagCapacity(meta.bags),
  );
  if (result.refusal === 'no_fit') {
    bagsFullError(ctx, meta.entityId);
    return;
  }
  if (result.refusal) return; // 'invalid': malformed input (cheat/desync), no player line
  ctx.onInventoryChangedForQuests(meta);
}

/** Buy the next 6-slot bank expansion for exact copper, non-refundable. Blocked at
 *  the purchase cap (BANK_EXPANSION_PRICES.length) and when the player cannot afford
 *  the table price; neither refusal mutates anything. */
export function bankBuySlots(ctx: SimContext, pid?: number): void {
  const r = ctx.resolve(pid);
  if (!r) return;
  const { meta } = r;
  // purchasedSlots is kept on the 6-slot grid (init 0, load floors, +6 here), so this
  // divides evenly; the floor guards a future writer from a fractional price index.
  const purchases = Math.floor(meta.bank.purchasedSlots / BANK_EXPANSION_SLOTS);
  if (purchases >= BANK_EXPANSION_PRICES.length) {
    ctx.error(meta.entityId, 'Your bank cannot be expanded further.');
    return;
  }
  const price = BANK_EXPANSION_PRICES[purchases];
  if (meta.copper < price) {
    ctx.error(meta.entityId, 'You cannot afford that bank expansion.');
    return;
  }
  meta.copper -= price;
  meta.bank.purchasedSlots += BANK_EXPANSION_SLOTS;
  ctx.notice(meta.entityId, 'You purchase additional bank slots.');
}

/** The ONE load path for persisted bank state. Tampered/legacy saves sanitize;
 *  items are NEVER destroyed (an unknown-but-string itemId stays as dormant
 *  recoverable data, the mail precedent). Over-capacity inventories are tolerated
 *  (never truncated). purchasedSlots is clamped into range and floored to a whole
 *  expansion so the price indexing stays coherent. */
export function sanitizeBankState(raw: unknown): BankState {
  if (!raw || typeof raw !== 'object') {
    return { inventory: [], purchasedSlots: 0, bonusSlots: 0 };
  }
  const r = raw as { inventory?: unknown; purchasedSlots?: unknown; bonusSlots?: unknown };
  const inventory: InvSlot[] = [];
  if (Array.isArray(r.inventory)) {
    for (const entry of r.inventory) {
      if (!entry || typeof entry !== 'object') continue;
      const e = entry as { itemId?: unknown; count?: unknown; instance?: unknown };
      if (typeof e.itemId !== 'string' || e.itemId === '') continue;
      const hasInstance = !!e.instance && typeof e.instance === 'object';
      // An instanced slot forces count 1: a count above 1 would mint payload copies.
      const count = hasInstance ? 1 : Math.max(1, Math.floor(Number(e.count)) || 1);
      const slot: InvSlot = hasInstance
        ? { itemId: e.itemId, count, instance: e.instance as InvSlot['instance'] }
        : { itemId: e.itemId, count };
      inventory.push(cloneInvSlot(slot));
    }
  }
  const maxPurchased = BANK_EXPANSION_PRICES.length * BANK_EXPANSION_SLOTS;
  let purchasedSlots = Math.max(
    0,
    Math.min(maxPurchased, Math.floor(Number(r.purchasedSlots)) || 0),
  );
  purchasedSlots -= purchasedSlots % BANK_EXPANSION_SLOTS;
  // No upper clamp: the bonus ceiling is unknown until Phase 8 defines the source
  // registry (email/Discord/wallet/referrals); Phase 8 adds the clamp with the registry.
  const bonusSlots = Math.max(0, Math.floor(Number(r.bonusSlots)) || 0);
  return { inventory, purchasedSlots, bonusSlots };
}
