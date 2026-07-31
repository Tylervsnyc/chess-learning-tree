import type { NextConfig } from 'next';

/**
 * Trim what Next traces into serverless lambdas.
 *
 * Why this exists: Vercel caps each lambda at 250 MB uncompressed. Routes that
 * call `process.cwd()` or `spawn()` cause Next's file tracer to conservatively
 * bundle large chunks of the repo —
 * including binary assets in `public/` that are only served to the browser via
 * URL and never read server-side. The maia3 ONNX (44 MB), stockfish wasm
 * (7 MB), ort wasm (11 MB), ability art (38 MB), and rookie SFX (11 MB) alone
 * push past the cap.
 *
 * Excluding them from the trace is safe: nothing under `app/api/**` or
 * `lib/**` reads these files with `fs` — they're loaded by Web Workers and
 * <img>/<audio> tags from the CDN-served `public/` directory.
 *
 * If a future server route ever does need to read one of these, add an
 * `outputFileTracingIncludes` entry for that specific route.
 */
const LAMBDA_EXCLUDES = [
  './public/maia3/**/*',
  './public/stockfish/**/*',
  './public/ort/**/*',
  './public/abilities/**/*',
  './public/rookie-sfx/**/*',
  './public/rookie-voice/**/*',
  './public/2026candidates/**/*',
  './public/brand/**/*',
  './public/sounds/**/*',
  './public/email/**/*',
  './public/event/**/*',
  './public/ui-showcase/**/*',
  './public/remotion/**/*',
  './public/3.4 videos/**/*',
  './public/Gameplay/**/*',
  './public/*.MP4',
  './data/run-playtest/replays/**/*',
];

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['posthog-js'],
  },
  outputFileTracingExcludes: {
    '**': LAMBDA_EXCLUDES,
  },
  async headers() {
    // MediaPipe wasm + pose models only change on package upgrade — cache hard
    // so the ~10MB punch-cam download happens once per device.
    const immutable = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];
    return [
      { source: '/mediapipe/:path*', headers: immutable },
      { source: '/models/:path*', headers: immutable },
    ];
  },
};

export default nextConfig;
