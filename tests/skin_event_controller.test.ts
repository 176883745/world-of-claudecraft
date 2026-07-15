import { describe, expect, it, vi } from 'vitest';
import type { FocusTrapHandle } from '../src/ui/focus_manager';
import { SkinEventController } from '../src/ui/hud/cosmetics/skin_event_controller';
import type { IWorld } from '../src/world_api';
import { FakeDocument } from './helpers/fake_dom';

function harness(reduceMotion = false) {
  const document = new FakeDocument();
  const scheduled = new Map<number, { callback: () => void; delay: number }>();
  let timerId = 0;
  const clearTimeout = vi.fn((id: number) => scheduled.delete(id));
  const window = {
    matchMedia: () => ({ matches: reduceMotion }),
    setTimeout: (callback: () => void, delay: number) => {
      const id = ++timerId;
      scheduled.set(id, { callback, delay });
      return id;
    },
    clearTimeout,
  } as unknown as Window;
  const release = vi.fn();
  const trap: FocusTrapHandle = { focusFirst: vi.fn(), release };
  const closeTop = vi
    .fn()
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValue(false);
  const audio = {
    bagOpen: vi.fn(),
    bagClose: vi.fn(),
    click: vi.fn(),
    levelUp: vi.fn(),
  };
  const controller = new SkinEventController({
    document: document as unknown as Document,
    window,
    world: () =>
      ({ cfg: { playerClass: 'warrior' }, claimEventSkin: vi.fn() }) as unknown as Pick<
        IWorld,
        'cfg' | 'claimEventSkin'
      >,
    closeTop,
    hideTooltip: vi.fn(),
    onPortraitsReady: vi.fn(),
    preloadMechAssets: vi.fn(() => Promise.resolve()),
    preview: { mount: vi.fn(), setSkin: vi.fn() },
    openFocusTrap: vi.fn(() => trap),
    attachTooltip: vi.fn(),
    showBanner: vi.fn(),
    renderBagsIfOpen: vi.fn(),
    random: () => 0.5,
    audio,
  });
  return { controller, document, scheduled, clearTimeout, closeTop, release, audio };
}

describe('SkinEventController', () => {
  it('closes stacked surfaces, opens a trapped wheel, and owns timed teardown', () => {
    const test = harness();

    test.controller.open('rare');

    expect(test.closeTop).toHaveBeenCalledTimes(3);
    expect(test.document.body.children).toHaveLength(1);
    expect(test.document.body.children[0].classList.contains('open')).toBe(true);
    expect([...test.scheduled.values()].map((timer) => timer.delay)).toEqual([6600]);
    expect(test.audio.bagOpen).toHaveBeenCalledTimes(1);

    test.controller.close();

    expect(test.document.body.children[0].classList.contains('open')).toBe(false);
    expect(test.clearTimeout).toHaveBeenCalledTimes(1);
    expect(test.release).toHaveBeenCalledTimes(1);
    expect(test.audio.bagClose).toHaveBeenCalledTimes(1);
  });

  it('uses the short reveal only for the reduced-motion preference', () => {
    const test = harness(true);

    test.controller.open('epic');

    expect([...test.scheduled.values()].map((timer) => timer.delay)).toEqual([140]);
  });
});
