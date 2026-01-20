'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// Real puzzle: crushing attack with rook sacrifices
const PUZZLE = {
  fen: 'r4nk1/p4q2/2p1p1pQ/2ppP3/r7/6R1/PPP4P/6RK b - - 1 26',
  moves: ['a4f4', 'g3g6', 'f8g6', 'g1g6', 'f7g6', 'h6g6'],
};

function AnimatedBoard({ size }: { size: number }) {
  const [game, setGame] = useState(() => new Chess(PUZZLE.fen));
  const [moveIndex, setMoveIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);

  const resetPuzzle = useCallback(() => {
    setGame(new Chess(PUZZLE.fen));
    setMoveIndex(-1);
    setLastMove(null);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (moveIndex < PUZZLE.moves.length - 1) {
        const nextIndex = moveIndex + 1;
        const move = PUZZLE.moves[nextIndex];
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
        setTimeout(resetPuzzle, 3000);
      }
    }, moveIndex === -1 ? 2000 : 1200);

    return () => clearTimeout(timeout);
  }, [moveIndex, game, resetPuzzle]);

  const customSquareStyles = lastMove ? {
    [lastMove[0]]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    [lastMove[1]]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
  } : {};

  return (
    <div style={{ width: size, height: size }}>
      <Chessboard
        options={{
          position: game.fen(),
          boardOrientation: 'black',
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

// Design 1: Minimal with thin progress line
function Design1() {
  return (
    <MobileContainer>
      <div className="min-h-[calc(100vh-56px)] flex">
        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <h1 className="text-3xl font-bold text-white mb-1">The Chess Path</h1>
          <p className="text-gray-400 text-sm mb-8">The shortest path to improvement</p>
          <AnimatedBoard size={240} />
          <Link
            href="/auth/signup"
            className="mt-10 w-full max-w-[240px] py-4 rounded-xl text-white font-semibold text-center"
            style={{ background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)' }}
          >
            Begin Learning
          </Link>
          <Link href="/auth/login" className="mt-3 text-gray-500 text-sm">
            Sign in
          </Link>
        </div>

        {/* Thin progress line */}
        <div className="w-12 flex flex-col items-center justify-center py-12">
          <span className="text-[10px] text-gray-600 mb-4">1200</span>
          <div className="flex-1 w-1.5 rounded-full bg-gradient-to-b from-[#FF9600] via-[#1CB0F6] to-[#58CC02]" />
          <span className="text-[10px] text-gray-600 mt-4">400</span>
        </div>
      </div>
    </MobileContainer>
  );
}

// Design 2: Progress bar with level pills
function Design2() {
  return (
    <MobileContainer>
      <div className="min-h-[calc(100vh-56px)] flex">
        <div className="flex-1 flex flex-col justify-center px-5">
          <h1 className="text-3xl font-bold text-white mb-1">The Chess Path</h1>
          <p className="text-gray-400 text-sm mb-6">The shortest path to improvement</p>
          <div className="flex justify-center">
            <AnimatedBoard size={220} />
          </div>
          <Link
            href="/auth/signup"
            className="mt-8 w-full py-4 rounded-xl text-white font-semibold text-center"
            style={{ background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)' }}
          >
            Begin Learning
          </Link>
          <Link href="/auth/login" className="mt-3 text-gray-500 text-sm text-center">
            Sign in
          </Link>
        </div>

        {/* Progress with pills */}
        <div className="w-20 flex flex-col items-center justify-center gap-3 py-8 pr-2">
          {[
            { level: 3, elo: '1000-1200', color: '#FF9600' },
            { level: 2, elo: '800-1000', color: '#1CB0F6' },
            { level: 1, elo: '400-800', color: '#58CC02' },
          ].map((l) => (
            <div
              key={l.level}
              className="w-full py-3 rounded-lg text-center text-white"
              style={{ backgroundColor: l.color }}
            >
              <div className="font-bold text-sm">L{l.level}</div>
              <div className="text-[9px] opacity-80">{l.elo}</div>
            </div>
          ))}
        </div>
      </div>
    </MobileContainer>
  );
}

// Design 3: Connected nodes
function Design3() {
  return (
    <MobileContainer>
      <div className="min-h-[calc(100vh-56px)] flex">
        <div className="flex-1 flex flex-col justify-center items-center px-4">
          <h1 className="text-3xl font-bold text-white mb-1">The Chess Path</h1>
          <p className="text-gray-400 text-sm mb-6">The shortest path to improvement</p>
          <AnimatedBoard size={200} />
          <Link
            href="/auth/signup"
            className="mt-8 w-full max-w-[200px] py-3 rounded-xl text-white font-semibold text-center"
            style={{ background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)' }}
          >
            Begin Learning
          </Link>
          <Link href="/auth/login" className="mt-3 text-gray-500 text-sm">Sign in</Link>
        </div>

        {/* Connected nodes */}
        <div className="w-16 flex flex-col items-center justify-center py-10">
          {[
            { level: 3, elo: '1200', color: '#FF9600' },
            { level: 2, elo: '1000', color: '#1CB0F6' },
            { level: 1, elo: '400', color: '#58CC02' },
          ].map((l, i) => (
            <div key={l.level} className="flex flex-col items-center">
              {i > 0 && <div className="w-0.5 h-8 bg-white/20" />}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                style={{ backgroundColor: l.color }}
              >
                {l.level}
              </div>
              <span className="text-[10px] text-gray-500 mt-1">{l.elo}</span>
            </div>
          ))}
        </div>
      </div>
    </MobileContainer>
  );
}

// Design 4: Gradient bar with markers
function Design4() {
  return (
    <MobileContainer>
      <div className="min-h-[calc(100vh-56px)] flex">
        <div className="flex-1 flex flex-col justify-center items-center px-5">
          <h1 className="text-3xl font-bold text-white mb-1">The Chess Path</h1>
          <p className="text-gray-400 text-sm mb-6">The shortest path to improvement</p>
          <AnimatedBoard size={220} />
          <Link
            href="/auth/signup"
            className="mt-8 w-full max-w-[220px] py-4 rounded-xl text-white font-semibold text-center"
            style={{ background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)' }}
          >
            Begin Learning
          </Link>
          <Link href="/auth/login" className="mt-3 text-gray-500 text-sm">Sign in</Link>
        </div>

        {/* Gradient bar with markers */}
        <div className="w-14 flex items-center justify-center py-8">
          <div className="relative h-full w-3 rounded-full bg-gradient-to-b from-[#FF9600] via-[#1CB0F6] to-[#58CC02]">
            {/* Level markers */}
            <div className="absolute -left-7 top-[10%] text-right">
              <div className="text-[10px] font-bold text-[#FF9600]">L3</div>
            </div>
            <div className="absolute -left-7 top-[45%] text-right">
              <div className="text-[10px] font-bold text-[#1CB0F6]">L2</div>
            </div>
            <div className="absolute -left-7 top-[80%] text-right">
              <div className="text-[10px] font-bold text-[#58CC02]">L1</div>
            </div>
            {/* Dots on bar */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[10%] w-2 h-2 rounded-full bg-white" />
            <div className="absolute left-1/2 -translate-x-1/2 top-[45%] w-2 h-2 rounded-full bg-white" />
            <div className="absolute left-1/2 -translate-x-1/2 top-[80%] w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}

// Design 5: Stacked cards
function Design5() {
  return (
    <MobileContainer>
      <div className="min-h-[calc(100vh-56px)] flex">
        <div className="flex-1 flex flex-col justify-center px-5">
          <h1 className="text-3xl font-bold text-white mb-1">The Chess Path</h1>
          <p className="text-gray-400 text-sm mb-6">The shortest path to improvement</p>
          <div className="flex justify-center">
            <AnimatedBoard size={200} />
          </div>
          <Link
            href="/auth/signup"
            className="mt-8 w-full py-4 rounded-xl text-white font-semibold text-center"
            style={{ background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)' }}
          >
            Begin Learning
          </Link>
          <Link href="/auth/login" className="mt-3 text-gray-500 text-sm text-center">Sign in</Link>
        </div>

        {/* Stacked overlapping cards */}
        <div className="w-24 flex flex-col items-center justify-center pr-2">
          <div className="relative w-full h-64">
            <div
              className="absolute top-0 left-0 right-2 h-20 rounded-lg flex flex-col items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: '#FF9600' }}
            >
              <span className="font-bold">Level 3</span>
              <span className="text-xs opacity-80">1000-1200</span>
            </div>
            <div
              className="absolute top-16 left-1 right-1 h-20 rounded-lg flex flex-col items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: '#1CB0F6' }}
            >
              <span className="font-bold">Level 2</span>
              <span className="text-xs opacity-80">800-1000</span>
            </div>
            <div
              className="absolute top-32 left-2 right-0 h-20 rounded-lg flex flex-col items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: '#58CC02' }}
            >
              <span className="font-bold">Level 1</span>
              <span className="text-xs opacity-80">400-800</span>
            </div>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}

export default function TestLandingPage() {
  const [active, setActive] = useState(1);

  const designs = [
    { id: 1, name: 'Thin Line', component: Design1 },
    { id: 2, name: 'Pills', component: Design2 },
    { id: 3, name: 'Nodes', component: Design3 },
    { id: 4, name: 'Gradient Bar', component: Design4 },
    { id: 5, name: 'Stacked', component: Design5 },
  ];

  const ActiveComponent = designs.find(d => d.id === active)?.component || Design1;

  return (
    <>
      {/* Switcher */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black/90 px-3 py-1.5 rounded-lg">
        <span className="text-white text-xs font-medium">{active}. {designs.find(d => d.id === active)?.name}</span>
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-[#1A2C35] p-2 rounded-full border border-white/10">
        {designs.map(d => (
          <button
            key={d.id}
            onClick={() => setActive(d.id)}
            className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
              active === d.id ? 'bg-[#58CC02] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {d.id}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </>
  );
}
