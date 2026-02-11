'use client';

/**
 * Daily Puzzle Video — Test Page (all 4 stages)
 *
 * RULES: Read .claude/daily-puzzle-video-rules.md before editing.
 * - Board is ALWAYS dead center, never moves between stages
 * - Nothing animates over the chess board
 * - Light bg, dark text
 * - Three zones: top (text), center (board), bottom (text/actions)
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { BOARD_COLORS, parseUciMove, uciToSan } from '@/lib/puzzle-utils';

// ── Puzzle Data ─────────────────────────────────────────────
const DEMO_PUZZLE = {
  puzzleId: 'Ttdum',
  rawFen: '4rbrk/p1q2p1p/5Pp1/3pP3/2p4R/2P4Q/PP4PP/4R2K b - - 11 30',
  rawMoves: ['h7h5', 'h4h5', 'g6h5', 'h3h5', 'f8h6', 'h5h6'],
  rating: 829,
  themes: ['exposedKing', 'kingsideAttack', 'mateIn3', 'sacrifice'],
};

// ── Layout Constants ────────────────────────────────────────
// Board NEVER moves. These pixel values are sacred.
const FRAME_W = 270;
const FRAME_H = 480;
const BOARD_SIZE = 270; // edge-to-edge — matches FRAME_W
const ZONE_H = (FRAME_H - BOARD_SIZE) / 2; // 105px — equal top & bottom so board is dead center
const TOP_ZONE_H = ZONE_H;
const BOTTOM_ZONE_H = ZONE_H;

// Logo dimensions at size={0.5}: 520*0.5 = 260w, 120*0.5 = 60h
const LOGO_W = 260;
const LOGO_H = 60;

function getProcessedPuzzle() {
  const chess = new Chess(DEMO_PUZZLE.rawFen);
  const setup = parseUciMove(DEMO_PUZZLE.rawMoves[0]);
  chess.move({ from: setup.from, to: setup.to, promotion: setup.promotion });

  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';
  const solutionMoves = DEMO_PUZZLE.rawMoves.slice(1);
  const sanMoves = uciToSan(puzzleFen, solutionMoves);

  const finalChess = new Chess(puzzleFen);
  for (const uci of solutionMoves) {
    const { from, to, promotion } = parseUciMove(uci);
    try { finalChess.move({ from, to, promotion }); } catch { break; }
  }

  return {
    puzzleFen,
    playerColor: playerColor as 'white' | 'black',
    solutionMoves,
    sanMoves,
    finalFen: finalChess.fen(),
  };
}

// ── Shared Components ───────────────────────────────────────

function ReelFrame({
  label,
  stageNum,
  children,
  active,
  onReplay,
}: {
  label: string;
  stageNum: number;
  children: React.ReactNode;
  active?: boolean;
  onReplay?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 shrink-0">
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center rounded-full font-bold text-[11px]"
          style={{
            width: 22,
            height: 22,
            backgroundColor: active ? 'var(--color-chess-green)' : '#d1d5db',
            color: active ? '#fff' : '#6b7280',
          }}
        >
          {stageNum}
        </span>
        <span className={`text-xs font-semibold ${active ? 'text-chess-text' : 'text-chess-text-muted'}`}>
          {label}
        </span>
      </div>
      <div
        className="relative bg-chess-page overflow-hidden"
        style={{
          width: FRAME_W,
          height: FRAME_H,
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {children}
      </div>
      {onReplay && (
        <button
          onClick={onReplay}
          className="text-[11px] font-semibold text-chess-blue hover:text-chess-blue-dark transition-colors flex items-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-5.764 0a.25.25 0 0 0-.192.41l1.966 2.36a.25.25 0 0 0 .384 0l1.966-2.36a.25.25 0 0 0-.192-.41H5.77z" />
          </svg>
          Replay
        </button>
      )}
    </div>
  );
}

// The board — same in every stage, never moves
function BoardSlot({
  fen,
  orientation,
  highlightSquares,
}: {
  fen: string;
  orientation: 'white' | 'black';
  highlightSquares?: [string, string] | null;
}) {
  const squareStyles = highlightSquares ? {
    [highlightSquares[0]]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    [highlightSquares[1]]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
  } : {};

  return (
    <div style={{ height: BOARD_SIZE }}>
      <div
        style={{ width: BOARD_SIZE, height: BOARD_SIZE, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        className="overflow-hidden"
      >
        <Chessboard
          options={{
            position: fen,
            boardOrientation: orientation,
            squareStyles,
            boardStyle: { borderRadius: '0px' },
            darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
            lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
          }}
        />
      </div>
    </div>
  );
}

// Logo — fixed wrapper dimensions so flex layout respects the space
// At size={0.5}: containerWidth=260px, containerHeight=60px
// Only stage 1 gets the entrance animation; stages 2-4 show it instantly
function ReelLogo({ animate = false }: { animate?: boolean }) {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{ width: LOGO_W, height: LOGO_H }}
    >
      <AnimatedLogo theme="light" size={0.5} autoPlay={animate} />
    </div>
  );
}

// Footer tagline — every stage
function FooterTagline() {
  return (
    <div className="text-center">
      <p className="text-chess-text font-bold text-[10px] tracking-wide">Chess Path</p>
      <p className="text-chess-text-muted text-[8px] tracking-wide">Shortest path to chess improvement</p>
    </div>
  );
}

// Confetti — only in bottom zone (below board), never overlaps board
// Uses useEffect to avoid hydration mismatch from Math.random()
function ConfettiBurst({ replayKey }: { replayKey: number }) {
  const [particles, setParticles] = useState<Array<{
    id: number; color: string; left: number; delay: number;
    duration: number; size: number; rotation: number; xDrift: number;
  }>>([]);

  useEffect(() => {
    const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF9600', '#CE82FF', '#FF4B4B'];
    setParticles(Array.from({ length: 24 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: 8 + Math.random() * 84,
      delay: Math.random() * 0.4,
      duration: 0.8 + Math.random() * 0.6,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      xDrift: -25 + Math.random() * 50,
    })));
  }, [replayKey]);

  return (
    <div className="absolute pointer-events-none overflow-hidden" style={{
      top: TOP_ZONE_H + BOARD_SIZE,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      {particles.map((p) => (
        <div
          key={`${replayKey}-${p.id}`}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-6px',
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: p.size > 7 ? '50%' : '1px',
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
            ['--x-drift' as string]: `${p.xDrift}px`,
          }}
        />
      ))}
    </div>
  );
}

// ── Reel Layout Shell ───────────────────────────────────────
// Enforces the 3-zone layout. Board position NEVER changes.
// Logo is rendered HERE — not in individual stages — so it never shifts.
function ReelLayout({
  topContent,
  animateLogo = false,
  fen,
  orientation,
  highlightSquares,
  bottomContent,
  overlay,
}: {
  topContent: React.ReactNode;
  animateLogo?: boolean;
  fen: string;
  orientation: 'white' | 'black';
  highlightSquares?: [string, string] | null;
  bottomContent: React.ReactNode;
  overlay?: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      {overlay}

      {/* TOP ZONE — absolute positioning so NOTHING shifts */}
      <div style={{ height: TOP_ZONE_H }} className="relative">
        {/* Logo — absolute, pixel-pinned, identical in every stage */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 8 }}>
          <ReelLogo animate={animateLogo} />
        </div>
        {/* Text — absolute, pinned below logo, centered */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center justify-center px-3"
          style={{ top: 8 + LOGO_H, bottom: 0 }}
        >
          {topContent}
        </div>
      </div>

      {/* BOARD — dead center, never moves */}
      <BoardSlot fen={fen} orientation={orientation} highlightSquares={highlightSquares} />

      {/* BOTTOM ZONE — fixed 130px */}
      <div
        style={{ height: BOTTOM_ZONE_H }}
        className="flex flex-col items-center justify-between px-4 pt-2 pb-3"
      >
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {bottomContent}
        </div>
        <FooterTagline />
      </div>
    </div>
  );
}

// ── Stage 1: Initial Position ───────────────────────────────
function StageInitial({
  fen,
  playerColor,
  replayKey,
}: {
  fen: string;
  playerColor: 'white' | 'black';
  replayKey: number;
}) {
  const colorLabel = playerColor === 'white' ? 'White' : 'Black';

  return (
    <ReelLayout
      fen={fen}
      orientation={playerColor}
      topContent={
        <>
          <p className="text-chess-text-muted text-[9px] font-bold uppercase tracking-[0.15em]">
            Daily Puzzle
          </p>
          <p className="text-chess-text text-base font-bold leading-tight">{colorLabel} to play</p>
          <p className="text-chess-text-muted text-[11px]">Find the best move!</p>
        </>
      }
      bottomContent={<></>}
    />
  );
}

// ── Stage 2: Countdown ──────────────────────────────────────
function StageCountdown({
  fen,
  playerColor,
  replayKey,
}: {
  fen: string;
  playerColor: 'white' | 'black';
  replayKey: number;
}) {
  const [count, setCount] = useState(3);

  useEffect(() => { setCount(3); }, [replayKey]);

  useEffect(() => {
    if (count <= 0) return;
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <ReelLayout
      fen={fen}
      orientation={playerColor}
      topContent={
        <p className="text-chess-text text-base font-bold leading-tight">Can you see it?</p>
      }
      bottomContent={
        <div className="text-center">
          <span
            key={`${replayKey}-${count}`}
            className="text-chess-text font-black inline-block"
            style={{ fontSize: count > 0 ? 28 : 26 }}
          >
            {count > 0 ? `Solution in ${count}` : 'GO!'}
          </span>
          <p className="text-chess-text-faint text-[9px] mt-0.5">Tap to pause</p>
        </div>
      }
    />
  );
}

// ── Stage 3: Animation ──────────────────────────────────────
function StageAnimation({
  puzzleFen,
  playerColor,
  solutionMoves,
  sanMoves,
  replayKey,
}: {
  puzzleFen: string;
  playerColor: 'white' | 'black';
  solutionMoves: string[];
  sanMoves: string[];
  replayKey: number;
}) {
  const [currentFen, setCurrentFen] = useState(puzzleFen);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [displayedMoves, setDisplayedMoves] = useState<string[]>([]);

  useEffect(() => {
    setCurrentFen(puzzleFen);
    setMoveIndex(-1);
    setLastMove(null);
    setDisplayedMoves([]);
  }, [replayKey, puzzleFen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextIndex = moveIndex + 1;
      if (nextIndex >= solutionMoves.length) return;

      const uci = solutionMoves[nextIndex];
      const { from, to, promotion } = parseUciMove(uci);

      try {
        const chess = new Chess(currentFen);
        chess.move({ from, to, promotion });
        setCurrentFen(chess.fen());
        setLastMove([from, to]);
        setMoveIndex(nextIndex);
        setDisplayedMoves(prev => [...prev, sanMoves[nextIndex]]);
      } catch { /* skip */ }
    }, moveIndex === -1 ? 800 : 1500);

    return () => clearTimeout(timeout);
  }, [moveIndex, currentFen, solutionMoves, sanMoves]);

  const formattedMoves = useMemo(() => {
    const pairs: string[] = [];
    for (let i = 0; i < displayedMoves.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      let pair = `${moveNum}. ${displayedMoves[i]}`;
      if (displayedMoves[i + 1]) pair += ` ${displayedMoves[i + 1]}`;
      pairs.push(pair);
    }
    return pairs.join('  ');
  }, [displayedMoves]);

  return (
    <ReelLayout
      fen={currentFen}
      orientation={playerColor}
      highlightSquares={lastMove}
      topContent={
        <>
          <p className="text-chess-text-muted text-[9px] font-bold uppercase tracking-[0.15em]">
            Solution
          </p>
          <p className="text-chess-text text-base font-bold leading-tight">Watch closely!</p>
        </>
      }
      bottomContent={
        <div
          className="rounded-lg px-3 py-2 min-h-[28px] flex items-center justify-center w-full"
          style={{
            backgroundColor: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <p className="text-chess-text text-[9px] font-mono font-semibold">
            {formattedMoves || <span className="text-chess-text-faint">Moves appear here...</span>}
          </p>
        </div>
      }
    />
  );
}

// ── Stage 4: Finish ─────────────────────────────────────────
function StageFinish({
  finalFen,
  playerColor,
  replayKey,
}: {
  finalFen: string;
  playerColor: 'white' | 'black';
  replayKey: number;
}) {
  return (
    <ReelLayout
      fen={finalFen}
      orientation={playerColor}
      overlay={<ConfettiBurst replayKey={replayKey} />}
      topContent={
        <>
          <p className="text-chess-text-muted text-[9px] font-bold uppercase tracking-[0.15em]">
            Daily Puzzle
          </p>
          <p className="text-chess-text text-base font-bold leading-tight">Checkmate!</p>
          <p className="text-chess-text-muted text-[10px]">Mate in 3 &bull; Rating 829</p>
        </>
      }
      bottomContent={
        <div className="text-center">
          <p className="text-chess-text font-bold text-sm">chesspath.app</p>
          <p className="text-chess-text-muted text-[10px]">for daily improvement!</p>
        </div>
      }
    />
  );
}

// ── Main Test Page ──────────────────────────────────────────
export default function TestDailyVideoPage() {
  const puzzle = useMemo(() => getProcessedPuzzle(), []);
  const [replayKeys, setReplayKeys] = useState({ s1: 0, s2: 0, s3: 0, s4: 0 });

  const replay = useCallback((stage: 's1' | 's2' | 's3' | 's4') => {
    setReplayKeys(prev => ({ ...prev, [stage]: prev[stage] + 1 }));
  }, []);

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: '#f0f2f5' }}>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(140px) translateX(var(--x-drift)) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div className="text-center pt-10 pb-8 px-4">
        <h1 className="text-chess-text text-xl font-bold tracking-tight">
          Daily Puzzle Video Storyboard
        </h1>
        <p className="text-chess-text-muted text-sm mt-1">
          Instagram Reel &mdash; 9:16 &mdash; {FRAME_W}&times;{FRAME_H}px frames
        </p>
      </div>

      {/* 4 stage frames side by side */}
      <div className="flex gap-8 justify-center px-8 pb-10 overflow-x-auto">
        <ReelFrame label="Initial" stageNum={1} active onReplay={() => replay('s1')}>
          <StageInitial fen={puzzle.puzzleFen} playerColor={puzzle.playerColor} replayKey={replayKeys.s1} />
        </ReelFrame>

        <ReelFrame label="Countdown" stageNum={2} onReplay={() => replay('s2')}>
          <StageCountdown fen={puzzle.puzzleFen} playerColor={puzzle.playerColor} replayKey={replayKeys.s2} />
        </ReelFrame>

        <ReelFrame label="Solution" stageNum={3} onReplay={() => replay('s3')}>
          <StageAnimation
            puzzleFen={puzzle.puzzleFen}
            playerColor={puzzle.playerColor}
            solutionMoves={puzzle.solutionMoves}
            sanMoves={puzzle.sanMoves}
            replayKey={replayKeys.s3}
          />
        </ReelFrame>

        <ReelFrame label="Celebrate" stageNum={4} onReplay={() => replay('s4')}>
          <StageFinish finalFen={puzzle.finalFen} playerColor={puzzle.playerColor} replayKey={replayKeys.s4} />
        </ReelFrame>
      </div>

      {/* Info panel */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div
          className="rounded-xl p-5 text-xs space-y-2"
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <p className="text-chess-text font-semibold text-sm mb-2">Puzzle Details</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-chess-text-muted">
            <p><span className="text-chess-text font-medium">ID:</span> {DEMO_PUZZLE.puzzleId}</p>
            <p><span className="text-chess-text font-medium">Rating:</span> {DEMO_PUZZLE.rating}</p>
            <p><span className="text-chess-text font-medium">Color:</span> {puzzle.playerColor}</p>
            <p><span className="text-chess-text font-medium">Type:</span> Mate in 3</p>
            <p className="col-span-2"><span className="text-chess-text font-medium">Themes:</span> {DEMO_PUZZLE.themes.join(', ')}</p>
            <p className="col-span-2"><span className="text-chess-text font-medium">Moves (SAN):</span> <span className="font-mono">{puzzle.sanMoves.join(' ')}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
