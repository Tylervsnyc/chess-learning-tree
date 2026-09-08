'use client';

import type { StreakData } from '@/lib/streak-client';
import { otherFamilyApps, openFamilyApp, type FamilyAppId } from '@/lib/family/apps';

/**
 * FamilyStrip — "Your Chess": the one account, across the whole family.
 *
 * Props-driven and dumb on purpose: the screen that mounts it already holds
 * the streak and rating (hooks/useProfileData.ts), so this never fetches.
 * One row: the streak, the rating, then a tile for every OTHER app in the
 * family (lib/family/apps.ts decides which ones) that opens its store page
 * in a shell or its web home on the web.
 *
 * Signed out → the streak/rating tiles read "Sign in to sync" (the numbers
 * belong to an account, and this is the nudge to have one).
 *
 * Tones: 'light' = white surface on page-blue (Chess Path profile);
 * 'dark' = the Corner Room's dark wood, where a white card would glare.
 *
 * Rendered ONLY behind FEATURE_FLAGS.FAMILY_STRIP — the caller gates it.
 */
export interface FamilyStripProps {
  streak: StreakData | null;
  /** Current rating, or null when unrated / unknown. */
  elo: number | null;
  loading: boolean;
  signedIn: boolean;
  tone?: 'light' | 'dark';
}

const HOOKS: Record<FamilyAppId, string> = {
  chessboxing: 'Drill your mistakes',
  chesspath: 'Learn the why',
  revenge: 'A new run every day',
};

export function FamilyStrip({ streak, elo, loading, signedIn, tone = 'light' }: FamilyStripProps) {
  const dark = tone === 'dark';
  const others = otherFamilyApps();

  const shell = dark
    ? 'bg-chess-bg-light text-white ring-1 ring-white/10'
    : 'bg-chess-surface text-chess-text border border-slate-200 shadow-sm';
  const label = dark ? 'text-chess-text-light' : 'text-chess-text-muted';
  const tile = dark
    ? 'bg-chess-bg-deep/70 hover:bg-chess-bg-deep active:bg-chess-bg-deep'
    : 'bg-chess-page hover:brightness-[0.98] active:brightness-95';
  const skeleton = dark ? 'bg-white/10' : 'bg-slate-200';

  return (
    <section className={`rounded-2xl p-3 ${shell}`} aria-label="Your chess across the family">
      <h2 className={`px-1 mb-2 text-[10px] font-black uppercase tracking-[0.18em] ${label}`}>
        Your chess
      </h2>

      {/* Numbers + app tiles. 2 columns on a phone (the numbers share a row,
          the app tiles share the next), one row from md up. Nothing here can
          overflow sideways — every tile is min-w-0 and wraps its text. */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <NumberTile
          className={tile}
          labelClass={label}
          skeleton={skeleton}
          label="Streak"
          loading={loading}
          signedIn={signedIn}
          value={streak ? `${streak.current}` : '0'}
          unit={streak && streak.current === 1 ? 'day' : 'days'}
          icon={<Flame lit={!!streak && streak.current > 0} />}
        />
        <NumberTile
          className={tile}
          labelClass={label}
          skeleton={skeleton}
          label="Rating"
          loading={loading}
          signedIn={signedIn}
          value={elo === null ? '—' : `${elo}`}
          unit={elo === null ? 'unrated' : ''}
        />

        {others.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => openFamilyApp(app.id)}
            className={`min-h-[56px] min-w-0 rounded-xl px-3 py-2 text-left transition-colors tap-highlight ${tile}`}
          >
            <span className="block truncate text-sm font-extrabold leading-tight">{app.name}</span>
            <span className={`mt-0.5 block text-[11px] font-semibold leading-snug ${label}`}>
              {HOOKS[app.id]}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function NumberTile({
  className,
  labelClass,
  skeleton,
  label,
  loading,
  signedIn,
  value,
  unit,
  icon,
}: {
  className: string;
  labelClass: string;
  skeleton: string;
  label: string;
  loading: boolean;
  signedIn: boolean;
  value: string;
  unit: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`min-h-[56px] min-w-0 rounded-xl px-3 py-2 ${className}`}>
      <span className={`block text-[10px] font-black uppercase tracking-wider ${labelClass}`}>
        {label}
      </span>
      {!signedIn ? (
        <span className={`mt-0.5 block text-[12px] font-bold leading-snug ${labelClass}`}>
          Sign in to sync
        </span>
      ) : loading ? (
        <span className={`mt-1.5 block h-5 w-14 animate-pulse rounded ${skeleton}`} />
      ) : (
        <span className="mt-0.5 flex items-baseline gap-1.5">
          {icon}
          <span className="text-xl font-black leading-none tabular-nums">{value}</span>
          {unit && <span className={`text-[11px] font-bold ${labelClass}`}>{unit}</span>}
        </span>
      )}
    </div>
  );
}

/** A small flame — orange when the streak is alive, muted when it's at zero. */
function Flame({ lit }: { lit: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden
      className={`self-center ${lit ? 'text-chess-orange' : 'text-chess-text-faint'}`}
    >
      <path
        fill="currentColor"
        d="M12 2c.6 3.2 2.4 4.9 4.3 6.8C18.2 10.6 20 12.6 20 15.5A8 8 0 0 1 4 15.5c0-2.3 1-4 2.3-5.4.3 1.4 1.1 2.5 2.2 3.1C8.2 9.6 9.9 5.1 12 2Zm0 20a4 4 0 0 0 4-4c0-1.7-1-2.8-2-3.9-.3 1-1 1.7-1.8 2.1-.2-1.5-.6-2.6-1.5-3.7A5.5 5.5 0 0 0 8 18a4 4 0 0 0 4 4Z"
      />
    </svg>
  );
}
