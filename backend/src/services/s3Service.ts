/**
 * S3 access. The bucket is PRIVATE — nothing is ever public. Browser uploads use a presigned
 * POST *policy* (not a plain PUT) so the bucket itself enforces content-type and a size ceiling;
 * a stolen URL can't be used to upload something oversized or of the wrong type. Downloads use
 * short-lived presigned GET urls. Credentials come from the IAM role / standard AWS env chain.
 */
import { S3Client, DeleteObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import { env } from '../config/env';
import { MAX_UPLOAD_BYTES } from '@finportal/shared';

let client: S3Client | null = null;
function s3(): S3Client {
  if (!env.awsRegion || !env.s3Bucket) {
    throw new Error('S3 is not configured (set AWS_REGION and S3_BUCKET)');
  }
  if (!client) client = new S3Client({ region: env.awsRegion });
  return client;
}

/** Presigned POST for a direct-to-S3 upload, with server-enforced type + size constraints. */
export async function presignUpload(key: string, contentType: string): Promise<PresignedPost> {
  return createPresignedPost(s3(), {
    Bucket: env.s3Bucket,
    Key: key,
    Conditions: [
      ['content-length-range', 1, MAX_UPLOAD_BYTES],
      ['eq', '$Content-Type', contentType],
      ['eq', '$x-amz-server-side-encryption', 'AES256'],
    ],
    Fields: {
      'Content-Type': contentType,
      'x-amz-server-side-encryption': 'AES256', // encrypt at rest
    },
    Expires: env.s3UploadUrlTtl,
  });
}

/** Short-lived GET url for an admin to view/download one object. */
export async function presignDownload(key: string): Promise<string> {
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: env.s3Bucket, Key: key }), {
    expiresIn: env.s3DownloadUrlTtl,
  });
}

/** Permanently delete objects (used for subject erasure / quarantine cleanup). */
export async function deleteObjects(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  await s3().send(
    new DeleteObjectsCommand({
      Bucket: env.s3Bucket,
      Delete: { Objects: keys.map((Key) => ({ Key })) },
    })
  );
}
