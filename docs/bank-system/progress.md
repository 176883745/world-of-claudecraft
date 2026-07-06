# Bank System: Progress

## Status table

| Phase | Status | Started | Completed |
|---|---|---|---|
| Phase 1: sim bank core | not started | | |
| Phase 1 QA | not started | | |
| Phase 2: banker NPCs | not started | | |
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
- [ ] `src/sim/bank.ts` module behind SimContext (state on Sim/PlayerMeta as live ctx views; thin delegates on Sim; zero rng draws)
- [ ] Character state fields (`bank` container: inventory + purchasedSlots) with serialize/load + `?? ` back-compat defaults + `cloneInvSlot` deep-clone at boundaries
- [ ] Deposit/withdraw/buy-expansion logic with the full locked rule set (quest-kind deny, instanced no-merge, fitsAll pre-checks both directions, refusals move nothing and charge nothing, non-refundable purchases, expansion price table as data)
- [ ] Capacity math: base 24 + purchased blocks + bonusSlots field (bonus stays 0 until Phase 8)
- [ ] `tests/bank.test.ts`: rule matrix, exact deny literals, conservation invariant seed sweeps (non-vacuous), determinism (run() equals run()), persistence round-trip + back-compat + tampered-save sanitization
- [ ] sim_i18n matcher entries for every new emit + S3 simSrc list append (same change)

### Phase 1 QA
- [ ] Deliverables and acceptance criteria verified; coverage/dead-code/cleanup agents run; findings fixed

### Phase 2: banker NPCs
- [ ] Three banker NpcDefs (Eastbrook, Fenbridge, Highwatch hubs) with `banker: true`, greetings, placement
- [ ] Interaction arm: gossip row wiring flagged off NpcDef, `{type:'bank', pid}` SimEvent, `bankerIds` anchor list, `INTERACT_RANGE + 2` proximity validation inside the sim on every bank command
- [ ] Entity i18n lists + guide regen (`npm run wiki:content`) + `guide.*` prose keys
- [ ] Sim tests: proximity open/deny, event emission, anchor-list behavior

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
- [ ] `bank_ledger` additive DDL + non-blocking writer for every bank op
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
