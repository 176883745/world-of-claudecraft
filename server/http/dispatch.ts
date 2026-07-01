// The dispatcher-in-front for the API pipeline (Phase 9 of docs/api-pipeline/).
//
// It places the new in-house pipeline ahead of the legacy /api handleApi ladder
// via a per-path CATCH-ALL DELEGATE: for a path the registry OWNS (a matched
// RouteDef) it runs the Phase 5 onion under runOnion (the exactly-one-response
// wrapper); for ANY OTHER /api path it calls the injected legacy handleApi
// delegate UNCHANGED. The registry is EMPTY today (Phase 10 onward migrates the
// per-domain route tables), so every request delegates and behavior is
// byte-for-byte identical to today; the parity harness proves it.
//
// The returned dispatcher matches the legacy handleApi call shape (a
// fire-and-forget (req, res) => void): runOnion owns the single response, so the
// dispatcher never awaits-and-responds a second time. CORS and the OPTIONS-204
// preflight stay in main.ts's single top-level wrapper (applied before this
// runs and shared with the legacy ladder), so this onion intentionally does NOT
// mount withCors: keeping CORS in one place is what makes it identical on the
// delegated and the onion paths.

import type * as http from 'node:http';
import { runOnion } from './compose';
import type { DispatchMode } from './config';
import { buildContext } from './context';
import { type MetricSink, noopMetricSink, withMetrics } from './middleware/metric_sink';
import { withErrors } from './middleware/with_errors';
import type { ApiRegistry } from './registry';
import type { Ctx, Middleware, RouteDef } from './types';

/** The legacy delegate: today's handleApi, invoked UNCHANGED for un-migrated /api paths. */
export type ApiDelegate = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void | Promise<void>;

/** The dispatcher call shape: fire-and-forget, mirroring the legacy handleApi call site. */
export type ApiDispatcher = (req: http.IncomingMessage, res: http.ServerResponse) => void;

/** Everything the dispatcher needs, injected so it stays pure and unit-testable. */
export interface ApiDispatcherDeps {
  /** The assembled route registry (empty today; the migration phases populate it). */
  readonly registry: ApiRegistry;
  /** The legacy /api handleApi, called UNCHANGED for every path the registry does not own. */
  readonly delegate: ApiDelegate;
  /** Where per-request metric events go; defaults to the no-op sink (Phase 23 wires a real one). */
  readonly metricSink?: MetricSink;
}

/**
 * Build the dispatcher-in-front. For a matched RouteDef it runs the onion under
 * runOnion (the single response authority); for every other /api path it
 * delegates to the legacy handleApi with the request untouched.
 */
export function createApiDispatcher(deps: ApiDispatcherDeps): ApiDispatcher {
  const metricSink = deps.metricSink ?? noopMetricSink;
  return (req, res) => {
    const method = req.method ?? '';
    const path = (req.url ?? '').split('?')[0];
    const match = deps.registry.resolve(method, path);
    if (match.kind !== 'matched') {
      // Un-migrated path (this phase: EVERY path): delegate to the legacy ladder
      // UNCHANGED. The delegate owns its own response; we never touch req/res.
      void deps.delegate(req, res);
      return;
    }
    // A registry-owned route: run the Phase 5 onion. runOnion guarantees exactly
    // one idempotent response on both the resolve and the throw path, so we
    // fire-and-forget its promise, matching the legacy void call site.
    const route = match.route;
    const ctx = buildContext(req, res, match);
    const stack: Middleware[] = [
      // Outermost: the sole response authority. On a throw it maps the error to
      // the route's surface envelope (RFC 9457 for /api) via mapError and writes
      // exactly once; a handler that already responded is left untouched.
      withErrors({ surface: route.meta?.envelope }),
      // The metric observation point (the :param TEMPLATE, never the concrete
      // path, to bound sink cardinality). The sink is a no-op until Phase 23; the
      // hook is wired here so the injection point is live.
      withMetrics(metricSink, route.path),
      // Route-local middleware (per-route rate limits, withBody, requireAccount)
      // composed after the global frames, exactly as each RouteDef declares them
      // when it migrates (Phase 10 onward). withRequestId is intentionally omitted:
      // runOnion already binds ctx.reqId in AsyncLocalStorage for the whole run, so
      // a separate rebind frame would be redundant (see middleware/request_id.ts).
      ...(route.middleware ?? []),
      // The handler. Turning its returned value into the surface envelope lands
      // with the first migrated route (Phase 10); today no route is migrated, so a
      // dispatcher-run handler writes to ctx.res directly.
      runHandler(route),
    ];
    void runOnion(ctx, stack);
  };
}

/** Wrap a RouteHandler as the terminal onion middleware (it ignores next: it is last). */
function runHandler(route: RouteDef): Middleware {
  return async (ctx: Ctx) => {
    await route.handler(ctx);
  };
}

/**
 * Pick the /api entry for the current dispatch mode. When 'new', the in-house
 * dispatcher fronts the legacy ladder; when 'legacy', the legacy handleApi runs
 * directly, an inert rollback in which the new pipeline is never entered. main.ts
 * reads the mode from loadConfig once at boot; flipping the production default to
 * 'new' is Phase 25's deliverable, not this phase's.
 */
export function selectApiEntry(
  mode: DispatchMode,
  newDispatcher: ApiDispatcher,
  legacy: ApiDelegate,
): ApiDispatcher {
  return mode === 'new' ? newDispatcher : (req, res) => void legacy(req, res);
}
