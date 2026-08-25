'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * FirstBoutCoach — the one-time "here's how you start" card, shown on /box
 * immediately after onboarding finishes.
 *
 * Onboarding used to end by dropping a brand-new fighter on the ring home and
 * wishing them luck. The home is a scene, not a menu: two unlabelled corner
 * buttons and two leaderboards they have no score on. This names the first
 * move for them and offers to take them there.
 *
 * Trigger: the `?firstbout=1` that OnboardFlow.finish() redirects with. Read
 * from window.location in an effect rather than useSearchParams on purpose —
 * useSearchParams would force /box (a server component) behind a Suspense
 * boundary and opt the whole route out of static rendering for a query param
 * that only matters once per install.
 *
 * Shows AT MOST once per device: dismissing (either way) sets the key, and the
 * URL is cleaned up so a refresh can't resurrect it.
 */

const SEEN_KEY = 'cp:box-first-bout-seen';
const PARAM = 'firstbout';

/**
 * The decision is made ONCE per page load and cached out here, on purpose.
 *
 * The effect consumes its own trigger: it reads `?firstbout=1` and then strips
 * it from the URL. So the second run of a remounted effect — React's dev
 * double-invoke, a Fast Refresh, any parent re-mount — finds a clean URL,
 * concludes it wasn't asked for, and the card silently never appears. Caching
 * the verdict in module scope makes the answer stable no matter how many times
 * the component mounts.
 */
let decided = false;
let verdict = false;

export function FirstBoutCoach() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!decided) {
      decided = true;

      let requested = false;
      try {
        requested = new URLSearchParams(window.location.search).get(PARAM) === '1';
      } catch {
        return;
      }

      let seen = false;
      try {
        seen = localStorage.getItem(SEEN_KEY) === '1';
      } catch {
        /* private mode — worst case they see this again next install */
      }

      verdict = requested && !seen;

      // Claim it up front, so a hard refresh mid-card can't show it twice.
      if (verdict) {
        try {
          localStorage.setItem(SEEN_KEY, '1');
        } catch {
          /* non-fatal */
        }
      }

      // Strip the param either way, so a refresh or a back-nav can't re-trigger.
      if (requested) {
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete(PARAM);
          window.history.replaceState({}, '', url.toString());
        } catch {
          /* non-fatal */
        }
      }
    }

    if (verdict) setOpen(true);
  }, []);

  const close = () => {
    verdict = false;
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/65 backdrop-blur-[2px] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-sm bg-chess-surface rounded-3xl shadow-2xl p-5 flex flex-col gap-3 text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-chess-text-muted">
          You&apos;re in
        </div>
        <h2 className="text-xl font-black text-chess-text leading-tight">
          Ready for your first bout?
        </h2>
        <p className="text-sm text-chess-text-muted leading-snug">
          One game against Rookie, split across three chess rounds — with a
          boxing round at every bell. The board freezes, you move your feet, then
          you pick up the same position out of breath.
        </p>
        <p className="text-sm text-chess-text-muted leading-snug">
          It&apos;s the blue corner, any time you want it.
        </p>

        <button
          onClick={() => {
            close();
            router.push('/box/bout');
          }}
          className="mt-1 rounded-2xl bg-chess-green text-white font-black py-3 min-h-[48px] shadow-sm active:translate-y-[2px] transition-transform tap-highlight"
        >
          Start my first bout
        </button>
        <button
          onClick={close}
          className="text-sm font-bold text-chess-text-muted py-2 min-h-[44px] tap-highlight"
        >
          I&apos;ll look around first
        </button>
      </div>
    </div>
  );
}
