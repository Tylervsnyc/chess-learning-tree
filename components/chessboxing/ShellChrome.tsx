'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { syncShellChrome, onShellChange } from '@/lib/shell-chrome';
import { useBoxShell } from '@/hooks/useBoxShell';

/**
 * ShellChrome — gives every Chess Boxing route a default colour for the strips
 * behind the status bar and the home indicator. Mount once, in app/layout.tsx.
 *
 * Read ShellColor's comment first: it explains why those strips exist and why
 * this is done with a <style> instead of an effect.
 *
 * This is the ROUTE layer. Screens that change colour partway through the same
 * URL declare their own with <ShellColor>, which beats this by specificity
 * (`html` over `:where(html)`) regardless of tree order.
 *
 * Inert outside the boxing app: `useBoxShell()` is false on the web and
 * compiles out of the Chess Path bundle, and `globals.css` falls back to
 * --color-chess-page, so nothing here can leak into chesspath.app.
 */

/* ── the palette (mirrors the --color-box-* tokens in globals.css) ───────── */

/** Arena navy — RingHome, the bout pre-fight, the workout setup. */
export const SHELL_ARENA = '#131a2e';
/** Gym navy — Play's setup screen. */
export const SHELL_GYM = '#10162a';
/** Deep navy — the cold-start splash (matches the native launch image). */
export const SHELL_DEEP = '#101a33';
/** The corner room's wood brown (/box/profile). */
export const SHELL_CORNER = '#754c26';
/** The regular Chess Path page blue — every light screen. */
export const SHELL_LIGHT = '#eef6fc';

const LIGHT = SHELL_LIGHT;
const ARENA = SHELL_ARENA;
const CORNER = SHELL_CORNER;

/**
 * Each route's colour ON ENTRY, first match wins — so the specific /box
 * children must come before /box itself.
 *
 * /play, /workout and /box/bout are LIGHT here on purpose: each opens on a
 * dark screen but spends most of its time on a light board, so the dark phase
 * declares itself with <ShellColor> and every other phase needs no call site.
 *
 * /welcome is deliberately absent: it renders OnboardingFlow, which is light.
 * (WelcomeHero's navy is a small card inside /box/onboarding, not a page.)
 *
 * /workout/report, /workout/fixit and /box/profile are not in the offline
 * bundle's ROUTE_ALLOWLIST today, so they only matter in the ?boxapp=1 web
 * preview. Listed anyway so the map stays right if they ever ship.
 */
const ROUTE_DEFAULTS: ReadonlyArray<readonly [string, string]> = [
  ['/box/settings', LIGHT],
  ['/box/onboarding', LIGHT],
  ['/box/bout', LIGHT],
  ['/box/profile', CORNER],
  ['/box', ARENA],
  ['/workout/report', ARENA],
  ['/workout/fixit', ARENA],
  ['/workout', LIGHT],
  ['/play', LIGHT],
];

export function shellDefaultFor(pathname: string | null): string {
  if (!pathname) return LIGHT;
  for (const [prefix, color] of ROUTE_DEFAULTS) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return color;
  }
  return LIGHT;
}

export function ShellChrome() {
  const pathname = usePathname();
  const inShell = useBoxShell();
  const fallback = inShell ? shellDefaultFor(pathname) : LIGHT;

  /**
   * Keep the theme-color meta and the native status bar in step with whatever
   * <html> is actually painted. Re-read after every render that could have
   * changed it: this route's default, and any screen's <ShellColor> mounting
   * or unmounting. Reading (rather than being told) means the status bar can
   * never disagree with the strip the user is looking at.
   */
  useEffect(() => {
    if (!inShell) return;
    // On the next frame, so getComputedStyle reads the committed styles.
    let raf = requestAnimationFrame(syncShellChrome);
    const off = onShellChange(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncShellChrome);
    });
    return () => {
      cancelAnimationFrame(raf);
      off();
    };
  }, [inShell, pathname, fallback]);

  // Outside the app the globals.css fallback is already correct, so ship nothing.
  if (!inShell) return null;

  return <style>{`:where(html){--shell-bg:${fallback}}`}</style>;
}
