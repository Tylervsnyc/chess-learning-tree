/**
 * Build App Store screenshots (6.9" iPhone, 1320x2868) from raw device grabs.
 *
 * Raw phone screenshots are 1179x2556 (iPhone 16 Pro). Rather than upscale them
 * to fill the 6.9" slot, each one is composited onto a branded 1320x2868 canvas:
 * headline on top, the screen below, bleeding off the bottom edge. That both
 * hits Apple's required size and crops away the phone status bar (which carried
 * a screen-recording dot and a low battery indicator).
 *
 * Usage: npx tsx scripts/build-appstore-screenshots.ts
 * Output: out/appstore/NN-name.png
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const W = 1320;
const H = 2868;

// Brand — matches the app icon / locker palette.
const NAVY = '#101a33';
const RED = '#e5484d';

const SRC = '/private/tmp/claude-502/-Users-tyler-schwartz-chess-learning-tree/186a33d5-41b1-4d64-a7da-8c9fbc8e2fe0/scratchpad/shots';
const OUT = join(process.cwd(), 'out', 'appstore');

type Shot = {
  file: string;
  out: string;
  headline: string;
  sub: string;
  /** Fraction of the source height to crop off the top (status bar etc). */
  cropTop: number;
};

const SHOTS: Shot[] = [
  {
    file: 'raw-home.png',
    out: '01-home',
    headline: 'The chess\nboxing trainer.',
    sub: 'Alternating rounds of chess and conditioning.',
    cropTop: 0.075,
  },
  {
    file: 'raw-bout-live.png',
    out: '02-bout-live',
    headline: 'One game, frozen\nat every bell.',
    sub: 'Your clock runs. Flag and you lose, for real.',
    cropTop: 0.055,
  },
  {
    file: 'raw-bout-setup.png',
    out: '03-bout-setup',
    headline: 'Three chess rounds.\nTwo of gloves.',
    sub: 'Spar for 11 minutes, or go 43 for a championship.',
    cropTop: 0.055,
  },
  {
    file: 'raw-puzzles.png',
    out: '04-puzzles',
    headline: 'Calculate while\nyou are gassed.',
    sub: 'Tactics rounds against the same bout clock.',
    cropTop: 0.055,
  },
  {
    file: 'raw-quadrant.png',
    out: '05-quadrant',
    headline: 'Your camera\ncounts the punches.',
    sub: 'Quadrant Fight. Optional, and on-device.',
    cropTop: 0.055,
  },
];

/** Escape text for safe inclusion in SVG. */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function headerSvg(headline: string, sub: string): Buffer {
  const lines = headline.split('\n');
  const tspans = lines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 104}">${esc(l)}</tspan>`)
    .join('');
  return Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="${NAVY}"/>
      <rect x="80" y="128" width="96" height="10" rx="5" fill="${RED}"/>
      <text x="80" y="250" font-family="DM Sans, Helvetica Neue, Arial, sans-serif"
            font-size="88" font-weight="700" fill="#ffffff">${tspans}</text>
      <text x="80" y="${250 + (lines.length - 1) * 104 + 82}"
            font-family="DM Sans, Helvetica Neue, Arial, sans-serif"
            font-size="42" font-weight="400" fill="#9fb0d0">${esc(sub)}</text>
    </svg>
  `);
}

async function build(shot: Shot) {
  const src = join(SRC, shot.file);
  const meta = await sharp(src).metadata();
  const sw = meta.width!;
  const sh = meta.height!;

  // Crop the status bar off the top, then scale to the inset width.
  const cropPx = Math.round(sh * shot.cropTop);
  const insetW = W - 160; // 80px gutter each side
  const phone = await sharp(src)
    .extract({ left: 0, top: cropPx, width: sw, height: sh - cropPx })
    .resize({ width: insetW })
    .png()
    .toBuffer();

  const pm = await sharp(phone).metadata();

  // Rounded corners on the screen image.
  const r = 44;
  const mask = Buffer.from(
    `<svg width="${pm.width}" height="${pm.height}">
       <rect width="${pm.width}" height="${pm.height}" rx="${r}" ry="${r}" fill="#fff"/>
     </svg>`
  );
  const rounded = await sharp(phone)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const top = 560; // below the headline block; image bleeds off the bottom

  await sharp(headerSvg(shot.headline, shot.sub))
    .composite([{ input: rounded, left: 80, top }])
    .png()
    .toFile(join(OUT, `${shot.out}.png`));

  console.log(`  ${shot.out}.png  ${W}x${H}`);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  console.log('Building App Store screenshots (6.9", 1320x2868):');
  for (const s of SHOTS) await build(s);
  console.log(`\nDone → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
