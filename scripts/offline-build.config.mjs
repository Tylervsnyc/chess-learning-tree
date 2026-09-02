/**
 * What goes inside the Chess Boxing app bundle.
 *
 * The iOS app used to be a webview pointed at https://chesspath.app, so with no
 * signal it showed the "Reconnecting..." card and nothing else. This config
 * drives a SECOND build (`npm run build:offline`) that static-exports an
 * offline-capable subset of the app into `capacitor-shell/`.
 *
 * The Vercel build reads none of this. Prod is untouched.
 */

/**
 * Routes that ship in the app, relative to `app/`.
 *
 * A route is only eligible if it can render with zero network: no `cookies()`,
 * no `headers()`, no request-time `searchParams`, no server-side Supabase.
 * Server components are fine as long as they're just metadata wrappers around
 * a client component (that's what most of ours are).
 *
 * Anything NOT listed here is deleted from the offline copy before the build.
 */
export const ROUTE_ALLOWLIST = [
  '',                       // app/page.tsx — home
  'path',                   // the learn tree
  'lesson/[lessonId]',      // 446 tactic lessons
  'play',                   // Play Rookie
  'basics',
  'openings',
  'openings/[slug]',
  'openings/[slug]/tree',
  'openings/[slug]/[lessonId]',
  'box',                    // Chess Boxing
  'box/settings',
  'box/onboarding',
  'box/bout',               // Fight — RingHome links here; was missing from the bundle
  'workout',
  'level-test/[transition]',
  'profile',
  'review',                 // past-game review via ?id= (the [id] form can't export)
  'leaderboard',            // renders an offline state, see Phase 4
  'auth/login',
  'auth/signup',
  'auth/forgot-password',   // 6-digit verifyOtp code — no redirect, works offline-origin
  'auth/reset-password',
  'auth/error',
  'about',
  'privacy',
  'terms',
  'support',
  'welcome',              // signed-out entry point; see scripts/offline-overrides/
];

/**
 * Directories under `app/` deleted outright from the offline copy.
 *
 * `api` is the important one: `output: 'export'` refuses to build if a single
 * route handler exists. The rest are either server-only, huge, or irrelevant on
 * a phone in a tunnel.
 */
export const APP_PURGE = [
  'api',                    // all 89 route handlers
  'admin',
  'test',
  'test-coach',
  'test-rook-animations',
  '_archive',
  '_archived-tests',
  '2026candidates',
  'run',                    // Rookie's Run lives in its own repo/app now
  'style-guide',
  'repertoire',
  'solve',                  // server component: reads the Supabase session via cookies
  'learn',                  // legacy redirect() route — redirects can't be exported
  'pricing',                // billing surfaces need the network anyway
  'premium-signup',
  'subscription',
  'workout/review',       // keyed by an unbounded session uuid — nothing to enumerate
  'auth/callback',          // route handlers (OAuth/PKCE) — not used in the app build
  'auth/confirm',
];

/**
 * `public/` entries copied into the app bundle.
 *
 * public/ is 1.7 GB, almost all of it marketing video, Remotion output and test
 * fixtures that no app screen ever loads. Copying it wholesale would produce an
 * unshippable binary, so this is an allowlist, not a denylist.
 *
 * Deliberately NOT bundled:
 *   maia3 (44 MB)      — Rookie's L5/L6 net. Offline she plays every level on
 *                        Stockfish, which pick-move already falls back to.
 *   ort (12 MB)        — the ONNX runtime, loaded only by maia-worker.js. With
 *                        maia3 out, it and the worker are dead weight.
 *   rookie-voice (68MB)— TTS audio; offline she falls back to the local quips.
 *   abilities (61 MB)  — Rookie's Run art, and Run isn't in this bundle.
 *   mediapipe/models   — punch camera, flagged off since 2026-08-05.
 */
export const PUBLIC_ALLOWLIST = [
  'brand',
  'fonts',
  'sounds',
  'audio/combo-coach',    // the workout's Rookie voice clips (rookies-run-theme.mp3 is Run's, 2.7 MB)
  'music',                // /play background music playlist, 3 tracks (~13 MB)
  'rookie-sfx',
  'achievements',
  'boxing',
  'stockfish',
  'og',
  'manifest.json',
  'sw.js',
  'rookie-worker.js',
];

/**
 * Source directories copied verbatim. `node_modules` is symlinked, never copied.
 *
 * `data/` is filtered separately (DATA_ALLOWLIST) — it holds 2.6 GB of raw
 * puzzle corpora that only the server ever read.
 */
export const SRC_COPY = [
  'app', 'components', 'lib', 'hooks', 'types', 'remotion', 'scripts',
];

/**
 * `data/` entries that are imported at build time (and therefore bundled into
 * JS chunks, not shipped as files). Everything else — notably the 2.6 GB
 * `puzzles-by-rating/` and 72 MB `clean-puzzles-v2/` — stays out; Phase 2
 * replaces those with a trimmed on-device puzzle pack.
 */
export const DATA_ALLOWLIST = [
  'staging',
  'curriculum-v2-config.ts',
  'openings',
  'openings-eco',
  'quips',
  'theme-explanations.ts',
  'theme-tutorials.ts',
  'level-unlock-tests.ts',
  '2026candidates',
  'build-queue.json',
  'daily-challenge-puzzles.json',
  'puzzle-rating-index.json',
  'locker-chase.json',
];

/** Config files copied to the build root. `middleware.ts` is deliberately absent. */
export const ROOT_FILES = [
  'package.json', 'tsconfig.json', 'postcss.config.mjs', 'eslint.config.mjs',
  'next-env.d.ts',
];

/**
 * Per-app build targets. Two iOS apps ship from this one pipeline:
 *
 *   chessboxing — the original Chess Boxing app (default; APP_TARGET unset).
 *   chesspath   — the Chess Path app: the learning app with every boxing
 *                 surface removed. No /box, no /workout, no leaderboard (it
 *                 ranks workout points, which don't exist there).
 *
 * Each target gets its own output dir so a `cap sync` for one app can never
 * pick up the other's bundle, and its own overrides dir applied AFTER the
 * shared one (later files win — that's how chesspath swaps the root page).
 * `target` is also forwarded as NEXT_PUBLIC_APP_TARGET so app code can gate
 * boxing-only UI (see lib/config/offline.ts).
 */
const CHESSPATH_ROUTE_DROP = new Set([
  'box', 'box/settings', 'box/onboarding', 'workout', 'leaderboard',
]);

export const APP_TARGETS = {
  chessboxing: {
    routes: ROUTE_ALLOWLIST,
    appPurge: APP_PURGE,
    publicAllowlist: PUBLIC_ALLOWLIST,
    overridesDirs: ['offline-overrides'],
    outDir: 'capacitor-shell',
  },
  chesspath: {
    routes: ROUTE_ALLOWLIST.filter((r) => !CHESSPATH_ROUTE_DROP.has(r)),
    appPurge: [...APP_PURGE, 'box', 'workout', 'leaderboard'],
    publicAllowlist: PUBLIC_ALLOWLIST.filter(
      (e) => e !== 'boxing' && e !== 'audio/combo-coach',
    ),
    overridesDirs: ['offline-overrides', 'offline-overrides-chesspath'],
    outDir: 'capacitor-shell-chesspath',
  },
};
