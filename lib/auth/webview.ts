/**
 * In-app webview detection (CHE-390).
 *
 * Google hard-blocks OAuth inside embedded webviews (`disallowed_useragent`),
 * and Apple's web flow is flaky there — during the 2026-06 paid IG probe,
 * every OAuth tap from the Instagram in-app browser died (0/3 paid, see
 * scripts/check-oauth-webview.ts). Auth surfaces use this to hide the
 * guaranteed-dead Google button and lead with email instead.
 *
 * The Chess Boxing iOS shell (Capacitor WKWebView) counts too: an OAuth tap
 * navigates to an external host, which Capacitor opens in Safari — and Safari
 * has no PKCE verifier cookie (that lives in the shell's webview), so the
 * /auth/callback exchange fails with "PKCE code verifier not found". In the
 * shell, email/password is the only flow that completes in-place, so auth
 * surfaces hide BOTH OAuth buttons there (see isNativeShell).
 *
 * Gated by FEATURE_FLAGS.WEBVIEW_SAFE_AUTH at the call sites.
 */

import { isNativeAppOrDebug } from '@/lib/native-app';

/** True inside the Chess Boxing Capacitor shell — OAuth escapes to Safari and
 *  dies there (no PKCE verifier), so even Apple's web flow must be hidden.
 *  Honors the ?boxapp=1 web-preview key like the rest of the shell UI. */
export function isNativeShell(): boolean {
  return isNativeAppOrDebug();
}

/** True when OAuth can't complete here: a social app's embedded browser
 *  (IG/FB/TikTok…) or the Chess Boxing native shell. */
export function isInAppWebview(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (isNativeShell()) return true;
  const ua = navigator.userAgent || '';
  // Instagram + Facebook (FBAN/FBAV/FB_IAB) + TikTok identify themselves in the
  // UA. Android webviews also carry the "; wv)" token.
  return /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|BytedanceWebview/i.test(ua) || /;\s?wv\)/.test(ua);
}

/** Android device, any browser. */
export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent || '');
}

/** True when the "Continue with Apple" button must be hidden:
 *  - any in-app webview / the native shell — the 2026-09-04 IG replay showed
 *    an iOS visitor tap Apple and sit on "Redirecting..." forever (Google was
 *    already hidden there; Apple was the only OAuth left and it was dead too);
 *  - Android — no Apple ID in practice, and the same replay week showed an
 *    Android visitor being offered Apple as their only OAuth option.
 *  Email is the flow that works everywhere. */
export function hideAppleOAuth(): boolean {
  return isInAppWebview() || isAndroid();
}
