/**
 * Move badges — chess.com-style per-classification corner badges for review
 * boards, plus the matching pill colors for move lists. ONE spec drives both
 * so the board and the list can never disagree.
 *
 * The badge renders as an inline SVG data-URI set as the square's
 * backgroundImage, positioned in the upper-right corner (~35% of the square).
 * Squares clip their contents, so the badge stays fully inside the square.
 */

import type { CSSProperties } from 'react';
import type { MoveClassification } from '@/lib/game-eval';

export interface BadgeSpec {
  /** Short glyph shown in the circle and the move-list pill ("??", "!", ...). */
  glyph: string;
  /** Human label ("Blunder", "Book move", ...). */
  label: string;
  /** Circle fill color. */
  circle: string;
  /** Glyph color inside the circle. */
  text: string;
  /** Soft square tint behind the destination square. */
  tint: string;
}

export const BADGE_SPECS: Record<MoveClassification, BadgeSpec> = {
  book: {
    glyph: 'B',
    label: 'Book move',
    circle: '#a1887f',
    text: '#ffffff',
    tint: 'rgba(161, 136, 127, 0.35)',
  },
  good: {
    glyph: '✓',
    label: 'Good move',
    circle: '#58a839',
    text: '#ffffff',
    tint: 'rgba(88, 168, 57, 0.30)',
  },
  forced: {
    glyph: '✓',
    label: 'Forced',
    circle: '#8a9199',
    text: '#ffffff',
    tint: 'rgba(138, 145, 153, 0.30)',
  },
  great: {
    glyph: '!',
    label: 'Great move',
    circle: '#10b981',
    text: '#ffffff',
    tint: 'rgba(16, 185, 129, 0.32)',
  },
  brilliant: {
    glyph: '!!',
    label: 'Brilliant',
    circle: '#06b6d4',
    text: '#ffffff',
    tint: 'rgba(6, 182, 212, 0.32)',
  },
  inaccuracy: {
    glyph: '?!',
    label: 'Inaccuracy',
    circle: '#eab308',
    text: '#42350a',
    tint: 'rgba(234, 179, 8, 0.35)',
  },
  mistake: {
    glyph: '?',
    label: 'Mistake',
    circle: '#f97316',
    text: '#ffffff',
    tint: 'rgba(249, 115, 22, 0.35)',
  },
  blunder: {
    glyph: '??',
    label: 'Blunder',
    circle: '#ef4444',
    text: '#ffffff',
    tint: 'rgba(239, 68, 68, 0.45)',
  },
  checkmate: {
    glyph: '#',
    label: 'Checkmate',
    circle: '#2e7d32',
    text: '#ffffff',
    tint: 'rgba(46, 125, 50, 0.38)',
  },
  // Ungradable (no trustworthy eval). Review surfaces skip rendering this
  // badge entirely — the spec exists so the Record stays total.
  unknown: {
    glyph: '·',
    label: 'Not evaluated',
    circle: '#b0b6bd',
    text: '#ffffff',
    tint: 'rgba(176, 182, 189, 0.20)',
  },
};

/** Open-book glyph (two filled pages) — text glyphs don't read as "book". */
const BOOK_PATH =
  '<path d="M15 11.2c-2-1.3-4.2-1.8-6.6-1.8-.5 0-.9.4-.9.9v10c0 .5.4.9.9.9 2.4 0 4.6.5 6.6 1.8zM17 11.2c2-1.3 4.2-1.8 6.6-1.8.5 0 .9.4.9.9v10c0 .5-.4.9-.9.9-2.4 0-4.6.5-6.6 1.8z" fill="#fff"/>';

function badgeSvg(spec: BadgeSpec, useBookGlyph: boolean): string {
  const inner = useBookGlyph
    ? BOOK_PATH
    : `<text x="16" y="21.5" font-family="Arial, sans-serif" font-size="${
        spec.glyph.length > 1 ? 13 : 16
      }" font-weight="bold" fill="${spec.text}" text-anchor="middle">${spec.glyph}</text>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<circle cx="16" cy="16" r="14.5" fill="${spec.circle}" stroke="#fff" stroke-width="1.6"/>` +
    inner +
    `</svg>`
  );
}

// Data-URIs built once at module load — cheap strings, no runtime encoding per render.
const BADGE_IMAGES: Record<MoveClassification, string> = Object.fromEntries(
  (Object.keys(BADGE_SPECS) as MoveClassification[]).map((cls) => [
    cls,
    `url("data:image/svg+xml,${encodeURIComponent(badgeSvg(BADGE_SPECS[cls], cls === 'book'))}")`,
  ]),
) as Record<MoveClassification, string>;

/**
 * squareStyles entry for a move's destination square: soft matching tint +
 * the circular badge in the upper-right corner. Longhand background props on
 * purpose — a `background` shorthand elsewhere in the style would wipe the
 * badge image.
 */
export function badgeSquareStyle(classification: MoveClassification): CSSProperties {
  const spec = BADGE_SPECS[classification];
  return {
    backgroundColor: spec.tint,
    backgroundImage: BADGE_IMAGES[classification],
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top 3% right 3%',
    backgroundSize: '35% 35%',
  };
}
