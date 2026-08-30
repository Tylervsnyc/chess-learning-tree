'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

/**
 * CHESS PATH APP OVERRIDE of app/page.tsx — copied over the real file by
 * scripts/build-offline.mjs (APP_TARGET=chesspath), AFTER the shared
 * offline-overrides (whose root page points at /box and must not ship here).
 * Not used by the Vercel build.
 *
 * On the web `/` is a server redirect to /welcome (or /path via middleware
 * for known users). Inside the Chess Path app there is no server and `/` IS
 * the app, so both jobs happen here: first launch renders the onboarding,
 * every later launch goes straight to the learn tree. OnboardingFlow itself
 * never checks `chess_path_onboarded` (on web, routing does that), which is
 * why this page must — otherwise returning users would be onboarded on every
 * cold start. The brief blank frame before the replace hides under
 * NativeSplash (~2s).
 */
export default function ChessPathAppRoot() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    let onboarded = false;
    try { onboarded = localStorage.getItem('chess_path_onboarded') === 'true'; } catch {}
    if (onboarded) router.replace('/path');
    else setShowOnboarding(true);
  }, [router]);

  if (!showOnboarding) return null;
  return <OnboardingFlow />;
}
