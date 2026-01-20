'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// Puzzles for each level
const PUZZLES = {
  beginner: {
    // Simple fork - Scholar's mate threat
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    moves: ['h5f7'],
    orientation: 'white' as const,
  },
  intermediate: {
    // Opera Game finale - Morphy's brilliant finish (9 moves!)
    // Rxd7! Rxd7, Rd1 Qe6, Bxd7+ Nxd7, Qb8+!! Nxb8, Rd8#
    fen: '3rkb1r/pp1nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R w k - 0 1',
    moves: ['d1d7', 'd8d7', 'h1d1', 'e7e6', 'b5d7', 'f6d7', 'b3b8', 'd7b8', 'd1d8'],
    orientation: 'white' as const,
  },
  advanced: {
    // Crushing attack with rook sacrifices
    fen: 'r4nk1/p4q2/2p1p1pQ/2ppP3/r7/6R1/PPP4P/6RK b - - 1 26',
    moves: ['a4f4', 'g3g6', 'f8g6', 'g1g6', 'f7g6', 'h6g6'],
    orientation: 'black' as const,
  },
};

type PuzzleKey = keyof typeof PUZZLES;

function AnimatedBoard({ puzzleKey, size }: { puzzleKey: PuzzleKey; size: number }) {
  const puzzle = PUZZLES[puzzleKey];
  const [game, setGame] = useState(() => new Chess(puzzle.fen));
  const [moveIndex, setMoveIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [currentKey, setCurrentKey] = useState(puzzleKey);

  const resetPuzzle = useCallback(() => {
    setGame(new Chess(puzzle.fen));
    setMoveIndex(-1);
    setLastMove(null);
  }, [puzzle.fen]);

  // Smooth transition when puzzle changes
  useEffect(() => {
    if (puzzleKey !== currentKey) {
      setOpacity(0);
      const timeout = setTimeout(() => {
        setCurrentKey(puzzleKey);
        resetPuzzle();
        setOpacity(1);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [puzzleKey, currentKey, resetPuzzle]);

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
        } catch {
          resetPuzzle();
        }
      } else {
        setTimeout(resetPuzzle, 2000);
      }
    }, moveIndex === -1 ? 1200 : 800);

    return () => clearTimeout(timeout);
  }, [moveIndex, game, puzzle.moves, resetPuzzle]);

  const customSquareStyles = lastMove ? {
    [lastMove[0]]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    [lastMove[1]]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
  } : {};

  return (
    <div
      style={{
        width: size,
        height: size,
        opacity,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <Chessboard
        options={{
          position: game.fen(),
          boardOrientation: puzzle.orientation,
          squareStyles: customSquareStyles,
          boardStyle: {
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          },
          darkSquareStyle: { backgroundColor: '#779952' },
          lightSquareStyle: { backgroundColor: '#edeed1' },
        }}
      />
    </div>
  );
}

export default function LandingPreview() {
  const [selectedLevel, setSelectedLevel] = useState<PuzzleKey>('intermediate');

  const levels: { key: PuzzleKey; label: string; color: string }[] = [
    { key: 'beginner', label: '400-800', color: '#00FFFF' },
    { key: 'intermediate', label: '800-1200', color: '#FF00FF' },
    { key: 'advanced', label: '1200-1600', color: '#FFFF00' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Admin Controls */}
      <div className="bg-[#111] border-b border-gray-800 p-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-white font-medium text-sm">Landing Preview</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#58CC02]/20 text-[#58CC02]">MVP</span>
          </div>
          <span className="text-gray-500 text-xs">Neon Arcade Theme</span>
        </div>
      </div>

      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Neon glow effects */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-64 h-64 bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Landing Page Content */}
      <div className="relative z-10 min-h-[calc(100vh-49px)] flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-black mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
                  THE CHESS PATH
                </span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-xs mx-auto">
                Curated puzzles to help you improve in the shortest time possible
              </p>
            </div>

            {/* Credibility badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700 bg-gray-900/50">
                <span className="text-cyan-400 text-xs">&#9733;</span>
                <span className="text-gray-300 text-xs">
                  From the founder of <span className="text-white font-medium">Storytime Chess</span>
                </span>
              </div>
            </div>

            {/* Board with neon border */}
            <div className="flex justify-center mb-6">
              <div
                className="p-1 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #00FFFF, #FF00FF, #FFFF00)',
                  boxShadow: '0 0 30px rgba(0,255,255,0.3), 0 0 60px rgba(255,0,255,0.2)'
                }}
              >
                <div className="bg-[#0a0a0a] rounded-lg p-1">
                  <AnimatedBoard puzzleKey={selectedLevel} size={260} />
                </div>
              </div>
            </div>

            {/* ELO level buttons - Solid Fill style */}
            <div className="flex gap-2 mb-6">
              {levels.map((level) => {
                const isSelected = selectedLevel === level.key;
                return (
                  <button
                    key={level.key}
                    onClick={() => setSelectedLevel(level.key)}
                    className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                      isSelected ? 'scale-105' : 'opacity-60 hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: level.color,
                      color: '#000',
                      boxShadow: isSelected ? `0 0 25px ${level.color}60` : `0 0 15px ${level.color}30`,
                    }}
                  >
                    {level.label}
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <Link
              href="/auth/signup"
              className="block w-full py-3.5 text-center font-bold text-base rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: '#58CC02',
                color: '#000',
                boxShadow: '0 0 30px rgba(88,204,2,0.4)',
              }}
            >
              Begin Your Training
            </Link>

            <Link
              href="/auth/login"
              className="block w-full py-3 mt-3 text-center text-gray-500 font-medium text-sm hover:text-white transition-colors"
            >
              Sign in
            </Link>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-6 pt-4 border-t border-gray-800">
              {[
                { value: '6', label: 'Levels' },
                { value: '25+', label: 'Lessons' },
                { value: 'Free', label: 'To Start' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-white font-bold">{stat.value}</div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
