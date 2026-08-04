import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * Global-leaderboard visibility (profiles.leaderboard_opt_in — the column the
 * board API already honors for scope=global; crew boards always show members).
 *
 * GET  -> { optIn: boolean }
 * POST { optIn: boolean } -> sets it.
 */

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { data } = await supabase
    .from('profiles')
    .select('leaderboard_opt_in')
    .eq('id', user.id)
    .single();

  return NextResponse.json({ optIn: (data?.leaderboard_opt_in as boolean | null) ?? true });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body: { optIn?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  if (typeof body.optIn !== 'boolean') {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  // Service client, matching the username route: profiles writes from API
  // routes go through the service role (leaderboard_opt_in is not one of the
  // privileged columns guarded by protect_privileged_profile_columns).
  const svc = createServiceClient();
  const { error } = await svc
    .from('profiles')
    .update({ leaderboard_opt_in: body.optIn })
    .eq('id', user.id);

  if (error) {
    console.error('leaderboard opt-in update failed', error);
    return NextResponse.json({ error: 'Could not save.' }, { status: 500 });
  }

  return NextResponse.json({ optIn: body.optIn });
}
