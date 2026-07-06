# Phase 3: IWorld Facet and Wire Protocol

Expose the bank through the IWorld seam and the wire protocol, implemented in BOTH Sim
and ClientWorld in the same commits, with every pinned count bumped.

### Starter Prompt
```
This is Phase 3 of the Bank System feature: IWorld Facet and Wire Protocol.

Model: Opus 4.8, xhigh effort. Harness: Claude Code.
ULTRACODE: not batch-heavy; parallel Agent fan-out suffices.

Goal: land src/world_api/bank.ts, the three wire commands with validated dispatch, the
proximity-gated snapshot field, the ClientWorld mirror, and every pin bump, so the
offline Sim and the online ClientWorld satisfy the same IWorldBank surface.

STEP 0 - PRE-FLIGHT: `git status` clean on feature/bank-system; Phases 1 and 2 plus QA
complete per progress.md. Memory scan: bank-system-design-research (the pinned-counts
gotcha list); api-pipeline HEAD parity entry is NOT relevant (no REST here).

STEP 1 - LOAD CONTEXT (via an Explore agent):
- docs/bank-system/state.md (decisions 6, 7, 8; pinned counts section), progress.md,
  this file
- src/world_api.ts (facet extends list, COMMAND_NAMES, COMMAND_FACETS,
  DISPATCH_ONLY_COMMANDS) + one existing facet file (src/world_api/inventory.ts)
- src/net/online.ts (cmd() helper, applySnapshot delta-guard idiom, mailInfo mirror)
- server/game.ts regions: dispatchMessage mail/market cases (validation style),
  selfWireJson maybe() calls, HEAVY_SELF_CMDS and HEAVY_SELF_EVENTS
- src/sim/bank.ts and src/sim/mail/post_office.ts mailInfoFor (proximity-gated info
  read shape)
- tests/world_api_parity.test.ts, tests/command_schema.test.ts, tests/snapshots.test.ts,
  tests/command_facets.test.ts (the pins and their counts), tests/loot_roll_wire.test.ts
  + tests/interest.test.ts (fakeWs round-trip idiom)
- CLAUDE.md (root) + src/net/CLAUDE.md + server/CLAUDE.md
Return: the four-step networked-action recipe as it exists today, the exact pin
locations and current values, and the maybe()/TERSE_TO_IWORLD registration points.

STEP 2 - CHOOSE ORCHESTRATION + EXECUTE (two agents in parallel):

Agent A (facet + server wire) deliverables:
- src/world_api/bank.ts: IWorldBank with a proximity-gated data member bankInfo (null
  away from a banker; contains slots, capacity, purchasedSlots, bonusSlots,
  nextExpansionCost) and methods bankDeposit(slotIndex, count?),
  bankWithdraw(slotIndex, count?), bankBuySlots(). Add to the IWorld extends list;
  finalize names and record them in state.md.
- COMMAND_NAMES appends (append-only, protocol forever; confirm against state.md
  decision 6 BEFORE appending): bank_deposit, bank_withdraw, bank_buy_slots; matching
  COMMAND_FACETS tags keyed on the wire strings. These tokens are PERSONAL-bank only
  and must never grow an optional guild id later; the future guild bank gets its own
  guild_bank_* tokens with their own permission-validating dispatch path (state.md
  decision 16).
- server/game.ts dispatchMessage cases with per-field type validation (typeof checks,
  the mail_take style) delegating to the sim methods; all three commands added to
  HEAVY_SELF_CMDS (omission lags client bags/copper up to 2 seconds).
- selfWireJson ships the bank info via maybe('bank', ...) ONLY while nearBanker (the
  mailInfoFor pattern; the bank is small, no wire cap needed).
- Sim implements the facet members (bankInfo from local state + proximity; command
  methods delegate to the Phase 1 functions).

Agent B (ClientWorld + pins + tests) deliverables:
- ClientWorld: typed cmd() senders for the three commands; bankInfo mirror decoded with
  a delta guard (if (s.bank !== undefined) this.bankInfo = ...), NEVER defaulting to
  empty on omission.
- Pin bumps in the SAME commit as each seam edit: tests/world_api_parity.test.ts
  (member count and sorted lists; facet count 22 plus one),
  tests/command_schema.test.ts (EXPECTED_SEND_COUNT 118 plus 3, EXPECTED_DISPATCH_COUNT
  127 plus 3), tests/snapshots.test.ts (ALL_DELTA_KEYS 30 to 31, TERSE_TO_IWORLD bank
  -> bankInfo, dirtyEveryDeltaField), tests/command_facets.test.ts.
- Tests: wire round-trip (vi.mock('../server/db') hoisted above the server/game import,
  fakeWs, GameServer join + handleMessage + broadcastSnapshots, bare ClientWorld via
  Object.create + applySnapshot); offline Sim vs online ClientWorld parity for
  deposit/withdraw/buy outcomes; first snapshot carries the delta key near a banker;
  unchanged and far-away snapshots omit it without wiping the mirror.

INVARIANTS THIS PHASE MUST KEEP:
- One sim, three hosts: the facet is implemented on BOTH Sim and ClientWorld in the
  same commit (the parity gate demands it).
- Server authority: every command field validated in dispatch; the sim re-validates
  proximity and rules.
- Wire tokens are append-only and never renamed.
- render/ui untouched (they consume the facet in Phases 5 to 7).

Out of scope: any UI; the ledger (Phase 4); bonus slot sources (Phase 8); headless env
observation changes (not part of this feature unless a later phase says so).

STEP 3 - VALIDATION + MULTI-AGENT REVIEW:
- Run: npx tsc --noEmit; npx vitest run tests/world_api_parity.test.ts
  tests/command_schema.test.ts tests/snapshots.test.ts tests/command_facets.test.ts
  tests/bank.test.ts tests/env_protocol.test.ts tests/bandwidth.test.ts; npm run
  ci:changed.
- Spawn ONLY: cross-platform-sync (mandatory: IWorld + wire + dispatch),
  architecture-reviewer (sim facet implementation), privacy-security-review
  (server/game.ts dispatch surface), qa-checklist. COVERAGE prompts; truncation resume;
  no commit with BLOCKING findings.

STEP 4 - COMMIT CADENCE (explicit paths):
- feat(net): IWorldBank facet, bank wire commands, and ClientWorld mirror
- feat(server): validated bank dispatch + proximity-gated bank snapshot field
- test(net): bank wire round-trip and pin updates

STEP 5 - ACCEPTANCE CRITERIA:
- [ ] All four pin suites green with the new counts (no loosened lists)
- [ ] Round-trip test proves deposit/withdraw/buy work over the wire end to end
- [ ] Omitted delta key never wipes the client mirror; far from banker bankInfo is null
- [ ] HEAVY_SELF_CMDS contains all three commands
- [ ] Offline and online produce identical outcomes for the same action script
- [ ] state.md records the final facet member and wire key names

STEP 6 - DOC UPDATES + MEMORY: progress.md, state.md (members, keys, commands), memory.

STEP 7 - FINAL RESPONSE FORMAT: status, files, validation, review verdicts, deferrals,
handoff: run docs/bank-system/phase-03-qa.md next.

STOPPING RULES:
- Stop before appending any wire token that differs from state.md decision 6.
- Stop if a pin can only pass by loosening a pinned list (sorted toEqual lists are
  anti-loosening by design; the fix is the code, not the pin).
```
