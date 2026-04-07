'use client';

import { useState, useEffect } from 'react';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { playButtonClick } from '@/lib/sounds';

// ══════════════════════════════════════════════════
// SHARED: Route cards + icons
// ══════════════════════════════════════════════════

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

function RouteCards({ phase }: { phase: number }) {
  return (
    <div className="flex flex-col w-full" style={{ gap: 'var(--cards-gap)' }}>
      {LANDING_ROUTES.map((route, i) => (
        <button
          key={route.id}
          onClick={() => playButtonClick()}
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
  );
}

// ══════════════════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════════════════

// Full AnimatedLogo (rook icon + chesspath wordmark) at top
function LogoHeader({ phase, size = 0.5 }: { phase: number; size?: number }) {
  return (
    <div
      className="flex justify-center pt-10 sm:pt-14"
      style={{
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <AnimatedLogo size={size} perpetual theme="light" />
    </div>
  );
}

function BubbleText({ size = '15px' }: { size?: string }) {
  return (
    <p className="font-bold text-chess-text leading-snug" style={{ fontSize: size }}>
      Hi, I&apos;m Rookie! I promise to make you better at chess by giving you{' '}
      <span className="text-chess-green">fun puzzles</span> to play with.
    </p>
  );
}

function SignInLink({ phase }: { phase: number }) {
  return (
    <div className="pb-6" style={{ opacity: phase >= 4 ? 1 : 0, transition: 'opacity 0.4s ease-out' }}>
      <button onClick={playButtonClick} className="text-[13px] font-semibold text-chess-text-muted hover:text-chess-text transition-colors py-2 px-4">
        I already have an account
      </button>
    </div>
  );
}

function usePhases() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1100);
    const t4 = setTimeout(() => setPhase(4), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);
  return phase;
}

// Rookie icon + bubble side by side (shared layout)
function RookieBubble({ phase, rookieSize = 0.8 }: { phase: number; rookieSize?: number }) {
  return (
    <div
      className="w-full flex items-center gap-1 mb-5"
      style={{
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="flex-shrink-0">
        <AnimatedLogo iconOnly size={rookieSize} perpetual />
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
        <BubbleText />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// DESIGN 1: Full logo top, generous spacing,
// Rookie+bubble centered above cards, airy feel
// ══════════════════════════════════════════════════

function Design1() {
  const phase = usePhases();

  return (
    <div className="flex-1 flex flex-col items-center px-5 max-w-lg mx-auto w-full">
      <LogoHeader phase={phase} size={0.9} />
      <div className="flex-1" />
      <RookieBubble phase={phase} rookieSize={0.8} />
      <div className="w-full">
        <RouteCards phase={phase} />
      </div>
      <div className="flex-1" />
      <SignInLink phase={phase} />
    </div>
  );
}

// ══════════════════════════════════════════════════
// DESIGN 2: Larger logo top, smaller Rookie+bubble
// tighter to cards, more compact/punchy
// ══════════════════════════════════════════════════

function Design2() {
  const phase = usePhases();

  return (
    <div className="flex-1 flex flex-col items-center px-5 max-w-lg mx-auto w-full">
      <LogoHeader phase={phase} size={0.6} />

      <div className="flex-1" />

      {/* Subtitle text above Rookie */}
      <p
        className="text-chess-text-muted text-center font-medium mb-3"
        style={{
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      >
        The fun way to learn chess
      </p>

      <RookieBubble phase={phase} rookieSize={0.65} />
      <div className="w-full">
        <RouteCards phase={phase} />
      </div>
      <div className="flex-1" />
      <SignInLink phase={phase} />
    </div>
  );
}

// ══════════════════════════════════════════════════
// DESIGN 3: Full logo top, bigger Rookie with
// bubble, tagline below bubble before cards
// ══════════════════════════════════════════════════

function Design3() {
  const phase = usePhases();

  return (
    <div className="flex-1 flex flex-col items-center px-5 max-w-lg mx-auto w-full">
      <LogoHeader phase={phase} size={0.45} />

      <div className="flex-1" />

      <RookieBubble phase={phase} rookieSize={0.95} />

      {/* Tagline between bubble and cards */}
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

      <div className="w-full">
        <RouteCards phase={phase} />
      </div>
      <div className="flex-1" />
      <SignInLink phase={phase} />
    </div>
  );
}

// ══════════════════════════════════════════════════
// SWITCHER
// ══════════════════════════════════════════════════

export default function RookiePromiseTest() {
  const [design, setDesign] = useState(1);

  return (
    <div className="h-[100dvh] flex flex-col bg-chess-page relative overflow-auto">
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
      `}</style>

      {design === 1 && <Design1 key="d1" />}
      {design === 2 && <Design2 key="d2" />}
      {design === 3 && <Design3 key="d3" />}

      {/* Design switcher */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-2 shadow-lg z-50">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            onClick={() => setDesign(n)}
            className="px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={{
              backgroundColor: design === n ? 'var(--color-chess-green)' : 'transparent',
              color: design === n ? 'white' : 'var(--color-chess-text-muted)',
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
