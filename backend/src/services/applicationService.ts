/**
 * The only place that touches plaintext PII. Controllers call these functions and never
 * see raw encrypted blobs or handle keys directly. Encryption happens on write, decryption
 * only on explicit authorized read.
 */
import { Application, ApplicationDoc, IncomeBand } from '../models/Application';
import { encryptField, decryptField, blindIndex } from '../utils/crypto';
import { DraftInput, draftSchema, applicationSchema, ApplicationInput, totalMonthlyIncome } from '@finportal/shared';
import { issueResumeToken, verifyResumeToken } from './resumeToken';
import { nextAppId } from './appIdService';
import { env } from '../config/env';

/** The form shape is the single source of truth in @finportal/shared. */
export type ApplicationFormData = DraftInput;

function deriveIncomeBand(monthly?: number): IncomeBand {
  if (monthly === undefined || monthly === null) return 'unknown';
  if (monthly < 100_000) return 'lt_100k';
  if (monthly < 500_000) return '100k_500k';
  if (monthly < 1_000_000) return '500k_1m';
  if (monthly < 2_000_000) return '1m_2m';
  return 'gt_2m';
}

/** Mask a full name for list display: "Ali Khan" -> "A** K***". */
function maskName(name?: string): string | null {
  if (!name) return null;
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] + '*'.repeat(Math.max(w.length - 1, 0)))
    .join(' ');
}

/** Extract the small set of cleartext filter fields + blind indexes from a form payload. */
function projectMetadata(data: ApplicationFormData) {
  const cnic = data.personal?.cnic;
  if (!cnic) throw new Error('CNIC is required to index an application');
  const digits = cnic.replace(/\D/g, '');
  return {
    encryptedData: encryptField(JSON.stringify(data)),
    cnicIndex: blindIndex(cnic)!,
    ibanIndex: blindIndex(data.banking?.iban ?? null),
    emailIndex: blindIndex(data.contact?.email ?? null),
    phoneIndex: blindIndex(data.contact?.phone ?? null),
    city: data.contact?.city ?? null,
    employmentStatus: data.employment?.status ?? null,
    incomeBand: deriveIncomeBand(totalMonthlyIncome(data.income)),
    maskedName: maskName(data.personal?.fullName),
    cnicLast4: digits.length >= 4 ? digits.slice(-4) : null,
  };
}

/** True if a SUBMITTED application already exists for this CNIC (drafts are the same person resuming). */
export async function isDuplicateSubmittedCnic(cnic: string, excludeId?: string): Promise<boolean> {
  const idx = blindIndex(cnic);
  const existing = await Application.findOne({
    cnicIndex: idx,
    status: { $ne: 'draft' },
  })
    .select('_id')
    .lean();
  return !!existing && String(existing._id) !== excludeId;
}

/** Create or update a draft (autosave). Upserts by cnicIndex so "resume" reuses the same record. */
export async function saveDraft(input: unknown): Promise<ApplicationDoc> {
  // Re-validate + normalize on the server regardless of what the client sent.
  const data: ApplicationFormData = draftSchema.parse(input);
  const meta = projectMetadata(data);
  const purgeAfter = new Date(Date.now() + env.draftRetentionDays * 24 * 3600 * 1000);
  return Application.findOneAndUpdate(
    { cnicIndex: meta.cnicIndex },
    { $set: { ...meta, status: 'draft', purgeAfter } },
    { new: true, upsert: true }
  );
}

/**
 * Issue a single-use magic link for the given draft. Rotates the stored nonce, invalidating any
 * previously issued link. In production the returned token is emailed as a URL, not returned here.
 */
export async function issueResumeLink(
  applicationId: string
): Promise<{ token: string; expiresAt: Date } | null> {
  const doc = await Application.findById(applicationId).select('_id status');
  if (!doc || doc.status !== 'draft') return null;
  const { token, nonce, expiresAt } = issueResumeToken(applicationId);
  doc.set('activeResumeNonce', nonce);
  await doc.save();
  return { token, expiresAt };
}

/** Exchange a magic-link token for the draft's decrypted contents. Enforces single-use via nonce. */
export async function resumeDraft(
  token: string
): Promise<{ id: string; data: ApplicationFormData } | null> {
  let applicationId: string;
  let nonce: string;
  try {
    ({ applicationId, nonce } = verifyResumeToken(token)); // throws on bad sig / expiry
  } catch {
    return null;
  }
  const doc = await Application.findById(applicationId);
  if (!doc || doc.status !== 'draft' || doc.activeResumeNonce !== nonce) return null;

  const data: ApplicationFormData = doc.encryptedData
    ? JSON.parse(decryptField(doc.encryptedData)!)
    : {};
  return { id: String(doc._id), data };
}

export type SubmitResult =
  | { ok: true; appId: string; id: string }
  | { ok: false; reason: 'duplicate' | 'invalid' };

/** Final submission: full validation, duplicate check, appId assignment, consent + status. */
export async function submitApplication(
  input: unknown,
  ctx: { ip?: string | null }
): Promise<SubmitResult> {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: 'invalid' };
  const data: ApplicationInput = parsed.data;

  const cnicIdx = blindIndex(data.personal.cnic)!;
  const existingDraft = await Application.findOne({ cnicIndex: cnicIdx }).select('_id');
  const excludeId = existingDraft ? String(existingDraft._id) : undefined;
  if (await isDuplicateSubmittedCnic(data.personal.cnic, excludeId)) {
    return { ok: false, reason: 'duplicate' };
  }

  const appId = await nextAppId();
  const meta = projectMetadata(data);
  const doc = await Application.findOneAndUpdate(
    { cnicIndex: cnicIdx },
    {
      $set: {
        ...meta,
        appId,
        status: 'submitted',
        submittedAt: new Date(),
        activeResumeNonce: null, // resume links no longer valid after submit
        purgeAfter: null, // submitted apps retained per review policy, not the draft window
        consent: {
          privacyNoticeVersion: data.declaration.privacyNoticeVersion,
          acceptedAt: new Date(),
          ip: ctx.ip ?? null,
        },
      },
    },
    { new: true, upsert: true }
  );

  return { ok: true, appId, id: String(doc._id) };
}

/** Decrypt and return the full form for an authorized admin view. */
export async function getDecryptedApplication(
  id: string
): Promise<{ meta: ApplicationDoc; data: ApplicationFormData } | null> {
  const doc = await Application.findById(id);
  if (!doc) return null;
  const data: ApplicationFormData = doc.encryptedData
    ? JSON.parse(decryptField(doc.encryptedData)!)
    : {};
  return { meta: doc, data };
}
