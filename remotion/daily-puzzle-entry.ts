/**
 * Slim Remotion entry for the daily puzzle reel — used by
 * scripts/render-daily-video.ts (locally AND in the ig-refill GitHub Action).
 *
 * The studio Root (index.ts → Root.tsx) imports dozens of one-off reels, many
 * of which are never committed, so a clean checkout can't bundle it. This entry
 * pulls in only the daily-puzzle composition's own dependency tree, which is
 * fully tracked — and bundles much faster.
 */
import React from 'react';
import { registerRoot } from 'remotion';
import { DailyPuzzleComposition } from './DailyPuzzleComposition';

registerRoot(() => React.createElement(DailyPuzzleComposition));
