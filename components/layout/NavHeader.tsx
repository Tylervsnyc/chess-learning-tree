'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { useLessonProgress } from '@/hooks/useProgress';
import { usePathname } from 'next/navigation';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

export function NavHeader() {
  const { user, profile, loading } = useUser();
  const { currentStreak, loaded: progressLoaded } = useLessonProgress();
  const pathname = usePathname();

  const handleSignOut = () => {
    window.location.href = '/api/auth/logout';
  };

  // Don't show header on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  // Show streak counter only on /learn and /daily-challenge
  const showStreakCounter = pathname === '/learn' || pathname === '/daily-challenge';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href={user ? '/learn' : '/'} className="flex items-center">
          <Image
            src="/brand/logo-horizontal-light.svg"
            alt="Chess Path"
            width={160}
            height={28}
            className="flex-shrink-0"
          />
        </Link>

        <nav className="flex items-center gap-1.5">
          {/* Streak counter - shown on /learn and /daily-challenge */}
          {FEATURE_FLAGS.SHOW_STREAK_COUNTER && showStreakCounter && progressLoaded && currentStreak > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-md text-white text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF9500 100%)',
                boxShadow: '0 0 8px rgba(255, 107, 0, 0.4)',
              }}
            >
              <span>🔥</span>
              <span>{currentStreak}</span>
            </div>
          )}
          {loading ? (
            <>
              {/* Skeleton buttons to prevent layout shift */}
              <div className="w-14 h-6 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-12 h-6 bg-slate-200 rounded-md animate-pulse" />
            </>
          ) : user ? (
            <>
              <Link
                href="/learn"
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 bg-[#58CC02] text-white whitespace-nowrap ${
                  pathname === '/learn' ? 'shadow-[0_2px_0_0_#2d7a01]' : 'opacity-70'
                }`}
              >
                Path
              </Link>
              <Link
                href="/daily-challenge"
                className={`relative px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-all hover:opacity-90 overflow-hidden whitespace-nowrap ${
                  pathname === '/daily-challenge' ? 'shadow-[0_2px_0_0_#0a6e99]' : 'opacity-70'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #1CB0F6 0%, #0d9ee0 100%)',
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                <span className="relative">Daily</span>
              </Link>
              {profile?.subscription_status !== 'premium' && profile?.subscription_status !== 'trial' && (
                <Link
                  href="/pricing"
                  className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                  }}
                >
                  Premium
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/premium-signup"
                className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Premium
              </Link>
              <Link
                href="/auth/login"
                className="px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #1CB0F6 0%, #0d9ee0 100%)' }}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
