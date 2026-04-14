# AI GitHub Profile Maker

AI GitHub Profile Maker is a full-stack application that generates polished GitHub profile README files from a username and profile preferences.

## Highlights

- AI-assisted GitHub profile README generation
- GitHub OAuth sign-in
- Usage credits and generation history
- Save, copy, and download workflows
- Contact form with backend persistence
- Production-ready frontend and backend deployment flow

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: Supabase
- Auth: GitHub OAuth

## Quick Start

### Prerequisites

- Node.js 16+
- A GitHub OAuth App
- A Supabase project

### 1. Start the Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. Start the Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173 to use the app.

## Configuration

Environment values are loaded from local env files.

- Backend config: backend/.env
- Frontend config: frontend/.env

Use the included .env.example files as templates. Do not commit real secrets.

## Security Best Practices

- Store credentials only in environment variables
- Keep secret values out of source control and pull requests
- Rotate credentials periodically
- Restrict production CORS and callback URLs to trusted domains
- Enforce HTTPS in production

## Repository Structure

```text
ai-github-profile-maker/
	backend/
	frontend/
	GITHUB_OAUTH_SETUP.md
	SUPABASE_QUICKSTART.md
	SUPABASE_SETUP.md
	README.md
```

## Documentation

- OAuth setup: ./GITHUB_OAUTH_SETUP.md
- Supabase quick start: ./SUPABASE_QUICKSTART.md
- Supabase full setup: ./SUPABASE_SETUP.md

## License

MIT
