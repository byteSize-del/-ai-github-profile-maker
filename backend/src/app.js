import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import generateRouter from './routes/generate.js';
import creditsRouter from './routes/credits.js';
import authRouter from './routes/auth.js';
import contactRouter from './routes/contact.js';
import { getProviderPoolSummary } from './services/provider.js';
import { limiter, authLimiter } from './middleware/rateLimit.js';

const app = express();

// Verify required security configuration
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not configured. Session tokens will not be secure.');
}

// SECURITY: Strict CORS configuration - only allow approved origins
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,  // Deployed frontend
  'https://ai-github-profile-frontend.vercel.app',
  'https://ai-github-profile-maker.vercel.app',
  // Development only - should be removed in production
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
  process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5173' : null,
].filter(Boolean);

// Allow Vercel preview deployments for this project namespace.
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/ai-github-profile-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/i,
  /^https:\/\/ai-github-profile-maker(?:-[a-z0-9-]+)?\.vercel\.app$/i,
];

function isAllowedOrigin(origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

// Enhanced CORS with strict origin validation
const corsOptions = {
  origin: function(origin, callback) {
    // Requests without origin (same-site requests, mobile apps, curl)
    // are allowed but still need valid credentials
    if (!origin) {
      return callback(null, true);
    }

    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn(`🔒 CORS blocked unauthorized origin: ${origin}`);
      // Return no CORS permissions instead of throwing a server error.
      callback(null, false);
    }
  },
  credentials: true,  // Allow cookies
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,  // Preflight cache 1 hour
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// SECURITY: Add additional headers not provided by helmet
app.use((req, res, next) => {
  // Enforce HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Disable browser XSS protection (Helmet handles this better)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Restrict permissions
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

app.use(cors(corsOptions));

// Preflight handling
app.options('*', cors(corsOptions));

// SECURITY: Apply size limits to ALL parsers to prevent DoS
app.use(express.json({
  limit: '10kb',  // Reject requests larger than 10KB to prevent DoS
}));
app.use(express.urlencoded({
  limit: '10kb',
  extended: false,
}));
app.use(express.raw({ limit: '10kb' }));
app.use(express.text({ limit: '10kb' }));

// SECURITY: Require strong COOKIE_SECRET - never use default
const COOKIE_SECRET = process.env.COOKIE_SECRET;
if (!COOKIE_SECRET || COOKIE_SECRET.length < 32) {
  console.error('🔴 CRITICAL SECURITY ERROR: COOKIE_SECRET must be set to a strong secret (32+ characters)');
  console.error('Please set COOKIE_SECRET environment variable with a cryptographically secure random string');
  process.exit(1);
}

app.use(cookieParser(COOKIE_SECRET));

// SECURITY: Trust reverse proxy (Render/Vercel passes via X-Forwarded-For)
// This allows rate limiting and other middleware to correctly identify clients
app.set('trust proxy', 1);

// Rate limiting
app.use(limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/generate', generateRouter);
app.use('/api/credits', creditsRouter);
app.use('/api/contact', contactRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  const providerSummary = getProviderPoolSummary();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔒 Security: CORS restricted to ${ALLOWED_ORIGINS.length} origin(s)`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `🔑 Provider key pool summary: ` +
      `groq=${providerSummary.groq.totalUnique} (legacy=${providerSummary.groq.hasLegacySingle}, list=${providerSummary.groq.listCount}, numbered=${providerSummary.groq.numberedCount}), ` +
      `openrouter=${providerSummary.openrouter.totalUnique} (legacy=${providerSummary.openrouter.hasLegacySingle}, list=${providerSummary.openrouter.listCount}, numbered=${providerSummary.openrouter.numberedCount}), ` +
      `nvidia=${providerSummary.nvidia.totalUnique} (legacy=${providerSummary.nvidia.hasLegacySingle}, list=${providerSummary.nvidia.listCount}, numbered=${providerSummary.nvidia.numberedCount})`
    );
  }
});

export default app;
