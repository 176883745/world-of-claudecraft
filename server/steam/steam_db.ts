// SQL boundary for the Steam link domain (the *_db.ts convention: every
// steam_links query lives here, parameterized, and no other module carries raw
// SQL for the table). The DDL is in server/db.ts SCHEMA. Imports the pool
// ONLY, deliberately mirroring server/deeds_db.ts: modules that stub the db
// module in tests never need fakes for these functions.
//
// A steam_links row is a cosmetic-mirror pointer (which Steam account mirrors
// this WoCC account's deed unlocks), never an identity or session source.
// Nothing in this module (or anywhere in server/steam/) reads or writes
// auth_tokens or mints credentials; the forbidden-login test pins that.

import { pool } from '../db';
import { isUniqueViolation } from '../http_util';

/** One account-to-Steam link. steamId is Steam's 64-bit id as a decimal string. */
export interface SteamLinkRow {
  accountId: number;
  steamId: string;
  createdAt: string;
}

/** The caller's link, or null when the account has none. */
export async function steamLinkForAccount(accountId: number): Promise<SteamLinkRow | null> {
  const res = await pool.query(
    'SELECT account_id, steam_id, created_at FROM steam_links WHERE account_id = $1',
    [accountId],
  );
  const row = res.rows[0];
  if (!row) return null;
  return {
    accountId: row.account_id,
    steamId: row.steam_id,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

/** The account a Steam id is linked to, or null. */
export async function accountForSteamId(steamId: string): Promise<number | null> {
  const res = await pool.query('SELECT account_id FROM steam_links WHERE steam_id = $1', [steamId]);
  return res.rows[0]?.account_id ?? null;
}

/**
 * How an insert attempt resolved. Both conflict arms are terminal 409s for the
 * caller: 'account_linked' (this account already has a link; account_id is the
 * PK) and 'steam_taken' (this Steam id belongs to another account; steam_id is
 * UNIQUE). The route pre-checks both for the friendly ordering, but a
 * concurrent racer can still land first, so the insert itself classifies the
 * 23505 by constraint instead of surfacing a 500.
 */
export type SteamLinkInsert = 'ok' | 'account_linked' | 'steam_taken';

/** Insert the caller's link. Plain INSERT, never an upsert: replacing a link
 *  is an explicit unlink-then-link so the mirror's reconcile always runs
 *  against exactly one Steam id. */
export async function insertSteamLink(
  accountId: number,
  steamId: string,
): Promise<SteamLinkInsert> {
  try {
    await pool.query('INSERT INTO steam_links (account_id, steam_id) VALUES ($1, $2)', [
      accountId,
      steamId,
    ]);
  } catch (err) {
    if (isUniqueViolation(err)) {
      // TOCTOU: a concurrent request beat the route's pre-checks. Re-read to
      // classify which uniqueness lost the race. The re-read is itself
      // non-atomic, so a same-account relink racing an unlink can misattribute
      // WHICH constraint lost; that is accepted, since both arms are terminal
      // 409s and nothing is written on either.
      const mine = await steamLinkForAccount(accountId);
      return mine ? 'account_linked' : 'steam_taken';
    }
    throw err;
  }
  return 'ok';
}

/** Delete the caller's link. Idempotent: deleting a non-existent row is a no-op. */
export async function deleteSteamLink(accountId: number): Promise<void> {
  await pool.query('DELETE FROM steam_links WHERE account_id = $1', [accountId]);
}
