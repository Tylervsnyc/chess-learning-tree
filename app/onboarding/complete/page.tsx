'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LEVEL_CONFIG = {
  beginner: { label: 'Beginner', color: '#58CC02', emoji: '🌱', firstLesson: '1.1.1' },
  intermediate: { label: 'Intermediate', color: '#1CB0F6', emoji: '⚡', firstLesson: '2.1.1' },
  advanced: { label: 'Advanced', color: '#FF9600', emoji: '🔥', firstLesson: '3.1.1' },
  expert: { label: 'Expert', color: '#FF4B4B', emoji: '💪', firstLesson: '4.1.1' },
  master: { label: 'Master', color: '#A560E8', emoji: '👑', firstLesson: '5.1.1' },
  grandmaster: { label: 'Grandmaster', color: '#FFC800', emoji: '🏆', firstLesson: '6.1.1' },
};

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number; size: number }>>([]);

  useEffect(() => {
    const colors = ['#58CC02', '#1CB0F6', '#FF9600', '#FFC800', '#FF4B4B', '#A560E8'];
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
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

  const elo = parseInt(searchParams.get('elo') || '800', 10);
  const level = (searchParams.get('level') || 'beginner') as keyof typeof LEVEL_CONFIG;
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

    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [elo, level]);

  const handleContinue = () => {
    router.push(`/learn?guest=true&level=${level}`);
  };

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col items-center justify-center px-5 relative">
      {showConfetti && <Confetti />}

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
          className="inline-block px-5 py-2 rounded-full font-bold text-lg mt-3 mb-6"
          style={{ backgroundColor: config.color, color: '#000' }}
        >
          {config.label}
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
