'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { playCelebrationSound, playCorrectSound } from '@/lib/sounds';

const COLORS = {
  green: '#58CC02',
  blue: '#1CB0F6',
  orange: '#FF9600',
  yellow: '#FFC800',
  red: '#FF4B4B',
  purple: '#A560E8',
};

// Tiered celebration effects
const celebrations = {
  // 6/6 Perfect - ABSOLUTE CHAOS
  perfect: () => {
    const duration = 4000;
    const end = Date.now() + duration;

    // Continuous side cannons
    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FFD700', '#FFFFFF'],
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FFD700', '#FFFFFF'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Multiple center bursts
    [300, 600, 1000, 1500].forEach((delay) => {
      setTimeout(() => {
        confetti({
          particleCount: 100 + Math.random() * 50,
          spread: 80 + Math.random() * 40,
          origin: { y: 0.5 + Math.random() * 0.2, x: 0.3 + Math.random() * 0.4 },
          colors: ['#FFD700', '#FFA500', '#58CC02', '#1CB0F6', '#FFFFFF', '#FF6347'],
        });
      }, delay);
    });

    // Star explosions
    [400, 800, 1200].forEach((delay) => {
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 360,
          ticks: 100,
          gravity: 0.3,
          decay: 0.94,
          startVelocity: 20 + Math.random() * 15,
          shapes: ['star'],
          colors: ['#FFD700', '#FFFFFF', '#FFA500'],
          origin: { y: 0.4 + Math.random() * 0.3, x: 0.2 + Math.random() * 0.6 },
        });
      }, delay);
    });

    // Final mega burst
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#58CC02', '#1CB0F6', '#FFFFFF', '#A560E8'],
        gravity: 0.8,
      });
    }, 2000);
  },

  // 5/6 Great - Double cannon burst
  great: () => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.65 },
      colors: [COLORS.green, COLORS.blue, COLORS.orange, '#FFFFFF'],
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.65 },
      colors: [COLORS.green, COLORS.blue, COLORS.orange, '#FFFFFF'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: [COLORS.green, COLORS.blue, '#FFFFFF'],
      });
    }, 400);
  },

  // 3-4/6 Okay - Simple gentle confetti
  okay: () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: [COLORS.green, COLORS.blue, COLORS.orange],
      gravity: 1.2,
    });
  },
};

// ANIMATION STYLES - Go nuts!
const animationStyles = {
  // 1. MEGA POP - Explodes in with overshoot
  megaPop: `
    @keyframes megaPop {
      0% { transform: scale(0) rotate(-20deg); opacity: 0; }
      50% { transform: scale(1.4) rotate(10deg); opacity: 1; }
      70% { transform: scale(0.9) rotate(-5deg); }
      85% { transform: scale(1.1) rotate(2deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
  `,

  // 2. SPIN SLAM - Spins in from above and slams down
  spinSlam: `
    @keyframes spinSlam {
      0% { transform: translateY(-200px) rotate(720deg) scale(0); opacity: 0; }
      60% { transform: translateY(20px) rotate(0deg) scale(1.2); opacity: 1; }
      80% { transform: translateY(-10px) scale(0.95); }
      100% { transform: translateY(0) rotate(0deg) scale(1); }
    }
  `,

  // 3. CRAZY SHAKE - Violent excitement shake
  crazyShake: `
    @keyframes crazyShake {
      0% { transform: scale(0); }
      20% { transform: scale(1.2); }
      25% { transform: scale(1.1) translateX(-15px) rotate(-10deg); }
      30% { transform: scale(1.1) translateX(15px) rotate(10deg); }
      35% { transform: scale(1.1) translateX(-12px) rotate(-8deg); }
      40% { transform: scale(1.1) translateX(12px) rotate(8deg); }
      45% { transform: scale(1.1) translateX(-8px) rotate(-5deg); }
      50% { transform: scale(1.1) translateX(8px) rotate(5deg); }
      55% { transform: scale(1.05) translateX(-4px) rotate(-2deg); }
      60% { transform: scale(1.05) translateX(4px) rotate(2deg); }
      70% { transform: scale(1) translateX(0) rotate(0); }
      100% { transform: scale(1) translateX(0) rotate(0); }
    }
  `,

  // 4. RAINBOW PULSE - Pulsing with color cycling
  rainbowPulse: `
    @keyframes rainbowPulse {
      0% { transform: scale(0); filter: hue-rotate(0deg) drop-shadow(0 0 0px gold); }
      30% { transform: scale(1.3); filter: hue-rotate(90deg) drop-shadow(0 0 40px gold); }
      50% { transform: scale(1); filter: hue-rotate(180deg) drop-shadow(0 0 20px gold); }
      70% { transform: scale(1.15); filter: hue-rotate(270deg) drop-shadow(0 0 30px gold); }
      100% { transform: scale(1); filter: hue-rotate(360deg) drop-shadow(0 0 15px gold); }
    }
    @keyframes continuousPulse {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px gold); }
      50% { transform: scale(1.08); filter: drop-shadow(0 0 25px gold); }
    }
  `,

  // 5. FLIP EXPLOSION - 3D flip with explosion
  flipExplosion: `
    @keyframes flipExplosion {
      0% { transform: perspective(500px) rotateY(0deg) scale(0); opacity: 0; }
      25% { transform: perspective(500px) rotateY(180deg) scale(0.5); opacity: 0.5; }
      50% { transform: perspective(500px) rotateY(360deg) scale(1.3); opacity: 1; }
      75% { transform: perspective(500px) rotateY(540deg) scale(1.1); }
      100% { transform: perspective(500px) rotateY(720deg) scale(1); }
    }
  `,

  // 6. GLITCH ENTRANCE - Glitchy digital effect
  glitchEntrance: `
    @keyframes glitchEntrance {
      0% { transform: scale(0); opacity: 0; clip-path: inset(0 0 100% 0); }
      10% { transform: scale(1.5) translateX(-20px); opacity: 1; clip-path: inset(0 0 0 0); filter: hue-rotate(90deg); }
      20% { transform: scale(0.8) translateX(20px); clip-path: inset(20% 0 20% 0); filter: hue-rotate(180deg); }
      30% { transform: scale(1.2) translateX(-10px); clip-path: inset(0 20% 0 20%); filter: hue-rotate(270deg); }
      40% { transform: scale(1) translateX(10px); clip-path: inset(10% 10% 10% 10%); }
      50% { transform: scale(1.1); clip-path: inset(0 0 0 0); filter: hue-rotate(0deg); }
      100% { transform: scale(1); clip-path: inset(0 0 0 0); }
    }
  `,

  // 7. BOUNCE ATTACK - Multiple aggressive bounces
  bounceAttack: `
    @keyframes bounceAttack {
      0% { transform: translateY(-500px) scale(2); opacity: 0; }
      15% { transform: translateY(0) scale(1); opacity: 1; }
      30% { transform: translateY(-80px) scale(1.1); }
      45% { transform: translateY(0) scale(0.95); }
      55% { transform: translateY(-40px) scale(1.05); }
      70% { transform: translateY(0) scale(0.98); }
      80% { transform: translateY(-15px) scale(1.02); }
      100% { transform: translateY(0) scale(1); }
    }
  `,

  // 8. VORTEX SPIN - Spirals in from distance
  vortexSpin: `
    @keyframes vortexSpin {
      0% { transform: rotate(1080deg) scale(0) translateY(-100px); opacity: 0; filter: blur(10px); }
      50% { transform: rotate(360deg) scale(1.3) translateY(20px); opacity: 1; filter: blur(0px); }
      75% { transform: rotate(90deg) scale(0.9) translateY(-10px); }
      100% { transform: rotate(0deg) scale(1) translateY(0); }
    }
  `,
};

// Screen shake effect
const screenShakeStyle = `
  @keyframes screenShake {
    0%, 100% { transform: translateX(0); }
    10% { transform: translateX(-10px) rotate(-1deg); }
    20% { transform: translateX(10px) rotate(1deg); }
    30% { transform: translateX(-8px) rotate(-0.5deg); }
    40% { transform: translateX(8px) rotate(0.5deg); }
    50% { transform: translateX(-5px); }
    60% { transform: translateX(5px); }
    70% { transform: translateX(-2px); }
    80% { transform: translateX(2px); }
    90% { transform: translateX(-1px); }
  }
`;

// Sparkle particles component
const SparkleParticles = () => {
  const sparkles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: 4 + Math.random() * 8,
    left: 20 + Math.random() * 60,
    delay: Math.random() * 2,
    duration: 1 + Math.random() * 2,
    color: ['#FFD700', '#FFFFFF', '#FFA500', '#58CC02', '#1CB0F6'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute animate-sparkle"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.left}%`,
            top: '30%',
            backgroundColor: s.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { transform: translateY(-20px) scale(1); opacity: 1; }
          80% { transform: translateY(-100px) scale(0.5); opacity: 0.5; }
          100% { transform: translateY(-150px) scale(0); opacity: 0; }
        }
        .animate-sparkle { animation: sparkle 2s ease-out infinite; }
      `}</style>
    </div>
  );
};

// Floating rings component
const FloatingRings = () => (
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="absolute rounded-full border-4 animate-ring"
        style={{
          width: 80 + i * 40,
          height: 80 + i * 40,
          borderColor: i === 1 ? '#FFD700' : i === 2 ? '#FFA500' : '#FF6347',
          animationDelay: `${i * 0.2}s`,
          opacity: 0,
        }}
      />
    ))}
    <style>{`
      @keyframes ring {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.5); opacity: 0.8; }
        100% { transform: scale(2.5); opacity: 0; }
      }
      .animate-ring { animation: ring 2s ease-out infinite; }
    `}</style>
  </div>
);

type AnimationType = 'megaPop' | 'spinSlam' | 'crazyShake' | 'rainbowPulse' | 'flipExplosion' | 'glitchEntrance' | 'bounceAttack' | 'vortexSpin';

const animationNames: { key: AnimationType; name: string; icon: string }[] = [
  { key: 'megaPop', name: 'MEGA POP', icon: '💥' },
  { key: 'spinSlam', name: 'SPIN SLAM', icon: '🌀' },
  { key: 'crazyShake', name: 'CRAZY SHAKE', icon: '🫨' },
  { key: 'rainbowPulse', name: 'RAINBOW PULSE', icon: '🌈' },
  { key: 'flipExplosion', name: '3D FLIP', icon: '🎰' },
  { key: 'glitchEntrance', name: 'GLITCH', icon: '👾' },
  { key: 'bounceAttack', name: 'BOUNCE ATTACK', icon: '⬇️' },
  { key: 'vortexSpin', name: 'VORTEX', icon: '🌪️' },
];

// Get icon based on score
function getScoreIcon(correct: number): string {
  if (correct === 6) return '👑';
  if (correct === 5) return '🔥';
  if (correct >= 3) return '✓';
  return '😅';
}

// Get message based on score
function getScoreMessage(correct: number): string {
  if (correct === 6) return 'PERFECT!';
  if (correct === 5) return 'GREAT JOB!';
  if (correct >= 3) return 'Nice work!';
  return 'Keep practicing!';
}

export default function TestCelebrationPage() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [correctCount, setCorrectCount] = useState(6);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>('megaPop');
  const [showSparkles, setShowSparkles] = useState(true);
  const [showRings, setShowRings] = useState(true);
  const [screenShake, setScreenShake] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setAnimationKey(k => k + 1);

    if (correctCount === 6) {
      celebrations.perfect();
    } else if (correctCount === 5) {
      celebrations.great();
    } else {
      celebrations.okay();
    }

    playCelebrationSound(correctCount);
  };

  const resetCelebration = () => {
    setShowCelebration(false);
  };

  const previewAnimation = () => {
    setAnimationKey(k => k + 1);
    if (correctCount === 6) {
      celebrations.perfect();
    }
    playCelebrationSound(correctCount);
  };

  if (showCelebration) {
    const icon = getScoreIcon(correctCount);
    const message = getScoreMessage(correctCount);
    const isPerfect = correctCount === 6;

    const animationCSS = animationStyles[selectedAnimation];
    const animationClass = selectedAnimation;

    return (
      <div
        className={`min-h-screen bg-[#131F24] text-white flex flex-col relative overflow-hidden ${screenShake && isPerfect ? 'animate-screenShake' : ''}`}
        style={{ animationDuration: '0.6s' }}
      >
        <style>{animationCSS}</style>
        <style>{screenShakeStyle}</style>
        <style>{`
          .animate-screenShake { animation: screenShake 0.6s ease-out; }
          .animate-${selectedAnimation} {
            animation: ${selectedAnimation} ${selectedAnimation === 'rainbowPulse' ? '1s ease-out forwards, continuousPulse 1.5s ease-in-out 1s infinite' : '1s ease-out forwards'};
          }
        `}</style>

        <div className="h-1 w-full bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

        <div className="flex-1 flex items-center justify-center px-5 relative">
          {showRings && isPerfect && <FloatingRings />}
          {showSparkles && isPerfect && <SparkleParticles />}

          <div className="max-w-sm w-full text-center relative z-10">
            {/* Icon with selected animation */}
            <div
              key={animationKey}
              className={`text-8xl mb-4 animate-${selectedAnimation}`}
              style={{
                filter: isPerfect ? 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.9))' : undefined,
              }}
            >
              {icon}
            </div>

            {/* Message with glow */}
            <h1
              className="text-4xl font-black mb-1 tracking-wider"
              style={{
                color: isPerfect ? '#FFD700' : COLORS.green,
                textShadow: isPerfect
                  ? '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)'
                  : undefined,
              }}
            >
              {message}
            </h1>
            <p className="text-gray-400 mb-2">Test Lesson - Forks</p>

            {/* Accuracy bar */}
            <div className="mb-6">
              <div className="h-3 bg-[#0D1A1F] rounded-full overflow-hidden border border-white/10 mb-1">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(correctCount / 6) * 100}%`,
                    background: correctCount === 6
                      ? 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)'
                      : COLORS.green,
                    boxShadow: correctCount === 6 ? '0 0 20px rgba(255, 215, 0, 0.5)' : undefined,
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">{Math.round((correctCount / 6) * 100)}% accuracy</p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div
                  className="text-3xl font-black"
                  style={{
                    color: correctCount === 6 ? '#FFD700' : COLORS.green,
                    textShadow: correctCount === 6 ? '0 0 15px rgba(255, 215, 0, 0.6)' : undefined,
                  }}
                >
                  {correctCount}
                </div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              {wrongCount > 0 && (
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-400">{wrongCount}</div>
                  <div className="text-xs text-gray-500">Retried</div>
                </div>
              )}
            </div>

            <button
              onClick={resetCelebration}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] mb-4"
              style={{ backgroundColor: COLORS.green }}
            >
              Back to Controls
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link href="/admin" className="text-gray-400 hover:text-white mb-6 inline-block">
          ← Back to Admin
        </Link>

        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          CELEBRATION LAB
        </h1>
        <p className="text-gray-500 text-sm mb-6">Go absolutely nuts with these effects</p>

        {/* Animation selector */}
        <div className="bg-[#1A2C35] rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4 text-lg">Icon Animation</h2>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {animationNames.map(({ key, name, icon }) => (
              <button
                key={key}
                onClick={() => setSelectedAnimation(key)}
                className={`py-3 px-2 rounded-lg font-medium text-xs transition-all ${
                  selectedAnimation === key
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500 scale-105 shadow-lg shadow-orange-500/30'
                    : 'bg-[#2A3C45] hover:bg-[#3A4C55]'
                }`}
              >
                <div className="text-xl mb-1">{icon}</div>
                {name}
              </button>
            ))}
          </div>

          {/* Extra effects toggles */}
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSparkles}
                onChange={(e) => setShowSparkles(e.target.checked)}
                className="accent-yellow-500 w-4 h-4"
              />
              <span className="text-sm">✨ Sparkles</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRings}
                onChange={(e) => setShowRings(e.target.checked)}
                className="accent-yellow-500 w-4 h-4"
              />
              <span className="text-sm">⭕ Rings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={screenShake}
                onChange={(e) => setScreenShake(e.target.checked)}
                className="accent-yellow-500 w-4 h-4"
              />
              <span className="text-sm">📳 Screen Shake</span>
            </label>
          </div>
        </div>

        {/* Score config */}
        <div className="bg-[#1A2C35] rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Score</h2>

          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="6"
              value={correctCount}
              onChange={(e) => setCorrectCount(Number(e.target.value))}
              className="w-full accent-[#FFD700] h-3"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-5xl">{getScoreIcon(correctCount)}</span>
              <div className="text-right">
                <div className="text-2xl font-black" style={{ color: correctCount === 6 ? '#FFD700' : COLORS.green }}>
                  {correctCount}/6
                </div>
                <div className="text-sm text-gray-500">{getScoreMessage(correctCount)}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Wrong/Retried</label>
            <input
              type="range"
              min="0"
              max="10"
              value={wrongCount}
              onChange={(e) => setWrongCount(Number(e.target.value))}
              className="w-full accent-gray-500"
            />
            <div className="text-center text-lg font-bold text-gray-400">{wrongCount}</div>
          </div>
        </div>

        {/* Test effects */}
        <div className="bg-[#1A2C35] rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Test Confetti</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => celebrations.perfect()}
              className="py-3 px-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 font-medium text-sm hover:scale-105 transition-transform"
            >
              👑 PERFECT
            </button>
            <button
              onClick={() => celebrations.great()}
              className="py-3 px-2 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 font-medium text-sm hover:scale-105 transition-transform"
            >
              🔥 Great
            </button>
            <button
              onClick={() => celebrations.okay()}
              className="py-3 px-2 rounded-lg bg-[#2A3C45] hover:bg-[#3A4C55] font-medium text-sm"
            >
              ✓ Okay
            </button>
          </div>

          <h2 className="font-semibold mb-4">Test Sounds</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => playCelebrationSound(6)}
              className="py-3 px-4 rounded-lg bg-[#2A3C45] hover:bg-[#3A4C55] font-medium text-sm"
            >
              🎺 Perfect
            </button>
            <button
              onClick={() => playCelebrationSound(3)}
              className="py-3 px-4 rounded-lg bg-[#2A3C45] hover:bg-[#3A4C55] font-medium text-sm"
            >
              🎵 Okay
            </button>
          </div>
        </div>

        {/* Preview animation only */}
        <button
          onClick={previewAnimation}
          className="w-full py-3 rounded-xl font-bold text-white mb-3 bg-[#2A3C45] hover:bg-[#3A4C55] transition-colors"
        >
          Preview Animation + Confetti
        </button>

        {/* Launch full celebration */}
        <button
          onClick={triggerCelebration}
          className="w-full py-4 rounded-xl font-black text-xl text-white transition-all active:translate-y-[2px] shadow-[0_6px_0_#b45309] hover:scale-[1.02] bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"
        >
          🎉 SHOW FULL CELEBRATION 🎉
        </button>

        {/* Legend */}
        <div className="mt-8 bg-[#1A2C35] rounded-xl p-4">
          <h3 className="font-semibold mb-3">Effect Tiers</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">👑</span>
              <span className="text-gray-400">6/6 Perfect — CHAOS MODE</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🔥</span>
              <span className="text-gray-400">5/6 Great — Double cannon burst</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span className="text-gray-400">3-4/6 Okay — Simple confetti</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">😅</span>
              <span className="text-gray-400">0-2/6 — Keep practicing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
