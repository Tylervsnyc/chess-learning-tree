/**
 * Rookie Pro — the ONE description of the deal. Pro is CHESS PATH ONLY
 * (Tyler 2026-11-17): $4.99/mo or $39.99/yr, 7-day free trial, on
 * chesspath.app (Stripe) and the Chess Path iOS app (RevenueCat). Chess Boxing
 * and Rookie's Revenge are free and are never sold here. Every surface that
 * explains Pro reads this file — the paywall (components/pro/ProPaywall.tsx)
 * and /pricing — so the pitch can never drift.
 *
 * Copy rules: no emoji; keep each cell short enough for a phone-width row.
 * Only list what the code actually gates (hooks/useProGate, /api/coach-review).
 */

export interface ProBenefit {
  id: 'lessons' | 'reviews' | 'variations';
  title: string;
  /** What free gets. */
  free: string;
  /** What Pro gets. */
  pro: string;
}

export const PRO_NAME = 'Rookie Pro';

/** The one line under the name on every paywall. */
export const PRO_TAGLINE = 'Chess Path with no daily limit.';

/** Web (Stripe) display prices; StoreKit's localized strings win in the app. */
export const PRO_PRICES = { monthly: '$4.99', yearly: '$39.99' } as const;
export const PRO_TRIAL_DAYS = 7;

export const PRO_BENEFITS: ProBenefit[] = [
  { id: 'lessons', title: 'Lessons', free: '2 a day', pro: 'Unlimited' },
  { id: 'reviews', title: 'Game reviews from Rookie', free: '1 a day', pro: 'Unlimited' },
  { id: 'variations', title: 'Try your own moves', free: '—', pro: 'Yes' },
];
