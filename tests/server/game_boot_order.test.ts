// Regression pins for the v0.20.0 housekeeping merge's DEFERRED world construction
// (server/main.ts liveGame()). The release moved `new GameServer()` off module load
// so the game-config overrides can apply BEFORE the Sim ctor reads the content
// tables; the branch translated that into the memoized liveGame() accessor because
// the parity/characterization harnesses import main.ts without running startServer()
// and need lazy first-touch construction. That translation swapped the release's
// loud guard (`let game!` crashes on any pre-boot touch) for a silent fallback (an
// early touch would build an override-free world), so these two pins are the loud
// replacement:
//  1. a bare import of server/main constructs NO GameServer (laziness itself);
//  2. inside startServer(), applyGameConfigAtBoot runs BEFORE the first liveGame()
//     touch (overrides-before-construction, the whole point of the deferral).
// The second is a source-order scan in the spirit of the repo's other source guards
// (architecture.test.ts, the S3 emit scan): it anchors on symbol names, never line
// numbers, and fails loudly on an accidental reorder of the boot sequence.

import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

// Replace the real GameServer with a constructor spy. main.ts is the only module
// that imports it as a value (everything else is `import type`), so this observes
// exactly the construction liveGame() would perform.
vi.mock('../../server/game', () => ({ GameServer: vi.fn() }));

describe('deferred GameServer construction (liveGame)', () => {
  it('a bare import of server/main constructs no GameServer', async () => {
    // db.ts evaluates a module-scope DATABASE_URL (throws if unset); dummy URL as
    // in importable_spine.test.ts, no connection is made on Pool construction.
    process.env.DATABASE_URL ||= 'postgres://test:test@127.0.0.1:5433/wocc_phase1_test';
    const { GameServer } = await import('../../server/game');
    await import('../../server/main');
    expect(GameServer).not.toHaveBeenCalled();
  });

  it('startServer applies the game-config overrides before the first liveGame() touch', () => {
    const src = readFileSync(new URL('../../server/main.ts', import.meta.url), 'utf8');
    const bootStart = src.indexOf('async function startServer');
    expect(bootStart).toBeGreaterThan(-1);
    const applyAt = src.indexOf('applyGameConfigAtBoot(', bootStart);
    const touchAt = src.indexOf('liveGame()', bootStart);
    expect(applyAt).toBeGreaterThan(-1);
    expect(touchAt).toBeGreaterThan(-1);
    expect(applyAt).toBeLessThan(touchAt);
  });
});
