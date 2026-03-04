'use client';

import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { playCorrectSound, playErrorSound, playMoveSound } from '@/lib/sounds';
import { parseUciMove } from '@/lib/puzzle-utils';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import type { SrsCard } from '@/lib/repertoire/types';

interface LineDrillBoardProps {
  cards: SrsCard[];
  onReview: (cardId: string, correct: boolean) => void;
  onSessionComplete: () => void;
}

type DrillState = 'waiting' | 'correct' | 'wrong';

export function LineDrillBoard({ cards, onReview, onSessionComplete }: LineDrillBoardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<DrillState>('waiting');
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const card = cards[currentIndex];
  const chess = new Chess(card?.fen || undefined);
  const boardOrientation = card?.color || 'white';

  useAudioWarmup();

  const handleDrop = useCallback(
    ({ sourceSquare, targetSquare }: { piece: unknown; sourceSquare: string; targetSquare: string | null }) => {
      if (!card || state !== 'waiting' || !targetSquare) return false;

      // Check if this move matches the correct answer
      const expectedUci = card.correctMoveUci;
      const attemptUci = sourceSquare + targetSquare;

      // Try to make the move to validate it's legal
      const move = chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      if (!move) return false;

      playMoveSound();

      // Check if correct (compare UCI, handle promotion)
      const isCorrect =
        attemptUci === expectedUci.slice(0, 4) ||
        move.lan === expectedUci;

      if (isCorrect) {
        setState('correct');
        setCorrectCount((c) => c + 1);
        playCorrectSound(correctCount, 250);
        onReview(card.id, true);
      } else {
        setState('wrong');
        playErrorSound();
        onReview(card.id, false);
      }

      setReviewedCount((c) => c + 1);
      return true;
    },
    [card, state, chess, correctCount, onReview]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= cards.length) {
      onSessionComplete();
      return;
    }
    setCurrentIndex((i) => i + 1);
    setState('waiting');
  }, [currentIndex, cards.length, onSessionComplete]);

  if (!card) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-chess-text-muted">No cards to review</p>
      </div>
    );
  }

  // Get the correct move info for showing after answer
  const correctMoveInfo = parseUciMove(card.correctMoveUci);

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-chess-green rounded-full transition-all"
            style={{ width: `${(reviewedCount / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-chess-text-faint font-medium">
          {reviewedCount}/{cards.length}
        </span>
      </div>

      {/* Line name */}
      {card.lineName && (
        <p className="text-xs text-chess-text-muted font-medium text-center">{card.lineName}</p>
      )}

      {/* Instruction */}
      <p className="text-sm font-bold text-chess-text text-center">
        {state === 'waiting' && `Play the best move as ${card.color}`}
        {state === 'correct' && 'Correct!'}
        {state === 'wrong' && `The best move was ${card.correctMoveSan}`}
      </p>

      {/* Board */}
      <div className="flex justify-center">
        <ChessPathBoard
          options={{
            position: card.fen,
            boardOrientation: boardOrientation,
            onPieceDrop: state === 'waiting' ? handleDrop : undefined,
            allowDragging: state === 'waiting',
            arrows: state === 'wrong'
              ? [{ startSquare: correctMoveInfo.from, endSquare: correctMoveInfo.to, color: 'rgba(88, 204, 2, 0.7)' }]
              : [],
          }}
        />
      </div>

      {/* Feedback + next */}
      {state !== 'waiting' && (
        <div className="space-y-2">
          <div
            className={`rounded-xl px-4 py-3 text-center text-sm font-bold ${
              state === 'correct'
                ? 'bg-chess-correct-bg text-chess-green'
                : 'bg-chess-wrong-bg text-chess-red'
            }`}
          >
            {state === 'correct' ? 'Nice! Card advances to next level.' : 'Card reset to level 1. You\'ll see it again soon.'}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 bg-chess-green text-white font-bold rounded-xl text-sm transition-all hover:bg-chess-green-dark shadow-[0_3px_0_0_var(--color-chess-green-dark)]"
          >
            {currentIndex + 1 >= cards.length ? 'Finish Session' : 'Next Card'}
          </button>
        </div>
      )}
    </div>
  );
}
