// Pure environment to Config loader for the server. It reads a NodeJS.ProcessEnv
// ONCE into a typed, Object.freeze-d Config and returns it. It is pure by
// construction: it takes env as a parameter and never touches the global
// process.env, so it is trivially unit-testable and a later boot phase can call
// loadConfig(process.env) at the single edge. It is NOT wired into boot anywhere
// yet (a later phase does that and flips the dispatch default to 'new').
//
// No magic values: every default lives in a named const below, single-sourced.
// The loader never logs the env or echoes any secret (notably DATABASE_URL).

// The two accepted API dispatch modes, single-sourced so the boot wiring
// (server/main.ts) and the dispatcher (server/http/dispatch.ts) share ONE type
// rather than re-typing the literal union at each call site.
export type DispatchMode = 'legacy' | 'new';

export interface Config {
  // The SINGLE all-or-nothing API dispatch flag (canonical env name API_DISPATCH).
  // 'legacy' keeps the existing route handling; 'new' selects the re-architected
  // pipeline. A later phase wires this in and flips the default to 'new'.
  readonly dispatch: DispatchMode;
  readonly databaseUrl: string;
  readonly port: number;
  readonly allowDevCommands: boolean;
  readonly turnstileSecret: string;
  readonly maxWsPerIpHard: number;
  readonly githubRepo: string;
  readonly githubToken: string;
  readonly chatLogRetentionDays: number;
  readonly perfReportRetentionDays: number;
}

// Dispatch flag: the two accepted values and the default. Declared `as const` so
// the equality checks in parseDispatch narrow a raw string to the literal union.
const DISPATCH_LEGACY = 'legacy' as const;
const DISPATCH_NEW = 'new' as const;
// The single source of truth for the default dispatch mode. Exported so the boot
// wiring (server/main.ts) uses the SAME default for its pre-boot/test-import value
// as loadConfig uses when API_DISPATCH is unset, rather than re-typing the literal.
// Phase 25 flips this to 'new'.
export const DEFAULT_DISPATCH: DispatchMode = DISPATCH_LEGACY;

// The literal env value that turns the dev-command cheats on. Anything else
// (including unset) leaves them off; production must never set this.
const ALLOW_DEV_COMMANDS_ON = '1';

// Scalar defaults, single-sourced.
const DEFAULT_PORT = 8787;
const DEFAULT_TURNSTILE_SECRET = '';
const DEFAULT_MAX_WS_PER_IP_HARD = 20;
const DEFAULT_GITHUB_REPO = 'levy-street/world-of-claudecraft';
const DEFAULT_GITHUB_TOKEN = '';
const DEFAULT_CHAT_LOG_RETENTION_DAYS = 90;
const DEFAULT_PERF_REPORT_RETENTION_DAYS = 14;

// Number(env.X) with a fallback: an unset, empty, or non-finite value (a stray
// "PORT=" or "PORT=abc") yields the default rather than NaN.
function numberOr(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Accept exactly 'legacy' or 'new'; anything else (including unset) falls back to
// the default. The `as const` literal consts let the comparison narrow the result.
function parseDispatch(value: string | undefined): DispatchMode {
  return value === DISPATCH_NEW || value === DISPATCH_LEGACY ? value : DEFAULT_DISPATCH;
}

export function loadConfig(env: NodeJS.ProcessEnv): Config {
  const databaseUrl = env.DATABASE_URL ?? '';
  if (databaseUrl === '') {
    // Fail fast at config load. Never include the value in the message: even an
    // empty one here, a future caller could pass a partial URL, so the message
    // stays value-free to avoid leaking a secret to logs.
    throw new Error('DATABASE_URL is required but was not set');
  }

  return Object.freeze({
    dispatch: parseDispatch(env.API_DISPATCH),
    databaseUrl,
    port: numberOr(env.PORT, DEFAULT_PORT),
    allowDevCommands: env.ALLOW_DEV_COMMANDS === ALLOW_DEV_COMMANDS_ON,
    turnstileSecret: env.TURNSTILE_SECRET ?? DEFAULT_TURNSTILE_SECRET,
    maxWsPerIpHard: numberOr(env.MAX_WS_PER_IP_HARD, DEFAULT_MAX_WS_PER_IP_HARD),
    githubRepo: env.GITHUB_REPO ?? DEFAULT_GITHUB_REPO,
    githubToken: env.GITHUB_TOKEN ?? DEFAULT_GITHUB_TOKEN,
    chatLogRetentionDays: numberOr(env.CHAT_LOG_RETENTION_DAYS, DEFAULT_CHAT_LOG_RETENTION_DAYS),
    perfReportRetentionDays: numberOr(
      env.PERF_REPORT_RETENTION_DAYS,
      DEFAULT_PERF_REPORT_RETENTION_DAYS,
    ),
  });
}
