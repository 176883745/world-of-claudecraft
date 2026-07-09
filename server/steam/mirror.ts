// The Steam achievement mirror: an OBSERVER, never an authority. The sim
// decides unlocks, server/deeds_records.ts persists them into character_deeds,
// and this module copies a linked account's unlocks outward to Steam via the
// publisher Web API. Nothing here can grant, deny, or reorder a deed, and the
// 50 ms world loop never awaits any of it: onDeedRecorded returns
// synchronously and all IO happens on a detached in-process FIFO.
//
// Delivery model: at-least-once with in-flight dedupe. Steam's
// SetUserStatsForGame is idempotent for an already-set achievement, so a
// redelivery (crash replay, retro re-emit, reconcile overlap) is harmless. A
// push that still fails after the capped retries is DROPPED with one warn
// line: the server store stays canonical and the reconcile-on-link push heals
// any gap the next time the player links (no periodic sweep in v1, the
// Cogmind pattern).
//
// Secrets: the publisher key is read inside web_api.ts request builders only;
// no log line here carries a URL, a body, or anything upstream echoed.

import { earnedDeedIdsForAccount } from '../deeds_db';
import { ACHIEVEMENT_MAP } from './achievement_map';
import { steamAppId, steamEnabled, steamWebApiKey } from './config';
import { steamLinkForAccount } from './steam_db';
import { pushAchievementUnlock } from './web_api';

/** Push attempts per unlock before dropping (capped exponential backoff). */
export const MAX_PUSH_ATTEMPTS = 4;
/** Base backoff between attempts; doubles each retry (1s, 2s, 4s). */
export const PUSH_BACKOFF_BASE_MS = 1000;
/** How long a link lookup is trusted before re-reading steam_links. */
export const LINK_CACHE_TTL_MS = 60_000;

interface MirrorDeps {
  linkForAccount(accountId: number): Promise<{ steamId: string } | null>;
  earnedDeedIds(accountId: number): Promise<string[]>;
  pushUnlock(opts: {
    key: string;
    appId: number;
    steamId: string;
    achName: string;
  }): Promise<boolean>;
  delay(ms: number): Promise<void>;
  now(): number;
}

// Every real dep is a call-time arrow, never a load-time export binding: this
// module rides in game.ts's graph via deeds_records, so a load-time access of
// a db-boundary export would throw inside every test that partial-mocks that
// module with a fixed export list (the known overlay-mock breakage class).
const REAL_DEPS: MirrorDeps = {
  linkForAccount: (accountId) => steamLinkForAccount(accountId),
  earnedDeedIds: (accountId) => earnedDeedIdsForAccount(accountId),
  pushUnlock: (opts) => pushAchievementUnlock(opts),
  delay: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now: () => Date.now(),
};

let deps: MirrorDeps = REAL_DEPS;

/** Override mirror IO with fakes (test-only; merges over the real deps). */
export function setSteamMirrorDepsForTests(overrides: Partial<MirrorDeps>): void {
  deps = { ...REAL_DEPS, ...overrides };
}

// ---------------------------------------------------------------------------
// Link cache. Per-process, short TTL, promise-valued so a retro burst of
// unlocks for one account does exactly one steam_links read. The link and
// unlink routes overwrite entries SYNCHRONOUSLY via onLinkChanged, so a relink
// to a different Steam id can never mirror to the stale one for the TTL tail.
// ---------------------------------------------------------------------------

interface LinkCacheEntry {
  steamId: Promise<string | null>;
  expiresAt: number;
}

const linkCache = new Map<number, LinkCacheEntry>();

function cachedSteamId(accountId: number): Promise<string | null> {
  const now = deps.now();
  const hit = linkCache.get(accountId);
  if (hit && hit.expiresAt > now) return hit.steamId;
  const steamId = deps
    .linkForAccount(accountId)
    .then((row) => row?.steamId ?? null)
    .catch(() => {
      // A failed read is not proof of no link; forget it so the next unlock
      // retries instead of caching "unlinked" for the TTL.
      linkCache.delete(accountId);
      return null;
    });
  linkCache.set(accountId, { steamId, expiresAt: now + LINK_CACHE_TTL_MS });
  return steamId;
}

/** The link and unlink routes call this the moment steam_links changes, so
 *  the mirror's view flips in the same request, not a TTL later. */
export function onLinkChanged(accountId: number, steamId: string | null): void {
  linkCache.set(accountId, {
    steamId: Promise.resolve(steamId),
    expiresAt: deps.now() + LINK_CACHE_TTL_MS,
  });
}

// ---------------------------------------------------------------------------
// The push queue: a plain FIFO drained by one detached worker, with a pending
// set (queued or in flight) so a duplicate delivery of the same
// (steamId, achievement) pair collapses while one is already on its way.
// ---------------------------------------------------------------------------

interface PushItem {
  steamId: string;
  achName: string;
}

const queue: PushItem[] = [];
const pending = new Set<string>();
let draining = false;
let drain: Promise<void> = Promise.resolve();

function pushKey(item: PushItem): string {
  return `${item.steamId}:${item.achName}`;
}

function enqueue(item: PushItem): void {
  const key = pushKey(item);
  if (pending.has(key)) return;
  pending.add(key);
  queue.push(item);
  if (draining) return;
  draining = true;
  drain = (async () => {
    try {
      while (queue.length > 0) {
        const next = queue.shift();
        if (!next) break;
        try {
          await attemptPush(next);
        } finally {
          pending.delete(pushKey(next));
        }
      }
    } finally {
      draining = false;
    }
  })();
}

async function attemptPush(item: PushItem): Promise<void> {
  const appId = steamAppId();
  const key = steamWebApiKey();
  if (appId === null || key === null) {
    console.warn('steam mirror: enabled without STEAM_APP_ID/STEAM_WEB_API_KEY, dropping unlock');
    return;
  }
  for (let attempt = 1; attempt <= MAX_PUSH_ATTEMPTS; attempt++) {
    const ok = await deps.pushUnlock({ key, appId, steamId: item.steamId, achName: item.achName });
    if (ok) return;
    if (attempt < MAX_PUSH_ATTEMPTS) {
      await deps.delay(PUSH_BACKOFF_BASE_MS * 2 ** (attempt - 1));
    }
  }
  // One fixed line, no URL, no body, no key: reconcile-on-link heals the gap.
  console.warn(`steam mirror: dropping unlock ${item.achName} after ${MAX_PUSH_ATTEMPTS} attempts`);
}

// ---------------------------------------------------------------------------
// Entry points.
// ---------------------------------------------------------------------------

/**
 * Mirror one recorded unlock. Called by server/deeds_records.ts AFTER the
 * character_deeds upsert for the event resolves (the observer's observer);
 * synchronous and swallow-all so the recorder's FIFO can never be faulted or
 * slowed from here. No-ops unless the flag is on, the deed is in the map, and
 * the account has a link.
 */
export function onDeedRecorded(accountId: number, deedId: string): void {
  try {
    if (!steamEnabled()) return;
    const achName = ACHIEVEMENT_MAP[deedId];
    if (achName === undefined) return;
    void cachedSteamId(accountId)
      .then((steamId) => {
        if (steamId !== null) enqueue({ steamId, achName });
      })
      .catch(() => {});
  } catch (err) {
    console.error('steam mirror: onDeedRecorded failed:', err);
  }
}

/**
 * Reconcile-on-link: push everything the account already earned, intersected
 * with the map, to the freshly linked Steam id. Fire-and-forget; the link
 * response never waits on it. The server store is canonical and Steam is a
 * mirrored subset, so this one push is the entire sync.
 */
export function reconcileLink(accountId: number, steamId: string): void {
  try {
    if (!steamEnabled()) return;
    onLinkChanged(accountId, steamId);
    void deps
      .earnedDeedIds(accountId)
      .then((deedIds) => {
        for (const deedId of deedIds) {
          const achName = ACHIEVEMENT_MAP[deedId];
          if (achName !== undefined) enqueue({ steamId, achName });
        }
      })
      .catch((err) => {
        console.error('steam mirror: reconcile read failed:', err);
      });
  } catch (err) {
    console.error('steam mirror: reconcileLink failed:', err);
  }
}

/** The current drain tail, for tests to await deterministic queue settling. */
export function steamMirrorIdle(): Promise<void> {
  return drain;
}

/** Clear queue, dedupe, and cache state (test-only). */
export function resetSteamMirrorForTests(): void {
  queue.length = 0;
  pending.clear();
  linkCache.clear();
  draining = false;
  drain = Promise.resolve();
  deps = REAL_DEPS;
}
