// The Steam achievement mirror map: pins the deed-id to ACH-name table that the
// server-side mirror pushes to Steamworks. ACH names are permanent once shipped,
// so these pins guard the launch set against a bulk regeneration that would
// scramble, drop, or rename an entry.
import { describe, expect, it } from 'vitest';
import { ACHIEVEMENT_MAP, MAX_STEAM_ACHIEVEMENTS } from '../server/steam/achievement_map';
import { DEEDS } from '../src/sim/data';

const ACH_NAME_RE = /^ACH_[A-Z0-9_]+$/;

describe('Steam achievement map', () => {
  it('has exactly the 68 launch entries', () => {
    expect(Object.keys(ACHIEVEMENT_MAP).length).toBe(68);
  });

  it('stays within the App Admin cap', () => {
    expect(MAX_STEAM_ACHIEVEMENTS).toBe(100);
    expect(Object.keys(ACHIEVEMENT_MAP).length).toBeLessThanOrEqual(MAX_STEAM_ACHIEVEMENTS);
  });

  it('gives every entry a well-formed ACH name', () => {
    for (const [deedId, ach] of Object.entries(ACHIEVEMENT_MAP)) {
      expect(ach, deedId).toMatch(ACH_NAME_RE);
    }
  });

  it('assigns a globally unique ACH name to each deed', () => {
    const names = Object.values(ACHIEVEMENT_MAP);
    expect(new Set(names).size).toBe(names.length);
  });

  it('maps only deed ids that exist in DEEDS', () => {
    for (const deedId of Object.keys(ACHIEVEMENT_MAP)) {
      expect(DEEDS[deedId], deedId).toBeDefined();
    }
  });

  it('never registers a deferred or deleted ACH name', () => {
    const names = new Set(Object.values(ACHIEVEMENT_MAP));
    expect(names.has('ACH_NINEFOLD')).toBe(false);
    expect(names.has('ACH_RINGWRIGHT')).toBe(false);
    expect(names.has('ACH_GOLDEN_GOAL')).toBe(false);
  });

  it('marks every mapped hidden deed as hidden in DEEDS', () => {
    const mappedHidden = Object.keys(ACHIEVEMENT_MAP).filter((id) => DEEDS[id]?.hidden === true);
    // The launch map carries hidden deeds (Steam-hidden achievements); pin that
    // each one really is hidden in the catalog so the two never drift apart.
    expect(mappedHidden.length).toBeGreaterThan(0);
    for (const deedId of mappedHidden) {
      expect(DEEDS[deedId].hidden, deedId).toBe(true);
    }
  });

  it('pins load-bearing entries across catalog files', () => {
    expect(ACHIEVEMENT_MAP.prog_first_steps).toBe('ACH_FIRST_STEPS');
    expect(ACHIEVEMENT_MAP.dgn_deepward).toBe('ACH_DEEPWARD');
    expect(ACHIEVEMENT_MAP.pvp_vcup_golden_goal).toBe('ACH_VCUP_GOLDEN_GOAL');
  });
});
