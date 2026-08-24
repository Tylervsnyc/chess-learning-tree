import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * POST /api/profile/move-quality  { brilliant: number, great: number }
 *
 * Increments profiles.total_brilliant_moves / total_great_moves for the
 * signed-in user via the `increment_move_quality` RPC (service role — the
 * profiles table is RLS-guarded). Called by GameSession.end() after a
 * /play game is analyzed. Always returns 200 so a missing migration never
 * surfaces as a client error; failures are logged.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body: { brilliant?: unknown; great?: unknown } = {};
  try { body = await req.json(); } catch { /* empty body */ }
  const clamp = (v: unknown) => Math.max(0, Math.min(200, Math.floor(Number(v) || 0)));
  const brilliant = clamp(body.brilliant);
  const great = clamp(body.great);
  if (brilliant === 0 && great === 0) return NextResponse.json({ ok: true, skipped: true });

  try {
    const service = createServiceClient();
    const { error } = await service.rpc('increment_move_quality', {
      p_user_id: user.id,
      p_brilliant: brilliant,
      p_great: great,
    });
    if (error) {
      console.warn('increment_move_quality failed (migration pending?):', error.message);
      return NextResponse.json({ ok: false, error: error.message });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.warn('move-quality route error:', err);
    return NextResponse.json({ ok: false });
  }
}
