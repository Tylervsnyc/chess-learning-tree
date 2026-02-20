'use client';
// Compact single-screen pricing layout with dynamic pricing experiment support
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { SubscriptionEvents } from '@/lib/analytics/posthog';

type PricingVariant = 'control' | 'low' | 'high';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startCheckout, startGuestCheckout, isAuthenticated, isPremium, loading } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Pricing experiment state
  const [variant, setVariant] = useState<PricingVariant>('control');
  const [monthlyPrice, setMonthlyPrice] = useState(999);
  const [yearlyPrice, setYearlyPrice] = useState(7999);
  const [pricesLoaded, setPricesLoaded] = useState(false);

  useEffect(() => {
    SubscriptionEvents.pricingViewed();
  }, []);

  // Fetch pricing variant on mount
  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch('/api/pricing-experiment');
        if (res.ok) {
          const data = await res.json();
          setVariant(data.variant);
          setMonthlyPrice(data.prices.monthly);
          setYearlyPrice(data.prices.yearly);
        }
      } catch {
        // Fall back to control prices silently
      } finally {
        setPricesLoaded(true);
      }
    }
    fetchPricing();
  }, []);

  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGetPremium = async () => {
    setCheckoutError(null);

    if (!isAuthenticated) {
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
      } catch (err) {
        setCheckoutError(err instanceof Error ? err.message : 'Checkout failed');
        setCheckoutLoading(false);
      }
      return;
    }

    setCheckoutLoading(true);
    try {
      await startCheckout('monthly', variant);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed');
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-45px)]">
      {/* Success/Cancel Messages — overlay at top if present */}
      {success && (
        <div className="mx-4 mt-2 p-3 bg-chess-green/10 border border-chess-green rounded-xl text-center">
          <p className="text-chess-green-dark font-medium text-sm">
            Welcome to Premium! Your subscription is now active.
          </p>
        </div>
      )}
      {canceled && (
        <div className="mx-4 mt-2 p-3 bg-yellow-500/10 border border-yellow-500 rounded-xl text-center">
          <p className="text-yellow-600 font-medium text-sm">
            Checkout was canceled. Feel free to try again.
          </p>
        </div>
      )}

      {loading || !pricesLoaded ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chess-green"></div>
        </div>
      ) : isPremium ? (
        <div className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="w-16 h-16 mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <BreathingRook size="xs" />
          </div>
          <h2 className="text-2xl font-bold text-chess-text mb-1">You&apos;re Premium!</h2>
          <p className="text-chess-text-muted mb-4 text-sm">Unlimited access to all features.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-chess-green text-white font-bold rounded-xl hover:brightness-105 transition-opacity"
            style={{ boxShadow: '0 4px 0 var(--color-chess-green-shadow)' }}
          >
            Continue Learning
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-4 pt-3 pb-4 max-w-lg mx-auto w-full">
          {/* Logo + Heading — compact */}
          <div className="text-center mb-3">
            <div className="flex justify-center mb-2">
              <AnimatedLogo theme="light" size={0.35} showWordmark={false} iconOnly={true} />
            </div>
            <h1 className="text-xl font-black text-chess-text">Level Up Your Chess</h1>
          </div>

          {/* Price banner */}
          <div
            className="rounded-2xl px-5 py-4 mb-3 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--color-chess-gold) 0%, var(--color-chess-orange) 100%)',
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-2xl bg-white" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-black">{formatPrice(monthlyPrice)}</span>
                  <span className="text-black/60 font-medium text-sm">/month</span>
                </div>
                <p className="text-black/50 text-xs">Cancel anytime</p>
              </div>
              <AnimatedLogo theme="light" size={0.4} iconOnly perpetual />
            </div>
          </div>

          {/* Features — compact grid */}
          <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm mb-3 divide-y divide-slate-100">
            <FeatureRow icon="♞" title="Unlimited lessons" free="2/day" />
            <FeatureRow icon="♜" title="All levels unlocked" free="Current only" />
            <FeatureRow icon="♛" title="Unlimited puzzles" free="15/day" />
            <FeatureRow icon="♚" title="Daily challenges" free="—" />
          </div>

          {/* Checkout — pushed to bottom */}
          <div className="mt-auto">
            {checkoutError && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {checkoutError}
              </div>
            )}

            {!isAuthenticated && (
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 mb-2 bg-white border-2 rounded-xl text-chess-text placeholder-chess-text-faint focus:outline-none transition-colors text-sm ${
                  emailError ? 'border-chess-red' : 'border-slate-200 focus:border-chess-gold'
                }`}
              />
            )}
            {emailError && (
              <p className="text-chess-red text-xs mb-2">{emailError}</p>
            )}

            <button
              onClick={handleGetPremium}
              disabled={checkoutLoading}
              className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--color-chess-gold) 0%, var(--color-chess-orange) 100%)',
                color: '#000',
                boxShadow: '0 4px 0 var(--color-chess-gold-dark)',
              }}
            >
              {checkoutLoading ? 'Loading...' : 'Get Premium'}
            </button>

            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="text-chess-text-faint text-[10px]">5,000+ puzzles</span>
              <span className="text-chess-text-faint text-[10px]">·</span>
              <span className="text-chess-text-faint text-[10px]">200+ lessons</span>
              <span className="text-chess-text-faint text-[10px]">·</span>
              <span className="text-chess-text-faint text-[10px]">Secure via Stripe</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Feature row — premium vs free comparison in one line */
function FeatureRow({ icon, title, free }: {
  icon: string;
  title: string;
  free: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span className="text-base flex-shrink-0">{icon}</span>
      <span className="text-chess-text text-sm font-medium flex-1">{title}</span>
      <span className="text-chess-green font-bold text-xs flex-shrink-0">✓</span>
      <div className="w-px h-4 bg-slate-200 flex-shrink-0" />
      <span className="text-chess-text-faint text-xs flex-shrink-0 w-16 text-right">{free}</span>
    </div>
  );
}

function PricingFallback() {
  return (
    <div className="flex-1 flex justify-center items-center h-[calc(100dvh-45px)]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chess-green"></div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="h-full bg-chess-page overflow-hidden">
      <Suspense fallback={<PricingFallback />}>
        <PricingContent />
      </Suspense>
    </div>
  );
}
