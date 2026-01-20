'use client';

import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// Sample positions that look interesting
const POSITIONS = [
  'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', // Scholar's mate setup
  'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', // Italian game
  'rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2', // After e4 Nf6
  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', // Ruy Lopez
];

// Animated board that plays through a game
function AnimatedBoard({ size = 200, speed = 1500 }: { size?: number; speed?: number }) {
  const [game] = useState(() => new Chess());
  const [position, setPosition] = useState(game.fen());

  useEffect(() => {
    const interval = setInterval(() => {
      const moves = game.moves();
      if (moves.length === 0) {
        game.reset();
      } else {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        game.move(randomMove);
      }
      setPosition(game.fen());
    }, speed);

    return () => clearInterval(interval);
  }, [game, speed]);

  return (
    <div style={{ width: size, height: size }}>
      <Chessboard
        options={{
          position,
          boardStyle: { borderRadius: '8px' },
          darkSquareStyle: { backgroundColor: '#779952' },
          lightSquareStyle: { backgroundColor: '#edeed1' },
        }}
      />
    </div>
  );
}

// Static board with a position
function StaticBoard({ fen, size = 150 }: { fen: string; size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Chessboard
        options={{
          position: fen,
          boardStyle: { borderRadius: '8px' },
          darkSquareStyle: { backgroundColor: '#779952' },
          lightSquareStyle: { backgroundColor: '#edeed1' },
        }}
      />
    </div>
  );
}

// Design 1: Big animated board hero
function Design1() {
  return (
    <div className="min-h-[600px] bg-[#131F24] p-4 flex flex-col">
      <h2 className="text-white text-lg font-bold mb-4 text-center">Design 1: Big Board Hero</h2>

      {/* Hero board */}
      <div className="flex justify-center mb-4">
        <AnimatedBoard size={280} speed={2000} />
      </div>

      {/* Action buttons */}
      <div className="space-y-3 max-w-[280px] mx-auto w-full">
        <button className="w-full py-3 rounded-xl text-white font-semibold"
          style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B, #A560E8)' }}>
          Daily Challenge
        </button>
        <button className="w-full py-3 rounded-xl text-white font-semibold"
          style={{ background: 'linear-gradient(135deg, #58CC02, #2FCBEF)' }}>
          Learning Tree
        </button>
        <button className="w-full py-3 rounded-xl text-white font-semibold"
          style={{ background: 'linear-gradient(135deg, #1CB0F6, #A560E8)' }}>
          Puzzle Workout
        </button>
      </div>
    </div>
  );
}

// Design 2: Three boards side by side
function Design2() {
  return (
    <div className="min-h-[600px] bg-[#131F24] p-4 flex flex-col">
      <h2 className="text-white text-lg font-bold mb-4 text-center">Design 2: Three Boards</h2>

      {/* Three feature cards with boards */}
      <div className="flex gap-2 justify-center mb-4">
        <div className="flex flex-col items-center">
          <div className="rounded-xl overflow-hidden mb-2 ring-2 ring-[#FF9600]">
            <StaticBoard fen={POSITIONS[0]} size={100} />
          </div>
          <span className="text-xs text-[#FF9600] font-medium">Daily</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="rounded-xl overflow-hidden mb-2 ring-2 ring-[#58CC02]">
            <StaticBoard fen={POSITIONS[1]} size={100} />
          </div>
          <span className="text-xs text-[#58CC02] font-medium">Learn</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="rounded-xl overflow-hidden mb-2 ring-2 ring-[#1CB0F6]">
            <StaticBoard fen={POSITIONS[2]} size={100} />
          </div>
          <span className="text-xs text-[#1CB0F6] font-medium">Workout</span>
        </div>
      </div>

      {/* Full width buttons */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        <button className="w-full py-4 rounded-xl text-white font-semibold text-lg"
          style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}>
          🔥 Daily Challenge
        </button>
        <button className="w-full py-4 rounded-xl text-white font-semibold text-lg"
          style={{ background: 'linear-gradient(135deg, #58CC02, #2FCBEF)' }}>
          🌳 Learning Tree
        </button>
        <button className="w-full py-4 rounded-xl text-white font-semibold text-lg"
          style={{ background: 'linear-gradient(135deg, #1CB0F6, #A560E8)' }}>
          💪 Workout
        </button>
      </div>
    </div>
  );
}

// Design 3: Cards with embedded boards
function Design3() {
  return (
    <div className="min-h-[600px] bg-[#131F24] p-4 flex flex-col gap-3">
      <h2 className="text-white text-lg font-bold mb-2 text-center">Design 3: Board Cards</h2>

      {/* Daily Challenge Card */}
      <button className="flex items-center gap-4 p-3 rounded-xl text-left"
        style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}>
        <div className="rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          <StaticBoard fen={POSITIONS[0]} size={80} />
        </div>
        <div>
          <div className="text-white/80 text-xs uppercase tracking-wide">Daily</div>
          <div className="text-white font-bold text-lg">Challenge</div>
          <div className="text-white/70 text-xs">5 min • 3 lives</div>
        </div>
      </button>

      {/* Learning Card */}
      <button className="flex items-center gap-4 p-3 rounded-xl text-left"
        style={{ background: 'linear-gradient(135deg, #58CC02, #2FCBEF)' }}>
        <div className="rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          <StaticBoard fen={POSITIONS[1]} size={80} />
        </div>
        <div>
          <div className="text-white/80 text-xs uppercase tracking-wide">Learn</div>
          <div className="text-white font-bold text-lg">Learning Tree</div>
          <div className="text-white/70 text-xs">Structured lessons</div>
        </div>
      </button>

      {/* Workout Card */}
      <button className="flex items-center gap-4 p-3 rounded-xl text-left"
        style={{ background: 'linear-gradient(135deg, #1CB0F6, #A560E8)' }}>
        <div className="rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          <StaticBoard fen={POSITIONS[2]} size={80} />
        </div>
        <div>
          <div className="text-white/80 text-xs uppercase tracking-wide">Practice</div>
          <div className="text-white font-bold text-lg">Workout</div>
          <div className="text-white/70 text-xs">Unlimited puzzles</div>
        </div>
      </button>

      {/* Profile link */}
      <button className="flex items-center justify-between p-3 rounded-xl bg-[#1A2C35] border border-white/10 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#58CC02] to-[#1CB0F6] flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-white">Your Profile</span>
        </div>
        <span className="text-gray-400 bg-[#131F24] px-2 py-1 rounded text-sm">800</span>
      </button>
    </div>
  );
}

// Design 4: Animated board background with overlay
function Design4() {
  return (
    <div className="min-h-[600px] bg-[#131F24] relative overflow-hidden">
      <h2 className="text-white text-lg font-bold p-4 text-center relative z-10">Design 4: Board Background</h2>

      {/* Background animated board */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <AnimatedBoard size={500} speed={3000} />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 p-4 flex flex-col h-[550px]">
        <div className="flex-1 flex flex-col justify-center gap-4">
          <button className="py-5 rounded-2xl text-white font-bold text-xl backdrop-blur-sm"
            style={{ background: 'linear-gradient(135deg, rgba(255,150,0,0.9), rgba(255,107,107,0.9))' }}>
            🔥 Daily Challenge
          </button>
          <button className="py-5 rounded-2xl text-white font-bold text-xl backdrop-blur-sm"
            style={{ background: 'linear-gradient(135deg, rgba(88,204,2,0.9), rgba(47,203,239,0.9))' }}>
            🌳 Learning Tree
          </button>
          <button className="py-5 rounded-2xl text-white font-bold text-xl backdrop-blur-sm"
            style={{ background: 'linear-gradient(135deg, rgba(28,176,246,0.9), rgba(165,96,232,0.9))' }}>
            💪 Puzzle Workout
          </button>
        </div>
      </div>
    </div>
  );
}

// Design 5: Grid with live boards
function Design5() {
  return (
    <div className="min-h-[600px] bg-[#131F24] p-4">
      <h2 className="text-white text-lg font-bold mb-4 text-center">Design 5: Live Grid</h2>

      {/* 2x2 grid of animated boards as buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="relative rounded-xl overflow-hidden aspect-square"
          style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}>
          <div className="absolute inset-2">
            <AnimatedBoard size={140} speed={2500} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-white font-bold text-sm">Daily</div>
          </div>
        </button>

        <button className="relative rounded-xl overflow-hidden aspect-square"
          style={{ background: 'linear-gradient(135deg, #58CC02, #2FCBEF)' }}>
          <div className="absolute inset-2">
            <AnimatedBoard size={140} speed={2800} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-white font-bold text-sm">Learn</div>
          </div>
        </button>

        <button className="relative rounded-xl overflow-hidden aspect-square"
          style={{ background: 'linear-gradient(135deg, #1CB0F6, #A560E8)' }}>
          <div className="absolute inset-2">
            <AnimatedBoard size={140} speed={3100} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-white font-bold text-sm">Workout</div>
          </div>
        </button>

        <button className="relative rounded-xl overflow-hidden aspect-square bg-[#1A2C35] border border-white/10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#58CC02] to-[#A560E8] flex items-center justify-center text-white text-2xl font-bold mb-2">
            S
          </div>
          <div className="text-white font-bold text-sm">Profile</div>
          <div className="text-gray-400 text-xs">800 ELO</div>
        </button>
      </div>
    </div>
  );
}

// Design 6: Stacked cards with peek boards
function Design6() {
  return (
    <div className="min-h-[600px] bg-[#131F24] p-4 flex flex-col">
      <h2 className="text-white text-lg font-bold mb-4 text-center">Design 6: Stacked Peek</h2>

      <div className="flex-1 flex flex-col justify-center gap-4">
        {/* Daily - full width with board on right */}
        <button className="relative h-28 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B, #A560E8)' }}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="text-white/80 text-xs uppercase tracking-wide">Today's</div>
            <div className="text-white font-bold text-2xl">Daily Challenge</div>
            <div className="text-white/70 text-sm">Beat your best score</div>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80">
            <StaticBoard fen={POSITIONS[0]} size={90} />
          </div>
        </button>

        {/* Two smaller cards */}
        <div className="flex gap-3">
          <button className="flex-1 h-32 rounded-2xl overflow-hidden relative"
            style={{ background: 'linear-gradient(180deg, #58CC02, #2FCBEF)' }}>
            <div className="absolute top-3 left-3">
              <div className="text-white font-bold">Learn</div>
              <div className="text-white/70 text-xs">8 lessons</div>
            </div>
            <div className="absolute bottom-1 right-1 opacity-70">
              <StaticBoard fen={POSITIONS[1]} size={70} />
            </div>
          </button>

          <button className="flex-1 h-32 rounded-2xl overflow-hidden relative"
            style={{ background: 'linear-gradient(180deg, #1CB0F6, #A560E8)' }}>
            <div className="absolute top-3 left-3">
              <div className="text-white font-bold">Workout</div>
              <div className="text-white/70 text-xs">∞ puzzles</div>
            </div>
            <div className="absolute bottom-1 right-1 opacity-70">
              <StaticBoard fen={POSITIONS[2]} size={70} />
            </div>
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#1A2C35] border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#58CC02] to-[#1CB0F6]" />
            <div>
              <div className="text-white font-medium">Steve</div>
              <div className="text-gray-500 text-xs">View stats →</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">800</div>
            <div className="text-gray-500 text-xs">rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestHomePage() {
  const [selectedDesign, setSelectedDesign] = useState(1);

  const designs = [
    { id: 1, name: 'Big Board Hero', component: Design1 },
    { id: 2, name: 'Three Boards', component: Design2 },
    { id: 3, name: 'Board Cards', component: Design3 },
    { id: 4, name: 'Board Background', component: Design4 },
    { id: 5, name: 'Live Grid', component: Design5 },
    { id: 6, name: 'Stacked Peek', component: Design6 },
  ];

  const SelectedComponent = designs.find(d => d.id === selectedDesign)?.component || Design1;

  return (
    <div className="min-h-screen bg-[#0a1015]">
      {/* Design selector */}
      <div className="sticky top-0 z-50 bg-[#0a1015] border-b border-white/10 p-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {designs.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDesign(d.id)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                selectedDesign === d.id
                  ? 'bg-white text-black font-medium'
                  : 'bg-[#1A2C35] text-gray-300 hover:bg-[#2A3C45]'
              }`}
            >
              {d.id}. {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Phone frame preview */}
      <div className="flex justify-center p-4">
        <div className="w-[320px] bg-[#131F24] rounded-3xl overflow-hidden border-4 border-[#2A3C45] shadow-2xl">
          <SelectedComponent />
        </div>
      </div>
    </div>
  );
}
