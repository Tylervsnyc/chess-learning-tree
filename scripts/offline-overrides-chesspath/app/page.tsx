'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useUser } from '@/hooks/useUser';

/**
 * CHESS PATH APP OVERRIDE of app/page.tsx — copied over the real file by
 * scripts/build-offline.mjs (APP_TARGET=chesspath), AFTER the shared
 * offline-overrides (whose root page points at /box and must not ship here).
 * Not used by the Vercel build.
 *
 * On the web `/` is a server redirect to /welcome (or /path via middleware
 * for known users). Inside the Chess Path app there is no server and `/` IS
 * the app, so both jobs happen here. Two ways in to /path, mirroring what the
 * web's routing does:
 *   - `chess_path_onboarded` in localStorage (completed onboarding), or
 *   - a signed-in session (signing in on a fresh device never set the flag,
 *     and a signed-in user must never be onboarded again — this page waits
 *     for auth to resolve before deciding).
 * Everyone else gets the onboarding. The wait hides under NativeSplash (~2s).
 */
export default function ChessPathAppRoot() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (loading) return;
    let onboarded = false;
    try { onboarded = localStorage.getItem('chess_path_onboarded') === 'true'; } catch {}
    if (onboarded || user) router.replace('/path');
    else setShowOnboarding(true);
  }, [router, user, loading]);

  if (!showOnboarding) return null;
  return <OnboardingFlow />;
}
