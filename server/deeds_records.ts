// Deeds records: an OBSERVER of the sim's deedUnlocked events, never an
// authority. The sim alone decides unlocks (src/sim/deeds.ts grantDeed) and
// persists them inside the characters.state blob; this module only mirrors
// each unlock into the queryable character_deeds index. It copies the
// bank_ledger runtime shape minus the diffing (deeds are event-driven, so
// there is no before/after snapshot to compare): each insert chains onto a
// per-process FIFO promise tail the game loop NEVER awaits, a rejected insert
// logs and never blocks or reorders anything, and the whole body is guarded
// so the observer can never throw into the caller. Idempotence lives in the
// SQL (ON CONFLICT DO NOTHING over UNIQUE (character_id, deed_id)), so retro
// re-emits on every login and crash-replays are free.

import { DEEDS } from '../src/sim/content/deeds';
import type { DeedDef } from '../src/sim/types';
import type { DeedsRarity } from '../src/world_api';
import { insertCharacterDeed } from './deeds_db';
import { REALM } from './realm';
// Imported from the mirror module DIRECTLY (not the ./steam barrel): this
// module rides in game.ts's graph, and the barrel would drag routes.ts (and
// its load-time requireAccount over the db module) into every test that
// partial-mocks the db, the known overlay-mock breakage class.
import { onDeedRecorded } from './steam/mirror';

// Per-process FIFO tail. A character lives on one realm process, so chaining
// preserves that character's unlock order; a rejection is caught (logged) and
// the chain continues.
let tail: Promise<void> = Promise.resolve();

/** The marquee bar for the guild/friend broadcast: notable-or-better Renown,
 *  or any cosmetic reward. Pure so the gate is unit-testable. */
export function isMarqueeDeed(def: DeedDef): boolean {
  return def.renown >= 25 || def.reward !== undefined;
}

/** Hidden deeds are invisible until earned, EXISTENCE included (the DeedDef
 *  contract), so anonymous and third-party surfaces must omit them; only the
 *  earner's own Book shows their copy. A drifted id (content removed) reads
 *  as not hidden: it can no longer spoil anything. */
export function isHiddenDeedId(deedId: string): boolean {
  return DEEDS[deedId]?.hidden === true;
}

/** The public form of the rarity aggregate: strip hidden deeds so an
 *  anonymous caller cannot enumerate their ids the moment one player earns
 *  one. Pure; the main.ts cache applies it once per refresh. */
export function publicRarityPayload(payload: DeedsRarity): DeedsRarity {
  const earned: Record<string, number> = {};
  for (const id in payload.earned) {
    if (!isHiddenDeedId(id)) earned[id] = payload.earned[id];
  }
  return { totalEligible: payload.totalEligible, earned };
}

/** Mirror one sim-decided unlock into character_deeds, fire-and-forget.
 *  Returns void immediately (never a promise, never awaited by the game
 *  loop); gameplay never depends on the write landing. */
export function recordDeedUnlock(
  who: { characterId: number; accountId: number },
  deedId: string,
): void {
  try {
    tail = tail
      .then(() =>
        insertCharacterDeed({
          realm: REALM,
          characterId: who.characterId,
          accountId: who.accountId,
          deedId,
        }),
      )
      .then(() => {
        // The Steam mirror observes THIS observer: it hooks in only after the
        // character_deeds upsert resolves, is synchronous + swallow-all
        // (server/steam/mirror.ts), and stays a per-process no-op unless
        // STEAM_ENABLED=1, the deed is mapped, and the account is linked.
        onDeedRecorded(who.accountId, deedId);
      })
      .catch((err) => {
        console.error('character_deeds write failed:', err);
      });
  } catch (err) {
    // The observer must never fault the event-routing path.
    console.error('deeds recordDeedUnlock failed:', err);
  }
}

/** The current FIFO tail, for tests to await the queue draining deterministically. */
export function deedRecordsIdle(): Promise<void> {
  return tail;
}
