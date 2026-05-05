import { supabaseAdmin } from '../utils/supabase.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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

export async function exchangeGitHubCode(code, state) {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub OAuth credentials not configured');
  }

  if (!code) {
    throw new Error('Missing authorization code');
  }

  // State validation is done in the route handler before calling this function

  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'AI-GitHub-Profile-Maker',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange GitHub code');
  }

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    throw new Error(tokenData.error_description || 'GitHub OAuth error');
  }

  return tokenData.access_token;
}

export async function getGitHubUserInfo(accessToken) {
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'AI-GitHub-Profile-Maker',
    },
  });

  if (!userResponse.ok) {
    throw new Error('Failed to fetch GitHub user info');
  }

  const userData = await userResponse.json();

  // Get email if not public
  if (!userData.email) {
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'AI-GitHub-Profile-Maker',
      },
    });

    if (emailResponse.ok) {
      const emails = await emailResponse.json();
      const primaryEmail = emails.find(e => e.primary) || emails[0];
      userData.email = primaryEmail?.email;
    }
  }

  return userData;
}

export async function getOrCreateSupabaseUser(gitHubUserData) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  // Use github_username as lookup key instead of id
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('github_username', gitHubUserData.login)
    .single();

  if (existingUser) {
    // Ensure provider field is present for JWT token consistency
    return {
      ...existingUser,
      provider: 'github'
    };
  }

  // Create new user with a proper UUID
  const userId = uuidv4();
  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert([
      {
        id: userId,
        github_username: gitHubUserData.login,
        email: gitHubUserData.email,
        credits_available: 30,
        credits_used: 0,
        total_generations: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Ensure provider field is present for JWT token consistency
  return {
    ...newUser,
    provider: 'github'
  };
}
