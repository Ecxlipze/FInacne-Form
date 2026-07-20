import { Request, Response } from 'express';
import { z } from 'zod';
import { STEP_ORDER, ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from '@finportal/shared';
import * as appService from '../services/applicationService';
import { verifyCaptcha } from '../services/captchaService';
import { audit } from '../utils/audit';
import { env } from '../config/env';

/** Public form metadata so the frontend can render the wizard without hardcoding it. */
export function formConfig(_req: Request, res: Response): void {
  res.json({
    steps: STEP_ORDER,
    privacyNoticeVersion: env.privacyNoticeVersion,
    upload: { allowedTypes: ALLOWED_UPLOAD_TYPES, maxBytes: MAX_UPLOAD_BYTES },
  });
}

/** Autosave. Validation/normalization happens inside the service via the shared schema. */
export async function save(req: Request, res: Response): Promise<void> {
  try {
    const doc = await appService.saveDraft(req.body);
    res.json({ id: String(doc._id), updatedAt: doc.updatedAt });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', issues: err.issues });
      return;
    }
    res.status(400).json({ error: (err as Error).message });
  }
}

const resumeLinkSchema = z.object({ applicationId: z.string().min(1) });

export async function sendResumeLink(req: Request, res: Response): Promise<void> {
  const parsed = resumeLinkSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'applicationId is required' });
    return;
  }
  const result = await appService.issueResumeLink(parsed.data.applicationId);
  if (!result) {
    res.status(404).json({ error: 'Draft not found' });
    return;
  }
  // TODO Phase 19: email the link instead of returning the token.
  // In production, respond only { ok: true } and deliver the URL by email.
  const payload =
    env.nodeEnv === 'production'
      ? { ok: true }
      : { ok: true, token: result.token, expiresAt: result.expiresAt };
  res.json(payload);
}

const resumeSchema = z.object({ token: z.string().min(1) });

export async function resume(req: Request, res: Response): Promise<void> {
  const parsed = resumeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'token is required' });
    return;
  }
  const result = await appService.resumeDraft(parsed.data.token);
  if (!result) {
    res.status(401).json({ error: 'Invalid or expired resume link' });
    return;
  }
  res.json({ id: result.id, data: result.data });
}

const submitSchema = z.object({
  application: z.unknown(),
  captchaToken: z.string().optional(),
});

export async function submit(req: Request, res: Response): Promise<void> {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Malformed submission' });
    return;
  }

  if (!(await verifyCaptcha(parsed.data.captchaToken, req.ip))) {
    res.status(400).json({ error: 'CAPTCHA verification failed' });
    return;
  }

  const result = await appService.submitApplication(parsed.data.application, { ip: req.ip });
  if (!result.ok) {
    if (result.reason === 'duplicate') {
      res.status(409).json({ error: 'An application with this CNIC has already been submitted' });
      return;
    }
    res.status(400).json({ error: 'Please complete all required fields correctly' });
    return;
  }

  await audit({ action: 'application_submit', req, targetType: 'Application', targetId: result.id });
  res.status(201).json({ ok: true, applicationId: result.appId });
}
