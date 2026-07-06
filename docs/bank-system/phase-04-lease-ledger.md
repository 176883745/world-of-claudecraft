# Phase 4: Character Lease and Bank Ledger

Close the cross-process double-load window (the top verified dupe root cause) and make
every bank operation auditable after the fact.

### Starter Prompt
```
This is Phase 4 of the Bank System feature: Character Lease and Bank Ledger.

Model: Opus 4.8, xhigh effort. Harness: Claude Code.
ULTRACODE: not batch-heavy; parallel Agent fan-out suffices.

Goal: a per-character load lease at join (no two processes can load the same character),
an append-only bank_ledger written for every bank operation, and an offline conservation
audit script.

STEP 0 - PRE-FLIGHT: `git status` clean on feature/bank-system; Phases 1 to 3 plus QA
complete. Memory scan: bank-system-design-research (dupe taxonomy: the concurrent
double-load class and the UO auditability lesson); lazy-db-bundle vs partial mock entry
(module-load db imports break downstream vi.mock partials; use the memoized lazy
accessor pattern).

STEP 1 - LOAD CONTEXT (via an Explore agent):
- docs/bank-system/state.md (decision 11; OPEN item on the lease mechanism), progress.md,
  this file
- server/db.ts regions: SCHEMA DDL style (CREATE TABLE IF NOT EXISTS, additive), the
  boot advisory lock, saveCharacterState, pool size (10 clients), getCharacter
- server/game.ts regions: join / leave / takeOverCharacter,
  sessionsByCharacterId (the process-local guard being superseded), the dispatch sites
  of the three bank commands (ledger hook points)
- server/discord_db.ts reward_ledger (the append-only + exactly-once template)
- server/realm.ts + scripts/dev-realms.mjs (multi-process-per-DB reality)
- tests/save_character_and_market.test.ts (db test idioms)
- CLAUDE.md (root) + server/CLAUDE.md
Return: the join/leave/takeover call graph, the DDL insertion point, the ledger
template shape, and how tests mock the db.

STEP 2 - CHOOSE ORCHESTRATION + EXECUTE (two agents in parallel):

Agent A (lease) deliverables:
- DECIDE the mechanism first and record it in state.md: pg advisory lock per character
  id vs a lease row with expiry and heartbeat. Weigh: advisory locks bind to a pooled
  connection (pool is 10 clients shared with HTTP; one lock-holding client per online
  character would starve it, which likely disqualifies session-length advisory locks),
  crash recovery (a lease row needs expiry; an advisory lock self-releases), and npm
  run realms (multiple processes, one Postgres; the lease is per character id and must
  not block different characters or different realms).
- Acquire the lease in join BEFORE the character loads; release on leave (after the
  atomic save) and on shutdown; keep takeOverCharacter working (same-account takeover
  goes through leave, so the lease hands over cleanly); expired leases are reclaimable.
- Fail closed on conflict with a clear player-facing error routed like existing join
  refusals ('character already in world' precedent), localized per the server_i18n
  matcher rules if it is a new string.
- Tests: second join while held is refused; takeover succeeds; lease released on leave;
  expired lease reclaimed; different characters and different realms unaffected.

Agent B (ledger + audit) deliverables:
- bank_ledger additive DDL in server/db.ts SCHEMA: id, realm, character_id, account_id,
  op, item_id, count, instance jsonb null, copper_delta, purchased_slots_after,
  container TEXT NOT NULL DEFAULT 'personal', container_id BIGINT NULL, created_at;
  indexes on character_id and created_at. The container discriminator is guild-bank
  readiness (state.md decision 16): v1 writes only 'personal' with a null container_id,
  and the future guild bank writes 'guild' + guild id into the SAME ledger. Idempotent
  under the boot advisory lock (boot it twice in a test).
- A non-blocking writer (queued fire-and-forget; a rejection logs and never blocks or
  reorders gameplay saves) invoked server-side for every successful bank_deposit /
  bank_withdraw / bank_buy_slots.
- scripts/bank_audit.mjs: offline conservation checker over bank_ledger plus
  characters.state (flags negative counts, ledger/state mismatches, purchased_slots
  regressions); runnable against the dev DB (npm run db:up). Group and report BY
  CONTAINER from day one (v1 has only 'personal'; the guild bank inherits a working
  audit instead of a rewrite).
- Tests: ledger rows written per op (mocked db capturing SQL), writer never throws into
  the game loop, audit script flags a planted anomaly in fixture data.

INVARIANTS THIS PHASE MUST KEEP:
- SQL lives only in db.ts / *_db.ts modules (server CLAUDE.md rule); parameterized
  queries only.
- DDL is additive and idempotent; there is no migrations directory.
- The game loop never awaits the ledger writer; gameplay outcomes never depend on it.
- Never touch ALLOW_DEV_COMMANDS or weaken any auth path.

Out of scope: admin dashboard surfaces; economy freeze tooling (a future ops item);
any sim or UI change.

STEP 3 - VALIDATION + MULTI-AGENT REVIEW:
- Run: npx tsc --noEmit; npm run build:server; npx vitest run
  tests/save_character_and_market.test.ts plus the new lease and ledger suites;
  npm run ci:changed.
- Spawn ONLY: migration-safety (DDL + boot safety, mandatory), privacy-security-review
  (server + SQL, mandatory), qa-checklist. COVERAGE prompts; truncation resume; no
  commit with BLOCKING findings.

STEP 4 - COMMIT CADENCE (explicit paths):
- feat(server): per-character load lease at join
- feat(server): append-only bank_ledger and non-blocking writer
- feat(scripts): bank conservation audit script; test(server): lease and ledger coverage

STEP 5 - ACCEPTANCE CRITERIA:
- [ ] Two simulated processes cannot both load one character; takeover still works
- [ ] Every successful bank op produces exactly one ledger row (mocked db assertion)
- [ ] DDL boots twice cleanly; audit script catches the planted fixture anomaly
- [ ] Game-loop paths never await the writer (code-level assertion or test)
- [ ] state.md records the chosen lease mechanism and the ledger schema

STEP 6 - DOC UPDATES + MEMORY: progress.md, state.md (lease decision, table), memory
(the lease mechanism rationale is worth a note).

STEP 7 - FINAL RESPONSE FORMAT: status, files, validation, review verdicts, deferrals,
handoff: run docs/bank-system/phase-04-qa.md next.

STOPPING RULES:
- Stop if the lease design would hold a pooled client per online character.
- Stop if the ledger writer cannot be made non-blocking without reordering saves.
- Stop if any DDL would rewrite or drop an existing table or column.
```
