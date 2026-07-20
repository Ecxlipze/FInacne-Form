import crypto from 'crypto';
import { Admin } from '../models/Admin';
import { Session } from '../models/Session';
import { signAccessToken } from '../utils/jwt';
import { env } from '../config/env';

/** Opaque refresh token: random, never a JWT, stored only as a hash. */
function newRefreshToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(48).toString('base64url');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}
function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}
function refreshExpiry(): Date {
  const days = parseInt(env.refreshTokenTtl, 10) || 7; // "7d" -> 7
  return new Date(Date.now() + days * 24 * 3600 * 1000);
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  admin: { id: string; email: string; name: string; role: string };
}

/** Returns null on bad credentials (caller decides how to respond + audit). */
export async function login(
  email: string,
  password: string,
  ctx: { ip?: string; userAgent?: string }
): Promise<AuthResult | null> {
  const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true }).select('+passwordHash');
  if (!admin) return null;
  if (!(await admin.verifyPassword(password))) return null;

  const { raw, hash } = newRefreshToken();
  await Session.create({
    admin: admin._id,
    tokenHash: hash,
    ip: ctx.ip ?? null,
    userAgent: ctx.userAgent ?? null,
    expiresAt: refreshExpiry(),
  });

  return {
    accessToken: signAccessToken({ sub: String(admin._id), email: admin.email, role: admin.role }),
    refreshToken: raw,
    admin: { id: String(admin._id), email: admin.email, name: admin.name, role: admin.role },
  };
}

/** Rotate: validate the presented refresh token, delete it, issue a fresh pair. */
export async function refresh(
  rawToken: string,
  ctx: { ip?: string; userAgent?: string }
): Promise<AuthResult | null> {
  const session = await Session.findOne({ tokenHash: hashToken(rawToken) });
  if (!session) return null; // unknown or already-rotated token
  if (session.expiresAt < new Date()) {
    await session.deleteOne();
    return null;
  }
  const admin = await Admin.findById(session.admin);
  if (!admin || !admin.isActive) {
    await session.deleteOne();
    return null;
  }

  // Rotation: destroy the used token, mint a new one.
  await session.deleteOne();
  const { raw, hash } = newRefreshToken();
  await Session.create({
    admin: admin._id,
    tokenHash: hash,
    ip: ctx.ip ?? null,
    userAgent: ctx.userAgent ?? null,
    expiresAt: refreshExpiry(),
  });

  return {
    accessToken: signAccessToken({ sub: String(admin._id), email: admin.email, role: admin.role }),
    refreshToken: raw,
    admin: { id: String(admin._id), email: admin.email, name: admin.name, role: admin.role },
  };
}

export async function logout(rawToken: string): Promise<void> {
  await Session.deleteOne({ tokenHash: hashToken(rawToken) });
}
