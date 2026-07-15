import { describe, expect, it, vi } from 'vitest';
import { FiestaController } from '../src/ui/hud/fiesta/fiesta_controller';
import type { FiestaMatchInfo, IWorld } from '../src/world_api';
import { FakeDocument } from './helpers/fake_dom';

function match(overrides: Partial<FiestaMatchInfo> = {}): FiestaMatchInfo {
  return {
    team: 'A',
    scoreA: 0,
    scoreB: 0,
    myScore: 0,
    theirScore: 0,
    scoreLimit: 3,
    wave: 1,
    totalWaves: 3,
    ring: { cx: 0, cz: 0, radius: 20 },
    down: false,
    respawnIn: 0,
    augments: [],
    offer: null,
    augmentPending: 0,
    teamA: [{ pid: 1, name: 'Aki', cls: 'warrior', kills: 0, down: false, me: true }],
    teamB: [{ pid: 2, name: 'Bex', cls: 'mage', kills: 0, down: false, me: false }],
    powerups: [],
    ...overrides,
  };
}

function harness() {
  const document = new FakeDocument();
  const ui = document.element('ui');
  const score = document.element('fiesta-score');
  const respawn = document.element('fiesta-respawn');
  const augments = document.element('fiesta-augments');
  const pending = document.element('fiesta-pending');
  const fiesta = match();
  const arenaInfo: {
    match: { state: 'active' | 'over'; fiesta: FiestaMatchInfo };
  } = {
    match: {
      state: 'active',
      fiesta,
    },
  };
  const world = {
    arenaInfo,
    arenaAugmentPick: vi.fn(),
  } as unknown as Pick<IWorld, 'arenaInfo' | 'arenaAugmentPick'>;
  const audio = {
    click: vi.fn(),
    scorePing: vi.fn(),
    revive: vi.fn(),
  };
  const scheduled: Array<{ callback: () => void; delayMs: number }> = [];
  const controller = new FiestaController({
    document: document as unknown as Document,
    world: () => world,
    audio,
    crestIconUrl: (playerClass) => `crest:${playerClass}`,
    random: () => 0.5,
    schedule: (callback, delayMs) => scheduled.push({ callback, delayMs }),
  });
  return {
    controller,
    document,
    ui,
    score,
    respawn,
    augments,
    pending,
    fiesta,
    arenaInfo,
    audio,
    scheduled,
  };
}

describe('FiestaController', () => {
  it('paints the active authoritative score without firing a synthetic score cue', () => {
    const test = harness();

    test.controller.update();

    expect(test.controller.isActive()).toBe(true);
    expect(test.score.innerHTML).toContain('fs-core');
    expect(test.audio.scorePing).not.toHaveBeenCalled();
  });

  it('cues and flashes only after a real score transition', () => {
    const test = harness();
    test.controller.update();
    test.fiesta.scoreA = 1;
    test.fiesta.myScore = 1;

    test.controller.update();

    expect(test.audio.scorePing).toHaveBeenCalledWith(true);
    expect(test.score.classList.contains('flash-mine')).toBe(true);
    expect(test.ui.children.some((child) => child.classList.contains('fiesta-confetti'))).toBe(
      true,
    );
    expect(test.scheduled.some(({ delayMs }) => delayMs === 2800)).toBe(true);
  });

  it('plays the revive cue only on the down-to-alive transition', () => {
    const test = harness();
    test.fiesta.down = true;
    test.fiesta.respawnIn = 4;
    test.controller.update();
    expect(test.respawn.style.display).toBe('flex');

    test.fiesta.down = false;
    test.fiesta.respawnIn = 0;
    test.controller.update();

    expect(test.audio.revive).toHaveBeenCalledTimes(1);
    expect(test.respawn.style.display).toBe('none');
  });

  it('tears down every transient surface when the mirrored match stops', () => {
    const test = harness();
    test.controller.update();
    test.arenaInfo.match.state = 'over';

    test.controller.update();

    expect(test.controller.isActive()).toBe(false);
    for (const element of [test.score, test.respawn, test.augments, test.pending]) {
      expect(element.style.display).toBe('none');
      expect(element.innerHTML).toBe('');
    }
  });

  it('localizes word metadata and owns the timed word-pop lifetime', () => {
    const test = harness();
    const parts = test.controller.wordParts('spree', 5);

    test.controller.wordPop(parts.text, parts.color, parts.tier);

    const pop = test.ui.children.find((child) => child.classList.contains('fiesta-word'));
    expect(pop?.textContent).toBe(parts.text);
    expect(test.scheduled.at(-1)?.delayMs).toBe(1400);
  });
});
