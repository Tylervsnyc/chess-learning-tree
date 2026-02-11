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

// Layout constants (1080x1920 — 4x scale from 270x480 test page)
export const FRAME_W = 1080;
export const FRAME_H = 1920;
export const BOARD_SIZE = 1080;
export const ZONE_H = (FRAME_H - BOARD_SIZE) / 2; // 420px
