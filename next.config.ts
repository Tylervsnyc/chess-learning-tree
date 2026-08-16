import type { NextConfig } from 'next';

/**
 * Chess Path needed a 17-entry `outputFileTracingExcludes` list to stay under
 * Vercel's 250 MB lambda cap (ONNX weights, stockfish wasm, 40 MB of ability
 * PNGs). None of that ships here: `public/` is ~4.8 MB, and only the 17
 * ability `.webp` files come across — `artFile()` in AbilityCard never asks
 * for a `.png`.
 *
 * One exclusion still earns its place: `/api/run-trace` touches `process.cwd()`
 * in dev, which is exactly the pattern that makes Next's tracer pull in
 * neighbouring directories. Keeping the playtest corpus out is cheap insurance.
 */
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['posthog-js'],
  },
  outputFileTracingExcludes: {
    '**': ['./data/run-playtest/**/*'],
  },
};

export default nextConfig;
