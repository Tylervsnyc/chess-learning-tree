import { SupabaseClient } from '@supabase/supabase-js';
import { FREE_TIER } from './stripe';

export type SubscriptionStatus = 'free' | 'premium' | 'trial';

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  isPremium: boolean;
  dailyPuzzlesUsed: number;
  dailyPuzzlesRemaining: number;
  canSolvePuzzle: boolean;
  expiresAt: string | null;
}

/**
 * Check if a user has an active premium subscription
 */
export function isPremiumSubscription(
  status: SubscriptionStatus | null | undefined,
  expiresAt: string | null | undefined
): boolean {
  if (!status || status === 'free') return false;
  if (status === 'premium' || status === 'trial') {
    // Check if not expired
    if (expiresAt) {
      return new Date(expiresAt) > new Date();
    }
    return true;
  }
  return false;
}

/**
 * Get the count of puzzles attempted today for a user
 */
export async function getDailyPuzzleCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { count, error } = await supabase
    .from('puzzle_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00.000Z`)
    .lt('created_at', `${today}T23:59:59.999Z`);

  if (error) {
    console.error('Error getting daily puzzle count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Get full subscription info for a user
 */
export async function getSubscriptionInfo(
  supabase: SupabaseClient,
  userId: string
): Promise<SubscriptionInfo> {
  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_expires_at')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    // Default to free if no profile
    return {
      status: 'free',
      isPremium: false,
      dailyPuzzlesUsed: 0,
      dailyPuzzlesRemaining: FREE_TIER.DAILY_PUZZLE_LIMIT,
      canSolvePuzzle: true,
      expiresAt: null,
    };
  }

  const status = profile.subscription_status as SubscriptionStatus || 'free';
  const expiresAt = profile.subscription_expires_at;
  const isPremium = isPremiumSubscription(status, expiresAt);

  // If premium, no need to count puzzles
  if (isPremium) {
    return {
      status,
      isPremium: true,
      dailyPuzzlesUsed: 0,
      dailyPuzzlesRemaining: Infinity,
      canSolvePuzzle: true,
      expiresAt,
    };
  }

  // For free users, count daily puzzles
  const dailyPuzzlesUsed = await getDailyPuzzleCount(supabase, userId);
  const dailyPuzzlesRemaining = Math.max(0, FREE_TIER.DAILY_PUZZLE_LIMIT - dailyPuzzlesUsed);

  return {
    status,
    isPremium: false,
    dailyPuzzlesUsed,
    dailyPuzzlesRemaining,
    canSolvePuzzle: dailyPuzzlesRemaining > 0,
    expiresAt,
  };
}

/**
 * Check if user can solve another puzzle (for rate limiting)
 * Returns true if allowed, false if limit reached
 */
export async function canUserSolvePuzzle(
  supabase: SupabaseClient,
  userId: string | null
): Promise<{ allowed: boolean; info: SubscriptionInfo | null }> {
  // Anonymous users can browse without limits (for demo purposes)
  if (!userId) {
    return { allowed: true, info: null };
  }

  const info = await getSubscriptionInfo(supabase, userId);
  return { allowed: info.canSolvePuzzle, info };
}
