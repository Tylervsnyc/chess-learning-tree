'use client';

import { useMemo, useState } from 'react';
import { ActivityComplete } from '@/components/shared/ActivityComplete';
import { chessPathSessionSeries, type SessionAttempt } from '@/lib/elo/chess-path-elo';
import { warmupAudio } from '@/lib/sounds';

// A first-session visitor solving their first lesson (6 puzzles, missed one).
function sessionAttempts(): SessionAttempt[] {
  const base = Date.now() - 1000 * 60 * 10; // started ~10 min ago
  const data: [number, boolean][] = [
    [350, true], [430, true], [500, true], [470, false], [560, true], [640, true],
  ];
  return data.map(([rating, correct], i) => ({ rating, correct, timestamp: base + i * 90_000 }));
}

export default function EloSignupTest() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);
  const points = useMemo(() => chessPathSessionSeries(sessionAttempts()), []);

  const play = () => {
    warmupAudio();
    setKey((k) => k + 1);
    setOpen(true);
  };

  return (
    <div className="relative min-h-full overflow-auto bg-[#E8F4FB] px-4 py-10">
      <div className="mx-auto max-w-sm text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-chess-blue">
          Logged-out signup capture
        </p>
        <h1 className="mt-1 text-xl font-black text-chess-text">Within-session climb + soft signup</h1>
        <p className="mt-2 text-sm text-chess-text-muted">
          What a brand-new (not-signed-in) visitor sees after their first lesson: the line steps up
          per puzzle solved, and a soft &ldquo;Save your rating&rdquo; ask (they can keep playing).
        </p>
        <button
          onClick={play}
          className="mt-5 w-full rounded-2xl bg-chess-blue py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_var(--color-chess-blue-shadow)] active:translate-y-0.5"
        >
          ▶ Show the popup
        </button>
      </div>

      {open && (
        <ActivityComplete
          key={key}
          source="path"
          mode="terminal"
          correctCount={5}
          totalCount={6}
          activityName="Checkmate in 1"
          playerName="friend"
          debugAnon
          debugEloPoints={points}
          shareConfig={{
            shareUrl: 'https://chesspath.app/test',
            ogEndpoint: '/api/og/lesson',
            ogParams: { score: '5/6', lesson: 'Checkmate in 1', level: '1' },
            source: 'lesson',
            title: 'Chess Path',
            text: 'I completed a lesson on Chess Path!',
          }}
          onContinue={() => setOpen(false)}
        />
      )}
    </div>
  );
}
