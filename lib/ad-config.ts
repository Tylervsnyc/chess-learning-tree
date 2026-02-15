/**
 * Ad Placement Configuration
 *
 * Controls which ad positions are enabled and what type of ad to show.
 * Currently self-promo upgrade CTAs only; third-party ads can be swapped in later.
 */

export type AdType = 'self_promo' | 'third_party';

export interface AdPositionConfig {
  enabled: boolean;
  type: AdType;
}

/** Master switch for ads. Override via NEXT_PUBLIC_SHOW_ADS env var. */
export const SHOW_ADS: boolean =
  process.env.NEXT_PUBLIC_SHOW_ADS !== 'false'; // default true

/** Per-position configuration */
export const AD_POSITIONS: Record<string, AdPositionConfig> = {
  'learn-page': { enabled: true, type: 'self_promo' },
  'daily-complete': { enabled: true, type: 'self_promo' },
  'after-lesson': { enabled: true, type: 'self_promo' },
} as const;

/** Check if a specific position should render an ad */
export function isAdEnabled(position: string): boolean {
  if (!SHOW_ADS) return false;
  const config = AD_POSITIONS[position];
  return config?.enabled ?? false;
}

/** Get ad type for a position */
export function getAdType(position: string): AdType {
  return AD_POSITIONS[position]?.type ?? 'self_promo';
}
