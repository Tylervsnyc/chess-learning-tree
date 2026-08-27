/**
 * Builds email-safe copies of the Chess Boxing art into public/email/boxing/.
 *
 * WHY THIS EXISTS: the app's boxing art is all .webp, and Outlook on Windows
 * (the Word rendering engine) cannot display WebP at all — those recipients get
 * a broken frame where the art should be. Email also can't rely on alpha
 * compositing, so every sprite is flattened onto the exact surface colour it
 * sits on in the template.
 *
 * Sprites -> PNG (flat colour, crisp edges). Photos -> JPEG (much smaller).
 * Everything is emitted at 2x its rendered width so it stays sharp on retina.
 *
 *   npx tsx scripts/build-email-assets.ts
 *
 * Re-run this whenever the source art changes, and commit the output — the
 * templates reference these files by absolute prod URL.
 */
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'public/email/boxing');

/** The two surfaces a sprite can sit on. Must match BoxingEmailLayout. */
const CREAM = { r: 0xf3, g: 0xe9, b: 0xd2 };
const NAVY = { r: 0x13, g: 0x1a, b: 0x2e };

interface Job {
  src: string;
  out: string;
  /** Rendered width in the email; the file is written at 2x this. */
  width: number;
  on?: 'cream' | 'navy';
  /** Trim surrounding transparency before resizing (sprites with big margins). */
  trim?: boolean;
  format?: 'png' | 'jpeg';
}

const JOBS: Job[] = [
  // --- identity ---
  { src: 'social/chessboxing-app-icon.png', out: 'icon', width: 96, on: 'navy' },
  { src: 'boxing/gym/sign-no-tomorrow.webp', out: 'sign', width: 260, on: 'cream' },

  // --- painted sprites (vintage enamel) ---
  // Only what a template actually references. The gym has more art
  // (heavybag, the chess pieces, blue-corner); add a JOB when an email needs
  // one rather than committing sprites nothing points at.
  { src: 'boxing/locker/gloves.webp', out: 'gloves', width: 150, on: 'cream', trim: true },
  { src: 'boxing/locker/corner-play.webp', out: 'corner-play', width: 104, on: 'cream' },
  { src: 'boxing/locker/corner-puzzle.webp', out: 'corner-puzzle', width: 104, on: 'cream' },
  { src: 'boxing/gym/speedbag-bag.webp', out: 'speedbag', width: 62, on: 'cream', trim: true },

  // --- real Gleason's photography ---
  { src: 'boxing/welcome/gloves-up-v2.webp', out: 'photo-crew-gloves', width: 512, format: 'jpeg' },
  { src: 'boxing/welcome/boards-v2.webp', out: 'photo-boards', width: 512, format: 'jpeg' },
  { src: 'boxing/welcome/crew-v2.webp', out: 'photo-crew', width: 512, format: 'jpeg' },
  { src: 'boxing/welcome/phones-v2.webp', out: 'photo-phones', width: 512, format: 'jpeg' },
];

async function run() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

  for (const job of JOBS) {
    const src = path.join(SRC, job.src);
    const format = job.format ?? 'png';
    const dest = path.join(OUT, `${job.out}.${format === 'jpeg' ? 'jpg' : 'png'}`);

    let img = sharp(src);
    if (job.trim) img = img.trim();

    // Resize BEFORE flattening so the trim/alpha maths stays clean.
    img = img.resize({ width: job.width * 2, withoutEnlargement: true });

    if (job.on) img = img.flatten({ background: job.on === 'cream' ? CREAM : NAVY });

    const buf =
      format === 'jpeg'
        ? await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer()
        : await img.png({ compressionLevel: 9, palette: true }).toBuffer();

    const { width, height } = await sharp(buf).metadata();
    const { writeFileSync } = await import('fs');
    writeFileSync(dest, buf);
    console.log(
      `  ${job.out.padEnd(20)} ${String(width).padStart(4)}x${String(height).padEnd(4)}  ${(buf.length / 1024).toFixed(0).padStart(4)}KB  (renders at ${job.width}px)`,
    );
  }

  console.log(`\nWrote ${JOBS.length} files to public/email/boxing/`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
