// Pure-core pins for the crafting celebration plan (Professions 2.0 Phase 6):
// tier-crossing detection over craft-skill snapshots and the coalesced
// banner / one-sound-per-drain / reduced-motion batching rules the HUD arm
// consumes thinly (the buildDeedUnlockPlan contract shape).

import { describe, expect, it } from 'vitest';
import { TIER_SKILL_STEP } from '../src/sim/professions/wheel';
import { buildCraftCelebrationPlan, computeCraftTierUps } from '../src/ui/craft_celebration_view';

describe('computeCraftTierUps', () => {
  it('reports no tier-ups on first observation (null prev), the silent init', () => {
    expect(computeCraftTierUps(null, { armorcrafting: 4 * TIER_SKILL_STEP })).toEqual([]);
  });

  it('reports nothing when no craft crossed a tier boundary', () => {
    expect(
      computeCraftTierUps(
        { armorcrafting: TIER_SKILL_STEP, cooking: 3 },
        { armorcrafting: 2 * TIER_SKILL_STEP - 1, cooking: 4 },
      ),
    ).toEqual([]);
  });

  it('reports one entry with the reached tier on a single crossing', () => {
    expect(
      computeCraftTierUps(
        { armorcrafting: 2 * TIER_SKILL_STEP - 1 },
        { armorcrafting: 2 * TIER_SKILL_STEP },
      ),
    ).toEqual([{ craftId: 'armorcrafting', toTier: 2 }]);
  });

  it('reports one entry per craft when several crafts cross in one drain', () => {
    expect(
      computeCraftTierUps(
        { armorcrafting: TIER_SKILL_STEP - 1, cooking: 2 * TIER_SKILL_STEP - 1 },
        { armorcrafting: TIER_SKILL_STEP, cooking: 2 * TIER_SKILL_STEP },
      ),
    ).toEqual([
      { craftId: 'armorcrafting', toTier: 1 },
      { craftId: 'cooking', toTier: 2 },
    ]);
  });

  it('collapses a multi-tier jump to a single entry carrying the final tier', () => {
    expect(
      computeCraftTierUps({ armorcrafting: 1 }, { armorcrafting: 3 * TIER_SKILL_STEP }),
    ).toEqual([{ craftId: 'armorcrafting', toTier: 3 }]);
  });

  it('treats a craft key absent from prev as skill 0, so a fresh tier-0 craft is silent', () => {
    expect(computeCraftTierUps({}, { cooking: TIER_SKILL_STEP - 1 })).toEqual([]);
    // ...while a fresh craft that lands straight in tier 1+ still celebrates.
    expect(computeCraftTierUps({}, { cooking: TIER_SKILL_STEP })).toEqual([
      { craftId: 'cooking', toTier: 1 },
    ]);
  });

  it('never reports a downward move (a defensive no-op, skills are monotonic)', () => {
    expect(
      computeCraftTierUps({ armorcrafting: 2 * TIER_SKILL_STEP }, { armorcrafting: 1 }),
    ).toEqual([]);
  });
});

describe('buildCraftCelebrationPlan', () => {
  it('plans nothing for an empty drain: no logs, no banner, no sound, no motion', () => {
    const plan = buildCraftCelebrationPlan({ masterwork: null, tierUps: [], reducedMotion: false });
    expect(plan).toEqual({
      masterworkLogItemId: null,
      tierUpLogs: [],
      banner: null,
      playSound: false,
      motion: false,
    });
  });

  it('plans a masterwork-only drain: log line, masterwork banner, one sound', () => {
    const plan = buildCraftCelebrationPlan({
      masterwork: { itemId: 'iron_sword' },
      tierUps: [],
      reducedMotion: false,
    });
    expect(plan.masterworkLogItemId).toBe('iron_sword');
    expect(plan.banner).toEqual({ kind: 'masterwork', itemId: 'iron_sword' });
    expect(plan.playSound).toBe(true);
    expect(plan.motion).toBe(true);
  });

  it('plans a tier-up-only drain: one log per crossing, banner coalesces to the LAST', () => {
    const plan = buildCraftCelebrationPlan({
      masterwork: null,
      tierUps: [
        { craftId: 'armorcrafting', toTier: 1 },
        { craftId: 'cooking', toTier: 2 },
      ],
      reducedMotion: false,
    });
    expect(plan.tierUpLogs).toEqual([
      { craftId: 'armorcrafting', toTier: 1 },
      { craftId: 'cooking', toTier: 2 },
    ]);
    expect(plan.banner).toEqual({ kind: 'tierUp', craftId: 'cooking', toTier: 2 });
    expect(plan.playSound).toBe(true);
  });

  it('lets masterwork outrank tier-ups for the single banner slot, still ONE sound', () => {
    const plan = buildCraftCelebrationPlan({
      masterwork: { itemId: 'iron_sword' },
      tierUps: [{ craftId: 'cooking', toTier: 2 }],
      reducedMotion: false,
    });
    // Both moments keep their durable log copy; only the banner coalesces.
    expect(plan.masterworkLogItemId).toBe('iron_sword');
    expect(plan.tierUpLogs).toEqual([{ craftId: 'cooking', toTier: 2 }]);
    expect(plan.banner).toEqual({ kind: 'masterwork', itemId: 'iron_sword' });
    expect(plan.playSound).toBe(true);
  });

  it('reducedMotion trims MOTION only: logs, banner, and sound survive untouched', () => {
    const plan = buildCraftCelebrationPlan({
      masterwork: { itemId: 'iron_sword' },
      tierUps: [{ craftId: 'cooking', toTier: 2 }],
      reducedMotion: true,
    });
    expect(plan.motion).toBe(false);
    expect(plan.masterworkLogItemId).toBe('iron_sword');
    expect(plan.tierUpLogs).toHaveLength(1);
    expect(plan.banner).not.toBeNull();
    expect(plan.playSound).toBe(true);
  });

  it('does not mutate or alias the caller tierUps array', () => {
    const tierUps = [{ craftId: 'cooking', toTier: 2 }];
    const plan = buildCraftCelebrationPlan({ masterwork: null, tierUps, reducedMotion: false });
    expect(plan.tierUpLogs).not.toBe(tierUps);
    expect(plan.tierUpLogs).toEqual(tierUps);
  });
});
