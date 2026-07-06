# Bank System: Brainstorm and Research Record

Date: 2026-07-05. Status: vision approved by the maintainer; this document is the durable
record of the research and the approved design direction. The phased plan lives in
`implementation-plan.md`; the locked decisions cheat sheet is `state.md`.

## Vision

A classic-feel banking system, a mix of WoW and RuneScape: banker NPCs in every town hub
open a personal vault with generous-but-finite space, expandable with copper (a real gold
sink), organized through search, category filters, and sorting, and engineered so that
item duplication is impossible by construction and provable after the fact. Professions
and skills are landing soon; with limited inventory, storage is the pressure valve.

Approved headline decisions:

- One pooled OSRS-style bank per character (not WoW-style bank bag slots).
- Bank state lives inside the per-character `characters.state` JSONB blob, next to
  inventory, so deposit/withdraw never crosses a persistence boundary (the codebase's
  main dupe window cannot touch bank operations).
- Base 24 slots, purchasable 6-slot expansions on a roughly doubling copper curve to a
  96-slot purchased ceiling.
- Bonus slots for account-security and growth actions (link email, link Discord, link
  wallet, qualified referrals with a cap). The referral bonus builds on the EXISTING
  referral system (`referrals` table, card `?ref=<slug>` capture).
- Banker NPCs in all three hubs (Eastbrook, Fenbridge, Highwatch).
- Anti-dupe program: same-blob atomicity, single-actor single-tick operations,
  server-side validation of everything, a per-character load lease, an append-only bank
  ledger, and a conservation-invariant test harness.
- $WOC never buys capacity or any gameplay utility (WOC PRDs pin cosmetic-only / no
  pay-to-win; sim determinism forbids chain state). Future $WOC angle: cosmetic vault
  themes and banker flair only.
- Designed-for follow-ups, explicitly out of v1 scope: RS3-style loadout presets,
  account-wide shared vault, guild bank.

## Research: how the majors do banking (verified 2026-07-05)

Three research passes were run and adversarially verified (multi-agent web research with
3-vote claim verification; a 9-agent codebase map with a numbers verifier that confirmed
129 of 136 numeric claims exactly).

| Game | Model | Capacity + cost | Lesson |
|---|---|---|---|
| WoW legacy (TBC-era pricing) | Bank window + purchasable bag slots | 7 slots at 10s / 1g / 10g / 25g x4 (111g 10s total) | The escalating gold-sink curve shape |
| WoW 11.2 (2025) | Six purchasable 98-slot tabs | 1g to 5,000g (9,101g total), well received | Best-received modern curve: cheap entry, mild tail |
| WoW Warband bank | Account-wide, five 98-slot tabs | 1k to 2.5M gold (3.126M total); loud "ludicrous" backlash | Account-wide storage is the modern QoL baseline; do not price the tail this steep |
| OSRS | One big pooled bank | 400 F2P / 900 members base; nine 50-slot blocks, 1M doubling to 500M coins; +60 free slots for security features (PIN, 2FA, account link, 20 each) | The primary model: one pool, live search, tabs, placeholders, deposit boxes; security-action bonus slots are a proven retention hook |
| RS3 | Same + bank presets | Presets restore inventory + equipment in one keypress; Jagex un-monetized all presets in 2021 | Presets are the highest-leverage professions QoL feature and are table stakes, never a revenue lever |
| FFXIV | Retainers | $2 per 30 days each beyond two; lapsed payment pay-gates access to stored items | The anti-pattern: never put recurring or real-money payment between a player and stored items |

Cross-game convergence: capacity is sold for in-game currency on an escalating curve (a
gold sink); organization comes from tabs/search/presets; recurring-money or
premium-currency storage reliably generates pay-to-win backlash (ESO's
subscription-gated craft bag is the community's canonical example).

## Research: dupe exploits and prevention (verified cases)

Root-cause taxonomy from documented incidents:

1. Concurrent-session races on shared containers. Revenant Elegy (2026, classic-style
   MMO): two characters on one account both passed the storage guard before an async
   load finished, producing two in-memory copies of one container. Credited fix:
   serialized, single-owner container acquisition.
2. Non-atomic cross-server or cross-container handoffs (Ultima Online areaserv boundary
   copies).
3. Save-timing and rollback windows (UO overnight flat-file saves; Minecraft per-chunk
   save-failure dupes).
4. Server trusting client-supplied item IDs, which is minting, not copying (RuneScape
   partyhat glitch, November 2003, AutoRune trade injection).
5. Trade-timing desync (New World, November 2021; Amazon's containment froze every
   wealth-transfer system in the game).
6. Cross-shard transfer bugs (UO 2006 transfer-token dupe).

Prevention patterns practitioners credit: single-owner locked container access, atomic
two-sided moves, per-instance IDs with a duplicate registry (UO's hash-marking system),
queryable auditable persistence as the prerequisite for economy audits (UO's opaque 4 GB
blob made audits impossible; Jagex had to crowdsource the partyhat root cause with a
bounty because they could not count partyhats), an economy freeze switch, and pre-built
rollback/remediation tooling.

## Codebase current state (verified against source)

- Inventory is a flat pooled `InvSlot[]` (`{itemId, count, instance?}`) with a capacity
  budget: `BACKPACK_SLOTS = 16` plus `BAG_SOCKETS = 4`, ceiling 72 (16 + 4x14), default
  stack 20, weapon/armor/bag/tool unstacked. Nothing anywhere pins an item to a slot
  position. All capacity math lives in `src/sim/bags.ts` behind the SimContext seam.
- Instanced slots (#1165: signer, charges, rolled, boundTo) never merge and must be
  deep-cloned via `cloneInvSlot` at every boundary.
- Capacity is enforced by `canAddItem`/`fitsAll` pre-checks at command boundaries;
  `addItem` deliberately force-adds for non-retryable grants; over-capacity inventories
  are tolerated and items are never destroyed by capacity.
- No bank/vault/stash feature or stub exists anywhere (two independent sweeps).
- The two "town service" templates a bank mirrors: World Market (SimContext module +
  `merchantIds` anchor list + proximity checks + per-realm JSONB) and Ravenpost mail
  (PostOffice module + mailbox objects + a `mailbox` SimEvent that opens the HUD window
  + structured result-code events localized client-side + proximity-gated, wire-capped
  info reads). Neither draws rng.
- Persistence: one JSONB blob per character (`characters.state`), 30 s autosave with
  each character in its own transaction; only the leave path is escrow-atomic
  (`saveCharacterAndMarketState`: character + market + mail rows in one BEGIN/COMMIT).
  The 30 s window is the documented tear/dupe surface for cross-character transfers.
- The double-login guard is process-local memory; two processes booted with the same
  `REALM_NAME` could double-load a character (`npm run realms` makes multi-process
  normal). No DB-level character lease exists.
- No item or gold ledger exists; `reward_ledger` (Discord points, append-only rows with
  an exactly-once dedupe key) is the in-repo template for one.
- Economy: single integer copper (1g = 10,000c). Faucets are small (zone1 quests up to
  1g, zone3 up to 2.5g, market price ceiling 500g). Sinks are thin: 5% market cut,
  vendor purchases, 30c postage. No repair, no mounts, free respec. Bags vendor at 250c
  and 2,000c. The professions spec explicitly asks for a sink proportional to the new
  material faucet: bank expansions are that sink.
- Professions storage pressure: the specs imply an active crafter eventually holds 60 to
  130 distinct stackable types (15 to 75 node materials, 48 monster component-tier
  combos, roughly 20 to 40 craft output lines, 44 future gathering yields), plus
  instanced signed materials and boundTo gear that each burn a full slot.
- Referrals already exist: `referrals` table (PK on referee_account_id, so one referral
  per referee; self-referrals rejected at capture), populated at signup via card
  `?ref=<slug>` links, exposed via `GET /api/referrals` and
  `referralCountForAccount`. The bank's referral bonus consumes this; it does not
  rebuild it.
- $WOC is a real Solana SPL token with non-custodial wallet linking and 18 cosmetic
  holder tiers; both WOC PRDs pin "cosmetic-only / no pay-to-win" as non-negotiable and
  the sim explicitly does not apply holder tiers as gameplay rules.

## The design

### Model and capacity

One pooled vault per character, shared across all bankers (visit any banker, same bank).
A second `InvSlot[]` plus a slot budget, reusing the `bags.ts` math. Organization is
search (live substring filter), category chips (all/weapon/armor/consumable/material/
quest), and sort (recent/quality/name), the `bag_filter` model. Placeholders and
drag-arranging do not translate to a pooled model; sort + filter is our equivalent.
One steal from GW2 added day one: a "deposit all materials" button.

Capacity: base 24 free. Twelve purchasable 6-slot expansions on a roughly doubling
copper curve (500c entry, 120g tail; exact table in `state.md`), ceiling 96 purchased.
Non-refundable (the vendor buy/sell asymmetry precedent). Prices are a data-as-code
table, so growth and rebalancing are content edits.

Bonus slots (account entitlements, online realms only, computed server-side at
character load and stamped into character state; offline sim defaults to 0):

- +2 slots: account email present/verified.
- +2 slots: Discord linked.
- +2 slots: crypto wallet linked.
- +2 slots per qualified referral, capped at 5 referrals (+10 max). A referral
  qualifies only when the referee account has a character that reached level 10, so a
  qualified referral costs real playtime and cannot be farmed with throwaway signups.
  Existing capture rules already block self-referrals and duplicate referees.
- Absolute ceiling at v1: 24 + 72 + 16 = 112 slots.
- Future sources, approved and locked in shape: +2 for connecting an X account and
  following the game, +2 for connecting a Twitch account and following the channel.
  Both platform-link systems are being built separately; these bonuses land when those
  systems ship (ceiling then 116). The Phase 8 calculator is built as an extensible
  source registry so each becomes a table row, not a redesign.

### Banker NPCs

`NpcDef.banker: true` flag; one banker per hub, a small banking house ("The Gilded
Strongbox") for flavor: Bursar Hobb (Eastbrook), Bursar Petra Vell (Fenbridge), Bursar
Aldous Crane (Highwatch). Fenbridge finally gets an economy anchor. Interaction mirrors
the mailbox pattern exactly: gossip row, a `bank` SimEvent opens the window, a
`bankerIds` anchor list validates proximity inside the sim on every command
(`INTERACT_RANGE + 2` to open, auto-close past 8 yd).

### UX

Talking to the banker opens the bank window with bags docked beside it (the vendor-open
companion pattern: desktop side-by-side, mobile 50/50 split). Click an item in bags to
deposit the stack; click in the bank to withdraw; shift-click for partial amounts
(split-stack sell precedent). Capacity header ("37/48") with a buy-expansion button and
a confirm prompt. Withdraw pre-checks `fitsAll` and refuses cleanly when bags are full
(the mail-take pattern: items never destroyed, never force-moved). Deposit mode slots
into the existing `bagItemAction` mode priority chain. No new keybind: the bank opens
via a banker only (classic).

### Rules (locked)

- Quest-kind items are not depositable in v1 (quest-collect credit recomputes from
  inventory; banking them would silently un-ready quests). Clear deny line instead.
- Instanced items are depositable, never merge, deep-cloned via `cloneInvSlot`.
- No copper storage: the purse stays a single number.
- Slot purchases are non-refundable.
- Deposits pre-check bank capacity; withdrawals pre-check bag capacity; refusals leave
  everything in place and charge nothing.

### Anti-dupe program

Design level, mapped to the taxonomy above:

1. Same-blob storage (taxonomy 2 and 3): bank lives in `characters.state` next to
   inventory; a deposit is a single-actor mutation of one blob committed in one
   transaction. Never `world_state` for the personal bank.
2. Single-actor, single-tick operations (taxonomy 5): no cross-player bank ops in v1.
3. All-or-nothing in-memory mutation: compute both new lists, then commit both (the
   server survives uncaughtException, so a half-applied mutation would otherwise be
   persisted by the next autosave).
4. Server trusts nothing (taxonomy 4): dispatch type-checks fields; the sim validates
   item existence, counts, capacity, proximity, alive-state; withdrawals reference
   server-side slots, never client-supplied item payloads.
5. Per-character DB lease at join (taxonomy 1): closes the cross-process double-load
   window before the bank raises its stakes.
6. Append-only `bank_ledger` (the UO lesson) modeled on `reward_ledger`, plus an offline
   conservation audit script, so any anomaly is provable and scopeable after the fact.

Test level: the centerpiece is a conservation-invariant harness (across seeded op
sequences, the multiset of items over inventory + bank + escrows is exactly conserved
except explicit faucets/sinks; the house idiom of deterministic seed sweeps with
non-vacuity flags), plus the full refusal matrix with money-not-charged and
item-left-in-place assertions in both directions, persistence round-trip and legacy-save
back-compat, tampered-save sanitization that never destroys items, instanced payload
round-trips, wire round-trips, determinism (run() equals run()), and the repo's
automatic guards (sim purity scan, parity goldens, IWorld/command/snapshot pins).

### $WOC verdict (approved)

Bank capacity stays copper-only, permanently. Reasons: (a) the WOC PRDs pin
cosmetic-only / no pay-to-win, and storage in a limited-inventory economy is economic
power; (b) market research shows paid storage is the most reliably resented monetization
in the genre while gold-sink storage is beloved; (c) the sim must stay deterministic
with zero chain state. Future $WOC fits: cosmetic vault themes/window skins, banker
flair, holder-tier greetings.

### Future (designed-for, out of v1)

- Loadout presets (RS3 model): keep deposit/withdraw as composable pure helpers so a
  preset is a pure planner producing a move list executed atomically in one tick.
  Always free.
- Account-wide shared vault (Warband model): a separate container with its own table;
  requires the cross-blob atomicity + lease story shipped in v1.
- Guild bank: APPROVED as the post-v1 follow-on (2026-07-05) and fully researched; the
  verified brief (existing guild system map, locked market/mail-pattern architecture,
  permission model, theft/dupe failure modes, prerequisite fixes) lives in
  `guild-bank-readiness.md`. V1 keeps only the seams (state.md decision 16).
- X and Twitch bonus slots: activate their registry rows once the platform-link
  systems (in development separately) ship with a verifiable connect-and-follow fact.

## Known gotchas for implementation (from the verified codebase map)

- The S3 i18n guard's sim file list is HARDCODED (`tests/localization_fixes.test.ts`);
  `src/sim/bank.ts` must be appended to it in the same change as its first player-facing
  emit, or its strings silently escape localization.
- Pinned counts must be bumped in the same commit as the seam change: IWorld members
  (170 = 42 data + 128 method), commands (118 send / 127 dispatch / 9 dispatch-only),
  `ALL_DELTA_KEYS` (30; stale file comments say 28), facets (22), `UI_PURE_CORES` (52).
- New bank commands must join `HEAVY_SELF_CMDS` or client bags/copper lag up to ~2 s.
- `bagItemAction`, `bagTooltipHintKey`, and the `BagMode` type must change together or
  clicks fall through to 'use' and consume items.
- Bank code must draw NO rng (PostOffice precedent) or parity goldens fork.
- The name "Vaultwarden" is taken by a $WOC holder tier; do not reuse it for the banker.
- index.html and play.html share main.ts: guard any new static-element wiring with `?.`.
- Wordy new English UI strings need zh/zh_TW/ja/ko/ru fills in the same change (M16).
- New NPCs feed the /wiki guide: run `npm run wiki:content` and add `guide.*` prose keys.

## OPEN items

- Exact price/bonus numbers are locked in shape, tunable at the final balance pass
  (compare against live faucet telemetry before release).
- Email verification: if the account system has no verified-email flow (only
  email-on-account), the email bonus criterion falls back to "email set on account";
  confirm during Phase 8.
- Character lease mechanism (advisory lock vs lease row with expiry) is a Phase 4
  design decision; the requirement (no cross-process double-load) is locked.
