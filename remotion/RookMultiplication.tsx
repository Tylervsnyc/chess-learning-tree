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
    `inset 0 ${s(0.5)} 0 ${darken(color, 6)}`,
    `inset 0 -${s(0.5)} 0 ${lighten(color, 6)}`,
  ].join(', ');
}

// ── Deterministic random ──
function rand(a: number, b: number = 0): number {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Source rook ──
const ROOK_GRID = [
  { x: 0, y: 0, color: '#1CB0F6' }, { x: 2, y: 0, color: '#2FCBEF' },
  { x: 4, y: 0, color: '#A560E8' }, { x: 0, y: 1, color: '#58CC02' },
  { x: 1, y: 1, color: '#FFC800' }, { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' }, { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' }, { x: 2, y: 2, color: '#2FCBEF' },
  { x: 3, y: 2, color: '#A560E8' }, { x: 1, y: 3, color: '#58CC02' },
  { x: 2, y: 3, color: '#FFC800' }, { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' }, { x: 2, y: 4, color: '#FF4B4B' },
  { x: 3, y: 4, color: '#1CB0F6' }, { x: 0, y: 5, color: '#2FCBEF' },
  { x: 1, y: 5, color: '#A560E8' }, { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' }, { x: 4, y: 5, color: '#FF9600' },
];

const ALL_COLORS = [
  '#1CB0F6', '#2FCBEF', '#A560E8', '#58CC02',
  '#FFC800', '#FF9600', '#FF6B6B', '#FF4B4B',
];

const BIG_SIZE = 72;
const ROOK_GAP = 10;
const ROOK_W = 5 * BIG_SIZE + 4 * ROOK_GAP;
const ROOK_H = 6 * BIG_SIZE + 5 * ROOK_GAP;
const CX = FRAME_W / 2;
const CY = FRAME_H / 2 - 80;

function rookPos(gx: number, gy: number) {
  return {
    x: CX - ROOK_W / 2 + gx * (BIG_SIZE + ROOK_GAP) + BIG_SIZE / 2,
    y: CY - ROOK_H / 2 + gy * (BIG_SIZE + ROOK_GAP) + BIG_SIZE / 2,
  };
}

// ── Grid: fill ENTIRE screen, no gaps ──
const CELL = 32;
const COLS = Math.floor(FRAME_W / CELL);
const ROWS = Math.floor(FRAME_H / CELL);
const TOTAL_CELLS = COLS * ROWS; // 1980
const X_OFF = (FRAME_W - COLS * CELL) / 2;
const Y_OFF = (FRAME_H - ROWS * CELL) / 2;
const BLOCK_SIZE = CELL - 2;

function cellCenter(col: number, row: number) {
  return {
    x: X_OFF + col * CELL + CELL / 2,
    y: Y_OFF + row * CELL + CELL / 2,
  };
}

function screenToCell(sx: number, sy: number) {
  return {
    col: Math.max(0, Math.min(COLS - 1, Math.round((sx - X_OFF - CELL / 2) / CELL))),
    row: Math.max(0, Math.min(ROWS - 1, Math.round((sy - Y_OFF - CELL / 2) / CELL))),
  };
}

// BFS to find nearest empty cell
function findNearestEmpty(
  occupied: boolean[][],
  startCol: number,
  startRow: number,
  seedOffset: number,
): { col: number; row: number } | null {
  const visited = new Set<string>();
  const queue: { col: number; row: number }[] = [{ col: startCol, row: startRow }];
  visited.add(`${startCol},${startRow}`);
  const dirs = [
    [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1],
  ];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const shuffled = [...dirs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand(seedOffset + cur.col * 7 + cur.row * 13 + i, 42) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    for (const [dc, dr] of shuffled) {
      const nc = cur.col + dc;
      const nr = cur.row + dr;
      if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) continue;
      const key = `${nc},${nr}`;
      if (visited.has(key)) continue;
      visited.add(key);
      if (!occupied[nr][nc]) return { col: nc, row: nr };
      queue.push({ col: nc, row: nr });
    }
  }
  return null;
}

// ── Build ALL cells via multiplication — fills 100% of the grid ──
interface Cell {
  col: number;
  row: number;
  parentCol: number;
  parentRow: number;
  gen: number;
  color: string;
  survivor: boolean;
  seed: number;
}

const ALL_CELLS: Cell[] = (() => {
  const occupied: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const cells: Cell[] = [];

  // Gen 0: rook blocks → grid cells
  const gen0Parents: { col: number; row: number; color: string }[] = [];
  for (let i = 0; i < ROOK_GRID.length; i++) {
    const r = ROOK_GRID[i];
    const pos = rookPos(r.x, r.y);
    const gc = screenToCell(pos.x, pos.y);
    if (!occupied[gc.row][gc.col]) {
      occupied[gc.row][gc.col] = true;
      gen0Parents.push({ col: gc.col, row: gc.row, color: r.color });
      cells.push({
        col: gc.col, row: gc.row, parentCol: gc.col, parentRow: gc.row,
        gen: 0, color: r.color, survivor: false, seed: rand(i, 50),
      });
    }
  }

  // Gen 1-3: each parent spawns 3 children (parent stays = 4x)
  let currentParents = gen0Parents;

  for (let g = 1; g <= 3; g++) {
    const nextParents: { col: number; row: number; color: string }[] = [];
    for (let pi = 0; pi < currentParents.length; pi++) {
      const parent = currentParents[pi];
      nextParents.push(parent);
      for (let ci = 0; ci < 3; ci++) {
        const seedOff = g * 1000 + pi * 10 + ci;
        const empty = findNearestEmpty(occupied, parent.col, parent.row, seedOff);
        if (!empty) continue;
        occupied[empty.row][empty.col] = true;
        const color = rand(seedOff, 700) < 0.3
          ? parent.color
          : ALL_COLORS[Math.floor(rand(seedOff, 400) * ALL_COLORS.length)];
        nextParents.push({ col: empty.col, row: empty.row, color });
        cells.push({
          col: empty.col, row: empty.row,
          parentCol: parent.col, parentRow: parent.row,
          gen: g, color, survivor: false, seed: rand(cells.length, 500),
        });
      }
    }
    currentParents = nextParents;
  }

  // Gen 4: fill ALL remaining empty cells (keep multiplying until full)
  const remaining: { col: number; row: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!occupied[r][c]) remaining.push({ col: c, row: r });
    }
  }
  // Shuffle remaining for organic fill order
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(rand(i, 777) * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  for (const spot of remaining) {
    // Find nearest occupied cell as parent
    let bestDist = Infinity;
    let bestParent = { col: 0, row: 0 };
    // Check neighbors first (fast path)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nc = spot.col + dc;
        const nr = spot.row + dr;
        if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS && occupied[nr][nc]) {
          const d = Math.abs(dc) + Math.abs(dr);
          if (d < bestDist) {
            bestDist = d;
            bestParent = { col: nc, row: nr };
          }
        }
      }
    }
    if (bestDist === Infinity) {
      // Fallback: search wider
      for (const cell of cells) {
        const d = Math.abs(cell.col - spot.col) + Math.abs(cell.row - spot.row);
        if (d < bestDist) {
          bestDist = d;
          bestParent = { col: cell.col, row: cell.row };
        }
      }
    }
    occupied[spot.row][spot.col] = true;
    const color = ALL_COLORS[Math.floor(rand(cells.length, 900) * ALL_COLORS.length)];
    cells.push({
      col: spot.col, row: spot.row,
      parentCol: bestParent.col, parentRow: bestParent.row,
      gen: 4, color, survivor: false, seed: rand(cells.length, 500),
    });
  }

  // Pick 3% survivors — spread nicely across the grid
  const survivorCount = Math.max(1, Math.ceil(TOTAL_CELLS * 0.03));
  const indices = cells.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand(i, 999) * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const chosen = new Set<number>();
  const buckets = new Map<string, number>();
  const bDiv = 7;
  for (const idx of indices) {
    if (chosen.size >= survivorCount) break;
    const c = cells[idx];
    const bk = `${Math.floor(c.col / (COLS / bDiv))},${Math.floor(c.row / (ROWS / bDiv))}`;
    if ((buckets.get(bk) || 0) < 2) {
      chosen.add(idx);
      buckets.set(bk, (buckets.get(bk) || 0) + 1);
    }
  }
  for (const idx of indices) {
    if (chosen.size >= survivorCount) break;
    chosen.add(idx);
  }
  chosen.forEach((idx) => { cells[idx].survivor = true; });

  return cells;
})();

// ── Timing ──
const HOLD_S = 2.0;
// 4 split waves, overlapping for continuous growth
const SPLIT_STARTS = [HOLD_S, HOLD_S + 0.5, HOLD_S + 1.0, HOLD_S + 1.5];
const SPLIT_DUR = 0.5;
const MULTIPLY_END = SPLIT_STARTS[3] + SPLIT_DUR; // 4.0s
const FULL_HOLD_DUR = 1.5;
const FADE_START = MULTIPLY_END + FULL_HOLD_DUR;
const FADE_DUR = 3.0;
const REVEAL_HOLD = 3.0;
const TOTAL_S = FADE_START + FADE_DUR + REVEAL_HOLD;

export const MULTIPLICATION_FRAMES = Math.ceil(TOTAL_S * FPS);

// Map gen to split timing
function genSplitStart(gen: number): number {
  if (gen === 0) return HOLD_S;
  if (gen <= 3) return SPLIT_STARTS[gen - 1];
  return SPLIT_STARTS[3]; // gen 4 = same wave as gen 3
}

// ── Counter ──
function CounterText({ t }: { t: number }) {
  const start = HOLD_S + 0.3;
  const end = MULTIPLY_END + FULL_HOLD_DUR * 0.4;
  const progress = interpolate(t, [start, end], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const count = Math.floor(progress * 5000000);
  const opacity = interpolate(
    t,
    [start, start + 0.4, FADE_START - 0.4, FADE_START + 0.3],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return (
    <div style={{
      position: 'absolute', top: FRAME_H / 2 - 60, left: 0, width: FRAME_W,
      textAlign: 'center', fontFamily, fontSize: 96, fontWeight: 800,
      color: '#2A3C45', opacity, zIndex: 10,
      textShadow: '0 2px 12px rgba(255,255,255,0.8)',
    }}>
      {count.toLocaleString()}
      <div style={{ fontSize: 36, fontWeight: 600, marginTop: 8, letterSpacing: '0.05em' }}>
        puzzles
      </div>
    </div>
  );
}

function TopPercentText({ t }: { t: number }) {
  const appearAt = FADE_START + FADE_DUR * 0.5;
  const opacity = interpolate(t, [appearAt, appearAt + 1.0], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const slideUp = interpolate(t, [appearAt, appearAt + 1.2], [40, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{
      position: 'absolute', top: FRAME_H / 2 - 50, left: 0, width: FRAME_W,
      textAlign: 'center', fontFamily, opacity, transform: `translateY(${slideUp}px)`, zIndex: 10,
    }}>
      <div style={{ fontSize: 140, fontWeight: 800, color: '#2A3C45' }}>Top 3%</div>
      <div style={{
        fontSize: 42, fontWeight: 600, color: '#6B7B8D', marginTop: 12, letterSpacing: '0.04em',
      }}>
        Only the best puzzles make the cut
      </div>
    </div>
  );
}

export const RookMultiplication: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Logo text dissolve
  const textOpacity = interpolate(t, [HOLD_S - 0.2, HOLD_S + 0.4], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Rook blocks fade as multiplication begins
  const rookOpacity = interpolate(t, [HOLD_S, HOLD_S + 0.3], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{
      width: FRAME_W, height: FRAME_H, backgroundColor: '#ffffff',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Logo text */}
      <div style={{
        position: 'absolute', top: CY + ROOK_H / 2 + 40, left: 0, width: FRAME_W,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        opacity: textOpacity, fontFamily, zIndex: 5,
      }}>
        <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1 }}>
          <span style={{ color: '#2A3C45' }}>chess</span>
          <span style={{
            background: 'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>path</span>
        </div>
        <div style={{
          fontSize: 40, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase' as const, color: '#6B7B8D',
        }}>
          The fun way to learn chess
        </div>
      </div>

      {/* Assembled rook */}
      {rookOpacity > 0.01 &&
        ROOK_GRID.map((block, i) => {
          const pos = rookPos(block.x, block.y);
          const brightness = 1 + 0.06 * Math.sin(t * 1.5 + i * 0.5);
          return (
            <div key={`r-${i}`} style={{
              position: 'absolute',
              left: pos.x - BIG_SIZE / 2, top: pos.y - BIG_SIZE / 2,
              width: BIG_SIZE, height: BIG_SIZE, borderRadius: 10,
              background: getMatteBackground(block.color),
              boxShadow: getMatteBoxShadow(block.color, BIG_SIZE / 14),
              filter: `brightness(${brightness})`,
              opacity: rookOpacity, zIndex: 3,
            }} />
          );
        })}

      {/* ALL cells — unified rendering */}
      {t >= HOLD_S &&
        ALL_CELLS.map((cell, i) => {
          const splitStart = genSplitStart(cell.gen);
          const stagger = cell.seed * SPLIT_DUR * 0.4;
          const myStart = splitStart + stagger;

          // Pop in: scale from 0 → 1 with overshoot
          const popProgress = interpolate(t, [myStart, myStart + 0.25], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.out(Easing.back(2.5)), // overshoot pop!
          });

          if (popProgress < 0.01) return null;

          // Slide from parent position
          const from = cellCenter(cell.parentCol, cell.parentRow);
          const to = cellCenter(cell.col, cell.row);
          const slideProgress = interpolate(t, [myStart, myStart + 0.3], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const x = from.x + (to.x - from.x) * slideProgress;
          const y = from.y + (to.y - from.y) * slideProgress;

          // Fade out for non-survivors
          let opacity = 1;
          if (t >= FADE_START && !cell.survivor) {
            const fadeDelay = cell.seed * FADE_DUR * 0.6;
            opacity = interpolate(
              t,
              [FADE_START + fadeDelay, FADE_START + fadeDelay + FADE_DUR * 0.5],
              [1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) },
            );
          }

          if (opacity < 0.01) return null;

          // Survivors: stay small, just subtle breathe
          const brightness = cell.survivor && t >= FADE_START
            ? 1 + 0.06 * Math.sin(t * 1.8 + i * 0.4)
            : 1;

          return (
            <div key={i} style={{
              position: 'absolute',
              left: x - BLOCK_SIZE / 2, top: y - BLOCK_SIZE / 2,
              width: BLOCK_SIZE, height: BLOCK_SIZE,
              borderRadius: 4,
              background: getMatteBackground(cell.color),
              boxShadow: getMatteBoxShadow(cell.color, 1),
              opacity,
              transform: `scale(${popProgress})`,
              filter: `brightness(${brightness})`,
            }} />
          );
        })}

      {/* Counter */}
      {t > HOLD_S && t < FADE_START + 0.8 && <CounterText t={t} />}

      {/* Top 3% */}
      {t > FADE_START && <TopPercentText t={t} />}
    </div>
  );
};
