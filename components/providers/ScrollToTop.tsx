'use client';

import { useEffect } from 'react';

export function ScrollToTop() {
  // Disable browser scroll restoration globally
  // With the new layout structure (body overflow:hidden), body doesn't scroll
  // Pages that need scrolling (like /learn) handle their own internal scroll
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
}
