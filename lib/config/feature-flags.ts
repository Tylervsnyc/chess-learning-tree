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
  /**
   * Day 2 (CHE-359) — value-led landing for cold traffic. Day 1 made the CTAs
   * instant and ALL 18 paid clicks saw them, yet only 2 tapped: speed wasn't the
   * cliff, the missing value prop was. This replaces the Play/Learn fork with a
   * single dominant "Start playing" CTA under a "Learn chess in 5 minutes. Free."
   * headline (basics demoted to a link). Existing users never see it.
   */
  IG_LANDING_VALUE_CTA: true,
  /**
   * Day 3 — landing copy echoes the ad hook. The value-led headline already
   * shipped in `ColdLanding` (Day 2); this swaps it to challenge-framed copy
   * that continues the paid IG creative ("Beat me in 60 seconds?") instead of a
   * generic "learn" promise — reframing work → game to lift picked-a-path.
   * Copy-only, inside the existing ColdLanding (no competing landing). Flip to
   * false to fall back to the Day-2 value headline. IG cohort only.
   */
  IG_LANDING_COPY: true,
} as const;
