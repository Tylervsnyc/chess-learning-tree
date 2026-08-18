import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * POST /api/account/delete — permanently delete the caller's account.
 *
 * Apple guideline 5.1.1(v): apps with account creation must offer in-app
 * account deletion. Auth via the session cookie; deletes with the service
 * role. Every user-owned table has ON DELETE CASCADE from auth.users (or
 * from profiles, which cascades from auth.users), so `auth.admin.deleteUser`
 * is what actually clears the data — the explicit deletes below are a
 * belt-and-braces pass in case the live DB has drifted from the migrations.
 *
 * Billing is NEVER touched here (rule: never touch live Stripe without Tyler).
 * If the user had a subscription we log a warning and report it in the
 * response so it can be handled by hand.
 */

// Tables keyed by user_id (best-effort; missing tables are ignored).
const TABLES_BY_USER_ID = [
  'lesson_progress',
  'puzzle_attempts',
  'puzzle_history',
  'quip_history',
  'daily_challenge_results',
  'level_test_attempts',
  'game_sessions', // session_moves cascade from game_sessions
  'workout_sessions',
  'workout_celebrations',
  'workout_seen_puzzles',
  'bout_sessions',
  'opening_progress',
  'run_completions',
  'user_achievements',
  'push_subscriptions',
  'crew_members',
  'repertoire_trees',
  'repertoire_diagnoses',
  'srs_cards',
  'speech_memory',
  'ai_usage',
  'email_preferences',
  'email_log',
] as const;

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const userId = user.id;
  const service = createServiceClient();

  // Check for a subscription so it can be flagged (never touched).
  const { data: profile } = await service
    .from('profiles')
    .select('subscription_status, stripe_customer_id, is_patron')
    .eq('id', userId)
    .maybeSingle();
  const hadSubscription =
    profile?.subscription_status === 'premium' ||
    profile?.is_patron === true ||
    !!profile?.stripe_customer_id;
  if (hadSubscription) {
    console.warn(
      `[account/delete] user ${userId} (${user.email}) had billing data ` +
        `(status=${profile?.subscription_status}, patron=${profile?.is_patron}, ` +
        `stripe_customer=${profile?.stripe_customer_id}). Stripe NOT touched — cancel manually.`,
    );
  }

  // Best-effort explicit deletes (cascades should already cover these).
  for (const table of TABLES_BY_USER_ID) {
    const { error } = await service.from(table).delete().eq('user_id', userId);
    if (error && !/does not exist|relation|schema cache/i.test(error.message)) {
      console.warn(`[account/delete] ${table}: ${error.message}`);
    }
  }
  await service.from('profiles').delete().eq('id', userId);

  // The real deletion — removes the auth user and cascades everything else.
  const { error: authError } = await service.auth.admin.deleteUser(userId);
  if (authError) {
    console.error('[account/delete] auth.admin.deleteUser failed', authError);
    return NextResponse.json({ error: 'Could not delete account' }, { status: 500 });
  }

  // Sign out + clear session cookies (same approach as /api/auth/logout).
  await supabase.auth.signOut().catch(() => {});
  const response = NextResponse.json({ ok: true, hadSubscription });
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
      response.cookies.delete(cookie.name);
    }
  }
  return response;
}
