// Heroic loot flair: when a mob dies in a HEROIC dungeon instance, its normal
// epic/rare drops are swapped for a "Heroic" variant (epic -> item level 28,
// rare -> 25, "Heroic X" name), while green/uncommon drops and the existing
// item-level-31 heroic set are untouched.
import { describe, expect, it } from 'vitest';
import { heroicVariantId } from '../src/sim/content/heroic_variants';
import { ITEMS, MOBS } from '../src/sim/data';
import { enterDungeon } from '../src/sim/instances/dungeons';
import { expectedStatBudget, itemLevel, primaryStatSum } from '../src/sim/item_level';
import { Sim } from '../src/sim/sim';
import type { Entity } from '../src/sim/types';
import { itemDisplayName } from '../src/ui/entity_i18n';

type AnySim = Sim & Record<string, any>;
type AnyEntity = Entity & Record<string, any>;

const variants = () => Object.values(ITEMS).filter((i) => i.heroicOf);

describe('heroic loot flair: variant generation', () => {
  it('generates a Heroic variant for base epic/rare drops, budget-exact at ilvl 28/25', () => {
    const all = variants();
    expect(all.length).toBeGreaterThan(0);
    for (const v of all) {
      expect(v.quality === 'epic' || v.quality === 'rare').toBe(true);
      expect(itemLevel(v)).toBe(v.quality === 'epic' ? 28 : 25);
      // stats rescaled exactly to the heroic budget for that ilvl/slot/quality
      expect(primaryStatSum(v)).toBe(expectedStatBudget(v));
    }
  });

  it('composes the display name as "Heroic <base>" (one prefix key, base name localized)', () => {
    const v = ITEMS[heroicVariantId('deathlord_warplate')];
    expect(v).toBeDefined();
    expect(itemDisplayName(v)).toBe(`Heroic ${itemDisplayName(ITEMS.deathlord_warplate)}`);
  });

  it('leaves green/uncommon drops without a variant', () => {
    // boneplate_vest is an uncommon Korzul drop: no Heroic upgrade.
    expect(ITEMS[heroicVariantId('boneplate_vest')]).toBeUndefined();
  });

  it('does not upgrade a raid epic (its variant would be a downgrade, so the swap skips it)', () => {
    const base = ITEMS.crownforged_dreadhelm; // Nythraxis raid epic, item level 29
    expect(itemLevel(base)).toBe(29);
    const v = ITEMS[heroicVariantId('crownforged_dreadhelm')];
    if (v) expect(itemLevel(v)! < itemLevel(base)!).toBe(true); // 28 < 29 -> swap guard skips
  });
});

describe('heroic loot flair: the drop swap in a heroic instance', () => {
  function killKorzul(difficulty: 'normal' | 'heroic'): any[] {
    const sim = new Sim({ seed: 7, playerClass: 'warrior', noPlayer: true }) as AnySim;
    const pid = sim.addPlayer('warrior', 'Solo');
    if (difficulty === 'heroic') sim.setDungeonDifficulty('heroic', pid);
    enterDungeon(sim.ctx, 'gravewyrm_sanctum', pid);
    const inst = (sim.instances as any[]).find(
      (i) => i.dungeonId === 'gravewyrm_sanctum' && i.difficulty === difficulty && i.partyKey !== null,
    );
    const korzul = inst.mobIds
      .map((id: number) => sim.entities.get(id))
      .find((e: AnyEntity | undefined) => e?.templateId === 'korzul_the_gravewyrm') as AnyEntity;
    const p = sim.entities.get(pid) as AnyEntity;
    p.pos = { x: korzul.pos.x + 1, y: korzul.pos.y, z: korzul.pos.z };
    p.prevPos = { ...p.pos };
    sim.rebucket(p);
    (sim as any).dealDamage(p, korzul, korzul.hp + 100, false, 'physical', null, 'hit');
    return (korzul.loot?.items ?? []) as any[];
  }

  it('never leaves a swappable base epic un-upgraded on a heroic kill', () => {
    const items = killKorzul('heroic');
    for (const s of items) {
      const def = ITEMS[s.itemId];
      if (!def || def.heroicOf) continue; // variants are already upgraded
      // any base epic that HAS a variant must have been swapped, not dropped raw
      const variant = ITEMS[heroicVariantId(s.itemId)];
      const isUpgrade = variant && (itemLevel(variant) ?? 0) > (itemLevel(def) ?? 0);
      expect(isUpgrade, `un-swapped base epic leaked: ${s.itemId}`).toBeFalsy();
    }
  });

  it('drops base (un-swapped) epics on a normal kill', () => {
    const items = killKorzul('normal');
    // no heroic variant ids appear on a normal difficulty corpse
    expect(items.some((s) => ITEMS[s.itemId]?.heroicOf)).toBe(false);
  });
});
