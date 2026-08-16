// Shared rook block data — single source of truth for the Chess Path rook shape.
// Used by: AnimatedLogo, OG route, DailyRookDisplay, BreathingRook, RookProgressAnimation, Remotion, emails

// ─── Matte block styling utilities ───

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
    .join('');
}

export function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = amount / 100;
  return rgbToHex(
    r + (255 - r) * factor,
    g + (255 - g) * factor,
    b + (255 - b) * factor
  );
}

export function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = 1 - amount / 100;
  return rgbToHex(r * factor, g * factor, b * factor);
}

/** Matte gradient: lighten→base→darken, top to bottom */
export function getMatteBackground(color: string): string {
  return `linear-gradient(to bottom, ${lighten(color, 18)} 0%, ${lighten(color, 12)} 20%, ${color} 40%, ${darken(color, 12)} 100%)`;
}

/** Matte inset + drop shadows. Scale adjusts shadow sizes for different block sizes (base = 14px). */
export function getMatteBoxShadow(color: string, scale: number = 1): string {
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  return [
    `inset 0 ${s(0.75)} 0 ${darken(color, 6)}`,
    `inset 0 -${s(0.75)} 0 ${lighten(color, 6)}`,
    `0 ${s(0.5)} 0 rgba(0,0,0,0.25)`,
    `0 0 0 ${s(0.5)} rgba(0,0,0,0.15)`,
  ].join(', ');
}

export interface RookBlock {
  x: number; // grid column (0-4)
  y: number; // grid row (0-5)
  color: string;
}

// 22 blocks that form the rook shape, in grid coordinates.
// Rows: 0=crown points, 1=crown rim, 2=head, 3=neck, 4=body, 5=base
export const ROOK_BLOCKS: RookBlock[] = [
  // Row 0: Crown points (3 blocks)
  { x: 0, y: 0, color: '#1CB0F6' },
  { x: 2, y: 0, color: '#2FCBEF' },
  { x: 4, y: 0, color: '#A560E8' },
  // Row 1: Crown rim (5 blocks)
  { x: 0, y: 1, color: '#58CC02' },
  { x: 1, y: 1, color: '#FFC800' },
  { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' },
  { x: 4, y: 1, color: '#FF4B4B' },
  // Row 2: Head (3 blocks)
  { x: 1, y: 2, color: '#1CB0F6' },
  { x: 2, y: 2, color: '#2FCBEF' },
  { x: 3, y: 2, color: '#A560E8' },
  // Row 3: Neck (3 blocks)
  { x: 1, y: 3, color: '#58CC02' },
  { x: 2, y: 3, color: '#FFC800' },
  { x: 3, y: 3, color: '#FF9600' },
  // Row 4: Body (3 blocks)
  { x: 1, y: 4, color: '#FF6B6B' },
  { x: 2, y: 4, color: '#FF4B4B' },
  { x: 3, y: 4, color: '#1CB0F6' },
  // Row 5: Base (5 blocks)
  { x: 0, y: 5, color: '#2FCBEF' },
  { x: 1, y: 5, color: '#A560E8' },
  { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' },
  { x: 4, y: 5, color: '#FF9600' },
];

// Fill order: bottom (base) to top (crown), left-to-right within each row.
// Index into ROOK_BLOCKS. This is the order blocks fill during gameplay (puzzle 1 = index 0, etc.)
export const ROOK_FILL_ORDER: number[] = [
  // Row 5: Base (indices 17-21)
  17, 18, 19, 20, 21,
  // Row 4: Body (indices 14-16)
  14, 15, 16,
  // Row 3: Neck (indices 11-13)
  11, 12, 13,
  // Row 2: Head (indices 8-10)
  8, 9, 10,
  // Row 1: Crown rim (indices 3-7)
  3, 4, 5, 6, 7,
  // Row 0: Crown points (indices 0-2)
  0, 1, 2,
];

// Get the color for a specific block by grid position
export function getBlockColor(x: number, y: number): string {
  const block = ROOK_BLOCKS.find(b => b.x === x && b.y === y);
  return block?.color || '#58CC02';
}

// Pixel coordinates used by AnimatedLogo (scaled from grid)
// AnimatedLogo uses a different coordinate system: pixel offsets with 18px spacing
export const ROOK_BLOCKS_PIXEL = ROOK_BLOCKS.map(b => ({
  x: b.x * 18 + 8, // maps grid 0-4 to pixel positions 8,26,44,62,80
  y: b.y * 18 + 8, // maps grid 0-5 to pixel positions 8,26,44,62,80,98
  color: b.color,
}));
