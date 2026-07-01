// Phase 9 route registry for the API pipeline (docs/api-pipeline/).
//
// The registry assembles the per-domain RouteDef arrays (populated by the
// migration phases, Phase 10 onward) into ONE lookup that the Phase 9 dispatcher
// places in front of the legacy /api handleApi ladder: for a path the registry
// owns, the dispatcher runs the onion; for anything else it delegates to the
// legacy handler unchanged.
//
// resolve() does NOT reimplement matching: it reuses the Phase 4 router
// (server/http/router.ts) via createRouter(...).match, inheriting its static-
// first-then-dynamic scan, its 404-vs-405+Allow decision, HEAD-for-GET, the
// synthesized OPTIONS, trailing-slash normalization, and its build-time rejection
// of duplicate (method, shape) and HEAD/OPTIONS/junk registrations.
//
// What the registry OWNS on top of the router is the ordering the router
// deliberately leaves to it. The router matches dynamic patterns in REGISTRATION
// order with no specificity tiebreak, so two overlapping dynamic routes of
// different shape resolve to whichever was registered first. The registry sorts
// the routes MOST-SPECIFIC-FIRST before building the router so the more specific
// pattern wins, and it runs a build-time BOLA-shadow guard
// (assertNoOwnedRouteShadowing) that rejects any account-owned :id route left
// interceptable by an earlier, non-owned catch-all that would skip its ownership
// loader.

import { routes as leaderboardRoutes } from '../leaderboard';
import { type CompiledPattern, compilePattern } from './path_pattern';
import { createRouter, type MatchResult } from './router';
import type { OwnerScope, RouteDef } from './types';

/** The placeholder a param segment collapses to when comparing pattern shapes. */
const PARAM_SHAPE_PLACEHOLDER = ':';

/** The owner scope that marks a player-owned (BOLA-protected) :id resource. */
const ACCOUNT_OWNER_SCOPE: OwnerScope = 'account';

/** The assembled route lookup the dispatcher queries per request. */
export interface ApiRegistry {
  /**
   * Resolve a (method, path) pair against the registered routes, returning the
   * Phase 4 MatchResult: a matched RouteDef with captured params, a 405
   * methodNotAllowed with the Allow set, a synthesized OPTIONS, or notFound (the
   * no-match decision the dispatcher delegates to the legacy ladder on).
   */
  resolve(method: string, path: string): MatchResult<RouteDef>;
}

/**
 * The single flat list of API routes. The migration phases populate it by
 * spreading their per-domain `routes: RouteDef[]` arrays here, one domain at a
 * time. Phase 10 adds the first domain: the public-read surface
 * (server/leaderboard.ts). Every un-migrated /api path is not in this list, so
 * the Phase 9 dispatcher delegates it to the legacy handleApi ladder unchanged.
 * A migrated route stays served by its legacy arm too (the flag-off rollback
 * path) until Phase 25 removes the ladder.
 */
export const apiRoutes: readonly RouteDef[] = [...leaderboardRoutes];

/**
 * Build a registry from a route list (defaults to apiRoutes). Ordering happens
 * here, not in the router:
 *  1. sort the routes MOST-SPECIFIC-FIRST so overlapping cross-shape dynamic
 *     routes resolve to the more specific one (the router has no specificity
 *     tiebreak and would otherwise pick the first-registered);
 *  2. run the BOLA-shadow guard over the FINAL order, before the router is built;
 *  3. build the Phase 4 router, which additionally rejects duplicate
 *     (method, shape) and non-registrable-method registrations at build time.
 */
export function createApiRegistry(routes: readonly RouteDef[] = apiRoutes): ApiRegistry {
  const sorted = sortMostSpecificFirst(routes);
  assertNoOwnedRouteShadowing(sorted);
  const router = createRouter(sorted);
  return { resolve: (method, path) => router.match(method, path) };
}

/** The default registry over apiRoutes (empty until the migration phases run). */
export const apiRegistry: ApiRegistry = createApiRegistry(apiRoutes);

/**
 * Build-time guard against a BOLA shadow: an account-owned :id route whose paths
 * would be intercepted, in the final match order, by an EARLIER, non-owned,
 * different-shape DYNAMIC route that runs no ownership loader. Throws with a
 * pointed message naming both routes.
 *
 * It is a no-op while apiRoutes is empty, but it is a recorded Phase 4 QA
 * obligation: the router matches dynamic patterns first-registered, so a
 * non-owned leading-":param" catch-all registered ahead of a specific
 * requireOwned route would skip that route's ownership loader (a BOLA hole). The
 * specificity sort normally orders the owned route first; this guard fails the
 * build for any construction the sort cannot save.
 *
 * The check is deliberately proportionate. It ignores:
 *  - a STATIC owned route (the router matches the static exact-map before any
 *    dynamic pattern, so a static owned route is always reached first);
 *  - a STATIC earlier route (it matches exactly one reserved-literal path, never
 *    the owned :id family, so it is a special case, not a catch-all);
 *  - an earlier route under a DIFFERENT method (methods never share a match);
 *  - an earlier route that carries ANY requireOwned marker (it runs its own
 *    ownership loader, so the resource is still authorized);
 *  - an earlier route of the SAME shape (that is a duplicate the router rejects).
 * Shape-overlap is a structural comparison of the compiled segments: two
 * same-length patterns overlap unless some position is literal-vs-literal with
 * differing values (a param matches any non-empty segment, so a literal-vs-param
 * or param-vs-param position always has a common concrete path).
 */
export function assertNoOwnedRouteShadowing(routes: readonly RouteDef[]): void {
  const compiled = routes.map((route) => ({ route, pattern: compilePattern(route.path) }));
  for (let j = 0; j < compiled.length; j++) {
    const owned = compiled[j];
    if (owned.pattern.isStatic || !isAccountOwned(owned.route)) continue;
    for (let i = 0; i < j; i++) {
      const earlier = compiled[i];
      if (earlier.route.method !== owned.route.method) continue;
      if (earlier.pattern.isStatic) continue;
      if (hasOwnershipLoader(earlier.route)) continue;
      if (shapeKey(earlier.pattern) === shapeKey(owned.pattern)) continue;
      if (!patternsOverlap(earlier.pattern, owned.pattern)) continue;
      throw new Error(
        `Route ${owned.route.method} ${owned.route.path} requires account ownership but is shadowed by the earlier non-owned dynamic route ${earlier.route.method} ${earlier.route.path}, which matches its paths first and would skip the ownership loader`,
      );
    }
  }
}

/**
 * Sort routes most-specific-first with a deterministic, stable key:
 *  1. more leading literal segments first (a longer fixed prefix is more
 *     specific: '/a/b/:c' beats '/a/:b/:c');
 *  2. then more literal segments overall;
 *  3. then fewer params;
 *  4. then original registration order (a stable tiebreak, so routes of equal
 *     specificity keep the router's documented first-registered semantics).
 * Static routes sort ahead of dynamic ones as a side effect (they have no
 * params), which is harmless: the router puts them in its exact-match map anyway.
 */
function sortMostSpecificFirst(routes: readonly RouteDef[]): RouteDef[] {
  const keyed = routes.map((route, index) => {
    const pattern = compilePattern(route.path);
    const paramCount = pattern.paramNames.length;
    return {
      route,
      index,
      leadingLiteralCount: leadingLiteralSegments(pattern),
      literalCount: pattern.segments.length - paramCount,
      paramCount,
    };
  });
  keyed.sort((a, b) => {
    if (a.leadingLiteralCount !== b.leadingLiteralCount) {
      return b.leadingLiteralCount - a.leadingLiteralCount;
    }
    if (a.literalCount !== b.literalCount) return b.literalCount - a.literalCount;
    if (a.paramCount !== b.paramCount) return a.paramCount - b.paramCount;
    return a.index - b.index;
  });
  return keyed.map((entry) => entry.route);
}

/** Count the leading run of literal segments before the first param segment. */
function leadingLiteralSegments(pattern: CompiledPattern): number {
  let count = 0;
  for (const segment of pattern.segments) {
    if (segment.kind !== 'literal') break;
    count++;
  }
  return count;
}

/** The shape of a pattern: literals kept, params collapsed to a placeholder. */
function shapeKey(pattern: CompiledPattern): string {
  return pattern.segments
    .map((segment) => (segment.kind === 'literal' ? segment.value : PARAM_SHAPE_PLACEHOLDER))
    .join('/');
}

/**
 * True when some concrete request path matches BOTH patterns. Requires equal
 * segment counts (the matcher rejects a length mismatch); then every position
 * must be compatible: only a literal-vs-literal position with differing values
 * makes overlap impossible, since a param matches any non-empty segment.
 */
function patternsOverlap(a: CompiledPattern, b: CompiledPattern): boolean {
  if (a.segments.length !== b.segments.length) return false;
  for (let i = 0; i < a.segments.length; i++) {
    const sa = a.segments[i];
    const sb = b.segments[i];
    if (sa.kind === 'literal' && sb.kind === 'literal' && sa.value !== sb.value) return false;
  }
  return true;
}

/** True for a route that BOLA-loads and authorizes a player-owned :id resource. */
function isAccountOwned(route: RouteDef): boolean {
  return route.meta?.requireOwned?.ownerScope === ACCOUNT_OWNER_SCOPE;
}

/** True for any route that runs an ownership loader (account- or operator-scoped). */
function hasOwnershipLoader(route: RouteDef): boolean {
  return route.meta?.requireOwned !== undefined;
}
