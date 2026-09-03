'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * Review setting: the golden "engine's best reply" arrow on/off, remembered
 * per device. ONE key shared by every review surface (/play's settings menu,
 * GameReview's toggle) so flipping it anywhere applies everywhere.
 *
 * `showBestArrowRef` mirrors the state for callbacks that must not re-create
 * on every toggle (e.g. /play's navigateToMove).
 */
export const BEST_ARROW_KEY = 'cp_review_best_arrow';

export function readBestArrowSetting(): boolean {
  try { return localStorage.getItem(BEST_ARROW_KEY) !== 'off'; } catch { return true; }
}

export function useBestArrowSetting() {
  const [showBestArrow, setState] = useState<boolean>(readBestArrowSetting);
  const showBestArrowRef = useRef(showBestArrow);
  showBestArrowRef.current = showBestArrow;

  const setShowBestArrow = useCallback((on: boolean) => {
    setState(on);
    showBestArrowRef.current = on;
    try { localStorage.setItem(BEST_ARROW_KEY, on ? 'on' : 'off'); } catch { /* private mode */ }
  }, []);

  return { showBestArrow, showBestArrowRef, setShowBestArrow };
}
