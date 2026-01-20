'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number; size: number }>>([]);

  useEffect(() => {
    const colors = ['#00FFFF', '#FF00FF', '#FFFF00', '#58CC02', '#1CB0F6', '#FF9600'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
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

export default function WelcomePage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col items-center pt-16 px-5 relative">
      {showConfetti && <Confetti />}

      {/* Celebration emoji */}
      <div className="text-7xl mb-6 animate-bounce" style={{ animationDuration: '0.6s' }}>
        🎉
      </div>

      {/* Title with gradient */}
      <h1 className="text-3xl sm:text-4xl font-black text-center mb-3">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
          You're on The Chess Path!
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-center mb-8 max-w-[280px]">
        Your account is ready. Let's continue your training.
      </p>

      {/* Stats */}
      <div className="flex gap-6 mb-8">
        {[
          { value: '✓', label: 'Account Created', color: '#58CC02' },
          { value: '✓', label: 'Progress Saved', color: '#1CB0F6' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-gray-500 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/learn"
        className="w-full max-w-[300px] py-4 text-center font-bold text-lg rounded-2xl text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
        style={{ backgroundColor: '#58CC02' }}
      >
        Continue Learning
      </Link>
    </div>
  );
}
