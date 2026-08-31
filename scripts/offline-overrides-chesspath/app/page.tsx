'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useUser } from '@/hooks/useUser';
import { markAppReady } from '@/lib/native-splash';

/**
 * CHESS PATH APP OVERRIDE of app/page.tsx — copied over the real file by
 * scripts/build-offline.mjs (APP_TARGET=chesspath), AFTER the shared
 * offline-overrides (whose root page points at /box and must not ship here).
 * Not used by the Vercel build.
 *
 * On the web `/` is a server redirect to /welcome (or /path via middleware
 * for known users). Inside the Chess Path app there is no server and `/` IS
 * the app, so both jobs happen here. The app opens on /play (2026-08-31 —
 * play first, the lesson path is one tab away). Two ways in, mirroring what
 * the web's routing does:
 *   - `chess_path_onboarded` in localStorage (completed onboarding), or
 *   - a signed-in session (signing in on a fresh device never set the flag,
 *     and a signed-in user must never be onboarded again — this page waits
 *     for auth to resolve before deciding).
 * Everyone else gets the onboarding. The wait hides under NativeSplash, which
 * stays up until /play has painted (lib/native-splash) — or until we decide
 * on onboarding here, which we signal with markAppReady().
 */
export default function ChessPathAppRoot() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Onboarded devices never wait on auth — the destination is /play either
    // way, and the session check can take seconds on a cold radio. Only an
    // un-onboarded device needs to know whether a session exists.
    let onboarded = false;
    try { onboarded = localStorage.getItem('chess_path_onboarded') === 'true'; } catch {}
    if (onboarded) { router.replace('/play'); return; }
    if (loading) return;
    if (user) router.replace('/play');
    else {
      setShowOnboarding(true);
      markAppReady();
    }
  }, [router, user, loading]);

  if (!showOnboarding) return null;
  return <OnboardingFlow />;
}
