import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/authService';
import { audit } from '../utils/audit';
import { env } from '../config/env';

const REFRESH_COOKIE = 'refresh_token';

/** httpOnly + secure + sameSite=strict: not readable by JS, not sent cross-site (CSRF guard). */
function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/api/admin', // only sent to the admin auth routes
    maxAge: 7 * 24 * 3600 * 1000,
  });
}
function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, { path: '/api/admin' });
}

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  const ctx = { ip: req.ip, userAgent: req.headers['user-agent'] };
  const result = await authService.login(parsed.data.email, parsed.data.password, ctx);

  if (!result) {
    // Same generic message + audit for wrong email vs wrong password (no user enumeration).
    await audit({ action: 'login_failed', req, actorEmail: parsed.data.email });
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  setRefreshCookie(res, result.refreshToken);
  await audit({ action: 'login', req, actor: result.admin.id, actorEmail: result.admin.email });
  res.json({ accessToken: result.accessToken, admin: result.admin });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const raw = req.cookies?.[REFRESH_COOKIE];
  if (!raw) {
    res.status(401).json({ error: 'No refresh token' });
    return;
  }
  const ctx = { ip: req.ip, userAgent: req.headers['user-agent'] };
  const result = await authService.refresh(raw, ctx);
  if (!result) {
    clearRefreshCookie(res);
    res.status(401).json({ error: 'Session expired' });
    return;
  }
  setRefreshCookie(res, result.refreshToken);
  await audit({ action: 'token_refresh', req, actor: result.admin.id, actorEmail: result.admin.email });
  res.json({ accessToken: result.accessToken, admin: result.admin });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const raw = req.cookies?.[REFRESH_COOKIE];
  if (raw) await authService.logout(raw);
  clearRefreshCookie(res);
  await audit({ action: 'logout', req });
  res.json({ ok: true });
}

/** Returns the current admin from the access token (requireAuth populates req.admin). */
export function me(req: Request, res: Response): void {
  res.json({ admin: req.admin });
}
