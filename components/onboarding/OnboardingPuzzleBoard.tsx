'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import {
  playCorrectSound,
  playErrorSound,
  playMoveSound,
  playCaptureSound,
} from '@/lib/sounds';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';

// Epic diagnostic quips - every puzzle gets a banger
const DIAGNOSTIC_CORRECT_QUIPS = [
  "OK you're good.",
  "Wow. Chess much?",
  "That knight had a family!",
  "The humanity!",
  "The mates will continue until morale improves.",
  "You've done this before, haven't you?",
  "Suspicious. Very suspicious.",
  "Are you sure you need this test?",
  "Someone's been studying.",
  "Hold up. That was clean.",
  "Did you just... yeah, you did.",
  "My algorithms are impressed.",
  "OK Magnus, calm down.",
  "That was rude. I love it.",
  "Their therapist will hear about this.",
  "Absolutely clinical.",
  "Chess Twitter is gonna love this one.",
  "You made that look easy. Was it?",
  "Rated E for Everyone just got wrecked.",
  "Do you kiss your mother with that chess?",
  "Call an ambulance. But not for you.",
  "Stockfish is taking notes.",
  "That's going in the highlight reel.",
  "You didn't have to snap that hard.",
];

const DIAGNOSTIC_WRONG_QUIPS = [
  "Oof. But we're learning here.",
  "The board is a tricky place.",
  "Even GMs miss sometimes. Probably.",
  "That's what practice is for.",
  "Noted. Moving on.",
  "We don't talk about that one.",
  "The puzzle fights back sometimes.",
  "Interesting choice. Wrong, but interesting.",
  "That's the spirit! ...wrong spirit, but spirit.",
  "Your rating just did a little dip.",
  "The council has reviewed your move. Denied.",
  "Bold strategy. Didn't work though.",
];

function getDiagnosticQuip(correct: boolean, puzzleIndex: number): string {
  const quips = correct ? DIAGNOSTIC_CORRECT_QUIPS : DIAGNOSTIC_WRONG_QUIPS;
  // Use puzzle index to add some variety, but still random within session
  const seed = puzzleIndex + Math.floor(Math.random() * 1000);
  return quips[seed % quips.length];
}

export interface OnboardingPuzzle {
  puzzleId: string;
  fen: string;
  puzzleFen: string;
  moves: string;
  rating: number;
  themes: string[];
  setupMove: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  solution: string;
  solutionMoves: string[];
  playerColor: 'white' | 'black';
}

interface OnboardingPuzzleBoardProps {
  puzzle: OnboardingPuzzle;
  puzzleIndex: number;
  onResult: (correct: boolean) => void;
}

export function OnboardingPuzzleBoard({
  puzzle,
  puzzleIndex,
  onResult,
}: OnboardingPuzzleBoardProps) {
  const [currentFen, setCurrentFen] = useState<string>(puzzle.puzzleFen);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [hasReported, setHasReported] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Reset state when puzzle changes
  useEffect(() => {
    setCurrentFen(puzzle.puzzleFen);
    setMoveIndex(0);
    setMoveStatus('playing');
    setSelectedSquare(null);
    setHasReported(false);
    setFeedbackMessage('');
  }, [puzzle.puzzleId, puzzle.puzzleFen]);

  // Chess game for current position
  const game = useMemo(() => {
    try {
      return new Chess(currentFen);
    } catch {
      return null;
    }
  }, [currentFen]);

  // Square styles (last move highlight + selected piece)
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Show last move highlight at start
    if (moveIndex === 0 && puzzle) {
      styles[puzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[puzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    if (selectedSquare && game) {
      styles[selectedSquare] = { backgroundColor: 'rgba(100, 200, 255, 0.6)' };
      const moves = game.moves({ square: selectedSquare, verbose: true });
      for (const move of moves) {
        styles[move.to] = {
          background: move.captured
            ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
        };
      }
    }

    return styles;
  }, [selectedSquare, game, puzzle, moveIndex]);

  // Try to make a move
  const tryMove = useCallback((from: Square, to: Square) => {
    if (!game || !puzzle || moveStatus !== 'playing') return false;

    if (moveIndex >= puzzle.solutionMoves.length) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedMove = puzzle.solutionMoves[moveIndex];

      if (move.san === expectedMove) {
        // Correct move
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);

        // Play appropriate sound
        if (move.captured) {
          playCaptureSound();
        } else {
          playMoveSound();
        }

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        if (nextMoveIndex >= puzzle.solutionMoves.length) {
          // Puzzle complete!
          setMoveStatus('correct');
          setFeedbackMessage(getDiagnosticQuip(true, puzzleIndex));
          playCorrectSound(puzzleIndex);
          return true;
        }

        // Auto-play opponent's response
        setTimeout(() => {
          const opponentGame = new Chess(gameCopy.fen());
          const opponentMove = puzzle.solutionMoves[nextMoveIndex];
          try {
            const oppMove = opponentGame.move(opponentMove);
            setCurrentFen(opponentGame.fen());
            setMoveIndex(nextMoveIndex + 1);

            // Play sound for opponent
            if (oppMove && oppMove.captured) {
              playCaptureSound();
            } else {
              playMoveSound();
            }

            if (nextMoveIndex + 1 >= puzzle.solutionMoves.length) {
              setMoveStatus('correct');
              setFeedbackMessage(getDiagnosticQuip(true, puzzleIndex));
              playCorrectSound(puzzleIndex);
            }
          } catch {
            setMoveStatus('correct');
            setFeedbackMessage(getDiagnosticQuip(true, puzzleIndex));
            playCorrectSound(puzzleIndex);
          }
        }, 400);

        return true;
      } else {
        // Wrong move - single attempt, mark as wrong
        setMoveStatus('wrong');
        setFeedbackMessage(getDiagnosticQuip(false, puzzleIndex));
        setSelectedSquare(null);
        playErrorSound();
        return false;
      }
    } catch {
      return false;
    }
  }, [game, puzzle, moveIndex, moveStatus, puzzleIndex]);

  // Handle square click
  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!game || moveStatus !== 'playing') return;
      const clickedSquare = square as Square;

      if (!selectedSquare) {
        const piece = game.get(clickedSquare);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(clickedSquare);
        }
      } else if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
      } else {
        const legalMoves = game.moves({ square: selectedSquare, verbose: true });
        const isLegalMove = legalMoves.some(m => m.to === clickedSquare);

        if (isLegalMove) {
          tryMove(selectedSquare, clickedSquare);
        } else {
          const piece = game.get(clickedSquare);
          if (piece && piece.color === game.turn()) {
            setSelectedSquare(clickedSquare);
          } else {
            setSelectedSquare(null);
          }
        }
      }
    },
    [game, selectedSquare, moveStatus, tryMove]
  );

  // Handle continue
  const handleContinue = useCallback(() => {
    if (hasReported) return;
    setHasReported(true);
    onResult(moveStatus === 'correct');
  }, [moveStatus, onResult, hasReported]);

  return (
    <div className="flex flex-col">
      {/* Turn indicator */}
      <div className="text-center mb-2">
        <span className={`text-lg font-bold ${
          puzzle.playerColor === 'white' ? 'text-white' : 'text-gray-300'
        }`}>
          {puzzle.playerColor === 'white' ? 'White' : 'Black'} to move
        </span>
      </div>

      {/* Chessboard */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <Chessboard
          options={{
            position: currentFen,
            boardOrientation: puzzle.playerColor,
            onSquareClick: onSquareClick,
            squareStyles: squareStyles,
            boardStyle: {
              borderRadius: '8px 8px 0 0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            },
            darkSquareStyle: { backgroundColor: '#779952' },
            lightSquareStyle: { backgroundColor: '#edeed1' },
          }}
        />
      </div>

      {/* Result popup - directly below board */}
      {moveStatus === 'correct' && (
        <PuzzleResultPopup
          type="correct"
          message={feedbackMessage}
          onContinue={handleContinue}
        />
      )}

      {moveStatus === 'wrong' && (
        <PuzzleResultPopup
          type="incorrect"
          message={feedbackMessage}
          onContinue={handleContinue}
        />
      )}

      {/* Status text when playing */}
      {moveStatus === 'playing' && (
        <div className="text-center text-gray-400 mt-3">
          Find the best move
        </div>
      )}
    </div>
  );
}
