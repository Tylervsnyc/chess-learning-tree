'use client';

/**
 * RookieCampfire — Rookie's own blocks flicker into fire.
 * Red at her base → yellow at her top, blocks rising and shimmering.
 * Ported from the "Campfire" effect on /test-rook-animations.
 *
 * active=false → she cools to her normal block colors ("no fire today").
 * blaze 0..1   → fire intensity (drive this off streak length).
 *
 * Self-contained: renders the blocks, a ground glow, and rising embers.
 */
import { useState, useEffect, useRef } from 'react';
import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function RookieCampfire({
  blockSize = 15,
  active = true,
  blaze = 0.6,
  withFx = true,
}: {
  blockSize?: number;
  active?: boolean;
  blaze?: number;
  withFx?: boolean;
}) {
  const [t, setT] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    // Respect reduced-motion: hold a static lit frame.
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setT(0.7);
      return;
    }
    start.current = performance.now();
    const tick = (now: number) => {
      setT((now - start.current) / 1000);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;
  const scale = blockSize / 14;
  const sh = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${sh(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${sh(0.75)} 0 rgba(255,255,255,0.15)`;
  const amp = 0.4 + blaze * 0.8; // motion amplitude scales with streak

  return (
    <div className="relative flex items-end justify-center" style={{ width: gridWidth, height: gridHeight }}>
      {/* ground glow + rising embers */}
      {active && withFx && (
        <>
          <div
            className="pointer-events-none absolute rounded-[50%] bg-orange-500/25 blur-xl animate-[rkGlow_1.6s_ease-in-out_infinite]"
            style={{ width: gridWidth * 1.3, height: gridHeight * 0.5, bottom: -gridHeight * 0.1 }}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="pointer-events-none absolute rounded-full bg-amber-300 animate-[rkEmber_2.8s_linear_infinite]"
              style={{
                width: 3,
                height: 3,
                left: `${22 + i * 14}%`,
                bottom: gridHeight * 0.35,
                animationDelay: `${i * 0.5}s`,
                boxShadow: '0 0 5px 1px rgba(255,180,60,0.9)',
              }}
            />
          ))}
        </>
      )}

      {/* Rookie's blocks */}
      <div style={{ position: 'relative', width: gridWidth, height: gridHeight, transform: 'translate3d(0,0,0)' }}>
        {ROOK_BLOCKS.map((block) => {
          const { x, y } = block;
          const blockIdx = x + y * 5;
          const baseLeft = x * (blockSize + gap);
          const baseTop = y * (blockSize + gap);

          let bg = block.color;
          let brightness = 1;
          let offX = 0;
          let offY = 0;
          let blkScale = 1;

          if (active) {
            const flameHeight = 1 - y / 5; // hotter toward the top
            const flicker = seededRandom(Math.floor(t * 12) + blockIdx) * 0.4;
            brightness = 0.5 + flameHeight * 0.8 + flicker;
            offY = -flameHeight * Math.sin(t * 3 + x * 2) * 8 * amp;
            offX = Math.sin(t * 2 + y * 1.5 + x) * flameHeight * 5 * amp;
            const fireHue = flameHeight * 50; // 0 red → 50 yellow-orange
            bg = hslToHex(fireHue + flicker * 20, 90 - flameHeight * 20, 30 + flameHeight * 30 + flicker * 15);
            blkScale = 1 + flameHeight * Math.sin(t * 4 + blockIdx) * 0.1 * amp;
          } else {
            brightness = 0.85; // cooled to her normal self
          }

          return (
            <div
              key={`${x},${y}`}
              style={{
                position: 'absolute',
                left: baseLeft + offX,
                top: baseTop + offY,
                width: blockSize,
                height: blockSize,
                borderRadius: radius,
                background: getMatteBackground(bg),
                boxShadow: insetShadow,
                transform: `scale(${blkScale})`,
                filter: `brightness(${brightness})`,
              }}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes rkGlow {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%     { opacity: 0.95; transform: scale(1.1); }
        }
        @keyframes rkEmber {
          0%   { transform: translate(0,0) scale(1); opacity: 0; }
          15%  { opacity: 1; }
          80%  { opacity: 0.7; }
          100% { transform: translate(6px, -60px) scale(0.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
