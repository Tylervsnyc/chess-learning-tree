'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

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
      <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
        <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">🎁</div>
            <p className="text-white">Activating your gift...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
        <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />
        <div className="flex-1 flex flex-col items-center justify-center px-3">
          <div className="max-w-[320px] w-full text-center">
            <div className="text-5xl mb-4">😕</div>
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.push('/onboarding')}
              className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
              style={{ backgroundColor: '#58CC02' }}
            >
              Continue anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-3 pt-8 min-h-0">
        {/* Gift emoji */}
        <div className="text-5xl mb-4">🎁</div>

        {/* Brand logo */}
        <Image
          src="/brand/icon-96.svg"
          alt="Chess Path"
          width={72}
          height={72}
          className="mx-auto mb-3"
        />

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-1">
          <span className="text-white">Welcome to </span>
          <span className="text-white">chess</span>
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }}>path</span>
          <span className="text-white">!</span>
        </h1>

        {/* Premium badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#58CC02]/30 bg-[#58CC02]/10 mb-4">
          <span className="text-[#58CC02] text-sm font-medium">✓ Premium membership active</span>
        </div>

        <p className="text-gray-400 text-center mb-6 max-w-[280px]">
          You have 30 days of unlimited access to all lessons and features.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push('/onboarding')}
          className="w-full max-w-[320px] py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02' }}
        >
          Start Learning
        </button>

        <p className="text-gray-500 text-sm mt-3">
          Let&apos;s find your skill level and get started!
        </p>
      </div>
    </div>
  );
}
