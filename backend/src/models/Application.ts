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

  // --- Blind indexes (deterministic, one-way) — enable search/dedup without plaintext ---
  cnicIndex: string; // required; unique
  ibanIndex: string | null;
  emailIndex: string | null;
  phoneIndex: string | null;

  // --- Cleartext filterable metadata (low sensitivity) ---
  city: string | null;
  employmentStatus: string | null;
  incomeBand: IncomeBand;

  // --- Masked list-display fields (low sensitivity) so the admin table needs no decryption ---
  maskedName: string | null; // "A** K***"
  cnicLast4: string | null; // last 4 digits only

  // --- Admin review trail (internal) ---
  statusHistory: Array<{
    from: ApplicationStatus | null;
    to: ApplicationStatus;
    by: string | null;
    byEmail: string | null;
    note: string | null;
    at: Date;
  }>;
  notes: Array<{ by: string | null; byEmail: string | null; text: string; at: Date }>;

  // --- Applicant resume (magic link) ---
  activeResumeNonce: string | null; // the only nonce that will validate a resume token

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
    emailIndex: { type: String, default: null, index: true },
    phoneIndex: { type: String, default: null, index: true },

    activeResumeNonce: { type: String, default: null },

    city: { type: String, default: null, index: true },
    employmentStatus: { type: String, default: null, index: true },
    incomeBand: {
      type: String,
      default: 'unknown',
      enum: ['lt_100k', '100k_500k', '500k_1m', '1m_2m', 'gt_2m', 'unknown'],
      index: true,
    },

    maskedName: { type: String, default: null },
    cnicLast4: { type: String, default: null },

    statusHistory: {
      type: [
        new Schema(
          {
            from: { type: String, default: null },
            to: { type: String, required: true },
            by: { type: String, default: null },
            byEmail: { type: String, default: null },
            note: { type: String, default: null },
            at: { type: Date, required: true },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    notes: {
      type: [
        new Schema(
          {
            by: { type: String, default: null },
            byEmail: { type: String, default: null },
            text: { type: String, required: true },
            at: { type: Date, required: true },
          },
          { _id: false }
        ),
      ],
      default: [],
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
