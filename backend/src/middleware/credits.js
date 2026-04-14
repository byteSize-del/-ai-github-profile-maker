import { getCredits as getCreditsFromMemory, deductCredits as deductCreditsFromMemory } from '../db/credits.js';
import { isSupabaseConfigured } from '../utils/supabase.js';
import { getCredits as getCreditsFromSupabase, deductCredits as deductCreditsFromSupabase } from '../db/supabase.js';

const CREDITS_PER_USE = parseInt(process.env.CREDITS_PER_USE) || 15;

async function getCreditsHybrid(userId) {
  if (isSupabaseConfigured()) {
    try {
      return await getCreditsFromSupabase(userId);
    } catch (error) {
      console.error('Supabase credit check failed, falling back to memory:', error.message);
      return getCreditsFromMemory(userId);
    }
  }
  return getCreditsFromMemory(userId);
}

export async function checkCredits(req, res, next) {
  try {
    const userId = req.userId || req.body?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { credits, resetAt } = await getCreditsHybrid(userId);
    if (credits < CREDITS_PER_USE) {
      return res.status(429).json({
        error: `Insufficient credits. Need ${CREDITS_PER_USE} credits per generation.`,
        resetAt,
        creditsRemaining: credits,
        creditsPerUse: CREDITS_PER_USE,
      });
    }
    next();
  } catch (error) {
    console.error('Credit check error:', error);
    res.status(500).json({ error: 'Failed to check credits' });
  }
}

export async function deductCredits(userId, generationId = null) {
  if (isSupabaseConfigured()) {
    try {
      return await deductCreditsFromSupabase(userId, generationId);
    } catch (error) {
      console.error('Supabase credit deduction failed:', error.message);
      return deductCreditsFromMemory(userId);
    }
  }
  return deductCreditsFromMemory(userId);
}
