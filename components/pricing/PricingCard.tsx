'use client';

import { useState } from 'react';

interface PricingCardProps {
  name: string;
  price: number;
  interval: 'month' | 'year';
  priceId: string;
  plan: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  savings?: string;
  isLoggedIn: boolean;
  isPremium: boolean;
  currentPlan?: string | null;
}

export function PricingCard({
  name,
  price,
  interval,
  priceId,
  plan,
  features,
  popular,
  savings,
  isLoggedIn,
  isPremium,
  currentPlan,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      // Redirect to login with return URL
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, plan }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentPlan = isPremium && currentPlan === plan;

  return (
    <div
      className={`relative rounded-2xl p-6 ${
        popular
          ? 'bg-gradient-to-b from-[#58CC02]/20 to-[#1A2C35] border-2 border-[#58CC02]'
          : 'bg-[#1A2C35] border border-[#2A3F4D]'
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#58CC02] text-black text-xs font-bold px-3 py-1 rounded-full">
            BEST VALUE
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        {savings && (
          <span className="inline-block bg-[#58CC02]/20 text-[#58CC02] text-sm font-medium px-2 py-1 rounded mb-2">
            {savings}
          </span>
        )}
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-white">${price}</span>
          <span className="text-gray-400">/{interval}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-300">
            <svg
              className="w-5 h-5 text-[#58CC02] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <button
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-bold bg-[#2A3F4D] text-white hover:bg-[#3A4F5D] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Manage Subscription'}
        </button>
      ) : isPremium ? (
        <button
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-bold bg-[#2A3F4D] text-white hover:bg-[#3A4F5D] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Switch Plan'}
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-colors disabled:opacity-50 ${
            popular
              ? 'bg-[#58CC02] text-black hover:bg-[#4AB302]'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          {isLoading ? 'Loading...' : isLoggedIn ? 'Subscribe Now' : 'Sign In to Subscribe'}
        </button>
      )}
    </div>
  );
}
