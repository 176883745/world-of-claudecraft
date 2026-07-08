// Watchlist HUD tracker painter (#deed-tracker): the small always-on strip
// under the quest tracker showing the player-chosen watched deeds with live
// progress. Slow-band, hot-adjacent: the static skeleton is built ONCE (a
// single innerHTML write, see the allowance in tests/hud_perf_budget.test.ts)
// and every refresh routes through the PainterHostWriters elided facet only
// (setText/setWidth/setDisplay/setAttr per line; a keyed line pool capped at
// DEED_WATCH_CAP, never innerHTML per refresh). The container is aria-hidden
// decoration (the chat log carries the durable unlock copy), so the collapse
// header stays out of the tab order; Hud owns its click delegation and the
// persisted collapse setting. Everything rendered here is player-chosen
// cosmetic information and none of it varies with the graphics tier.

import { deedName } from './deed_i18n';
import { DEED_WATCH_CAP, type DeedTrackerView } from './deeds_view';
import { formatNumber, t } from './i18n';
import type { PainterHostWriters } from './painter_host';

export interface DeedTrackerPainterDeps {
  /** The #deed-tracker container (Hud owns the id). */
  root(): HTMLElement;
  /** The shared write-elision facet (Hud's caches; one skip-rate). */
  writers: PainterHostWriters;
}

interface TrackerLineEls {
  line: HTMLElement;
  name: HTMLElement;
  bar: HTMLElement;
  fill: HTMLElement;
  count: HTMLElement;
}

export class DeedTrackerPainter {
  private readonly root: HTMLElement;
  private readonly header: HTMLElement;
  private readonly chevron: HTMLElement;
  private readonly label: HTMLElement;
  private readonly countEl: HTMLElement;
  private readonly list: HTMLElement;
  private readonly lines: TrackerLineEls[] = [];

  constructor(private readonly deps: DeedTrackerPainterDeps) {
    this.root = deps.root();
    // Static skeleton, built once (chrome only; every visible string is
    // painted through the elided writers below). The header is pointer-only
    // by design: the container is aria-hidden, so no tab stop.
    const lineHtml =
      `<div class="dt-line" style="display:none"><span class="dt-name"></span>` +
      `<span class="dt-bar"><span class="dt-bar-fill"></span></span>` +
      `<span class="dt-count"></span></div>`;
    this.root.innerHTML =
      `<button type="button" class="dt-header" tabindex="-1">` +
      `<span class="dt-chevron"></span><span class="dt-label"></span><span class="dt-tally"></span></button>` +
      `<div class="dt-list">${lineHtml.repeat(DEED_WATCH_CAP)}</div>`;
    this.header = this.root.querySelector('.dt-header') as HTMLElement;
    this.chevron = this.root.querySelector('.dt-chevron') as HTMLElement;
    this.label = this.root.querySelector('.dt-label') as HTMLElement;
    this.countEl = this.root.querySelector('.dt-tally') as HTMLElement;
    this.list = this.root.querySelector('.dt-list') as HTMLElement;
    for (const line of this.root.querySelectorAll<HTMLElement>('.dt-line')) {
      this.lines.push({
        line,
        name: line.querySelector('.dt-name') as HTMLElement,
        bar: line.querySelector('.dt-bar') as HTMLElement,
        fill: line.querySelector('.dt-bar-fill') as HTMLElement,
        count: line.querySelector('.dt-count') as HTMLElement,
      });
    }
  }

  /** Slow-band repaint from the reused tracker view (allocation-light core). */
  update(view: DeedTrackerView): void {
    const w = this.deps.writers;
    w.setDisplay(this.root, view.visible ? '' : 'none');
    if (!view.visible) return;
    w.setText(this.chevron, view.collapsed ? '▸' : '▾');
    w.setText(this.label, t('hudChrome.deeds.trackerLabel'));
    w.setText(this.countEl, t('hudChrome.questTracker.count', { count: this.fmt(view.count) }));
    w.setAttr(
      this.header,
      'title',
      t(view.collapsed ? 'hudChrome.deeds.expandHint' : 'hudChrome.deeds.collapseHint'),
    );
    w.setDisplay(this.list, view.collapsed ? 'none' : '');
    if (view.collapsed) return;
    for (let i = 0; i < this.lines.length; i++) {
      const els = this.lines[i];
      if (i >= view.count) {
        w.setDisplay(els.line, 'none');
        continue;
      }
      const line = view.lines[i];
      w.setDisplay(els.line, '');
      w.setText(els.name, deedName(line.id));
      if (line.hasProgress) {
        const pct = Math.round((line.current / line.target) * 100);
        w.setDisplay(els.bar, '');
        w.setWidth(els.fill, `${pct}%`);
        w.setText(
          els.count,
          t('hudChrome.deeds.progressText', {
            current: this.fmt(line.current),
            target: this.fmt(line.target),
          }),
        );
      } else {
        w.setDisplay(els.bar, 'none');
        w.setText(els.count, '');
      }
    }
  }

  private fmt(n: number): string {
    return formatNumber(n, { maximumFractionDigits: 0 });
  }
}
