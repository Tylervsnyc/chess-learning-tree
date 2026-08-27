import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

/**
 * The request-scoped Supabase client every API route authenticates with.
 *
 * TWO auth transports, same privileges:
 *
 *   cookies (web)  — the @supabase/ssr session cookies on chesspath.app,
 *                    refreshed by middleware. Unchanged.
 *   bearer (app)   — an `Authorization: Bearer <access_token>` header.
 *
 * The bearer path exists for the Chess Boxing iOS app. Its pages are served
 * from the device at `capacitor://localhost`, so calls to chesspath.app are
 * cross-origin and WKWebView will not send our cookies — a cookie-only API is
 * unreachable from the app no matter how good the signal is. supabase-js keeps
 * the session on the client anyway, so the app sends the access token it
 * already holds and the server verifies it.
 *
 * This grants nothing extra: Supabase verifies the JWT signature and every
 * query still runs under that user's RLS policies, exactly as with a cookie.
 * The service-role client (lib/supabase/service.ts) remains the only way to
 * bypass RLS and is untouched by this.
 */
export async function createClient() {
  const authorization = (await headers()).get('authorization');

  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.slice('Bearer '.length);

    const client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        // No cookie jar on this transport: the token is the whole session, and
        // there is nowhere to write a refreshed one back to. The client owns
        // refresh and sends a fresh token on the next call.
        cookies: { getAll: () => [], setAll: () => {} },
        // Data queries (PostgREST) send this header as-is, so RLS sees the user.
        global: { headers: { Authorization: authorization } },
      }
    );

    // The global header covers DATA requests only. `auth.getUser()` with no
    // argument ignores it and reads the (empty) cookie session instead, which
    // made every route 401 a perfectly valid token — indistinguishable from a
    // forged one in testing, which is exactly how it slipped through. Passing
    // the token explicitly makes getUser() verify THIS token with Supabase.
    // All 42 API routes call getUser() bare, so this is wired once, here.
    const bareGetUser = client.auth.getUser.bind(client.auth);
    client.auth.getUser = (jwt?: string) => bareGetUser(jwt ?? token);

    return client;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
