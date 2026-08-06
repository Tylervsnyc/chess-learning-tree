'use client';

import { useEffect } from 'react';
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

/**
 * The four tabs. `match` lists the extra routes a tab claims as "active" —
 * Train's chooser fans out to the shared activity pages, and those still
 * belong to the Train tab.
 */
const TABS = [
  { href: '/box', label: 'Chess Box', icon: GloveIcon, match: [] as string[], color: '#FF4B4B', shadow: '#CC3939', tint: 'rgba(255,75,75,0.12)' },
  { href: '/box/train', label: 'Train', icon: TargetIcon, match: ['/solve', '/path', '/openings', '/lesson'], color: '#CE82FF', shadow: '#a855f7', tint: 'rgba(206,130,255,0.14)' },
  { href: '/play', label: 'Play', icon: PawnIcon, match: [] as string[], color: '#58CC02', shadow: '#3d8c01', tint: 'rgba(88,204,2,0.12)' },
  { href: '/box/profile', label: 'Profile', icon: PersonIcon, match: ['/profile'], color: '#1CB0F6', shadow: '#0d7ec4', tint: 'rgba(28,176,246,0.12)' },
] as const;

export function BoxTabBar() {
  const pathname = usePathname();
  const inShell = useBoxShell();

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
      <div className="max-w-lg mx-auto flex gap-1.5 px-2 py-1.5">
        {TABS.map(({ href, label, icon: Icon, match, color, shadow, tint }) => {
          const active =
            pathname === href ||
            (href !== '/box' && pathname?.startsWith(`${href}/`)) ||
            match.some((m) => pathname === m || pathname?.startsWith(`${m}/`));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 min-w-0 tap-highlight"
            >
              {/* Chess Path button language (NavHeader): every tab is a filled
                  colored button. Active = solid fill, white text, hard 3D
                  bottom shadow; inactive = its own tint, colored text. */}
              <span
                className="flex flex-col items-center justify-center gap-0.5 min-h-[48px] rounded-xl border-2 transition-all active:translate-y-[2px]"
                style={{
                  background: active ? color : tint,
                  borderColor: active ? shadow : 'transparent',
                  boxShadow: active ? `0 3px 0 0 ${shadow}` : 'none',
                  color: active ? '#fff' : color,
                  opacity: active ? 1 : 0.85,
                }}
              >
                <Icon />
                <span className="text-[10px] font-extrabold leading-none whitespace-nowrap">
                  {label}
                </span>
              </span>
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
