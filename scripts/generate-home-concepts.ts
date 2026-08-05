/**
 * Generates Chess Boxing home-screen concept art via OpenAI image gen
 * (gpt-image-1): 2 scenes (locker, corner) x 3 styles (flat, render3d,
 * realistic) -> public/test-assets/home-<scene>-<style>.png
 *
 * Requires OPENAI_API_KEY in .env.local.
 * Run: npx tsx scripts/generate-home-concepts.ts
 * View: /test/chessboxing-home
 */
import dotenv from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';

dotenv.config({ path: '.env.local' });

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error('No OPENAI_API_KEY in .env.local — add one, then rerun.');
  process.exit(1);
}

const SCENES: Record<string, string> = {
  locker:
    'An open boxing gym locker, viewed straight on, portrait orientation, mobile app home screen. ' +
    'Inside the locker: a pair of red boxing gloves hanging from a hook in the upper half, and a small wooden chess set with a few pieces standing on a shelf in the lower half. ' +
    'Tally marks scratched into the open locker door. Hand wraps and a red water bottle at the bottom. ' +
    'Dark navy blue color palette (#1b2a4a background tones) with red accents. Clean composition with two clear focal objects (gloves and chess set), generous negative space, no text, no people.',
  corner:
    'The corner of a boxing ring viewed from inside the ring, portrait orientation, mobile app home screen. ' +
    'A red corner post with ropes running off to both sides. On the canvas floor: a wooden corner stool with a pair of red boxing gloves resting on it, and next to it an upturned bucket with a small wooden chess board propped against it, pieces set up. ' +
    'Dark moody arena in the background, spotlight falling on the corner. Dark navy blue palette (#1b2a4a tones) with red accents. Two clear focal objects (gloves on stool, chess board on bucket), generous negative space, no text, no people.',
};

const STYLES: Record<string, string> = {
  flat:
    'Bold graphic illustration, confident flat shapes with strong lighting and shadow, moody premium sports-brand energy (Nike Training / EA Sports UI art). Sharp, adult, atmospheric — NOT cute, NOT cartoonish, no rounded toy proportions.',
  render3d:
    'Stylized 3D render with matte materials and realistic proportions, dramatic single-source lighting, dark cinematic mood. Serious modern game-art look (a AAA game menu screen), sleek and premium — NOT clay-like, NOT toy-like, NOT cute.',
  realistic:
    'Realistic digital painting, gritty boxing-gym atmosphere, worn leather and scratched metal textures, dramatic cinematic lighting, film grain. Grounded and moody, adult sports aesthetic.',
};

async function gen(scene: string, style: string): Promise<void> {
  const name = `home-${scene}-${style}.png`;
  const prompt = `${SCENES[scene]} ${STYLES[style]}`;
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1024x1536', quality: 'medium' }),
  });
  if (!res.ok) {
    console.error(`FAILED ${name}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    return;
  }
  const json = (await res.json()) as { data: { b64_json: string }[] };
  writeFileSync(`public/test-assets/${name}`, Buffer.from(json.data[0].b64_json, 'base64'));
  console.log(`wrote public/test-assets/${name}`);
}

async function main() {
  mkdirSync('public/test-assets', { recursive: true });
  // sequential to stay well inside rate limits
  for (const scene of Object.keys(SCENES)) {
    for (const style of Object.keys(STYLES)) {
      await gen(scene, style);
    }
  }
  console.log('Done. View at /test/chessboxing-home');
}

main();
