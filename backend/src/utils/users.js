import { supabaseAdmin } from './supabase.js';

/**
 * Look up a user by ID from either the users (GitHub) or google_users table.
 * Returns the user record plus a `table` field indicating which table it came from.
 */
export async function getUserById(userId) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  // Try users table first (GitHub)
  const { data: githubUser, error: ghError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (githubUser) {
    return { ...githubUser, table: 'users' };
  }

  if (ghError && ghError.code !== 'PGRST116') {
    throw ghError;
  }

  // Try google_users table
  const { data: googleUser, error: gError } = await supabaseAdmin
    .from('google_users')
    .select('*')
    .eq('id', userId)
    .single();

  if (googleUser) {
    return { ...googleUser, table: 'google_users' };
  }

  if (gError && gError.code !== 'PGRST116') {
    throw gError;
  }

  return null;
}

/**
 * Update a user by ID in the correct table.
 */
export async function updateUserById(userId, updates) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const table = user.table;
  const { data, error } = await supabaseAdmin
    .from(table)
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
