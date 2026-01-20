'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type DesignVariant = 1 | 2 | 3 | 4 | 5;

const designs: { id: DesignVariant; name: string; description: string }[] = [
  { id: 1, name: 'Balanced', description: 'Sophisticated but approachable, clean and modern' },
  { id: 2, name: 'Arcade Neon', description: 'Gaming vibes, neon glow, achievements' },
  { id: 3, name: 'Gradient Glass', description: 'Bold gradients, glassmorphism, modern' },
  { id: 4, name: 'Warm Retro', description: 'Vintage chess aesthetic, warm tones' },
  { id: 5, name: 'Cosmic Journey', description: 'Space theme, stars, floating elements' },
];

export default function TestLandingDesigns() {
  const [activeDesign, setActiveDesign] = useState<DesignVariant>(1);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Design Selector */}
      <div className="bg-[#1A1A1A] border-b border-gray-800 p-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            <Link href="/admin" className="text-gray-500 hover:text-white transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-white font-medium text-sm shrink-0">Landing Designs</span>
            <div className="flex gap-2">
              {designs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDesign(d.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    activeDesign === d.id
                      ? 'bg-[#58CC02] text-black'
                      : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A]'
                  }`}
                >
                  {d.id}. {d.name}
                </button>
              ))}
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">{designs.find(d => d.id === activeDesign)?.description}</p>
        </div>
      </div>

      {activeDesign === 1 && <Design1 />}
      {activeDesign === 2 && <Design2 />}
      {activeDesign === 3 && <Design3 />}
      {activeDesign === 4 && <Design4 />}
      {activeDesign === 5 && <Design5 />}
    </div>
  );
}

// Animated Progress Bar Component
function ProgressPath({
  style = 'default',
  colors = ['#58CC02', '#1CB0F6', '#FF9600', '#FF4B4B', '#A560E8', '#FFD700']
}: {
  style?: 'default' | 'neon' | 'glass' | 'retro' | 'cosmic';
  colors?: string[];
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000;
    const startTime = performance.now();
    let animationId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const loopTime = elapsed % (duration + 1500);

      if (loopTime < duration) {
        const t = loopTime / duration;
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setProgress(eased);
      } else {
        setProgress(1);
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const levels = [
    { name: 'Novice', elo: 400, icon: '♟' },
    { name: 'Beginner', elo: 700, icon: '♞' },
    { name: 'Casual', elo: 900, icon: '♝' },
    { name: 'Club', elo: 1000, icon: '♜' },
    { name: 'Skilled', elo: 1100, icon: '♛' },
    { name: 'Tournament', elo: 1200, icon: '♚' },
  ];

  const currentLevel = Math.min(Math.floor(progress * 6), 5);

  const getStyleClasses = () => {
    switch (style) {
      case 'neon':
        return {
          bg: 'bg-black/50 border-2 border-cyan-500/30',
          track: 'bg-gray-900',
          text: 'text-cyan-400',
          shadow: 'shadow-[0_0_20px_rgba(0,255,255,0.3)]'
        };
      case 'glass':
        return {
          bg: 'bg-white/10 backdrop-blur-xl border border-white/20',
          track: 'bg-white/10',
          text: 'text-white',
          shadow: ''
        };
      case 'retro':
        return {
          bg: 'bg-amber-950/50 border-2 border-amber-700/50',
          track: 'bg-amber-950',
          text: 'text-amber-200',
          shadow: ''
        };
      case 'cosmic':
        return {
          bg: 'bg-indigo-950/50 border border-purple-500/30',
          track: 'bg-indigo-950',
          text: 'text-purple-300',
          shadow: 'shadow-[0_0_30px_rgba(139,92,246,0.2)]'
        };
      default:
        return {
          bg: 'bg-[#1A2C35] border-2 border-[#58CC02]/20',
          track: 'bg-[#0A1014]',
          text: 'text-white',
          shadow: ''
        };
    }
  };

  const styles = getStyleClasses();

  return (
    <div className={`rounded-3xl p-6 ${styles.bg} ${styles.shadow}`}>
      <div className="flex flex-col gap-4">
        {levels.map((level, i) => {
          const isCompleted = i < currentLevel;
          const isCurrent = i === currentLevel;
          const isActive = i <= currentLevel;

          return (
            <div key={level.elo} className="flex items-center gap-4">
              {/* Level indicator */}
              <div
                className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                  transition-all duration-500 relative
                  ${isCompleted ? 'scale-100' : isCurrent ? 'scale-110' : 'scale-90 opacity-40'}
                `}
                style={{
                  backgroundColor: isActive ? colors[i] : 'rgba(255,255,255,0.1)',
                  boxShadow: isCurrent ? `0 0 30px ${colors[i]}60` : 'none'
                }}
              >
                <span className={isActive ? 'text-white' : 'text-gray-600'}>
                  {level.icon}
                </span>
                {isCurrent && (
                  <div
                    className="absolute inset-0 rounded-2xl animate-ping opacity-30"
                    style={{ backgroundColor: colors[i] }}
                  />
                )}
              </div>

              {/* Level info */}
              <div className="flex-1">
                <div className={`font-bold ${styles.text} ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {level.name}
                </div>
                <div className={`text-sm ${isActive ? 'opacity-70' : 'opacity-30'} ${styles.text}`}>
                  {level.elo}+ ELO
                </div>
              </div>

              {/* Progress bar for this level */}
              <div className={`w-20 h-2 rounded-full ${styles.track} overflow-hidden`}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: isCompleted ? '100%' : isCurrent ? `${(progress * 6 - currentLevel) * 100}%` : '0%',
                    backgroundColor: colors[i]
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall progress */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm ${styles.text} opacity-70`}>Overall Progress</span>
          <span className={`font-bold ${styles.text}`}>{Math.round(progress * 100)}%</span>
        </div>
        <div className={`h-3 rounded-full ${styles.track} overflow-hidden`}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${colors.join(', ')})`
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Design 1: Balanced - Sophisticated but approachable, mobile-first
function Design1() {
  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden max-w-md mx-auto bg-[#0f172a]">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#1e3a5f] to-transparent opacity-50" />

      {/* Soft glow accents */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#58CC02] rounded-full opacity-10 blur-[100px]" />
      <div className="absolute bottom-48 left-1/4 w-32 h-32 bg-[#1CB0F6] rounded-full opacity-10 blur-[80px]" />

      <div className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col px-6 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#58CC02] to-[#46a302] flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">♔</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            The Chess Path
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-[280px] mx-auto">
            The exact puzzles you need to improve, in the right order
          </p>
        </div>

        {/* Credibility badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-700">
            <span className="text-[#58CC02] text-sm">★</span>
            <span className="text-slate-300 text-xs">
              From the founder of <span className="text-white font-medium">Storytime Chess</span>
            </span>
          </div>
        </div>

        {/* Progress visualization */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div className="w-full max-w-[300px]">
            <ProgressPath
              style="default"
              colors={['#58CC02', '#22d3ee', '#f59e0b', '#ef4444', '#a855f7', '#fbbf24']}
            />
          </div>
        </div>

        {/* Value prop */}
        <div className="text-center mb-4 px-4">
          <p className="text-slate-500 text-sm leading-relaxed">
            Hand-picked puzzles based on teaching <span className="text-slate-300">hundreds of thousands</span> of students
          </p>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-6 mb-5 py-3 border-y border-slate-800/50">
          {[
            { value: '400→1200', label: 'ELO' },
            { value: '6', label: 'Levels' },
            { value: 'Curated', label: 'Puzzles' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-white font-semibold text-sm">{stat.value}</div>
              <div className="text-slate-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-3 pb-4">
          <button className="w-full py-4 bg-[#58CC02] hover:bg-[#4db800] text-white font-semibold text-base rounded-xl active:scale-[0.98] transition-all shadow-lg shadow-[#58CC02]/20">
            Start Learning — Free
          </button>
          <button className="w-full py-3 text-slate-400 font-medium text-sm hover:text-white transition-colors">
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

// Design 2: Arcade Neon - Gaming vibes
function Design2() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Neon glow effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]" />

      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center px-4 py-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold text-sm rounded animate-pulse">
                  🎮 PLAYER 1 READY
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
                  LEVEL UP
                </span>
                <br />
                <span className="text-white">YOUR CHESS</span>
              </h1>

              <p className="text-lg text-gray-400 mb-8 max-w-md font-mono">
                {'>'} Unlock achievements<br/>
                {'>'} Climb the leaderboard<br/>
                {'>'} Become a chess master
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="group px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold text-lg rounded-lg hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)]">
                  <span className="group-hover:animate-pulse">▶ START GAME</span>
                </button>
                <button className="px-8 py-4 text-gray-500 font-bold text-lg hover:text-white transition-colors">
                  CONTINUE →
                </button>
              </div>

              {/* Achievement badges */}
              <div className="flex gap-3 mt-8 justify-center md:justify-start">
                {['🏆', '⚡', '🔥', '💎'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center text-xl opacity-50 hover:opacity-100 hover:border-cyan-500 transition-all cursor-pointer"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Path */}
            <div className="w-full md:w-auto md:min-w-[320px]">
              <ProgressPath
                style="neon"
                colors={['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF6B6B', '#FFD700']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Design 3: Gradient Glass - Modern, bold gradients
function Design3() {
  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite'
        }}
      />
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center px-4 py-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-5 py-2 mb-6 border border-white/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white font-medium">Live Learning</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                Chess
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-white">
                  Reimagined
                </span>
              </h1>

              <p className="text-xl text-white/80 mb-8 max-w-md">
                A beautiful journey through tactical mastery. Learn, practice, and evolve.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-2xl hover:scale-105 transition-transform shadow-2xl">
                  Start Your Journey
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all">
                  Sign In
                </button>
              </div>
            </div>

            {/* Progress Path */}
            <div className="w-full md:w-auto md:min-w-[320px]">
              <ProgressPath
                style="glass"
                colors={['#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Design 4: Warm Retro - Vintage chess aesthetic
function Design4() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#1a1408] relative overflow-hidden">
      {/* Chess board pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            repeating-conic-gradient(#d4a574 0% 25%, transparent 0% 50%)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Warm glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-900/30 to-transparent" />

      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center px-4 py-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
                <div className="text-4xl">♔</div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-amber-600 to-transparent" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-amber-100 mb-6 leading-tight">
                The Ancient Art
                <br />
                <span className="text-amber-500">of Chess</span>
              </h1>

              <p className="text-lg text-amber-200/70 mb-8 max-w-md font-serif italic">
                "Every chess master was once a beginner." — Irving Chernev
              </p>

              <p className="text-amber-200/60 mb-8 max-w-md">
                Begin your classical chess education with time-tested methods and modern convenience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 font-semibold text-lg rounded-lg hover:from-amber-600 hover:to-amber-500 transition-all border border-amber-500/30 shadow-lg">
                  Begin Training
                </button>
                <button className="px-8 py-4 text-amber-400 font-semibold text-lg border border-amber-700/50 rounded-lg hover:bg-amber-900/30 transition-all">
                  Enter Library
                </button>
              </div>
            </div>

            {/* Progress Path */}
            <div className="w-full md:w-auto md:min-w-[320px]">
              <ProgressPath
                style="retro"
                colors={['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Design 5: Cosmic Journey - Space theme
function Design5() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0a0118] relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.7
            }}
          />
        ))}
      </div>

      {/* Nebula effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px]" />

      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center px-4 py-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
                <span className="text-xl">🚀</span>
                <span className="text-purple-300 font-medium">Launch Your Journey</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">Explore the</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Chess Universe
                </span>
              </h1>

              <p className="text-lg text-gray-400 mb-8 max-w-md">
                Embark on an interstellar journey through chess mastery. Each level unlocks new galaxies of tactical knowledge.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                  <span className="flex items-center gap-2">
                    Launch <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </button>
                <button className="px-8 py-4 text-purple-300 font-semibold text-lg border border-purple-500/30 rounded-xl hover:bg-purple-500/10 transition-all">
                  Mission Log
                </button>
              </div>

              {/* Planet badges */}
              <div className="flex gap-4 mt-8 justify-center md:justify-start">
                {['🌍', '🌙', '⭐', '🪐'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-purple-900/50 border border-purple-500/30 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Path */}
            <div className="w-full md:w-auto md:min-w-[320px]">
              <ProgressPath
                style="cosmic"
                colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#e879f9', '#f0abfc', '#fef3c7']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
