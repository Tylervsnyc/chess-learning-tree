/**
 * Feature Flags
 *
 * Toggle features on/off without removing code.
 * Set to `true` to enable, `false` to disable.
 */

export const FEATURE_FLAGS = {
  /** Show streak counter in header on /learn and /daily-challenge */
  SHOW_STREAK_COUNTER: false,
  /** Show share buttons/cards on lesson complete and daily challenge screens */
  SHOW_SHARING: false,
} as const;
