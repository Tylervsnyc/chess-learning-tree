/**
 * Cuts the chosen locker art (home-locker-v2-3.png) into animation layers
 * via gpt-image-1 edits:
 *   locker-base.png    — scene WITHOUT gloves + WITHOUT chalk tallies
 *   locker-gloves.png  — gloves only, transparent background
 *   locker-pieces.png  — chess pieces only, transparent background
 *
 * Chalk tallies are NOT art — they get drawn in code from the real streak.
 * Run: npx tsx scripts/generate-locker-layers.ts
 */
import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';

dotenv.config({ path: '.env.local' });
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error('No OPENAI_API_KEY in .env.local');
  process.exit(1);
}

const SRC = 'public/test-assets/home-locker-v2-3.png';

const JOBS: { out: string; prompt: string; transparent: boolean }[] = [
  {
    out: 'locker-base.png',
    transparent: false,
    prompt:
      'Edit this illustration: REMOVE the red boxing gloves and the straps hanging from the hook (keep the small hook itself), and REMOVE all white chalk tally marks from the open door on the left, leaving clean flat door metal there. Everything else must stay EXACTLY identical — same locker, same colors, same shelf, same chess board and pieces, same tape roll and red bottle, same lighting and style.',
  },
  {
    out: 'locker-gloves.png',
    transparent: true,
    prompt:
      'Extract ONLY the pair of red boxing gloves and the straps that hang them from the hook, exactly as they appear in this illustration — same position in frame, same scale, same angle, same style. Fully transparent background everywhere else. Do not include the hook, locker, shelf, or anything else.',
  },
  {
    out: 'locker-pieces.png',
    transparent: true,
    prompt:
      'Extract ONLY the chess pieces standing on the board (pawns, king, knight — not the board itself), exactly as they appear in this illustration — same positions in frame, same scale, same style. Fully transparent background everywhere else. Do not include the board, shelf, or anything else.',
  },
];

async function run(job: (typeof JOBS)[number]) {
  const form = new FormData();
  form.append('model', 'gpt-image-1');
  form.append('prompt', job.prompt);
  form.append('size', '1024x1536');
  form.append('quality', 'high');
  if (job.transparent) form.append('background', 'transparent');
  form.append('image', new Blob([new Uint8Array(readFileSync(SRC))], { type: 'image/png' }), 'src.png');
  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
  });
  if (!res.ok) {
    console.error(`FAILED ${job.out}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    return;
  }
  const json = (await res.json()) as { data: { b64_json: string }[] };
  writeFileSync(`public/test-assets/${job.out}`, Buffer.from(json.data[0].b64_json, 'base64'));
  console.log(`wrote public/test-assets/${job.out}`);
}

async function main() {
  for (const job of JOBS) await run(job);
  console.log('Done.');
}

main();
