import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildLimits, countToday, ZERO_COUNTS } from '@/lib/pro/limits';
import { isProUser } from '@/lib/pro/server';

/**
 * GET /api/pro/limits?tz=America/New_York
 *
 * { lessonsToday, reviewsToday, boutsToday, workoutsToday, …Limit,
 *   isPro, canLesson, canReview, canBout, canWorkout, authenticated }
 *
 * Read-only truth for the Rookie Pro free limits (FEATURE_FLAGS.PRO; the
 * client only calls this while the flag is on — hooks/useProGate). Counted
 * per local day by lib/pro/limits.ts. Logged-out users get "unlimited": the
 * limit is a reason to buy Pro, not a reason to bounce a cold visitor.
 * Admins count as Pro (isProUser), same as every Pro-gated route.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const open = buildLimits(ZERO_COUNTS, true);
  if (!user) return NextResponse.json({ ...open, isPro: false, authenticated: false });

  if (await isProUser(supabase, user.id)) return NextResponse.json({ ...open, authenticated: true });

  const tz = request.nextUrl.searchParams.get('tz');
  const counts = await countToday(supabase, user.id, tz);
  return NextResponse.json({ ...buildLimits(counts, false), authenticated: true });
}
