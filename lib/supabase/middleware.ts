import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Public paths that don't need auth checks - skip to avoid latency
const PUBLIC_PATHS = ['/', '/about', '/pricing', '/auth/', '/api/'];

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // Skip auth check for public paths - no need to hit Supabase
  const isPublicPath = PUBLIC_PATHS.some(path =>
    pathname === path || pathname.startsWith(path)
  );
  if (isPublicPath) {
    return supabaseResponse;
  }

  // Skip if Supabase env vars not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  // For protected routes, refresh the session
  let response = supabaseResponse;
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - ignore error when no session exists
  const { error } = await supabase.auth.getUser();
  if (error && error.name !== 'AuthSessionMissingError') {
    console.error('Auth error:', error);
  }

  return response;
}
