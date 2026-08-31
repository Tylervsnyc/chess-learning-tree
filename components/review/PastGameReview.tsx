'use client';

/**
 * PastGameReview — full review of a stored past game.
 *
 * Fetches the game (GET /api/games/[id]), replays session_moves into the
 * shared review pipeline (useGameReview → Stockfish evals + move
 * classification + Claude commentary) and renders the ONE shared review UI
 * (components/shared/GameReview) with classification badges.
 *
 * Mounted by TWO thin routes that must stay thin:
 *   /review/[id]  — web deep link
 *   /review?id=   — the same page as a query param, because the iOS app is a
 *                   static export and cannot ship an unbounded dynamic route.
 * Profile links use the query form so one URL works on both surfaces.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGameReview } from '@/hooks/useGameReview';
import { GameReview } from '@/components/shared/GameReview';
import type { ReviewMove } from '@/lib/review/review-core';
import { getLevelElo } from '@/lib/rookie-levels';
import { BreathingRook } from '@/components/ui/BreathingRook';

interface GameSessionInfo {
  id: string;
  result: 'win' | 'loss' | 'draw' | null;
  playerColor: 'white' | 'black' | null;
  rookieDifficulty: number | null;
}

type LoadState = 'loading' | 'ready' | 'not-found' | 'too-short' | 'error';

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-16 flex flex-col items-center text-center gap-4">
        <h1 className="text-xl font-black text-chess-text">{title}</h1>
        <p className="text-sm text-chess-text-muted">{body}</p>
        <Link
          href="/profile"
          className="min-h-[44px] px-6 inline-flex items-center rounded-xl bg-chess-green text-white font-bold text-sm"
        >
          Back to profile
        </Link>
      </div>
    </div>
  );
}

export function PastGameReview({ gameId }: { gameId: string | null }) {
  const router = useRouter();
  const review = useGameReview();
  const { start } = review;

  const [state, setState] = useState<LoadState>('loading');
  const [session, setSession] = useState<GameSessionInfo | null>(null);
  const [moves, setMoves] = useState<ReviewMove[]>([]);

  useEffect(() => {
    if (!gameId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/games/${gameId}`);
        if (cancelled) return;
        if (res.status === 404 || res.status === 401) {
          setState('not-found');
          return;
        }
        if (!res.ok) {
          setState('error');
          return;
        }
        const data = await res.json();
        // Truncate at the first malformed row instead of filtering it out:
        // dropping a middle move shifts every later index — parity flips and
        // fenBefore chains break, so the rest of the game gets misgraded.
        // The prefix up to the bad row is still a coherent, reviewable game.
        const reviewMoves: ReviewMove[] = [];
        for (const [i, m] of ((data.moves ?? []) as Record<string, unknown>[]).entries()) {
          if (!(m.san && m.from && m.to && m.fenAfter)) break;
          reviewMoves.push({
            san: m.san as string,
            from: m.from as string,
            to: m.to as string,
            fenAfter: m.fenAfter as string,
            movedBy: (m.movedBy === 'rookie' ? 'rookie' : 'player') as 'player' | 'rookie',
            moveNumber: (m.moveNumber as number) ?? i + 1,
          });
        }
        if (reviewMoves.length < 2) {
          setState('too-short');
          return;
        }
        setSession(data.session);
        setMoves(reviewMoves);
        setState('ready');
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gameId]);

  // Kick off analysis once the game is loaded. start() is idempotent.
  useEffect(() => {
    if (state !== 'ready' || !session || moves.length === 0) return;
    start({
      moves,
      playerColor: session.playerColor === 'black' ? 'black' : 'white',
      playerElo: session.rookieDifficulty ? getLevelElo(session.rookieDifficulty) : 800,
      result: session.result ?? 'draw',
    });
  }, [state, session, moves, start]);

  if (!gameId) {
    return <Notice title="No game selected" body="Open a game from the Recent Games list on your profile." />;
  }
  if (state === 'loading') {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-16 flex flex-col items-center gap-4">
          <BreathingRook size="sm" animation="think" />
          <p className="text-sm text-chess-text-muted font-medium">Loading your game...</p>
        </div>
      </div>
    );
  }
  if (state === 'not-found') {
    return <Notice title="Game not found" body="This game does not exist, or it belongs to a different account." />;
  }
  if (state === 'too-short') {
    return <Notice title="Nothing to review" body="This game ended before there were enough moves to analyze." />;
  }
  if (state === 'error') {
    return <Notice title="Something went wrong" body="We could not load this game. Please try again." />;
  }

  return (
    <GameReview
      moves={moves}
      playerColor={session?.playerColor === 'black' ? 'black' : 'white'}
      review={review}
      onExit={() => router.push('/profile')}
      exitLabel="Back to profile"
    />
  );
}
