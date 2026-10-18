'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { ProEvents, type ProPlan } from '@/lib/analytics/posthog';
import { IS_CHESSBOXING_APP, IS_CHESSPATH_APP } from '@/lib/config/offline';
import {
  benefitsFor,
  PRO_NAME,
  PRO_PRICES,
  PRO_SHARED_LINE,
  PRO_TRIAL_DAYS,
  type ProApp,
} from '@/lib/pro/benefits';
import { FAMILY_APPS, openFamilyApp } from '@/lib/family/apps';
import { useIsNativeApp } from '@/lib/native-app';
import { BreathingRook } from '@/components/ui/BreathingRook';
import {
  getProOffering,
  initRevenueCat,
  isNativeIap,
  isProActive,
  purchasePro,
  restorePro,
  type ProOffering,
} from '@/lib/iap/revenuecat';

/**
 * ProPaywall — the ONE Rookie Pro purchase surface (FEATURE_FLAGS.PRO), shared
 * by Chess Path, Chess Boxing and the web. One subscription unlocks Pro in all
 * three apps (same Supabase uid, one RevenueCat entitlement `pro`, one
 * `profiles.subscription_status`). Approved design: app/test/pro-family-popup.
 *
 * Gold hero (excited Rookie in a dark-gold badge with a sheen), a Rookie line
 * for the trigger, the three-app card (this app first, marked "Here"; the
 * others open via lib/family/apps.ts), yearly/monthly, gold CTA. Fits an
 * iPhone SE (667px) without scrolling. Rookie's voice, no emoji, never "bout".
 *
 * Purchase paths: native shell → RevenueCat/StoreKit; web → Stripe checkout
 * (hooks/useSubscription). Restore purchases on every state (Apple 3.1.1).
 * Already-Pro users see NO buy buttons — that is what stops someone who bought
 * in one app from subscribing again in another.
 *
 * One trial per person: if the account already used its trial anywhere
 * (`trialUsed`, lib/pro/trial.ts) there is no trial copy and the app sells the
 * RevenueCat `no_trial` offering (falls back to `default`).
 *
 * Wrong-account net (iOS): if this device's RevenueCat customer has `pro` but
 * the signed-in profile isn't Pro, one line says so — Restore moves it here
 * (RevenueCat "Transfer to new App User ID" → webhook TRANSFER).
 *
 * `trigger` is the analytics reason: limit_lesson | limit_review | limit_bout |
 * limit_workout | a ProGateFeature (hooks/useProGate) | bout_history | punch_log.
 */

export interface ProPaywallProps {
  trigger: string;
  onClose: () => void;
  /** Fires once the entitlement is confirmed active (native) — caller refreshes. */
  onUnlocked?: () => void;
  userId?: string | null;
  /** Test page only (/test/pro-family-popup): force a visual state. */
  preview?: { trialUsed?: boolean; isPremium?: boolean; email?: string | null; wrongAccount?: boolean };
}

/** Triggers that only exist on the Chess Boxing side — on the web they make Chess Boxing "Here". */
const BOXING_TRIGGERS = new Set([
  'limit_bout', 'limit_workout', 'bout', 'workout', 'custom_rounds', 'history', 'settings', 'profile',
  'report', 'fixit', 'bout_history', 'punch_log',
]);

/** The app we are in: the bundle, or (web) whichever app the trigger came from. */
function hereApp(trigger: string): ProApp {
  if (IS_CHESSBOXING_APP) return 'chessboxing';
  if (IS_CHESSPATH_APP) return 'chesspath';
  return BOXING_TRIGGERS.has(trigger) ? 'chessboxing' : 'chesspath';
}

/** Rookie's one line for why the paywall opened. Short, warm, over-invested. */
function rookieLine(trigger: string): string {
  switch (trigger) {
    case 'limit_lesson':
      return "That's your 2 lessons for today. I was just getting warmed up.";
    case 'limit_review':
    case 'review':
      return "You've used today's review. I have notes on this one. Many notes.";
    case 'variations':
      return 'Try it your way. I want to see what you had in mind.';
    case 'limit_bout':
    case 'bout':
      return "That was today's fight. I'm still bouncing on my toes.";
    case 'limit_workout':
    case 'workout':
      return 'One round of Puzzle Boxing a day? Your gloves want more.';
    case 'report':
    case 'fixit':
      return 'I wrote down every miss. Let me walk you through all of them.';
    case 'custom_rounds':
      return 'Build your own fight card. I will show up for every round.';
    case 'history':
    case 'bout_history':
    case 'punch_log':
      return 'I kept every fight on the record. You should see it.';
    default:
      return "I want every move of yours on the record. Go Pro and I'll keep all of it.";
  }
}

const GOLD_HERO = 'linear-gradient(135deg, #FFF3C4 0%, #FFD966 38%, #F5B82E 72%, #E39B12 100%)';
const GOLD_BUTTON = 'linear-gradient(180deg, #FFE27A 0%, #FFC933 55%, #F2A91C 100%)';

export function ProPaywall({ trigger, onClose, onUnlocked, userId, preview }: ProPaywallProps) {
  const sub = useSubscription();
  const { startCheckout, refresh } = sub;
  // A preview email (test page) stands in for a signed-in account.
  const isAuthenticated = sub.isAuthenticated || !!preview?.email;
  const isPremium = preview?.isPremium ?? sub.isPremium;
  const trialUsed = preview?.trialUsed ?? sub.trialUsed;
  const email = preview?.email !== undefined ? preview.email : sub.email;
  const [plan, setPlan] = useState<ProPlan>('yearly');
  const [native, setNative] = useState<boolean | null>(null);
  const [offering, setOffering] = useState<ProOffering | null>(null);
  const [busy, setBusy] = useState<'buy' | 'restore' | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [deviceHasPro, setDeviceHasPro] = useState(false);
  const nativeShell = useIsNativeApp();

  useEffect(() => {
    ProEvents.paywallShown(trigger);
  }, [trigger]);

  const here = hereApp(trigger);
  const rows = benefitsFor(here);
  const withTrial = !trialUsed;

  /** Closed without buying (Not now / backdrop) — NOT called after an unlock. */
  const dismiss = () => {
    ProEvents.paywallDismissed(trigger);
    onClose();
  };

  // Wait for the status read before choosing an offering, so a trial-used
  // account never sees the trial offering flash in.
  const statusReady = !sub.loading || preview?.trialUsed !== undefined;
  useEffect(() => {
    if (!statusReady) return;
    let cancelled = false;
    (async () => {
      const n = await isNativeIap();
      if (cancelled) return;
      setNative(n);
      if (n && (await initRevenueCat(userId ?? null))) {
        const off = await getProOffering({ noTrial: trialUsed });
        if (!cancelled) setOffering(off);
        // Wrong-account net: this device's customer has Pro, the profile doesn't.
        if (userId && (await isProActive()) && !cancelled) setDeviceHasPro(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, trialUsed, statusReady]);

  const showWrongAccount =
    !isPremium && (preview?.wrongAccount ?? (native === true && isAuthenticated && deviceHasPro));

  const priceFor = (p: ProPlan) =>
    p === 'monthly'
      ? offering?.monthlyPrice ?? PRO_PRICES.monthly
      : offering?.yearlyPrice ?? PRO_PRICES.yearly;
  const perWord = plan === 'yearly' ? 'a year' : 'a month';

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
        } else if (res.cancelled) {
          ProEvents.purchaseFailed('ios', 'cancelled');
        } else {
          ProEvents.purchaseFailed('ios', 'store_error');
          setNote('That purchase did not go through. Nothing was charged.');
        }
      } else {
        // Web: Stripe checkout (redirects). Prices come from env price ids.
        await startCheckout(plan, undefined, `pro_${trigger}`);
      }
    } catch (err) {
      ProEvents.purchaseFailed(platform, err instanceof Error ? err.message.slice(0, 80) : 'error');
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
        ProEvents.restoreResult('ios', ok);
        if (ok) {
          await refresh();
          onUnlocked?.();
          onClose();
        } else {
          setNote('No Rookie Pro purchase found on this Apple ID.');
        }
      } else {
        await refresh();
        ProEvents.restoreResult('web', isPremium);
        setNote('Signed in on the web? Your Pro follows your account.');
      }
    } finally {
      setBusy(null);
    }
  };

  const ctaLabel =
    busy === 'buy'
      ? 'Opening the store…'
      : native === true && !offering
        ? 'Loading plans…'
        : withTrial
          ? `Start ${PRO_TRIAL_DAYS} days free`
          : `Start ${PRO_NAME}`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/50"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label={PRO_NAME}
    >
      <div
        className="w-full max-w-md max-h-[100dvh] overflow-y-auto overscroll-contain rounded-t-[28px] md:rounded-[28px] bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold hero */}
        <div className="relative px-5 pt-2 pb-3 text-center" style={{ background: GOLD_HERO }}>
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-black/15 md:hidden" />
          <Sparkles />
          <div className="relative mx-auto flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_50%_40%,#7A4E00_0%,#3E2700_100%)] ring-2 ring-[#FFE27A] shadow-[0_6px_18px_rgba(140,90,0,0.45),0_0_24px_rgba(255,214,90,0.6)]">
            <BreathingRook size="sm" mood="excited" animate />
            <span className="rookie-pro-sheen pointer-events-none absolute inset-y-0 -left-full w-1/2" />
          </div>
          <style>{`
            .rookie-pro-sheen {
              background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 70%, transparent 100%);
              animation: rookieProSheen 2.8s ease-in-out infinite;
              mix-blend-mode: screen;
            }
            @keyframes rookieProSheen {
              0% { transform: translateX(0); }
              55%, 100% { transform: translateX(400%); }
            }
            @media (prefers-reduced-motion: reduce) { .rookie-pro-sheen { animation: none; } }
          `}</style>
          <h2 className="mt-2 text-[28px] font-black leading-none tracking-tight text-[#5A3A00]">{PRO_NAME}</h2>
          <p className="mt-1 text-[13px] font-bold text-[#6E4A05]">{PRO_SHARED_LINE}</p>
          {!isPremium && withTrial && (
            <span className="mt-2 inline-block rounded-full bg-[#5A3A00] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#FFD966]">
              {PRO_TRIAL_DAYS} days free
            </span>
          )}
        </div>

        <div className="px-4 pt-3">
          <p className="text-center text-[13px] font-semibold leading-snug text-chess-text-muted">
            {isPremium ? "You're Pro. It's active on this account, in every app." : rookieLine(trigger)}
          </p>

          {/* The three apps — this one first */}
          <ul className="mt-3 divide-y divide-[#F6E5B0] rounded-2xl border border-[#F3D78A] bg-[#FFFBEF]">
            {rows.map((b) => {
              const isHere = b.app === here;
              const def = FAMILY_APPS[b.app];
              const getLabel = nativeShell && def.storeUrl ? 'Get' : 'Open';
              return (
                <li key={b.id} className="flex items-center gap-3 px-3 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/family/${b.app}.webp`} alt="" className="h-9 w-9 shrink-0 rounded-[10px] shadow-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-black leading-tight text-chess-text">{b.title}</div>
                    <div className="text-[11px] font-bold leading-tight text-[#9A6A00]">{b.pro}</div>
                  </div>
                  {isHere ? (
                    <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-chess-text-faint">Here</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openFamilyApp(b.app)}
                      aria-label={`${getLabel} ${b.title}`}
                      className="min-h-[36px] min-w-[52px] shrink-0 rounded-lg bg-white px-3 text-[11px] font-black text-chess-text shadow-sm ring-1 ring-slate-200 tap-highlight"
                    >
                      {getLabel}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {showWrongAccount && (
            <p className="mt-2 rounded-xl bg-[#FFF6D6] px-3 py-1.5 text-center text-[11px] font-bold leading-snug text-[#6E4A05]" role="status">
              This Apple ID already has Rookie Pro on another account. Sign in with that account, or tap Restore to move it here.
            </p>
          )}

          {!isPremium && (
            <>
              <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Plan">
                {(['yearly', 'monthly'] as const).map((p) => {
                  const on = plan === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setPlan(p)}
                      className={`relative min-h-[58px] rounded-2xl border-2 px-3 py-2 text-left transition-colors tap-highlight ${on ? 'border-[#F2A91C] bg-[#FFF6D6]' : 'border-slate-200 bg-white'}`}
                    >
                      {p === 'yearly' && (
                        <span className="absolute -top-2 right-2 rounded-full bg-[#5A3A00] px-2 py-px text-[9px] font-black uppercase tracking-widest text-[#FFD966]">
                          Save 33%
                        </span>
                      )}
                      <div className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted">{p}</div>
                      <div className="text-lg font-black tabular-nums leading-tight text-chess-text">
                        {priceFor(p)}
                        <span className="ml-1 text-[10px] font-black uppercase text-chess-text-faint">{p === 'yearly' ? '/yr' : '/mo'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!isAuthenticated && !native ? (
                <Link
                  href={`/auth/signup?redirect=${encodeURIComponent(here === 'chessboxing' ? '/box/settings' : '/pricing')}`}
                  className="mt-3 flex w-full min-h-[50px] items-center justify-center rounded-2xl text-[16px] font-black text-[#4A2F00] shadow-[0_4px_0_0_#C98200] active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
                  style={{ background: GOLD_BUTTON }}
                >
                  {withTrial ? 'Create an account to start free' : 'Create an account to go Pro'}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={buy}
                  disabled={busy !== null || (native === true && !offering)}
                  className="mt-3 w-full min-h-[50px] rounded-2xl text-[17px] font-black text-[#4A2F00] shadow-[0_4px_0_0_#C98200] active:translate-y-[3px] active:shadow-none transition-transform tap-highlight disabled:opacity-60"
                  style={{ background: GOLD_BUTTON }}
                >
                  {ctaLabel}
                </button>
              )}
              <p className="mt-1.5 text-center text-[11px] font-semibold text-chess-text-faint">
                {withTrial ? `Then ${priceFor(plan)} ${perWord}.` : `${priceFor(plan)} ${perWord}.`} Cancel anytime.
              </p>
            </>
          )}

          {note && (
            <p className="mt-1.5 text-center text-xs font-bold text-chess-red" role="status">
              {note}
            </p>
          )}

          {isAuthenticated && email && (
            <p className="mt-2 text-center text-[11px] font-semibold leading-snug text-chess-text-muted break-words">
              Signed in as <span className="font-black text-chess-text">{email}</span>. Use it in every app.
            </p>
          )}

          <div className="mt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={isPremium ? onClose : dismiss}
              className="min-h-[44px] px-2 text-xs font-bold text-chess-text-muted tap-highlight"
            >
              {isPremium ? 'Done' : 'Not now'}
            </button>
            <button
              type="button"
              onClick={restore}
              disabled={busy !== null}
              className="min-h-[44px] px-2 text-xs font-bold text-[#9A6A00] tap-highlight disabled:opacity-60"
            >
              {busy === 'restore' ? 'Restoring…' : 'Restore purchases'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles() {
  const dots = [
    { l: '12%', t: '30%', s: 10 },
    { l: '84%', t: '22%', s: 12 },
    { l: '76%', t: '62%', s: 8 },
    { l: '20%', t: '68%', s: 7 },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <svg
          key={i}
          viewBox="0 0 10 10"
          className="pointer-events-none absolute animate-pulse"
          style={{ left: d.l, top: d.t, width: d.s, height: d.s, animationDelay: `${i * 0.4}s` }}
          aria-hidden="true"
        >
          <path d="M5 0l1.2 3.8L10 5 6.2 6.2 5 10 3.8 6.2 0 5l3.8-1.2z" fill="#FFFFFF" opacity="0.85" />
        </svg>
      ))}
    </>
  );
}
