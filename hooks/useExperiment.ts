'use client';

import { useEffect, useState } from 'react';
import { getPostHog } from '@/lib/analytics/posthog';

export type ExperimentState = {
  /** The resolved variant, or `fallback` until/unless PostHog says otherwise. */
  variant: string;
  /**
   * True once we've consulted PostHog (flags loaded) OR determined it's
   * unavailable. Gate one-shot analytics on this so an impression is logged
   * exactly once, under the variant the user actually sees — not the fallback
   * first and the resolved value second.
   */
  ready: boolean;
};

/**
 * Read a PostHog feature-flag / experiment variant on the client.
 *
 * Returns `fallback` until PostHog has loaded its flags (and forever if PostHog
 * is unavailable — e.g. no key, blocked, SSR). So the *default* experience is
 * whatever `fallback` you pass: pick the variant you'd ship to everyone if the
 * experiment never ran.
 *
 * Usage:
 *   const { variant, ready } = useExperiment('win_signup_capture', 'treatment');
 */
export function useExperiment(flagKey: string, fallback: string): ExperimentState {
  const [variant, setVariant] = useState<string>(fallback);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | undefined;

    getPostHog().then((ph) => {
      if (cancelled) return;
      if (!ph) {
        // PostHog unavailable — the fallback is final. Mark ready so callers
        // that gate on it (e.g. a one-shot impression event) still fire.
        setReady(true);
        return;
      }
      // Read immediately — posthog-js bootstraps flags from its localStorage
      // cache on init, so this is usually already the real value.
      const current = ph.getFeatureFlag(flagKey);
      if (typeof current === 'string') setVariant(current);
      setReady(true);
      // Subscribe so a later refresh (e.g. first-ever load, no cache) updates us.
      const ret = ph.onFeatureFlags(() => {
        if (cancelled) return;
        const v = ph.getFeatureFlag(flagKey);
        if (typeof v === 'string') setVariant(v);
        setReady(true);
      });
      if (typeof ret === 'function') unsub = ret;
    });

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [flagKey]);

  return { variant, ready };
}
