'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useUser } from '@/hooks/useUser';
import { BOARD_COLORS } from '@/lib/puzzle-utils';

// SVG chess pieces - same style as chess rules / DailyChallengeReport
const PIECE_SVGS = {
  // White Knight
  N: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/></g></svg>`,
  // Black Knight
  n: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/><path d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z" fill="#fff" stroke="none"/></g></svg>`,
  // White Pawn
  P: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  // Black Pawn
  p: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

// Chess piece icon display for daily challenge card
function ChessPieceIcon({ piece, size = 48 }: { piece: keyof typeof PIECE_SVGS; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: PIECE_SVGS[piece] }}
    />
  );
}

// Animated board that plays through random moves
function AnimatedBoard({ size = 80, speed = 2000 }: { size?: number; speed?: number }) {
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
          darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
          lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, profile, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // Redirect to landing if not logged in
  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#131F24] p-4 flex flex-col gap-3">
      {/* Daily Challenge Card */}
      <button
        onClick={() => router.push('/daily-challenge')}
        className="flex items-center gap-5 p-4 rounded-xl text-left transition-transform active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
      >
        <div className="flex-shrink-0 flex items-center -space-x-3">
          <ChessPieceIcon piece="N" size={64} />
          <ChessPieceIcon piece="n" size={64} />
        </div>
        <div className="flex-1">
          <div className="text-white/80 text-sm uppercase tracking-wide font-medium">Daily</div>
          <div className="text-white font-bold text-2xl">Challenge</div>
          <div className="text-white/80 text-sm mt-1">5 min • 3 lives</div>
        </div>
      </button>

      {/* Learning Card */}
      <button
        onClick={() => router.push('/learn')}
        className="flex items-center gap-4 p-3 rounded-xl text-left transition-transform active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #58CC02, #2FCBEF)' }}
      >
        <div className="rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          <AnimatedBoard size={80} speed={2200} />
        </div>
        <div>
          <div className="text-white/80 text-xs uppercase tracking-wide">Learn</div>
          <div className="text-white font-bold text-lg">Learning Tree</div>
          <div className="text-white/70 text-xs">Structured lessons</div>
        </div>
      </button>

    </div>
  );
}
