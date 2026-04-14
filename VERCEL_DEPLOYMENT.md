# Vercel Deployment Guide

## Quick Start

Your project is set up for Vercel deployment with separate frontend and backend.

### Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository with your code
- Vercel CLI installed (`npm install -g vercel`)

## Deployment Steps

### 1. Deploy Frontend

```bash
cd frontend
vercel --prod
```

**Configuration Details:**
- **Project Name:** `ai-github-profile-maker-frontend`
- **Framework:** Vite + React
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 2. Deploy Backend

```bash
cd backend
vercel --prod
```

**Configuration Details:**
- **Project Name:** `ai-github-profile-maker-backend`
- **Framework:** Node.js
- **Entry Point:** `src/app.js`
- **Build:** Not required (Node.js app)

### 3. Configure Environment Variables

After creating projects, add environment variables in Vercel dashboard:

**Frontend Environment Variables (Settings → Environment Variables):**
```
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_API_URL=https://your-backend-domain.vercel.app
```

**Backend Environment Variables:**
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

### 4. Update GitHub OAuth

After deploying, update your GitHub OAuth app settings:

1. Go to [GitHub Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Edit your OAuth app
3. Update **Authorization callback URL** to your frontend production URL:
   ```
   https://your-frontend-domain.vercel.app/login
   ```

## Deployment with GitHub Integration (Recommended)

For automatic deployments on git push:

### Frontend
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import `frontend` directory from your repository
4. Add environment variables
5. Deploy!

### Backend
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `backend` directory from your repository
3. Add environment variables
4. Deploy!

## Project Configuration Files

### frontend/vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### backend/vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Production URLs

After deployment, your services will be available at:

- **Frontend:** `https://ai-github-profile-maker-frontend.vercel.app`
- **Backend API:** `https://ai-github-profile-maker-backend.vercel.app`

Update these URLs in:
1. GitHub OAuth app settings (callback URL)
2. Frontend `.env` file (API URL)

## Logs and Monitoring

### View Deployment Logs
```bash
vercel logs --prod
``
```

### Monitor Realtime
```bash
vercel env list --prod
```

## Troubleshooting

### Build Failed
- Check `vercel.json` configuration
- Verify Node modules are installed: `npm install`
- Check for missing environment variables

### OAuth Error: Invalid Redirect URI
- Ensure GitHub OAuth app has correct callback URL
- Format: `https://your-domain.vercel.app/login`
- No trailing slashes

### API Not Responding
- Verify backend environment variables are set correctly
- Check backend logs: `vercel logs --prod --project=backend`
- Ensure frontend `REACT_APP_API_URL` matches backend domain

### CORS Errors
- Update backend CORS config with frontend domain
- Ensure `credentials: 'include'` in fetch calls

## Advanced Features

### Custom Domain
1. Go to Vercel project settings
2. Domains → Add custom domain
3. Configure DNS at your domain registrar

### Analytics
- Enable in Vercel dashboard (Settings → Analytics)
- View traffic, errors, and performance metrics

### Rollback
```bash
vercel rollback --prod
```

### Preview Deployments
Push to non-main branches to create preview URLs automatically

## Cost Estimation (as of 2026)

- **Free Tier:** Includes up to 3 deployments per month + preview deploys
- **Pro:** $20/month - unlimited deployments + analytics
- **Enterprise:** Custom pricing

See [vercel.com/pricing](https://vercel.com/pricing) for current rates

