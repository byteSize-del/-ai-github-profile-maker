import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL) {
  console.warn('⚠️  SUPABASE_URL is not defined. Supabase features will be disabled.');
}

if (!SUPABASE_SERVICE_KEY && !SUPABASE_ANON_KEY) {
  console.warn('⚠️  Neither SUPABASE_SERVICE_KEY nor SUPABASE_ANON_KEY is defined.');
}

// Use service key for admin operations, anon key for client operations
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

const supabaseClient = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export { supabaseAdmin, supabaseClient };

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured() {
  return !!(SUPABASE_URL && (SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY));
}
