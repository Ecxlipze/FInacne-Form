/**
 * Applicant "resume later" via magic link — no applicant accounts, no stored credentials.
 *
 * Token format (base64url): <applicationId>.<expiryEpochSeconds>.<nonce>.<hmac>
 *   hmac = HMAC-SHA256(applicationId + expiry + nonce, RESUME_TOKEN_SECRET)
 *
 * Security properties:
 *   - Signed: the payload cannot be forged without the secret.
 *   - Expiring: expiry is checked on verify.
 *   - Single-use: the nonce is stored on the Application; verify rejects any nonce that
 *     doesn't match the currently-active one. Issuing a new link rotates the nonce,
 *     invalidating the previous link. (Wire `activeResumeNonce` into the model in Phase 9.)
 */
import crypto from 'crypto';
import { env } from '../config/env';

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}
function sign(payload: string): string {
  return b64url(crypto.createHmac('sha256', env.resumeTokenSecret).update(payload).digest());
}

export interface ResumeToken {
  token: string;
  nonce: string; // persist this as the application's activeResumeNonce
  expiresAt: Date;
}

export function issueResumeToken(applicationId: string): ResumeToken {
  const expiry = Math.floor(Date.now() / 1000) + env.resumeTokenTtlHours * 3600;
  const nonce = b64url(crypto.randomBytes(16));
  const payload = `${applicationId}.${expiry}.${nonce}`;
  const token = b64url(Buffer.from(`${payload}.${sign(payload)}`, 'utf8'));
  return { token, nonce, expiresAt: new Date(expiry * 1000) };
}

/**
 * Verify signature + expiry. Returns { applicationId, nonce }; caller MUST then confirm
 * the nonce equals the application's stored activeResumeNonce (single-use enforcement).
 */
export function verifyResumeToken(token: string): { applicationId: string; nonce: string } {
  const decoded = fromB64url(token).toString('utf8');
  const parts = decoded.split('.');
  if (parts.length !== 4) throw new Error('Malformed resume token');
  const [applicationId, expiryStr, nonce, mac] = parts;

  const expected = sign(`${applicationId}.${expiryStr}.${nonce}`);
  // Constant-time comparison to avoid signature-timing leaks.
  if (
    mac.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))
  ) {
    throw new Error('Invalid resume token signature');
  }
  if (Number(expiryStr) * 1000 < Date.now()) throw new Error('Resume token expired');

  return { applicationId, nonce };
}
