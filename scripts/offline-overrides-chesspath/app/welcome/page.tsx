'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useUser } from '@/hooks/useUser';

/**
 * CHESS PATH APP OVERRIDE of app/welcome/page.tsx — applied AFTER the shared
 * offline override. Same OnboardingFlow, plus one rule the web enforces via
 * routing: a signed-in user never sees onboarding. Anything in the app that
 * bounces to /welcome (the /path gate, old links) forwards straight back to
 * /play when a session exists.
 */
export default function WelcomePage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) router.replace('/play');
  }, [router, user, loading]);

  if (loading || user) return null;
  return <OnboardingFlow />;
}
