import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const raw = typeof body?.name === 'string' ? body.name : '';
  const name = raw.trim().slice(0, 40);

  if (!name) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: name })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating display_name:', error);
    return NextResponse.json(
      { error: 'Failed to update display name' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
