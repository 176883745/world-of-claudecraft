// Registry-completeness gate for the Phase 9 API pipeline (docs/api-pipeline/).
//
// The Phase 9 dispatcher (server/http/dispatch.ts) places the new route registry
// in FRONT of the legacy /api handleApi ladder: for a path the registry OWNS (a
// matched RouteDef) it runs the onion; for ANY OTHER /api path it delegates to
// the legacy handleApi UNCHANGED. So the dispatcher's real coverage is
//   (router-owned paths) UNION (paths the legacy handler still serves).
//
// This gate HARD-FAILS if any legacy /api ladder path (from the Phase 3 surface
// inventory) would be served by NEITHER the new router NOR the legacy delegate: a
// dropped route is a production 404. It stays meaningful as routes migrate,
// because each route moves from delegate-covered to router-owned and coverage is
// checked against BOTH arms, so a migration that adds a router route without
// removing the legacy arm (double-serving) or removes the legacy arm without a
// matching router route (a gap) is caught here.
//
// The coverage decision is factored into a pure isCovered() helper, and a
// negative-control block feeds it a synthetic dropped route to prove the gate is
// NON-VACUOUS (it can actually fail). The legacy-served set is re-derived
// independently from server/main.ts SOURCE (the same extraction technique as
// surface_inventory.test.ts, read as a file, never imported), which gives the
// gate teeth against a future dropped dispatch arm.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  type ApiRegistry,
  apiRegistry,
  apiRoutes,
  assertNoOwnedRouteShadowing,
  createApiRegistry,
} from '../../../server/http/registry';
import { checkRequireOwnedCoverage, checkRouteCompleteness } from '../helpers';
import { DEVIATION_ID, KNOWN_DEVIATIONS } from './known_deviations';
import { DISPATCH, SURFACE_INVENTORY } from './surface_inventory';

// The minimal route shape the coverage helpers need: a method, a path, and (for a
// legacy :param route) the exact dispatcher regex whose source keys it in the
// legacy-served set. A SurfaceRoute satisfies this structurally, so the inventory
// rows pass straight through and a synthetic route (the negative control) is
// trivial to build.
interface LadderRoute {
  readonly method: string;
  readonly path: string;
  readonly match?: RegExp;
}

// -------------------------------------------------------------------------
// Coverage helpers (pure, inspectable): router-owned OR legacy-served.
// -------------------------------------------------------------------------

// Substitute each :param segment with a literal placeholder so resolve(), which
// matches CONCRETE paths, can be queried against a :param ladder pattern. A
// placeholder segment matches the router's ':param' (any non-empty segment) and
// never collides with a static segment.
function concretePath(path: string): string {
  return path
    .split('/')
    .map((segment) => (segment.startsWith(':') ? 'x' : segment))
    .join('/');
}

// True when the NEW registry owns the route (the dispatcher would run the onion).
function isRouterOwned(registry: ApiRegistry, route: LadderRoute): boolean {
  return registry.resolve(route.method, concretePath(route.path)).kind === 'matched';
}

// The key a ladder route carries in the legacy-served set: the exact dispatcher
// regex source for a :param route, else the literal path for an exact arm.
function legacyKey(route: LadderRoute): string {
  return route.match ? route.match.source : route.path;
}

// True when the legacy handler still serves the route (its key is in the set
// re-derived from main.ts source). The dispatcher delegates every non-owned /api
// path to the legacy ladder, but that only yields a real response if the arm is
// still present; a dropped arm answers 404, i.e. NOT served.
function legacyServes(route: LadderRoute, legacyServed: ReadonlySet<string>): boolean {
  return legacyServed.has(legacyKey(route));
}

// The coverage decision the gate turns on: a ladder path is covered iff the new
// router owns it OR the legacy handler still serves it. Neither means a prod 404.
function isCovered(
  route: LadderRoute,
  registry: ApiRegistry,
  legacyServed: ReadonlySet<string>,
): boolean {
  return isRouterOwned(registry, route) || legacyServes(route, legacyServed);
}

// -------------------------------------------------------------------------
// The legacy /api ladder (must-serve set) and the source-derived served set.
// -------------------------------------------------------------------------

// The swag-claim orphan is an unreachable handler with no dispatch arm today (see
// the swagClaimOrphanUnreachable known deviation), so it is intentionally NOT
// served and is excluded from the must-serve set. Referencing the deviation keeps
// the exclusion documented, not silent.
const ORPHAN_DEVIATION = KNOWN_DEVIATIONS.find(
  (d) => d.id === DEVIATION_ID.swagClaimOrphanUnreachable,
);
const EXCLUDED_PATHS = new Set<string>(ORPHAN_DEVIATION?.routes ?? []);

// Every legacy /api ladder row (dispatcher === main handleApi), minus the
// documented unreachable orphan.
const legacyLadder = SURFACE_INVENTORY.filter(
  (r) => r.dispatcher === DISPATCH.mainApi && !EXCLUDED_PATHS.has(r.path),
);

// Read main.ts as a FILE (never import: main constructs a pg pool at load) and
// re-derive the set of /api paths the CURRENT handleApi still serves.
const MAIN_SOURCE_URL = new URL('../../../server/main.ts', import.meta.url);

// Every `=== '<path>'` (or "<path>") comparison whose path begins with /api/. The
// quote is captured so the same quote closes it.
const EXACT_API_RE = /===\s*(['"])(\/api\/[^'"]*)\1/g;

// Every `const <name>Match = /<regex>/.exec(...)`. Group 2 is the regex source
// body (slash-escaped exactly as RegExp.source reports it); `(?:\\.|[^/\\\n])*`
// consumes escaped chars and stops at the first unescaped closing slash.
const PARAM_API_RE = /const\s+(\w*Match)\s*=\s*\/((?:\\.|[^/\\\n])*)\/[a-z]*\.exec/g;

// The regex-source prefix a main.ts /api :param route must start with.
const API_REGEX_PREFIX = '^\\/api\\/';

function deriveLegacyServed(): Set<string> {
  const text = readFileSync(MAIN_SOURCE_URL, 'utf8');
  const served = new Set<string>();
  for (const m of text.matchAll(EXACT_API_RE)) served.add(m[2]);
  for (const m of text.matchAll(PARAM_API_RE)) {
    const body = m[2];
    if (body.startsWith(API_REGEX_PREFIX)) served.add(body);
  }
  return served;
}

const legacyServed = deriveLegacyServed();

describe('registry completeness: the legacy /api ladder is fully covered', () => {
  it('derives a non-empty legacy ladder and a non-empty source-served set', () => {
    // Guard against a vacuous pass: both the inventory ladder and the independent
    // source scan must actually find routes.
    expect(legacyLadder.length).toBeGreaterThan(50);
    expect(legacyServed.size).toBeGreaterThan(40);
  });

  it('covers every ladder path by the router OR the delegate (no dropped route)', () => {
    const uncovered = legacyLadder
      .filter((r) => !isCovered(r, apiRegistry, legacyServed))
      .map((r) => `${r.method} ${r.path}`);
    expect(uncovered).toEqual([]);
  });

  it('retains the legacy rollback arm for every migrated (router-owned) route', () => {
    // A migrated route is deliberately BOTH router-owned (flag 'new') and
    // legacy-served (flag 'legacy'): Phase 10 keeps each migrated route's legacy
    // handleApi arm as the flag-off rollback path (removed only in Phase 25). That
    // is not a runtime double-serve, since the dispatcher runs exactly one arm per
    // request (the API_DISPATCH flag picks) and the parity harness proves the two
    // arms are byte-identical. The real migration hazard is a rollback arm removed
    // too early (which would 404 under flag 'legacy'), so the invariant flips: every
    // router-owned ladder path MUST still be legacy-served until Phase 25.
    const missingRollbackArm = legacyLadder
      .filter((r) => isRouterOwned(apiRegistry, r) && !legacyServes(r, legacyServed))
      .map((r) => `${r.method} ${r.path}`);
    expect(missingRollbackArm).toEqual([]);
  });
});

describe('registry completeness: Phase 10 migrated baseline (public reads)', () => {
  // The exact public-read paths Phase 10 moved onto RouteDefs (server/leaderboard.ts).
  // The router owns them under flag 'new'; their legacy arms stay for rollback.
  const MIGRATED_PATHS = [
    '/api/leaderboard',
    '/api/arena/leaderboard',
    '/api/releases',
    '/api/project-stats',
    '/api/status',
    '/api/perf',
    '/api/search',
    '/api/realms',
    '/api/public/characters/:name/sheet',
  ];

  it('registers exactly the Phase 10 public-read routes (one RouteDef per path)', () => {
    const registered = [...apiRoutes].map((r) => r.path).sort();
    expect(registered).toEqual([...MIGRATED_PATHS].sort());
  });

  it('the router OWNS every migrated public-read path (GET resolves to matched)', () => {
    for (const path of MIGRATED_PATHS) {
      expect(apiRegistry.resolve('GET', concretePath(path)).kind).toBe('matched');
    }
  });

  it('every migrated path is a mainApi ladder route that stays delegate-served', () => {
    // Each migrated path must also be an inventory ladder route AND retain its
    // legacy arm (rollback), so the flag can roll each one back per route.
    for (const path of MIGRATED_PATHS) {
      const row = legacyLadder.find((r) => r.path === path);
      expect(row, `migrated path ${path} must be a mainApi ladder route`).toBeDefined();
      if (row) {
        expect(isRouterOwned(apiRegistry, row)).toBe(true);
        expect(legacyServes(row, legacyServed)).toBe(true);
      }
    }
  });

  it('leaves every un-migrated ladder path delegate-only (not router-owned)', () => {
    const migrated = new Set(MIGRATED_PATHS);
    const wronglyOwned = legacyLadder
      .filter((r) => !migrated.has(r.path) && isRouterOwned(apiRegistry, r))
      .map((r) => `${r.method} ${r.path}`);
    expect(wronglyOwned).toEqual([]);
  });

  it('the router-owned UNION delegate-served set still covers the whole ladder', () => {
    const covered = legacyLadder.filter((r) => isCovered(r, apiRegistry, legacyServed));
    expect(covered.length).toBe(legacyLadder.length);
  });

  it('excludes the documented unreachable swag-claim orphan from the must-serve set', () => {
    expect(ORPHAN_DEVIATION).toBeDefined();
    expect(ORPHAN_DEVIATION?.routes).toContain('/api/discord/swag/claim');
    const orphanRow = SURFACE_INVENTORY.find((r) => r.path === '/api/discord/swag/claim');
    expect(orphanRow?.unreachable).toBe(true);
    expect(orphanRow?.dispatcher).toBe(DISPATCH.mainApi);
    expect(legacyLadder.some((r) => r.path === '/api/discord/swag/claim')).toBe(false);
    // The source does not serve it either, so including it in the must-serve set
    // would (correctly) fail the coverage gate; the exclusion is what keeps the
    // gate honest rather than red on a by-design orphan.
    expect(legacyServes({ method: 'POST', path: '/api/discord/swag/claim' }, legacyServed)).toBe(
      false,
    );
  });
});

describe('registry completeness: the gate is non-vacuous (negative control)', () => {
  it('reports a synthetic dropped route as NOT covered', () => {
    // A path that is neither router-owned (empty registry) nor legacy-served: the
    // exact shape of a route silently dropped during a migration.
    const droppedRoute: LadderRoute = {
      method: 'GET',
      path: '/api/__dropped-route-never-served__',
    };
    expect(isRouterOwned(apiRegistry, droppedRoute)).toBe(false);
    expect(legacyServes(droppedRoute, legacyServed)).toBe(false);
    expect(isCovered(droppedRoute, apiRegistry, legacyServed)).toBe(false);

    // And the aggregate gate would FAIL for it: added to the ladder, it lands in
    // the uncovered list.
    const withDropped: LadderRoute[] = [...legacyLadder, droppedRoute];
    const uncovered = withDropped
      .filter((r) => !isCovered(r, apiRegistry, legacyServed))
      .map((r) => r.path);
    expect(uncovered).toContain('/api/__dropped-route-never-served__');
  });

  it('reports a real ladder path as covered via the legacy delegate arm', () => {
    // Positive contrast: a genuine ladder route is covered even with an empty
    // registry, through the legacy-served arm. Proves isCovered is not stuck-false.
    const served = legacyLadder.find((r) => legacyServes(r, legacyServed));
    expect(served).toBeDefined();
    if (served) expect(isCovered(served, apiRegistry, legacyServed)).toBe(true);
  });

  it('reports a route as covered via the router arm even with an empty legacy set', () => {
    // Forward-looking: once a route migrates into the registry, the router arm of
    // isCovered carries it even if the legacy arm is gone. Proves that arm is real.
    const ownedRegistry = createApiRegistry([
      { method: 'GET', path: '/api/owned/thing', surface: 'api', handler: async () => {} },
    ]);
    const ownedLadderRoute: LadderRoute = { method: 'GET', path: '/api/owned/thing' };
    expect(isRouterOwned(ownedRegistry, ownedLadderRoute)).toBe(true);
    expect(isCovered(ownedLadderRoute, ownedRegistry, new Set())).toBe(true);
  });
});

describe('registry self-consistency (vacuous now, forward-real)', () => {
  it('every registered route is complete (method, path, handler)', () => {
    expect(checkRouteCompleteness([...apiRoutes])).toEqual([]);
  });

  it('every account-owned :id route carries a requireOwned loader', () => {
    expect(checkRequireOwnedCoverage([...apiRoutes])).toEqual([]);
  });

  it('no account-owned route is shadowed by an earlier non-owned catch-all', () => {
    expect(() => assertNoOwnedRouteShadowing([...apiRoutes])).not.toThrow();
  });
});
