'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Don't auto-scroll if there's a scrollTo param (let the page handle it)
    if (searchParams.get('scrollTo')) return;

    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}
