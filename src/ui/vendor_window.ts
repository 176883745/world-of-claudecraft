// Thin DOM consumer for the vendor window.
//
// The consumer half of the pure-core + thin-consumer split: it paints
// #vendor-window from the structured VendorView (vendor_view.ts) and wires the
// buy / buyback / sell / close actions. It owns no state. The cross-window
// orchestration (which windows to close, bag re-centring, mobile teardown)
// stays in Hud because it needs Hud's private state; this module only renders
// one panel and reports clicks back through the injected callbacks.
//
// The chrome comes from the shared window-frame builder (window_frame.ts): a
// titlebar with a close control, a scrollable body, and a sticky footer that
// hosts the sell-junk money row. The frame is stamped cold at first open and
// reused on later repaints; only the goods / buyback lists and the footer action
// repaint per render. The body uses the AAA .list-rows / .item-cell grammar.

import { itemDisplayName } from './entity_i18n';
import { esc } from './esc';
import { formatMoney as formatLocalizedMoney, formatNumber, t } from './i18n';
import type { PainterHostPresentation } from './painter_host';
import type { VendorBuybackRow, VendorGoodsRow, VendorView } from './vendor_view';
import { renderWindowFrame, type WindowFrameParts } from './window_frame';
import type { WindowFrameDescriptor } from './window_frame_view';

// A closable, footer-bearing frame with no tab rail: goods and buyback render as
// sections of one scrollable body (behavior-preserving; the pre-redesign window
// had no tabs). Every key is reused from the existing vendor catalog.
const VENDOR_FRAME: WindowFrameDescriptor = {
  id: 'vendor-window',
  titleKey: 'itemUi.vendor.goodsTitle',
  closeLabelKey: 'itemUi.vendor.close',
  footer: true,
};

/**
 * Hud-supplied glue. The icon/money/tooltip painters are the shared
 * PainterHostPresentation bag (Hud builds it once and hands it to every window
 * that renders item rows); this composes that base and adds the vendor-specific
 * tooltip teardown, the buy/buyback/sell-junk/close dispatch, and the sell-junk
 * state. The module never reaches into Hud directly.
 */
export interface VendorWindowDeps extends PainterHostPresentation {
  hideTooltip(): void;
  onBuy(itemId: string): void;
  onBuyBack(itemId: string): void;
  onSellJunk(): void;
  onClose(): void;
  sellJunk: {
    enabled: boolean;
    proceeds: number;
  };
}

/**
 * Stamp the shared window frame cold at first open, then reuse it. The frame's
 * body being present is the marker; the Heroic Quartermaster shares this element
 * and replaces its innerHTML, so a missing body naturally forces a rebuild.
 */
function ensureFrame(el: HTMLElement, deps: VendorWindowDeps): WindowFrameParts {
  const body = el.querySelector<HTMLElement>('.window-body');
  if (body) {
    return {
      root: el,
      body,
      footer: el.querySelector<HTMLElement>('.window-footer'),
      tabButtons: [],
    };
  }
  return renderWindowFrame(el, VENDOR_FRAME, { onClose: () => deps.onClose() });
}

/** The rarity-bordered item cell: icon plus a count in the corner when stacked. */
function iconCellHtml(item: VendorGoodsRow['item'], count: number, deps: VendorWindowDeps): string {
  const quality = item.quality ?? 'common';
  const corner =
    count > 1
      ? `<span class="item-cell-count">${esc(formatNumber(count, { maximumFractionDigits: 0 }))}</span>`
      : '';
  return `<span class="item-cell" data-quality="${esc(quality)}">${deps.itemIcon(item)}${corner}</span>`;
}

function goodsRow(g: VendorGoodsRow, deps: VendorWindowDeps): HTMLButtonElement {
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'vendor-row';
  const price = formatLocalizedMoney(g.price);
  const itemName = itemDisplayName(g.item);
  // The visible count lives in the cell corner; the aria label keeps the stack
  // wording for screen readers.
  const stack =
    g.quantity > 1
      ? ` ${t('itemUi.bags.stackCount', { count: formatNumber(g.quantity, { maximumFractionDigits: 0 }) })}`
      : '';
  row.setAttribute(
    'aria-label',
    t('itemUi.vendor.buyAria', { item: `${itemName}${stack}`, price }),
  );
  row.innerHTML =
    `${iconCellHtml(g.item, g.quantity, deps)}` +
    `<span class="vendor-row-name">${esc(itemName)}</span>` +
    `<span class="vendor-row-price">${deps.moneyHtml(g.price)}</span>`;
  row.addEventListener('click', () => deps.onBuy(g.itemId));
  deps.attachTooltip(
    row,
    () =>
      `${deps.itemTooltip(g.item)}<div class="tt-sub">${esc(t('itemUi.tooltip.clickBuy'))}</div>`,
  );
  return row;
}

function buybackRow(b: VendorBuybackRow, deps: VendorWindowDeps): HTMLButtonElement {
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'vendor-row';
  const price = formatLocalizedMoney(b.price);
  const itemName = itemDisplayName(b.item);
  row.setAttribute('aria-label', t('itemUi.vendor.buybackAria', { item: itemName, price }));
  row.innerHTML =
    `${iconCellHtml(b.item, b.count, deps)}` +
    `<span class="vendor-row-name">${esc(itemName)}</span>` +
    `<span class="vendor-row-price">${deps.moneyHtml(b.price)}</span>`;
  row.addEventListener('click', () => deps.onBuyBack(b.itemId));
  deps.attachTooltip(
    row,
    () =>
      `${deps.itemTooltip(b.item)}<div class="tt-sub">${esc(t('itemUi.tooltip.clickBuyback'))}</div>`,
  );
  return row;
}

function emptyState(text: string): HTMLElement {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.textContent = text;
  return div;
}

function listRows(): HTMLElement {
  const list = document.createElement('div');
  list.className = 'list-rows';
  return list;
}

/** The primary transactional action: sell all junk. Shows the proceeds money. */
function sellJunkButton(deps: VendorWindowDeps): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn is-primary vendor-sell';
  btn.disabled = !deps.sellJunk.enabled;
  btn.innerHTML =
    `<span class="vendor-row-name">${esc(t('itemUi.vendor.sellJunk'))}</span>` +
    (deps.sellJunk.enabled
      ? `<span class="vendor-row-price">${deps.moneyHtml(deps.sellJunk.proceeds)}</span>`
      : '');
  btn.setAttribute(
    'aria-label',
    deps.sellJunk.enabled
      ? t('itemUi.vendor.sellJunkAria', { price: formatLocalizedMoney(deps.sellJunk.proceeds) })
      : t('itemUi.vendor.sellJunk'),
  );
  btn.addEventListener('click', () => deps.onSellJunk());
  deps.attachTooltip(
    btn,
    () => `<div class="tt-sub">${esc(t('itemUi.vendor.sellJunkHint'))}</div>`,
  );
  return btn;
}

/** Paint the vendor panel from a prepared view. */
export function renderVendorWindow(
  el: HTMLElement,
  vendorName: string,
  view: VendorView,
  deps: VendorWindowDeps,
): void {
  // The rebuild replaces the hovered row (its mouseleave never fires) and can
  // collapse the scrolled list; drop the tooltip and restore the scroll.
  deps.hideTooltip();
  const scrollTop = el.scrollTop;

  const { body, footer } = ensureFrame(el, deps);

  // The frame builder resolves the title key WITHOUT interpolation values, but
  // the vendor title carries the merchant name ({name}: Goods); set it here
  // (textContent is auto-escaped) reusing the same key with the value.
  const titleEl = el.querySelector<HTMLElement>('.window-title');
  if (titleEl) titleEl.textContent = t('itemUi.vendor.goodsTitle', { name: vendorName });

  body.innerHTML = '';
  if (view.goods.length === 0) {
    // Reuse the existing generic "No items" key rather than mint a new one.
    body.appendChild(emptyState(t('itemUi.vendor.buybackEmpty')));
  } else {
    const list = listRows();
    for (const g of view.goods) list.appendChild(goodsRow(g, deps));
    body.appendChild(list);
  }

  const buybackTitle = document.createElement('div');
  buybackTitle.className = 'vendor-section';
  buybackTitle.textContent = t('itemUi.vendor.buybackTitle');
  body.appendChild(buybackTitle);
  if (view.buyback.length === 0) {
    body.appendChild(emptyState(t('itemUi.vendor.buybackEmpty')));
  } else {
    const list = listRows();
    for (const b of view.buyback) list.appendChild(buybackRow(b, deps));
    body.appendChild(list);
  }

  const hint = document.createElement('p');
  hint.className = 'vendor-note';
  hint.textContent = t('itemUi.vendor.hint');
  body.appendChild(hint);

  if (footer) {
    footer.innerHTML = '';
    footer.appendChild(sellJunkButton(deps));
  }

  el.style.display = 'block';
  el.scrollTop = scrollTop;
}
