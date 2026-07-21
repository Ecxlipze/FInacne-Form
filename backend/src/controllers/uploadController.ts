import crypto from 'crypto';
import { Request, Response } from 'express';
import { z } from 'zod';
import { ALLOWED_UPLOAD_TYPES } from '@finportal/shared';
import * as uploadService from '../services/uploadService';
import { audit } from '../utils/audit';
import { env } from '../config/env';

const presignSchema = z.object({
  applicationId: z.string().min(1),
  docType: z.enum(['cnic', 'income_proof', 'certificate', 'student_card', 'utility_bill', 'additional']),
  filename: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_UPLOAD_TYPES),
});

/** Applicant requests a signed upload URL; the browser then uploads directly to storage. */
export async function presign(req: Request, res: Response): Promise<void> {
  const parsed = presignSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid upload request', issues: parsed.error.issues });
    return;
  }
  try {
    const result = await uploadService.createUpload(
      parsed.data.applicationId,
      parsed.data.docType,
      parsed.data.filename,
      parsed.data.contentType
    );
    if (!result) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    res.json(result);
  } catch (err) {
    // storage not configured / presign failure
    res.status(503).json({ error: (err as Error).message });
  }
}

const scanSchema = z.object({
  key: z.string().min(1),
  status: z.enum(['clean', 'quarantined']),
  sizeBytes: z.number().int().positive().optional(),
});

/**
 * Called by the virus scanner (triggered by a storage object-created webhook) after upload.
 * Authenticated with a shared secret header, compared in constant time.
 */
export async function scanCallback(req: Request, res: Response): Promise<void> {
  const provided = req.header('x-scan-secret') ?? '';
  const expected = env.scanCallbackSecret;
  const ok =
    !!expected &&
    provided.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  if (!ok) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const parsed = scanSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid scan payload' });
    return;
  }
  const updated = await uploadService.recordScanResult(
    parsed.data.key,
    parsed.data.status,
    parsed.data.sizeBytes
  );
  if (!updated) {
    res.status(404).json({ error: 'Unknown object key' });
    return;
  }
  res.json({ ok: true });
}

// --- Admin-side document access (mounted under /api/admin, behind requireAuth) ---

export async function listDocuments(req: Request, res: Response): Promise<void> {
  const docs = await uploadService.listForApplication(req.params.id);
  res.json({ documents: docs });
}

export async function downloadDocument(req: Request, res: Response): Promise<void> {
  const url = await uploadService.getDownloadUrl(req.params.uploadId);
  if (!url) {
    res.status(404).json({ error: 'Document not available (not found or not yet scanned clean)' });
    return;
  }
  await audit({
    action: 'document_download',
    req,
    targetType: 'Upload',
    targetId: req.params.uploadId,
  });
  res.json({ url }); // short-lived presigned GET
}
