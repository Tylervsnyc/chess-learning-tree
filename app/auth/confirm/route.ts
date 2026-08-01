import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { EmailOtpType } from '@supabase/supabase-js';
import { sendWelcomeIfNew } from '@/lib/email/welcome';
import { FIRST_TOUCH_COOKIE, parseFirstTouch } from '@/lib/growth/first-touch';
import { stampFirstTouch } from '@/lib/growth/stamp-first-touch';

const OTP_TYPES: EmailOtpType[] = ['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email'];

// Email links may carry next={{ .RedirectTo }}, which is a FULL URL — and for
// flows that predate this route it points at /auth/callback?next=... (the PKCE
// endpoint that email links must no longer hit). Unwrap to a safe same-origin
// path and surface the inner ?ft= attribution param if present.
function resolveNext(rawNext: string | null, origin: string): { path: string; ft: string | null } {
  if (!rawNext) return { path: '/', ft: null };
  let url: URL;
  try {
    url = new URL(rawNext, origin);
  } catch {
    return { path: '/', ft: null };
  }
  if (url.origin !== origin) return { path: '/', ft: null };
  if (url.pathname === '/auth/callback') {
    const inner = url.searchParams.get('next');
    const ft = url.searchParams.get('ft');
    const resolved = resolveNext(inner, origin);
    return { path: resolved.path, ft: ft ?? resolved.ft };
  }
  return { path: url.pathname + url.search, ft: null };
}

// Verifies email links (signup confirmation, password recovery, magic link)
// via token_hash — stateless, so it works no matter which browser opens the
// email. The old path routed these through /auth/callback?code=..., a PKCE
// exchange that hard-fails when the link opens in a different browser than the
// one that started signup (e.g. signup inside an in-app webview, email opens
// in Safari). Requires the Supabase email templates to link here with
// {{ .TokenHash }} — see the Confirm signup / Reset password templates.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const rawType = searchParams.get('type');
  const type = OTP_TYPES.includes(rawType as EmailOtpType) ? (rawType as EmailOtpType) : null;
  const { path: next, ft } = resolveNext(searchParams.get('next'), origin);

  if (!tokenHash || !type) {
    console.error('[Auth Confirm] Missing token_hash or type:', request.url);
    const errorUrl = new URL('/auth/error', origin);
    errorUrl.searchParams.set('error', 'invalid_request');
    errorUrl.searchParams.set('error_description', 'The confirmation link was invalid or incomplete.');
    return NextResponse.redirect(errorUrl.toString());
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error, data } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) {
    console.error('[Auth Confirm] verifyOtp error:', error.message, error);
    const errorUrl = new URL('/auth/error', origin);
    errorUrl.searchParams.set('error', 'session_error');
    errorUrl.searchParams.set('error_description', error.message);
    return NextResponse.redirect(errorUrl.toString());
  }

  if (data.user) {
    const user = data.user;
    sendWelcomeIfNew(user.id, user.email ?? '', user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? 'Chess Player').catch(
      (err) => console.error('[Auth Confirm] Welcome email error:', err)
    );

    // CHE-387: cross-browser email confirmation means the signup page's
    // fire-and-forget stamp may never have run with a session. Same
    // new-vs-returning heuristic as /auth/callback.
    const created = user.created_at ? Date.parse(user.created_at) : 0;
    const lastSignIn = user.last_sign_in_at ? Date.parse(user.last_sign_in_at) : created;
    if (Math.abs(lastSignIn - created) < 60_000) {
      const firstTouch = parseFirstTouch(cookieStore.get(FIRST_TOUCH_COOKIE)?.value ?? ft);
      if (firstTouch) {
        await stampFirstTouch(user.id, firstTouch);
      }
    }
  }

  return response;
}
