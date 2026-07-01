import { beforeEach, describe, expect, it, vi } from 'vitest';

// Guards that ensureSchema() actually APPLIES every schema module, not just the
// core one. The Discord integration wiring regressed once (DISCORD_SCHEMA was
// defined but never run, so its tables were never created at boot and every
// Discord query would throw "relation does not exist"); this pins it. Mock pg so
// ensureSchema runs against a recording client with no live database.
const h = vi.hoisted(() => {
  process.env.DATABASE_URL ??= 'postgres://test/test';
  const calls: string[] = [];
  const query = vi.fn((sql: string) => {
    calls.push(String(sql));
    return Promise.resolve({ rows: [], rowCount: 0 });
  });
  return { calls, query, connect: vi.fn(() => Promise.resolve({ query, release: vi.fn() })) };
});
vi.mock('pg', () => ({
  Pool: vi.fn(function Pool() {
    return { query: h.query, connect: h.connect };
  }),
}));

import { ensureSchema } from '../server/db';

describe('ensureSchema wires every schema module at boot', () => {
  beforeEach(() => {
    h.calls.length = 0;
  });

  it('applies the Discord schema so its tables exist before the feature is enabled', async () => {
    await ensureSchema();
    const applied = h.calls.join('\n');
    // The whole Discord integration depends on all six tables being created at boot:
    // the five the Phase 16 route surface reads (discord_links, discord_oauth_states,
    // reward_points, reward_ledger, swag_claims) plus the discord_pending_logins
    // chooser table (PR #1075).
    expect(applied).toContain('CREATE TABLE IF NOT EXISTS discord_links');
    expect(applied).toContain('CREATE TABLE IF NOT EXISTS discord_oauth_states');
    expect(applied).toContain('CREATE TABLE IF NOT EXISTS discord_pending_logins');
    expect(applied).toContain('CREATE TABLE IF NOT EXISTS reward_points');
    expect(applied).toContain('CREATE TABLE IF NOT EXISTS reward_ledger');
    expect(applied).toContain('CREATE TABLE IF NOT EXISTS swag_claims');
  });

  it('applies the Discord schema idempotently (a second boot is a no-op: only guarded DDL)', async () => {
    // Phase 16 migrates the Discord routes onto the pipeline and relies on the schema
    // being wired (it was, since PR #1075). This pins that re-running ensureSchema (every
    // boot re-applies it under the advisory lock) is safe: the whole boot is deterministic
    // and the Discord DDL is entirely IF NOT EXISTS / ADD COLUMN IF NOT EXISTS, so a
    // second boot against a live database changes nothing.
    await ensureSchema();
    const firstBoot = h.calls.slice();
    h.calls.length = 0;
    await ensureSchema();
    const secondBoot = h.calls.slice();
    // Deterministic re-run against the recording client: the second boot issues the
    // identical statements (this pins HARNESS determinism, not real-DB idempotency;
    // against a live database the second boot would legitimately differ where a seed
    // already exists). The REAL no-op-on-re-run guarantee for the Discord schema is the
    // IF-NOT-EXISTS / ADD-COLUMN-IF-NOT-EXISTS guard block below.
    expect(secondBoot).toEqual(firstBoot);
    // The Discord DDL is applied as one multi-statement query. Every table/index/column
    // op must be guarded so a re-run is a no-op, and there must be no destructive op.
    const discordDdl = secondBoot.find((sql) =>
      sql.includes('CREATE TABLE IF NOT EXISTS discord_links'),
    );
    expect(discordDdl).toBeDefined();
    if (discordDdl) {
      expect(discordDdl).not.toMatch(/CREATE TABLE (?!IF NOT EXISTS)/);
      expect(discordDdl).not.toMatch(/CREATE (?:UNIQUE )?INDEX (?!IF NOT EXISTS)/);
      expect(discordDdl).not.toMatch(/ADD COLUMN (?!IF NOT EXISTS)/);
      expect(discordDdl).not.toMatch(/\b(?:DROP|TRUNCATE|ALTER COLUMN)\b/);
    }
  });

  it('still applies the core schema (accounts) under the advisory lock', async () => {
    await ensureSchema();
    const applied = h.calls.join('\n');
    expect(applied).toContain('pg_advisory_xact_lock');
    expect(applied).toContain('CREATE TABLE IF NOT EXISTS accounts');
    // password_set is the column the unlink guard reads; it must be added at boot.
    expect(applied).toContain('password_set');
  });
});
