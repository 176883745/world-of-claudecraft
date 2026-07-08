// Source-guard suite for the Book of Deeds window + tracker wiring (the
// bank_window.test.ts pattern): no-magic-values in the painters, the hud.ts
// orchestration pins (construction, Esc arm, slow band, language switch, the
// unlock batching), both entry HTMLs, the keybind dispatch chain, the
// renderer celebration arm, the nameplate title subtitle, and the CSS
// tap-target floors. Behavior of the pure core is covered in
// tests/deeds_view.test.ts; these pins keep the thin consumers honest.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const painter = readFileSync(new URL('../src/ui/deeds_window.ts', import.meta.url), 'utf8');
const tracker = readFileSync(new URL('../src/ui/deed_tracker_painter.ts', import.meta.url), 'utf8');
const hud = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const mainSrc = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
const inputSrc = readFileSync(new URL('../src/game/input.ts', import.meta.url), 'utf8');
const settingsSrc = readFileSync(new URL('../src/game/settings.ts', import.meta.url), 'utf8');
const rendererSrc = readFileSync(new URL('../src/render/renderer.ts', import.meta.url), 'utf8');
const nameplateSrc = readFileSync(
  new URL('../src/render/nameplate_painter.ts', import.meta.url),
  'utf8',
);
const chrome = readFileSync(
  new URL('../src/ui/i18n.catalog/hud_chrome.ts', import.meta.url),
  'utf8',
);
const components = readFileSync(new URL('../src/styles/components.css', import.meta.url), 'utf8');
const hudCss = readFileSync(new URL('../src/styles/hud.css', import.meta.url), 'utf8');
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const playHtml = readFileSync(new URL('../play.html', import.meta.url), 'utf8');

describe('painter hygiene', () => {
  it('keeps hex/px literals out of the painter TS (tokens and classes only)', () => {
    for (const [name, src] of [
      ['deeds_window.ts', painter],
      ['deed_tracker_painter.ts', tracker],
    ] as const) {
      // The lookahead keeps the '#deed-tracker' selector/comment mentions
      // (all-hex letters) from tripping the color scan.
      expect(src, `${name} must not hardcode a hex color`).not.toMatch(
        /#[0-9a-fA-F]{3,8}(?![\w-])/,
      );
      expect(src, `${name} must not hardcode a px literal`).not.toMatch(/'\d+px'/);
    }
  });

  it('contains no em/en dashes', () => {
    for (const src of [painter, tracker]) {
      // Unicode escapes: a literal dash here would itself trip the copy scan.
      expect(src).not.toMatch(/\u2014|\u2013/);
    }
  });

  it('never renders bare English (textContent/aria always via t())', () => {
    for (const src of [painter, tracker]) {
      expect(src).not.toMatch(/textContent = '/);
      expect(src).not.toMatch(/aria-label="(?!\$\{)/);
    }
  });

  it('persists the watchlist under the per-character woc_deed_watch key', () => {
    expect(painter).toContain("const DEED_WATCH_KEY_PREFIX = 'woc_deed_watch';");
    expect(painter).toMatch(
      /\$\{DEED_WATCH_KEY_PREFIX\}_\$\{world\.cfg\.playerClass\}_\$\{world\.player\.name\}/,
    );
  });

  it('routes every tracker refresh write through the writer facet', () => {
    // The one sanctioned raw write is the constructor's static-skeleton
    // innerHTML (see the HOT_PAINTERS allowance); refreshes use writers only.
    expect(tracker.match(/\.innerHTML/g)?.length).toBe(1);
    expect(tracker).toContain('w.setWidth(els.fill');
    expect(tracker).toContain("w.setDisplay(this.root, view.visible ? '' : 'none')");
  });

  it('sends title changes through the facet with no optimistic local copy', () => {
    expect(painter).toMatch(/world\(\)\.setActiveTitle\(id === '' \? null : id\)/);
    expect(painter).not.toMatch(/activeTitle\s*=/);
  });
});

describe('hud wiring', () => {
  it('constructs the window on the trapping windowFocus family', () => {
    expect(hud).toContain('new DeedsWindow({');
    expect(hud).toContain("...this.windowFocus('#deeds-window'),");
    expect(hud).toContain('onWatchChanged: () => this.updateDeedTracker(),');
  });

  it('routes Esc through the painter close (WCAG focus return)', () => {
    expect(hud).toMatch(/case 'deeds-window':[\s\S]{0,200}?this\.deedsWindow\.close\(\);/);
  });

  it('refreshes on the slow band and repaints on language switch', () => {
    expect(hud).toContain(
      'if (slowHud && this.deedsWindow.isOpen) this.deedsWindow.refreshIfChanged();',
    );
    expect(hud).toContain('if (slowHud) this.updateDeedTracker();');
    expect(hud).toContain('if (this.deedsWindow.isOpen) this.deedsWindow.render();');
  });

  it('accumulates deedUnlocked across the drain and batches AFTER the loop', () => {
    expect(hud).toMatch(/case 'deedUnlocked': \{\s*deedUnlocks\.push\(ev\);\s*break;/);
    expect(hud).toContain('if (deedUnlocks.length > 0) this.handleDeedUnlocks(deedUnlocks);');
    // The dead legacy arm is gone (the sim no longer emits it).
    expect(hud).not.toContain("case 'milestoneUnlocked'");
  });

  it('keeps the retro arm silent: one summary line, no banner, no audio', () => {
    const start = hud.indexOf('private handleDeedUnlocks(');
    const end = hud.indexOf('log(text: string', start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const body = hud.slice(start, end);
    // Banner and audio are gated on the PLAN's fresh-unlock fields; the retro
    // count only ever feeds the one localized summary log line.
    expect(body).toContain('if (plan.bannerId !== null)');
    expect(body).toContain('if (plan.playSound) audio.levelUp();');
    expect(body).toMatch(
      /if \(plan\.retroCount > 0\) \{\s*this\.log\(\s*t\('hudChrome\.deeds\.retroSummary'/,
    );
    expect(body.match(/showBanner/g)?.length).toBe(1);
    expect(body.match(/audio\.levelUp/g)?.length).toBe(1);
  });

  it('diverts chronicler interacts through the sim then opens the Chronicles section', () => {
    expect(hud).toMatch(
      /CHRONICLER_TEMPLATE_IDS[\s\S]{0,200}?this\.sim\.targetEntity\(npc\.id\);\s*this\.sim\.interact\(\);\s*this\.openDeeds\('chronicle'\);/,
    );
  });

  it('shows the active title and earned border badges on the character sheet', () => {
    expect(hud).toContain("t('hudChrome.deeds.charTitleLabel')");
    expect(hud).toContain('data-act="open-deeds"');
    expect(hud).toContain('class="ms-badge ms-deed-border"');
    expect(hud).toMatch(/reward\?\.kind === 'border' && sim\.deedsEarned\.has\(id\)/);
  });

  it('renders the inspected player title from the entity wire field', () => {
    expect(hud).toMatch(/e\.title && deedTitleText\(e\.title\) !== ''/);
    expect(hud).toContain('class="inspect-title"');
  });

  it('persists the tracker collapse as its own settings row', () => {
    expect(settingsSrc).toContain('deedTrackerCollapsed: { def: false },');
    expect(hud).toContain(
      "settings.set('deedTrackerCollapsed', !settings.get('deedTrackerCollapsed'));",
    );
  });
});

describe('entry HTMLs', () => {
  it('wires the window root and the tracker container in BOTH game entries', () => {
    for (const html of [indexHtml, playHtml]) {
      expect(html).toContain('id="deeds-window"');
      expect(html).toContain('<div id="deed-tracker" aria-hidden="true"></div>');
    }
  });
});

describe('keybind dispatch chain', () => {
  it('dispatches the deeds edge action end to end (keyboard and gamepad)', () => {
    expect(inputSrc).toMatch(/case 'deeds':\s*this\.cb\.onUiKey\('deeds'\);/);
    expect(mainSrc.match(/case 'deeds':\s*hud\.toggleDeeds\(\);/g)?.length).toBe(2);
  });
});

describe('renderer celebration + nameplate title', () => {
  it('fires one festival-gold burst for a fresh unlock and nothing for retro', () => {
    expect(rendererSrc).toMatch(/case 'deedUnlocked': \{[\s\S]{0,400}?if \(ev\.retro\) break;/);
    expect(rendererSrc).toMatch(
      /this\.vfx\.fireworkBurst\(this\.tmpV, FESTIVAL_GOLD_COLORS, 46, 1\.1\);/,
    );
    // One shared palette, two sites (the Vale Cup draw show reuses it).
    expect(rendererSrc).toContain(
      'const FESTIVAL_GOLD_COLORS: readonly number[] = [0xffd14d, 0xfff2c0];',
    );
    expect(rendererSrc.match(/FESTIVAL_GOLD_COLORS/g)?.length).toBe(3);
  });

  it('renders the title subtitle cheap-diffed per (language, title id)', () => {
    expect(nameplateSrc).toContain('private setNameplateTitle(');
    expect(nameplateSrc).toMatch(/`\$\{getLanguage\(\)\}\|\$\{titleId\}`/);
    expect(nameplateSrc).toContain(
      'this.setNameplateTitle(v, suppressSelf ? undefined : e.title);',
    );
    expect(rendererSrc).toContain("titleEl.className = 'np-title';");
    expect(rendererSrc).toContain("titleSig: '',");
    expect(hudCss).toMatch(/\.np-title \{/);
  });
});

describe('chrome keys and CSS floors', () => {
  it('has every t() key the painters reference', () => {
    const keys = new Set<string>();
    for (const src of [painter, tracker, hud]) {
      for (const m of src.matchAll(/hudChrome\.deeds\.([A-Za-z]+)/g)) keys.add(m[1]);
    }
    expect(keys.size).toBeGreaterThan(20);
    for (const key of keys) {
      expect(chrome, `missing hud_chrome key deeds.${key}`).toMatch(
        new RegExp(`\\b${key}:\\s*(?:'|\\n)`),
      );
    }
  });

  it('keeps the 40px touch floor on every deeds tap target', () => {
    expect(components).toMatch(/body\.mobile-touch \.deed-watch \{\s*min-height: 40px;/);
    expect(components).toMatch(/body\.mobile-touch \.deed-filter-chip \{\s*min-height: 40px;/);
    expect(components).toMatch(/body\.mobile-touch \.deed-title-option \{\s*min-height: 40px;/);
    expect(components).toMatch(/body\.mobile-touch \.deeds-cat \{\s*min-height: 40px;/);
    expect(hudCss).toMatch(
      /@media \(pointer: coarse\) \{\s*#deed-tracker \.dt-header \{\s*min-height: 40px;/,
    );
  });

  it('keeps the search input at the 16px iOS anti-zoom floor', () => {
    expect(components).toMatch(/\.deed-search \{[^}]*font-size: 16px/);
  });
});
