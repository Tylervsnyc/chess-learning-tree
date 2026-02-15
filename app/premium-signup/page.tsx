'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents, SubscriptionEvents, identifyUser } from '@/lib/analytics/posthog';

function PremiumSignupContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
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
        data: {
          display_name: displayName,
        },
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
      identifyUser(data.user.id, { email, displayName });
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

      <div className="flex-1 flex items-center justify-center px-5 py-6">
        <div className="max-w-sm w-full">
          {/* Header with premium badge */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-3xl">👑</span>
            </div>
            <h1 className="text-2xl font-black text-chess-text mb-2">Get Premium Access</h1>
            <p className="text-chess-text-muted text-sm">Create your account and unlock everything</p>
          </div>

          {/* Premium benefits */}
          <div className="bg-chess-surface rounded-xl p-4 mb-6 border border-chess-gold/30 shadow-sm">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-chess-green">✓</span>
                <span className="text-chess-text-muted">Unlimited lessons & puzzles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-chess-green">✓</span>
                <span className="text-chess-text-muted">All 6 skill levels unlocked</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-chess-green">✓</span>
                <span className="text-chess-text-muted">Track your progress forever</span>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-chess-text-faint/10 text-center">
              <span className="text-chess-gold font-bold text-lg">$4.99</span>
              <span className="text-chess-text-muted text-sm">/month</span>
            </div>
          </div>

          <form onSubmit={handleSignupAndCheckout} className="space-y-4">
            {error && (
              <div className="bg-chess-red/10 border border-chess-red/50 rounded-xl p-3 text-chess-red text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-chess-text-muted mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-chess-surface border-2 border-transparent rounded-xl text-chess-text placeholder-chess-text-faint focus:outline-none focus:border-chess-gold transition-colors shadow-sm"
                placeholder="ChessMaster2000"
              />
            </div>

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
                className="w-full px-4 py-3 bg-chess-surface border-2 border-transparent rounded-xl text-chess-text placeholder-chess-text-faint focus:outline-none focus:border-chess-gold transition-colors shadow-sm"
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
                className="w-full px-4 py-3 bg-chess-surface border-2 border-transparent rounded-xl text-chess-text placeholder-chess-text-faint focus:outline-none focus:border-chess-gold transition-colors shadow-sm"
                placeholder="••••••••"
              />
              <p className="text-xs text-chess-text-faint mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-lg transition-all active:translate-y-[2px] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                boxShadow: '0 4px 0 #b8860b',
              }}
            >
              {loading ? 'Creating account...' : 'Get Premium - $4.99/mo'}
            </button>

            <p className="text-center text-chess-text-faint text-xs">
              Cancel anytime. No questions asked.
            </p>

            <p className="text-center text-chess-text-muted text-sm pt-2">
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
