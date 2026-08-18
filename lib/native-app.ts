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

export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.() === true;
}

/** Native shell OR the ?boxapp=1 web-preview debug key (persisted per session). */
export function isNativeAppOrDebug(): boolean {
  if (typeof window === 'undefined') return false;
  if (isNativeApp()) return true;
  try {
    if (new URLSearchParams(window.location.search).has('boxapp')) {
      sessionStorage.setItem(DEBUG_KEY, '1');
    }
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
