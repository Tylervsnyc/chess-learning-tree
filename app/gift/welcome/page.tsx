'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function GiftWelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const applyPromoCode = async () => {
      if (!code) {
        setStatus('success'); // No code, just show welcome
        return;
      }

      try {
        const response = await fetch('/api/promo/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          // If already redeemed, that's fine
          if (data.error?.includes('already redeemed')) {
            setStatus('success');
            return;
          }
          setError(data.error);
          setStatus('error');
          return;
        }

        setStatus('success');
      } catch (e) {
        setError('Failed to apply gift. Please try again.');
        setStatus('error');
      }
    };

    applyPromoCode();
  }, [code]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🎁</div>
          <p className="text-white">Activating your gift...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">😕</div>
          <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-8 py-3 bg-[#58CC02] text-white font-bold rounded-xl"
          >
            Continue anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Welcome to The Chess Path!
        </h1>
        <p className="text-xl text-[#58CC02] font-medium mb-2">
          Your premium membership is active
        </p>
        <p className="text-gray-400 mb-8">
          You have 30 days of unlimited access to all lessons and features.
        </p>

        <button
          onClick={() => router.push('/onboarding')}
          className="w-full py-4 bg-[#58CC02] hover:bg-[#4CAD02] text-white font-bold text-lg rounded-xl transition-colors mb-4"
        >
          Start Learning Chess
        </button>

        <p className="text-gray-500 text-sm">
          Let's find out your skill level and get you started!
        </p>
      </div>
    </div>
  );
}
