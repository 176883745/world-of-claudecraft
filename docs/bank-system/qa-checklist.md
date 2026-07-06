# Bank System: Whole-Feature Integration QA Matrix

Verified once at packet completion (Phase 9). Every row must pass.

- Three-host parity: the offline browser Sim, the online ClientWorld, and (where the
  observation surface is touched) the headless env behave identically for every bank
  operation; `tests/world_api_parity.test.ts`, `tests/snapshots.test.ts`,
  `tests/command_schema.test.ts` green.
- Determinism: same seed gives the same world; the bank draws no rng; no
  `Math.random` / `Date.now` / `performance.now` anywhere in `src/sim/`;
  `tests/architecture.test.ts` and the `tests/parity` golden suite green with no
  unexplained golden regeneration.
- Conservation: the invariant harness proves the multiset of items across inventory +
  bank + market/mail escrows is exactly conserved across seeded op sequences except
  explicit faucets/sinks; every refusal path leaves items in place and charges nothing;
  no path destroys an item.
- Anti-dupe: per-character lease blocks a cross-process double-load; bank ops write
  `bank_ledger` rows; `scripts/bank_audit.mjs` runs clean on fixture and dev data;
  deposit/withdraw are single-transaction same-blob mutations (no world_state personal
  bank anywhere).
- Server authority: every command field validated in dispatch; proximity validated
  inside the sim via the anchor list; no client-supplied item payload is trusted;
  payloads stay within the 16 KiB WS cap.
- Persistence: characters saved before this feature load cleanly (defaults applied);
  serialize -> load -> serialize deep-equal; tampered saves sanitized without item
  loss; `bank_ledger` DDL is additive and idempotent under the boot advisory lock;
  `tests/persistence_round_trip.test.ts`, `tests/character_state_backcompat.test.ts`,
  `tests/save_character_and_market.test.ts` green.
- i18n completeness: every player-visible bank string is a `t()` key; sim emits have
  sim_i18n matcher entries and `src/sim/bank.ts` is in the S3 simSrc list;
  `npx vitest run tests/localization_fixes.test.ts` green; M16 fills present for wordy
  strings; money via the sim `format_money.ts` at emit sites and client `formatMoney`
  in the UI; NPC names/greetings localized; guide regenerated.
- Classic fidelity: expansion pricing follows the researched escalating-curve shape;
  no invented mechanics that contradict the classic model (no keybind-open, no copper
  storage, banker-anchored access only).
- Economy fairness: capacity is copper plus account-action bonuses only; no $WOC or
  holder-tier influence on capacity or any bank behavior; graphics/perf tiers do not
  hide or delay any bank information.
- UI contracts: `bank_view.ts` registered in UI_PURE_CORES; painter uses the
  presentation bag with zero literal hex; cold event-driven window (nothing bank-related
  in the per-frame path); focus/inert contract holds through every teardown path;
  mobile layout verified via screenshot script (safe areas, 40x40 targets, 16px inputs).
- Bonus slots: entitlement math and referral qualification (level >= 10 referee, cap 5)
  covered by tests; stamp-at-load only, no mid-session drift; offline sim unaffected;
  the source registry provably accepts a future row (X, Twitch) without wire or pin
  churn, and no unshipped source is implemented or displayed.
- Copy review: no em dashes, en dashes, or emojis anywhere in the diff.
- Build gate: `npm run gate` green on the branch (release tier will additionally require
  locale fills at release time; contributors ship English per the workflow).
- Docs: `state.md` reflects every new member/key/table; `progress.md` complete; packet
  teardown offered (delete `docs/bank-system/` on explicit confirmation only).
