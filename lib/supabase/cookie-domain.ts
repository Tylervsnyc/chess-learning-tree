import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

/**
 * One web login across chesspath.app and run.chesspath.app (plan 1.4).
 *
 * Both sites use @supabase/ssr against the same Supabase project, but a cookie
 * set by one host is invisible to the other, so a user signs in twice. Behind
 * `SHARED_AUTH_COOKIE`, every Supabase auth cookie is written with
 * `Domain=.chesspath.app`, which the browser sends to every host under it.
 *
 * Gated on the hostname the cookie is being written FOR: only chesspath.app
 * and its subdomains. On localhost or a *.vercel.app preview a Domain attribute
 * for a different site is rejected by the browser outright, so those keep the
 * default host-only cookie. Native shells never reach this (they use the
 * localStorage transport / bearer tokens).
 *
 * Returns `undefined` when the shared cookie should NOT be used — callers must
 * then omit `cookieOptions` entirely so the flag-off path is byte-identical to
 * today.
 */
export const SHARED_COOKIE_DOMAIN = '.chesspath.app';

export type SharedCookieOptions = {
  domain: string;
  sameSite: 'lax';
  secure: boolean;
  path: string;
};

export function isSharedCookieHost(hostname: string | null | undefined): boolean {
  if (!hostname) return false;
  const host = hostname.toLowerCase().split(':')[0];
  return host === 'chesspath.app' || host.endsWith('.chesspath.app');
}

export function sharedCookieOptions(
  hostname: string | null | undefined
): SharedCookieOptions | undefined {
  if (!FEATURE_FLAGS.SHARED_AUTH_COOKIE) return undefined;
  if (!isSharedCookieHost(hostname)) return undefined;
  return { domain: SHARED_COOKIE_DOMAIN, sameSite: 'lax', secure: true, path: '/' };
}
