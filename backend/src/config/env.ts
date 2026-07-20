/**
 * Centralized, validated environment loading.
 * Fail fast at boot rather than crashing mid-request when a secret is missing.
 */
import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === '') throw new Error(`Missing required env var: ${name}`);
  return v;
}

function assertBase32Bytes(name: string, v: string): string {
  if (Buffer.from(v, 'base64').length !== 32) {
    throw new Error(`${name} must decode to 32 bytes. Generate with: openssl rand -base64 32`);
  }
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),

  mongoUri: required('MONGO_URI'),

  // Sensitive-data keys (see utils/crypto.ts). Load from KMS/secrets manager in prod.
  fieldEncryptionKey: assertBase32Bytes('FIELD_ENCRYPTION_KEY', required('FIELD_ENCRYPTION_KEY')),
  blindIndexKey: assertBase32Bytes('BLIND_INDEX_KEY', required('BLIND_INDEX_KEY')),

  // Admin auth
  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL ?? '7d',

  // Applicant magic-link resume tokens
  resumeTokenSecret: required('RESUME_TOKEN_SECRET'),
  resumeTokenTtlHours: Number(process.env.RESUME_TOKEN_TTL_HOURS ?? 72),

  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
} as const;

// Validate everything eagerly so misconfig surfaces on startup.
export function validateEnv(): void {
  void env.mongoUri;
  void env.fieldEncryptionKey;
  void env.blindIndexKey;
  void env.jwtAccessSecret;
  void env.jwtRefreshSecret;
  void env.resumeTokenSecret;
}
