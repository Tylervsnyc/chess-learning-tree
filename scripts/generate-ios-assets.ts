/**
 * Generate the Rookie's Run iOS app icon and launch splash.
 *
 * `npx cap add ios` ships a STOCK CAPACITOR LOGO for both. In Chess Path that
 * placeholder survived into shipped TestFlight builds — the app launched
 * showing Capacitor's branding. This script exists so that can't happen here.
 *
 *   npm run ios:assets
 *
 * Writes:
 *   ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png  (1024²)
 *   ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732*.png  (2732², x3)
 *
 * The art is the pixel rook from lib/daily-rook-blocks.ts — the same shape
 * BreathingRook and RookiesRunLogo draw — rendered to SVG and rasterised, so
 * there's no binary source asset to keep in sync and no browser needed.
 *
 * NATIVE ASSETS: these take effect only in a NEW iOS build. A web deploy
 * cannot change them.
 */

import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ROOK_BLOCKS, darken, lighten } from '../lib/daily-rook-blocks';

/**
 * Must match components/run/NativeSplash.tsx SPLASH_BG,
 * capacitor.config.ts plugins.SplashScreen.backgroundColor,
 * the LaunchScreen.storyboard background, and app/layout.tsx themeColor.
 */
const BG = '#eef6fc';

const GRID_COLS = 5;
const GRID_ROWS = 6;

const ICON_PX = 1024;
const SPLASH_PX = 2732;
/** The launch image is scaleAspectFill, so keep the mark well inside the safe area. */
const SPLASH_ROOK_PX = 760;
/** iOS masks the icon's corners; leave room so the crown isn't clipped. */
const ICON_ROOK_PX = 720;

const ICON_DIR = join(process.cwd(), 'ios/App/App/Assets.xcassets/AppIcon.appiconset');
const SPLASH_DIR = join(process.cwd(), 'ios/App/App/Assets.xcassets/Splash.imageset');
const SPLASH_FILES = [
  'splash-2732x2732.png',
  'splash-2732x2732-1.png',
  'splash-2732x2732-2.png',
];

/**
 * Render the rook as an SVG sized to `rookPx` wide, centred on a `canvasPx`
 * square of BG. Blocks get the same matte treatment as the web components:
 * a light top edge, a dark bottom edge, and a soft drop shadow.
 */
function rookSvg(canvasPx: number, rookPx: number): string {
  const gap = rookPx * 0.03;
  const block = (rookPx - gap * (GRID_COLS - 1)) / GRID_COLS;
  const rookH = GRID_ROWS * block + (GRID_ROWS - 1) * gap;

  const originX = (canvasPx - rookPx) / 2;
  const originY = (canvasPx - rookH) / 2;
  const radius = block * 0.14;
  const edge = Math.max(1, block * 0.06);

  const cells = ROOK_BLOCKS.map(({ x, y, color }) => {
    const px = originX + x * (block + gap);
    const py = originY + y * (block + gap);
    return [
      // Base block.
      `<rect x="${px.toFixed(2)}" y="${py.toFixed(2)}" width="${block.toFixed(2)}" height="${block.toFixed(2)}" rx="${radius.toFixed(2)}" fill="${color}"/>`,
      // Lit top edge.
      `<rect x="${(px + edge).toFixed(2)}" y="${py.toFixed(2)}" width="${(block - edge * 2).toFixed(2)}" height="${edge.toFixed(2)}" rx="${(edge / 2).toFixed(2)}" fill="${lighten(color, 22)}"/>`,
      // Shaded bottom edge.
      `<rect x="${(px + edge).toFixed(2)}" y="${(py + block - edge).toFixed(2)}" width="${(block - edge * 2).toFixed(2)}" height="${edge.toFixed(2)}" rx="${(edge / 2).toFixed(2)}" fill="${darken(color, 14)}"/>`,
    ].join('');
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasPx}" height="${canvasPx}" viewBox="0 0 ${canvasPx} ${canvasPx}">
  <defs>
    <filter id="drop" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${(block * 0.06).toFixed(2)}" stdDeviation="${(block * 0.05).toFixed(2)}" flood-color="#000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="${canvasPx}" height="${canvasPx}" fill="${BG}"/>
  <g filter="url(#drop)">${cells}</g>
</svg>`;
}

async function render(canvasPx: number, rookPx: number): Promise<Buffer> {
  return sharp(Buffer.from(rookSvg(canvasPx, rookPx)))
    // App Store Connect rejects icons with an alpha channel; flattening onto
    // BG also guarantees the splash has no transparent edges.
    .flatten({ background: BG })
    .png()
    .toBuffer();
}

async function main() {
  mkdirSync(ICON_DIR, { recursive: true });
  mkdirSync(SPLASH_DIR, { recursive: true });

  const icon = await render(ICON_PX, ICON_ROOK_PX);
  writeFileSync(join(ICON_DIR, 'AppIcon-512@2x.png'), icon);
  console.log(`icon    ${ICON_PX}x${ICON_PX}  ${(icon.length / 1024).toFixed(0)}KB`);

  const splash = await render(SPLASH_PX, SPLASH_ROOK_PX);
  for (const name of SPLASH_FILES) {
    writeFileSync(join(SPLASH_DIR, name), splash);
    console.log(`splash  ${SPLASH_PX}x${SPLASH_PX}  ${(splash.length / 1024).toFixed(0)}KB  ${name}`);
  }

  console.log(`\nBackground ${BG}. Rebuild the iOS app for these to take effect.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
