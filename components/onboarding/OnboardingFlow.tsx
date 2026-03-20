'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { useLessonProgress } from '@/hooks/useProgress';
import posthogLib from 'posthog-js';
import { OnboardingEvents } from '@/lib/analytics/posthog';
import { playButtonClick } from '@/lib/sounds';

// ═══════════════════════════════════════════
// ELO -> LEVEL MAPPING
// ═══════════════════════════════════════════

function eloToLevel(elo: number): number {
  if (elo < 800) return 1;
  if (elo < 1000) return 2;
  if (elo < 1200) return 3;
  if (elo < 1400) return 4;
  if (elo < 1600) return 5;
  if (elo < 1800) return 6;
  if (elo < 2000) return 7;
  return 8;
}

function levelDescription(level: number): string {
  const descs: Record<number, string> = {
    1: "We'll start with the fundamentals.",
    2: "You've got the basics down. Let's build on that.",
    3: "Solid foundation. Time for intermediate tactics.",
    4: "You're past the basics. Let's sharpen those skills.",
    5: "Strong player. Advanced tactics await.",
    6: "Impressive. We'll push you to the next level.",
    7: "Expert territory. Let's refine your game.",
    8: "Master level. The hardest puzzles are waiting.",
  };
  return descs[level] || descs[1];
}

function firstLessonName(level: number): string {
  const names: Record<number, string> = {
    1: 'Queen Checkmate',
    2: 'Knight Fork: Basics',
    3: 'Deflection: Basics',
    4: 'Sacrifice: Opening Lines',
    5: 'Mate in 5',
    6: 'Quiet Moves: Basics',
    7: 'Back Rank: Setups',
    8: 'Squeeze: Zugzwang',
  };
  return names[level] || names[1];
}

// ═══════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════

// --- LANDING: Router — three doors ---

// SVG icon definitions for landing route buttons
type LandingIconType = 'question' | 'knight' | 'lightning';
const LANDING_ICON_PATHS: Record<LandingIconType, { viewBox: string; useFill: boolean; elements: { type: 'path' | 'circle'; d?: string; cx?: number; cy?: number; r?: number }[] }> = {
  question: {
    viewBox: '0 0 24 24', useFill: false,
    elements: [
      { type: 'path', d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' },
      { type: 'circle', cx: 12, cy: 17, r: 0.5 },
    ],
  },
  knight: {
    viewBox: '0 0 45 45', useFill: true,
    elements: [
      { type: 'path', d: 'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21' },
      { type: 'path', d: 'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3' },
    ],
  },
  lightning: {
    viewBox: '0 0 24 24', useFill: true,
    elements: [
      { type: 'path', d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
    ],
  },
};

function LandingRouteIcon({ icon, color, darkColor }: { icon: LandingIconType; color: string; darkColor: string }) {
  const data = LANDING_ICON_PATHS[icon];
  const renderElements = (fill: string, stroke: string, transform?: string) =>
    data.elements.map((el, i) => {
      if (el.type === 'path') {
        return data.useFill
          ? <path key={i} transform={transform} fill={fill} d={el.d} />
          : <path key={i} transform={transform} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d={el.d} />;
      } else {
        return data.useFill
          ? <circle key={i} transform={transform} fill={fill} cx={el.cx} cy={el.cy} r={el.r} />
          : <circle key={i} transform={transform} fill={stroke} cx={el.cx} cy={el.cy} r={(el.r ?? 0) + 1} />;
      }
    });

  return (
    <div className="relative shrink-0" style={{ width: 'calc(var(--icon-size) + 2px)', height: 'calc(var(--icon-size) + 5px)' }}>
      <div className="absolute rounded-full" style={{ width: 'var(--icon-size)', height: 'var(--icon-size)', top: 5, left: 2, backgroundColor: darkColor }} />
      <div className="absolute rounded-full flex items-center justify-center" style={{ width: 'var(--icon-size)', height: 'var(--icon-size)', top: 0, left: 0, backgroundColor: color }}>
        <svg style={{ width: 'var(--icon-inner)', height: 'var(--icon-inner)' }} viewBox={data.viewBox}>
          {Array.from({ length: 4 }).map((_, i) => (
            <g key={i} opacity={0.12 - i * 0.02}>
              {renderElements('#000', '#000', `translate(${(4 - i) * 0.7}, ${(4 - i) * 0.7})`)}
            </g>
          ))}
          <g>{renderElements('white', 'white')}</g>
        </svg>
      </div>
    </div>
  );
}

const LANDING_ROUTES = [
  { id: 'new', label: "I'm new to chess", sub: 'Learn how the pieces move', color: '#1CB0F6', darkColor: '#0d8bc4', icon: 'question' as LandingIconType },
  { id: 'play', label: 'I already play chess', sub: 'Pick your level and jump in', color: '#58CC02', darkColor: '#46a302', icon: 'knight' as LandingIconType },
  { id: 'daily', label: 'Give me a challenge', sub: '22 puzzles, fresh today', color: '#CE82FF', darkColor: '#a855f7', icon: 'lightning' as LandingIconType },
];

function LandingStep({ onNewToChess, onAlreadyPlay, onDailyChallenge, onSignIn }: {
  onNewToChess: () => void;
  onAlreadyPlay: () => void;
  onDailyChallenge: () => void;
  onSignIn: () => void;
}) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1100);
    const t4 = setTimeout(() => setPhase(4), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handlers: Record<string, () => void> = {
    new: onNewToChess,
    play: onAlreadyPlay,
    daily: onDailyChallenge,
  };

  return (
    <div className="flex-1 flex flex-col items-center px-5 max-w-lg mx-auto w-full">
      {/* Logo */}
      <div
        className="flex justify-center pt-10 sm:pt-14"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <AnimatedLogo size={0.45} perpetual theme="light" />
      </div>

      <div className="flex-1" />

      {/* Rookie speech bubble */}
      <div
        className="w-full flex items-center gap-1 mb-5"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex-shrink-0">
          <AnimatedLogo iconOnly size={0.95} perpetual />
        </div>
        <div
          className="flex-shrink-0"
          style={{
            width: 0, height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '10px solid white',
            filter: 'drop-shadow(-1px 0 1px rgba(0,0,0,0.03))',
          }}
        />
        <div
          className="flex-1 min-w-0 bg-white rounded-2xl px-4 py-3"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <p className="font-bold text-chess-text leading-snug" style={{ fontSize: '15px' }}>
            I promise chess is fun. And if it&apos;s not, you can blame me. I don&apos;t have{' '}
            <span className="text-chess-green">emotions</span>!
          </p>
        </div>
      </div>

      {/* "Choose your path:" tagline */}
      <p
        className="text-center font-black text-chess-text mb-4 -mt-1"
        style={{
          fontSize: 'clamp(14px, 4vw, 18px)',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        Choose your path:
      </p>

      {/* Route cards */}
      <div className="flex flex-col w-full" style={{ gap: 'var(--cards-gap)' }}>
        {LANDING_ROUTES.map((route, i) => (
          <button
            key={route.id}
            onClick={() => { playButtonClick(); handlers[route.id](); }}
            className="relative w-full text-left level-card-hover group"
            style={{
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
            }}
          >
            <div className="absolute inset-0 rounded-2xl transition-transform duration-300 level-layer-1" style={{ backgroundColor: route.color, transform: 'translate(5px, 5px)', opacity: 0.2 }} />
            <div className="absolute inset-0 rounded-2xl transition-transform duration-300 level-layer-2" style={{ backgroundColor: route.color, transform: 'translate(2.5px, 2.5px)', opacity: 0.35 }} />
            <div
              className="relative rounded-2xl border-2 transition-transform duration-300 level-card-main overflow-hidden"
              style={{ backgroundColor: 'var(--color-chess-surface)', borderColor: route.color, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 'var(--card-py) var(--card-px)' }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none" style={{ background: `linear-gradient(135deg, transparent 50%, ${route.color}15 50%)`, borderTopRightRadius: '1rem' }} />
              <div className="relative z-10 flex items-center" style={{ gap: 'var(--card-gap)' }}>
                <LandingRouteIcon icon={route.icon} color={route.color} darkColor={route.darkColor} />
                <div className="min-w-0 flex-1">
                  <p className="font-black text-chess-text leading-tight" style={{ fontSize: 'var(--label-size)' }}>{route.label}</p>
                  <p className="text-chess-text-muted font-medium mt-0.5" style={{ fontSize: 'var(--sub-size)' }}>{route.sub}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Sign in link */}
      <div className="pb-6" style={{ opacity: phase >= 4 ? 1 : 0, transition: 'opacity 0.4s ease-out' }}>
        <button
          onClick={() => { playButtonClick(); onSignIn(); }}
          className="text-[13px] font-semibold text-chess-text-muted hover:text-chess-text transition-colors py-2 px-4"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}

// --- LEVEL SELECT ---

type PieceType = 'pawn' | 'knight' | 'queen' | 'star';
type PieceElement = { type: 'circle'; cx: number; cy: number; r: number } | { type: 'path'; d: string } | { type: 'polygon'; points: string };
const PIECE_DATA: Record<PieceType, { viewBox: string; elements: PieceElement[] }> = {
  pawn: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z' },
    ],
  },
  knight: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21' },
      { type: 'path', d: 'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3' },
    ],
  },
  queen: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'circle', cx: 6, cy: 12, r: 3 },
      { type: 'circle', cx: 14, cy: 9, r: 3 },
      { type: 'circle', cx: 22.5, cy: 8, r: 3 },
      { type: 'circle', cx: 31, cy: 9, r: 3 },
      { type: 'circle', cx: 39, cy: 12, r: 3 },
      { type: 'path', d: 'M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z' },
      { type: 'path', d: 'M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z' },
    ],
  },
  star: {
    viewBox: '0 0 24 24',
    elements: [
      { type: 'polygon', points: '12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26' },
    ],
  },
};

function PieceIcon({ piece, size = 28, color = 'white' }: { piece: PieceType; size?: number; color?: string }) {
  const data = PIECE_DATA[piece];
  return (
    <svg width={size} height={size} viewBox={data.viewBox}>
      {data.elements.map((el, i) => {
        if (el.type === 'circle') return <circle key={i} fill={color} cx={el.cx} cy={el.cy} r={el.r} />;
        if (el.type === 'path') return <path key={i} fill={color} d={el.d} />;
        if (el.type === 'polygon') return <polygon key={i} fill={color} points={el.points} />;
        return null;
      })}
    </svg>
  );
}

const LEVEL_OPTIONS = [
  { id: 'checkmates', label: 'Start with checkmates', desc: 'Jump into puzzles right away', icon: 'knight' as PieceType, color: '#58CC02', darkColor: '#3d8c01' },
  { id: 'rated', label: 'I have a rating', desc: 'Place me at my level', icon: 'queen' as PieceType, color: '#CE82FF', darkColor: '#a855c7' },
];

function LevelStep({ onSelect }: { onSelect: (level: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (id: string) => {
    playButtonClick();
    setSelected(id);
    setTimeout(() => onSelect(id), 300);
  };

  return (
    <div
      className="flex-1 flex flex-col items-center px-6"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="flex-1" />

      <div className="mb-4">
        <BreathingRook size="lg" animation="breathe" />
      </div>

      <h2 className="text-[20px] font-black text-chess-text leading-tight text-center mb-6">
        How do you want to start?
      </h2>

      <div className="space-y-3 w-full max-w-sm">
        {LEVEL_OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-2xl text-white transition-all active:translate-y-[2px]"
              style={{
                backgroundColor: opt.color,
                boxShadow: isSelected
                  ? `0 2px 0 ${opt.darkColor}`
                  : `0 4px 0 ${opt.darkColor}`,
                transform: isSelected ? 'scale(1.02) translateY(2px)' : 'scale(1)',
                opacity: entered ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="relative shrink-0" style={{ width: 44, height: 48 }}>
                <div
                  className="absolute rounded-full"
                  style={{ width: 44, height: 44, top: 4, left: 0, backgroundColor: opt.darkColor }}
                />
                <div
                  className="absolute rounded-full flex items-center justify-center"
                  style={{ width: 44, height: 44, top: 0, left: 0, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <PieceIcon piece={opt.icon} size={26} color="white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-[15px] block">{opt.label}</span>
                <span className="text-xs block mt-0.5 text-white/75">
                  {opt.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />
    </div>
  );
}

// --- ELO INPUT ---
function EloStep({ onSubmit }: { onSubmit: (elo: number) => void }) {
  const [elo, setElo] = useState('');
  const [entered, setEntered] = useState(false);
  const isValid = elo.length > 0 && !isNaN(Number(elo)) && Number(elo) >= 100 && Number(elo) <= 3000;

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex-1 flex flex-col items-center px-6"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="flex-1" />

      <div className="mb-4">
        <BreathingRook size="lg" animation="breathe" />
      </div>

      <h2 className="text-[20px] font-black text-chess-text leading-tight text-center mb-2">
        What&apos;s your rating?
      </h2>
      <p className="text-sm text-chess-text-muted text-center mb-6">
        I&apos;ll pick puzzles that match your level.
      </p>

      <div className="space-y-4 w-full max-w-sm">
        <input
          type="number"
          inputMode="numeric"
          placeholder="e.g. 1200"
          value={elo}
          onChange={(e) => setElo(e.target.value)}
          autoFocus
          className="w-full px-5 py-4 rounded-2xl text-lg font-bold text-chess-text bg-[#f0f0f0]
                     placeholder:text-chess-text-faint placeholder:font-normal
                     focus:outline-none focus:ring-2 focus:ring-chess-green transition-all"
        />
        <p className="text-xs text-chess-text-muted px-1 text-center">
          From Chess.com, Lichess, or FIDE — any rating works.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end w-full max-w-sm pb-8">
        <button
          onClick={() => { if (!isValid) return; playButtonClick(); onSubmit(Number(elo)); }}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all"
          style={{
            backgroundColor: isValid ? 'var(--color-chess-text)' : 'var(--color-chess-disabled)',
            color: 'white',
            pointerEvents: isValid ? 'auto' : 'none',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// --- BUILDING PATH (loading) ---
function BuildingStep({
  level,
  elo,
  onDone,
}: {
  level: string;
  elo?: number;
  onDone: () => void;
}) {
  const [message, setMessage] = useState(0);

  const messages = [
    elo ? `${elo}? Bold. Let's see what you've got.` : 'Fresh start. I love the confidence.',
    'Picking your puzzles...',
    'Almost ready...',
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setMessage(1), 1200);
    const t2 = setTimeout(() => setMessage(2), 2400);
    const t3 = setTimeout(() => onDone(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="mb-8">
        <BreathingRook size="xl" animation="think" />
      </div>

      <div className="text-center h-14 flex items-center justify-center">
        {messages.map((msg, i) => (
          <p
            key={i}
            className="text-[15px] font-semibold text-chess-text-muted absolute"
            style={{
              opacity: message === i ? 1 : 0,
              transform: message === i ? 'translateY(0)' : (message > i ? 'translateY(-8px)' : 'translateY(8px)'),
              transition: 'all 0.35s ease-out',
            }}
          >
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
}

// --- PATH READY ---
function ReadyStep({
  elo,
  level,
  onStart,
}: {
  elo?: number;
  level: string;
  onStart: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const placedLevel = elo ? eloToLevel(elo) : 1;
  const lessonName = firstLessonName(placedLevel);
  const isRated = level === 'rated';

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center px-6">
      <div className="flex-1" />

      <div
        className="mb-6"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <BreathingRook size="xl" animation="celebrate" />
      </div>

      <div
        className="text-center mb-2"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        }}
      >
        <h2 className="text-[22px] font-black text-chess-text leading-tight">
          Your puzzles are ready.
        </h2>
        <p className="text-sm text-chess-text-muted mt-2 max-w-[280px] mx-auto leading-relaxed">
          {isRated
            ? `Let's start you out with ${lessonName}.`
            : `Let's try some checkmate puzzles on for size.`}
        </p>
      </div>

      {isRated && (
        <div
          className="flex gap-2 mt-4"
          style={{
            opacity: entered ? 1 : 0,
            transition: 'opacity 0.4s ease-out 0.4s',
          }}
        >
          <span className="px-3 py-1 rounded-full bg-chess-green/10 text-chess-green text-xs font-bold">
            Level {placedLevel}
          </span>
          {elo && (
            <span className="px-3 py-1 rounded-full bg-chess-orange/10 text-chess-orange text-xs font-bold">
              {elo} ELO
            </span>
          )}
        </div>
      )}

      <div
        className="flex-1 flex flex-col justify-end w-full max-w-sm pb-8"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
        }}
      >
        <button
          onClick={() => { playButtonClick(); onStart(); }}
          className="w-full py-4 bg-chess-green text-white font-bold text-base rounded-2xl
                     shadow-[0_4px_0_var(--color-chess-green-dark)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-chess-green-dark)]
                     transition-all hover:brightness-105"
        >
          {isRated ? `Let's Go` : 'Start Learning'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN FLOW
// ═══════════════════════════════════════════

type Step = 'landing' | 'level' | 'elo' | 'building' | 'ready';

export function OnboardingFlow() {
  const router = useRouter();
  const { unlockLevel } = useLessonProgress();
  const [step, setStep] = useState<Step>('landing');
  const [transitioning, setTransitioning] = useState(false);

  // Collected data
  const [levelChoice, setLevelChoice] = useState('');
  const [eloValue, setEloValue] = useState<number | undefined>();

  useEffect(() => {
    // PostHog SDK init runs in provider's useEffect — may not be ready yet.
    // Poll until posthog.__loaded is true, then fire.
    let cancelled = false;
    const tryFire = () => {
      if (cancelled) return;
      if (posthogLib.__loaded) {
        OnboardingEvents.started();
      } else {
        setTimeout(tryFire, 200);
      }
    };
    tryFire();
    return () => { cancelled = true; };
  }, []);

  const markOnboarded = useCallback(() => {
    try { localStorage.setItem('chess_path_onboarded', 'true'); } catch {}
  }, []);

  const goToStep = useCallback((next: Step) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setTransitioning(false);
    }, 200);
  }, []);

  const handleLevelSelect = useCallback((level: string) => {
    OnboardingEvents.levelSelected(level);
    setLevelChoice(level);
    try { localStorage.setItem('chess_path_level', level); } catch {}

    if (level === 'checkmates') {
      // Go straight to checkmate puzzles at 1.1.1
      markOnboarded();
      OnboardingEvents.completed({ level });
      router.push('/lesson/1.1.1?from=onboarding');
    } else {
      // Rated users go through elo → building → ready
      goToStep('elo');
    }
  }, [goToStep, markOnboarded, router]);

  const handleEloSubmit = useCallback((elo: number) => {
    OnboardingEvents.eloEntered(elo);
    setEloValue(elo);
    try { localStorage.setItem('chess_path_elo', String(elo)); } catch {}
    goToStep('building');
  }, [goToStep]);

  const handleBuildingDone = useCallback(() => {
    goToStep('ready');
  }, [goToStep]);

  const handleStart = useCallback(() => {
    const placedLevel = eloValue ? eloToLevel(eloValue) : 1;
    if (placedLevel > 1) {
      unlockLevel(placedLevel);
    }

    OnboardingEvents.completed({
      level: levelChoice,
      elo: eloValue,
      placedLevel,
    });

    markOnboarded();
    // Route directly to first lesson of placed level
    const firstLessonId = `${placedLevel}.1.1`;
    router.push(`/lesson/${firstLessonId}?from=onboarding`);
  }, [eloValue, levelChoice, unlockLevel, router, markOnboarded]);

  return (
    <div className="h-[100dvh] flex flex-col bg-chess-page relative overflow-hidden">
      {/* Fluid sizing CSS vars for landing router */}
      <style>{`
        :root {
          --icon-size: clamp(48px, 13vw, 60px);
          --icon-inner: clamp(30px, 8.5vw, 40px);
          --label-size: clamp(15px, 4.2vw, 19px);
          --sub-size: clamp(10px, 2.8vw, 12px);
          --card-py: clamp(10px, 2.8vw, 16px);
          --card-px: clamp(12px, 3.2vw, 18px);
          --card-gap: clamp(10px, 3vw, 14px);
          --cards-gap: clamp(8px, 2.2vw, 12px);
          --wordmark-size: clamp(28px, 8.5vw, 52px);
          --heading-size: clamp(12px, 3.2vw, 14px);
        }
        @keyframes shimmer {
          0% { transform: skewX(-20deg) translateX(-150%); }
          100% { transform: skewX(-20deg) translateX(250%); }
        }
        .level-card-hover:active .level-card-main {
          transform: translate(-2px, -2px);
        }
        .level-card-hover:active .level-layer-1 {
          transform: translate(8px, 8px);
        }
        .level-card-hover:active .level-layer-2 {
          transform: translate(5px, 5px);
        }
        .level-card-hover:active .shimmer-effect {
          animation: shimmer 1s ease-in-out;
        }
      `}</style>

      {/* Step content with crossfade */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.2s ease-out',
        }}
      >
        {step === 'landing' && (
          <LandingStep
            onNewToChess={() => {
              OnboardingEvents.routeSelected('new_to_chess');
              markOnboarded();
              OnboardingEvents.completed({ level: 'beginner' });
              router.push('/basics');
            }}
            onAlreadyPlay={() => {
              OnboardingEvents.routeSelected('already_play');
              goToStep('level');
            }}
            onDailyChallenge={() => {
              OnboardingEvents.routeSelected('daily_challenge');
              markOnboarded();
              router.push('/daily-challenge');
            }}
            onSignIn={() => router.push('/auth/login')}
          />
        )}
        {step === 'level' && <LevelStep onSelect={handleLevelSelect} />}
        {step === 'elo' && <EloStep onSubmit={handleEloSubmit} />}
        {step === 'building' && (
          <BuildingStep
            level={levelChoice}
            elo={eloValue}
            onDone={handleBuildingDone}
          />
        )}
        {step === 'ready' && (
          <ReadyStep
            elo={eloValue}
            level={levelChoice}
            onStart={handleStart}
          />
        )}
      </div>
    </div>
  );
}
