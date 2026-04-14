import { supabaseAdmin } from '../utils/supabase.js';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function exchangeGitHubCode(code) {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub OAuth credentials not configured');
  }

  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
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

  const userId = `github_${gitHubUserData.id}`;
  
  // Try to get existing user
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // Create new user
  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert([
      {
        id: userId,
        github_username: gitHubUserData.login,
        email: gitHubUserData.email,
        credits_available: 50,
        credits_used: 0,
        total_generations: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return newUser;
}

export async function createSessionToken(userId, gitHubUserData) {
  // In production, use a proper session store (Redis, database, etc.)
  // For now, we'll return user data to be stored in httpOnly cookie
  return {
    id: userId,
    login: gitHubUserData.login,
    avatar_url: gitHubUserData.avatar_url,
    bio: gitHubUserData.bio,
    email: gitHubUserData.email,
    created_at: gitHubUserData.created_at,
  };
}
