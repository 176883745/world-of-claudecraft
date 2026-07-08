// Deed name / description / title localization (the talent_i18n entity-style
// pattern scoped to the Book of Deeds). The English source of truth is the
// DEEDS content table itself (name/desc on the def, the title string on its
// reward); this module adds the locale plumbing so the release-time fill
// lands entirely in DEED_LOCALES without touching a single call site.
// English-only today by design: an absent locale table or field falls back to
// the authored English (clean English is preferable to a broken guess; the
// release fill covers every locale at once).

import { DEEDS } from '../sim/data';
import { getLanguage, type SupportedLanguage } from './i18n';

export type DeedTranslationField = 'name' | 'desc' | 'title';

/** Per-deed localized fields; any omitted field falls back to English. */
export interface DeedLocaleEntry {
  name?: string;
  desc?: string;
  /** The title-reward display string (only meaningful for title deeds). */
  title?: string;
}

export type DeedLocaleTable = Record<string, DeedLocaleEntry>;

// The release-fill hook table (the TALENT_NEW newlocales shape): one
// DeedLocaleTable per non-English locale, keyed by deed id. Deliberately
// empty until the end-of-project translation pass.
const DEED_LOCALES: Partial<Record<SupportedLanguage, DeedLocaleTable>> = {};

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
