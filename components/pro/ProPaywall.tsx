'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { ProEvents, type ProPlan } from '@/lib/analytics/posthog';
import {
  getProOffering,
  initRevenueCat,
  isNativeIap,
  purchasePro,
  restorePro,
  type ProOffering,
} from '@/lib/iap/revenuecat';

/**
 * ProPaywall — the ONE Chess Boxing Pro purchase surface (CHESSBOXING_PRO).
 *
 * A bottom sheet on the light-blue page with a white card (design-system.md).
 * Two plans, yearly highlighted, 7-day free trial, Restore purchases (Apple
 * 3.1.1). Native shell → RevenueCat/StoreKit; web → the existing Stripe
 * checkout (hooks/useSubscription). Rookie's voice, ≤2 sentences, no emoji.
 *
 * `trigger` is the analytics reason: limit_bout | limit_workout |
 * bout_history | punch_log | custom_rounds | settings | profile.
 */

export interface ProPaywallProps {
  trigger: string;
  onClose: () => void;
  /** Fires once the entitlement is confirmed active (native) — caller refreshes. */
  onUnlocked?: () => void;
  userId?: string | null;
}

const PERKS = [
  'Unlimited bouts and workouts',
  'Custom round cards, official 11-round format',
  'Full bout history and punch log',
  'Gold name on the leaderboards',
];

const WEB_PRICES = { monthly: '$5.99', yearly: '$39.99' };

export function ProPaywall({ trigger, onClose, onUnlocked, userId }: ProPaywallProps) {
  const { isAuthenticated, startCheckout, refresh } = useSubscription();
  const [plan, setPlan] = useState<ProPlan>('yearly');
  const [native, setNative] = useState<boolean | null>(null);
  const [offering, setOffering] = useState<ProOffering | null>(null);
  const [busy, setBusy] = useState<'buy' | 'restore' | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    ProEvents.paywallShown(trigger);
  }, [trigger]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const n = await isNativeIap();
      if (cancelled) return;
      setNative(n);
      if (n && (await initRevenueCat(userId ?? null))) {
        const off = await getProOffering();
        if (!cancelled) setOffering(off);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const priceFor = (p: ProPlan) =>
    p === 'monthly'
      ? offering?.monthlyPrice ?? WEB_PRICES.monthly
      : offering?.yearlyPrice ?? WEB_PRICES.yearly;

  const buy = async () => {
    if (busy) return;
    setNote(null);
    const platform = native ? 'ios' : 'web';
    ProEvents.purchaseStarted(plan, platform, trigger);
    setBusy('buy');
    try {
      if (native) {
        const pkg = plan === 'monthly' ? offering?.monthly : offering?.yearly;
        if (!pkg) {
          setNote('The store is still loading. Give it a second and tap again.');
          return;
        }
        const res = await purchasePro(pkg);
        if (res.ok) {
          ProEvents.purchaseCompleted(plan, 'ios');
          await refresh();
          onUnlocked?.();
          onClose();
        } else if (!res.cancelled) {
          setNote('That purchase did not go through. Nothing was charged.');
        }
      } else {
        // Web: Stripe checkout (redirects). Prices come from env price ids.
        await startCheckout(plan, undefined, `pro_${trigger}`);
      }
    } catch {
      setNote('That purchase did not go through. Nothing was charged.');
    } finally {
      setBusy(null);
    }
  };

  const restore = async () => {
    if (busy) return;
    setNote(null);
    ProEvents.restoreTapped(native ? 'ios' : 'web');
    setBusy('restore');
    try {
      if (native) {
        const ok = await restorePro();
        if (ok) {
          await refresh();
          onUnlocked?.();
          onClose();
        } else {
          setNote('No Pro purchase found on this Apple ID.');
        }
      } else {
        await refresh();
        setNote('Signed in on the web? Your Pro follows your account.');
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/45"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chess Boxing Pro"
    >
      <div
        className="w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-chess-page px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 md:hidden" />

        <div className="rounded-3xl bg-chess-surface border border-slate-200 shadow-md p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-chess-gold/25 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-chess-gold-dark">
              Pro
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-chess-text-muted">
              7-day free trial
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-black text-chess-text leading-tight">Chess Boxing Pro</h2>
          <p className="mt-1 text-sm font-semibold text-chess-text-muted">
            {trigger.startsWith('limit_')
              ? "That was today's free round. Go Pro and I'll never make you wait for the bell again."
              : "I want every round of yours on the record. Go Pro and I'll keep all of it."}
          </p>

          <ul className="mt-4 space-y-2">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm font-bold text-chess-text">
                <span className="mt-[3px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-chess-green text-white">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>

          {/* Plans — yearly is the anchor */}
          <div className="mt-5 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Plan">
            <PlanCard
              active={plan === 'yearly'}
              onClick={() => setPlan('yearly')}
              label="Yearly"
              price={priceFor('yearly')}
              per="/year"
              badge="Best value"
            />
            <PlanCard
              active={plan === 'monthly'}
              onClick={() => setPlan('monthly')}
              label="Monthly"
              price={priceFor('monthly')}
              per="/month"
            />
          </div>

          {!isAuthenticated && !native ? (
            <Link
              href={`/auth/signup?redirect=${encodeURIComponent('/box/settings')}`}
              className="mt-4 block w-full rounded-2xl bg-chess-green text-white text-center font-black py-3.5 min-h-[48px] shadow-[0_4px_0_0_#46A302] active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
            >
              Create an account to start your trial
            </Link>
          ) : (
            <button
              type="button"
              onClick={buy}
              disabled={busy !== null || (native === true && !offering)}
              className="mt-4 w-full rounded-2xl bg-chess-green text-white font-black py-3.5 min-h-[48px] shadow-[0_4px_0_0_#46A302] active:translate-y-[3px] active:shadow-none transition-transform tap-highlight disabled:opacity-60"
            >
              {busy === 'buy'
                ? 'Opening the store…'
                : native === true && !offering
                  ? 'Loading plans…'
                  : 'Start 7-day free trial'}
            </button>
          )}

          <p className="mt-2 text-center text-[11px] font-semibold text-chess-text-faint leading-snug">
            Then {priceFor(plan)}{plan === 'yearly' ? '/year' : '/month'}. Cancel anytime.
          </p>

          {note && (
            <p className="mt-2 text-center text-xs font-bold text-chess-red" role="status">
              {note}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={restore}
              disabled={busy !== null}
              className="min-h-[44px] px-2 text-xs font-bold text-chess-blue tap-highlight disabled:opacity-60"
            >
              {busy === 'restore' ? 'Restoring…' : 'Restore purchases'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-2 text-xs font-bold text-chess-text-muted tap-highlight"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  active,
  onClick,
  label,
  price,
  per,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  price: string;
  per: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`relative rounded-2xl border-2 px-3 py-3 min-h-[64px] text-left transition tap-highlight ${
        active ? 'border-chess-green bg-chess-green/10' : 'border-slate-200 bg-chess-surface'
      }`}
    >
      {badge && (
        <span className="absolute -top-2 left-3 rounded-full bg-chess-gold px-2 py-px text-[9px] font-black uppercase tracking-widest text-chess-text">
          {badge}
        </span>
      )}
      <div className="text-[11px] font-black uppercase tracking-wide text-chess-text-muted">{label}</div>
      <div className="mt-0.5 text-lg font-black tabular-nums text-chess-text leading-none">
        {price}
        <span className="text-[11px] font-bold text-chess-text-muted">{per}</span>
      </div>
    </button>
  );
}
