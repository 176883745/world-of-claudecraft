// Pure, host-agnostic celebration plan for crafting's earned moments
// (Professions 2.0 Phase 6): the personal masterwork proc and craft tier-up
// crossings. The buildDeedUnlockPlan shape (deeds_view.ts): the HUD arm stays
// a thin consumer and the batching rules are unit-pinned here. DOM-free and
// i18n-free so tests/craft_celebration_view.test.ts drives it directly.
//
// Cue discipline (Phase 4 grant-hub double-log trap): the grant hubs already
// emit the loot line + cue and the craftResult arm already logs the crafted
// toast, so this plan never re-logs a grant. It allows AT MOST ONE celebration
// sound per drain, shared across masterwork and tier-up. `reducedMotion` gates
// the MOTION flag only, never information: log lines, the banner text, and the
// sound survive it untouched.

import { tierForSkill } from '../sim/professions/wheel';

/** One craft that crossed a tier boundary between two skill snapshots. */
export interface CraftTierUp {
  craftId: string;
  toTier: number;
}

/**
 * Tier crossings between two craft-skill snapshots (tierForSkill buckets).
 * One entry per craft that crossed, carrying the tier it reached (a multi-tier
 * jump reports only the final tier). `prev === null` is the first observation
 * after login/join: it initializes silently and reports NO tier-ups, so a
 * fresh cprof mirror never toasts the player's whole history.
 */
export function computeCraftTierUps(
  prev: Readonly<Record<string, number>> | null,
  next: Readonly<Record<string, number>>,
): CraftTierUp[] {
  if (prev === null) return [];
  const ups: CraftTierUp[] = [];
  for (const craftId in next) {
    const toTier = tierForSkill(next[craftId]);
    if (toTier > tierForSkill(prev[craftId] ?? 0)) ups.push({ craftId, toTier });
  }
  return ups;
}

/** The single banner slot's occupant: masterwork outranks tier-up, and among
 *  tier-ups the LAST crossing wins (the log carries every line). */
export type CraftCelebrationBanner =
  | { kind: 'masterwork'; itemId: string }
  | { kind: 'tierUp'; craftId: string; toTier: number };

export interface CraftCelebrationInput {
  /** The drain's masterwork proc, if any (coalesced upstream to the last). */
  masterwork: { itemId: string } | null;
  tierUps: readonly CraftTierUp[];
  reducedMotion: boolean;
}

export interface CraftCelebrationPlan {
  /** Log the masterwork toast line for this item, null when no proc. */
  masterworkLogItemId: string | null;
  /** One tier-up log line each, in drain order. */
  tierUpLogs: CraftTierUp[];
  /** Coalesced single banner slot, null when the drain held nothing. */
  banner: CraftCelebrationBanner | null;
  /** At most one celebration sound per drain, shared across both kinds. */
  playSound: boolean;
  /** Motion-only flourishes; false under reducedMotion. Never gates the log
   *  lines, the banner text, or the sound (information survives). */
  motion: boolean;
}

/** Plan the HUD reaction to one drain's crafting celebrations. */
export function buildCraftCelebrationPlan(input: CraftCelebrationInput): CraftCelebrationPlan {
  const masterworkLogItemId = input.masterwork?.itemId ?? null;
  const tierUpLogs = [...input.tierUps];
  const banner: CraftCelebrationBanner | null =
    masterworkLogItemId !== null
      ? { kind: 'masterwork', itemId: masterworkLogItemId }
      : tierUpLogs.length > 0
        ? { kind: 'tierUp', ...tierUpLogs[tierUpLogs.length - 1] }
        : null;
  return {
    masterworkLogItemId,
    tierUpLogs,
    banner,
    playSound: banner !== null,
    motion: banner !== null && !input.reducedMotion,
  };
}
