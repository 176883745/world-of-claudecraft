# Bank System: Progress

## Status table

| Phase | Status | Started | Completed |
|---|---|---|---|
| Phase 1: sim bank core | complete | 2026-07-05 | 2026-07-05 |
| Phase 1 QA | complete | 2026-07-06 | 2026-07-06 |
| Phase 2: banker NPCs | complete | 2026-07-06 | 2026-07-06 |
| Phase 2 QA | not started | | |
| Phase 3: IWorld + wire | not started | | |
| Phase 3 QA | not started | | |
| Phase 4: lease + ledger | not started | | |
| Phase 4 QA | not started | | |
| Phase 5: bank window | not started | | |
| Phase 5 QA | not started | | |
| Phase 6: deposit + search | not started | | |
| Phase 6 QA | not started | | |
| Phase 7: mobile + a11y | not started | | |
| Phase 7 QA | not started | | |
| Phase 8: bonus slots | not started | | |
| Phase 8 QA | not started | | |
| Phase 9: final whole-feature QA | not started | | |

## Per-phase deliverable checklists

### Phase 1: sim bank core
- [x] `src/sim/bank.ts` module behind SimContext (state on Sim/PlayerMeta as live ctx views; thin delegates on Sim; zero rng draws)
- [x] Character state fields (`bank` container: inventory + purchasedSlots + bonusSlots) with serialize/load + back-compat defaults via `sanitizeBankState` + `cloneInvSlot` deep-clone at boundaries
- [x] Deposit/withdraw/buy-expansion logic with the full locked rule set (quest-kind deny, instanced no-merge, capacity pre-checks both directions, refusals move nothing and charge nothing, non-refundable purchases, expansion price table as data)
- [x] Move helpers are container-agnostic pure functions (`moveBetweenContainers` over lists + budgets, no hardcoded containers; the guild-bank/loadout seam, state.md decision 16)
- [x] Capacity math: base 24 + purchased blocks + bonusSlots field (bonus stays 0 until Phase 8)
- [x] `tests/bank.test.ts` (41 tests): rule matrix, exact deny literals, conservation invariant seed sweeps (50 seeds, five non-vacuity flags), determinism (300-tick run() equals run()), persistence round-trip + back-compat + tampered-save sanitization; decisiveness proven by an 8-mutation planted-bug pass (all killed)
- [x] sim_i18n matcher entries for every new emit (5 EXACT keys + zh_CN/zh_TW/ja_JP/ko_KR/ru_RU fills, M16) + S3 simSrc list append (same change)

### Phase 1 QA
- [x] Deliverables and acceptance criteria verified; coverage/dead-code/cleanup agents run; findings fixed

### Phase 2: banker NPCs
- [x] Three banker NpcDefs (Eastbrook, Fenbridge, Highwatch hubs) with `banker: true`, greetings, placement (`bursar_fernando` at {13,8}, `bursar_petra_vell` at {12,303}, `bursar_aldous_crane` at {-12,663}; Eastbrook renamed from the planned bursar_hobb at the maintainer's request, a deliberate easter egg)
- [x] Interaction arm: `{type:'bank', pid}` SimEvent from both interact() arms, `bankerIds` anchor list (Sim field + SimContext primitive), `INTERACT_RANGE + 2` proximity validation inside the sim on every bank command (the HUD gossip row itself is Phase 5 per the packet's out-of-scope list; the NpcDef flag it keys off shipped here)
- [x] Entity i18n lists + guide regen (`npm run wiki:content` produced NO diff: bankers are not delve keepers, so the generator ignores them; no `guide.*` prose keys needed)
- [x] Sim tests: proximity open/deny, event emission, anchor-list behavior (bank.test.ts 42 -> 58)

### Phase 2 QA
- [ ] As Phase 1 QA

### Phase 3: IWorld + wire
- [ ] `src/world_api/bank.ts` facet; IWorld extends list; COMMAND_FACETS tags
- [ ] `bank_deposit` / `bank_withdraw` / `bank_buy_slots` in COMMAND_NAMES; validated dispatch cases; ClientWorld cmd() senders; HEAVY_SELF_CMDS membership
- [ ] Proximity-gated bank info read riding a maybe() delta key; TERSE_TO_IWORLD; delta-guarded applySnapshot mirror
- [ ] All pin bumps in the same commits (world_api_parity, command_schema, snapshots, command_facets)
- [ ] Wire round-trip tests (fakeWs server + bare ClientWorld) + offline/online behavior parity test

### Phase 3 QA
- [ ] As Phase 1 QA

### Phase 4: lease + ledger
- [ ] Per-character load lease at join (mechanism decided and recorded in state.md); release on leave; takeover path safe
- [ ] `bank_ledger` additive DDL (with the container discriminator columns, state.md decision 16) + non-blocking writer for every bank op
- [ ] `scripts/bank_audit.mjs` offline conservation checker
- [ ] Tests: lease exclusivity, ledger rows written, audit script on fixture data

### Phase 4 QA
- [ ] As Phase 1 QA

### Phase 5: bank window (desktop)
- [ ] `src/ui/bank_view.ts` pure core (UI_PURE_CORES registered) + `src/ui/bank_window.ts` painter (PainterHostPresentation composition, no raw hex, quality tokens)
- [ ] Open via the `bank` SimEvent; banker docking with bags (vendor-open pattern); auto-close past 8 yd; Esc routing
- [ ] Withdraw clicks (+ shift partial), capacity header, buy-slots confirm prompt in `#prompt-stack`
- [ ] hudChrome.bank.* keys; window tests mirroring the bags window suites

### Phase 5 QA
- [ ] As Phase 1 QA

### Phase 6: deposit + search
- [ ] Deposit mode inserted into BagMode + bagItemAction + bagTooltipHintKey together; deps flag on BagsWindowDeps
- [ ] Deposit-all-materials button; shift-click partial deposits
- [ ] Bank search/category/sort (bag_filter model; localStorage persistence)
- [ ] View-core and painter tests

### Phase 6 QA
- [ ] As Phase 1 QA

### Phase 7: mobile + a11y
- [ ] Mobile 50/50 split with bags, safe areas, 40x40 tap targets, 16px inputs, pan-y grid scrolling, long-press tooltip peek behavior
- [ ] Focus contract (non-modal companion cluster; prompts own their Tab cycle; inert clearing on every teardown)
- [ ] i18n polish: M16 non-Latin fills for wordy strings; mobile screenshot verification

### Phase 7 QA
- [ ] As Phase 1 QA

### Phase 8: bonus slots
- [ ] Server entitlement calculator as an extensible source registry (email, Discord link, wallet link, qualified referrals: referee has a level >= 10 character, cap 5) stamped into character state at load; offline default 0
- [ ] Registry extensibility proven by test (future X and Twitch connect-and-follow rows land without wire or pin churn; not implemented in v1)
- [ ] Referral qualification query on the existing referrals table (no rebuild)
- [ ] Player-facing surface listing bonus sources and status (portal or bank window footer; decide in phase)
- [ ] Tests: entitlement math, cap, qualification, stamp-at-load, no mid-session drift

### Phase 8 QA
- [ ] As Phase 1 QA

### Phase 9: final whole-feature QA
- [ ] Full `qa-checklist.md` matrix green; `npm run gate` green; packet teardown offered

## Notes per phase

(Fill in after each phase: deferrals, surprises, drift.)

### Phase 1 (2026-07-05)
- Reviewers: architecture-reviewer, migration-safety, qa-checklist all returned ZERO blocking; every should-fix and nice-to-have applied (Math.floor price-index hardening, `CharacterState.bank?: BankState` type reuse, deposit-side un-credit test, bonusSlots clamp deferral documented).
- Parity: the new `PlayerMeta.bank` field entered the sampled trace, so `bank` was added to `META_EXCLUDE` (pin updated in harness.test.ts); goldens byte-untouched. DEBT: Phase 3 must remove the exclusion and pin the bank in parity scenarios when it goes on the wire.
- Surprise: every content collect-objective item is quest-kind today, so the deposit-side quest un-credit path is unreachable through real content; it is pinned with a synthetic quest injection in the test and stays as defensive wiring for future content.
- Rollout: forward-only (a pre-bank binary drops the field and banked items are unrecoverable); drain or upgrade realms, never mixed binaries. Full outcome record in state.md "Phase 1 outcomes".
- Next: run docs/bank-system/phase-01-qa.md in a fresh session.

### Phase 2 (2026-07-06)
- Reviewers: architecture-reviewer (0 blocking, 0 should-fix, 4 notes), cross-platform-sync (0 blocking, 4 nits, all deferred-phase handoffs), qa-checklist (READY, 1 should-fix: targeted-far interact test, applied same-session as test 58). Every finding applied or recorded in state.md Phase 2 outcomes.
- PARITY GOLDENS REGENERATED (user-approved in-phase): three ctor-placed NPCs shift every later entity id by +3, so "goldens byte-identical" is unachievable for any world-entity addition. Independent audit (script + architecture-reviewer re-verification): all 48 changed goldens are a pure +3 id-family offset, rng draw digests and counts byte-identical, zero anomalies. Landed as its own test(parity) commit per tests/parity/CLAUDE.md. The packet acceptance criterion was amended accordingly.
- Easter egg: the Eastbrook banker is Bursar Fernando (bursar_fernando), renamed mid-phase from the planned bursar_hobb at the maintainer's request. All phase docs, i18n keys, and translations re-keyed; repo-wide grep for the old id is clean (the two historical provenance notes in docs are deliberate).
- Deferral: an in-world visual placement check of the three bankers (overlap/geometry) needs a running client; deferred to the Phase 2 QA session.
- Next: run docs/bank-system/phase-02-qa.md in a fresh session.

### Phase 1 QA (2026-07-06)
- Verdict: PASS after fixes. 1 blocking + 7 should-fix + 5 nice-to-have found; all applied except 3 refuted with evidence. `src/sim/bank.ts` survived QA byte-unchanged; every applied fix was test decisiveness, i18n accuracy, or merge damage. Full record in state.md "Phase 1 QA outcomes".
- The blocking was merge damage, not Phase 1: `17f311ca4` (release/v0.22.0 merge) committed unresolved conflict markers into the generated `src/ui/i18n.status.summary.json`; regenerated via `npm run i18n:gen` and committed.
- Planted-bug pass (acceptance criterion 1): 5/5 conservation mutations caught by the sweep itself, including the vacuity guard.
- `tests/bank.test.ts` grew 41 -> 42 tests and every refusal path now pins copper + both containers; the two generic persistence suites now cover the bank field.
- Next: run docs/bank-system/phase-02-banker-npcs.md in a fresh session.
