import { supabaseAdmin } from '../utils/supabase.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL}/api/auth/callback/google`;

/**
 * Generate a random state token for CSRF protection
 * SECURITY: Prevents CSRF attacks by verifying OAuth request origin
 */
export function generateOAuthState() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate OAuth state token
 * SECURITY: Ensures callback came from our authorization request
 */
export function validateOAuthState(providedState, storedState) {
  if (!providedState || !storedState) {
    throw new Error('Missing state parameter');
  }
  // Use constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(providedState), Buffer.from(storedState))) {
    throw new Error('Invalid state parameter - CSRF detected');
  }
}

/**
 * Get Google OAuth authorization URL
 */
export function getGoogleAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange Google authorization code for access token
 */
export async function exchangeGoogleCode(code) {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials not configured');
  }

  if (!code) {
    throw new Error('Missing authorization code');
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_CALLBACK_URL,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.json();
    throw new Error(error.error_description || 'Failed to exchange Google code');
  }

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    throw new Error(tokenData.error_description || 'Google OAuth error');
  }

  return tokenData;
}

/**
 * Get user info from Google using ID token or access token
 */
export async function getGoogleUserInfo(tokenData) {
  const accessToken = tokenData.access_token;

  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error('Failed to fetch Google user info');
  }

  const userData = await userResponse.json();

  return {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    picture: userData.picture,
    verified_email: userData.verified_email,
  };
}

/**
 * Get or create user in Supabase
 * Uses email as the unique identifier for Google users
 */
export async function getOrCreateSupabaseUser(googleUserData) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  // Look up user by email
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', googleUserData.email)
    .eq('provider', 'google')
    .single();

  if (existingUser) {
    // Update user data
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({
        name: googleUserData.name,
        avatar_url: googleUserData.picture,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id)
      .select()
      .single();

    if (error) throw error;
    return updatedUser;
  }

  // Create new user
  const userId = uuidv4();
  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert([
      {
        id: userId,
        email: googleUserData.email,
        name: googleUserData.name,
        avatar_url: googleUserData.picture,
        provider: 'google',
        provider_id: googleUserData.id,
        credits_available: 30,
        credits_used: 0,
        total_generations: 0,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return newUser;
}
