'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PricingCard } from '@/components/pricing/PricingCard';
import { createClient } from '@/lib/supabase/client';

const FEATURES = [
  'All chess lessons and puzzles',
  'Personalized learning path',
  'Progress tracking & analytics',
  'Daily challenges',
  'Skills profile insights',
  'Ad-free experience',
];

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user) {
        // Check subscription status
        try {
          const response = await fetch('/api/stripe/subscription');
          const data = await response.json();

          if (data.subscription) {
            setIsPremium(data.isPremium);
            setCurrentPlan(data.subscription.plan);
          }
        } catch (error) {
          console.error('Failed to fetch subscription:', error);
        }
      }

      setIsLoading(false);
    }

    checkAuth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <button
          onClick={() => router.push('/')}
          className="mb-8 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-4">
          The Chess Path{' '}
          <span className="text-[#58CC02]">Premium</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Unlock your full chess potential with unlimited access to all lessons,
          puzzles, and personalized insights.
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

      {/* Pricing Cards */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#58CC02]"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <PricingCard
            name="Monthly"
            price={9.99}
            interval="month"
            priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!}
            plan="monthly"
            features={FEATURES}
            isLoggedIn={isLoggedIn}
            isPremium={isPremium}
            currentPlan={currentPlan}
          />

          <PricingCard
            name="Yearly"
            price={79.99}
            interval="year"
            priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!}
            plan="yearly"
            features={FEATURES}
            popular
            savings="Save 33%"
            isLoggedIn={isLoggedIn}
            isPremium={isPremium}
            currentPlan={currentPlan}
          />
        </div>
      )}

      {/* FAQ or Benefits */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Why Go Premium?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#1A2C35] rounded-xl">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-bold mb-2">Full Curriculum</h3>
            <p className="text-gray-400 text-sm">
              Access all lessons from beginner to advanced levels
            </p>
          </div>
          <div className="p-6 bg-[#1A2C35] rounded-xl">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold mb-2">Track Progress</h3>
            <p className="text-gray-400 text-sm">
              See your strengths and weaknesses with detailed analytics
            </p>
          </div>
          <div className="p-6 bg-[#1A2C35] rounded-xl">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold mb-2">Daily Challenges</h3>
            <p className="text-gray-400 text-sm">
              Keep your skills sharp with new puzzles every day
            </p>
          </div>
        </div>
      </div>

      {/* Guarantee */}
      <div className="mt-12 text-center text-gray-400">
        <p className="text-sm">
          Cancel anytime. No questions asked.
        </p>
      </div>
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
