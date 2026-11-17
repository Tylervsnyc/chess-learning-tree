/**
 * Rookie Pro store products — Chess Path ONLY (Tyler 2026-11-17). ONE
 * RevenueCat entitlement `pro`. Server-safe (no 'use client'): the RevenueCat
 * webhook reads this list to accept a purchase; lib/iap/revenuecat.ts sells it.
 * The chessboxing_pro_* / revenge_pro_* products made in ASC on 2026-10-18 are
 * NOT sold — they are deliberately absent here, so the webhook ignores them.
 *
 * The `*_notrial` ids are optional no-intro-offer products for people who
 * already used their one trial (offering `no_trial`).
 */
export const RC_ENTITLEMENT = 'pro';

export const RC_OFFERING_DEFAULT = 'default';
export const RC_OFFERING_NO_TRIAL = 'no_trial';

export const PRO_PRODUCTS = {
  chesspath: { monthly: 'chesspath_pro_monthly', yearly: 'chesspath_pro_yearly' },
} as const;

/** Every product id that grants Rookie Pro, trial and no-trial variants. */
export const ALL_PRO_PRODUCT_IDS: ReadonlySet<string> = new Set(
  Object.values(PRO_PRODUCTS).flatMap((p) => [
    p.monthly,
    p.yearly,
    `${p.monthly}_notrial`,
    `${p.yearly}_notrial`,
  ]),
);

/**
 * Does this store product grant Pro? Matches the known ids, plus any id that
 * starts with one of them (App Store ids sometimes carry a suffix like
 * `chesspath_pro_monthly:p1m` on Play-style stores).
 */
export function isProProductId(productId: string | null | undefined): boolean {
  if (!productId) return false;
  if (ALL_PRO_PRODUCT_IDS.has(productId)) return true;
  const base = productId.split(':')[0];
  return ALL_PRO_PRODUCT_IDS.has(base);
}
