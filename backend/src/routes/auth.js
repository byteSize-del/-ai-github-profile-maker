import { Router } from 'express';
import { exchangeGitHubCode, getGitHubUserInfo, getOrCreateSupabaseUser, generateOAuthState, validateOAuthState } from '../services/github.js';
import { createSessionToken, extractSessionUser } from '../middleware/auth.js';

const router = Router();
const isProduction = process.env.NODE_ENV === 'production';
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  // Cross-site frontend (Vercel) -> backend (Render) requires SameSite=None in production.
  sameSite: isProduction ? 'none' : 'lax',
};

/**
 * GET /api/auth/oauth-state
 * Generate OAuth state token for CSRF protection
 */
router.get('/oauth-state', (req, res) => {
  try {
    const state = generateOAuthState();
    
    // Store state in httpOnly cookie to verify in callback
    res.cookie('oauth_state', state, {
      ...authCookieOptions,
      maxAge: 10 * 60 * 1000,  // 10 minute expiry
    });

    res.json({ state });
  } catch (error) {
    console.error('OAuth state generation error:', error);
    res.status(500).json({ error: 'Failed to generate OAuth state' });
  }
});

/**
 * POST /api/auth/callback
 * Handle GitHub OAuth callback with CSRF protection
 */
router.post('/callback', async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Validate OAuth state for CSRF protection
    const storedState = req.cookies?.oauth_state;
    if (!storedState) {
      return res.status(400).json({ error: 'Invalid OAuth session' });
    }

    try {
      validateOAuthState(state, storedState);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Clear the used state token
    res.clearCookie('oauth_state', authCookieOptions);

    // Exchange code for access token
    const accessToken = await exchangeGitHubCode(code, state);

    // Get user info from GitHub
    const gitHubUserData = await getGitHubUserInfo(accessToken);

    // Get or create user in Supabase
    const supabaseUser = await getOrCreateSupabaseUser(gitHubUserData);

    // Create signed JWT session token
    const sessionToken = createSessionToken(supabaseUser);

    // Set httpOnly cookie with JWT token
    res.cookie('session', sessionToken, {
      ...authCookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Return minimal user data (don't expose token in response)
    return res.json({
      id: supabaseUser.id,
      github_username: supabaseUser.github_username,
      email: supabaseUser.email,
    });
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: error.message || 'Authentication failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info (requires valid JWT session)
 */
router.get('/me', extractSessionUser, (req, res) => {
  try {
    // Session validation is done by the auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.json({
      id: user.id,
      github_username: user.github_username,
      email: user.email,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid session' });
  }
});

/**
 * POST /api/auth/logout
 * Clear session and invalidate token
 */
router.post('/logout', (req, res) => {
  res.clearCookie('session', authCookieOptions);
  res.clearCookie('oauth_state', authCookieOptions);
  res.json({ success: true });
});

export default router;
