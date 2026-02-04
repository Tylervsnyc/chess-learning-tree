'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents, identifyUser } from '@/lib/analytics/posthog';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AuthEvents.loginPageViewed();
  }, []);

  const handleGoogleLogin = async () => {
    setError(null);
    const supabase = createClient();

    localStorage.setItem('auth_method', 'google');

    const redirectUrl = new URL('/auth/callback', window.location.origin);
    if (redirectTo) {
      redirectUrl.searchParams.set('next', redirectTo);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });

    if (error) {
      AuthEvents.loginFailed(error.message);
      setError(error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      AuthEvents.loginFailed(error.message);
      setError(error.message);
      setLoading(false);
      return;
    }

    // Identify the user in PostHog
    if (data.user) {
      identifyUser(data.user.id, { email: data.user.email });
    }
    AuthEvents.loginCompleted();

    router.push(redirectTo || '/learn');
    router.refresh();
  };

  return (
    <div className="h-full bg-[#eef6fc] flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-3 pt-6 min-h-0">
        {/* Brand header */}
        <div className="mb-6 text-center">
          <Image
            src="/brand/logo-stacked-light.svg"
            alt="Chess Path"
            width={180}
            height={108}
            className="mx-auto mb-2"
            priority
          />
        </div>

        <div className="w-full max-w-[320px]">
          {/* Card container */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h1 className="text-xl font-bold text-[#3c3c3c] text-center mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm text-center mb-4">Sign in to continue</p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-3">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-2xl font-bold text-gray-700 bg-white border-2 border-slate-200 transition-all active:translate-y-[2px] shadow-[0_4px_0_#e2e8f0] flex items-center justify-center gap-3 hover:border-slate-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs uppercase">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[#3c3c3c] placeholder-slate-400 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[#3c3c3c] placeholder-slate-400 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#0d7ec4] disabled:opacity-50 disabled:shadow-none"
                style={{ backgroundColor: '#1CB0F6' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-500 text-sm pt-4">
            Don&apos;t have an account?{' '}
            <Link
              href={redirectTo ? `/auth/signup?redirect=${encodeURIComponent(redirectTo)}` : '/auth/signup'}
              className="text-[#58CC02] hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
