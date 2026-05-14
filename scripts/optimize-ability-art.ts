// Resize + convert ability art to WebP for fast in-app loads.
// Source PNGs are 1024x1024 / ~1.5MB; output is 512x512 WebP / ~40-80KB.
// Run: npx tsx scripts/optimize-ability-art.ts

import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const DIR = join(process.cwd(), 'public', 'abilities');

async function main() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith('.png'));
  for (const f of files) {
    const src = join(DIR, f);
    const dst = join(DIR, f.replace(/\.png$/, '.webp'));
    await sharp(src)
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 82 })
      .toFile(dst);
    console.log(`  ${f} -> ${dst.split('/').pop()}`);
  }
  console.log('Done.');
}

main();
