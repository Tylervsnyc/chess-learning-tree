/**
 * PRO_BENEFITS — the ONE list of what free vs Pro gets, per app.
 *
 * One Pro works in Chess Path, Chess Boxing and Rookie's Revenge (flag
 * `FEATURE_FLAGS.PRO`). Every surface that explains the deal reads this file:
 * the paywall (components/pro/ProPaywall.tsx), /pricing, and the locked-level
 * card — so the pitch can never drift between apps.
 *
 * Copy rules: no emoji; never the word "bout" — the vs-Rookie rounds game is
 * "Chess Boxing"; keep each cell short enough for a phone-width table.
 */

export type ProApp = 'chesspath' | 'chessboxing' | 'revenge' | 'all';

export interface ProBenefit {
  id: string;
  /** Which app this perk lives in ('all' = every app). */
  app: ProApp;
  /** What free gets. */
  free: string;
  /** What Pro gets. */
  pro: string;
  /** Short row label for tables. */
  title: string;
}

export const PRO_BENEFITS: ProBenefit[] = [
  {
    id: 'lessons',
    app: 'chesspath',
    title: 'Lessons',
    free: 'Levels 1–2, 4 lessons a day',
    pro: 'All 8 levels, unlimited',
  },
  {
    id: 'chessboxing',
    app: 'chessboxing',
    title: 'Chess Boxing and workouts',
    free: '1 of each a day',
    pro: 'Unlimited Chess Boxing and workouts',
  },
  {
    id: 'review',
    app: 'all',
    title: "Rookie's review",
    free: 'Summary + 3 moves',
    pro: 'Every move, Try it, Fix-It',
  },
  {
    id: 'leaderboard',
    app: 'all',
    title: 'Leaderboards',
    free: 'Your name',
    pro: 'Gold name and Pro pill',
  },
  {
    id: 'revenge',
    app: 'revenge',
    title: "Rookie's Revenge",
    free: 'The daily run',
    pro: 'Pro perks coming to Revenge',
  },
];

/** Display name for an app id (the 'all' pseudo-app has none). */
export const PRO_APP_NAMES: Record<Exclude<ProApp, 'all'>, string> = {
  chesspath: 'Chess Path',
  chessboxing: 'Chess Boxing',
  revenge: "Rookie's Revenge",
};

/** The shared line every paywall carries. */
export const PRO_SHARED_LINE = "One Pro. Works in Chess Path, Chess Boxing, and Rookie's Revenge.";

/**
 * Split the list for a given surface: the current app's perks (plus the
 * cross-app ones) first, everything else under "Also in Pro". Pass 'all' for
 * the web /pricing page, where every row belongs in the main table.
 */
export function benefitsFor(app: ProApp): { here: ProBenefit[]; elsewhere: ProBenefit[] } {
  if (app === 'all') return { here: PRO_BENEFITS, elsewhere: [] };
  const here = PRO_BENEFITS.filter((b) => b.app === app || b.app === 'all');
  const elsewhere = PRO_BENEFITS.filter((b) => b.app !== app && b.app !== 'all');
  return { here, elsewhere };
}
