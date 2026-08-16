/**
 * Generate the Rookies Run iOS app icon and launch splash.
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
 * The art is Rookie herself — the breathing rook, frozen. Geometry and shading
 * mirror components/ui/BreathingRook.tsx exactly (gap = 0.15×block, radius =
 * 0.14×block, the getMatteBackground gradient, and the same inset top/bottom
 * edges), so the icon is the character players see on the board rather than a
 * lookalike. Rendered as SVG through sharp: no browser, no binary source art
 * to keep in sync.
 *
 * If BreathingRook's styling changes, change it here too and re-run.
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

/** Block size per output, chosen so the rook sits comfortably inside the canvas. */
const ICON = { canvas: 1024, block: 118 };
/** The launch image is scaleAspectFill, so keep the mark well inside the safe area. */
const SPLASH = { canvas: 2732, block: 112 };

const ICON_DIR = join(process.cwd(), 'ios/App/App/Assets.xcassets/AppIcon.appiconset');
const SPLASH_DIR = join(process.cwd(), 'ios/App/App/Assets.xcassets/Splash.imageset');
const SPLASH_FILES = [
  'splash-2732x2732.png',
  'splash-2732x2732-1.png',
  'splash-2732x2732-2.png',
];

/**
 * One rook block, styled the way BreathingRook styles it:
 *  - background: getMatteBackground(color) — a 4-stop vertical gradient
 *  - box-shadow: inset dark line along the top, light line along the bottom
 */
function blockSvg(px: number, py: number, size: number, radius: number, edge: number, id: string, color: string) {
  const inner = size - edge * 2;
  return (
    `<rect x="${px}" y="${py}" width="${size}" height="${size}" rx="${radius}" fill="url(#${id})"/>` +
    // inset 0 +Npx 0 rgba(0,0,0,0.15)
    `<rect x="${px + edge}" y="${py}" width="${inner}" height="${edge}" fill="#000" opacity="0.15"/>` +
    // inset 0 -Npx 0 rgba(255,255,255,0.15)
    `<rect x="${px + edge}" y="${py + size - edge}" width="${inner}" height="${edge}" fill="#fff" opacity="0.15"/>`
  );
}

function rookSvg(canvas: number, block: number): string {
  // Mirrors BreathingRook's derivation exactly.
  const gap = Math.max(1, Math.round(block * 0.15));
  const radius = Math.max(1, Math.round(block * 0.14));
  const scale = block / 14;
  const edge = Math.max(1, +(0.75 * scale).toFixed(2));

  const gridW = GRID_COLS * block + (GRID_COLS - 1) * gap;
  const gridH = GRID_ROWS * block + (GRID_ROWS - 1) * gap;
  const originX = (canvas - gridW) / 2;
  const originY = (canvas - gridH) / 2;

  const gradients: string[] = [];
  const cells: string[] = [];

  ROOK_BLOCKS.forEach(({ x, y, color }, i) => {
    const id = `m${i}`;
    // getMatteBackground: lighten 18 → lighten 12 (20%) → base (40%) → darken 12
    gradients.push(
      `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0%" stop-color="${lighten(color, 18)}"/>` +
        `<stop offset="20%" stop-color="${lighten(color, 12)}"/>` +
        `<stop offset="40%" stop-color="${color}"/>` +
        `<stop offset="100%" stop-color="${darken(color, 12)}"/>` +
      `</linearGradient>`
    );
    cells.push(
      blockSvg(originX + x * (block + gap), originY + y * (block + gap), block, radius, edge, id, color)
    );
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}">
  <defs>${gradients.join('')}</defs>
  <rect width="${canvas}" height="${canvas}" fill="${BG}"/>
  ${cells.join('')}
</svg>`;
}

async function render(canvas: number, block: number): Promise<Buffer> {
  return sharp(Buffer.from(rookSvg(canvas, block)))
    // App Store Connect rejects icons with an alpha channel; flattening onto
    // BG also guarantees the splash has no transparent edges.
    .flatten({ background: BG })
    .png()
    .toBuffer();
}

async function main() {
  mkdirSync(ICON_DIR, { recursive: true });
  mkdirSync(SPLASH_DIR, { recursive: true });

  const icon = await render(ICON.canvas, ICON.block);
  writeFileSync(join(ICON_DIR, 'AppIcon-512@2x.png'), icon);
  console.log(`icon    ${ICON.canvas}²  block=${ICON.block}  ${(icon.length / 1024).toFixed(0)}KB`);

  const splash = await render(SPLASH.canvas, SPLASH.block);
  for (const name of SPLASH_FILES) {
    writeFileSync(join(SPLASH_DIR, name), splash);
    console.log(`splash  ${SPLASH.canvas}²  block=${SPLASH.block}  ${(splash.length / 1024).toFixed(0)}KB  ${name}`);
  }

  console.log(`\nBackground ${BG}. Rebuild the iOS app for these to take effect.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
