'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useUser } from '@/hooks/useUser';

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
          darkSquareStyle: { backgroundColor: '#779952' },
          lightSquareStyle: { backgroundColor: '#edeed1' },
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
        className="flex items-center gap-4 p-3 rounded-xl text-left transition-transform active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
      >
        <div className="rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          <AnimatedBoard size={80} speed={1800} />
        </div>
        <div>
          <div className="text-white/80 text-xs uppercase tracking-wide">Daily</div>
          <div className="text-white font-bold text-lg">Challenge</div>
          <div className="text-white/70 text-xs">5 min • 3 lives</div>
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
