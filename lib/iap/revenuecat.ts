'use client';

/**
 * RevenueCat (StoreKit) plumbing for Chess Boxing Pro — iOS shell ONLY.
 *
 * Apple forbids linking out for digital goods, so inside the Capacitor app the
 * paywall must buy through StoreKit. RevenueCat wraps that and posts a webhook
 * (/api/iap/revenuecat-webhook) which writes the SAME `profiles.subscription_status`
 * the Stripe webhook sets — one entitlement, two storefronts.
 *
 * On the web (non-native) every function here is a no-op that reports
 * `{ native: false }` so the paywall falls through to the Stripe checkout in
 * hooks/useSubscription.ts. The plugin is imported lazily so it never ships to
 * web bundles that don't need it.
 *
 * Product IDs (App Store Connect): chessboxing_pro_monthly, chessboxing_pro_yearly.
 * Entitlement: `pro`. Offering: `default`. Setup: docs/chess-boxing-pro-setup.md.
 */

import type { PurchasesPackage } from '@revenuecat/purchases-capacitor';

export const RC_ENTITLEMENT = 'pro';
export const RC_PRODUCTS = {
  monthly: 'chessboxing_pro_monthly',
  yearly: 'chessboxing_pro_yearly',
} as const;

export interface ProOffering {
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
  /** Localized price strings straight from StoreKit ("$5.99"). */
  monthlyPrice: string | null;
  yearlyPrice: string | null;
}

let configuredFor: string | null = null; // Supabase user id we identified as
let nativeCache: boolean | null = null;

/** True only inside the Capacitor iOS/Android shell — never on the web. */
export async function isNativeIap(): Promise<boolean> {
  if (nativeCache !== null) return nativeCache;
  try {
    const { Capacitor } = await import('@capacitor/core');
    nativeCache = Capacitor.isNativePlatform();
  } catch {
    nativeCache = false;
  }
  return nativeCache;
}

async function plugin() {
  const mod = await import('@revenuecat/purchases-capacitor');
  return mod.Purchases;
}

/**
 * Configure the SDK once and identify the user by their Supabase id (that id
 * is what the webhook receives as `app_user_id`). Safe to call repeatedly.
 */
export async function initRevenueCat(userId: string | null): Promise<boolean> {
  if (!(await isNativeIap())) return false;
  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY;
  if (!apiKey) {
    console.warn('[revenuecat] NEXT_PUBLIC_REVENUECAT_IOS_KEY missing — IAP disabled');
    return false;
  }
  try {
    const Purchases = await plugin();
    if (configuredFor === null) {
      await Purchases.configure({ apiKey, appUserID: userId ?? undefined });
      configuredFor = userId ?? '';
    } else if (userId && configuredFor !== userId) {
      await Purchases.logIn({ appUserID: userId });
      configuredFor = userId;
    }
    return true;
  } catch (err) {
    console.error('[revenuecat] configure failed', err);
    return false;
  }
}

/** The `default` offering, split into the two packages the paywall renders. */
export async function getProOffering(): Promise<ProOffering | null> {
  if (!(await isNativeIap())) return null;
  try {
    const Purchases = await plugin();
    const { current } = await Purchases.getOfferings();
    if (!current) return null;
    const monthly =
      current.monthly ??
      current.availablePackages.find((p) => p.product.identifier === RC_PRODUCTS.monthly) ??
      null;
    const yearly =
      current.annual ??
      current.availablePackages.find((p) => p.product.identifier === RC_PRODUCTS.yearly) ??
      null;
    return {
      monthly,
      yearly,
      monthlyPrice: monthly?.product.priceString ?? null,
      yearlyPrice: yearly?.product.priceString ?? null,
    };
  } catch (err) {
    console.error('[revenuecat] getOfferings failed', err);
    return null;
  }
}

/**
 * Buy a package. Resolves `true` when the `pro` entitlement is active after
 * the purchase (the webhook flips the DB row moments later; callers should
 * refresh /api/subscription/status on success).
 */
export async function purchasePro(pkg: PurchasesPackage): Promise<{ ok: boolean; cancelled: boolean }> {
  if (!(await isNativeIap())) return { ok: false, cancelled: false };
  try {
    const Purchases = await plugin();
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return { ok: !!customerInfo.entitlements.active[RC_ENTITLEMENT], cancelled: false };
  } catch (err) {
    const e = err as { code?: string; message?: string; userCancelled?: boolean };
    const cancelled =
      e?.userCancelled === true || /cancel/i.test(String(e?.code ?? e?.message ?? ''));
    if (!cancelled) console.error('[revenuecat] purchase failed', err);
    return { ok: false, cancelled };
  }
}

/** Restore purchases (Apple requires this button on every paywall). */
export async function restorePro(): Promise<boolean> {
  if (!(await isNativeIap())) return false;
  try {
    const Purchases = await plugin();
    const { customerInfo } = await Purchases.restorePurchases();
    return !!customerInfo.entitlements.active[RC_ENTITLEMENT];
  } catch (err) {
    console.error('[revenuecat] restore failed', err);
    return false;
  }
}

/** Is the `pro` entitlement active on the device's RevenueCat customer? */
export async function isProActive(): Promise<boolean> {
  if (!(await isNativeIap())) return false;
  try {
    const Purchases = await plugin();
    const { customerInfo } = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[RC_ENTITLEMENT];
  } catch {
    return false;
  }
}
