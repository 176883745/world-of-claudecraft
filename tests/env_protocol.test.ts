import { describe, expect, it } from 'vitest';
import { NUM_ACTIONS, encodeObs, obsSize } from '../src/sim/obs';
import { Sim } from '../src/sim/sim';
import { ALL_CLASSES } from '../src/sim/types';
import { MAX_INPUT_LINE_LENGTH, validateAction, validatePlayerClass } from '../headless/protocol';

describe('headless environment protocol validation', () => {
  it('accepts only integer action ids from the declared action space', () => {
    expect(validateAction(0)).toBe(0);
    expect(validateAction(NUM_ACTIONS - 1)).toBe(NUM_ACTIONS - 1);
    expect(validateAction(-1)).toBeNull();
    expect(validateAction(NUM_ACTIONS)).toBeNull();
    expect(validateAction(1.5)).toBeNull();
    expect(validateAction('1')).toBeNull();
    expect(validateAction(Number.NaN)).toBeNull();
  });

  it('accepts every declared player class and rejects anything else', () => {
    // all 9 classes are valid env inputs, not just warrior/mage
    for (const cls of ALL_CLASSES) {
      expect(validatePlayerClass(cls)).toBe(cls);
    }
    expect(ALL_CLASSES.length).toBe(9);
    expect(validatePlayerClass('warlock')).toBe('warlock');
    expect(validatePlayerClass('necromancer')).toBeNull();
    expect(validatePlayerClass('')).toBeNull();
    expect(validatePlayerClass(undefined)).toBeNull();
    expect(validatePlayerClass(0)).toBeNull();
    expect(validatePlayerClass('Warrior')).toBeNull(); // case-sensitive
  });

  it('builds a valid observation for a non-warrior/mage class reset', () => {
    // the env reset for a widened class must produce the full-size obs vector
    for (const cls of ['druid', 'rogue', 'warlock'] as const) {
      const sim = new Sim({ seed: 7, playerClass: cls, autoEquip: true });
      const obs = encodeObs(sim);
      expect(obs).toHaveLength(obsSize());
      expect(obs.every((v) => Number.isFinite(v))).toBe(true);
    }
  });

  it('keeps the stdin line cap at one mebibyte', () => {
    expect(MAX_INPUT_LINE_LENGTH).toBe(1024 * 1024);
  });
});
