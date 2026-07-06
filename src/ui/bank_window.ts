// Bank window painter: owns the #bank-window DOM and paints the pooled bank
// (the Gilded Strongbox deposit box) from the structured BankViewModel
// (bank_view.ts). The pure core decides which state the snapshot is in and what
// slots / empty cells / buy-row it shows; this thin consumer renders that and
// wires withdraw / buy-slots back through IWorld. It holds no Sim reference and
// reaches into Hud only through its deps.
//
// Cold, event-driven window (the MailboxWindow shape): innerHTML rebuild on open,
// on a real bank-data change, and on a language switch; the .bank-grid scroll
// offset is preserved across rebuilds; nothing bank-related runs per frame in
// Hud.update()'s hot path (the slow-band refreshIfChanged line mirrors mailbox).
//
// NON-modal companion of the bags window: the window itself installs no focus
// trap (the bags-style capture-and-return deps), and only the buy-slots confirm
// and withdraw-quantity prompts trap (their own Tab cycle, appended to
// #prompt-stack). No raw hex: the item-quality color comes from the shared
// QUALITY_COLOR map and the unranked fallback is the --color-quality-default token.

import { audio } from '../game/audio';
import { ITEMS } from '../sim/data';
import type { IWorld } from '../world_api';
import {
  type BankBuySlotsModel,
  type BankSlotModel,
  bankSlotAction,
  buildBankView,
} from './bank_view';
import { markDialogRoot } from './dialog_root';
import { itemDisplayName } from './entity_i18n';
import { esc } from './esc';
import { FOCUSABLE_SELECTOR } from './focus_manager';
import { formatMoney, formatNumber, t } from './i18n';
import { QUALITY_COLOR } from './icons';
import type { PainterHostPresentation } from './painter_host';
import { svgIcon } from './ui_icons';

// The unranked quality fallback as a CSS custom property. The shared QUALITY_COLOR
// map carries the real per-quality hex; this token covers an item with no quality
// field, so no raw hex lives in the painter (mirrors bags' --bag-slot-quality).
const QUALITY_DEFAULT_COLOR = 'var(--color-quality-default)';

// Grace before a null bankInfo closes the window: online the bank mirror rides the
// proximity snapshot, so it can lag the open by about a tick (copies the mailbox's
// MAIL_INFO_GRACE_MS semantics with a bank-named constant, same 3000 value).
const BANK_INFO_GRACE_MS = 3_000;

// Monotonic id source for the ad-hoc prompt dialogs' aria-labelledby target, so the
// id never couples to class ordering (mirrors bags' promptDialogSeq).
let promptDialogSeq = 0;

// The confirm / quantity prompts mount into #prompt-stack (outside #bank-window). A
// window-level close() removes any that are open so it never leaves an orphaned
// aria-modal dialog floating over the closed window.
const BANK_PROMPT_SELECTOR = '.bank-quantity-prompt, .bank-buy-prompt';
function dismissBankPrompts(): void {
  for (const p of document.querySelectorAll(BANK_PROMPT_SELECTOR)) p.remove();
}

/**
 * Hud-supplied glue. The icon/money/tooltip painters are the shared
 * PainterHostPresentation bag (Hud builds it once and hands it to every window that
 * renders item rows); this composes that base and adds the bank surface: the world
 * reads/commands, the non-trapping focus capture/return, and the close/teardown
 * chrome. The module never reaches into Hud directly and never hardcodes the
 * window id (always deps.root()).
 */
export interface BankWindowDeps extends PainterHostPresentation {
  /** The #bank-window root (Hud owns the id; the painter stays instance-parameterized). */
  root(): HTMLElement;
  /** The live world (offline Sim or online ClientWorld mirror). */
  world(): IWorld;
  /** Close the sibling windows this one displaces (bank + bags cluster). */
  closeOthers(): void;
  hideTooltip(): void;
  // Non-modal focus capture/return (WCAG 2.4.3). The bank rides alongside the bags
  // window, so it does NOT trap focus; it only records its opener on open and returns
  // focus there on close. Wired to the FocusManager's activeFocusable / restore, NOT
  // the trap-installing windowFocus helper.
  captureFocus(): HTMLElement | null;
  restoreFocus(target: HTMLElement | null): void;
  /** Hud teardown after close() (drop the body docking class, resync bags). */
  onClosed(): void;
}

export class BankWindow {
  private opened = false;
  private lastSig = '';
  private openerFocus: HTMLElement | null = null;
  private openedAt = 0;

  constructor(private readonly deps: BankWindowDeps) {}

  get isOpen(): boolean {
    return this.opened;
  }

  open(): void {
    this.deps.closeOthers();
    this.openerFocus = this.deps.captureFocus();
    this.opened = true;
    this.lastSig = '';
    this.openedAt = performance.now();
    this.render();
    this.deps.root().style.display = 'flex';
    audio.bagOpen();
  }

  close(): void {
    if (!this.opened) return;
    // A confirm / quantity prompt is a modal CHILD that sets #bank-window inert. The
    // window can be force-closed out from under it (Esc / keybind), a path that never
    // runs the prompt's dismiss(); tear any open prompt down here so it is not left an
    // orphaned aria-modal dialog, then clear the inert it set (a hidden window must
    // never stay inert or the next open shows a dead grid).
    dismissBankPrompts();
    const el = this.deps.root();
    el.style.display = 'none';
    el.inert = false;
    this.opened = false;
    this.deps.hideTooltip();
    this.deps.restoreFocus(this.openerFocus);
    this.openerFocus = null;
    this.deps.onClosed();
  }

  render(): void {
    const el = this.deps.root();
    this.deps.hideTooltip();
    markDialogRoot(el, { label: t('hudChrome.bank.title') });
    // .bank-grid (not #bank-window) is the scroll container; it is recreated on every
    // rebuild, so capture its scroll offset and reapply it to the fresh grid, else a
    // withdraw snaps the list back to the top (the bags idiom).
    const prevScrollTop = el.querySelector('.bank-grid')?.scrollTop ?? 0;
    const model = buildBankView(this.deps.world().bankInfo, (id) => ITEMS[id]);
    el.innerHTML =
      `<div class="panel-title"><span>${esc(t('hudChrome.bank.title'))} <span class="panel-subtitle">${esc(t('hudChrome.bank.subtitle'))}</span></span>` +
      `<button type="button" class="x-btn" data-close aria-label="${esc(t('hudChrome.bank.close'))}">${svgIcon('close')}</button></div>`;
    el.querySelector('[data-close]')?.addEventListener('click', () => this.close());
    if (model.kind === 'away') {
      const away = document.createElement('div');
      away.className = 'bank-empty';
      away.textContent = t('hudChrome.bank.tooFar');
      el.appendChild(away);
      return;
    }
    const capacity = document.createElement('div');
    capacity.className = 'bank-capacity';
    const used = this.fmt(model.capacity.used);
    const total = this.fmt(model.capacity.total);
    capacity.textContent = t('hudChrome.bank.capacity', { used, total });
    capacity.setAttribute('aria-label', t('hudChrome.bank.capacityAria', { used, total }));
    el.appendChild(capacity);
    const grid = document.createElement('div');
    grid.className = 'bank-grid';
    this.fillGrid(grid, model.slots, model.emptyCells, model.empty);
    el.appendChild(grid);
    grid.scrollTop = prevScrollTop;
    el.appendChild(this.buildBuyRow(model.buy));
  }

  // Per-frame (slow divider): refresh the grid when the mirror changes; close when the
  // player walks away from the banker (the mirror goes null past BANKER_RANGE).
  refreshIfChanged(): void {
    if (!this.opened) return;
    const info = this.deps.world().bankInfo;
    if (!info) {
      if (performance.now() - this.openedAt > BANK_INFO_GRACE_MS) this.close();
      return;
    }
    const sig = JSON.stringify([
      info.capacity,
      info.purchasedSlots,
      info.bonusSlots,
      info.nextExpansionCost,
      info.slots,
    ]);
    if (sig === this.lastSig) return;
    this.lastSig = sig;
    this.render();
  }

  private fmt(n: number): string {
    return formatNumber(n, { maximumFractionDigits: 0 });
  }

  private fillGrid(
    grid: HTMLElement,
    slots: BankSlotModel[],
    emptyCells: number,
    empty: boolean,
  ): void {
    if (empty) {
      grid.innerHTML = `<div class="bank-empty">${esc(t('hudChrome.bank.empty'))}</div>`;
      return;
    }
    for (const slot of slots) {
      const item = ITEMS[slot.itemId];
      if (!item) continue;
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `bank-item q-${slot.qualityKey}`;
      const qColor = QUALITY_COLOR[slot.qualityKey] ?? QUALITY_DEFAULT_COLOR;
      cell.style.setProperty('--bank-slot-quality', qColor);
      const itemName = itemDisplayName(item);
      cell.setAttribute(
        'aria-label',
        t('itemUi.bags.itemAria', { item: itemName, count: this.fmt(slot.count) }),
      );
      cell.innerHTML = `${this.deps.itemIcon(item)}<span class="bank-count">${slot.showCount ? esc(t('itemUi.bags.stackCount', { count: this.fmt(slot.count) })) : ''}</span>`;
      cell.addEventListener('click', (ev) => this.onSlotClick(slot.slotIndex, ev.shiftKey));
      this.deps.attachTooltip(cell, () => {
        const partial = slot.showCount
          ? `<div class="tt-sub">${esc(t('hudChrome.bank.withdrawPartialHint'))}</div>`
          : '';
        return `${this.deps.itemTooltip(item)}<div class="tt-sub">${esc(t('hudChrome.bank.withdrawHint'))}</div>${partial}`;
      });
      grid.appendChild(cell);
    }
    // Free-slot squares: the classic empty sockets that make remaining capacity
    // visible at a glance. Decorative, not focusable (mirrors bags).
    for (let i = 0; i < emptyCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'bank-item empty';
      cell.setAttribute('aria-hidden', 'true');
      grid.appendChild(cell);
    }
  }

  // Plain click withdraws the whole stack; shift-click on a splittable stack opens a
  // quantity prompt. The pure bankSlotAction decides which (reading the live slot).
  private onSlotClick(slotIndex: number, shift: boolean): void {
    const slot = this.deps.world().bankInfo?.slots[slotIndex];
    const action = bankSlotAction(slot, slotIndex, shift);
    if (action.kind === 'withdraw') {
      this.deps.world().bankWithdraw(action.slotIndex);
      audio.click();
    } else if (action.kind === 'withdrawPartial') {
      this.showWithdrawQuantityPrompt(action.slotIndex, action.max);
    }
  }

  // The footer expansion row: the next block's price on a buy button, or a maxed
  // label when purchased slots are capped. Never gated on affordability (the sim is
  // authoritative and emits its own refusal line, localized by the existing pipeline).
  private buildBuyRow(buy: BankBuySlotsModel): HTMLElement {
    const row = document.createElement('div');
    row.className = 'bank-buy-row';
    if (buy.maxed || buy.nextCost === null) {
      const maxed = document.createElement('span');
      maxed.className = 'bank-buy-maxed';
      maxed.textContent = t('hudChrome.bank.buySlotsMaxed');
      row.appendChild(maxed);
      return row;
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bank-buy-btn';
    btn.innerHTML =
      `<span class="bank-buy-label">${esc(t('hudChrome.bank.buySlots', { count: this.fmt(buy.blockSlots) }))}</span>` +
      this.deps.moneyHtml(buy.nextCost);
    btn.addEventListener('click', () => this.showBuySlotsPrompt(buy));
    row.appendChild(btn);
    return row;
  }

  private showBuySlotsPrompt(buy: BankBuySlotsModel): void {
    if (buy.nextCost === null) return;
    dismissBankPrompts();
    const opener = document.activeElement as HTMLElement | null;
    const stack = document.getElementById('prompt-stack');
    if (!stack) return;
    const prompt = document.createElement('div');
    prompt.className = 'prompt panel bank-buy-prompt';
    prompt.innerHTML = `<div class="prompt-text">${esc(
      t('hudChrome.bank.buyConfirm', {
        count: this.fmt(buy.blockSlots),
        price: formatMoney(buy.nextCost),
      }),
    )}</div>`;
    const confirm = document.createElement('button');
    confirm.className = 'btn';
    confirm.textContent = t('hudChrome.bank.buyConfirmAccept');
    const cancel = document.createElement('button');
    cancel.className = 'btn';
    cancel.textContent = t('itemUi.vendor.sellQuantityCancel');
    const close = () => prompt.remove();
    prompt.append(confirm, cancel);
    const { dismiss, dismissAndReturn } = this.installPromptDialog(prompt, opener, close);
    confirm.addEventListener('click', () => {
      this.deps.world().bankBuySlots();
      audio.coin();
      dismiss();
      // render() rebuilds the window, detaching the opener button, so land focus on
      // the always-present close button rather than letting it fall to <body>.
      (this.deps.root().querySelector('[data-close]') as HTMLElement | null)?.focus();
    });
    cancel.addEventListener('click', dismissAndReturn);
    stack.appendChild(prompt);
    window.setTimeout(() => confirm.focus(), 0);
  }

  private showWithdrawQuantityPrompt(slotIndex: number, maxCount: number): void {
    dismissBankPrompts();
    const opener = document.activeElement as HTMLElement | null;
    const slot = this.deps.world().bankInfo?.slots[slotIndex];
    const item = slot ? ITEMS[slot.itemId] : undefined;
    const stack = document.getElementById('prompt-stack');
    if (!stack) return;
    const prompt = document.createElement('div');
    prompt.className = 'prompt panel bank-quantity-prompt';
    const itemName = item ? itemDisplayName(item) : (slot?.itemId ?? '');
    prompt.innerHTML = `<div class="prompt-text">${esc(t('hudChrome.bank.withdrawQuantityTitle', { item: itemName }))}</div>`;
    const input = document.createElement('input');
    input.className = 'prompt-number';
    input.type = 'number';
    input.setAttribute('aria-label', t('hudChrome.bank.withdrawQuantityInput'));
    input.min = '1';
    input.max = String(maxCount);
    input.step = '1';
    input.value = '1';
    const confirm = document.createElement('button');
    confirm.className = 'btn';
    confirm.textContent = t('hudChrome.bank.withdrawQuantityConfirm');
    const cancel = document.createElement('button');
    cancel.className = 'btn';
    cancel.textContent = t('itemUi.vendor.sellQuantityCancel');
    const close = () => prompt.remove();
    prompt.append(input, confirm, cancel);
    const { dismiss, dismissAndReturn } = this.installPromptDialog(prompt, opener, close);
    const submit = () => {
      const count = Math.max(1, Math.min(maxCount, Math.floor(Number(input.value) || 0)));
      this.deps.world().bankWithdraw(slotIndex, count);
      audio.click();
      dismiss();
      // The grid rebuilds on the withdraw event, detaching the opener slot, so land on
      // the always-present close button rather than dropping focus to <body>.
      (this.deps.root().querySelector('[data-close]') as HTMLElement | null)?.focus();
    };
    confirm.addEventListener('click', submit);
    cancel.addEventListener('click', dismissAndReturn);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
    stack.appendChild(prompt);
    window.setTimeout(() => {
      input.focus();
      input.select();
    }, 0);
  }

  // WCAG 2.2 AA modal prompt wiring (the bags installPromptDialog recipe): role=dialog
  // + aria-modal + aria-labelledby (the prompt text), a self-contained Tab cycle among
  // the prompt's controls (mounted in #prompt-stack, outside this window's reach, so
  // they own their own trap), an Escape close, and focus return to the opener. EVERY
  // teardown path routes through dismiss(), which clears the #bank-window inert this
  // sets BEFORE the prompt is removed; close() clears it too as a force-close backstop,
  // so the window is never left inert while hidden.
  private installPromptDialog(
    prompt: HTMLElement,
    opener: HTMLElement | null,
    close: () => void,
  ): { dismiss: () => void; dismissAndReturn: () => void } {
    prompt.setAttribute('role', 'dialog');
    prompt.setAttribute('aria-modal', 'true');
    const bankRoot = this.deps.root();
    bankRoot.inert = true;
    const titleEl = prompt.querySelector('.prompt-text') as HTMLElement | null;
    if (titleEl) {
      if (!titleEl.id) titleEl.id = `bank-prompt-title-${promptDialogSeq++}`;
      prompt.setAttribute('aria-labelledby', titleEl.id);
      // Name an unlabeled quantity field by the prompt's own question when it lacks a
      // dedicated aria-label (WCAG 1.3.1 / 4.1.2).
      const numInput = prompt.querySelector('.prompt-number');
      if (numInput && !numInput.hasAttribute('aria-label')) {
        numInput.setAttribute('aria-labelledby', titleEl.id);
      }
    }
    const dismiss = (): void => {
      bankRoot.inert = false;
      close();
    };
    const dismissAndReturn = (): void => {
      dismiss();
      opener?.focus();
    };
    prompt.addEventListener('keydown', (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key === 'Escape') {
        ke.preventDefault();
        dismissAndReturn();
        return;
      }
      if (ke.key !== 'Tab') return;
      const f = Array.from(prompt.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (ke.shiftKey && document.activeElement === first) {
        ke.preventDefault();
        last.focus();
      } else if (!ke.shiftKey && document.activeElement === last) {
        ke.preventDefault();
        first.focus();
      }
    });
    return { dismiss, dismissAndReturn };
  }
}
