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

  // Reset state when puzzle changes
  useEffect(() => {
    setCurrentFen(puzzle.puzzleFen);
    setMoveIndex(0);
    setMoveStatus('playing');
    setSelectedSquare(null);
    setHasReported(false);
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
              playCorrectSound(puzzleIndex);
            }
          } catch {
            setMoveStatus('correct');
            playCorrectSound(puzzleIndex);
          }
        }, 400);

        return true;
      } else {
        // Wrong move - single attempt, mark as wrong
        setMoveStatus('wrong');
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
    <div className="space-y-4">
      {/* Turn indicator */}
      <div className="text-center">
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
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            },
            darkSquareStyle: { backgroundColor: '#779952' },
            lightSquareStyle: { backgroundColor: '#edeed1' },
          }}
        />
      </div>

      {/* Feedback area */}
      <div className="mt-4">
        {moveStatus === 'playing' && (
          <div className="text-center text-gray-400">
            Find the best move
          </div>
        )}

        {moveStatus === 'correct' && (
          <div className="space-y-3">
            <div className="p-3 bg-green-600/20 border border-green-500 rounded-xl text-center">
              <div className="text-xl mb-1">✓</div>
              <div className="text-green-400 font-bold">Correct!</div>
            </div>
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-[#58CC02] text-white font-bold rounded-xl shadow-[0_4px_0_#3d8c01] hover:shadow-[0_2px_0_#3d8c01] hover:translate-y-[2px] transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {moveStatus === 'wrong' && (
          <div className="space-y-3">
            <div className="p-3 bg-red-600/20 border border-red-500 rounded-xl text-center">
              <div className="text-xl mb-1">✗</div>
              <div className="text-red-400 font-bold">Not quite</div>
            </div>
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-[#1A2C35] text-white font-bold rounded-xl border border-white/20 hover:bg-[#2A3C45] transition-all"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
