import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSubscriptionInfo } from '@/lib/subscription';
import { FREE_TIER } from '@/lib/stripe';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      // Return free tier info for unauthenticated users
      return NextResponse.json({
        status: 'free',
        isPremium: false,
        dailyPuzzlesUsed: 0,
        dailyPuzzlesRemaining: FREE_TIER.DAILY_PUZZLE_LIMIT,
        canSolvePuzzle: true,
        expiresAt: null,
        isAuthenticated: false,
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
