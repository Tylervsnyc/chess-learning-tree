/**
 * The three chess apps tracked on /hq. One source of truth for ids and hosts.
 * PostHog "app" keys must match the multiIf() buckets in lib/hq/posthog.ts.
 */
export type HqAppKey = 'boxing' | 'chesspath' | 'rookies';

export interface HqApp {
  key: HqAppKey;
  name: string;
  tagline: string;
  emoji: string;
  bundleId: string;
  /** Public URL to probe for uptime. */
  url: string;
  /** Vercel project name (team tyler-schwartzs-projects). */
  vercelProject: string;
  /** Local repo, shown as a hint only. */
  repo: string;
  /** True once the app charges money somewhere (Stripe or IAP). */
  monetized: boolean;
}

export const HQ_APPS: HqApp[] = [
  {
    key: 'boxing',
    name: 'Chess Boxing',
    tagline: 'live on the App Store',
    emoji: '🥊',
    bundleId: 'com.learnthroughstories.chessboxing',
    url: 'https://chesspath.app/box',
    vercelProject: 'chess-path',
    repo: 'chess-learning-tree (ios/)',
    monetized: false,
  },
  {
    key: 'chesspath',
    name: 'Chess Path',
    tagline: 'web + iOS',
    emoji: '♟️',
    bundleId: 'com.learnthroughstories.chesspath',
    url: 'https://chesspath.app/',
    vercelProject: 'chess-path',
    repo: 'chess-learning-tree (ios-chesspath/)',
    monetized: true,
  },
  {
    key: 'rookies',
    name: "Rookie's Revenge",
    tagline: 'run.chesspath.app',
    emoji: '🏃',
    bundleId: 'com.learnthroughstories.rookiesrun',
    url: 'https://run.chesspath.app/',
    vercelProject: 'rookies-run',
    repo: 'rookies-run',
    monetized: false,
  },
];
