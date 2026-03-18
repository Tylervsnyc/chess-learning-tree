import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeIfNew } from '@/lib/email/welcome';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const displayName =
    user.user_metadata?.display_name ??
    user.user_metadata?.full_name ??
    'Chess Player';

  try {
    await sendWelcomeIfNew(user.id, user.email, displayName);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Welcome Email] Error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
