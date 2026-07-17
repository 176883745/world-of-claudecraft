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

    parent.replaceChildren();
    renderProfessionIdentityCard(
      parent,
      buildProfessionIdentityView({ ...identity, synced: false }),
    );
    expect(parent.textContent).toContain('Waiting for your crafting identity');
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
    expect(note?.textContent).toBeTruthy();
    expect(button?.contains(note ?? null)).toBe(false);
    expect(note?.parentElement?.classList.contains('crafting-recipe-item')).toBe(true);
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
});
