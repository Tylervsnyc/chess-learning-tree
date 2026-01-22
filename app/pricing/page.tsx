'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startCheckout, startGuestCheckout, isAuthenticated, isPremium, loading } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGetPremium = async () => {
    if (!isAuthenticated) {
      // Guest checkout flow
      if (!email) {
        setEmailError('Please enter your email');
        return;
      }
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email');
        return;
      }
      setEmailError(null);
      setCheckoutLoading(true);
      try {
        await startGuestCheckout('monthly', email);
      } catch {
        setCheckoutLoading(false);
      }
      return;
    }

    setCheckoutLoading(true);
    try {
      await startCheckout('monthly');
    } catch {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-3">
          Unlock Your Full Potential
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Choose how you want to learn chess
        </p>
      </div>

      {/* Success/Cancel Messages */}
      {success && (
        <div className="mb-8 p-4 bg-[#58CC02]/20 border border-[#58CC02] rounded-xl text-center">
          <p className="text-[#58CC02] font-medium">
            Welcome to Premium! Your subscription is now active.
          </p>
        </div>
      )}

      {canceled && (
        <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500 rounded-xl text-center">
          <p className="text-yellow-500 font-medium">
            Checkout was canceled. Feel free to try again when you&apos;re ready.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#58CC02]"></div>
        </div>
      ) : isPremium ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <span className="text-4xl">👑</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">You&apos;re Premium!</h2>
          <p className="text-gray-400 mb-6">You have unlimited access to all features.</p>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-3 bg-[#58CC02] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Continue Learning
          </button>
        </div>
      ) : (
        <>
          {/* Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {/* Free Tier */}
            <div className="bg-[#1A2C35] rounded-2xl p-6 border border-white/10">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-300 mb-1">Free</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-white">$0</span>
                </div>
              </div>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-0.5">✕</span>
                  <div>
                    <p className="text-gray-300">2 lessons per day</p>
                    <p className="text-gray-500 text-sm">Limited daily practice</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-0.5">✕</span>
                  <div>
                    <p className="text-gray-300">Current level only</p>
                    <p className="text-gray-500 text-sm">Can&apos;t skip ahead or review</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-0.5">✕</span>
                  <div>
                    <p className="text-gray-300">15 puzzles per day</p>
                    <p className="text-gray-500 text-sm">Daily limit on practice</p>
                  </div>
                </li>
              </ul>

              <div className="text-center">
                <span className="text-gray-500 text-sm">Your current plan</span>
              </div>
            </div>

            {/* Premium Tier */}
            <div className="bg-gradient-to-b from-[#2A3F4D] to-[#1A2C35] rounded-2xl p-6 border-2 border-[#FFD700] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-xs font-bold rounded-full">
                RECOMMENDED
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Premium</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-[#FFD700]">$4.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#58CC02] mt-0.5">✓</span>
                  <div>
                    <p className="text-white font-medium">Unlimited lessons</p>
                    <p className="text-gray-400 text-sm">Learn as much as you want</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#58CC02] mt-0.5">✓</span>
                  <div>
                    <p className="text-white font-medium">All 6 levels unlocked</p>
                    <p className="text-gray-400 text-sm">From beginner to expert</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#58CC02] mt-0.5">✓</span>
                  <div>
                    <p className="text-white font-medium">Unlimited puzzles</p>
                    <p className="text-gray-400 text-sm">Practice without limits</p>
                  </div>
                </li>
              </ul>

              <button
                onClick={handleGetPremium}
                disabled={checkoutLoading}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                {checkoutLoading ? 'Loading...' : isAuthenticated ? 'Get Premium' : 'Sign Up & Get Premium'}
              </button>
            </div>
          </div>

          {/* Trust badge */}
          <div className="text-center text-gray-500 text-sm">
            <p>Cancel anytime. No questions asked.</p>
          </div>
        </>
      )}
    </div>
  );
}

function PricingFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="mb-8 h-6 w-32 bg-[#1A2C35] rounded animate-pulse mx-auto" />
        <div className="h-10 w-64 bg-[#1A2C35] rounded animate-pulse mx-auto mb-4" />
        <div className="h-4 w-96 bg-[#1A2C35] rounded animate-pulse mx-auto" />
      </div>
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#58CC02]"></div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      <Suspense fallback={<PricingFallback />}>
        <PricingContent />
      </Suspense>
    </div>
  );
}
