import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { ColdBoardLanding } from '@/components/onboarding/ColdBoardLanding';
import { SuiteLanding } from '@/components/onboarding/SuiteLanding';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { FIRST_TOUCH_COOKIE, parseFirstTouch } from '@/lib/growth/first-touch';

export const metadata: Metadata = {
  title: 'Welcome to Chess Path',
  description: 'Start your chess journey. Learn tactics the fun way in just 5 minutes a day.',
};

// In-app webview / Instagram UA detection (same spirit as lib/auth/webview.ts,
// run server-side here so we can branch BEFORE any JS ships).
const IG_WEBVIEW_UA = /Instagram|FBAN|FBAV|FB_IAB/i;

/**
 * Cold-IG = ANY of: the request UA looks like the IG/FB in-app browser, OR the
 * incoming utm_source is instagram, OR the frozen first-touch cookie's source
 * mentions instagram. These are the visitors who bounce on the blank client
 * landing — they get the server-rendered board instead.
 */
async function isColdIg(searchParams: Record<string, string | string[] | undefined>): Promise<boolean> {
  const ua = (await headers()).get('user-agent') || '';
  if (IG_WEBVIEW_UA.test(ua)) return true;

  const utmSource = searchParams.utm_source;
  const src = Array.isArray(utmSource) ? utmSource[0] : utmSource;
  if (src === 'instagram') return true;

  const cookieVal = (await cookies()).get(FIRST_TOUCH_COOKIE)?.value;
  const ft = parseFirstTouch(cookieVal);
  if (ft?.source?.toLowerCase().includes('instagram')) return true;

  return false;
}

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  if (FEATURE_FLAGS.IG_FAST_LANDING && (await isColdIg(params))) {
    return <ColdBoardLanding />;
  }

  // Suite hub for non-IG traffic (SUITE_LANDING). ?start=1 (the hub's own
  // "Start learning" CTA) drops back into the classic onboarding funnel.
  if (FEATURE_FLAGS.SUITE_LANDING && !('start' in params)) {
    return <SuiteLanding />;
  }

  // Non-IG / desktop / existing users: ZERO change.
  return <OnboardingFlow />;
}
