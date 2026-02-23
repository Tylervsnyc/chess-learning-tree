'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents, SubscriptionEvents, identifyUser } from '@/lib/analytics/posthog';
import { BreathingRook } from '@/components/ui/BreathingRook';

function PremiumSignupContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      AuthEvents.signupFailed(signupError.message);
      setError(signupError.message);
      setLoading(false);
      return;
    }

    // Identify the user in PostHog
    if (data.user) {
      identifyUser(data.user.id, { email });
    }
    AuthEvents.signupCompleted('email');

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

  return (
    <div className="min-h-full bg-chess-page flex flex-col">
      {/* Gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-chess-gold via-chess-orange to-chess-gold" />

      <div className="flex-1 flex flex-col justify-start px-5 pt-4">
        <div className="max-w-sm w-full mx-auto">
          {/* Header with premium rook */}
          <div className="text-center mb-3">
            <div className="mx-auto mb-2">
              <BreathingRook size="lg" />
            </div>
            <h1 className="text-2xl font-black text-chess-text mb-1">Get Premium Access</h1>
            <p className="text-chess-text-muted text-sm">Create your account and unlock everything</p>
          </div>

          {/* Premium benefits */}
          <div className="rounded-2xl p-3 mb-4 border border-chess-gold/40 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFECB3)' }}>
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

          <form onSubmit={handleSignupAndCheckout} className="space-y-3">
            {error && (
              <div className="bg-chess-red/10 border border-chess-red/50 rounded-xl p-3 text-chess-red text-sm">
                {error}
              </div>
            )}

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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-chess-surface text-chess-text placeholder:text-chess-text-faint focus:outline-none focus:ring-2 focus:ring-chess-green"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-chess-text-muted mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-chess-surface text-chess-text placeholder:text-chess-text-faint focus:outline-none focus:ring-2 focus:ring-chess-green"
                placeholder="••••••••"
              />
              <p className="text-xs text-chess-text-faint mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 border-b-4 border-orange-700 active:border-b-0 active:mt-1 text-white font-bold py-4 text-lg rounded-2xl transition-all hover:opacity-90 disabled:opacity-50"
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
