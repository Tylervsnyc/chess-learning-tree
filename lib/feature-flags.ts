/**
 * Feature flags — flip these when ready to enable.
 *
 * MONETIZATION_ENABLED: When false, hides all premium/patron UI
 * (pricing links, paywall modals, upsell cards). All content is free.
 * LEGACY — superseded by `FEATURE_FLAGS.PRO` in lib/config/feature-flags.ts
 * (one Pro across Chess Path + Chess Boxing + Rookie's Revenge). Stays off;
 * new paid surfaces gate on PRO only.
 */
export const MONETIZATION_ENABLED = false;

/**
 * DAILY_RUN_ENABLED: When false, hides the Daily Run link in the Learn nav.
 * The /run route itself stays live as a standalone page.
 */
export const DAILY_RUN_ENABLED = false;
