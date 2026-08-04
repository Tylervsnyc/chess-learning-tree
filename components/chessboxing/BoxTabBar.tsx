'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

const DEBUG_KEY = 'cp:boxapp';

/** Routes where the bar must not cover an immersive full-screen activity. */
const HIDDEN_ROUTES = ['/workout', '/box/bout', '/box/onboarding'];

const TABS = [
  { href: '/box', label: 'Chess Box', icon: GloveIcon },
  { href: '/solve', label: 'Train', icon: TargetIcon },
  { href: '/play', label: 'Play', icon: PawnIcon },
  { href: '/profile', label: 'Profile', icon: PersonIcon },
] as const;

export function BoxTabBar() {
  const pathname = usePathname();
  const [inShell, setInShell] = useState(false);

  useEffect(() => {
    const isNative = window.Capacitor?.isNativePlatform?.() === true;
    let isDebug = false;
    try {
      if (new URLSearchParams(window.location.search).has('boxapp')) {
        sessionStorage.setItem(DEBUG_KEY, '1');
      }
      isDebug = sessionStorage.getItem(DEBUG_KEY) === '1';
    } catch {
      /* private mode — native detection still works */
    }
    setInShell(isNative || isDebug);
  }, []);

  const hidden = HIDDEN_ROUTES.some((r) => pathname?.startsWith(r));
  const visible = inShell && !hidden;

  useEffect(() => {
    if (!visible) return;
    document.documentElement.classList.add('has-box-tabbar');
    return () => document.documentElement.classList.remove('has-box-tabbar');
  }, [visible]);

  if (!visible) return null;

  return (
    <nav
      aria-label="Chess Boxing tabs"
      className="fixed bottom-0 inset-x-0 z-40 bg-chess-surface border-t border-slate-200 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-lg mx-auto flex">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== '/box' && pathname?.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[52px] pt-1.5 pb-1 tap-highlight ${
                active ? 'text-[#e5484d]' : 'text-chess-text-muted'
              }`}
            >
              <Icon />
              <span className="text-[10px] font-bold leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* Inline icons — 24px stroke style, no emoji. Kept tiny: this ships on every page. */

function GloveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* boxing glove: rounded fist + cuff */}
      <path d="M7 10V7a5 5 0 0 1 10 0v4a5 5 0 0 1-3 4.6V17H9v-1.4A5 5 0 0 1 7 12" />
      <path d="M7 10a2 2 0 1 0 2 3" />
      <path d="M9 20h5v-3" />
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

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c1.2-3.3 4-5 7.5-5s6.3 1.7 7.5 5" />
    </svg>
  );
}
