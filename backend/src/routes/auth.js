import { Router } from 'express';
import { exchangeGitHubCode, getGitHubUserInfo, getOrCreateSupabaseUser, createSessionToken } from '../services/github.js';

const router = Router();

/**
 * POST /api/auth/callback
 * Handle GitHub OAuth callback
 */
router.post('/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Exchange code for access token
    const accessToken = await exchangeGitHubCode(code);

    // Get user info from GitHub
    const gitHubUserData = await getGitHubUserInfo(accessToken);

    // Get or create user in Supabase
    const supabaseUser = await getOrCreateSupabaseUser(gitHubUserData);

    // Create session token
    const sessionData = await createSessionToken(supabaseUser.id, gitHubUserData);

    // Set httpOnly cookie with session data (in production, use a proper session store)
    res.cookie('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json(sessionData);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: error.message || 'Authentication failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', (req, res) => {
  try {
    const sessionCookie = req.cookies?.session;

    if (!sessionCookie) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const sessionData = JSON.parse(sessionCookie);
    return res.json(sessionData);
  } catch (error) {
    res.status(401).json({ error: 'Invalid session' });
  }
});

/**
 * POST /api/auth/logout
 * Clear session
 */
router.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ success: true });
});

export default router;
