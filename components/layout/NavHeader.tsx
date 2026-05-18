'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { usePathname } from 'next/navigation';
import { BreathingHeaderLogo } from '@/components/ui/BreathingHeaderLogo';
import { MONETIZATION_ENABLED } from '@/lib/feature-flags';

function LearnDropdown({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isLearnActive = pathname === '/' || pathname?.startsWith('/path') || pathname?.startsWith('/openings') || pathname?.startsWith('/lesson/');

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-0.5 px-1.5 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 whitespace-nowrap bg-chess-purple text-white ${
          isLearnActive ? 'shadow-[0_2px_0_0_#a855f7]' : 'opacity-70'
        }`}
      >
        Learn
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 flex flex-col gap-1 bg-chess-surface rounded-lg shadow-lg border border-purple-100 p-1 z-50">
          <Link
            href="/path"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap bg-chess-red/10 text-chess-red hover:bg-chess-red hover:text-white"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
              <path d="M13 19l6-6" />
              <path d="M16 16l4 4" />
              <path d="M19 21l2-2" />
              <path d="M14.5 6.5L18 3h3v3l-3.5 3.5" />
              <path d="M5 14l4 4" />
              <path d="M7 17l-3 3" />
              <path d="M3 21l2-2" />
            </svg>
            Tactics
          </Link>
          <Link
            href="/openings"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap bg-chess-purple/10 text-chess-purple hover:bg-chess-purple hover:text-white"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
            </svg>
            Openings
          </Link>
        </div>
      )}
    </div>
  );
}

// Lightweight gate — checks path BEFORE loading Supabase/useUser
const HIDDEN_PATHS = ['/auth/', '/welcome', '/basics', '/test/landing', '/test/rookie-promise', '/test/basics-tutorial', '/test/tutorial', '/2026candidates', '/test-rook-animations'];

export function NavHeader() {
  const pathname = usePathname();

  // Early bail — avoids loading useUser/Supabase on pages that never show the header
  const hidden = HIDDEN_PATHS.some(p => pathname?.startsWith(p))
    || pathname?.match(/^\/openings\/[^/]+\/[^/]+$/) && !pathname?.endsWith('/tree');
  if (hidden) return null;

  return <NavHeaderInner pathname={pathname} />;
}

function NavHeaderInner({ pathname }: { pathname: string | null }) {
  const { user, profile, loading } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-chess-surface border-b border-slate-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center flex-shrink-0">
          <BreathingHeaderLogo />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5">
          {loading ? (
            <>
              <div className="w-12 h-6 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-14 h-6 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-12 h-6 bg-slate-200 rounded-md animate-pulse" />
            </>
          ) : (
            <>
              {/* Play */}
              <Link
                href="/play"
                className={`px-1.5 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 bg-chess-green text-white whitespace-nowrap ${
                  pathname === '/play' ? 'shadow-[0_2px_0_0_var(--color-chess-green-shadow)]' : 'opacity-70'
                }`}
              >
                Play
              </Link>

              {/* Learn dropdown */}
              <LearnDropdown pathname={pathname} />

              {/* Run (Rookie's Run — the daily) */}
              <Link
                href="/run"
                className={`relative px-1.5 sm:px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-all hover:opacity-90 overflow-hidden whitespace-nowrap ${
                  pathname?.startsWith('/run') ? 'shadow-[0_2px_0_0_var(--color-chess-blue-shadow)]' : 'opacity-70'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #1CB0F6 0%, #0d9ee0 100%)',
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                <span className="relative">Run</span>
              </Link>

              {/* Patron — free users only, hidden when monetization is off. Wait for profile to load to avoid flash. */}
              {MONETIZATION_ENABLED && user && profile && profile.subscription_status !== 'premium' && profile.subscription_status !== 'trial' && (
                <Link
                  href="/pricing"
                  className={`px-1.5 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 whitespace-nowrap ${
                    pathname === '/pricing' ? 'shadow-[0_2px_0_0_var(--color-chess-gold-dark)]' : 'opacity-70'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                  }}
                >
                  Patron
                </Link>
              )}

              {/* Guest sign up */}
              {!loading && !user && (
                <Link
                  href="/auth/signup"
                  className="px-1.5 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 whitespace-nowrap bg-chess-green text-white"
                >
                  Sign Up
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
