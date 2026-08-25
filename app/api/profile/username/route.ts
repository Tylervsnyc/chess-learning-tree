import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { validateUsername } from '@/lib/username/validate';

/**
 * Public handle for the leaderboards.
 *
 * GET  -> { username: string | null }
 * POST { username } -> sets it. Format, reserved names and the slur filter all
 *   live in lib/username/validate.ts (ONE source of truth, shared with the
 *   client so the two can never disagree); case-insensitive uniqueness is
 *   enforced by the citext UNIQUE constraint on write.
 */

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  return NextResponse.json({ username: data?.username ?? null });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body: { username?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  const check = validateUsername(body.username);
  if (!check.ok) {
    // Reserved reads as "taken" (409); a bad format or a blocked name is a 400.
    return NextResponse.json(
      { error: check.message },
      { status: check.problem === 'reserved' ? 409 : 400 },
    );
  }
  const raw = check.value;

  // Service client: set the handle and rely on the citext UNIQUE constraint to
  // reject case-insensitive collisions atomically (no read-then-write race).
  const svc = createServiceClient();
  const { error } = await svc
    .from('profiles')
    .update({ username: raw })
    .eq('id', user.id);

  if (error) {
    // 23505 = unique_violation → handle already taken.
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'That handle is taken.' }, { status: 409 });
    }
    console.error('username update failed', error);
    return NextResponse.json({ error: 'Could not save handle.' }, { status: 500 });
  }

  return NextResponse.json({ username: raw });
}
