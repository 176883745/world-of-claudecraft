// The Steam achievement mirror (server/steam/mirror.ts): observer-only
// no-op guards, the hot-path never-awaits contract, in-flight dedupe, the
// capped retry ladder, the link cache (TTL + synchronous invalidation on
// link change), and reconcile-on-link pushing exactly the mapped subset.
process.env.DATABASE_URL ||= 'postgres://test:test@127.0.0.1:5433/wocc_steam_mirror_units';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACHIEVEMENT_MAP } from '../../server/steam/achievement_map';
import {
  LINK_CACHE_TTL_MS,
  MAX_PUSH_ATTEMPTS,
  onDeedRecorded,
  onLinkChanged,
  PUSH_BACKOFF_BASE_MS,
  reconcileLink,
  resetSteamMirrorForTests,
  setSteamMirrorDepsForTests,
  steamMirrorIdle,
} from '../../server/steam/mirror';

const ACCOUNT_ID = 7;
const STEAM_ID = '76561198000000001';
const OLD_STEAM_ID = '76561198000000002';

// Real mapped ids straight from the shipped map (the map suite pins the map
// itself; this suite only needs members and a guaranteed non-member).
const mappedEntries = Object.entries(ACHIEVEMENT_MAP);
const [MAPPED_DEED, MAPPED_ACH] = mappedEntries[0];
const [MAPPED_DEED_2, MAPPED_ACH_2] = mappedEntries[1];
const UNMAPPED_DEED = 'not_a_real_deed_id';

const savedEnv: Record<string, string | undefined> = {};
const STEAM_ENV_KEYS = ['STEAM_ENABLED', 'STEAM_APP_ID', 'STEAM_WEB_API_KEY'] as const;

function enableSteam(): void {
  process.env.STEAM_ENABLED = '1';
  process.env.STEAM_APP_ID = '480';
  process.env.STEAM_WEB_API_KEY = 'raw-test-publisher-value';
}

let pushMock: ReturnType<typeof vi.fn>;
let linkMock: ReturnType<typeof vi.fn>;
let earnedMock: ReturnType<typeof vi.fn>;
let delayMock: ReturnType<typeof vi.fn>;
let clock: number;

/** Give every queued microtask chain (cache lookup -> enqueue -> drain) room
 *  to settle; the injected delay resolves instantly so this is bounded. */
async function settle(): Promise<void> {
  for (let i = 0; i < 10; i++) await Promise.resolve();
  await steamMirrorIdle();
  for (let i = 0; i < 10; i++) await Promise.resolve();
  await steamMirrorIdle();
}

beforeEach(() => {
  for (const key of STEAM_ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
  clock = 1_000_000;
  pushMock = vi.fn(async () => true);
  linkMock = vi.fn(async () => ({ steamId: STEAM_ID }));
  earnedMock = vi.fn(async () => [] as string[]);
  delayMock = vi.fn(async () => {});
  setSteamMirrorDepsForTests({
    pushUnlock: pushMock as never,
    linkForAccount: linkMock as never,
    earnedDeedIds: earnedMock as never,
    delay: delayMock as never,
    now: () => clock,
  });
});

afterEach(() => {
  resetSteamMirrorForTests();
  for (const key of STEAM_ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
  vi.restoreAllMocks();
});

describe('observer no-op guards', () => {
  it('does nothing when the flag is off: no link read, no push', async () => {
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    expect(linkMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('does nothing for an unmapped deed, without even a link read', async () => {
    enableSteam();
    onDeedRecorded(ACCOUNT_ID, UNMAPPED_DEED);
    await settle();
    expect(linkMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('does nothing for an unlinked account', async () => {
    enableSteam();
    linkMock.mockResolvedValue(null);
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    expect(linkMock).toHaveBeenCalledTimes(1);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('swallows a failing link read and does not cache the failure', async () => {
    enableSteam();
    linkMock.mockRejectedValueOnce(new Error('db down'));
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    expect(pushMock).not.toHaveBeenCalled();
    // The failed lookup was evicted: the next unlock re-reads and delivers.
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    expect(linkMock).toHaveBeenCalledTimes(2);
    expect(pushMock).toHaveBeenCalledTimes(1);
  });
});

describe('the hot path never awaits', () => {
  it('onDeedRecorded returns synchronously (void) and nothing downstream runs until the IO resolves', async () => {
    enableSteam();
    // The link read is held open: if the hot path awaited anything, control
    // would never come back while this promise is pending.
    let release: (row: { steamId: string } | null) => void = () => {};
    linkMock.mockImplementationOnce(
      () => new Promise<{ steamId: string } | null>((resolve) => (release = resolve)),
    );
    const returned = onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    // Synchronous contract: undefined return with the lookup still pending,
    // and no push has happened (the game loop moved on already).
    expect(returned).toBeUndefined();
    expect(pushMock).not.toHaveBeenCalled();
    release({ steamId: STEAM_ID });
    await settle();
    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it('reconcileLink returns synchronously (void) too', () => {
    enableSteam();
    const returned = reconcileLink(ACCOUNT_ID, STEAM_ID);
    expect(returned).toBeUndefined();
    expect(pushMock).not.toHaveBeenCalled();
  });
});

describe('delivery, dedupe, and the retry ladder', () => {
  it('pushes a mapped unlock for a linked account with the provisioned key + app id', async () => {
    enableSteam();
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith({
      key: 'raw-test-publisher-value',
      appId: 480,
      steamId: STEAM_ID,
      achName: MAPPED_ACH,
    });
  });

  it('dedupes an in-flight (steamId, achievement) pair to one push', async () => {
    enableSteam();
    let release: (ok: boolean) => void = () => {};
    pushMock.mockImplementationOnce(() => new Promise<boolean>((resolve) => (release = resolve)));
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    for (let i = 0; i < 10; i++) await Promise.resolve();
    // Duplicate delivery while the first is in flight (retro re-emit shape).
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    for (let i = 0; i < 10; i++) await Promise.resolve();
    release(true);
    await settle();
    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it('retries with capped exponential backoff then drops with one warn line', async () => {
    enableSteam();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    pushMock.mockResolvedValue(false);
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    expect(pushMock).toHaveBeenCalledTimes(MAX_PUSH_ATTEMPTS);
    expect(delayMock.mock.calls.map((c) => c[0])).toEqual([
      PUSH_BACKOFF_BASE_MS,
      PUSH_BACKOFF_BASE_MS * 2,
      PUSH_BACKOFF_BASE_MS * 4,
    ]);
    expect(warn).toHaveBeenCalledTimes(1);
    const line = String(warn.mock.calls[0][0]);
    expect(line).toContain(MAPPED_ACH);
    // The drop line never leaks the key or an upstream URL/body.
    expect(line).not.toContain('raw-test-publisher-value');
    expect(line).not.toContain('http');
  });

  it('a mid-ladder success stops the retries and drops nothing', async () => {
    enableSteam();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    pushMock.mockResolvedValueOnce(false).mockResolvedValueOnce(false).mockResolvedValue(true);
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    expect(pushMock).toHaveBeenCalledTimes(3);
    expect(warn).not.toHaveBeenCalled();
  });

  it('a failed pair may redeliver later (dedupe clears after the attempt settles)', async () => {
    enableSteam();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    pushMock.mockResolvedValue(false);
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    pushMock.mockResolvedValue(true);
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    expect(pushMock).toHaveBeenCalledTimes(MAX_PUSH_ATTEMPTS + 1);
  });
});

describe('the link cache', () => {
  it('a burst for one account does exactly one steam_links read inside the TTL', async () => {
    enableSteam();
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED_2);
    await settle();
    expect(linkMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledTimes(2);
  });

  it('re-reads after the TTL expires', async () => {
    enableSteam();
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    clock += LINK_CACHE_TTL_MS + 1;
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED_2);
    await settle();
    expect(linkMock).toHaveBeenCalledTimes(2);
  });
});

describe('reconcile-on-link', () => {
  it('pushes exactly the earned-and-mapped intersection to the new steam id', async () => {
    enableSteam();
    earnedMock.mockResolvedValue([MAPPED_DEED, UNMAPPED_DEED, MAPPED_DEED_2]);
    reconcileLink(ACCOUNT_ID, STEAM_ID);
    await settle();
    expect(earnedMock).toHaveBeenCalledWith(ACCOUNT_ID);
    expect(pushMock).toHaveBeenCalledTimes(2);
    const pushed = pushMock.mock.calls.map((c) => c[0]);
    expect(pushed).toEqual([
      expect.objectContaining({ steamId: STEAM_ID, achName: MAPPED_ACH }),
      expect.objectContaining({ steamId: STEAM_ID, achName: MAPPED_ACH_2 }),
    ]);
  });

  it('is inert while the flag is off (a stray call cannot leak)', async () => {
    reconcileLink(ACCOUNT_ID, STEAM_ID);
    await settle();
    expect(earnedMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('after unlink + relink, unlocks flow to the NEW id and never the old one', async () => {
    enableSteam();
    // Seed the cache with the OLD link (an unlock while it was live).
    linkMock.mockResolvedValue({ steamId: OLD_STEAM_ID });
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED);
    await settle();
    expect(pushMock).toHaveBeenLastCalledWith(expect.objectContaining({ steamId: OLD_STEAM_ID }));

    // Unlink: the route calls onLinkChanged(account, null) in-request, so the
    // stale cached id is dead immediately, not a TTL later.
    onLinkChanged(ACCOUNT_ID, null);
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED_2);
    await settle();
    expect(pushMock).toHaveBeenCalledTimes(1);

    // Relink to the NEW id: reconcile re-pushes history there, and fresh
    // unlocks follow, all without ever touching the old id again.
    earnedMock.mockResolvedValue([MAPPED_DEED]);
    reconcileLink(ACCOUNT_ID, STEAM_ID);
    await settle();
    onDeedRecorded(ACCOUNT_ID, MAPPED_DEED_2);
    await settle();
    const pushedAfterRelink = pushMock.mock.calls.slice(1).map((c) => c[0].steamId);
    expect(pushedAfterRelink).toEqual([STEAM_ID, STEAM_ID]);
  });
});
