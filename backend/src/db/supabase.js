import { supabaseAdmin } from '../utils/supabase.js';

const DAILY_CREDITS = parseInt(process.env.DAILY_CREDITS) || 30;
const CREDITS_PER_USE = parseInt(process.env.CREDITS_PER_USE) || 5;
const CREDIT_RESET_HOUR = parseInt(process.env.CREDIT_RESET_HOUR) || 0;

/**
 * Get or create a user and return their credit information
 */
export async function getOrCreateUser(userId, githubUsername, email = null) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  // Try to get existing user
  const { data: existingUser, error: selectError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    // Error other than "not found"
    throw selectError;
  }

  if (existingUser) {
    // Check if credits need reset
    return await checkAndResetCredits(existingUser);
  }

  // Create new user with full daily credits
  const { data: newUser, error: insertError } = await supabaseAdmin
    .from('users')
    .insert([
      {
        id: userId,
        github_username: githubUsername,
        email,
        credits_available: DAILY_CREDITS,
        credits_used: 0,
        last_credit_reset: new Date().toISOString(),
        total_generations: 0,
      },
    ])
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return newUser;
}

/**
 * Check if credits need to be reset and reset if necessary
 */
async function checkAndResetCredits(user) {
  const lastReset = new Date(user.last_credit_reset);
  const now = new Date();

  // Check if different day
  if (
    now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
    now.getUTCMonth() !== lastReset.getUTCMonth() ||
    now.getUTCDate() !== lastReset.getUTCDate()
  ) {
    // Reset credits
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({
        credits_available: DAILY_CREDITS,
        credits_used: 0,
        last_credit_reset: now.toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return updatedUser;
  }

  return user;
}

/**
 * Get current credits for a user
 */
export async function getCredits(userId) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('credits_available, last_credit_reset')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await checkAndResetCredits(user);

  const nextReset = new Date(updatedUser.last_credit_reset);
  nextReset.setUTCDate(nextReset.getUTCDate() + 1);
  nextReset.setUTCHours(CREDIT_RESET_HOUR, 0, 0, 0);

  return {
    credits: updatedUser.credits_available,
    resetAt: nextReset.toISOString(),
  };
}

/**
 * Deduct credits from a user's account
 */
export async function deductCredits(userId, generationId = null, reason = null) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  // Get current user
  const { data: user, error: getUserError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (getUserError) {
    throw getUserError;
  }

  if (!user) {
    throw new Error('User not found');
  }

  // Check sufficient credits
  if (user.credits_available < CREDITS_PER_USE) {
    throw new Error(`Insufficient credits. Need ${CREDITS_PER_USE}, have ${user.credits_available}`);
  }

  // Deduct credits
  const newCreditsAvailable = user.credits_available - CREDITS_PER_USE;
  const newCreditsUsed = user.credits_used + CREDITS_PER_USE;

  const { data: updatedUser, error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      credits_available: newCreditsAvailable,
      credits_used: newCreditsUsed,
      total_generations: user.total_generations + 1,
    })
    .eq('id', userId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  // Log credit transaction
  const { error: logError } = await supabaseAdmin
    .from('credits_history')
    .insert([
      {
        user_id: userId,
        action: 'deduction',
        credits_amount: CREDITS_PER_USE,
        balance_after: newCreditsAvailable,
        generation_id: generationId,
        reason: reason || 'README generation',
      },
    ]);

  if (logError) {
    console.error('Failed to log credit transaction:', logError);
  }

  return newCreditsAvailable;
}

/**
 * Save a generated README to the database
 */
export async function saveGeneration(userId, generationData) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  const { data: generation, error } = await supabaseAdmin
    .from('generations')
    .insert([
      {
        user_id: userId,
        github_username: generationData.github_username,
        profile_template: generationData.template,
        input_data: generationData.input,
        generated_readme: generationData.readme,
        credits_used: CREDITS_PER_USE,
        ai_provider: generationData.provider,
        ai_model: generationData.model,
        generation_time_ms: generationData.generationTime,
        status: 'completed',
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return generation;
}

/**
 * Get generation history for a user
 */
export async function getGenerationHistory(userId, limit = 10, offset = 0) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  const { data: generations, error, count } = await supabaseAdmin
    .from('generations')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return { generations, total: count };
}

/**
 * Get a specific generation by ID
 */
export async function getGeneration(generationId, userId) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  const { data: generation, error } = await supabaseAdmin
    .from('generations')
    .select('*')
    .eq('id', generationId)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return generation;
}
