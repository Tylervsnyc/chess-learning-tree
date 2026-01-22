'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [syncing, setSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  // Sync subscription status on mount (fallback if webhook was slow/failed)
  useEffect(() => {
    async function syncSubscription() {
      if (!sessionId) {
        setSyncing(false);
        return;
      }

      try {
        const res = await fetch('/api/stripe/sync-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          const data = await res.json();
          console.error('Sync failed:', data.error);
          setSyncError(data.error);
        }
      } catch (err) {
        console.error('Sync error:', err);
        setSyncError('Failed to sync subscription');
      } finally {
        setSyncing(false);
      }
    }

    syncSubscription();
  }, [sessionId]);

  useEffect(() => {
    // Don't start countdown until sync is complete
    if (syncing) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/learn');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, syncing]);

  return (
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Success icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#58CC02] to-[#4CAF00] flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Premium!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for upgrading! You now have unlimited access to all puzzles.
        </p>

        {/* Features unlocked */}
        <div className="bg-[#1A2C35] rounded-xl p-6 mb-8 text-left">
          <div className="text-sm font-medium text-[#58CC02] mb-3">What's unlocked:</div>
          <ul className="space-y-3">
            {[
              'Unlimited puzzles every day',
              'All difficulty levels',
              'Detailed analytics',
              'Priority support',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-[#58CC02] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => router.push('/learn')}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#4CAF00] text-white font-bold text-lg transition-all hover:opacity-90 mb-4"
        >
          Start Learning
        </button>

        <p className="text-gray-500 text-sm">
          {syncing ? 'Activating your subscription...' : `Redirecting in ${countdown} seconds...`}
        </p>

        {syncError && (
          <p className="text-amber-500 text-xs mt-4">
            Note: {syncError}. Contact support if your subscription doesn&apos;t activate.
          </p>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
