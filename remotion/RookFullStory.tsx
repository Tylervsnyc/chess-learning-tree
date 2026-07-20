import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont } from './lib/dm-sans';
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
function getMatteBoxShadow(color: string, scale: number = 1): string {
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  return [
    `inset 0 ${s(0.5)} 0 ${darken(color, 6)}`,
    `inset 0 -${s(0.5)} 0 ${lighten(color, 6)}`,
  ].join(', ');
}

function rand(a: number, b: number = 0): number {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Source rook (22 blocks) ──
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
const ALL_COLORS = ['#1CB0F6', '#2FCBEF', '#A560E8', '#58CC02', '#FFC800', '#FF9600', '#FF6B6B', '#FF4B4B'];

// ── Rook layout ──
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

// ── Multiplication grid ──
const CELL = 32;
const COLS = Math.floor(FRAME_W / CELL);
const ROWS = Math.floor(FRAME_H / CELL);
const TOTAL_CELLS = COLS * ROWS;
const X_OFF = (FRAME_W - COLS * CELL) / 2;
const Y_OFF = (FRAME_H - ROWS * CELL) / 2;
const BLOCK_SIZE = CELL - 2;

function cellCenter(col: number, row: number) {
  return { x: X_OFF + col * CELL + CELL / 2, y: Y_OFF + row * CELL + CELL / 2 };
}
function screenToCell(sx: number, sy: number) {
  return {
    col: Math.max(0, Math.min(COLS - 1, Math.round((sx - X_OFF - CELL / 2) / CELL))),
    row: Math.max(0, Math.min(ROWS - 1, Math.round((sy - Y_OFF - CELL / 2) / CELL))),
  };
}

function findNearestEmpty(
  occupied: boolean[][], startCol: number, startRow: number, seedOffset: number,
): { col: number; row: number } | null {
  const visited = new Set<string>();
  const queue: { col: number; row: number }[] = [{ col: startCol, row: startRow }];
  visited.add(`${startCol},${startRow}`);
  const dirs = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
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

// ── Build ALL multiplication cells ──
interface MultCell {
  col: number; row: number; parentCol: number; parentRow: number;
  gen: number; color: string; survivor: boolean; seed: number;
}

const ALL_CELLS: MultCell[] = (() => {
  const occupied: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const cells: MultCell[] = [];

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
          col: empty.col, row: empty.row, parentCol: parent.col, parentRow: parent.row,
          gen: g, color, survivor: false, seed: rand(cells.length, 500),
        });
      }
    }
    currentParents = nextParents;
  }

  // Gen 4: fill remaining
  const remaining: { col: number; row: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!occupied[r][c]) remaining.push({ col: c, row: r });
    }
  }
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(rand(i, 777) * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  for (const spot of remaining) {
    let bestDist = Infinity;
    let bestParent = { col: 0, row: 0 };
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nc = spot.col + dc;
        const nr = spot.row + dr;
        if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS && occupied[nr][nc]) {
          const d = Math.abs(dc) + Math.abs(dr);
          if (d < bestDist) { bestDist = d; bestParent = { col: nc, row: nr }; }
        }
      }
    }
    if (bestDist === Infinity) {
      for (const cell of cells) {
        const d = Math.abs(cell.col - spot.col) + Math.abs(cell.row - spot.row);
        if (d < bestDist) { bestDist = d; bestParent = { col: cell.col, row: cell.row }; }
      }
    }
    occupied[spot.row][spot.col] = true;
    cells.push({
      col: spot.col, row: spot.row, parentCol: bestParent.col, parentRow: bestParent.row,
      gen: 4, color: ALL_COLORS[Math.floor(rand(cells.length, 900) * ALL_COLORS.length)],
      survivor: false, seed: rand(cells.length, 500),
    });
  }

  // Pick 3% survivors
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
  chosen.forEach(idx => { cells[idx].survivor = true; });

  return cells;
})();

// ── Winding brick road path ──
const ROAD_PATH: { x: number; y: number }[] = (() => {
  const path: { x: number; y: number }[] = [];
  const topY = 80;
  const bottomY = FRAME_H - 80;
  const totalHeight = bottomY - topY;
  for (let i = 0; i < 22; i++) {
    const progress = i / 21;
    const y = topY + progress * totalHeight;
    const amplitude = 140 + Math.sin(progress * Math.PI) * 80;
    const x = FRAME_W / 2 + Math.sin(progress * Math.PI * 2.2) * amplitude;
    path.push({ x, y });
  }
  return path;
})();

const ROAD_ASSIGNMENT = [
  17, 3, 10, 21, 7, 14, 0, 19, 5, 12,
  8, 16, 1, 20, 11, 6, 15, 9, 4, 13, 18, 2,
];

// Arrival order: bottom of rook arrives first (same as forward departure order)
const arrivalSequence = new Array<number>(ROOK_GRID.length);
[...ROOK_GRID]
  .map((b, i) => ({ ...b, origIndex: i }))
  .sort((a, b) => b.y - a.y || a.x - b.x)
  .forEach((b, seq) => { arrivalSequence[b.origIndex] = seq; });

// Map road index → rook block index (reverse of ROAD_ASSIGNMENT)
const BLOCK_FOR_ROAD: number[] = new Array(22);
ROAD_ASSIGNMENT.forEach((roadIdx, blockIdx) => { BLOCK_FOR_ROAD[roadIdx] = blockIdx; });

// Assign survivors to road positions — guarantee every road position gets at least one
const SURVIVOR_MORPH = (() => {
  const map = new Map<number, { roadIdx: number; destColor: string }>();
  const survivors = ALL_CELLS
    .map((c, i) => c.survivor ? i : -1)
    .filter(i => i >= 0);

  const assigned = new Set<number>(); // survivor indices already claimed

  // Pass 1: For each road position, claim the nearest unclaimed survivor
  for (let ri = 0; ri < ROAD_PATH.length; ri++) {
    let bestDist = Infinity;
    let bestSi = -1;
    for (const si of survivors) {
      if (assigned.has(si)) continue;
      const cell = ALL_CELLS[si];
      const cc = cellCenter(cell.col, cell.row);
      const d = Math.hypot(cc.x - ROAD_PATH[ri].x, cc.y - ROAD_PATH[ri].y);
      if (d < bestDist) { bestDist = d; bestSi = si; }
    }
    if (bestSi >= 0) {
      assigned.add(bestSi);
      map.set(bestSi, {
        roadIdx: ri,
        destColor: ROOK_GRID[BLOCK_FOR_ROAD[ri]].color,
      });
    }
  }

  // Pass 2: Assign remaining survivors to their nearest road position
  for (const si of survivors) {
    if (assigned.has(si)) continue;
    const cell = ALL_CELLS[si];
    const cc = cellCenter(cell.col, cell.row);
    let bestDist = Infinity;
    let bestRoad = 0;
    for (let ri = 0; ri < ROAD_PATH.length; ri++) {
      const d = Math.hypot(cc.x - ROAD_PATH[ri].x, cc.y - ROAD_PATH[ri].y);
      if (d < bestDist) { bestDist = d; bestRoad = ri; }
    }
    map.set(si, {
      roadIdx: bestRoad,
      destColor: ROOK_GRID[BLOCK_FOR_ROAD[bestRoad]].color,
    });
  }

  return map;
})();

function lerpColor(c1: string, c2: string, p: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(r1 + (r2 - r1) * p, g1 + (g2 - g1) * p, b1 + (b2 - b1) * p);
}

// ═══════════════════════════════════════
// TIMING
// ═══════════════════════════════════════

// Phase 1: Multiplication
const P1_HOLD = 2.0;
const P1_SPLITS = [P1_HOLD, P1_HOLD + 0.5, P1_HOLD + 1.0, P1_HOLD + 1.5];
const P1_SPLIT_DUR = 0.5;
const P1_MULT_END = P1_SPLITS[3] + P1_SPLIT_DUR; // 4.0
const P1_FULL_HOLD = 1.5;
const P1_FADE_START = P1_MULT_END + P1_FULL_HOLD; // 5.5
const P1_FADE_DUR = 3.0;
const P1_REVEAL_HOLD = 3.0;
const P1_END = P1_FADE_START + P1_FADE_DUR + P1_REVEAL_HOLD; // 11.5

// Phase 2: Survivors morph into road blocks (slide + grow + recolor)
const P2_START = P1_END;             // 11.5 — morph begins
const P2_DUR = 2.0;                  // 2s morph
const P2_END = P2_START + P2_DUR;    // 13.5

// Phase 2b: ELO + theme labels interleaved along the road
const LABELS_START = P2_END + 2.0;   // 15.5 — 2s pause after road forms
const LABELS_HOLD = 1.5;             // hold after last item pops

// Phase 3-4 timing computed after THEME_PILLS below
const P3_STAGGER = 0.15;
const P3_FLY = 1.2;
function genSplitStart(gen: number): number {
  if (gen === 0) return P1_HOLD;
  if (gen <= 3) return P1_SPLITS[gen - 1];
  return P1_SPLITS[3];
}

// ── Remotion-compatible WheelTagline (decelerating spin, stops on target) ──
const WHEEL_SEGMENTS = [
  { word: 'fun', bg: '#58CC02', text: '#fff' },
  { word: 'easy', bg: '#1CB0F6', text: '#fff' },
  { word: 'free', bg: '#CE82FF', text: '#fff' },
  { word: 'smart', bg: '#FF9500', text: '#fff' },
  { word: 'quick', bg: '#FFC800', text: '#2A3C45' },
  { word: 'best', bg: '#FF4B4B', text: '#fff' },
];
const SEGMENT_H = 60;
const SEGMENT_W = 240;
const DIVIDER_W = 3;
// Total segments to scroll: 4 full cycles (24) + 1 = 25 → lands on index 1 ("easy")
const WHEEL_TOTAL_SEGS = 25;

// Constant-speed wheel for the intro (readable but never stopping)
const INTRO_WHEEL_SEGS_PER_SEC = 2.8; // ~2.8 words/sec — fast but glimpsable

function IntroWheelTagline({ t }: { t: number }) {
  const elapsed = Math.max(0, t);
  const totalScrolled = elapsed * INTRO_WHEEL_SEGS_PER_SEC;
  const translateY = -totalScrolled * SEGMENT_H;

  // Build enough panels to cover the scroll distance + buffer
  const panelCount = Math.ceil(totalScrolled) + 2;
  const panels: (typeof WHEEL_SEGMENTS)[number][] = [];
  for (let i = 0; i < panelCount; i++) {
    panels.push(WHEEL_SEGMENTS[i % WHEEL_SEGMENTS.length]);
  }

  return (
    <span style={{
      display: 'inline-block',
      position: 'relative',
      overflow: 'hidden',
      verticalAlign: 'bottom',
      width: SEGMENT_W,
      height: SEGMENT_H,
      borderRadius: 8,
      boxShadow: '0 0 0 4px #B0B0B0, 0 4px 16px rgba(0,0,0,0.2)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        transform: `translateY(${translateY}px)`,
      }}>
        {panels.map((seg, i) => (
          <div key={i} style={{
            width: SEGMENT_W,
            height: SEGMENT_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 40,
            background: `linear-gradient(180deg, ${seg.bg}ee 0%, ${seg.bg} 45%, ${seg.bg}cc 100%)`,
            color: seg.text,
            borderTop: `${DIVIDER_W}px solid #B0B0B0`,
            borderBottom: `${DIVIDER_W}px solid #B0B0B0`,
            textShadow: seg.text === '#fff'
              ? '0 2px 4px rgba(0,0,0,0.35)'
              : '0 2px 0 rgba(255,255,255,0.5)',
            boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}>
            {seg.word}
          </div>
        ))}
      </div>
    </span>
  );
}

/**
 * Decelerating wheel. `progress` goes from 0 → 1 over the spin duration.
 * At progress=0 it shows "fun", at progress=1 it stops on "easy".
 */
function RemotionWheelTagline({ progress }: { progress: number }) {
  const p = Math.max(0, Math.min(1, progress));
  // Strong cubic ease-out: fast start, very slow finish
  const eased = 1 - Math.pow(1 - p, 4);
  const translateY = -eased * WHEEL_TOTAL_SEGS * SEGMENT_H;

  // Build strip: segments 0 through WHEEL_TOTAL_SEGS
  const panels: (typeof WHEEL_SEGMENTS)[number][] = [];
  for (let i = 0; i <= WHEEL_TOTAL_SEGS; i++) {
    panels.push(WHEEL_SEGMENTS[i % WHEEL_SEGMENTS.length]);
  }

  return (
    <span style={{
      display: 'inline-block',
      position: 'relative',
      overflow: 'hidden',
      verticalAlign: 'bottom',
      width: SEGMENT_W,
      height: SEGMENT_H,
      borderRadius: 8,
      boxShadow: '0 0 0 4px #B0B0B0, 0 4px 16px rgba(0,0,0,0.2)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        transform: `translateY(${translateY}px)`,
      }}>
        {panels.map((seg, i) => (
          <div key={i} style={{
            width: SEGMENT_W,
            height: SEGMENT_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 40,
            background: `linear-gradient(180deg, ${seg.bg}ee 0%, ${seg.bg} 45%, ${seg.bg}cc 100%)`,
            color: seg.text,
            borderTop: `${DIVIDER_W}px solid #B0B0B0`,
            borderBottom: `${DIVIDER_W}px solid #B0B0B0`,
            textShadow: seg.text === '#fff'
              ? '0 2px 4px rgba(0,0,0,0.35)'
              : '0 2px 0 rgba(255,255,255,0.5)',
            boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}>
            {seg.word}
          </div>
        ))}
      </div>
    </span>
  );
}

// ── Morse code (from LogoReel) ──
// "chess": C(-.-.) H(....) E(.) S(...) S(...)
const MORSE_OFF_RANGES = [
  [0, 6.25], [8.33, 10.42], [12.5, 18.75], [20.83, 22.92],
  [29.17, 31.25], [33.33, 35.42], [37.5, 39.58], [41.67, 43.75],
  [50, 52.08],
  [58.33, 60.42], [62.5, 64.58], [66.67, 68.75],
  [75, 77.08], [79.17, 81.25], [83.33, 85.42],
];
const MORSE_CYCLE_S = 6;

// "path": P(.--.) A(.-) T(-) H(....)
const PATH_OFF_RANGES = [
  [0, 2.381], [4.762, 11.905], [14.286, 21.429], [23.810, 26.190],
  [33.333, 35.714], [38.095, 45.238],
  [52.381, 59.524],
  [66.667, 69.048], [71.429, 73.810], [76.190, 78.571], [80.952, 83.333],
];
const PATH_CYCLE_S = 18;

// Yellow block (1,1) = index 4, Purple block (3,2) = index 10
const CHESS_FLICKER_IDX = 4;
const PATH_FLICKER_IDX = 10;

function getMorseBrightness(blockIdx: number, timeSinceStart: number): number {
  if (timeSinceStart < 0) return 1;

  if (blockIdx === CHESS_FLICKER_IDX) {
    const cyclePos = ((timeSinceStart % MORSE_CYCLE_S) / MORSE_CYCLE_S) * 100;
    for (const [start, end] of MORSE_OFF_RANGES) {
      if (cyclePos >= start && cyclePos < end) return 0.1;
    }
  }

  if (blockIdx === PATH_FLICKER_IDX && timeSinceStart >= 2) {
    const flickerTime = timeSinceStart - 2;
    const cyclePos = ((flickerTime % PATH_CYCLE_S) / PATH_CYCLE_S) * 100;
    for (const [start, end] of PATH_OFF_RANGES) {
      if (cyclePos >= start && cyclePos < end) return 0.1;
    }
  }

  return 1;
}

// ── ELO labels along the road path ──
// delay = seconds after LABELS_START this label pops
const ELO_LABELS = [
  { elo: '400',  roadIdx: 0,  color: '#58CC02', delay: 0 },
  { elo: '800',  roadIdx: 4,  color: '#1CB0F6', delay: 1.0 },
  { elo: '1000', roadIdx: 7,  color: '#1CB0F6', delay: 2.0 },
  { elo: '1200', roadIdx: 10, color: '#FF9600', delay: 2.5 },
  { elo: '1400', roadIdx: 13, color: '#FF9600', delay: 3.0 },
  { elo: '1600', roadIdx: 16, color: '#FF4B4B', delay: 3.5 },
  { elo: '1800', roadIdx: 18, color: '#A560E8', delay: 4.0 },
  { elo: '2000', roadIdx: 21, color: '#A560E8', delay: 4.5 },
];

// ── Theme pills interleaved with ELO labels ──
// Each group cascades rapidly between its ELO label and the next
const THEME_COLORS = ['#58CC02', '#1CB0F6', '#FF9600', '#FF4B4B', '#A560E8', '#2FCBEF', '#FFC800', '#FF6B6B'];
const THEME_GROUPS: { eloDelay: number; roadStart: number; roadEnd: number; themes: string[] }[] = [
  { eloDelay: 0,   roadStart: 0,  roadEnd: 4,  themes: ['Mate in 1', 'Hanging Piece', 'Forks', 'Pins'] },
  { eloDelay: 1.0, roadStart: 4,  roadEnd: 7,  themes: ['Back Rank Mate', 'Knight Forks', 'Skewers', 'Discovered Attack'] },
  { eloDelay: 2.0, roadStart: 7,  roadEnd: 10, themes: ['Mate in 2', 'Sacrifices', 'Deflection', 'Trapped Piece'] },
  { eloDelay: 2.5, roadStart: 10, roadEnd: 13, themes: ['Double Check', 'X-Ray Attack', 'Clearance', 'Promotion'] },
  { eloDelay: 3.0, roadStart: 13, roadEnd: 16, themes: ['Mate in 3', 'Interference', 'Smothered Mate', 'Zugzwang'] },
  { eloDelay: 3.5, roadStart: 16, roadEnd: 18, themes: ['Arabian Mate', 'Hook Mate', 'Quiet Moves'] },
  { eloDelay: 4.0, roadStart: 18, roadEnd: 21, themes: ['Endgames', 'Exposed King', 'Intermezzo'] },
];

interface ThemePill { name: string; delay: number; roadProgress: number; color: string; side: 1 | -1 }
const THEME_PILLS: ThemePill[] = [];
let _colorIdx = 0;
for (const group of THEME_GROUPS) {
  group.themes.forEach((name, i) => {
    const roadFrac = (i + 0.5) / group.themes.length;
    const roadProg = (group.roadStart + roadFrac * (group.roadEnd - group.roadStart)) / 21;
    THEME_PILLS.push({
      name,
      delay: group.eloDelay + 0.2 + i * 0.1, // 0.2s after ELO label, then rapid fire
      roadProgress: roadProg,
      color: THEME_COLORS[_colorIdx % THEME_COLORS.length],
      side: (i % 2 === 0 ? 1 : -1) as 1 | -1,
    });
    _colorIdx++;
  });
}
const LAST_PILL_DELAY = THEME_PILLS[THEME_PILLS.length - 1].delay;

// Phase 3: Reverse staggered (road → rook)
const P3_START = LABELS_START + Math.max(4.5, LAST_PILL_DELAY) + LABELS_HOLD;
const P3_END = P3_START + 21 * P3_STAGGER + P3_FLY;

// Phase 4: Wheel + logo + tagline sequence
// Wheel starts spinning when blocks start flying (P3_START)
// Wheel stops 4s after rook fully forms
const WHEEL_POST_FORM = 4.0;
const WHEEL_STOP_S = P3_END + WHEEL_POST_FORM;
const WHEEL_SPIN_DUR = WHEEL_STOP_S - P3_START;
// Logo fades in as rook is nearly formed
const LOGO_FADE_S = P3_END - 0.5;
// Tagline (with wheel) fades in 1s after logo
const TAGLINE_FADE_S = P3_END + 1.0;
// Morse code starts 0.5s after wheel stops
const MORSE_START_S = WHEEL_STOP_S + 0.5;
// Hold morse for 6s then end
const MORSE_HOLD = 6.0;
const TOTAL_S = MORSE_START_S + MORSE_HOLD;
export const FULL_STORY_FRAMES = Math.ceil(TOTAL_S * FPS);

// Interpolate position along the road path (0-1 progress → x,y)
function roadPosAt(progress: number): { x: number; y: number } {
  const idx = progress * 21;
  const lo = Math.max(0, Math.min(20, Math.floor(idx)));
  const hi = lo + 1;
  const frac = idx - lo;
  return {
    x: ROAD_PATH[lo].x + (ROAD_PATH[hi].x - ROAD_PATH[lo].x) * frac,
    y: ROAD_PATH[lo].y + (ROAD_PATH[hi].y - ROAD_PATH[lo].y) * frac,
  };
}

// ═══════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════

export const RookFullStory: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // ── Phase 1 opacities ──
  const logoTextOp = interpolate(t, [P1_HOLD - 0.2, P1_HOLD + 0.4], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const rookOp = interpolate(t, [P1_HOLD, P1_HOLD + 0.3], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Counter card — pops in, counts up, pops out ──
  const counterStart = P1_HOLD + 0.3;
  const counterEnd = P1_MULT_END + P1_FULL_HOLD * 0.4;
  const counterProgress = interpolate(t, [counterStart, counterEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  const counterCount = Math.floor(counterProgress * 5000000);
  const counterPopIn = interpolate(t, [counterStart, counterStart + 0.3], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(3)),
  });
  const counterPopOut = interpolate(t, [P1_FADE_START - 0.3, P1_FADE_START], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.in(Easing.back(2)),
  });
  const counterScale = counterPopIn * counterPopOut;

  // ── "Top 3%" card — pops in, fades out as morph begins ──
  const revealAt = P1_FADE_START + P1_FADE_DUR * 0.5;
  const revealPopIn = interpolate(t, [revealAt, revealAt + 0.3], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(3)),
  });
  const revealPopOut = interpolate(t, [P2_START, P2_START + 0.5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.in(Easing.back(2)),
  });
  const revealScale = revealPopIn * revealPopOut;

  // ── Phase 4: Staggered fade-ins ──
  // Wheel fades in when blocks start flying
  const wheelOp = interpolate(t, [P3_START, P3_START + 0.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Wheel spin progress (0 = start spinning, 1 = stopped on "easy")
  const wheelProgress = interpolate(t, [P3_START, WHEEL_STOP_S], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Logo fades in as rook nearly formed
  const logoOp = interpolate(t, [LOGO_FADE_S, LOGO_FADE_S + 1.0], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Tagline text fades in after logo
  const taglineOp = interpolate(t, [TAGLINE_FADE_S, TAGLINE_FADE_S + 0.8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      width: FRAME_W, height: FRAME_H, backgroundColor: '#ffffff',
      overflow: 'hidden', position: 'relative',
    }}>

      {/* ═══ PHASE 1: Opening logo text + "What is..." sticker ═══ */}
      {logoTextOp > 0.01 && (
        <div style={{
          position: 'absolute', top: CY + ROOK_H / 2 + 40, left: 0, width: FRAME_W,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          opacity: logoTextOp, fontFamily, zIndex: 5,
        }}>
          <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1 }}>
            <span style={{ color: '#2A3C45' }}>chess</span>
            <span style={{
              background: 'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>path</span>
            <span style={{ color: '#2A3C45', fontSize: 160 }}>?</span>
          </div>
          <div style={{
            fontSize: 40, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase' as const, color: '#6B7B8D',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            The <IntroWheelTagline t={t} /> way to learn chess
          </div>
        </div>
      )}

      {/* ═══ PHASE 1: "What is..." sticker (diagonal, overlapping rook) ═══ */}
      {logoTextOp > 0.01 && (() => {
        const stickerPop = interpolate(t, [0.1, 0.5], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(4)),
        });
        const stickerWiggle = Math.sin(t * 3) * 2;
        const stickerColor = '#FF4B4B';
        const stickerDark = darken(stickerColor, 25);
        return (
          <div style={{
            position: 'absolute',
            top: CY + 60,
            left: FRAME_W / 2 - 360,
            width: 440,
            transform: `scale(${stickerPop}) rotate(${-12 + stickerWiggle}deg)`,
            transformOrigin: 'center center',
            opacity: logoTextOp,
            zIndex: 10,
            fontFamily,
          }}>
            <div style={{
              backgroundColor: stickerColor,
              borderRadius: 28,
              padding: '18px 36px',
              textAlign: 'center',
              boxShadow: `0 8px 0 ${stickerDark}, 0 14px 32px rgba(0,0,0,0.2)`,
              border: '5px solid #fff',
            }}>
              <div style={{
                color: '#fff',
                fontWeight: 800,
                fontSize: 72,
                textShadow: `0 4px 0 ${stickerDark}`,
                lineHeight: 1.1,
              }}>
                What is...
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ PHASE 1: Assembled rook ═══ */}
      {rookOp > 0.01 && ROOK_GRID.map((block, i) => {
        const pos = rookPos(block.x, block.y);
        const brightness = 1 + 0.06 * Math.sin(t * 1.5 + i * 0.5);
        return (
          <div key={`rook-${i}`} style={{
            position: 'absolute',
            left: pos.x - BIG_SIZE / 2, top: pos.y - BIG_SIZE / 2,
            width: BIG_SIZE, height: BIG_SIZE, borderRadius: 10,
            background: getMatteBackground(block.color),
            boxShadow: getMatteBoxShadow(block.color, BIG_SIZE / 14),
            filter: `brightness(${brightness})`,
            opacity: rookOp, zIndex: 3,
          }} />
        );
      })}

      {/* ═══ PHASE 1 + PHASE 2: Multiplication cells (survivors morph into road) ═══ */}
      {t >= P1_HOLD && t < P2_END && ALL_CELLS.map((cell, i) => {
        const splitStart = genSplitStart(cell.gen);
        const stagger = cell.seed * P1_SPLIT_DUR * 0.4;
        const myStart = splitStart + stagger;

        const popProgress = interpolate(t, [myStart, myStart + 0.25], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(2.5)),
        });
        if (popProgress < 0.01) return null;

        // Base position (grid cell)
        const from = cellCenter(cell.parentCol, cell.parentRow);
        const gridPos = cellCenter(cell.col, cell.row);
        const slideP = interpolate(t, [myStart, myStart + 0.3], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
        });
        let x = from.x + (gridPos.x - from.x) * slideP;
        let y = from.y + (gridPos.y - from.y) * slideP;

        let opacity = 1;
        let curSize = BLOCK_SIZE;
        let curColor = cell.color;
        let curRadius = 4;
        let curShadowScale = 1;

        if (!cell.survivor) {
          // Non-survivors: all dissolve simultaneously
          if (t >= P1_FADE_START) {
            opacity = interpolate(t,
              [P1_FADE_START, P1_FADE_START + P1_FADE_DUR],
              [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) },
            );
          }
        } else if (t >= P2_START) {
          // Survivors: morph toward road positions during Phase 2
          const morph = SURVIVOR_MORPH.get(i);
          if (morph) {
            const mp = interpolate(t, [P2_START, P2_END], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              easing: Easing.inOut(Easing.cubic),
            });
            const road = ROAD_PATH[morph.roadIdx];
            x = gridPos.x + (road.x - gridPos.x) * mp;
            y = gridPos.y + (road.y - gridPos.y) * mp;
            curSize = BLOCK_SIZE + (BIG_SIZE - BLOCK_SIZE) * mp;
            curColor = lerpColor(cell.color, morph.destColor, mp);
            curRadius = 4 + (10 - 4) * mp;
            curShadowScale = 1 + (BIG_SIZE / 14 - 1) * mp;
          }
        }

        if (opacity < 0.01) return null;

        const brightness = cell.survivor && t >= P1_FADE_START
          ? 1 + 0.06 * Math.sin(t * 1.8 + i * 0.4) : 1;

        return (
          <div key={`cell-${i}`} style={{
            position: 'absolute',
            left: x - curSize / 2, top: y - curSize / 2,
            width: curSize, height: curSize, borderRadius: curRadius,
            background: getMatteBackground(curColor),
            boxShadow: getMatteBoxShadow(curColor, curShadowScale),
            opacity, transform: `scale(${popProgress})`,
            filter: `brightness(${brightness})`,
          }} />
        );
      })}

      {/* ═══ PHASE 1: Counter card ═══ */}
      {counterScale > 0.01 && (() => {
        const cardColor = '#1CB0F6';
        const cardDark = darken(cardColor, 20);
        return (
          <div style={{
            position: 'absolute',
            top: FRAME_H / 2 - 100, left: FRAME_W / 2 - 240,
            width: 480,
            borderRadius: 28,
            overflow: 'hidden',
            border: `5px solid ${cardColor}`,
            backgroundColor: '#ffffff',
            boxShadow: `0 8px 0 ${cardDark}, 0 14px 32px rgba(0,0,0,0.18)`,
            transform: `scale(${counterScale})`,
            zIndex: 10,
            fontFamily,
          }}>
            <div style={{
              backgroundColor: cardColor,
              padding: '20px 0 14px',
              textAlign: 'center',
            }}>
              <div style={{
                color: '#fff', fontWeight: 800, fontSize: 80,
                textShadow: `0 4px 0 ${cardDark}`,
                lineHeight: 1,
              }}>
                {counterCount.toLocaleString()}
              </div>
            </div>
            <div style={{
              padding: '14px 0',
              textAlign: 'center',
              backgroundColor: '#ffffff',
            }}>
              <div style={{
                color: '#6B7B8D', fontWeight: 700, fontSize: 28,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
              }}>
                puzzles
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ PHASE 1: "Top 3%" card ═══ */}
      {revealScale > 0.01 && (() => {
        const cardColor = '#58CC02';
        const cardDark = darken(cardColor, 20);
        return (
          <div style={{
            position: 'absolute',
            top: FRAME_H / 2 - 110, left: FRAME_W / 2 - 240,
            width: 480,
            borderRadius: 28,
            overflow: 'hidden',
            border: `5px solid ${cardColor}`,
            backgroundColor: '#ffffff',
            boxShadow: `0 8px 0 ${cardDark}, 0 14px 32px rgba(0,0,0,0.18)`,
            transform: `scale(${revealScale})`,
            zIndex: 10,
            fontFamily,
          }}>
            <div style={{
              backgroundColor: cardColor,
              padding: '24px 0 18px',
              textAlign: 'center',
            }}>
              <div style={{
                color: '#fff', fontWeight: 800, fontSize: 110,
                textShadow: `0 5px 0 ${cardDark}`,
                lineHeight: 1,
              }}>
                Top 3%
              </div>
            </div>
            <div style={{
              padding: '16px 0',
              textAlign: 'center',
              backgroundColor: '#ffffff',
            }}>
              <div style={{
                color: '#6B7B8D', fontWeight: 700, fontSize: 26,
                letterSpacing: '0.06em',
              }}>
                Only the best puzzles make the cut
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ ELO labels along the road ═══ */}
      {t >= LABELS_START - 0.5 && t < P3_START + 1.5 && ELO_LABELS.map((label, li) => {
        const road = ROAD_PATH[label.roadIdx];
        const side = road.x > FRAME_W / 2 ? -1 : 1;
        const labelX = road.x + side * 130;
        const labelY = road.y;
        const connectorEndX = road.x + side * 48;

        // Pop in with explicit per-label delay
        const popStart = LABELS_START + label.delay;
        const popScale = interpolate(t, [popStart, popStart + 0.35], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(3.0)),
        });

        // Fade out as blocks fly away in Phase 3
        const fadeOut = interpolate(t, [P3_START - 0.3, P3_START + 1.0], [1, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        });

        if (popScale < 0.01 || fadeOut < 0.01) return null;

        const CARD_W = 150;
        const darkBorder = darken(label.color, 15);

        return (
          <React.Fragment key={`elo-${li}`}>
            {/* Connector line */}
            <div style={{
              position: 'absolute',
              left: Math.min(connectorEndX, labelX) - 2,
              top: labelY - 2,
              width: Math.abs(labelX - connectorEndX) + 4,
              height: 4,
              backgroundColor: label.color,
              opacity: popScale * fadeOut * 0.5,
              borderRadius: 2,
              zIndex: 8,
            }} />
            {/* Label card */}
            <div style={{
              position: 'absolute',
              left: labelX - CARD_W / 2,
              top: labelY - 42,
              width: CARD_W,
              borderRadius: 20,
              overflow: 'hidden',
              border: `4px solid ${label.color}`,
              backgroundColor: '#ffffff',
              boxShadow: `0 6px 0 ${darkBorder}, 0 10px 24px rgba(0,0,0,0.15)`,
              transform: `scale(${popScale})`,
              transformOrigin: side === -1 ? 'right center' : 'left center',
              opacity: fadeOut,
              zIndex: 9,
              fontFamily,
            }}>
              {/* Colored header */}
              <div style={{
                backgroundColor: label.color,
                padding: '10px 0',
                textAlign: 'center',
              }}>
                <div style={{
                  color: '#fff', fontWeight: 800, fontSize: 38,
                  textShadow: `0 3px 0 ${darkBorder}`,
                }}>
                  {label.elo}
                </div>
              </div>
              {/* Footer */}
              <div style={{
                padding: '7px 0',
                textAlign: 'center',
                backgroundColor: '#ffffff',
              }}>
                <div style={{
                  color: '#6B7B8D', fontWeight: 700, fontSize: 16,
                  letterSpacing: '0.12em',
                }}>
                  ELO
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* ═══ Theme pills interleaved with ELO labels ═══ */}
      {t >= LABELS_START && t < P3_START + 1.0 && THEME_PILLS.map((pill, pi) => {
        const pos = roadPosAt(pill.roadProgress);
        // Place on alternating sides, closer to road than ELO labels
        const autoSide = pos.x > FRAME_W / 2 ? -1 : 1;
        const side = pill.side * autoSide;
        const pillX = pos.x + side * 80;
        const pillY = pos.y;

        const popStart = LABELS_START + pill.delay;
        const popScale = interpolate(t, [popStart, popStart + 0.2], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(2.5)),
        });

        const fadeOut = interpolate(t, [P3_START - 0.3, P3_START + 0.8], [1, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        });

        if (popScale < 0.01 || fadeOut < 0.01) return null;

        const darkBg = darken(pill.color, 20);

        return (
          <div key={`theme-${pi}`} style={{
            position: 'absolute',
            left: pillX - 75,
            top: pillY - 16,
            width: 150,
            height: 34,
            borderRadius: 17,
            backgroundColor: pill.color,
            boxShadow: `0 3px 0 ${darkBg}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${popScale})`,
            transformOrigin: side === -1 ? 'right center' : 'left center',
            opacity: fadeOut,
            zIndex: 7,
            fontFamily,
          }}>
            <div style={{
              color: '#fff', fontWeight: 700, fontSize: 16,
              textShadow: `0 1px 0 ${darkBg}`,
              whiteSpace: 'nowrap',
            }}>
              {pill.name}
            </div>
          </div>
        );
      })}

      {/* ═══ PHASE 3-4: Road blocks fly to rook, then morse code blinks ═══ */}
      {t >= P2_END && ROOK_GRID.map((block, i) => {
        const roadIdx = ROAD_ASSIGNMENT[i];
        const road = ROAD_PATH[roadIdx];
        const rook = rookPos(block.x, block.y);

        // Fly from road to rook
        const flyStart = P3_START + arrivalSequence[i] * P3_STAGGER;
        const flyEnd = flyStart + P3_FLY;
        const flyProgress = interpolate(t, [flyStart, flyEnd], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.bezier(0.25, 1, 0.5, 1),
        });

        const cx = road.x + (rook.x - road.x) * flyProgress;
        const cy = road.y + (rook.y - road.y) * flyProgress;
        const arcHeight = -120 * Math.sin(flyProgress * Math.PI);
        const finalY = cy + arcHeight;

        // Landing bounce
        const landScale = flyProgress >= 0.99
          ? interpolate(t, [flyEnd - 0.2, flyEnd, flyEnd + 0.15], [1.0, 1.15, 1.0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            })
          : 1.0;

        // Breathing — each block offset so it ripples like a living thing
        const breathe = 1 + 0.06 * Math.sin(t * 1.5 + i * 0.5);

        // Morse code brightness — starts after wheel stops
        const morseBri = getMorseBrightness(i, t - MORSE_START_S);
        const brightness = morseBri * breathe;
        const saturate = morseBri < 0.5 ? 0 : 1;

        return (
          <div key={`road-${i}`} style={{
            position: 'absolute',
            left: cx - BIG_SIZE / 2, top: finalY - BIG_SIZE / 2,
            width: BIG_SIZE, height: BIG_SIZE, borderRadius: 10,
            background: getMatteBackground(block.color),
            boxShadow: getMatteBoxShadow(block.color, BIG_SIZE / 14),
            transform: `scale(${landScale})`,
            filter: `brightness(${brightness.toFixed(2)}) saturate(${saturate})`,
            zIndex: 4,
          }} />
        );
      })}

      {/* ═══ PHASE 4: Wheel (early) → Logo → Tagline text ═══ */}
      {t >= P3_START && (
        <div style={{
          position: 'absolute', top: CY + ROOK_H / 2 + 40, left: 0, width: FRAME_W,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          fontFamily, zIndex: 5,
        }}>
          {/* "chesspath" logo */}
          <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1, opacity: logoOp }}>
            <span style={{ color: '#2A3C45' }}>chess</span>
            <span style={{
              background: 'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>path</span>
          </div>
          {/* Tagline: "The [wheel] way to learn chess" */}
          <div style={{
            fontSize: 40, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase' as const, color: '#6B7B8D',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <span style={{ opacity: taglineOp }}>The</span>
            <span style={{ opacity: wheelOp }}>
              <RemotionWheelTagline progress={wheelProgress} />
            </span>
            <span style={{ opacity: taglineOp }}>way to learn chess</span>
          </div>
        </div>
      )}
    </div>
  );
};
