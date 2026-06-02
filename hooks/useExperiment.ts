'use client';

import { useEffect, useState } from 'react';
import { getPostHog } from '@/lib/analytics/posthog';

/**
 * Read a PostHog feature-flag / experiment variant on the client.
 *
 * Returns `fallback` until PostHog has loaded its flags (and forever if PostHog
 * is unavailable — e.g. no key, blocked, SSR). This means the *default*
 * experience is whatever `fallback` you pass, so pick the variant you'd ship to
 * everyone if the experiment never ran.
 *
 * Usage:
 *   const variant = useExperiment('win_signup_capture', 'treatment');
 */
export function useExperiment(flagKey: string, fallback: string): string {
  const [variant, setVariant] = useState<string>(fallback);

  useEffect(() => {
    let cancelled = false;
    getPostHog().then((ph) => {
      if (!ph || cancelled) return;
      // Read immediately in case flags are already loaded…
      const current = ph.getFeatureFlag(flagKey);
      if (typeof current === 'string' && !cancelled) setVariant(current);
      // …and subscribe so we update once they arrive.
      ph.onFeatureFlags(() => {
        if (cancelled) return;
        const v = ph.getFeatureFlag(flagKey);
        if (typeof v === 'string') setVariant(v);
      });
    });
    return () => { cancelled = true; };
  }, [flagKey]);

  return variant;
}
