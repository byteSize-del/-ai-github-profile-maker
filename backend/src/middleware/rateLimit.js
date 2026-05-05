import rateLimit from 'express-rate-limit';

// SECURITY: Global rate limiter with moderate limits
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// SECURITY: Moderate rate limiter for authentication endpoints
// Prevents brute force attacks while allowing normal usage
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // 60 requests per 15 minutes (4 per minute) - allows normal auth flow
  standardHeaders: true,
  legacyHeaders: false,
});

// OAuth-specific rate limiting to prevent token flooding and CSRF attacks
export const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 OAuth requests per windowMs - allows normal login attempts
  message: {
    error: 'Too many OAuth attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Even stricter rate limiting for OAuth state generation
export const oauthStateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 30 state requests per windowMs - allows page refreshes
  message: {
    error: 'Too many OAuth state requests, please try again after 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
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
