'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { trackEvent, SubscriptionEvents, identifyUser } from '@/lib/analytics/posthog';
import { BreathingRook } from '@/components/ui/BreathingRook';

function PremiumSignupContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Track premium signup page view for funnel analysis
  useEffect(() => {
    SubscriptionEvents.paywallViewed('premium_signup');
  }, []);

  const handleSignupAndCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    // Build the callback URL
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', '/pricing');

    // Create the account
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    if (signupError) {
      trackEvent('signup_failed', { error: signupError.message, version: 'v2' });
      setError(signupError.message);
      setLoading(false);
      return;
    }

    // Identify the user in PostHog
    if (data.user) {
      identifyUser(data.user.id, { email });
    }
    trackEvent('signup_completed', { method: 'email', version: 'v2' });

    // Now start checkout for the newly created user
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'monthly' }),
      });

      const checkoutData = await res.json();

      if (!res.ok) {
        throw new Error(checkoutData.error || 'Failed to start checkout');
      }

      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      }
    } catch (checkoutError) {
      console.error('Checkout error:', checkoutError);
      // Account was created, redirect to pricing page to try checkout again
      router.push('/pricing');
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleLoading(true);
    trackEvent('signup_started', { version: 'v2' });
    const supabase = createClient();

    localStorage.setItem('auth_method', 'google');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/pricing`,
      },
    });

    if (error) {
      trackEvent('signup_failed', { error: error.message, version: 'v2' });
      setError(error.message);
      setGoogleLoading(false);
    }
    // Don't reset googleLoading on success — browser is redirecting
  };

  const handleAppleSignup = async () => {
    setError(null);
    setAppleLoading(true);
    trackEvent('signup_started', { version: 'v2' });
    const supabase = createClient();

    localStorage.setItem('auth_method', 'apple');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/pricing`,
      },
    });

    if (error) {
      trackEvent('signup_failed', { error: error.message, version: 'v2' });
      setError(error.message);
      setAppleLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-chess-page flex flex-col">
      {/* Gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-chess-gold via-chess-orange to-chess-gold" />

      <div className="flex-1 flex flex-col justify-start px-4 md:px-6 pt-3">
        <div className="max-w-md md:max-w-lg w-full mx-auto">
          {/* Header with premium rook */}
          <div className="text-center mb-2">
            <div className="mx-auto mb-1">
              <BreathingRook size="md" />
            </div>
            <h1 className="text-xl font-black text-chess-text mb-0.5">Get Premium Access</h1>
            <p className="text-chess-text-muted text-sm">Create your account and unlock everything</p>
          </div>

          {/* Premium benefits */}
          <div className="rounded-2xl p-2.5 mb-3 border border-chess-gold/40 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFECB3)' }}>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-chess-green font-bold">✓</span>
                <span className="text-amber-900/70">Unlimited lessons & puzzles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-chess-green font-bold">✓</span>
                <span className="text-amber-900/70">All 8 skill levels unlocked</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-chess-green font-bold">✓</span>
                  <span className="text-amber-900/70">Track your progress forever</span>
                </div>
                <div className="shrink-0">
                  <span className="text-amber-700 font-bold text-lg">$4.99</span>
                  <span className="text-amber-900/50 text-sm">/mo</span>
                </div>
              </li>
            </ul>
          </div>

          {error && (
            <div className="bg-chess-red/10 border border-chess-red/50 rounded-xl p-3 text-chess-red text-sm mb-3">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full py-3 rounded-2xl font-bold text-chess-text bg-white border-2 border-slate-200 transition-all active:translate-y-[2px] shadow-[0_4px_0_#e2e8f0] flex items-center justify-center gap-3 hover:border-slate-300 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0"
          >
            {googleLoading ? (
              <>
                <span className="h-5 w-5 border-2 border-slate-300 border-t-chess-blue rounded-full animate-spin" />
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
            onClick={handleAppleSignup}
            disabled={appleLoading || googleLoading}
            className="w-full mt-2 py-3 rounded-2xl font-bold text-chess-text bg-white border-2 border-slate-200 transition-all active:translate-y-[2px] shadow-[0_4px_0_#e2e8f0] flex items-center justify-center gap-3 hover:border-slate-300 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0"
          >
            {appleLoading ? (
              <>
                <span className="h-5 w-5 border-2 border-slate-300 border-t-chess-blue rounded-full animate-spin" />
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

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-chess-text-faint text-xs uppercase">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSignupAndCheckout} className="space-y-2.5">
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-chess-surface text-chess-text placeholder:text-chess-text-faint focus:outline-none focus:ring-2 focus:ring-chess-green"
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
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-chess-surface text-chess-text placeholder:text-chess-text-faint focus:outline-none focus:ring-2 focus:ring-chess-green"
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
              <p className="text-xs text-chess-text-faint mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 border-b-4 border-orange-700 active:border-b-0 active:mt-1 text-white font-bold py-3 text-base rounded-2xl transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Get Premium - $4.99/mo'}
            </button>

            <p className="text-center text-chess-text-faint text-xs">
              Cancel anytime. No questions asked.
            </p>

            <p className="text-center text-chess-text-muted text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-chess-blue hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PremiumSignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-full bg-chess-page flex items-center justify-center">
        <div className="text-chess-text-muted">Loading...</div>
      </div>
    }>
      <PremiumSignupContent />
    </Suspense>
  );
}
