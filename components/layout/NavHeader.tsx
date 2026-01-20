'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useRouter, usePathname } from 'next/navigation';

// Level configuration with ELO thresholds
const LEVELS = [
  { key: 'beginner', label: 'Level 1', minElo: 0 },
  { key: 'casual', label: 'Level 2', minElo: 600 },
  { key: 'club', label: 'Level 3', minElo: 800 },
  { key: 'tournament', label: 'Level 4', minElo: 1100 },
  { key: 'advanced', label: 'Level 5', minElo: 1400 },
  { key: 'expert', label: 'Level 6', minElo: 1700 },
];

function getUnlockedLevels(elo: number) {
  // Find the highest level unlocked based on ELO
  let maxUnlockedIndex = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (elo >= LEVELS[i].minElo) {
      maxUnlockedIndex = i;
      break;
    }
  }
  // Return all levels from 1 up to and including the unlocked level
  return LEVELS.slice(0, maxUnlockedIndex + 1);
}

export function NavHeader() {
  const { user, profile, loading, signOut } = useUser();
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
    signOut().finally(() => {
      window.location.replace('/');
    });
  };

  // Don't show header on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  return (
    <header className="bg-[#1A2C35] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href={user ? '/learn' : '/'} className="text-lg font-bold text-white">
          The Chess Path
        </Link>

        <nav className="flex items-center gap-2">
          {loading ? (
            <div className="text-gray-400 text-sm">...</div>
          ) : user ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLearnDropdownOpen(!learnDropdownOpen)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                    pathname === '/learn' || pathname?.startsWith('/lesson')
                      ? 'bg-[#58CC02]/20 text-[#58CC02]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Learn
                  <svg
                    className={`w-3 h-3 transition-transform ${learnDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {learnDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1A2C35] border border-white/10 rounded-lg shadow-lg overflow-hidden min-w-[120px] z-50">
                    {getUnlockedLevels(profile?.elo_rating || 800).map((level) => (
                      <button
                        key={level.key}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        onClick={() => {
                          setLearnDropdownOpen(false);
                          router.push(`/learn?level=${level.key}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-sm text-white bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-1.5 text-sm text-white rounded-lg transition-colors"
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
