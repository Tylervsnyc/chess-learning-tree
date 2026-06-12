/**
 * In-app webview detection (CHE-390).
 *
 * Google hard-blocks OAuth inside embedded webviews (`disallowed_useragent`),
 * and Apple's web flow is flaky there — during the 2026-06 paid IG probe,
 * every OAuth tap from the Instagram in-app browser died (0/3 paid, see
 * scripts/check-oauth-webview.ts). Auth surfaces use this to hide the
 * guaranteed-dead Google button and lead with email instead.
 *
 * Gated by FEATURE_FLAGS.WEBVIEW_SAFE_AUTH at the call sites.
 */

/** True when running inside a social app's embedded browser (IG/FB/TikTok…). */
export function isInAppWebview(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  // Instagram + Facebook (FBAN/FBAV/FB_IAB) + TikTok identify themselves in the
  // UA. Android webviews also carry the "; wv)" token.
  return /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|BytedanceWebview/i.test(ua) || /;\s?wv\)/.test(ua);
}
