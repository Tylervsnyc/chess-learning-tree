'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useRouter, usePathname } from 'next/navigation';

export function NavHeader() {
  const { user, profile, loading, signOut } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
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
              <Link
                href="/learn"
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  pathname === '/learn' || pathname?.startsWith('/lesson')
                    ? 'bg-[#58CC02]/20 text-[#58CC02]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Learn
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${
                  pathname === '/profile'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#58CC02] to-[#1CB0F6] flex items-center justify-center text-white text-xs font-bold">
                  {(profile?.display_name || 'U')[0].toUpperCase()}
                </div>
                <span className="text-xs text-gray-400 bg-[#131F24] px-1.5 py-0.5 rounded">
                  {profile?.elo_rating || 800}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Out
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
