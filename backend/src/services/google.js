import { supabaseAdmin } from '../utils/supabase.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_URL = process.env.FRONTEND_URL || (isProduction ? 'https://profileforge-ai.vercel.app' : 'http://localhost:5173');
// Always use frontend URL for OAuth callback - Google redirects to frontend, which then calls backend
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `${FRONTEND_URL}/login`;

/**
 * Validate Google OAuth configuration on startup
 * SECURITY: Check for required credentials
 */
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  WARNING: Google OAuth credentials not configured');
  console.warn('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
  console.warn('GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
  console.warn('Google login will not be available until these are configured');
} else {
  console.log('✅ Google OAuth credentials configured');
}

console.log('🔗 Google OAuth Configuration:');
console.log('  - Frontend URL:', FRONTEND_URL);
console.log('  - Callback URL:', GOOGLE_CALLBACK_URL);
console.log('  - Environment:', isProduction ? 'Production' : 'Development');

/**
 * Validate redirect URI against allowlist
 * SECURITY: Prevents OAuth redirect manipulation attacks
 */
function validateRedirectUri(uri) {
  // In production, allow any HTTPS URL that matches expected patterns
  if (isProduction) {
    try {
      const url = new URL(uri);
      
      // Must be HTTPS in production (except localhost)
      if (!url.protocol.startsWith('https://') && !url.hostname.includes('localhost')) {
        return false;
      }
      
      // Allow common frontend deployment patterns
      const allowedPatterns = [
        /^https:\/\/ai-github-profile-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/i,
        /^https:\/\/ai-github-profile-maker(?:-[a-z0-9-]+)?\.vercel\.app$/i,
        /^https:\/\/profileforge-ai(?:-[a-z0-9-]+)?\.vercel\.app$/i,
        /^https:\/\/[a-z0-9-]+\.onrender\.com$/i, // Render frontend URLs
      ];
      
      // Check against patterns
      if (allowedPatterns.some(pattern => pattern.test(url.origin))) {
        return true;
      }
      
      // Check against explicit FRONTEND_URL if set
      if (process.env.FRONTEND_URL) {
        const frontendUrl = new URL(process.env.FRONTEND_URL);
        if (url.origin === frontendUrl.origin) {
          return true;
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }
  
  // Development: more permissive for local testing
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://ai-github-profile-frontend.vercel.app',
    'https://ai-github-profile-maker.vercel.app',
    'https://profileforge-ai.vercel.app',
  ].filter(Boolean);

  try {
    const url = new URL(uri);
    return allowedOrigins.some(allowed => {
      const allowedUrl = new URL(allowed);
      return url.origin === allowedUrl.origin;
    });
  } catch {
    return false;
  }
}

/**
 * Validate OAuth configuration on startup
 * SECURITY: Warn but don't fail for flexible deployment
 */
if (GOOGLE_CALLBACK_URL) {
  if (!validateRedirectUri(GOOGLE_CALLBACK_URL)) {
    console.warn('⚠️  WARNING: Google OAuth callback URL may not be in allowlist');
    console.warn('Callback URL:', GOOGLE_CALLBACK_URL);
    console.warn('This may cause OAuth failures, but continuing for deployment flexibility');
    // Don't exit - allow deployment with warning
  } else {
    console.log('✅ Google OAuth callback URL validation passed');
  }
  
  // Enforce HTTPS in production
  if (isProduction && !GOOGLE_CALLBACK_URL.startsWith('https://') && !GOOGLE_CALLBACK_URL.includes('localhost')) {
    console.error('🔴 SECURITY: Google callback URL must be HTTPS in production');
    process.exit(1);
  }
}

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
  // Check if Google OAuth is configured
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth is not configured. Please contact administrator.');
  }
  
  // Validate redirect URI before use
  if (!validateRedirectUri(GOOGLE_CALLBACK_URL)) {
    throw new Error('Invalid redirect URI configuration');
  }

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
    throw new Error('Google OAuth is not configured. Please contact administrator.');
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
    // Log full error internally for debugging
    console.error('Google OAuth token exchange error:', {
      status: tokenResponse.status,
      error: error,
      timestamp: new Date().toISOString()
    });
    // Return generic error to client to prevent information disclosure
    throw new Error('OAuth token exchange failed');
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
    console.error('Google OAuth user info error:', {
      status: userResponse.status,
      statusText: userResponse.statusText,
      timestamp: new Date().toISOString()
    });
    throw new Error('Failed to retrieve user information');
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

  // Look up user by email in google_users table
  const { data: existingUser } = await supabaseAdmin
    .from('google_users')
    .select('*')
    .eq('email', googleUserData.email)
    .single();

  if (existingUser) {
    // Update user data
    const { data: updatedUser, error } = await supabaseAdmin
      .from('google_users')
      .update({
        name: googleUserData.name,
        avatar_url: googleUserData.picture,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id)
      .select()
      .single();

    if (error) throw error;
    // Ensure provider field is present for JWT token
    return {
      ...updatedUser,
      provider: 'google',
      github_username: null // Explicitly set for JWT compatibility
    };
  }

  // Create new user in google_users table
  const userId = uuidv4();
  const { data: newUser, error } = await supabaseAdmin
    .from('google_users')
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

  // Ensure provider field is present for JWT token
  return {
    ...newUser,
    provider: 'google',
    github_username: null // Explicitly set for JWT compatibility
  };
}
