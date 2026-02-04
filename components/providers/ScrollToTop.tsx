'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollToTop() {
  const pathname = usePathname();

  // Disable browser scroll restoration globally
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll to top on every page navigation (except /learn which handles its own scroll)
  useEffect(() => {
    if (pathname === '/learn') return;

    // Scroll everything to top - belt and suspenders approach
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also scroll the main content wrapper if it exists
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  }, [pathname]);

  return null;
}
