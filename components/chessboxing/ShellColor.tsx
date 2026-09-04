'use client';

import { useEffect } from 'react';
import { notifyShellChange } from '@/lib/shell-chrome';

/**
 * ShellColor — declares the colour of the web view canvas for the screen that
 * renders it. Renders no visible markup.
 *
 * WHY THIS EXISTS. `capacitor.config.ts` sets `ios.contentInset: 'always'` and
 * nothing sets `viewport-fit=cover`, so the web view's viewport is INSET below
 * the status bar and above the home indicator. Those two strips are painted by
 * the canvas background, which propagates from <html> — no page can reach
 * them, and `env(safe-area-inset-*)` reads 0px throughout the app. That is why
 * every screen used to show the same pale band across the top: `globals.css`
 * pins <html> to --color-chess-page for every route.
 *
 * Tyler, 2026-09-04: the strip is PAINTED AND BLENDED — nothing lives in it —
 * and it MATCHES THE COLOUR OF THAT PAGE.
 *
 * THE PAINT IS A <style>, like FullBleedShell — not an effect that writes
 * `documentElement.style`. That matters: a written style lands one frame after
 * paint, so entering a dark screen would flash the pale colour in the strip
 * every single time. A <style> is server-rendered, in the first painted frame,
 * and it unmounts with the screen so nothing has to be restored.
 *
 * It beats ShellChrome's route default by specificity, not by DOM order —
 * `html` (0,0,1) over `:where(html)` (0,0,0) — so neither has to know where in
 * the tree the other sits.
 *
 * The effect only NUDGES ShellChrome to re-read the painted colour (for the
 * status bar and the theme-color meta). It never passes the colour along:
 * ShellChrome reads what is actually on screen, so the two cannot disagree.
 *
 * WHEN TO USE. ShellChrome already gives every route a default from its
 * pathname. Render this only on a screen whose colour differs from that
 * default, which in practice means a route that changes colour BY PHASE
 * (/play, /workout and /box/bout each open dark and then show a light board).
 * A component rather than a hook, because those are conditional JSX branches
 * and hooks cannot be called conditionally.
 */
export function ShellColor({ value }: { value: string }) {
  useEffect(() => {
    // Mount and unmount both change what is painted.
    notifyShellChange();
    return () => notifyShellChange();
  }, [value]);
  return <style>{`html{--shell-bg:${value}}`}</style>;
}
