/**
 * Renders the Chess Boxing app icon ("G1": BreathingRook center ring,
 * 4×4 chessboard canvas, red ropes, 4 corner pads) at 1024×1024 and
 * writes it into the iOS asset catalog.
 *
 * Full-bleed square, no rounded corners — iOS applies the squircle mask.
 * Run: npx tsx scripts/generate-chessboxing-icon.ts
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { ROOK_BLOCKS, lighten, darken } from '../lib/daily-rook-blocks';

const NAVY = '#1b2a4a';
const NAVY_DEEP = '#101a33';
const ROPE_RED = '#e5484d';
const SQ_DARK = '#28375f';

// All geometry in the same 0–100 space as the test page, scaled to 1024.
const S = 1024 / 100;
const n = (v: number) => (v * S).toFixed(2);

const cell = 9.5;
const gap = cell * 0.15;
const step = cell + gap;
const rookW = 5 * cell + 4 * gap;
const rookH = 6 * cell + 5 * gap;
const rookX = (100 - rookW) / 2;
const rookY = (100 - rookH) / 2;

const gradients = Array.from(new Set(ROOK_BLOCKS.map((b) => b.color)))
  .map(
    (c) => `<linearGradient id="g${c.slice(1)}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${lighten(c, 18)}"/>
      <stop offset="20%" stop-color="${lighten(c, 12)}"/>
      <stop offset="40%" stop-color="${c}"/>
      <stop offset="100%" stop-color="${darken(c, 12)}"/>
    </linearGradient>`
  )
  .join('\n');

const boardSq = 76 / 4;
const board = Array.from({ length: 16 }, (_, i) => {
  const cx = i % 4;
  const cy = Math.floor(i / 4);
  const fill = (cx + cy) % 2 === 0 ? SQ_DARK : NAVY;
  return `<rect x="${n(12 + cx * boardSq)}" y="${n(12 + cy * boardSq)}" width="${n(boardSq)}" height="${n(boardSq)}" fill="${fill}"/>`;
}).join('\n');

const corners = [[9, 9], [91, 9], [9, 91], [91, 91]]
  .map(
    ([cx, cy]) =>
      `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(6.5)}" fill="${ROPE_RED}" stroke="${NAVY_DEEP}" stroke-width="${n(1.8)}"/>`
  )
  .join('\n');

const rook = ROOK_BLOCKS.map(
  (b) =>
    `<rect x="${n(rookX + b.x * step)}" y="${n(rookY + b.y * step)}" width="${n(cell)}" height="${n(cell)}" rx="${n(cell * 0.14)}" fill="url(#g${b.color.slice(1)})"/>`
).join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>${gradients}</defs>
  <rect width="1024" height="1024" fill="${NAVY_DEEP}"/>
  ${board}
  <rect x="${n(9)}" y="${n(9)}" width="${n(82)}" height="${n(82)}" rx="${n(9)}" fill="none" stroke="${ROPE_RED}" stroke-width="${n(4.5)}"/>
  ${corners}
  ${rook}
</svg>`;

async function main() {
  const out = 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png';
  // App Store icons must be opaque — flatten removes any alpha.
  await sharp(Buffer.from(svg)).flatten({ background: NAVY_DEEP }).png().toFile(out);
  writeFileSync('public/social/chessboxing-app-icon.png', await sharp(Buffer.from(svg)).png().toBuffer());
  console.log(`Wrote ${out} (1024x1024, opaque) + public/social/chessboxing-app-icon.png`);
}

main();
