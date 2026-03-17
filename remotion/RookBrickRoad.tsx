import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { FPS, FRAME_W, FRAME_H } from './lib/timing';

const { fontFamily } = loadFont();

// ── Matte block styling ──
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}
function lighten(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = amt / 100;
  return rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f);
}
function darken(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 - amt / 100;
  return rgbToHex(r * f, g * f, b * f);
}
function getMatteBackground(color: string): string {
  return `linear-gradient(to bottom, ${lighten(color, 18)} 0%, ${lighten(color, 12)} 20%, ${color} 40%, ${darken(color, 12)} 100%)`;
}
function getMatteBoxShadow(color: string, scale: number = 1): string {
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  return [
    `inset 0 ${s(0.75)} 0 ${darken(color, 6)}`,
    `inset 0 -${s(0.75)} 0 ${lighten(color, 6)}`,
    `0 ${s(0.5)} 0 rgba(0,0,0,0.25)`,
    `0 0 0 ${s(0.5)} rgba(0,0,0,0.15)`,
  ].join(', ');
}

// ── Rook blocks in grid coords ──
const ROOK_BLOCKS = [
  { x: 0, y: 0, color: '#1CB0F6' },
  { x: 2, y: 0, color: '#2FCBEF' },
  { x: 4, y: 0, color: '#A560E8' },
  { x: 0, y: 1, color: '#58CC02' },
  { x: 1, y: 1, color: '#FFC800' },
  { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' },
  { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' },
  { x: 2, y: 2, color: '#2FCBEF' },
  { x: 3, y: 2, color: '#A560E8' },
  { x: 1, y: 3, color: '#58CC02' },
  { x: 2, y: 3, color: '#FFC800' },
  { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' },
  { x: 2, y: 4, color: '#FF4B4B' },
  { x: 3, y: 4, color: '#1CB0F6' },
  { x: 0, y: 5, color: '#2FCBEF' },
  { x: 1, y: 5, color: '#A560E8' },
  { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' },
  { x: 4, y: 5, color: '#FF9600' },
];

// Shuffled mapping: which road position each block lands on (breaks rainbow)
const ROAD_ASSIGNMENT = [
  17, 3, 10, 21, 7, 14, 0, 19, 5, 12,
  8, 16, 1, 20, 11, 6, 15, 9, 4, 13, 18, 2,
];

// ── Layout ──
const BLOCK_PX = 72;
const GAP_PX = 10;
const ROOK_W = 5 * BLOCK_PX + 4 * GAP_PX;
const ROOK_H = 6 * BLOCK_PX + 5 * GAP_PX;
const BLOCK_RADIUS = 10;
const SCALE = BLOCK_PX / 14;

const ROOK_CENTER_X = FRAME_W / 2;
const ROOK_CENTER_Y = FRAME_H / 2;

function gridToRookPx(gx: number, gy: number) {
  return {
    x: gx * (BLOCK_PX + GAP_PX),
    y: gy * (BLOCK_PX + GAP_PX),
  };
}

function gridToScreen(gx: number, gy: number) {
  const rel = gridToRookPx(gx, gy);
  return {
    x: ROOK_CENTER_X - ROOK_W / 2 + rel.x + BLOCK_PX / 2,
    y: ROOK_CENTER_Y - ROOK_H / 2 + rel.y + BLOCK_PX / 2,
  };
}

// ── Winding brick road path — full screen, bottom to top ──
const ROAD_PATH: { x: number; y: number }[] = (() => {
  const path: { x: number; y: number }[] = [];
  const topY = 80;
  const bottomY = FRAME_H - 80;
  const totalHeight = bottomY - topY;

  for (let i = 0; i < 22; i++) {
    const progress = i / 21;
    const y = topY + progress * totalHeight;
    const amplitude = 140 + Math.sin(progress * Math.PI) * 80;
    const frequency = 2.2;
    const x = FRAME_W / 2 + Math.sin(progress * Math.PI * frequency) * amplitude;
    path.push({ x, y });
  }
  return path;
})();

// ── Departure order for staggered version: bottom of rook first ──
const departureOrder = [...ROOK_BLOCKS]
  .map((b, i) => ({ ...b, origIndex: i }))
  .sort((a, b) => b.y - a.y || a.x - b.x)
  .map((b) => b.origIndex);

const departureSequence = new Array(ROOK_BLOCKS.length);
departureOrder.forEach((origIdx, seq) => {
  departureSequence[origIdx] = seq;
});

// ════════════════════════════════════════════
// Version 1: STAGGERED — blocks depart one by one (10s)
// ════════════════════════════════════════════
const STAG_HOLD_S = 2.0;
const STAG_STAGGER_S = 0.25;
const STAG_FLY_S = 1.2;
const STAG_TOTAL_S = 10;

export const BRICK_ROAD_STAGGERED_FRAMES = Math.ceil(STAG_TOTAL_S * FPS);

export const RookBrickRoadStaggered: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Wordmark + tagline — dissolves as blocks start moving */}
      {(() => {
        const textOpacity = interpolate(t, [STAG_HOLD_S - 0.3, STAG_HOLD_S + 0.5], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const textY = ROOK_CENTER_Y + ROOK_H / 2 + 40;
        return (
          <div
            style={{
              position: 'absolute',
              top: textY,
              left: 0,
              width: FRAME_W,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              opacity: textOpacity,
              fontFamily,
            }}
          >
            <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1 }}>
              <span style={{ color: '#2A3C45' }}>chess</span>
              <span
                style={{
                  background:
                    'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                path
              </span>
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                color: '#6B7B8D',
              }}
            >
              The fun way to learn chess
            </div>
          </div>
        );
      })()}

      {ROOK_BLOCKS.map((block, i) => {
        const seq = departureSequence[i];
        const flyStart = STAG_HOLD_S + seq * STAG_STAGGER_S;
        const flyEnd = flyStart + STAG_FLY_S;

        const start = gridToScreen(block.x, block.y);
        const roadIdx = ROAD_ASSIGNMENT[i];
        const end = ROAD_PATH[roadIdx];

        const progress = interpolate(t, [flyStart, flyEnd], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.25, 1, 0.5, 1),
        });

        const cx = start.x + (end.x - start.x) * progress;
        const cy = start.y + (end.y - start.y) * progress;
        const arcHeight = -120 * Math.sin(progress * Math.PI);
        const finalY = cy + arcHeight;

        const scale = interpolate(
          t,
          [flyEnd - 0.2, flyEnd, flyEnd + 0.15],
          [1.0, 1.15, 1.0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const brightness = 1 + 0.06 * Math.sin(t * 1.5 + i * 0.5);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - BLOCK_PX / 2,
              top: finalY - BLOCK_PX / 2,
              width: BLOCK_PX,
              height: BLOCK_PX,
              borderRadius: BLOCK_RADIUS,
              background: getMatteBackground(block.color),
              boxShadow: getMatteBoxShadow(block.color, SCALE),
              transform: `scale(${scale})`,
              filter: `brightness(${brightness})`,
            }}
          />
        );
      })}
    </div>
  );
};

// ════════════════════════════════════════════
// Version 2: SIMULTANEOUS — all blocks move at once (5s)
// ════════════════════════════════════════════
const SIM_HOLD_S = 1.0;
const SIM_FLY_S = 3.0;
const SIM_TOTAL_S = 5;

export const BRICK_ROAD_SIMULTANEOUS_FRAMES = Math.ceil(SIM_TOTAL_S * FPS);

export const RookBrickRoadSimultaneous: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Wordmark + tagline — dissolves as blocks start moving */}
      {(() => {
        const textOpacity = interpolate(t, [SIM_HOLD_S - 0.3, SIM_HOLD_S + 0.5], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const textY = ROOK_CENTER_Y + ROOK_H / 2 + 40;
        return (
          <div
            style={{
              position: 'absolute',
              top: textY,
              left: 0,
              width: FRAME_W,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              opacity: textOpacity,
              fontFamily,
            }}
          >
            <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1 }}>
              <span style={{ color: '#2A3C45' }}>chess</span>
              <span
                style={{
                  background:
                    'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                path
              </span>
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                color: '#6B7B8D',
              }}
            >
              The fun way to learn chess
            </div>
          </div>
        );
      })()}

      {ROOK_BLOCKS.map((block, i) => {
        const flyEnd = SIM_HOLD_S + SIM_FLY_S;

        const start = gridToScreen(block.x, block.y);
        const roadIdx = ROAD_ASSIGNMENT[i];
        const end = ROAD_PATH[roadIdx];

        const progress = interpolate(t, [SIM_HOLD_S, flyEnd], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        });

        const cx = start.x + (end.x - start.x) * progress;
        const cy = start.y + (end.y - start.y) * progress;
        const arcHeight = -80 * Math.sin(progress * Math.PI);
        const finalY = cy + arcHeight;

        const scale = interpolate(
          t,
          [flyEnd - 0.2, flyEnd, flyEnd + 0.15],
          [1.0, 1.1, 1.0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const brightness = 1 + 0.06 * Math.sin(t * 1.5 + i * 0.5);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - BLOCK_PX / 2,
              top: finalY - BLOCK_PX / 2,
              width: BLOCK_PX,
              height: BLOCK_PX,
              borderRadius: BLOCK_RADIUS,
              background: getMatteBackground(block.color),
              boxShadow: getMatteBoxShadow(block.color, SCALE),
              transform: `scale(${scale})`,
              filter: `brightness(${brightness})`,
            }}
          />
        );
      })}
    </div>
  );
};
