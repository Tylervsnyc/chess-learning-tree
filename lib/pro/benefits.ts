/**
 * Rookie Pro — the ONE description of the deal (Tyler 2026-10-18): one
 * subscription unlocks Pro in all three apps. Every surface that explains it
 * reads this file — the paywall (components/pro/ProPaywall.tsx) and /pricing —
 * so the pitch can never drift between apps.
 *
 * Copy rules: no emoji; never the word "bout" (say "fight" / "Chess Boxing");
 * Chess Path has no leaderboard, so no leaderboard perk; keep each cell short
 * enough for a phone-width row.
 */

export type ProApp = 'chesspath' | 'chessboxing' | 'revenge';

export interface ProBenefit {
  id: ProApp;
  /** Which app this row is about. */
  app: ProApp;
  /** Row label (the app's name). */
  title: string;
  /** What free gets. */
  free: string;
  /** What Pro gets. */
  pro: string;
}

export const PRO_NAME = 'Rookie Pro';

/** The shared line every paywall carries. */
export const PRO_SHARED_LINE = 'One subscription. All three apps.';

/** Web (Stripe) display prices; StoreKit's localized strings win in the apps. */
export const PRO_PRICES = { monthly: '$4.99', yearly: '$39.99' } as const;
export const PRO_TRIAL_DAYS = 7;

/** One row per app, in the family's canonical order. */
export const PRO_BENEFITS: ProBenefit[] = [
  {
    id: 'chesspath',
    app: 'chesspath',
    title: 'Chess Path',
    free: '2 lessons + 1 game review a day',
    pro: 'Unlimited lessons + game reviews',
  },
  {
    id: 'revenge',
    app: 'revenge',
    title: "Rookie's Revenge",
    free: 'The first rungs',
    pro: 'Full ladder + unlimited Endless',
  },
  {
    id: 'chessboxing',
    app: 'chessboxing',
    title: 'Chess Boxing',
    free: '1 fight + 1 Puzzle Boxing a day',
    pro: 'Unlimited fights + Puzzle Boxing',
  },
];

/** Display name for an app id. */
export const PRO_APP_NAMES: Record<ProApp, string> = {
  chesspath: 'Chess Path',
  chessboxing: 'Chess Boxing',
  revenge: "Rookie's Revenge",
};

/** The rows with the current app first (the paywall's three-app card). */
export function benefitsFor(here: ProApp): ProBenefit[] {
  return [...PRO_BENEFITS.filter((b) => b.app === here), ...PRO_BENEFITS.filter((b) => b.app !== here)];
}
