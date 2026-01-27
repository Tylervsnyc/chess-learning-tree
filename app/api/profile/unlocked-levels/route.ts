import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/profile/unlocked-levels
 *
 * Returns the user's unlocked levels array from their profile.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('unlocked_levels')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching unlocked levels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unlocked levels' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    unlockedLevels: profile?.unlocked_levels || [1],
  });
}
