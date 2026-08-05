/**
 * One-off: publish the "Fable launch day" ship-list card to Instagram.
 *
 *   npx tsx scripts/post-fable-day-ig.ts          # dry run — uploads to Blob, prints URL + caption, does NOT publish
 *   npx tsx scripts/post-fable-day-ig.ts --post   # actually publishes to @chesspath.app
 *
 * IG requires JPEG. Capture first (/test/fable-day?raw=1) then convert:
 *   sips -s format jpeg -Z 1350 fable-launch-day.png --out public/social/fable-launch-day.jpg
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { uploadToBlob, stripEmojis } from '../lib/instagram';

const IMAGE = 'public/social/fable-launch-day.jpg';

const CAPTION = `Rookie woke up different today.

A new AI model launched this morning, so we spent the whole day upgrading Chess Path. What's new for you:

- Your rating now climbs right on screen after every win
- Rookie has more personality than ever (still a terrible loser)
- The whole app got dramatically faster
- New players get their first rating revealed like a trophy
- And yes, Chess Path hats are real now. Wear the path.

One day of work, all live right now. Come find out what your rating is.

The fun way to learn chess — link in bio. Hat shop: chess-path-shop.fourthwall.com

#chess #learnchess #chesstips #chessapp #duolingoforchess #ai #chessmerch`;

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
  const imageUrl = await uploadToBlob(IMAGE, 'social/fable-launch-day.jpg');
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
