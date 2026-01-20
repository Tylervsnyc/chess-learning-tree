'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type TabType = 'landing' | 'learn';

const tabs: { id: TabType; name: string; description: string }[] = [
  { id: 'landing', name: 'Landing', description: 'Public marketing page with journey preview' },
  { id: 'learn', name: 'Learn', description: 'Curriculum tree with lessons' },
];

// Design tokens - Landing uses slate, Learn uses original dark teal
const landingColors = {
  bg: '#0f172a',        // slate-900
  secondary: '#1e293b', // slate-800
  accent: '#58CC02',
  accentBlue: '#1CB0F6',
  border: '#334155',
};

const learnColors = {
  bg: '#131F24',        // original dark
  secondary: '#1A2C35', // original secondary
  accent: '#58CC02',
  accentBlue: '#1CB0F6',
  border: '#2A3F4D',
};

export default function TestUnifiedDesign() {
  const [activeTab, setActiveTab] = useState<TabType>('landing');

  return (
    <div className="min-h-screen" style={{ backgroundColor: activeTab === 'landing' ? landingColors.bg : learnColors.bg }}>
      {/* Tab Selector */}
      <div className="border-b p-3 sticky top-0 z-50" style={{ backgroundColor: activeTab === 'landing' ? landingColors.secondary : learnColors.secondary, borderColor: activeTab === 'landing' ? landingColors.border : learnColors.border }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            <Link href="/admin" className="text-slate-500 hover:text-white transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-white font-medium text-sm shrink-0">Unified Design</span>
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'text-black'
                      : 'text-slate-400 hover:bg-slate-700'
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? landingColors.accent : 'transparent',
                  }}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-2">{tabs.find(t => t.id === activeTab)?.description}</p>
        </div>
      </div>

      {activeTab === 'landing' && <LandingView />}
      {activeTab === 'learn' && <LearnView />}
    </div>
  );
}

// Lichess piece URLs (same as react-chessboard uses)
const PIECE_URL = 'https://lichess1.org/assets/piece/cburnett';

// Compact Progress Path for Landing (no-scroll design)
function ProgressPathCompact() {
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
    { name: 'Novice', elo: 400, piece: 'wP', color: '#58CC02' },
    { name: 'Beginner', elo: 700, piece: 'wN', color: '#22d3ee' },
    { name: 'Casual', elo: 900, piece: 'wB', color: '#f59e0b' },
    { name: 'Club', elo: 1000, piece: 'wR', color: '#ef4444' },
    { name: 'Skilled', elo: 1100, piece: 'wQ', color: '#a855f7' },
    { name: 'Tournament', elo: 1200, piece: 'wK', color: '#fbbf24' },
  ];

  const currentLevel = Math.min(Math.floor(progress * 6), 5);

  return (
    <div className="flex flex-col gap-1.5">
      {levels.map((level, i) => {
        const isCompleted = i < currentLevel;
        const isCurrent = i === currentLevel;
        const isActive = i <= currentLevel;

        return (
          <div key={level.elo} className="flex items-center gap-3">
            <div
              className={`
                w-11 h-11 rounded-xl flex items-center justify-center
                transition-all duration-500 relative
                ${isCompleted ? 'scale-100' : isCurrent ? 'scale-110' : 'scale-90 opacity-40'}
              `}
              style={{
                backgroundColor: isActive ? level.color : 'rgba(255,255,255,0.1)',
                boxShadow: isCurrent ? `0 0 20px ${level.color}60` : 'none'
              }}
            >
              <img
                src={`${PIECE_URL}/${level.piece}.svg`}
                alt={level.name}
                className={`w-7 h-7 ${isActive ? 'opacity-100' : 'opacity-30'}`}
                style={{ filter: isActive ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' : 'none' }}
              />
              {isCurrent && (
                <div
                  className="absolute inset-0 rounded-xl animate-ping opacity-30"
                  style={{ backgroundColor: level.color }}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-sm text-white ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {level.name}
              </div>
              <div className={`text-xs text-white ${isActive ? 'opacity-60' : 'opacity-30'}`}>
                {level.elo}+ ELO
              </div>
            </div>

            <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: landingColors.bg }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: isCompleted ? '100%' : isCurrent ? `${(progress * 6 - currentLevel) * 100}%` : '0%',
                  backgroundColor: level.color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Landing View - No scroll, strong CTA, no logo, tight layout
function LandingView() {
  return (
    <div className="h-[calc(100vh-72px)] relative overflow-hidden max-w-md mx-auto" style={{ backgroundColor: landingColors.bg }}>
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[250px] bg-gradient-to-b from-slate-800/50 to-transparent" />

      {/* Soft glow accents */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: landingColors.accent }} />

      <div className="relative z-10 h-full flex flex-col justify-between px-5 py-5">
        {/* Top section */}
        <div>
          {/* Header - no logo */}
          <div className="text-center mb-3">
            <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
              The Chess Path
            </h1>
            <p className="text-slate-400 text-sm leading-snug">
              The exact puzzles you need to improve
            </p>
          </div>

          {/* Credibility badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 border" style={{ backgroundColor: `${landingColors.secondary}80`, borderColor: landingColors.border }}>
              <span className="text-xs" style={{ color: landingColors.accent }}>{'\u2605'}</span>
              <span className="text-slate-300 text-xs">
                From the founder of <span className="text-white font-medium">Storytime Chess</span>
              </span>
            </div>
          </div>
        </div>

        {/* Progress visualization - centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[300px]">
            <ProgressPathCompact />
          </div>
        </div>

        {/* Bottom section */}
        <div>
          {/* Stats row */}
          <div className="flex justify-center gap-8 mb-4 py-2">
            {[
              { value: '400-1200', label: 'ELO Range' },
              { value: '6 Levels', label: 'Curated Path' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-white font-semibold text-sm">{stat.value}</div>
                <div className="text-slate-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Strong CTA */}
          <button
            className="w-full py-4 text-white font-bold text-lg rounded-xl active:scale-[0.98] transition-all mb-2"
            style={{
              backgroundColor: landingColors.accent,
              boxShadow: `0 0 40px ${landingColors.accent}50, 0 4px 20px ${landingColors.accent}40`
            }}
          >
            Start Your Journey
          </button>
          <button className="w-full py-2 text-slate-500 font-medium text-sm hover:text-white transition-colors">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

// Learn View - Original dark teal colors
function LearnView() {
  const lessons = [
    { id: '1.1', name: 'Basic Forks', status: 'completed', elo: 400 },
    { id: '1.2', name: 'Knight Forks', status: 'completed', elo: 450 },
    { id: '1.3', name: 'Simple Pins', status: 'current', elo: 500 },
    { id: '1.4', name: 'Back Rank', status: 'locked', elo: 550 },
    { id: '1.5', name: 'Skewers', status: 'locked', elo: 600 },
    { id: '1.6', name: 'Discovered Attacks', status: 'locked', elo: 650 },
    { id: '1.7', name: 'Double Attacks', status: 'locked', elo: 700 },
    { id: '1.8', name: 'Level 1 Review', status: 'locked', elo: 750 },
  ];

  return (
    <div className="min-h-[calc(100vh-72px)] max-w-md mx-auto" style={{ backgroundColor: learnColors.bg }}>
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-white">Level 1: Novice</h1>
            <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${learnColors.accent}20`, color: learnColors.accent }}>
              400-800 ELO
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: learnColors.secondary }}>
            <div className="h-full rounded-full w-[25%]" style={{ backgroundColor: learnColors.accent }} />
          </div>
          <p className="text-gray-400 text-sm mt-2">2 of 8 lessons completed</p>
        </div>

        {/* Lesson List */}
        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const isCompleted = lesson.status === 'completed';
            const isCurrent = lesson.status === 'current';
            const isLocked = lesson.status === 'locked';

            return (
              <div
                key={lesson.id}
                className={`rounded-xl p-4 flex items-center gap-4 transition-all ${
                  isCurrent ? 'ring-2' : ''
                } ${isLocked ? 'opacity-50' : ''}`}
                style={{
                  backgroundColor: learnColors.secondary,
                  // @ts-expect-error - CSS custom property for Tailwind ring color
                  '--tw-ring-color': isCurrent ? learnColors.accent : 'transparent'
                }}
              >
                {/* Status icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: isCompleted ? learnColors.accent : isCurrent ? `${learnColors.accent}20` : learnColors.bg,
                  }}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isLocked ? (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <span className="text-lg font-bold" style={{ color: learnColors.accent }}>{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{lesson.name}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: learnColors.accent, color: 'black' }}>
                        Next
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{lesson.elo}+ ELO</p>
                </div>

                {/* Action */}
                {!isLocked && (
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium shrink-0"
                    style={{
                      backgroundColor: isCurrent ? learnColors.accent : 'transparent',
                      color: isCurrent ? 'white' : learnColors.accent,
                      border: isCurrent ? 'none' : `1px solid ${learnColors.accent}`,
                    }}
                  >
                    {isCompleted ? 'Review' : 'Start'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
