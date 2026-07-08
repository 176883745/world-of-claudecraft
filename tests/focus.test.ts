import { describe, expect, it } from 'vitest';
import { ZONES } from '../src/sim/data';
import {
  applyFocusBonus,
  applyFocusTierBonus,
  EMPTY_FOCUS_ALLOCATION,
  FOCUS_POINT_BUDGET,
  isInTownZone,
  POINTS_PER_TIER_BONUS,
  setTownFocus,
} from '../src/sim/professions/focus';

const ZONE1 = ZONES[0];

describe('applyFocusBonus: additive, never lowers the baseline', () => {
  it('returns the baseline unchanged for an unfocused component', () => {
    expect(applyFocusBonus(10, 'hide', EMPTY_FOCUS_ALLOCATION)).toBe(10);
    expect(applyFocusBonus(10, 'hide', { fang: 5 })).toBe(10);
  });

  it('adds a strictly positive bonus for a focused component', () => {
    const bonus = applyFocusBonus(10, 'hide', { hide: 2 });
    expect(bonus).toBeGreaterThan(10);
  });

  it('more focus points on a component only ever increases its result', () => {
    const low = applyFocusBonus(10, 'hide', { hide: 1 });
    const high = applyFocusBonus(10, 'hide', { hide: 5 });
    expect(high).toBeGreaterThan(low);
    expect(low).toBeGreaterThan(10);
  });

  it('never affects a different component, however heavily another is focused', () => {
    const unfocusedWithNoAllocation = applyFocusBonus(10, 'silk', EMPTY_FOCUS_ALLOCATION);
    const unfocusedWithOtherFullyFocused = applyFocusBonus(10, 'silk', {
      hide: FOCUS_POINT_BUDGET,
    });
    expect(unfocusedWithOtherFullyFocused).toBe(unfocusedWithNoAllocation);
  });
});

describe('applyFocusTierBonus: shifts the #1142 harvest tier ladder upward only', () => {
  it('leaves an unfocused component tier unchanged', () => {
    expect(applyFocusTierBonus('common', 'hide', EMPTY_FOCUS_ALLOCATION)).toBe('common');
    expect(applyFocusTierBonus('common', 'hide', { fang: POINTS_PER_TIER_BONUS })).toBe('common');
  });

  it('raises the tier by one step at POINTS_PER_TIER_BONUS points', () => {
    expect(applyFocusTierBonus('common', 'hide', { hide: POINTS_PER_TIER_BONUS })).toBe('uncommon');
  });

  it('a focused component measurably outperforms the same component unfocused, all else equal', () => {
    const unfocused = applyFocusTierBonus('poor', 'hide', EMPTY_FOCUS_ALLOCATION);
    const focused = applyFocusTierBonus('poor', 'hide', { hide: POINTS_PER_TIER_BONUS });
    expect(focused).not.toBe(unfocused);
  });

  it('caps the shift at MAX_FOCUS_TIER_BONUS steps even with the full budget on one component', () => {
    // poor(0) + budget(10)/5 = 2 steps -> uncommon(2), never legendary.
    expect(applyFocusTierBonus('poor', 'hide', { hide: FOCUS_POINT_BUDGET })).toBe('uncommon');
  });

  it('never pushes past the top of the tier ladder', () => {
    expect(applyFocusTierBonus('legendary', 'hide', { hide: FOCUS_POINT_BUDGET })).toBe(
      'legendary',
    );
  });
});

describe('isInTownZone: the town-tag stand-in (zone hub circle)', () => {
  it('is true at the hub center', () => {
    expect(isInTownZone({ x: ZONE1.hub.x, z: ZONE1.hub.z }, ZONE1)).toBe(true);
  });

  it('is false far outside the hub radius', () => {
    expect(isInTownZone({ x: ZONE1.hub.x + ZONE1.hub.radius * 10, z: ZONE1.hub.z }, ZONE1)).toBe(
      false,
    );
  });
});

describe('setTownFocus: gated on town, budget-capped, rejects leave prior state untouched', () => {
  it('denies setting focus while not in town, leaving the previous allocation', () => {
    const previous = { hide: 3 };
    const result = setTownFocus(previous, { fang: 5 }, false);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('not_in_town');
    expect(result.allocation).toEqual(previous);
  });

  it('accepts a valid in-budget allocation while in town', () => {
    const result = setTownFocus({}, { hide: 4, fang: 3 }, true);
    expect(result.ok).toBe(true);
    expect(result.allocation).toEqual({ hide: 4, fang: 3 });
  });

  it('rejects an allocation whose total exceeds FOCUS_POINT_BUDGET, keeping the previous state', () => {
    const previous = { hide: 2 };
    const result = setTownFocus(previous, { hide: FOCUS_POINT_BUDGET + 1 }, true);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('over_budget');
    expect(result.allocation).toEqual(previous);
  });

  it('rejects negative or non-integer points', () => {
    const previous = {};
    expect(setTownFocus(previous, { hide: -1 }, true).ok).toBe(false);
    expect(setTownFocus(previous, { hide: 1.5 }, true).ok).toBe(false);
  });

  it('drops zero-point entries from the resulting allocation', () => {
    const result = setTownFocus({}, { hide: 3, fang: 0 }, true);
    expect(result.ok).toBe(true);
    expect(result.allocation).toEqual({ hide: 3 });
  });
});
