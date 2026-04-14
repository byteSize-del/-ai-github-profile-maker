# Supabase Quick Setup Checklist

## 🎯 One-Click Setup (5 minutes)

### Phase 1: Get Supabase Credentials (2 min)

- [ ] Go to [supabase.com](https://supabase.com) and sign in
- [ ] Create or select your project (e.g., "ai-github-profile-maker")
- [ ] Navigate to **Settings → API**
- [ ] Copy your **Project URL** → `SUPABASE_URL`
- [ ] Copy your **`anon` public key** → `SUPABASE_ANON_KEY`
- [ ] Copy your **`service_role` secret key** → `SUPABASE_SERVICE_KEY` (keep this private!)

### Phase 2: Configure Backend (1 min)

- [ ] Open `backend/.env`
- [ ] Add:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

### Phase 3: Verify Setup (2 min)

```bash
cd backend
npm install  # Installs @supabase/supabase-js
npm run dev
```

✅ You should see:
```
🚀 Server running on port 4000
✅ Supabase connected
📊 Database tables initialized
```

## 📊 Database Created With:

| Table | Purpose | Rows |
|-------|---------|------|
| `users` | User accounts & credits | 0 |
| `generations` | Generated READMEs | 0 |
| `credits_history` | Audit log | 0 |
| `saved_profiles` | Bookmarks | 0 |

✅ **All RLS policies enforced** (users can only see their own data)

## 🔌 What's Connected?

### Backend Changes
- ✅ `src/db/supabase.js` - Database functions
- ✅ `src/utils/supabase.js` - Client initialization
- ✅ `src/middleware/credits.js` - Updated for Supabase
- ✅ `package.json` - Added `@supabase/supabase-js`

### Frontend Ready (TypeScript Types)
- ✅ `src/types/supabase.ts` - Type definitions

## 🚀 Next Steps

### Immediately available:
1. **User credit tracking** - Persists across server restarts
2. **Generation history** - All READMEs saved with metadata
3. **Credit analytics** - View in Supabase dashboard

### Todo (when ready):
- [ ] Update frontend to fetch generation history
- [ ] Add UI to view saved profiles
- [ ] Create admin dashboard for monitoring
- [ ] Set up webhooks for notifications

## 🧪 Test It

### 1. Generate a README
```bash
curl -X POST http://localhost:4000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "userData": {
      "name": "Your Name",
      "role": "Developer",
      "githubUsername": "yourusername"
    }
  }'
```

### 2. Check Credits
```bash
curl http://localhost:4000/api/credits/test-user-123
```

### 3. View in Supabase Dashboard
1. Go to your Supabase project
2. Click **Table Editor** (left sidebar)
3. Browse:
   - `users` → See your user account and credits
   - `generations` → See generated READMEs
   - `credits_history` → Audit log of deductions

## 🆘 Troubleshooting

**Q: See warning "SUPABASE_URL is not defined"?**
- A: Copy `.env.example` → `.env` and fill in your credentials

**Q: Database tables not appearing?**
- A: Tables are auto-created on first run. Check backend logs.

**Q: Getting "RLS policy violation"?**
- A: Normal! RLS prevents users from seeing others' data. Always pass correct `user_id`.

**Q: Want to fall back to in-memory for development?**
- A: Just remove Supabase env vars and restart. System auto-switches!

## 📚 See Also

- [Full Setup Guide](./SUPABASE_SETUP.md)
- [Database Schema](./SUPABASE_SETUP.md#database-schema-overview)
- [API Examples](./SUPABASE_SETUP.md#using-supabase-features)

---

**Status:** ✅ **Ready to go!** Your database is live.
