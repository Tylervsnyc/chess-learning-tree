/**
 * Rook mark geometry — ONE definition of the brand rook shared by the native
 * iOS launch image (scripts/generate-chesspath-splash.ts) and the web splash
 * (components/brand/RookMark.tsx). Both draw exactly this, so the native →
 * web handoff on cold start is pixel-continuous instead of a logo swap.
 *
 * Units match public/brand/logo-stacked-*.svg: 14px blocks on an 18px cell.
 */
import { ROOK_BLOCKS, lighten, darken } from '@/lib/daily-rook-blocks';

export const ROOK_BLOCK = 14;
export const ROOK_CELL = 18;
export const ROOK_RADIUS = 2;
export const ROOK_COLS = 5;
export const ROOK_ROWS = 6;
/** viewBox size of the bare mark (no padding). */
export const ROOK_W = ROOK_COLS * ROOK_CELL - (ROOK_CELL - ROOK_BLOCK); // 86
export const ROOK_H = ROOK_ROWS * ROOK_CELL - (ROOK_CELL - ROOK_BLOCK); // 104

/**
 * Rook width as a fraction of the LONG side of the screen. The native launch
 * image is a 2732px square drawn scaleAspectFill, i.e. scaled by
 * max(screenW, screenH) / 2732 — so on screen the mark is exactly
 * ROOK_FRACTION * max(100vw, 100vh) wide. The web splash uses that same CSS.
 */
export const ROOK_FRACTION = 0.13;

/** Page blue behind both splashes. Must equal SplashScreen.backgroundColor. */
export const SPLASH_BG = '#eef6fc';

export const ROOK_COLORS = Array.from(new Set(ROOK_BLOCKS.map((b) => b.color)));

/** Same 4 stops as the logo SVGs / getMatteBackground. */
export function matteStops(hex: string): { offset: string; color: string }[] {
  return [
    { offset: '0%', color: lighten(hex, 18) },
    { offset: '20%', color: lighten(hex, 12) },
    { offset: '40%', color: hex },
    { offset: '100%', color: darken(hex, 12) },
  ];
}

export const gradientId = (hex: string) => `rm-${hex.slice(1)}`;

/** Standalone SVG markup of the mark — used by the native splash generator. */
export function rookMarkSvg(width: number): string {
  const height = Math.round((width * ROOK_H) / ROOK_W);
  const defs = ROOK_COLORS.map(
    (c) =>
      `<linearGradient id="${gradientId(c)}" x1="0" y1="0" x2="0" y2="1">` +
      matteStops(c).map((s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`).join('') +
      `</linearGradient>`,
  ).join('');
  const rects = ROOK_BLOCKS.map(
    (b) =>
      `<rect x="${b.x * ROOK_CELL}" y="${b.y * ROOK_CELL}" width="${ROOK_BLOCK}" height="${ROOK_BLOCK}" rx="${ROOK_RADIUS}" fill="url(#${gradientId(b.color)})"/>`,
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${ROOK_W} ${ROOK_H}"><defs>${defs}</defs>${rects}</svg>`;
}
