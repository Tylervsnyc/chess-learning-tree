/**
 * Timing constants for the Daily Puzzle Video.
 * All durations in frames at 30fps.
 */

export const FPS = 30;

// Stage durations (frames)
export const STAGE_INITIAL_FRAMES = 60; // 2s
export const STAGE_COUNTDOWN_FRAMES = 120; // 4s
export const STAGE_CELEBRATE_FRAMES = 90; // 3s

// Per-move duration in solution stage
export const FRAMES_PER_MOVE = 36; // 1.2s

// Countdown timing (within stage 2)
export const COUNTDOWN_INTERVAL_FRAMES = 30; // 1s per number

/**
 * Calculate total frames for a given number of solution moves.
 */
export function totalFrames(numSolutionMoves: number): number {
  const solutionFrames = numSolutionMoves * FRAMES_PER_MOVE;
  return STAGE_INITIAL_FRAMES + STAGE_COUNTDOWN_FRAMES + solutionFrames + STAGE_CELEBRATE_FRAMES;
}

// ── Duolingo Ad Reel — Medium (12s = 360 frames) ──
export const AD_BEAT1_FRAMES = 50; // 1.7s — "Duolingo, but for Chess" (snappy)
export const AD_BEAT2_FRAMES = 55; // 1.8s — Logo flash + tagline (epic)
export const AD_BEAT3_FRAMES = 60; // 2.0s — Path scroll
export const AD_BEAT4_FRAMES = 105; // 3.5s — Quick puzzle montage (3x35)
export const AD_BEAT5_FRAMES = 45; // 1.5s — Daily challenge tease
export const AD_BEAT6_FRAMES = 45; // 1.5s — CTA end card
export const AD_TOTAL_FRAMES =
  AD_BEAT1_FRAMES + AD_BEAT2_FRAMES + AD_BEAT3_FRAMES +
  AD_BEAT4_FRAMES + AD_BEAT5_FRAMES + AD_BEAT6_FRAMES; // 360

// ── Duolingo Ad Reel — Short (7s = 210 frames) ──
export const AD_SHORT_BEAT1 = 80; // 2.7s — "Duolingo, but for Chess"
export const AD_SHORT_BEAT2 = 15; // 0.5s — Quick logo flash
export const AD_SHORT_BEAT3 = 60; // 2.0s — unused (short skips puzzles)
export const AD_SHORT_BEAT4 = 85; // 2.8s — Feature CTA (gets extra time)
export const AD_SHORT_TOTAL_FRAMES =
  AD_SHORT_BEAT1 + AD_SHORT_BEAT2 + AD_SHORT_BEAT3 + AD_SHORT_BEAT4; // 210

// ── Duolingo Ad Reel — Long (30s = 900 frames) ──
export const AD_LONG_BEAT1 = 60;  // 2.0s — "Duolingo, but for Chess" (snappy)
export const AD_LONG_BEAT2 = 90;  // 3.0s — Logo flash + tagline (epic)
export const AD_LONG_BEAT3 = 150; // 5.0s — Path scroll footage
export const AD_LONG_BEAT4 = 240; // 8.0s — Puzzle montage (3x80 frames)
export const AD_LONG_BEAT5 = 210; // 7.0s — Daily challenge footage
export const AD_LONG_BEAT6 = 150; // 5.0s — CTA end card
export const AD_LONG_TOTAL_FRAMES =
  AD_LONG_BEAT1 + AD_LONG_BEAT2 + AD_LONG_BEAT3 +
  AD_LONG_BEAT4 + AD_LONG_BEAT5 + AD_LONG_BEAT6; // 900

// ── Strategy Reel — "You Never Learned Strategy" (19s = 570 frames) ──
export const STRAT_BEAT1 = 90;  // 3.0s — Hook: board + "You learned chess / never learned STRATEGY"
export const STRAT_BEAT2 = 300; // 10.0s — Chess Path + gameplay video
export const STRAT_BEAT3 = 120; // 4.0s — CTA
export const STRAT_TOTAL_FRAMES =
  STRAT_BEAT1 + STRAT_BEAT2 + STRAT_BEAT3; // 570

// ── Marketing Reels — Talking Head → Screen Recording → CTA ──
export const MKT_CTA_FRAMES = 210; // 7s — CTA end card

// Video 1: "Don't Know How to Checkmate" (~23s)
export const MKT_CHECKMATE_CLIP = 564;  // 18.8s pre-edited clip
export const MKT_CHECKMATE_TOTAL = MKT_CHECKMATE_CLIP + MKT_CTA_FRAMES; // 684

// Video 2: "Always Wanted to Learn Chess" (~25s)
export const MKT_BEGINNER_HEAD = 371;   // 12.38s talking head
export const MKT_BEGINNER_SCREEN = 240;  // 8s screen recording
export const MKT_BEGINNER_TOTAL = MKT_BEGINNER_HEAD + MKT_BEGINNER_SCREEN + MKT_CTA_FRAMES; // 731

// Video 3: "Stuck Between 800-1500" (~25s)
export const MKT_INTERMEDIATE_HEAD = 389;   // 12.96s talking head
export const MKT_INTERMEDIATE_SCREEN = 240;  // 8s screen recording
export const MKT_INTERMEDIATE_TOTAL = MKT_INTERMEDIATE_HEAD + MKT_INTERMEDIATE_SCREEN + MKT_CTA_FRAMES; // 749

// Layout constants (1080x1920 — 4x scale from 270x480 test page)
export const FRAME_W = 1080;
export const FRAME_H = 1920;
export const SAFE_PAD = 72; // inset on all 4 sides so content isn't clipped by Reels UI
export const BOARD_SIZE = FRAME_W - SAFE_PAD * 2; // 984px
export const ZONE_H = (FRAME_H - BOARD_SIZE) / 2; // 468px
