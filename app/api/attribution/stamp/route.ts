import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { FIRST_TOUCH_COOKIE, parseFirstTouch } from '@/lib/growth/first-touch';
import { stampFirstTouch } from '@/lib/growth/stamp-first-touch';

/**
 * CHE-387: stamp first-touch attribution onto a fresh signup's profile.
 *
 * The email signup paths create the account client-side (supabase.auth.signUp)
 * and never pass through /auth/callback, so they call this fire-and-forget
 * right after signup. Reads the cp_first_touch cookie server-side and writes
 * it via the service client (only if the profile was never stamped).
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only fresh accounts: an old user hitting this would get today's cookie
  // stamped as their "first touch", which would be a lie.
  const accountAgeMs = Date.now() - (user.created_at ? Date.parse(user.created_at) : 0);
  if (!user.created_at || accountAgeMs > 24 * 60 * 60 * 1000) {
    return NextResponse.json({ skipped: 'not_new' });
  }

  const cookieStore = await cookies();
  const firstTouch = parseFirstTouch(cookieStore.get(FIRST_TOUCH_COOKIE)?.value);
  if (!firstTouch) {
    return NextResponse.json({ skipped: 'no_cookie' });
  }

  await stampFirstTouch(user.id, firstTouch);
  return NextResponse.json({ success: true });
}
