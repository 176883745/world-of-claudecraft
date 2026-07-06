# Phase 1: Sim Bank Core

The deterministic sim bank module, character state, and the full locked rule set, with
the conservation and determinism test harness. No IWorld, no wire, no NPCs, no UI.

### Starter Prompt
```
This is Phase 1 of the Bank System feature: Sim Bank Core.

Model: Opus 4.8, xhigh effort (reserve max for genuinely frontier problems), 1m context
variant where the file load demands it.
Harness: Claude Code.
ULTRACODE: not batch-heavy; parallel Agent fan-out suffices. Add `ultracode` only if you
choose to adversarially verify the conservation harness with a Workflow.

Goal: land src/sim/bank.ts behind the SimContext seam with the bank character state,
deposit/withdraw/expansion rules, persistence, i18n matchers, and a heavyweight test
suite, without touching IWorld, the wire protocol, NPCs, or the UI.

STEP 0 - PRE-FLIGHT:
- Verify `git status` is clean and the branch is feature/bank-system. If not, ask the
  user (a concurrent session may share this checkout).
- Memory scan: MEMORY.md index; the bank-system-design-research entry; the
  full-npm-test-contention and biome-touched-files entries.

STEP 1 - LOAD CONTEXT (do NOT read planning docs or monoliths directly):
Spawn an Explore agent to read and summarize:
- docs/bank-system/state.md (every locked decision; especially decisions 1, 3, 5, 10, 12)
- docs/bank-system/progress.md (Phase 1 checklist)
- docs/bank-system/phase-01-sim-bank-core.md (this prompt)
- src/sim/bags.ts (capacity math, canAddItem/fitsAll idioms, DEFAULT_STACK,
  UNSTACKED_KINDS, bagsFullError, migration precedent)
- src/sim/types.ts (InvSlot, ItemInstancePayload, cloneInvSlot, CharacterState)
- src/sim/mail/post_office.ts (SimContext town-service module shape, zero-rng note,
  serialize/load pattern)
- src/sim/sim_context.ts (seam contract, CALLBACK_KEYS append-only list)
- src/sim/sim.ts ONLY the regions the agent locates for: PlayerMeta fields around
  inventory/bags, serializeCharacter/addPlayer state load, and the inventory hub
  (addItem/removeItem/canAddItem)
- src/ui/sim_i18n.ts (EXACT/RULE matcher shapes)
- tests/bags.test.ts, tests/trade.test.ts, tests/persistence_round_trip.test.ts,
  tests/character_state_backcompat.test.ts (test idioms to mirror)
- CLAUDE.md (root) + src/sim/CLAUDE.md + tests/CLAUDE.md
The agent returns: the exact PlayerMeta/CharacterState insertion points, the SimContext
wiring recipe, the matcher rule format, and the seed-sweep test idiom.

STEP 2 - CHOOSE ORCHESTRATION + EXECUTE:
Spawn two agents in parallel (explicitly; Opus 4.8 will not self-initiate fan-out), each
owning a vertical slice with its own tests:

Agent A (sim module + state + persistence) deliverables:
- src/sim/bank.ts behind SimContext, the bags.ts/PostOffice shape: free functions taking
  ctx plus pid (state stays on Sim/PlayerMeta as live ctx views; thin same-named
  delegates on Sim; ZERO rng draws anywhere in bank code).
- Constants as data: BANK_BASE_SLOTS = 24, BANK_EXPANSION_SLOTS = 6, and the 12-entry
  expansion price table from state.md decision 3 (500c doubling to 1,200,000c).
- Character state: a bank container { inventory: InvSlot[], purchasedSlots: number,
  bonusSlots: number } on PlayerMeta and CharacterState; serialize/load with ??
  back-compat defaults (pre-bank saves load with an empty bank and zero purchases);
  cloneInvSlot deep-clones at EVERY save/load boundary; tampered-save sanitization that
  never destroys items (bags.ts precedent). Record the final field names in state.md.
- Operations: bankDeposit(slotIndex, count?), bankWithdraw(slotIndex, count?),
  bankBuySlots(). The underlying move helpers must be CONTAINER-AGNOSTIC: pure
  functions over (source list, dest list, capacity budgets), never hardcoded to "the
  player's bank", so future consumers (loadout presets, the guild bank, the account
  vault) reuse them unchanged (state.md decision 16). Rules (state.md decision 10, all
  of them): quest-kind items denied
  with a clear English line; instanced slots deposit whole and never merge with plain
  stacks; deposits pre-check bank capacity and withdrawals pre-check bag fitsAll; every
  refusal moves nothing and charges nothing; purchases are non-refundable, charge exact
  copper, and guard overflow like MARKET_MAX_PRICE does; no copper storage. Capacity =
  BANK_BASE_SLOTS + purchasedSlots + bonusSlots; bonusSlots stays 0 until Phase 8.
- Proximity gating is NOT in this phase: Phase 2 adds the banker anchor check. Structure
  each operation so the gate lands in exactly one place per command boundary.

Agent B (tests + i18n) deliverables:
- tests/bank.test.ts: the full rule matrix with the exact deny literals;
  money-not-charged and item-left-in-place assertions on every refusal in BOTH
  directions; instanced payload round-trips (charges/signer/boundTo survive
  deposit-withdraw and serialize-load); conservation invariant seed sweeps: across
  randomized-but-seeded op sequences over 50-plus seeds, the multiset of items over
  inventory plus bank is exactly conserved except explicit sinks, with a non-vacuity
  flag proving ops actually executed (the world_boss.test.ts sweep idiom); determinism:
  run() deep-equals run() over 300 ticks with bank ops in the action script;
  persistence round-trip (serialize -> load -> serialize deep-equal), legacy back-compat
  (state with the bank field DELETED loads clean), tamper sanitization.
- i18n: every deny/notice emit gets a matching EXACT/RULE entry in src/ui/sim_i18n.ts in
  this same change, and src/sim/bank.ts is appended to the S3 guard's hardcoded simSrc
  list in tests/localization_fixes.test.ts (known blind spot: forgetting the append
  ships silent English to every locale).

INVARIANTS THIS PHASE MUST KEEP:
- Determinism: all sim randomness via Rng, and the bank draws NO rng at all; no
  Math.random / Date.now / performance.now in src/sim/.
- Items are NEVER destroyed by capacity or by any refusal path.
- Module-first: no new method clusters on sim.ts beyond thin delegates; the logic lives
  in src/sim/bank.ts.
- src/sim/ stays host-agnostic: no DOM, no imports from render/ui/game/net.
- Every player-visible emit is English at the site plus a sim_i18n matcher in the SAME
  change.

Out of scope (do NOT do in this phase):
- IWorld facet, COMMAND_NAMES, dispatch, ClientWorld (Phase 3).
- Banker NPCs, proximity checks, SimEvents (Phase 2).
- UI of any kind (Phases 5 to 7).
- Ledger, lease (Phase 4). Bonus slot sources (Phase 8).

STEP 3 - VALIDATION + MULTI-AGENT REVIEW:
- Run: npx tsc --noEmit; npx vitest run tests/bank.test.ts tests/architecture.test.ts
  tests/persistence_round_trip.test.ts tests/character_state_backcompat.test.ts;
  npx vitest run tests/parity (must be byte-identical: this phase must not disturb any
  existing scenario); npm run i18n:gen then npx vitest run
  tests/localization_fixes.test.ts; npm run ci:changed.
- Spawn ONLY these reviewers (this diff touches src/sim/ and the characters.state
  shape): architecture-reviewer (sim purity, SimContext contract, rng), migration-safety
  (persisted-state shape + back-compat), qa-checklist (deliverable set complete).
  Prompt each for COVERAGE not filtering ("report every issue including low-severity
  and uncertain ones; ranking happens later"). Resume a truncating reviewer with:
  "Stop reading more files. Output the full report now. No more tool calls. Format:
  BLOCKING / SHOULD-FIX / NICE-TO-HAVE / VERDICT." Do not commit until no BLOCKING.

STEP 4 - COMMIT CADENCE (explicit paths, never git add -A):
- feat(sim): add bank module, character state, and expansion pricing
- test(sim): bank rule matrix, conservation sweeps, persistence round-trip
- feat(i18n): sim_i18n matchers for bank deny lines + S3 simSrc registration

STEP 5 - ACCEPTANCE CRITERIA (do not mark complete until all check):
- [ ] tests/bank.test.ts green and decisive (a planted conservation bug fails the sweep)
- [ ] tests/architecture.test.ts green (bank.ts auto-scanned, no violations)
- [ ] tests/parity goldens unchanged
- [ ] Legacy save without the bank field loads and re-serializes clean
- [ ] Every deny literal has a sim_i18n matcher; S3 guard green with bank.ts in simSrc
- [ ] npx tsc --noEmit and npm run ci:changed green
- [ ] state.md updated with final field and function names

STEP 6 - DOC UPDATES + MEMORY:
- Update docs/bank-system/progress.md (Phase 1 checklist + status table + notes).
- Update docs/bank-system/state.md (final names; any decision made in-phase).
- Record surprising rules to memory for the next session.

STEP 7 - FINAL RESPONSE FORMAT:
End with: phase status, files touched, validation results, review-agent verdicts,
deferred items, and the handoff: run docs/bank-system/phase-01-qa.md in a fresh session.

STOPPING RULES:
- Stop if any tests/parity golden changes: the bank must not affect existing scenarios.
- Stop if a locked rule cannot be implemented without contradicting the bags.ts
  contracts (items never destroyed, over-capacity tolerated); surface the conflict.
- Stop if the SimContext seam requires a new callback whose addition would reorder
  existing CALLBACK_KEYS (append only).
```
