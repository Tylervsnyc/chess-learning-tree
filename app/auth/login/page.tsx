'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { trackEvent, identifyUser } from '@/lib/analytics/posthog';
import { BreathingRook } from '@/components/ui/BreathingRook';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const resetSuccess = searchParams.get('reset') === 'success';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetBanner, setShowResetBanner] = useState(resetSuccess);

  const humanizeError = (msg: string): string => {
    if (msg.includes('Invalid login credentials')) return 'Wrong email or password. Please try again.';
    if (msg.includes('Email not confirmed')) return 'Please check your email to confirm your account.';
    if (msg.includes('Password should be at least')) return 'Password must be at least 6 characters.';
    if (msg.includes('Unable to validate email')) return 'Please enter a valid email address.';
    if (msg.includes('User already registered')) return 'An account with this email already exists.';
    if (msg.includes('Email rate limit exceeded')) return 'Too many attempts. Please wait a minute and try again.';
    if (msg.includes('For security purposes')) return 'Too many attempts. Please wait a moment and try again.';
    return msg;
  };

  useEffect(() => {
    trackEvent('login_page_viewed', { version: 'v2' });
  }, []);

  // Auto-clear reset banner after 5 seconds
  useEffect(() => {
    if (!showResetBanner) return;
    const timer = setTimeout(() => setShowResetBanner(false), 5000);
    return () => clearTimeout(timer);
  }, [showResetBanner]);

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
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
      trackEvent('login_failed', { error: error.message, version: 'v2' });
      setError(humanizeError(error.message));
      setGoogleLoading(false);
    }
    // Don't reset googleLoading on success — browser is redirecting
  };

  const handleAppleLogin = async () => {
    setError(null);
    setAppleLoading(true);
    const supabase = createClient();

    localStorage.setItem('auth_method', 'apple');

    const redirectUrl = new URL('/auth/callback', window.location.origin);
    if (redirectTo) {
      redirectUrl.searchParams.set('next', redirectTo);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });

    if (error) {
      trackEvent('login_failed', { error: error.message, version: 'v2' });
      setError(humanizeError(error.message));
      setAppleLoading(false);
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
      trackEvent('login_failed', { error: error.message, version: 'v2' });
      setError(humanizeError(error.message));
      setLoading(false);
      return;
    }

    // Identify the user in PostHog
    if (data.user) {
      identifyUser(data.user.id, { email: data.user.email });
    }
    trackEvent('login_completed', { version: 'v2' });

    router.push(redirectTo || '/');
    router.refresh();
  };

  return (
    <div className="h-full md:h-auto bg-chess-page flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-3 pt-6 min-h-0">
        {/* Brand header */}
        <div className="mb-6 text-center">
          <Image
            src="/brand/logo-horizontal-light.svg"
            alt="Chess Path"
            width={260}
            height={60}
            className="mx-auto mb-2"
            priority
          />
        </div>

        <div className="w-full max-w-sm">
          {/* Card container */}
          <div className="bg-chess-surface border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h1 className="text-xl font-bold text-chess-text text-center mb-1">Welcome back</h1>
            <p className="text-chess-text-muted text-sm text-center mb-4">Sign in to continue</p>

            {showResetBanner && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm mb-3">
                Password updated! Sign in with your new password.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-3">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3 rounded-2xl font-bold text-chess-text bg-white border-2 border-slate-200 transition-all active:translate-y-[2px] shadow-[0_4px_0_#e2e8f0] flex items-center justify-center gap-3 hover:border-slate-300 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0"
            >
              {googleLoading ? (
                <>
                  <BreathingRook size="xs" />
                  Redirecting...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={appleLoading}
              className="w-full mt-2 py-3 rounded-2xl font-bold text-chess-text bg-white border-2 border-slate-200 transition-all active:translate-y-[2px] shadow-[0_4px_0_#e2e8f0] flex items-center justify-center gap-3 hover:border-slate-300 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0"
            >
              {appleLoading ? (
                <>
                  <BreathingRook size="xs" />
                  Redirecting...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continue with Apple
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-chess-text-faint text-xs uppercase">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-chess-text-muted mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-chess-text placeholder-slate-400 focus:outline-none focus:border-chess-blue focus:bg-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-chess-text-muted mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-chess-text placeholder-slate-400 focus:outline-none focus:border-chess-blue focus:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-chess-text-faint hover:text-chess-text-muted transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-chess-blue hover:underline text-sm font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#0d7ec4] disabled:opacity-50 disabled:shadow-none bg-chess-blue"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-chess-text-muted text-sm pt-4">
            Don&apos;t have an account?{' '}
            <Link
              href={redirectTo ? `/auth/signup?redirect=${encodeURIComponent(redirectTo)}` : '/auth/signup'}
              className="text-chess-green hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>

          <p className="text-center text-chess-text-faint text-xs pt-3">
            <Link href="/terms" className="underline hover:text-chess-text-muted">Terms</Link>
            {' '}&middot;{' '}
            <Link href="/privacy" className="underline hover:text-chess-text-muted">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-chess-page flex items-center justify-center">
        <BreathingRook label="Loading..." />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
