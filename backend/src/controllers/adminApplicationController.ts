import { Request, Response } from 'express';
import { z } from 'zod';
import * as adminService from '../services/adminApplicationService';
import { buildApplicationPdf } from '../services/pdfService';
import { audit } from '../utils/audit';
import { ApplicationStatus } from '../models/Application';

const STATUSES = [
  'draft', 'submitted', 'pending', 'need_more_documents',
  'hold', 'approved', 'rejected', 'cancelled',
] as const;

const listQuerySchema = z.object({
  status: z.enum(STATUSES).optional(),
  city: z.string().optional(),
  employmentStatus: z.string().optional(),
  incomeBand: z.enum(['lt_100k', '100k_500k', '500k_1m', '1m_2m', 'gt_2m', 'unknown']).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export async function list(req: Request, res: Response): Promise<void> {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid filters', issues: parsed.error.issues });
    return;
  }
  const result = await adminService.listApplications(parsed.data);
  res.json(result);
}

export async function dashboard(_req: Request, res: Response): Promise<void> {
  res.json(await adminService.getDashboardStats());
}

export async function detail(req: Request, res: Response): Promise<void> {
  const result = await adminService.getApplicationDetail(req.params.id);
  if (!result) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  // Viewing decrypts PII — this access is always audited.
  await audit({
    action: 'application_view',
    req,
    targetType: 'Application',
    targetId: req.params.id,
  });
  const { meta, data } = result;
  res.json({
    id: String(meta._id),
    appId: meta.appId,
    status: meta.status,
    submittedAt: meta.submittedAt,
    createdAt: meta.createdAt,
    consent: meta.consent,
    statusHistory: meta.statusHistory,
    notes: meta.notes,
    data, // decrypted form
  });
}

const statusSchema = z.object({
  status: z.enum(STATUSES),
  note: z.string().max(2000).optional(),
});

export async function changeStatus(req: Request, res: Response): Promise<void> {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }
  const actor = { adminId: req.admin!.id, adminEmail: req.admin!.email };
  const doc = await adminService.updateStatus(
    req.params.id,
    parsed.data.status as ApplicationStatus,
    parsed.data.note ?? null,
    actor
  );
  if (!doc) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  await audit({
    action: 'application_status_change',
    req,
    targetType: 'Application',
    targetId: req.params.id,
    meta: { to: parsed.data.status },
  });
  res.json({ ok: true, status: doc.status });
}

const noteSchema = z.object({ text: z.string().min(1).max(2000) });

export async function addNote(req: Request, res: Response): Promise<void> {
  const parsed = noteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Note text is required' });
    return;
  }
  const actor = { adminId: req.admin!.id, adminEmail: req.admin!.email };
  const ok = await adminService.addNote(req.params.id, parsed.data.text, actor);
  if (!ok) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  res.json({ ok: true });
}

export async function exportPdf(req: Request, res: Response): Promise<void> {
  const result = await adminService.getApplicationDetail(req.params.id);
  if (!result) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  await audit({ action: 'export', req, targetType: 'Application', targetId: req.params.id, meta: { format: 'pdf' } });
  const { meta, data } = result;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${meta.appId ?? 'application'}.pdf"`);
  buildApplicationPdf(res, {
    appId: meta.appId,
    status: meta.status,
    submittedAt: meta.submittedAt,
    createdAt: meta.createdAt,
    consent: meta.consent,
    data,
  });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const ok = await adminService.deleteApplication(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  await audit({
    action: 'application_delete',
    req,
    targetType: 'Application',
    targetId: req.params.id,
  });
  res.json({ ok: true });
}
