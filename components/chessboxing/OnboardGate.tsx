'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ONBOARDED_KEY } from '@/components/chessboxing/OnboardFlow';
import { isNativeApp } from '@/lib/native-app';

/**
 * OnboardGate — first-launch gate for the Chess Boxing app, mounted by
 * app/box/layout.tsx. When running in app mode (Capacitor native, or web
 * debug via ?boxapp=1 — same detection as BoxTabBar/NativeSplash) and the
 * user has never finished onboarding (localStorage 'cp:box-onboarded'),
 * /box redirects to /box/onboarding. The flow sets the key on finish OR
 * skip, so nobody sees this twice.
 *
 * Renders nothing — it only redirects. Gates '/box' exactly, never the
 * onboarding page itself or deeper routes like /box/bout.
 */

const DEBUG_KEY = 'cp:boxapp';

export function OnboardGate() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== '/box') return;
    const isNative = isNativeApp();
    let isDebug = false;
    let onboarded = true; // storage unavailable → never trap in a redirect loop
    try {
      if (new URLSearchParams(window.location.search).has('boxapp')) {
        sessionStorage.setItem(DEBUG_KEY, '1');
      }
      isDebug = sessionStorage.getItem(DEBUG_KEY) === '1';
      onboarded = localStorage.getItem(ONBOARDED_KEY) === '1';
    } catch {
      /* private mode — skip gating */
    }
    if ((isNative || isDebug) && !onboarded) {
      router.replace('/box/onboarding');
    }
  }, [pathname, router]);

  return null;
}
