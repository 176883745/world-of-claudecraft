import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/content/classes';
import { clearHotbarSlot, placeAbilityOnSlot, syncHotbarSlotMap } from '../src/ui/hotbar';

describe('hotbar ability placement', () => {
  it('places a spellbook ability onto the target action slot', () => {
    const slots = ['fireball', 'frost_armor', 'arcane_intellect', null];

    const next = placeAbilityOnSlot(slots, 'polymorph', 1);

    expect(next).toEqual(['fireball', 'polymorph', 'arcane_intellect', null]);
    expect(slots).toEqual(['fireball', 'frost_armor', 'arcane_intellect', null]);
  });

  it('swaps instead of duplicating when the spellbook ability is already on the bar', () => {
    const slots = ['fireball', 'frost_armor', 'arcane_intellect', null];

    const next = placeAbilityOnSlot(slots, 'arcane_intellect', 0);

    expect(next).toEqual(['arcane_intellect', 'frost_armor', 'fireball', null]);
  });

  it('places the mage overflow spell onto a full non-Attack action bar', () => {
    const barSlots = 11;
    const mageAbilities = CLASSES.mage.abilities;
    const slots = mageAbilities.slice(0, barSlots);
    const targetIndex = 4;
    const displacedAbility = slots[targetIndex];

    expect(slots).toHaveLength(barSlots);
    expect(mageAbilities[barSlots]).toBe('ice_barrier');
    expect(slots).not.toContain('ice_barrier');

    const next = placeAbilityOnSlot(slots, 'ice_barrier', targetIndex);
    const occupied = next.filter((id) => id !== null);

    expect(next[targetIndex]).toBe('ice_barrier');
    expect(next).not.toContain(displacedAbility);
    expect(occupied).toHaveLength(barSlots);
    expect(new Set(occupied).size).toBe(occupied.length);
    expect(slots).toEqual(mageAbilities.slice(0, barSlots));
  });
});

describe('hotbar slot clearing', () => {
  it('clears an occupied slot', () => {
    const slotMap = ['fireball', 'frostbolt', null];

    expect(clearHotbarSlot(slotMap, 1)).toEqual(['fireball', null, null]);
  });

  it('leaves an empty slot stable', () => {
    const slotMap = ['fireball', null, 'blink'];

    expect(clearHotbarSlot(slotMap, 1)).toEqual(['fireball', null, 'blink']);
  });

  it('does not mutate the input array', () => {
    const slotMap = ['fireball', 'frostbolt', null];

    clearHotbarSlot(slotMap, 1);

    expect(slotMap).toEqual(['fireball', 'frostbolt', null]);
  });

  it('ignores out-of-range slots', () => {
    const slotMap = ['fireball', 'frostbolt', null];

    expect(clearHotbarSlot(slotMap, -1)).toEqual(slotMap);
    expect(clearHotbarSlot(slotMap, 3)).toEqual(slotMap);
  });
});

describe('hotbar slot sync', () => {
  it('preserves a missing already-known ability as a cleared slot', () => {
    const slots = ['fireball', null, 'blink'];

    expect(syncHotbarSlotMap(slots, ['fireball', 'frostbolt', 'blink'], new Set())).toEqual(slots);
  });

  it('places a newly learned ability into the first empty slot', () => {
    const slots = ['fireball', null, 'blink'];

    expect(syncHotbarSlotMap(slots, ['fireball', 'frostbolt', 'blink'], new Set(['frostbolt']))).toEqual([
      'fireball',
      'frostbolt',
      'blink',
    ]);
  });

  it('drops abilities that are no longer known', () => {
    const slots = ['fireball', 'frostbolt', 'blink'];

    expect(syncHotbarSlotMap(slots, ['fireball', 'blink'], new Set())).toEqual(['fireball', null, 'blink']);
  });
});
