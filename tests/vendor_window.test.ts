// @vitest-environment jsdom
//
// Behavioral guards for the vendor window painter (the pure sellable/buyback
// decisions are unit-tested in vendor_view.test.ts). These render the real DOM
// through the shared window-frame builder and assert: the frame chrome is
// stamped, the body uses the .list-rows / .item-cell grammar, interpolated item
// names pass through esc(), the empty stock state renders, the footer hosts the
// primary sell action, and the close control routes to the injected onClose dep.

import { describe, expect, it, vi } from 'vitest';
import type { ItemDef } from '../src/sim/types';
import type { VendorView } from '../src/ui/vendor_view';
import { renderVendorWindow, type VendorWindowDeps } from '../src/ui/vendor_window';

// Force a controllable item name so the esc() path is testable without depending
// on the tEntity resolver internals.
vi.mock('../src/ui/entity_i18n', () => ({
  itemDisplayName: () => '<img src=x onerror=alert(1)>',
}));

function item(id: string, quality: ItemDef['quality'] = 'common'): ItemDef {
  return {
    id,
    name: id,
    quality,
    kind: 'junk',
    slot: 'trinket',
    sellValue: 3,
    buyValue: 5,
  } as unknown as ItemDef;
}

function fakeDeps(overrides: Partial<VendorWindowDeps> = {}): VendorWindowDeps {
  return {
    itemIcon: () => '<img class="item-icon" alt="">',
    moneyHtml: (copper: number) => `<span class="money-inline">${copper}</span>`,
    itemTooltip: () => '<div>tt</div>',
    attachTooltip: () => {},
    hideTooltip: () => {},
    onBuy: () => {},
    onBuyBack: () => {},
    onSellJunk: () => {},
    onClose: () => {},
    sellJunk: { enabled: false, proceeds: 0 },
    ...overrides,
  };
}

function vendorEl(): HTMLElement {
  const el = document.createElement('div');
  el.id = 'vendor-window';
  el.className = 'window panel';
  document.body.classList.add('vendor-open');
  return el;
}

describe('renderVendorWindow: frame adoption', () => {
  it('stamps the shared window-frame chrome with a titlebar, body, footer, and close', () => {
    const el = vendorEl();
    renderVendorWindow(el, 'Gorznak', { goods: [], buyback: [] }, fakeDeps());
    expect(el.classList.contains('window-frame')).toBe(true);
    expect(el.getAttribute('role')).toBe('dialog');
    expect(el.querySelector('.window-titlebar')).not.toBeNull();
    expect(el.querySelector('.window-body')).not.toBeNull();
    expect(el.querySelector('.window-footer')).not.toBeNull();
    expect(el.querySelector('[data-window-close]')).not.toBeNull();
    expect(el.style.display).toBe('block');
  });

  it('sets the title to the merchant name (the frame builder cannot interpolate it)', () => {
    const el = vendorEl();
    renderVendorWindow(el, 'Gorznak', { goods: [], buyback: [] }, fakeDeps());
    expect(el.querySelector('.window-title')?.textContent).toContain('Gorznak');
  });

  it('reuses the frame on a second render instead of rebuilding it cold', () => {
    const el = vendorEl();
    renderVendorWindow(el, 'V', { goods: [], buyback: [] }, fakeDeps());
    const firstBody = el.querySelector('.window-body');
    renderVendorWindow(el, 'V', { goods: [], buyback: [] }, fakeDeps());
    expect(el.querySelector('.window-body')).toBe(firstBody);
    expect(el.querySelectorAll('.window-titlebar').length).toBe(1);
  });
});

describe('renderVendorWindow: body grammar', () => {
  it('renders goods as .list-rows / .item-cell with a rarity border and the money price', () => {
    const el = vendorEl();
    const moneyHtml = vi.fn((copper: number) => `<span class="money-inline">${copper}</span>`);
    const view: VendorView = {
      goods: [{ itemId: 'blade', item: item('blade', 'rare'), price: 25, quantity: 5 }],
      buyback: [],
    };
    renderVendorWindow(el, 'V', view, fakeDeps({ moneyHtml }));
    expect(el.querySelector('.window-body .list-rows')).not.toBeNull();
    const cell = el.querySelector<HTMLElement>('.item-cell');
    expect(cell?.getAttribute('data-quality')).toBe('rare');
    // stacked goods show the count in the cell corner
    expect(cell?.querySelector('.item-cell-count')?.textContent).toBe('5');
    expect(moneyHtml).toHaveBeenCalledWith(25);
    expect(el.querySelector('.vendor-row')?.getAttribute('aria-label')).toContain('Buy');
  });

  it('renders the empty-state for empty stock', () => {
    const el = vendorEl();
    renderVendorWindow(el, 'V', { goods: [], buyback: [] }, fakeDeps());
    expect(el.querySelector('.window-body .empty-state')).not.toBeNull();
  });

  it('escapes interpolated item names through esc() (no live injection)', () => {
    const el = vendorEl();
    const view: VendorView = {
      goods: [{ itemId: 'evil', item: item('evil'), price: 5, quantity: 1 }],
      buyback: [],
    };
    renderVendorWindow(el, 'V', view, fakeDeps());
    const name = el.querySelector('.vendor-row-name');
    expect(name?.querySelector('img')).toBeNull();
    expect(name?.innerHTML).toContain('&lt;img');
  });
});

describe('renderVendorWindow: footer action + callbacks', () => {
  it('styles the primary transactional action with .btn.is-primary in the footer', () => {
    const el = vendorEl();
    renderVendorWindow(
      el,
      'V',
      { goods: [], buyback: [] },
      fakeDeps({ sellJunk: { enabled: true, proceeds: 12 } }),
    );
    const btn = el.querySelector<HTMLButtonElement>('.window-footer .btn.is-primary');
    expect(btn).not.toBeNull();
    expect(btn?.disabled).toBe(false);
  });

  it('fires onBuy, onBuyBack, and onSellJunk through the injected deps', () => {
    const el = vendorEl();
    const onBuy = vi.fn();
    const onBuyBack = vi.fn();
    const onSellJunk = vi.fn();
    const view: VendorView = {
      goods: [{ itemId: 'blade', item: item('blade'), price: 5, quantity: 1 }],
      buyback: [{ itemId: 'ring', item: item('ring'), count: 1, price: 3 }],
    };
    renderVendorWindow(
      el,
      'V',
      view,
      fakeDeps({ onBuy, onBuyBack, onSellJunk, sellJunk: { enabled: true, proceeds: 9 } }),
    );
    el.querySelectorAll<HTMLButtonElement>('.vendor-row')[0].click();
    el.querySelectorAll<HTMLButtonElement>('.vendor-row')[1].click();
    el.querySelector<HTMLButtonElement>('.window-footer .vendor-sell')?.click();
    expect(onBuy).toHaveBeenCalledWith('blade');
    expect(onBuyBack).toHaveBeenCalledWith('ring');
    expect(onSellJunk).toHaveBeenCalledTimes(1);
  });

  it('routes the close control to the injected onClose dep', () => {
    const el = vendorEl();
    const onClose = vi.fn();
    renderVendorWindow(el, 'V', { goods: [], buyback: [] }, fakeDeps({ onClose }));
    el.querySelector<HTMLElement>('[data-window-close]')?.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
