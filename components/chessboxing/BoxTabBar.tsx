'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBoxShell } from '@/hooks/useBoxShell';

/**
 * BoxTabBar — the Chess Boxing app's bottom tab bar. Renders ONLY inside the
 * Capacitor native shell (same detection as NativeSplash). Debug on web with
 * ?boxapp=1 — persisted in sessionStorage so navigation keeps it for the
 * whole "app session".
 *
 * Hidden on /workout: the workout session owns the full viewport (timer,
 * board, punch tracker) and its finish screen has its own navigation.
 *
 * When visible it adds `has-box-tabbar` to <html> so globals.css can reserve
 * bottom space — page scroll containers are inside <main>, so padding the
 * flex body shrinks them above the bar.
 */

/** Routes where the bar must not cover an immersive full-screen activity. */
const HIDDEN_ROUTES = ['/workout', '/box/bout', '/box/onboarding'];
/** Exceptions under a hidden prefix: the post-workout report + Fix-It are
 *  regular app screens (dark shell, no timer) and keep the tabs. */
const SHOWN_ROUTES = ['/workout/report', '/workout/fixit'];

/**
 * The four tabs. `match` lists the extra routes a tab claims as "active" —
 * Train's chooser fans out to the shared activity pages, and those still
 * belong to the Train tab.
 */
const TABS = [
  { href: '/box', label: 'Chess Box', icon: BellIcon, match: [] as string[], color: '#FF4B4B', shadow: '#CC3939', tint: 'rgba(255,75,75,0.12)' },
  { href: null, label: 'Train', icon: TargetIcon, match: ['/path', '/openings', '/lesson', '/solve'], color: '#CE82FF', shadow: '#a855f7', tint: 'rgba(206,130,255,0.14)' },
  { href: '/play', label: 'Play', icon: PawnIcon, match: [] as string[], color: '#58CC02', shadow: '#3d8c01', tint: 'rgba(88,204,2,0.12)' },
  { href: '/box/profile', label: 'Profile', icon: PersonIcon, match: ['/profile'], color: '#1CB0F6', shadow: '#0d7ec4', tint: 'rgba(28,176,246,0.12)' },
] as const;

/** The Train drop-up: tap the tab, pick where to train. */
const TRAIN_OPTIONS = [
  { href: '/path', title: 'Tactics', sub: 'Forks, pins, mates', icon: SwordsIcon, accent: '#CE82FF', shadow: '#a855f7' },
  { href: '/openings', title: 'Openings', sub: 'First moves, cold', icon: BookIcon, accent: '#1CB0F6', shadow: '#0d7ec4' },
] as const;

export function BoxTabBar() {
  const pathname = usePathname();
  const inShell = useBoxShell();
  const [trainOpen, setTrainOpen] = useState(false);

  const hidden =
    HIDDEN_ROUTES.some((r) => pathname?.startsWith(r)) && !SHOWN_ROUTES.some((r) => pathname?.startsWith(r));
  const visible = inShell && !hidden;

  useEffect(() => {
    if (!visible) return;
    document.documentElement.classList.add('has-box-tabbar');
    return () => document.documentElement.classList.remove('has-box-tabbar');
  }, [visible]);

  // Navigating anywhere closes the drop-up.
  useEffect(() => {
    setTrainOpen(false);
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      {trainOpen && (
        <button
          aria-label="Close train menu"
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setTrainOpen(false)}
        />
      )}
      <nav
        aria-label="Chess Boxing tabs"
        /* Dark FLOATING island, not an edge-to-edge bar (Tyler 2026-09-04:
           "darker so the whole app looks more cohesive").
           Why it floats: with ios.contentInset 'always' the web view has ONE
           canvas colour and it paints the strip behind the status bar AND the
           strip at the home indicator. The top strip has to match the page, so
           the bottom strip does too — an edge-to-edge dark bar would sit above
           a ~34pt page-coloured sliver and read as broken. Floating it means
           the canvas is one continuous colour top to bottom and the bar is
           deliberately lifted off the edge. On the arena screens the navy
           island sits on navy and disappears. */
        className="fixed bottom-1.5 left-2.5 right-2.5 z-40 rounded-[20px] bg-box-bar border border-white/10 shadow-[0_6px_20px_rgba(9,13,26,0.30)]"
      >
        {trainOpen && (
          <div className="absolute bottom-full inset-x-0 pb-2 px-4">
            <div className="max-w-lg mx-auto flex flex-col gap-2">
              {TRAIN_OPTIONS.map(({ href, title, sub, icon: Icon, accent, shadow }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-2xl bg-chess-surface border-2 px-4 py-3 active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
                  style={{ borderColor: shadow, boxShadow: `0 4px 0 0 ${shadow}` }}
                >
                  <span
                    className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl text-white"
                    style={{ background: accent }}
                  >
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-black text-chess-text leading-tight">
                      {title}
                    </span>
                    <span className="block text-xs font-semibold text-chess-text-muted truncate">
                      {sub}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="max-w-lg mx-auto flex gap-1.5 px-2 py-1.5">
          {TABS.map(({ href, label, icon: Icon, match, color, shadow, tint }) => {
            const active =
              (href !== null &&
                (pathname === href ||
                  (href !== '/box' && pathname?.startsWith(`${href}/`)))) ||
              match.some((m) => pathname === m || pathname?.startsWith(`${m}/`)) ||
              (href === null && trainOpen);
            /* Chess Path button language (NavHeader): every tab is a filled
               colored button. Active = solid fill, white text, hard 3D
               bottom shadow — that reads well on the dark island as-is.
               Inactive used to be a 12% brand tint over white plus 0.85
               opacity; both were tuned for a white bar and go muddy and dim on
               navy, so inactive is now one neutral chip at full opacity and
               keeps only its brand hue for identity. */
            const face = (
              <span
                className="flex flex-col items-center justify-center gap-0.5 min-h-[48px] rounded-xl border-2 transition-all active:translate-y-[2px]"
                style={{
                  background: active ? color : 'rgba(255,255,255,0.06)',
                  borderColor: active ? shadow : 'rgba(255,255,255,0.08)',
                  boxShadow: active ? `0 3px 0 0 ${shadow}` : 'none',
                  color: active ? '#fff' : color,
                }}
              >
                <Icon />
                <span className="text-[10px] font-extrabold leading-none whitespace-nowrap">
                  {label}
                </span>
              </span>
            );
            if (href === null) {
              return (
                <button
                  key={label}
                  type="button"
                  aria-expanded={trainOpen}
                  className="flex-1 min-w-0 tap-highlight"
                  onClick={() => setTrainOpen((o) => !o)}
                >
                  {face}
                </button>
              );
            }
            return (
              <Link key={href} href={href} className="flex-1 min-w-0 tap-highlight">
                {face}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/* Inline icons — 24px stroke style, no emoji. Kept tiny: this ships on every page. */

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* round bell — ding ding */}
      <path d="M12 4a7 7 0 0 1 7 7v4H5v-4a7 7 0 0 1 7-7Z" />
      <path d="M12 4V2.5M4 18.5h16" />
      <path d="M9 21.5h6" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}

function PawnIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="7" r="3" />
      <path d="M9.5 9.5C9.5 13 8.5 15.5 7.5 17h9c-1-1.5-2-4-2-7.5" />
      <path d="M6 20h12" />
    </svg>
  );
}

function SwordsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <path d="M13 19l6-6" />
      <path d="M16 16l4 4" />
      <path d="M19 21l2-2" />
      <path d="M14.5 6.5L18 3h3v3l-3.5 3.5" />
      <path d="M5 14l4 4" />
      <path d="M7 17l-3 3" />
      <path d="M3 21l2-2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c1.2-3.3 4-5 7.5-5s6.3 1.7 7.5 5" />
    </svg>
  );
}
