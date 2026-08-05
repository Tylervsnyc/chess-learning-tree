/**
 * Assets for the locker chess chase:
 *  1. locker-nopieces-raw.png — GPT edit of the base with chess pieces removed
 *     (patched locally afterward by extract-locker-board.ts)
 *  2. piece sprites (white king, black bishop, black knight) in the same flat
 *     style, rendered on solid magenta -> chroma-keyed to transparent locally
 *
 * Run: npx tsx scripts/generate-chase-assets.ts
 */
import dotenv from 'dotenv';
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';

dotenv.config({ path: '.env.local' });
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error('No OPENAI_API_KEY');
  process.exit(1);
}

async function removePieces() {
  const form = new FormData();
  form.append('model', 'gpt-image-1');
  form.append(
    'prompt',
    'Edit this illustration: REMOVE all four chess pieces standing on the wooden chess board, leaving the checkered board surface empty and complete (fill in the squares where the pieces stood). Everything else must stay EXACTLY identical — same locker, same colors, same board position and angle, same tape roll and red bottle, same style.'
  );
  form.append('size', '1024x1536');
  form.append('quality', 'high');
  form.append('image', new Blob([new Uint8Array(readFileSync('public/test-assets/locker-base-patched.png'))], { type: 'image/png' }), 'src.png');
  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST', headers: { Authorization: `Bearer ${KEY}` }, body: form,
  });
  if (!res.ok) { console.error(`FAILED nopieces: ${res.status} ${(await res.text()).slice(0, 200)}`); return; }
  const json = (await res.json()) as { data: { b64_json: string }[] };
  writeFileSync('public/test-assets/locker-nopieces-raw.png', Buffer.from(json.data[0].b64_json, 'base64'));
  console.log('wrote locker-nopieces-raw.png');
}

const PIECES: { name: string; desc: string }[] = [
  { name: 'wk', desc: 'a WHITE (cream colored) chess KING' },
  { name: 'bb', desc: 'a BLACK (very dark navy, almost black) chess BISHOP' },
  { name: 'bn', desc: 'a BLACK (very dark navy, almost black) chess KNIGHT facing left' },
];

async function genPiece(p: (typeof PIECES)[number]) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt:
        `A single Staunton chess piece: ${p.desc}. Flat vector illustration style with soft simple shading, subtle outline, matte colors — the piece looks like it belongs in a polished flat-illustration mobile game (cream #ead9b8 whites, dark navy #22293a blacks). ` +
        'Centered, viewed straight on with a very slight downward angle, standing upright. The ENTIRE background is solid pure magenta (#FF00FF) with no gradients, no shadow on the background, no floor. The piece must not contain any magenta.',
      size: '1024x1536',
      quality: 'medium',
    }),
  });
  if (!res.ok) { console.error(`FAILED ${p.name}: ${res.status} ${(await res.text()).slice(0, 200)}`); return; }
  const json = (await res.json()) as { data: { b64_json: string }[] };
  const raw = Buffer.from(json.data[0].b64_json, 'base64');

  // chroma-key magenta -> transparent, then trim
  const { data, info } = await sharp(raw).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < info.width * info.height; i++) {
    const p4 = i * 4;
    const r = data[p4], g = data[p4 + 1], b = data[p4 + 2];
    // magenta-ish: red+blue high, green low
    if (r > 150 && b > 150 && g < 110 && Math.abs(r - b) < 90) data[p4 + 3] = 0;
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png()
    .toFile(`public/test-assets/chase-${p.name}.png`);
  console.log(`wrote chase-${p.name}.png`);
}

async function main() {
  await removePieces();
  for (const p of PIECES) await genPiece(p);
  console.log('Done.');
}

main();
