import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import generateRouter from './routes/generate.js';
import creditsRouter from './routes/credits.js';
import authRouter from './routes/auth.js';
import { limiter } from './middleware/rateLimit.js';

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

// Enhanced CORS with strict origin validation
const corsOptions = {
  origin: function(origin, callback) {
    // Requests without origin (same-site requests, mobile apps, curl)
    // are allowed but still need valid credentials
    if (!origin) {
      return callback(null, true);
    }

    // SECURITY: Only allow exact origin matches, no wildcards or pattern matching
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🔒 CORS blocked unauthorized origin: ${origin}`);
      callback(new Error('CORS policy violation'));
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
    },
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}));

app.use(cors(corsOptions));

// Preflight handling
app.options('*', cors(corsOptions));

app.use(express.json({
  limit: '10kb',  // Reject requests larger than 10KB to prevent DoS
}));
app.use(cookieParser(process.env.COOKIE_SECRET || 'default-secret'));

// SECURITY: Trust reverse proxy (Render/Vercel passes via X-Forwarded-For)
// This allows rate limiting and other middleware to correctly identify clients
app.set('trust proxy', 1);

// Rate limiting
app.use(limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/generate', generateRouter);
app.use('/api/credits', creditsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔒 Security: CORS restricted to ${ALLOWED_ORIGINS.length} origin(s)`);
});

export default app;
