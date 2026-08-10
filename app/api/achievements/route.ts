import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

/**
 * GET /api/achievements — the user's unlocked achievements for the trophy
 * case. Returns { achievements: AchievementRow[] } (the catalog — names,
 * lines, thresholds — lives in code; the client merges).
 *
 * POST /api/achievements — body { seenIds: string[] } marks unlock
 * animations as played. Goes through the service role because
 * user_achievements has no client UPDATE policy (writes are server-only by
 * design); the auth check scopes it to the caller's own rows.
 *
 * Both degrade to empty until the user_achievements migration runs.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!FEATURE_FLAGS.ACHIEVEMENTS) return NextResponse.json({ achievements: [] });

  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_id, tier, progress, unlocked_at, upgraded_at, seen')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false });

  if (error) {
    if (!/user_achievements/.test(error.message ?? '')) {
      console.error('achievements read failed', error);
    }
    return NextResponse.json({ achievements: [] });
  }

  return NextResponse.json({ achievements: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!FEATURE_FLAGS.ACHIEVEMENTS) return NextResponse.json({ ok: true });

  let body: { seenIds?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  const seenIds = Array.isArray(body.seenIds)
    ? body.seenIds.filter((v): v is string => typeof v === 'string' && v.length <= 64).slice(0, 50)
    : [];
  if (seenIds.length === 0) return NextResponse.json({ ok: true });

  const svc = createServiceClient();
  const { error } = await svc
    .from('user_achievements')
    .update({ seen: true })
    .eq('user_id', user.id)
    .in('achievement_id', seenIds);
  if (error && !/user_achievements/.test(error.message ?? '')) {
    console.error('achievements seen update failed', error);
  }
  return NextResponse.json({ ok: true });
}
