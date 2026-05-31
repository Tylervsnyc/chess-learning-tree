/**
 * Web Push send helper (CHE-345 / Engine 2 — Retain).
 *
 * ALL real sending is gated behind WEB_PUSH_ENABLED. When that flag is not
 * exactly "true", every send is a DRY RUN: we log what *would* have been sent
 * and dispatch nothing. This is the safety switch — nothing leaves the server
 * until Tyler flips the env var.
 *
 * Mirrors the lib/email/ pattern: lazy init, never throw to the caller,
 * structured result objects.
 */
import webpush from 'web-push';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * Master kill-switch. Defaults OFF. Only the exact string "true" enables real
 * sending; anything else (undefined, "false", "1", "") keeps us in dry-run.
 */
export function isWebPushEnabled(): boolean {
  return process.env.WEB_PUSH_ENABLED === 'true';
}

/** Server-side VAPID public key (safe to expose; also mirrored as NEXT_PUBLIC_*). */
export function getVapidPublicKey(): string | undefined {
  return process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
}

let vapidConfigured = false;

/**
 * Configure web-push with our VAPID details exactly once. Returns false if the
 * keys are missing (so callers can no-op cleanly instead of crashing).
 */
function ensureVapidConfigured(): boolean {
  if (vapidConfigured) return true;

  const publicKey = getVapidPublicKey();
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:support@chesspath.app';

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
  return true;
}

/** Shape we store in push_subscriptions, matching the browser PushSubscription. */
export interface StoredPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/** Notification payload the service worker's `push` handler expects. */
export interface PushPayload {
  title: string;
  body: string;
  /** Where to send the user on click. Defaults to "/" in the SW. */
  url?: string;
  /** Optional icon/badge overrides; SW falls back to brand assets. */
  icon?: string;
  badge?: string;
  /** Coalesces stacked notifications; same tag replaces the previous one. */
  tag?: string;
}

export interface SendPushResult {
  /** True if a notification was actually dispatched (only possible when enabled). */
  sent: boolean;
  /** True when we skipped sending because the flag is OFF. */
  dryRun: boolean;
  /** True when the subscription is dead (404/410) and should be pruned. */
  expired?: boolean;
  error?: string;
}

/**
 * Send a single push notification to one subscription.
 *
 * Dry-run by default: when WEB_PUSH_ENABLED !== "true" this logs and returns
 * `{ sent: false, dryRun: true }` WITHOUT calling out to any push service.
 */
export async function sendPush(
  subscription: StoredPushSubscription,
  payload: PushPayload
): Promise<SendPushResult> {
  // SAFETY: flag off → dispatch nothing.
  if (!isWebPushEnabled()) {
    console.log(
      '[web-push] DRY RUN (WEB_PUSH_ENABLED is off) — would send:',
      JSON.stringify({ endpoint: redactEndpoint(subscription.endpoint), payload })
    );
    return { sent: false, dryRun: true };
  }

  if (!ensureVapidConfigured()) {
    console.warn('[web-push] VAPID keys missing — cannot send. Skipping.');
    return { sent: false, dryRun: false, error: 'VAPID keys not configured' };
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      JSON.stringify(payload)
    );
    return { sent: true, dryRun: false };
  } catch (err) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    // 404/410 = subscription is gone (user uninstalled, cleared data, etc.).
    if (statusCode === 404 || statusCode === 410) {
      return { sent: false, dryRun: false, expired: true, error: 'subscription expired' };
    }
    const message = err instanceof Error ? err.message : 'unknown push error';
    console.error('[web-push] send failed:', message);
    return { sent: false, dryRun: false, error: message };
  }
}

/**
 * Send a push to every subscription a user has registered. Prunes dead
 * subscriptions (404/410) from the DB as a side effect. Still fully gated by
 * WEB_PUSH_ENABLED — dry-runs send nothing and prune nothing.
 */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<{ total: number; sent: number; dryRun: boolean }> {
  const supabase = createServiceClient();
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId);

  if (!subs || subs.length === 0) {
    return { total: 0, sent: 0, dryRun: !isWebPushEnabled() };
  }

  let sent = 0;
  const expiredEndpoints: string[] = [];

  for (const row of subs) {
    const result = await sendPush(
      { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
      payload
    );
    if (result.sent) sent += 1;
    if (result.expired) expiredEndpoints.push(row.endpoint);
  }

  // Prune dead subscriptions (only happens on real sends).
  if (expiredEndpoints.length > 0) {
    await supabase.from('push_subscriptions').delete().in('endpoint', expiredEndpoints);
  }

  return { total: subs.length, sent, dryRun: !isWebPushEnabled() };
}

/** Don't log full endpoints (they're per-user secrets) — keep just enough to debug. */
function redactEndpoint(endpoint: string): string {
  return endpoint.length > 40 ? `${endpoint.slice(0, 40)}…` : endpoint;
}
