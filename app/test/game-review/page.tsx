'use client';

/**
 * /test/game-review — visual test bed for the past-game review UI.
 *
 * Top: a static gallery of every classification badge (lib/review/move-badges)
 * rendered on fake board squares — instantly verifiable, no engine needed.
 * Below: a hardcoded Italian Game trap line fed through the REAL pipeline
 * (useGameReview → Stockfish → GameReview), exactly like /review/[id] does
 * from the DB — book moves, sacrifices, and a rook-grab blunder included.
 *
 * Test page: container MUST be overflow-auto (body is overflow:hidden globally).
 */

import { useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import { useGameReview } from '@/hooks/useGameReview';
import { GameReview } from '@/components/shared/GameReview';
import { BADGE_SPECS, badgeSquareStyle } from '@/lib/review/move-badges';
import type { MoveClassification } from '@/lib/game-eval';
import type { ReviewMove } from '@/lib/review/review-core';

// Italian Game (Greco/Moller trap territory): book opening, a pawn grab, the
// greedy Bxa1, the Bxf7+ sacrifice — good spread of classifications.
const SAMPLE_SANS = [
  'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4',
  'cxd4', 'Bb4+', 'Nc3', 'Nxe4', 'O-O', 'Nxc3', 'bxc3', 'Bxc3', 'Qb3', 'Bxa1',
  'Bxf7+', 'Kf8', 'Bg5', 'Ne7', 'Ne5', 'Bxd4', 'Bg6', 'd5', 'Qf3+', 'Bf5',
];

function buildSampleMoves(): ReviewMove[] {
  const chess = new Chess();
  const moves: ReviewMove[] = [];
  for (let i = 0; i < SAMPLE_SANS.length; i++) {
    const mv = chess.move(SAMPLE_SANS[i]);
    if (!mv) break;
    moves.push({
      san: mv.san,
      from: mv.from,
      to: mv.to,
      fenAfter: chess.fen(),
      movedBy: i % 2 === 0 ? 'player' : 'rookie', // player is white
      moveNumber: i + 1,
    });
  }
  return moves;
}

const CLASSIFICATIONS = Object.keys(BADGE_SPECS) as MoveClassification[];

function BadgeGallery() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h2 className="text-xs font-black uppercase tracking-wide text-slate-500 mb-3">
        Badge spec — board squares
      </h2>
      <div className="flex flex-wrap gap-3">
        {CLASSIFICATIONS.map((cls, i) => (
          <div key={cls} className="flex flex-col items-center gap-1">
            <div
              className="w-16 h-16 rounded overflow-hidden"
              style={{
                backgroundColor: i % 2 === 0 ? '#ebecd0' : '#739552',
                position: 'relative',
              }}
            >
              <div className="w-full h-full" style={badgeSquareStyle(cls)} />
            </div>
            <span className="text-[10px] font-bold text-slate-600">{BADGE_SPECS[cls].label}</span>
          </div>
        ))}
      </div>
      <h2 className="text-xs font-black uppercase tracking-wide text-slate-500 mt-4 mb-2">
        Move-list pills
      </h2>
      <div className="flex flex-wrap gap-2">
        {CLASSIFICATIONS.map((cls) => (
          <span
            key={cls}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-black"
            style={{ backgroundColor: BADGE_SPECS[cls].circle, color: BADGE_SPECS[cls].text }}
          >
            {BADGE_SPECS[cls].glyph} {BADGE_SPECS[cls].label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TestGameReviewPage() {
  const moves = useMemo(buildSampleMoves, []);
  const review = useGameReview();
  const { start } = review;

  useEffect(() => {
    start({
      moves,
      playerColor: 'white',
      playerElo: 800,
      result: 'win',
      playerName: 'Tester',
    });
  }, [moves, start]);

  return (
    <div className="h-full overflow-auto bg-slate-100">
      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        <h1 className="text-lg font-black text-slate-800">Game Review test bed</h1>
        <BadgeGallery />
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 text-xs font-black uppercase tracking-wide text-slate-500">
            Live review — sample Italian Game ({moves.length} plies)
          </div>
          <div className="h-[760px]">
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
    </div>
  );
}
