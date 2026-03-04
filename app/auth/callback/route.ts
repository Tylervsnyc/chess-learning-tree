import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { createServiceClient } from '@/lib/supabase/service';
import { Welcome } from '@/lib/email/templates/Welcome';

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

async function sendWelcomeIfNew(userId: string, email: string, displayName: string) {
  if (!email) return;

  const supabase = createServiceClient();

  // Check if we already sent a welcome email to this user
  const { data: existing } = await supabase
    .from('email_log')
    .select('id')
    .eq('user_id', userId)
    .eq('email_type', 'welcome')
    .eq('status', 'sent')
    .limit(1);

  if (existing && existing.length > 0) return;

  const appUrl = getAppUrl();
  const unsubscribeUrl = getUnsubscribeUrl(userId);

  await sendEmail({
    to: email,
    userId,
    type: 'welcome',
    subject: 'Welcome to Chess Path!',
    react: Welcome({ displayName, appUrl, unsubscribeUrl }),
  });
}
