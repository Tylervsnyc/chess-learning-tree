'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { Puzzle } from '@/types/curriculum';

interface PuzzleBoardProps {
  puzzle: Puzzle;
  onCorrectMove: () => void;
  onWrongMove: () => void;
}

export function PuzzleBoard({ puzzle, onCorrectMove, onWrongMove }: PuzzleBoardProps) {
  const [game, setGame] = useState(() => new Chess(puzzle.fen));
  const [moveIndex, setMoveIndex] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Get legal moves for the selected piece
  const legalMoves = useMemo(() => {
    if (!selectedSquare) return [];
    return game.moves({ square: selectedSquare, verbose: true });
  }, [game, selectedSquare]);

  // Create square styles for highlighting
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      };
    }

    // Highlight legal move squares with circles
    for (const move of legalMoves) {
      const isCapture = move.captured;
      styles[move.to] = {
        background: isCapture
          ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
          : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
      };
    }

    return styles;
  }, [selectedSquare, legalMoves]);

  // Handle making a move (shared by click and drag)
  const makeMove = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      // Try to make the move
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      });

      // Invalid move
      if (!move) return false;

      // Check if this matches the expected solution
      const expectedMove = puzzle.solution[moveIndex];
      const actualMove = `${sourceSquare}${targetSquare}`;

      if (actualMove === expectedMove) {
        // Correct move
        setGame(new Chess(game.fen()));
        setSelectedSquare(null);
        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        // Check if puzzle is complete
        if (nextMoveIndex >= puzzle.solution.length) {
          setTimeout(onCorrectMove, 300);
        }
        return true;
      } else {
        // Wrong move - reset to puzzle start
        setTimeout(() => {
          setGame(new Chess(puzzle.fen));
          setMoveIndex(0);
          setSelectedSquare(null);
          onWrongMove();
        }, 300);
        return true;
      }
    },
    [game, puzzle, moveIndex, onCorrectMove, onWrongMove]
  );

  // Handle drag and drop
  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: { piece: unknown; sourceSquare: string; targetSquare: string | null }): boolean => {
      if (!targetSquare) return false;
      setSelectedSquare(null);
      return makeMove(sourceSquare, targetSquare);
    },
    [makeMove]
  );

  // Handle square click
  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      const clickedSquare = square as Square;

      // If no square selected, select this one if it has a piece of the right color
      if (!selectedSquare) {
        const piece = game.get(clickedSquare);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(clickedSquare);
        }
        return;
      }

      // If clicking the same square, deselect
      if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
        return;
      }

      // If clicking a legal move square, make the move
      const isLegalMove = legalMoves.some(m => m.to === clickedSquare);
      if (isLegalMove) {
        makeMove(selectedSquare, clickedSquare);
        return;
      }

      // If clicking another piece of the same color, select it instead
      const piece = game.get(clickedSquare);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(clickedSquare);
        return;
      }

      // Otherwise, deselect
      setSelectedSquare(null);
    },
    [game, selectedSquare, legalMoves, makeMove]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <Chessboard
        options={{
          position: game.fen(),
          onPieceDrop: onDrop,
          onSquareClick: onSquareClick,
          squareStyles: squareStyles,
          boardOrientation: puzzle.playerColor,
          boardStyle: {
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          },
          darkSquareStyle: { backgroundColor: '#779952' },
          lightSquareStyle: { backgroundColor: '#edeed1' },
        }}
      />
    </div>
  );
}
