import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { validateUsername } from '@/lib/username/validate';

/**
 * POST /api/profile/username/check  { username }
 *   -> { ok: true } | { ok: false, error: string }
 *
 * DELIBERATELY UNAUTHENTICATED. The Chess Boxing onboarding asks for the
 * fighter name BEFORE the account exists (username-first, 2026-08-25), so the
 * user needs to know "that one's taken" while they are still anonymous —
 * otherwise they'd fill in an email and a password and only then be told to
 * start over.
 *
 * This checks, never writes. The real write is POST /api/profile/username,
 * which re-validates and relies on the citext UNIQUE constraint — so a name
 * claimed between this check and that write still loses cleanly. Treat this
 * endpoint as advisory.
 *
 * Enumeration: handles are already public on every leaderboard, so
 * "is this taken" leaks nothing new. Validation runs BEFORE the DB read, so
 * malformed probes never reach the database.
 */
export async function POST(request: NextRequest) {
  let body: { username?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid body' }, { status: 400 });
  }

  const check = validateUsername(body.username);
  if (!check.ok) {
    return NextResponse.json({ ok: false, error: check.message });
  }

  const svc = createServiceClient();
  const { data, error } = await svc
    .from('profiles')
    .select('id')
    .ilike('username', check.value)
    .limit(1)
    .maybeSingle();

  if (error) {
    // Don't block the flow on a lookup failure — the write path is the real
    // gate. Say yes here and let the unique constraint have the last word.
    console.error('[username/check] lookup failed', error);
    return NextResponse.json({ ok: true });
  }

  if (data) {
    return NextResponse.json({ ok: false, error: 'That name is taken.' });
  }

  return NextResponse.json({ ok: true });
}
