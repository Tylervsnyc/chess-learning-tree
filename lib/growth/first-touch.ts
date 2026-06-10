import type { NextRequest, NextResponse } from 'next/server';

/**
 * First-touch attribution (CHE-387).
 *
 * PostHog can't attribute IG one-tap OAuth signups: the IG in-app browser ->
 * system browser handoff during Google/Apple OAuth returns the user as a fresh
 * person ($initial_referring_domain = $direct), so the funnel showed 0 signups
 * while signups actually succeeded. The DB is the source of truth instead:
 *
 *   1. middleware sets a frozen first-party cookie on the visitor's first
 *      page landing (this file: captureFirstTouch)
 *   2. signup paths stamp the cookie's values onto the new profiles row
 *      (lib/growth/stamp-first-touch.ts), with the cookie value also carried
 *      through the OAuth redirect URL as ?ft= so the cross-browser handoff
 *      can't lose it (appendFirstTouchParam)
 *   3. scripts/daily-report.ts counts signups from profiles.first_touch_*
 *
 * First touch is FROZEN once set — never overwritten — matching PostHog's
 * $initial_utm semantics.
 */

export const FIRST_TOUCH_COOKIE = 'cp_first_touch';
const FIRST_TOUCH_MAX_AGE = 60 * 60 * 24 * 365; // ~1 year

export interface FirstTouch {
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  landed_at: string;
}

/** Parse a cookie/param value back into a FirstTouch. Returns null on garbage. */
export function parseFirstTouch(raw: string | null | undefined): FirstTouch | null {
  if (!raw) return null;
  for (const candidate of [raw, safeDecode(raw)]) {
    if (!candidate) continue;
    try {
      const v = JSON.parse(candidate);
      if (v && typeof v === 'object' && typeof v.landed_at === 'string') {
        return {
          source: str(v.source),
          medium: str(v.medium),
          campaign: str(v.campaign),
          referrer: str(v.referrer),
          landed_at: v.landed_at,
        };
      }
    } catch {
      // try the next decoding
    }
  }
  return null;
}

function safeDecode(raw: string): string | null {
  try {
    const decoded = decodeURIComponent(raw);
    return decoded === raw ? null : decoded;
  } catch {
    return null;
  }
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

/**
 * Middleware hook: on a visitor's FIRST page landing, persist first-touch
 * attribution in a first-party cookie. Never overwrites an existing cookie.
 * Pure cookie/header reads — adds no network calls to the middleware hot path.
 *
 * SameSite=Lax so the cookie survives the OAuth round-trip redirect; not
 * httpOnly so signup clients can forward it through the OAuth URL (?ft=) for
 * the IG in-app -> system browser handoff, where cookies don't carry over.
 */
export function captureFirstTouch(request: NextRequest, response: NextResponse) {
  try {
    if (request.method !== 'GET') return;
    if (request.cookies.has(FIRST_TOUCH_COOKIE)) return;

    const pathname = request.nextUrl.pathname;
    // Never treat the OAuth round-trip as a first touch (referer would be
    // accounts.google.com), and skip API calls — first touch = a real page.
    if (pathname.startsWith('/api/') || pathname.startsWith('/auth/')) return;

    // Skip non-document subrequests (RSC/prefetch) when the browser tells us.
    const dest = request.headers.get('sec-fetch-dest');
    if (dest && dest !== 'document') return;

    const params = request.nextUrl.searchParams;
    const firstTouch: FirstTouch = {
      source: (params.get('utm_source') || '').slice(0, 100),
      medium: (params.get('utm_medium') || '').slice(0, 100),
      campaign: (params.get('utm_campaign') || '').slice(0, 100),
      referrer: (request.headers.get('referer') || '').slice(0, 500),
      landed_at: new Date().toISOString(),
    };

    response.cookies.set(FIRST_TOUCH_COOKIE, JSON.stringify(firstTouch), {
      maxAge: FIRST_TOUCH_MAX_AGE,
      sameSite: 'lax',
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });
  } catch {
    // Attribution must never break a request.
  }
}

/**
 * Client-side: carry the first-touch cookie through an OAuth redirect URL as
 * ?ft=. The IG in-app browser -> system browser handoff drops cookies (and
 * localStorage), but the redirect URL survives Supabase's OAuth state — so the
 * callback can still stamp attribution for exactly the signups PostHog loses.
 */
export function appendFirstTouchParam(url: URL): URL {
  if (typeof document === 'undefined') return url;
  try {
    const match = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${FIRST_TOUCH_COOKIE}=`));
    const raw = match?.slice(FIRST_TOUCH_COOKIE.length + 1);
    if (raw && parseFirstTouch(raw)) {
      url.searchParams.set('ft', safeDecode(raw) ?? raw);
    }
  } catch {
    // Best-effort only.
  }
  return url;
}
