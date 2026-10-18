import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServiceClient } from '@/lib/supabase/service';
import { stripe } from '@/lib/stripe';
import { isProProductId, RC_ENTITLEMENT } from '@/lib/iap/products';
import { markProTrialUsed } from '@/lib/pro/trial';

/**
 * POST /api/iap/revenuecat-webhook — RevenueCat → Supabase entitlement sync.
 *
 * Rookie Pro bought through StoreKit in ANY of the three apps (Chess Path,
 * Chess Boxing, Rookie's Revenge — one RevenueCat project, one entitlement
 * `pro`, docs/rookie-pro-setup.md) lands here and is written onto the SAME
 * `profiles.subscription_status` / `subscription_expires_at` the Stripe
 * webhook sets. Those columns are guarded by the
 * `protect_privileged_profile_columns` trigger, so this route writes with the
 * service client (never user context).
 *
 * `app_user_id` = the Supabase user id (every app identifies the SDK with it).
 * RevenueCat anonymous ids ($RCAnonymousID:…) are ignored.
 *
 * Events:
 *   grant   INITIAL_PURCHASE, RENEWAL, UNCANCELLATION, NON_RENEWING_PURCHASE,
 *           PRODUCT_CHANGE, SUBSCRIPTION_EXTENDED, TEMPORARY_ENTITLEMENT_GRANT,
 *           REFUND_REVERSED → premium until expiration_at_ms
 *   keep    CANCELLATION, SUBSCRIPTION_PAUSED, BILLING_ISSUE → access runs to
 *           expiration_at_ms (auto-renew off / paused / grace period); EXPIRATION
 *           follows. Already past expiry (refund) → revoke now.
 *   revoke  EXPIRATION
 *   TRANSFER "Transfer to new App User ID" on restore: the subscription moved
 *           from `transferred_from` ids to `transferred_to` ids → grant the
 *           new owner, revoke the old one(s).
 * A revoke never clears someone who ALSO has an active Stripe Pro sub (they
 * paid on the web; the App Store lapsing doesn't end that).
 * Only Pro products/entitlements count (lib/iap/products.ts) — anything else
 * sold through the shared project is ignored.
 * Trial use (period_type TRIAL) is stamped on the profile — one trial per
 * person across every app (lib/pro/trial.ts).
 *
 * Auth: RevenueCat sends the "Authorization" header value configured on the
 * webhook — must equal REVENUECAT_WEBHOOK_SECRET (with or without "Bearer ").
 * Optional REVENUECAT_SECRET_API_KEY lets TRANSFER read the true expiry from
 * the RevenueCat REST API instead of copying it from the old account.
 *
 * Idempotent: every write is a plain overwrite of (status, expires_at), so a
 * redelivered event produces the same row. Always 200 on handled/ignored
 * events so RevenueCat stops retrying.
 */

const GRANT_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'PRODUCT_CHANGE',
  'SUBSCRIPTION_EXTENDED',
  'TEMPORARY_ENTITLEMENT_GRANT',
  'REFUND_REVERSED',
]);
/** Access continues until expiration_at_ms; EXPIRATION arrives later. */
const KEEP_UNTIL_EXPIRY_EVENTS = new Set(['CANCELLATION', 'SUBSCRIPTION_PAUSED', 'BILLING_ISSUE']);
const REVOKE_EVENTS = new Set(['EXPIRATION']);

interface RcEvent {
  id?: string;
  type?: string;
  app_user_id?: string;
  original_app_user_id?: string;
  aliases?: string[];
  product_id?: string;
  new_product_id?: string;
  /** Which App Store record it came from (Chess Path / Chess Boxing / Revenge). */
  app_id?: string;
  entitlement_ids?: string[] | null;
  entitlement_id?: string | null;
  expiration_at_ms?: number | null;
  purchased_at_ms?: number;
  period_type?: string; // NORMAL | TRIAL | INTRO | PROMOTIONAL | PREPAID
  store?: string;
  environment?: string; // SANDBOX | PRODUCTION
  /** TRANSFER only. */
  transferred_from?: string[];
  transferred_to?: string[];
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const uuids = (ids: (string | null | undefined)[] | null | undefined) =>
  [...new Set((ids ?? []).filter((id): id is string => !!id && UUID_RE.test(id)))];

/** Is this event about Rookie Pro (and not some other product in the shared project)? */
function isProEvent(ev: RcEvent): boolean {
  const ents = [...(ev.entitlement_ids ?? []), ...(ev.entitlement_id ? [ev.entitlement_id] : [])];
  if (ents.length > 0) return ents.includes(RC_ENTITLEMENT);
  return isProProductId(ev.product_id) || isProProductId(ev.new_product_id);
}

async function setPremium(db: SupabaseClient, userId: string, expiresAt: string | null) {
  return db
    .from('profiles')
    .update({ subscription_status: 'premium', subscription_expires_at: expiresAt })
    .eq('id', userId);
}

/** True when this user also holds an active/trialing Stripe Pro subscription. */
async function hasActiveStripePro(db: SupabaseClient, userId: string): Promise<boolean> {
  if (!process.env.STRIPE_SECRET_KEY) return false;
  try {
    const { data } = await db.from('profiles').select('stripe_customer_id').eq('id', userId).maybeSingle();
    const customer = data?.stripe_customer_id as string | null | undefined;
    if (!customer) return false;
    const subs = await stripe.subscriptions.list({ customer, status: 'all', limit: 20 });
    return subs.data.some(
      (s) => (s.status === 'active' || s.status === 'trialing') && s.metadata?.is_patron !== 'true',
    );
  } catch (err) {
    console.error('[rc-webhook] stripe check failed', err);
    // Unknown → don't revoke someone who may have paid on the web.
    return true;
  }
}

/** Revoke Pro unless the user is still covered by Stripe. Returns what happened. */
async function revoke(db: SupabaseClient, userId: string): Promise<'free' | 'kept_stripe' | 'error'> {
  if (await hasActiveStripePro(db, userId)) return 'kept_stripe';
  const { error } = await db
    .from('profiles')
    .update({ subscription_status: 'free', subscription_expires_at: null })
    .eq('id', userId);
  if (error) {
    console.error(`[rc-webhook] revoke ${userId} failed`, error);
    return 'error';
  }
  return 'free';
}

/**
 * The `pro` entitlement as RevenueCat itself sees it for an app user id.
 * null = unknown (no REVENUECAT_SECRET_API_KEY, or the call failed).
 */
async function rcEntitlement(appUserId: string): Promise<{ active: boolean; expiresAt: string | null } | null> {
  const key = process.env.REVENUECAT_SECRET_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      subscriber?: { entitlements?: Record<string, { expires_date?: string | null }> };
    };
    const ent = json.subscriber?.entitlements?.[RC_ENTITLEMENT];
    if (!ent) return { active: false, expiresAt: null };
    const exp = ent.expires_date ?? null; // null = lifetime
    return { active: exp === null || new Date(exp) > new Date(), expiresAt: exp };
  } catch (err) {
    console.error('[rc-webhook] RevenueCat REST read failed', err);
    return null;
  }
}

/** TRANSFER: the store subscription now belongs to `to`; take it off `from`. */
async function handleTransfer(db: SupabaseClient, ev: RcEvent, tag: string) {
  const to = uuids(ev.transferred_to);
  const from = uuids(ev.transferred_from).filter((id) => !to.includes(id));

  // The expiry to carry over: RevenueCat's truth when we can ask, else the
  // furthest-out active premium expiry on the old account(s).
  let carried: { expiresAt: string | null } | null = null;
  if (from.length > 0) {
    const { data } = await db
      .from('profiles')
      .select('subscription_status, subscription_expires_at')
      .in('id', from);
    for (const p of data ?? []) {
      if (p.subscription_status !== 'premium' && p.subscription_status !== 'trial') continue;
      const exp = (p.subscription_expires_at as string | null) ?? null;
      if (exp && new Date(exp) <= new Date()) continue;
      if (!carried || (carried.expiresAt && (!exp || exp > carried.expiresAt))) carried = { expiresAt: exp };
    }
  }

  const granted: string[] = [];
  for (const id of to) {
    const rc = await rcEntitlement(id);
    const grant = rc ? (rc.active ? { expiresAt: rc.expiresAt } : null) : carried;
    if (!grant) {
      console.warn(`${tag} — transfer to ${id}: no active Pro to carry (RENEWAL will catch up)`);
      continue;
    }
    const { error } = await setPremium(db, id, grant.expiresAt);
    if (error) {
      console.error(`${tag} — transfer grant ${id} failed`, error);
      return NextResponse.json({ error: 'write failed' }, { status: 500 });
    }
    granted.push(id);
  }

  const revoked: Record<string, string> = {};
  for (const id of from) {
    const rc = await rcEntitlement(id);
    if (rc?.active) {
      revoked[id] = 'kept_rc'; // still has its own Pro in RevenueCat
      continue;
    }
    revoked[id] = await revoke(db, id);
  }

  console.log(`${tag} — transfer from [${from.join(',')}] to [${to.join(',')}]`, { granted, revoked });
  return NextResponse.json({ ok: true, transfer: { granted, revoked } });
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[rc-webhook] REVENUECAT_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }
  const auth = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!auth || auth !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { event?: RcEvent };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  const ev = body?.event;
  if (!ev?.type) return NextResponse.json({ error: 'no event' }, { status: 400 });

  const tag = `[rc-webhook] ${ev.type} id=${ev.id ?? '?'} env=${ev.environment ?? '?'} app=${ev.app_id ?? '?'} product=${ev.product_id ?? '?'} period=${ev.period_type ?? '?'}`;
  const supabase = createServiceClient();

  if (ev.type === 'TRANSFER') return handleTransfer(supabase, ev, tag);

  if (!isProEvent(ev)) {
    console.log(`${tag} — not a Rookie Pro product/entitlement; ignored`);
    return NextResponse.json({ ok: true, ignored: 'not_pro' });
  }

  const userId = uuids([ev.app_user_id, ev.original_app_user_id, ...(ev.aliases ?? [])])[0];
  if (!userId) {
    console.log(`${tag} — no Supabase user id (app_user_id=${ev.app_user_id}); ignored`);
    return NextResponse.json({ ok: true, ignored: 'no_user' });
  }

  const expiresAt =
    typeof ev.expiration_at_ms === 'number' && ev.expiration_at_ms > 0
      ? new Date(ev.expiration_at_ms).toISOString()
      : null;

  if (GRANT_EVENTS.has(ev.type)) {
    // A grant whose expiry is already in the past is a stale redelivery; the
    // shared isPremiumSubscription() check treats it as free anyway.
    const { error } = await setPremium(supabase, userId, expiresAt);
    if (error) {
      console.error(`${tag} — grant write failed`, error);
      return NextResponse.json({ error: 'write failed' }, { status: 500 });
    }
    if (ev.period_type === 'TRIAL') await markProTrialUsed(supabase, userId);
    console.log(`${tag} — user ${userId} → premium until ${expiresAt ?? 'open'}`);
    return NextResponse.json({ ok: true, status: 'premium', expiresAt });
  }

  if (KEEP_UNTIL_EXPIRY_EVENTS.has(ev.type) && expiresAt && new Date(expiresAt) > new Date()) {
    // Auto-renew off / paused / billing grace: access runs to the expiry, then
    // EXPIRATION arrives. Keep premium; pin the expiry so it lapses on its own.
    const { error } = await setPremium(supabase, userId, expiresAt);
    if (error) console.error(`${tag} — keep-until-expiry write failed`, error);
    console.log(`${tag} — user ${userId} keeps premium until ${expiresAt}`);
    return NextResponse.json({ ok: true, status: 'premium', expiresAt });
  }

  if (REVOKE_EVENTS.has(ev.type) || KEEP_UNTIL_EXPIRY_EVENTS.has(ev.type)) {
    // EXPIRATION, or a keep-event already past expiry (e.g. refund) — revoke now.
    const result = await revoke(supabase, userId);
    if (result === 'error') return NextResponse.json({ error: 'write failed' }, { status: 500 });
    console.log(`${tag} — user ${userId} → ${result}`);
    return NextResponse.json({ ok: true, status: result === 'free' ? 'free' : 'premium' });
  }

  console.log(`${tag} — unhandled type; ignored`);
  return NextResponse.json({ ok: true, ignored: ev.type });
}
