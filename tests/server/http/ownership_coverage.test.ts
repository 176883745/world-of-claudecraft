// Registry-wide DENY-BY-DEFAULT functional coverage gate for the Phase 12 BOLA
// seam (docs/api-pipeline/).
//
// tests/server/http/completeness.test.ts already asserts the METADATA marker:
// checkRequireOwnedCoverage([...apiRoutes]) is empty, so every account-owned :id
// route DECLARES meta.requireOwned { ownerScope: 'account' }. That is a static
// promise about the route table, not about what the route actually DOES.
//
// This file adds the functional guarantee the metadata cannot give: that every
// account-owned :id route in the registry actually MOUNTS an account-scoped owner
// loader that DENIES a non-owned / absent id with a 404 (deny-by-default), before
// the handler's success body is ever produced. It is the load-bearing BOLA
// coverage test the packet leans on: a route that carried the marker but forgot to
// mount requireOwnedCharacter would ship a cross-account read hole that the
// metadata check waves through; this sweep turns that into a red test.
//
// How it works: the account db seam is driven with a fake whose getCharacter
// ALWAYS returns null (the deny path: no owned row for the caller), the auth guard
// is satisfied with a valid full-scope bearer, and each route's real middleware
// chain is run via compose(). A route with the loader mounted answers the player-
// owned 404 and never reaches its handler; a route missing the loader would fall
// through to its 200 handler, which the negative control proves the sweep detects.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type AdminRuntime,
  configureAdminRuntime,
  resetAdminDbForTests,
  resetAdminRuntimeForTests,
  setAdminDbForTests,
} from '../../../server/admin';
import {
  type CharactersRuntime,
  configureCharactersRuntime,
  resetCharactersDbForTests,
  resetCharactersRuntimeForTests,
  setCharactersDbForTests,
} from '../../../server/characters';
import { compose } from '../../../server/http/compose';
import { ADMIN_AUTH_REQUIRED } from '../../../server/http/middleware/require_admin';
import {
  DEPLOY_SECRET_ENV,
  DEPLOY_SECRET_HEADER,
  DISCORD_SECRET_ENV,
  DISCORD_SECRET_HEADER,
} from '../../../server/http/middleware/require_internal_secret';
import { withErrors } from '../../../server/http/middleware/with_errors';
import { apiRoutes } from '../../../server/http/registry';
import type { Ctx, Middleware, RouteDef } from '../../../server/http/types';
import { json } from '../../../server/http_util';
import {
  configureInternalRuntime,
  type InternalRuntime,
  resetInternalRuntimeForTests,
} from '../../../server/internal';
import { fakeCtx } from '../helpers/fake_ctx';
import type { FakeRes } from '../helpers/fake_http';

// A well-formed 64-hex bearer so the character guards' BEARER_PATTERN matches and
// the (stubbed) accountAndScopeForToken lookup is reached.
const VALID_TOKEN = 'a'.repeat(64);
// The authenticated caller the auth guards resolve the bearer to.
const CALLER_ACCOUNT_ID = 7;
// A valid positive :id, so requireOwned's num({ int, min: 1 }) decode passes and
// the account-scoped loader (which then misses) is actually exercised.
const REQUESTED_ID = '5';

// An unlocked, unmoderated account: the character auth guards read only .locked
// (and .message on a lock), so this passes the moderation gate for every caller.
const NOT_LOCKED = {
  locked: false,
  banned: false,
  suspendedUntil: null,
  reason: '',
  message: '',
  chatMutedUntil: null,
  chatStrikes: 0,
};

// The account-owned :id routes the sweep covers: every registry route whose
// meta.requireOwned is account-scoped. Phase 12's character :id subroutes
// (standing, sheet, rename, takeover, delete) are the only ones today.
const accountOwnedRoutes: RouteDef[] = apiRoutes.filter(
  (route) => route.meta?.requireOwned?.ownerScope === 'account',
);

// Substitute each :param segment with the concrete REQUESTED_ID so ctx.path/url
// read as a real request path (cosmetic here: the sweep invokes the middleware
// chain directly, so params are set explicitly rather than by the router).
function concretePath(path: string): string {
  return path
    .split('/')
    .map((segment) => (segment.startsWith(':') ? REQUESTED_ID : segment))
    .join('/');
}

// Install the denying character db seam: the bearer resolves to a full-scope
// account, the moderation gate passes, and getCharacter ALWAYS misses (the
// deny-by-default path the loader must answer with a 404). lifetimeXpStanding is
// stubbed to null too, so even if a route somehow skipped the loader its handler
// would not touch Postgres.
function installDenyingCharacterDb(): void {
  setCharactersDbForTests({
    accountAndScopeForToken: async () => ({ accountId: CALLER_ACCOUNT_ID, scope: 'full' as const }),
    moderationStatusForAccount: async () => NOT_LOCKED,
    getCharacter: async () => null,
    lifetimeXpStanding: async () => null,
  });
}

// Install a fully stubbed runtime so a handler that DID run (the negative control,
// or a regression where the loader is missing) cannot crash on an unconfigured
// runtime. The deny sweep never reaches these; they exist so the failure mode of a
// missing loader is a clean 200, not an unrelated throw.
function installFakeRuntime(): void {
  const runtime: CharactersRuntime = {
    isCharacterOnline: vi.fn(() => false),
    takeOverCharacter: vi.fn(async () => 'not-online' as const),
    rekeyMarketSeller: vi.fn(() => false),
    saveMarket: vi.fn(async () => {}),
    // The fresh-character state is never serialized on the deny path; a bare object
    // is enough to satisfy the type for any handler that does run (negative control).
    initialCharacterState: vi.fn(
      () => ({}) as ReturnType<CharactersRuntime['initialCharacterState']>,
    ),
    publicOrigin: vi.fn(() => 'http://localhost'),
  };
  configureCharactersRuntime(runtime);
}

// Build an AUTHED ctx for a route: valid bearer, the route's method, a concrete
// path, and params.id set to a valid numeric id (the router is bypassed, so params
// are supplied directly).
function authedCtx(route: RouteDef): Ctx {
  return fakeCtx({
    method: route.method,
    url: concretePath(route.path),
    headers: { authorization: `Bearer ${VALID_TOKEN}` },
    params: { id: REQUESTED_ID },
  });
}

/** Read the FakeRes backing a fakeCtx so we can assert on the captured result. */
function resOf(ctx: Ctx): FakeRes {
  return ctx.res as unknown as FakeRes;
}

// Run a route's full middleware chain plus a spy-wrapped handler as the terminal
// onion frame, returning the FakeRes and the handler spy. The spy proves whether
// the handler's success body was ever produced.
async function runRoute(
  route: RouteDef,
  ctx: Ctx,
): Promise<{ res: FakeRes; handler: ReturnType<typeof vi.fn> }> {
  const handler = vi.fn(async (c: Ctx) => {
    await route.handler(c);
  });
  const stack: Middleware[] = [...(route.middleware ?? []), handler as unknown as Middleware];
  await compose(stack)(ctx);
  return { res: resOf(ctx), handler };
}

describe('ownership coverage: registry-wide deny-by-default sweep', () => {
  beforeEach(() => {
    // Silence the loader's structured bola_denied stderr line (defaultDenyLog) so
    // the sweep does not spam the test output with one warn per denied route.
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    installDenyingCharacterDb();
    installFakeRuntime();
  });

  afterEach(() => {
    resetCharactersDbForTests();
    resetCharactersRuntimeForTests();
    vi.restoreAllMocks();
  });

  it('selects a non-vacuous set of account-owned :id routes (at least the five character subroutes)', () => {
    expect(accountOwnedRoutes.length).toBeGreaterThanOrEqual(5);
  });

  for (const route of accountOwnedRoutes) {
    it(`denies a non-owned id on ${route.method} ${route.path} with a 404 and never runs the handler`, async () => {
      const ctx = authedCtx(route);
      const { res, handler } = await runRoute(route, ctx);

      // The account-scoped loader missed (getCharacter returned null), so the route
      // answers the player-owned anti-enumeration 404. This can only happen if the
      // loader is actually mounted in the chain: proof of deny-by-default.
      expect(res.statusCode).toBe(404);
      // The handler-owned success body is NEVER produced: the loader short-circuits
      // (no next()), so control never reaches the terminal handler frame.
      expect(handler).not.toHaveBeenCalled();
      // The denial carries a legacy player-owned prose body (exact text differs per
      // route: 'character not found' vs 'not found'), never a success payload.
      expect(JSON.parse(res.body).error).toMatch(/^(character not found|not found)$/);
    });
  }

  it('negative control: an account-owned route MISSING the loader answers 200, so the sweep is non-vacuous', async () => {
    // A synthetic RouteDef that DECLARES account ownership (so the sweep's predicate
    // would select it) but whose middleware is only an auth-passing stub: the owner
    // loader is deliberately absent. Kept LOCAL to the test (never added to
    // apiRoutes). Under the exact same denying environment as the real routes, its
    // handler runs and writes 200, proving the sweep's 404 assertion actually
    // detects the loader's presence and would FAIL for a route that forgot to mount
    // requireOwnedCharacter.
    const authStub: Middleware = async (ctx, next) => {
      ctx.account = { accountId: CALLER_ACCOUNT_ID, scope: 'full' };
      await next();
    };
    const missingLoaderRoute: RouteDef = {
      method: 'GET',
      path: '/api/characters/:id/synthetic-no-loader',
      surface: 'api',
      middleware: [authStub],
      handler: async (ctx) => {
        json(ctx.res, 200, { ok: true });
      },
      meta: { requireOwned: { kind: 'character', ownerScope: 'account' } },
    };
    // It matches the same predicate the sweep selects on.
    expect(missingLoaderRoute.meta?.requireOwned?.ownerScope).toBe('account');

    const ctx = authedCtx(missingLoaderRoute);
    const { res, handler } = await runRoute(missingLoaderRoute, ctx);

    expect(res.statusCode).toBe(200);
    expect(handler).toHaveBeenCalledTimes(1);
    // A route without the loader does NOT produce the deny 404 the sweep asserts,
    // which is exactly why the sweep would go red for such a route.
    expect(res.statusCode).not.toBe(404);
  });
});

// -------------------------------------------------------------------------
// Operator-scope deny-by-default sweep (Phase 17).
//
// Phase 17 introduced the admin/operator surface, so the forward guard that once
// asserted "no operator route exists" is replaced by a real sweep. The operator
// :id routes (server/admin.ts) authorize NO cross-scope object (an admin has
// universal authority over every target), so unlike the account loader they emit no
// per-object 403/404 denial: the handlers keep their own legacy resource-not-found
// 404. The deny-by-default guarantee for operator routes is therefore twofold and
// this sweep proves BOTH are mounted on EVERY operator :id route:
//   1. requireAdmin: a non-admin bearer is refused with the legacy 401 admin body
//      BEFORE the handler runs (so an operator route can never serve a non-admin);
//   2. requireAdminTarget: a non-numeric :id is rejected with a 422 (admin envelope)
//      before any DB call (so a NaN id can never reach a query).
// A route that forgot either guard is caught: the negative controls prove both
// assertions are non-vacuous.
// -------------------------------------------------------------------------

// The operator-scoped :id routes the sweep covers: every registry route whose
// meta.requireOwned is operator-scoped (the admin :id family).
const operatorOwnedRoutes: RouteDef[] = apiRoutes.filter(
  (route) => route.meta?.requireOwned?.ownerScope === 'operator',
);

// A real account id the non-admin fake resolves the bearer to (is_admin = false).
const NON_ADMIN_ACCOUNT_ID = 999;

// The admin envelope validation.failed body serializeAdmin writes for a 422.
const ADMIN_VALIDATION_FAILED = { success: false, data: null, error: 'validation.failed' };

// Install the admin db seam so requireAdmin resolves the bearer to a NON-admin
// account: the token is valid, the account exists, but is_admin is false, so the
// gate's is_admin check is the one that must refuse it.
function installNonAdminDb(): void {
  setAdminDbForTests({
    accountForToken: async () => NON_ADMIN_ACCOUNT_ID,
    isAdminAccount: async () => false,
  });
}

// Install the admin db seam so requireAdmin PASSES (a real admin), so the sweep can
// reach requireAdminTarget's :id decode with a valid operator identity.
function installAdminDb(): void {
  setAdminDbForTests({
    accountForToken: async () => CALLER_ACCOUNT_ID,
    isAdminAccount: async () => true,
  });
}

// Run a route's chain UNDER withErrors (surface 'admin'), so requireAdminTarget's
// thrown decode failure maps to the 422 admin envelope exactly as the real
// dispatcher onion does. Returns the FakeRes and the handler spy.
async function runRouteWithErrors(
  route: RouteDef,
  ctx: Ctx,
): Promise<{ res: FakeRes; handler: ReturnType<typeof vi.fn> }> {
  const handler = vi.fn(async (c: Ctx) => {
    await route.handler(c);
  });
  const stack: Middleware[] = [
    withErrors({ surface: route.meta?.envelope }),
    ...(route.middleware ?? []),
    handler as unknown as Middleware,
  ];
  await compose(stack)(ctx);
  return { res: resOf(ctx), handler };
}

describe('ownership coverage: operator-scope deny-by-default sweep (Phase 17)', () => {
  beforeEach(() => {
    // A stubbed runtime so a handler that unexpectedly ran (a regression) fails on a
    // clean assertion, not an unconfigured-runtime throw. The sweep never reaches it
    // (the guards short-circuit), but the negative control writes 200 without it.
    configureAdminRuntime({} as AdminRuntime);
  });

  afterEach(() => {
    resetAdminDbForTests();
    resetAdminRuntimeForTests();
    vi.restoreAllMocks();
  });

  it('selects a non-vacuous set of operator-scoped :id routes (the admin :id family)', () => {
    expect(operatorOwnedRoutes.length).toBeGreaterThanOrEqual(12);
  });

  it('every operator-scoped route is admin-surface (excluded from the account-owner clause)', () => {
    // checkRequireOwnedCoverage exempts operator + admin-surface :id routes from the
    // missing-loader clause and flags an operator scope on any NON-admin surface. So
    // every operator route must be surface 'admin', or the coverage gate goes red.
    for (const route of operatorOwnedRoutes) {
      expect(route.surface, `${route.method} ${route.path}`).toBe('admin');
    }
    expect(
      apiRoutes.filter(
        (r) => r.meta?.requireOwned?.ownerScope === 'operator' && r.surface !== 'admin',
      ),
    ).toEqual([]);
  });

  for (const route of operatorOwnedRoutes) {
    it(`refuses a non-admin bearer on ${route.method} ${route.path} with a 401 and never runs the handler`, async () => {
      installNonAdminDb();
      const ctx = authedCtx(route);
      const { res, handler } = await runRouteWithErrors(route, ctx);

      // requireAdmin (mounted first) refuses the non-admin with the legacy admin 401
      // body and short-circuits, so the handler's success body is never produced.
      expect(res.statusCode).toBe(401);
      expect(handler).not.toHaveBeenCalled();
      expect(JSON.parse(res.body)).toEqual(ADMIN_AUTH_REQUIRED);
    });

    it(`rejects a non-numeric :id on ${route.method} ${route.path} with a 422 and never runs the handler`, async () => {
      installAdminDb();
      const ctx = fakeCtx({
        method: route.method,
        url: concretePath(route.path),
        headers: { authorization: `Bearer ${VALID_TOKEN}` },
        params: { id: 'not-a-number' },
      });
      const { res, handler } = await runRouteWithErrors(route, ctx);

      // requireAdminTarget decodes the :id with num({ int, min: 1 }); a non-numeric id
      // throws the decode failure, which withErrors maps to the 422 admin envelope
      // BEFORE any DB call, so the handler never runs.
      expect(res.statusCode).toBe(422);
      expect(handler).not.toHaveBeenCalled();
      expect(JSON.parse(res.body)).toEqual(ADMIN_VALIDATION_FAILED);
    });
  }

  it('negative control: an operator route MISSING requireAdmin serves a non-admin (200), so the 401 sweep is non-vacuous', async () => {
    installNonAdminDb();
    // A synthetic operator route that DECLARES operator scope (so the sweep would
    // select it) but mounts NO requireAdmin gate. Kept LOCAL to the test (never added
    // to apiRoutes). Under the same non-admin environment its handler runs and writes
    // 200, proving the sweep's 401 assertion actually detects requireAdmin's presence.
    const missingGateRoute: RouteDef = {
      method: 'GET',
      path: '/admin/api/synthetic-no-gate/:id',
      surface: 'admin',
      middleware: [],
      handler: async (ctx) => {
        json(ctx.res, 200, { success: true, data: { ok: true }, error: null });
      },
      meta: { envelope: 'admin', requireOwned: { kind: 'account', ownerScope: 'operator' } },
    };
    expect(missingGateRoute.meta?.requireOwned?.ownerScope).toBe('operator');

    const ctx = authedCtx(missingGateRoute);
    const { res, handler } = await runRouteWithErrors(missingGateRoute, ctx);

    expect(res.statusCode).toBe(200);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(res.statusCode).not.toBe(401);
  });

  it('negative control: an operator route MISSING requireAdminTarget lets a NaN :id reach the handler, so the 422 sweep is non-vacuous', async () => {
    installAdminDb();
    // A synthetic operator route with an auth-passing stub but NO requireAdminTarget:
    // a non-numeric :id is never decoded, so it reaches the handler (200) instead of a
    // 422, proving the sweep's 422 assertion detects requireAdminTarget's presence.
    const authStub: Middleware = async (ctx, next) => {
      ctx.account = { accountId: CALLER_ACCOUNT_ID, scope: 'full' };
      await next();
    };
    const missingDecodeRoute: RouteDef = {
      method: 'GET',
      path: '/admin/api/synthetic-no-decode/:id',
      surface: 'admin',
      middleware: [authStub],
      handler: async (ctx) => {
        json(ctx.res, 200, { success: true, data: { ok: true }, error: null });
      },
      meta: { envelope: 'admin', requireOwned: { kind: 'account', ownerScope: 'operator' } },
    };
    const ctx = fakeCtx({
      method: 'GET',
      url: '/admin/api/synthetic-no-decode/not-a-number',
      headers: { authorization: `Bearer ${VALID_TOKEN}` },
      params: { id: 'not-a-number' },
    });
    const { res, handler } = await runRouteWithErrors(missingDecodeRoute, ctx);

    expect(res.statusCode).toBe(200);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(res.statusCode).not.toBe(422);
  });
});

// -------------------------------------------------------------------------
// Admin auth-mounting sweep (Phase 17 QA).
//
// The operator sweep above proves the guards on the 12 :id routes; this sweep closes
// the REST of the admin surface. Every admin route except the anonymous login must
// mount requireAdmin, or an unauthenticated request would fall through to the handler
// (an accidentally ungated admin read is a public data leak). There is no metadata
// clause that can catch a forgotten gate (requireAdmin carries no meta marker), so
// this functional sweep is the only deny-by-default guarantee for the non-:id admin
// routes: it drives each route's real middleware chain with NO bearer at all and
// asserts the legacy admin 401 short-circuits before the handler.
// -------------------------------------------------------------------------

// Every registered admin-surface route; login (the one anonymous route) is exempt.
const adminSurfaceRoutes: RouteDef[] = apiRoutes.filter((route) => route.surface === 'admin');
const authedAdminRoutes: RouteDef[] = adminSurfaceRoutes.filter(
  (route) => !(route.method === 'POST' && route.path === '/admin/api/login'),
);

describe('admin auth-mounting sweep: every non-login admin route 401s an unauthenticated request (Phase 17 QA)', () => {
  beforeEach(() => {
    // A stubbed runtime + a passing db seam so a route that DID reach its handler (a
    // regression where requireAdmin is missing) fails the 401 assertion cleanly
    // instead of throwing on an unconfigured runtime or touching real Postgres.
    configureAdminRuntime({} as AdminRuntime);
    installAdminDb();
  });

  afterEach(() => {
    resetAdminDbForTests();
    resetAdminRuntimeForTests();
    vi.restoreAllMocks();
  });

  it('selects the full admin surface minus exactly the anonymous login', () => {
    expect(adminSurfaceRoutes.length).toBeGreaterThanOrEqual(32);
    expect(authedAdminRoutes.length).toBe(adminSurfaceRoutes.length - 1);
  });

  for (const route of authedAdminRoutes) {
    it(`refuses an unauthenticated ${route.method} ${route.path} with the legacy admin 401 before the handler`, async () => {
      // No authorization header at all: the gate must 401 db-free (bearerToken is
      // null, so accountForToken is never consulted) and short-circuit the chain.
      const ctx = fakeCtx({
        method: route.method,
        url: concretePath(route.path),
        params: { id: REQUESTED_ID, action: 'suspend' },
      });
      const { res, handler } = await runRouteWithErrors(route, ctx);

      expect(res.statusCode).toBe(401);
      expect(handler).not.toHaveBeenCalled();
      expect(JSON.parse(res.body)).toEqual(ADMIN_AUTH_REQUIRED);
    });
  }

  it('negative control: an admin route MISSING requireAdmin serves an unauthenticated request (200), so the sweep is non-vacuous', async () => {
    // A synthetic admin-surface route with NO gate at all: the unauthenticated
    // request reaches its handler and writes 200, proving the sweep's 401 assertion
    // actually detects requireAdmin's presence on every real route.
    const ungatedRoute: RouteDef = {
      method: 'GET',
      path: '/admin/api/synthetic-ungated',
      surface: 'admin',
      middleware: [],
      handler: async (ctx) => {
        json(ctx.res, 200, { success: true, data: { ok: true }, error: null });
      },
      meta: { envelope: 'admin' },
    };
    const ctx = fakeCtx({ method: 'GET', url: ungatedRoute.path });
    const { res, handler } = await runRouteWithErrors(ungatedRoute, ctx);

    expect(res.statusCode).toBe(200);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(res.statusCode).not.toBe(401);
  });
});

// -------------------------------------------------------------------------
// Internal secret-gate mounting sweep (Phase 18).
//
// The analogous gate-mounting sweep the Phase 17 QA mandated for every future
// authed surface: requireInternalSecret carries no meta marker, so no metadata
// clause can catch a forgotten gate; only this functional sweep can. An ungated
// /internal route would serve the Discord-bot / deploy ops surface to the open
// internet. It drives each route's real middleware chain twice, asserting the
// gate short-circuits with the legacy bodies BEFORE the handler:
//   1. env secret UNSET  -> the feature-off 404 { ...error: 'unknown endpoint' }
//      (the endpoint hides entirely, anti-enumeration);
//   2. env secret SET + a WRONG header secret -> 401 { ...error: 'not
//      authenticated' }.
// A negative control proves the sweep detects a route that forgot the gate.
// -------------------------------------------------------------------------

// Every registered internal-surface route (all 11 are secret-gated; there is no
// anonymous internal route).
const internalSurfaceRoutes: RouteDef[] = apiRoutes.filter((route) => route.surface === 'internal');

// The legacy fail() bodies the gate writes (byte-parity with server/internal.ts).
const INTERNAL_FEATURE_OFF = { success: false, data: null, error: 'unknown endpoint' };
const INTERNAL_NOT_AUTHENTICATED = { success: false, data: null, error: 'not authenticated' };

// A secret value for the SET case; the request presents a different value.
const RIGHT_SECRET = 'sweep-expected-secret-value';
const WRONG_SECRET = 'sweep-presented-wrong-value';

// Which (header, env var) pair a route's gate enforces: restart-countdown carries
// the deploy pair, every discord route the bot pair.
function gatePairFor(route: RouteDef): { header: string; envVar: string } {
  return route.path === '/internal/restart-countdown'
    ? { header: DEPLOY_SECRET_HEADER, envVar: DEPLOY_SECRET_ENV }
    : { header: DISCORD_SECRET_HEADER, envVar: DISCORD_SECRET_ENV };
}

describe('internal secret-gate mounting sweep: every /internal route is gated (Phase 18)', () => {
  let savedDeploySecret: string | undefined;
  let savedDiscordSecret: string | undefined;

  beforeEach(() => {
    savedDeploySecret = process.env[DEPLOY_SECRET_ENV];
    savedDiscordSecret = process.env[DISCORD_SECRET_ENV];
    delete process.env[DEPLOY_SECRET_ENV];
    delete process.env[DISCORD_SECRET_ENV];
    // A stubbed runtime so a handler that unexpectedly ran (a regression where the
    // gate is missing) fails on a clean assertion, not an unconfigured-runtime throw.
    configureInternalRuntime({
      startRestartCountdown: vi.fn(
        () => ({ started: true }) as ReturnType<InternalRuntime['startRestartCountdown']>,
      ),
    });
  });

  afterEach(() => {
    if (savedDeploySecret === undefined) delete process.env[DEPLOY_SECRET_ENV];
    else process.env[DEPLOY_SECRET_ENV] = savedDeploySecret;
    if (savedDiscordSecret === undefined) delete process.env[DISCORD_SECRET_ENV];
    else process.env[DISCORD_SECRET_ENV] = savedDiscordSecret;
    resetInternalRuntimeForTests();
    vi.restoreAllMocks();
  });

  it('selects the full 11-route internal surface', () => {
    expect(internalSurfaceRoutes.length).toBe(11);
  });

  for (const route of internalSurfaceRoutes) {
    it(`hides ${route.method} ${route.path} with the feature-off 404 when the env secret is unset`, async () => {
      const ctx = fakeCtx({ method: route.method, url: route.path });
      const { res, handler } = await runRouteWithErrors(route, ctx);

      expect(res.statusCode).toBe(404);
      expect(handler).not.toHaveBeenCalled();
      expect(JSON.parse(res.body)).toEqual(INTERNAL_FEATURE_OFF);
    });

    it(`refuses a wrong secret on ${route.method} ${route.path} with a 401 before the handler`, async () => {
      const gate = gatePairFor(route);
      process.env[gate.envVar] = RIGHT_SECRET;
      const ctx = fakeCtx({
        method: route.method,
        url: route.path,
        headers: { [gate.header]: WRONG_SECRET },
      });
      const { res, handler } = await runRouteWithErrors(route, ctx);

      expect(res.statusCode).toBe(401);
      expect(handler).not.toHaveBeenCalled();
      expect(JSON.parse(res.body)).toEqual(INTERNAL_NOT_AUTHENTICATED);
    });
  }

  it('negative control: an internal route MISSING the gate serves an ungated request (200), so the sweep is non-vacuous', async () => {
    // A synthetic internal-surface route with NO gate at all: with both env secrets
    // unset and no secret header, the request reaches its handler and writes 200,
    // proving the sweep's 404/401 assertions actually detect the gate's presence.
    const ungatedRoute: RouteDef = {
      method: 'GET',
      path: '/internal/synthetic-ungated',
      surface: 'internal',
      middleware: [],
      handler: async (ctx) => {
        json(ctx.res, 200, { success: true, data: { ok: true }, error: null });
      },
      meta: { envelope: 'admin' },
    };
    const ctx = fakeCtx({ method: 'GET', url: ungatedRoute.path });
    const { res, handler } = await runRouteWithErrors(ungatedRoute, ctx);

    expect(res.statusCode).toBe(200);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(res.statusCode).not.toBe(404);
    expect(res.statusCode).not.toBe(401);
  });
});
