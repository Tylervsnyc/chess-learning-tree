import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * The caller's crew membership (settings screen).
 *
 * GET    -> { crew: { id, name } | null }   (first crew, same pick as the board)
 * DELETE -> leave that crew. { left: true, crew: { id, name } | null }
 *
 * Joining stays on POST /api/leaderboard/join (one implementation). The
 * service role is required here because crew_members has no RLS delete
 * policy — leaving, like joining, goes through the API.
 */

async function currentCrew(userId: string) {
  const svc = createServiceClient();
  const { data: membership } = await svc
    .from('crew_members')
    .select('crew_id')
    .eq('user_id', userId)
    .order('joined_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!membership) return null;

  const { data: crew } = await svc
    .from('crews')
    .select('id, name')
    .eq('id', membership.crew_id as string)
    .maybeSingle();
  return crew ? { id: crew.id as string, name: crew.name as string } : null;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  return NextResponse.json({ crew: await currentCrew(user.id) });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const crew = await currentCrew(user.id);
  if (!crew) return NextResponse.json({ left: false, crew: null });

  const svc = createServiceClient();
  const { error } = await svc
    .from('crew_members')
    .delete()
    .eq('crew_id', crew.id)
    .eq('user_id', user.id);

  if (error) {
    console.error('crew leave failed', error);
    return NextResponse.json({ error: 'Could not leave crew.' }, { status: 500 });
  }

  return NextResponse.json({ left: true, crew: await currentCrew(user.id) });
}
