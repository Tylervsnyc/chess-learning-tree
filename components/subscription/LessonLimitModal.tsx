'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionEvents } from '@/lib/analytics/posthog';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { useSubscription } from '@/hooks/useSubscription';
import { MONETIZATION_ENABLED } from '@/lib/feature-flags';
import { useIsNativeApp } from '@/lib/native-app';

const GUEST_QUIPS = [
  'Your chess moves are too good to lose!',
  'Even Magnus saves his games.',
  "Don't let your brilliance vanish into thin air.",
  'Your brain worked hard for these skills. Be kind to it.',
  'Future you will thank present you.',
];

interface LessonLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonsCompleted: number;
  isLoggedIn: boolean;
}

export function LessonLimitModal({ isOpen, onClose, lessonsCompleted, isLoggedIn }: LessonLimitModalProps) {
  const router = useRouter();
  const { startCheckout } = useSubscription();
  // Inside the Chess Boxing iOS shell: no Premium CTA (Apple 3.1.1); keep the close path.
  const nativeApp = useIsNativeApp();
  const [variant, setVariant] = useState('control');
  const [monthlyPrice, setMonthlyPrice] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && MONETIZATION_ENABLED) {
      SubscriptionEvents.paywallViewed(isLoggedIn ? 'daily_limit' : 'guest_limit');
    }
  }, [isOpen, isLoggedIn]);

  // Fetch dynamic pricing for logged-in users
  useEffect(() => {
    if (!MONETIZATION_ENABLED || !isOpen || !isLoggedIn) return;
    setMonthlyPrice(null);
    setCheckoutError(null);
    fetch('/api/pricing-experiment')
      .then(res => res.json())
      .then(data => {
        setVariant(data.variant || 'control');
        setMonthlyPrice(data.monthlyPrice ?? 499);
      })
      .catch(() => {
        setVariant('control');
        setMonthlyPrice(499);
      });
  }, [isOpen, isLoggedIn]);

  // Pick a random quip once when modal opens (stable across re-renders)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const quip = useMemo(() => GUEST_QUIPS[Math.floor(Math.random() * GUEST_QUIPS.length)], [isOpen]);

  // Skip paywall entirely when monetization is off
  if (!MONETIZATION_ENABLED || !isOpen) return null;

  const handleSignUpFree = () => {
    router.push('/auth/signup');
  };

  const handleUpgradePremium = async () => {
    if (!isLoggedIn) {
      router.push('/auth/signup?redirect=/pricing');
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      await startCheckout('monthly', variant, 'daily_limit');
    } catch {
      setCheckoutError('Something went wrong. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const handleMaybeLater = () => {
    onClose();
  };

  const breathingLogo = (
    <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden">
      <style>{`@keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }`}</style>
      <div style={{ animation: 'breathe 1s ease-in-out infinite' }}>
        <AnimatedLogo iconOnly size="sm" theme="dark" autoPlay={false} />
      </div>
    </div>
  );

  // Non-logged in user: Show sign up options
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-chess-bg-light rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-white/10">
          {/* Icon */}
          <div className="text-center mb-5">
            {breathingLogo}

            <h2 className="text-2xl font-black text-white mb-2">
              Save Your Progress!
            </h2>

            <p className="text-chess-text-muted">
              {quip}
            </p>
          </div>

          {/* Sign up to save progress */}
          <div className="bg-chess-bg-deep rounded-xl p-4 mb-4">
            <p className="text-white font-bold text-center mb-2">
              Save Your Progress on Chess Path!
            </p>
            <p className="text-chess-text-muted text-sm text-center mb-4">
              Create a free account to keep your streak alive. You&apos;ll get 4 free lessons per day — more than enough to level up.
            </p>
            <button
              onClick={handleSignUpFree}
              className="w-full py-3 rounded-xl bg-chess-green border-b-4 border-chess-green-dark active:border-b-0 active:mt-1 text-white font-bold text-lg transition-all hover:brightness-105"
            >
              Sign Up Free
            </button>
          </div>

          {/* Or go premium */}
          {!nativeApp && (
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
            <p className="text-white font-bold text-center mb-2">
              Want unlimited lessons?
            </p>
            <p className="text-chess-text-muted text-sm text-center mb-3">
              Become a Premium member for <span className="text-chess-green font-bold">$4.99/month</span> and practice as much as you want, every day.
            </p>
            <button
              onClick={handleUpgradePremium}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 border-b-4 border-orange-700 active:border-b-0 active:mt-1 text-white font-bold transition-all hover:brightness-105"
            >
              Sign Up for Premium
            </button>
          </div>
          )}

          <button
            onClick={handleMaybeLater}
            className="w-full py-3 mt-4 rounded-xl bg-transparent text-chess-text-muted font-medium text-sm hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    );
  }

  // Logged in free user: Congratulations + premium upsell
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-chess-bg-light rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-white/10">
        {/* Celebration icon */}
        <div className="text-center mb-5">
          {breathingLogo}

          <h2 className="text-2xl font-black text-white mb-2">
            Congratulations!
          </h2>

          <p className="text-chess-text-muted">
            You&apos;ve completed your chess learning for today
          </p>
        </div>

        {/* Daily completion message */}
        <div className="bg-chess-bg-deep rounded-xl p-4 mb-5 text-center">
          <p className="text-white font-bold mb-1">
            {lessonsCompleted} lessons done today
          </p>
          <p className="text-chess-text-muted text-sm">
            Great job staying consistent! Come back tomorrow for more.
          </p>
        </div>

        {/* Premium upsell */}
        {!nativeApp && (
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 mb-4 border border-yellow-500/20">
          <p className="text-white font-bold text-center mb-2">
            Want to keep going?
          </p>
          <p className="text-chess-text-muted text-sm text-center mb-1">
            Upgrade to Premium for unlimited lessons every day.
          </p>
          <div className="flex items-baseline justify-center gap-1 mb-3">
            {monthlyPrice === null ? (
              <span className="inline-block w-16 h-8 rounded bg-white/10 animate-pulse" />
            ) : (
              <span className="text-2xl font-black text-chess-green">${(monthlyPrice / 100).toFixed(2)}</span>
            )}
            <span className="text-chess-text-muted text-sm">/month</span>
          </div>
          {checkoutError && (
            <p className="text-red-400 text-sm text-center mb-2">{checkoutError}</p>
          )}
          <button
            onClick={handleUpgradePremium}
            disabled={checkoutLoading || monthlyPrice === null}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 border-b-4 border-orange-700 active:border-b-0 active:mt-1 text-white font-bold transition-all hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading ? 'Loading...' : 'Upgrade to Premium'}
          </button>
        </div>
        )}

        <button
          onClick={handleMaybeLater}
          className="w-full py-3 rounded-xl bg-transparent text-chess-text-muted font-medium text-sm hover:text-white transition-colors"
        >
          Done for Today
        </button>

        {!nativeApp && (
          <p className="text-center text-chess-text-faint text-xs mt-3">
            Cancel anytime
          </p>
        )}
      </div>
    </div>
  );
}
