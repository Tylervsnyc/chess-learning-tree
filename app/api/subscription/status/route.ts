import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSubscriptionInfo } from '@/lib/subscription';
import { FREE_TIER } from '@/lib/stripe';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { hasUsedProTrial } from '@/lib/pro/trial';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        status: 'free',
        isPremium: false,
        isPatron: false,
        dailyPuzzlesUsed: 0,
        dailyPuzzlesRemaining: FREE_TIER.DAILY_PUZZLE_LIMIT,
        canSolvePuzzle: true,
        expiresAt: null,
        isAuthenticated: false,
      });
    }

    const [info, trialUsed] = await Promise.all([
      getSubscriptionInfo(supabase, user.id),
      // Rookie Pro: one trial per person across every app (paywall copy +
      // RevenueCat `no_trial` offering). Not read while PRO is off.
      FEATURE_FLAGS.PRO ? hasUsedProTrial(supabase, user.id) : Promise.resolve(false),
    ]);

    return NextResponse.json({
      ...info,
      isAuthenticated: true,
      ...(FEATURE_FLAGS.PRO ? { trialUsed, email: user.email ?? null } : {}),
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
