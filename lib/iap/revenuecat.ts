'use client';

/**
 * RevenueCat (StoreKit) plumbing for Rookie Pro — iOS shells ONLY. ONE
 * RevenueCat project holds all three apps (Chess Path, Chess Boxing, Rookie's
 * Revenge — Revenge has its own copy of this in ~/rookies-run with its own
 * key); every app's products attach to the ONE entitlement `pro`.
 *
 * Apple forbids linking out for digital goods, so inside the Capacitor app the
 * paywall must buy through StoreKit. RevenueCat wraps that and posts a webhook
 * (/api/iap/revenuecat-webhook) which writes the SAME `profiles.subscription_status`
 * the Stripe webhook sets — one entitlement, three storefronts.
 *
 * On the web (non-native) every function here is a no-op that reports
 * `{ native: false }` so the paywall falls through to the Stripe checkout in
 * hooks/useSubscription.ts. The plugin is imported lazily so it never ships to
 * web bundles that don't need it.
 *
 * Per-target (build-time, lib/config/offline.ts): each iOS app is its own
 * App Store Connect record, so it has its own products and its own RevenueCat
 * public (Apple) SDK key. Every app identifies the customer by the Supabase
 * uid — that is what makes a purchase in one app unlock the others (and the
 * webhook writes it to the shared profile row).
 *   Chess Boxing: chessboxing_pro_monthly / chessboxing_pro_yearly,
 *                 NEXT_PUBLIC_REVENUECAT_IOS_KEY
 *   Chess Path:   chesspath_pro_monthly / chesspath_pro_yearly,
 *                 NEXT_PUBLIC_REVENUECAT_IOS_KEY_CHESSPATH
 *   (Revenge:     revenge_pro_monthly / revenge_pro_yearly — its own repo)
 * Offerings: `default` (7-day intro offer) and `no_trial` (for accounts that
 * already used their one trial anywhere; falls back to `default`).
 * Setup: docs/rookie-pro-setup.md.
 */

import type { PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { IS_CHESSPATH_APP } from '@/lib/config/offline';
import { PRO_PRODUCTS, RC_ENTITLEMENT, RC_OFFERING_NO_TRIAL } from '@/lib/iap/products';

export { RC_ENTITLEMENT };
export const RC_PRODUCTS = IS_CHESSPATH_APP ? PRO_PRODUCTS.chesspath : PRO_PRODUCTS.chessboxing;
/** Which env var carries this bundle's RevenueCat Apple public SDK key. */
export const RC_KEY_ENV = IS_CHESSPATH_APP
  ? 'NEXT_PUBLIC_REVENUECAT_IOS_KEY_CHESSPATH'
  : 'NEXT_PUBLIC_REVENUECAT_IOS_KEY';
// Both branches must be literal `process.env.X` reads so Next can inline them.
const RC_API_KEY = IS_CHESSPATH_APP
  ? process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY_CHESSPATH
  : process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY;

export interface ProOffering {
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
  /** Localized price strings straight from StoreKit ("$4.99"). */
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
  const apiKey = RC_API_KEY;
  if (!apiKey) {
    console.warn(`[revenuecat] ${RC_KEY_ENV} missing — IAP disabled`);
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

/**
 * The offering the paywall sells, split into its two packages: `no_trial`
 * when this account already used its one Rookie Pro trial (and that offering
 * exists in RevenueCat), else the current (`default`) one.
 */
export async function getProOffering(opts?: { noTrial?: boolean }): Promise<ProOffering | null> {
  if (!(await isNativeIap())) return null;
  try {
    const Purchases = await plugin();
    const offerings = await Purchases.getOfferings();
    const current =
      (opts?.noTrial ? offerings.all?.[RC_OFFERING_NO_TRIAL] : undefined) ?? offerings.current;
    if (!current) return null;
    const monthly =
      current.monthly ??
      current.availablePackages.find((p) => p.product.identifier.startsWith(RC_PRODUCTS.monthly)) ??
      null;
    const yearly =
      current.annual ??
      current.availablePackages.find((p) => p.product.identifier.startsWith(RC_PRODUCTS.yearly)) ??
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

/**
 * Restore purchases (Apple requires this button on every paywall).
 *
 * The RevenueCat project's restore behavior is "Transfer to new App User ID"
 * (docs/rookie-pro-setup.md): if this Apple ID's subscription belongs to a
 * different account, restoring MOVES it to the signed-in one, and the webhook
 * gets a TRANSFER event (revoke old account, grant this one).
 *
 * After the restore call, re-read customer info ONCE: a purchase made in the
 * other app (same Supabase uid, same entitlement) can land on the customer a
 * beat after `restorePurchases` resolves, and the first response sometimes
 * still shows the pre-restore snapshot.
 */
export async function restorePro(): Promise<boolean> {
  if (!(await isNativeIap())) return false;
  try {
    const Purchases = await plugin();
    const { customerInfo } = await Purchases.restorePurchases();
    if (customerInfo.entitlements.active[RC_ENTITLEMENT]) return true;
    const fresh = await Purchases.getCustomerInfo();
    return !!fresh.customerInfo.entitlements.active[RC_ENTITLEMENT];
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
