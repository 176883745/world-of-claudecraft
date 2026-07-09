// The desktop shell's Steam facade (electron/steam.cjs): the
// distribution/dev gating (with the packaged-hatch closure), app id
// resolution, lazy init with per-call retry, and the never-throws link-ticket
// contract. Driven with injected fakes; no electron, no real steamworks.js.
import { describe, expect, it, vi } from 'vitest';
import {
  createSteamShell,
  LINK_TICKET_IDENTITY,
  resolveSteamAppId,
  SPACEWAR_APP_ID,
  steamIntegrationEnabled,
} from '../electron/steam.cjs';

/** A fake steamworks.js whose init returns a client minting `bytes` tickets. */
function fakeSteamworks(bytes: Buffer | null = Buffer.from([0xab, 0xcd])) {
  const getAuthTicketForWebApi = vi.fn(async (_identity: string) => ({
    getBytes: () => bytes,
    cancel: () => {},
  }));
  const init = vi.fn((_appId: number) => ({ auth: { getAuthTicketForWebApi } }));
  return { module: { init }, init, getAuthTicketForWebApi };
}

describe('steamIntegrationEnabled', () => {
  it('is on for the steam distribution regardless of env or packaging', () => {
    expect(steamIntegrationEnabled({ distribution: 'steam', env: {}, isPackaged: true })).toBe(
      true,
    );
    expect(steamIntegrationEnabled({ distribution: 'steam', env: {}, isPackaged: false })).toBe(
      true,
    );
  });

  it('honors WOC_STEAM_DEV=1 on unpackaged checkouts only (the hatch closure)', () => {
    const env = { WOC_STEAM_DEV: '1' };
    expect(steamIntegrationEnabled({ distribution: 'website', env, isPackaged: false })).toBe(true);
    // A PACKAGED website build ignores the env var: an installed player build
    // can never be flipped into loading native Steam code by local env.
    expect(steamIntegrationEnabled({ distribution: 'website', env, isPackaged: true })).toBe(false);
    expect(steamIntegrationEnabled({ distribution: 'website', env: {}, isPackaged: false })).toBe(
      false,
    );
  });
});

describe('resolveSteamAppId', () => {
  it('prefers the wocDesktop stamp (number or digit string)', () => {
    expect(resolveSteamAppId({ packagedMetadata: { wocDesktop: { steamAppId: 3140820 } } })).toBe(
      3140820,
    );
    expect(resolveSteamAppId({ packagedMetadata: { wocDesktop: { steamAppId: '3140820' } } })).toBe(
      3140820,
    );
  });

  it('falls back to WOC_STEAM_APP_ID on unpackaged checkouts only, then Spacewar', () => {
    expect(resolveSteamAppId({ env: { WOC_STEAM_APP_ID: '999' }, isPackaged: false })).toBe(999);
    expect(resolveSteamAppId({ env: { WOC_STEAM_APP_ID: '999' }, isPackaged: true })).toBe(
      SPACEWAR_APP_ID,
    );
    expect(resolveSteamAppId({})).toBe(SPACEWAR_APP_ID);
    // Garbage stamps degrade to the fallback rather than throwing.
    expect(resolveSteamAppId({ packagedMetadata: { wocDesktop: { steamAppId: 'abc' } } })).toBe(
      SPACEWAR_APP_ID,
    );
  });
});

describe('createSteamShell', () => {
  it('website build: never loads steamworks.js and answers null', async () => {
    const requireSteamworks = vi.fn();
    const shell = createSteamShell({
      distribution: 'website',
      env: {},
      isPackaged: true,
      requireSteamworks,
    });
    expect(shell.enabled).toBe(false);
    await expect(shell.getLinkTicket()).resolves.toBeNull();
    expect(requireSteamworks).not.toHaveBeenCalled();
  });

  it('steam build: lazy-inits once with the stamped app id and returns the hex ticket', async () => {
    const fake = fakeSteamworks(Buffer.from([0xde, 0xad, 0xbe, 0xef]));
    const shell = createSteamShell({
      distribution: 'steam',
      packagedMetadata: { wocDesktop: { steamAppId: '3140820' } },
      env: {},
      isPackaged: true,
      requireSteamworks: () => fake.module,
    });
    await expect(shell.getLinkTicket()).resolves.toBe('deadbeef');
    await expect(shell.getLinkTicket()).resolves.toBe('deadbeef');
    expect(fake.init).toHaveBeenCalledTimes(1);
    expect(fake.init).toHaveBeenCalledWith(3140820);
    expect(fake.getAuthTicketForWebApi).toHaveBeenCalledWith(LINK_TICKET_IDENTITY);
  });

  it('pins the link identity both ends verify with', () => {
    expect(LINK_TICKET_IDENTITY).toBe('wocc-link');
  });

  it('dev loop: WOC_STEAM_DEV=1 on an unpackaged checkout inits with Spacewar', async () => {
    const fake = fakeSteamworks();
    const shell = createSteamShell({
      distribution: 'website',
      env: { WOC_STEAM_DEV: '1' },
      isPackaged: false,
      requireSteamworks: () => fake.module,
    });
    await shell.getLinkTicket();
    expect(fake.init).toHaveBeenCalledWith(SPACEWAR_APP_ID);
  });

  it('init failure (Steam not running) answers null and RETRIES on the next click', async () => {
    const log = { warn: vi.fn() };
    const good = fakeSteamworks();
    let calls = 0;
    const shell = createSteamShell({
      distribution: 'steam',
      env: {},
      isPackaged: true,
      log,
      requireSteamworks: () => ({
        init: (appId: number) => {
          calls++;
          if (calls === 1) throw new Error('SteamAPI_Init failed');
          return good.module.init(appId);
        },
      }),
    });
    await expect(shell.getLinkTicket()).resolves.toBeNull();
    expect(log.warn).toHaveBeenCalledTimes(1);
    // The player starts Steam and clicks Link again: no relaunch needed.
    await expect(shell.getLinkTicket()).resolves.toBe('abcd');
  });

  it('a throwing or empty ticket call answers null, never a rejection across IPC', async () => {
    const throwing = createSteamShell({
      distribution: 'steam',
      env: {},
      isPackaged: true,
      requireSteamworks: () => ({
        init: () => ({
          auth: {
            getAuthTicketForWebApi: async () => {
              throw new Error('ticket refused');
            },
          },
        }),
      }),
    });
    await expect(throwing.getLinkTicket()).resolves.toBeNull();

    const empty = fakeSteamworks(Buffer.alloc(0));
    const emptyShell = createSteamShell({
      distribution: 'steam',
      env: {},
      isPackaged: true,
      requireSteamworks: () => empty.module,
    });
    await expect(emptyShell.getLinkTicket()).resolves.toBeNull();

    const noApi = createSteamShell({
      distribution: 'steam',
      env: {},
      isPackaged: true,
      requireSteamworks: () => ({ init: () => ({ auth: {} }) }),
    });
    await expect(noApi.getLinkTicket()).resolves.toBeNull();
  });
});
