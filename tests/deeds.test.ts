// Book of Deeds evaluator behavior: per-trigger grants with negative cases,
// the meta fixpoint, Fiesta standardization safety, retro-on-join credit,
// milestone unification, persistence round-trips, and determinism.
import { describe, expect, it } from 'vitest';
import { emptyAllocation } from '../src/sim/content/talents';
import { DEED_ORDER, DEEDS, ITEMS } from '../src/sim/data';
import {
  bumpDeedStat,
  evaluateDeedsFor,
  grantDeed,
  markItemDiscovered,
  markVisited,
  restoreDeedStats,
} from '../src/sim/deeds';
import { type CharacterState, Sim } from '../src/sim/sim';
import * as duelMod from '../src/sim/social/duel';
import { MAX_LEVEL, MILESTONES, type SimEvent } from '../src/sim/types';

function makeSim(seed = 42): Sim {
  return new Sim({ seed, playerClass: 'warrior', autoEquip: false });
}

function primary(sim: Sim) {
  const meta = sim.players.get(sim.playerId)!;
  const e = sim.entities.get(sim.playerId)!;
  return { meta, e };
}

function deedEvents(evs: SimEvent[]): Extract<SimEvent, { type: 'deedUnlocked' }>[] {
  return evs.filter((ev): ev is Extract<SimEvent, { type: 'deedUnlocked' }> => {
    return ev.type === 'deedUnlocked';
  });
}

describe('trigger kinds grant once, with negatives', () => {
  it('level: threshold minus one does not grant; the grant fires exactly once', () => {
    const sim = makeSim();
    const { meta, e } = primary(sim);
    e.level = 4;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('prog_finding_your_feet')).toBe(false);
    expect(meta.deedsEarned.has('prog_first_steps')).toBe(true); // level 4 >= 2

    e.level = 5;
    sim.ctx.markDeedsDirty(meta.entityId);
    const evs = sim.tick();
    expect(meta.deedsEarned.has('prog_finding_your_feet')).toBe(true);
    expect(deedEvents(evs).filter((ev) => ev.deedId === 'prog_finding_your_feet').length).toBe(1);

    // Already earned: never re-fires.
    sim.ctx.markDeedsDirty(meta.entityId);
    const evs2 = sim.tick();
    expect(deedEvents(evs2).filter((ev) => ev.deedId === 'prog_finding_your_feet').length).toBe(0);
  });

  it('stat: the lifetime counter grants at the threshold, not below it', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    sim.ctx.bumpDeedStat(meta, 'duelsWon', 0);
    sim.tick();
    expect(meta.deedsEarned.has('pvp_duel_first_win')).toBe(false);
    sim.ctx.bumpDeedStat(meta, 'duelsWon', 1);
    sim.tick();
    expect(meta.deedsEarned.has('pvp_duel_first_win')).toBe(true);
    expect(meta.deedStats.counters.duelsWon).toBe(1);
  });

  it('visits with count: partial coverage does not grant', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    sim.ctx.markVisited(meta, 'npc:bursar_fernando');
    sim.ctx.markVisited(meta, 'npc:bursar_petra_vell');
    sim.tick();
    expect(meta.deedsEarned.has('hid_gilded_tour')).toBe(false);
    expect(meta.deedsEarned.has('soc_meet_bursar')).toBe(true); // single-mark visit deed
    sim.ctx.markVisited(meta, 'npc:bursar_aldous_crane');
    sim.tick();
    expect(meta.deedsEarned.has('hid_gilded_tour')).toBe(true);
  });

  it('collectItems: quality marks and the item set land through the discovery ledger', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    sim.ctx.markItemDiscovered(meta, 'glimmerfin_koi');
    sim.tick();
    expect(meta.deedsEarned.has('col_glimmerfin')).toBe(true);
    // Effective-quality mark: an instanced rolled quality beats the def.
    sim.ctx.markItemDiscovered(meta, 'raw_mirror_trout', 'rare');
    sim.tick();
    expect(meta.deedsEarned.has('col_first_rare')).toBe(true);
    expect(meta.deedsEarned.has('col_first_epic')).toBe(false);
  });

  it('dungeonClears: a normal clear never satisfies the heroic deed', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    meta.deedStats.dungeonClears.hollow_crypt = 1;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('dgn_hollow_crypt')).toBe(true);
    expect(meta.deedsEarned.has('dgn_hollow_crypt_heroic')).toBe(false);
    meta.deedStats.dungeonClears['hollow_crypt:heroic'] = 1;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('dgn_hollow_crypt_heroic')).toBe(true);
  });

  it('delveClears: the all-delves total sums every key; the per-delve heroic tier filters', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    meta.delveClears['collapsed_reliquary:normal'] = 1;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('dlv_reliquary')).toBe(true);
    expect(meta.deedsEarned.has('dlv_reliquary_heroic')).toBe(false);
    meta.delveClears['collapsed_reliquary:heroic'] = 24;
    meta.delveClears['drowned_litany:normal'] = 25;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('dlv_reliquary_heroic')).toBe(true);
    expect(meta.deedsEarned.has('dlv_clears_50')).toBe(true); // 1 + 24 + 25
  });

  it('arenaRating: a one-way unlock survives the rating falling back', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    meta.arenaRating = 1599;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('pvp_arena_1v1_1600')).toBe(false);
    meta.arenaRating = 1600;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('pvp_arena_1v1_1600')).toBe(true);
    meta.arenaRating = 100;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('pvp_arena_1v1_1600')).toBe(true);
  });

  it('manual deeds are never satisfied by the generic evaluator', () => {
    const sim = makeSim();
    const { meta, e } = primary(sim);
    e.level = MAX_LEVEL;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    for (const id of ['cmb_giantslayer', 'hid_fall_death', 'dgn_morthen_flawless']) {
      expect(meta.deedsEarned.has(id), id).toBe(false);
      expect(DEEDS[id].trigger.kind).toBe('manual');
    }
    // The explicit site path grants them, idempotently.
    expect(sim.ctx.grantDeed(meta, 'hid_fall_death')).toBe(true);
    expect(sim.ctx.grantDeed(meta, 'hid_fall_death')).toBe(false);
    expect(meta.deedsEarned.has('hid_fall_death')).toBe(true);
  });
});

describe('grant path', () => {
  it('renown accumulates per grant; 0-renown deeds add nothing', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    const before = meta.renown;
    grantDeed(sim.ctx, meta, 'col_glimmerfin'); // renown 0
    expect(meta.renown).toBe(before);
    grantDeed(sim.ctx, meta, 'soc_meet_bursar'); // renown 5
    expect(meta.renown).toBe(before + 5);
    // Idempotent: a second grant never double-counts.
    grantDeed(sim.ctx, meta, 'soc_meet_bursar');
    expect(meta.renown).toBe(before + 5);
  });

  it('the meta fixpoint resolves chained deeds within a single pass', () => {
    const sim = makeSim();
    const { meta, e } = primary(sim);
    for (const zone of ['eastbrook_vale', 'mirefen_marsh', 'thornpeak_heights']) {
      const wayfarer =
        DEEDS[
          zone === 'eastbrook_vale'
            ? 'exp_vale_wayfarer'
            : zone === 'mirefen_marsh'
              ? 'exp_marsh_wayfarer'
              : 'exp_peaks_wayfarer'
        ];
      if (wayfarer.trigger.kind !== 'visits') throw new Error('fixture drift');
      for (const mark of wayfarer.trigger.markIds) markVisited(sim.ctx, meta, mark);
    }
    evaluateDeedsFor(sim.ctx, meta, e, false);
    // The three wayfarers AND the meta over them land in the same pass.
    expect(meta.deedsEarned.has('exp_vale_wayfarer')).toBe(true);
    expect(meta.deedsEarned.has('exp_marsh_wayfarer')).toBe(true);
    expect(meta.deedsEarned.has('exp_peaks_wayfarer')).toBe(true);
    expect(meta.deedsEarned.has('exp_world_traveler')).toBe(true);
    expect(meta.deedsEarned.has('exp_long_road_north')).toBe(true);
  });

  it('a grant from a bespoke site resolves dependent metas at the tick tail', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    for (const id of [
      'dgn_hollow_crypt_heroic',
      'dgn_sunken_bastion_heroic',
      'dgn_drowned_temple_heroic',
      'dgn_gravewyrm_sanctum_heroic',
      'dgn_nythraxis_heroic',
      'dlv_reliquary_heroic',
    ]) {
      grantDeed(sim.ctx, meta, id);
    }
    sim.tick();
    expect(meta.deedsEarned.has('dgn_deepward')).toBe(false);
    grantDeed(sim.ctx, meta, 'dlv_litany_heroic'); // the seventh requirement
    sim.tick();
    expect(meta.deedsEarned.has('dgn_deepward')).toBe(true);
  });
});

describe('Fiesta standardization safety', () => {
  it('a standardized fighter never satisfies level deeds; evaluation resumes after restore', () => {
    const sim = makeSim();
    const { meta, e } = primary(sim);
    // Seated in a Fiesta bout: the character is standardized to the cap.
    meta.fiestaRestore = { level: 3, xp: 0, talents: emptyAllocation() };
    e.level = MAX_LEVEL;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('prog_level_cap')).toBe(false);
    // Bout over: the restore site puts the real level back and re-marks dirty.
    e.level = 3;
    meta.fiestaRestore = null;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('prog_level_cap')).toBe(false);
    expect(meta.deedsEarned.has('prog_first_steps')).toBe(true); // the real level still counts
  });
});

describe('retro on join', () => {
  function veteranState(): CharacterState {
    return {
      level: 12,
      xp: 0,
      lifetimeXp: 260000,
      copper: 0,
      hp: 100,
      resource: 0,
      pos: { x: 2, z: -2 },
      facing: 0,
      equipment: {},
      inventory: [{ itemId: 'glimmerfin_koi', count: 1 }],
      questLog: [],
      questsDone: ['q_the_codfather'],
      arena1v1Rating: 1650,
      delveClears: { 'collapsed_reliquary:normal': 2 },
      craftSkills: { cooking: 3 },
      gatheringProficiency: { mining: 1 },
    };
  }

  it('predicates over persisted state grant with retro: true; counters do not', () => {
    const sim = makeSim();
    const pid = sim.addPlayer('warrior', 'Returning', { state: veteranState() });
    const meta = sim.players.get(pid)!;
    // State predicates back-credit immediately on join.
    for (const id of [
      'prog_first_steps',
      'prog_double_digits', // level 12
      'prog_veteran', // lifetimeXp 260k
      'hid_codfather', // questsDone
      'dlv_reliquary', // persisted delve clears
      'pvp_arena_1v1_1600', // persisted rating
      'prog_first_craft', // retro fallback: craft skill only comes from crafts
      'exp_first_ore', // gathering proficiency
      'prog_first_harvest',
      'col_glimmerfin', // seeded from held items
    ]) {
      expect(meta.deedsEarned.has(id), id).toBe(true);
    }
    // Lifetime counters start at zero: no counter deed retro-grants.
    expect(meta.deedsEarned.has('cmb_first_blood')).toBe(false);
    expect(meta.deedStats.counters.kills).toBe(0);
    // The join events drain with the next tick, retro-flagged, to this player.
    const evs = deedEvents(sim.tick());
    const veteranEv = evs.find((ev) => ev.deedId === 'prog_veteran');
    expect(veteranEv?.retro).toBe(true);
    expect(veteranEv?.pid).toBe(pid);
  });

  it('the retro pass is a pure function of the loaded state and the catalog', () => {
    const a = new Sim({ seed: 7, playerClass: 'mage' });
    const b = new Sim({ seed: 7, playerClass: 'mage' });
    const pa = a.addPlayer('warrior', 'Same', { state: veteranState() });
    const pb = b.addPlayer('warrior', 'Same', { state: veteranState() });
    expect([...a.players.get(pa)!.deedsEarned.keys()].sort()).toEqual(
      [...b.players.get(pb)!.deedsEarned.keys()].sort(),
    );
  });
});

describe('milestone unification', () => {
  it('a legacy save with unlockedMilestones maps onto the prog_ deeds at load', () => {
    const sim = makeSim();
    // lifetimeXp is deliberately BELOW the veteran threshold so only the
    // legacy-set union (never the retro lifetimeXp predicate) can be the
    // source of the grant; deleting the union must turn this red.
    const pid = sim.addPlayer('warrior', 'Legacy', {
      state: {
        ...{
          level: 20,
          xp: 0,
          copper: 0,
          hp: 100,
          resource: 0,
          pos: { x: 2, z: -2 },
          facing: 0,
          equipment: {},
          inventory: [],
          questLog: [],
          questsDone: [],
        },
        lifetimeXp: 100000,
        unlockedMilestones: ['veteran'],
      },
    });
    const meta = sim.players.get(pid)!;
    // The union's signature: earned with the unknown-day stamp, silently (no
    // deedUnlocked event for it; the character already had the milestone),
    // with the renown recompute counting it exactly once.
    expect(meta.deedsEarned.get('prog_veteran')).toBe('');
    expect(meta.unlockedMilestones.has('veteran')).toBe(true);
    let recomputed = 0;
    for (const id of meta.deedsEarned.keys()) recomputed += DEEDS[id].renown;
    expect(meta.renown).toBe(recomputed);
    const evs = deedEvents(sim.tick());
    expect(evs.some((ev) => ev.deedId === 'prog_veteran')).toBe(false);
  });

  it('a new milestone grant dual-writes the legacy set and both persist', () => {
    const sim = makeSim();
    sim.setPlayerLevel(MAX_LEVEL);
    sim.grantXp(MILESTONES[0].lifetimeXp + 1);
    sim.tick();
    const { meta } = primary(sim);
    expect(meta.deedsEarned.has('prog_veteran')).toBe(true);
    expect(meta.unlockedMilestones.has('veteran')).toBe(true);
    const state = sim.serializeCharacter(sim.playerId)!;
    expect(state.deeds?.prog_veteran).toBeDefined();
    expect(state.unlockedMilestones).toContain('veteran');
  });

  it('renown is recomputed from the earned set on load, ignoring the saved number', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    grantDeed(sim.ctx, meta, 'soc_meet_bursar'); // 5 renown
    const state = sim.serializeCharacter(sim.playerId)!;
    expect(state.renown).toBe(5);
    const tampered = { ...state, renown: 9999 };
    const sim2 = makeSim();
    const pid = sim2.addPlayer('warrior', 'Reload', { state: tampered });
    expect(sim2.players.get(pid)!.renown).toBe(5);
  });
});

describe('persistence', () => {
  it('round-trips every new field', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    bumpDeedStat(sim.ctx, meta, 'kills', 3);
    bumpDeedStat(sim.ctx, meta, 'lootCopper', 12345);
    markVisited(sim.ctx, meta, 'poi:eastbrook_vale:Eastbrook');
    markItemDiscovered(sim.ctx, meta, 'glimmerfin_koi');
    meta.deedStats.dungeonClears['hollow_crypt:heroic'] = 2;
    meta.activeTitle = 'prog_veteran';
    sim.tick();
    const state = sim.serializeCharacter(sim.playerId)!;
    const sim2 = makeSim();
    const pid = sim2.addPlayer('warrior', 'Reload', { state });
    const m2 = sim2.players.get(pid)!;
    expect(m2.deedStats.counters.kills).toBe(3);
    expect(m2.deedStats.counters.lootCopper).toBe(12345);
    expect(m2.deedStats.visited.has('poi:eastbrook_vale:Eastbrook')).toBe(true);
    expect(m2.deedStats.itemsDiscovered.has('glimmerfin_koi')).toBe(true);
    expect(m2.deedStats.dungeonClears['hollow_crypt:heroic']).toBe(2);
    expect(m2.activeTitle).toBe('prog_veteran');
    expect([...m2.deedsEarned.keys()].sort()).toEqual([...meta.deedsEarned.keys()].sort());
    expect(m2.renown).toBe(meta.renown);
  });

  it('a pre-deed save loads clean and serializes without the new keys until the system engages', () => {
    const bare: CharacterState = {
      level: 1,
      xp: 0,
      copper: 0,
      hp: 30,
      resource: 0,
      pos: { x: 2, z: -2 },
      facing: 0,
      equipment: {},
      inventory: [],
      questLog: [],
      questsDone: [],
    };
    const sim = makeSim();
    const pid = sim.addPlayer('warrior', 'Bare', { state: bare });
    const meta = sim.players.get(pid)!;
    expect(meta.deedsEarned.size).toBe(0);
    expect(meta.renown).toBe(0);
    const state = sim.serializeCharacter(pid)!;
    expect(state.deeds).toBeUndefined();
    expect(state.deedStats).toBeUndefined();
    expect(state.activeTitle).toBeUndefined();
    expect(state.renown).toBeUndefined();
  });

  it('a fresh character seeds the discovery ledger from its starter kit deterministically', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    // The starter weapon/chest (and rations, when the class carries them) are
    // possessions, so they are discovered from tick zero.
    expect(meta.deedStats.itemsDiscovered.size).toBeGreaterThan(0);
    const state = sim.serializeCharacter(sim.playerId)!;
    expect(state.deedStats?.itemsDiscovered?.length).toBe(meta.deedStats.itemsDiscovered.size);
  });

  it('the discovery ledger rejects ids that are not real items', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    const before = meta.deedStats.itemsDiscovered.size;
    markItemDiscovered(sim.ctx, meta, 'no_such_item_id');
    expect(meta.deedStats.itemsDiscovered.size).toBe(before);
  });

  it('every visited mark a live sim writes stays inside the authored namespaces', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    for (let i = 0; i < 25; i++) sim.tick(); // let the 1 Hz proximity sweep run
    for (const mark of meta.deedStats.visited) {
      expect(mark).toMatch(/^(poi|gather|fish|npc|slain|quality|fiesta|dungeon|witness):/);
    }
    // The spawn-square sweep marked the hub POI (bounded, authored input).
    expect(meta.deedStats.visited.has('poi:eastbrook_vale:Eastbrook')).toBe(true);
  });
});

describe('determinism', () => {
  it('two sims with the same seed and script produce identical earned sets and event streams', () => {
    const run = () => {
      const sim = makeSim(1234);
      const { meta } = primary(sim);
      const events: SimEvent[] = [];
      sim.setPlayerLevel(10);
      bumpDeedStat(sim.ctx, meta, 'kills', 1);
      events.push(...sim.tick());
      markVisited(sim.ctx, meta, 'npc:bursar_fernando');
      events.push(...sim.tick());
      return {
        earned: [...meta.deedsEarned.keys()],
        deedEvents: deedEvents(events).map((ev) => `${ev.deedId}:${ev.retro ?? false}`),
      };
    };
    const a = run();
    const b = run();
    expect(a.earned).toEqual(b.earned);
    expect(a.deedEvents).toEqual(b.deedEvents);
    expect(a.deedEvents.length).toBeGreaterThan(0);
  });

  it('the evaluator draws zero rng', () => {
    const sim = makeSim();
    const { meta, e } = primary(sim);
    e.level = MAX_LEVEL;
    meta.lifetimeXp = 6000000;
    let draws = 0;
    // The parity harness's observer seam: pure bookkeeping, no behavior change.
    sim.rng.setObserver(() => draws++);
    evaluateDeedsFor(sim.ctx, meta, e, false);
    sim.rng.setObserver(null);
    expect(meta.deedsEarned.has('prog_eternal')).toBe(true);
    expect(draws).toBe(0);
  });
});

describe('craftSkill triggers', () => {
  it('the single-craft arm grants at 75, not at 74', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    meta.craftSkills.cooking = 74;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('prog_craft_specialist')).toBe(false);
    meta.craftSkills.cooking = 75;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('prog_craft_specialist')).toBe(true);
  });

  it('the breadth arm needs 25 skill in five crafts, not four', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    for (const craft of ['cooking', 'alchemy', 'tailoring', 'engineering']) {
      meta.craftSkills[craft] = 25;
    }
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('prog_around_the_ring')).toBe(false);
    meta.craftSkills.leatherworking = 25;
    sim.ctx.markDeedsDirty(meta.entityId);
    sim.tick();
    expect(meta.deedsEarned.has('prog_around_the_ring')).toBe(true);
  });
});

describe('meter triggers (negative then positive per resolver)', () => {
  it('prestigeRank, talentPoints proxies, and the persisted-record meters all gate at their thresholds', () => {
    const sim = makeSim();
    const { meta } = primary(sim);
    const cases: {
      deedId: string;
      below: () => void;
      at: () => void;
    }[] = [
      {
        deedId: 'prog_prestige',
        below: () => {
          meta.prestigeRank = 0;
        },
        at: () => {
          meta.prestigeRank = 1;
        },
      },
      {
        deedId: 'pvp_vcup_wins_10',
        below: () => {
          meta.vcupWins = 9;
        },
        at: () => {
          meta.vcupWins = 10;
        },
      },
      {
        deedId: 'pvp_vcup_guild_win',
        below: () => {
          meta.vcupGuildWins = 0;
        },
        at: () => {
          meta.vcupGuildWins = 1;
        },
      },
      {
        deedId: 'soc_civic_duty',
        below: () => {
          meta.townFocus = {};
        },
        at: () => {
          meta.townFocus = { forge: 1 };
        },
      },
      {
        deedId: 'dlv_lore_journal',
        below: () => {
          meta.delveLoreUnlocked = new Set(['a', 'b', 'c', 'd']);
        },
        at: () => {
          meta.delveLoreUnlocked = new Set(['a', 'b', 'c', 'd', 'e']);
        },
      },
      {
        deedId: 'dlv_companion_max',
        below: () => {
          meta.companionUpgrades = { companion_tessa: 2 };
        },
        at: () => {
          meta.companionUpgrades = { companion_tessa: 3 };
        },
      },
      {
        deedId: 'soc_room_for_more',
        below: () => {
          meta.bank.purchasedSlots = 5;
        },
        at: () => {
          meta.bank.purchasedSlots = 6;
        },
      },
      {
        deedId: 'pvp_arena_first_win',
        below: () => {
          meta.arenaWins = 0;
          meta.arena2v2Wins = 0;
        },
        at: () => {
          meta.arena2v2Wins = 1; // either bracket counts
        },
      },
    ];
    for (const c of cases) {
      c.below();
      sim.ctx.markDeedsDirty(meta.entityId);
      sim.tick();
      expect(meta.deedsEarned.has(c.deedId), `${c.deedId} below threshold`).toBe(false);
      c.at();
      sim.ctx.markDeedsDirty(meta.entityId);
      sim.tick();
      expect(meta.deedsEarned.has(c.deedId), `${c.deedId} at threshold`).toBe(true);
    }
  });

  it('the discovery-count meters count the set and its poor-quality slice', () => {
    const sim = makeSim();
    const pid = sim.addPlayer('warrior', 'Counter', {
      state: {
        level: 1,
        xp: 0,
        copper: 0,
        hp: 30,
        resource: 0,
        pos: { x: 2, z: -2 },
        facing: 0,
        equipment: {},
        inventory: [],
        questLog: [],
        questsDone: [],
      },
    });
    const meta = sim.players.get(pid)!;
    // col_junk_drawer needs TEN DISTINCT poor-quality discoveries: nine stay short.
    const junk = Object.keys(ITEMS)
      .filter((id) => ITEMS[id].quality === 'poor')
      .slice(0, 10);
    expect(junk.length).toBe(10);
    for (const id of junk.slice(0, 9)) markItemDiscovered(sim.ctx, meta, id);
    sim.tick();
    expect(meta.deedsEarned.has('col_junk_drawer')).toBe(false);
    markItemDiscovered(sim.ctx, meta, junk[9]);
    sim.tick();
    expect(meta.deedsEarned.has('col_junk_drawer')).toBe(true);
    // col_discovery_25 counts the whole ledger: top it up to 24 then 25.
    const commons = Object.keys(ITEMS)
      .filter((id) => ITEMS[id].quality !== 'poor')
      .slice(0, 15);
    for (const id of commons.slice(0, 24 - meta.deedStats.itemsDiscovered.size)) {
      markItemDiscovered(sim.ctx, meta, id);
    }
    sim.tick();
    expect(meta.deedStats.itemsDiscovered.size).toBe(24);
    expect(meta.deedsEarned.has('col_discovery_25')).toBe(false);
    markItemDiscovered(sim.ctx, meta, commons[14]);
    sim.tick();
    expect(meta.deedsEarned.has('col_discovery_25')).toBe(true);
  });
});

describe('flag triggers (one negative and one positive per predicate)', () => {
  it('talent, guild, equipment, skin, heroic-circuit, companion, and era flags all gate correctly', () => {
    const sim = makeSim();
    const { meta, e } = primary(sim);
    const check = (deedId: string, expected: boolean, label: string) => {
      sim.ctx.markDeedsDirty(meta.entityId);
      sim.tick();
      expect(meta.deedsEarned.has(deedId), label).toBe(expected);
    };
    // talentSpecChosen
    check('prog_specialized', false, 'no spec chosen yet');
    meta.talents.spec = 'arms';
    check('prog_specialized', true, 'spec chosen');
    // talentCapstone: a non-capstone rank does nothing; a pointsGate-8 node grants
    meta.talents.ranks = { war_toughness: 1 };
    check('prog_deep_roots', false, 'non-capstone rank');
    meta.talents.ranks = { war_berserker_rage: 1 };
    check('prog_deep_roots', true, 'capstone rank');
    // guildMember (server-stamped entity field)
    check('soc_guild_joined', false, 'guildless');
    sim.setPlayerGuild(meta.entityId, 'The Levy');
    check('soc_guild_joined', true, 'guild stamped');
    // allEquipSlotsFilled: ten of eleven is not enough
    meta.equipment = {
      mainhand: 'worn_sword',
      helmet: 'worn_sword',
      neck: 'worn_sword',
      shoulder: 'worn_sword',
      chest: 'worn_sword',
      waist: 'worn_sword',
      legs: 'worn_sword',
      gloves: 'worn_sword',
      feet: 'worn_sword',
      ring1: 'worn_sword',
    };
    check('col_all_slots', false, 'ring2 empty');
    meta.equipment.ring2 = 'worn_sword';
    check('col_all_slots', true, 'all eleven filled');
    // nonDefaultSkin
    check('col_true_colors', false, 'default skin');
    meta.skin = 3;
    check('col_true_colors', true, 'alternate skin');
    // heroicMarkCircuit: three of four heroics is not a circuit
    meta.heroicDaily = {
      date: '2026-07-08',
      marked: new Set(['hollow_crypt', 'sunken_bastion', 'drowned_temple']),
    };
    check('dgn_mark_circuit', false, 'three marked');
    meta.heroicDaily.marked.add('gravewyrm_sanctum');
    check('dgn_mark_circuit', true, 'all four marked');
    // companionsBothMax: one maxed companion is not both
    meta.companionUpgrades = { companion_tessa: 3, companion_edda: 2 };
    check('dlv_companions_both', false, 'edda at rank 2');
    meta.companionUpgrades.companion_edda = 3;
    check('dlv_companions_both', true, 'both at rank 3');
    // firstEraCap rides the level while the launch era is current
    expect(meta.deedsEarned.has('feat_era_cap')).toBe(false);
    e.level = MAX_LEVEL;
    check('feat_era_cap', true, 'capped in the first era');
  });
});

describe('fixpoint across the authored order', () => {
  it('a chapter meta whose deed dependency sits LATER in DEED_ORDER still lands in one evaluation', () => {
    const sim = makeSim();
    const { meta, e } = primary(sim);
    // chr_vale_chapter_i (chronicles) requires exp_vale_wayfarer, which is
    // authored AFTER it in DEED_ORDER, so a single forward pass cannot grant
    // the chapter: only the fixpoint re-iteration can.
    const chapter = DEEDS.chr_vale_chapter_i.trigger;
    if (chapter.kind !== 'meta') throw new Error('fixture drift');
    expect(DEED_ORDER.indexOf('exp_vale_wayfarer') > DEED_ORDER.indexOf('chr_vale_chapter_i')).toBe(
      true,
    );
    for (const q of chapter.questIds ?? []) meta.questsDone.add(q);
    for (const dep of chapter.deedIds) {
      const t = DEEDS[dep].trigger;
      if (t.kind === 'visits') for (const mark of t.markIds) markVisited(sim.ctx, meta, mark);
      else if (t.kind === 'visit') markVisited(sim.ctx, meta, t.markId);
      else grantDeed(sim.ctx, meta, dep);
    }
    evaluateDeedsFor(sim.ctx, meta, e, false);
    expect(meta.deedsEarned.has('exp_vale_wayfarer')).toBe(true);
    expect(meta.deedsEarned.has('chr_vale_chapter_i')).toBe(true);
  });
});

describe('bounded sets on load', () => {
  it('restoreDeedStats drops marks outside the authored namespaces and unknown item ids', () => {
    const stats = restoreDeedStats({
      itemsDiscovered: ['glimmerfin_koi', 'not_a_real_item'],
      visited: ['poi:eastbrook_vale:Eastbrook', 'garbage', 'evil:namespace'],
    });
    expect([...stats.itemsDiscovered]).toEqual(['glimmerfin_koi']);
    expect([...stats.visited]).toEqual(['poi:eastbrook_vale:Eastbrook']);
  });
});

describe('site wiring (real modules, not direct bumps)', () => {
  it('a decided duel bumps duelsWon and duelsLost through endDuel', () => {
    const sim = makeSim();
    const a = sim.playerId;
    const b = sim.addPlayer('warrior', 'Rival');
    const duel = { a, b, state: 'active' as const, timer: 0 };
    duelMod.endDuel(sim.ctx, duel, a);
    const metaA = sim.players.get(a)!;
    const metaB = sim.players.get(b)!;
    expect(metaA.deedStats.counters.duelsWon).toBe(1);
    expect(metaA.deedStats.counters.duelsLost).toBe(0);
    expect(metaB.deedStats.counters.duelsLost).toBe(1);
    sim.tick();
    expect(metaA.deedsEarned.has('pvp_duel_first_win')).toBe(true);
    expect(metaB.deedsEarned.has('pvp_duel_grace')).toBe(true);
    // An undecided duel counts nothing.
    const c = sim.addPlayer('warrior', 'Bystander');
    duelMod.endDuel(sim.ctx, { a, b: c, state: 'active', timer: 0 }, null);
    expect(sim.players.get(c)!.deedStats.counters.duelsLost).toBe(0);
  });

  it('forming a party bumps partiesJoined for inviter and accepter through partyAccept', () => {
    const sim = makeSim();
    const a = sim.playerId;
    const b = sim.addPlayer('warrior', 'Friend');
    sim.ctx.partyInvite(b, a);
    sim.partyAccept(b);
    expect(sim.players.get(a)!.deedStats.counters.partiesJoined).toBe(1);
    expect(sim.players.get(b)!.deedStats.counters.partiesJoined).toBe(1);
    sim.tick();
    expect(sim.players.get(b)!.deedsEarned.has('soc_first_party')).toBe(true);
  });
});
