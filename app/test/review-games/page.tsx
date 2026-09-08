'use client';

/**
 * The profile's "Review Your Games" section, standalone.
 *
 * The real one only renders for a signed-in user, which makes it invisible in
 * a logged-out browser — so this page injects Tyler's actual last 8 games as
 * rows (pulled from game_sessions) and exercises the states that are otherwise
 * hard to reach: loading, empty, and the "Show all" expansion.
 */

import { useState } from 'react';
import { ReviewGames, type RecentGame } from '@/components/profile/ReviewGames';

const GAMES: RecentGame[] = [
  { id: '736a93c5-c564-454a-9355-c7e4fe7e4472', startedAt: '2026-09-06T17:56:25.043+00:00', endedAt: '2026-09-06T17:59:42.228+00:00', result: 'loss', totalMoves: 58, brilliantMoves: 0, greatMoves: 0 },
  { id: 'b7954eae-d056-4306-b031-e19a63240685', startedAt: '2026-09-05T14:23:45.353+00:00', endedAt: '2026-09-05T14:27:24.944+00:00', result: 'loss', totalMoves: 58, brilliantMoves: 1, greatMoves: 0 },
  { id: '0b5a6462-c604-48f7-9aa0-2a7ced640f8f', startedAt: '2026-09-04T21:06:42.22+00:00', endedAt: '2026-09-04T21:09:03.322+00:00', result: 'loss', totalMoves: 54, brilliantMoves: 0, greatMoves: 0 },
  { id: '8af21e0e-9c5e-4174-91b4-7e889cfe345f', startedAt: '2026-09-04T17:16:48.401+00:00', endedAt: '2026-09-04T17:17:57.956+00:00', result: 'win', totalMoves: 37, brilliantMoves: 0, greatMoves: 0 },
  { id: 'd76948d6-6c64-4343-b7ba-a356aa57a886', startedAt: '2026-09-04T16:18:48.464+00:00', endedAt: '2026-09-04T16:21:59.33+00:00', result: 'win', totalMoves: 75, brilliantMoves: 0, greatMoves: 2 },
  { id: '71f9a33c-8060-444e-92c4-a836d0f38603', startedAt: '2026-09-02T17:40:50.88+00:00', endedAt: '2026-09-02T17:47:12.000+00:00', result: 'win', totalMoves: 95, brilliantMoves: 2, greatMoves: 2 },
  { id: 'fafcae8a-caba-40a0-8d2b-986568c021c4', startedAt: '2026-09-04T15:55:34.37+00:00', endedAt: '2026-09-04T15:59:02.105+00:00', result: 'loss', totalMoves: 74, brilliantMoves: 0, greatMoves: 2 },
  { id: '292db20a-3452-4bef-877f-53166187137e', startedAt: '2026-09-03T18:08:56.949+00:00', endedAt: '2026-09-03T18:09:52.433+00:00', result: 'loss', totalMoves: 34, brilliantMoves: 0, greatMoves: 0 },
];

type State = 'real' | 'empty' | 'loading';

export default function ReviewGamesTestPage() {
  const [state, setState] = useState<State>('real');

  return (
    <div className="h-full overflow-auto bg-chess-page px-5 py-6">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-black text-chess-text">Review Your Games</h1>
        <p className="mt-1 text-sm text-chess-text-muted">
          The profile section, with your real games. Sits above Lifetime Stats now,
          loads on mount instead of hiding behind a dropdown.
        </p>

        <div className="mt-4 flex gap-2">
          {(['real', 'empty', 'loading'] as State[]).map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className="flex-1 rounded-xl px-3 py-2 text-xs font-black capitalize transition-colors"
              style={{
                backgroundColor: state === s ? 'var(--color-chess-blue)' : 'var(--color-chess-surface)',
                color: state === s ? '#ffffff' : 'var(--color-chess-text-muted)',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* Remounted per state so the section starts fresh each time. */}
          <ReviewGames
            key={state}
            debugGames={state === 'real' ? GAMES : state === 'empty' ? [] : undefined}
          />
        </div>
      </div>
    </div>
  );
}
