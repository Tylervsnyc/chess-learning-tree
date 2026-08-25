'use client';

import { useEffect, useState } from 'react';

/**
 * native-app — THE one way to ask "are we inside the Chess Boxing iOS shell?"
 *
 * The app is a Capacitor WKWebView loading chesspath.app; Capacitor injects
 * `window.Capacitor` even for remote content. Apple forbids selling digital
 * goods through web checkout inside the app (Guideline 3.1.1), so every
 * purchase surface (Patron, Premium, pricing pages, upgrade CTAs) must gate
 * on this. Web behavior is untouched.
 *
 * `isNativeApp()` — synchronous, safe to call anywhere (false on the server).
 * `useIsNativeApp()` — hook that starts false and flips after mount, so SSR
 * markup matches and there is no hydration mismatch. Also honors the existing
 * `?boxapp=1` / sessionStorage debug key so the app can be previewed on web.
 */
declare global {
  interface Window {
    Capacitor?: { isNativePlatform?: () => boolean };
  }
}

const DEBUG_KEY = 'cp:boxapp';
/** ?boxapp=frame — preview this document only, write nothing to the tab. */
export const EPHEMERAL = 'frame';

export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.() === true;
}

/**
 * Native shell OR the ?boxapp web-preview debug key.
 *
 * Two preview modes, and the difference matters:
 *   ?boxapp=1     — sticky. Persists in sessionStorage so you can browse the
 *                   whole shell on web without re-adding the param.
 *   ?boxapp=frame — EPHEMERAL. This document only; nothing is written. Use it
 *                   for iframes on /test pages.
 *
 * sessionStorage is shared by every page in a tab, same-origin iframes
 * included. A /test page that iframed `?boxapp=1` therefore left the whole
 * tab stuck in shell mode — plain /play rendered the boxing gym until the tab
 * was closed. That is what `frame` exists to prevent.
 */
export function isNativeAppOrDebug(): boolean {
  if (typeof window === 'undefined') return false;
  if (isNativeApp()) return true;
  try {
    const param = new URLSearchParams(window.location.search).get('boxapp');
    if (param === EPHEMERAL) return true; // never persisted
    if (param !== null) sessionStorage.setItem(DEBUG_KEY, '1');
    return sessionStorage.getItem(DEBUG_KEY) === '1';
  } catch {
    return false; /* private mode — native detection still works */
  }
}

export function useIsNativeApp(): boolean {
  const [native, setNative] = useState(false);
  useEffect(() => {
    setNative(isNativeAppOrDebug());
  }, []);
  return native;
}
