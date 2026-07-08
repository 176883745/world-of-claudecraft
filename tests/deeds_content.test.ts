// Book of Deeds catalog integrity: every id, reference, mark, and total in
// src/sim/content/deeds.ts resolves against the real content tables, and the
// audited launch totals are pinned as LITERALS (update deliberately when the
// catalog changes, never by copying the computed value back).
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { POWERUPS } from '../src/sim/content/augments';
import { DEEDS_ERA } from '../src/sim/content/deeds';
import { FISHING_TABLES } from '../src/sim/content/items';
import { CRAFT_RING, GATHERING_PROFESSION_IDS } from '../src/sim/content/professions';
import {
  DEED_ORDER,
  DEEDS,
  DELVES,
  DUNGEONS,
  ITEMS,
  MOBS,
  NPCS,
  QUESTS,
  ZONES,
} from '../src/sim/data';
import { MILESTONE_DEED_TO_LEGACY, VISITED_MARK_NAMESPACES } from '../src/sim/deeds';
import { DEED_STAT_KEYS, type DeedCategory, MILESTONES } from '../src/sim/types';

const ALL = DEED_ORDER.map((id) => DEEDS[id]);

const PREFIX_CATEGORY: Record<string, DeedCategory> = {
  prog_: 'progression',
  cmb_: 'combat',
  dgn_: 'dungeon',
  dlv_: 'delve',
  chr_: 'chronicle',
  col_: 'collection',
  pvp_: 'pvp',
  soc_: 'social',
  exp_: 'exploration',
  feat_: 'feat',
  hid_: 'hidden',
};

describe('audited launch totals (literals: update deliberately with the catalog)', () => {
  it('ships exactly 186 deeds worth 2285 total Renown', () => {
    expect(DEED_ORDER.length).toBe(186);
    expect(ALL.reduce((sum, d) => sum + d.renown, 0)).toBe(2285);
  });

  it('ships exactly 19 titles and 3 borders', () => {
    const titles = ALL.filter((d) => d.reward?.kind === 'title');
    const borders = ALL.filter((d) => d.reward?.kind === 'border');
    expect(titles.length).toBe(19);
    expect(borders.length).toBe(3);
    // Titles and border slugs are unique (one deed per cosmetic).
    const titleTexts = titles.map((d) => (d.reward as { text: string }).text);
    expect(new Set(titleTexts).size).toBe(19);
    const borderSlugs = borders.map((d) => (d.reward as { slug: string }).slug);
    expect([...borderSlugs].sort()).toEqual(['curators_gilt', 'deepward', 'prestige_laurels']);
  });

  it('pins the launch era constant', () => {
    expect(DEEDS_ERA).toBe('first_era');
  });
});

describe('table shape', () => {
  it('DEED_ORDER holds the append-only authored order (first and last pinned)', () => {
    // DEED_ORDER derives from the table keys, so covering DEEDS is inherent;
    // what CAN drift is the authored order itself. Pin the endpoints as
    // literals: prog_first_steps opens the catalog and hid_codfather closes
    // the launch set, and either moving would signal a reorder (forbidden:
    // the order is an append-only determinism contract; new deeds append).
    expect(DEED_ORDER[0]).toBe('prog_first_steps');
    expect(DEED_ORDER[DEED_ORDER.length - 1]).toBe('hid_codfather');
  });

  it('every entry key matches its id and its prefix matches its category', () => {
    for (const [key, def] of Object.entries(DEEDS)) {
      expect(def.id).toBe(key);
      const prefix = Object.keys(PREFIX_CATEGORY).find((p) => key.startsWith(p));
      expect(prefix, `${key} has no known prefix`).toBeDefined();
      expect(def.category, key).toBe(PREFIX_CATEGORY[prefix as string]);
    }
  });

  it('renown values come from the allowed scale', () => {
    for (const def of ALL) expect([0, 5, 10, 25, 50], def.id).toContain(def.renown);
  });

  it('every feat has renown 0 and the feat/hidden flags stay on their prefixes, disjoint', () => {
    for (const def of ALL) {
      expect(def.feat === true, def.id).toBe(def.id.startsWith('feat_'));
      expect(def.hidden === true, def.id).toBe(def.id.startsWith('hid_'));
      if (def.feat) expect(def.renown, def.id).toBe(0);
      expect(def.feat === true && def.hidden === true, `${def.id} both feat and hidden`).toBe(
        false,
      );
    }
  });

  it('names and descs are non-empty English with no em/en dashes or emoji', () => {
    const banned = /[–—\u{1F000}-\u{1FAFF}☀-➿]/u;
    for (const def of ALL) {
      expect(def.name.length, def.id).toBeGreaterThan(0);
      expect(def.desc.length, def.id).toBeGreaterThan(0);
      expect(banned.test(def.name), `${def.id} name`).toBe(false);
      expect(banned.test(def.desc), `${def.id} desc`).toBe(false);
    }
  });
});

describe('trigger references resolve against the real content tables', () => {
  it('quest, dungeon, delve, item, craft, and profession references all exist', () => {
    for (const def of ALL) {
      const t = def.trigger;
      switch (t.kind) {
        case 'quest':
          expect(QUESTS[t.questId], `${def.id}: ${t.questId}`).toBeDefined();
          break;
        case 'quests':
          for (const q of t.questIds) expect(QUESTS[q], `${def.id}: ${q}`).toBeDefined();
          break;
        case 'dungeonClears':
          expect(DUNGEONS[t.dungeonId], `${def.id}: ${t.dungeonId}`).toBeDefined();
          break;
        case 'delveClears':
          if (t.delveId !== undefined) {
            expect(DELVES[t.delveId], `${def.id}: ${t.delveId}`).toBeDefined();
          }
          break;
        case 'collectItems':
          for (const itemId of t.itemIds) {
            expect(ITEMS[itemId], `${def.id}: ${itemId}`).toBeDefined();
          }
          break;
        case 'craftSkill':
          if (t.craftId !== undefined) {
            expect(
              CRAFT_RING.some((c) => c.id === t.craftId),
              `${def.id}: ${t.craftId}`,
            ).toBe(true);
          }
          break;
        case 'gathering':
          if (t.professionId !== undefined) {
            expect(GATHERING_PROFESSION_IDS, `${def.id}`).toContain(t.professionId);
          }
          break;
        case 'meta':
          for (const dep of t.deedIds) expect(DEEDS[dep], `${def.id}: ${dep}`).toBeDefined();
          for (const q of t.questIds ?? []) expect(QUESTS[q], `${def.id}: ${q}`).toBeDefined();
          break;
        default:
          break;
      }
    }
  });

  it('meta dependencies are acyclic (the fixpoint pass terminates by granting)', () => {
    const visiting = new Set<string>();
    const done = new Set<string>();
    const visit = (id: string): void => {
      if (done.has(id)) return;
      expect(visiting.has(id), `meta cycle through ${id}`).toBe(false);
      visiting.add(id);
      const t = DEEDS[id].trigger;
      if (t.kind === 'meta') for (const dep of t.deedIds) visit(dep);
      visiting.delete(id);
      done.add(id);
    };
    for (const id of DEED_ORDER) visit(id);
  });

  it('every visited mark belongs to an authored namespace and resolves to real content', () => {
    const powerupIds = new Set(POWERUPS.map((p) => p.id));
    const zonePoiLabels = new Map(ZONES.map((z) => [z.id, new Set(z.pois?.map((p) => p.label))]));
    const checkMark = (deedId: string, mark: string): void => {
      const ns = mark.split(':')[0];
      expect(VISITED_MARK_NAMESPACES, `${deedId}: ${mark}`).toContain(ns);
      if (ns === 'poi') {
        const rest = mark.slice(4);
        const cut = rest.indexOf(':');
        const zoneId = rest.slice(0, cut);
        const label = rest.slice(cut + 1);
        const labels = zonePoiLabels.get(zoneId);
        expect(labels, `${deedId}: unknown zone in ${mark}`).toBeDefined();
        expect(labels?.has(label), `${deedId}: unknown poi in ${mark}`).toBe(true);
      } else if (ns === 'slain' || ns === 'witness') {
        expect(MOBS[mark.slice(ns.length + 1)], `${deedId}: ${mark}`).toBeDefined();
      } else if (ns === 'npc') {
        expect(NPCS[mark.slice(4)], `${deedId}: ${mark}`).toBeDefined();
      } else if (ns === 'fish') {
        expect(FISHING_TABLES[mark.slice(5)], `${deedId}: ${mark}`).toBeDefined();
      } else if (ns === 'gather') {
        const [, zoneId, type] = mark.split(':');
        expect(zonePoiLabels.has(zoneId), `${deedId}: ${mark}`).toBe(true);
        expect(['ore', 'wood', 'herb'], `${deedId}: ${mark}`).toContain(type);
      } else if (ns === 'quality') {
        expect(['rare', 'epic', 'legendary'], `${deedId}: ${mark}`).toContain(mark.slice(8));
      } else if (ns === 'fiesta') {
        expect(powerupIds.has(mark.slice(7)), `${deedId}: ${mark}`).toBe(true);
      } else if (ns === 'dungeon') {
        expect(DUNGEONS[mark.slice(8)], `${deedId}: ${mark}`).toBeDefined();
      }
    };
    for (const def of ALL) {
      if (def.trigger.kind === 'visit') checkMark(def.id, def.trigger.markId);
      if (def.trigger.kind === 'visits') {
        for (const mark of def.trigger.markIds) checkMark(def.id, mark);
      }
    }
  });

  it('every lifetime counter key is read by at least one deed (no dead counters)', () => {
    const read = new Set<string>();
    for (const def of ALL) if (def.trigger.kind === 'stat') read.add(def.trigger.stat);
    for (const key of DEED_STAT_KEYS) expect(read.has(key), `unread counter ${key}`).toBe(true);
  });

  it('every lifetime counter has a producer site (no permanently unearnable stat deed)', () => {
    // Scan the sim sources for bumpDeedStat call literals; a counter no site
    // ever bumps makes its deed permanently unearnable. guildsFounded is the
    // documented exception: guild creation resolves entirely in the server
    // social layer, so its producer is a server observer, not a sim site.
    const SERVER_PRODUCED: readonly string[] = ['guildsFounded'];
    const produced = new Set<string>();
    const simRoot = path.join(__dirname, '..', 'src', 'sim');
    const walk = (dir: string): void => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (entry.name.endsWith('.ts')) {
          const src = fs.readFileSync(p, 'utf8');
          for (const m of src.matchAll(/bumpDeedStat\([^)]*?'([a-zA-Z]+)'/g)) {
            produced.add(m[1]);
          }
        }
      }
    };
    walk(simRoot);
    for (const key of DEED_STAT_KEYS) {
      if (SERVER_PRODUCED.includes(key)) {
        expect(produced.has(key), `${key} is server-produced; drop the exemption`).toBe(false);
        continue;
      }
      expect(produced.has(key), `no sim producer bumps ${key}`).toBe(true);
    }
  });
});

describe('milestone unification', () => {
  it('the five prog_ milestone deeds mirror the legacy MILESTONES table literally', () => {
    // Pinned literals first (the legacy table must not drift under the deeds).
    expect(MILESTONES.map((m) => [m.id, m.lifetimeXp])).toEqual([
      ['veteran', 250000],
      ['champion', 500000],
      ['paragon', 1000000],
      ['mythic', 2500000],
      ['eternal', 5000000],
    ]);
    for (const m of MILESTONES) {
      const deed = DEEDS[`prog_${m.id}`];
      expect(deed, m.id).toBeDefined();
      expect(deed.trigger).toEqual({ kind: 'lifetimeXp', amount: m.lifetimeXp });
      expect(MILESTONE_DEED_TO_LEGACY[deed.id]).toBe(m.id);
    }
    expect(Object.keys(MILESTONE_DEED_TO_LEGACY).length).toBe(5);
  });

  it('the five reserved milestone titles ride exactly these deeds', () => {
    expect(DEEDS.prog_veteran.reward).toEqual({ kind: 'title', text: 'Veteran' });
    expect(DEEDS.prog_champion.reward).toEqual({ kind: 'title', text: 'Champion' });
    expect(DEEDS.prog_paragon.reward).toEqual({ kind: 'title', text: 'Paragon' });
    expect(DEEDS.prog_mythic.reward).toEqual({ kind: 'title', text: 'Mythic' });
    expect(DEEDS.prog_eternal.reward).toEqual({ kind: 'title', text: 'Eternal' });
  });
});

describe('the completionist feat', () => {
  it('feat_book_complete requires exactly every non-feat, non-hidden deed', () => {
    const t = DEEDS.feat_book_complete.trigger;
    expect(t.kind).toBe('meta');
    if (t.kind !== 'meta') return;
    const expected = DEED_ORDER.filter((id) => !DEEDS[id].feat && !DEEDS[id].hidden);
    expect(t.deedIds).toEqual(expected);
    expect(DEEDS.feat_book_complete.feat).toBe(true);
    expect(DEEDS.feat_book_complete.renown).toBe(0);
  });
});
