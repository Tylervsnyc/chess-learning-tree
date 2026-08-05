/**
 * Generate the Chess Boxing iOS launch splash.
 *
 * `npx cap add ios` ships a STOCK CAPACITOR LOGO as the splash image (a blue
 * "X" on white). It sat in the app unreplaced through the first TestFlight
 * builds — the app launched showing Capacitor's branding. This replaces it
 * with our own: the G1 app icon centred on the same dark navy the web
 * NativeSplash uses, so the native splash hands off to the animated
 * BoxingLogoLoader with no colour flash between them.
 *
 *   npx tsx scripts/generate-chessboxing-splash.ts
 *
 * Writes all three Splash.imageset PNGs (Capacitor registers the same 2732px
 * square at 1x/2x/3x). NATIVE ASSET: takes effect only in a NEW iOS build —
 * a web deploy cannot change it.
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

/** Matches components/chessboxing/NativeSplash.tsx so the handoff is seamless. */
const BG = { r: 0x10, g: 0x1a, b: 0x33, alpha: 1 };

const CANVAS = 2732;
/** The launch image is scaled to fill, so keep the mark well inside the safe area. */
const LOGO = 760;

const ICON_SRC = join(process.cwd(), 'public/social/chessboxing-app-icon.png');
const OUT_DIR = join(process.cwd(), 'ios/App/App/Assets.xcassets/Splash.imageset');
const OUT_FILES = [
  'splash-2732x2732.png',
  'splash-2732x2732-1.png',
  'splash-2732x2732-2.png',
];

async function main() {
  const icon = readFileSync(ICON_SRC);

  // The icon art is a full-bleed square (iOS masks it on the home screen).
  // Round the corners here so it reads as a mark on the splash rather than a
  // pasted rectangle.
  const radius = Math.round(LOGO * 0.22);
  const mask = Buffer.from(
    `<svg width="${LOGO}" height="${LOGO}"><rect width="${LOGO}" height="${LOGO}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );

  const logo = await sharp(icon)
    .resize(LOGO, LOGO, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const splash = await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: BG },
  })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toBuffer();

  for (const name of OUT_FILES) {
    const out = join(OUT_DIR, name);
    await sharp(splash).toFile(out);
    console.log(`wrote ${out}`);
  }

  console.log(
    '\nNATIVE asset — rebuild the iOS app for this to show up:\n' +
      '  npm run ios:sync && (cd ios/App && fastlane ios beta)',
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
