# Deployment Guide

## Quick Deploy Checklist

### 1. Deploy Backend to Render
1. Push code to GitHub
2. Go to https://render.com
3. Create account / Login
4. Click **New +** → **Web Service**
5. Connect your GitHub repository
6. Select the `backend` directory
7. Configure:
   - **Name**: `ai-github-profile-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
8. Add Environment Variables:
   ```
   NODE_ENV=production
   GITHUB_CLIENT_ID=your_actual_client_id
   GITHUB_CLIENT_SECRET=your_actual_client_secret
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   FRONTEND_URL=https://your-frontend.vercel.app (add after deploying frontend)
   ```
9. Click **Create Web Service**
10. Wait for deployment (5-10 minutes)
11. Copy your backend URL (e.g., `https://ai-github-profile-backend.onrender.com`)

### 2. Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_GITHUB_CLIENT_ID=your_actual_client_id
   VITE_API_URL=https://your-backend.onrender.com (from step 1)
   ```
6. Click **Deploy**
7. Wait for deployment (2-3 minutes)
8. Copy your frontend URL (e.g., `https://ai-github-profile-frontend.vercel.app`)

### 3. Update GitHub OAuth App
1. Go to https://github.com/settings/developers
2. Select your OAuth App
3. Update **Authorization callback URL** to:
   ```
   https://your-frontend.vercel.app/login
   ```
4. Update **Homepage URL** to:
   ```
   https://your-frontend.vercel.app
   ```
5. Save changes

### 4. Update Backend CORS
1. Go back to Render dashboard
2. Add `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
3. Redeploy backend service

### 5. Test the Deployment
1. Visit your frontend URL
2. Click "Sign in with GitHub"
3. Authorize the app
4. Verify you're redirected back and can generate profiles

---

## Environment Variables Summary

### Backend (Render)
| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `production` |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase service role key |
| `OPENAI_API_KEY` | OpenAI API key for profile generation |
| `FRONTEND_URL` | Your deployed frontend URL |

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `VITE_API_URL` | Your deployed backend URL |

---

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check that `credentials: true` is set in both frontend and backend

### 401 Unauthorized after login
- Check backend logs on Render for errors
- Verify GitHub OAuth credentials are correct
- Ensure callback URL in GitHub settings matches your frontend URL

### Build failures
- Check that all dependencies are in `package.json`
- Verify Node version compatibility
- Check Vercel/Render build logs
