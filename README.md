# AI GitHub Profile Maker

A fullstack app that generates stunning GitHub profile READMEs using AI (Groq, OpenRouter, NVIDIA NIM), with **GitHub OAuth authentication**, **50 credits/day per user** system, and **Supabase database** for production.

## Features

- 🔐 **GitHub OAuth Login** - Sign in with your GitHub account
- 🤖 Multi-provider AI support (Groq, OpenRouter, NVIDIA NIM)
- 🪙 Daily credit system (50 credits/user/day)
- 📊 Supabase database with user profiles, generation history, and analytics
- 🎨 Sleek React frontend with protected routes
- 📋 Copy & download generated READMEs
- ⚡ Provider fallback logic
- 🔐 Row-level security for multi-tenant safety

## Quick Start

### Prerequisites
- Node.js 16+
- GitHub OAuth App (get credentials [here](#github-oauth-setup))
- Supabase project (optional, uses in-memory fallback)

### 1️⃣ Backend Setup (3 min)
```bash
cd backend
cp .env.example .env
# Add your GitHub OAuth credentials and AI provider keys
npm install
npm run dev
```

### 2️⃣ Frontend Setup (2 min)
```bash
cd frontend
cp .env.example .env
# Add your GitHub OAuth Client ID
npm install
npm run dev
```

**→ Open http://localhost:5173** and click "Sign in with GitHub"

## Authentication

### GitHub OAuth Flow
1. Users click "Sign in with GitHub"
2. Redirected to GitHub for authorization
3. GitHub redirects back with authorization code
4. Backend exchanges code for user info
5. User account created in Supabase (if new)
6. Session established, user logged in

**[→ Full OAuth Setup Guide →](./GITHUB_OAUTH_SETUP.md)**

## Project Structure

```
ai-github-profile-maker/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js      # GitHub OAuth endpoints
│   │   │   ├── generate.js  # README generation
│   │   │   └── credits.js   # Credit management
│   │   ├── services/
│   │   │   └── github.js    # GitHub OAuth service
│   │   ├── middleware/
│   │   ├── db/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── GeneratePage.jsx
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
├── GITHUB_OAUTH_SETUP.md     # OAuth configuration guide
├── SUPABASE_QUICKSTART.md    # 5-minute setup ⚡
├── SUPABASE_SETUP.md         # Full documentation
└── README.md
```

## Environment Variables

### Backend (`backend/.env`)
```env
# GitHub OAuth (required)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI Providers (at least one required)
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key

# Supabase (optional, falls back to in-memory)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

# Other
PORT=4000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_API_URL=http://localhost:4000
REACT_APP_ENV=development
```

## AI Providers

| Provider | Status | Speed | Free Tier |
|----------|--------|-------|-----------|
| Groq | ✅ Primary | ⚡ Fastest | Yes |
| OpenRouter | ✅ Fallback | Normal | Yes |
| NVIDIA NIM | ✅ Fallback | Normal | Yes |

## Database

### Supabase (Production)
- ✅ **users** table - User accounts with daily credits
- ✅ **generations** table - All generated READMEs with metadata
- ✅ **credits_history** table - Audit log of transactions
- ✅ **saved_profiles** table - Bookmarked generations
- ✅ **RLS policies** - Users can only see their own data

**[→ See full database schema →](./SUPABASE_SETUP.md#database-schema-overview)**

## Authentication API

### POST /api/auth/callback
Exchange GitHub code for session

### GET /api/auth/me
Get current authenticated user

### POST /api/auth/logout
Clear session

**[→ Full API Docs →](./GITHUB_OAUTH_SETUP.md#api-endpoints)**

## Security

- 🔒 GitHub OAuth (no passwords stored)
- 🔒 httpOnly cookies (XSS protection)
- 🔒 CSRF prevention (SameSite cookies)
- 🔒 Row-level security in Supabase
- 🔒 Rate limiting on API endpoints

## Deployment

| Component | Recommended | Alternative |
|-----------|-------------|-------------|
| Backend API | Railway, Render.com, Fly.io | Vercel |
| Frontend | Vercel, Netlify | GitHub Pages |
| Database | Supabase (managed PostgreSQL) | Self-hosted PG |
| Auth | GitHub OAuth | Auth0, Clerk |

### Important for Production
1. Update GitHub OAuth redirect URIs to production domain
2. Set `NODE_ENV=production` in backend
3. Use HTTPS everywhere
4. Update `FRONTEND_URL` to production domain
5. Upgrade session store (Redis/PostgreSQL)
6. Enable CORS properly for production domain

## License

MIT
