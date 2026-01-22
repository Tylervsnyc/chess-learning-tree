'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SubscriptionEvents } from '@/lib/analytics/posthog';

export default function RedeemPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } catch (e) {
        // If auth check fails, assume not logged in
        setIsLoggedIn(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoggedIn === null) {
        setIsLoggedIn(false);
      }
    }, 5000);

    checkAuth();

    return () => clearTimeout(timeout);
  }, []);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    SubscriptionEvents.promoCodeEntered(code);

    try {
      const response = await fetch('/api/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        SubscriptionEvents.promoCodeFailed(code, data.error || 'Unknown error');
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      SubscriptionEvents.promoCodeRedeemed(code, data.premiumDays);
      setSuccess(data.message);
      setCode('');

      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/home');
      }, 2000);

    } catch (err) {
      SubscriptionEvents.promoCodeFailed(code, 'Network error');
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className="text-3xl font-bold text-white mb-2">Redeem Code</h1>
          <p className="text-gray-400">
            Enter your promo code to unlock premium features
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="bg-[#1A2C35] rounded-xl p-6 text-center">
            <p className="text-gray-300 mb-4">
              You need an account to redeem a promo code.
            </p>
            <div className="space-y-3">
              <Link
                href="/auth/signup"
                className="block w-full py-3 bg-[#58CC02] hover:bg-[#4CAD02] text-white font-semibold rounded-lg transition-colors text-center"
              >
                Create Account
              </Link>
              <Link
                href="/auth/login"
                className="block w-full py-3 bg-[#131F24] border border-gray-600 hover:border-gray-500 text-white font-semibold rounded-lg transition-colors text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRedeem} className="bg-[#1A2C35] rounded-xl p-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
                Promo Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                disabled={!!success}
                className="w-full px-4 py-3 bg-[#131F24] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#58CC02] text-center text-xl tracking-wider uppercase"
                placeholder="ENTER CODE"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full py-3 bg-[#58CC02] hover:bg-[#4CAD02] disabled:bg-[#58CC02]/50 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Redeeming...' : success ? 'Redirecting...' : 'Redeem Code'}
            </button>

            <p className="text-center text-gray-500 text-sm">
              Don't have a code?{' '}
              <Link href="/home" className="text-[#1CB0F6] hover:underline">
                Continue to app
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
