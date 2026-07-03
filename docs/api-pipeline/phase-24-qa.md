# Phase 24 QA: Validated config + server timeouts + no-magic-values + perf gate

This is the QA pass for Phase 24. It audits the consolidation diff for correctness (every
acceptance criterion met, byte-equal tunable values, a pure fail-fast loadConfig, server timeouts
that respect the WS upgrade and the 1 MB card upload, a non-flaky perf gate), for test coverage,
and for dead code left behind by replacing scattered process.env reads. Because the
implementation phase was a bounded server-only consolidation with no new routes, persistence, or
player text, this QA stays low-context: a focused four-agent audit over a small diff, then a
fix-and-revalidate loop. Run it in one session.

### QA Starter Prompt

````
This is the QA pass for Phase 24 of the API Pipeline re-architecture: Validated config + server timeouts + no-magic-values consolidation + perf gate.
Model: Opus 4.8, xhigh effort. Harness: Claude Code.
Goal: Confirm Phase 24 met every acceptance criterion with zero behavior change, fix any BLOCKING or SHOULD-FIX finding, and hand off to Phase 25.

STEP 0 - PRE-FLIGHT
- Run `git status`. Shared worktree: if dirty outside this phase's files, STOP and ask. Commit only with EXPLICIT paths, never `git add -A`.
- Scan Claude Code memory for: the Phase 24 implementation note, the server API pipeline audit, the headersTimeout-vs-keepAliveTimeout / loadConfig-purity rule if recorded, and the DISCORD_SCHEMA boot-wiring precedent. Report the 2 to 4 relevant entries.

STEP 1 - LOAD CONTEXT (spawn ONE Explore agent; anchor on symbol names, not line numbers)
Have it summarize:
- docs/api-pipeline/state.md and docs/api-pipeline/progress.md (what Phase 24 claims it landed).
- docs/api-pipeline/phase-24-config-timeouts.md (the acceptance criteria and stopping rules to verify against).
- The Phase 24 git diff: `git diff main...HEAD -- server/http/config.ts server/main.ts server/ratelimit.ts server/ratelimit_db.ts server/http/middleware/ tests/server/` (and any other path the diff actually touches; first run `git diff --name-only main...HEAD` and feed the real list).
- PREMISE CORRECTION (2026-07-03, second v0.20.0 merge 64392ada2): `main...HEAD` now contains
  BOTH v0.20.0 release-merge slices, so the raw range includes release content this packet's
  premises predate: src/sim/game_config.ts (a sim change), the game_config_overrides JSONB DDL,
  and the housekeeping family. Scope the Phase 24 verification to the phase's own commits
  (67c14b6d4, b34680676, e215d0bf9 plus their fix-ups), or exclude the two merge commits
  (c916d296a, 64392ada2) and their reconciliation from the diff before auditing. The merged
  release content has its own gates (the release CI plus the release-merge audits recorded in
  progress.md) and is NOT in this packet's scope.
The Explore agent must return: the final loadConfig(env) signature + every validation it does; the boot call site and whether config is read exactly once; the four startServer timeout assignments and their constant values; the consolidated named-constant block and which POLICIES fields now derive from it; the perf gate constants and test; and a list of any remaining process.env reads on the boot/request path.

STEP 2 - QA AUDIT (fan out; give each agent ONLY the Explore summary plus the diff)
- Correctness agent: verify EVERY acceptance criterion from phase-24-config-timeouts.md STEP 5, one by one, citing the code that satisfies it (or flagging the gap). Specifically confirm: (1) loadConfig is a PURE function of its `env` arg with no module-eval process.env capture, called exactly once at boot; (2) missing/invalid required env (HSTS-in-prod, REQUIRE_WEB_LOGIN, realm/native-app origins, limiter DSN, dispatch flag) fails fast with a clear English error naming the key; (3) the old-path-active-in-prod alert fires; (4) the four timeouts equal their named constants AND headersTimeout exceeds keepAliveTimeout AND the values do not strangle the WS upgrade handshake or a slow 1 MB card upload; (5) every tunable is a named constant with a unit and POLICIES values DERIVE from them and are byte-equal to today's values (no limit/window/cap/page-size/TTL/pool/drain change); (6) the perf gate constants exist and the gate test is deterministic, not flaky. ALSO verify server/three-host parity is intact: no src/sim/ change, no WS wire/snapshot change, and the request behavior on the new path is unchanged by the config refactor. ALSO verify stable-code i18n: confirm the diff added NO player-visible string, and that the boot/config errors plus the prod-old-path alert are dev-channel English (throw/console, never surfaced to a UI), correctly out of i18n scope and NOT a t() key.
- Test-coverage agent: check that tests exist and actually assert: missing-required-env-throws, loadConfig-purity, dispatch-flag-prod-alert, each-timeout-equals-its-constant, each-POLICIES-field-equals-source-constant, no-duplicate-tunable-literal, and the perf/tick-jitter gate. Flag any criterion asserted only by inspection rather than a test.
- Dead-code / cleanup agent: hunt for process.env reads that should now route through config but were missed; orphaned old constants or duplicate literals the consolidation left behind; an unused export from config.ts; and any leftover scaffolding. Flag, do not auto-delete.
- Domain review agents (ONLY those whose surface the diff touches; run `git diff --name-only` first):
  - `privacy-security-review`: server/ boot config, the fail-fast required-env handling, the limiter DSN, and the guard that the dispatch flag cannot silently select the un-hardened OLD path in prod. Prompt for COVERAGE (every gap with confidence + severity), not filtering.
  - `qa-checklist`: the end-of-contribution gate.
  Do NOT dispatch migration-safety, cross-platform-sync, or architecture-reviewer (no DDL/JSONB, no IWorld/sim/wire/matcher/RL, no src/sim change IN THE PHASE-SCOPED DIFF; the raw main...HEAD range does contain release-merge sim/DDL content, which is out of this packet's scope per the premise correction above). If any agent's output is truncated, instruct it: "resume from the last complete finding; do not restart."

STEP 3 - FIX (apply BLOCKING + SHOULD-FIX from the audit)
- Apply every BLOCKING finding and every reasonable SHOULD-FIX. Defer NICE-TO-HAVE with a one-line note.
- Re-run the validation matrix: `npx tsc --noEmit`; `npx vitest run` the affected tests/server/*.test.ts and the perf gate; `npm run ci:changed`; `npm run build:server`; and the pre-merge mirror `npm test && npx tsc --noEmit && npm run build:env && npm run build:server && npm run build`.
- Commit fixes separately with Conventional-Commit scopes and EXPLICIT paths (e.g. `fix(http): route missed process.env read through loadConfig`, `test(server): assert headersTimeout exceeds keepAliveTimeout`).

STEP 4 - UPDATE DOCS + MEMORY
- Update docs/api-pipeline/progress.md and state.md to reflect QA outcome (PASS / PASS-WITH-FOLLOWUPS / FAIL) and any deferrals.
- Record in memory any new surprising rule the audit surfaced (e.g. a node timeout interaction, a config-purity gotcha, a POLICIES-derivation subtlety).

STEP 5 - PACKET TEARDOWN
Not the final phase; skip teardown.

STEP 6 - FINAL RESPONSE FORMAT (return verbatim, concise)
- Verdict: PASS / PASS-WITH-FOLLOWUPS / FAIL.
- Counts: BLOCKING found/fixed, SHOULD-FIX found/fixed, deferred.
- Files touched by the fix commits (absolute paths).
- Validation results (tsc, vitest, build:server, ci:changed, full suite): pass/fail each.
- Review verdicts (privacy-security-review, qa-checklist).
- One-line handoff: "Next: Phase 25 implementation (docs/api-pipeline/phase-25-docs-flag-flip.md)."
````
