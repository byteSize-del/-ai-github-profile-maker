import jwt from 'jsonwebtoken';

/**
 * Extract and verify JWT from session cookie
 * SECURITY: Verifies cryptographic signature, prevents client tampering
 */
export function extractSessionUser(req, res, next) {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const sessionCookie = req.cookies?.session;
    if (!sessionCookie) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify JWT signature - throws if invalid/tampered
    const sessionData = jwt.verify(sessionCookie, jwtSecret, {
      algorithms: ['HS256'],
      maxAge: '24h'  // Force re-authentication after 24 hours
    });
    
    // Validate token structure
    if (!sessionData.provider || !['github', 'google'].includes(sessionData.provider)) {
      return res.status(401).json({ error: 'Invalid session provider' });
    }
    
    // Attach verified user data to request
    req.user = sessionData;
    req.userId = sessionData.id;  // Use verified user ID, not client-provided

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid session token' });
    }
    console.error('Session verification error:', error.message);
    res.status(401).json({ error: 'Invalid session' });
  }
}

/**
 * Best-effort session extraction for public endpoints.
 * If a valid session exists, req.user/req.userId are populated.
 * If not, request continues as anonymous.
 */
export function extractSessionUserIfPresent(req, res, next) {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const sessionCookie = req.cookies?.session;

    if (!jwtSecret || !sessionCookie) {
      return next();
    }

    const sessionData = jwt.verify(sessionCookie, jwtSecret, {
      algorithms: ['HS256'],
      maxAge: '24h'
    });

    req.user = sessionData;
    req.userId = sessionData.id;
    return next();
  } catch {
    // Ignore invalid/expired optional session and continue as anonymous.
    return next();
  }
}

/**
 * Create a signed JWT session token
 * SECURITY: Cryptographically signed token prevents tampering
 */
export function createSessionToken(userData) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  const token = jwt.sign(
    {
      id: userData.id,
      github_username: userData.github_username || null,
      provider: userData.provider || 'github',
      email: userData.email,
    },
    jwtSecret,
    {
      algorithm: 'HS256',
      expiresIn: '24h',
      issuer: 'ai-github-profile',
      audience: ['api'],
    }
  );

  return token;
}
