// P15b WCAG 2.2 AA gate: axe-core over the cold + async + per-frame-host windows that carry
// extracted painters (talents, social, options, arena, questlog, spellbook, leaderboard, char,
// market, bags), in a seeded/populated state, with the async windows (leaderboard, market) run
// under BOTH a Sim-shaped and a ClientWorld-mirror-shaped fixture (decision 15). Each window's
// real painter renders into a host element with the real style barrel loaded, then axe asserts
// zero SERIOUS or CRITICAL violations. This is the OPT-IN browser suite (npm run test:browser);
// a bare `vitest run` never launches a browser.
//
// Canvas/3D surfaces stay OUT of scope (decision 10): the arena host carries a label + honest
// summary and is axed as a host window; the map window is a canvas painter covered by its
// static-HTML host aria (#map-canvas role=img, #map-summary) + tests/client_shell.test.ts, not
// by this painter-mount harness; their pixels get no faked per-marker aria.

import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TalentAllocation } from '../../src/sim/content/talents';
import { ITEMS, QUESTS } from '../../src/sim/data';
import { ArenaWindow } from '../../src/ui/arena_window';
import { BagsWindow } from '../../src/ui/bags_window';
import { CharWindow } from '../../src/ui/char_window';
import { t } from '../../src/ui/i18n';
import { LeaderboardWindow } from '../../src/ui/leaderboard_window';
import { MarketWindow } from '../../src/ui/market_window';
import { OptionsWindow } from '../../src/ui/options_window';
import { QuestLogWindow } from '../../src/ui/questlog_window';
import { SocialWindow } from '../../src/ui/social_window';
import { SpellbookWindow } from '../../src/ui/spellbook_window';
import { TalentsWindow } from '../../src/ui/talents_window';
import type {
  LeaderboardEntry,
  LeaderboardPage,
  MarketInfo,
  MarketListingView,
} from '../../src/world_api';
import {
  axeSeriousViolations,
  cleanup,
  formatViolations,
  host,
  stubDeps,
  type WorldShape,
} from './_harness';

afterEach(cleanup);

async function expectClean(el: HTMLElement): Promise<void> {
  const violations = await axeSeriousViolations(el);
  expect(violations, formatViolations(violations)).toEqual([]);
}

// ---------------------------------------------------------------------------
// Leaderboard (#leaderboard-window) - the async/paged decision-15 centerpiece.
// ---------------------------------------------------------------------------

function entry(over: Partial<LeaderboardEntry> = {}): LeaderboardEntry {
  return {
    rank: 1,
    name: 'Aurelia',
    cls: 'warrior',
    level: 60,
    virtualLevel: 12,
    lifetimeXp: 5_000_000,
    prestigeRank: 0,
    ...over,
  };
}

// A resolved page. The sim shape carries extra fields the core must ignore (the online-only
// -shape trap decision 15 exists to catch); the client mirror carries only the decoded fields.
function page(shape: WorldShape, leaders: LeaderboardEntry[]): LeaderboardPage {
  const junk = shape === 'sim' ? { _serverSeq: 7, _dirty: true } : {};
  return {
    leaders,
    page: 0,
    pageCount: 1,
    total: leaders.length,
    pageSize: 50,
    ...junk,
  } as unknown as LeaderboardPage;
}

function leaderboardWindow(leaderboard: () => Promise<LeaderboardPage>): {
  root: HTMLElement;
  win: LeaderboardWindow;
} {
  const root = host('leaderboard-window');
  root.style.display = 'none'; // toggle() opens it
  const win = new LeaderboardWindow(
    stubDeps({
      root: () => root,
      world: () =>
        ({
          realm: 'Claudemoon',
          player: { name: 'Aurelia', level: 60 },
          lifetimeXp: 5_000_000,
          leaderboard,
        }) as never,
      captureFocus: () => null,
    }),
  );
  return { root, win };
}

describe('axe: leaderboard window (decision 15: Sim + ClientWorld shapes)', () => {
  for (const shape of ['sim', 'client'] as const) {
    it(`ranked page is clean under the ${shape} shape`, async () => {
      const leaders = [
        entry({ rank: 1, name: 'Aurelia', me: true } as Partial<LeaderboardEntry>),
        entry({ rank: 2, name: 'Bramblefoot', cls: 'druid', prestigeRank: 2 }),
        entry({ rank: 3, name: 'Cinderhowl', cls: 'mage' }),
      ];
      const { root, win } = leaderboardWindow(async () => page(shape, leaders));
      win.toggle();
      await vi.waitFor(() => expect(root.querySelector('.lb-row')).toBeTruthy());
      await expectClean(root);
    });
  }

  it('error state (rejecting leaderboard) is clean and announced', async () => {
    const { root, win } = leaderboardWindow(async () => {
      throw new Error('offline');
    });
    win.toggle();
    await vi.waitFor(() => expect(root.querySelector('.lb-error')).toBeTruthy());
    expect(root.querySelector('.lb-error')?.getAttribute('role')).toBe('alert');
    await expectClean(root);
  });
});

// ---------------------------------------------------------------------------
// Talents (#talents-window) - dialog role, the close button, the tablist + radiogroup.
// ---------------------------------------------------------------------------

describe('axe: talents window', () => {
  it('warrior talent tree is clean (dialog role + close button + tablist)', async () => {
    const root = host('talents-window');
    root.style.display = 'none';
    let stage: TalentAllocation | null = null;
    const win = new TalentsWindow(
      stubDeps({
        root: () => root,
        getStage: () => stage,
        setStage: (s: TalentAllocation | null) => {
          stage = s;
        },
        playerClass: () => 'warrior',
        totalPoints: () => 31,
        currentAllocation: () => ({ ranks: {}, choices: {} }) as TalentAllocation,
        activeLoadout: () => -1,
        loadouts: () => [],
        currentBar: () => [],
        buildDropdown: () => document.createElement('div'),
        captureFocus: () => null,
      }),
    );
    win.open();
    expect(root.getAttribute('role')).toBe('dialog');
    expect(root.querySelector('button[data-close]')).toBeTruthy();
    await expectClean(root);
  });
});

// ---------------------------------------------------------------------------
// Arena (#arena-window) - the offline host (dialog role + named title + close).
// ---------------------------------------------------------------------------

describe('axe: arena window', () => {
  it('offline host is clean (dialog role, labelled title)', async () => {
    const root = host('arena-window');
    root.style.display = 'none';
    const win = new ArenaWindow(
      stubDeps({
        root: () => root,
        world: () =>
          ({
            arenaInfo: null,
            playerId: 1,
            player: { name: 'Aurelia' },
            partyInfo: null,
          }) as never,
        captureFocus: () => null,
      }),
    );
    win.toggle();
    expect(root.getAttribute('aria-labelledby')).toBe('arena-title');
    expect(root.querySelector('#arena-title')).toBeTruthy();
    await expectClean(root);
  });
});

// ---------------------------------------------------------------------------
// Quest log (#quest-log-window) - a populated list with selectable rows.
// ---------------------------------------------------------------------------

describe('axe: quest log window', () => {
  it('active quest list is clean', async () => {
    const root = host('quest-log-window');
    root.style.display = 'none';
    const found = Object.entries(QUESTS).find(([, q]) => q.objectives.length >= 1);
    if (!found) throw new Error('fixture: no quest with objectives');
    const [questId, quest] = found;
    const progress = { questId, counts: quest.objectives.map(() => 0), state: 'active' };
    const win = new QuestLogWindow(
      stubDeps({
        root: () => root,
        world: () =>
          ({
            cfg: { playerClass: 'warrior' },
            player: { name: 'Aurelia' },
            questLog: new Map([[questId, progress]]),
            questsDone: new Set<string>(),
          }) as never,
        captureFocus: () => null,
      }),
    );
    win.toggle();
    expect(root.getAttribute('role')).toBe('dialog');
    await expectClean(root);
  });
});

// ---------------------------------------------------------------------------
// Spellbook (#spellbook) - the class kit rows (locked, so no resolved-ability deps).
// ---------------------------------------------------------------------------

describe('axe: spellbook window', () => {
  it('class kit rows are clean', async () => {
    const root = host('spellbook');
    root.style.display = 'none';
    const win = new SpellbookWindow(
      stubDeps({
        root: () => root,
        world: () => ({ cfg: { playerClass: 'warrior' }, known: [] }) as never,
        barAbilityIds: () => [],
        hasFreeSlot: () => true,
        hasFormBars: () => false,
        captureFocus: () => null,
      }),
    );
    win.toggle();
    expect(root.getAttribute('role')).toBe('dialog');
    await expectClean(root);
  });
});

// ---------------------------------------------------------------------------
// Options / Esc menu (#options-menu) - the main drill-down menu.
// ---------------------------------------------------------------------------

describe('axe: options menu', () => {
  function optionsWindow(): { root: HTMLElement; win: OptionsWindow } {
    const root = host('options-menu');
    root.style.display = 'none';
    const win = new OptionsWindow(
      stubDeps({
        root: () => root,
        world: () =>
          ({
            realm: 'Claudemoon',
            player: { name: 'Aurelia', pos: { x: 0, y: 0, z: 0 } },
          }) as never,
        options: () => null,
        bugReport: () => null,
        captureFocus: () => null,
      }),
    );
    return { root, win };
  }

  it('main menu is clean (dialog role, labelled title that resolves)', async () => {
    const { root, win } = optionsWindow();
    win.toggle();
    expect(root.getAttribute('aria-labelledby')).toBe('options-title');
    // The idref must resolve to a real element, else the dialog is nameless (the arena
    // test pins the same for its title; this strengthening would have caught the perf
    // sub-view's dangling reference, the P15b re-audit fix below).
    expect(root.querySelector('#options-title')).toBeTruthy();
    await expectClean(root);
  });

  it('Performance sub-view names the dialog with aria-label, no dangling idref (P15b re-audit)', async () => {
    const { root, win } = optionsWindow();
    win.toggle(); // main menu first
    // Navigate to the Performance sub-view the real way: click its menu entry. Its title
    // comes from the self-contained perf panel (no id=options-title), so the dialog must
    // name itself via aria-label, NOT keep the now-dangling aria-labelledby.
    const perfBtn = Array.from(root.querySelectorAll<HTMLElement>('.opt-btn')).find(
      (b) => b.textContent === t('hudChrome.perf.title'),
    );
    expect(perfBtn, 'performance menu entry present').toBeTruthy();
    perfBtn?.click();
    expect(root.getAttribute('aria-label')).toBe(t('hudChrome.perf.title'));
    expect(root.getAttribute('aria-labelledby')).toBeNull();
    await expectClean(root);
  });
});

// ---------------------------------------------------------------------------
// Social (#social-window) - the offline state AND the online friends tab, so the P15b
// ARIA-1.2 typeahead combobox (role=combobox + aria-controls/expanded) is actually axed
// in its collapsed state. The EXPANDED listbox + the moving aria-activedescendant are
// interaction-driven (type -> debounced async search) and belong to a future driven
// browser test; the static axe pass here sees only the collapsed combobox.
// ---------------------------------------------------------------------------

describe('axe: social window', () => {
  it('offline state is clean (dialog role, tabs)', async () => {
    const root = host('social-window');
    const win = new SocialWindow(
      stubDeps({
        root: () => root,
        world: () =>
          ({
            socialInfo: null,
            partyInfo: null,
            realm: 'Claudemoon',
            player: { name: 'Aurelia' },
          }) as never,
        captureFocus: () => null,
      }),
    );
    win.toggle();
    expect(root.getAttribute('role')).toBe('dialog');
    await expectClean(root);
  });

  it('online friends tab is clean (the ARIA-1.2 typeahead combobox, collapsed)', async () => {
    const root = host('social-window');
    const win = new SocialWindow(
      stubDeps({
        root: () => root,
        world: () =>
          ({
            socialInfo: { friends: [], guild: null, ignored: [] },
            partyInfo: null,
            realm: 'Claudemoon',
            player: { name: 'Aurelia' },
          }) as never,
        captureFocus: () => null,
      }),
    );
    win.toggle();
    const input = root.querySelector('input[role="combobox"]');
    expect(input, 'the friends typeahead renders a combobox when online').toBeTruthy();
    // aria-controls must resolve to the sibling listbox (a dangling idref is an axe fail).
    const listId = input?.getAttribute('aria-controls');
    expect(listId && root.querySelector(`#${listId}`)?.getAttribute('role')).toBe('listbox');
    expect(input?.getAttribute('aria-expanded')).toBe('false');
    await expectClean(root);
  });
});

// ---------------------------------------------------------------------------
// Character window (#char-window) - the paperdoll sheet: dialog root named by the title,
// plus the role=img 3D-preview HOST (the canvas pixels stay OUT of scope, decision 10).
// ---------------------------------------------------------------------------

describe('axe: character window', () => {
  it('paperdoll sheet is clean (dialog role + role=img preview host)', async () => {
    const root = host('char-window');
    root.style.display = 'none';
    const win = new CharWindow(
      stubDeps({
        root: () => root,
        world: () =>
          ({
            cfg: { playerClass: 'warrior' },
            player: { name: 'Aurelia', level: 60, skin: 0 },
            equipment: {},
          }) as never,
        statCellHtml: () => '',
        statTooltipHtml: () => '',
        talentSummaryHtml: () => '',
        progressionHtml: () => '',
        slotName: (s: string) => s,
        // The 3D turntable + skin picker are HUD-owned (rendered by callback). The skin
        // row is a role=list, so populate one listitem (as the real picker does) to keep
        // the list valid; the 3D preview HOST keeps its role=img with the pixels OUT.
        renderSkinPicker: () => {
          const row = root.querySelector('#char-skin-row');
          if (row) row.innerHTML = '<button type="button" role="listitem">1</button>';
        },
        captureFocus: () => null,
      }),
    );
    win.toggle();
    expect(root.getAttribute('role')).toBe('dialog');
    expect(root.getAttribute('aria-labelledby')).toBe('char-title');
    expect(root.querySelector('#char-title')).toBeTruthy();
    expect(root.querySelector('#char-model-preview')?.getAttribute('role')).toBe('img');
    await expectClean(root);
  });
});

// ---------------------------------------------------------------------------
// Market (#market-window) - the async Browse window: dialog name + the persistent
// role=status live region, under BOTH world shapes (decision 15, like leaderboard).
// ---------------------------------------------------------------------------

function marketInfo(shape: WorldShape): MarketInfo {
  // A populated listing so the Browse body renders real rows (the buy button + the row
  // controls), not the empty-state short-circuit: an empty window passes axe vacuously
  // (the phase's own populated-fixture requirement), so axe must see the row controls.
  const listing: MarketListingView = {
    id: 1,
    sellerName: 'Bramblefoot',
    itemId: Object.keys(ITEMS)[0],
    count: 1,
    price: 1234,
    mine: false,
    house: false,
  };
  const base: MarketInfo = {
    listings: [listing],
    totalCount: 1,
    filter: 'all',
    collectionCopper: 0,
    collectionItems: [],
    cutPct: 5,
    maxListings: 10,
    myListingCount: 0,
  };
  // The sim shape may carry extra server-only fields the view ignores; the client mirror
  // carries only the decoded fields (the offline-only-shape trap decision 15 catches).
  return shape === 'sim' ? ({ ...base, _serverSeq: 3 } as unknown as MarketInfo) : base;
}

describe('axe: market window (decision 15: Sim + ClientWorld shapes)', () => {
  for (const shape of ['sim', 'client'] as const) {
    it(`browse state is clean and names the dialog under the ${shape} shape`, async () => {
      const root = host('market-window');
      root.style.display = 'none';
      const win = new MarketWindow(
        stubDeps({
          root: () => root,
          world: () =>
            ({ marketInfo: marketInfo(shape), copper: 0, marketSearch: () => undefined }) as never,
          hideTooltip: () => undefined,
          captureFocus: () => null,
        }),
      );
      win.open();
      expect(root.getAttribute('role')).toBe('dialog');
      expect(root.getAttribute('aria-label')).toBe(t('itemUi.market.title'));
      // The async-results live region is persistent + polite (the lazy-load a11y fix).
      expect(root.querySelector('.mkt-status')?.getAttribute('role')).toBe('status');
      await expectClean(root);
    });
  }
});

// ---------------------------------------------------------------------------
// Bags (#bags-window) - the ad-hoc discard prompt, which P15b gave role=dialog +
// aria-modal + a self-contained Tab trap (appended to #prompt-stack, outside the bags root).
// ---------------------------------------------------------------------------

describe('axe: bags discard prompt', () => {
  it('is a clean, named modal dialog with a resolving label', async () => {
    const root = host('bags-window');
    root.style.display = 'none';
    // The ad-hoc prompts append to #prompt-stack, which must exist in the DOM.
    const stack = document.createElement('div');
    stack.id = 'prompt-stack';
    document.body.appendChild(stack);
    const win = new BagsWindow(
      stubDeps({
        root: () => root,
        world: () => ({ inventory: [], copper: 0 }) as never,
      }),
    );
    const itemId = Object.keys(ITEMS)[0];
    (
      win as unknown as { showDiscardItemPrompt(id: string, max: number): void }
    ).showDiscardItemPrompt(itemId, 5);
    const prompt = stack.querySelector('.discard-item-prompt') as HTMLElement | null;
    expect(prompt?.getAttribute('role')).toBe('dialog');
    expect(prompt?.getAttribute('aria-modal')).toBe('true');
    // aria-labelledby must resolve to the prompt's own title (not dangle).
    const lbl = prompt?.getAttribute('aria-labelledby');
    expect(lbl && prompt?.querySelector(`#${CSS.escape(lbl)}`)).toBeTruthy();
    await expectClean(stack);
  });
});
