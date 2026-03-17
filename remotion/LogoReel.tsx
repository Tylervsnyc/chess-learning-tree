import React from 'react';
import { useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { FPS, FRAME_W, FRAME_H } from './lib/timing';

const { fontFamily } = loadFont();

// ── Matte block styling (same as ReelLogo) ──
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
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

// ── Rook blocks (grid coords) ──
const ROOK_BLOCKS = [
  { x: 0, y: 0, color: '#1CB0F6' },
  { x: 2, y: 0, color: '#2FCBEF' },
  { x: 4, y: 0, color: '#A560E8' },
  { x: 0, y: 1, color: '#58CC02' },
  { x: 1, y: 1, color: '#FFC800' }, // <-- flicker block
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

// Deterministic pseudo-random power-on delay per block (0 to 2.5s)
function getPowerOnDelay(x: number, y: number): number {
  const seed = (x * 7 + y * 13) % 22;
  return (seed / 22) * 4.5;
}

// ── Morse code for "chess" — OFF periods as percentage ranges of a 6s cycle ──
// C: -.-. H: .... E: . S: ... S: ...
// 48 time units total. Each range is [start%, end%] where the block is dark.
const MORSE_OFF_RANGES = [
  // C: dash
  [0, 6.25],
  // C: dot
  [8.33, 10.42],
  // C: dash
  [12.5, 18.75],
  // C: dot
  [20.83, 22.92],
  // H: dot 1
  [29.17, 31.25],
  // H: dot 2
  [33.33, 35.42],
  // H: dot 3
  [37.5, 39.58],
  // H: dot 4
  [41.67, 43.75],
  // E: dot
  [50, 52.08],
  // S: dot 1
  [58.33, 60.42],
  // S: dot 2
  [62.5, 64.58],
  // S: dot 3
  [66.67, 68.75],
  // S: dot 1
  [75, 77.08],
  // S: dot 2
  [79.17, 81.25],
  // S: dot 3
  [83.33, 85.42],
];

const MORSE_CYCLE_S = 6; // seconds per morse cycle
const FLICKER_X = 1;
const FLICKER_Y = 1;

// ── Morse code for "path": P(·--·) A(·-) T(-) H(····) ──
// 42 time units total, 18s cycle (3x slower than "chess")
const PATH_OFF_RANGES = [
  // P: dot
  [0, 2.381],
  // P: dash
  [4.762, 11.905],
  // P: dash
  [14.286, 21.429],
  // P: dot
  [23.810, 26.190],
  // A: dot
  [33.333, 35.714],
  // A: dash
  [38.095, 45.238],
  // T: dash
  [52.381, 59.524],
  // H: dot 1
  [66.667, 69.048],
  // H: dot 2
  [71.429, 73.810],
  // H: dot 3
  [76.190, 78.571],
  // H: dot 4
  [80.952, 83.333],
];
const PATH_CYCLE_S = 18;
const PATH_FLICKER_X = 3;
const PATH_FLICKER_Y = 2;
const PATH_START_S = 8;

function getBlockBrightness(x: number, y: number, timeSec: number): number {
  const delay = getPowerOnDelay(x, y);
  const powerOnDuration = 0.5;

  // Before power on starts: dark
  if (timeSec < delay) return 0.1;

  // During power on: ramp up
  const elapsed = timeSec - delay;
  if (elapsed < powerOnDuration) {
    const progress = elapsed / powerOnDuration;
    // Quick flash then settle: peak at 60%, settle to 1.0
    if (progress < 0.6) return 0.1 + (1.4 - 0.1) * (progress / 0.6);
    return 1.4 - (1.4 - 1.0) * ((progress - 0.6) / 0.4);
  }

  // After power on: check if this is a flicker block
  if (x === FLICKER_X && y === FLICKER_Y) {
    const flickerStart = delay + powerOnDuration;
    const flickerTime = timeSec - flickerStart;
    const cyclePos = ((flickerTime % MORSE_CYCLE_S) / MORSE_CYCLE_S) * 100;

    for (const [start, end] of MORSE_OFF_RANGES) {
      if (cyclePos >= start && cyclePos < end) return 0.1;
    }
  }

  // Purple block: morse "path" at 3x slower, starts at 6s
  if (x === PATH_FLICKER_X && y === PATH_FLICKER_Y && timeSec >= PATH_START_S) {
    const flickerTime = timeSec - PATH_START_S;
    const cyclePos = ((flickerTime % PATH_CYCLE_S) / PATH_CYCLE_S) * 100;

    for (const [start, end] of PATH_OFF_RANGES) {
      if (cyclePos >= start && cyclePos < end) return 0.1;
    }
  }

  return 1.0;
}

// ── Layout constants ──
const BLOCK_PX = 72;
const GAP_PX = 10;
const ROOK_W = 5 * BLOCK_PX + 4 * GAP_PX;
const ROOK_H = 6 * BLOCK_PX + 5 * GAP_PX;
const BLOCK_RADIUS = 10;
const SCALE = BLOCK_PX / 14;

export const LOGO_REEL_FRAMES = 25 * FPS; // 25 seconds

export const LogoReel: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Tagline fades in at 0.6s
  const taglineOpacity = Math.min(1, Math.max(0, (t - 0.6) / 0.4));
  const taglineY = 6 * (1 - taglineOpacity);

  const s = (v: number) => `${(v * SCALE).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        gap: 48,
      }}
    >
      {/* Rook */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(5, ${BLOCK_PX}px)`,
          gridTemplateRows: `repeat(6, ${BLOCK_PX}px)`,
          gap: GAP_PX,
          width: ROOK_W,
          height: ROOK_H,
        }}
      >
        {Array.from({ length: 30 }, (_, i) => {
          const gx = i % 5;
          const gy = Math.floor(i / 5);
          const block = ROOK_BLOCKS.find(b => b.x === gx && b.y === gy);
          if (!block) return <div key={i} />;

          const brightness = getBlockBrightness(gx, gy, t);

          return (
            <div
              key={i}
              style={{
                borderRadius: BLOCK_RADIUS,
                background: getMatteBackground(block.color),
                boxShadow: insetShadow,
                filter: `brightness(${brightness.toFixed(2)}) saturate(${brightness < 0.5 ? 0 : 1})`,
              }}
            />
          );
        })}
      </div>

      {/* Wordmark */}
      <div style={{ fontSize: 140, fontWeight: 700, lineHeight: 1 }}>
        <span style={{ color: '#2A3C45' }}>chess</span>
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
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: '#6B7B8D',
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        The fun way to learn chess
      </div>
    </div>
  );
};
