/**
 * Builds perfectly-aligned locker layers from the original art + GPT's
 * gloves-removed render:
 *   locker-base-patched.png — ORIGINAL image with the gloves region patched
 *                             from the GPT base (tone-identical elsewhere)
 *   locker-gloves.png       — gloves only, transparent, cut from the original
 *
 * GPT re-rendered the whole base slightly darker, so we never use it as-is;
 * we only borrow its pixels inside the glove hole.
 *
 * Run: npx tsx scripts/extract-locker-gloves.ts
 */
import sharp from 'sharp';

const W = 1024;
const H = 1536;
const BBOX = { x0: 0.18, x1: 0.88, y0: 0.1, y1: 0.62 };
const THRESHOLD = 150; // wall re-render drift is ~100; gloves diff is ~220+

const idx = (x: number, y: number) => y * W + x;

function despeckle(mask: Uint8Array): Uint8Array {
  const out = new Uint8Array(mask);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = idx(x, y);
      if (!mask[i]) continue;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if ((dy || dx) && mask[i + dy * W + dx]) n++;
      }
      if (n < 3) out[i] = 0;
    }
  }
  return out;
}

function morph(mask: Uint8Array, radius: number, dilate: boolean): Uint8Array {
  const out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let hit = false;
      for (let dy = -radius; dy <= radius && !hit; dy++) {
        for (let dx = -radius; dx <= radius && !hit; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          if (dilate ? mask[idx(nx, ny)] > 0 : mask[idx(nx, ny)] === 0) hit = true;
        }
      }
      out[idx(x, y)] = dilate ? (hit ? 255 : 0) : (hit ? 0 : mask[idx(x, y)]);
    }
  }
  return out;
}

/** separable box blur on a single channel */
function boxBlur(src: Uint8Array, radius: number): Uint8Array {
  const tmp = new Float32Array(W * H);
  const out = new Uint8Array(W * H);
  const span = radius * 2 + 1;
  for (let y = 0; y < H; y++) {
    let acc = 0;
    for (let x = -radius; x <= radius; x++) acc += src[idx(Math.min(W - 1, Math.max(0, x)), y)];
    for (let x = 0; x < W; x++) {
      tmp[idx(x, y)] = acc / span;
      const add = Math.min(W - 1, x + radius + 1);
      const sub = Math.max(0, x - radius);
      acc += src[idx(add, y)] - src[idx(sub, y)];
    }
  }
  for (let x = 0; x < W; x++) {
    let acc = 0;
    for (let y = -radius; y <= radius; y++) acc += tmp[idx(x, Math.min(H - 1, Math.max(0, y)))];
    for (let y = 0; y < H; y++) {
      out[idx(x, y)] = Math.round(acc / span);
      const add = Math.min(H - 1, y + radius + 1);
      const sub = Math.max(0, y - radius);
      acc += tmp[idx(x, add)] - tmp[idx(x, sub)];
    }
  }
  return out;
}

async function main() {
  const [orig, base] = await Promise.all([
    sharp('public/test-assets/home-locker-v2-3.png').resize(W, H).ensureAlpha().raw().toBuffer(),
    sharp('public/test-assets/locker-base.png').resize(W, H).ensureAlpha().raw().toBuffer(),
  ]);

  // gloves mask from high-threshold diff, bbox-limited
  let mask = new Uint8Array(W * H);
  const x0 = Math.floor(BBOX.x0 * W), x1 = Math.ceil(BBOX.x1 * W);
  const y0 = Math.floor(BBOX.y0 * H), y1 = Math.ceil(BBOX.y1 * H);
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const p = idx(x, y) * 4;
      const d = Math.abs(orig[p] - base[p]) + Math.abs(orig[p + 1] - base[p + 1]) + Math.abs(orig[p + 2] - base[p + 2]);
      if (d > THRESHOLD) mask[idx(x, y)] = 255;
    }
  }
  mask = despeckle(mask);

  // gloves cutout: slight erode + feather so no navy halo rides along
  const gloveAlpha = boxBlur(morph(mask, 1, false), 2);
  const gloves = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    gloves[p] = orig[p];
    gloves[p + 1] = orig[p + 1];
    gloves[p + 2] = orig[p + 2];
    gloves[p + 3] = gloveAlpha[i];
  }
  await sharp(gloves, { raw: { width: W, height: H, channels: 4 } }).png()
    .toFile('public/test-assets/locker-gloves.png');

  // patched base: original everywhere, base pixels blended in over the
  // dilated glove hole (feathered edge)
  const holeBlend = boxBlur(morph(mask, 4, true), 3);
  const patched = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    const t = holeBlend[i] / 255;
    patched[p] = Math.round(orig[p] * (1 - t) + base[p] * t);
    patched[p + 1] = Math.round(orig[p + 1] * (1 - t) + base[p + 1] * t);
    patched[p + 2] = Math.round(orig[p + 2] * (1 - t) + base[p + 2] * t);
    patched[p + 3] = 255;
  }
  await sharp(patched, { raw: { width: W, height: H, channels: 4 } }).png()
    .toFile('public/test-assets/locker-base-patched.png');

  // erase the baked-in door tallies (dynamic chalk replaces them):
  // mask light strokes in the door region, then fill each masked pixel from
  // its nearest unmasked horizontal neighbors (door is flat — seamless)
  const tx0 = Math.floor(0.0 * W), tx1 = Math.ceil(0.2 * W);
  const ty0 = Math.floor(0.06 * H), ty1 = Math.ceil(0.34 * H);
  let tmask = new Uint8Array(W * H);
  for (let y = ty0; y < ty1; y++) {
    for (let x = tx0; x < tx1; x++) {
      const p = idx(x, y) * 4;
      // chalk strokes are light-on-navy: flag bright pixels
      const lum = 0.3 * patched[p] + 0.6 * patched[p + 1] + 0.1 * patched[p + 2];
      if (lum > 78) tmask[idx(x, y)] = 255;
    }
  }
  tmask = morph(tmask, 3, true);
  for (let y = ty0; y < ty1; y++) {
    for (let x = tx0; x < tx1; x++) {
      if (!tmask[idx(x, y)]) continue;
      let lx = x, rx = x;
      while (lx > tx0 && tmask[idx(lx, y)]) lx--;
      while (rx < tx1 - 1 && tmask[idx(rx, y)]) rx++;
      const pl = idx(lx, y) * 4, pr = idx(rx, y) * 4, p = idx(x, y) * 4;
      for (let c = 0; c < 3; c++) patched[p + c] = Math.round((patched[pl + c] + patched[pr + c]) / 2);
    }
  }
  await sharp(patched, { raw: { width: W, height: H, channels: 4 } }).png()
    .toFile('public/test-assets/locker-base-patched.png');

  const coverage = mask.reduce((a, v) => a + (v ? 1 : 0), 0) / (W * H);
  console.log(`gloves mask coverage ${(coverage * 100).toFixed(1)}% — wrote locker-gloves.png + locker-base-patched.png`);
}

main();
