'use client';

import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

/**
 * OFFLINE OVERRIDE of app/welcome/page.tsx — copied over the real file by
 * scripts/build-offline.mjs. Not used by the Vercel build.
 *
 * /welcome is the signed-out entry point: LearnPageContent sends anyone without
 * `chess_path_onboarded` here, so the app dead-ends on a 404 without it.
 *
 * The real page is an async server component that reads headers() and cookies()
 * to detect cold-Instagram traffic and swap in ColdBoardLanding. Both are
 * request-time APIs, so it cannot be statically exported — and the branch is
 * meaningless here anyway: nobody arrives at the iOS app from an IG webview.
 * What's left is exactly the branch every non-IG visitor already got.
 */
export default function WelcomePage() {
  return <OnboardingFlow />;
}
