# Guild Bank Readiness (future packet seed, approved 2026-07-05)

Status: approved to build AFTER the player bank ships. This document is the starting
brief for the future guild-bank packet: the verified research, the locked architecture,
and the prerequisite fixes, so that packet begins from decisions instead of
rediscovery. The v1 player-bank seams that make this cheap are locked in `state.md`
decision 16 (container-agnostic move helpers, personal-only `bank_*` tokens with future
`guild_bank_*` tokens reserved, the `bank_ledger` container discriminator, and the
no-premature-framework rule). Research verified 2026-07-05: 33 of 36 codebase claims
and 66 of 69 web claims confirmed by adversarial verification; low-confidence leftovers
are flagged inline.

## 1. What exists today (verified against source)

- Guilds are a SERVER-ONLY social system: `guilds`, `guild_members`, `guild_events`
  tables in `server/social_db.ts` SOCIAL_SCHEMA; business logic in `server/social.ts`
  SocialService behind SocialDb/SocialTransport interfaces; wired by `server/game.ts`.
  The sim knows nothing about guilds except a cosmetic display string
  (`setPlayerGuild` -> entity `gd` wire field for nameplates); every offline Sim guild
  method is a no-op stub.
- Ranks are exactly three TEXT values with no CHECK constraint: `leader` / `officer` /
  `member`, permissions hardcoded per method (invite/kick = officer+, promote/demote/
  transfer/disband = leader). There is no permission-configuration storage.
- Guilds are realm-scoped by UNIQUE(realm, name) and realm-filtered name lookups, but
  `guild_members` has NO realm column (membership PK is global, one guild per character
  everywhere). Member cap 100, enforced atomically with SELECT FOR UPDATE on accept.
- `guild_events` is a CALENDAR (day/hour/title/note, 25 upcoming cap, lazy pruning),
  NOT an audit log. There is no guild audit log of any kind today.
- Commands enter as `guild_*` WS tokens dispatched to SocialService; guild/officer chat
  is parsed server-side from raw chat text; player-text fields (event title/note) run
  the chat mute/rate-limit/hard-word gates at dispatch.
- Disband and last-member-leave hard-DELETE the guilds row (FK CASCADE wipes members
  and events; only online members are notified). Two live gotchas: `guildLeave` for a
  leader with members remaining delivers an error EVENT but the promise resolves
  normally (never key logic on resolution); and deleting a Guild Master's character
  CASCADEs the membership row with no guild handling, leaving a permanently leaderless
  guild.

## 2. Locked architecture for the guild bank

The sim owns items; guilds live in Postgres. The bridge is the already-proven
market/mail pattern, applied a third time:

- **Sim-resident module** `src/sim/guild_bank.ts` behind SimContext (the Market /
  PostOffice shape): constructed in the Sim ctor, ticked in the end-of-tick system
  block (appended, never reordered), zero rng, thin same-named Sim delegates. Inert in
  the offline browser Sim and the headless env (no guild key is ever injected there).
- **Key by guild id string** `String(guildId)`, NEVER by name (SERIAL ids are never
  reused; names are reusable after disband and would leak a dead guild's bank to a new
  guild). This is the market sellerKey convention; no rekey machinery needed for the
  container itself, but member display names stored in log rows go stale on rename
  unless the rename route gets a rekey hook (like `rekeyMarketSeller`).
- **Server resolves, sim consumes** (the `mailSendResolved` pattern): the server
  resolves membership and rank from SocialDb BEFORE the sim call and injects
  `{ guildKey, rank, name }` as validated arguments; no membership row means no sim
  call (deny by default); after ANY await, re-check `this.clients.get(pid) !==
  session` before touching the sim; the sim treats guildKey as opaque and re-validates
  items, copper, capacity, and proximity itself. Rank injected at command time can go
  stale mid-flight (kick/demote/disband); prefer resolving from a session-cached guild
  snapshot kept fresh through the `sendSocialSnapshot` chokepoint, and add an explicit
  server-driven sim cleanup call on disband (orphan-state prevention).
- **Persistence**: one per-realm world_state row (`guildbank:<realm>`), full-blob
  upsert, loaded in startServer next to loadMarket/loadMail, saved on the 30 s
  autosave and shutdown lists. Every write rides the ONE existing
  `enqueueMarketWrite` serial writer (never a second queue; commit order must equal
  capture order), with serialization INSIDE the enqueued thunk. The blob is added as a
  fourth upsert INSIDE `saveCharacterAndMarketState` so a logout bag-flush can never
  tear away from a guild-bank escrow. All durations serialize as secondsLeft deltas
  (sim.time resets to 0 each boot). Born realm-scoped: no backfill or gate needed
  unless data ever migrates.
- **Fungible-only at launch** (the market/mail escrow rule, #1165): deposits go
  through `countFungibleItem` / `removeFungibleItem`; quest and `noMarketList` items
  refused; instanced items (signed materials, boundTo gear) deferred until instance
  custody in shared containers is designed deliberately. Withdrawals are
  capacity-gated per stack and unfit stacks STAY in the bank (the market-collect /
  mail-take rule; nothing is ever destroyed or force-added).
- **Wire**: new `guild_bank_*` tokens (append-only; reserved by state.md decision 16),
  validated dispatch cases, ClientWorld mirrors, offline Sim stubs, and all four pin
  suites bumped. Bank contents ride a proximity-gated info read at the SAME banker
  NPCs (the bankerIds anchors from player-bank Phase 2), wire-capped like
  market/mail. Do NOT piggyback bank updates on `pushGuild` full-roster snapshots (a
  chatty bank would multiply DB reads and fan-out to up to 100 members); use a narrow
  bank-delta frame or the delta-key path.
- **Ledger**: the same `bank_ledger` with `container = 'guild'` and `container_id =
  guildId` (the column ships in player-bank Phase 4), COMPLETE and durable, never a
  truncated last-N window. Add a permission-change audit (who changed which rank's
  bank rights, when: the EVE role-audit model), either as ledger rows with op
  `perm_change` or a sibling table.
- **Concurrency**: within a realm process, all bank mutations happen inside the sim
  tick (naturally serialized); the DB races are covered by the serial writer plus the
  atomic leave save. One process = one realm holds the single-writer discipline;
  cross-realm guilds would break it and are out of scope without a redesign.

## 3. Permission model (locked direction, from the verified survey)

- Deny by default everywhere, including any LATER-ADDED tab or section (FFXIV's
  newly-unlocked tabs default open and it is a documented leader trap).
- Per-rank withdraw caps denominated in ITEM COUNTS (or appraised value), never stacks
  or slots: WoW's stack-denominated caps were bypassed in April 2026 by consolidating
  stacks before withdrawing (240 items on a 10-item allowance).
- Daily allowance windows are server-side wall-clock state (they must NOT enter the
  deterministic sim as absolute times; store absolute server timestamps in the ledger,
  render relative in UI).
- The current three-rank vocabulary is too coarse to hang a permission matrix on
  as-is; the guild-bank packet adds a small permission-config store (per rank: view /
  deposit / withdraw-per-day; leader configures) rather than new hardcoded methods.
  Keep the matrix small and explicit (WoW caps at 10 ranks x 8 tabs).
- Promotion rights are part of the attack surface (a promotable alt defeats every
  cap): log rank and permission changes with actor and timestamp, and consider a
  first-class probation timer (days-in-guild before withdraw rights; GW2 ships a 72 h
  new-member lockout and players accept it). Remember caps bound velocity, not
  intent: a patient infiltrator waits out any timer (EVE), so partitioning (what a
  rank can EVER reach) is the real ceiling.
- Log visibility: everyone can ALWAYS see their own transactions; full-log view is a
  permission (the ESO Update 41 compromise, settled after years of complaints).
- Copper in the guild bank is a separate decision from items: if included, it is its
  own container with its own per-rank daily allowance and spend-channel flags (the
  WoW withdraw-vs-repair-only split). A money-only coffer (OSRS clan coffer, 50M cap,
  2FA-gated) is a legitimately smaller first slice if we want guild funds before item
  storage. Use 64-bit-safe integers everywhere including logs (WoW's money log broke
  at 2^31 copper).
- Support policy, published up front (the industry-settled split): withdrawals by
  someone using rank-granted access are not restored ("permission is consent");
  compromised-account theft gets a restoration path. Both halves only work because
  the complete ledger can distinguish and replay them.

## 4. Failure modes to design around (each verified by a shipped game's scar)

- Disband / leader deletion: decide asset escheat BEFORE building. Recommendation:
  block disband while the bank is non-empty, and fix the deleted-leader orphan first
  (prerequisites below). Never destroy contents on disband (ESO does; it is a
  support-ticket generator). Ravenpost mail-back to the leader is the fallback path.
- Truncated logs make theft unprovable (WoW's 25-entry window) and unlogged state
  makes restoration impossible (WoW's Aug/Sept 2024 migration loss was admitted
  unrecoverable for that reason). The complete ledger is non-negotiable.
- Non-atomic inventory<->bank commits are the classic dupe (2008 crash-window gold
  dupe; COD-mail interaction dupe): here, atomicity comes from the sim-tick mutation
  plus the fourth-upsert leave save and the serial writer. Any NEW transfer system
  that touches the guild bank (future COD mail, trade integration) must be reviewed
  against the ledger conservation audit.
- Emergency kill switch: a server flag that disables all guild-bank operations
  game-wide (the standard live-dupe response, New World repeatedly), designed in
  advance, not improvised mid-incident.
- Migrations touching guild storage need a verified backup and a reconciliation pass
  before old data is dropped (the WoW 2024 incident was a migration, not a player).

## 5. Capacity and pricing direction (loose until the packet's balance pass)

- Genre norm is 250 to 500 shared slots (GW2 250 across three sections; ESO 500 flat;
  FFXIV 250 for up to 512 members, a documented pain point). Our guild cap is 100
  members; something in the 200 to 400 range in purchasable sections fits.
- Sections/tabs purchased on an escalating curve as a GUILD gold sink (WoW tabs 100g
  to 20,000g roughly doubling; Albion 375k to 14.25M silver): mirrors the personal
  bank expansion model at guild scale. Decide who pays (WoW moved tab purchases from
  the buyer's pocket to guild funds in 11.1.0 because personal payment bred ownership
  resentment: prefer guild funds if a treasury exists, otherwise log the purchaser).
- Per-tab/per-section permissioning is the loved model (Albion role-per-tab, FFXIV
  per-tab levels); a single coarse pool with toggles is the model players work around
  (ESO). If we ship sections, money is its own section.

## 6. Prerequisite fixes (small, before or at the start of the guild-bank packet)

1. Fix the deleted-Guild-Master orphan (character deletion currently CASCADEs the
   membership row with no succession or disband), and make `guildLeave` refusal
   distinguishable to callers (the PR 1499 gotcha).
2. Add a rank/permission-config store (the three hardcoded ranks have nowhere to hang
   per-rank bank rights today) plus the permission-change audit.
3. Route every membership/rank change through the `sendSocialSnapshot` chokepoint into
   any session-cached rank snapshot the bank relies on (stale-rank window).
4. Confirm realm hygiene: `guild_members` joins are realm-unfiltered today; the bank
   resolve path must filter by REALM like the rest of SocialDb.
5. Re-verify at build time the LOW-confidence survey items: Albion per-tab
   administration enum, FFXIV's four-level per-container access enum, and the exact
   Blizzard support-article wording (JS-rendered pages, unfetchable at research time).
   Two web corrections already caught: the WoW "8 tabs, 20,000g" configuration is
   Cataclysm-era (2.3 shipped 6 tabs at 100g to 5,000g), and the EVE EBank "5.5T bank
   run" figure is unsupported (the ~200B embezzlement itself is confirmed).

## 7. What v1 (player bank) must NOT do

Do not build any of this speculatively: no generic container framework, no permission
vocabulary, no guild tables, no `guild_bank_*` implementations. The guild bank will be
the FOURTH off-inventory container (market, mail, personal bank), which is exactly
when the repo's rule of three justifies extracting a shared escrow helper, with real
examples in hand. V1's only obligations are the four seams in `state.md` decision 16,
already folded into Phases 1, 3, and 4.
