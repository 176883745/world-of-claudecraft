# Book of Deeds: packet progress

Update this table at the end of every session. Cadence: implement file, then its
QA file, then the next implement file. Never skip a QA row. Every session's final
response names the next file by full path.

| # | File | Status | Completed | Notes |
|---|---|---|---|---|
| 0 | overview.md + catalog/ | DRAFTED | 2026-07-08 | Awaiting maintainer packet review |
| 1 | phase-01-sim-core.md | DONE | 2026-07-08 | 186 deeds + evaluator + persisted state + retro-on-join; all 7 Fiesta deeds shipped (bot-roster gate); goldens deliberately regenerated (draw digests unchanged); deferred list in the commit body |
| 1Q | phase-01-qa.md | DONE | 2026-07-08 | Acceptance + full gate green. Catalog fidelity clean: 197 catalog blocks, 186 transcribed (11 deferred stay in catalog, none leaked), 0 invented / 0 silently dropped, 2285 renown, 19 titles, 3 borders, name/desc/renown/hidden all match; 42 manual deeds all have a grant site; wayfarer POI marks match zone labels exactly. Both mutations (threshold flip, renown-increment break) redded a test. architecture-reviewer: 0 blocking / 0 should-fix (3 benign notes). test-coverage-auditor findings applied: added 2v2-bracket, lifetimeXp-boundary, quest and gathering negatives, plural-quests branch coverage. Adversarial: 85-event join burst drains and converges; dual-write byte-equal on second save; renown recomputed on load; grantDeed not client-reachable; no-op set re-adds do not dirty; removed-content sanitize never touches deed state |
| 2 | phase-02-iworld-wire.md | DONE | 2026-07-08 | IWorldDeeds facet (5 members) in both worlds; deed_set_title command + entity title identity-wire key; deeds/dstats heavy-gated + renown/atitle per-tick self keys; deedUnlocked in HEAVY_SELF_EVENTS; load re-applies the saved title through the setter validator (stale id loads untitled; one 01 fixture amended to earn-then-select). Gates re-pinned: W0c 209/58/151 + 26 facets, W0a 40 delta keys + 3 renames + renown-absence pin, W0b 132/141, facet-tag block appended. Goldens stayed green (no regen needed). Reviewers: cross-platform-sync 0 blocking (dstats <=2s freshness floor documented as deliberate), qa-checklist + test-coverage-auditor should-fixes all applied (client-frame/server-dispatch lockstep round-trip, server null-clear, mid-session unlock re-emit). Full gate PASS twice; adversarial answers in session output |
| 2Q | phase-02-qa.md | DONE | 2026-07-08 | Acceptance re-run green (5 files, 397 tests) + full gate PASS. cross-platform-sync: all 8 checklist items PASS, 0 critical/warning (parity + wire tables clean; facet purity confirmed under the architecture walk; title clear propagates as a full re-wire); one tracked follow-up: deedUnlocked has no HUD handler yet, owned by the window session by scope (toasts are named out of scope for the wire slice). test-coverage-auditor: 0 blocking / 0 should-fix, 5 nits; all actionable ones landed in 2c9f57440 (entity-field asserts on the rewardless/border reject arms, exact renown-propagation pin toBe(5), fresh-player empty-wire value fidelity, legacy save without an activeTitle key, plus the cross-client CLEAR direction and a content-drifted earned-id negative from the adversarial pass; the two defensive-dead-code notes recorded, no change needed). Adversarial probes (temp file, run then deleted): drifted title id via raw dispatch is a silent no-op with zero error frames; resume-path reconnect resets lastSent/sentEnts/selfHeavyDirty so all four self keys repopulate with current values; two-client set-then-clear converges end to end. No coordinator growth (sim.ts +29 thin delegation only; hud/main/renderer untouched); no player-visible English introduced |
| 3 | phase-03-deeds-window.md | NOT STARTED | | |
| 3Q | phase-03-qa.md | NOT STARTED | | |
| 4 | phase-04-server-persistence.md | NOT STARTED | | |
| 4Q | phase-04-qa.md | NOT STARTED | | |
| 5 | phase-05-leaderboard.md | NOT STARTED | | |
| 5Q | phase-05-qa.md | NOT STARTED | | |
| 6 | phase-06-wiki-guide.md | NOT STARTED | | |
| 6Q | phase-06-qa.md | NOT STARTED | | |
| 7 | phase-07-steam.md | NOT STARTED | | |
| 7Q | phase-07-qa.md | NOT STARTED | | |
| 8 | phase-08-mobile-polish.md | NOT STARTED | | |
| 8Q | phase-08-qa.md | NOT STARTED | | |

Final cleanup: `docs/achievements/` is deleted in the phase-08-qa exit step
(the QA spec must exist on disk to run); the memory file
`achievements-system-design.md` remains the record of maintainer calls.
