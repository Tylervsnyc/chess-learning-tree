/**
 * Instagram Login API token longevity.
 *
 * Short-lived/initial tokens last ~60 days. To stay alive forever we:
 *   1. exchange the current token for a long-lived (60-day) one (once), and
 *   2. refresh it on every daily run (refresh requires the token be >24h old
 *      and <60 days old; Instagram extends it another 60 days each call).
 *
 * Needs: IG_ACCESS_TOKEN, IG_APP_SECRET  (IG_APP_ID is public: 963407800027454)
 *
 * Because Vercel cron functions can't persist a new token back to env at
 * runtime, the daily job calls refreshAndPersist() which pushes the refreshed
 * token to Vercel env via the API and updates the local .env.local when run
 * locally. For now the daily job just refreshes in-memory and logs; rotating
 * the stored secret is a manual `npx tsx scripts/ig-refresh-token.ts` step.
 */
const BASE = 'https://graph.instagram.com';

/** One-time: turn the initial token into a 60-day long-lived token. */
export async function exchangeForLongLived(token: string, appSecret: string): Promise<{ token: string; expiresInSec: number }> {
  const url = new URL(`${BASE}/access_token`);
  url.searchParams.set('grant_type', 'ig_exchange_token');
  url.searchParams.set('client_secret', appSecret);
  url.searchParams.set('access_token', token);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(`exchange failed: ${res.status} ${JSON.stringify(json)}`);
  return { token: json.access_token, expiresInSec: json.expires_in };
}

/** Recurring: extend a long-lived token another 60 days. Token must be >24h old. */
export async function refreshLongLived(token: string): Promise<{ token: string; expiresInSec: number }> {
  const url = new URL(`${BASE}/refresh_access_token`);
  url.searchParams.set('grant_type', 'ig_refresh_token');
  url.searchParams.set('access_token', token);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(`refresh failed: ${res.status} ${JSON.stringify(json)}`);
  return { token: json.access_token, expiresInSec: json.expires_in };
}
