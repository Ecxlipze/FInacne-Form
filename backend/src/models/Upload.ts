import { Schema, model, Document, Types } from 'mongoose';

export type DocType =
  | 'cnic' | 'income_proof' | 'certificate' | 'student_card' | 'utility_bill' | 'additional';

/** Files are never trusted until scanned. Admins can only download 'clean' objects. */
export type ScanStatus = 'pending' | 'clean' | 'quarantined';

export interface UploadDoc extends Document {
  application: Types.ObjectId;
  docType: DocType;
  s3Key: string; // object key in the private bucket
  originalName: string; // for display only; the stored key is randomized
  contentType: string;
  sizeBytes: number | null; // filled in by the scan callback (client-reported size isn't trusted)
  scanStatus: ScanStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UploadSchema = new Schema<UploadDoc>(
  {
    application: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    docType: {
      type: String,
      required: true,
      enum: ['cnic', 'income_proof', 'certificate', 'student_card', 'utility_bill', 'additional'],
    },
    s3Key: { type: String, required: true, unique: true, index: true },
    originalName: { type: String, required: true },
    contentType: { type: String, required: true },
    sizeBytes: { type: Number, default: null },
    scanStatus: { type: String, enum: ['pending', 'clean', 'quarantined'], default: 'pending', index: true },
  },
  { timestamps: true }
);

export const Upload = model<UploadDoc>('Upload', UploadSchema);
