/**
 * Generate the Chess Path iOS launch splash: the bare rook mark on page blue,
 * drawn from lib/brand/rook-mark — the SAME geometry the web NativeSplash
 * paints on boot, so the native → web handoff is pixel-continuous (no logo
 * swap, no size jump, no wordmark popping in and out).
 *
 *   npx tsx scripts/generate-chesspath-splash.ts
 *
 * Writes all three Splash.imageset PNGs (same 2732px square at 1x/2x/3x).
 * NATIVE ASSET: takes effect only in a NEW iOS build — a web deploy cannot
 * change it.
 */
import sharp from 'sharp';
import { join } from 'path';
import { rookMarkSvg, ROOK_FRACTION, SPLASH_BG } from '../lib/brand/rook-mark';

const CANVAS = 2732;
const OUT_DIR = join(process.cwd(), 'ios-chesspath/App/App/Assets.xcassets/Splash.imageset');
const OUT_FILES = ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png'];

async function main() {
  const width = Math.round(CANVAS * ROOK_FRACTION);
  const mark = await sharp(Buffer.from(rookMarkSvg(width))).png().toBuffer();
  const splash = await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: SPLASH_BG },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toBuffer();
  for (const name of OUT_FILES) {
    await sharp(splash).toFile(join(OUT_DIR, name));
    console.log(`wrote ${name} (rook ${width}px on ${CANVAS}px, bg ${SPLASH_BG})`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
