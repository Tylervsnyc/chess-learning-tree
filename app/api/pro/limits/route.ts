import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isProSubscription, type SubscriptionStatus } from '@/lib/subscription';
import { buildLimits, countToday } from '@/lib/pro/limits';

/**
 * GET /api/pro/limits?tz=America/New_York
 *
 * { boutsToday, workoutsToday, boutLimit, workoutLimit, isPro, canBout, canWorkout }
 *
 * Read-only truth for the Chess Boxing Pro free limits (CHESSBOXING_PRO).
 * The client gate (hooks/useProGate) asks this before launching a bout or a
 * workout. Logged-out users get "unlimited": the limit is a reason to buy Pro,
 * not a reason to bounce a cold visitor before their first fight.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const open = buildLimits({ boutsToday: 0, workoutsToday: 0 }, true);
  if (!user) return NextResponse.json({ ...open, isPro: false, authenticated: false });

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_expires_at')
    .eq('id', user.id)
    .single();
  const isPro = isProSubscription(
    (profile?.subscription_status as SubscriptionStatus | null) ?? 'free',
    profile?.subscription_expires_at ?? null,
  );
  if (isPro) return NextResponse.json({ ...open, authenticated: true });

  const tz = request.nextUrl.searchParams.get('tz');
  const counts = await countToday(supabase, user.id, tz);
  return NextResponse.json({ ...buildLimits(counts, false), authenticated: true });
}
