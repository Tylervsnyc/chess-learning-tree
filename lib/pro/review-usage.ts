import { createHash } from 'crypto';
import { createServiceClient } from '@/lib/supabase/service';
import { localDayStartISO } from '@/lib/pro/limits';
import { PRO_FREE_LIMITS } from '@/lib/subscription';

/**
 * Rookie Pro — "1 full game review a day" for free accounts (FEATURE_FLAGS.PRO).
 * Server only. Storage: `review_usage` (user_id, game_key, created_at), one row
 * per user + GAME — docs/rookie-pro-sql.sql. The game key is a hash of the
 * move list, so the two passes /play makes for one game (instant + deep) and
 * re-opening an already-reviewed game never cost a second review.
 *
 * Defensive until the migration runs: any read/write error (missing table)
 * reads as "allowed" — never block a review over the meter.
 */

export function reviewGameKey(playerColor: string, sans: string[]): string {
  return createHash('sha256').update(`${playerColor}|${sans.join(' ')}`).digest('hex').slice(0, 40);
}

/** May this free account get a full review of this game right now? */
export async function reviewAllowed(userId: string, gameKey: string, tz: string | null | undefined): Promise<boolean> {
  try {
    const db = createServiceClient();
    const seen = await db
      .from('review_usage')
      .select('user_id')
      .eq('user_id', userId)
      .eq('game_key', gameKey)
      .maybeSingle();
    if (seen.error) return true; // unmigrated → unmetered
    if (seen.data) return true; // this game was already reviewed — free to see again
    const today = await db
      .from('review_usage')
      .select('user_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', localDayStartISO(tz));
    if (today.error) return true;
    return (today.count ?? 0) < PRO_FREE_LIMITS.REVIEWS_PER_DAY;
  } catch (err) {
    console.error('[review-usage] check failed', err);
    return true;
  }
}

/** Record a delivered full review (idempotent per user + game). */
export async function recordReview(userId: string, gameKey: string): Promise<void> {
  try {
    const { error } = await createServiceClient()
      .from('review_usage')
      .upsert({ user_id: userId, game_key: gameKey }, { onConflict: 'user_id,game_key', ignoreDuplicates: true });
    if (error) console.warn('[review-usage] record skipped:', error.message);
  } catch (err) {
    console.error('[review-usage] record failed', err);
  }
}
