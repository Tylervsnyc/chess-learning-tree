'use client';

import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

/**
 * BreathingRook — The standard loading indicator for Chess Path.
 * 22 rook blocks stay in place; colors breathe with a staggered wave.
 * See RULES.md §35.
 *
 * Animation modes:
 * - breathe: gentle slow brightness pulse (default when animate=true)
 * - enter: blocks pop in from nothing with staggered delay
 * - think: fast shimmer wave (for loading/processing states)
 * - celebrate: blocks do a quick scale bounce with rainbow brightness
 */

const SIZE_MAP = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
};

type AnimationMode = 'breathe' | 'enter' | 'think' | 'celebrate' | 'powerOn' | 'talk';

/**
 * Mood shifts Rookie's colors like an octopus.
 * Strong moods push towards monochrome — like a uniform changing with confidence.
 */
export type RookieMood =
  | 'neutral'
  | 'happy'
  | 'nervous'
  | 'angry'
  | 'smug'
  | 'surprised'
  | 'embarrassed'  // power flickers out
  | 'excited'      // golden overdrive
  | 'defeated'     // dark, almost off
  | 'scheming'     // sinister green
  | 'panicking'    // rapid orange flashes
  | 'zen'          // soft pastel calm
  // -- potential new moods --
  | 'shadow'       // matte black villain arc
  | 'proud'        // warm bronze glow
  | 'suspicious'   // narrow amber
  | 'heartbroken'  // deep indigo
  | 'mischievous'  // hot pink sparkle
  | 'sleepy'       // dim warm purple
  | 'starstruck'   // bright silver shimmer
  | 'confused'     // swirling unsettled
  | 'stubborn'     // burnt orange rigid
  | 'grateful'     // soft warm pink
  | 'feral'        // chaotic rainbow strobe
  | 'royal';       // deep gold + purple

// Each mood: target color to blend toward, blend strength, brightness
const MOOD_TINTS: Record<RookieMood, { color: [number, number, number]; blend: number; brightness: number }> = {
  neutral:     { color: [0, 0, 0],       blend: 0,    brightness: 1 },
  happy:       { color: [88, 204, 2],    blend: 0.55, brightness: 1.1 },
  nervous:     { color: [120, 140, 170], blend: 0.6,  brightness: 0.8 },
  angry:       { color: [220, 40, 40],   blend: 0.75, brightness: 0.95 },
  smug:        { color: [160, 80, 220],  blend: 0.6,  brightness: 1.08 },
  surprised:   { color: [28, 200, 255],  blend: 0.65, brightness: 1.15 },
  embarrassed: { color: [60, 50, 50],    blend: 0.85, brightness: 0.25 },  // nearly black — powered down
  excited:     { color: [255, 200, 0],   blend: 0.7,  brightness: 1.25 },  // golden overdrive
  defeated:    { color: [40, 40, 45],    blend: 0.8,  brightness: 0.35 },  // dark husk, barely alive
  scheming:    { color: [0, 180, 80],    blend: 0.7,  brightness: 0.9 },   // sinister matrix green
  panicking:   { color: [255, 120, 0],   blend: 0.75, brightness: 1.1 },   // alarm orange
  zen:         { color: [180, 200, 220], blend: 0.5,  brightness: 1.05 },  // soft pastel wash
  // -- potential new moods --
  shadow:      { color: [15, 15, 15],    blend: 0.95, brightness: 0.3 },   // matte black villain
  proud:       { color: [180, 130, 50],  blend: 0.6,  brightness: 1.1 },   // warm bronze glow
  suspicious:  { color: [200, 160, 40],  blend: 0.6,  brightness: 0.85 },  // narrow amber
  heartbroken: { color: [60, 40, 140],   blend: 0.7,  brightness: 0.7 },   // deep indigo sadness
  mischievous: { color: [240, 60, 180],  blend: 0.65, brightness: 1.15 },  // hot pink sparkle
  sleepy:      { color: [140, 100, 180], blend: 0.6,  brightness: 0.5 },   // dim warm purple
  starstruck:  { color: [220, 225, 240], blend: 0.7,  brightness: 1.4 },   // bright silver shimmer
  confused:    { color: [160, 120, 180], blend: 0.4,  brightness: 1.0 },   // swirling unsettled mix
  stubborn:    { color: [180, 90, 30],   blend: 0.7,  brightness: 0.9 },   // burnt orange rigid
  grateful:    { color: [230, 140, 160], blend: 0.55, brightness: 1.1 },   // soft warm pink
  feral:       { color: [255, 50, 50],   blend: 0.3,  brightness: 1.5 },   // chaotic overdrive
  royal:       { color: [180, 140, 40],  blend: 0.65, brightness: 1.05 },  // deep gold + purple
};

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function tintColor(hex: string, mood: RookieMood): string {
  if (mood === 'neutral') return hex;
  const [r, g, b] = hexToRgb(hex);
  const { color: [tr, tg, tb], blend, brightness } = MOOD_TINTS[mood];
  const mr = Math.round((r * (1 - blend) + tr * blend) * brightness);
  const mg = Math.round((g * (1 - blend) + tg * blend) * brightness);
  const mb = Math.round((b * (1 - blend) + tb * blend) * brightness);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  return `#${clamp(mr).toString(16).padStart(2, '0')}${clamp(mg).toString(16).padStart(2, '0')}${clamp(mb).toString(16).padStart(2, '0')}`;
}

interface BreathingRookProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  className?: string;
  /** Enable gentle breathing animation (slow human-like pulse) */
  animate?: boolean;
  /** Specific animation mode (overrides animate when set) */
  animation?: AnimationMode;
  /** Octopus-like color mood shift */
  mood?: RookieMood;
  /**
   * Live audio intensity (0–1) for talk mode.
   * Drives per-block brightness/scale from real-time audio analysis.
   * Center blocks react first, outer blocks lag slightly.
   */
  talkIntensity?: number;
}

// Build a lookup map: "x,y" → block
const BLOCK_MAP = new Map(ROOK_BLOCKS.map(b => [`${b.x},${b.y}`, b]));

// All 30 cells in the 5×6 grid, row by row
const ALL_CELLS = Array.from({ length: 30 }, (_, i) => ({
  x: i % 5,
  y: Math.floor(i / 5),
}));

// Center of the rook grid for distance calculations
const CENTER_X = 2;
const CENTER_Y = 2.5;

function getBlockDelay(x: number, y: number, mode: AnimationMode): number {
  const dist = Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2);
  const maxDist = 3.2;
  const normalized = dist / maxDist;

  switch (mode) {
    case 'enter':
      return normalized * 0.4; // 0-400ms stagger, center first
    case 'think':
      return (x + y) * 0.08; // fast diagonal wave
    case 'celebrate':
      return normalized * 0.15; // quick burst from center
    case 'talk':
      return normalized * 0.06; // very tight stagger — ripple from center
    case 'powerOn': {
      // Pseudo-random but deterministic per cell position
      const seed = (x * 7 + y * 13) % 22;
      return (seed / 22) * 2.5; // stagger over 2.5s so full animation ~3s
    }
    case 'breathe':
    default:
      return (x + y) * 0.18;
  }
}

// The block that flickers after powerOn (yellow square in the crown rim)
const FLICKER_BLOCK = { x: 1, y: 1 };
// Purple block that flickers morse "path" (4th row up, right side)
const PATH_FLICKER_BLOCK = { x: 3, y: 2 };

function getBlockAnimation(mode: AnimationMode, delay: number, x?: number, y?: number): string {
  switch (mode) {
    case 'enter':
      return `rookEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`;
    case 'think':
      return `rookThink 1.2s ease-in-out ${delay}s infinite`;
    case 'celebrate':
      return `rookCelebrate 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`;
    case 'powerOn': {
      const isChessFlicker = x === FLICKER_BLOCK.x && y === FLICKER_BLOCK.y;
      const isPathFlicker = x === PATH_FLICKER_BLOCK.x && y === PATH_FLICKER_BLOCK.y;
      if (isChessFlicker) {
        return `rookPowerOn 0.5s ease-out ${delay}s both, rookFlickerChess 6s step-end ${delay + 0.5}s infinite`;
      }
      if (isPathFlicker) {
        // 3x slower (18s cycle), starts at 8s
        return `rookPowerOn 0.5s ease-out ${delay}s both, rookFlickerPath 18s step-end 8s infinite`;
      }
      return `rookPowerOn 0.5s ease-out ${delay}s both`;
    }
    case 'talk':
      return `rookTalk 0.6s ease-in-out ${delay}s infinite`;
    case 'breathe':
    default:
      return `rookColorBreathe 5s ease-in-out ${delay}s infinite`;
  }
}

const ANIMATION_KEYFRAMES = `
  @keyframes rookColorBreathe {
    0%, 100% { filter: brightness(0.9) saturate(0.95); }
    50% { filter: brightness(1.5) saturate(1.2); }
  }
  @keyframes rookEnter {
    0% { opacity: 0; transform: scale(0); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes rookThink {
    0%, 100% { filter: brightness(1) saturate(1); transform: scale(1); }
    50% { filter: brightness(1.6) saturate(1.3); transform: scale(1.05); }
  }
  @keyframes rookTalk {
    0%, 100% { filter: brightness(1); transform: scale(1); }
    30% { filter: brightness(1.25); transform: scale(1.06); }
    60% { filter: brightness(1.1); transform: scale(0.97); }
  }
  @keyframes rookCelebrate {
    0% { transform: scale(1); filter: brightness(1); }
    40% { transform: scale(1.3); filter: brightness(1.8); }
    100% { transform: scale(1); filter: brightness(1.1); }
  }
  @keyframes rookPowerOn {
    0% { filter: brightness(0.1) saturate(0); }
    60% { filter: brightness(1.4) saturate(1.1); }
    100% { filter: brightness(1) saturate(1); }
  }
  @keyframes rookFlickerChess {
    /* Morse "chess": C(-.-.) H(....) E(.) S(...) S(...) — 48 units, 6s cycle */
    0%      { filter: brightness(0.1) saturate(0); }
    6.25%   { filter: brightness(1) saturate(1); }
    8.33%   { filter: brightness(0.1) saturate(0); }
    10.42%  { filter: brightness(1) saturate(1); }
    12.5%   { filter: brightness(0.1) saturate(0); }
    18.75%  { filter: brightness(1) saturate(1); }
    20.83%  { filter: brightness(0.1) saturate(0); }
    22.92%  { filter: brightness(1) saturate(1); }
    29.17%  { filter: brightness(0.1) saturate(0); }
    31.25%  { filter: brightness(1) saturate(1); }
    33.33%  { filter: brightness(0.1) saturate(0); }
    35.42%  { filter: brightness(1) saturate(1); }
    37.5%   { filter: brightness(0.1) saturate(0); }
    39.58%  { filter: brightness(1) saturate(1); }
    41.67%  { filter: brightness(0.1) saturate(0); }
    43.75%  { filter: brightness(1) saturate(1); }
    50%     { filter: brightness(0.1) saturate(0); }
    52.08%  { filter: brightness(1) saturate(1); }
    58.33%  { filter: brightness(0.1) saturate(0); }
    60.42%  { filter: brightness(1) saturate(1); }
    62.5%   { filter: brightness(0.1) saturate(0); }
    64.58%  { filter: brightness(1) saturate(1); }
    66.67%  { filter: brightness(0.1) saturate(0); }
    68.75%  { filter: brightness(1) saturate(1); }
    75%     { filter: brightness(0.1) saturate(0); }
    77.08%  { filter: brightness(1) saturate(1); }
    79.17%  { filter: brightness(0.1) saturate(0); }
    81.25%  { filter: brightness(1) saturate(1); }
    83.33%  { filter: brightness(0.1) saturate(0); }
    85.42%  { filter: brightness(1) saturate(1); }
    100%    { filter: brightness(1) saturate(1); }
  }
  @keyframes rookFlickerPath {
    /* Morse "path": P(.--.) A(.-) T(-) H(....) — 42 units, 18s cycle */
    0%      { filter: brightness(0.1) saturate(0); }
    2.381%  { filter: brightness(1) saturate(1); }
    4.762%  { filter: brightness(0.1) saturate(0); }
    11.905% { filter: brightness(1) saturate(1); }
    14.286% { filter: brightness(0.1) saturate(0); }
    21.429% { filter: brightness(1) saturate(1); }
    23.810% { filter: brightness(0.1) saturate(0); }
    26.190% { filter: brightness(1) saturate(1); }
    33.333% { filter: brightness(0.1) saturate(0); }
    35.714% { filter: brightness(1) saturate(1); }
    38.095% { filter: brightness(0.1) saturate(0); }
    45.238% { filter: brightness(1) saturate(1); }
    52.381% { filter: brightness(0.1) saturate(0); }
    59.524% { filter: brightness(1) saturate(1); }
    66.667% { filter: brightness(0.1) saturate(0); }
    69.048% { filter: brightness(1) saturate(1); }
    71.429% { filter: brightness(0.1) saturate(0); }
    73.810% { filter: brightness(1) saturate(1); }
    76.190% { filter: brightness(0.1) saturate(0); }
    78.571% { filter: brightness(1) saturate(1); }
    80.952% { filter: brightness(0.1) saturate(0); }
    83.333% { filter: brightness(1) saturate(1); }
    100%    { filter: brightness(1) saturate(1); }
  }
`;

const MOOD_KEYFRAMES = `
  @keyframes rookPowerOut {
    0% { opacity: 1; filter: brightness(1); }
    10% { opacity: 1; filter: brightness(1.5); }
    15% { opacity: 0.7; filter: brightness(0.3); }
    25% { opacity: 0.9; filter: brightness(0.8); }
    30% { opacity: 0.4; filter: brightness(0.15); }
    50% { opacity: 0.15; filter: brightness(0.1) saturate(0); }
    70% { opacity: 0.08; filter: brightness(0.05) saturate(0); }
    80% { opacity: 0.2; filter: brightness(0.15) saturate(0); }
    85% { opacity: 0.04; filter: brightness(0.02) saturate(0); }
    100% { opacity: 0.03; filter: brightness(0.02) saturate(0); }
  }
  @keyframes rookAlarmPulse {
    0%, 100% { filter: brightness(0.7); transform: scale(1); }
    50% { filter: brightness(1.6); transform: scale(1.08); }
  }
  @keyframes rookExcitedPulse {
    0%, 100% { filter: brightness(1) saturate(1.2); }
    25% { filter: brightness(1.5) saturate(1.6); }
    75% { filter: brightness(1.2) saturate(1.4); }
  }
  @keyframes rookSchemingScan {
    0%, 100% { filter: brightness(0.7) saturate(0.8); }
    50% { filter: brightness(1.3) saturate(1.4); }
  }
  @keyframes rookDefeatedFlicker {
    0%, 100% { opacity: 0.3; filter: brightness(0.3) saturate(0); }
    5% { opacity: 0.5; filter: brightness(0.6) saturate(0.2); }
    7% { opacity: 0.2; filter: brightness(0.15) saturate(0); }
    50% { opacity: 0.25; filter: brightness(0.25) saturate(0); }
    52% { opacity: 0.45; filter: brightness(0.5) saturate(0.1); }
    54% { opacity: 0.2; filter: brightness(0.2) saturate(0); }
  }
`;

// Static mood config — computed once at module level
const MOOD_BREATHE_SPEED: Record<RookieMood, number> = {
  neutral: 5, happy: 4, nervous: 1.8, angry: 3, smug: 4.5, surprised: 2.5,
  embarrassed: 8, excited: 1.5, defeated: 8, scheming: 4, panicking: 0.8, zen: 7,
  shadow: 10, proud: 5, suspicious: 3.5, heartbroken: 9, mischievous: 2,
  sleepy: 12, starstruck: 2, confused: 1.5, stubborn: 6, grateful: 5, feral: 0.5, royal: 5.5,
};
const MOOD_BRIGHTNESS_LOW: Record<RookieMood, number> = {
  neutral: 0.9, happy: 0.95, nervous: 0.6, angry: 0.7, smug: 0.85, surprised: 0.8,
  embarrassed: 0.05, excited: 0.9, defeated: 0.15, scheming: 0.6, panicking: 0.5, zen: 0.9,
  shadow: 0.2, proud: 0.85, suspicious: 0.7, heartbroken: 0.4, mischievous: 0.8,
  sleepy: 0.3, starstruck: 1.0, confused: 0.7, stubborn: 0.75, grateful: 0.85, feral: 0.8, royal: 0.8,
};
const MOOD_BRIGHTNESS_HIGH: Record<RookieMood, number> = {
  neutral: 1.5, happy: 1.6, nervous: 1.2, angry: 1.4, smug: 1.5, surprised: 1.6,
  embarrassed: 0.25, excited: 1.8, defeated: 0.5, scheming: 1.4, panicking: 1.7, zen: 1.2,
  shadow: 0.4, proud: 1.5, suspicious: 1.2, heartbroken: 0.8, mischievous: 1.6,
  sleepy: 0.6, starstruck: 1.9, confused: 1.4, stubborn: 1.1, grateful: 1.4, feral: 2.0, royal: 1.4,
};

const ALL_MOOD_KEYFRAMES = (Object.keys(MOOD_BREATHE_SPEED) as RookieMood[]).map(m => {
  const lo = MOOD_BRIGHTNESS_LOW[m];
  const hi = MOOD_BRIGHTNESS_HIGH[m];
  return `@keyframes rookBreathe_${m} {
    0%, 100% { filter: brightness(${lo}) saturate(0.95); }
    50% { filter: brightness(${hi}) saturate(1.2); }
  }`;
}).join('\n');

// Pre-compute normalized distance from center for each rook block (0–1)
const BLOCK_DISTANCES = new Map<string, number>();
{
  let maxDist = 0;
  for (const { x, y } of ALL_CELLS) {
    if (!BLOCK_MAP.has(`${x},${y}`)) continue;
    const d = Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2);
    if (d > maxDist) maxDist = d;
    BLOCK_DISTANCES.set(`${x},${y}`, d);
  }
  // Normalize
  for (const [key, d] of BLOCK_DISTANCES) {
    BLOCK_DISTANCES.set(key, d / (maxDist || 1));
  }
}

export function BreathingRook({ size = 'md', label, className = '', animate = false, animation, mood = 'neutral', talkIntensity }: BreathingRookProps) {
  const blockSize = SIZE_MAP[size];
  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;

  // Exact pixel dimensions — no CSS Grid, absolute positioning for pixel-perfect gaps
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;

  const isTalkDriven = talkIntensity !== undefined && talkIntensity !== null;
  const activeMode: AnimationMode | null = isTalkDriven ? null : (animation || (animate ? 'breathe' : null));

  return (
    <div className={`inline-flex flex-col items-center gap-2 flex-shrink-0 ${className}`} role="status" aria-label={label || 'Loading'}>
      <div
        style={{
          position: 'relative',
          width: gridWidth,
          height: gridHeight,
          /* Own compositing layer so children's absolute positions aren't offset
             by the parent's fractional pixel centering on desktop. */
          transform: 'translate3d(0,0,0)',
        }}
      >
        {ALL_CELLS.map(({ x, y }) => {
          const block = BLOCK_MAP.get(`${x},${y}`);
          if (!block) return null;

          const left = x * (blockSize + gap);
          const top = y * (blockSize + gap);
          const delay = activeMode ? getBlockDelay(x, y, activeMode) : 0;

          const tinted = tintColor(block.color, mood);

          // Talk-intensity mode: audio-driven brightness + scale per block
          if (isTalkDriven) {
            const dist = BLOCK_DISTANCES.get(`${x},${y}`) ?? 0.5;
            const blockIntensity = talkIntensity * (1 - dist * 0.6);
            const brightness = 1 + blockIntensity * 0.5;
            const blockScale = 1 + blockIntensity * 0.08;

            return (
              <div
                key={`${x},${y}`}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width: blockSize,
                  height: blockSize,
                  borderRadius: radius,
                  background: getMatteBackground(tinted),
                  boxShadow: insetShadow,
                  filter: `brightness(${brightness.toFixed(3)})`,
                  transform: `scale(${blockScale.toFixed(4)})`,
                  transition: 'filter 0.05s linear, transform 0.05s linear',
                }}
              />
            );
          }

          const useMoodBreathe = activeMode !== 'enter' && activeMode !== 'powerOn' && activeMode !== 'celebrate' && activeMode !== 'talk';
          const moodSpeed = MOOD_BREATHE_SPEED[mood] ?? 5;
          const breatheDelay = (x + y) * (moodSpeed > 3 ? 0.18 : 0.08);

          return (
            <div
              key={`${x},${y}`}
              style={{
                position: 'absolute',
                left,
                top,
                width: blockSize,
                height: blockSize,
                borderRadius: radius,
                background: getMatteBackground(tinted),
                boxShadow: insetShadow,
                transition: 'background 1.2s ease-in-out, opacity 1.2s ease-in-out, animation-duration 1.2s ease-in-out',
                ...(mood === 'embarrassed' ? { opacity: 0.08 } : {}),
                ...(mood === 'defeated' ? { opacity: 0.3 } : {}),
                ...(mood === 'shadow' ? { opacity: 0.15 } : {}),
                ...(mood === 'sleepy' ? { opacity: 0.4 } : {}),
                ...(useMoodBreathe ? {
                  animation: `rookBreathe_${mood} ${moodSpeed}s ease-in-out ${breatheDelay}s infinite`,
                } : activeMode ? {
                  animation: getBlockAnimation(activeMode, delay, x, y),
                  ...(activeMode === 'enter' ? { opacity: 0 } : {}),
                  ...(activeMode === 'powerOn' ? { filter: 'brightness(0.1) saturate(0)' } : {}),
                } : {}),
              }}
            />
          );
        })}
      </div>
      {label && (
        <span className="text-xs text-chess-text-faint animate-pulse">{label}</span>
      )}
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: ANIMATION_KEYFRAMES + ALL_MOOD_KEYFRAMES }} />
    </div>
  );
}
