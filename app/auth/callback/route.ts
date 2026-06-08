import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendWelcomeIfNew } from '@/lib/email/welcome';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Check if OAuth provider returned an error directly
  const oauthError = searchParams.get('error');
  const oauthErrorDescription = searchParams.get('error_description');

  if (oauthError) {
    console.error('[Auth Callback] OAuth error:', oauthError, oauthErrorDescription);
    const errorUrl = new URL('/auth/error', origin);
    errorUrl.searchParams.set('error', oauthError);
    if (oauthErrorDescription) {
      errorUrl.searchParams.set('error_description', oauthErrorDescription);
    }
    return NextResponse.redirect(errorUrl.toString());
  }

  if (code) {
    const cookieStore = await cookies();

    // Create a response that we'll add cookies to
    const response = NextResponse.redirect(`${origin}${next}`);

    // Create Supabase client that writes cookies to the response
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

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Auth Callback] Session exchange error:', error.message, error);
      const errorUrl = new URL('/auth/error', origin);
      errorUrl.searchParams.set('error', 'session_error');
      errorUrl.searchParams.set('error_description', error.message);
      return NextResponse.redirect(errorUrl.toString());
    }

    // Send welcome email to new users (fire-and-forget)
    if (data.user) {
      const user = data.user;
      sendWelcomeIfNew(user.id, user.email ?? '', user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? 'Chess Player').catch(
        (err) => console.error('[Auth Callback] Welcome email error:', err)
      );

      // CHE-366: the server is the source of truth for OAuth analytics. The
      // client can't reliably fire signup_completed/login_completed itself —
      // this server-callback flow emits INITIAL_SESSION (not SIGNED_IN) and the
      // IG in-app browser drops the localStorage hint. So we tell the landing
      // client what happened via the redirect URL and let it fire once.
      // Only for OAuth: email confirmations already fire their event on the
      // signup page, so tagging them here would double-count.
      const provider = user.app_metadata?.provider;
      if (provider === 'google' || provider === 'apple') {
        // New vs returning from two DB timestamps (clock-skew-free): a first
        // sign-in has last_sign_in_at ≈ created_at; a returning user's
        // created_at is far older than this sign-in.
        const created = user.created_at ? Date.parse(user.created_at) : 0;
        const lastSignIn = user.last_sign_in_at ? Date.parse(user.last_sign_in_at) : created;
        const isNewSignup = Math.abs(lastSignIn - created) < 60_000;

        const dest = new URL(next, origin);
        dest.searchParams.set('auth_event', isNewSignup ? 'signup' : 'login');
        dest.searchParams.set('auth_method', provider);
        response.headers.set('location', dest.toString());
      }
    }

    // Return the response with cookies attached
    return response;
  }

  // No code and no error - something weird happened
  console.error('[Auth Callback] No code or error in callback URL:', request.url);
  const errorUrl = new URL('/auth/error', origin);
  errorUrl.searchParams.set('error', 'invalid_request');
  errorUrl.searchParams.set('error_description', 'No authorization code received');
  return NextResponse.redirect(errorUrl.toString());
}

