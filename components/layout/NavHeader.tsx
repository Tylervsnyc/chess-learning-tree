'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { usePathname } from 'next/navigation';

export function NavHeader() {
  const { user, profile, loading } = useUser();
  const pathname = usePathname();
  const [portalLoading, setPortalLoading] = useState(false);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      if (res.ok) {
        const { url } = await res.json();
        if (url) window.location.href = url;
      }
    } catch (error) {
      console.error('Portal error:', error);
    }
    setPortalLoading(false);
  };

  const handleSignOut = () => {
    window.location.href = '/api/auth/logout';
  };

  // Don't show header on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href={user ? '/learn' : '/'} className="flex items-center">
          <Image
            src="/brand/logo-horizontal-light.svg"
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
              <div className="w-14 h-6 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-12 h-6 bg-slate-200 rounded-md animate-pulse" />
            </>
          ) : user ? (
            <>
              {profile?.subscription_status === 'premium' || profile?.subscription_status === 'trial' ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    color: '#fff',
                  }}
                >
                  {portalLoading ? '...' : 'Manage'}
                </button>
              ) : (
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
