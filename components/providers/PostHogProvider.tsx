'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { PostHog } from 'posthog-js';

// Lazy-load posthog-js — keeps it out of the initial bundle
async function loadAndInitPostHog(): Promise<PostHog | null> {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null;

  const posthog = (await import('posthog-js')).default;
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'always',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie',
    disable_surveys: true,
    session_recording: {
      maskAllInputs: false,
      maskTextSelector: '[data-mask]',
    },
  });
  return posthog;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [client, setClient] = useState<PostHog | null>(null);
  const [PHProvider, setPHProvider] = useState<React.ComponentType<{ client: PostHog; children: React.ReactNode }> | null>(null);

  // Defer PostHog init until the browser is idle
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    const init = async () => {
      const ph = await loadAndInitPostHog();
      if (!ph) return;
      const { PostHogProvider: PHProv } = await import('posthog-js/react');
      setClient(ph);
      setPHProvider(() => PHProv);
    };

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => init());
      return () => cancelIdleCallback(id);
    } else {
      const t = setTimeout(init, 1);
      return () => clearTimeout(t);
    }
  }, []);

  // Track page views once PostHog is ready
  useEffect(() => {
    if (!client || !pathname) return;
    let url = window.origin + pathname;
    if (searchParams?.toString()) {
      url = url + '?' + searchParams.toString();
    }
    client.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams, client]);

  if (!client || !PHProvider) {
    return <>{children}</>;
  }

  return <PHProvider client={client}>{children}</PHProvider>;
}
