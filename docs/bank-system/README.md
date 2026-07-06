# Bank System Packet

A classic-style personal bank for World of ClaudeCraft: banker NPCs in all three town
hubs open a pooled, per-character vault (base 24 slots, copper-purchasable expansions to
96, account-action bonus slots to 112 at v1, 116 once X and Twitch linking ship), with
search/category/sort organization, a
click-to-deposit UX docked beside the bags window, and a heavyweight anti-dupe program
(same-blob persistence, per-character lease, append-only ledger, conservation-invariant
tests). Branch: `feature/bank-system` off `release/v0.22.0`.

Start here, in order:

1. `brainstorm.md`: vision, verified research (MMO banking models, dupe-exploit
   taxonomy), codebase map, approved decisions, gotchas, OPEN items.
2. `state.md`: the cross-phase cheat sheet (locked decisions, pinned counts, validation
   matrix, file paths). Every session loads this first.
3. `implementation-plan.md`: phase table + the canonical team workflow.
4. `progress.md`: status + per-phase deliverable checklists.
5. `qa-checklist.md`: the whole-feature integration matrix (Phase 9).
6. `guild-bank-readiness.md`: the approved future guild-bank brief (verified research,
   locked architecture, prerequisite fixes). Ships after the player bank; v1 only
   keeps its seams (state.md decision 16).

Phase files (each is a self-contained starter prompt for a fresh session; run the QA
session after its implementation session):

- `phase-01-sim-bank-core.md` / `phase-01-qa.md`
- `phase-02-banker-npcs.md` / `phase-02-qa.md`
- `phase-03-iworld-wire.md` / `phase-03-qa.md`
- `phase-04-lease-ledger.md` / `phase-04-qa.md`
- `phase-05-bank-window.md` / `phase-05-qa.md`
- `phase-06-deposit-search.md` / `phase-06-qa.md`
- `phase-07-mobile-a11y.md` / `phase-07-qa.md`
- `phase-08-bonus-slots.md` / `phase-08-qa.md`
- `phase-09-final-qa.md` (closes the packet; offers teardown of this directory)

This packet is planning scaffolding, not a shipping artifact; Phase 9 offers its
deletion before the PR.
