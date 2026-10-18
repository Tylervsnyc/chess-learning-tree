import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Rookie Pro — ONE free trial per person, across every app and storefront.
 *
 * Apple grants intro-offer trials per app (per subscription group), so the
 * same person could otherwise take three. We record trial use on the profile
 * (`profiles.pro_trial_used_at`, docs/rookie-pro-sql.sql) from both webhooks:
 * RevenueCat (period_type TRIAL) and Stripe (subscription status 'trialing').
 * The paywall reads it (no trial copy + the RevenueCat `no_trial` offering);
 * Stripe checkout skips `trial_period_days` when it is set.
 *
 * Defensive until the migration runs: a missing column reads as "not used"
 * and the write is a logged no-op — nothing else breaks.
 */

export async function hasUsedProTrial(supabase: SupabaseClient, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('pro_trial_used_at')
      .eq('id', userId)
      .maybeSingle();
    if (error || !data) return false;
    return !!(data as { pro_trial_used_at?: string | null }).pro_trial_used_at;
  } catch {
    return false;
  }
}

/**
 * Stamp the first trial (service-role client only — the column is guarded by
 * protect_privileged_profile_columns). Never overwrites an earlier stamp.
 */
export async function markProTrialUsed(service: SupabaseClient, userId: string): Promise<void> {
  try {
    const { error } = await service
      .from('profiles')
      .update({ pro_trial_used_at: new Date().toISOString() })
      .eq('id', userId)
      .is('pro_trial_used_at', null);
    if (error) console.warn('[pro-trial] mark skipped:', error.message);
  } catch (err) {
    console.error('[pro-trial] mark failed', err);
  }
}
