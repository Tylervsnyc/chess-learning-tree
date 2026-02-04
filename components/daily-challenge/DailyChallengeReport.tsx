'use client';

import { useState } from 'react';

interface DailyChallengeReportProps {
  puzzlesSolved: number;
  totalPuzzles: number;
  timeMs: number;
  mistakes: number;
  rank?: number;
  totalParticipants?: number;
  highestPuzzleRating?: number;
  highestPuzzleFen?: string;
  variant?: 'card' | 'stories-1' | 'stories-2' | 'stories-3' | 'stories-4' | 'stories-5';
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatDate(): string {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

function getGlobalPercentage(rank: number, total: number): number {
  if (total <= 1) return 100;
  return Math.round(((total - rank) / total) * 100);
}

// SVG chess pieces - clean vector graphics that match react-chessboard style
const PIECE_SVGS: Record<string, string> = {
  // White pieces
  K: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
  Q: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>`,
  R: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>`,
  B: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>`,
  N: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/></g></svg>`,
  P: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  // Black pieces
  k: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9" stroke="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/></g></svg>`,
  q: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt"/><path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0" fill="none" stroke="#fff"/></g></svg>`,
  r: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" stroke-linecap="butt"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt"/><path d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/></g></svg>`,
  b: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter"/></g></svg>`,
  n: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/><path d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z" fill="#fff" stroke="none"/></g></svg>`,
  p: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

// Mini chessboard component - renders a FEN position with SVG pieces
function MiniBoard({ fen, size = 160 }: { fen: string; size?: number }) {
  const squareSize = size / 8;

  // Parse FEN to get piece positions
  const parseFen = (fen: string): (string | null)[][] => {
    const board: (string | null)[][] = [];
    const ranks = fen.split(' ')[0].split('/');

    for (const rank of ranks) {
      const row: (string | null)[] = [];
      for (const char of rank) {
        if (/\d/.test(char)) {
          for (let i = 0; i < parseInt(char); i++) {
            row.push(null);
          }
        } else {
          row.push(char);
        }
      }
      board.push(row);
    }
    return board;
  };

  const board = parseFen(fen);
  const lightSquare = '#edeed1';
  const darkSquare = '#779952';

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'grid',
        gridTemplateColumns: `repeat(8, ${squareSize}px)`,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      {board.map((row, rankIdx) =>
        row.map((piece, fileIdx) => {
          const isLight = (rankIdx + fileIdx) % 2 === 0;
          return (
            <div
              key={`${rankIdx}-${fileIdx}`}
              style={{
                width: squareSize,
                height: squareSize,
                backgroundColor: isLight ? lightSquare : darkSquare,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: squareSize * 0.05,
              }}
            >
              {piece && PIECE_SVGS[piece] && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  dangerouslySetInnerHTML={{ __html: PIECE_SVGS[piece] }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// Chess piece icon for display
function ChessPieceIcon({ piece, size = 48 }: { piece: string; size?: number }) {
  const svg = PIECE_SVGS[piece];
  if (!svg) return null;
  return (
    <div
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// Shared Logo component
function ChessPathLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="3" width="18" height="18" rx="4" fill="#4ade80"/>
      <rect x="63" y="3" width="18" height="18" rx="4" fill="#a78bfa"/>
      <rect x="39" y="27" width="18" height="18" rx="4" fill="#38bdf8"/>
      <rect x="63" y="27" width="18" height="18" rx="4" fill="#a78bfa"/>
      <rect x="15" y="51" width="18" height="18" rx="4" fill="#fb923c"/>
      <rect x="39" y="51" width="18" height="18" rx="4" fill="#f87171"/>
      <rect x="15" y="75" width="18" height="18" rx="4" fill="#fbbf24"/>
    </svg>
  );
}

// Standard card component (for in-app use)
function CardVariant({
  puzzlesSolved,
  totalPuzzles,
  timeMs,
  mistakes,
  rank,
  totalParticipants,
}: Omit<DailyChallengeReportProps, 'variant'>) {
  const [copied, setCopied] = useState(false);
  const globalPct = rank && totalParticipants ? getGlobalPercentage(rank, totalParticipants) : null;

  const generateShareText = () => {
    const lines = [
      `The Chess Path - Daily Challenge`,
      formatDate(),
      ``,
      `Solved ${puzzlesSolved} puzzles in ${formatTime(timeMs)}`,
    ];
    if (globalPct !== null) {
      lines.push(`Beat ${globalPct}% of players`);
    }
    lines.push(``, `chesspath.app/daily-challenge`);
    return lines.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative" style={{ paddingBottom: '6px', paddingRight: '3px' }}>
        <div
          className="absolute rounded-2xl"
          style={{ top: '6px', left: '3px', right: 0, bottom: 0, background: 'linear-gradient(135deg, #CC7700, #CC5555)' }}
        />
        <div className="relative rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ChessPathLogo size={24} />
                <span className="text-white font-bold text-sm">chesspath.app</span>
              </div>
              <span className="text-white/70 text-xs">{formatDate()}</span>
            </div>
            <div className="text-white/90 font-bold text-lg ml-8">Daily Challenge</div>
          </div>
          {/* Chess pieces */}
          <div className="flex justify-center items-center -space-x-2 mb-3">
            <ChessPieceIcon piece="N" size={56} />
            <ChessPieceIcon piece="n" size={56} />
          </div>
          <div className="text-center mb-4">
            <div className="text-4xl font-black text-white mb-1">
              {puzzlesSolved}<span className="text-xl text-white/60"> puzzles</span>
            </div>
            <div className="text-white/80 text-sm">in {formatTime(timeMs)}</div>
            {globalPct !== null && (
              <div className="text-white font-bold mt-2">Beat {globalPct}% of players</div>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}
          >
            {copied ? 'Copied!' : 'Copy Results'}
          </button>
        </div>
      </div>
    </div>
  );
}

// VERSION 1: Clean minimal - white text on dark
function Stories1({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleFen,
}: Omit<DailyChallengeReportProps, 'variant'>) {
  const globalPct = rank && totalParticipants ? getGlobalPercentage(rank, totalParticipants) : null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '270px',
        height: '480px',
        background: '#0D1A1F',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="relative h-full flex flex-col items-center justify-between py-8 px-5">
        {/* Header: Logo + Daily Challenge */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ChessPathLogo size={28} />
            <span className="text-white font-bold text-lg">Chess Path</span>
          </div>
          <div className="text-[#FF9600] font-semibold text-sm tracking-wide">Daily Challenge</div>
          <div className="text-gray-600 text-xs mt-1">{formatDate()}</div>
        </div>

        {/* Board */}
        {highestPuzzleFen && <MiniBoard fen={highestPuzzleFen} size={180} />}

        {/* Stats */}
        <div className="text-center">
          <div className="text-white font-black text-4xl">{puzzlesSolved} puzzles</div>
          <div className="text-gray-400 text-lg">in {formatTime(timeMs)}</div>

          {globalPct !== null && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-gray-400">Beat </span>
              <span className="text-[#58CC02] font-bold text-xl">{globalPct}%</span>
              <span className="text-gray-400"> of players</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// VERSION 2: Gradient card with orange accent
function Stories2({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleFen,
}: Omit<DailyChallengeReportProps, 'variant'>) {
  const globalPct = rank && totalParticipants ? getGlobalPercentage(rank, totalParticipants) : null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '270px',
        height: '480px',
        background: 'linear-gradient(180deg, #1A2C35 0%, #0D1A1F 100%)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #FF9600, #FF6B6B)' }} />

      <div className="relative h-full flex flex-col items-center justify-between py-7 px-5">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <ChessPathLogo size={24} />
            <div>
              <span className="text-white font-bold">chess</span>
              <span className="text-[#58CC02] font-bold">path</span>
            </div>
          </div>
          <div
            className="mt-2 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
          >
            <span className="text-white">DAILY CHALLENGE</span>
          </div>
        </div>

        {/* Board with subtle frame */}
        {highestPuzzleFen && (
          <div className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <MiniBoard fen={highestPuzzleFen} size={170} />
          </div>
        )}

        {/* Stats */}
        <div className="text-center w-full">
          <div
            className="py-4 px-6 rounded-xl mb-3"
            style={{ background: 'rgba(255,150,0,0.15)', border: '1px solid rgba(255,150,0,0.3)' }}
          >
            <div className="text-[#FF9600] font-black text-3xl">{puzzlesSolved} puzzles</div>
            <div className="text-[#FF9600]/70 text-sm">in {formatTime(timeMs)}</div>
          </div>

          {globalPct !== null && globalPct > 0 ? (
            <div>
              <span className="text-gray-500 text-sm">Beat </span>
              <span className="text-[#58CC02] font-bold text-lg">{globalPct}%</span>
              <span className="text-gray-500 text-sm"> of players</span>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              chesspath.app/daily-challenge
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// VERSION 3: Bold stacked typography
function Stories3({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleFen,
}: Omit<DailyChallengeReportProps, 'variant'>) {
  const globalPct = rank && totalParticipants ? getGlobalPercentage(rank, totalParticipants) : null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '270px',
        height: '480px',
        background: 'linear-gradient(180deg, #0D1A1F 0%, #162329 100%)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="relative h-full flex flex-col items-center justify-between py-6 px-5">
        {/* Header - stacked text */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChessPathLogo size={32} />
          </div>
          <div className="text-white font-black text-xl tracking-tight">CHESS PATH</div>
          <div
            className="text-sm font-bold tracking-widest"
            style={{ background: 'linear-gradient(90deg, #FF9600, #FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            DAILY CHALLENGE
          </div>
        </div>

        {/* Board */}
        {highestPuzzleFen && <MiniBoard fen={highestPuzzleFen} size={175} />}

        {/* Stats - big and bold */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span
              className="text-5xl font-black"
              style={{ background: 'linear-gradient(180deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {puzzlesSolved}
            </span>
            <span className="text-gray-500 text-lg font-medium">puzzles</span>
          </div>
          <div className="text-gray-500 text-base">{formatTime(timeMs)}</div>

          {globalPct !== null && (
            <div
              className="mt-4 inline-block px-5 py-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, #58CC02, #4CAF00)', boxShadow: '0 3px 0 #3d8c00' }}
            >
              <span className="text-white font-bold">Beat {globalPct}% of players</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// VERSION 4: Glassmorphism style
function Stories4({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleFen,
}: Omit<DailyChallengeReportProps, 'variant'>) {
  const globalPct = rank && totalParticipants ? getGlobalPercentage(rank, totalParticipants) : null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '270px',
        height: '480px',
        background: 'linear-gradient(135deg, #1a3a4a 0%, #0D1A1F 50%, #1a2a3a 100%)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="relative h-full flex flex-col items-center justify-between py-6 px-4">
        {/* Header card */}
        <div
          className="w-full rounded-2xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <ChessPathLogo size={24} />
            <span className="text-white font-bold">Chess Path</span>
          </div>
          <div className="text-[#FF9600] text-xs font-semibold tracking-wider">DAILY CHALLENGE</div>
        </div>

        {/* Board */}
        {highestPuzzleFen && <MiniBoard fen={highestPuzzleFen} size={168} />}

        {/* Stats card */}
        <div
          className="w-full rounded-2xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="text-white font-black text-3xl">{puzzlesSolved} puzzles</div>
          <div className="text-gray-400 mb-3">in {formatTime(timeMs)}</div>

          {globalPct !== null && (
            <div className="pt-3 border-t border-white/10">
              <span className="text-[#58CC02] font-bold text-lg">{globalPct}%</span>
              <span className="text-gray-400 text-sm"> of players beaten</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// VERSION 5: Vibrant with colored sections
function Stories5({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleFen,
}: Omit<DailyChallengeReportProps, 'variant'>) {
  const globalPct = rank && totalParticipants ? getGlobalPercentage(rank, totalParticipants) : null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '270px',
        height: '480px',
        background: '#0D1A1F',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="relative h-full flex flex-col">
        {/* Header section with gradient */}
        <div
          className="pt-5 pb-4 px-5 text-center"
          style={{ background: 'linear-gradient(180deg, rgba(255,150,0,0.2) 0%, transparent 100%)' }}
        >
          <div className="flex items-center justify-center gap-2">
            <ChessPathLogo size={28} />
            <div className="text-left">
              <div className="text-white font-bold text-sm leading-tight">Chess Path</div>
              <div className="text-[#FF9600] text-xs font-semibold">Daily Challenge</div>
            </div>
          </div>
        </div>

        {/* Board centered */}
        <div className="flex-1 flex items-center justify-center px-5">
          {highestPuzzleFen && <MiniBoard fen={highestPuzzleFen} size={185} />}
        </div>

        {/* Bottom stats section */}
        <div className="px-5 pb-6">
          <div
            className="rounded-xl p-4 text-center mb-3"
            style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)', boxShadow: '0 4px 0 #CC5555' }}
          >
            <div className="text-white font-black text-2xl">{puzzlesSolved} puzzles</div>
            <div className="text-white/80">in {formatTime(timeMs)}</div>
          </div>

          {globalPct !== null && (
            <div
              className="rounded-xl py-3 text-center"
              style={{ background: 'rgba(88,204,2,0.15)', border: '1px solid rgba(88,204,2,0.3)' }}
            >
              <span className="text-gray-400">Beat </span>
              <span className="text-[#58CC02] font-bold text-lg">{globalPct}%</span>
              <span className="text-gray-400"> of players</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DailyChallengeReport(props: DailyChallengeReportProps) {
  const { variant = 'card', ...rest } = props;

  switch (variant) {
    case 'stories-1':
      return <Stories1 {...rest} />;
    case 'stories-2':
      return <Stories2 {...rest} />;
    case 'stories-3':
      return <Stories3 {...rest} />;
    case 'stories-4':
      return <Stories4 {...rest} />;
    case 'stories-5':
      return <Stories5 {...rest} />;
    default:
      return <CardVariant {...rest} />;
  }
}
