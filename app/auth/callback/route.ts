import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/learn';

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

    // Log success for debugging
    console.log('[Auth Callback] Session established for user:', data.user?.email);
    console.log('[Auth Callback] Cookies being set:', response.cookies.getAll().map(c => c.name));

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
