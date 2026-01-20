'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// 5 longer checkmate puzzles to preview for landing page (all verified from Lichess)
const PUZZLES = [
  {
    id: 1,
    name: "King Hunt",
    description: "8 moves - Spectacular queen chase forces king across the board",
    fen: "r1bqr1kR/pp1n2p1/2n1p1P1/2ppP1P1/3P1P2/P1P5/2P5/R1BQK3 b Q - 2 17",
    moves: ["g8h8", "d1h5", "h8g8", "h5h7", "g8f8", "h7h8", "f8e7", "h8g7"],
  },
  {
    id: 2,
    name: "Opera Mate",
    description: "6 moves - Classic back rank coordination with rooks",
    fen: "8/p2r2k1/3r3p/Q3p3/4PpP1/P1P2Pbp/1PB4R/5K2 w - - 5 40",
    moves: ["h2e2", "d6d1", "c2d1", "d7d1", "e2e1", "d1e1"],
  },
  {
    id: 3,
    name: "Back Rank Crush",
    description: "6 moves - Double rook sacrifice crashes through",
    fen: "2b4k/p7/1p5p/3rP1pN/2r5/4R3/P4PPP/3R2K1 w - - 0 30",
    moves: ["d1d5", "c4c1", "d5d1", "c1d1", "e3e1", "d1e1"],
  },
  {
    id: 4,
    name: "Queen & Rook Dance",
    description: "6 moves - Elegant queen and rook coordination",
    fen: "5q2/2pr2kp/2p1p1p1/8/8/6Q1/P5PP/5R1K w - - 0 32",
    moves: ["f1f8", "d7d1", "g3e1", "d1e1", "f8f1", "e1f1"],
  },
  {
    id: 5,
    name: "Heavy Piece Finale",
    description: "6 moves - Queen and bishop force the decisive breakthrough",
    fen: "6k1/5p1p/3r2p1/p7/1pPqPQ2/1P3B2/P5PP/5R1K w - - 3 26",
    moves: ["f1d1", "d4d1", "f3d1", "d6d1", "f4f1", "d1f1"],
  },
];

function AnimatedBoard({ puzzle, size }: { puzzle: typeof PUZZLES[0]; size: number }) {
  const [game, setGame] = useState(() => new Chess(puzzle.fen));
  const [moveIndex, setMoveIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [isCheckmate, setIsCheckmate] = useState(false);

  const resetPuzzle = useCallback(() => {
    setGame(new Chess(puzzle.fen));
    setMoveIndex(-1);
    setLastMove(null);
    setIsCheckmate(false);
  }, [puzzle.fen]);

  useEffect(() => {
    resetPuzzle();
  }, [puzzle.id, resetPuzzle]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (moveIndex < puzzle.moves.length - 1) {
        const nextIndex = moveIndex + 1;
        const move = puzzle.moves[nextIndex];
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);
        const promotion = move.length > 4 ? move[4] : undefined;

        try {
          const newGame = new Chess(game.fen());
          newGame.move({ from, to, promotion });
          setGame(newGame);
          setLastMove([from, to]);
          setMoveIndex(nextIndex);

          if (newGame.isCheckmate()) {
            setIsCheckmate(true);
          }
        } catch {
          console.error('Invalid move:', move);
          resetPuzzle();
        }
      } else {
        // Pause on final position, then restart
        setTimeout(resetPuzzle, 2500);
      }
    }, moveIndex === -1 ? 1200 : 800);

    return () => clearTimeout(timeout);
  }, [moveIndex, game, puzzle.moves, resetPuzzle]);

  const customSquareStyles = lastMove
    ? {
        [lastMove[0]]: { backgroundColor: 'rgba(88, 204, 2, 0.5)' },
        [lastMove[1]]: { backgroundColor: 'rgba(88, 204, 2, 0.5)' },
      }
    : {};

  return (
    <div style={{ width: size, height: size }} className="relative">
      <Chessboard
        options={{
          position: game.fen(),
          boardOrientation: 'white',
          squareStyles: customSquareStyles,
          boardStyle: { borderRadius: '8px' },
          darkSquareStyle: { backgroundColor: '#779952' },
          lightSquareStyle: { backgroundColor: '#edeed1' },
        }}
      />
      {isCheckmate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-red-600/90 text-white px-3 py-1.5 rounded-lg font-bold text-sm animate-pulse">
            CHECKMATE
          </div>
        </div>
      )}
    </div>
  );
}

export default function PuzzlePreview() {
  const [selected, setSelected] = useState(PUZZLES[0]);

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Landing Page Puzzle Preview</h1>
        <p className="text-gray-400 text-sm mb-6">Select a puzzle to preview the animation</p>

        {/* Main preview with neon border */}
        <div className="flex justify-center mb-6">
          <div
            className="p-1 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #00FFFF, #FF00FF, #FFFF00)',
              boxShadow: '0 0 30px rgba(0,255,255,0.3), 0 0 60px rgba(255,0,255,0.2)',
            }}
          >
            <div className="bg-[#131F24] rounded-lg p-1">
              <AnimatedBoard puzzle={selected} size={300} />
            </div>
          </div>
        </div>

        {/* Selected puzzle info */}
        <div className="bg-[#1A2C35] rounded-xl p-4 mb-6 text-center">
          <h2 className="text-lg font-bold text-[#58CC02]">{selected.name}</h2>
          <p className="text-gray-400 text-sm">{selected.description}</p>
        </div>

        {/* Puzzle selection grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PUZZLES.map((puzzle) => (
            <button
              key={puzzle.id}
              onClick={() => setSelected(puzzle)}
              className={`p-3 rounded-xl text-left transition-all ${
                selected.id === puzzle.id
                  ? 'bg-[#58CC02]/20 border-2 border-[#58CC02]'
                  : 'bg-[#1A2C35] border-2 border-transparent hover:border-gray-600'
              }`}
            >
              <div className="font-semibold text-sm">{puzzle.name}</div>
              <div className="text-gray-400 text-xs mt-1">{puzzle.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
