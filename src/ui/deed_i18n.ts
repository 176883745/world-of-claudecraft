// Deed name / description / title localization (the talent_i18n entity-style
// pattern scoped to the Book of Deeds). The English source of truth is the
// DEEDS content table itself (name/desc on the def, the title string on its
// reward); this module adds the locale plumbing, and the release fill lives
// in DEED_LOCALE_TABLES (deed_i18n.newlocales.ts) without touching a single
// call site. An absent locale table or field still falls back to the
// authored English (clean English is preferable to a broken guess).

import { DEEDS } from '../sim/data';
import { DEED_LOCALE_DIALECT_OVERRIDES, DEED_LOCALE_TABLES } from './deed_i18n.newlocales';
import { getLanguage, type SupportedLanguage, t } from './i18n';

export type DeedTranslationField = 'name' | 'desc' | 'title';

/** Per-deed localized fields; any omitted field falls back to English. */
export interface DeedLocaleEntry {
  name?: string;
  desc?: string;
  /** The title-reward display string (only meaningful for title deeds). */
  title?: string;
}

export type DeedLocaleTable = Record<string, DeedLocaleEntry>;

// The release-fill table (the TALENT_NEW newlocales shape): one
// DeedLocaleTable per base locale, assembled here with es_ES and fr_CA
// inheriting their base locale (the talent_i18n localeText dialect model)
// under the few entries whose delve vocabulary genuinely diverges; en and
// en_CA resolve to the authored English in localeEntry before this map is
// consulted.
const DEED_LOCALES: Partial<Record<SupportedLanguage, DeedLocaleTable>> = {
  ...DEED_LOCALE_TABLES,
  es_ES: { ...DEED_LOCALE_TABLES.es, ...DEED_LOCALE_DIALECT_OVERRIDES.es_ES },
  fr_CA: { ...DEED_LOCALE_TABLES.fr_FR, ...DEED_LOCALE_DIALECT_OVERRIDES.fr_CA },
};

function localeEntry(id: string): DeedLocaleEntry | undefined {
  const lang = getLanguage();
  if (lang === 'en' || lang === 'en_CA') return undefined;
  return DEED_LOCALES[lang]?.[id];
}

/** Localized deed name; the raw id for a catalog-unknown id (content drift). */
export function deedName(id: string): string {
  const def = DEEDS[id];
  if (!def) return id;
  return localeEntry(id)?.name ?? def.name;
}

/** Localized deed description; '' for a catalog-unknown id. */
export function deedDesc(id: string): string {
  const def = DEEDS[id];
  if (!def) return '';
  return localeEntry(id)?.desc ?? def.desc;
}

/** The localized display title for a title-reward deed; '' when the deed is
 *  unknown or carries no title reward (callers hide the surface entirely). */
export function deedTitleText(id: string): string {
  const def = DEEDS[id];
  if (!def || def.reward?.kind !== 'title') return '';
  return localeEntry(id)?.title ?? def.reward.text;
}

/** The guild-chat news line for another player's marquee unlock, composed
 *  client-side from the id-based wire event (the server never sends deed
 *  English). Pure and Node-testable so the one HUD switch arm stays a thin
 *  log call. */
export function deedBroadcastLine(characterName: string, deedId: string): string {
  return t('hudChrome.deeds.broadcastLine', { name: characterName, deed: deedName(deedId) });
}

/** A player name decorated with their selected title through the
 *  hudChrome.deeds.titledName pattern (the locale owns bracket text AND
 *  placement). The bare name comes back for a null/absent/stale id or a
 *  non-title reward, so every consumer degrades to today's rendering. */
export function titledDisplayName(name: string, titleId: string | null | undefined): string {
  const title = titleId ? deedTitleText(titleId) : '';
  if (!title) return name;
  return t('hudChrome.deeds.titledName', { name, title });
}

/** The titledName pattern split around the name for surfaces that render the
 *  name and its title decoration in SEPARATE nodes (the target frame's
 *  differently-styled spans): `pre` is everything the locale places before
 *  the name, `post` everything after. Both '' when untitled/stale. A locale
 *  pattern that omits {name} entirely degrades to the whole rendered
 *  decoration after the name. */
export interface TitledNameDecoration {
  pre: string;
  post: string;
}

const UNTITLED_DECORATION: TitledNameDecoration = { pre: '', post: '' };

export function titledNameDecoration(titleId: string | null | undefined): TitledNameDecoration {
  const title = titleId ? deedTitleText(titleId) : '';
  if (!title) return UNTITLED_DECORATION;
  // A sentinel no locale pattern or title text can contain, so the split
  // around the interpolated name is exact even when the title has spaces.
  const NAME_TOKEN = '\u0000';
  const rendered = t('hudChrome.deeds.titledName', { name: NAME_TOKEN, title });
  const at = rendered.indexOf(NAME_TOKEN);
  if (at < 0) return { pre: '', post: ` ${rendered}` };
  return { pre: rendered.slice(0, at), post: rendered.slice(at + NAME_TOKEN.length) };
}

export interface DeedTranslationManifestEntry {
  id: string;
  field: DeedTranslationField;
  source: string;
}

/** Every (deed, field) pair the release fill must cover, with its English
 *  source (the talentTranslationManifest shape for coverage tooling). */
export function deedTranslationManifest(): DeedTranslationManifestEntry[] {
  const entries: DeedTranslationManifestEntry[] = [];
  for (const def of Object.values(DEEDS)) {
    entries.push({ id: def.id, field: 'name', source: def.name });
    entries.push({ id: def.id, field: 'desc', source: def.desc });
    if (def.reward?.kind === 'title') {
      entries.push({ id: def.id, field: 'title', source: def.reward.text });
    }
  }
  return entries;
}
