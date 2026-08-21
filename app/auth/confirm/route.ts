import { createServerClient } from '@supabase/ssr';
import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * /auth/confirm — token-hash email link verification (recovery, signup
 * confirmation, magic link, email change).
 *
 * Why this exists: the PKCE ?code= links in Supabase's default email templates
 * only work in the SAME browser that started the flow (the verifier cookie
 * lives there). A reset requested inside the Chess Boxing shell or an IG
 * webview opens its email link in Safari → "PKCE code verifier not found".
 * A token_hash + verifyOtp exchange needs NO prior state, so the link works
 * in whatever browser the email opens in.
 *
 * Pair with email templates of the form:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
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

    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      return response;
    }

    console.error('[Auth Confirm] verifyOtp error:', error.message);
    const errorUrl = new URL('/auth/error', origin);
    errorUrl.searchParams.set('error', 'confirm_error');
    errorUrl.searchParams.set('error_description', error.message);
    return NextResponse.redirect(errorUrl.toString());
  }

  console.error('[Auth Confirm] Missing token_hash or type:', request.url);
  const errorUrl = new URL('/auth/error', origin);
  errorUrl.searchParams.set('error', 'invalid_request');
  errorUrl.searchParams.set('error_description', 'Invalid confirmation link');
  return NextResponse.redirect(errorUrl.toString());
}
