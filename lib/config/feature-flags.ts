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
