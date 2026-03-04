#!/usr/bin/env node
/**
 * One-off script: Render updated SVG icons to PNG at various sizes.
 * Uses sharp (Next.js dependency) for SVG→PNG conversion.
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const brandDir = join(process.cwd(), 'public/brand');
const iconSvg = readFileSync(join(brandDir, 'icon-96.svg'));

// Standard icons — just resize the SVG
async function renderIcon(size, filename) {
  await sharp(iconSvg, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(join(brandDir, filename));
  console.log(`Rendered: ${filename} (${size}x${size})`);
}

// Maskable icons — icon centered on brand background with safe-zone padding
// PWA safe zone = inner 80%, so icon should be ~64% of total size (80%×80%)
async function renderMaskable(size, filename) {
  const iconSize = Math.round(size * 0.64);
  const padding = Math.round((size - iconSize) / 2);

  const resizedIcon = await sharp(iconSvg, { density: 300 })
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 38, g: 58, b: 66, alpha: 1 }, // #263A42 brand dark
    },
  })
    .composite([{ input: resizedIcon, left: padding, top: padding }])
    .png()
    .toFile(join(brandDir, filename));
  console.log(`Rendered: ${filename} (${size}x${size}, maskable)`);
}

async function main() {
  await Promise.all([
    renderIcon(192, 'icon-192.png'),
    renderIcon(512, 'icon-512.png'),
    renderMaskable(192, 'icon-maskable-192.png'),
    renderMaskable(512, 'icon-maskable-512.png'),
    // Apple touch icon — 180x180 with slight padding like maskable
    renderMaskable(180, 'apple-touch-icon.png'),
  ]);
  console.log('\nDone! All 5 PNGs rendered with matte gradients.');
}

main().catch(console.error);
