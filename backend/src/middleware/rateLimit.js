import rateLimit from 'express-rate-limit';

// SECURITY: Global rate limiter with moderate limits
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// SECURITY: Strict rate limiter for authentication endpoints
// Prevents brute force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
});

// OAuth-specific rate limiting to prevent token flooding and CSRF attacks
export const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 OAuth requests per windowMs
  message: {
    error: 'Too many OAuth attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Add progressive delays for repeated violations
  keyGenerator: (req) => {
    // Use IP + user agent for more specific limiting
    return `${req.ip}:${req.get('User-Agent') || 'unknown'}`;
  },
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    console.warn(`🚨 OAuth rate limit exceeded for IP: ${req.ip}, UA: ${req.get('User-Agent')}`);
    res.status(429).json({
      error: 'Too many OAuth attempts',
      retryAfter: '15 minutes',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }
});

// Even stricter rate limiting for OAuth state generation
export const oauthStateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 state requests per windowMs
  message: {
    error: 'Too many OAuth state requests, please try again after 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`🚨 OAuth state generation rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many OAuth state requests',
      retryAfter: '10 minutes',
      code: 'STATE_RATE_LIMIT_EXCEEDED'
    });
  }
});

// SECURITY: Strict rate limiter for API generation
// Prevents resource exhaustion
export const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per hour
  message: 'Generation rate limit exceeded. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// SECURITY: Moderate rate limiter for public endpoints
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes for public endpoints
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
