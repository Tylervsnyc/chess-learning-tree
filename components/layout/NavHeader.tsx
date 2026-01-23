'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { useRouter, usePathname } from 'next/navigation';

// Level configuration with ELO thresholds and rating ranges
const LEVELS = [
  { key: 'beginner', label: 'Level 1', minElo: 0, ratingRange: '400-800' },
  { key: 'casual', label: 'Level 2', minElo: 600, ratingRange: '800-1000' },
  { key: 'club', label: 'Level 3', minElo: 800, ratingRange: '1000-1200' },
  { key: 'tournament', label: 'Level 4', minElo: 1100, ratingRange: '1200-1400' },
  { key: 'advanced', label: 'Level 5', minElo: 1400, ratingRange: '1400-1600' },
  { key: 'expert', label: 'Level 6', minElo: 1700, ratingRange: '1600-1800' },
  { key: 'elite', label: 'Level 7', minElo: 1900, ratingRange: '1800-2000' },
  { key: 'legend', label: 'Level 8', minElo: 2100, ratingRange: '2000-2200' },
];

function getMaxUnlockedIndex(elo: number) {
  // Find the highest level unlocked based on ELO
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (elo >= LEVELS[i].minElo) {
      return i;
    }
  }
  return 0;
}

export function NavHeader() {
  const { user, profile, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLearnDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    window.location.href = '/api/auth/logout';
  };

  // Don't show header on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  return (
    <header className="bg-[#1A2C35] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href={user ? '/learn' : '/'} className="flex items-center">
          <Image
            src="/brand/logo-horizontal-dark.svg"
            alt="Chess Path"
            width={140}
            height={24}
            className="flex-shrink-0"
          />
        </Link>

        <nav className="flex items-center gap-1.5">
          {loading ? (
            <>
              {/* Skeleton buttons to prevent layout shift */}
              <div className="w-14 h-6 bg-gray-700/50 rounded-md animate-pulse" />
              <div className="w-12 h-6 bg-gray-700/50 rounded-md animate-pulse" />
            </>
          ) : user ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLearnDropdownOpen(!learnDropdownOpen)}
                  className="px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-opacity hover:opacity-90 flex items-center gap-1"
                  style={{ background: 'linear-gradient(135deg, #58CC02 0%, #45a001 100%)' }}
                >
                  Learn
                  <svg
                    className={`w-2.5 h-2.5 transition-transform ${learnDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {learnDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1A2C35] border border-white/10 rounded-lg shadow-lg overflow-hidden min-w-[180px] z-50">
                    {LEVELS.map((level, index) => {
                      const isPremium = profile?.subscription_status === 'premium' || profile?.subscription_status === 'trial';
                      const maxUnlocked = getMaxUnlockedIndex(profile?.elo_rating || 800);
                      // Premium users have all levels unlocked
                      const isLocked = !isPremium && index > maxUnlocked;

                      if (isLocked) {
                        return (
                          <div
                            key={level.key}
                            className="block w-full text-left px-4 py-2 text-sm cursor-not-allowed"
                          >
                            <span className="text-gray-500">{level.label}: Locked</span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={level.key}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                          onClick={() => {
                            setLearnDropdownOpen(false);
                            router.push(`/learn?level=${level.key}`);
                            window.scrollTo(0, 0);
                          }}
                        >
                          <span className="text-gray-300 hover:text-white">{level.label}</span>
                          <span className="text-gray-500 ml-2 text-xs">{level.ratingRange}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {profile?.subscription_status !== 'premium' && profile?.subscription_status !== 'trial' && (
                <Link
                  href="/pricing"
                  className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90"
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
                className="px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/premium-signup"
                className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Premium
              </Link>
              <Link
                href="/auth/login"
                className="px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1CB0F6 0%, #0d9ee0 100%)' }}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-2.5 py-1 text-xs text-white font-semibold rounded-md transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
