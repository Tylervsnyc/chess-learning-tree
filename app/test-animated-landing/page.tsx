'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// Three puzzles at different difficulty levels
const PUZZLES = {
  beginner: {
    // 400-800: Simple knight fork winning queen
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    moves: ['h5f7'],
    label: '400-800',
    color: '#58CC02',
    orientation: 'white' as const,
  },
  intermediate: {
    // 800-1200: Smothered mate! Nh6+ Kh8, Qg8+!! Rxg8, Nf7# (Philidor's Legacy)
    fen: '5rk1/5Npp/8/8/8/8/1Q6/7K w - - 0 1',
    moves: ['f7h6', 'g8h8', 'b2g8', 'f8g8', 'h6f7'],
    label: '800-1200',
    color: '#1CB0F6',
    orientation: 'white' as const,
  },
  advanced: {
    // 1200-1600: Crushing rook sacrifice attack
    fen: 'r4nk1/p4q2/2p1p1pQ/2ppP3/r7/6R1/PPP4P/6RK b - - 1 26',
    moves: ['a4f4', 'g3g6', 'f8g6', 'g1g6', 'f7g6', 'h6g6'],
    label: '1200-1600',
    color: '#FF9600',
    orientation: 'black' as const,
  },
};

type PuzzleKey = keyof typeof PUZZLES;

// Design tokens
const colors = {
  bg: '#0f172a',
  secondary: '#1e293b',
  accent: '#58CC02',
  border: '#334155',
};

function AnimatedBoard({
  puzzleKey,
  size
}: {
  puzzleKey: PuzzleKey;
  size: number;
}) {
  const puzzle = PUZZLES[puzzleKey];
  const [game, setGame] = useState(() => new Chess(puzzle.fen));
  const [moveIndex, setMoveIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);

  const resetPuzzle = useCallback(() => {
    setGame(new Chess(puzzle.fen));
    setMoveIndex(-1);
    setLastMove(null);
  }, [puzzle.fen]);

  // Reset when puzzle changes
  useEffect(() => {
    resetPuzzle();
  }, [puzzleKey, resetPuzzle]);

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
        setTimeout(resetPuzzle, 2500);
      }
    }, moveIndex === -1 ? 1500 : 1000);

    return () => clearTimeout(timeout);
  }, [moveIndex, game, puzzle.moves, resetPuzzle]);

  const customSquareStyles = lastMove ? {
    [lastMove[0]]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    [lastMove[1]]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
  } : {};

  return (
    <div style={{ width: size, height: size }}>
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

// Difficulty selector buttons
function DifficultyButtons({
  selected,
  onSelect,
  layout = 'vertical',
  style3d = false
}: {
  selected: PuzzleKey;
  onSelect: (key: PuzzleKey) => void;
  layout?: 'vertical' | 'horizontal';
  style3d?: boolean;
}) {
  const buttons: { key: PuzzleKey; label: string; color: string; darkColor: string }[] = [
    { key: 'beginner', label: '400-800', color: PUZZLES.beginner.color, darkColor: '#45a302' },
    { key: 'intermediate', label: '800-1200', color: PUZZLES.intermediate.color, darkColor: '#0e8ac7' },
    { key: 'advanced', label: '1200-1600', color: PUZZLES.advanced.color, darkColor: '#cc7a00' },
  ];

  const containerClass = layout === 'vertical'
    ? 'flex flex-col gap-2'
    : 'flex justify-center gap-3';

  return (
    <div className={containerClass}>
      {buttons.map((btn) => {
        const isSelected = selected === btn.key;

        if (style3d) {
          return (
            <button
              key={btn.key}
              onClick={() => onSelect(btn.key)}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                isSelected
                  ? 'text-white translate-y-0'
                  : 'text-white/90 translate-y-0 hover:-translate-y-0.5'
              }`}
              style={{
                background: `linear-gradient(180deg, ${btn.color} 0%, ${btn.darkColor} 100%)`,
                boxShadow: isSelected
                  ? `0 4px 0 ${btn.darkColor}, 0 6px 20px ${btn.color}50, inset 0 1px 0 rgba(255,255,255,0.2)`
                  : `0 4px 0 ${btn.darkColor}, inset 0 1px 0 rgba(255,255,255,0.15)`,
                transform: isSelected ? 'translateY(2px)' : undefined,
              }}
            >
              {btn.label}
            </button>
          );
        }

        return (
          <button
            key={btn.key}
            onClick={() => onSelect(btn.key)}
            className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              isSelected
                ? 'text-white scale-105'
                : 'text-white/70 opacity-60 hover:opacity-80'
            }`}
            style={{
              backgroundColor: btn.color,
              boxShadow: isSelected ? `0 0 20px ${btn.color}50` : 'none'
            }}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}

// Design 1: Side by side, buttons on right
function Design1() {
  const [puzzle, setPuzzle] = useState<PuzzleKey>('beginner');

  return (
    <div className="h-[calc(100vh-72px)] max-w-lg mx-auto flex flex-col" style={{ backgroundColor: colors.bg }}>
      <div className="flex-1 flex flex-col justify-center px-5">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">The Chess Path</h1>
          <p className="text-slate-400 text-sm">
            Curated puzzles to help you improve in the shortest time possible
          </p>
        </div>

        {/* Board and buttons side by side */}
        <div className="flex items-center justify-center gap-4">
          <AnimatedBoard puzzleKey={puzzle} size={200} />
          <DifficultyButtons selected={puzzle} onSelect={setPuzzle} layout="vertical" />
        </div>

        {/* CTA */}
        <button
          className="mt-8 w-full py-4 text-white font-bold text-lg rounded-xl"
          style={{ backgroundColor: colors.accent, boxShadow: `0 0 30px ${colors.accent}40` }}
        >
          Start Your Journey
        </button>
        <button className="mt-2 w-full py-2 text-slate-500 text-sm">Sign in</button>
      </div>
    </div>
  );
}

// Design 2: Buttons below board, horizontal
function Design2() {
  const [puzzle, setPuzzle] = useState<PuzzleKey>('intermediate');

  return (
    <div className="h-[calc(100vh-72px)] max-w-md mx-auto flex flex-col" style={{ backgroundColor: colors.bg }}>
      <div className="flex-1 flex flex-col justify-center px-5">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">The Chess Path</h1>
          <p className="text-slate-400 text-xs">
            Curated puzzles to help you improve in the shortest time possible
          </p>
        </div>

        {/* Board centered */}
        <div className="flex justify-center mb-4">
          <AnimatedBoard puzzleKey={puzzle} size={240} />
        </div>

        {/* ELO label */}
        <div className="text-center mb-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: PUZZLES[puzzle].color }}
          >
            {PUZZLES[puzzle].label} ELO
          </span>
        </div>

        {/* Buttons horizontal, centered, 3D */}
        <DifficultyButtons selected={puzzle} onSelect={setPuzzle} layout="horizontal" style3d />

        {/* CTA */}
        <button
          className="mt-6 w-full py-4 text-white font-bold text-lg rounded-xl"
          style={{ backgroundColor: colors.accent, boxShadow: `0 0 30px ${colors.accent}40` }}
        >
          Start Your Journey
        </button>
        <button className="mt-2 w-full py-2 text-slate-500 text-sm">Sign in</button>
      </div>
    </div>
  );
}

// Design 3: Buttons as tabs above board
function Design3() {
  const [puzzle, setPuzzle] = useState<PuzzleKey>('beginner');

  return (
    <div className="h-[calc(100vh-72px)] max-w-md mx-auto flex flex-col" style={{ backgroundColor: colors.bg }}>
      <div className="flex-1 flex flex-col justify-center px-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-white mb-1">The Chess Path</h1>
          <p className="text-slate-400 text-xs">
            Curated puzzles to help you improve in the shortest time possible
          </p>
        </div>

        {/* Tab-style buttons */}
        <div className="flex rounded-xl overflow-hidden mb-4" style={{ backgroundColor: colors.secondary }}>
          {(['beginner', 'intermediate', 'advanced'] as PuzzleKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setPuzzle(key)}
              className={`flex-1 py-3 text-xs font-semibold transition-all ${
                puzzle === key ? 'text-white' : 'text-slate-500'
              }`}
              style={{ backgroundColor: puzzle === key ? PUZZLES[key].color : 'transparent' }}
            >
              {PUZZLES[key].label}
            </button>
          ))}
        </div>

        {/* Board centered */}
        <div className="flex justify-center">
          <AnimatedBoard puzzleKey={puzzle} size={260} />
        </div>

        {/* CTA */}
        <button
          className="mt-6 w-full py-4 text-white font-bold text-lg rounded-xl"
          style={{ backgroundColor: colors.accent, boxShadow: `0 0 30px ${colors.accent}40` }}
        >
          Start Your Journey
        </button>
        <button className="mt-2 w-full py-2 text-slate-500 text-sm">Sign in</button>
      </div>
    </div>
  );
}

// Design 4: Minimal with floating buttons
function Design4() {
  const [puzzle, setPuzzle] = useState<PuzzleKey>('advanced');

  return (
    <div className="h-[calc(100vh-72px)] max-w-md mx-auto flex flex-col relative" style={{ backgroundColor: colors.bg }}>
      {/* Floating difficulty selector */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5">
        {(['beginner', 'intermediate', 'advanced'] as PuzzleKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setPuzzle(key)}
            className={`w-3 h-3 rounded-full transition-all ${
              puzzle === key ? 'scale-125' : 'opacity-40'
            }`}
            style={{ backgroundColor: PUZZLES[key].color }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center px-5">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">The Chess Path</h1>
          <p className="text-slate-400 text-sm max-w-[280px] mx-auto">
            Curated puzzles to help you improve in the shortest time possible
          </p>
        </div>

        {/* Board centered with current level */}
        <div className="flex flex-col items-center">
          <AnimatedBoard puzzleKey={puzzle} size={240} />
          <div
            className="mt-3 px-4 py-1.5 rounded-full text-white text-sm font-semibold"
            style={{ backgroundColor: PUZZLES[puzzle].color }}
          >
            {PUZZLES[puzzle].label} ELO Puzzle
          </div>
        </div>

        {/* CTA */}
        <button
          className="mt-8 w-full py-4 text-white font-bold text-lg rounded-xl"
          style={{ backgroundColor: colors.accent, boxShadow: `0 0 30px ${colors.accent}40` }}
        >
          Start Your Journey
        </button>
        <button className="mt-2 w-full py-2 text-slate-500 text-sm">Sign in</button>
      </div>
    </div>
  );
}

// Design 5: Card-based with difficulty cards
function Design5() {
  const [puzzle, setPuzzle] = useState<PuzzleKey>('intermediate');

  return (
    <div className="h-[calc(100vh-72px)] max-w-md mx-auto flex flex-col" style={{ backgroundColor: colors.bg }}>
      <div className="flex-1 flex flex-col justify-center px-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">The Chess Path</h1>
          <p className="text-slate-400 text-xs">
            Curated puzzles to help you improve in the shortest time possible
          </p>
        </div>

        {/* Board in card */}
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: colors.secondary }}>
          <div className="flex justify-center">
            <AnimatedBoard puzzleKey={puzzle} size={220} />
          </div>
        </div>

        {/* Difficulty cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(['beginner', 'intermediate', 'advanced'] as PuzzleKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setPuzzle(key)}
              className={`rounded-xl p-3 transition-all ${
                puzzle === key ? 'ring-2 ring-white' : 'opacity-50'
              }`}
              style={{ backgroundColor: PUZZLES[key].color }}
            >
              <div className="text-white text-xs font-bold">{PUZZLES[key].label}</div>
              <div className="text-white/70 text-[10px]">ELO</div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          className="w-full py-4 text-white font-bold text-lg rounded-xl"
          style={{ backgroundColor: colors.accent, boxShadow: `0 0 30px ${colors.accent}40` }}
        >
          Start Your Journey
        </button>
        <button className="mt-2 w-full py-2 text-slate-500 text-sm">Sign in</button>
      </div>
    </div>
  );
}

// Design 6: Arcade Neon - Clean gaming aesthetic
function Design6() {
  const [puzzle, setPuzzle] = useState<PuzzleKey>('intermediate');

  const neonButtons: { key: PuzzleKey; label: string; color: string; glow: string }[] = [
    { key: 'beginner', label: '400-800', color: '#00FFFF', glow: 'rgba(0,255,255,0.4)' },
    { key: 'intermediate', label: '800-1200', color: '#FF00FF', glow: 'rgba(255,0,255,0.4)' },
    { key: 'advanced', label: '1200-1600', color: '#FFFF00', glow: 'rgba(255,255,0,0.4)' },
  ];

  return (
    <div className="h-[calc(100vh-72px)] bg-[#0a0a0a] relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Neon glow effects */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-[80px]" />

      <div className="relative z-10 h-full max-w-md mx-auto flex flex-col justify-center px-5">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
              THE CHESS PATH
            </span>
          </h1>
          <p className="text-gray-500 text-sm font-mono">
            {'>'} Curated puzzles to level up fast
          </p>
        </div>

        {/* Board with neon border */}
        <div className="flex justify-center mb-5">
          <div
            className="p-1 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #00FFFF, #FF00FF, #FFFF00)',
              boxShadow: '0 0 30px rgba(0,255,255,0.3), 0 0 60px rgba(255,0,255,0.2)'
            }}
          >
            <div className="bg-[#0a0a0a] rounded-lg p-1">
              <AnimatedBoard puzzleKey={puzzle} size={220} />
            </div>
          </div>
        </div>

        {/* Neon ELO buttons - clear/outlined style */}
        <div className="flex gap-2 mb-4">
          {neonButtons.map((btn) => {
            const isSelected = puzzle === btn.key;
            return (
              <button
                key={btn.key}
                onClick={() => setPuzzle(btn.key)}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all border-2 ${
                  isSelected ? '' : 'opacity-50 hover:opacity-75'
                }`}
                style={{
                  borderColor: btn.color,
                  color: btn.color,
                  backgroundColor: isSelected ? `${btn.color}10` : 'transparent',
                  boxShadow: isSelected ? `0 0 20px ${btn.glow}, inset 0 0 15px ${btn.glow}` : 'none',
                  textShadow: isSelected ? `0 0 10px ${btn.color}` : 'none'
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* CTA - matching width, clear style */}
        <button
          className="w-full py-2.5 font-bold text-sm rounded-lg border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all"
          style={{ boxShadow: '0 0 20px rgba(0,255,255,0.3)' }}
        >
          Begin Your Training
        </button>
        <button className="mt-3 w-full py-2 text-gray-600 font-medium text-sm hover:text-white transition-colors">
          Sign in
        </button>
      </div>
    </div>
  );
}

export default function TestAnimatedLanding() {
  const [activeDesign, setActiveDesign] = useState(6);

  const designs = [
    { id: 1, name: 'Side Buttons', description: 'Board with vertical buttons on right' },
    { id: 2, name: 'Bottom 3D', description: 'Horizontal 3D buttons below board' },
    { id: 3, name: 'Tab Style', description: 'Segmented control tabs above board' },
    { id: 4, name: 'Minimal Dots', description: 'Floating dot indicators' },
    { id: 5, name: 'Card Grid', description: 'Board in card with difficulty cards' },
    { id: 6, name: 'Arcade Neon', description: 'Clean gaming aesthetic with neon glow' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: activeDesign === 6 ? '#0a0a0a' : colors.bg }}>
      {/* Tab Selector */}
      <div className="border-b p-3 sticky top-0 z-50" style={{ backgroundColor: activeDesign === 6 ? '#111' : colors.secondary, borderColor: activeDesign === 6 ? '#222' : colors.border }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            <Link href="/admin" className="text-slate-500 hover:text-white transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-white font-medium text-sm shrink-0">Animated Landing</span>
            <div className="flex gap-2">
              {designs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDesign(d.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    activeDesign === d.id
                      ? d.id === 6 ? 'bg-gradient-to-r from-cyan-400 to-pink-500 text-black' : 'bg-[#58CC02] text-black'
                      : 'text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {d.id}. {d.name}
                </button>
              ))}
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-2">{designs.find(d => d.id === activeDesign)?.description}</p>
        </div>
      </div>

      {activeDesign === 1 && <Design1 />}
      {activeDesign === 2 && <Design2 />}
      {activeDesign === 3 && <Design3 />}
      {activeDesign === 4 && <Design4 />}
      {activeDesign === 5 && <Design5 />}
      {activeDesign === 6 && <Design6 />}
    </div>
  );
}
