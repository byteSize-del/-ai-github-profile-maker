import { Router } from 'express';
import Joi from 'joi';
import { exchangeGitHubCode, getGitHubUserInfo, getOrCreateSupabaseUser as getOrCreateGitHubUser, generateOAuthState as generateGitHubState, validateOAuthState as validateGitHubState } from '../services/github.js';
import { exchangeGoogleCode, getGoogleUserInfo, getOrCreateSupabaseUser as getOrCreateGoogleUser, generateOAuthState as generateGoogleState, validateOAuthState as validateGoogleState, getGoogleAuthUrl } from '../services/google.js';
import { createSessionToken, extractSessionUser } from '../middleware/auth.js';
import { authLimiter, oauthStateLimiter } from '../middleware/rateLimit.js';

const router = Router();
const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_URL = process.env.FRONTEND_URL || (isProduction ? 'https://profileforge-ai.vercel.app' : 'http://localhost:5173');

/**
 * Input validation schemas for OAuth callbacks
 * SECURITY: Prevent injection attacks and malformed requests
 */
const oauthCallbackSchema = Joi.object({
  code: Joi.string().pattern(/^[a-zA-Z0-9_\-\/+=]+$/).required().messages({
    'string.pattern.base': 'Invalid authorization code format',
    'any.required': 'Authorization code is required'
  }),
  state: Joi.string().pattern(/^[a-zA-Z0-9]+$/).required().messages({
    'string.pattern.base': 'Invalid state token format',
    'any.required': 'State token is required'
  })
});

const validateInput = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Invalid parameters',
        details: error.details.map(d => d.message)
      });
    }
    req.validatedBody = value;
    next();
  };
};

// SECURITY: Auth routes require authentication rate limiting
router.use(authLimiter);

const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  // Cross-site frontend (Vercel) -> backend (Render) requires SameSite=None in production.
  sameSite: isProduction ? 'none' : 'lax',
  // CHIPS: partition cookie for third-party contexts in modern browsers
  partitioned: isProduction ? true : undefined,
  // Enhanced security settings
  maxAge: 24 * 60 * 60 * 1000, // Explicit 24-hour expiration
  domain: isProduction ? '.vercel.app' : undefined, // Restrict to domain in production
  path: '/', // Restrict to root path
};

/**
 * GET /api/auth/oauth-state?provider=github|google
 * Generate OAuth state token for CSRF protection
 */
router.get('/oauth-state', oauthStateLimiter, (req, res) => {
  try {
    const provider = req.query.provider || 'github';
    
    if (!['github', 'google'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    const state = provider === 'google' ? generateGoogleState() : generateGitHubState();
    
    // Store state in httpOnly cookie to verify in callback
    res.cookie('oauth_state', state, {
      ...authCookieOptions,
      maxAge: 10 * 60 * 1000,  // 10 minute expiry
    });

    res.json({ state, provider });
  } catch (error) {
    console.error('OAuth state generation error:', error);
    res.status(500).json({ error: 'Failed to generate OAuth state' });
  }
});

/**
 * GET /api/auth/google/url
 * Get Google OAuth authorization URL
 */
router.get('/google/url', oauthStateLimiter, (req, res) => {
  try {
    const state = generateGoogleState();
    
    // Store state in httpOnly cookie to verify in callback
    res.cookie('oauth_state', state, {
      ...authCookieOptions,
      maxAge: 10 * 60 * 1000,  // 10 minute expiry
    });

    const authUrl = getGoogleAuthUrl(state);
    res.json({ url: authUrl });
  } catch (error) {
    console.error('Google OAuth URL generation error:', error);
    res.status(500).json({ error: 'Failed to generate Google OAuth URL' });
  }
});

/**
 * POST /api/auth/callback
 * Handle GitHub OAuth callback with CSRF protection
 */
router.post('/callback', validateInput(oauthCallbackSchema), async (req, res) => {
  try {
    const { code, state } = req.validatedBody;

    // Validate OAuth state for CSRF protection
    const storedState = req.cookies?.oauth_state;
    if (!storedState) {
      console.warn('OAuth state not found in cookies - possible CSRF attempt');
      return res.status(400).json({ error: 'Invalid OAuth session' });
    }

    try {
      validateGitHubState(state, storedState);
    } catch (error) {
      console.error('OAuth state validation failed:', error.message);
      // Don't expose internal error details
      return res.status(400).json({ error: 'Invalid request - session mismatch' });
    }

    // Clear the used state token
    res.clearCookie('oauth_state', authCookieOptions);

    // Exchange code for access token
    const accessToken = await exchangeGitHubCode(code, state);

    // Get user info from GitHub
    const gitHubUserData = await getGitHubUserInfo(accessToken);

    // Get or create user in Supabase
    const supabaseUser = await getOrCreateGitHubUser(gitHubUserData);

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
      github_username: supabaseUser.github_username || null,
      email: supabaseUser.email,
      provider: supabaseUser.provider || 'github',
    });
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    // Don't expose internal error details to client
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

/**
 * GET /api/auth/callback/google
 * Handle Google OAuth redirect from Google (when redirect_uri points to backend).
 * Redirects to frontend login page with code and state as query params.
 */
router.get('/callback/google', (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Redirect to frontend login page with provider, code and state
    const redirectUrl = new URL(`${FRONTEND_URL}/login`);
    redirectUrl.searchParams.set('provider', 'google');
    redirectUrl.searchParams.set('code', code);
    if (state) redirectUrl.searchParams.set('state', state);

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Google OAuth redirect error:', error);
    res.status(500).json({ error: 'Authentication redirect failed' });
  }
});

/**
 * POST /api/auth/callback/google
 * Handle Google OAuth callback with CSRF protection
 */
router.post('/callback/google', validateInput(oauthCallbackSchema), async (req, res) => {
  try {
    const { code, state } = req.validatedBody;

    // Validate OAuth state for CSRF protection
    const storedState = req.cookies?.oauth_state;
    if (!storedState) {
      console.warn('OAuth state not found in cookies - possible CSRF attempt');
      return res.status(400).json({ error: 'Invalid OAuth session' });
    }

    try {
      validateGoogleState(state, storedState);
    } catch (error) {
      console.error('OAuth state validation failed:', error.message);
      // Don't expose internal error details
      return res.status(400).json({ error: 'Invalid request - session mismatch' });
    }

    // Clear the used state token
    res.clearCookie('oauth_state', authCookieOptions);

    // Exchange code for tokens
    const tokenData = await exchangeGoogleCode(code);

    // Get user info from Google
    const googleUserData = await getGoogleUserInfo(tokenData);

    // Get or create user in Supabase
    const supabaseUser = await getOrCreateGoogleUser(googleUserData);

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
      email: supabaseUser.email,
      name: supabaseUser.name,
      github_username: supabaseUser.github_username || null,
      provider: supabaseUser.provider || 'google',
    });
  } catch (error) {
    console.error('Google OAuth error:', error.message || error);
    // Return a slightly more helpful error without exposing secrets
    let message = 'Authentication failed. Please try again.';
    if (error.message?.includes('credentials not configured')) {
      message = 'Google login is not configured on this server.';
    } else if (error.message?.includes('redirect_uri_mismatch')) {
      message = 'OAuth configuration error: redirect URI mismatch.';
    } else if (error.message?.includes('Invalid state')) {
      message = 'Session expired. Please try logging in again.';
    }
    res.status(500).json({ error: message });
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
      github_username: user.github_username || null,
      email: user.email,
      provider: user.provider || 'github',
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
