import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSubscriptionInfo } from '@/lib/subscription';
import { FREE_TIER } from '@/lib/stripe';

// TEST MODE: Give all users premium access
// Set to false before production launch with real payments
const TEST_MODE_ALL_PREMIUM = true;

export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      // Return free tier info for unauthenticated users
      // In test mode, still give premium features
      return NextResponse.json({
        status: TEST_MODE_ALL_PREMIUM ? 'premium' : 'free',
        isPremium: TEST_MODE_ALL_PREMIUM,
        dailyPuzzlesUsed: 0,
        dailyPuzzlesRemaining: TEST_MODE_ALL_PREMIUM ? 999 : FREE_TIER.DAILY_PUZZLE_LIMIT,
        canSolvePuzzle: true,
        expiresAt: null,
        isAuthenticated: false,
      });
    }

    // In test mode, override subscription info to premium
    if (TEST_MODE_ALL_PREMIUM) {
      return NextResponse.json({
        status: 'premium',
        isPremium: true,
        dailyPuzzlesUsed: 0,
        dailyPuzzlesRemaining: 999,
        canSolvePuzzle: true,
        expiresAt: null,
        isAuthenticated: true,
      });
    }

    const info = await getSubscriptionInfo(supabase, user.id);

    return NextResponse.json({
      ...info,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
