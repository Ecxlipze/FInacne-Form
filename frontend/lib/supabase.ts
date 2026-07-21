import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? 'applications';

let client: SupabaseClient | null = null;

/** Created lazily so the app still loads when Supabase isn't configured (only uploads need it). */
export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  }
  if (!client) client = createClient(url, anon);
  return client;
}
