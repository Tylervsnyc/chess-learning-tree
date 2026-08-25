'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ONBOARDED_KEY } from '@/components/chessboxing/OnboardFlow';
import { isNativeAppOrDebug } from '@/lib/native-app';

/**
 * OnboardGate — first-launch gate for the Chess Boxing app, mounted by
 * app/box/layout.tsx. Renders nothing; it only redirects.
 *
 * Reworked 2026-08-25: onboarding is now MANDATORY (Tyler), so the gate can no
 * longer trust localStorage alone. The old version set 'cp:box-onboarded' on
 * skip as well as on finish, which meant one tap of Skip permanently marked a
 * user as onboarded with no account and no handle — invisible on every
 * leaderboard on a screen that is mostly leaderboards, forever.
 *
 * The ACCOUNT is now the real gate, and the server owns that answer:
 *   - localStorage key present  → fast path, no request, no flash.
 *   - key absent                → ask /api/profile/username. A 401 (no account)
 *                                 or a null handle sends them to onboarding;
 *                                 an account WITH a handle back-fills the key
 *                                 so a reinstall or a second device doesn't
 *                                 re-run onboarding for someone already set up.
 *
 * Gates '/box' exactly — never the onboarding page itself, and never deeper
 * routes like /box/bout, so a fight in progress is never interrupted.
 */

export function OnboardGate() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== '/box') return;

    let cancelled = false;

    if (!isNativeAppOrDebug()) return;

    let onboarded = false;
    try {
      onboarded = localStorage.getItem(ONBOARDED_KEY) === '1';
    } catch {
      /* private mode — fall through to the server check every time */
    }
    if (onboarded) return;

    (async () => {
      try {
        const res = await fetch('/api/profile/username');
        if (cancelled) return;

        if (res.ok) {
          const d = await res.json();
          if (!cancelled && d?.username) {
            // Fully set up already — remember it and stay put.
            try {
              localStorage.setItem(ONBOARDED_KEY, '1');
            } catch {
              /* private mode — we'll just ask again next launch */
            }
            return;
          }
        }
        if (!cancelled) router.replace('/box/onboarding');
      } catch {
        // Offline or the API is down. Do NOT trap someone in a redirect loop
        // over a network blip — let them into the app and re-check next launch.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}
