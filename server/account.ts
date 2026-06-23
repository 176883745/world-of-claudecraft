// Account self-service portal handlers (home-page account portal).
//
// Mirrors server/wallet.ts: each REST route is an exported, account-scoped
// handler with a real http (req, res) signature, so tests/account_server.test.ts
// can drive every branch through the mock-pg harness with no live database and
// no module-private seam. main.ts resolves the bearer account once and then
// delegates here. All four routes are bearer-auth + account-scoped.
import type http from 'node:http';
import { json, readBody } from './http_util';
import { rateLimited, recordAuthFailure, clearAuthFailures } from './ratelimit';
import { hashPassword, verifyPassword, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from './auth';
import {
  accountById,
  characterCountForAccount,
  updatePasswordHash,
  revokeTokensExcept,
  revokeToken,
  setAccountEmail,
  setAccountDeactivated,
  setAccountMarketingOptIn,
  ensureUnsubscribeToken,
  accountByUnsubscribeToken,
  createEmailChangeRequest,
  consumeEmailChangeRequest,
  exportAccountData,
  listCharacters,
} from './db';
import {
  emailAccountCreated,
  emailPasswordChanged,
  emailAccountDeleted,
  emailDataExport,
  emailEmailChangeRequested,
  emailChangeVerifyUrl,
  makeEmailToken,
  hashEmailToken,
} from './email';

const EMAIL_MAX_LENGTH = 254;
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// How long an email-change verification link stays valid.
const EMAIL_CHANGE_TTL_HOURS = 24;

// Hooks main.ts injects so the deactivate path can consult and tear down live
// game sessions without account.ts importing the GameServer (which pulls in the
// browser-free sim + ws stack and is awkward to construct in a unit test).
export interface AccountGameHooks {
  /** True when any of the account's characters is currently in a live session. */
  anyCharacterOnline(characterIds: number[]): boolean;
  /** Close any established socket for the account right after deactivation. */
  disconnectAccount(accountId: number, reason: string): void;
}

// GET /api/account — whoami; re-validates a stored token on reload + feeds the
// portal header. characterCount is account-wide (every realm), matching the
// account-wide nature of this self-service portal.
export async function handleAccountWhoami(
  res: http.ServerResponse,
  accountId: number,
): Promise<void> {
  const acct = await accountById(accountId);
  if (!acct) return json(res, 404, { error: 'account not found' });
  const characterCount = await characterCountForAccount(accountId);
  return json(res, 200, {
    username: acct.username,
    email: acct.email ?? '',
    createdAt: acct.created_at,
    characterCount,
  });
}

// POST /api/account/password — re-verify current, then revoke every OTHER token
// so a password change signs out other devices while keeping this one alive.
// callerToken is resolved by main.ts; it must never be null here (validated up
// the stack) so the revoke below can never accidentally nuke this session.
export async function handleAccountChangePassword(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  accountId: number,
  callerToken: string,
): Promise<void> {
  if (rateLimited(req)) return json(res, 429, { error: 'too many attempts, slow down' });
  const body = await readBody(req);
  const acct = await accountById(accountId);
  if (!acct) return json(res, 404, { error: 'account not found' });
  if (!(await verifyPassword(String(body.current ?? ''), acct.password_hash))) {
    recordAuthFailure(acct.username);
    return json(res, 401, { error: 'current password is incorrect' });
  }
  // Correct password: forgive earlier portal mis-types so a re-verify here never
  // throttles the user's own subsequent login. Mirrors the login success path.
  clearAuthFailures(acct.username);
  const next = body.next;
  if (typeof next !== 'string' || next.length < MIN_PASSWORD_LENGTH) {
    return json(res, 400, { error: `password must be at least ${MIN_PASSWORD_LENGTH} chars` });
  }
  if (next.length > MAX_PASSWORD_LENGTH) {
    return json(res, 400, { error: `password must be at most ${MAX_PASSWORD_LENGTH} chars` });
  }
  await updatePasswordHash(accountId, await hashPassword(next));
  await revokeTokensExcept(accountId, callerToken);
  // Best-effort security notice; never blocks the password change on mail state.
  emailPasswordChanged(acct);
  return json(res, 200, { ok: true });
}

// POST /api/account/logout — revoke this device's bearer token. Unlike the
// other account routes this does not need an active account gate; banned,
// suspended, or deactivated accounts should still be able to sign out locally
// and invalidate the token held by this browser.
export async function handleAccountLogout(
  res: http.ServerResponse,
  callerToken: string,
): Promise<void> {
  await revokeToken(callerToken);
  return json(res, 200, { ok: true });
}

// POST /api/account/email: optional account email; settings-only, lenient. Empty
// clears the stored address. When this sets the FIRST email on an account that
// signed up without one, it fires the welcome mail, so account_created reaches
// every account that ever provides an email, not only those who gave one at
// signup.
export async function handleAccountSetEmail(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  accountId: number,
): Promise<void> {
  const body = await readBody(req);
  const raw = typeof body.email === 'string' ? body.email.trim() : '';
  if (raw.length > EMAIL_MAX_LENGTH || (raw !== '' && !EMAIL_SHAPE.test(raw))) {
    return json(res, 400, { error: 'enter a valid email address' });
  }
  const prior = await accountById(accountId);
  await setAccountEmail(accountId, raw === '' ? null : raw);
  if (raw !== '' && prior && !prior.email) {
    emailAccountCreated({ ...prior, email: raw });
  }
  return json(res, 200, { email: raw });
}

// POST /api/account/deactivate — re-confirm password + username, require all
// characters offline, then lock the account and revoke ALL tokens. The lock is
// reversible by an admin. After locking we deterministically tear down any
// established socket (revoking tokens alone does not close an open WS).
export async function handleAccountDeactivate(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  accountId: number,
  hooks: AccountGameHooks,
): Promise<void> {
  if (rateLimited(req)) return json(res, 429, { error: 'too many attempts, slow down' });
  const body = await readBody(req);
  const acct = await accountById(accountId);
  if (!acct) return json(res, 404, { error: 'account not found' });
  if (String(body.username ?? '') !== acct.username) {
    return json(res, 400, { error: 'username does not match' });
  }
  if (!(await verifyPassword(String(body.password ?? ''), acct.password_hash))) {
    recordAuthFailure(acct.username);
    return json(res, 401, { error: 'password is incorrect' });
  }
  // Correct password: forgive earlier portal mis-types so a re-verify here never
  // throttles the user's own subsequent login. Mirrors the login success path.
  clearAuthFailures(acct.username);
  const chars = await listCharacters(accountId);
  if (hooks.anyCharacterOnline(chars.map((c) => c.id))) {
    return json(res, 409, { error: 'log out all characters before deactivating' });
  }
  await setAccountDeactivated(accountId, true);
  await revokeTokensExcept(accountId, null);
  hooks.disconnectAccount(accountId, 'This account has been deactivated.');
  emailAccountDeleted(acct);
  return json(res, 200, { ok: true });
}

// POST /api/account/email/change: request a verified email change. Re-confirms
// the current password (this swaps the account's recovery address, so it must
// not ride a bare session), then mails a one-time verify link to the NEW address
// and a security notice to the OLD one. The address only changes on verify.
export async function handleAccountEmailChange(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  accountId: number,
): Promise<void> {
  if (rateLimited(req)) return json(res, 429, { error: 'too many attempts, slow down' });
  const body = await readBody(req);
  const acct = await accountById(accountId);
  if (!acct) return json(res, 404, { error: 'account not found' });
  if (!(await verifyPassword(String(body.password ?? ''), acct.password_hash))) {
    recordAuthFailure(acct.username);
    return json(res, 401, { error: 'password is incorrect' });
  }
  clearAuthFailures(acct.username);
  const newEmail = typeof body.newEmail === 'string' ? body.newEmail.trim() : '';
  if (newEmail.length > EMAIL_MAX_LENGTH || !EMAIL_SHAPE.test(newEmail)) {
    return json(res, 400, { error: 'enter a valid email address' });
  }
  if (newEmail.toLowerCase() === (acct.email ?? '').toLowerCase()) {
    return json(res, 400, { error: 'that is already your email address' });
  }
  const { token, tokenHash } = makeEmailToken();
  await createEmailChangeRequest(accountId, newEmail, tokenHash, EMAIL_CHANGE_TTL_HOURS);
  emailEmailChangeRequested(acct, newEmail, emailChangeVerifyUrl(token));
  return json(res, 200, { ok: true });
}

// GET /api/account/email/verify?token=... consume a one-time email-change
// token. Unauthenticated by design: the unguessable token IS the authorization,
// and the consume is race-safe in the DB layer. No token info leaks: invalid and
// expired both return the same 400.
export async function handleAccountEmailVerify(
  res: http.ServerResponse,
  token: string,
): Promise<void> {
  const raw = typeof token === 'string' ? token.trim() : '';
  if (!raw) return json(res, 400, { error: 'invalid or expired link' });
  const applied = await consumeEmailChangeRequest(hashEmailToken(raw));
  if (!applied) return json(res, 400, { error: 'invalid or expired link' });
  return json(res, 200, { ok: true, email: applied.newEmail });
}

// POST /api/account/export: GDPR-style self-service data export. Returns the
// account profile plus every character it owns as a JSON download, and mails a
// confirmation so an export the user did not request is noticed.
export async function handleAccountExport(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  accountId: number,
): Promise<void> {
  if (rateLimited(req)) return json(res, 429, { error: 'too many attempts, slow down' });
  const bundle = await exportAccountData(accountId);
  if (!bundle) return json(res, 404, { error: 'account not found' });
  const acct = await accountById(accountId);
  if (acct) emailDataExport(acct);
  res.writeHead(200, {
    'content-type': 'application/json',
    'content-disposition': 'attachment; filename="woc-account-export.json"',
  });
  return void res.end(JSON.stringify(bundle, null, 2));
}

// POST /api/account/marketing: set the marketing opt-in flag. Opting in mints a
// stable unsubscribe token so every future marketing email can carry a working
// one-click unsubscribe link.
export async function handleAccountMarketing(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  accountId: number,
): Promise<void> {
  if (rateLimited(req)) return json(res, 429, { error: 'too many attempts, slow down' });
  const body = await readBody(req);
  const optIn = body.optIn === true;
  await setAccountMarketingOptIn(accountId, optIn);
  if (optIn) await ensureUnsubscribeToken(accountId, makeEmailToken().token);
  return json(res, 200, { optIn });
}

// GET /api/email/unsubscribe?token=... public one-click marketing unsubscribe.
// Honours the token without a login (mail clients cannot send bearer auth) and
// never reveals whether the token matched, to avoid token probing.
export async function handleEmailUnsubscribe(
  res: http.ServerResponse,
  token: string,
): Promise<void> {
  const raw = typeof token === 'string' ? token.trim() : '';
  if (raw) {
    const accountId = await accountByUnsubscribeToken(raw);
    if (accountId !== null) await setAccountMarketingOptIn(accountId, false);
  }
  return json(res, 200, { ok: true });
}
