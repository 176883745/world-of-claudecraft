// The Book of Deeds evaluator: the deterministic core of the achievements
// system, a system module behind the SimContext seam (the quest_credit.ts
// shape: pure functions, zero rng, state on Sim/PlayerMeta).
//
// Responsibilities:
// - The persisted per-character deed surface: `PlayerMeta.deedsEarned`,
//   `PlayerMeta.deedStats` (lifetime counters + the itemsDiscovered/visited
//   mark sets + dungeonClears), `activeTitle`, and the incrementally
//   maintained `renown` sum.
// - The generic trigger evaluator (`updateDeeds`), run at the very end of the
//   tick tail over dirty players only, and once per player on world join with
//   `retro: true` so veterans get credit for state they verifiably already
//   hold. It draws ZERO rng, so its placement cannot fork the draw order.
// - The bespoke site helpers the gameplay modules call for `manual` deeds
//   (encounter mechanical/perfection/restriction/speed tasks, Vale Cup and
//   Fiesta moments, hidden delights) plus the per-attempt encounter tracking
//   those tasks need (`DeedRuntime`, session-only state on Sim).
//
// Determinism: every function here is a pure state transition over the live
// meta/entity references (the refactor's immutability waiver) plus ctx.emit.
// No Rng, no wall clock; the only time read is the sim clock (ctx.time /
// ctx.tickCount) and the host-supplied ctx.utcDay earn stamp.
//
// src/sim-pure: imports only sibling sim modules and the content tables (no
// render/ui/game/net/DOM/Three, no Math.random/Date.now), so it runs unchanged
// in Node, the browser, and the headless RL env.

import { DEED_ORDER, DEEDS, DEEDS_ERA } from './content/deeds';
import { GATHERING_PROFESSION_IDS } from './content/professions';
import { pointsSpent, talentsFor } from './content/talents';
import { ITEMS, MOBS, ZONES, zoneAt } from './data';
import { RESURRECTION_SICKNESS_ID } from './resurrection';
import type { ArenaMatch, InstanceSlot, PlayerMeta } from './sim';
import type { SimContext } from './sim_context';
import {
  DEED_STAT_KEYS,
  type DeedFlagId,
  type DeedMeterId,
  type DeedStatKey,
  type DeedStats,
  type DeedTrigger,
  dist2d,
  type Entity,
  MAX_LEVEL,
  type PlayerClass,
} from './types';

// ---------------------------------------------------------------------------
// Pinned site data. These literals are deliberately NOT read live from the
// content tables where a deed's requirement must never grow with content
// (the score-never-decreases rule); the content-integrity test cross-checks
// every id against the real tables instead.
// ---------------------------------------------------------------------------

// The five lifetime-XP milestone deeds that absorbed the legacy cosmetic
// milestone system. Granting one dual-writes the legacy unlockedMilestones id
// for one release (forward-only rollout insurance); loading unions the legacy
// set back into deedsEarned.
export const MILESTONE_DEED_TO_LEGACY: Record<string, string> = {
  prog_veteran: 'veteran',
  prog_champion: 'champion',
  prog_paragon: 'paragon',
  prog_mythic: 'mythic',
  prog_eternal: 'eternal',
};
const LEGACY_MILESTONE_TO_DEED: Record<string, string> = Object.fromEntries(
  Object.entries(MILESTONE_DEED_TO_LEGACY).map(([deed, legacy]) => [legacy, deed]),
);

// Dungeon final bosses whose kill credit bumps deedStats.dungeonClears (keys
// '<dungeonId>' and '<dungeonId>:heroic') and the dungeonFinalBossKills
// counter. PINNED as of v1: a future dungeon's boss gets a new deed; this
// list never grows an earned requirement.
const FINAL_BOSS_DUNGEONS: Record<string, string> = {
  morthen: 'hollow_crypt',
  vael_the_mistcaller: 'sunken_bastion',
  ysolei: 'drowned_temple',
  korzul_the_gravewyrm: 'gravewyrm_sanctum',
  nythraxis_scourge_of_thornpeak: 'nythraxis_boss_arena',
};

// Perfection tasks: zero player deaths inside the boss's heroic instance
// while the boss is engaged. Tainted by onPlayerDeathForDeeds; the window
// re-arms on evade/reset/respawn (resetDeedEncounter).
const FLAWLESS_TASKS: Record<string, string> = {
  morthen: 'dgn_morthen_flawless',
  ysolei: 'dgn_ysolei_flawless',
  korzul_the_gravewyrm: 'dgn_korzul_flawless',
  nythraxis_scourge_of_thornpeak: 'dgn_nythraxis_deathless',
};

// Kill-order tasks: at boss death, every add it summoned this attempt is dead.
const ADD_TASKS: Record<string, string> = {
  vael_the_mistcaller: 'dgn_vael_thralls',
  ysolei: 'dgn_ysolei_moonspawn',
  grand_necromancer_velkhar: 'dgn_velkhar_bonewalkers',
  deacon_varric: 'dlv_varric_ringers',
};

// Positioning tasks tainted when the boss's signature splash strikes a player
// other than its current target (Olen's Reaping Arc cleave; Nythraxis's
// Gravebreaker frontal arc). One taint flag per boss attempt.
const SPLASH_TASKS: Record<string, string> = {
  knight_commander_olen: 'dgn_olen_arc',
  nythraxis_scourge_of_thornpeak: 'dgn_nythraxis_gravebreaker',
};

// Footwork task: no Tolling Bell contact lands on any player this attempt.
const BELL_TASKS: Record<string, string> = {
  sister_nhalia_drowned_canticle: 'dlv_nhalia_bells',
};

// Roster-restriction task: at most 3 unique players appear in the boss's
// participant set (threat/damager credit, pet damage credits the owner).
const TRIO_TASKS: Record<string, string> = {
  morthen: 'dgn_morthen_trio',
};

// Templates whose encounters need per-attempt tracking at the damage site.
const PARTICIPANT_TRACKED = new Set(Object.keys(TRIO_TASKS));

const THUNZHARR_ID = 'thunzharr_waking_peak';
const WOLF_PACK_TEMPLATE = 'forest_wolf';
const BOG_BLOAT_TEMPLATE = 'bog_bloat';
const MENDER_TEMPLATE = 'gravecaller_mender';
const MENDER_WARD_TEMPLATES = ['gravecaller_cultist', 'gravecaller_summoner'];
// Grave Mending radius (zone2 content); the kill-order deed checks it.
const MENDER_WARD_RADIUS = 14;
// Rolling window for chr_vale_packbreaker: three forest_wolf kill credits by
// the same player within 10 seconds.
const WOLF_WINDOW_SECONDS = 10;
const WOLF_WINDOW_KILLS = 3;
// chr_marsh_unburst: clean bog_bloat kills needed (accumulating, no reset).
// dgn_sanctum_speed: kill Korzul within this many seconds of the party
// claiming the Gravewyrm Sanctum instance. CALIBRATE: the 15-minute figure is
// the design placeholder; retune against live pull timings before a wider
// audience sees it.
const SANCTUM_SPEED_SECONDS = 15 * 60;
const SANCTUM_SPEED_BOSS = 'korzul_the_gravewyrm';
const SANCTUM_SPEED_DEED = 'dgn_sanctum_speed';

// The named overworld terrors whose kill credit feeds a 'slain:<templateId>'
// visited mark (the chr_*_rares deeds). Pinned so the visited set stays
// bounded by construction.
const RARE_SLAIN_TEMPLATES = new Set([
  'old_greyjaw',
  'mogger',
  'grix_the_tunnelking',
  'captain_verlan',
  'wraithbinder_maldrec',
  'mirejaw_the_ravenous',
  'sloomtooth_the_drowned',
  'sister_nhalia',
  'ironvein_foreman',
  'brutok_skullsmasher',
  'voskar_emberwing',
  'marrowlord_varkas',
]);

// Zone fishing catches that count as "a fish" for the chr_ first-cast deeds
// (weeds and empty hooks do not count). Pinned to the authored tables.
const ZONE_FISH: Record<string, readonly string[]> = {
  eastbrook_vale: ['raw_mirror_trout', 'raw_river_perch', 'glimmerfin_koi'],
  mirefen_marsh: ['raw_marsh_pike', 'raw_bog_eel', 'glimmerfin_koi'],
  thornpeak_heights: ['raw_frostgill_trout', 'raw_stonescale_carp', 'glimmerfin_koi'],
};

// The three Chronicler NPCs (interaction-only). Talking to one feeds an
// 'npc:<templateId>' visited mark; Saul additionally drives the
// consecutive-talk counter behind hid_saul_footnote.
export const CHRONICLER_TEMPLATE_IDS = [
  'chronicler_saul',
  'chronicler_osric_fenn',
  'chronicler_edda_hartwell',
] as const;
const SAUL_TEMPLATE_ID = 'chronicler_saul';
const SAUL_TALKS_REQUIRED = 9;

// How close (yards) a POI sweep counts a visit, and the witness radius for
// chr_peaks_waking_witness (inside interest scope, pinned literal).
const POI_VISIT_RADIUS = 20;
const THUNZHARR_WITNESS_RADIUS = 100;

// ---------------------------------------------------------------------------
// Persisted state helpers
// ---------------------------------------------------------------------------

export function freshDeedStats(): DeedStats {
  const counters = {} as Record<DeedStatKey, number>;
  for (const k of DEED_STAT_KEYS) counters[k] = 0;
  return { counters, itemsDiscovered: new Set(), visited: new Set(), dungeonClears: {} };
}

// Serialized shape (CharacterState.deedStats). Only non-zero counters and
// non-empty sets are written, and set members are sorted, so an untouched
// subsystem never churns a save and equal states serialize byte-equal.
export interface SavedDeedStats {
  counters?: Partial<Record<DeedStatKey, number>>;
  itemsDiscovered?: string[];
  visited?: string[];
  dungeonClears?: Record<string, number>;
}

export function serializeDeedStats(stats: DeedStats): SavedDeedStats | undefined {
  const counters: Partial<Record<DeedStatKey, number>> = {};
  let anyCounter = false;
  for (const k of DEED_STAT_KEYS) {
    if (stats.counters[k] > 0) {
      counters[k] = stats.counters[k];
      anyCounter = true;
    }
  }
  const out: SavedDeedStats = {};
  if (anyCounter) out.counters = counters;
  if (stats.itemsDiscovered.size > 0) out.itemsDiscovered = [...stats.itemsDiscovered].sort();
  if (stats.visited.size > 0) out.visited = [...stats.visited].sort();
  const clearKeys = Object.keys(stats.dungeonClears).sort();
  if (clearKeys.length > 0) {
    const clears: Record<string, number> = {};
    for (const k of clearKeys) clears[k] = stats.dungeonClears[k];
    out.dungeonClears = clears;
  }
  return anyCounter || out.itemsDiscovered || out.visited || out.dungeonClears ? out : undefined;
}

export function restoreDeedStats(saved: SavedDeedStats | undefined): DeedStats {
  const stats = freshDeedStats();
  if (!saved) return stats;
  if (saved.counters) {
    for (const k of DEED_STAT_KEYS) {
      const v = saved.counters[k];
      if (typeof v === 'number' && Number.isFinite(v) && v > 0) stats.counters[k] = Math.floor(v);
    }
  }
  // Bounded on load exactly like the write sites: only real item ids enter
  // itemsDiscovered, and only marks in an authored namespace enter visited,
  // so a hand-edited save cannot grow either set unboundedly.
  for (const id of saved.itemsDiscovered ?? []) if (ITEMS[id]) stats.itemsDiscovered.add(id);
  for (const mark of saved.visited ?? []) {
    if (typeof mark !== 'string') continue;
    const ns = mark.slice(0, mark.indexOf(':'));
    if ((VISITED_MARK_NAMESPACES as readonly string[]).includes(ns)) stats.visited.add(mark);
  }
  for (const [k, v] of Object.entries(saved.dungeonClears ?? {})) {
    if (typeof v === 'number' && Number.isFinite(v) && v > 0)
      stats.dungeonClears[k] = Math.floor(v);
  }
  return stats;
}

// ---------------------------------------------------------------------------
// Session runtime (state on Sim, exposed as a live primitive view on the
// seam). Everything here is per-attempt or per-match bookkeeping for manual
// deeds; nothing persists.
// ---------------------------------------------------------------------------

export interface DeedEncounterState {
  // Player pids (pet damage resolves to the owner) that damaged this boss.
  participants: Set<number>;
  // A player died inside the boss's instance while it was engaged.
  deathTainted: boolean;
  // The boss's signature splash struck a non-target player (SPLASH_TASKS).
  splashTainted: boolean;
  // A Deathless Rage cast resolved uninterrupted (Nythraxis wardens task).
  rageResolved: boolean;
  // A Tolling Bell contact landed on a player (Nhalia bells task).
  bellTainted: boolean;
  // Live entity ids of every add this boss summoned this attempt.
  addIds: number[];
  // World boss only: contributors who died between joining the roster and
  // the kill (cmb_thunzharr_unbroken is personal, not raid-wide).
  diedPids: Set<number>;
}

export interface DeedRuntime {
  // Per-attempt encounter tracking, keyed by boss entity id. Cleared when the
  // boss dies (consumed), evades home, or respawns.
  encounters: Map<number, DeedEncounterState>;
  // pid -> recent forest_wolf kill-credit times (chr_vale_packbreaker).
  wolfKills: Map<number, number[]>;
  // pid -> consecutive Saul talks with no other NPC in between (session-scoped
  // by design: resets on logout).
  saulTalks: Map<number, number>;
  // bog_bloat corpse entity id -> credited pid, resolved when the delayed
  // death-throes blast fires (chr_marsh_unburst counts blast-clean kills).
  bloatPending: Map<number, number>;
  // Vale Cup per-match personal-outcome memory (match id keyed; practices can
  // run beside the public match). Cleared when the match ends.
  cupTouched: Map<number, Set<number>>;
  cupGoals: Map<number, Map<number, number>>;
}

export function createDeedRuntime(): DeedRuntime {
  return {
    encounters: new Map(),
    wolfKills: new Map(),
    saulTalks: new Map(),
    bloatPending: new Map(),
    cupTouched: new Map(),
    cupGoals: new Map(),
  };
}

function ensureEncounter(ctx: SimContext, bossId: number): DeedEncounterState {
  let st = ctx.deedRuntime.encounters.get(bossId);
  if (!st) {
    st = {
      participants: new Set(),
      deathTainted: false,
      splashTainted: false,
      rageResolved: false,
      bellTainted: false,
      addIds: [],
      diedPids: new Set(),
    };
    ctx.deedRuntime.encounters.set(bossId, st);
  }
  return st;
}

/** Re-arm a boss's attempt window. Called from the evade-arrival reset and
 *  the corpse respawn (the two ways an attempt ends without a kill). */
export function resetDeedEncounter(ctx: SimContext, mob: Entity): void {
  ctx.deedRuntime.encounters.delete(mob.id);
  ctx.deedRuntime.bloatPending.delete(mob.id);
}

/** Session cleanup when a player leaves the world (server-side long-run
 *  hygiene; the per-pid session maps must not grow across logins). */
export function dropDeedSessionState(ctx: SimContext, pid: number): void {
  ctx.deedDirtyPids.delete(pid);
  ctx.deedRuntime.wolfKills.delete(pid);
  ctx.deedRuntime.saulTalks.delete(pid);
}

// ---------------------------------------------------------------------------
// The seam callbacks (bound in buildSimContext)
// ---------------------------------------------------------------------------

export function markDeedsDirty(ctx: SimContext, pid: number): void {
  ctx.deedDirtyPids.add(pid);
}

export function bumpDeedStat(
  ctx: SimContext,
  meta: PlayerMeta,
  stat: DeedStatKey,
  delta: number,
): void {
  if (!(delta > 0)) return;
  meta.deedStats.counters[stat] += delta;
  ctx.deedDirtyPids.add(meta.entityId);
}

/** Record an item id as discovered (first time it ever enters possession).
 *  Also feeds the quality-first marks; `rolledQuality` carries an instance's
 *  rolled quality (gathered rares) which beats the static def quality. */
export function markItemDiscovered(
  ctx: SimContext,
  meta: PlayerMeta,
  itemId: string,
  rolledQuality?: string,
): void {
  const def = ITEMS[itemId];
  if (!def) return; // bounded by construction: only real item ids enter the set
  if (!meta.deedStats.itemsDiscovered.has(itemId)) {
    meta.deedStats.itemsDiscovered.add(itemId);
    ctx.deedDirtyPids.add(meta.entityId);
  }
  const quality = rolledQuality ?? def.quality;
  if (quality === 'rare' || quality === 'epic' || quality === 'legendary') {
    markVisited(ctx, meta, `quality:${quality}`);
  }
}

export function markVisited(ctx: SimContext, meta: PlayerMeta, markId: string): void {
  if (meta.deedStats.visited.has(markId)) return;
  meta.deedStats.visited.add(markId);
  ctx.deedDirtyPids.add(meta.entityId);
}

/** Idempotent grant, the one path every unlock takes (evaluator and manual
 *  sites alike). Stamps the host utcDay, maintains renown incrementally,
 *  dual-writes the legacy milestone set, bumps wireRev, and emits the
 *  id-based deedUnlocked event. */
export function grantDeed(
  ctx: SimContext,
  meta: PlayerMeta,
  deedId: string,
  opts?: { retro?: boolean },
): boolean {
  const def = DEEDS[deedId];
  if (!def) return false;
  if (meta.deedsEarned.has(deedId)) return false;
  meta.deedsEarned.set(deedId, ctx.utcDay);
  meta.renown += def.renown;
  const legacy = MILESTONE_DEED_TO_LEGACY[deedId];
  if (legacy) meta.unlockedMilestones.add(legacy);
  meta.wireRev++;
  ctx.deedDirtyPids.add(meta.entityId);
  ctx.emit({
    type: 'deedUnlocked',
    deedId,
    pid: meta.entityId,
    ...(opts?.retro ? { retro: true } : {}),
  });
  return true;
}

// ---------------------------------------------------------------------------
// Trigger evaluation
// ---------------------------------------------------------------------------

// Manual deeds are never satisfied by the generic evaluator; skip them once.
const NON_MANUAL_ORDER: readonly string[] = DEED_ORDER.filter(
  (id) => DEEDS[id].trigger.kind !== 'manual',
);

// pointsGate-8 node ids per class (the bottom row of every tree), computed
// once from the static talent registry so prog_deep_roots never walks the
// tree per evaluation.
const capstoneNodeCache = new Map<PlayerClass, ReadonlySet<string>>();
function capstoneNodes(cls: PlayerClass): ReadonlySet<string> {
  let set = capstoneNodeCache.get(cls);
  if (!set) {
    const tree = talentsFor(cls);
    set = new Set((tree?.nodes ?? []).filter((n) => n.pointsGate === 8).map((n) => n.id));
    capstoneNodeCache.set(cls, set);
  }
  return set;
}

const METERS: Record<DeedMeterId, (meta: PlayerMeta) => number> = {
  prestigeRank: (m) => m.prestigeRank,
  talentPoints: (m) => pointsSpent(m.talents),
  arenaRankedMatches: (m) => m.arenaWins + m.arenaLosses + m.arena2v2Wins + m.arena2v2Losses,
  arenaRankedWins: (m) => m.arenaWins + m.arena2v2Wins,
  vcupWins: (m) => m.vcupWins,
  vcupGuildWins: (m) => m.vcupGuildWins,
  bankPurchasedSlots: (m) => m.bank.purchasedSlots,
  townFocusPoints: (m) => Object.values(m.townFocus).reduce((a, b) => a + b, 0),
  delveLoreCount: (m) => m.delveLoreUnlocked.size,
  companionRankBest: (m) => Math.max(0, ...Object.values(m.companionUpgrades)),
  itemsDiscoveredCount: (m) => m.deedStats.itemsDiscovered.size,
  poorItemsDiscoveredCount: (m) => {
    let n = 0;
    for (const id of m.deedStats.itemsDiscovered) if (ITEMS[id]?.quality === 'poor') n++;
    return n;
  },
};

// The heroic-mark daily circuit reads the four launch heroics, PINNED (the
// Nythraxis arena also pays marks but is deliberately not required).
const MARK_CIRCUIT_DUNGEONS = [
  'hollow_crypt',
  'sunken_bastion',
  'drowned_temple',
  'gravewyrm_sanctum',
];

const FLAGS: Record<DeedFlagId, (meta: PlayerMeta, e: Entity) => boolean> = {
  talentSpecChosen: (m) => m.talents.spec !== null,
  talentCapstone: (m) => {
    const nodes = capstoneNodes(m.cls);
    for (const [nodeId, ranks] of Object.entries(m.talents.ranks)) {
      if (ranks > 0 && nodes.has(nodeId)) return true;
    }
    return false;
  },
  hasRestedXp: (m) => m.restedXp > 0,
  // Guild membership is server-stamped onto the entity; offline it stays ''
  // (never satisfiable there, matching the offline-sandbox model).
  guildMember: (_m, e) => e.guild !== '',
  // Slot list PINNED as of v1 (the launch EQUIP_SLOTS); a future twelfth slot
  // does not grow this deed.
  allEquipSlotsFilled: (m) =>
    (
      [
        'mainhand',
        'helmet',
        'neck',
        'shoulder',
        'chest',
        'waist',
        'legs',
        'gloves',
        'feet',
        'ring1',
        'ring2',
      ] as const
    ).every((slot) => !!m.equipment[slot]),
  nonDefaultSkin: (m) => m.skinCatalog === 'mech' || m.skin > 0,
  // The marked set resets whenever the date advances, so containment of all
  // four ids already means "for one heroicDaily.date".
  heroicMarkCircuit: (m) => MARK_CIRCUIT_DUNGEONS.every((d) => m.heroicDaily.marked.has(d)),
  companionsBothMax: (m) =>
    (m.companionUpgrades.companion_tessa ?? 0) >= 3 &&
    (m.companionUpgrades.companion_edda ?? 0) >= 3,
  // Era feats are minted per era; this one is satisfiable only while the
  // launch era is current (DEEDS_ERA is bumped by the maintainer at era
  // boundaries, at which point the deed stays visible as a history marker).
  firstEraCap: (_m, e) => DEEDS_ERA === 'first_era' && e.level >= MAX_LEVEL,
};

function dungeonClearCount(
  stats: DeedStats,
  dungeonId: string,
  difficulty?: 'normal' | 'heroic',
): number {
  if (difficulty === 'heroic') return stats.dungeonClears[`${dungeonId}:heroic`] ?? 0;
  if (difficulty === 'normal') return stats.dungeonClears[dungeonId] ?? 0;
  return (stats.dungeonClears[dungeonId] ?? 0) + (stats.dungeonClears[`${dungeonId}:heroic`] ?? 0);
}

function delveClearCount(meta: PlayerMeta, delveId?: string, tier?: 'normal' | 'heroic'): number {
  let n = 0;
  for (const [key, count] of Object.entries(meta.delveClears)) {
    const [keyDelve, keyTier] = key.split(':');
    if (delveId !== undefined && keyDelve !== delveId) continue;
    if (tier !== undefined && keyTier !== tier) continue;
    n += count;
  }
  return n;
}

function countAtLeast(values: Record<string, number>, floor: number): number {
  let n = 0;
  for (const v of Object.values(values)) if (v >= floor) n++;
  return n;
}

export function checkDeedTrigger(meta: PlayerMeta, e: Entity, trigger: DeedTrigger): boolean {
  switch (trigger.kind) {
    case 'level':
      return e.level >= trigger.level;
    case 'lifetimeXp':
      return meta.lifetimeXp >= trigger.amount;
    case 'quest':
      return meta.questsDone.has(trigger.questId);
    case 'quests':
      return trigger.questIds.every((q) => meta.questsDone.has(q));
    case 'stat':
      return meta.deedStats.counters[trigger.stat] >= trigger.count;
    case 'dungeonClears':
      return (
        dungeonClearCount(meta.deedStats, trigger.dungeonId, trigger.difficulty) >= trigger.count
      );
    case 'delveClears':
      return delveClearCount(meta, trigger.delveId, trigger.tier) >= trigger.count;
    case 'arenaRating':
      return (trigger.bracket === '2v2' ? meta.arena2v2Rating : meta.arenaRating) >= trigger.rating;
    case 'craftSkill':
      if (trigger.craftId !== undefined)
        return (meta.craftSkills[trigger.craftId] ?? 0) >= trigger.level;
      return countAtLeast(meta.craftSkills, trigger.level) >= (trigger.count ?? 1);
    case 'gathering':
      if (trigger.professionId !== undefined) {
        return meta.gatheringProficiency[trigger.professionId] >= trigger.amount;
      }
      return (
        GATHERING_PROFESSION_IDS.filter((p) => meta.gatheringProficiency[p] >= trigger.amount)
          .length >= (trigger.count ?? 1)
      );
    case 'collectItems': {
      const need = trigger.count ?? trigger.itemIds.length;
      let have = 0;
      for (const id of trigger.itemIds) if (meta.deedStats.itemsDiscovered.has(id)) have++;
      return have >= need;
    }
    case 'visit':
      return meta.deedStats.visited.has(trigger.markId);
    case 'visits': {
      const need = trigger.count ?? trigger.markIds.length;
      let have = 0;
      for (const mark of trigger.markIds) if (meta.deedStats.visited.has(mark)) have++;
      return have >= need;
    }
    case 'meta':
      return (
        trigger.deedIds.every((id) => meta.deedsEarned.has(id)) &&
        (trigger.questIds ?? []).every((q) => meta.questsDone.has(q))
      );
    case 'meter':
      return METERS[trigger.meter](meta) >= trigger.amount;
    case 'flag':
      return FLAGS[trigger.flag](meta, e);
    case 'manual':
      return false;
  }
}

/** Check every unearned non-manual deed for one player and grant to a
 *  fixpoint within the same pass (metas over freshly granted deeds resolve
 *  immediately; bounded because each iteration must grant at least once). */
export function evaluateDeedsFor(
  ctx: SimContext,
  meta: PlayerMeta,
  e: Entity,
  retro: boolean,
): void {
  const opts = retro ? { retro: true } : undefined;
  let granted = true;
  while (granted) {
    granted = false;
    for (const id of NON_MANUAL_ORDER) {
      if (meta.deedsEarned.has(id)) continue;
      if (checkDeedTrigger(meta, e, DEEDS[id].trigger)) {
        grantDeed(ctx, meta, id, opts);
        granted = true;
      }
    }
  }
}

/** The tick-tail evaluator. Runs immediately after the delayed-event drain
 *  and before the grid refresh: it sees same-tick delayed-event results, and
 *  because it draws ZERO rng its position cannot fork the draw order (the
 *  Vale Cup tail precedent). Work is proportional to dirty players plus the
 *  1 Hz proximity sweep; idle worlds pay a Set-size check. */
export function updateDeeds(ctx: SimContext): void {
  if (ctx.tickCount % 20 === 0) sweepProximityMarks(ctx);
  if (ctx.deedDirtyPids.size === 0) return;
  const pids = [...ctx.deedDirtyPids];
  ctx.deedDirtyPids.clear();
  for (const pid of pids) {
    const meta = ctx.players.get(pid);
    const e = ctx.entities.get(pid);
    if (!meta || !e) continue;
    // A Fiesta bout standardizes the character to level 20, which can move
    // Entity.level UP for a low-level player and must never satisfy level
    // deeds; the restore site re-marks the player dirty on bout exit.
    if (meta.fiestaRestore) continue;
    evaluateDeedsFor(ctx, meta, e, false);
    // Grants re-mark the player dirty (manual-site semantics); the in-pass
    // fixpoint already resolved everything, so drop the redundant mark.
    ctx.deedDirtyPids.delete(pid);
  }
}

// The 1 Hz sweep behind the poisVisited marks (within 20 yd of a named
// ZoneDef poi) and the Thunzharr witness mark. Deterministic: fixed cadence
// on the sim clock, insertion-order player iteration, zero rng.
function sweepProximityMarks(ctx: SimContext): void {
  let thunzharr: Entity | null = null;
  for (const ent of ctx.entities.values()) {
    if (ent.kind === 'mob' && !ent.dead && ent.templateId === THUNZHARR_ID) {
      thunzharr = ent;
      break;
    }
  }
  for (const meta of ctx.players.values()) {
    const e = ctx.entities.get(meta.entityId);
    if (!e || e.dead) continue;
    const zone = zoneAt(e.pos.z);
    for (const poi of zone.pois ?? []) {
      if (dist2d(e.pos, { x: poi.x, y: 0, z: poi.z }) <= POI_VISIT_RADIUS) {
        markVisited(ctx, meta, `poi:${zone.id}:${poi.label}`);
      }
    }
    if (thunzharr && dist2d(e.pos, thunzharr.pos) <= THUNZHARR_WITNESS_RADIUS) {
      markVisited(ctx, meta, `witness:${THUNZHARR_ID}`);
    }
  }
}

// ---------------------------------------------------------------------------
// World join: load-time seeding, retro fallbacks, and the retro pass
// ---------------------------------------------------------------------------

/** Union the legacy milestone set into deedsEarned (load path; the legacy
 *  earn day is unknown, so the stamp is ''). lifetimeXp is monotonic, so the
 *  retro evaluation would re-grant these anyway; the union preserves the
 *  exact legacy record without re-emitting events for it. */
export function unionLegacyMilestones(meta: PlayerMeta): void {
  for (const legacy of meta.unlockedMilestones) {
    const deedId = LEGACY_MILESTONE_TO_DEED[legacy];
    if (deedId && !meta.deedsEarned.has(deedId)) meta.deedsEarned.set(deedId, '');
  }
}

/** The sim is authoritative for renown: recompute from the earned set on
 *  every load (the saved number exists only for a later SQL sort index). */
export function recomputeRenown(meta: PlayerMeta): void {
  let renown = 0;
  for (const id of meta.deedsEarned.keys()) renown += DEEDS[id]?.renown ?? 0;
  meta.renown = renown;
}

/** Seed the discovery ledger from what the character already holds (bags,
 *  bank, equipment), so veterans keep credit for what they still own. Runs on
 *  every join; the set only grows, so re-seeding is idempotent. */
export function seedItemDiscovery(ctx: SimContext, meta: PlayerMeta): void {
  for (const slot of meta.inventory) {
    markItemDiscovered(ctx, meta, slot.itemId, slot.instance?.rolled?.quality);
  }
  for (const slot of meta.bank.inventory) {
    markItemDiscovered(ctx, meta, slot.itemId, slot.instance?.rolled?.quality);
  }
  for (const itemId of Object.values(meta.equipment)) {
    if (itemId) markItemDiscovered(ctx, meta, itemId);
  }
  for (const bagId of meta.bags) {
    if (bagId) markItemDiscovered(ctx, meta, bagId);
  }
}

/** Retro grants that a state predicate cannot express: craft skill only ever
 *  comes from successful crafts, so any positive craftSkills value proves the
 *  first craft happened before the counter existed. */
export function retroFallbackGrants(ctx: SimContext, meta: PlayerMeta): void {
  if (Object.values(meta.craftSkills).some((v) => v > 0)) {
    grantDeed(ctx, meta, 'prog_first_craft', { retro: true });
  }
}

// ---------------------------------------------------------------------------
// Combat / death sites (called from combat/damage.ts and mob modules)
// ---------------------------------------------------------------------------

/** Damage bookkeeping: the persisted lifetime counters beside the session
 *  RewardCounters (same site, same amounts, minus the training dummy), plus
 *  encounter participant tracking. Called from the dealDamage
 *  post-mitigation path with a non-null source; draws no rng and never
 *  branches sim behavior. */
export function onDamageDealtForDeeds(
  ctx: SimContext,
  source: Entity,
  target: Entity,
  amount: number,
  crit: boolean,
  kind: 'hit' | 'miss' | 'dodge',
): void {
  if (source.kind === 'player' && source.id !== target.id) {
    const meta = ctx.players.get(source.id);
    if (meta) {
      if (target.kind === 'mob' && MOBS[target.templateId]?.dummy === true) {
        // The training dummy is a zero-risk target: it feeds only its own
        // practice counter, never the real combat ledger.
        bumpDeedStat(ctx, meta, 'dummyDamage', amount);
      } else {
        bumpDeedStat(ctx, meta, 'damageDealt', amount);
        if (crit && kind === 'hit' && amount > 0) bumpDeedStat(ctx, meta, 'crits', 1);
      }
    }
  }
  if (target.kind === 'mob' && PARTICIPANT_TRACKED.has(target.templateId) && amount > 0) {
    const pid = source.kind === 'player' ? source.id : source.ownerId;
    if (pid !== null) ensureEncounter(ctx, target.id).participants.add(pid);
  }
}

/** Player death bookkeeping: the lifetime deaths counter, the hidden
 *  Keeper's Toll delight, perfection-window taints, and the world-boss
 *  personal-survival record. */
export function onPlayerDeathForDeeds(ctx: SimContext, e: Entity): void {
  const meta = ctx.players.get(e.id);
  if (meta) {
    bumpDeedStat(ctx, meta, 'deaths', 1);
    if (e.auras.some((a) => a.id === RESURRECTION_SICKNESS_ID)) {
      grantDeed(ctx, meta, 'hid_keepers_toll_twice');
    }
  }
  // Perfection windows: a player death inside a tracked boss's instance while
  // that boss is engaged taints the attempt (the window re-arms on evade or
  // respawn via resetDeedEncounter).
  for (const inst of ctx.instances) {
    if (inst.partyKey === null) continue;
    const origin = ctx.instanceOriginOf(inst);
    if (Math.abs(e.pos.x - origin.x) >= 120 || Math.abs(e.pos.z - origin.z) >= 250) continue;
    for (const mobId of inst.mobIds) {
      const boss = ctx.entities.get(mobId);
      if (!boss || boss.dead || !FLAWLESS_TASKS[boss.templateId]) continue;
      if (boss.threat.size === 0) continue; // not engaged: no window open
      ensureEncounter(ctx, boss.id).deathTainted = true;
    }
  }
  // World boss: a contributor dying mid-fight loses only their own unbroken
  // credit (personal, so an open-world crowd cannot fail it for anyone else).
  for (const ent of ctx.entities.values()) {
    if (ent.kind !== 'mob' || ent.dead || ent.templateId !== THUNZHARR_ID) continue;
    if (ent.bossDamagers.has(e.id)) ensureEncounter(ctx, ent.id).diedPids.add(e.id);
  }
}

/** A boss summoned adds this attempt; the kill-order tasks check the whole
 *  list is dead when the boss falls. */
export function onBossAddsSummonedForDeeds(ctx: SimContext, boss: Entity, addIds: number[]): void {
  if (!ADD_TASKS[boss.templateId]) return;
  ensureEncounter(ctx, boss.id).addIds.push(...addIds);
}

/** The boss's tracked splash (Reaping Arc cleave / Gravebreaker arc) struck a
 *  player other than its current target: taint the positioning task. */
export function onBossSplashHitForDeeds(ctx: SimContext, boss: Entity): void {
  if (!SPLASH_TASKS[boss.templateId]) return;
  ensureEncounter(ctx, boss.id).splashTainted = true;
}

/** A Tolling Bell contact landed on a player. */
export function onBellContactForDeeds(ctx: SimContext, boss: Entity): void {
  if (!BELL_TASKS[boss.templateId]) return;
  ensureEncounter(ctx, boss.id).bellTainted = true;
}

/** A Deathless Rage cast resolved uninterrupted (never broken by the
 *  wardstones): the wardens task fails for this attempt. */
export function onDeathlessRageResolvedForDeeds(ctx: SimContext, boss: Entity): void {
  ensureEncounter(ctx, boss.id).rageResolved = true;
}

// Players physically inside an instance's band ("every player inside that
// instance" is the encounter-task recipient standard; the completion deeds
// use the kill-credit eligible snapshot instead, exactly like XP).
function playersInInstance(ctx: SimContext, inst: InstanceSlot): PlayerMeta[] {
  const origin = ctx.instanceOriginOf(inst);
  const out: PlayerMeta[] = [];
  for (const meta of ctx.players.values()) {
    const e = ctx.entities.get(meta.entityId);
    if (!e) continue;
    if (Math.abs(e.pos.x - origin.x) < 120 && Math.abs(e.pos.z - origin.z) < 250) out.push(meta);
  }
  return out;
}

function instanceForMob(ctx: SimContext, mob: Entity): InstanceSlot | undefined {
  return ctx.instances.find((i) => i.partyKey !== null && i.mobIds.includes(mob.id));
}

/** Shared final-boss clear credit: bumps the per-dungeon clear record and the
 *  pinned five-boss kill counter, plus the full-party social deed and the
 *  Sanctum speed task. `recipients` is the kill-credit snapshot (party
 *  members in XP range, downed members included) or the raid room roster. */
export function onDungeonFinalBossKilledForDeeds(
  ctx: SimContext,
  mob: Entity,
  inst: InstanceSlot | undefined,
  recipients: PlayerMeta[],
): void {
  const dungeonId = FINAL_BOSS_DUNGEONS[mob.templateId];
  if (!dungeonId) return;
  const heroic = inst?.difficulty === 'heroic';
  const clearKey = heroic ? `${dungeonId}:heroic` : dungeonId;
  for (const meta of recipients) {
    meta.deedStats.dungeonClears[clearKey] = (meta.deedStats.dungeonClears[clearKey] ?? 0) + 1;
    bumpDeedStat(ctx, meta, 'dungeonFinalBossKills', 1);
    const party = ctx.partyOf(meta.entityId);
    if (party && !party.raid && party.members.length === 5) {
      bumpDeedStat(ctx, meta, 'fullPartyDungeonClears', 1);
    }
  }
  if (
    mob.templateId === SANCTUM_SPEED_BOSS &&
    inst?.claimedAt !== undefined &&
    ctx.time - inst.claimedAt <= SANCTUM_SPEED_SECONDS
  ) {
    for (const meta of recipients) grantDeed(ctx, meta, SANCTUM_SPEED_DEED);
  }
}

/** Every deed consequence of a credited mob kill. Called from handleDeath's
 *  kill-credit block with the same snapshot XP/quests/loot use. */
export function onMobKillCreditForDeeds(
  ctx: SimContext,
  mob: Entity,
  killer: Entity | null,
  credited: PlayerMeta,
  eligible: PlayerMeta[],
): void {
  const tmpl = MOBS[mob.templateId];
  bumpDeedStat(ctx, credited, 'kills', 1);

  // chr_vale_packbreaker: three forest_wolf kill credits inside a rolling
  // 10 s window (session-scoped times; pruned on every push).
  if (mob.templateId === WOLF_PACK_TEMPLATE) {
    const times = ctx.deedRuntime.wolfKills.get(credited.entityId) ?? [];
    const cutoff = ctx.time - WOLF_WINDOW_SECONDS;
    const recent = times.filter((t) => t >= cutoff);
    recent.push(ctx.time);
    ctx.deedRuntime.wolfKills.set(credited.entityId, recent);
    if (recent.length >= WOLF_WINDOW_KILLS) grantDeed(ctx, credited, 'chr_vale_packbreaker');
  }

  // chr_marsh_unburst: the clean-kill check resolves when the delayed
  // death-throes blast fires (onBloatDetonatedForDeeds).
  if (mob.templateId === BOG_BLOAT_TEMPLATE) {
    ctx.deedRuntime.bloatPending.set(mob.id, credited.entityId);
  }

  // chr_*_rares: party kills credit every eligible member, like quest credit.
  if (RARE_SLAIN_TEMPLATES.has(mob.templateId)) {
    for (const meta of eligible) markVisited(ctx, meta, `slain:${mob.templateId}`);
  }

  // cmb_giantslayer: the killing blow itself (a pet's blow credits its
  // owner), on a mob at least five levels up; dummies and the world boss are
  // excluded by design.
  const killerPid = killer ? (killer.kind === 'player' ? killer.id : killer.ownerId) : null;
  if (killerPid !== null && !tmpl?.dummy && !tmpl?.worldBoss) {
    const killerEntity = ctx.entities.get(killerPid);
    const killerMeta = ctx.players.get(killerPid);
    if (killerEntity && killerMeta && mob.level >= killerEntity.level + 5) {
      grantDeed(ctx, killerMeta, 'cmb_giantslayer');
    }
  }

  // chr_marsh_hush_the_mending: a mender felled by your blow while it still
  // tends a living cultist within its Grave Mending radius.
  if (mob.templateId === MENDER_TEMPLATE && killerPid !== null) {
    const killerMeta = ctx.players.get(killerPid);
    if (killerMeta) {
      for (const ent of ctx.entities.values()) {
        if (ent.kind !== 'mob' || ent.dead) continue;
        if (!MENDER_WARD_TEMPLATES.includes(ent.templateId)) continue;
        if (dist2d(ent.pos, mob.pos) <= MENDER_WARD_RADIUS) {
          grantDeed(ctx, killerMeta, 'chr_marsh_hush_the_mending');
          break;
        }
      }
    }
  }

  // Dungeon completion credit (the Nythraxis raid routes through the room
  // roster at the lockout site instead, so it is excluded here).
  const inst = instanceForMob(ctx, mob);
  if (FINAL_BOSS_DUNGEONS[mob.templateId] && mob.templateId !== 'nythraxis_scourge_of_thornpeak') {
    onDungeonFinalBossKilledForDeeds(ctx, mob, inst, eligible);
  }

  // Encounter skill tasks resolve at the tracked boss's death; recipients are
  // every player inside the instance (the encounter-window standard), falling
  // back to the eligible snapshot outside instances.
  const st = ctx.deedRuntime.encounters.get(mob.id);
  const taskRecipients = inst ? playersInInstance(ctx, inst) : eligible;
  const flawlessDeed = FLAWLESS_TASKS[mob.templateId];
  if (flawlessDeed && inst?.difficulty === 'heroic' && !st?.deathTainted) {
    for (const meta of taskRecipients) grantDeed(ctx, meta, flawlessDeed);
  }
  const trioDeed = TRIO_TASKS[mob.templateId];
  if (trioDeed && (st?.participants.size ?? 0) <= 3) {
    for (const meta of taskRecipients) grantDeed(ctx, meta, trioDeed);
  }
  const addDeed = ADD_TASKS[mob.templateId];
  if (addDeed) {
    const allDead = (st?.addIds ?? []).every((id) => {
      const add = ctx.entities.get(id);
      return !add || add.dead;
    });
    if (allDead) for (const meta of taskRecipients) grantDeed(ctx, meta, addDeed);
  }
  const splashDeed = SPLASH_TASKS[mob.templateId];
  if (splashDeed && !st?.splashTainted) {
    for (const meta of taskRecipients) grantDeed(ctx, meta, splashDeed);
  }
  const bellDeed = BELL_TASKS[mob.templateId];
  if (bellDeed && !st?.bellTainted) {
    for (const meta of taskRecipients) grantDeed(ctx, meta, bellDeed);
  }
  if (mob.templateId === 'nythraxis_scourge_of_thornpeak' && !st?.rageResolved) {
    for (const meta of taskRecipients) grantDeed(ctx, meta, 'dgn_nythraxis_wardens');
  }
  ctx.deedRuntime.encounters.delete(mob.id);
}

/** Nythraxis raid credit rides the same room roster the raid lockout stamps
 *  (dead raiders in the room included), never the party-XP snapshot. */
export function onNythraxisKillForDeeds(
  ctx: SimContext,
  boss: Entity,
  roomMetas: PlayerMeta[],
): void {
  onDungeonFinalBossKilledForDeeds(ctx, boss, instanceForMob(ctx, boss), roomMetas);
}

/** World-boss credit: the loot-roster snapshot (never pruned by dying). */
export function onWorldBossKilledForDeeds(
  ctx: SimContext,
  mob: Entity,
  contributors: PlayerMeta[],
): void {
  if (mob.templateId !== THUNZHARR_ID) return;
  const st = ctx.deedRuntime.encounters.get(mob.id);
  for (const meta of contributors) {
    grantDeed(ctx, meta, 'cmb_thunzharr');
    bumpDeedStat(ctx, meta, 'thunzharrKills', 1);
    if (!st?.diedPids.has(meta.entityId)) grantDeed(ctx, meta, 'cmb_thunzharr_unbroken');
  }
  ctx.deedRuntime.encounters.delete(mob.id);
}

/** The delayed bog_bloat death-throes blast resolved: a credited kill where
 *  the blast dealt the credited player no damage is a clean kill. */
export function onBloatDetonatedForDeeds(
  ctx: SimContext,
  corpse: Entity,
  damagedPids: readonly number[],
): void {
  const creditedPid = ctx.deedRuntime.bloatPending.get(corpse.id);
  if (creditedPid === undefined) return;
  ctx.deedRuntime.bloatPending.delete(corpse.id);
  if (damagedPids.includes(creditedPid)) return;
  const meta = ctx.players.get(creditedPid);
  if (meta) bumpDeedStat(ctx, meta, 'bloatCleanKills', 1);
}

/** Fall damage killed the player (the sim-side motion deps wrapper observes
 *  the 'Falling' label so the shared pure kernel stays untouched). */
export function onFallDeathForDeeds(ctx: SimContext, e: Entity): void {
  const meta = ctx.players.get(e.id);
  if (meta) grantDeed(ctx, meta, 'hid_fall_death');
}

// ---------------------------------------------------------------------------
// Arena / Fiesta sites
// ---------------------------------------------------------------------------

/** A Fiesta bout counts for deeds only when it is a real matchmade bout:
 *  every seated combatant is human. Offline practice bouts are staged with
 *  bots (Sim.fiestaBotPids, exposed as a live seam view); the online server
 *  never seats fiesta bots, so online bouts always pass. */
export function fiestaBoutCountsForDeeds(ctx: SimContext, match: ArenaMatch): boolean {
  const pids = [...match.teamA, ...match.teamB];
  return pids.every((pid) => !ctx.fiestaBotPids.includes(pid));
}

/** Fiesta takedown moments (real bouts only): the sim-side doublekill window
 *  and shutdown conditions, not the word-cue else-if chain, and the personal
 *  five-takedown bout tally. */
export function onFiestaTakedownForDeeds(
  ctx: SimContext,
  match: ArenaMatch,
  killerPid: number,
  opts: { rapid: boolean; victimStreak: number; killerKills: number },
): void {
  if (!fiestaBoutCountsForDeeds(ctx, match)) return;
  const meta = ctx.players.get(killerPid);
  if (!meta) return;
  if (opts.rapid) grantDeed(ctx, meta, 'pvp_fiesta_double');
  if (opts.victimStreak >= 3) grantDeed(ctx, meta, 'pvp_fiesta_shutdown');
  if (opts.killerKills >= 5) grantDeed(ctx, meta, 'pvp_fiesta_five_kills');
}

/** A ring power-up grab (real bouts only) feeds the pinned coverage marks. */
export function onFiestaPowerupForDeeds(
  ctx: SimContext,
  match: ArenaMatch,
  pid: number,
  defId: string,
): void {
  if (!fiestaBoutCountsForDeeds(ctx, match)) return;
  const meta = ctx.players.get(pid);
  if (meta) markVisited(ctx, meta, `fiesta:${defId}`);
}

/** Arena match resolution: ranked standings feed the meter deeds (marked
 *  dirty here so rating bands grant the same tick), the first-match grant
 *  covers draws the win/loss meters cannot see, and the Fiesta end-of-bout
 *  moments resolve while the augment picks are still on the meta. */
export function onArenaMatchEndForDeeds(
  ctx: SimContext,
  match: ArenaMatch,
  winnerTeam: 'A' | 'B' | null,
): void {
  const ranked = !match.fiesta && !match.yumi;
  const pids = [...match.teamA, ...match.teamB];
  if (ranked) {
    for (const pid of pids) {
      const meta = ctx.players.get(pid);
      if (!meta) continue;
      grantDeed(ctx, meta, 'pvp_arena_first_match');
      ctx.deedDirtyPids.add(pid);
    }
    return;
  }
  if (match.fiesta && fiestaBoutCountsForDeeds(ctx, match)) {
    const winners = winnerTeam === 'A' ? match.teamA : winnerTeam === 'B' ? match.teamB : [];
    for (const pid of pids) {
      const meta = ctx.players.get(pid);
      if (meta) grantDeed(ctx, meta, 'pvp_fiesta_first_bout');
    }
    for (const pid of winners) {
      const meta = ctx.players.get(pid);
      if (!meta) continue;
      grantDeed(ctx, meta, 'pvp_fiesta_first_win');
      // One pick per wave, three waves: the structural bout maximum. Picks
      // are still on the meta here; returnFromArena clears them later.
      if (meta.fiestaAugments.length === 3) grantDeed(ctx, meta, 'pvp_fiesta_full_build');
    }
  }
}

// ---------------------------------------------------------------------------
// Vale Cup sites
// ---------------------------------------------------------------------------

// The Cup match shape the deed sites read. Kept structural (vale_cup.ts owns
// the real VcMatch) so this module never imports the cup module.
export interface CupMatchForDeeds {
  id: number;
  bracket: number;
  rated: boolean;
  golden: boolean;
  scoreA: number;
  scoreB: number;
  teamA: number[];
  teamB: number[];
  roles: Record<number, string>;
  benched: Set<number>;
  practice: unknown | null;
}

// Personal outcomes count only in QUEUED bouts (rated or bot-backfilled);
// practice bouts and offline-staged bouts never count for any Cup deed.
function cupQueuedBout(match: CupMatchForDeeds): boolean {
  return match.practice === null;
}

/** A personal ball touch (kick, grip, trap, or dribble nudge). Feeds the
 *  Chronicle debut immediately and the per-match memory pvp_vcup_first_match
 *  reads at full time. Backfill bots are real PlayerMeta players, so they are
 *  skipped explicitly (a bot must never accrue deed state). */
export function onCupTouchForDeeds(ctx: SimContext, match: CupMatchForDeeds, pid: number): void {
  if (!cupQueuedBout(match)) return;
  if (ctx.vcup.botPids.includes(pid)) return;
  let touched = ctx.deedRuntime.cupTouched.get(match.id);
  if (!touched) {
    touched = new Set();
    ctx.deedRuntime.cupTouched.set(match.id, touched);
  }
  touched.add(pid);
  const meta = ctx.players.get(pid);
  if (meta) grantDeed(ctx, meta, 'chr_vale_cup_debut');
}

/** A goal was scored by `team`; resolve the scoring pid exactly like the
 *  scorer-name banner (last kicker within the kick window, else last
 *  toucher; an own goal never credits an opponent). Rated matches only. */
export function onCupGoalForDeeds(
  ctx: SimContext,
  match: CupMatchForDeeds,
  team: 'A' | 'B',
  scorerPid: number | null,
): void {
  if (!match.rated || scorerPid === null) return;
  const meta = ctx.players.get(scorerPid);
  if (!meta) return;
  grantDeed(ctx, meta, 'pvp_vcup_first_goal');
  if (match.golden) grantDeed(ctx, meta, 'pvp_vcup_golden_goal');
  if (match.bracket >= 3) {
    let goals = ctx.deedRuntime.cupGoals.get(match.id);
    if (!goals) {
      goals = new Map();
      ctx.deedRuntime.cupGoals.set(match.id, goals);
    }
    const n = (goals.get(scorerPid) ?? 0) + 1;
    goals.set(scorerPid, n);
    if (n >= 3) grantDeed(ctx, meta, 'pvp_vcup_hat_trick');
  }
}

/** A keeper save (shot at or above the save speed floor), rated only. */
export function onCupSaveForDeeds(
  ctx: SimContext,
  match: CupMatchForDeeds,
  keeperPid: number,
): void {
  if (!match.rated) return;
  const meta = ctx.players.get(keeperPid);
  if (meta) grantDeed(ctx, meta, 'pvp_vcup_first_save');
}

/** Standing applied for one pid inside the rated result loop: the win meters
 *  move here, and a winning keeper with a clean sheet earns it now (roles and
 *  scores are final; the meta is still seated). */
export function onCupStandingForDeeds(
  ctx: SimContext,
  match: CupMatchForDeeds,
  pid: number,
  team: 'A' | 'B',
  winner: 'A' | 'B' | null,
): void {
  ctx.deedDirtyPids.add(pid);
  if (winner !== team) return;
  if (match.roles[pid] !== 'keeper' || match.benched.has(pid)) return;
  const opposingScore = team === 'A' ? match.scoreB : match.scoreA;
  if (opposingScore !== 0) return;
  const meta = ctx.players.get(pid);
  if (meta) grantDeed(ctx, meta, 'pvp_vcup_clean_sheet');
}

/** Full time: seeing the match out seated with a personal touch earns the
 *  debut match deed (bot-backfilled queued bouts count for this debut only).
 *  Also drops the per-match memory. */
export function onCupMatchEndForDeeds(ctx: SimContext, match: CupMatchForDeeds): void {
  const touched = ctx.deedRuntime.cupTouched.get(match.id);
  if (cupQueuedBout(match) && touched) {
    for (const pid of [...match.teamA, ...match.teamB]) {
      if (match.benched.has(pid) || !touched.has(pid)) continue;
      const meta = ctx.players.get(pid);
      if (meta) grantDeed(ctx, meta, 'pvp_vcup_first_match');
    }
  }
  ctx.deedRuntime.cupTouched.delete(match.id);
  ctx.deedRuntime.cupGoals.delete(match.id);
}

// ---------------------------------------------------------------------------
// Delve sites
// ---------------------------------------------------------------------------

/** A delve clear credited to one member: the clear predicates re-evaluate,
 *  and a Heroic run whose whole-run roster watermark never saw a second
 *  player is the solo-clear restriction task. */
export function onDelveClearForDeeds(
  ctx: SimContext,
  meta: PlayerMeta,
  run: { tierId: string; deedMaxParty?: number },
): void {
  ctx.deedDirtyPids.add(meta.entityId);
  if (run.tierId === 'heroic' && (run.deedMaxParty ?? 1) <= 1) {
    grantDeed(ctx, meta, 'dlv_solo_heroic');
  }
}

/** A lockpick session ended in success: the premium-ante flawless solve, and
 *  the hidden Bountiful Coffer crack. */
export function onLockpickSuccessForDeeds(
  ctx: SimContext,
  ownerPid: number,
  ante: number,
  isCoffer: boolean,
): void {
  const meta = ctx.players.get(ownerPid);
  if (!meta) return;
  if (ante === 1) grantDeed(ctx, meta, 'dlv_tumbler_premium');
  if (isCoffer) grantDeed(ctx, meta, 'hid_bountiful_coffer');
}

/** The Drowned Litany rite finale completed on the last correct touch. */
export function onRiteFinaleForDeeds(ctx: SimContext, pid: number, mistakes: number): void {
  if (mistakes !== 0) return;
  const meta = ctx.players.get(pid);
  if (meta) grantDeed(ctx, meta, 'dlv_rite_flawless');
}

/** The rank 3 companion boon actually saved someone. */
export function onCompanionReviveForDeeds(ctx: SimContext, ownerPid: number): void {
  const meta = ctx.players.get(ownerPid);
  if (meta) grantDeed(ctx, meta, 'hid_companion_save');
}

// ---------------------------------------------------------------------------
// Social / chat / interaction sites
// ---------------------------------------------------------------------------

/** An NPC talk resolved (the interact path). Chroniclers feed their visited
 *  mark; Saul additionally advances his consecutive-talk counter, which any
 *  other NPC talk resets (session-scoped by design). */
export function onNpcTalkedForDeeds(ctx: SimContext, meta: PlayerMeta, templateId: string): void {
  if ((CHRONICLER_TEMPLATE_IDS as readonly string[]).includes(templateId)) {
    markVisited(ctx, meta, `npc:${templateId}`);
  }
  if (templateId === SAUL_TEMPLATE_ID) {
    const talks = (ctx.deedRuntime.saulTalks.get(meta.entityId) ?? 0) + 1;
    ctx.deedRuntime.saulTalks.set(meta.entityId, talks);
    if (talks >= SAUL_TALKS_REQUIRED) grantDeed(ctx, meta, 'hid_saul_footnote');
  } else {
    ctx.deedRuntime.saulTalks.delete(meta.entityId);
  }
}

/** Doing business with a banker (the interact bank arm or any successful
 *  bank operation) marks that branch of the Gilded Strongbox. */
export function onBankerBusinessForDeeds(
  ctx: SimContext,
  meta: PlayerMeta,
  bankerTemplateId: string,
): void {
  markVisited(ctx, meta, `npc:${bankerTemplateId}`);
  // A banker is still an NPC conversation as far as Saul's ledger cares.
  ctx.deedRuntime.saulTalks.delete(meta.entityId);
}

/** A successful fishing cast resolved to a real fish (weeds and boots do not
 *  count) in `zoneId`'s waters. */
export function onFishCaughtForDeeds(
  ctx: SimContext,
  meta: PlayerMeta,
  zoneId: string,
  itemId: string,
): void {
  if ((ZONE_FISH[zoneId] ?? []).includes(itemId)) markVisited(ctx, meta, `fish:${zoneId}`);
}

/** A plain /roll (classic 1-100 bounds) landed exactly 100. */
export function onChatRollForDeeds(
  ctx: SimContext,
  pid: number,
  lo: number,
  hi: number,
  result: number,
): void {
  if (lo !== 1 || hi !== 100 || result !== 100) return;
  const meta = ctx.players.get(pid);
  if (meta) grantDeed(ctx, meta, 'hid_roll_hundred');
}

/** A /cheer resolved with a living Yumi in earshot. The cat entity only
 *  exists during a Protect Yumi bout, so proximity already implies a live
 *  match; works for fighters and walk-up spectators alike. */
export function onCheerForDeeds(
  ctx: SimContext,
  meta: PlayerMeta,
  e: Entity,
  yumiTemplateId: string,
  range: number,
): void {
  for (const ent of ctx.entities.values()) {
    if (ent.kind !== 'mob' || ent.dead || ent.templateId !== yumiTemplateId) continue;
    if (dist2d(ent.pos, e.pos) <= range) {
      grantDeed(ctx, meta, 'hid_yumi_cheer');
      return;
    }
  }
}

// Mark namespaces every visited entry must belong to (asserted by the deeds
// tests so no unbounded key source can ever feed the set).
export const VISITED_MARK_NAMESPACES = [
  'poi',
  'gather',
  'fish',
  'npc',
  'slain',
  'quality',
  'fiesta',
  'dungeon',
  'witness',
] as const;
