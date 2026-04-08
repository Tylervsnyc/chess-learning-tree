'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { SubscriptionEvents } from '@/lib/analytics/posthog';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [syncing, setSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  async function syncSubscription() {
    if (!sessionId) {
      setSyncing(false);
      return;
    }

    setSyncing(true);
    setSyncError(null);

    try {
      const res = await fetch('/api/stripe/sync-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Sync failed:', data.error);
        setSyncError(data.error || 'Failed to activate subscription');
      } else {
        const trigger = sessionStorage.getItem('checkout_trigger') || undefined;
        SubscriptionEvents.checkoutCompleted('monthly', trigger);
        sessionStorage.removeItem('checkout_trigger');
      }
    } catch (err) {
      console.error('Sync error:', err);
      setSyncError('Failed to sync subscription');
    } finally {
      setSyncing(false);
    }
  }

  // Sync subscription status on mount (fallback if webhook was slow/failed)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { syncSubscription(); }, [sessionId]);

  useEffect(() => {
    // Don't start countdown until sync is complete AND successful
    if (syncing || syncError) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, syncing, syncError]);

  if (syncError) {
    return (
      <div className="min-h-full bg-chess-page flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Rookie error */}
          <div className="flex justify-center mb-6">
            <BreathingRook size="lg" mood="defeated" animate />
          </div>

          <h1 className="text-2xl font-bold text-chess-text mb-2">Issue Activating Subscription</h1>
          <p className="text-chess-text-muted mb-8">
            There was a problem activating your subscription. Your payment was received — please try again or contact support.
          </p>

          <button
            onClick={() => syncSubscription()}
            disabled={syncing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-chess-green to-chess-green-dark text-white font-bold text-lg transition-all hover:brightness-105 mb-4 shadow-sm disabled:opacity-50"
          >
            {syncing ? 'Retrying...' : 'Try Again'}
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl bg-chess-surface text-chess-text-muted font-medium text-sm transition-all hover:text-chess-text"
          >
            Continue to App
          </button>

          <p className="text-chess-text-faint text-xs mt-6">
            If the problem persists, contact support. Your payment is safe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-chess-page flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Rookie celebration */}
        <div className="flex justify-center mb-6">
          <BreathingRook size="lg" mood="happy" animate />
        </div>

        <h1 className="text-3xl font-bold text-chess-text mb-2">Welcome to Premium!</h1>
        <p className="text-chess-text-muted mb-8">
          You just made my day, and I don&apos;t even have days. Unlimited chess awaits.
        </p>

        {/* Features unlocked */}
        <div className="bg-chess-surface rounded-2xl p-6 mb-8 text-left shadow-sm">
          <div className="text-sm font-medium text-chess-green mb-3">What&apos;s unlocked:</div>
          <ul className="space-y-3">
            {[
              'Unlimited puzzles every day',
              'All difficulty levels',
              'Detailed analytics',
              'Priority support',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-chess-text-muted">
                <svg className="w-5 h-5 text-chess-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-chess-green to-chess-green-dark text-white font-bold text-lg transition-all hover:brightness-105 mb-4 shadow-sm"
        >
          Start Learning
        </button>

        <p className="text-chess-text-faint text-sm">
          {syncing ? 'Activating your subscription...' : `Redirecting in ${countdown} seconds...`}
        </p>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-full bg-chess-page flex items-center justify-center">
        <div className="text-chess-text-muted">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
