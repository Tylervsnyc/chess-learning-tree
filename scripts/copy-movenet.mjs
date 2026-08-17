// Downloads the MoveNet SinglePose Lightning TF.js graph model (model.json +
// 2 weight shards, ~4.6MB) into public/models/movenet-lightning/ so Quadrant
// Fight loads it same-origin (no TFHub/jsdelivr on the boot path — see
// lib/punch/movenet.ts). The files are committed; this only re-fetches if
// something is missing, and runs via predev/prebuild next to the MediaPipe
// wasm copy. Network failure is NON-fatal when the files already exist.
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'public/models/movenet-lightning';
const BASE = 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4';
const MIRROR = 'https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/lightning/4';

async function fetchFile(name) {
  for (const base of [BASE, MIRROR]) {
    try {
      const res = await fetch(`${base}/${name}?tfjs-format=file`, { redirect: 'follow' });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
    } catch { /* try the mirror */ }
  }
  throw new Error(`could not download ${name}`);
}

async function main() {
  mkdirSync(DIR, { recursive: true });
  const modelPath = join(DIR, 'model.json');
  if (!existsSync(modelPath)) writeFileSync(modelPath, await fetchFile('model.json'));
  const model = JSON.parse(readFileSync(modelPath, 'utf8'));
  const shards = (model.weightsManifest ?? []).flatMap((m) => m.paths ?? []);
  let fetched = 0;
  for (const shard of shards) {
    const p = join(DIR, shard);
    if (existsSync(p)) continue;
    writeFileSync(p, await fetchFile(shard));
    fetched += 1;
  }
  console.log(`movenet lightning ready in ${DIR}${fetched ? ` (downloaded ${fetched} shard(s))` : ''}`);
}

main().catch((e) => {
  console.warn('[copy-movenet] skipped:', e.message);
});
