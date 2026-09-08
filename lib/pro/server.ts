import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { isProSubscription, type SubscriptionStatus } from '@/lib/subscription';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

/**
 * Server-side "is this caller Pro?" — the ONE read every Pro-truncated API
 * route uses (Gate B: coach-review, workout/report-lines, workout/fixit).
 *
 * Pro = an active premium/trial subscription on `profiles` (the single source
 * of truth, see lib/subscription.ts) OR `is_admin`. Anonymous callers are not
 * Pro. Both auth transports work unchanged: cookies on the web and the bearer
 * token the offline iOS bundle sends (lib/supabase/server.ts handles both).
 *
 * Never throws and never blocks a route: any failure reads as "not Pro", and
 * the caller only ACTS on the answer when FEATURE_FLAGS.PRO is on — so with the
 * flag off this is an inert read that changes no response.
 */

export interface ProStatus {
  userId: string | null;
  isPro: boolean;
}

/** Profile read under the caller's own RLS (users can read their own row). */
export async function isProUser(supabase: SupabaseClient, userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_expires_at, is_admin')
      .eq('id', userId)
      .maybeSingle();
    if (!profile) return false;
    if (profile.is_admin === true) return true;
    return isProSubscription(
      (profile.subscription_status as SubscriptionStatus | null) ?? 'free',
      profile.subscription_expires_at ?? null,
    );
  } catch (err) {
    console.error('[pro] profile read failed', err);
    return false;
  }
}

/** Who is calling (cookie or bearer) and whether they are Pro. */
export async function getProStatus(): Promise<ProStatus> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { userId: null, isPro: false };
    return { userId: user.id, isPro: await isProUser(supabase, user.id) };
  } catch (err) {
    console.error('[pro] auth read failed', err);
    return { userId: null, isPro: false };
  }
}

/**
 * Should this response be cut down to the free preview? True only when the
 * Pro flag is ON and the caller is not Pro. With the flag off it is always
 * false — the auth read still runs (so the transport is exercised) but the
 * answer is never applied.
 */
export async function proLockApplies(status?: ProStatus): Promise<boolean> {
  const s = status ?? (await getProStatus());
  return FEATURE_FLAGS.PRO && !s.isPro;
}
