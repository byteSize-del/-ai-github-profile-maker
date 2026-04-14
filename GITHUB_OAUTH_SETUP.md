# GitHub OAuth Setup Guide

## Overview

This project uses GitHub OAuth for user authentication. Users can log in with their GitHub account, and we store their information in Supabase.

## Step-by-Step Setup

### Step 1: Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → [OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name:** `AI GitHub Profile Maker` (or your preference)
   - **Homepage URL:** `http://localhost:5173` (development) or your production URL
   - **Authorization callback URL:** `http://localhost:5173/login` (development) or `https://yourdomain.com/login` (production)

4. Click **Register application**

5. You'll see your credentials:
   - **Client ID** - Copy this
   - **Client Secret** - Click "Generate a new client secret" and copy it

### Step 2: Configure Backend (.env)

In `backend/.env`, add:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

### Step 3: Configure Frontend (.env)

Create `frontend/.env` and add:

```env
REACT_APP_GITHUB_CLIENT_ID=your_client_id_here
REACT_APP_API_URL=http://localhost:4000
```

### Step 4: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 5: Start the Application

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## How OAuth Flow Works

1. **User clicks "Sign in with GitHub"** on `/login` page
2. **Frontend redirects to GitHub** with client ID and redirect URI
3. **User authorizes** the application on GitHub
4. **GitHub redirects** back to `/login?code=xxx`
5. **Frontend sends code** to backend `/api/auth/callback`
6. **Backend exchanges code** for access token with GitHub
7. **Backend fetches user info** from GitHub API
8. **Backend creates/updates user** in Supabase
9. **Backend returns user data** and sets httpOnly cookie
10. **Frontend stores session** and redirects to `/generate`

## Data Stored

When a user logs in, we store:

### In GitHub (OAuth Provider)
- ❌ **No passwords** - GitHub handles authentication
- ❌ **No sensitive data** - Only read public user info

### In Supabase (Our Database)
- ✅ GitHub user ID (as table primary key)
- ✅ GitHub username (login)
- ✅ GitHub avatar URL
- ✅ Email address (with permission)
- ✅ Daily credits (starts at 50)
- ✅ Total generations count

### In Frontend (Session Cookie)
- ✅ User ID
- ✅ GitHub login
- ✅ Avatar URL
- ✅ Email
- ✅ Account creation date
- 🔒 **Stored in httpOnly cookie** (not accessible to JavaScript)

## Data Privacy

### What We Request
```
Scopes: user:email, read:user
```
- Read-only access to public profile
- Email address (if available)

### What We Don't Request
- ❌ No write access to repositories
- ❌ No access to private repos
- ❌ No access to gists
- ❌ No access to organizations

## API Endpoints

### POST /api/auth/callback
Exchange GitHub code for session

**Request:**
```json
{
  "code": "github_authorization_code"
}
```

**Response:**
```json
{
  "id": "github_12345",
  "login": "torvalds",
  "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
  "email": "linus@linux.com",
  "bio": "I'm just this guy, you know?",
  "created_at": "2005-10-20T14:48:00Z"
}
```

### GET /api/auth/me
Get current authenticated user

**Response:**
```json
{
  "id": "github_12345",
  "login": "torvalds",
  "avatar_url": "...",
  "email": "...",
  ...
}
```

**Error (401):**
```json
{
  "error": "Not authenticated"
}
```

### POST /api/auth/logout
Clear session cookie

**Response:**
```json
{
  "success": true
}
```

## Security Details

### Session Management
- Sessions stored in **httpOnly cookies** (secure against XSS)
- Cookies marked **secure** (HTTPS only in production)
- **SameSite=Lax** prevents CSRF attacks
- 30-day expiration
- Cleared on logout

### In Production
⚠️ **Important:** The current session system uses cookies. For production deployment with multiple servers, upgrade to:

1. **Session Store Options:**
   - Redis (fast, recommended)
   - PostgreSQL (already using Supabase)
   - Memcached

2. **Implementation:**
   ```javascript
   // Example: Store session in Supabase
   const { data } = await supabaseAdmin
     .from('sessions')
     .insert({
       user_id: userId,
       token: generateToken(),
       expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
     });
   ```

## Troubleshooting

### "Invalid client ID" Error
- [ ] Verify `GITHUB_CLIENT_ID` is correct
- [ ] Check it's set in both backend AND frontend
- [ ] Make sure no trailing spaces in .env

### "Redirect URI mismatch"
- [ ] Your callback URL in GitHub app settings must **exactly** match:
  - Development: `http://localhost:5173/login`
  - Production: `https://yourdomain.com/login`
- [ ] ⚠️ **No trailing slashes**
- [ ] ⚠️ **Must use HTTPS in production**

### "CORS error" when exchanging code
- [ ] Make sure `FRONTEND_URL` is set correctly in backend
- [ ] Frontend should be running with correct API URL
- [ ] Check `credentials: 'include'` in fetch calls

### User info not fetching from GitHub
- [ ] Check GitHub personal access token has right scopes
- [ ] Verify API rate limits aren't exceeded (60 req/hour unauthenticated)
- [ ] Check GitHub API status at [status.github.com](https://status.github.com)

### Session lost on page refresh
- [ ] Check if cookies are being blocked
- [ ] Verify `httpOnly`, `secure`, `sameSite` settings
- [ ] In development, make sure not using HTTPS redirect

## Testing

### Test OAuth Flow Locally

1. Start both servers
2. Go to `http://localhost:5173/login`
3. Click "Sign in with GitHub"
4. You'll be redirected to GitHub
5. Click "Authorize"
6. You'll be redirected back and logged in
7. Check browser DevTools → Application → Cookies for `session`

### Test API Directly

```bash
# Test callback endpoint
curl -X POST http://localhost:4000/api/auth/callback \
  -H "Content-Type: application/json" \
  -d '{"code":"your_github_code_here"}'

# Test /me endpoint
curl http://localhost:4000/api/auth/me \
  -H "Cookie: session={your_session_cookie}"

# Test logout
curl -X POST http://localhost:4000/api/auth/logout
```

## Revoking Access

Users can revoke access to your app at:
- GitHub Settings → Applications → Authorized OAuth Apps
- Then click "Revoke" next to your app

When revoked:
1. User's existing sessions become invalid
2. New login attempts redirect through GitHub again
3. No automatic cleanup needed in our database (soft delete pattern)

## Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [GitHub API: User Endpoints](https://docs.github.com/en/rest/users)
- [RFC 6749: OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
- [OWASP: OAuth 2.0 Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth_2_Authorization_Cheat_Sheet.html)
