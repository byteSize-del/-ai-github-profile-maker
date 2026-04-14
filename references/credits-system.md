# Credits System — Complete Implementation

## In-Memory Credit Store (`src/db/credits.js`)

```js
// In-memory credit storage (use Redis in production)
const creditStore = new Map();

const DAILY_CREDITS = parseInt(process.env.DAILY_CREDITS) || 50;
const CREDIT_RESET_HOUR = parseInt(process.env.CREDIT_RESET_HOUR) || 0;

function getMidnightUTC() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(CREDIT_RESET_HOUR, 0, 0, 0);
  
  // If we're past midnight, move to next day
  if (now >= midnight) {
    midnight.setUTCDate(midnight.getUTCDate() + 1);
  }
  
  return midnight.toISOString();
}

function isResetNeeded(lastReset) {
  if (!lastReset) return true;
  
  const now = new Date();
  const lastResetDate = new Date(lastReset);
  
  // Reset if different day
  return (
    now.getUTCFullYear() !== lastResetDate.getUTCFullYear() ||
    now.getUTCMonth() !== lastResetDate.getUTCMonth() ||
    now.getUTCDate() !== lastResetDate.getUTCDate()
  );
}

export function getCredits(userId) {
  const now = new Date();
  let userCredits = creditStore.get(userId);
  
  if (!userCredits) {
    // New user, initialize with full credits
    userCredits = {
      count: DAILY_CREDITS,
      lastReset: now.toISOString(),
    };
    creditStore.set(userId, userCredits);
  } else if (isResetNeeded(userCredits.lastReset)) {
    // Reset credits for new day
    userCredits.count = DAILY_CREDITS;
    userCredits.lastReset = now.toISOString();
    creditStore.set(userId, userCredits);
  }
  
  return {
    credits: userCredits.count,
    resetAt: getMidnightUTC(),
  };
}

export function deductCredits(userId) {
  const userCredits = creditStore.get(userId);
  
  if (!userCredits) {
    throw new Error('User not found in credit store');
  }
  
  if (userCredits.count <= 0) {
    throw new Error('No credits remaining');
  }
  
  userCredits.count -= 1;
  creditStore.set(userId, userCredits);
  
  return userCredits.count;
}

export function resetCredits(userId) {
  creditStore.delete(userId);
}

// For debugging/admin purposes
export function getAllCredits() {
  return Object.fromEntries(creditStore);
}
```

## Credit Rules Summary

| Rule | Value |
|------|-------|
| Credits per day | 50 |
| Reset time | Midnight UTC (configurable via CREDIT_RESET_HOUR) |
| Credits per generation | 1 |
| User identification | UUID (stored in localStorage on frontend) |
| Storage | In-memory Map (dev) / Redis (prod) |

## Credit Middleware Flow

1. Extract `userId` from request body
2. Load user's credit record using `getCredits(userId)`
3. Check if reset is needed (new day) → reset to 50 if needed
4. If `credits <= 0` → return `429 { error: 'No credits remaining', resetAt }`
5. Deduct 1 credit using `deductCredits(userId)`
6. Attach `creditsRemaining` to response
7. Call `next()`

## Redis Migration (Production)

To migrate to Redis in production:

```js
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', err => console.error('Redis error:', err));
await redis.connect();

async function getCreditsRedis(userId) {
  const key = `credits:${userId}`;
  const data = await redis.get(key);
  
  if (!data) {
    // Initialize new user
    await redis.set(key, JSON.stringify({
      count: DAILY_CREDITS,
      lastReset: new Date().toISOString(),
    }));
    return { credits: DAILY_CREDITS, resetAt: getMidnightUTC() };
  }
  
  const userCredits = JSON.parse(data);
  
  if (isResetNeeded(userCredits.lastReset)) {
    userCredits.count = DAILY_CREDITS;
    userCredits.lastReset = new Date().toISOString();
    await redis.set(key, JSON.stringify(userCredits));
  }
  
  return { credits: userCredits.count, resetAt: getMidnightUTC() };
}
```

## Credit Reset Logic

- Credits reset automatically at midnight UTC (or configured hour)
- On first request after midnight, user gets full 50 credits
- No manual reset needed — it's automatic based on date comparison
