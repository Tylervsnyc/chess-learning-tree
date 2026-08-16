'use client';

import { useEffect } from 'react';

/**
 * StatusBarSync — makes the iPhone status bar (clock/battery) blend with the
 * screen behind it inside the native shell.
 *
 * The status bar overlays the webview, so its background is whatever the page
 * paints under the safe area; the only thing to manage is TEXT color. This app
 * is light on every screen (--color-chess-page), so it's a single call rather
 * than Chess Path's per-route table.
 *
 * Native-only: renders nothing and does nothing on web.
 */
export function StatusBarSync() {
  useEffect(() => {
    if (window.Capacitor?.isNativePlatform?.() !== true) return;
    let cancelled = false;
    import('@capacitor/status-bar')
      .then(({ StatusBar, Style }) => {
        if (cancelled) return;
        // Style.Light means DARK text — correct over our light background.
        return StatusBar.setStyle({ style: Style.Light });
      })
      .catch(() => {
        /* plugin unavailable — nothing to sync */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
