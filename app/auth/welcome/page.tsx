'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="h-full bg-[#131F24] flex flex-col overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-3 pt-8 min-h-0">
        {/* Celebration emoji */}
        <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '0.6s' }}>
          🎉
        </div>

        {/* Brand logo */}
        <Image
          src="/brand/icon-96.svg"
          alt="Chess Path"
          width={72}
          height={72}
          className="mx-auto mb-3"
        />

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-1">
          <span className="text-white">You&apos;re on the </span>
          <span className="text-white">chess</span>
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }}>path</span>
          <span className="text-white">!</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-center mb-6 max-w-[280px]">
          Your account is ready. Let&apos;s continue your training.
        </p>

        {/* Stats */}
        <div className="flex gap-6 mb-6">
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
          className="w-full max-w-[320px] py-3 text-center font-bold text-base rounded-2xl text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02' }}
        >
          Continue Learning
        </Link>
      </div>
    </div>
  );
}
