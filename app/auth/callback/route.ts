import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Auth Callback] Session exchange error:', error.message, error);
    }

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Pass the error to the error page
    const errorUrl = new URL('/auth/error', origin);
    errorUrl.searchParams.set('error', 'session_error');
    errorUrl.searchParams.set('error_description', error.message);
    return NextResponse.redirect(errorUrl.toString());
  }

  // No code and no error - something weird happened
  console.error('[Auth Callback] No code or error in callback URL:', request.url);
  const errorUrl = new URL('/auth/error', origin);
  errorUrl.searchParams.set('error', 'invalid_request');
  errorUrl.searchParams.set('error_description', 'No authorization code received');
  return NextResponse.redirect(errorUrl.toString());
}
