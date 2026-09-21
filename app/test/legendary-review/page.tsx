'use client';

/**
 * /test/legendary-review — GameReview fed a FAKE analysis (no engine) with two
 * player Legendary moves (plies 9 and 21) plus one Rookie Legendary (ply 14)
 * that must NOT count. Checks: gold badge, the gold jump chip (cycles 1/2 ->
 * 2/2), gold beams on the eval graph, the one-shot gold square pulse.
 *
 * Test page: container MUST be overflow-auto (body is overflow:hidden globally).
 */

import { useMemo } from 'react';
import { Chess } from 'chess.js';
import { GameReview } from '@/components/shared/GameReview';
import type { GameReviewData } from '@/hooks/useGameReview';
import type { GameAnalysis, MoveClassification, MoveEvaluation, PositionEval } from '@/lib/game-eval';
import type { ReviewMove } from '@/lib/review/review-core';

const SANS = [
  'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4',
  'cxd4', 'Bb4+', 'Nc3', 'Nxe4', 'O-O', 'Nxc3', 'bxc3', 'Bxc3', 'Qb3', 'Bxa1',
  'Bxf7+', 'Kf8', 'Bg5', 'Ne7', 'Ne5', 'Bxd4', 'Bg6', 'd5', 'Qf3+', 'Bf5',
];

// Index = 0-based ply. Player is white (even plies).
const GRADES: Record<number, MoveClassification> = {
  0: 'book', 1: 'book', 2: 'book', 3: 'book', 4: 'book', 5: 'book',
  24: 'brilliant',  // 13. Ne5 — player Legendary #1 (after 11. Bxf7+ in move order)
  13: 'brilliant',  // 7... Nxe4 — ROOKIE Legendary, must not count
  14: 'mistake',
  18: 'inaccuracy',
  20: 'brilliant',  // 11. Bxf7+ — player Legendary #2
  25: 'blunder',
};

function buildFake(): { moves: ReviewMove[]; review: GameReviewData } {
  const chess = new Chess();
  const moves: ReviewMove[] = [];
  const evals: PositionEval[] = [{ cp: 20, mate: null, bestMove: null, bestLine: [], depth: 12 }];
  const evs: MoveEvaluation[] = [];
  SANS.forEach((san, i) => {
    const mv = chess.move(san);
    const movedBy = i % 2 === 0 ? 'player' : 'rookie';
    moves.push({ san: mv.san, from: mv.from, to: mv.to, fenAfter: chess.fen(), movedBy, moveNumber: i + 1 });
    const cp = Math.round(Math.sin(i / 3) * 180 + i * 12);
    const pe: PositionEval = { cp, mate: null, bestMove: null, bestLine: [], depth: 12 };
    evals.push(pe);
    evs.push({
      moveNumber: i + 1, san: mv.san, movedBy,
      evalBefore: evals[i], evalAfter: pe,
      winPercentBefore: 50, winPercentAfter: 50, winPercentDelta: 0,
      classification: GRADES[i] ?? 'good', accuracy: 90, bestMoveSan: null,
    });
  });
  const analysis: GameAnalysis = {
    moves: evs, playerAccuracy: 88, rookieAccuracy: 80, playerMoveCount: 15,
    blunders: 0, mistakes: 1, inaccuracies: 1, brilliantMoves: 2, greatMoves: 0,
  };
  return {
    moves,
    review: {
      analysis, isAnalyzing: false, progress: 100, keyMoments: [], positionEvals: evals,
      coachReady: true, coachMoves: {}, coachSummary: 'Two Legendary moves in this one. Find them.',
      coachTakeaway: null, coachLocked: false,
    },
  };
}

export default function TestLegendaryReviewPage() {
  const { moves, review } = useMemo(buildFake, []);
  return (
    <div className="h-full overflow-auto bg-slate-100">
      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        <h1 className="text-lg font-black text-slate-800">Legendary review test</h1>
        <p className="text-xs text-slate-500">
          Player Legendary on 11. Bxf7+ and 13. Ne5. Rookie&apos;s 7... Nxe4 is also graded Legendary and must NOT show in the chip.
        </p>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[820px]">
          <GameReview
            moves={moves}
            playerColor="white"
            playerName="Tester"
            review={review}
            onExit={() => window.location.reload()}
            exitLabel="Restart test"
          />
        </div>
      </div>
    </div>
  );
}
