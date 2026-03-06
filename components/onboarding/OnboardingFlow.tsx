'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { useLessonProgress } from '@/hooks/useProgress';
import { trackEvent } from '@/lib/analytics/posthog';
import { playButtonClick } from '@/lib/sounds';

// ═══════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════

const OnboardingEvents = {
  started: () => trackEvent('onboarding_started'),
  levelSelected: (level: string) => trackEvent('onboarding_level_selected', { level }),
  eloEntered: (elo: number) => trackEvent('onboarding_elo_entered', { elo }),
  styleSelected: (style: string) => trackEvent('onboarding_style_selected', { style }),
  completed: (data: { level: string; style: string; elo?: number; placedLevel?: number }) =>
    trackEvent('onboarding_completed', data),
};

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

// --- LANDING: App intro + Get Started ---
function LandingStep({ onGetStarted, onSignIn }: { onGetStarted: () => void; onSignIn: () => void }) {
  const [showTagline, setShowTagline] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTagline(true), 900);
    const t2 = setTimeout(() => setShowButtons(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center px-6">
      <div className="flex-1" />

      {/* Rook mascot */}
      <div className="mb-6">
        <BreathingRook size="xl" animation="enter" />
      </div>

      {/* Branded wordmark */}
      <h1
        className="text-[32px] font-bold mb-3"
        style={{ fontFamily: "var(--font-body), 'DM Sans', system-ui, sans-serif" }}
      >
        <span className="text-chess-text">chess</span>
        <span
          style={{
            background: 'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          path
        </span>
      </h1>

      {/* Tagline */}
      <p
        className="text-[13px] font-semibold tracking-widest text-chess-text-muted uppercase"
        style={{
          opacity: showTagline ? 1 : 0,
          transform: showTagline ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        The fun way to learn chess
      </p>

      {/* Buttons */}
      <div
        className="flex-1 flex flex-col justify-end w-full max-w-sm pb-8"
        style={{
          opacity: showButtons ? 1 : 0,
          transform: showButtons ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <button
          onClick={() => { playButtonClick(); onGetStarted(); }}
          className="w-full py-4 bg-chess-green text-white font-bold text-base rounded-2xl
                     shadow-[0_4px_0_var(--color-chess-green-dark)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-chess-green-dark)]
                     transition-all hover:brightness-105"
        >
          Get Started
        </button>
        <button
          onClick={() => { playButtonClick(); onSignIn(); }}
          className="w-full py-3 mt-3 text-sm font-medium text-chess-text-muted hover:text-chess-text transition-colors"
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
  { id: 'beginner', label: "I'm brand new", desc: 'Teach me everything', icon: 'pawn' as PieceType, color: '#58CC02', darkColor: '#3d8c01' },
  { id: 'basics', label: 'I know the basics', desc: 'I can move the pieces', icon: 'knight' as PieceType, color: '#1CB0F6', darkColor: '#1487c0' },
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
        What&apos;s your chess level?
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

      <h2 className="text-[20px] font-black text-chess-text leading-tight text-center mb-6">
        What&apos;s your rating?
      </h2>

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
          Chess.com, Lichess, FIDE -- any rating works.
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

// --- PLAYER STYLE ---
const STYLE_OPTIONS = [
  { id: 'attacker', label: 'The Attacker', desc: 'I want to crush people fast', icon: 'queen' as PieceType, color: '#FF4B4B', darkColor: '#cc3030' },
  { id: 'strategist', label: 'The Strategist', desc: 'I want to outthink my opponents', icon: 'knight' as PieceType, color: '#1CB0F6', darkColor: '#1487c0' },
  { id: 'trickster', label: 'The Trickster', desc: 'I want to set traps they never see coming', icon: 'star' as PieceType, color: '#CE82FF', darkColor: '#a855c7' },
];

function StyleStep({ onSelect }: { onSelect: (style: string) => void }) {
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
        What kind of player do you want to be?
      </h2>

      <div className="space-y-3 w-full max-w-sm">
        {STYLE_OPTIONS.map((opt, i) => {
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

// --- BUILDING PATH (loading) ---
function BuildingStep({
  level,
  style,
  elo,
  onDone,
}: {
  level: string;
  style: string;
  elo?: number;
  onDone: () => void;
}) {
  const [message, setMessage] = useState(0);

  const messages = [
    level === 'rated' && elo
      ? `${elo}? Bold. Let's see what you've got.`
      : level === 'basics'
        ? 'Alright, you know a horse from a bishop. Good start.'
        : 'Fresh start. I love the confidence.',
    style === 'attacker'
      ? 'Sharpening the swords...'
      : style === 'strategist'
        ? 'Dusting off the grandmaster playbook...'
        : 'Hiding pieces behind pawns...',
    'Your path is almost ready...',
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
          Your path is ready.
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

type Step = 'landing' | 'level' | 'elo' | 'style' | 'building' | 'ready';

export function OnboardingFlow() {
  const router = useRouter();
  const { unlockLevel } = useLessonProgress();
  const [step, setStep] = useState<Step>('landing');
  const [transitioning, setTransitioning] = useState(false);

  // Collected data
  const [levelChoice, setLevelChoice] = useState('');
  const [eloValue, setEloValue] = useState<number | undefined>();
  const [styleChoice, setStyleChoice] = useState('');

  useEffect(() => {
    OnboardingEvents.started();
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

    if (level === 'beginner') {
      // Beginners go straight to basics tutorial
      markOnboarded();
      OnboardingEvents.completed({ level, style: 'none' });
      router.push('/basics');
    } else if (level === 'basics') {
      // Basics users get style → building → lesson 1.1.1
      goToStep('style');
    } else {
      // Rated users go through elo → style → building → ready
      goToStep('elo');
    }
  }, [goToStep, markOnboarded, router]);

  const handleEloSubmit = useCallback((elo: number) => {
    OnboardingEvents.eloEntered(elo);
    setEloValue(elo);
    try { localStorage.setItem('chess_path_elo', String(elo)); } catch {}
    goToStep('style');
  }, [goToStep]);

  const handleStyleSelect = useCallback((style: string) => {
    OnboardingEvents.styleSelected(style);
    setStyleChoice(style);
    try { localStorage.setItem('chess_path_style', style); } catch {}
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
      style: styleChoice,
      elo: eloValue,
      placedLevel,
    });

    markOnboarded();
    // Route directly to first lesson of placed level
    const firstLessonId = `${placedLevel}.1.1`;
    router.push(`/lesson/${firstLessonId}?from=onboarding`);
  }, [eloValue, levelChoice, styleChoice, unlockLevel, router, markOnboarded]);

  return (
    <div className="h-[100dvh] flex flex-col bg-white relative overflow-hidden">
      {/* No header, no progress bar, no skip, no back — Brilliant style */}

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
            onGetStarted={() => goToStep('level')}
            onSignIn={() => router.push('/auth/login')}
          />
        )}
        {step === 'level' && <LevelStep onSelect={handleLevelSelect} />}
        {step === 'elo' && <EloStep onSubmit={handleEloSubmit} />}
        {step === 'style' && <StyleStep onSelect={handleStyleSelect} />}
        {step === 'building' && (
          <BuildingStep
            level={levelChoice}
            style={styleChoice}
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
