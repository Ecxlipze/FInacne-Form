/**
 * Field-level encryption + blind indexing for sensitive PII.
 *
 * Two separate keys are used deliberately:
 *   FIELD_ENCRYPTION_KEY  -> AES-256-GCM, randomized per-encryption (secure at rest, NOT searchable)
 *   BLIND_INDEX_KEY       -> HMAC-SHA256, deterministic (searchable / unique-indexable, one-way)
 *
 * Why both: encrypted values are randomized, so you cannot query or dedup on them.
 * The blind index gives you a deterministic, one-way token you CAN unique-index and
 * search on (e.g. duplicate-CNIC detection) without ever storing the plaintext.
 *
 * In production, load these keys from a secrets manager / KMS, not from a .env file.
 */
import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const IV_BYTES = 12; // 96-bit IV is the recommended size for GCM
const VERSION = 'v1';

function getKey(envVar: 'FIELD_ENCRYPTION_KEY' | 'BLIND_INDEX_KEY'): Buffer {
  const raw = process.env[envVar];
  if (!raw) throw new Error(`Missing required key: ${envVar}`);
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error(`${envVar} must decode to 32 bytes. Generate with: openssl rand -base64 32`);
  }
  return key;
}

/** Encrypt a value for storage. Returns a self-describing string: v1:iv:tag:ciphertext (all base64). */
export function encryptField(plaintext: string | null | undefined): string | null {
  if (plaintext === null || plaintext === undefined) return null;
  const key = getKey('FIELD_ENCRYPTION_KEY');
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${VERSION}:${iv.toString('base64')}:${tag.toString('base64')}:${ct.toString('base64')}`;
}

/** Decrypt a value produced by encryptField. Throws if the payload was tampered with (GCM auth). */
export function decryptField(payload: string | null | undefined): string | null {
  if (payload === null || payload === undefined) return null;
  const [version, ivB64, tagB64, ctB64] = payload.split(':');
  if (version !== VERSION) throw new Error(`Unsupported ciphertext version: ${version}`);
  const key = getKey('FIELD_ENCRYPTION_KEY');
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(ctB64, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

/**
 * Deterministic, one-way index for searching/deduping without exposing plaintext.
 * Normalize first so "42101-1234567-8" and "4210112345678" collide (same person).
 */
export function blindIndex(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null;
  const key = getKey('BLIND_INDEX_KEY');
  return crypto.createHmac('sha256', key).update(normalizeForIndex(value)).digest('hex');
}

function normalizeForIndex(value: string): string {
  return String(value).replace(/[\s-]/g, '').toUpperCase();
}
