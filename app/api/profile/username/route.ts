import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * Public handle for the leaderboards.
 *
 * GET  -> { username: string | null }
 * POST { username } -> sets it (3–20 chars, letters/numbers/underscore),
 *   case-insensitively unique (profiles.username is citext unique).
 */

const RE = /^[a-zA-Z0-9_]{3,20}$/;
// Reserved / would-be-confusing handles. Mirrored in the profiles
// username_format CHECK constraint (2026-07-31-leaderboards.sql) — keep in sync.
const RESERVED = new Set([
  'admin', 'rookie', 'chesspath', 'chessboxing', 'you', 'me',
  'mod', 'moderator', 'staff', 'support', 'official', 'gleasons',
]);

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

  const raw = typeof body.username === 'string' ? body.username.trim() : '';
  if (!RE.test(raw)) {
    return NextResponse.json(
      { error: '3–20 characters, letters, numbers or underscore.' },
      { status: 400 },
    );
  }
  if (RESERVED.has(raw.toLowerCase())) {
    return NextResponse.json({ error: 'That handle is taken.' }, { status: 409 });
  }

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
