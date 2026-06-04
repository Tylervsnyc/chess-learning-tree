/**
 * Feature Flags
 *
 * Toggle features on/off without removing code.
 * Set to `true` to enable, `false` to disable.
 */

export const FEATURE_FLAGS = {
  /** Show streak counter in header on / and /daily-challenge */
  SHOW_STREAK_COUNTER: false,
  /** Show share buttons/cards on lesson complete and daily challenge screens */
  SHOW_SHARING: true,
  /** Show block intro popups (the "Welcome to Forks!" style popups at block boundaries) */
  SHOW_BLOCK_INTROS: false,
  /** Show Openings feature (v1 archived — new version TBD) */
  SHOW_OPENINGS: true,
} as const;

/**
 * IG Funnel Sprint (CHE-359, 2026-06-03 → 2026-06-13).
 *
 * One flag per day's experiment. EVERY flag here is additionally gated by
 * `isIgCohort()` (lib/growth/ig-cohort.ts), so flipping one on only affects
 * cold Instagram-ad traffic — existing users never see these. Default ON =
 * "live for the IG cohort." Flip to false to kill an experiment.
 *
 * Plan + per-day spec: data/growth/ig-ad-sprint-2026-06.md.
 */
export const IG_SPRINT_FLAGS = {
  /** Day 1 — skip the staged power-on entrance so the CTAs are instant. */
  IG_LANDING_FASTPATH: true,
  /** Day 2 — one dominant "Play" CTA; demote "Learn" to a small text link (kills the fork). */
  IG_SINGLE_CTA: true,
} as const;
