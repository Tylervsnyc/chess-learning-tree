'use client';

import { useRouter } from 'next/navigation';
import { ColdLanding } from '@/components/onboarding/ColdLanding';

/**
 * Test harness for the Day-2 cold-traffic landing (CHE-359). Renders the exact
 * screen the IG cohort sees, with real navigation wired up so you can click
 * through. The live version is behind IG_SPRINT_FLAGS.IG_LANDING_VALUE_CTA and
 * only shows to ?utm_source=instagram traffic — this page shows it to anyone.
 *
 * overflow-auto per the test-page rule (body is overflow:hidden globally).
 */
export default function ColdLandingTestPage() {
  const router = useRouter();
  return (
    <div className="overflow-auto h-[100dvh]">
      <ColdLanding
        onPlay={() => router.push('/play')}
        onBasics={() => router.push('/basics')}
        onSignIn={() => router.push('/auth/login')}
      />
    </div>
  );
}
