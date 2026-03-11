'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useLessonProgress } from '@/hooks/useProgress';
import { usePathname } from 'next/navigation';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { BreathingHeaderLogo } from '@/components/ui/BreathingHeaderLogo';

export function NavHeader() {
  const { user, profile, loading } = useUser();
  const { currentStreak, loaded: progressLoaded } = useLessonProgress();
  const pathname = usePathname();

  // Don't show header on auth pages, onboarding, basics tutorial, or opening lesson pages
  if (pathname?.startsWith('/auth/')) return null;
  if (pathname === '/welcome' || pathname === '/basics') return null;
  if (pathname?.startsWith('/test/landing')) return null;
  if (pathname?.startsWith('/lesson/') && !user) return null;
  if (pathname?.match(/^\/openings\/[^/]+\/[^/]+$/) && !pathname?.endsWith('/tree')) return null;

  // Show streak counter on / and /daily-challenge (feature-flagged off)
  const showStreakCounter = pathname === '/' || pathname === '/daily-challenge';

  return (
    <header className="sticky top-0 z-50 bg-chess-surface border-b border-slate-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center flex-shrink-0">
          <BreathingHeaderLogo />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5">
          {/* Streak counter - shown on /learn and /daily-challenge */}
          {FEATURE_FLAGS.SHOW_STREAK_COUNTER && showStreakCounter && progressLoaded && currentStreak > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-md text-white text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF9500 100%)',
                boxShadow: '0 0 8px rgba(255, 107, 0, 0.4)',
              }}
            >
              <svg className="w-4 h-4 text-chess-orange" fill="currentColor" viewBox="0 0 24 24"><path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-5.13 3.08-7.46.58-.71 1.26-1.39 1.92-2.04.24-.24.65-.04.6.3-.24 1.68.18 3.04 1.15 4.08.1.1.26.08.33-.05.47-.84.68-2.07.53-3.64-.02-.24.27-.38.44-.21C13.93 8.6 16 11.65 16 15c0 .55-.06 1.08-.17 1.58-.04.16.12.3.27.21.88-.52 1.57-1.32 2.02-2.25.1-.2.38-.2.44.02.36 1.1.44 2.34.44 2.94 0 4.42-4.03 8-9 8h2z"/></svg>
              <span>{currentStreak}</span>
            </div>
          )}
          {loading ? (
            <>
              {/* Skeleton buttons to prevent layout shift */}
              <div className="w-14 h-6 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-12 h-6 bg-slate-200 rounded-md animate-pulse" />
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`px-1.5 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 bg-chess-green text-white whitespace-nowrap ${
                  pathname === '/' ? 'shadow-[0_2px_0_0_var(--color-chess-green-shadow)]' : 'opacity-70'
                }`}
              >
                {user ? 'Path' : 'Learn'}
              </Link>
              <Link
                href="/daily-challenge"
                className={`relative px-1.5 sm:px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-all hover:opacity-90 overflow-hidden whitespace-nowrap ${
                  pathname === '/daily-challenge' ? 'shadow-[0_2px_0_0_var(--color-chess-blue-shadow)]' : 'opacity-70'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #1CB0F6 0%, #0d9ee0 100%)',
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                <span className="relative">Daily</span>
              </Link>
              {FEATURE_FLAGS.SHOW_OPENINGS && (
                <Link
                  href="/openings"
                  className={`px-1.5 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 whitespace-nowrap ${
                    pathname?.startsWith('/openings')
                      ? 'bg-chess-purple text-white shadow-[0_2px_0_0_#a855f7]'
                      : 'bg-chess-purple/70 text-white opacity-70'
                  }`}
                >
                  Openings
                </Link>
              )}
              {user ? (
                profile?.subscription_status !== 'premium' && profile?.subscription_status !== 'trial' && (
                  <Link
                    href="/pricing"
                    className="px-1.5 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: '#000',
                    }}
                  >
                    Premium
                  </Link>
                )
              ) : (
                <Link
                  href="/auth/signup"
                  className="px-1.5 sm:px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-opacity hover:opacity-90 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                  }}
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
