/**
 * The only place that touches plaintext PII. Controllers call these functions and never
 * see raw encrypted blobs or handle keys directly. Encryption happens on write, decryption
 * only on explicit authorized read.
 */
import { Application, ApplicationDoc, IncomeBand } from '../models/Application';
import { encryptField, decryptField, blindIndex } from '../utils/crypto';
import { DraftInput, draftSchema } from '@finportal/shared';

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

/** Extract the small set of cleartext filter fields + blind indexes from a form payload. */
function projectMetadata(data: ApplicationFormData) {
  const cnic = data.personal?.cnic;
  if (!cnic) throw new Error('CNIC is required to index an application');
  return {
    encryptedData: encryptField(JSON.stringify(data)),
    cnicIndex: blindIndex(cnic)!,
    ibanIndex: blindIndex(data.banking?.iban ?? null),
    city: data.contact?.city ?? null,
    employmentStatus: data.employment?.status ?? null,
    incomeBand: deriveIncomeBand(data.income?.monthly),
  };
}

/** True if another application already exists with this CNIC. */
export async function isDuplicateCnic(cnic: string, excludeId?: string): Promise<boolean> {
  const idx = blindIndex(cnic);
  const existing = await Application.findOne({ cnicIndex: idx }).select('_id').lean();
  return !!existing && String(existing._id) !== excludeId;
}

/** Create or update a draft (autosave). Upserts by cnicIndex so "resume" reuses the same record. */
export async function saveDraft(input: unknown): Promise<ApplicationDoc> {
  // Re-validate + normalize on the server regardless of what the client sent.
  const data: ApplicationFormData = draftSchema.parse(input);
  const meta = projectMetadata(data);
  return Application.findOneAndUpdate(
    { cnicIndex: meta.cnicIndex },
    { $set: { ...meta, status: 'draft' } },
    { new: true, upsert: true }
  );
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
