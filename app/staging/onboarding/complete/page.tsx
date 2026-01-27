'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LEVEL_CONFIG = {
  1: { label: 'Level 1', name: 'How to Lose Friends', color: '#58CC02', emoji: '🌱', eloRange: '400-800' },
  2: { label: 'Level 2', name: 'The Assassin\'s Toolkit', color: '#1CB0F6', emoji: '⚡', eloRange: '800-1000' },
  3: { label: 'Level 3', name: 'They\'ll Never See It Coming', color: '#CE82FF', emoji: '🔥', eloRange: '1000-1200' },
};

function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    size: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const colors = ['#58CC02', '#1CB0F6', '#CE82FF', '#FFC800', '#FF4B4B'];

    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      size: 4 + Math.random() * 8,
      duration: 2 + Math.random() * 1.5,
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
            top: -20,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-particle {
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function OnboardingCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(true);

  const elo = parseInt(searchParams.get('elo') || '600', 10);
  const levelNum = parseInt(searchParams.get('level') || '1', 10) as 1 | 2 | 3;
  const correct = parseInt(searchParams.get('correct') || '0', 10);
  const total = parseInt(searchParams.get('total') || '5', 10);

  const config = LEVEL_CONFIG[levelNum] || LEVEL_CONFIG[1];

  useEffect(() => {
    // Save to localStorage for staging
    localStorage.setItem('staging-user-level', levelNum.toString());
    localStorage.setItem('staging-user-elo', elo.toString());
    localStorage.setItem('staging-diagnostic-complete', 'true');

    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [elo, levelNum]);

  const handleContinue = () => {
    router.push('/staging/learn');
  };

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col items-center justify-center px-5 relative">
      {showConfetti && <Confetti />}

      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #58CC02, #1CB0F6, #CE82FF)' }} />

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
          className="inline-block px-5 py-2 rounded-full font-bold text-lg mt-3 mb-2"
          style={{ backgroundColor: config.color, color: '#000' }}
        >
          {config.label}
        </div>

        {/* Level name */}
        <p className="text-gray-400 mb-4">{config.name}</p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="text-[#1CB0F6] font-bold text-xl">{elo}</div>
            <div className="text-gray-400">Estimated ELO</div>
          </div>
          <div className="text-center">
            <div className="text-[#58CC02] font-bold text-xl">{correct}/{total}</div>
            <div className="text-gray-400">Correct</div>
          </div>
        </div>

        {/* What you'll learn */}
        <div className="bg-[#1A2C35] rounded-xl p-4 mb-6 text-left">
          <h3 className="text-sm font-bold text-gray-400 mb-2">YOUR STARTING POINT</h3>
          <p className="text-white text-sm">
            {levelNum === 1 && "You'll start with checkmate patterns, forks, and basic tactics - the foundation of tactical chess."}
            {levelNum === 2 && "You'll work on pins, skewers, discovered attacks, and intermediate combinations."}
            {levelNum === 3 && "You'll tackle advanced sacrifices, deflection, interference, and complex multi-move tactics."}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02' }}
        >
          Start Learning
        </button>
      </div>
    </div>
  );
}

export default function StagingOnboardingCompletePage() {
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
