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

  // CAPTCHA (Cloudflare Turnstile). If unset in dev, verification is skipped with a warning.
  turnstileSecret: process.env.TURNSTILE_SECRET ?? '',

  // Abandoned drafts are purged after this many days (retention policy, Phase 4/22).
  draftRetentionDays: Number(process.env.DRAFT_RETENTION_DAYS ?? 30),

  // Current privacy-notice version the applicant consents to.
  privacyNoticeVersion: process.env.PRIVACY_NOTICE_VERSION ?? '2026-01',

  // --- S3 (optional in dev; required to actually upload). Credentials come from IAM role / env. ---
  awsRegion: process.env.AWS_REGION ?? '',
  s3Bucket: process.env.S3_BUCKET ?? '',
  s3UploadUrlTtl: Number(process.env.S3_UPLOAD_URL_TTL_SECONDS ?? 300),
  s3DownloadUrlTtl: Number(process.env.S3_DOWNLOAD_URL_TTL_SECONDS ?? 120),

  // Shared secret the virus-scanner uses to authenticate its callback.
  scanCallbackSecret: process.env.SCAN_CALLBACK_SECRET ?? '',

  // Run the retention purge inside the app process (dev/small deploys). Prefer external cron in prod.
  enablePurgeCron: process.env.ENABLE_PURGE_CRON === 'true',

  // Public base URL of the frontend, used to build resume links in emails.
  appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000',

  // Email (SMTP). If unset, emails are logged to the console instead of sent (dev).
  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  emailFrom: process.env.EMAIL_FROM ?? 'no-reply@finportal.example',

  // Optional path to a logo image embedded in exported PDFs (falls back to a text header).
  companyLogoPath: process.env.COMPANY_LOGO_PATH ?? '',
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
