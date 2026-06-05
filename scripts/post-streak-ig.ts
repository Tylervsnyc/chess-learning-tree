/**
 * One-off: publish the "Showing up beats talent" streak card to Instagram.
 *
 *   npx tsx scripts/post-streak-ig.ts          # dry run — uploads to Blob, prints URL + caption, does NOT publish
 *   npx tsx scripts/post-streak-ig.ts --post   # actually publishes to @chesspath.app
 *
 * IG requires JPEG. Capture first (scripts/capture-streak-ig.mjs) then convert:
 *   sips -s format jpeg public/social/streak/streak-talent.png --out public/social/streak/streak-talent.jpg
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { uploadToBlob, stripEmojis } from '../lib/instagram';

const IMAGE = 'public/social/streak/streak-talent.jpg';

const CAPTION = `Nobody got good at chess in one sitting.

The players who improve aren't the most talented. They're the ones who keep showing up. Five focused minutes a day beats a three-hour grind once a month, every time. That's not motivation talk, it's how your brain actually learns: a little, often, with a reason to come back.

So we built streaks into Chess Path. Do one thing a day (a lesson, a puzzle, a game) and Rookie catches fire. Miss a day and she cools off. Simple, but it's the accountability that makes the habit stick.

Start your streak at chesspath.app

#chess #learnchess #chessimprovement #chesspuzzles #chesstok #chessbeginner`;

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
  const imageUrl = await uploadToBlob(IMAGE, 'social/streak-talent.jpg');
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
