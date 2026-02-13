'use client';

/**
 * Daily Puzzle Video — Test Page (all 4 stages)
 *
 * RULES: Read .claude/daily-puzzle-video-rules.md before editing.
 * - Board is ALWAYS dead center, never moves between stages
 * - Nothing animates over the chess board
 * - Light bg, dark text
 * - Three zones: top (text), center (board), bottom (text/actions)
 *
 * Each frame has unique BOTTOM ZONE content. Top zone (logo + badge)
 * and board position are identical across all frames (except frame 3
 * which animates the solution moves on the board).
 */

import { useMemo, useState, useEffect, useCallback } from 'react';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess } from 'chess.js';
import { parseUciMove, uciToSan } from '@/lib/puzzle-utils';

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

// Logo dimensions: static rook + wordmark at scale=0.5
const LOGO_W = 215;
const LOGO_H = 60;

// Piece values for material counting
const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const PIECE_NAMES: Record<string, string> = { p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen' };

function getMaterialCount(fen: string) {
  const board = fen.split(' ')[0];
  let white = 0, black = 0;
  for (const ch of board) {
    const lower = ch.toLowerCase();
    if (PIECE_VALUES[lower] !== undefined) {
      if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) white += PIECE_VALUES[lower];
      else if (ch === ch.toLowerCase() && ch !== ch.toUpperCase()) black += PIECE_VALUES[lower];
    }
  }
  return { white, black };
}

function describeResult(startFen: string, finalFen: string, playerColor: 'white' | 'black', themes: string[]): string {
  // Check for checkmate from themes
  if (themes.some(t => t.includes('mate') || t.includes('Mate'))) {
    const mateTheme = themes.find(t => /mateIn(\d+)/i.test(t));
    if (mateTheme) {
      const n = mateTheme.match(/mateIn(\d+)/i)?.[1];
      return `Checkmate in ${n}!`;
    }
    return 'Checkmate!';
  }

  // Check final position
  const finalChess = new Chess(finalFen);
  if (finalChess.isCheckmate()) return 'Checkmate!';
  if (finalChess.isStalemate()) return 'Stalemate!';

  // Material difference
  const before = getMaterialCount(startFen);
  const after = getMaterialCount(finalFen);
  const playerBefore = playerColor === 'white' ? before.white - before.black : before.black - before.white;
  const playerAfter = playerColor === 'white' ? after.white - after.black : after.black - after.white;
  const gain = playerAfter - playerBefore;

  if (gain >= 9) return 'Won the Queen!';
  if (gain >= 5) return 'Won a Rook!';
  if (gain >= 3) return 'Won a Piece!';
  if (gain >= 1) return 'Won Material!';
  return 'Brilliant Move!';
}

function getProcessedPuzzle() {
  const chess = new Chess(DEMO_PUZZLE.rawFen);
  const setup = parseUciMove(DEMO_PUZZLE.rawMoves[0]);
  chess.move({ from: setup.from, to: setup.to, promotion: setup.promotion });

  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';

  // Get all SAN moves for the puzzle (including setup move applied from rawFen)
  const allSanMoves = uciToSan(DEMO_PUZZLE.rawFen, DEMO_PUZZLE.rawMoves);
  const solutionSanMoves = allSanMoves.slice(1);

  // Play through all moves to get final position
  const finalChess = new Chess(puzzleFen);
  for (const uci of DEMO_PUZZLE.rawMoves.slice(1)) {
    const { from, to, promotion } = parseUciMove(uci);
    try { finalChess.move({ from, to, promotion }); } catch { break; }
  }
  const finalFen = finalChess.fen();
  const result = describeResult(puzzleFen, finalFen, playerColor, DEMO_PUZZLE.themes);

  return {
    puzzleFen,
    finalFen,
    playerColor: playerColor as 'white' | 'black',
    solutionSanMoves,
    result,
  };
}

// ── Shared Components ───────────────────────────────────────

function ReelFrame({
  label,
  stageNum,
  children,
  active,
}: {
  label: string;
  stageNum: number;
  children: React.ReactNode;
  active?: boolean;
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
          border: '4px solid rgba(0,0,0,0.15)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// The board — same in every stage, never moves
function BoardSlot({
  fen,
  orientation,
}: {
  fen: string;
  orientation: 'white' | 'black';
}) {
  return (
    <div style={{ height: BOARD_SIZE }}>
      <div
        style={{ width: BOARD_SIZE, height: BOARD_SIZE, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        className="overflow-hidden"
      >
        <ChessPathBoard
          options={{
            position: fen,
            boardOrientation: orientation,
            boardStyle: { borderRadius: '0px' },
          }}
        />
      </div>
    </div>
  );
}

// Static rook icon + "chesspath" wordmark — no animation, no AnimatedLogo dependency.
// Block data copied from components/brand/AnimatedLogo.tsx BLOCKS array.
const ROOK_BLOCKS = [
  // Row 0: Crown points
  { x: 4, y: 8, color: '#1CB0F6' },
  { x: 40, y: 8, color: '#2FCBEF' },
  { x: 76, y: 8, color: '#A560E8' },
  // Row 1: Crown rim
  { x: 4, y: 26, color: '#58CC02' },
  { x: 22, y: 26, color: '#FFC800' },
  { x: 40, y: 26, color: '#FF9600' },
  { x: 58, y: 26, color: '#FF6B6B' },
  { x: 76, y: 26, color: '#FF4B4B' },
  // Row 2: Head
  { x: 22, y: 44, color: '#1CB0F6' },
  { x: 40, y: 44, color: '#2FCBEF' },
  { x: 58, y: 44, color: '#A560E8' },
  // Row 3: Neck
  { x: 22, y: 62, color: '#58CC02' },
  { x: 40, y: 62, color: '#FFC800' },
  { x: 58, y: 62, color: '#FF9600' },
  // Row 4: Body
  { x: 22, y: 80, color: '#FF6B6B' },
  { x: 40, y: 80, color: '#FF4B4B' },
  { x: 58, y: 80, color: '#1CB0F6' },
  // Row 5: Base
  { x: 4, y: 98, color: '#2FCBEF' },
  { x: 22, y: 98, color: '#A560E8' },
  { x: 40, y: 98, color: '#58CC02' },
  { x: 58, y: 98, color: '#FFC800' },
  { x: 76, y: 98, color: '#FF9600' },
];

const ROOK_SCALE = 0.5;
const ROOK_BLOCK_SIZE = 14 * ROOK_SCALE; // 7px
const ROOK_BLOCK_RADIUS = 2 * ROOK_SCALE; // 1px
const WORDMARK_LEFT = 110 * ROOK_SCALE; // 55px — more breathing room between rook and text
const WORDMARK_FONT_SIZE = 72 * ROOK_SCALE; // 36px

function ReelLogo() {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{ width: LOGO_W, height: LOGO_H }}
    >
      <div
        style={{
          position: 'relative',
          width: LOGO_W,
          height: 120 * ROOK_SCALE,
          fontFamily: "var(--font-body), 'DM Sans', system-ui, sans-serif",
          left: -4, // shift whole logo container slightly left to keep visually centered
        }}
      >
        {/* Rook icon blocks */}
        {ROOK_BLOCKS.map((block, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: block.x * ROOK_SCALE,
              top: block.y * ROOK_SCALE,
              width: ROOK_BLOCK_SIZE,
              height: ROOK_BLOCK_SIZE,
              borderRadius: ROOK_BLOCK_RADIUS,
              backgroundColor: block.color,
              boxShadow: `0 ${4 * ROOK_SCALE}px ${12 * ROOK_SCALE}px ${block.color}40`,
            }}
          />
        ))}

        {/* Wordmark: "chess" dark + "path" gradient */}
        <div
          style={{
            position: 'absolute',
            left: WORDMARK_LEFT,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: WORDMARK_FONT_SIZE,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#0F172A' }}>chess</span>
          <span
            style={{
              background:
                'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            path
          </span>
        </div>
      </div>
    </div>
  );
}

// Footer tagline — every stage
function FooterTagline() {
  return (
    <div className="text-center">
      <p className="text-chess-text font-bold text-[11px] tracking-wide">chesspath.app</p>
    </div>
  );
}

// ── 3D Layered Card Wrapper (scaled for 270px frames) ───────
const CARD_COLOR = '#58CC02';

function BottomCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-3" style={{ height: 56 }}>
      <div className="relative h-full">
        {/* Back depth layers (like /learn level cards) */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ backgroundColor: CARD_COLOR, transform: 'translate(5px, 5px)', opacity: 0.2 }}
        />
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ backgroundColor: CARD_COLOR, transform: 'translate(2.5px, 2.5px)', opacity: 0.4 }}
        />
        {/* Main card — light bg, green border, like level header */}
        <div
          className="absolute inset-0 rounded-2xl border-2 flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: 'var(--color-chess-bg-light)',
            borderColor: CARD_COLOR,
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          }}
        >
          {/* Corner accent triangle */}
          <div
            className="absolute top-0 right-0 w-12 h-12 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 50%, ${CARD_COLOR}20 50%)`,
              borderTopRightRadius: '1rem',
            }}
          />
          <div className="relative z-10 text-center px-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ── Bottom Zone Components (unique per stage) ───────────────

// Frame 1: "Can you find the solution?"
function BottomInitial() {
  return (
    <BottomCard>
      <p className="font-semibold text-[17px] tracking-tight text-white">
        Can you find the solution?
      </p>
      <p className="font-medium text-[11px] text-white/70">White to play</p>
    </BottomCard>
  );
}

// Frame 2: Animated countdown 3...2...1...
function BottomCountdown() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) return;
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  // Restart countdown when it finishes
  useEffect(() => {
    if (count === 0) {
      const restart = setTimeout(() => setCount(3), 2000);
      return () => clearTimeout(restart);
    }
  }, [count]);

  return (
    <BottomCard>
      <p className="font-semibold text-[18px] text-white" style={{ lineHeight: 1.1 }}>
        {count > 0 ? `Solution in ${count}` : 'GO!'}
      </p>
      <p className="font-normal text-[8px] text-white/50">(Tap Screen to Pause)</p>
    </BottomCard>
  );
}

// Frame 3: Solution moves with notation appearing one at a time
function BottomSolution({ sanMoves }: { sanMoves: string[] }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= sanMoves.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1200);
    return () => clearTimeout(timer);
  }, [visibleCount, sanMoves.length]);

  // Restart when done
  useEffect(() => {
    if (visibleCount >= sanMoves.length && sanMoves.length > 0) {
      const restart = setTimeout(() => setVisibleCount(0), 3000);
      return () => clearTimeout(restart);
    }
  }, [visibleCount, sanMoves.length]);

  // Format moves as numbered pairs: "1. Rxh5 gxh5 2. Qxh5 ..."
  const formatNotation = useCallback(() => {
    const visible = sanMoves.slice(0, visibleCount);
    let result = '';
    for (let i = 0; i < visible.length; i++) {
      if (i % 2 === 0) {
        // White move — add move number
        result += `${Math.floor(i / 2) + 1}. ${visible[i]} `;
      } else {
        // Black move
        result += `${visible[i]} `;
      }
    }
    return result.trim();
  }, [sanMoves, visibleCount]);

  return (
    <BottomCard>
      <p className="font-medium text-[9px] uppercase tracking-wider text-white/60">
        Solution
      </p>
      <p className="font-mono font-semibold text-[14px] text-white" style={{ letterSpacing: '0.02em' }}>
        {formatNotation() || '\u00A0'}
      </p>
    </BottomCard>
  );
}

// Result popup — overlays the board on frame 4
function ResultPopup({ result }: { result: string }) {
  return (
    <div
      className="rounded-2xl px-5 py-3 text-center"
      style={{
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <p className="font-bold text-[18px] text-white" style={{ lineHeight: 1.2 }}>
        {result}
      </p>
    </div>
  );
}

// Frame 4: Quip in bottom card
function BottomCelebrate() {
  return (
    <BottomCard>
      <p className="font-semibold text-[16px] italic text-white" style={{ lineHeight: 1.3 }}>
        &ldquo;That rook had places to be!&rdquo;
      </p>
    </BottomCard>
  );
}

// ── Reel Layout Shell ───────────────────────────────────────
// Enforces the 3-zone layout. Board position NEVER changes.
// Logo is rendered HERE — not in individual stages — so it never shifts.
function ReelLayout({
  fen,
  orientation,
  bottomContent,
  boardOverlay,
}: {
  fen: string;
  orientation: 'white' | 'black';
  bottomContent?: React.ReactNode;
  boardOverlay?: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      {/* TOP ZONE — absolute positioning so NOTHING shifts */}
      <div style={{ height: TOP_ZONE_H }} className="relative">
        {/* Logo — absolute, pixel-pinned, identical in every stage */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 8 }}>
          <ReelLogo />
        </div>
        {/* "Daily Puzzle" badge — pinned below logo, centered */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center justify-center px-3"
          style={{ top: 8 + LOGO_H, bottom: 0 }}
        >
          <span
            className="inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{
              background: 'linear-gradient(135deg, #58CC02 0%, #46a302 100%)',
              color: '#fff',
              boxShadow: '0 2px 6px rgba(88,204,2,0.3)',
            }}
          >
            Daily Puzzle
          </span>
        </div>
      </div>

      {/* BOARD — dead center, never moves */}
      <div className="relative">
        <BoardSlot fen={fen} orientation={orientation} />
        {boardOverlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            {boardOverlay}
          </div>
        )}
      </div>

      {/* BOTTOM ZONE */}
      <div
        style={{ height: BOTTOM_ZONE_H }}
        className="flex flex-col items-stretch pt-3 pb-2"
      >
        <div className="flex-1 flex items-center">{bottomContent}</div>
        <FooterTagline />
      </div>
    </div>
  );
}

// ── Solution Board (animates moves) ─────────────────────────
// Frame 3 needs its own board that steps through the solution moves
function SolutionReelLayout({
  startFen,
  orientation,
  solutionUciMoves,
  sanMoves,
}: {
  startFen: string;
  orientation: 'white' | 'black';
  solutionUciMoves: string[];
  sanMoves: string[];
}) {
  const [moveIndex, setMoveIndex] = useState(0);

  // Step through solution moves one at a time
  useEffect(() => {
    if (moveIndex >= solutionUciMoves.length) {
      // Restart after a pause
      const restart = setTimeout(() => setMoveIndex(0), 3000);
      return () => clearTimeout(restart);
    }
    const timer = setTimeout(() => setMoveIndex((m) => m + 1), 1200);
    return () => clearTimeout(timer);
  }, [moveIndex, solutionUciMoves.length]);

  // Calculate the current FEN after applying moveIndex moves
  const currentFen = useMemo(() => {
    const chess = new Chess(startFen);
    for (let i = 0; i < moveIndex && i < solutionUciMoves.length; i++) {
      const { from, to, promotion } = parseUciMove(solutionUciMoves[i]);
      try {
        chess.move({ from, to, promotion });
      } catch {
        break;
      }
    }
    return chess.fen();
  }, [startFen, moveIndex, solutionUciMoves]);

  return (
    <div className="h-full relative">
      {/* TOP ZONE — identical to other frames */}
      <div style={{ height: TOP_ZONE_H }} className="relative">
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 8 }}>
          <ReelLogo />
        </div>
        <div
          className="absolute left-0 right-0 flex flex-col items-center justify-center px-3"
          style={{ top: 8 + LOGO_H, bottom: 0 }}
        >
          <span
            className="inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{
              background: 'linear-gradient(135deg, #58CC02 0%, #46a302 100%)',
              color: '#fff',
              boxShadow: '0 2px 6px rgba(88,204,2,0.3)',
            }}
          >
            Daily Puzzle
          </span>
        </div>
      </div>

      {/* BOARD — animates through solution moves */}
      <BoardSlot fen={currentFen} orientation={orientation} />

      {/* BOTTOM ZONE */}
      <div
        style={{ height: BOTTOM_ZONE_H }}
        className="flex flex-col items-stretch pt-3 pb-2"
      >
        <div className="flex-1 flex items-center"><BottomSolution sanMoves={sanMoves} /></div>
        <FooterTagline />
      </div>
    </div>
  );
}

// ── Main Test Page ──────────────────────────────────────────
export default function TestDailyVideoPage() {
  const puzzle = useMemo(() => getProcessedPuzzle(), []);

  // Solution UCI moves (skip setup move at index 0)
  const solutionUciMoves = DEMO_PUZZLE.rawMoves.slice(1);

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <div className="text-center pt-10 pb-8 px-4">
        <h1 className="text-chess-text text-xl font-bold tracking-tight">
          Daily Puzzle Video Storyboard
        </h1>
        <p className="text-chess-text-muted text-sm mt-1">
          Instagram Reel &mdash; 9:16 &mdash; {FRAME_W}&times;{FRAME_H}px frames
        </p>
        <p className="text-chess-text-muted text-xs mt-2 italic">
          Each frame has unique bottom-zone content. Top zone + board are static.
        </p>
      </div>

      {/* 4 stage frames side by side */}
      <div className="flex gap-8 justify-center px-8 pb-10 overflow-x-auto">
        {/* Frame 1: Initial — "Can you find the solution?" */}
        <ReelFrame label="Initial" stageNum={1} active>
          <ReelLayout
            fen={puzzle.puzzleFen}
            orientation={puzzle.playerColor}
            bottomContent={<BottomInitial />}
          />
        </ReelFrame>

        {/* Frame 2: Countdown — 3...2...1...GO! */}
        <ReelFrame label="Countdown" stageNum={2} active>
          <ReelLayout
            fen={puzzle.puzzleFen}
            orientation={puzzle.playerColor}
            bottomContent={<BottomCountdown />}
          />
        </ReelFrame>

        {/* Frame 3: Solution — animated moves + notation */}
        <ReelFrame label="Solution" stageNum={3} active>
          <SolutionReelLayout
            startFen={puzzle.puzzleFen}
            orientation={puzzle.playerColor}
            solutionUciMoves={solutionUciMoves}
            sanMoves={puzzle.solutionSanMoves}
          />
        </ReelFrame>

        {/* Frame 4: Celebrate — result overlay + quip */}
        <ReelFrame label="Celebrate" stageNum={4} active>
          <ReelLayout
            fen={puzzle.finalFen}
            orientation={puzzle.playerColor}
            boardOverlay={<ResultPopup result={puzzle.result} />}
            bottomContent={<BottomCelebrate />}
          />
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
          </div>
        </div>
      </div>
    </div>
  );
}
