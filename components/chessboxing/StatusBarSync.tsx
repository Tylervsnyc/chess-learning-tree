'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * StatusBarSync — makes the iPhone status bar (clock/battery) blend with the
 * screen behind it inside the Chess Boxing shell.
 *
 * The status bar overlays the webview, so its background is whatever the page
 * paints under the safe area; the only thing to manage is TEXT color:
 *  - navy screens (the locker home) → light text
 *  - everything else (light chess-page screens) → dark text
 *
 * Native-only: the Capacitor StatusBar plugin no-ops on web, so this renders
 * nothing and does nothing outside the app.
 */

/** Routes whose background is the dark locker navy. */
const DARK_ROUTES = ['/box'];

function isDark(pathname: string | null): boolean {
  return pathname === '/box' || DARK_ROUTES.some((r) => r !== '/box' && pathname?.startsWith(r));
}

export function StatusBarSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.Capacitor?.isNativePlatform?.() !== true) return;
    let cancelled = false;
    import('@capacitor/status-bar')
      .then(({ StatusBar, Style }) => {
        if (cancelled) return;
        // Style.Dark = light text (for dark backgrounds), Style.Light = dark text.
        return StatusBar.setStyle({ style: isDark(pathname) ? Style.Dark : Style.Light });
      })
      .catch(() => {
        /* plugin unavailable — nothing to sync */
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
