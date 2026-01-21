'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LEVEL_CONFIG = {
  beginner: { label: 'Beginner', color: '#58CC02', emoji: '🌱', firstLesson: '1.1.1' },
  casual: { label: 'Casual', color: '#1CB0F6', emoji: '⚡', firstLesson: '2.1.1' },
  club: { label: 'Club Player', color: '#FF9600', emoji: '🔥', firstLesson: '3.1.1' },
  tournament: { label: 'Tournament', color: '#FF4B4B', emoji: '💪', firstLesson: '4.1.1' },
  advanced: { label: 'Advanced', color: '#A560E8', emoji: '🎯', firstLesson: '5.1.1' },
  expert: { label: 'Expert', color: '#FFC800', emoji: '👑', firstLesson: '6.1.1' },
};

function EpicConfetti() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    size: number;
    type: 'confetti' | 'star' | 'circle';
    duration: number;
    wobble: number;
  }>>([]);

  useEffect(() => {
    const colors = ['#58CC02', '#1CB0F6', '#FF9600', '#FFC800', '#FF4B4B', '#A560E8', '#fff'];
    const types: Array<'confetti' | 'star' | 'circle'> = ['confetti', 'confetti', 'confetti', 'star', 'circle'];

    // Create massive confetti explosion - 200 particles in waves
    const newParticles = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2, // Stagger over 2 seconds for waves
      size: 4 + Math.random() * 12,
      type: types[Math.floor(Math.random() * types.length)],
      duration: 2.5 + Math.random() * 2, // Varied fall speeds
      wobble: Math.random() * 30 - 15, // Random wobble
    }));
    setParticles(newParticles);

    // Play celebration sound
    try {
      const audio = new Audio('/sounds/celebration.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute confetti-particle"
          style={{
            left: `${p.x}%`,
            top: -30,
            width: p.size,
            height: p.type === 'confetti' ? p.size * 0.6 : p.size,
            backgroundColor: p.type !== 'star' ? p.color : 'transparent',
            borderRadius: p.type === 'circle' ? '50%' : p.type === 'confetti' ? '2px' : '0',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: p.type === 'star' ? `0 0 ${p.size}px ${p.color}` : 'none',
            ['--wobble' as string]: `${p.wobble}deg`,
          }}
        >
          {p.type === 'star' && (
            <span style={{ color: p.color, fontSize: p.size * 1.5 }}>✦</span>
          )}
        </div>
      ))}
      <style jsx>{`
        @keyframes confetti-fall-epic {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) rotate(180deg) translateX(20px);
          }
          50% {
            transform: translateY(50vh) rotate(360deg) translateX(-20px);
          }
          75% {
            transform: translateY(75vh) rotate(540deg) translateX(10px);
          }
          100% {
            transform: translateY(110vh) rotate(720deg) translateX(0);
            opacity: 0;
          }
        }
        .confetti-particle {
          animation: confetti-fall-epic 3s ease-out forwards;
        }
      `}</style>

      {/* Burst effect from center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="burst-ring" />
        <div className="burst-ring burst-ring-2" />
      </div>
      <style jsx>{`
        @keyframes burst {
          0% { transform: scale(0); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
        .burst-ring {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 4px solid #FFC800;
          border-radius: 50%;
          animation: burst 1s ease-out forwards;
        }
        .burst-ring-2 {
          border-color: #58CC02;
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}

function OnboardingCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(true);

  const elo = parseInt(searchParams.get('elo') || '800', 10);
  const level = (searchParams.get('level') || 'beginner') as keyof typeof LEVEL_CONFIG;
  const correct = parseInt(searchParams.get('correct') || '0', 10);
  const total = parseInt(searchParams.get('total') || '5', 10);
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.beginner;

  useEffect(() => {
    try {
      localStorage.setItem('chess-guest-progress', JSON.stringify({
        elo,
        level,
        diagnosticComplete: true,
        timestamp: Date.now(),
      }));
    } catch {
      // Ignore
    }

    const timer = setTimeout(() => setShowConfetti(false), 5000); // Longer celebration!
    return () => clearTimeout(timer);
  }, [elo, level]);

  const handleContinue = () => {
    router.push(`/learn?guest=true&level=${level}`);
  };

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col items-center justify-center px-5 relative">
      {showConfetti && <EpicConfetti />}

      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

      <div className="text-center max-w-sm">
        {/* Animated emoji */}
        <div
          className="text-7xl mb-4 animate-bounce"
          style={{ animationDuration: '0.6s' }}
        >
          {config.emoji}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-white mb-1">
          Level Found!
        </h1>

        {/* Level badge */}
        <div
          className="inline-block px-5 py-2 rounded-full font-bold text-lg mt-3 mb-4"
          style={{ backgroundColor: config.color, color: '#000' }}
        >
          {config.label}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="text-[#1CB0F6] font-bold text-xl">{elo}</div>
            <div className="text-gray-400">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-[#58CC02] font-bold text-xl">{correct}/{total}</div>
            <div className="text-gray-400">Correct</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02' }}
        >
          See Your Path
        </button>
      </div>
    </div>
  );
}

export default function OnboardingCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <OnboardingCompleteContent />
    </Suspense>
  );
}
