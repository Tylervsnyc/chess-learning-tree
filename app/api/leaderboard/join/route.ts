import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * POST /api/leaderboard/join { code } — join a crew by its code.
 * Returns { crew: { id, name } } on success.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  if (!code) return NextResponse.json({ error: 'Enter a crew code.' }, { status: 400 });

  const svc = createServiceClient();
  // join_code is citext, so the lookup is case-insensitive.
  const { data: crew } = await svc
    .from('crews')
    .select('id, name')
    .eq('join_code', code)
    .maybeSingle();

  if (!crew) return NextResponse.json({ error: 'No crew with that code.' }, { status: 404 });

  const { error } = await svc
    .from('crew_members')
    .upsert(
      [{ crew_id: crew.id, user_id: user.id }],
      { onConflict: 'crew_id,user_id', ignoreDuplicates: true },
    );

  if (error) {
    console.error('crew join failed', error);
    return NextResponse.json({ error: 'Could not join crew.' }, { status: 500 });
  }

  return NextResponse.json({ crew: { id: crew.id, name: crew.name } });
}
