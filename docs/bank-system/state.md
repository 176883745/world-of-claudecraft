# Bank System: Cross-Phase State (read this first every session)

Current phase: Phase 2 complete (2026-07-06, three reviewers zero blocking); run phase-02-qa.md next. Update this line as phases complete.

## Locked design decisions (record once, reference forever)

1. Model: per-character pooled bank. FINALIZED in Phase 1: `PlayerMeta.bank: BankState` (required) and `CharacterState.bank?: BankState` (optional for pre-bank saves), with `BankState = { inventory: InvSlot[], purchasedSlots: number, bonusSlots: number }` exported from `src/sim/bank.ts`. `purchasedSlots` counts SLOTS on the 6-slot grid in [0, 72] (capacity = `BANK_BASE_SLOTS + purchasedSlots + bonusSlots`); `bonusSlots` is persisted and stays 0 until Phase 8 stamps it. Flat pooled list + slot budget, reusing `src/sim/bags.ts` math (`countFit`, `addStacked` idioms). No positional slots, no tabs, no drag-arrange.
2. Storage: INSIDE `characters.state` JSONB, next to inventory. NEVER a `world_state` row for the personal bank (same-blob atomicity is the anti-dupe cornerstone).
3. Capacity: `BANK_BASE_SLOTS = 24`. Twelve purchasable 6-slot expansions, copper, non-refundable, data-as-code table:
   500c, 1,000c, 2,500c, 5,000c, 10,000c, 20,000c, 40,000c, 80,000c, 150,000c, 300,000c, 600,000c, 1,200,000c.
   Purchased ceiling 96. Numbers tunable at the release balance pass; the SHAPE (cheap entry, roughly doubling, data-driven) is locked.
4. Bonus slots (online realms only; server computes at character load, stamps into character state; offline Sim defaults 0; recomputed at join, not mid-session): +2 email present/verified, +2 Discord linked, +2 wallet linked, +2 per qualified referral capped at 5 (+10 max). Qualified referral: referee account has a character at level >= 10. Reuse the EXISTING `referrals` table + capture; do not rebuild. Absolute ceiling at v1: 24 + 72 + 16 = 112.
   FUTURE sources (locked in shape, land only after their platform-link systems ship, which are being built separately): +2 X account connected AND following the game's account, +2 Twitch account connected AND following the channel (the follow criterion is enforced by each platform-link system when it lands). Ceiling then 116. Phase 8 must build the calculator as an extensible source registry (a data table of source -> criterion -> slots) and a breakdown wire shape that appends new sources without pin churn, so X and Twitch are a table row each later, not a redesign.
5. Sim module: `src/sim/bank.ts` behind the SimContext seam (Market/PostOffice shape). Backing state on Sim/PlayerMeta as live ctx views; thin same-named delegates on Sim. The bank draws NO rng, ever.
6. Commands (append-only wire tokens, snake_case): `bank_deposit`, `bank_withdraw`, `bank_buy_slots`. All three join `HEAVY_SELF_CMDS`. Field-validated in `server/game.ts` dispatchMessage; the sim owns all gameplay validation (proximity, capacity, existence, alive-state).
7. Bank contents wire: proximity-gated info read (null away from a banker), riding a `maybe('bank')` delta key mapped in `TERSE_TO_IWORLD` (terse `bank` -> IWorld `bankInfo`; final naming recorded here in Phase 3). Registered in `ALL_DELTA_KEYS`. Delta-guarded decode (`if (s.bank !== undefined)`).
8. IWorld: new facet file `src/world_api/bank.ts` (IWorldBank), added to the IWorld extends list and `COMMAND_FACETS`; implemented in BOTH Sim and ClientWorld in the same commit as the facet (parity pins demand it).
9. NPCs: `NpcDef.banker?: true`. Three bankers, banking house "The Gilded Strongbox": `bursar_fernando` (Eastbrook), `bursar_petra_vell` (Fenbridge), `bursar_aldous_crane` (Highwatch) (ids FINAL, landed in Phase 2; the Eastbrook banker was renamed from the planned `bursar_hobb` to "Bursar Fernando" mid-phase at the maintainer's request, a deliberate easter egg, so do not "fix" it back). `bankerIds` anchor list on the bank module (merchantIds/mailboxIds pattern). Open at `INTERACT_RANGE + 2`; HUD auto-close past 8 yd. Gossip row + `{type:'bank', pid}` SimEvent opens the window (mailbox pattern). Do NOT name anything "Vaultwarden" (taken by a $WOC holder tier).
10. Rules: quest-kind items NOT depositable (clear deny line). Instanced slots depositable, never merge, `cloneInvSlot` at every boundary. No copper storage. Withdraw pre-checks `fitsAll` and refuses (never destroys or force-moves); deposit pre-checks bank capacity the same way. Refusals charge nothing and move nothing.
11. Safety: per-character DB load lease at join (mechanism decided in Phase 4: advisory lock vs lease row with expiry; requirement locked: no cross-process double-load). Append-only `bank_ledger` table modeled on `reward_ledger` (additive DDL in `server/db.ts` SCHEMA), written server-side per bank op without blocking gameplay, plus an offline conservation audit script.
12. i18n: sim deny/notice lines are English literals at the emit site + matching EXACT/RULE entries in `src/ui/sim_i18n.ts` in the SAME change; append `src/sim/bank.ts` to the S3 guard's hardcoded simSrc list (`tests/localization_fixes.test.ts`) in the same change as its first emit. UI keys in `hudChrome.bank.*` (`src/ui/i18n.catalog/hud_chrome.ts`). Wordy English values need zh/zh_TW/ja/ko/ru fills in the same change (M16). New NPC ids go in `src/ui/world_entity_i18n.ts`; regenerate the guide (`npm run wiki:content`) and add `guide.*` prose keys.
13. $WOC: never buys capacity or gameplay utility. Cosmetic-only future ties (vault themes, banker flair).
14. Out of v1 scope (do not build, keep seams friendly): loadout presets, account-wide shared vault, guild bank, bank tabs, copper storage, a bank keybind.
15. UI: `src/ui/bank_view.ts` pure core (registered in `UI_PURE_CORES`) + `src/ui/bank_window.ts` painter composing `PainterHostPresentation`; cold event-driven window (innerHTML rebuild on events), vendor-open style companion docking with bags; deposit mode inserted into `BagMode` + `bagItemAction` + `bagTooltipHintKey` together; search/category/sort mirroring `bag_filter` (generalized or a sibling `bank_filter`); "deposit all materials" button; confirm prompts in `#prompt-stack`.

16. Guild-bank readiness (approved 2026-07-05: ships AFTER the player bank, designed for NOW). Full intended shape and research in `guild-bank-readiness.md`. The v1 seams that make it cheap, locked: (a) Phase 1 move helpers are container-agnostic pure functions over lists + budgets; (b) the bank_* wire tokens stay personal-only forever, the guild bank gets its own guild_bank_* tokens and permission-validating dispatch path; (c) bank_ledger carries container TEXT NOT NULL DEFAULT 'personal' + container_id BIGINT NULL from day one and the audit script groups by container; (d) do NOT extract a generic container framework in v1: the guild bank will be the fourth off-inventory container (market, mail, personal bank), which is when the rule of three justifies extracting a shared escrow helper. (e) `moveBetweenContainers` is deliberately policy-free (quest-deny lives in the CALLER, `bankDeposit`); correct for self-storage, but the guild-bank caller moves items BETWEEN players, so it MUST add `noMarketList` and `instance.boundTo` (soulbound) checks at its own boundary, the mail precedent (`src/sim/mail/post_office.ts` denies both). Recorded 2026-07-06 at Phase 1 QA; this is a guild-bank acceptance item.

## Non-negotiable constraints

- Determinism: no `Math.random` / `Date.now` / `performance.now` in `src/sim/`; the bank draws no rng at all; no tick-phase reordering (parity goldens red on any shared-rng draw-order change; fix code, never widen exclude lists).
- One sim, three hosts: extend IWorld first, implement in BOTH Sim and ClientWorld; render/ui consume IWorld only.
- Server authority: the client never decides outcomes; validate every command field.
- Items are NEVER destroyed by capacity or by any bank refusal path.
- i18n: every player-visible string per decision 12.
- Shared worktree: a concurrent session may share this checkout. `git status` before starting; commit EXPLICIT paths only; never `git add -A`.
- No em dashes, en dashes, or emojis anywhere (code, docs, commits, player copy).
- Do not hand-edit generated files; regenerate.

## Pinned counts that must be bumped in the SAME commit as the seam change

- `tests/world_api_parity.test.ts`: IWorld members 170 (42 data + 128 method), facets 22, sorted toEqual lists.
- `tests/command_schema.test.ts`: EXPECTED_SEND_COUNT 118, EXPECTED_DISPATCH_COUNT 127, DISPATCH_ONLY 9.
- `tests/snapshots.test.ts`: ALL_DELTA_KEYS has 30 entries (stale comments say 28) + TERSE_TO_IWORLD + dirtyEveryDeltaField.
- `tests/command_facets.test.ts`: append-only COMMAND_FACETS tags keyed on wire strings.
- `tests/architecture.test.ts`: UI_PURE_CORES 52 entries; new `bank_view.ts` must be registered (the `*_view` suffix is what the completeness sweep catches).
- `tests/localization_fixes.test.ts`: hardcoded simSrc list (append `src/sim/bank.ts`).

## Validation matrix by change type

- sim-only: `npx tsc --noEmit` + `npx vitest run tests/bank.test.ts tests/architecture.test.ts` + the parity suite if tick-adjacent (`npx vitest run tests/parity`); determinism assertion in the suite.
- content-only (NPCs/items): `npx tsc --noEmit` + `npx vitest run tests/guide.test.ts` after `npm run wiki:content`; i18n entity lists.
- server-only: relevant server suites + `npx tsc --noEmit` + `npm run build:server`.
- net/wire: `npx vitest run tests/snapshots.test.ts tests/command_schema.test.ts tests/world_api_parity.test.ts tests/env_protocol.test.ts tests/bandwidth.test.ts`.
- ui/render: `npx tsc --noEmit` + `npx vitest run tests/localization_fixes.test.ts` (if text) + a mobile screenshot script with `npm run dev` running.
- persistence: `npx vitest run tests/persistence_round_trip.test.ts tests/character_state_backcompat.test.ts tests/save_character_and_market.test.ts` + `migration-safety` review.
- any code change: `npm run ci:changed` (Biome on changed files only; scoped `npx @biomejs/biome check --write <file>` to fix; never whole-tree).
- pre-merge / phase-complete: `npm run gate` (exit-code-safe CI-equivalent; release tier auto-on on release branches; do not pipe through tail).
- i18n gates need `npm run i18n:gen` first when running bare vitest files (pretest does it for npm test).

## Key file paths

Existing (templates and seams):
- `src/sim/bags.ts` (capacity math + command-boundary idioms), `src/sim/types.ts` (InvSlot, cloneInvSlot, NpcDef, SimEvent), `src/sim/market.ts` + `src/sim/mail/post_office.ts` (SimContext town-service modules, anchor lists, proximity, persistence, result-code events), `src/sim/interaction.ts` (interact routing), `src/sim/sim_context.ts` (seam), `src/world_api.ts` + `src/world_api/` (facets, COMMAND_NAMES, COMMAND_FACETS), `src/net/online.ts` (ClientWorld, cmd(), applySnapshot), `server/game.ts` (dispatch, selfWireJson maybe(), HEAVY_SELF_CMDS, interest), `server/db.ts` (SCHEMA, saveCharacterAndMarketState, reward-ledger template in `server/discord_db.ts`), `src/ui/bags_view.ts` + `src/ui/bags_window.ts` + `src/ui/bag_filter.ts` + `src/ui/mailbox_view.ts` + `src/ui/mailbox_window.ts` (window recipe), `src/ui/hud.ts` (composition, gossip rows, vendor-open cluster), `src/sim/content/zone1.ts` / `zone2.ts` / `zone3.ts` (hub NPC rosters), `server/player_card.ts` + `server/wallet.ts` + `referralCountForAccount` in `server/db.ts` (referrals), `server/auth_routes.ts` (referral capture at signup).

Created by this feature (record actual paths as phases land):
- Phase 2 (LANDED 2026-07-06): banker records appended to `src/sim/content/zone1.ts`/`zone2.ts`/`zone3.ts`; `banker?: true` + SimEvent `bank` in `src/sim/types.ts`; `bankerIds` in `src/sim/sim.ts` + `src/sim/sim_context.ts`; `nearBanker` + gates in `src/sim/bank.ts`; intercepts in `src/sim/interaction.ts`; `error.bankTooFar` in `src/ui/sim_i18n.ts`; ids in `src/ui/world_entity_i18n.ts` + five non-Latin overlay fills; Phase 2 blocks in `tests/bank.test.ts`.
- Phase 1 (LANDED 2026-07-05): `src/sim/bank.ts` exporting `BANK_BASE_SLOTS`/`BANK_EXPANSION_SLOTS`/`BANK_EXPANSION_PRICES`, `BankState`, `bankCapacity`, `moveBetweenContainers(source, sourceIndex, count, dest, destCapacity): MoveResult` (the container-agnostic seam, decision 16a), `bankDeposit`/`bankWithdraw`/`bankBuySlots` (free functions over ctx, thin same-named Sim delegates), `sanitizeBankState` (the ONE load path); `tests/bank.test.ts`; `PlayerMeta.bank` + `CharacterState.bank?` per decision 1.

## Phase 1 outcomes (recorded 2026-07-05)

- Emit literals (all EXACT, no placeholders): 'You cannot store quest items in the bank.' (`error.bankQuestItem`), 'Your bank is full.' (`error.bankFull`), 'You cannot afford that bank expansion.' (`error.bankCannotAfford`), 'Your bank cannot be expanded further.' (`error.bankMaxSlots`), 'You purchase additional bank slots.' (`log.bankSlotsPurchased`). Withdraw-refusal reuses the existing `bagsFullError` line ('Your bags are full.'); all five new keys filled in zh_CN/zh_TW/ja_JP/ko_KR/ru_RU (M16).
- Rule interpretations locked in-phase: malformed input (bad index, count <= 0, count > stack) is a SILENT no-op (cheat/desync territory, no player line); refusal lines are reserved for player-meaningful denials. `noMarketList` is NOT honored by the bank (it gates player-to-player transfer surfaces; the bank is self-storage), only quest-kind is denied. Instanced slots move WHOLE regardless of the count argument. Successful deposit AND withdraw both call `onInventoryChangedForQuests` (collect credit recomputes from bag inventory; every content collect item is quest-kind today, so the deposit arm is defensive for future content and pinned via a synthetic quest in the test).
- Load sanitization: unknown-but-string itemIds KEPT dormant (mail precedent); instanced entries forced to count 1 (blocks payload minting); counts clamped to Math.max(1, floor); purchasedSlots floored to the 6-slot grid in [0, 72]; bonusSlots clamped >= 0 with NO upper clamp until Phase 8 defines the source registry (Phase 8 adds the clamp); over-capacity inventories tolerated, never truncated. `sanitizeRemovedZone1Content` intentionally does not reach into `bank.inventory` (items are never destroyed; removed-content items cannot be deposited normally since they are quest-kind).
- Parity: `bank` added to `META_EXCLUDE` (tests/parity/trace.ts) with the membership pin updated (tests/parity/harness.test.ts); goldens byte-untouched. This is a DELIBERATE temporary coverage gap: Phase 3 MUST remove `bank` from `META_EXCLUDE` and pin the bank in parity scenarios when it goes on the wire.
- Rollout caveat: rolling back to a pre-bank server binary drops the `bank` field on that binary's next save and banked items are unrecoverable (they left the bags at deposit). Treat the bank rollout as forward-only; do not run mixed old/new binaries against the same characters.
- Phase 3 wire notes carried forward: validate `slotIndex`/`count` field shapes in dispatch, rate-limit `bank_buy_slots` (economy action), `bonusSlots` stays server-stamped (never client-supplied).
- Phase 2: banker NpcDefs in zone content, interaction arm, `{type:'bank'}` SimEvent.
- Phase 3: `src/world_api/bank.ts`, wire tokens, ClientWorld mirrors, pin bumps.
- Phase 4: character lease, `bank_ledger` DDL + writer, `scripts/bank_audit.mjs`.
- Phase 5: `src/ui/bank_view.ts`, `src/ui/bank_window.ts`, window tests.
- Phase 6: BagMode deposit integration, bank search/filter/sort, buy-slots prompt.
- Phase 7: mobile/a11y polish.
- Phase 8: entitlement calculator + portal surface + referral qualification.

## Phase 2 outcomes (recorded 2026-07-06)

- Landed: `NpcDef.banker?: true` (the `?: true` literal type is DELIBERATE, stricter than the sibling `market?: boolean`, forbids `banker: false`); SimEvent `| { type: 'bank' }` (pid via the union intersection, both emit sites always pass it); `Sim.bankerIds` + `readonly bankerIds` SimContextPrimitive with live getters bound in BOTH sim.ts buildSimContext AND sim_context.ts createSimContext (the anchor list could NOT live "on the bank module" as decision 9 loosely said: bank.ts is free functions and module globals are forbidden for multi-Sim isolation, so it is a Sim field surfaced on ctx); `nearBanker(ctx, e)` free function in bank.ts at `BANKER_RANGE = INTERACT_RANGE + 2`; the proximity gate prepended to all three command bodies BEFORE input validation; banker intercepts in both interact() arms BEFORE talkToNpc, returning after one emit.
- NPC ids FINAL: `bursar_fernando` (Eastbrook {13,8}; renamed mid-phase from the planned bursar_hobb at the maintainer's request, a deliberate easter egg, do not revert), `bursar_petra_vell` (Fenbridge {12,303}), `bursar_aldous_crane` (Highwatch {-12,663}); shared title "The Gilded Strongbox", shared color 0xc9a227, `questIds: []`.
- Emit literal: 'You are too far from the banker.' = `error.bankTooFar`, EXACT in baseEnTable + five non-Latin BASE_DICT fills. Entity name/title/greeting keys filled in the five non-Latin overlays (M16); Fernando transliterated per locale.
- PARITY GOLDENS REGENERATED (user-approved; the packet's "byte-identical" criterion amended): 3 ctor NPCs shift every later entity id by +3. Audited two ways (orchestrator script + architecture-reviewer): all 48 goldens pure +3 id-family offset, rng draw digests/counts byte-identical, zero anomalies. The REAL invariant for content additions is the rng draw-order digest, not golden bytes. Landed as its own test(parity) commit.
- Reviewer notes to carry forward (none blocking): (a) the banker intercept precedes isQuestInteractionEntity, so a banker given questIds would have quest talk SHADOWED: bankers must keep `questIds: []` unless the intercept is reordered; (b) range asymmetry is inherited from market/mail: untargeted scan finds at INTERACT_RANGE (5), targeted arm and the command gate at +2 (7); (c) Phase 5 author: `pid` is optional on the union, and a pid-less bank event would broadcast via eventAnchor, always pass pid (mailbox has the same latent shape); (d) Phase 3: bank contents delta key + any HEAVY_SELF_EVENTS/selfHeavyDirty wiring belong there, `bank` correctly absent from HEAVY_SELF_EVENTS now; (e) HUD `case 'bank':` lands in Phase 5 (event currently inert client-side by design).
- Deferral: in-world visual placement check (overlap/geometry) of the three bankers needs a running client; deferred to Phase 2 QA.
- tests/bank.test.ts 42 -> 58 (registration, exactly-once emits both arms x3 bankers, bystander pid isolation, near/far x3 commands with exact literal + nothing-moved/copper-unchanged, targeted-far no-emit, Phase 1 suite migrated via moveToBanker with no weakened assertions).

## Phase 1 QA outcomes (recorded 2026-07-06)

- Verdict: PASS after fixes. Zero defects in `src/sim/bank.ts` or the sim.ts wiring (the module survived QA byte-unchanged); every finding was test decisiveness, i18n accuracy, docs, or merge damage.
- Planted-bug decisiveness (acceptance criterion 1): 5/5 conservation mutations caught by the sweep itself (duplication, partial duplication, copper leak, destruction-on-refusal, and vacuity via the non-vacuity flags).
- BLOCKING (not a Phase 1 defect): the release/v0.22.0 merge commit `17f311ca4` committed unresolved conflict markers into the GENERATED `src/ui/i18n.status.summary.json` (invalid JSON; would fail the CI freshness gate). Fixed the documented way (`npm run i18n:gen`, commit the result). LESSON for every future merge on this branch: generated-artifact conflicts are never hand-resolved AND the merged result must be verified to parse; the Phase 1 commits themselves verified fresh.
- Test decisiveness fixes in `tests/bank.test.ts` (41 -> 42 tests): the bonusSlots test was VACUOUS on the admit path (a deposit path ignoring bonusSlots passed all 41 tests, proven by live mutation; now fills to 27 and asserts the bonus-region deposit succeeds); the "deposit -> withdraw" payload test never withdrew (now round-trips the full charges/rolled/boundTo payload); tamper sanitization now also drives the REAL addPlayer load path (pins the `meta.bank = sanitizeBankState(s.bank)` wiring); every refusal site now asserts copper-unchanged AND both containers; the round-trip carries nonzero bonusSlots; the sweep now provably reaches bags-full and cannot-afford refusals (7 non-vacuity flags: every 5th seed starts bags-full, every 7th seed copper-poor); the determinism run pins its own non-vacuity (purchasedSlots 18 + the purchase log line).
- Generic suites extended for the bank field: `tests/persistence_round_trip.test.ts` (fully-populated fixture now banks; `bank` added to the legacy strip list) and `tests/character_state_backcompat.test.ts` (bank populated, stripped, defaulted, re-serialized).
- i18n accuracy: the ja fill for `error.bankCannotAfford` wrongly said gold for a copper-priced purchase (now currency-neutral) and `log.bankSlotsPurchased` now matches the surrounding polite register.
- Findings REFUTED with evidence (no change made, do not re-raise): `moved: slot.count` on the instanced branch is truthful (the WHOLE slot moves, payload and count); `sanitizeBankState` adds no upper count clamp and accepts array-shaped instance payloads BY DESIGN, matching the bags load path (which does not sanitize at all; the bank must never be stricter than bags) and the never-destroy-items philosophy.
- Environment gotchas recorded for future QA sessions: workflow worktrees spawn at the MAIN branch commit (detach-checkout the branch tip first), and `vite.config.ts` test.exclude `**/.claude/**` hides ALL test files from a `.claude/worktrees/` checkout (run vitest there via a minimal config without that glob).

## New surface added per phase (fill in as phases complete)

- IWorld members: (Phase 3)
- SimEvents: Phase 2 (LANDED): `{ type: 'bank' }`, pid always passed by both emit sites
- Wire fields / delta keys: (Phase 3)
- Commands: (Phase 3: `bank_deposit`, `bank_withdraw`, `bank_buy_slots`)
- DB tables/columns: (Phase 4: `bank_ledger`; lease mechanism)
- i18n keys / matcher rules: Phase 1: `error.bankQuestItem`, `error.bankFull`, `error.bankCannotAfford`, `error.bankMaxSlots`, `log.bankSlotsPurchased` (all EXACT via `baseEnTable`, five non-Latin fills each). Phase 2: `error.bankTooFar` (same recipe) + `entities.npcs.{bursar_fernando,bursar_petra_vell,bursar_aldous_crane}.{name,title,greeting}` (world_entity_i18n + five non-Latin overlay fills). More in Phases 5, 6, 7.

## OPEN items and known gotchas

- Price/bonus numbers: shape locked, values tunable at release balance pass.
- Email bonus criterion: verified-email flow vs email-on-account, confirm in Phase 8.
- Lease mechanism: advisory lock vs lease row, decide in Phase 4.
- Gotchas inherited from research: S3 simSrc list is hardcoded; HEAVY_SELF_CMDS omission lags the client ~2 s; BagMode three-place change; parity goldens red on rng draws; index.html/play.html shared main.ts (guard with ?.); over-capacity states are load-bearing and tolerated; quest items survive abandon and accumulate.
