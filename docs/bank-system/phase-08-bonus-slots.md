# Phase 8: Bonus Slots and Referral Integration

Account-action bonus slots (email, Discord, wallet, qualified referrals with a cap)
computed server-side and stamped into character state at load.

### Starter Prompt
```
This is Phase 8 of the Bank System feature: Bonus Slots and Referral Integration.

Model: Opus 4.8, xhigh effort. Harness: Claude Code.
ULTRACODE: not batch-heavy; parallel Agent fan-out suffices.

Goal: an entitlement calculator over existing account facts (email, Discord link,
wallet link, qualified referrals) that stamps bonusSlots into the character state at
join, plus the player-facing surface that shows the bonus sources.

STEP 0 - PRE-FLIGHT: `git status` clean on feature/bank-system; Phases 1 to 7 plus QA
complete. Memory scan: bank-system-design-research ($WOC verdict: linked-wallet is a DB
fact, NEVER a balance read); api-pipeline closeout entry (new REST endpoints are
RouteDef modules behind the registry, scaffold with npm run new:endpoint).

STEP 1 - LOAD CONTEXT (via an Explore agent):
- docs/bank-system/state.md (decision 4; OPEN item on email verification), progress.md,
  this file
- server/db.ts regions: accounts table shape (does a verified-email flag exist, or only
  email?), referrals table + referralCountForAccount, characters level column
  (denormalized), wallet_links
- server/player_card.ts referral capture (what already blocks self-referrals and
  duplicate referees), server/auth_routes.ts the capture call site
- The Discord link tables (server/discord_db.ts or neighbors): what row proves a link
- server/game.ts join/load path where character state is assembled for the sim
- server/http/CLAUDE.md + server/http/registry.ts (RouteDef rules) IF a new endpoint is
  needed
- src/sim/bank.ts bonusSlots consumption (Phase 1 field)
- CLAUDE.md (root) + server/CLAUDE.md
Return: whether verified-email exists (record the answer in state.md; if not, the
criterion is email set on account), the exact join-path stamp point, and the proof-of-
link facts for Discord and wallet.

STEP 2 - CHOOSE ORCHESTRATION + EXECUTE (two agents in parallel):

Agent A (server calculator + stamp) deliverables:
- server/bank_entitlements.ts (its own module; SQL in the db layer per server rules):
  an EXTENSIBLE source registry (a data table of source id -> criterion function ->
  slots) driving computeBankBonusSlots(accountId), which returns the breakdown (a list
  of source rows, so future sources append without changing the shape) and the total.
  v1 registry rows: +2 email (criterion per the Explore finding), +2 Discord linked,
  +2 wallet linked (a wallet_links row EXISTS; never a balance or chain read), +2 per
  qualified referral capped at 5 (+10 max). Qualified referral: a referrals row whose
  referee account owns a character with level >= 10 (one parameterized query joining
  referrals to characters on the denormalized level column; must be cheap, it runs at
  join). FUTURE registry rows, approved but blocked on systems being built separately
  (state.md decision 4): +2 X connected and following, +2 Twitch connected and
  following; do NOT implement them, but a test must prove a new registry row lands
  without touching the wire shape or any pin.
- Stamp at load: the join path computes bonusSlots once and writes it into the
  character state handed to the sim. Policy (locked): plain recompute each join, so
  unlinking lowers it next login; if the recomputed capacity falls below the currently
  USED bank slots, the bank goes over-capacity in the tolerated bags.ts sense (blocks
  new deposits, never destroys); assert that path in a test. No mid-session recompute.
  Offline sim stays 0.
- Tests: entitlement math per source, the cap at exactly 5, the qualification query
  (mocked db), stamp-at-load idempotence, the shrink-below-used path, offline default,
  and back-compat for saves that predate bonusSlots.

Agent B (player-facing surface + i18n) deliverables:
- Show the bonus sources and their earned/unearned status with localized copy. Decide
  placement in-phase and record it in state.md: the bank window footer (preferred: the
  player is already there, and it advertises the referral program where storage
  pressure is felt) vs an account portal section. The breakdown data rides the
  existing bankInfo proximity-gated read if the footer is chosen (extend the Phase 3
  shape and bump the affected pins in the same commit) OR a RouteDef endpoint if the
  portal is chosen (npm run new:endpoint; ownership and rate limits per the registry
  conventions).
- Copy for each source including the referral explainer (invite a friend; they reach
  level 10; you both keep playing) with t() keys and M16 fills for wordy values.
- Tests for the surface (view-core level if footer; golden-request level if endpoint).

INVARIANTS THIS PHASE MUST KEEP:
- Never read token balances, holder tiers, or any chain state for slots (the WOC PRDs
  pin cosmetic-only; a linked wallet is an account fact, its contents are not).
- Server authority: entitlements computed server-side only; the client displays.
- Parameterized SQL only, in db-layer modules.
- Reuse the existing referral capture; do NOT rebuild or alter its anti-abuse rules
  (self-referral rejection, one-referral-per-referee PK).

Out of scope: new referral capture mechanics or reward types beyond bank slots; email
verification flows (if none exists, use email-on-account and file the follow-up);
retroactive notifications; the X and Twitch sources themselves (their platform-link
systems are being built separately; this phase only proves the registry accepts a new
row cheaply).

STEP 3 - VALIDATION + MULTI-AGENT REVIEW:
- Run: npx tsc --noEmit; npm run build:server; the new entitlement suites; if bankInfo
  changed: the four pin suites; if an endpoint was added: the server/http completeness
  and ownership sweeps; npm run i18n:gen then npx vitest run
  tests/localization_fixes.test.ts; npm run ci:changed.
- Spawn ONLY: privacy-security-review (server, account data, SQL: mandatory),
  cross-platform-sync (character state entering the sim; plus wire if bankInfo grew),
  migration-safety ONLY if any DDL appeared, qa-checklist. COVERAGE prompts;
  truncation resume; no commit with BLOCKING findings.

STEP 4 - COMMIT CADENCE (explicit paths):
- feat(server): bank bonus-slot entitlements stamped at character load
- feat(ui): bonus source breakdown in the bank window (or feat(server): entitlements
  endpoint, per the recorded decision)
- test(server): entitlement math, referral qualification, and shrink paths

STEP 5 - ACCEPTANCE CRITERIA:
- [ ] Each source grants exactly +2; the referral cap holds at exactly 5
- [ ] A test proves a new registry row (a fake future source) lands without touching
      the wire shape or any pinned count
- [ ] Qualification requires a level >= 10 referee character (asserted with fixtures)
- [ ] Recompute-at-join only; shrink-below-used goes over-capacity without item loss
- [ ] Offline sim unaffected (bonusSlots 0); pre-bonusSlots saves load clean
- [ ] No balance/chain/holder-tier reads anywhere in the diff (grep it)
- [ ] state.md records the email criterion finding and the surface placement decision

STEP 6 - DOC UPDATES + MEMORY: progress.md, state.md (decisions, any new endpoint or
wire growth), memory notes.

STEP 7 - FINAL RESPONSE FORMAT: status, files, validation, review verdicts, deferrals,
handoff: run docs/bank-system/phase-08-qa.md next.

STOPPING RULES:
- Stop if any criterion would require chain state or balances.
- Stop if the qualification query cannot be made cheap at join (propose a cached or
  async design instead of shipping a slow join path).
```
