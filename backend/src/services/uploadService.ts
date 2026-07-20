import crypto from 'crypto';
import { Upload, DocType, ScanStatus } from '../models/Upload';
import { Application } from '../models/Application';
import * as s3 from './s3Service';

/** Randomized key so the stored object name reveals nothing and can't collide. */
function makeKey(applicationId: string, docType: DocType, contentType: string): string {
  const ext = contentType === 'application/pdf' ? 'pdf' : contentType.split('/')[1] ?? 'bin';
  return `applications/${applicationId}/${docType}/${crypto.randomUUID()}.${ext}`;
}

export interface PresignResult {
  uploadId: string;
  key: string;
  post: Awaited<ReturnType<typeof s3.presignUpload>>;
}

/** Reserve an upload slot (pending) and return a presigned POST for the browser. */
export async function createUpload(
  applicationId: string,
  docType: DocType,
  originalName: string,
  contentType: string
): Promise<PresignResult | null> {
  const app = await Application.findById(applicationId).select('_id');
  if (!app) return null;

  const key = makeKey(applicationId, docType, contentType);
  const doc = await Upload.create({
    application: app._id,
    docType,
    s3Key: key,
    originalName,
    contentType,
    scanStatus: 'pending',
  });
  const post = await s3.presignUpload(key, contentType);
  return { uploadId: String(doc._id), key, post };
}

/** Called by the scanner after S3 object-created. Flips pending -> clean | quarantined. */
export async function recordScanResult(
  key: string,
  status: Extract<ScanStatus, 'clean' | 'quarantined'>,
  sizeBytes?: number
): Promise<boolean> {
  const res = await Upload.updateOne(
    { s3Key: key },
    { $set: { scanStatus: status, ...(sizeBytes !== undefined ? { sizeBytes } : {}) } }
  );
  // Quarantined objects are removed from the bucket so they can never be served.
  if (status === 'quarantined') {
    await s3.deleteObjects([key]).catch(() => undefined);
  }
  return res.matchedCount > 0;
}

/** List an application's uploads for the admin detail view (metadata only). */
export async function listForApplication(applicationId: string) {
  return Upload.find({ application: applicationId })
    .select('docType originalName contentType sizeBytes scanStatus createdAt')
    .lean();
}

/** Presigned download for a single upload — only if it passed scanning. */
export async function getDownloadUrl(uploadId: string): Promise<string | null> {
  const doc = await Upload.findById(uploadId).select('s3Key scanStatus');
  if (!doc || doc.scanStatus !== 'clean') return null;
  return s3.presignDownload(doc.s3Key);
}

/** Delete all objects + metadata for an application (subject erasure). */
export async function deleteForApplication(applicationId: string): Promise<void> {
  const uploads = await Upload.find({ application: applicationId }).select('s3Key');
  const keys = uploads.map((u) => u.s3Key);
  if (keys.length) await s3.deleteObjects(keys).catch(() => undefined);
  await Upload.deleteMany({ application: applicationId });
}
