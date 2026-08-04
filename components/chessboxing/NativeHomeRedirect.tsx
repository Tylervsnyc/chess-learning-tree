'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * NativeHomeRedirect — inside the Chess Boxing native shell, the app's home is
 * /box, but the site's cold-start routing lands on /welcome (logged out) or
 * /path (logged in). This sends native users to /box ONCE per session, so a
 * later in-app visit to those routes (e.g. browsing lessons from the Train
 * tab) is left alone. Web visitors are untouched; debug with ?boxapp=1.
 */

const REDIRECTED_KEY = 'cp:box-home-redirected';
const COLD_START_ROUTES = ['/', '/welcome', '/path'];

export function NativeHomeRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!COLD_START_ROUTES.includes(pathname)) return;
    let inApp = false;
    try {
      inApp =
        window.Capacitor?.isNativePlatform?.() === true ||
        new URLSearchParams(window.location.search).has('boxapp') ||
        sessionStorage.getItem('cp:boxapp') === '1';
      if (!inApp || sessionStorage.getItem(REDIRECTED_KEY) === '1') return;
      sessionStorage.setItem(REDIRECTED_KEY, '1');
    } catch {
      return;
    }
    router.replace('/box');
  }, [pathname, router]);

  return null;
}
