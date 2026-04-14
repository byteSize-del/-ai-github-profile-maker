# 📚 Deployment Checklist & Next Steps

## ✅ Completed
- [x] Vercel CLI installed globally
- [x] Frontend build configuration (vercel.json)
- [x] Backend deployment configuration (vercel.json)
- [x] Frontend production build created (`dist/` folder)
- [x] Deployment guide created

## 🚀 Ready to Deploy

### Option 1: GitHub Integration (Recommended - Automatic Deployments)

**Best for:** Continuous deployment on every push

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add GitHub OAuth, Supabase, and Vercel config"
   git push origin main
   ```

2. **Deploy Frontend**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repo
   - Set **Root Directory:** `frontend`
   - Add Environment Variables (click "Environment Variables"):
     ```
     REACT_APP_GITHUB_CLIENT_ID = your_github_client_id
     REACT_APP_API_URL = https://your-backend.vercel.app (set after backend deploys)
     ```
   - Click **Deploy** 🎉

3. **Deploy Backend**
   - Go to [vercel.com/new](https://vercel.com/new) again
   - Import same repo
   - Set **Root Directory:** `backend`
   - Add Environment Variables:
     ```
     GITHUB_CLIENT_ID=your_github_client_id
     GITHUB_CLIENT_SECRET=your_github_client_secret
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_KEY=your_supabase_key
     GROQ_API_KEY=your_groq_key
     OPENROUTER_API_KEY=your_openrouter_key
     FRONTEND_URL=https://your-frontend.vercel.app
     NODE_ENV=production
     ```
   - Click **Deploy** 🎉

---

### Option 2: CLI Deployment (Manual)

**If you prefer command line:**

```bash
# Frontend
cd frontend
vercel deploy --prod

# Backend  
cd backend
vercel deploy --prod
```

---

## 📋 Post-Deployment Configuration

### 1. Update GitHub OAuth Settings

After both deployments complete:

1. Go to [github.com/settings/developers → OAuth Apps](https://github.com/settings/developers)
2. Edit your GitHub OAuth App
3. Update **Authorization callback URL**:
   ```
   https://your-frontend-domain.vercel.app/login
   ```
   (Replace with your actual Vercel frontend URL)

### 2. Update Frontend Environment Variable

After backend deploys, add backend URL to frontend:

1. Go to frontend project in [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Add: `REACT_APP_API_URL = https://your-backend-domain.vercel.app`
4. Redeploy frontend with new variable

### 3. Verify Supabase Configuration

Make sure backend environment variables include Supabase credentials (already set if you followed setup)

---

## 🔍 Verification Checklist

After deployment:

- [ ] Frontend loads at `https://your-frontend.vercel.app`
- [ ] Click "Sign in with GitHub" button appears
- [ ] GitHub OAuth redirect works
- [ ] Login succeeds and redirects to profile generator
- [ ] Backend API responds: `curl https://your-backend.vercel.app/health`
- [ ] Supabase connection works (users created in DB)

---

## 📊 Your Deployment URLs (After Setup)

```
Frontend:  https://ai-github-profile-maker-frontend.vercel.app
Backend:   https://ai-github-profile-maker-backend.vercel.app
```

(Replace with your actual Vercel project names)

---

## 💡 Quick Tips

### Enable Preview Deployments
- Any branch push creates a preview URL automatically
- Great for testing before merging to main

### View Logs
```bash
vercel logs --prod --project=ai-github-profile-maker-frontend
vercel logs --prod --project=ai-github-profile-maker-backend
```

### Rollback a Deployment
```bash
vercel rollback --prod
```

### Check Function Limits
Vercel Serverless Functions have limitations:
- Execution timeout: 60 seconds (free) / 900 seconds (pro)
- Memory: 512MB (free) / 3GB (pro)
- GitHub OAuth and AI generation should be well within limits

---

## 🚨 Common Issues & Fixes

### OAuth Callback Not Working
**Solution:** Make sure GitHub OAuth app callback URL matches exactly
- ✅ `https://your-domain.vercel.app/login`
- ❌ `https://your-domain.vercel.app/login/`  (no trailing slash)

### CORS Errors
**Solution:** Check backend CORS config includes frontend domain
```javascript
cors({
  origin: 'https://your-frontend-domain.vercel.app',
  credentials: true
})
```

### Build Failed / Missing Dependencies
**Solution:** Run `npm install` in frontend and backend before deploying

### Supabase Connection Failing
**Solution:** Verify all Supabase env vars are set:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

---

## 📞 Next Steps

1. ✅ Make sure GitHub OAuth app is created
2. ✅ Deploy to Vercel (GitHub integration recommended)
3. ✅ Update GitHub OAuth callback URL
4. ✅ Test login flow
5. ✅ Monitor logs and iterate

**Ready to deploy?** Start with GitHub integration - it's the easiest! 🚀

