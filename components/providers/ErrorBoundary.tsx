'use client';

import { useEffect } from 'react';

/**
 * Suppresses AbortError from Supabase's internal fetch calls.
 * This error occurs when React Strict Mode double-mounts components,
 * causing in-flight requests to be aborted. It's harmless but noisy.
 */
export function AbortErrorSuppressor() {
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      if (event.reason?.name === 'AbortError') {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);

  return null;
}
