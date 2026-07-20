import { env } from '../config/env';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Verify a Turnstile token server-side. Returns true if valid.
 * In development with no TURNSTILE_SECRET set, verification is skipped (returns true) with a
 * warning so local work isn't blocked — production MUST set the secret.
 */
export async function verifyCaptcha(token: string | undefined, ip?: string): Promise<boolean> {
  if (!env.turnstileSecret) {
    if (env.nodeEnv === 'production') return false; // never skip in prod
    // eslint-disable-next-line no-console
    console.warn('[captcha] TURNSTILE_SECRET not set — skipping verification (dev only)');
    return true;
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret: env.turnstileSecret, response: token });
  if (ip) body.append('remoteip', ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[captcha] verification request failed', (err as Error).message);
    return false;
  }
}
