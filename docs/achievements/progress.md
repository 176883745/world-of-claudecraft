# Book of Deeds: packet progress

Update this table at the end of every session. Cadence: implement file, then its
QA file, then the next implement file. Never skip a QA row. Every session's final
response names the next file by full path.

| # | File | Status | Completed | Notes |
|---|---|---|---|---|
| 0 | overview.md + catalog/ | DRAFTED | 2026-07-08 | Awaiting maintainer packet review |
| 1 | phase-01-sim-core.md | DONE | 2026-07-08 | 186 deeds + evaluator + persisted state + retro-on-join; all 7 Fiesta deeds shipped (bot-roster gate); goldens deliberately regenerated (draw digests unchanged); deferred list in the commit body |
| 1Q | phase-01-qa.md | NOT STARTED | | |
| 2 | phase-02-iworld-wire.md | NOT STARTED | | |
| 2Q | phase-02-qa.md | NOT STARTED | | |
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
