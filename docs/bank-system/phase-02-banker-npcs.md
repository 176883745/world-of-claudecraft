# Phase 2: Banker NPCs and Interaction

Three banker NPCs in the town hubs, the interaction arm that opens the bank, and
proximity gating on every bank command boundary.

### Starter Prompt
```
This is Phase 2 of the Bank System feature: Banker NPCs and Interaction.

Model: Opus 4.8, xhigh effort. Harness: Claude Code.
ULTRACODE: not batch-heavy; parallel Agent fan-out suffices.

Goal: add the three bankers (Eastbrook, Fenbridge, Highwatch), the bank SimEvent and
interact routing, the bankerIds anchor list, and the proximity gate on the Phase 1
command boundaries, plus entity i18n and guide regen.

STEP 0 - PRE-FLIGHT:
- `git status` clean on feature/bank-system; Phase 1 and its QA complete per
  progress.md. If not, ask the user.
- Memory scan: bank-system-design-research entry.

STEP 1 - LOAD CONTEXT (via an Explore agent):
- docs/bank-system/state.md (decisions 9 and 10), progress.md, this file
- src/sim/types.ts (NpcDef, SimEvent union, INTERACT_RANGE)
- src/sim/content/zone1.ts zone2.ts zone3.ts (hub NPC rosters + positions; hubs are
  Eastbrook {0,0} r26, Fenbridge {0,300} r20, Highwatch {0,660} r20)
- src/sim/content/mailboxes.ts + the Sim constructor NPC/mailbox placement region
  (anchor-id registration pattern; createNpc draws no rng)
- src/sim/interaction.ts (interact routing by kind/templateId; mailbox event emit)
- src/sim/market.ts nearMerchant + src/sim/mail/post_office.ts nearMailbox (anchor
  proximity checks), src/sim/bank.ts (Phase 1 command boundaries)
- src/ui/world_entity_i18n.ts (NPC id lists), src/guide/CLAUDE.md (wiki regen)
- tests/mail.test.ts (moveToMailbox helper idiom)
- CLAUDE.md (root) + src/sim/CLAUDE.md + src/sim/content/CLAUDE.md if present
Return: exact placement insertion points, the SimEvent union location, the anchor
registration recipe, and free hub coordinates that do not collide with the rosters.

STEP 2 - CHOOSE ORCHESTRATION + EXECUTE (two agents in parallel, explicit fan-out):

Agent A (sim + content) deliverables:
- NpcDef.banker?: true in src/sim/types.ts.
- Three banker records with greetings ("The Gilded Strongbox" banking-house flavor):
  bursar_fernando (Eastbrook, zone1; renamed from bursar_hobb mid-phase at the
  maintainer's request as an easter egg), bursar_petra_vell (Fenbridge, zone2),
  bursar_aldous_crane (Highwatch, zone3). Positions inside the hubs, not overlapping
  existing roster spots. Never the name Vaultwarden. Record final ids in state.md.
- bankerIds anchor list on the bank module + nearBanker(pid) at INTERACT_RANGE + 2 (the
  merchantIds/mailboxIds pattern); Sim constructor registers banker entity ids at
  placement without adding any rng draw or reordering placement.
- SimEvent { type: 'bank', pid } added to the union; talking to a banker (talkToNpc /
  interact routing) emits it (the mailbox pattern).
- The nearBanker gate added to bankDeposit/bankWithdraw/bankBuySlots at the single
  command-boundary point Phase 1 left for it, with an English deny line when far.

Agent B (tests + i18n + guide) deliverables:
- Tests: moveToBanker helper (moveToMailbox idiom); interact near a banker emits the
  bank event exactly once; each command denied when far with the exact literal and
  allowed when near; works from all three bankers; parity goldens untouched.
- New deny/notice lines get sim_i18n EXACT/RULE entries in the SAME change.
- NPC ids + names + titles + greetings into src/ui/world_entity_i18n.ts.
- npm run wiki:content regen; add guide.* prose keys if the generator asks for them;
  tests/guide.test.ts green.

INVARIANTS THIS PHASE MUST KEEP:
- Determinism: placement draws no rng; placement and CAMPS order untouched (append
  only); parity goldens byte-identical.
- Server authority posture: proximity validated INSIDE the sim (anchor list), never
  trusted from a client-supplied npc id alone.
- Every new player-visible line: English emit + sim_i18n matcher in the same change.

Out of scope: wire commands and IWorld (Phase 3); the HUD gossip row and window (Phase
5); any UI.

STEP 3 - VALIDATION + MULTI-AGENT REVIEW:
- Run: npx tsc --noEmit; npx vitest run tests/bank.test.ts tests/architecture.test.ts
  tests/parity tests/guide.test.ts; npm run i18n:gen then npx vitest run
  tests/localization_fixes.test.ts; npm run ci:changed.
- Spawn ONLY: architecture-reviewer (sim change, placement determinism),
  cross-platform-sync (new SimEvent type), qa-checklist. COVERAGE prompt; truncation
  resume message; no commit with BLOCKING findings.

STEP 4 - COMMIT CADENCE (explicit paths):
- feat(sim): banker NPCs, bank SimEvent, and proximity gates
- feat(content): Gilded Strongbox bursars in all three hubs
- test(sim): banker proximity and event coverage; chore(guide): regen wiki content

STEP 5 - ACCEPTANCE CRITERIA:
- [ ] Interacting with each of the three bankers emits { type: 'bank', pid } once
- [ ] All three bank commands deny when far, succeed when near, exact literals matched
- [ ] tests/parity green with the rng draw-order digest unchanged (AMENDED in-phase with
  user approval: adding ctor-placed NPCs shifts every later entity id, so goldens were
  regenerated via UPDATE_PARITY=1 after an audit proved a pure +3 id-family offset with
  zero rng and zero behavioral change; "byte-identical" is unachievable for any change
  that adds a world entity); guide freshness green; S3 guard green
- [ ] world_entity_i18n lists complete; state.md records the final NPC ids

STEP 6 - DOC UPDATES + MEMORY: progress.md, state.md (ids, SimEvent), memory notes.

STEP 7 - FINAL RESPONSE FORMAT: status, files, validation, review verdicts, deferrals,
handoff: run docs/bank-system/phase-02-qa.md next.

STOPPING RULES:
- Stop if placement cannot avoid shifting rng draw order or any parity golden. (FIRED
  in-phase and resolved: the invariant that actually holds is the rng draw-order
  digest, which stayed byte-identical; the golden state/id churn is inherent to adding
  entities and was regenerated with user approval after an independent +3-offset audit.)
- Stop if the guide freshness gate cannot be satisfied without hand-editing generated
  files (never hand-edit; regenerate).
```
