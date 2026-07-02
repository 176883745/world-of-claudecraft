# 02 — Shared working memory (live integration log)

> Fresh log, seeded at START (nothing renamed yet). Forward-looking only; NOT the source of
> truth. **The authoritative current contract is the code + the gates:** the LOCKED `NAME-MAP.md`
> (every old -> new string), `tests/ip_scrub.test.ts` (the verbatim-name scanner + its worklist),
> `tests/parity` (behavior unchanged), `tests/i18n_resolved_equivalence.test.ts` (the SHA gate).
> Read those for exact names/ids. This file is the running summary + the append-only registries.
>
> Read order each session: `README.md` (goal, surface map, scope) + `00-SHARED-CONVENTIONS.md`
> (rules, regen sequence, prime directive) + the LOCKED `NAME-MAP.md` FIRST. Do not re-derive
> what those hold.

## Status board (execution order: gate -> map -> tracks -> finale)
| ID | Title | Track | Mode | Status | Branch @ commit |
|----|-------|-------|------|--------|-----------------|
| G0 | De-IP gate + verbatim-name scanner | Spine | plain | done-on-track (2026-07-02; scanner RED by design: 142 baseline violations; all behavior gates green) | feature/ip-pivot @ G0 commit |
| G1 | Generate + lock the NAME-MAP | Spine | ULTRACODE | done-on-track (2026-07-02; 588 map rows, 603 names adversarially screened, 2 skeptic refutations fixed; scanner arms the full map: 812 RED baseline; old-column 100% hit-verified; AWAITING OPERATOR LOCK) | feature/ip-pivot @ G1 commit |
| V1 | Ability / spell rename | Vocab | plain | done-on-track (2026-07-02; all 146 ability renames + amendment #2 applied; 20 V1 scanner rows cleared (zero abilities.* hits); goldens re-minted via UPDATE_PARITY=1; reverse-map re-digest proof green 49/49 (tests/parity/rename_state_proof.test.ts, RENAME_PROOF=1); inspector --allow-state-hashes: violations 0) | track/ip-vocab @ V1 commit |
| V2 | Talent + spec/tree rename | Vocab | plain | done-on-track (2026-07-02; all 387 map rows applied: 27 trees + 26 masteries + 196 talents + 138 choices, kept-originals untouched; ids proven frozen; talent descriptions re-pointed at V1 ability names; talent_i18n titleOverrides re-keyed to new English keys across 19 locales, stale values kept for Z1; V1 QA 7 orphaned talent names resolved, tests/localization_fixes GREEN; parity goldens BYTE-IDENTICAL (no re-mint; inspector 0 changed / 0 violations); talents.* scanner 453 -> 7 (all 22 V2 worklist rows cleared; residuals are map-mandated collisions, see V2 slice notes); authorized gate-text edit in tests/talent_tooltip_accuracy.test.ts (Arcane Shot / Concussive Shot -> Fell Shot / Rattling Shot)) | track/ip-vocab @ V2 commit |
| C1 | Creatures + coined family-id sweep | Creatures | ULTRACODE | not-started | — |
| C2 | Warlock demon-pet re-theme + pet-id sweep | Creatures | ULTRACODE | not-started | — |
| W1 | Item / set / augment rename | World | plain | not-started | — |
| W2 | Mob mechanic / aura name rename | World | plain | not-started | — |
| T1 | De-brand comments / docs / realm copy | Text | plain | not-started | — |
| Z1 | Integrate + regen + scanner-zero + release-fill handoff | Finale | plain | not-started | — |

Status values: `not-started` -> `in-progress (<who>)` -> `done-on-track (<branch> @ <sha>)` ->
`merged (<integration-sha>)`.

## NAME-MAP lock state (owned by G1) — the #1 cross-slice contract
- [x] G1 has filled every Coverage-checklist row in `NAME-MAP.md` (2026-07-02).
- [x] Operator has reviewed and flipped `NAME-MAP.md` STATUS to **LOCKED** (2026-07-02).
  Decisions at lock: all former generic-keep? rows decided (5 keeps: Sap, Smite, Claw, Dash,
  Rip; Wolf Form and Blessed Tallow keep their text); Mogger cluster KEPT as parody with the
  operator-authorized removal of 'Mogger' from the scanner HARDCODED_VERBATIM (same commit);
  Tunnel Rat Digger renamed (Deeprock Digger); Brandt greeting reworded; tier sets renamed
  (Barrowlord/Nightfang/Mournweave/Bonewrought/Direfang/Wraithfire/Galecall); realm word =
  "World"; ~35 SEO-mined names adopted (Semrush-verified + adversarially screened) incl.
  pairing cascades - see the map's lock header for the list.
- [x] Post-lock operator amendment (2026-07-02, final): ~22 new-name refinements from the
  operator's workbook margin notes (Quaking Slam, Bewitch, Icebind, Mending Waters, Menace,
  Lunar Tempest, specs Fieldcraft/Thundercall/Warspirit, unified X's-Guise aspects, ...);
  three operator suggestions declined for IP (Guardian, Ironeye, Thunderlord). Old/armed
  columns untouched - scanner baseline stays 920. Map final and frozen from here.
- Until both are checked, NO V/C/W/T slice may start. Append-only after LOCK; a slice needing a
  missing string STOPS and appends a request row here for the operator, never invents a name.

## OPERATOR RULING - parity goldens under rename (2026-07-02, Phase 4)
V1 and W1 independently proved the goldens' per-checkpoint `events` digests fold event TEXT
(display names embedded), so ANY display rename shifts them while every state hash, RNG
draw-order fingerprint, draw count and nextId stays byte-identical. Operator extended the
C1/C2 golden exception to ALL rename slices: re-mint with UPDATE_PARITY=1, then
`node ip-refactor/golden_token_inspector.mjs <worktree>` MUST pass before commit; the four
hardcoded old names in tests/parity/coverage.test.ts update to their new names (authorized
gate-text edit). Integrator re-mints on the merged tree in Phase 5; Z1 inspector-verifies the
final goldens. Map amendment #2 in the same ruling: Quaking Blow / Armor Shear / Oath of Iron
/ Seething Fury (+ pairings) and polymorph critter sheep -> toad.

RULING ADDENDUM (2026-07-02, same principle): V1 proved Aura.name (the ability display name)
also flows into per-frame STATE digests, and built the stronger machine proof: reverse-mapping
every golden string leaf new->old via the locked map and re-digesting reproduces the baseline
hashes exactly (49/49 frames). Sanction extended: state-hash deltas are allowed ONLY with a
passing reverse-map re-digest proof, committed as the env-gated
tests/parity/rename_state_proof.test.ts (RENAME_PROOF=1); the inspector accepts them only
under --allow-state-hashes, and slice QA re-runs BOTH the proof and the inspector.

## Scanner worklist registry (owned by G0) — the verbatim names still present
> G0 seeds this from the RED baseline (the names `tests/ip_scrub.test.ts` currently flags). Each
> track ticks the entries it clears. Z1 requires the whole list ticked (scanner fully green).

Seeded by G0 on 2026-07-02 from the RED baseline: **142 violations** across the armed
denylist (`npx vitest run tests/ip_scrub.test.ts`). Counts are baseline occurrence counts over
BOTH English layers (sim content `.name` fields + the resolved-en table's name/title fields).
Rows are per (denylist entry x owning slice), disambiguated by the FIELD each hit lands in:
ability-name fields are V1's, talent/spec-tree fields are V2's, mob mechanic/aura `.name`
fields (`mobs.<id>.mortalStrike/petSpell/stomp/purgeOnHit.name`) are W2's - so a shared name
(Mortal Strike, Fireball, Judgement, ...) appears once per owner and each track ticks only its
own row. A track's row is cleared when the scanner reports zero hits for that entry in that
track's fields.

**v0.19.0 additions screening (G0, 2026-07-02):** `git diff release/v0.18.0..release/v0.19.0
-- src/sim/content/ src/ui/i18n.catalog/` is EMPTY (that release changed CI tooling only), so
there are ZERO "v0.19.0 additions - need NAME-MAP rows". Nothing extra for G1.

The NAME-MAP is still PROPOSED/DRAFT, so this seed = the hardcoded verbatim-WoW list + the
map's sample rows. G1's LOCK finalizes the `old`-column source; any row it adds/flips arms or
disarms in the scanner automatically (the scanner re-parses the map at each run), so THE
BASELINE COUNT WILL GROW at G1 lock (verbatim ability names like Battle Shout, Hamstring,
Overpower, Frost Nova, Arcane Intellect, Holy Light, Arcane Shot, Frost Shock, Faerie Fire,
... are in the tree today but unarmed until their map rows exist).

| denylist entry | owning slice | baseline hits | cleared? |
|---|---|---|---|
| Heroic Strike (ability-name fields) | V1 | 2 | [x] |
| Mortal Strike (ability-name fields) | V1 | 2 | [x] |
| Sinister Strike (ability-name fields) | V1 | 2 | [x] |
| Sunder Armor (ability-name fields) | V1 | 2 | [x] |
| Thunder Clap (ability-name fields) | V1 | 2 | [x] |
| Bloodthirst (ability-name fields) | V1 | 2 | [x] |
| Shield Slam (ability-name fields) | V1 | 2 | [x] |
| Fireball (ability-name fields) | V1 | 2 | [x] |
| Frostbolt (ability-name fields) | V1 | 2 | [x] |
| Pyroblast | V1 | 2 | [x] |
| Arcane Missiles (ability-name fields) | V1 | 2 | [x] |
| Polymorph (ability-name fields) | V1 | 2 | [x] |
| Ice Barrier (ability-name fields) | V1 | 2 | [x] |
| Eviscerate (ability-name fields) | V1 | 2 | [x] |
| Slice and Dice | V1 | 2 | [x] |
| Judgement (ability-name fields) | V1 | 2 | [x] |
| Hammer of Justice | V1 | 2 | [x] |
| Lay on Hands (ability-name fields) | V1 | 2 | [x] |
| Consecration | V1 | 2 | [x] |
| Mind Blast (ability-name fields) | V1 | 2 | [x] |
| Arcane (tree, whole-value) | V2 | 1 | [x] |
| Fire (tree, whole-value) | V2 | 1 | [x] |
| Frost (tree, whole-value) | V2 | 1 | [x] |
| Holy (tree, whole-value) | V2 | 2 | [x] |
| Blessing of Sanctuary | V2 | 1 | [x] |
| Ardent Defender | V2 | 1 | [x] |
| Improved Fireball | V2 | 1 | [x] |
| Heroic Strike (talent-name fields) | V2 | 1 | [x] |
| Mortal Strike (talent-name fields) | V2 | 1 | [x] |
| Sinister Strike (talent-name fields) | V2 | 1 | [x] |
| Sunder Armor (talent-name fields) | V2 | 1 | [x] |
| Thunder Clap (talent-name fields) | V2 | 2 | [x] |
| Bloodthirst (talent-name fields) | V2 | 1 | [x] |
| Shield Slam (talent-name fields) | V2 | 1 | [x] |
| Fireball (talent-name fields) | V2 | 1 | [x] |
| Frostbolt (talent-name fields) | V2 | 1 | [x] |
| Arcane Missiles (talent-name fields) | V2 | 1 | [x] |
| Polymorph (talent-name fields) | V2 | 1 | [x] |
| Ice Barrier (talent-name fields) | V2 | 1 | [x] |
| Eviscerate (talent-name fields) | V2 | 1 | [x] |
| Judgement (talent-name fields) | V2 | 2 | [x] |
| Lay on Hands (talent-name fields) | V2 | 1 | [x] |
| Murloc | C1 | 2 | [ ] |
| murloc (prose, word-boundary) | C1 | 6 | [ ] |
| Slimy Murloc Scale | C1 | 2 | [ ] |
| candle-headed (prose) | C1 | 2 | [ ] |
| Tallow Candle | C1 | 2 | [ ] |
| Tallow Candle (prose) | C1 | 0 (belt-and-braces) | [ ] |
| Bristleback | C1 | 4 | [ ] |
| Bristleback Maul | C1 | 2 | [ ] |
| Bristleback Hides | C1 | 2 | [ ] |
| bristleback (prose, word-boundary) | C1 | 0 (belt-and-braces) | [ ] |
| Drakonid | C1 | 2 | [ ] |
| Sanctum Drakonid | C1 | 2 | [ ] |
| Mogger | C1 | 13 | n/a - operator KEEP (parody); scanner entry removed at lock |
| Imp | C2 | 4 | [ ] |
| Voidwalker | C2 | 4 | [ ] |
| Succubus | C2 | 4 | [ ] |
| Felhunter | C2 | 4 | [ ] |
| Felguard | C2 | 4 | [ ] |
| Infernal | C2 | 4 | [ ] |
| Doomguard | C2 | 4 | [ ] |
| Shadowmeld | W1 | 2 | [ ] |
| Shadowmeld Tunic | W1 | 2 | [ ] |
| Lightwell | W1 | 2 | [ ] |
| Mortal Strike (mob `mortalStrike.name` aura field) | W2 | 1 | [ ] |
| War Stomp (mob `stomp.name` aura field) | W2 | 1 | [ ] |
| Devour Magic (mob `purgeOnHit.name` aura field) | W2 | 1 | [ ] |
| Mind Blast (mob `petSpell.name` aura field) | W2 | 1 | [ ] |

## Generated-artifact touch log (the ONLY parallel conflict surface)
> Every rename slice regenerates these. The integrator resolves conflicts by RE-RUNNING the
> generators (`i18n:gen` + `i18n:hash --write` + `wiki:content`), never a hand-merge. Log which
> slice last regenerated so the integrator knows to re-run.

| artifact | last regenerated by |
|---|---|
| `src/ui/i18n.resolved.generated/*` | V1 (track/ip-vocab, 2026-07-02) |
| `src/ui/i18n.resolved.sha256` | V1 (track/ip-vocab, 2026-07-02) |
| `src/guide/content.generated.ts` | V2 (track/ip-vocab, 2026-07-02; V2 also re-ran i18n:gen + i18n:hash --write: resolved table + sha came out byte-identical - talents have no catalog mirror) |

## V2 slice notes (2026-07-02) - residual scanner hits NEEDING AN OPERATOR RULING
V2 cleared 446 of 453 talents.* scanner hits (604 -> 158 total). The 7 residual talents.* hits
are MAP-MANDATED and cannot be cleared by V2 without violating the LOCKED map or editing the
scanner (both forbidden). Two mechanisms, both from single-generic-word old names armed by the
map's own old column (word-boundary matching inside longer talent names):
1. Operator-KEPT names that another armed row word-matches: 'Weapon Mastery' (kept at warrior
   arms_tactical_mastery + rogue combat_weapon_mastery; armed by shaman enh_choice_weapon's old
   column) and 'Vile Precision' (kept at rogue ass_choice_vile; armed by rogue combat_precision
   old 'Precision').
2. LOCKED new names containing an armed old word from a DIFFERENT row: 'Grim Vigor' (ass_vigor)
   + 'Blackblood Vigor' (wlk_pact_demonology) vs armed 'Vigor' (rog_vigor old); 'Latent Charge'
   (sha_convection) vs armed 'Charge' (warrior ability old); 'Cold Reckoning' (bal_vengeance)
   vs armed 'Reckoning' (prot_choice_reckoning old).
All 7 fields were already RED in the pre-V2 baseline (same or predecessor entries). Options for
the operator: arm single-word old names as whole-value like tree entries (scanner-semantics
refinement, Mogger-precedent edit), or amend the 6 affected map rows. None of the 22 seeded V2
worklist rows is affected - all ticked.
Other V2 notes:
- Parity goldens stayed BYTE-IDENTICAL (talent names do not reach golden digests): no re-mint,
  no UPDATE_PARITY, proof test not triggered; inspector run anyway: 0 changed / 0 violations.
- tests/talent_tooltip_accuracy.test.ts regression lock hardcoded 'Arcane Shot'/'Concussive
  Shot': updated to Fell Shot / Rattling Shot (same authorized gate-text class as V1's
  tests/parity/coverage.test.ts edit).
- Talent DESCRIPTIONS: proper ability-name references re-pointed at V1 new names (168 literals,
  incl. 'Grants X:' and 'Choose one <spec> refinement.'); school/attributive words kept per V1
  precedent ('Arcane spell costs', 'Shadow spell costs', 'Holy power', 'Fire spells',
  'Affliction spell costs', 'Balance spells cost', warrior/mage flavor 'whirlwind of blows').
  T1/Z1 may re-judge the attributive uses.
- talents_warrior.ts header comment still says 'Arms / Fury dps, Protection tank' (comments are
  T1's surface).

## Decisions & gotchas (honor across all sessions)
- **Reword-staleness trap (Z1 + release):** rewording an existing English key does NOT flip its
  20 locale rows to `pending`; CI stays green while every non-English overlay renders the OLD
  (WoW) name. Do NOT try to fix overlays in a track (contributor rule: English only). Z1 writes
  the maintainer a reconciliation note (diff `i18n.resolved.generated/en.ts` merge-base vs HEAD;
  re-fill every locale whose value did not also change) for the release-tier fill.
- **Coined-id sweep is the ONLY id change.** C1 (family `murloc`/`kobold`) and C2 (warlock pet
  ids) rename ids atomically; a parity golden may shift by EXACTLY the renamed token (inspector
  verifies). Every other slice freezes every id and leaves all goldens byte-identical.
- **Two English copies for abilities/items** (sim record + catalog) must stay byte-identical or
  `i18n_resolved_equivalence` reds. Talent names must equal an ability name or carry a title
  override (V2).
- **S3 co-location:** W2 (mob mechanic names) and C1 (quest prose) update `src/ui/sim_i18n.ts` in
  the SAME slice as the emit-literal edit, then run the S3 guard.
- **Residuals OUTSIDE the scanner's net (G0 coverage review, 2026-07-02) — Z1's doc pass must
  sweep these by hand:** the resolved table's `guide` section carries player-visible prose
  mentioning "murloc" and "imp" (`i18n.resolved.generated/en.ts` guide entries), and UI strings
  carry a verbatim "Righteous Fury" and a lowercase "judgement" (stat/tooltip copy). The scanner
  prose-scan is deliberately scoped to quest/greeting + entity fields (per the G0 brief), so
  these will NOT redden `ip_scrub`; scanner-green does not equal zero-residual for them. These
  regenerate from source via `i18n:gen`, so the V-track renames may clear some automatically —
  Z1 verifies by hand either way. Owner: T1/Z1.
- **The C2 pet denylist arms all 7 roster names** (incl. the generic-fantasy Imp / Succubus /
  Infernal) because the operator decision is to re-theme the WHOLE set. If that decision changes
  at NAME-MAP lock, those three are hardcoded in the scanner and need a deliberate edit there,
  not just a map flip (documented in the test header).
