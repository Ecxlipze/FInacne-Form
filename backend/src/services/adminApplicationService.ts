import { Application, ApplicationDoc, ApplicationStatus, IncomeBand } from '../models/Application';
import { blindIndex } from '../utils/crypto';
import { getDecryptedApplication, ApplicationFormData } from './applicationService';
import { deleteForApplication } from './uploadService';
import { normalizeCnic, normalizePhone } from '@finportal/shared';

/** Fields safe to return in a list — NO decryption, only cleartext/masked metadata. */
const LIST_FIELDS =
  'appId status city employmentStatus incomeBand maskedName cnicLast4 submittedAt createdAt';

export interface ListFilters {
  status?: ApplicationStatus;
  city?: string;
  employmentStatus?: string;
  incomeBand?: IncomeBand;
  from?: Date;
  to?: Date;
  q?: string;
  page?: number;
  limit?: number;
}

export interface ListItem {
  _id: unknown;
  appId?: string;
  status: ApplicationStatus;
  city: string | null;
  employmentStatus: string | null;
  incomeBand: IncomeBand;
  maskedName: string | null;
  cnicLast4: string | null;
  submittedAt: Date | null;
  createdAt: Date;
}

export interface ListResult {
  items: ListItem[];
  total: number;
  page: number;
  limit: number;
}

/**
 * List applications for the dashboard. Filters and search run ONLY against cleartext metadata
 * and blind indexes — no record is decrypted to build a list. Drafts are hidden unless explicitly
 * requested via the status filter.
 */
export async function listApplications(f: ListFilters): Promise<ListResult> {
  const page = Math.max(f.page ?? 1, 1);
  const limit = Math.min(Math.max(f.limit ?? 20, 1), 100);

  const query: Record<string, unknown> = {};
  query.status = f.status ?? { $ne: 'draft' };
  if (f.city) query.city = f.city;
  if (f.employmentStatus) query.employmentStatus = f.employmentStatus;
  if (f.incomeBand) query.incomeBand = f.incomeBand;
  if (f.from || f.to) {
    query.createdAt = {
      ...(f.from ? { $gte: f.from } : {}),
      ...(f.to ? { $lte: f.to } : {}),
    };
  }

  // Search: appId is cleartext; CNIC/phone/email are matched via their blind indexes.
  if (f.q?.trim()) {
    const q = f.q.trim();
    const or: Record<string, unknown>[] = [{ appId: q.toUpperCase() }];
    try { or.push({ cnicIndex: blindIndex(normalizeCnic(q)) }); } catch { /* not a CNIC */ }
    try { or.push({ phoneIndex: blindIndex(normalizePhone(q)) }); } catch { /* not a phone */ }
    if (/^\S+@\S+\.\S+$/.test(q)) or.push({ emailIndex: blindIndex(q) });
    query.$or = or;
    // Name is intentionally NOT searchable server-side — it is encrypted, not indexed.
  }

  const [items, total] = await Promise.all([
    Application.find(query)
      .select(LIST_FIELDS)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ListItem[]>(),
    Application.countDocuments(query),
  ]);

  return { items, total, page, limit };
}

/** Dashboard cards: totals, per-status breakdown, today, this month. */
export async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [byStatus, today, thisMonth, total] = await Promise.all([
    Application.aggregate([
      { $match: { status: { $ne: 'draft' } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Application.countDocuments({ status: { $ne: 'draft' }, submittedAt: { $gte: startOfDay } }),
    Application.countDocuments({ status: { $ne: 'draft' }, submittedAt: { $gte: startOfMonth } }),
    Application.countDocuments({ status: { $ne: 'draft' } }),
  ]);

  const statusCounts: Record<string, number> = {};
  for (const row of byStatus) statusCounts[row._id] = row.count;

  return { total, today, thisMonth, byStatus: statusCounts };
}

/** Decrypt a single application for detail view. Caller audits the access. */
export async function getApplicationDetail(
  id: string
): Promise<{ meta: ApplicationDoc; data: ApplicationFormData } | null> {
  return getDecryptedApplication(id);
}

interface ActorCtx {
  adminId: string;
  adminEmail: string;
}

/** Change status, recording an entry in the internal review trail. */
export async function updateStatus(
  id: string,
  status: ApplicationStatus,
  note: string | null,
  actor: ActorCtx
): Promise<ApplicationDoc | null> {
  const doc = await Application.findById(id);
  if (!doc) return null;
  const from = doc.status;
  doc.status = status;
  doc.statusHistory.push({
    from,
    to: status,
    by: actor.adminId,
    byEmail: actor.adminEmail,
    note: note ?? null,
    at: new Date(),
  });
  if (note) doc.notes.push({ by: actor.adminId, byEmail: actor.adminEmail, text: note, at: new Date() });
  await doc.save();
  return doc;
}

/** Add an internal note without changing status. */
export async function addNote(id: string, text: string, actor: ActorCtx): Promise<boolean> {
  const res = await Application.updateOne(
    { _id: id },
    { $push: { notes: { by: actor.adminId, byEmail: actor.adminEmail, text, at: new Date() } } }
  );
  return res.matchedCount > 0;
}

/** Subject erasure — permanent delete of the record and all associated documents. */
export async function deleteApplication(id: string): Promise<boolean> {
  await deleteForApplication(id); // remove storage objects + upload metadata first
  const res = await Application.findByIdAndDelete(id);
  return !!res;
}
