/**
 * Locker v2: renders the hand-built vector locker scene to PNG, then has
 * gpt-image-1 REDRAW it (images/edits with the reference) — same composition,
 * palette, and flat app style, but with much richer detail and polish.
 *
 * Output: public/test-assets/home-locker-v2-{1..3}.png
 * Run: npx tsx scripts/generate-locker-v2.ts
 */
import dotenv from 'dotenv';
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';

dotenv.config({ path: '.env.local' });
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error('No OPENAI_API_KEY in .env.local');
  process.exit(1);
}

const RED = '#e5484d';

// The vector locker scene (door open, tally marks visible), as raw SVG.
// Mirrors AnimatedLocker in app/test/chessboxing-home/page.tsx.
function glove(x: number, y: number, s: number, angle: number): string {
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${s / 100})">
    <rect x="-36" y="-88" width="72" height="68" rx="32" fill="${RED}"/>
    <ellipse cx="32" cy="-38" rx="16" ry="21" fill="${RED}"/>
    <path d="M -24 -74 Q 0 -87 24 -74" stroke="rgba(0,0,0,0.2)" stroke-width="6" fill="none" stroke-linecap="round"/>
    <rect x="-22" y="-24" width="44" height="24" rx="8" fill="#f4f6fb"/>
  </g>`;
}

const boardSq = 88 / 4;
const boardSquares = Array.from({ length: 8 }, (_, i) => {
  const cx = i % 4;
  const cy = Math.floor(i / 4);
  return `<rect x="${56 + cx * boardSq}" y="${172 + cy * boardSq * 0.62}" width="${boardSq}" height="${boardSq * 0.62}" fill="${(cx + cy) % 2 === 0 ? '#b58863' : '#f0d9b5'}"/>`;
}).join('');

const piece = (px: number, dark: boolean) => `
  <ellipse cx="${56 + px * boardSq}" cy="171" rx="2.6" ry="1.2" fill="${dark ? '#22293a' : '#e8e4da'}"/>
  <rect x="${56 + px * boardSq - 1.6}" y="163" width="3.2" height="8.5" rx="1.4" fill="${dark ? '#22293a' : '#e8e4da'}"/>
  <circle cx="${56 + px * boardSq}" cy="162" r="2" fill="${dark ? '#22293a' : '#e8e4da'}"/>`;

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1040" viewBox="0 0 200 260">
  <rect width="200" height="260" fill="#232c42"/>
  <rect width="200" height="70" fill="#1c2438"/>
  <rect x="30" y="20" width="140" height="228" rx="6" fill="#3c4a6b"/>
  <rect x="30" y="20" width="140" height="228" rx="6" fill="none" stroke="#2a3552" stroke-width="3"/>
  <rect x="6" y="24" width="26" height="220" rx="4" fill="#465579"/>
  <g stroke="#c9d4ea" stroke-width="1.4" stroke-linecap="round" opacity="0.85">
    <line x1="12" y1="44" x2="12" y2="58"/><line x1="16" y1="44" x2="16" y2="58"/>
    <line x1="20" y1="44" x2="20" y2="58"/><line x1="24" y1="44" x2="24" y2="58"/>
    <line x1="10" y1="58" x2="26" y2="44"/>
    <line x1="12" y1="70" x2="12" y2="84"/><line x1="16" y1="70" x2="16" y2="84"/>
  </g>
  <rect x="85" y="34" width="30" height="3" rx="1.5" fill="#2a3552"/>
  <rect x="85" y="41" width="30" height="3" rx="1.5" fill="#2a3552"/>
  <rect x="85" y="48" width="30" height="3" rx="1.5" fill="#2a3552"/>
  <rect x="36" y="140" width="128" height="5" fill="#2a3552"/>
  <circle cx="100" cy="62" r="3" fill="#8d99b5"/>
  <line x1="100" y1="62" x2="92" y2="78" stroke="#8d99b5" stroke-width="2"/>
  <line x1="100" y1="62" x2="108" y2="78" stroke="#8d99b5" stroke-width="2"/>
  ${glove(88, 128, 52, -8)}
  ${glove(112, 130, 52, 10)}
  <rect x="54" y="170" width="92" height="59" rx="2" fill="#6b4a2f"/>
  ${boardSquares}
  ${piece(0.6, false)}
  ${piece(1.8, true)}
  ${piece(3.1, false)}
  <ellipse cx="58" cy="240" rx="13" ry="5" fill="#e8e4da"/>
  <ellipse cx="58" cy="236" rx="9" ry="3.5" fill="#d6d0c2"/>
  <rect x="140" y="230" width="9" height="16" rx="3" fill="${RED}"/>
</svg>`;

const PROMPT =
  'Redraw this reference image as a polished, professional flat illustration. Keep EXACTLY the same composition, framing, objects and color palette: an open navy-blue gym locker, red boxing gloves hanging from a hook in the upper half, a wooden chess board with a few standing pieces on the shelf below, white hand wraps and a red water bottle at the bottom, tally marks scratched into the open door on the left. ' +
  'Same friendly bold app-illustration style (flat shapes, minimal outlines, matte colors, soft simple shading) but MUCH more refined: proper boxing glove shapes with laces and stitching, real chess piece silhouettes (king, knight, pawn), metal texture hints on the locker, believable proportions, crisp details. ' +
  'Bright enough for a mobile app home screen — NOT dark or moody, NOT photorealistic, NOT 3D. No text, no people, portrait orientation.';

async function main() {
  mkdirSync('public/test-assets', { recursive: true });
  const refPng = await sharp(Buffer.from(SVG)).png().toBuffer();
  writeFileSync('public/test-assets/home-locker-v2-ref.png', refPng);
  console.log('reference written (home-locker-v2-ref.png)');

  for (let i = 1; i <= 3; i++) {
    const form = new FormData();
    form.append('model', 'gpt-image-1');
    form.append('prompt', PROMPT);
    form.append('size', '1024x1536');
    form.append('quality', 'high');
    form.append('image', new Blob([new Uint8Array(refPng)], { type: 'image/png' }), 'ref.png');
    const res = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}` },
      body: form,
    });
    if (!res.ok) {
      console.error(`FAILED v2-${i}: ${res.status} ${(await res.text()).slice(0, 300)}`);
      continue;
    }
    const json = (await res.json()) as { data: { b64_json: string }[] };
    writeFileSync(`public/test-assets/home-locker-v2-${i}.png`, Buffer.from(json.data[0].b64_json, 'base64'));
    console.log(`wrote public/test-assets/home-locker-v2-${i}.png`);
  }
  console.log('Done.');
}

main();
