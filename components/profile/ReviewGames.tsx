'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/** Same short date format the workout rows use. */
function fmtSessionDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// ── Review Your Games — the profile's main action, not a buried dropdown.
// Loads on mount and shows the latest games straight away; the full history
// (the API returns 50) is one tap behind "Show all". Rows link to
// /review?id=<id>.

export interface RecentGame {
  id: string;
  startedAt: string | null;
  endedAt: string | null;
  result: 'win' | 'loss' | 'draw' | null;
  totalMoves: number;
  brilliantMoves: number;
  greatMoves: number;
}

const GAME_RESULT = {
  win: { label: 'Won', cls: 'text-chess-green' },
  loss: { label: 'Lost', cls: 'text-[#e5484d]' },
  draw: { label: 'Draw', cls: 'text-chess-text-muted' },
} as const;

/** How many rows show before "Show all". */
const GAMES_PREVIEW = 5;

function RecentGameRow({ game }: { game: RecentGame }) {
  const result = GAME_RESULT[game.result ?? 'draw'] ?? GAME_RESULT.draw;
  return (
    <Link
      href={`/review?id=${game.id}`}
      className="group flex items-center gap-3 px-4 py-3 min-h-[56px] active:bg-chess-page transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-chess-text leading-tight">
            {fmtSessionDate(game.endedAt || game.startedAt || '')}
          </span>
          <span className={`text-sm font-black ${result.cls}`}>{result.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-chess-text-muted mt-1">
          <span>{game.totalMoves} moves</span>
          {game.brilliantMoves > 0 && (
            /* Gold, matching the Legendary tile on the finish screen. */
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/25 text-amber-800">
              {game.brilliantMoves} legendary
            </span>
          )}
          {game.greatMoves > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600">
              {game.greatMoves} great
            </span>
          )}
        </div>
      </div>
      <span className="flex items-center gap-0.5 shrink-0 text-xs font-black text-chess-blue">
        Review
        <svg className="w-3.5 h-3.5 group-active:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </Link>
  );
}

export function ReviewGames({ debugGames }: { debugGames?: RecentGame[] }) {
  const [games, setGames] = useState<RecentGame[] | null>(debugGames ?? null);
  const [failed, setFailed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (debugGames) return; // test pages inject their own rows
    let cancelled = false;
    fetch('/api/games')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
      .then((data) => { if (!cancelled) setGames(Array.isArray(data.games) ? data.games : []); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [debugGames]);

  const visible = games ? (showAll ? games : games.slice(0, GAMES_PREVIEW)) : null;
  const hidden = games ? Math.max(0, games.length - GAMES_PREVIEW) : 0;

  return (
    <div>
      <div className="px-1 mb-2">
        <h2 className="text-lg font-black text-chess-text leading-tight">Review Your Games</h2>
        <p className="text-sm text-chess-text-muted leading-snug">
          See every move graded — and where the Legendary ones were.
        </p>
      </div>

      <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {failed ? (
          <p className="text-sm text-chess-text-muted py-6 px-4 text-center">
            Could not load your games. Try again in a moment.
          </p>
        ) : visible === null ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-4 py-3.5 flex items-center gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-6 px-4 text-center">
            <p className="text-sm text-chess-text-muted">
              Play a game and it&apos;ll show up here, move by move.
            </p>
            <Link
              href="/play"
              className="mt-3 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-black text-white"
              style={{ backgroundColor: 'var(--color-chess-green)' }}
            >
              Play Rookie
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {visible.map((g) => (
                <RecentGameRow key={g.id} game={g} />
              ))}
            </div>
            {!showAll && hidden > 0 && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="w-full min-h-[44px] border-t border-slate-100 text-sm font-black text-chess-blue active:bg-chess-page transition-colors"
              >
                Show all {games!.length} games
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
