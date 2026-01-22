'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents, identifyUser } from '@/lib/analytics/posthog';

function PremiumSignupContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      {/* Gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700]" />

      <div className="flex-1 flex items-center justify-center px-5 py-6">
        <div className="max-w-sm w-full">
          {/* Header with premium badge */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-3xl">👑</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Get Premium Access</h1>
            <p className="text-gray-400 text-sm">Create your account and unlock everything</p>
          </div>

          {/* Premium benefits */}
          <div className="bg-[#1A2C35] rounded-xl p-4 mb-6 border border-[#FFD700]/30">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-[#58CC02]">✓</span>
                <span className="text-gray-300">Unlimited lessons & puzzles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#58CC02]">✓</span>
                <span className="text-gray-300">All 6 skill levels unlocked</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#58CC02]">✓</span>
                <span className="text-gray-300">Track your progress forever</span>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/10 text-center">
              <span className="text-[#FFD700] font-bold text-lg">$4.99</span>
              <span className="text-gray-400 text-sm">/month</span>
            </div>
          </div>

          <form onSubmit={handleSignupAndCheckout} className="space-y-4">
            {error && (
              <div className="bg-[#FF4B4B]/10 border border-[#FF4B4B]/50 rounded-xl p-3 text-[#FF4B4B] text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1A2C35] border-2 border-transparent rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                placeholder="ChessMaster2000"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1A2C35] border-2 border-transparent rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#1A2C35] border-2 border-transparent rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
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

            <p className="text-center text-gray-500 text-xs">
              Cancel anytime. No questions asked.
            </p>

            <p className="text-center text-gray-400 text-sm pt-2">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#1CB0F6] hover:underline font-medium">
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
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <PremiumSignupContent />
    </Suspense>
  );
}
