'use client';

import React, { useState, useEffect } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { playButtonClick } from '@/lib/sounds';

// ═══════════════════════════════════════════════════════
// LANDING PAGE — A/B Copy Test
// Same floating-card design from /learn level headers.
// Two copy variants to test which resonates more.
// ═══════════════════════════════════════════════════════

interface RouteOption {
  label: string;
  sub: string;
  href: string;
  color: string;
  darkColor: string;
  icon: 'question' | 'knight' | 'swords';
}

// SVG icon definitions (same style as /learn page piece icons)
const ICON_PATHS: Record<RouteOption['icon'], { viewBox: string; elements: { type: 'path' | 'circle' | 'line'; d?: string; cx?: number; cy?: number; r?: number; x1?: number; y1?: number; x2?: number; y2?: number }[] }> = {
  question: {
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' },
      { type: 'circle', cx: 12, cy: 17, r: 0.5 },
    ],
  },
  knight: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21' },
      { type: 'path', d: 'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3' },
    ],
  },
  swords: {
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
    ],
  },
};

function renderIconElements(icon: RouteOption['icon'], fill: string, stroke: string, transform?: string) {
  const data = ICON_PATHS[icon];
  // Knight uses fill, question & swords use stroke
  const useFill = icon === 'knight' || icon === 'swords';
  const strokeW = icon === 'swords' ? '2' : '2.5';

  return data.elements.map((el, i) => {
    if (el.type === 'path') {
      return useFill
        ? <path key={i} transform={transform} fill={fill} d={el.d} />
        : <path key={i} transform={transform} fill="none" stroke={stroke} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" d={el.d} />;
    } else if (el.type === 'circle') {
      return useFill
        ? <circle key={i} transform={transform} fill={fill} cx={el.cx} cy={el.cy} r={el.r} />
        : <circle key={i} transform={transform} fill={stroke} cx={el.cx} cy={el.cy} r={el.r! + 1} />;
    } else if (el.type === 'line') {
      return <line key={i} transform={transform} stroke={stroke} strokeWidth={strokeW} strokeLinecap="round" x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} />;
    }
    return null;
  });
}

function getIconWithLongShadow(icon: RouteOption['icon'], color: string, size: number) {
  const data = ICON_PATHS[icon];
  const layers = 4;

  return (
    <svg width={size} height={size} viewBox={data.viewBox}>
      {/* Long shadow layers */}
      {Array.from({ length: layers }).map((_, i) => (
        <g key={i} opacity={0.12 - i * 0.02}>
          {renderIconElements(icon, '#000', '#000', `translate(${(layers - i) * 0.7}, ${(layers - i) * 0.7})`)}
        </g>
      ))}
      {/* Main icon */}
      <g>{renderIconElements(icon, color, color)}</g>
    </svg>
  );
}

// 3D circle button — uses CSS clamp for fluid sizing
// Scales from small phones (360px) to large phones (430px)
function RouteIcon({ icon, color, darkColor }: { icon: RouteOption['icon']; color: string; darkColor: string }) {
  return (
    <div
      className="relative shrink-0"
      style={{
        // clamp(small, fluid, large) — icon circle + depth offset
        width: 'calc(var(--icon-size) + 2px)',
        height: 'calc(var(--icon-size) + 5px)',
      }}
    >
      {/* Bottom shadow circle */}
      <div
        className="absolute rounded-full"
        style={{
          width: 'var(--icon-size)',
          height: 'var(--icon-size)',
          top: 5,
          left: 2,
          backgroundColor: darkColor,
        }}
      />
      {/* Top circle with icon */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: 'var(--icon-size)',
          height: 'var(--icon-size)',
          top: 0,
          left: 0,
          backgroundColor: color,
        }}
      >
        <svg
          style={{ width: 'var(--icon-inner)', height: 'var(--icon-inner)' }}
          viewBox={ICON_PATHS[icon].viewBox}
        >
          {/* Long shadow layers */}
          {Array.from({ length: 4 }).map((_, i) => (
            <g key={i} opacity={0.12 - i * 0.02}>
              {renderIconElements(icon, '#000', '#000', `translate(${(4 - i) * 0.7}, ${(4 - i) * 0.7})`)}
            </g>
          ))}
          <g>{renderIconElements(icon, 'white', 'white')}</g>
        </svg>
      </div>
    </div>
  );
}

const COPY_A: RouteOption[] = [
  {
    label: "I don't know how to play chess",
    sub: 'Learn how the pieces move',
    href: '/tutorial',
    color: '#1CB0F6',
    darkColor: '#0d8bc4',
    icon: 'question',
  },
  {
    label: 'I have an ELO',
    sub: 'Jump in at your level',
    href: '/learn',
    color: '#58CC02',
    darkColor: '#46a302',
    icon: 'knight',
  },
  {
    label: 'Give me a challenge',
    sub: '22 puzzles, fresh today',
    href: '/daily-challenge',
    color: '#CE82FF',
    darkColor: '#a855f7',
    icon: 'swords',
  },
];

const COPY_B: RouteOption[] = [
  {
    label: 'How does the Horsey move?',
    sub: 'Learn how the pieces move',
    href: '/tutorial',
    color: '#1CB0F6',
    darkColor: '#0d8bc4',
    icon: 'question',
  },
  {
    label: 'I have an ELO',
    sub: 'Jump in at your level',
    href: '/learn',
    color: '#58CC02',
    darkColor: '#46a302',
    icon: 'knight',
  },
  {
    label: 'Just give me some puzzles',
    sub: '22 puzzles, fresh today',
    href: '/daily-challenge',
    color: '#CE82FF',
    darkColor: '#a855f7',
    icon: 'swords',
  },
];

function FloatingCard({
  route,
  index,
  visible,
}: {
  route: RouteOption;
  index: number;
  visible: boolean;
}) {
  return (
    <button
      onClick={() => { playButtonClick(); alert(`Navigate to ${route.href}`); }}
      className="relative w-full text-left level-card-hover group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
      }}
    >
      {/* Back layers for 3D depth */}
      <div
        className="absolute inset-0 rounded-2xl transition-transform duration-300 level-layer-1"
        style={{
          backgroundColor: route.color,
          transform: 'translate(5px, 5px)',
          opacity: 0.2,
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl transition-transform duration-300 level-layer-2"
        style={{
          backgroundColor: route.color,
          transform: 'translate(2.5px, 2.5px)',
          opacity: 0.35,
        }}
      />

      {/* Main card */}
      <div
        className="relative rounded-2xl border-2 transition-transform duration-300 level-card-main overflow-hidden"
        style={{
          backgroundColor: 'var(--color-chess-surface)',
          borderColor: route.color,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          padding: 'var(--card-py) var(--card-px)',
        }}
      >
        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${route.color}15 50%)`,
            borderTopRightRadius: '1rem',
          }}
        />

        {/* Shimmer on tap */}
        <div
          className="absolute inset-0 shimmer-effect pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${route.color}15, transparent)`,
            transform: 'skewX(-20deg) translateX(-150%)',
          }}
        />

        <div className="relative z-10 flex items-center" style={{ gap: 'var(--card-gap)' }}>
          <RouteIcon icon={route.icon} color={route.color} darkColor={route.darkColor} />
          <div className="min-w-0 flex-1">
            <p className="font-black text-chess-text leading-tight" style={{ fontSize: 'var(--label-size)' }}>
              {route.label}
            </p>
            <p className="text-chess-text-muted font-medium mt-0.5" style={{ fontSize: 'var(--sub-size)' }}>
              {route.sub}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function LandingVariant({ routes }: { routes: RouteOption[] }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 450);
    const t3 = setTimeout(() => setPhase(3), 750);
    const t4 = setTimeout(() => setPhase(4), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center px-5 max-w-lg mx-auto w-full">
      {/* Top: brand + heading pinned near top */}
      <div className="pt-6">
        <div
          className="flex items-center gap-2 justify-center mb-3"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <BreathingRook size="md" animation="enter" />
          <h1
            className="font-bold"
            style={{ fontSize: 'var(--wordmark-size)', fontFamily: "var(--font-body), 'DM Sans', system-ui, sans-serif" }}
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
        </div>

        <p
          className="font-semibold tracking-widest text-chess-text-muted uppercase text-center"
          style={{
            fontSize: 'var(--heading-size)',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(6px)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Let&apos;s get you to the right place
        </p>
      </div>

      {/* Center: cards vertically centered in remaining space */}
      <div className="flex-1 flex items-center w-full">
        <div className="flex flex-col w-full" style={{ gap: 'var(--cards-gap)' }}>
          {routes.map((route, i) => (
            <FloatingCard
              key={route.label}
              route={route}
              index={i}
              visible={phase >= 3}
            />
          ))}
        </div>
      </div>

      {/* Bottom: login pinned to bottom */}
      <div
        className="pb-6"
        style={{
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      >
        <button
          onClick={() => { playButtonClick(); alert('Navigate to /auth/login'); }}
          className="text-[13px] font-semibold text-chess-text-muted hover:text-chess-text transition-colors py-2 px-4"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TEST PAGE — A/B Switcher
// ═══════════════════════════════════════════════════════

export default function LandingRedesignTest() {
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  return (
    <div className="h-[100dvh] flex flex-col bg-chess-page overflow-auto">
      {/* Tiny floating A/B toggle */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-200 p-1">
        {(['A', 'B'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className="w-8 h-8 rounded-full text-[11px] font-bold transition-all"
            style={{
              backgroundColor: variant === v ? 'var(--color-chess-text)' : 'transparent',
              color: variant === v ? 'white' : 'var(--color-chess-text-muted)',
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Active variant */}
      <div className="flex-1 flex flex-col" key={variant}>
        <LandingVariant routes={variant === 'A' ? COPY_A : COPY_B} />
      </div>

      <style>{`
        :root {
          /* Fluid sizing: scales between 360px and 430px viewport width */
          --icon-size: clamp(48px, 13vw, 60px);
          --icon-inner: clamp(30px, 8.5vw, 40px);
          --label-size: clamp(15px, 4.2vw, 19px);
          --sub-size: clamp(10px, 2.8vw, 12px);
          --card-py: clamp(10px, 2.8vw, 16px);
          --card-px: clamp(12px, 3.2vw, 18px);
          --card-gap: clamp(10px, 3vw, 14px);
          --cards-gap: clamp(8px, 2.2vw, 12px);
          --wordmark-size: clamp(24px, 7vw, 32px);
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
    </div>
  );
}
