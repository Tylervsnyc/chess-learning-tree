'use client';

import { useState, useEffect, useRef } from 'react';
import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

const BLOCK_MAP = new Map(ROOK_BLOCKS.map(b => [`${b.x},${b.y}`, b]));
const ALL_CELLS = Array.from({ length: 30 }, (_, i) => ({
  x: i % 5,
  y: Math.floor(i / 5),
}));
const CENTER_X = 2;
const CENTER_Y = 2.5;

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

type IllusionId =
  | 'breathingSquare' | 'cafeWall' | 'spinDrift' | 'afterimage'
  | 'sizeWarp' | 'impossibleRotation' | 'flickerFuse' | 'snakeColumns'
  | 'expandingHoles' | 'motionBinding' | 'colorShift' | 'floatingBlocks'
  | 'pulsarGrid' | 'tunnelZoom' | 'reverseSpiral' | 'phantomGlow'
  | 'jitterStill' | 'depthFlip' | 'moirePattern' | 'tracerTrail';

const ILLUSIONS: { id: IllusionId; label: string; description: string }[] = [
  { id: 'breathingSquare', label: 'Breathing Square', description: 'Blocks aren\'t moving... or are they?' },
  { id: 'cafeWall', label: 'Cafe Wall', description: 'Perfectly straight rows that look crooked' },
  { id: 'spinDrift', label: 'Spin Drift', description: 'Stare at center — outer blocks seem to rotate' },
  { id: 'afterimage', label: 'Afterimage', description: 'Stare 10s then look away — see ghost rook' },
  { id: 'sizeWarp', label: 'Size Warp', description: 'Center blocks look bigger than they are' },
  { id: 'impossibleRotation', label: 'Impossible Rotation', description: 'Which direction is it spinning?' },
  { id: 'flickerFuse', label: 'Flicker Fusion', description: 'Colors blend when they flicker fast enough' },
  { id: 'snakeColumns', label: 'Snake Columns', description: 'Columns appear to slither but they\'re just pulsing' },
  { id: 'expandingHoles', label: 'Expanding Void', description: 'Dark center seems to grow and consume' },
  { id: 'motionBinding', label: 'Motion Binding', description: 'Moving blocks drag still ones with them' },
  { id: 'colorShift', label: 'Color Shift', description: 'Identical grays look different colors in context' },
  { id: 'floatingBlocks', label: 'Floating Blocks', description: 'Shadow tricks make blocks look 3D and hovering' },
  { id: 'pulsarGrid', label: 'Pulsar Grid', description: 'See phantom dots at intersections that aren\'t there' },
  { id: 'tunnelZoom', label: 'Tunnel Zoom', description: 'Stare at center — feels like falling forward' },
  { id: 'reverseSpiral', label: 'Reverse Spiral', description: 'Look away after 15s — world spirals backward' },
  { id: 'phantomGlow', label: 'Phantom Glow', description: 'See halos around blocks that have no glow' },
  { id: 'jitterStill', label: 'Jitter Still', description: 'Peripheral blocks seem to vibrate but are frozen' },
  { id: 'depthFlip', label: 'Depth Flip', description: 'Is it convex or concave? Your brain can\'t decide' },
  { id: 'moirePattern', label: 'Moire Pattern', description: 'Overlapping grids create phantom movement' },
  { id: 'tracerTrail', label: 'Tracer Trail', description: 'After-images stack creating impossible trails' },
];

interface BlockState {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  opacity: number;
  brightness: number;
  hueShift: number;
  skewX: number;
  skewY: number;
  blur: number;
  colorOverride?: string;
  // Extra for illusions
  extraShadow?: string;
  borderColor?: string;
}

function defaultState(): BlockState {
  return { offsetX: 0, offsetY: 0, scale: 1, rotation: 0, opacity: 1, brightness: 1, hueShift: 0, skewX: 0, skewY: 0, blur: 0 };
}

function computeIllusion(
  mode: IllusionId, x: number, y: number, blockIdx: number, t: number,
  blockSize: number,
): BlockState {
  const state = defaultState();
  const dist = Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2);
  const maxDist = 3.2;
  const normDist = dist / maxDist;
  const angle = Math.atan2(y - CENTER_Y, x - CENTER_X);
  const gap = Math.max(1, Math.round(blockSize * 0.15));

  switch (mode) {
    case 'breathingSquare': {
      // Very subtle brightness oscillation that makes blocks SEEM to move
      // but they don't actually change position at all
      const phase = Math.sin(t * 0.8 + normDist * 3);
      // Only brightness changes — no position, no scale
      state.brightness = 0.85 + phase * 0.15;
      // Alternating brightness creates apparent motion
      const checker = (x + y) % 2;
      state.brightness += checker * 0.08 * Math.sin(t * 1.2);
      break;
    }

    case 'cafeWall': {
      // Rows offset by half a block — makes straight lines look tilted
      // The ROWS are perfectly horizontal but the brightness pattern
      // creates the illusion of tilted lines
      const rowShift = (y % 2) * 0.5;
      const stripe = Math.sin((x + rowShift) * Math.PI * 2) > 0;
      state.colorOverride = stripe ? '#dddddd' : '#333333';
      // Thin gray "mortar" lines between — this is the key to the illusion
      // The blocks themselves are the illusion
      state.brightness = 1;
      // Very subtle actual movement to enhance the effect
      state.offsetX = Math.sin(t * 0.3 + y * 0.5) * 0.3;
      break;
    }

    case 'spinDrift': {
      // Center blocks pulse, making outer blocks APPEAR to rotate
      // Outer blocks don't actually move
      if (normDist < 0.3) {
        // Center: pulsing rapidly
        state.brightness = 1 + Math.sin(t * 4) * 0.5;
        state.scale = 1 + Math.sin(t * 4) * 0.05;
      } else {
        // Outer: completely still, but brightness gradient
        // creates rotational aftereffect
        const sectorBright = Math.sin(angle * 4 + t * 0.01) * 0.15;
        state.brightness = 0.9 + sectorBright;
        // Subtle alternating contrast amplifies the illusion
        state.colorOverride = (x + y) % 2 === 0
          ? hslToHex(0, 0, 55 + sectorBright * 100)
          : hslToHex(0, 0, 45 + sectorBright * 100);
      }
      break;
    }

    case 'afterimage': {
      // High contrast complementary color pairs
      // Stare at it, then look at a white wall
      const cycle = t % 20;
      if (cycle < 10) {
        // Display phase — saturated inverse colors
        const hue = (blockIdx * 30 + 180) % 360;
        state.colorOverride = hslToHex(hue, 100, 50);
        state.brightness = 1.5;
        // Small fixation cross in center
        if (x === 2 && y === 2) {
          state.colorOverride = '#ffffff';
          state.brightness = 2.5;
        } else if (x === 2 && y === 3) {
          state.colorOverride = '#ffffff';
          state.brightness = 2.5;
        }
      } else {
        // Blank phase — neutral gray, you see the afterimage
        state.colorOverride = hslToHex(0, 0, 50);
        state.brightness = 1;
        // Keep fixation point
        if ((x === 2 && y === 2) || (x === 2 && y === 3)) {
          state.colorOverride = '#999999';
          state.brightness = 1.2;
        }
      }
      break;
    }

    case 'sizeWarp': {
      // Ebbinghaus illusion — surrounding context changes perceived size
      // All blocks are EXACTLY the same size
      // But brightness/contrast context tricks you
      if (normDist < 0.25) {
        // Center blocks — bright, high contrast
        state.brightness = 1.4;
        state.colorOverride = hslToHex(0, 0, 70);
      } else if (normDist < 0.6) {
        // Ring of dark small-seeming blocks
        state.brightness = 0.3;
        state.colorOverride = hslToHex(0, 0, 15);
      } else {
        // Outer — medium brightness
        state.brightness = 1;
        state.colorOverride = hslToHex(0, 0, 55);
      }
      // Pulsing the context ring makes center seem to change size
      const pulse = Math.sin(t * 1.5);
      if (normDist > 0.25 && normDist < 0.6) {
        state.brightness = 0.3 + pulse * 0.15;
      }
      break;
    }

    case 'impossibleRotation': {
      // Silhouette-style ambiguous rotation
      // Blocks on one axis move, creating bistable percept
      const rotPhase = t * 0.8;
      const projX = Math.sin(rotPhase);
      const projScale = Math.cos(rotPhase);

      // Offset blocks based on their x position to simulate rotation
      state.offsetX = (x - CENTER_X) * projX * 4;
      // Scale to simulate depth
      state.scale = 0.8 + (projScale * (x - CENTER_X) / 5 + 0.5) * 0.3;
      // All same dark color — silhouette makes direction ambiguous
      state.colorOverride = hslToHex(0, 0, 25);
      state.brightness = 0.8 + state.scale * 0.4;
      break;
    }

    case 'flickerFuse': {
      // Two colors alternate so fast they fuse into a third
      const flickerRate = 30; // 30 Hz — near fusion threshold
      const frame = Math.floor(t * flickerRate);
      const isPhaseA = frame % 2 === 0;

      // Left side: red/green flicker → appears yellow
      // Right side: blue/yellow flicker → appears gray
      if (x < CENTER_X) {
        state.colorOverride = isPhaseA ? '#ff0000' : '#00ff00';
      } else if (x > CENTER_X) {
        state.colorOverride = isPhaseA ? '#0044ff' : '#ffee00';
      } else {
        // Center column: steady reference color
        state.colorOverride = x < CENTER_X ? '#cccc00' : '#888888';
        state.brightness = 1.2;
      }
      break;
    }

    case 'snakeColumns': {
      // Columns ONLY change brightness in a wave pattern
      // but appear to physically slither
      const wave = Math.sin(t * 2 + y * 1.5);
      const colPhase = Math.sin(t * 2 + y * 1.5 + x * Math.PI);

      // No position change at all!
      state.brightness = 0.6 + (wave + 1) * 0.4;
      // Alternating high/low contrast per column creates motion illusion
      state.colorOverride = colPhase > 0
        ? hslToHex(0, 0, 30 + wave * 20)
        : hslToHex(0, 0, 70 + wave * 15);
      break;
    }

    case 'expandingHoles': {
      // Dark center with gradient — appears to physically expand
      // Nothing actually moves
      const darkPulse = (Math.sin(t * 0.6) + 1) / 2; // 0-1
      const darkness = Math.max(0, 1 - normDist * 2) * darkPulse;
      state.colorOverride = hslToHex(270, 30, 5 + (1 - darkness) * 45);
      state.brightness = 0.3 + (1 - darkness) * 0.9;
      // The surrounding bright ring enhances the "growing void" effect
      if (normDist > 0.4 && normDist < 0.6) {
        state.brightness += darkPulse * 0.3;
      }
      break;
    }

    case 'motionBinding': {
      // Only even columns move. But odd columns appear to move too
      const isMoving = x % 2 === 0;
      if (isMoving) {
        state.offsetY = Math.sin(t * 2) * 8;
        state.brightness = 1.1;
      } else {
        // These blocks are COMPLETELY STILL
        // but the moving neighbors make them look like they're moving opposite
        state.brightness = 0.9;
      }
      // Same color scheme to bind them perceptually
      state.colorOverride = hslToHex(0, 0, 50);
      break;
    }

    case 'colorShift': {
      // Identical gray blocks look different colors based on surroundings
      // Simultaneous contrast illusion
      const isTarget = (x === 1 && y === 2) || (x === 3 && y === 2);
      if (isTarget) {
        // These two blocks are EXACTLY the same gray
        state.colorOverride = '#808080';
        state.brightness = 1;
      } else if (x < CENTER_X) {
        // Left side: warm orange surround
        const warmPulse = 0.8 + Math.sin(t * 0.5) * 0.2;
        state.colorOverride = hslToHex(20, 80, 40 * warmPulse);
        state.brightness = warmPulse;
      } else {
        // Right side: cool blue surround
        const coolPulse = 0.8 + Math.sin(t * 0.5 + Math.PI) * 0.2;
        state.colorOverride = hslToHex(220, 80, 40 * coolPulse);
        state.brightness = coolPulse;
      }
      break;
    }

    case 'floatingBlocks': {
      // Shadow/highlight arrangement makes flat blocks look 3D
      const lightAngle = t * 0.3;
      const lightX = Math.cos(lightAngle);
      const lightY = Math.sin(lightAngle);
      // "Light" hits from moving direction
      const lightDot = (x - CENTER_X) * lightX + (y - CENTER_Y) * lightY;
      const normalizedLight = (lightDot / maxDist + 1) / 2;

      state.brightness = 0.5 + normalizedLight * 0.8;
      // Blocks facing light = bright top, dark bottom
      // Creates powerful 3D convexity illusion
      state.colorOverride = hslToHex(0, 0, 35 + normalizedLight * 35);
      // Extra shadow on one side
      state.extraShadow = `${lightX * 3}px ${lightY * 3}px ${4}px rgba(0,0,0,${0.3 + normalizedLight * 0.2})`;
      break;
    }

    case 'pulsarGrid': {
      // Hermann grid illusion — phantom dark/bright dots appear at intersections
      // Blocks form a grid with gaps between them
      // Your brain fills the gaps with phantom dots
      state.colorOverride = '#ffffff';
      state.brightness = 1.3;
      // Pulsing makes phantom dots come and go
      const gridPulse = Math.sin(t * 1.5 + blockIdx * 0.1);
      state.brightness = 1.1 + gridPulse * 0.2;
      break;
    }

    case 'tunnelZoom': {
      // Concentric rings of blocks with brightness creating depth
      // Pulsing inward creates "falling into tunnel" sensation
      const ring = Math.round(normDist * 4);
      const ringPhase = (t * 1.5 + ring * 0.5) % 1;
      // Rings pulse from outside in
      state.brightness = 0.3 + ringPhase * 1.2;
      state.colorOverride = hslToHex(
        240 + ring * 20,
        50 + ringPhase * 30,
        20 + ringPhase * 30
      );
      // Slight scale pulse enhances depth
      state.scale = 0.9 + ringPhase * 0.1;
      break;
    }

    case 'reverseSpiral': {
      // Strong spiral motion — stare, then look away for reverse aftereffect
      const spiralSpeed = 2;
      const spiralAngle2 = angle + normDist * 6 + t * spiralSpeed;
      const spiralBand = Math.sin(spiralAngle2 * 3);
      state.colorOverride = spiralBand > 0
        ? hslToHex(0, 0, 75)
        : hslToHex(0, 0, 25);
      state.brightness = 1;
      // Fixation point
      if (x === 2 && (y === 2 || y === 3)) {
        state.colorOverride = '#ff0000';
        state.brightness = 1.5;
      }
      break;
    }

    case 'phantomGlow': {
      // Mach band illusion — edges look brighter/darker than they are
      // No actual glow effects at all, just brightness gradients
      const gradient = normDist;
      // Sharp brightness steps create phantom bright/dark edges
      const stepped = Math.floor(gradient * 5) / 5;
      state.colorOverride = hslToHex(0, 0, 80 - stepped * 60);
      state.brightness = 1;
      // Very slow rotation of the gradient to keep you looking
      const rotGrad = Math.sin(angle + t * 0.2) * 0.5 + 0.5;
      const stepped2 = Math.floor(rotGrad * 4) / 4;
      state.colorOverride = hslToHex(0, 0, 25 + stepped2 * 50);
      break;
    }

    case 'jitterStill': {
      // Center blocks have rapid micro-movements
      // Peripheral blocks are FROZEN but appear to jitter
      // due to the peripheral visual processing
      if (normDist < 0.3) {
        // Center: actual rapid jitter
        const jitX = Math.sin(t * 25 + blockIdx * 3) * 1.5;
        const jitY = Math.cos(t * 22 + blockIdx * 5) * 1.5;
        state.offsetX = jitX;
        state.offsetY = jitY;
        state.brightness = 1.2;
      } else {
        // Outer: COMPLETELY frozen
        // but high contrast alternating pattern triggers
        // perceived motion in peripheral vision
        const checker = (x + y) % 2;
        state.colorOverride = checker
          ? hslToHex(0, 0, 80)
          : hslToHex(0, 0, 20);
        state.brightness = 1;
      }
      break;
    }

    case 'depthFlip': {
      // Necker cube style — ambiguous 3D interpretation
      const flipPhase = Math.sin(t * 0.3);
      // Lighting from two opposite directions, slowly crossfading
      const light1 = (x - CENTER_X + y - CENTER_Y) / (maxDist * 2);
      const light2 = -(x - CENTER_X + y - CENTER_Y) / (maxDist * 2);

      const blend = (flipPhase + 1) / 2; // 0-1
      const finalLight = light1 * blend + light2 * (1 - blend);

      state.brightness = 0.6 + (finalLight + 0.5) * 0.6;
      state.colorOverride = hslToHex(0, 0, 35 + (finalLight + 0.5) * 30);
      // Slight perspective skew to enhance
      state.skewX = flipPhase * 3;
      state.skewY = flipPhase * 2;
      break;
    }

    case 'moirePattern': {
      // Two overlapping periodic patterns create phantom shapes
      const pattern1 = Math.sin(x * 2 + t * 0.5);
      const pattern2 = Math.sin(y * 2.3 + t * 0.3);
      const pattern3 = Math.sin((x + y) * 1.7 - t * 0.4);
      const moire = (pattern1 + pattern2 + pattern3) / 3;

      state.brightness = 0.5 + (moire + 1) * 0.4;
      state.colorOverride = hslToHex(
        0, 0,
        30 + (moire + 1) * 25
      );
      // The phantom curves and shapes emerge from the interaction
      break;
    }

    case 'tracerTrail': {
      // Single bright block moves, leaves "burned-in" afterimage trail
      const trailLen = 8;
      const moveSpeed = 3;
      const pathPos = (t * moveSpeed) % 22;
      const myPos = blockIdx % 22;

      // Distance along trail
      let trailDist = pathPos - myPos;
      if (trailDist < 0) trailDist += 22;
      if (trailDist > 22) trailDist -= 22;

      if (trailDist < 0.5) {
        // Leading block — bright
        state.brightness = 2.5;
        state.colorOverride = '#ffffff';
        state.scale = 1.15;
      } else if (trailDist < trailLen) {
        // Trail — fading ghost images
        const fade = trailDist / trailLen;
        // Each ghost is slightly offset — creates impossible stacked trail
        state.brightness = 2 - fade * 1.7;
        state.opacity = 1 - fade * 0.7;
        // Complementary color afterimage
        state.colorOverride = hslToHex(180 + fade * 60, 60 - fade * 40, 50 + fade * 10);
        state.scale = 1.1 - fade * 0.15;
      } else {
        state.brightness = 0.2;
        state.opacity = 0.5;
      }
      break;
    }
  }

  return state;
}

// ─── Rook Display ───
function IllusionRook({ illusion, blockSize = 24 }: { illusion: IllusionId; blockSize?: number }) {
  const [time, setTime] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      setTime((now - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [illusion]);

  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;

  return (
    <div
      style={{
        position: 'relative',
        width: gridWidth,
        height: gridHeight,
        transform: 'translate3d(0,0,0)',
        // Dark background enhances most illusions
        background: 'rgba(128,128,128,0.08)',
        borderRadius: radius * 2,
      }}
    >
      {ALL_CELLS.map(({ x, y }) => {
        const block = BLOCK_MAP.get(`${x},${y}`);
        if (!block) return null;

        const baseLeft = x * (blockSize + gap);
        const baseTop = y * (blockSize + gap);
        const idx = x + y * 5;
        const state = computeIllusion(illusion, x, y, idx, time, blockSize);
        const bgColor = state.colorOverride || block.color;
        const noTransition = illusion === 'flickerFuse';

        return (
          <div
            key={`${x},${y}`}
            style={{
              position: 'absolute',
              left: baseLeft + state.offsetX,
              top: baseTop + state.offsetY,
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              background: getMatteBackground(bgColor),
              boxShadow: state.extraShadow
                ? `${insetShadow}, ${state.extraShadow}`
                : insetShadow,
              transform: `scale(${state.scale}) rotate(${state.rotation}deg) skewX(${state.skewX}deg) skewY(${state.skewY}deg)`,
              filter: `brightness(${state.brightness}) hue-rotate(${state.hueShift}deg)${state.blur ? ` blur(${state.blur}px)` : ''}`,
              opacity: state.opacity,
              transition: noTransition ? 'none' : 'left 0.05s, top 0.05s',
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Section ───
const PER_PAGE = 12;
const TOTAL_PAGES = Math.ceil(ILLUSIONS.length / PER_PAGE);

export default function IllusionSection() {
  const [selected, setSelected] = useState<IllusionId | null>(null);
  const [page, setPage] = useState(0);

  const pageItems = ILLUSIONS.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div>
      {selected ? (() => {
        const idx = ILLUSIONS.findIndex(a => a.id === selected);
        const prev = idx > 0 ? ILLUSIONS[idx - 1] : null;
        const next = idx < ILLUSIONS.length - 1 ? ILLUSIONS[idx + 1] : null;
        return (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition">Back to gallery</button>
            <div className="flex-1" />
            <button onClick={() => prev && setSelected(prev.id)} disabled={!prev} className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition">Prev</button>
            <span className="text-xs text-white/30">{idx + 1}/{ILLUSIONS.length}</span>
            <button onClick={() => next && setSelected(next.id)} disabled={!next} className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition">Next</button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-[#404040]/30 rounded-2xl p-16 border border-white/[0.06]">
              <IllusionRook illusion={selected} blockSize={40} />
            </div>
            <div className="text-center max-w-md">
              <p className="text-lg font-medium text-white/80">{ILLUSIONS[idx]?.label}</p>
              <p className="text-sm text-white/40 mt-1">{ILLUSIONS[idx]?.description}</p>
            </div>
          </div>
        </div>);
      })()
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                  page === i
                    ? 'bg-indigo-500/30 text-indigo-300 ring-1 ring-indigo-500/50'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {pageItems.map(({ id, label, description }) => (
              <div
                key={id}
                className="flex flex-col items-center gap-3 bg-white/[0.03] rounded-xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition cursor-pointer"
                onClick={() => setSelected(id)}
              >
                <IllusionRook illusion={id} blockSize={18} />
                <div className="text-center">
                  <p className="text-xs font-medium text-white/80">{label}</p>
                  <p className="text-[10px] text-white/35 mt-0.5 line-clamp-2">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {TOTAL_PAGES > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-xs text-white/30">{page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, ILLUSIONS.length)} of {ILLUSIONS.length}</span>
              <button
                onClick={() => setPage(p => Math.min(TOTAL_PAGES - 1, p + 1))}
                disabled={page === TOTAL_PAGES - 1}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
