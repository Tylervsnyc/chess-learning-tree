import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Sign out from Supabase
  await supabase.auth.signOut();

  // Also manually clear auth cookies to be sure
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Get the origin for redirect
  const origin = request.nextUrl.origin;
  // Optional same-site return path (e.g. /box for the Chess Boxing shell).
  const next = request.nextUrl.searchParams.get('next');
  const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
  const response = NextResponse.redirect(`${origin}${dest}`);

  // Clear all Supabase auth cookies
  for (const cookie of allCookies) {
    if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
      response.cookies.delete(cookie.name);
    }
  }

  return response;
}

export async function POST(request: NextRequest) {
  return GET(request);
}
