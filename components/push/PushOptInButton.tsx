'use client';

import { usePushSubscription } from '@/lib/push/usePushSubscription';

/**
 * PushOptInButton (CHE-345 / Engine 2 — Retain).
 *
 * A MANUAL trigger for the web-push subscribe flow. This is the mechanism only;
 * it is NOT mounted anywhere by default. Tyler decides where/when it appears.
 *
 * TODO(Tyler): choose placement + gate it. Suggested: a "Remind me to practice"
 * toggle in settings, OR a one-time CTA after a streak win. Wire it behind a
 * feature flag (see lib/feature-flags.ts) so it stays dark until you're ready.
 * Do NOT auto-prompt on page load — that tanks grant rates and feels spammy.
 *
 * Test it live by importing this into any /test page (those have overflow-auto).
 */
export function PushOptInButton({ className }: { className?: string }) {
  const { supported, permission, subscribed, loading, error, subscribe, unsubscribe } =
    usePushSubscription();

  if (!supported) {
    return (
      <p className="text-chess-text-muted text-sm">
        Push notifications aren&apos;t supported on this device.
      </p>
    );
  }

  if (permission === 'denied') {
    return (
      <p className="text-chess-text-muted text-sm">
        Notifications are blocked. Re-enable them in your browser settings to get reminders.
      </p>
    );
  }

  return (
    <div className={className}>
      {subscribed ? (
        <button
          onClick={unsubscribe}
          disabled={loading}
          className="w-full bg-chess-page text-chess-text font-bold py-3 rounded-xl border border-slate-200 transition-all hover:brightness-95 disabled:opacity-60"
        >
          {loading ? 'Working…' : 'Turn off reminders'}
        </button>
      ) : (
        <button
          onClick={subscribe}
          disabled={loading}
          className="w-full bg-chess-green text-white font-bold py-3 rounded-xl border-b-[4px] border-chess-green-shadow transition-all hover:brightness-105 active:border-b-[2px] active:translate-y-[2px] disabled:opacity-60"
        >
          {loading ? 'Working…' : 'Remind me to practice'}
        </button>
      )}
      {error ? <p className="text-chess-red text-sm mt-2">{error}</p> : null}
    </div>
  );
}
