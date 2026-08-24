import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * POST /api/iap/revenuecat-webhook — RevenueCat → Supabase entitlement sync.
 *
 * Chess Boxing Pro bought through StoreKit (iOS shell) lands here and is
 * written onto the SAME `profiles.subscription_status` / `subscription_expires_at`
 * the Stripe webhook sets — one entitlement, two storefronts. Those columns are
 * guarded by the `protect_privileged_profile_columns` trigger, so this route
 * writes with the service client (never user context).
 *
 * `app_user_id` = the Supabase user id (lib/iap/revenuecat.ts identifies the
 * SDK with it). RevenueCat anonymous ids ($RCAnonymousID:…) are ignored.
 *
 * Auth: RevenueCat sends the "Authorization" header value configured on the
 * webhook (docs/chess-boxing-pro-setup.md) — must equal REVENUECAT_WEBHOOK_SECRET
 * (with or without a "Bearer " prefix).
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
  'TRANSFER',
]);
const REVOKE_EVENTS = new Set(['EXPIRATION', 'BILLING_ISSUE']);

interface RcEvent {
  id?: string;
  type?: string;
  app_user_id?: string;
  original_app_user_id?: string;
  product_id?: string;
  entitlement_ids?: string[];
  expiration_at_ms?: number | null;
  purchased_at_ms?: number;
  period_type?: string; // NORMAL | TRIAL | INTRO
  store?: string;
  environment?: string; // SANDBOX | PRODUCTION
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  const userId = [ev.app_user_id, ev.original_app_user_id].find((id) => id && UUID_RE.test(id));
  const tag = `[rc-webhook] ${ev.type} id=${ev.id ?? '?'} env=${ev.environment ?? '?'} product=${ev.product_id ?? '?'} period=${ev.period_type ?? '?'}`;

  if (!userId) {
    console.log(`${tag} — no Supabase user id (app_user_id=${ev.app_user_id}); ignored`);
    return NextResponse.json({ ok: true, ignored: 'no_user' });
  }

  const supabase = createServiceClient();
  const expiresAt =
    typeof ev.expiration_at_ms === 'number' && ev.expiration_at_ms > 0
      ? new Date(ev.expiration_at_ms).toISOString()
      : null;

  if (GRANT_EVENTS.has(ev.type)) {
    // A grant whose expiry is already in the past is a stale redelivery; the
    // shared isPremiumSubscription() check treats it as free anyway.
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: 'premium', subscription_expires_at: expiresAt })
      .eq('id', userId);
    if (error) {
      console.error(`${tag} — grant write failed`, error);
      return NextResponse.json({ error: 'write failed' }, { status: 500 });
    }
    console.log(`${tag} — user ${userId} → premium until ${expiresAt ?? 'open'}`);
    return NextResponse.json({ ok: true, status: 'premium', expiresAt });
  }

  if (ev.type === 'CANCELLATION') {
    // Auto-renew turned off: access continues until expiration_at_ms, then
    // EXPIRATION arrives. Keep premium; just pin the expiry so it lapses on its own.
    if (expiresAt && new Date(expiresAt) > new Date()) {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'premium', subscription_expires_at: expiresAt })
        .eq('id', userId);
      if (error) console.error(`${tag} — cancellation write failed`, error);
      console.log(`${tag} — user ${userId} cancelled, keeps premium until ${expiresAt}`);
      return NextResponse.json({ ok: true, status: 'premium', expiresAt });
    }
    // Already past expiry (e.g. refund) — revoke now.
  }

  if (REVOKE_EVENTS.has(ev.type) || ev.type === 'CANCELLATION') {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: 'free', subscription_expires_at: null })
      .eq('id', userId);
    if (error) {
      console.error(`${tag} — revoke write failed`, error);
      return NextResponse.json({ error: 'write failed' }, { status: 500 });
    }
    console.log(`${tag} — user ${userId} → free`);
    return NextResponse.json({ ok: true, status: 'free' });
  }

  console.log(`${tag} — unhandled type; ignored`);
  return NextResponse.json({ ok: true, ignored: ev.type });
}
