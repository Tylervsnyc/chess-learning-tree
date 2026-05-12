'use client';

/**
 * Client-side replay UI for a decision trace.
 *
 * Renders the board snapshot for the currently-selected turn + the bot's
 * action and reasoning. Mobile-first: swipe left/right or use the prev/next
 * buttons to step through turns. The whole game's outcome shows in the
 * header so the operator can read "she lost on turn 12 / 20" at a glance.
 */

import { useCallback, useMemo, useState } from 'react';
import { ABILITY_DEFS } from '@/lib/run/abilities';
import { ReplayBoard, actionHighlights } from '@/components/playtest/ReplayBoard';
import type { DecisionTrace } from '@/scripts/run-playtest/types';

interface ReplayClientProps {
  trace: DecisionTrace;
}

// Minimum horizontal swipe distance (px) to register a turn change. Picked
// small enough that flicks work but big enough that scroll attempts don't
// accidentally advance turns.
const SWIPE_MIN_PX = 40;

export function ReplayClient({
  trace,
}: ReplayClientProps): React.ReactElement {
  const totalTurns = trace.decisionLog.length;
  const [idx, setIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const entry = trace.decisionLog[idx];
  const board = entry?.beforeBoard;
  const hi = useMemo(
    () => (entry ? actionHighlights(entry.beforeBoard, entry.action) : { from: null, to: null }),
    [entry],
  );

  const next = useCallback(() => {
    setIdx((i) => Math.min(i + 1, totalTurns - 1));
  }, [totalTurns]);
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) >= SWIPE_MIN_PX) {
      // Right-swipe → prev, left-swipe → next (matches phone gallery feel).
      if (dx > 0) prev();
      else next();
    }
    setTouchStartX(null);
  };

  if (totalTurns === 0) {
    return (
      <div className="h-full overflow-auto bg-stone-50 text-stone-900">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <h1 className="text-2xl font-bold">Empty trace</h1>
          <p className="mt-2 text-sm text-stone-600">
            This game had no Rookie decisions — the sim ended before her
            first turn. That usually means the level's initial state is
            broken; verify the puzzle definition.
          </p>
        </div>
      </div>
    );
  }

  const outcome = trace.outcome;
  const failTag =
    outcome.failMode === 'won'
      ? 'WIN'
      : outcome.failMode === 'captured'
        ? `captured by ${outcome.capturedBy ?? '?'}`
        : outcome.failMode === 'move-limit'
          ? 'move-limit'
          : 'dead-end';

  return (
    <div
      className="h-full overflow-auto bg-stone-50 text-stone-900"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto max-w-md px-3 py-4">
        {/* ─── Header ─────────────────────────────────────────────────── */}
        <header className="mb-3">
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="text-base font-bold leading-tight">
              {trace.runId} · L{trace.level} · {trace.tier} · trial {trace.trial}
            </h1>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                outcome.win
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {failTag}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-stone-500">
            {outcome.movesUsed} moves used · {outcome.captures.length} captures ·{' '}
            {outcome.abilitiesUsed.length} ability taps · {trace.seed}
          </p>
        </header>

        {/* ─── Board ──────────────────────────────────────────────────── */}
        <ReplayBoard
          board={board}
          fromSquare={hi.from}
          toSquareHi={hi.to}
        />

        {/* ─── Turn caption ───────────────────────────────────────────── */}
        <div className="mt-3 rounded-lg border border-stone-200 bg-white p-3 shadow-sm">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Turn {idx + 1} / {totalTurns}
            </span>
            <span className="text-[11px] text-stone-500">
              moves so far: {entry.moveCount}
              {board.moveLimit !== null && ` / ${board.moveLimit}`}
            </span>
          </div>
          <p className="mt-1 text-sm leading-snug text-stone-900">{entry.reason}</p>
          {entry.evalScore !== undefined && (
            <p className="mt-1 text-[11px] text-stone-500">
              eval: {entry.evalScore.toFixed(1)}
            </p>
          )}
          <BoardMeta board={board} />
        </div>

        {/* ─── Nav ───────────────────────────────────────────────────── */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            onClick={prev}
            disabled={idx === 0}
            className="flex-1 rounded-lg bg-stone-200 px-3 py-2 text-sm font-semibold text-stone-900 disabled:opacity-40"
          >
            ← Prev
          </button>
          <input
            type="range"
            min={0}
            max={totalTurns - 1}
            value={idx}
            onChange={(e) => setIdx(parseInt(e.target.value, 10))}
            className="flex-1 accent-stone-700"
            aria-label="Turn slider"
          />
          <button
            onClick={next}
            disabled={idx >= totalTurns - 1}
            className="flex-1 rounded-lg bg-stone-200 px-3 py-2 text-sm font-semibold text-stone-900 disabled:opacity-40"
          >
            Next →
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-stone-500">
          Swipe left/right on the board to step through turns.
        </p>
      </div>
    </div>
  );
}

/**
 * Small footer block showing abilities owned + tempo. Helps the operator
 * understand *why* the bot might be conservative (no Aegis left) or
 * aggressive (Surge available). Kept compact so the board stays prominent.
 */
function BoardMeta({
  board,
}: {
  board: DecisionTrace['decisionLog'][number]['beforeBoard'];
}): React.ReactElement {
  const hasOffer =
    board.pendingOffer !== null && board.pendingOffer.length > 0;
  return (
    <div className="mt-2 space-y-1 text-[11px] text-stone-600">
      <div className="flex flex-wrap items-center gap-1">
        <span className="font-semibold text-stone-700">Form:</span>
        <span>{board.form}</span>
        {board.shieldUp && (
          <span className="ml-1 rounded-full bg-cyan-500/15 px-1.5 py-0.5 text-cyan-700">
            shield up
          </span>
        )}
        {board.bonusMovesLeft > 0 && (
          <span className="ml-1 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-amber-700">
            +{board.bonusMovesLeft} bonus
          </span>
        )}
        <span className="ml-auto">tempo {board.tempo}</span>
      </div>
      {board.abilities.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-semibold text-stone-700">Abilities:</span>
          {board.abilities.map((a) => {
            const name = ABILITY_DEFS[a.id]?.name ?? a.id;
            const uses =
              a.usesLeftThisLevel < 0 ? '∞' : `${a.usesLeftThisLevel}`;
            return (
              <span
                key={a.id}
                className="rounded-md bg-stone-100 px-1.5 py-0.5"
              >
                {name} T{a.tier} ({uses})
              </span>
            );
          })}
        </div>
      )}
      {hasOffer && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-semibold text-stone-700">Offer:</span>
          {board.pendingOffer!.map((o, i) => {
            const name = ABILITY_DEFS[o.id]?.name ?? o.id;
            return (
              <span
                key={`${o.id}-${i}`}
                className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-indigo-800"
              >
                [{i}] {name} T{o.tier} ({o.kind})
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
