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
 * Rookie's Run. For the rook itself, use <BreathingRook /> directly so
 * we keep the canonical 5×6 sprite.
 *
 * Tweak per-piece grid dimensions in PIECE_TEMPLATES below — pawn is
 * intentionally shorter than the others to match real piece proportions.
 */

export type PieceType = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';

interface PieceTemplate {
  /** react-chessboard piece key */
  svgKey: 'wP' | 'wN' | 'wB' | 'wR' | 'wQ' | 'wK';
  cols: number;
  rows: number;
  /** Per-piece silhouette sampling threshold (0-1). */
  threshold: number;
}

export const PIECE_TEMPLATES: Record<PieceType, PieceTemplate> = {
  P: { svgKey: 'wP', cols: 18, rows: 16, threshold: 0.35 },
  N: { svgKey: 'wN', cols: 16, rows: 18, threshold: 0.35 },
  B: { svgKey: 'wB', cols: 14, rows: 20, threshold: 0.35 },
  R: { svgKey: 'wR', cols: 14, rows: 18, threshold: 0.35 },
  Q: { svgKey: 'wQ', cols: 18, rows: 18, threshold: 0.35 },
  K: { svgKey: 'wK', cols: 16, rows: 20, threshold: 0.35 },
};

// Rookie's canonical 8-color palette.
export const ROOKIE_PALETTE = ['#1CB0F6', '#2FCBEF', '#A560E8', '#58CC02', '#FFC800', '#FF9600', '#FF6B6B', '#FF4B4B'];

type Mask = boolean[][];

// Module-level cache so each piece only rasterizes once per session.
const MASK_CACHE = new Map<string, Mask>();
const PENDING = new Map<string, Promise<Mask>>();

async function rasterize(piece: PieceType): Promise<Mask> {
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
  piece: PieceType;
  /** Pixel size of each block. */
  blockSize?: number;
  /** Slow brightness pulse like BreathingRook. */
  animate?: boolean;
  /** Optional className on the wrapper. */
  className?: string;
  /** Override the default Rookie palette (e.g. golden King for Become King). */
  palette?: readonly string[];
}

// Golden palette used when Rookie transforms into King (Become King ability).
export const GOLDEN_KING_PALETTE = ['#FFF4B0', '#FFE066', '#FFD33A', '#FFC107', '#FFAA00', '#E8920C', '#C97A00', '#8C5200'];

export function PieceBlocks({ piece, blockSize = 12, animate = true, className, palette }: PieceBlocksProps) {
  const [mask, setMask] = useState<Mask | null>(() => MASK_CACHE.get(piece) ?? null);
  useEffect(() => {
    if (MASK_CACHE.has(piece)) {
      setMask(MASK_CACHE.get(piece)!);
      return;
    }
    let cancelled = false;
    rasterize(piece).then(m => { if (!cancelled) setMask(m); });
    return () => { cancelled = true; };
  }, [piece]);

  const tpl = PIECE_TEMPLATES[piece];
  const gap = Math.max(0, Math.round(blockSize * 0.08));
  const radius = Math.max(1, Math.round(blockSize * 0.18));
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;
  const w = tpl.cols * blockSize + (tpl.cols - 1) * gap;
  const h = tpl.rows * blockSize + (tpl.rows - 1) * gap;

  if (!mask) {
    return <div className={className} style={{ width: w, height: h }} aria-hidden />;
  }

  const CX = (tpl.cols - 1) / 2;
  const CY = (tpl.rows - 1) / 2;

  return (
    <div className={className} style={{ position: 'relative', width: w, height: h }}>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
        @keyframes pieceBlocksBreathe {
          0%, 100% { filter: brightness(0.9) saturate(0.95); }
          50% { filter: brightness(1.5) saturate(1.2); }
        }
      ` }} />
      {mask.map((row, y) => row.map((filled, x) => {
        if (!filled) return null;
        const pal = palette ?? ROOKIE_PALETTE;
        const bandIdx = Math.min(pal.length - 1, Math.floor((y / tpl.rows) * pal.length));
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
  );
}
