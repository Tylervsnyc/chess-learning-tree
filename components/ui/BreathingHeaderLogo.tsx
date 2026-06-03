'use client';

import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';

/**
 * BreathingHeaderLogo — Inline SVG logo with breathing rook animation for the header.
 * Rook blocks pulse top-to-bottom, staggered left-to-right, 2.4s cycle.
 * See RULES.md §41.
 */

// Gradient defs matching the SVG logo exactly — matte style per color
const GRADIENT_COLORS: Record<string, { light: string; mid: string; base: string; dark: string }> = {
  '#1CB0F6': { light: '#45bef8', mid: '#37b9f7', base: '#1CB0F6', dark: '#199bd8' },
  '#2FCBEF': { light: '#54d4f2', mid: '#48d1f1', base: '#2FCBEF', dark: '#29b3d2' },
  '#A560E8': { light: '#b57dec', mid: '#b073eb', base: '#A560E8', dark: '#9154cc' },
  '#58CC02': { light: '#76d530', mid: '#6cd220', base: '#58CC02', dark: '#4db402' },
  '#FFC800': { light: '#ffd22e', mid: '#ffcf1f', base: '#FFC800', dark: '#e0b000' },
  '#FF9600': { light: '#ffa92e', mid: '#ffa31f', base: '#FF9600', dark: '#e08400' },
  '#FF6B6B': { light: '#ff8686', mid: '#ff7d7d', base: '#FF6B6B', dark: '#e05e5e' },
  '#FF4B4B': { light: '#ff6b6b', mid: '#ff6161', base: '#FF4B4B', dark: '#e04242' },
};

function gradientId(color: string) {
  return `hdr-g-${color.replace('#', '')}`;
}

interface BreathingHeaderLogoProps {
  className?: string;
}

export function BreathingHeaderLogo({ className = '' }: BreathingHeaderLogoProps) {
  // Unique gradient colors used in the rook
  const uniqueColors = [...new Set(ROOK_BLOCKS.map(b => b.color))];

  return (
    <svg
      viewBox="0 0 520 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink min-w-0 w-[88px] sm:w-[140px] md:w-[160px] h-auto ${className}`}
      aria-label="Chess Path"
      role="img"
    >
      <defs>
        {/* Path wordmark gradient */}
        <linearGradient id="hdr-pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFC800"/>
          <stop offset="55%" stopColor="#FFC800"/>
          <stop offset="75%" stopColor="#FF6B6B"/>
          <stop offset="100%" stopColor="#1CB0F6"/>
        </linearGradient>
        {/* Matte gradients for each rook block color */}
        {uniqueColors.map(color => {
          const g = GRADIENT_COLORS[color];
          if (!g) return null;
          return (
            <linearGradient key={color} id={gradientId(color)} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={g.light}/>
              <stop offset="20%" stopColor={g.mid}/>
              <stop offset="40%" stopColor={g.base}/>
              <stop offset="100%" stopColor={g.dark}/>
            </linearGradient>
          );
        })}
      </defs>

      <style>{`
        @keyframes headerRookBreathe {
          0%, 100% { opacity: 0.45; filter: brightness(0.8); }
          50% { opacity: 1; filter: brightness(1.3); }
        }
      `}</style>

      {/* Rook blocks with breathing animation */}
      {ROOK_BLOCKS.map((block, i) => {
        // Wave: top-to-bottom (y), slightly staggered left-to-right (x)
        const waveDelay = (block.y * 0.18) + (block.x * 0.06);
        const px = block.x * 18 + 8;
        const py = block.y * 18 + 8;
        return (
          <rect
            key={i}
            x={px}
            y={py}
            width={14}
            height={14}
            rx={2}
            fill={`url(#${gradientId(block.color)})`}
            style={{
              animation: `headerRookBreathe 2.4s ease-in-out ${waveDelay}s infinite`,
            }}
          />
        );
      })}

      {/* Wordmark: "chess" dark, "path" gradient */}
      <text x="120" y="82" fontFamily="DM Sans, Inter, system-ui, sans-serif" fontSize="72" fontWeight="700">
        <tspan fill="#0F172A">chess</tspan>
        <tspan fill="url(#hdr-pathGradient)">path</tspan>
      </text>
    </svg>
  );
}
