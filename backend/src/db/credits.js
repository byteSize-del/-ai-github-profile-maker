// In-memory credit storage (use Redis in production)
const creditStore = new Map();

const DAILY_CREDITS = parseInt(process.env.DAILY_CREDITS) || 30;
const CREDITS_PER_USE = parseInt(process.env.CREDITS_PER_USE) || 15;
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
  
  if (userCredits.count < CREDITS_PER_USE) {
    throw new Error(`Insufficient credits. Need ${CREDITS_PER_USE} credits per use.`);
  }
  
  userCredits.count -= CREDITS_PER_USE;
  creditStore.set(userId, userCredits);
  
  return userCredits.count;
}

export function resetCredits(userId) {
  creditStore.delete(userId);
}
