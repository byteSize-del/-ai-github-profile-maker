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
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
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
