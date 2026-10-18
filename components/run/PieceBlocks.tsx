'use client';

import { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { defaultPieces } from 'react-chessboard';
import { getMatteBackground } from '@/lib/daily-rook-blocks';

/**
 * PieceBlocks — Rookie-style block art for any chess piece.
 *
 * Source of truth = react-chessboard's default piece SVGs. We rasterize
 * each SVG once into a boolean grid, cache the result, and render every
 * filled cell as a matte block in Rookie's palette.
 *
 * Use this anywhere we want Rookie to "transform" into another piece in
 * Rookies Run. For the rook itself, use <BreathingRook /> directly so
 * we keep the canonical 5×6 sprite.
 *
 * Tweak per-piece grid dimensions in PIECE_TEMPLATES below — pawn is
 * intentionally shorter than the others to match real piece proportions.
 */

export type PieceType = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';

/**
 * Everything PieceBlocks can draw: the chess family plus hand-authored
 * creature sprites (D = the Dragon summon). Creatures never rasterize —
 * their masks are authored below, same technique as the pawn.
 */
export type BlockPieceType = PieceType | 'D';

/**
 * Dragon ALTERNATE masks under review on /test/pawn-blocks only.
 * The game renders 'D' (current mask) until Tyler picks a winner —
 * these codes are deliberately NOT part of BlockPieceType.
 */
export type DragonAltType = 'DA' | 'DB' | 'DC' | 'DD';

interface PieceTemplate {
  /** react-chessboard piece key */
  svgKey: 'wP' | 'wN' | 'wB' | 'wR' | 'wQ' | 'wK';
  cols: number;
  rows: number;
  /** Per-piece silhouette sampling threshold (0-1). */
  threshold: number;
}

export const PIECE_TEMPLATES: Record<BlockPieceType | DragonAltType, PieceTemplate> = {
  P: { svgKey: 'wP', cols: 12, rows: 15, threshold: 0.35 },
  N: { svgKey: 'wN', cols: 16, rows: 18, threshold: 0.35 },
  B: { svgKey: 'wB', cols: 14, rows: 20, threshold: 0.35 },
  R: { svgKey: 'wR', cols: 14, rows: 18, threshold: 0.35 },
  Q: { svgKey: 'wQ', cols: 16, rows: 18, threshold: 0.35 }, // was 18x18 — read squat + too wide on the board (Tyler 2026-09-03)
  K: { svgKey: 'wK', cols: 16, rows: 20, threshold: 0.35 },
  // Dragons never rasterize (masks authored below); svgKey is a placeholder.
  D: { svgKey: 'wQ', cols: 18, rows: 18, threshold: 0.35 },
  DA: { svgKey: 'wQ', cols: 18, rows: 18, threshold: 0.35 },
  DB: { svgKey: 'wQ', cols: 18, rows: 18, threshold: 0.35 },
  DC: { svgKey: 'wQ', cols: 18, rows: 18, threshold: 0.35 },
  DD: { svgKey: 'wQ', cols: 18, rows: 18, threshold: 0.35 },
};

// Rookie's canonical 8-color palette.
export const ROOKIE_PALETTE = ['#1CB0F6', '#2FCBEF', '#A560E8', '#58CC02', '#FFC800', '#FF9600', '#FF6B6B', '#FF4B4B'];

type Mask = boolean[][];

// Hand-authored pawn silhouette. The rasterized SVG pawn read as a "little
// rocket" (pointed top), so the pawn alone gets a canonical sprite — same
// technique as BreathingRook's 5x6 rook: a big CIRCULAR head, a collar ring
// pinched off from the neck, a tapered body, and a wide base. Must stay
// 12 cols x 15 rows (PIECE_TEMPLATES.P above).
const PAWN_ART: readonly string[] = [
  '....XXXX....',
  '...XXXXXX...',
  '..XXXXXXXX..',
  '..XXXXXXXX..',
  '..XXXXXXXX..',
  '...XXXXXX...',
  '....XXXX....',
  '..XXXXXXXX..',
  '....XXXX....',
  '....XXXX....',
  '...XXXXXX...',
  '...XXXXXX...',
  '..XXXXXXXX..',
  '.XXXXXXXXXX.',
  'XXXXXXXXXXXX',
];

const PAWN_MASK: Mask = PAWN_ART.map((row) => row.split('').map((c) => c === 'X'));

// Hand-authored DRAGON silhouette (the Dragon summon's board sprite — she is
// NOT a queen). Same technique as the pawn: authored for tiny sizes. Facing
// left: two horns, a long upper snout with an OPEN jaw (the notch under the
// snout), a serpentine neck stepping down-right, one swept-back wing sail on
// the right, a thick body, and an S-coiled tail at the base. Must stay
// 18 cols x 18 rows (PIECE_TEMPLATES.D above).
const DRAGON_ART: readonly string[] = [
  '....X..X..........',
  '....X..X..........',
  '...XXXXXX.......X.',
  'XXXXXXXXX......XX.',
  '....XXXXX.....XXX.',
  '.XXXXXXX.....XXXX.',
  '.....XXXX...XXXXX.',
  '......XXXX..XXXX..',
  '.......XXXXXXXX...',
  '.......XXXXXXX....',
  '......XXXXXXXXX...',
  '.....XXXXXXXXXX...',
  '.....XXXXXXXXX....',
  '.....XXXXXXXX.....',
  '......XXXXXXXX....',
  '..........XXXXXX..',
  '.....XXXXXXXXXX...',
  '...XXXXXX.........',
];


// ALTERNATE dragon masks (Tyler review, /test/pawn-blocks). All 18x18.
// Goal: silhouettes that CANNOT read as a chicken at blockSize 3.

// A — side-profile serpentine: ONE continuous horizontal body (a detached
// wing split it into two blobs = bird takeoff, redrawn), horned head left,
// dorsal spike ridge attached to the back, legs below, tail curling down.
const DRAGON_ART_A: readonly string[] = [
  '..................',
  '..X...............',
  '.XXX...X...X......',
  'XXXXX..XX..XX.....',
  'XXXXXXXXXXXXXXX...',
  '.XXXXXXXXXXXXXXXX.',
  '..XXXXXXXXXXXXXXXX',
  '...XXXXXXXXXXXXXXX',
  '....XXXX...XXXXXXX',
  '....XXX.......XXXX',
  '..............XXXX',
  '.............XXXX.',
  '...........XXXX...',
  '.........XXXX.....',
  '........XXX.......',
  '........XXX.......',
  '.........XXXX.....',
  '...........XXX....',
];

// B — bat-wing dominant: the wide spread wings ARE the shape; small horned
// head between them, narrow body dropping to a flicked tail.
const DRAGON_ART_B: readonly string[] = [
  '.......X..X.......',
  'X......XXXX......X',
  'XX.....XXXX.....XX',
  'XXX....XXXX....XXX',
  'XXXX..XXXXXX..XXXX',
  'XXXXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXXXX',
  'XXX.XXXXXXXXXX.XXX',
  'XX...XXXXXXXX...XX',
  'X.....XXXXXX.....X',
  '.......XXXX.......',
  '.......XXXX.......',
  '.......XXXX.......',
  '........XXX.......',
  '........XXX.......',
  '.........XXX......',
  '..........XXX.....',
];

// C — coiled wyrm: circular coil (hole in the middle sells it), head rising
// over the top-left on a crossing neck. No wings.
const DRAGON_ART_C: readonly string[] = [
  '...XX.............',
  '..XXXX............',
  'XXXXXXX...........',
  '.XXXXXX...........',
  '...XXXX...........',
  '....XXXX..........',
  '.....XXXX.XXXXX...',
  '.....XXXXXXXXXXX..',
  '....XXXXXXXXXXXXX.',
  '...XXXXX...XXXXXX.',
  '..XXXXX.....XXXXXX',
  '..XXXX.......XXXXX',
  '..XXXX.......XXXXX',
  '..XXXXX.....XXXXX.',
  '...XXXXX...XXXXXX.',
  '....XXXXXXXXXXXX..',
  '......XXXXXXXXX...',
  '........XXXXX.....',
];

// D — heraldic rampant: chest up, flat crocodilian snout (closed jaw) with a
// swept-back horn, raised foreleg, small wing sail, THICK tail sweeping right.
const DRAGON_ART_D: readonly string[] = [
  '.......XX.........',
  '......XXX.........',
  'XXXXXXXXXX........',
  '.XXXXXXXXX........',
  '.....XXXXX.XX.....',
  '......XXXXXXXX....',
  '...XX.XXXXXXXXX...',
  '...XXXXXXXXXXXXX..',
  '.....XXXXXXXXXXX..',
  '.....XXXXXXXXXX...',
  '.....XXXXXXXXX....',
  '......XXXXXXXX....',
  '......XXXXXXXXX...',
  '....XXXXXXXXXXXX..',
  '....XXX.XXXXXXXXX.',
  '..........XXXXXXXX',
  '.............XXXXX',
  '...........XXXXX..',
];

const toMask = (art: readonly string[]): Mask => art.map((row) => row.split('').map((c) => c === 'X'));

// Tyler picked option B (bat-wing) 2026-09-02 — 'D' renders the B silhouette;
// DRAGON_ART (the original) stays only as the 'Current' reference on /test/pawn-blocks.
const DRAGON_MASK: Mask = DRAGON_ART_B.map((row) => row.split('').map((c) => c === 'X'));

// Module-level cache so each piece only rasterizes once per session.
const MASK_CACHE = new Map<string, Mask>();
// The pawn and dragon never rasterize — their masks are authored above.
MASK_CACHE.set('P', PAWN_MASK);
MASK_CACHE.set('D', DRAGON_MASK);
MASK_CACHE.set('DA', toMask(DRAGON_ART_A));
MASK_CACHE.set('DB', toMask(DRAGON_ART_B));
MASK_CACHE.set('DC', toMask(DRAGON_ART_C));
MASK_CACHE.set('DD', toMask(DRAGON_ART_D));
const PENDING = new Map<string, Promise<Mask>>();

async function rasterize(piece: BlockPieceType | DragonAltType): Promise<Mask> {
  const cacheKey = piece;
  const cached = MASK_CACHE.get(cacheKey);
  if (cached) return cached;
  const inflight = PENDING.get(cacheKey);
  if (inflight) return inflight;

  const { svgKey, cols, rows, threshold } = PIECE_TEMPLATES[piece];
  const promise = (async () => {
    const PieceFn = (defaultPieces as Record<string, (props: Record<string, unknown>) => React.ReactElement>)[svgKey];
    let svgString = renderToStaticMarkup(PieceFn({ style: { width: '100%', height: '100%' }, fill: '#000' }));
    if (!svgString.includes('xmlns=')) {
      svgString = svgString.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    }

    const PX_PER_CELL = 12;
    const W = cols * PX_PER_CELL;
    const H = rows * PX_PER_CELL;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const margin = 0.04;
    ctx.drawImage(img, W * margin, H * margin, W * (1 - 2 * margin), H * (1 - 2 * margin));
    const data = ctx.getImageData(0, 0, W, H).data;
    URL.revokeObjectURL(url);

    const mask: Mask = [];
    for (let y = 0; y < rows; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < cols; x++) {
        let sum = 0;
        for (let py = 0; py < PX_PER_CELL; py++) {
          for (let px = 0; px < PX_PER_CELL; px++) {
            const i = ((y * PX_PER_CELL + py) * W + (x * PX_PER_CELL + px)) * 4 + 3;
            sum += data[i];
          }
        }
        row.push(sum / (PX_PER_CELL * PX_PER_CELL * 255) >= threshold);
      }
      mask.push(row);
    }
    MASK_CACHE.set(cacheKey, mask);
    PENDING.delete(cacheKey);
    return mask;
  })();

  PENDING.set(cacheKey, promise);
  return promise;
}

interface PieceBlocksProps {
  piece: BlockPieceType | DragonAltType;
  /** Pixel size of each block. */
  blockSize?: number;
  /** Slow brightness pulse like BreathingRook. */
  animate?: boolean;
  /** Optional className on the wrapper. */
  className?: string;
  /** Override the default Rookie palette (e.g. golden King for Become King). */
  palette?: readonly string[];
  /**
   * Contain the sprite in a `fit` x `fit` pixel box: the whole block grid is
   * scaled as ONE unit (whole-pixel blocks, even spacing) so its larger side
   * equals `fit`, and centered on its ink. This is how a sprite lives inside
   * a board cell — the caller measures the cell, the sprite can never spill.
   * Without it the sprite renders at its natural cols x blockSize size.
   */
  fit?: number;
}

// Golden palette used when Rookie transforms into King (Become King ability).
export const GOLDEN_KING_PALETTE = ['#FFF4B0', '#FFE066', '#FFD33A', '#FFC107', '#FFAA00', '#E8920C', '#C97A00', '#8C5200'];

/**
 * Crop a mask to the bounding box of its filled cells. Hand-authored masks
 * (the dragon alternates especially) carry empty border rows/cols, and
 * rasterized masks carry the 4% sampling margin — a sprite centered on its
 * full grid is off-center on its ink. Centering on the ink is what reads as
 * "in the middle of the square".
 */
function trimMask(mask: Mask): Mask {
  let top = mask.length, bottom = -1, left = Infinity, right = -1;
  mask.forEach((row, y) => row.forEach((filled, x) => {
    if (!filled) return;
    if (y < top) top = y;
    if (y > bottom) bottom = y;
    if (x < left) left = x;
    if (x > right) right = x;
  }));
  if (bottom < 0) return mask;
  return mask.slice(top, bottom + 1).map((row) => row.slice(left, right + 1));
}

const TRIM_CACHE = new Map<Mask, Mask>();
function trimmed(mask: Mask): Mask {
  let t = TRIM_CACHE.get(mask);
  if (!t) { t = trimMask(mask); TRIM_CACHE.set(mask, t); }
  return t;
}

export function PieceBlocks({ piece, blockSize = 12, animate = true, className, palette, fit }: PieceBlocksProps) {
  const [rawMask, setMask] = useState<Mask | null>(() => MASK_CACHE.get(piece) ?? null);
  useEffect(() => {
    if (MASK_CACHE.has(piece)) {
      setMask(MASK_CACHE.get(piece)!);
      return;
    }
    let cancelled = false;
    rasterize(piece).then(m => { if (!cancelled) setMask(m); });
    return () => { cancelled = true; };
  }, [piece]);

  const mask = rawMask ? trimmed(rawMask) : null;
  const tpl = PIECE_TEMPLATES[piece];
  const gap = Math.max(0, Math.round(blockSize * 0.08));
  const radius = Math.max(1, Math.round(blockSize * 0.18));
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;
  // Box = the ink footprint of the mask (trimmed), so the piece is centered
  // on what you actually see.
  const cols = mask?.[0]?.length ?? tpl.cols;
  const rows = mask?.length ?? tpl.rows;
  const w = cols * blockSize + (cols - 1) * gap;
  const h = rows * blockSize + (rows - 1) * gap;

  // Fitted mode: the layout box IS the fit box; the natural-size grid sits
  // centered inside it and is scaled as a unit to touch the box on its
  // larger side. Layout never exceeds `fit`, whatever the mask dimensions.
  const outerW = fit ?? w;
  const outerH = fit ?? h;
  const gridScale = fit ? fit / Math.max(w, h) : 1;

  if (!mask) {
    return <div className={className} style={{ width: outerW, height: outerH }} aria-hidden />;
  }

  const CX = (cols - 1) / 2;
  const CY = (rows - 1) / 2;

  return (
    <div className={className} style={{ position: 'relative', width: outerW, height: outerH }}>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
        @keyframes pieceBlocksBreathe {
          0%, 100% { filter: brightness(0.9) saturate(0.95); }
          50% { filter: brightness(1.5) saturate(1.2); }
        }
      ` }} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: w,
          height: h,
          transform: `translate(-50%, -50%) scale(${gridScale})`,
          transformOrigin: 'center',
        }}
      >
      {mask.map((row, y) => row.map((filled, x) => {
        if (!filled) return null;
        const pal = palette ?? ROOKIE_PALETTE;
        const bandIdx = Math.min(pal.length - 1, Math.floor((y / rows) * pal.length));
        const tweak = (x + y) % 3 === 0 ? 1 : 0;
        const color = pal[(bandIdx + tweak) % pal.length];
        const dist = Math.sqrt((x - CX) ** 2 + (y - CY) ** 2);
        const delay = (dist / 12) * 1.2;
        return (
          <div
            key={`${x},${y}`}
            style={{
              position: 'absolute',
              left: x * (blockSize + gap),
              top: y * (blockSize + gap),
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              background: getMatteBackground(color),
              boxShadow: insetShadow,
              animation: animate ? `pieceBlocksBreathe 5s ease-in-out ${delay}s infinite` : undefined,
            }}
          />
        );
      }))}
      </div>
    </div>
  );
}
