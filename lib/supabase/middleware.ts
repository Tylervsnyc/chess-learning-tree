import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { sharedCookieOptions } from '@/lib/supabase/cookie-domain';

// Public paths that don't need auth checks - skip to avoid latency
const PUBLIC_PATHS = ['/about', '/pricing', '/auth/', '/api/cron/', '/path', '/play', '/welcome'];

// SHARED_AUTH_COOKIE one-time migration marker (see migrateHostOnlyCookies).
const COOKIE_V2_MARKER = 'cp_cookie_v2';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// The hostname the cookies are being written for. On Vercel `host` is the
// real domain; x-forwarded-host wins if a proxy set it.
function requestHost(request: NextRequest) {
  return request.headers.get('x-forwarded-host') ?? request.nextUrl.hostname;
}

/**
 * Entry point: refresh the session, then (flag on) migrate legacy cookies.
 * The migration is applied to whichever response the session refresh
 * produced — a redirect from `/` or a plain pass-through — so it runs exactly
 * once per browser regardless of the first path hit.
 */
export async function updateSession(request: NextRequest) {
  const response = await refreshSession(request);
  return migrateHostOnlyCookies(request, response);
}

/**
 * SHARED_AUTH_COOKIE one-time cleanup.
 *
 * Before the flag, every `sb-*` auth cookie was host-only (no Domain
 * attribute). Once the flag is on, the same names get written with
 * `Domain=.chesspath.app`. Browsers treat those as TWO different cookies and
 * send BOTH on every request to chesspath.app; the Cookie header carries no
 * attributes, so our parser cannot tell them apart and may keep reading the
 * stale host-only one — the user would look signed in on chesspath.app while
 * run.chesspath.app sees the newer domain cookie, and the two sessions drift
 * (a sign-out on one would not take on the other). So the first request a
 * browser makes after the flag flips:
 *
 *   1. expires every `sb-*` cookie it sent as host-only (Max-Age=0, NO Domain —
 *      the attributes must match the original cookie for the browser to
 *      delete it),
 *   2. re-sets each one with the SAME value as a domain cookie, so the user is
 *      migrated, not signed out (skipped for names the session refresh above
 *      already wrote in this response),
 *   3. sets `cp_cookie_v2=1` for a year so this never runs again.
 *
 * Raw Set-Cookie headers, not `response.cookies.set`: Next's ResponseCookies
 * is a Map keyed by cookie NAME, so an expire and a re-set for the same name
 * would overwrite each other. `response.cookies.set` also rewrites the whole
 * Set-Cookie header from that map, so the marker goes through it FIRST and
 * the raw headers are appended after.
 *
 * Flag off, non-chesspath.app host, or marker present: the response is
 * returned untouched.
 */
function migrateHostOnlyCookies(request: NextRequest, response: NextResponse) {
  const cookieOptions = sharedCookieOptions(requestHost(request));
  if (!cookieOptions) return response;
  if (request.cookies.get(COOKIE_V2_MARKER)?.value === '1') return response;

  const legacy = request.cookies.getAll().filter(({ name }) => name.startsWith('sb-'));

  response.cookies.set(COOKIE_V2_MARKER, '1', {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
    secure: true,
  });

  for (const { name, value } of legacy) {
    const encoded = encodeURIComponent(value);
    response.headers.append(
      'set-cookie',
      `${name}=; Path=/; Max-Age=0; SameSite=Lax; Secure`
    );
    if (!response.cookies.get(name)) {
      response.headers.append(
        'set-cookie',
        `${name}=${encoded}; Domain=${cookieOptions.domain}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax; Secure`
      );
    }
  }

  return response;
}

// Redirect to `path` while PRESERVING the query string. The root redirect
// (/ -> /welcome) must carry ?utm_source=instagram&utm_medium=paid through, or
// the IG ad becomes unattributable: PostHog's first pageview would fire on the
// destination with no UTM, and isIgCohort() would never trip. (CHE-359)
function redirectPreservingQuery(path: string, request: NextRequest) {
  const url = new URL(path, request.url);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url);
}

async function refreshSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // SHARED_AUTH_COOKIE: Domain=.chesspath.app on chesspath.app hosts, else
  // undefined and the key is omitted (see lib/supabase/cookie-domain.ts).
  const cookieOptions = sharedCookieOptions(requestHost(request));
  const sharedCookies = cookieOptions ? { cookieOptions } : {};

  // Root path: check auth and redirect accordingly
  if (pathname === '/') {
    // Chess Boxing native shell: the cp_boxapp cookie (set by the shell's
    // head script on first launch) sends cold starts straight to /box
    // server-side — the web home never renders, so there's no flash.
    if (request.cookies.get('cp_boxapp')?.value === '1') {
      return redirectPreservingQuery('/box', request);
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return redirectPreservingQuery('/welcome', request);
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      ...sharedCookies,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return redirectPreservingQuery('/play', request);
    }
    return redirectPreservingQuery('/welcome', request);
  }

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
      ...sharedCookies,
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

  // Refresh session if expired - gracefully handle common auth errors
  try {
    const { error } = await supabase.auth.getUser();

    // These errors are expected when user is logged out or session expired
    const expectedErrors = [
      'AuthSessionMissingError',
      'AuthApiError', // Includes "Refresh Token Not Found"
    ];

    if (error && !expectedErrors.includes(error.name)) {
      console.error('Auth error:', error);
    }
  } catch (err) {
    // Catch any unexpected errors to prevent middleware from crashing
    console.error('Middleware auth error:', err);
  }

  return response;
}
