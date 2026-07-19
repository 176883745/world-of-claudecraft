// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { renderCraftingWindow } from '../src/ui/crafting_window';
import { renderProfessionIdentityCard } from '../src/ui/profession_identity_card';
import { buildProfessionIdentityView } from '../src/ui/profession_identity_view';

const painter = readFileSync(
  path.resolve(process.cwd(), 'src/ui/profession_identity_card.ts'),
  'utf8',
);
const craftingWindow = readFileSync(
  path.resolve(process.cwd(), 'src/ui/crafting_window.ts'),
  'utf8',
);

describe('profession identity card painter contract', () => {
  it('renders syncing and attuned identity models into labelled, populated regions', () => {
    const parent = document.createElement('div');
    const identity = {
      version: 1 as const,
      synced: true,
      craftSkills: { armorcrafting: 49, weaponcrafting: 25, cooking: 30 },
      activeArchetype: 'armorcrafting',
      pairedMajor: 'weaponcrafting',
      hobbyCraft: 'leatherworking',
      attunedPairs: ['weaponcrafting+armorcrafting'],
      switchCount: 1,
      amendsProgress: 0,
      amendsRequired: 8,
    };

    renderProfessionIdentityCard(parent, buildProfessionIdentityView(identity));
    const card = parent.querySelector<HTMLElement>('.profession-identity-card');
    expect(card?.getAttribute('role')).toBe('region');
    expect(card?.getAttribute('aria-label')).toBeTruthy();
    expect(card?.querySelectorAll('.profession-skill-row')).toHaveLength(10);
    // The title line renders the PAIR archetype name (weaponcrafting +
    // armorcrafting is the Smith pair); the skill rows render craft names.
    expect(card?.textContent).toContain('Smith');
    expect(card?.textContent).toContain('Armorcrafting');
    // One visual column-header row over the skill list, hidden from the
    // accessibility tree (each row reads as the full skillAria sentence).
    const header = card?.querySelectorAll<HTMLElement>('.profession-skill-header');
    expect(header).toHaveLength(1);
    expect(header?.[0].getAttribute('aria-hidden')).toBe('true');
    const headerLabels = [...(header?.[0].querySelectorAll('span') ?? [])].map(
      (s) => s.textContent,
    );
    expect(headerLabels).toEqual(['Craft', 'Skill', 'Role', 'Cap']);

    parent.replaceChildren();
    renderProfessionIdentityCard(
      parent,
      buildProfessionIdentityView({ ...identity, synced: false }),
    );
    expect(parent.textContent).toContain('Waiting for your crafting identity');
    // The syncing card has no skill rows, so no floating header row either.
    expect(parent.querySelectorAll('.profession-skill-header')).toHaveLength(0);
  });

  it('renders combo guidance outside the faded disabled craft button', () => {
    const parent = document.createElement('div');
    renderCraftingWindow(
      parent,
      {
        recipes: [
          {
            recipeId: 'combo_recipe',
            professionId: 'armorcrafting',
            resultItemId: 'combo_result',
            resultCount: 1,
            reagents: [],
            skillReq: 50,
            difficulty: 'reduced',
            station: null,
            craftable: false,
            comboRequirement: {
              craftA: 'armorcrafting',
              craftB: 'weaponcrafting',
              minTier: 2,
              met: false,
              reason: 'not_attuned',
              unmetCrafts: [],
            },
          },
        ],
      },
      {
        hideTooltip: vi.fn(),
        onCraft: vi.fn(),
        onClose: vi.fn(),
        itemIcon: vi.fn(() => ''),
        moneyHtml: vi.fn(() => ''),
        itemTooltip: vi.fn(() => ''),
        attachTooltip: vi.fn(),
      },
    );

    const button = parent.querySelector<HTMLButtonElement>('button.vendor-item');
    const note = parent.querySelector<HTMLElement>('.crafting-combo-requirement');
    expect(button?.disabled).toBe(true);
    // The rendered guidance is the localized copy for the given reason
    // (not_attuned), so a wrong or empty reason string reddens here.
    expect(note?.textContent).toContain('Choose an archetype pair first.');
    expect(button?.contains(note ?? null)).toBe(false);
    expect(note?.parentElement?.classList.contains('crafting-recipe-item')).toBe(true);

    // Phase 6 legibility on the same row: the skill-req line and the
    // difficulty LABEL render inside the button, and the difficulty is never
    // color-only (the tinted span carries the localized text, and the aria
    // name repeats both).
    const skillLine = button?.querySelector<HTMLElement>('.crafting-skill-line');
    const difficulty = button?.querySelector<HTMLElement>('.crafting-difficulty');
    expect(skillLine?.textContent).toContain('Requires Armorcrafting 50');
    expect(difficulty?.getAttribute('data-difficulty')).toBe('reduced');
    expect(difficulty?.textContent).toBe('Reduced skill gain');
    expect(button?.getAttribute('aria-label')).toContain('Requires Armorcrafting 50');
    expect(button?.getAttribute('aria-label')).toContain('Reduced skill gain');
    // A station-free recipe renders no station badge and no station note.
    expect(button?.querySelector('.crafting-station-badge')).toBeNull();
    expect(parent.querySelector('.crafting-station-requirement')).toBeNull();
  });

  it('renders the station badge and an out-of-range reason outside the disabled button', () => {
    const parent = document.createElement('div');
    renderCraftingWindow(
      parent,
      {
        recipes: [
          {
            recipeId: 'station_recipe',
            professionId: 'engineering',
            resultItemId: 'station_result',
            resultCount: 1,
            reagents: [],
            skillReq: 0,
            difficulty: 'full',
            station: { required: true, inRange: false },
            craftable: false,
          },
        ],
      },
      {
        hideTooltip: vi.fn(),
        onCraft: vi.fn(),
        onClose: vi.fn(),
        itemIcon: vi.fn(() => ''),
        moneyHtml: vi.fn(() => ''),
        itemTooltip: vi.fn(() => ''),
        attachTooltip: vi.fn(),
      },
    );

    const button = parent.querySelector<HTMLButtonElement>('button.vendor-item');
    const badge = button?.querySelector<HTMLElement>('.crafting-station-badge');
    const stationNote = parent.querySelector<HTMLElement>('.crafting-station-requirement');
    expect(button?.disabled).toBe(true);
    expect(badge?.textContent).toBe('Station');
    expect(badge?.classList.contains('out-of-range')).toBe(true);
    // Never a bare disabled button: the reason text sits ADJACENT, outside the
    // button's :disabled opacity (the combo-note pattern), and the aria name
    // carries the same sentence for non-visual users.
    expect(stationNote?.textContent).toBe('Move to the crafting hub station to craft this.');
    expect(button?.contains(stationNote ?? null)).toBe(false);
    expect(button?.getAttribute('aria-label')).toContain(
      'Move to the crafting hub station to craft this.',
    );
    // Full-gain difficulty still renders its text label (never color-only).
    expect(button?.querySelector('.crafting-difficulty')?.textContent).toBe('Full skill gain');
  });

  it('renders localized visible identity, cap, tutorial, and nudge text', () => {
    expect(painter).toContain("t('hudChrome.crafting.identity.title')");
    expect(painter).toContain('identity.ceiling');
    expect(painter).toContain('identity.tutorial');
    expect(painter).toContain('identity.nearTier');
    expect(painter).toContain('identity.dormantKnowledge');
  });

  it('provides a labelled region and skill-list accessible text', () => {
    expect(painter).toContain("setAttribute('role', 'region')");
    expect(painter).toContain('aria-label');
    expect(painter).toContain('role="list"');
  });

  it('is integrated into the crafting window above recipe sections', () => {
    expect(craftingWindow).toContain('renderProfessionIdentityCard(');
    expect(craftingWindow.indexOf('renderProfessionIdentityCard(')).toBeLessThan(
      craftingWindow.indexOf('const sections = new Map'),
    );
  });

  // The card is a cold *_card consumer (not a *_painter.ts), so it escapes the
  // per-painter no-magic sweep in hud_perf_budget; this source scan carries the
  // same contract: colors and sizes live in the stylesheet, never in TS.
  it('carries no literal hex or rgb color in TS (no-magic-values contract)', () => {
    const code = painter.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    const hex = code.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    const rgb = code.match(/\brgba?\s*\(/g) ?? [];
    expect(hex, `hex colors: ${hex.join(', ')}`).toEqual([]);
    expect(rgb, `rgb colors: ${rgb.join(', ')}`).toEqual([]);
  });
});
