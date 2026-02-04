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

// Mini chessboard component - renders a FEN position
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

  // Unicode chess pieces
  const pieceToUnicode: Record<string, string> = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
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
                fontSize: squareSize * 0.75,
                lineHeight: 1,
              }}
            >
              {piece && (
                <span style={{
                  color: piece === piece.toUpperCase() ? '#fff' : '#000',
                  textShadow: piece === piece.toUpperCase()
                    ? '0 1px 2px rgba(0,0,0,0.5)'
                    : '0 1px 2px rgba(255,255,255,0.3)',
                }}>
                  {pieceToUnicode[piece]}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
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
    lines.push(``, `chesspath.com/daily-challenge`);
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChessPathLogo size={24} />
              <span className="text-white/90 font-bold text-sm">Daily Challenge</span>
            </div>
            <span className="text-white/70 text-xs">{formatDate()}</span>
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

// VERSION 1: Board prominent at top
function Stories1({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleRating,
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
      <div className="relative h-full flex flex-col items-center py-6 px-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <ChessPathLogo size={32} />
          <div>
            <div className="text-sm font-bold">
              <span className="text-white">chess</span>
              <span className="bg-gradient-to-r from-[#4ade80] via-[#38bdf8] to-[#a78bfa] bg-clip-text text-transparent">path</span>
            </div>
            <div className="text-[10px] text-gray-500">{formatDate()}</div>
          </div>
        </div>

        {/* Chess board */}
        {highestPuzzleFen && (
          <div className="mb-4">
            <MiniBoard fen={highestPuzzleFen} size={180} />
            {highestPuzzleRating && (
              <div className="text-center mt-2">
                <span className="text-[#A560E8] font-bold text-lg">{highestPuzzleRating}</span>
                <span className="text-gray-500 text-xs ml-1">rated puzzle</span>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div
          className="w-full rounded-xl p-4 text-center"
          style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)', boxShadow: '0 4px 0 #CC5555' }}
        >
          <div className="text-white text-sm mb-1">Solved</div>
          <div className="text-white font-black text-3xl">{puzzlesSolved} puzzles</div>
          <div className="text-white/80 text-sm">in {formatTime(timeMs)}</div>
        </div>

        {/* Global percentage */}
        {globalPct !== null && (
          <div className="mt-4 text-center">
            <div className="text-gray-400 text-xs">GLOBAL RANKING</div>
            <div className="text-white font-bold text-xl">Top {100 - globalPct}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

// VERSION 2: Board in center, stats around it
function Stories2({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleRating,
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
      <div className="relative h-full flex flex-col items-center justify-between py-6 px-5">
        {/* Top: Branding + Date */}
        <div className="text-center">
          <div
            className="inline-block px-3 py-1 rounded-lg text-xs font-black tracking-wider mb-2"
            style={{ background: 'linear-gradient(135deg, rgba(255,150,0,0.3), rgba(255,107,107,0.3))', border: '1px solid rgba(255,150,0,0.5)', color: '#FF9600' }}
          >
            DAILY CHALLENGE
          </div>
          <div className="text-gray-500 text-xs">{formatDate()}</div>
        </div>

        {/* Center: Board with rating badge */}
        <div className="relative">
          {highestPuzzleFen && <MiniBoard fen={highestPuzzleFen} size={160} />}
          {highestPuzzleRating && (
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #A560E8, #7C3AED)', color: 'white' }}
            >
              {highestPuzzleRating} Elo
            </div>
          )}
        </div>

        {/* Bottom: Stats */}
        <div className="w-full text-center">
          <div
            className="inline-block px-6 py-3 rounded-xl mb-3"
            style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)', boxShadow: '0 4px 0 #CC5555' }}
          >
            <div className="text-white font-black text-2xl">{puzzlesSolved} puzzles</div>
            <div className="text-white/80 text-sm">in {formatTime(timeMs)}</div>
          </div>

          {globalPct !== null && (
            <div className="flex items-center justify-center gap-1">
              <span className="text-gray-400 text-sm">Beat</span>
              <span className="text-[#58CC02] font-bold text-lg">{globalPct}%</span>
              <span className="text-gray-400 text-sm">of players</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-2">
            <ChessPathLogo size={20} />
            <span className="text-gray-500 text-xs">chesspath.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// VERSION 3: Split layout - board left info right (portrait optimized)
function Stories3({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleRating,
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
      {/* Orange accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #FF9600, #FF6B6B)' }} />

      <div className="relative h-full flex flex-col py-6 px-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChessPathLogo size={28} />
            <div className="text-xs font-bold">
              <span className="text-white">chess</span>
              <span className="text-[#58CC02]">path</span>
            </div>
          </div>
          <div className="text-gray-500 text-[10px]">{formatDate()}</div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Big number */}
          <div
            className="text-7xl font-black mb-2"
            style={{ background: 'linear-gradient(180deg, #FF9600, #FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {puzzlesSolved}
          </div>
          <div className="text-gray-400 text-sm mb-4">puzzles in {formatTime(timeMs)}</div>

          {/* Board */}
          {highestPuzzleFen && (
            <div className="relative mb-4">
              <MiniBoard fen={highestPuzzleFen} size={140} />
            </div>
          )}

          {/* Rating */}
          {highestPuzzleRating && (
            <div className="text-center mb-2">
              <div className="text-gray-500 text-xs">HARDEST PUZZLE</div>
              <div className="text-[#A560E8] font-bold text-xl">{highestPuzzleRating}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        {globalPct !== null && (
          <div
            className="w-full py-3 rounded-xl text-center"
            style={{ background: 'rgba(88,204,2,0.15)', border: '1px solid rgba(88,204,2,0.3)' }}
          >
            <span className="text-[#58CC02] font-bold">Top {100 - globalPct}%</span>
            <span className="text-gray-400 text-sm"> globally</span>
          </div>
        )}
      </div>
    </div>
  );
}

// VERSION 4: Minimal with board focus
function Stories4({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleRating,
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
      <div className="relative h-full flex flex-col items-center justify-center py-6 px-5">
        {/* Logo small */}
        <div className="absolute top-5 left-5">
          <ChessPathLogo size={24} />
        </div>
        <div className="absolute top-6 right-5 text-gray-600 text-[10px]">{formatDate()}</div>

        {/* Central board - large */}
        {highestPuzzleFen && (
          <div className="mb-6">
            <MiniBoard fen={highestPuzzleFen} size={200} />
          </div>
        )}

        {/* Stats below board */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span
              className="text-5xl font-black"
              style={{ background: 'linear-gradient(180deg, #FF9600, #FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {puzzlesSolved}
            </span>
            <span className="text-gray-500 text-lg">in {formatTime(timeMs)}</span>
          </div>

          {highestPuzzleRating && (
            <div className="text-gray-500 text-sm mb-3">
              Best: <span className="text-[#A560E8] font-bold">{highestPuzzleRating}</span> rated
            </div>
          )}

          {globalPct !== null && (
            <div
              className="inline-block px-4 py-2 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
            >
              <span className="text-white font-bold">Beat {globalPct}% of players</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// VERSION 5: Card stack style with board
function Stories5({
  puzzlesSolved,
  timeMs,
  rank,
  totalParticipants,
  highestPuzzleRating,
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
      <div className="relative h-full flex flex-col items-center py-5 px-4">
        {/* Top card: Branding */}
        <div
          className="w-full rounded-xl p-3 mb-3 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2">
            <ChessPathLogo size={28} />
            <div>
              <div className="text-xs font-bold text-white">Daily Challenge</div>
              <div className="text-[10px] text-gray-500">{formatDate()}</div>
            </div>
          </div>
          {globalPct !== null && (
            <div className="text-right">
              <div className="text-[#58CC02] font-bold text-sm">Top {100 - globalPct}%</div>
              <div className="text-gray-500 text-[10px]">global</div>
            </div>
          )}
        </div>

        {/* Middle: Board card */}
        <div
          className="w-full rounded-xl p-3 mb-3 flex flex-col items-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {highestPuzzleFen && <MiniBoard fen={highestPuzzleFen} size={150} />}
          {highestPuzzleRating && (
            <div className="mt-2 text-center">
              <span className="text-gray-500 text-xs">Hardest solved: </span>
              <span className="text-[#A560E8] font-bold">{highestPuzzleRating}</span>
            </div>
          )}
        </div>

        {/* Bottom: Stats card */}
        <div
          className="w-full rounded-xl p-4 text-center"
          style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)', boxShadow: '0 4px 0 #CC5555' }}
        >
          <div className="text-white/80 text-xs uppercase tracking-wider mb-1">Results</div>
          <div className="text-white font-black text-3xl mb-1">{puzzlesSolved} puzzles</div>
          <div className="text-white/80">in {formatTime(timeMs)}</div>
        </div>

        {/* Footer */}
        <div className="mt-auto text-gray-600 text-[10px]">chesspath.com/daily-challenge</div>
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
