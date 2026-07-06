// Pure view-core for the desktop Bank window (#bank), the per-character deposit
// box read off the IWorld bank mirror. DOM/Three/i18n-free: it maps the
// proximity-gated BankInfo snapshot (null away from a banker) to a flat render
// model the thin painter (bank_window.ts) draws, and decides the slot click
// action (a whole withdraw vs the shift split-stack prompt). Registered in
// UI_PURE_CORES; unit-tested against both Sim- and ClientWorld-shaped inputs in
// tests/bank_view.test.ts. Mirrors the bags_view / mailbox_view pure-core split.

import { BANK_EXPANSION_SLOTS } from '../sim/bank';
import type { InvSlot } from '../sim/types';
import type { BankInfo } from '../world_api';
import { bagQualityKey } from './bags_view';

/** The item facts the bank grid needs from the item table: just the quality, so
 *  the painter can tint the slot. A miss (unknown id) is tolerated as 'common'. */
export type BankItemLookup = (itemId: string) => { quality?: string } | undefined;

/** One occupied bank cell. `slotIndex` is the index into BankInfo.slots and is
 *  the exact wire argument for bankDeposit/bankWithdraw (order is preserved, no
 *  sort/filter this phase). */
export interface BankSlotModel {
  slotIndex: number;
  itemId: string;
  count: number;
  showCount: boolean; // count > 1 (a lone item hides its "1")
  qualityKey: string; // item quality ?? 'common' (bagQualityKey semantics)
}

/** The header counter: occupied slots over the total budget, plus the two budget
 *  contributions the buy panel and tooltips surface. */
export interface BankCapacityModel {
  used: number;
  total: number;
  purchasedSlots: number;
  bonusSlots: number;
}

/** The expand-slots panel: the next block's copper price (null once maxed), the
 *  block size, and the maxed flag the painter disables the button on. */
export interface BankBuySlotsModel {
  nextCost: number | null;
  blockSlots: number;
  maxed: boolean;
}

/** The whole window model: 'away' when no banker is in reach (bankInfo null),
 *  else the populated grid + capacity + buy panel. */
export type BankViewModel =
  | { kind: 'away' }
  | {
      kind: 'bank';
      capacity: BankCapacityModel;
      slots: BankSlotModel[];
      // Free cells to paint after the items. Over-capacity states (a legacy/tampered
      // save with used > total) clamp to 0, never a negative pad.
      emptyCells: number;
      empty: boolean; // no occupied slots
      buy: BankBuySlotsModel;
    };

/** Map the proximity-gated bank snapshot to the render model. `info` is null away
 *  from a banker (both worlds), which yields the 'away' state. Slot order and
 *  indices are preserved verbatim (search/sort is a later phase). */
export function buildBankView(info: BankInfo | null, lookup: BankItemLookup): BankViewModel {
  if (!info) return { kind: 'away' };
  const used = info.slots.length;
  const total = info.capacity;
  const slots: BankSlotModel[] = info.slots.map((slot, slotIndex) => ({
    slotIndex,
    itemId: slot.itemId,
    count: slot.count,
    showCount: slot.count > 1,
    qualityKey: bagQualityKey(lookup(slot.itemId) ?? {}),
  }));
  return {
    kind: 'bank',
    capacity: {
      used,
      total,
      purchasedSlots: info.purchasedSlots,
      bonusSlots: info.bonusSlots,
    },
    slots,
    emptyCells: Math.max(0, total - used),
    empty: slots.length === 0,
    buy: {
      nextCost: info.nextExpansionCost,
      blockSlots: BANK_EXPANSION_SLOTS,
      maxed: info.nextExpansionCost === null,
    },
  };
}

/** What a click on a bank slot does: a whole-stack withdraw, the split-stack
 *  prompt (shift on a multi-count fungible), or nothing (empty cell). The core
 *  never touches copper affordability: that is server-authoritative and the sim
 *  refuses with its own line. */
export type BankSlotAction =
  | { kind: 'withdraw'; slotIndex: number }
  | { kind: 'withdrawPartial'; slotIndex: number; max: number }
  | { kind: 'none' };

/** Decide the slot click. A shift-click on a multi-count stack opens the partial
 *  prompt, EXCEPT on an instanced slot: a per-instance payload (#1165) moves whole
 *  regardless of count (the sim never splits it), so shift falls through to a plain
 *  withdraw there. An undefined slot (empty cell) is a no-op. */
export function bankSlotAction(
  slot: InvSlot | undefined,
  slotIndex: number,
  shift: boolean,
): BankSlotAction {
  if (!slot) return { kind: 'none' };
  if (shift && slot.count > 1 && !slot.instance) {
    return { kind: 'withdrawPartial', slotIndex, max: slot.count };
  }
  return { kind: 'withdraw', slotIndex };
}
