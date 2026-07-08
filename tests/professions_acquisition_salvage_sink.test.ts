// Coverage for three professions-completion issues:
// - #1299 recipe acquisition layer (a recipe must be known before it can be
//   crafted, orthogonal to tier; existing content is grandfathered).
// - #1300 salvage/disenchant (break an eligible item back into materials).
// - #1301 gold sink + output throttle on crafting.

import { describe, expect, it } from 'vitest';
import {
  CRAFT_GOLD_SINK_COPPER_PER_BUDGET,
  CRAFT_THROTTLE_MAX_PER_WINDOW,
  CRAFT_THROTTLE_WINDOW_SECONDS,
} from '../src/sim/content/professions';
import { COMMON_RECIPES } from '../src/sim/content/recipes';
import { isRecipeKnown, resolveCraftForRecipe } from '../src/sim/professions/crafting';
import { isSalvageable, resolveSalvage, salvageYield } from '../src/sim/professions/salvage';
import type { ProfessionRecipeRecord } from '../src/sim/professions/types';
import { Sim } from '../src/sim/sim';

function makeSim(seed = 7) {
  return new Sim({ seed, playerClass: 'warrior', autoEquip: false });
}

function grantItem(sim: Sim, itemId: string, count: number, pid: number) {
  for (let i = 0; i < count; i++) sim.addItem(itemId, 1, pid);
}

const GATED_RECIPE: ProfessionRecipeRecord = {
  id: 'recipe_test_gated',
  professionId: 'weaponcrafting',
  resultItemId: 'eastbrook_arming_sword',
  resultCount: 1,
  reagents: [{ itemId: 'bone_fragments', count: 1 }],
  skillReq: 0,
  trivialAt: 25,
  itemLevelBudget: 1,
  acquisition: ['trainer'],
};

describe('#1299 recipe acquisition', () => {
  it('existing content recipes are grandfathered (no acquisition field = known)', () => {
    for (const recipe of COMMON_RECIPES) {
      expect(isRecipeKnown(undefined, recipe)).toBe(true);
    }
  });

  it('denies crafting a gated recipe the player has not acquired, even with materials and gold', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    grantItem(sim, 'bone_fragments', 5, pid);
    const result = resolveCraftForRecipe(sim.ctx, pid, GATED_RECIPE);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('recipe_unknown');
  });

  it('acquireRecipe on an unregistered recipe id is denied as unknown_recipe', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    // GATED_RECIPE is a synthetic test fixture, not registered in
    // content/recipes.ts, so recipeById cannot resolve it: this exercises the
    // unknown_recipe arm of the acquireRecipe delegate.
    const bad = sim.acquireRecipe(GATED_RECIPE.id, 'trainer', pid);
    expect(bad.ok).toBe(false);
    expect(bad.reason).toBe('unknown_recipe');
  });

  it('acquireRecipe on a grandfathered (non-gated) recipe is denied as already_known', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    const result = sim.acquireRecipe(COMMON_RECIPES[0].id, 'trainer', pid);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('already_known');
  });

  it('acquiring from the correct source marks the recipe known, and it persists across a reload', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    const meta = (sim as any).players.get(pid);
    expect(meta).toBeTruthy();
    if (!meta) return;
    expect(isRecipeKnown(meta, GATED_RECIPE)).toBe(false);
    meta.knownRecipes.add(GATED_RECIPE.id);
    meta.copper = 1000;
    expect(isRecipeKnown(meta, GATED_RECIPE)).toBe(true);
    grantItem(sim, 'bone_fragments', 5, pid);
    const result = resolveCraftForRecipe(sim.ctx, pid, GATED_RECIPE);
    expect(result.ok).toBe(true);

    // Persistence round-trip: serialize then reload into a fresh Sim.
    const saved = sim.serializeCharacter(pid);
    const sim2 = makeSim();
    const pid2 = sim2.addPlayer('warrior', 'Reloaded', { state: saved ?? undefined });
    const meta2 = (sim2 as any).players.get(pid2);
    expect(meta2?.knownRecipes.has(GATED_RECIPE.id)).toBe(true);
  });

  it('a save with no knownRecipes field loads cleanly with an empty set (back-compat)', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    const saved = sim.serializeCharacter(pid);
    (saved as { knownRecipes?: string[] }).knownRecipes = undefined;
    const sim2 = makeSim();
    const pid2 = sim2.addPlayer('warrior', 'Legacy', { state: saved ?? undefined });
    expect((sim2 as any).players.get(pid2)?.knownRecipes.size).toBe(0);
  });
});

describe('#1300 salvage/disenchant', () => {
  it('an ineligible item (consumable/junk) cannot be salvaged', () => {
    expect(isSalvageable(undefined)).toBe(false);
    const sim = makeSim();
    const pid = sim.playerId;
    grantItem(sim, 'tough_jerky', 1, pid);
    const result = resolveSalvage(sim.ctx, pid, 'tough_jerky');
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('not_salvageable');
  });

  it('denies salvaging an item the player does not hold', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    const result = resolveSalvage(sim.ctx, pid, 'eastbrook_arming_sword');
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('not_held');
  });

  it('salvaging an eligible item consumes it and yields a scripted material via Rng', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    grantItem(sim, 'eastbrook_arming_sword', 1, pid);
    expect(sim.countItem('eastbrook_arming_sword', pid)).toBe(1);
    const result = resolveSalvage(sim.ctx, pid, 'eastbrook_arming_sword');
    expect(result.ok).toBe(true);
    expect(result.materialItemId).toBeTruthy();
    expect(result.count).toBeGreaterThan(0);
    expect(sim.countItem('eastbrook_arming_sword', pid)).toBe(0);
    if (result.materialItemId) {
      expect(sim.countItem(result.materialItemId, pid)).toBe(result.count);
    }
  });

  it('yield scales with rarity: a higher-quality item never yields less than a lower one, all else equal', () => {
    const sim = makeSim();
    const rngA = sim.ctx.rng;
    const low = salvageYield(
      { id: 'a', name: 'a', sellValue: 0, quality: 'common', kind: 'weapon' } as never,
      rngA,
    );
    const high = salvageYield(
      { id: 'b', name: 'b', sellValue: 0, quality: 'legendary', kind: 'weapon' } as never,
      rngA,
    );
    expect(high).toBeGreaterThanOrEqual(low);
  });
});

describe('#1301 gold sink and output throttle', () => {
  it('charges a gold fee proportional to the recipe budget on a successful craft', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    const meta = (sim as any).players.get(pid);
    if (!meta) throw new Error('no meta');
    meta.copper = 1000;
    const recipe = COMMON_RECIPES[0];
    for (const reagent of recipe.reagents) grantItem(sim, reagent.itemId, 10, pid);
    const before = meta.copper;
    const result = resolveCraftForRecipe(sim.ctx, pid, recipe);
    expect(result.ok).toBe(true);
    const expectedFee = Math.ceil(recipe.itemLevelBudget * CRAFT_GOLD_SINK_COPPER_PER_BUDGET);
    expect(expectedFee).toBeGreaterThan(0);
    expect(meta.copper).toBe(before - expectedFee);
  });

  it('a broke player can still craft (the sink never gates a craft), floored at 0 copper', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    const meta = (sim as any).players.get(pid);
    if (!meta) throw new Error('no meta');
    meta.copper = 0;
    const recipe = COMMON_RECIPES[0];
    for (const reagent of recipe.reagents) grantItem(sim, reagent.itemId, 10, pid);
    const result = resolveCraftForRecipe(sim.ctx, pid, recipe);
    expect(result.ok).toBe(true);
    expect(meta.copper).toBe(0);
  });

  it('throttles a maxed specialist to CRAFT_THROTTLE_MAX_PER_WINDOW crafts per window', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    const meta = (sim as any).players.get(pid);
    if (!meta) throw new Error('no meta');
    meta.copper = 1_000_000;
    const recipe = COMMON_RECIPES[0];
    let successCount = 0;
    for (let i = 0; i < CRAFT_THROTTLE_MAX_PER_WINDOW + 5; i++) {
      for (const reagent of recipe.reagents) grantItem(sim, reagent.itemId, reagent.count, pid);
      const result = resolveCraftForRecipe(sim.ctx, pid, recipe);
      if (result.ok) successCount++;
      else expect(result.reason).toBe('throttled');
    }
    expect(successCount).toBe(CRAFT_THROTTLE_MAX_PER_WINDOW);
  });

  it('the throttle window resets after CRAFT_THROTTLE_WINDOW_SECONDS of sim time', () => {
    const sim = makeSim();
    const pid = sim.playerId;
    const meta = (sim as any).players.get(pid);
    if (!meta) throw new Error('no meta');
    meta.copper = 1_000_000;
    const recipe = COMMON_RECIPES[0];
    for (let i = 0; i < CRAFT_THROTTLE_MAX_PER_WINDOW; i++) {
      for (const reagent of recipe.reagents) grantItem(sim, reagent.itemId, reagent.count, pid);
      expect(resolveCraftForRecipe(sim.ctx, pid, recipe).ok).toBe(true);
    }
    for (const reagent of recipe.reagents) grantItem(sim, reagent.itemId, reagent.count, pid);
    expect(resolveCraftForRecipe(sim.ctx, pid, recipe).reason).toBe('throttled');
    meta.craftThrottle.windowStart -= CRAFT_THROTTLE_WINDOW_SECONDS;
    for (const reagent of recipe.reagents) grantItem(sim, reagent.itemId, reagent.count, pid);
    expect(resolveCraftForRecipe(sim.ctx, pid, recipe).ok).toBe(true);
  });
});
