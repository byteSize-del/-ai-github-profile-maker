/**
 * Extract user data from session cookie and attach to request
 */
export function extractSessionUser(req, res, next) {
  try {
    const sessionCookie = req.cookies?.session;

    if (!sessionCookie) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const sessionData = JSON.parse(sessionCookie);
    
    // Attach user data to request
    req.user = sessionData;
    req.body.userId = sessionData.id;

    next();
  } catch (error) {
    console.error('Session extraction error:', error);
    res.status(401).json({ error: 'Invalid session' });
  }
}
