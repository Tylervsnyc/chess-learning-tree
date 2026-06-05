/**
 * One-off: publish the Witty Alien openings card to Instagram as a single image.
 *
 *   npx tsx scripts/post-witty-alien-ig.ts          # dry run — uploads to Blob, prints URL, does NOT publish
 *   npx tsx scripts/post-witty-alien-ig.ts --post   # actually publishes to @chesspath.app
 *
 * The pipeline lib only posts Reels; this reuses its Blob upload + IG fetch for
 * a photo post (image_url, no processing wait). IG requires JPEG — convert the
 * PNG first (see sips command in the IG card test page notes).
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { uploadToBlob, stripEmojis } from '../lib/instagram';

const IMAGE = 'public/social/witty-alien/witty-alien-openings.jpg';

const CAPTION = `Witty Alien might be the most entertaining streamer in chess — and now you can actually play his openings.

We pulled his most-played gambits straight from his own games (with his blessing): the Alien Gambit, the Martian Attack, the Elephant Gambit, and more. Unsound by the engine. Lethal in bullet.

Learn the whole crazy repertoire — free — at chesspath.app/openings/witty-alien

Are you not entertained?

#chess #chessopenings #wittyalien #chesstok #learnchess #gambit #chessmemes`;

const BASE = 'https://graph.instagram.com/v21.0';

async function igPost(path: string, params: Record<string, string>) {
  const token = process.env.IG_ACCESS_TOKEN!;
  const res = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    body: new URLSearchParams({ access_token: token, ...params }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`IG ${path} -> ${res.status} ${JSON.stringify(json)}`);
  return json;
}

/** Poll a media container until it's ready to publish (images need a moment too). */
async function waitReady(containerId: string) {
  const token = process.env.IG_ACCESS_TOKEN!;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const res = await fetch(`${BASE}/${containerId}?fields=status_code&access_token=${token}`);
    const json = await res.json();
    console.log(`   status: ${json.status_code}`);
    if (json.status_code === 'FINISHED') return;
    if (json.status_code === 'ERROR') throw new Error('IG media processing failed');
  }
  throw new Error('IG media processing timed out');
}

async function main() {
  const accountId = process.env.IG_ACCOUNT_ID;
  if (!process.env.IG_ACCESS_TOKEN || !accountId) {
    throw new Error('Missing IG_ACCESS_TOKEN / IG_ACCOUNT_ID in .env.local');
  }

  console.log('Uploading image to Blob...');
  const imageUrl = await uploadToBlob(IMAGE, 'social/witty-alien-openings.jpg');
  console.log(`   public URL: ${imageUrl}`);

  if (!process.argv.includes('--post')) {
    console.log('\nDry run. Caption preview:\n');
    console.log(stripEmojis(CAPTION));
    console.log('\nRe-run with --post to publish.');
    return;
  }

  console.log('Creating image container...');
  const container = await igPost(`${accountId}/media`, {
    image_url: imageUrl,
    caption: stripEmojis(CAPTION),
  });
  console.log(`   container id: ${container.id}`);

  console.log('Waiting for container to be ready...');
  await waitReady(container.id);

  console.log('Publishing...');
  const published = await igPost(`${accountId}/media_publish`, { creation_id: container.id });
  console.log(`\nPublished! media id: ${published.id}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
