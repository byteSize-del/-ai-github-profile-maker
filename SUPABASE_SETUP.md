# Supabase Database Integration Guide

## Database Schema Overview

Your AI GitHub Profile Maker now has a complete Supabase database schema with the following tables:

### 1. **users** table
Stores user information and daily credit tracking.

```sql
- id (UUID, Primary Key)
- github_username (TEXT, UNIQUE)
- email (TEXT, nullable)
- credits_available (INT) - Daily credits available (default: 50)
- credits_used (INT) - Credits used today
- last_credit_reset (TIMESTAMP) - When credits were last reset
- total_generations (INT) - Lifetime generation count
- created_at (TIMESTAMP) - Account creation time
- updated_at (TIMESTAMP) - Last update time
```

### 2. **generations** table
Stores all generated README profiles with metadata.

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → users.id)
- github_username (TEXT)
- profile_template (TEXT) - Template used (e.g., 'professional', 'casual')
- input_data (JSONB) - Input parameters used for generation
- generated_readme (TEXT) - The generated README markdown
- credits_used (INT) - Credits deducted for this generation
- ai_provider (TEXT) - Provider used (groq, openrouter, nvidia, etc)
- ai_model (TEXT) - Model name used
- generation_time_ms (INT) - How long the generation took
- status (TEXT) - Generation status (completed, failed, etc)
- error_message (TEXT) - Error details if failed
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Indexes:**
- `idx_generations_user_id` - Fast lookup by user
- `idx_generations_github_username` - Search by GitHub username
- `idx_generations_created_at` - Recent generations first

### 3. **credits_history** table
Audit log for all credit transactions.

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → users.id)
- action (TEXT) - Action type (deduction, bonus, refund, etc)
- credits_amount (INT) - Amount deducted/added
- balance_after (INT) - Credit balance after transaction
- generation_id (UUID, Foreign Key → generations.id)
- reason (TEXT) - Reason for transaction
- created_at (TIMESTAMP)
```

### 4. **saved_profiles** table
Allows users to save and manage their favorite generated profiles.

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → users.id)
- generation_id (UUID, Foreign Key → generations.id)
- title (TEXT) - Custom title for saved profile
- notes (TEXT) - User notes
- is_favorite (BOOLEAN) - Favorite flag
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Setup Instructions

### Step 1: Configure Environment Variables

Add the following to your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Find your Project URL (SUPABASE_URL)
4. Find your `anon` key (SUPABASE_ANON_KEY)
5. Find your `service_role` key (SUPABASE_SERVICE_KEY)

### Step 2: Install Dependencies

```bash
cd backend
npm install
```

This will install `@supabase/supabase-js` along with other dependencies.

### Step 3: Verify Database Setup

Run this command to check the health of your Supabase connection:

```bash
npm run dev
```

The logs should show:
- `✅ Supabase connected` if configured correctly
- Database tables are created with all RLS policies enabled

### Step 4: Feature Fallback

The system automatically falls back to in-memory credit storage if Supabase is not configured. This allows development without Supabase setup:

```
⚠️  SUPABASE_URL is not defined. Supabase features will be disabled.
✅ Using in-memory credit storage (development mode)
```

## API Integration

### Generate Endpoint

When a user generates a README, the system now:

1. Checks credits via Supabase (or fallback)
2. Calls the AI provider to generate README
3. **Saves the generation** to the database with:
   - Generated markdown content
   - Input parameters (for reproducibility)
   - Provider and model info
   - Generation time
4. Deducts credits and logs the transaction

### Credits Endpoint

```bash
GET /api/credits/:userId
```

Returns:
```json
{
  "credits": 45,
  "resetAt": "2026-04-15T00:00:00Z"
}
```

## Row-Level Security (RLS)

All tables have RLS policies enabled:

- Users can **only view/edit their own** data
- Users can **only create/delete their own** generations and saved profiles
- Credits history is **read-only** for users (audit trail)

This ensures multi-tenant security without requiring authentication checks in your queries.

## Using Supabase Features

### Get User with Credits

```javascript
import { supabaseAdmin } from './utils/supabase.js';
import { getOrCreateUser } from './db/supabase.js';

// Get or create user
const user = await getOrCreateUser(userId, githubUsername, email);
console.log(`User credits: ${user.credits_available}`);
```

### Save a Generation

```javascript
import { saveGeneration } from './db/supabase.js';

await saveGeneration(userId, {
  github_username: 'torvalds',
  template: 'professional',
  input: { name: 'Linus', role: 'Software Engineer' },
  readme: '# Linus Torvalds\n...',
  provider: 'openrouter',
  model: 'openai/gpt-4o-mini',
  generationTime: 2345
});
```

### Get Generation History

```javascript
import { getGenerationHistory } from './db/supabase.js';

const { generations, total } = await getGenerationHistory(userId, limit = 10, offset = 0);
console.log(`User has ${total} total generations`);
```

## Backup & Monitoring

### View Realtime Activity

Navigate to your Supabase dashboard:
- **Table Editor** → See all data
- **SQL Editor** → Run custom queries
- **Logs** → Monitor API activity
- **Webhooks** → Set up notifications

### Example Query: User Analytics

```sql
SELECT 
  COUNT(DISTINCT user_id) as total_users,
  COUNT(DISTINCT id) as total_generations,
  ROUND(AVG(generation_time_ms)) as avg_generation_time_ms,
  ROUND(AVG(EXTRACT(EPOCH FROM (NOW() - created_at)))) as avg_days_active
FROM generations;
```

### Example Query: Credit Usage

```sql
SELECT 
  u.github_username,
  u.credits_available,
  COUNT(ch.id) as transactions,
  SUM(ch.credits_amount) as total_used
FROM users u
LEFT JOIN credits_history ch ON u.id = ch.user_id
GROUP BY u.id, u.github_username
ORDER BY total_used DESC;
```

## Troubleshooting

### "Supabase not configured" Error

**Cause:** Missing environment variables
**Solution:** Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set in `.env`

### "Insufficient credits" Error

**Cause:** User has fewer credits than `CREDITS_PER_USE`
**Solution:** Credits reset daily at `CREDIT_RESET_HOUR` (default: UTC 00:00)

### RLS Policy Violations

**Cause:** Trying to access another user's data
**Solution:** RLS is working correctly. Make sure you're using the correct user ID.

### Connection Timeouts

**Cause:** Network issues or invalid Supabase URL
**Solution:** Check your SUPABASE_URL is correct (no trailing slashes)

## Next Steps

1. ✅ Database schema created
2. ✅ Backend integration ready
3. 📝 TODO: Update frontend to use generation history
4. 📝 TODO: Add UI for saved profiles
5. 📝 TODO: Create admin dashboard

