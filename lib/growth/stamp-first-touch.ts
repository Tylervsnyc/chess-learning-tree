import { createServiceClient } from '@/lib/supabase/service';
import type { FirstTouch } from './first-touch';

/**
 * Write first-touch attribution onto a new user's profiles row (CHE-387).
 * Server-only (service client — the profiles UPDATE trigger that protects
 * privileged columns doesn't cover these, but RLS would block anon writes).
 *
 * Only stamps if the profile has never been stamped (first_touch_at IS NULL) —
 * first touch is frozen, matching PostHog $initial_utm semantics. Never throws:
 * attribution is best-effort and must not break a signup. Forward-compatible
 * with the migration not yet applied (logs and moves on if the columns are
 * missing — supabase/migrations/2026-06-10-first-touch-attribution.sql).
 */
export async function stampFirstTouch(userId: string, firstTouch: FirstTouch): Promise<void> {
  try {
    const service = createServiceClient();
    const { error } = await service
      .from('profiles')
      .update({
        first_touch_source: firstTouch.source || null,
        first_touch_medium: firstTouch.medium || null,
        first_touch_campaign: firstTouch.campaign || null,
        first_touch_referrer: firstTouch.referrer || null,
        first_touch_at: firstTouch.landed_at,
      })
      .eq('id', userId)
      .is('first_touch_at', null);

    if (error) {
      // 42703 / PGRST204 = first_touch_* columns not migrated yet.
      console.warn('[first-touch] stamp failed:', error.code, error.message);
    }
  } catch (err) {
    console.warn('[first-touch] stamp error:', err);
  }
}
