/**
 * Application document.
 *
 * Storage strategy (the core privacy design):
 *   - `encryptedData`  : the full 13-section form payload, AES-256-GCM encrypted as one blob.
 *                        Only ever decrypted server-side when an authorized admin opens a record.
 *   - `cnicIndex`      : blind index of CNIC. Unique. Used for duplicate detection + lookup.
 *   - `ibanIndex`      : blind index of IBAN (optional dedup). Not unique by default.
 *   - Cleartext metadata (status, city, employmentStatus, incomeBand, timestamps, appId):
 *                        low-sensitivity fields kept in the clear ONLY so the admin dashboard
 *                        can filter/sort without decrypting every record. Note: exact income is
 *                        inside encryptedData; only the coarse *band* is cleartext for filtering.
 *
 * Nothing sensitive is queryable in plaintext. The dashboard filters operate purely on the
 * cleartext metadata; opening a single application is what triggers decryption.
 */
import { Schema, model, Document } from 'mongoose';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'pending'
  | 'need_more_documents'
  | 'hold'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type IncomeBand = 'lt_100k' | '100k_500k' | '500k_1m' | '1m_2m' | 'gt_2m' | 'unknown';

export interface ApplicationDoc extends Document {
  appId: string; // e.g. APP-20260720-000001 (assigned on submit)
  status: ApplicationStatus;

  // --- Encrypted payload ---
  encryptedData: string | null; // whole form, encrypted

  // --- Blind indexes (deterministic, one-way) ---
  cnicIndex: string; // required; unique
  ibanIndex: string | null;

  // --- Cleartext filterable metadata (low sensitivity) ---
  city: string | null;
  employmentStatus: string | null;
  incomeBand: IncomeBand;

  // --- Consent + lifecycle ---
  consent: {
    privacyNoticeVersion: string;
    acceptedAt: Date;
    ip: string | null;
  } | null;
  submittedAt: Date | null;
  purgeAfter: Date | null; // retention job deletes records past this date

  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<ApplicationDoc>(
  {
    appId: { type: String, index: true, sparse: true, unique: true },
    status: {
      type: String,
      required: true,
      default: 'draft',
      enum: [
        'draft', 'submitted', 'pending', 'need_more_documents',
        'hold', 'approved', 'rejected', 'cancelled',
      ],
      index: true,
    },

    encryptedData: { type: String, default: null },

    cnicIndex: { type: String, required: true, unique: true, index: true },
    ibanIndex: { type: String, default: null, index: true },

    city: { type: String, default: null, index: true },
    employmentStatus: { type: String, default: null, index: true },
    incomeBand: {
      type: String,
      default: 'unknown',
      enum: ['lt_100k', '100k_500k', '500k_1m', '1m_2m', 'gt_2m', 'unknown'],
      index: true,
    },

    consent: {
      type: new Schema(
        {
          privacyNoticeVersion: { type: String, required: true },
          acceptedAt: { type: Date, required: true },
          ip: { type: String, default: null },
        },
        { _id: false }
      ),
      default: null,
    },
    submittedAt: { type: Date, default: null, index: true },
    purgeAfter: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

// Compound index matching the most common dashboard query: filter by status, sort by newest.
ApplicationSchema.index({ status: 1, createdAt: -1 });

export const Application = model<ApplicationDoc>('Application', ApplicationSchema);
