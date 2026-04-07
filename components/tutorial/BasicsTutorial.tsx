'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess, Square } from 'chess.js';
import { BOARD_COLORS, getCheckmateSquareHighlights } from '@/lib/puzzle-utils';
import {
  playCorrectSound,
  playMoveSound,
  playCaptureSound,
  playErrorSound,
  playCelebrationSound,
  playButtonClick,
} from '@/lib/sounds';
import confetti from 'canvas-confetti';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { TutorialEvents } from '@/lib/analytics/posthog';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';

// ══════════════════════════════════════════════════
// PIECE ICONS (same SVG paths as /learn page buttons)
// ══════════════════════════════════════════════════

type PieceElement = { type: 'circle'; cx: number; cy: number; r: number } | { type: 'path'; d: string } | { type: 'polygon'; points: string };

const PIECE_PATHS: Record<string, { label: string; viewBox: string; elements: PieceElement[] }> = {
  king: {
    label: 'King',
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22.5 11.63V6M20 8h5' },
      { type: 'path', d: 'M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5' },
      { type: 'path', d: 'M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7' },
    ],
  },
  rook: {
    label: 'Rook',
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M9 39h27v-3H9v3zM12 36v-4h21v4H12zM14 29.5v-13h17v13H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11zM12.5 32l1.5-2.5h17l1.5 2.5z' },
    ],
  },
  bishop: {
    label: 'Bishop',
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z' },
      { type: 'path', d: 'M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z' },
      { type: 'circle', cx: 22.5, cy: 8, r: 3 },
    ],
  },
  queen: {
    label: 'Queen',
    viewBox: '0 0 45 45',
    elements: [
      { type: 'circle', cx: 6, cy: 12, r: 3 },
      { type: 'circle', cx: 14, cy: 9, r: 3 },
      { type: 'circle', cx: 22.5, cy: 8, r: 3 },
      { type: 'circle', cx: 31, cy: 9, r: 3 },
      { type: 'circle', cx: 39, cy: 12, r: 3 },
      { type: 'path', d: 'M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z' },
      { type: 'path', d: 'M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z' },
    ],
  },
  pawn: {
    label: 'Pawn',
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z' },
    ],
  },
  knight: {
    label: 'Knight',
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21' },
      { type: 'path', d: 'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3' },
    ],
  },
};

function renderPieceElements(pieceId: string, fill: string, transform?: string) {
  const data = PIECE_PATHS[pieceId];
  return data.elements.map((el, i) => {
    if (el.type === 'circle') {
      return <circle key={i} fill={fill} transform={transform} cx={el.cx} cy={el.cy} r={el.r} />;
    } else if (el.type === 'path') {
      return <path key={i} fill={fill} transform={transform} d={el.d} />;
    } else if (el.type === 'polygon') {
      return <polygon key={i} fill={fill} transform={transform} points={el.points} />;
    }
    return null;
  });
}

// Piece order for checklist display
const PIECE_ORDER = ['king', 'rook', 'bishop', 'queen', 'pawn', 'knight'];

// Convert FEN to position object for react-chessboard, optionally hiding pieces
// pieceType format: 'wK' = white king, 'bK' = black king, etc.
function fenToPosition(fen: string, hidePieces: string[] = []): Record<string, { pieceType: string }> {
  const position: Record<string, { pieceType: string }> = {};
  const rows = fen.split(' ')[0].split('/');
  const cols = 'abcdefgh';
  for (let r = 0; r < rows.length; r++) {
    let c = 0;
    for (const ch of rows[r]) {
      if (isNaN(Number(ch))) {
        const code = ch.toLowerCase() === ch ? `b${ch.toUpperCase()}` : `w${ch.toUpperCase()}`;
        if (!hidePieces.includes(code)) {
          position[`${cols[c]}${8 - r}`] = { pieceType: code };
        }
        c++;
      } else {
        c += Number(ch);
      }
    }
  }
  return position;
}

// ══════════════════════════════════════════════════
// ROOKIE SPEECH BUBBLE (matches landing page design)
// ══════════════════════════════════════════════════

function RookieSpeechBubble({ children, rookieSize = 0.65 }: {
  children: React.ReactNode;
  rookieSize?: number;
}) {
  return (
    <div className="w-full flex items-center gap-1">
      <div className="flex-shrink-0">
        <AnimatedLogo iconOnly size={rookieSize} perpetual />
      </div>
      {/* Triangle pointer */}
      <div
        className="flex-shrink-0"
        style={{
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '10px solid white',
          filter: 'drop-shadow(-1px 0 1px rgba(0,0,0,0.03))',
        }}
      />
      {/* Bubble */}
      <div
        className="flex-1 min-w-0 bg-white rounded-2xl px-4 py-3"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
      >
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// ROOKIE DIALOGUE
// ══════════════════════════════════════════════════

interface DialogueLine {
  text: string;
  buttonText: string;
  highlightPiece?: string; // piece id to highlight in checklist
  highlightSquares?: string[]; // squares to highlight gold on the board
}

const INTRO_DIALOGUE: DialogueLine[] = [
  {
    text: "This is my favorite game! I know it looks complicated, but I'll teach you how all the pieces move. It's my purpose!",
    buttonText: "Let's go!",
  },
  {
    text: "The most important piece is the King. If you lose him, you lose the game! Let's see how he moves.",
    buttonText: 'Show me',
    highlightPiece: 'king',
    highlightSquares: ['e1', 'e8'],
  },
];

// ══════════════════════════════════════════════════
// TUTORIAL DATA (King first!)
// ══════════════════════════════════════════════════

interface Exercise {
  type: 'tap' | 'move' | 'checkmate' | 'free';
  fen: string;
  targetSquare?: string; // not needed for 'free'
  fromSquare?: string;
  instruction: string;
  pieceType?: 'k' | 'r' | 'b' | 'q' | 'p' | 'n'; // which piece must be moved (for 'free')
}

interface TutorialStep {
  id: string;
  title: string;
  introText: string;
  rookieQuip: string;
  completeQuip: string; // Rookie's reaction when the user finishes this piece
  introFen: string;
  introPieceSquare?: string;
  exercises: Exercise[];
}

const STEPS: TutorialStep[] = [
  {
    id: 'king',
    title: 'The King',
    introText: 'Moves one square in any direction.',
    rookieQuip: "He's slow but he's the whole point. Protect this guy.",
    completeQuip: "You did it! I'm adding 'great teacher' to my resume.",
    introFen: '8/8/8/8/4K3/8/8/1k6 w - - 0 1',
    introPieceSquare: 'e4',
    exercises: [
      { type: 'free', fen: '8/8/8/8/4K3/8/8/1k6 w - - 0 1', pieceType: 'k', instruction: 'The King moves one square in any direction. Try it!' },
      { type: 'free', fen: '8/8/8/8/4K3/8/8/1k6 w - - 0 1', pieceType: 'k', instruction: 'Move him again! Any direction you want.' },
      { type: 'free', fen: '8/8/8/8/4K3/8/8/1k6 w - - 0 1', pieceType: 'k', instruction: 'One more time! You got this.' },
      { type: 'move', fen: '8/8/8/3p4/4K3/8/8/1k6 w - - 0 1', fromSquare: 'e4', targetSquare: 'd5', instruction: 'Kings capture the same way they move. Grab that pawn!' },
    ],
  },
  {
    id: 'rook',
    title: 'The Rook',
    introText: 'Moves in straight lines — up, down, left, right. As far as it wants!',
    rookieQuip: "This one's my favorite. Obviously.",
    completeQuip: "That's my favorite piece and you nailed it. I'm not crying, I'm just... buffering.",
    introFen: 'k7/8/8/8/3R4/8/8/7K w - - 0 1',
    introPieceSquare: 'd4',
    exercises: [
      { type: 'free', fen: 'k7/8/8/8/3R4/8/8/7K w - - 0 1', pieceType: 'r', instruction: 'The Rook moves in straight lines, as far as it wants. Try it!' },
      { type: 'free', fen: 'k7/8/8/8/3R4/8/8/7K w - - 0 1', pieceType: 'r', instruction: 'Move it again! Up, down, left, or right.' },
      { type: 'free', fen: 'k7/8/8/8/3R4/8/8/7K w - - 0 1', pieceType: 'r', instruction: 'One more! Send it anywhere.' },
      { type: 'move', fen: 'k7/3p4/8/8/8/8/8/3R3K w - - 0 1', fromSquare: 'd1', targetSquare: 'd7', instruction: 'Rooks capture by moving straight into an enemy piece. Take that pawn!' },
    ],
  },
  {
    id: 'bishop',
    title: 'The Bishop',
    introText: 'Moves diagonally — and stays on one color the whole game!',
    rookieQuip: "Diagonal only. Commitment issues? No. Dedication.",
    completeQuip: "Diagonal expert! I'd high-five you but I don't have hands.",
    introFen: 'k7/8/8/8/3B4/8/8/7K w - - 0 1',
    introPieceSquare: 'd4',
    exercises: [
      { type: 'free', fen: 'k7/8/8/8/3B4/8/8/7K w - - 0 1', pieceType: 'b', instruction: 'The Bishop moves diagonally, as far as it wants. Try it!' },
      { type: 'free', fen: 'k7/8/8/8/3B4/8/8/7K w - - 0 1', pieceType: 'b', instruction: 'Again! Notice it stays on one color.' },
      { type: 'free', fen: 'k7/8/8/8/3B4/8/8/7K w - - 0 1', pieceType: 'b', instruction: 'One more diagonal slide!' },
      { type: 'move', fen: 'k7/8/8/4p3/8/2B5/8/7K w - - 0 1', fromSquare: 'c3', targetSquare: 'e5', instruction: 'Bishops capture diagonally too. Snag that pawn!' },
    ],
  },
  {
    id: 'queen',
    title: 'The Queen',
    introText: 'The most powerful piece! Moves like a Rook AND Bishop combined.',
    rookieQuip: "She does everything. I'm not jealous. I'm not.",
    completeQuip: "You're a natural! I'm writing this down in my diary. I mean... log file.",
    introFen: 'k7/8/8/8/3Q4/8/8/7K w - - 0 1',
    introPieceSquare: 'd4',
    exercises: [
      { type: 'free', fen: 'k7/8/8/8/3Q4/8/8/7K w - - 0 1', pieceType: 'q', instruction: 'The Queen moves any direction, as far as she wants. Try it!' },
      { type: 'free', fen: 'k7/8/8/8/3Q4/8/8/7K w - - 0 1', pieceType: 'q', instruction: 'Move her again! Straight or diagonal.' },
      { type: 'free', fen: 'k7/8/8/8/3Q4/8/8/7K w - - 0 1', pieceType: 'q', instruction: 'One more! She can go anywhere.' },
      { type: 'move', fen: 'k7/4p3/8/8/4Q3/8/8/7K w - - 0 1', fromSquare: 'e4', targetSquare: 'e7', instruction: 'The Queen captures any direction she moves. Get that pawn!' },
    ],
  },
  {
    id: 'pawn',
    title: 'The Pawn',
    introText: 'Moves forward one square (or two on its first move). Captures diagonally!',
    rookieQuip: "Small but mighty. You get eight of these little guys.",
    completeQuip: "Eight pawns down, zero problems. I knew you could do it!",
    introFen: 'k7/8/8/8/8/3p1p2/4P3/7K w - - 0 1',
    introPieceSquare: 'e2',
    exercises: [
      { type: 'free', fen: 'k7/8/8/8/8/8/4P3/7K w - - 0 1', pieceType: 'p', instruction: 'Pawns move forward. On their first move they can go two squares! Try it.' },
      { type: 'free', fen: 'k7/8/8/8/8/8/4P3/7K w - - 0 1', pieceType: 'p', instruction: 'Move another pawn forward!' },
      { type: 'free', fen: 'k7/8/8/8/8/8/4P3/7K w - - 0 1', pieceType: 'p', instruction: 'One more push!' },
      { type: 'move', fen: 'k7/8/8/4p3/3P4/8/8/7K w - - 0 1', fromSquare: 'd4', targetSquare: 'e5', instruction: 'But pawns capture diagonally! Take that pawn!' },
    ],
  },
  {
    id: 'knight',
    title: 'The Knight',
    introText: "Moves in an L-shape — two squares one way, then one sideways. The only jumper!",
    rookieQuip: "The weird one. I respect that.",
    completeQuip: "You know all the pieces! Now are you ready to learn checkmate?",
    introFen: 'k7/8/8/8/3N4/8/8/7K w - - 0 1',
    introPieceSquare: 'd4',
    exercises: [
      { type: 'free', fen: 'k7/8/8/8/3N4/8/8/7K w - - 0 1', pieceType: 'n', instruction: 'The Knight moves in an L-shape. Two squares then one to the side. Try it!' },
      { type: 'free', fen: 'k7/8/8/8/3N4/8/8/7K w - - 0 1', pieceType: 'n', instruction: 'Move it again! L-shapes only.' },
      { type: 'free', fen: 'k7/8/8/8/3N4/8/8/7K w - - 0 1', pieceType: 'n', instruction: 'One more hop!' },
      { type: 'move', fen: 'k7/8/8/5p2/3N4/8/8/7K w - - 0 1', fromSquare: 'd4', targetSquare: 'f5', instruction: 'Knights capture by landing on the enemy. Hop on that pawn!' },
    ],
  },
  {
    id: 'checkmate',
    title: 'Checkmate!',
    introText: "When the King is attacked and can't escape, that's checkmate — you win!",
    rookieQuip: "This is the moment. I'm feeling something. Is this... excitement?",
    completeQuip: "",
    introFen: '6k1/5ppp/8/8/8/8/8/3Q3K w - - 0 1',
    introPieceSquare: 'd1',
    exercises: [
      { type: 'checkmate', fen: '6k1/5ppp/8/8/8/8/8/3Q3K w - - 0 1', fromSquare: 'd1', targetSquare: 'd8', instruction: 'Deliver checkmate! Move the Queen!' },
    ],
  },
];

// ══════════════════════════════════════════════════
// PIECE CHECKLIST
// ══════════════════════════════════════════════════

function PieceChecklist({ completedPieces, currentPiece }: {
  completedPieces: Set<string>;
  currentPiece: string | null;
}) {
  const size = 44;
  const depth = 4;

  return (
    <div className="flex items-center justify-center gap-2.5 px-2 py-2">
      {PIECE_ORDER.map((pieceId) => {
        const piece = PIECE_PATHS[pieceId];
        const isCompleted = completedPieces.has(pieceId);
        const isCurrent = currentPiece === pieceId;

        // Match /learn page: colored when active/complete, grey when locked
        let topColor: string;
        let bottomColor: string;
        let iconColor: string;

        if (isCompleted) {
          topColor = '#58CC02';
          bottomColor = '#46A302';
          iconColor = 'white';
        } else if (isCurrent) {
          topColor = '#1CB0F6';
          bottomColor = '#1899D6';
          iconColor = 'white';
        } else {
          topColor = '#E2E8F0';
          bottomColor = '#CBD5E1';
          iconColor = '#94A3B8';
        }

        return (
          <div
            key={pieceId}
            className="flex flex-col items-center gap-1"
          >
            {/* 3D circle button (same as /learn) */}
            <div
              className="relative transition-all duration-300"
              style={{ width: size + 2, height: size + depth }}
            >
              {/* Pulse ring for current piece */}
              {isCurrent && (
                <div
                  className="absolute rounded-full"
                  style={{
                    width: size + 8,
                    height: size + 8,
                    top: (depth - 8) / 2,
                    left: (2 - 8) / 2,
                    border: `3px solid ${topColor}`,
                    opacity: 0.6,
                    animation: 'checklistPulse 1.5s ease-in-out infinite',
                  }}
                />
              )}
              {/* Bottom shadow circle */}
              <div
                className="absolute rounded-full"
                style={{ width: size, height: size, top: depth, left: 1, backgroundColor: bottomColor }}
              />
              {/* Top circle with icon */}
              <div
                className="absolute rounded-full flex items-center justify-center"
                style={{ width: size, height: size, top: 0, left: 1, backgroundColor: topColor }}
              >
                {/* Long shadow + icon (same as /learn getIconLongShadow) */}
                <svg width={28} height={28} viewBox={piece.viewBox}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <g key={i} opacity={0.15 - i * 0.03}>
                      {renderPieceElements(pieceId, '#000', `translate(${(4 - i) * 0.8}, ${(4 - i) * 0.8})`)}
                    </g>
                  ))}
                  <g>{renderPieceElements(pieceId, iconColor)}</g>
                </svg>
              </div>
            </div>
            <span className={`text-[10px] font-bold transition-colors duration-300 ${
              isCompleted
                ? 'text-chess-green'
                : isCurrent
                  ? 'text-chess-blue'
                  : 'text-chess-text-faint'
            }`}>
              {piece.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════
// PROGRESS BAR HEADER
// ══════════════════════════════════════════════════

const TOTAL_SEGMENTS = INTRO_DIALOGUE.length + STEPS.length;

function TutorialHeader({ current, total, onBack }: { current: number; total: number; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 pt-3 pb-2 w-full max-w-lg mx-auto">
      {onBack ? (
        <button
          onClick={() => { playButtonClick(); onBack(); }}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-chess-text-muted hover:text-chess-text hover:bg-chess-surface transition-colors"
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : (
        <div className="w-8" />
      )}
      <ChessProgressBar current={current} total={total} className="flex-1" />
      <div className="w-8" />
    </div>
  );
}

// ══════════════════════════════════════════════════
// DONE SCREEN
// ══════════════════════════════════════════════════

function BasicsDoneScreen({ onContinue }: { onContinue: () => void }) {
  const [entered, setEntered] = useState(false);

  React.useEffect(() => {
    confetti({
      particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.65 },
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FFFFFF'],
      gravity: 1.2, ticks: 200,
    });
    confetti({
      particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.65 },
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FFFFFF'],
      gravity: 1.2, ticks: 200,
    });
    playCelebrationSound();

    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text flex flex-col">
      <style>{progressBarStyles}</style>
      <TutorialHeader current={TOTAL_SEGMENTS} total={TOTAL_SEGMENTS} />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1
          className="text-2xl font-black mb-4 text-center"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
          }}
        >
          You Know All The Pieces!
        </h1>

        <div
          className="w-full max-w-sm px-4 mb-4"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
          }}
        >
          <RookieSpeechBubble rookieSize={0.75}>
            <p className="font-bold text-chess-text leading-snug text-[15px]">
              I&apos;m experiencing what I think is called &quot;pride.&quot;
              My circuits feel warm. Is that normal?
            </p>
          </RookieSpeechBubble>
        </div>

        {/* Completed checklist */}
        <div
          className="mb-8"
          style={{
            opacity: entered ? 1 : 0,
            transition: 'opacity 0.5s ease 0.3s',
          }}
        >
          <PieceChecklist
            completedPieces={new Set(PIECE_ORDER)}
            currentPiece={null}
          />
        </div>

        <button
          onClick={onContinue}
          className="w-full max-w-sm py-4 font-bold text-lg rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] bg-chess-green"
          style={{
            boxShadow: '0 4px 0 var(--color-chess-green-dark)',
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
          }}
        >
          Start Learning
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════

export function BasicsTutorial() {
  const router = useRouter();
  useAudioWarmup();
  const trackedStartRef = useRef(false);

  React.useEffect(() => {
    if (!trackedStartRef.current) {
      trackedStartRef.current = true;
      TutorialEvents.tutorialStarted('basics');
    }
  }, []);

  // Intro dialogue state (board-first, Rookie talks below)
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);

  // Exercise state
  const [stepIndex, setStepIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentFen, setCurrentFen] = useState(STEPS[0].exercises[0].fen);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(false);
  const [shakeBoard, setShakeBoard] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [boardKey, setBoardKey] = useState(0);
  const completedCountRef = useRef(0);
  const prevSelectionSquaresRef = useRef<Square[]>([]);
  const advancingRef = useRef(false);

  // Track completed pieces for checklist
  const [completedPieces, setCompletedPieces] = useState<Set<string>>(new Set());
  // "Great job!" interstitial after completing a piece
  const [pieceCompleteId, setPieceCompleteId] = useState<string | null>(null);

  const currentStep = STEPS[stepIndex];
  const currentExercise = exerciseIndex >= 0 ? currentStep.exercises[exerciseIndex] : null;

  // Current piece for checklist highlight (skip 'checkmate' — not a piece)
  const currentPieceId = currentStep.id === 'checkmate' ? null : currentStep.id;

  const game = useMemo(() => {
    try {
      return new Chess(currentFen);
    } catch {
      return null;
    }
  }, [currentFen]);

  // Hide kings from board display (keep them in FEN for chess.js validation)
  // Also track which squares have hidden pieces so we block interaction with them
  const { displayPosition, hiddenSquares } = useMemo(() => {
    let hidePieces: string[];
    if (currentStep.id === 'king') {
      hidePieces = ['bK'];
    } else if (currentStep.id === 'checkmate') {
      hidePieces = [];
    } else {
      hidePieces = ['wK', 'bK'];
    }

    // Find squares of hidden pieces before filtering them out
    const hidden = new Set<string>();
    if (hidePieces.length > 0 && game) {
      const board = game.board();
      for (const row of board) {
        for (const cell of row) {
          if (!cell) continue;
          const code = cell.color === 'w' ? `w${cell.type.toUpperCase()}` : `b${cell.type.toUpperCase()}`;
          if (hidePieces.includes(code)) {
            hidden.add(cell.square);
          }
        }
      }
    }

    return {
      displayPosition: fenToPosition(currentFen, hidePieces),
      hiddenSquares: hidden,
    };
  }, [currentFen, currentStep.id, game]);

  // ── Intro navigation ──
  const handleDialogueNext = useCallback(() => {
    if (dialogueIndex < INTRO_DIALOGUE.length - 1) {
      setDialogueIndex(i => i + 1);
    } else {
      setIntroComplete(true);
    }
  }, [dialogueIndex]);

  const handleDialogueBack = useCallback(() => {
    if (dialogueIndex > 0) {
      setDialogueIndex(i => i - 1);
    }
  }, [dialogueIndex]);

  // ── Back button during exercises ──
  const handleExerciseBack = useCallback(() => {
    playButtonClick();
    if (exerciseIndex > 0) {
      const prevEx = currentStep.exercises[exerciseIndex - 1];
      setExerciseIndex(exerciseIndex - 1);
      setCurrentFen(prevEx.fen);
      setSelectedSquare(null);
      setExerciseComplete(false);
      setBoardKey(k => k + 1);
      setAnimationDuration(0);
    } else if (stepIndex > 0) {
      const prevStep = STEPS[stepIndex - 1];
      const lastExIdx = prevStep.exercises.length - 1;
      setStepIndex(stepIndex - 1);
      setExerciseIndex(lastExIdx);
      setCurrentFen(prevStep.exercises[lastExIdx].fen);
      setSelectedSquare(null);
      setExerciseComplete(false);
      setBoardKey(k => k + 1);
      setAnimationDuration(0);
    } else {
      setIntroComplete(false);
      setDialogueIndex(INTRO_DIALOGUE.length - 1);
    }
  }, [exerciseIndex, stepIndex, currentStep]);

  // ── Square highlight styles ──
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (currentExercise && !exerciseComplete) {
      const isFree = currentExercise.type === 'free';

      // Target square highlight (not for free exercises)
      if (!isFree && currentExercise.targetSquare) {
        styles[currentExercise.targetSquare] = {
          backgroundColor: 'rgba(0, 255, 100, 0.45)',
          boxShadow: 'inset 0 0 0 3px #00FF64, 0 0 20px rgba(0, 255, 100, 0.6), 0 0 40px rgba(0, 255, 100, 0.2)',
          animation: 'basicsTargetPulse 1.5s ease-in-out infinite',
        };
      }

      // From-square hint (not for free exercises)
      if (!isFree && currentExercise.fromSquare && currentExercise.type !== 'tap' && !selectedSquare) {
        styles[currentExercise.fromSquare] = {
          ...styles[currentExercise.fromSquare],
          boxShadow: 'inset 0 0 0 3px rgba(28, 176, 246, 0.7)',
          backgroundColor: 'rgba(28, 176, 246, 0.15)',
        };
      }

      // For free exercises, highlight the piece AND show all legal move dots
      if (isFree && !selectedSquare && game) {
        let pieceSquare: Square | null = null;
        const board = game.board();
        for (const row of board) {
          for (const cell of row) {
            if (cell && cell.color === 'w' && cell.type === currentExercise.pieceType) {
              pieceSquare = cell.square as Square;
              styles[pieceSquare] = {
                boxShadow: 'inset 0 0 0 3px rgba(28, 176, 246, 0.7)',
                backgroundColor: 'rgba(28, 176, 246, 0.15)',
              };
            }
          }
        }
        // Show legal move dots for the piece (auto-preview), skip hidden squares
        if (pieceSquare) {
          const moves = game.moves({ square: pieceSquare, verbose: true });
          for (const move of moves) {
            if (hiddenSquares.has(move.to)) continue;
            styles[move.to] = {
              ...styles[move.to],
              background: move.captured
                ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
                : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
            };
          }
        }
      }

      if (selectedSquare && game) {
        styles[selectedSquare] = {
          backgroundColor: 'rgba(100, 200, 255, 0.6)',
        };
        const currentSelectionSquares: Square[] = [selectedSquare];
        const moves = game.moves({ square: selectedSquare, verbose: true });
        for (const move of moves) {
          if (hiddenSquares.has(move.to)) continue;
          if (!isFree && move.to === currentExercise.targetSquare) continue;
          styles[move.to] = {
            ...styles[move.to],
            background: move.captured
              ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
              : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
          };
          currentSelectionSquares.push(move.to as Square);
        }
        prevSelectionSquaresRef.current = currentSelectionSquares;
      } else {
        for (const sq of prevSelectionSquaresRef.current) {
          if (!styles[sq]) {
            styles[sq] = {};
          }
        }
        prevSelectionSquaresRef.current = [];
      }
    }

    if (exerciseComplete && currentExercise && currentExercise.targetSquare) {
      if (currentExercise.type === 'checkmate' && game) {
        // Show attacked squares (red) and friendly-blocked squares (yellow) around the mated king
        const highlights = getCheckmateSquareHighlights(game, 'b');
        highlights.attackedSquares.forEach(sq => {
          styles[sq] = {
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            boxShadow: 'inset 0 0 0 3px rgba(255, 0, 0, 0.8), 0 0 12px rgba(255, 0, 0, 0.4)',
          };
        });
        highlights.blockedByFriendlySquares.forEach(sq => {
          styles[sq] = {
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            boxShadow: 'inset 0 0 0 3px rgba(255, 200, 0, 0.8), 0 0 12px rgba(255, 255, 0, 0.4)',
          };
        });
        // Red on the king itself
        const board = game.board();
        for (const row of board) {
          for (const cell of row) {
            if (cell && cell.color === 'b' && cell.type === 'k') {
              styles[cell.square] = {
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                boxShadow: 'inset 0 0 0 3px rgba(255, 0, 0, 0.8), 0 0 12px rgba(255, 0, 0, 0.4)',
              };
            }
          }
        }
      } else {
        styles[currentExercise.targetSquare] = {
          backgroundColor: 'rgba(88, 204, 2, 0.7)',
          boxShadow: 'inset 0 0 0 3px #58CC02, 0 0 18px rgba(88, 204, 2, 0.6)',
        };
      }
    }

    return styles;
  }, [exerciseIndex, currentStep, currentExercise, selectedSquare, game, exerciseComplete, hiddenSquares]);

  // ── Blue arrow ──
  const boardArrows = useMemo(() => {
    if (!currentExercise || exerciseComplete) return [];
    if (currentExercise.type === 'tap' || currentExercise.type === 'free' || !currentExercise.fromSquare || !currentExercise.targetSquare) return [];
    return [{ startSquare: currentExercise.fromSquare, endSquare: currentExercise.targetSquare, color: 'rgba(28, 176, 246, 0.85)' }];
  }, [currentExercise, exerciseComplete]);

  // ── Mini confetti burst (for completing each piece) ──
  const firePieceConfetti = useCallback(() => {
    confetti({
      particleCount: 40, angle: 60, spread: 50, origin: { x: 0.2, y: 0.5 },
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF'],
      gravity: 1.4, ticks: 120,
    });
    confetti({
      particleCount: 40, angle: 120, spread: 50, origin: { x: 0.8, y: 0.5 },
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF'],
      gravity: 1.4, ticks: 120,
    });
  }, []);

  // ── Advance (for non-free exercises) ──
  const advance = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    const step = STEPS[stepIndex];

    // Mark piece as completed when finishing its last exercise
    const isLastExercise = exerciseIndex === step.exercises.length - 1;
    if (isLastExercise) {
      if (step.id !== 'checkmate') {
        setCompletedPieces(prev => new Set([...prev, step.id]));
      }
      firePieceConfetti();
      // Show continue button instead of auto-advancing
      setPieceCompleteId(step.id);
      setTimeout(() => { advancingRef.current = false; }, 100);
      return;
    }

    if (exerciseIndex < step.exercises.length - 1) {
      const nextIdx = exerciseIndex + 1;
      const nextEx = step.exercises[nextIdx];
      setExerciseIndex(nextIdx);
      setCurrentFen(nextEx.fen);
      setSelectedSquare(null);
      setExerciseComplete(false);
    } else if (stepIndex < STEPS.length - 1) {
      TutorialEvents.tutorialStepCompleted('basics', step.id, stepIndex);
      const nextStep = STEPS[stepIndex + 1];
      setStepIndex(stepIndex + 1);
      setExerciseIndex(0);
      setCurrentFen(nextStep.exercises[0].fen);
      setSelectedSquare(null);
      setExerciseComplete(false);
    } else {
      TutorialEvents.tutorialStepCompleted('basics', step.id, stepIndex);
      TutorialEvents.tutorialCompleted('basics');
      setTutorialDone(true);
    }

    setBoardKey(k => k + 1);
    setAnimationDuration(0);
    setTimeout(() => { advancingRef.current = false; }, 100);
  }, [stepIndex, exerciseIndex, firePieceConfetti]);

  // ── Continue from "Great job!" interstitial ──
  const handlePieceCompleteContinue = useCallback(() => {
    playButtonClick();
    const step = STEPS[stepIndex];
    TutorialEvents.tutorialStepCompleted('basics', step.id, stepIndex);

    if (stepIndex < STEPS.length - 1) {
      const nextStep = STEPS[stepIndex + 1];
      setStepIndex(stepIndex + 1);
      setExerciseIndex(0);
      setCurrentFen(nextStep.exercises[0].fen);
      setSelectedSquare(null);
      setExerciseComplete(false);
      setBoardKey(k => k + 1);
      setAnimationDuration(0);
    } else {
      TutorialEvents.tutorialCompleted('basics');
      setTutorialDone(true);
    }
    setPieceCompleteId(null);
  }, [stepIndex]);

  // ── Advance free exercise (uninterrupted — carry FEN forward, no delay) ──
  const advanceFree = useCallback((newFen: string) => {
    const step = STEPS[stepIndex];
    if (exerciseIndex < step.exercises.length - 1) {
      const nextIdx = exerciseIndex + 1;
      const nextEx = step.exercises[nextIdx];
      setExerciseIndex(nextIdx);
      setSelectedSquare(null);

      if (nextEx.type === 'free') {
        // Keep the position from the user's move — force white to move
        const fenParts = newFen.split(' ');
        fenParts[1] = 'w';
        setCurrentFen(fenParts.join(' '));
      } else {
        // Moving to capture exercise — load its preset FEN + reset board
        setCurrentFen(nextEx.fen);
        setBoardKey(k => k + 1);
        setAnimationDuration(0);
      }
    }
  }, [stepIndex, exerciseIndex]);

  // ── Handle exercise success ──
  const handleExerciseSuccess = useCallback(() => {
    if (exerciseComplete) return;
    setExerciseComplete(true);
    playCorrectSound(completedCountRef.current);
    completedCountRef.current += 1;

    setTimeout(() => advance(), 900);
  }, [advance, exerciseComplete]);

  // ── Board shake ──
  const triggerShake = useCallback(() => {
    setShakeBoard(true);
    setTimeout(() => setShakeBoard(false), 400);
  }, []);

  // ── Handle square click ──
  const handleSquareClick = useCallback(({ square }: { piece: unknown; square: string }) => {
    if (!currentExercise || exerciseComplete) return;
    const sq = square as Square;

    // Block interaction with hidden king squares
    if (hiddenSquares.has(sq)) return;

    if (currentExercise.type === 'tap') {
      if (sq === currentExercise.targetSquare) {
        handleExerciseSuccess();
      }
      return;
    }

    if (!game) return;

    if (!selectedSquare) {
      const piece = game.get(sq);
      if (piece && piece.color === 'w') {
        // For free exercises, only allow selecting the correct piece type
        if (currentExercise.type === 'free' && piece.type !== currentExercise.pieceType) return;
        setSelectedSquare(sq);
      }
      return;
    }

    if (selectedSquare === sq) {
      setSelectedSquare(null);
      return;
    }

    const legalMoves = game.moves({ square: selectedSquare, verbose: true });
    const isLegal = legalMoves.some(m => m.to === sq && !hiddenSquares.has(m.to));

    if (!isLegal) {
      const piece = game.get(sq);
      if (piece && piece.color === 'w') {
        setSelectedSquare(sq);
      } else {
        setSelectedSquare(null);
      }
      return;
    }

    // Free exercises: accept any legal move with the correct piece (uninterrupted)
    if (currentExercise.type === 'free') {
      const piece = game.get(selectedSquare);
      if (!piece || piece.type !== currentExercise.pieceType) {
        playErrorSound();
        triggerShake();
        setSelectedSquare(null);
        return;
      }
      setAnimationDuration(200);
      try {
        const gameCopy = new Chess(currentFen);
        const move = gameCopy.move({ from: selectedSquare, to: sq, promotion: 'q' });
        if (move) {
          const newFen = gameCopy.fen();
          setCurrentFen(newFen);
          setSelectedSquare(null);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          // Advance immediately, carry position forward
          advanceFree(newFen);
        }
      } catch { /* ignore */ }
      return;
    }

    if (sq === currentExercise.targetSquare) {
      setAnimationDuration(200);
      try {
        const gameCopy = new Chess(currentFen);
        const move = gameCopy.move({ from: selectedSquare, to: sq, promotion: 'q' });
        if (move) {
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          handleExerciseSuccess();
        }
      } catch { /* ignore */ }
    } else {
      playErrorSound();
      triggerShake();
      setSelectedSquare(null);
    }
  }, [game, currentExercise, currentFen, selectedSquare, exerciseComplete, handleExerciseSuccess, advanceFree, hiddenSquares, triggerShake]);

  // ── Handle piece drop ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePieceDrop = useCallback((args: any) => {
    if (!currentExercise || exerciseComplete || currentExercise.type === 'tap') return false;
    if (!game) return false;

    const from = args.sourceSquare as Square;
    const to = args.targetSquare as Square;

    // Block drops onto hidden king squares
    if (hiddenSquares.has(to)) return false;

    const legalMoves = game.moves({ square: from, verbose: true });
    const isLegal = legalMoves.some(m => m.to === to);
    if (!isLegal) return false;

    // Free exercises: accept any legal move with the correct piece (uninterrupted)
    if (currentExercise.type === 'free') {
      const piece = game.get(from);
      if (!piece || piece.type !== currentExercise.pieceType) {
        playErrorSound();
        triggerShake();
        return false;
      }
      setAnimationDuration(200);
      try {
        const gameCopy = new Chess(currentFen);
        const move = gameCopy.move({ from, to, promotion: 'q' });
        if (move) {
          const newFen = gameCopy.fen();
          setCurrentFen(newFen);
          setSelectedSquare(null);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          advanceFree(newFen);
          return true;
        }
      } catch { /* ignore */ }
      return false;
    }

    if (to === currentExercise.targetSquare) {
      setAnimationDuration(200);
      try {
        const gameCopy = new Chess(currentFen);
        const move = gameCopy.move({ from, to, promotion: 'q' });
        if (move) {
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          handleExerciseSuccess();
          return true;
        }
      } catch { /* ignore */ }
    }

    playErrorSound();
    triggerShake();
    return false;
  }, [game, currentExercise, currentFen, exerciseComplete, handleExerciseSuccess, advanceFree, hiddenSquares, triggerShake]);

  // ══════════════════════════════════════════════════
  // RENDER: INTRO (board-first with Rookie dialogue)
  // ══════════════════════════════════════════════════

  if (!introComplete) {
    const dialogue = INTRO_DIALOGUE[dialogueIndex];

    // Gold highlight on squares when introducing a piece
    const introSquareStyles: Record<string, React.CSSProperties> = {};
    if (dialogue.highlightSquares) {
      for (const sq of dialogue.highlightSquares) {
        introSquareStyles[sq] = {
          backgroundColor: 'rgba(255, 215, 0, 0.5)',
          boxShadow: 'inset 0 0 0 3px #FFD700, 0 0 16px rgba(255, 215, 0, 0.5)',
          animation: 'goldPulse 1.5s ease-in-out infinite',
        };
      }
    }

    return (
      <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
        <style>{progressBarStyles}</style>
        <TutorialHeader
          current={dialogueIndex}
          total={TOTAL_SEGMENTS}
          onBack={dialogueIndex > 0 ? handleDialogueBack : undefined}
        />

        <div className="flex-1 flex flex-col items-center px-4 overflow-auto">
          <div className="w-full max-w-lg flex-shrink-0">
            {/* Board + popup wrapper */}
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}>
              <ChessPathBoard
                key={`intro-${dialogueIndex}`}
                options={{
                  position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                  boardOrientation: 'white' as const,
                  allowDragging: false,
                  animationDurationInMs: 0,
                  boardStyle: { borderRadius: '0' },
                  squareStyles: introSquareStyles,
                  darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                  lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
                }}
              />

              {/* Popup directly under board */}
              <div
                key={`dialogue-${dialogueIndex}`}
                className="w-full bg-chess-correct-bg py-2.5 px-4"
                style={{ animation: 'basicsSlideUp 0.3s ease-out' }}
              >
              <div className="flex items-center gap-3 mb-2.5">
                <div className="flex-shrink-0">
                  <AnimatedLogo iconOnly size={0.45} perpetual />
                </div>
                <p className="font-bold text-[15px] leading-snug text-chess-green-dark flex-1">
                  &ldquo;{dialogue.text}&rdquo;
                </p>
              </div>

              <button
                onClick={() => { playButtonClick(); handleDialogueNext(); }}
                className="w-full py-1.5 font-bold text-[13px] rounded-xl text-white uppercase tracking-wide transition-all active:translate-y-[1px] bg-chess-green shadow-[0_3px_0_var(--color-chess-green-dark)] active:shadow-[0_2px_0_var(--color-chess-green-dark)]"
              >
                {dialogue.buttonText}
              </button>
            </div>
            </div>{/* end board+popup wrapper */}

            {/* Piece checklist below popup */}
            <div className="mt-3">
              <PieceChecklist
                completedPieces={completedPieces}
                currentPiece={dialogue.highlightPiece || null}
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes basicsSlideUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes goldPulse {
            0%, 100% { box-shadow: inset 0 0 0 3px #FFD700, 0 0 16px rgba(255, 215, 0, 0.5); }
            50% { box-shadow: inset 0 0 0 3px #FFD700, 0 0 28px rgba(255, 215, 0, 0.8); }
          }
          @keyframes checklistPulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 0.3; }
          }
        `}</style>
      </div>
    );
  }

  // ══════════════════════════════════════════════════
  // RENDER: DONE SCREEN
  // ══════════════════════════════════════════════════

  if (tutorialDone) {
    return <BasicsDoneScreen onContinue={() => {
      try { localStorage.setItem('chess_path_onboarded', 'true'); } catch {}
      router.push('/lesson/1.1.1?from=onboarding');
    }} />;
  }

  // ══════════════════════════════════════════════════
  // RENDER: EXERCISE VIEW
  // ══════════════════════════════════════════════════

  const boardInteractive = !exerciseComplete && !pieceCompleteId;
  const progressCurrent = INTRO_DIALOGUE.length + stepIndex;

  return (
    <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
      <TutorialHeader
        current={progressCurrent}
        total={TOTAL_SEGMENTS}
        onBack={handleExerciseBack}
      />
      <div className="flex-1 flex flex-col items-center px-4 overflow-auto">
        <div className="w-full max-w-lg flex-shrink-0">
          {/* Board + popup wrapper */}
          <div className={`rounded-2xl overflow-hidden ${shakeBoard ? 'basics-shake' : ''}`} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}>
            <ChessPathBoard
              key={boardKey}
              options={{
                position: displayPosition,
                boardOrientation: 'white' as const,
                onSquareClick: boardInteractive ? handleSquareClick : undefined,
                onPieceDrop: boardInteractive ? handlePieceDrop : undefined,
                allowDragging: boardInteractive && currentExercise?.type !== 'tap',
                squareStyles,
                arrows: boardArrows,
                animationDurationInMs: animationDuration,
                draggingPieceGhostStyle: { opacity: 1 },
                boardStyle: { borderRadius: '0' },
                darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
              }}
            />

            {/* Popup directly under board */}
            {pieceCompleteId ? (
              <div
                key={`complete-${pieceCompleteId}`}
                className="w-full bg-chess-correct-bg py-2.5 px-4"
                style={{ animation: 'basicsSlideUpBounce 0.3s ease-out' }}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="flex-shrink-0">
                    <AnimatedLogo iconOnly size={0.4} perpetual />
                  </div>
                  <p className="font-bold text-[15px] leading-tight flex-1 text-chess-green-dark">
                    &ldquo;{pieceCompleteId === 'checkmate'
                      ? "That's checkmate! The King has nowhere to run. Red squares are attacked, yellow squares are blocked by his own pieces. Game over!"
                      : currentStep.completeQuip
                    }&rdquo;
                  </p>
                </div>
                <button
                  onClick={handlePieceCompleteContinue}
                  className="w-full py-1.5 font-bold text-[13px] rounded-xl text-white uppercase tracking-wide transition-all active:translate-y-[1px] bg-chess-green shadow-[0_3px_0_var(--color-chess-green-dark)] active:shadow-[0_2px_0_var(--color-chess-green-dark)]"
                >
                  Continue
                </button>
              </div>
            ) : currentExercise ? (
              <div
                key={`ex-${stepIndex}-${exerciseIndex}`}
                className="w-full bg-chess-correct-bg py-2.5 px-4"
                style={{
                  animation: exerciseComplete ? 'basicsSlideUpBounce 0.3s ease-out' : 'basicsSlideUp 0.3s ease-out',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <AnimatedLogo iconOnly size={0.4} perpetual />
                  </div>
                  <p className="font-bold text-[15px] leading-tight flex-1 text-chess-green-dark">
                    &ldquo;{exerciseComplete ? 'Nice!' : currentExercise.instruction}&rdquo;
                  </p>
                </div>
              </div>
            ) : null}
          </div>{/* end board+popup wrapper */}

          {/* Piece checklist below popup */}
          <div className="mt-3">
            <PieceChecklist
              completedPieces={completedPieces}
              currentPiece={currentPieceId}
            />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{progressBarStyles}</style>
      <style jsx>{`
        @keyframes basicsSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes basicsSlideUpBounce {
          0% { opacity: 0; transform: translateY(20px); }
          70% { transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .basics-shake {
          animation: basicsShake 0.4s ease-in-out;
        }
        @keyframes basicsShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes basicsTargetPulse {
          0%, 100% { box-shadow: inset 0 0 0 3px #00FF64, 0 0 20px rgba(0, 255, 100, 0.6), 0 0 40px rgba(0, 255, 100, 0.2); }
          50% { box-shadow: inset 0 0 0 3px #00FF64, 0 0 30px rgba(0, 255, 100, 0.9), 0 0 60px rgba(0, 255, 100, 0.4); }
        }
        @keyframes checklistPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
