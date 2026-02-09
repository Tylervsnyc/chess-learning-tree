/**
 * Generate PWA icons from the SVG source.
 * Run: node scripts/generate-pwa-icons.mjs
 * Requires: npm install sharp (already a devDependency)
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';

const inputSvg = readFileSync('public/brand/icon-96.svg');

// Extract the inner SVG content (rects only, no wrapping <svg> tags)
const innerContent = inputSvg
  .toString()
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>/, '')
  .trim();

// Regular icons — just resize the SVG
async function generateRegularIcon(size, outputPath) {
  await sharp(inputSvg, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(outputPath);
  console.log(`  ✓ ${outputPath} (${size}x${size})`);
}

// Maskable icons — solid background + icon in inner 80% safe zone
async function generateMaskableIcon(size, outputPath) {
  const padding = Math.round(size * 0.1);
  const iconSize = size - padding * 2;

  const maskableSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#eef6fc"/>
    <svg x="${padding}" y="${padding}" width="${iconSize}" height="${iconSize}" viewBox="0 0 96 96">
      ${innerContent}
    </svg>
  </svg>`;

  await sharp(Buffer.from(maskableSvg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  console.log(`  ✓ ${outputPath} (${size}x${size} maskable)`);
}

// Apple touch icon — 180x180 with background for rounded corners
async function generateAppleTouchIcon() {
  const size = 180;
  const padding = Math.round(size * 0.1);
  const iconSize = size - padding * 2;

  const appleSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#eef6fc"/>
    <svg x="${padding}" y="${padding}" width="${iconSize}" height="${iconSize}" viewBox="0 0 96 96">
      ${innerContent}
    </svg>
  </svg>`;

  await sharp(Buffer.from(appleSvg))
    .resize(size, size)
    .png()
    .toFile('public/brand/apple-touch-icon.png');
  console.log(`  ✓ public/brand/apple-touch-icon.png (${size}x${size})`);
}

console.log('Generating PWA icons...');

await Promise.all([
  generateRegularIcon(192, 'public/brand/icon-192.png'),
  generateRegularIcon(512, 'public/brand/icon-512.png'),
  generateMaskableIcon(192, 'public/brand/icon-maskable-192.png'),
  generateMaskableIcon(512, 'public/brand/icon-maskable-512.png'),
  generateAppleTouchIcon(),
]);

console.log('\nDone! All PWA icons generated.');
