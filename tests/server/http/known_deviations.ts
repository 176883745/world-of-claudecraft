// Known deviations ledger for the API pipeline re-architecture (Phase 3 spine).
//
// This is the CHARACTERIZATION counterpart to the surface inventory: where the
// inventory records WHAT routes exist and the goldens record WHAT they emit
// today, this ledger records the places where today's behavior is a DELIBERATE
// deviation, either one a later phase intentionally changes (introducedInPhase
// names the phase that lands the change) or one preserved by design forever
// (introducedInPhase null). It changes no runtime behavior; it is a planning and
// freshness artifact so the later phases land their changes against a written
// baseline instead of an unstated assumption.
//
// Anchoring rule: every entry's `routes` strings are exact paths that MUST exist
// in SURFACE_INVENTORY (the test cross-checks this), and every `goldenFixtures`
// path MUST point at a fixture that exists on disk (the test cross-checks that
// too). Entries never anchor on line numbers.
//
// Stable-code rule: this ledger CHARACTERIZES the codes/strings the server emits
// today. It does not add, rename, or localize any error code or catalog entry
// (Phase 7/22 own that). The `currentBehavior` text describes what exists.

// Named deviation ids (no scattered inline strings; one source of truth, the
// inventory and tests refer to these constants).
export const DEVIATION_ID = {
  perfReport200NotThrottle: 'perf-report-200-not-429-on-throttle',
  perfReportSitePresence405OkFalse: 'perf-report-and-site-presence-405-ok-false',
  registerLoginAntiEnumeration: 'register-login-anti-enumeration',
  bolaOwned404: 'bola-owned-404',
  planned405BeforeAuth: 'planned-405-before-auth',
  validationStatusRemap: 'validation-status-remap-422-400-413',
  statusNameListTrim: 'status-name-list-trim',
  realmsSearchAuthzGapClose: 'realms-search-authz-gap-close',
  newLimiterCharacterMutations: 'new-limiter-character-mutations',
  newLimiterReportsCreate: 'new-limiter-reports-create',
  newLimiterDiscord: 'new-limiter-discord',
  discordCallbackHtmlNotRedirect: 'discord-callback-html-not-redirect',
  swagClaimOrphanUnreachable: 'swag-claim-orphan-unreachable',
} as const;
export type DeviationId = (typeof DEVIATION_ID)[keyof typeof DEVIATION_ID];

export interface KnownDeviation {
  // Kebab-style unique id (a value of DEVIATION_ID).
  readonly id: string;
  // Route paths the deviation touches. Each MUST exist as a `path` in
  // SURFACE_INVENTORY (the test hard-fails on an unknown route).
  readonly routes: readonly string[];
  // What the server does TODAY (the characterized current contract).
  readonly currentBehavior: string;
  // What is intended: the preserved behavior (for a by-design deviation) or the
  // target the named phase lands.
  readonly intendedBehavior: string;
  // The phase (4 to 25) that intentionally changes this behavior, or null for a
  // by-design deviation that is preserved forever.
  readonly introducedInPhase: number | null;
  // Why the deviation exists / why it is preserved or changed.
  readonly reason: string;
  // Optional golden fixtures (paths relative to the repo root) that demonstrate
  // the current behavior. Only fixtures that actually exist are listed; the test
  // asserts each one is present on disk.
  readonly goldenFixtures?: readonly string[];
}

export const KNOWN_DEVIATIONS: readonly KnownDeviation[] = [
  // --- By-design deviations (preserved forever, introducedInPhase null) --------
  {
    id: DEVIATION_ID.perfReport200NotThrottle,
    routes: ['/api/perf-report'],
    currentBehavior:
      'POST /api/perf-report answers 200 { ok: true } even when the perf-report ' +
      'limiter is throttling; the throttle result is swallowed and the beacon ' +
      'never observes a 429.',
    intendedBehavior:
      'Preserved: a throttled perf beacon is silently accepted with a 200, never ' +
      'a 429 or an error the client could surface or retry on.',
    introducedInPhase: null,
    reason:
      'The client perf beacon must never see a 429 (a throttled beacon should be ' +
      'dropped quietly with a 200, not retried or logged as an error).',
  },
  {
    id: DEVIATION_ID.perfReportSitePresence405OkFalse,
    routes: ['/api/perf-report', '/api/site-presence'],
    currentBehavior:
      'A non-POST request to either heartbeat endpoint answers 405 with the ' +
      'legacy { ok: false } body shape, not the { error } problem shape the rest ' +
      'of the surface uses.',
    intendedBehavior:
      'Preserved: these two beacon endpoints keep their method ownership and the ' +
      'bare ok-false 405 shape (the 4th content-type contract case).',
    introducedInPhase: null,
    reason:
      'This is the 4th content-type contract case (LEGACY_OKFALSE_405): the ' +
      'perf-report and site-presence heartbeats keep their legacy ok-shape and ' +
      'POST-only method ownership.',
    goldenFixtures: ['tests/server/fixtures/main/site_presence_get_405.json'],
  },
  {
    id: DEVIATION_ID.registerLoginAntiEnumeration,
    routes: ['/api/register', '/api/login'],
    currentBehavior:
      'POST /api/register answers 409 on a taken username and POST /api/login ' +
      'answers 401 on bad credentials, deliberately not revealing whether a given ' +
      'account exists.',
    intendedBehavior:
      'Preserved: the 409 (register conflict) and 401 (login failure) stay ' +
      'anti-enumeration safe (unknown-vs-bad credentials stay indistinguishable).',
    introducedInPhase: null,
    reason:
      'Registration conflict (409) and login failure (401) stay intentionally ' +
      'indistinguishable so an attacker cannot enumerate which usernames or ' +
      'emails exist.',
    goldenFixtures: ['tests/server/fixtures/main/login_post_empty_401.json'],
  },
  {
    id: DEVIATION_ID.bolaOwned404,
    routes: [
      '/api/characters/:id/sheet',
      '/api/characters/:id/standing',
      '/api/characters/:id',
      '/api/characters/:id/rename',
      '/api/characters/:id/takeover',
    ],
    currentBehavior:
      'An owner-scoped :id read or mutation for a character the caller does not ' +
      'own answers 404 (not 403), so a caller cannot tell "exists but not yours" ' +
      'apart from "does not exist".',
    intendedBehavior:
      'Preserved through Phase 12: the owner-scope guard keeps answering 404 ' +
      '(anti-enumeration); it is NOT changed to 403.',
    introducedInPhase: null,
    reason:
      'Owner-scoped object reads deny a non-owned id with 404 not 403 to avoid ' +
      'leaking the existence of another player character (BOLA anti-enumeration); ' +
      'Phase 12 keeps it.',
  },
  {
    id: DEVIATION_ID.discordCallbackHtmlNotRedirect,
    routes: ['/api/auth/discord/callback'],
    currentBehavior:
      'GET /api/auth/discord/callback answers text/html (a self-posting bounce ' +
      'page that does window.opener.postMessage then location.replace), not a ' +
      '302 redirect, on both the success and error paths.',
    intendedBehavior:
      'Preserved: the OAuth popup flow needs an HTML bounce to postMessage the ' +
      'opener window and close the popup, so it is intentionally not a bare 302 ' +
      '(the REDIRECT content class stays unused).',
    introducedInPhase: null,
    reason:
      'The Discord OAuth popup completes by postMessaging the opener and closing ' +
      'the popup; a 302 cannot do that, so the HTML-not-302 shape is by design.',
    goldenFixtures: ['tests/server/fixtures/main/discord_callback_error_bounce.json'],
  },

  // --- Phase-scheduled deviations (introducedInPhase names the change) ---------
  {
    id: DEVIATION_ID.planned405BeforeAuth,
    routes: ['/api/register', '/api/me/characters'],
    currentBehavior:
      'A known path requested with the wrong method does not get a uniform 405 ' +
      'before auth today: it either falls through to the 404 unknown-endpoint arm ' +
      'or hits the auth gate first (so a wrong method on an authed route can ' +
      'answer 401 before any 405).',
    intendedBehavior:
      'Phase 4 table router returns 405 (method not allowed) for a known path ' +
      'plus an unsupported method, decided before the auth gate runs.',
    introducedInPhase: 4,
    reason:
      'The Phase 4 router centralizes method dispatch so a known path with an ' +
      'unsupported method returns 405 before auth, instead of today 404 or 401.',
    goldenFixtures: [
      'tests/server/fixtures/main/register_get_wrong_method_404.json',
      'tests/server/fixtures/main/me_characters_post_wrong_method_404.json',
    ],
  },
  {
    id: DEVIATION_ID.validationStatusRemap,
    routes: ['/api/register', '/api/reports', '/api/bug-reports'],
    currentBehavior:
      'A well-formed but invalid body answers 400, malformed JSON answers 500, ' +
      'and an over-cap body answers 413, inconsistently across the validating ' +
      'routes.',
    intendedBehavior:
      'Phase 7 remaps to 422 (well-formed but semantically invalid), 400 ' +
      '(malformed JSON), and 413 (over the byte cap), uniformly.',
    introducedInPhase: 7,
    reason:
      'Phase 7 unifies request-validation status codes (422 for semantically ' +
      'invalid, 400 for malformed JSON, 413 for over the byte cap); today these ' +
      'are 400, 500, and 413.',
    goldenFixtures: ['tests/server/fixtures/main/register_post_empty_400.json'],
  },
  {
    id: DEVIATION_ID.statusNameListTrim,
    routes: ['/api/status'],
    currentBehavior:
      'GET /api/status returns a names[] array of online player names alongside ' + 'the counts.',
    intendedBehavior:
      'Phase 10 trims the names[] list out of the public status payload (counts only).',
    introducedInPhase: 10,
    reason:
      'The public status endpoint currently exposes a names[] list of online ' +
      'players; Phase 10 trims it to counts only.',
    goldenFixtures: ['tests/server/fixtures/main/status_get.json'],
  },
  {
    id: DEVIATION_ID.realmsSearchAuthzGapClose,
    routes: ['/api/realms', '/api/search'],
    currentBehavior:
      'GET /api/realms treats a present-but-invalid bearer token the same as no ' +
      'token (silently anonymous, empty counts), never validating it; GET ' +
      '/api/search requires a token and answers 401 to any request without one.',
    intendedBehavior:
      'Phase 10 applies the anonymous-friendly bearer resolver to both: a request ' +
      'with NO token still serves (realms with empty counts, search with results), ' +
      'but a request that PRESENTS a token has it validated (an invalid token is ' +
      'rejected 401 auth.token_invalid) and moderation-gated (a banned/suspended ' +
      'account is rejected 403, which the legacy bearerAccount did not check). ' +
      'Search additionally becomes anonymous-friendly (a missing token no longer ' +
      '401s) and, being now an anonymous DB-hitting read, is rate-limited in-handler ' +
      'with the same publicReadRateLimited per-IP budget the public sheet uses.',
    introducedInPhase: 10,
    reason:
      'Both routes had an authz gap: realms never validated a present token, and ' +
      "search's token requirement was inconsistent with the rest of the public-read " +
      'surface. Phase 10 closes the gap by validating a present token while keeping ' +
      'the no-token path serving.',
    goldenFixtures: [
      'tests/server/fixtures/main/realms_get_noauth.json',
      'tests/server/fixtures/main/search_get_noauth_401.json',
    ],
  },
  {
    id: DEVIATION_ID.newLimiterCharacterMutations,
    routes: [
      '/api/characters',
      '/api/characters/:id/rename',
      '/api/characters/:id',
      '/api/characters/:id/takeover',
    ],
    currentBehavior:
      'Character create, rename, delete, and takeover have no dedicated per-action ' +
      'limiter today (they are gated only by the full session).',
    intendedBehavior:
      'Phase 12 adds new per-action limiters on character create, rename, delete, ' +
      'and takeover.',
    introducedInPhase: 12,
    reason:
      'NEW per-action limiters on character mutations (create, rename, delete, ' +
      'takeover) land in Phase 12; today these mutations have no dedicated limiter.',
  },
  {
    id: DEVIATION_ID.newLimiterReportsCreate,
    routes: ['/api/reports'],
    currentBehavior:
      'POST /api/reports has no dedicated reports.create limiter today (it is ' +
      'gated only by the full session).',
    intendedBehavior: 'Phase 15 adds a reports.create limiter.',
    introducedInPhase: 15,
    reason:
      'A NEW reports.create limiter lands in Phase 15; today report creation has ' +
      'no dedicated limiter.',
  },
  {
    id: DEVIATION_ID.newLimiterDiscord,
    routes: [
      '/api/auth/discord/start',
      '/api/auth/discord/callback',
      '/api/auth/discord/login/new',
      '/api/auth/discord/login/link',
      '/api/discord',
    ],
    currentBehavior:
      'The discord.* routes share one legacy discordRateLimited limiter and the ' +
      'callback is unlimited.',
    intendedBehavior:
      'Phase 16 adds or changes the discord.* limiters, and the wider rate-limiter ' +
      'rework in Phase 19 reworks their backing, so the discord limiter set changes.',
    introducedInPhase: 16,
    reason:
      'NEW or changed discord.* limiters land in Phase 16, with the rate-limiter ' +
      'rework in Phase 19; today the discord routes share one legacy ' +
      'discordRateLimited limiter and the callback is unlimited.',
  },
  {
    id: DEVIATION_ID.swagClaimOrphanUnreachable,
    routes: ['/api/discord/swag/claim'],
    currentBehavior:
      'handleSwagClaim is exported but no dispatcher arm routes to it, so POST ' +
      '/api/discord/swag/claim is unreachable today (it falls through to the 404 ' +
      'unknown-endpoint arm).',
    intendedBehavior:
      'Phase 16 discord wiring connects the swag-claim handler to a real dispatch ' + 'arm.',
    introducedInPhase: 16,
    reason:
      'The swag-claim handler exists but has no dispatch arm (an orphan); Phase 16 ' +
      'discord wiring routes to it. Until then POST /api/discord/swag/claim 404s.',
  },
];

// The phase window a scheduled deviation may name (Phase 4 to Phase 25 of the
// 25-phase re-architecture). A by-design deviation uses null instead.
export const DEVIATION_PHASE_MIN = 4;
export const DEVIATION_PHASE_MAX = 25;
