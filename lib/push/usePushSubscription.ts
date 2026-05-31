'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * usePushSubscription (CHE-345 / Engine 2 — Retain).
 *
 * Client hook for the web-push subscribe flow. Provides the MECHANISM only —
 * it never auto-prompts. A caller (e.g. a settings toggle or a post-win CTA)
 * decides when to invoke subscribe(). See PushOptInButton for a manual trigger.
 *
 * subscribe() will:
 *   1. request Notification permission (browser prompt),
 *   2. register a PushManager subscription against the VAPID public key,
 *   3. POST it to /api/push/subscribe.
 *
 * Nothing here sends a notification — that's server-side and gated by
 * WEB_PUSH_ENABLED.
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported';

export interface UsePushSubscription {
  /** Browser supports service workers + Push + Notifications. */
  supported: boolean;
  /** Current Notification permission, or 'unsupported'. */
  permission: PushPermission;
  /** True when an active PushManager subscription exists for this browser. */
  subscribed: boolean;
  /** A request is in flight. */
  loading: boolean;
  /** Last error message, if any. */
  error: string | null;
  /** Prompt for permission + register + POST. Returns true on success. */
  subscribe: () => Promise<boolean>;
  /** Unsubscribe locally + tell the server to drop it. */
  unsubscribe: () => Promise<boolean>;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  // Back the array with a concrete ArrayBuffer so it satisfies BufferSource
  // (lib.dom's applicationServerKey rejects the SharedArrayBuffer-union form).
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

function detectSupport(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export function usePushSubscription(): UsePushSubscription {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<PushPermission>('unsupported');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect support + existing subscription on mount.
  useEffect(() => {
    const ok = detectSupport();
    setSupported(ok);
    if (!ok) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission as PushPermission);

    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((existing) => setSubscribed(!!existing))
      .catch(() => {
        /* getSubscription can reject if SW isn't ready yet — non-fatal */
      });
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!detectSupport()) {
      setError('Push notifications are not supported on this device.');
      return false;
    }
    if (!VAPID_PUBLIC_KEY) {
      setError('Push is not configured (missing VAPID public key).');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm as PushPermission);
      if (perm !== 'granted') {
        setError('Notification permission was not granted.');
        return false;
      }

      // The SW is registered by InstallPrompt; wait for it to be active.
      const reg = await navigator.serviceWorker.ready;

      // Reuse an existing subscription if present, else create one.
      let subscription = await reg.pushManager.getSubscription();
      if (!subscription) {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });
      if (!res.ok) {
        setError('Failed to save subscription on the server.');
        return false;
      }

      setSubscribed(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!detectSupport()) return false;
    setLoading(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: subscription.toJSON() }),
        }).catch(() => {
          /* best-effort server cleanup */
        });
        await subscription.unsubscribe();
      }
      setSubscribed(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { supported, permission, subscribed, loading, error, subscribe, unsubscribe };
}
