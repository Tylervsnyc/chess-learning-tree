import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { FRAME_W, FRAME_H, FPS } from '../lib/timing';

/**
 * The end card's background, built in depth rather than as one flat fill.
 *
 * Five layers, back to front:
 *   1. a cool vertical wash (the page never sits at one value)
 *   2. a tilted board field — actual chess squares, very low contrast
 *   3. far blocks: the rook mark's own pixels, blurred, drifting slowly
 *   4. a soft spotlight that lifts the icons off the field
 *   5. near blocks: bigger, blurrier, faster — parallax in front of the subject
 *
 * Blur + size + drift speed carry the depth; nothing here competes with the
 * icons for attention, and everything derives from the brand's own material
 * (board squares and logo blocks), not from generic decoration.
 */

const PALETTE = [
  '#1CB0F6',
  '#2FCBEF',
  '#A560E8',
  '#58CC02',
  '#FFC800',
  '#FF9600',
  '#FF6B6B',
  '#FF4B4B',
];

/** Deterministic 0..1 — the same blocks every render. */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Block {
  x: number;
  y: number;
  size: number;
  color: string;
  rot: number;
  drift: number;
  opacity: number;
  blur: number;
}

function makeBlocks(count: number, seed: number, near: boolean): Block[] {
  const out: Block[] = [];
  for (let i = 0; i < count; i++) {
    const s = seed + i * 7.13;
    out.push({
      x: rand(s) * (FRAME_W + 200) - 100,
      y: rand(s + 1) * (FRAME_H + 200) - 100,
      size: near ? 78 + rand(s + 2) * 90 : 26 + rand(s + 2) * 44,
      color: PALETTE[Math.floor(rand(s + 3) * PALETTE.length)],
      rot: rand(s + 4) * 40 - 20,
      drift: (near ? 90 : 34) * (0.6 + rand(s + 5) * 0.8),
      opacity: near ? 0.1 + rand(s + 6) * 0.08 : 0.14 + rand(s + 6) * 0.16,
      blur: near ? 7 + rand(s + 7) * 7 : rand(s + 7) * 2.5,
    });
  }
  return out;
}

const FAR = makeBlocks(26, 3.2, false);
const NEAR = makeBlocks(7, 91.4, true);

const BlockField: React.FC<{ blocks: Block[]; t: number }> = ({ blocks, t }) => (
  <>
    {blocks.map((b, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: b.x,
          top: b.y - t * b.drift,
          width: b.size,
          height: b.size,
          borderRadius: b.size * 0.22,
          backgroundColor: b.color,
          opacity: b.opacity,
          filter: b.blur ? `blur(${b.blur}px)` : undefined,
          transform: `rotate(${b.rot + Math.sin(t * 0.6 + i) * 3}deg)`,
        }}
      />
    ))}
  </>
);

export const EndCardBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // The field settles: it arrives with a touch more energy than it keeps.
  const settle = interpolate(frame, [0, 70], [1, 0.72], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* 1 — wash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #F3F7FA 0%, #EBF0F5 42%, #DFE7EF 100%)',
        }}
      />

      {/* 2 — the board field, tilted and faint */}
      <div
        style={{
          position: 'absolute',
          left: -420,
          top: -420,
          width: FRAME_W + 840,
          height: FRAME_H + 840,
          // Big squares, hard tilt: small even gray squares read as a
          // transparency grid, not a chessboard.
          transform: `rotate(-15deg) translateY(${-t * 10}px)`,
          background:
            'repeating-conic-gradient(#3C6B4A 0% 25%, transparent 0% 50%) 0 0 / 330px 330px',
          opacity: 0.055,
        }}
      />

      {/* 3 — far blocks */}
      <div style={{ position: 'absolute', inset: 0, opacity: settle }}>
        <BlockField blocks={FAR} t={t} />
      </div>

      {/* 4 — spotlight under the subject */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.72) 26%, rgba(255,255,255,0) 58%)',
        }}
      />

      {/* 5 — near blocks, in front of the light */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <BlockField blocks={NEAR} t={t} />
      </div>

      {/* edge vignette so the frame holds together on a phone */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 78% at 50% 46%, rgba(223,231,239,0) 55%, rgba(200,213,226,0.55) 100%)',
        }}
      />
    </div>
  );
};
