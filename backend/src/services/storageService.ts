/**
 * Supabase Storage access (replaces S3). The bucket is PRIVATE. Uploads use a signed upload
 * URL + token so the browser writes directly to storage without any long-lived credentials;
 * downloads use short-lived signed URLs. Type/size limits are enforced by the bucket's
 * `allowed_mime_types` and `file_size_limit` (set when creating the bucket). Objects are
 * encrypted at rest by the platform.
 *
 * The service-role key is used here (server-side only) to mint signed URLs and delete objects.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

let client: SupabaseClient | null = null;
function sb(): SupabaseClient {
  if (!env.supabaseUrl || !env.supabaseServiceKey) {
    throw new Error('Supabase Storage is not configured (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)');
  }
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseServiceKey, { auth: { persistSession: false } });
  }
  return client;
}
const bucket = () => sb().storage.from(env.supabaseBucket);

/** A signed upload URL + token the browser uses to write directly to storage (single object). */
export async function presignUpload(path: string): Promise<{ path: string; token: string }> {
  const { data, error } = await bucket().createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? 'Failed to create upload URL');
  return { path: data.path, token: data.token };
}

/** Short-lived signed URL for an admin to view/download one object. */
export async function presignDownload(path: string): Promise<string> {
  const { data, error } = await bucket().createSignedUrl(path, env.storageDownloadTtl);
  if (error || !data) throw new Error(error?.message ?? 'Failed to create download URL');
  return data.signedUrl;
}

/** Permanently delete objects (subject erasure / quarantine cleanup). */
export async function deleteObjects(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await bucket().remove(paths);
  if (error) throw new Error(error.message);
}
