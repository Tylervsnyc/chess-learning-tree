'use client';

import { useEffect, useState } from 'react';
import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

/**
 * RookTornado — 22 rook blocks swirl in a 3D tornado and assemble into the rook.
 * Used as the intro animation for the Candidates title card.
 *
 * Phases:
 * 1. Tornado (0-1.2s): blocks orbit in a wide spiral with 3D depth
 * 2. Converge (1.2-2.4s): spiral tightens, blocks find their grid positions
 * 3. Assembled (2.4s+): rook is formed, brief glow pulse, then onComplete fires
 */

interface RookTornadoProps {
  onComplete?: () => void;
  /** Total animation duration in ms before onComplete fires */
  duration?: number;
  /** Block size in px (default 36 = xl) */
  blockSize?: number;
  /** Scale factor for the tornado spread radius (default 1) */
  spread?: number;
}

function buildConstants(blockSize: number) {
  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;
  return { gap, radius, gridWidth, gridHeight };
}

function getFinalPos(x: number, y: number, blockSize: number) {
  const { gap, gridWidth, gridHeight } = buildConstants(blockSize);
  return {
    x: x * (blockSize + gap) - gridWidth / 2 + blockSize / 2,
    y: y * (blockSize + gap) - gridHeight / 2 + blockSize / 2,
  };
}

function getTornadoStart(index: number, total: number, spread: number) {
  const angle = (index / total) * Math.PI * 4 + Math.PI * 0.5;
  const heightSpread = 300 * spread;
  const radiusBase = (140 + (index / total) * 60) * spread;
  const yPos = -heightSpread / 2 + (index / total) * heightSpread;
  const funnelFactor = 1 - (index / total) * 0.5;
  const r = radiusBase * funnelFactor;

  return {
    x: Math.cos(angle) * r,
    y: yPos,
    z: Math.sin(angle) * 100 * spread,
    rotation: angle * (180 / Math.PI) + index * 30,
  };
}

export function RookTornado({
  onComplete,
  duration = 3500,
  blockSize = 36,
  spread = 1,
}: RookTornadoProps) {
  const [phase, setPhase] = useState<'tornado' | 'converge' | 'assembled'>('tornado');
  const { radius, gridWidth, gridHeight } = buildConstants(blockSize);
  const scale = blockSize / 14;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('converge'), 1200);
    const t2 = setTimeout(() => setPhase('assembled'), 2400);
    const t3 = onComplete ? setTimeout(onComplete, duration) : undefined;
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (t3) clearTimeout(t3);
    };
  }, [onComplete, duration]);

  const insetShadow = `inset 0 ${(0.75 * scale).toFixed(2)}px 0 rgba(0,0,0,0.15), inset 0 -${(0.75 * scale).toFixed(2)}px 0 rgba(255,255,255,0.15)`;

  return (
    <div
      className="relative"
      style={{
        width: gridWidth,
        height: gridHeight,
        perspective: 600,
        perspectiveOrigin: '50% 50%',
      }}
    >
      <style>{TORNADO_KEYFRAMES}</style>

      {ROOK_BLOCKS.map((block, i) => {
        const start = getTornadoStart(i, ROOK_BLOCKS.length, spread);
        const final = getFinalPos(block.x, block.y, blockSize);

        return (
          <div
            key={`${block.x},${block.y}`}
            style={{
              position: 'absolute',
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              background: getMatteBackground(block.color),
              boxShadow: insetShadow,
              left: '50%',
              top: '50%',
              marginLeft: -blockSize / 2,
              marginTop: -blockSize / 2,
              '--start-x': `${start.x}px`,
              '--start-y': `${start.y}px`,
              '--start-z': `${start.z}px`,
              '--start-rot': `${start.rotation}deg`,
              '--end-x': `${final.x}px`,
              '--end-y': `${final.y}px`,
              '--delay': `${i * 0.04}s`,
              transform:
                phase === 'assembled'
                  ? `translate3d(${final.x}px, ${final.y}px, 0)`
                  : undefined,
              animation:
                phase === 'tornado'
                  ? `tornadoOrbit 1.2s cubic-bezier(0.4, 0, 0.2, 1) var(--delay) both`
                  : phase === 'converge'
                    ? `tornadoConverge 1.2s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) both`
                    : `rookAssembleGlow 0.8s ease-out ${i * 0.02}s both`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

const TORNADO_KEYFRAMES = `
  @keyframes tornadoOrbit {
    0% {
      transform: translate3d(var(--start-x), calc(var(--start-y) - 100px), var(--start-z))
                 rotate(var(--start-rot))
                 scale(0.3);
      opacity: 0;
      filter: brightness(2) blur(2px);
    }
    15% {
      opacity: 1;
      filter: brightness(1.5) blur(0px);
    }
    100% {
      transform: translate3d(
                   calc(var(--start-x) * 0.6),
                   calc(var(--start-y) * 0.5),
                   calc(var(--start-z) * 0.4)
                 )
                 rotate(calc(var(--start-rot) + 180deg))
                 scale(0.8);
      opacity: 1;
      filter: brightness(1.2);
    }
  }

  @keyframes tornadoConverge {
    0% {
      transform: translate3d(
                   calc(var(--start-x) * 0.6),
                   calc(var(--start-y) * 0.5),
                   calc(var(--start-z) * 0.4)
                 )
                 rotate(calc(var(--start-rot) + 180deg))
                 scale(0.8);
      filter: brightness(1.2);
    }
    60% {
      transform: translate3d(var(--end-x), var(--end-y), 0)
                 rotate(360deg)
                 scale(1.15);
      filter: brightness(1.6);
    }
    100% {
      transform: translate3d(var(--end-x), var(--end-y), 0)
                 rotate(0deg)
                 scale(1);
      filter: brightness(1);
    }
  }

  @keyframes rookAssembleGlow {
    0% {
      transform: translate3d(var(--end-x), var(--end-y), 0) scale(1);
      filter: brightness(1);
    }
    40% {
      transform: translate3d(var(--end-x), var(--end-y), 0) scale(1.08);
      filter: brightness(1.8) saturate(1.3);
    }
    100% {
      transform: translate3d(var(--end-x), var(--end-y), 0) scale(1);
      filter: brightness(1) saturate(1);
    }
  }
`;
