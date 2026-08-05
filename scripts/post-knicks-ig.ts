/**
 * One-off: publish the Knicks Finals takeover card to Instagram.
 *
 *   npx tsx scripts/post-knicks-ig.ts          # dry run — uploads to Blob, prints URL + caption, does NOT publish
 *   npx tsx scripts/post-knicks-ig.ts --post   # actually publishes to @chesspath.app
 *
 * IG requires JPEG. Capture first (node scripts/capture-knicks.mjs) then convert:
 *   sips -s format jpeg -Z 1350 public/social/knicks-takeover-ig.png --out public/social/knicks-takeover-ig.jpg
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { uploadToBlob, stripEmojis } from '../lib/instagram';

const IMAGE = 'public/social/knicks-takeover-ig.jpg';

const CAPTION = `Rookie picked a side.

The Knicks came back from 29 down last night — the largest comeback in Finals history — and our rook took it personally. For the rest of the Finals she's orange and blue and absolutely insufferable about it.

Play her right now and she will:
- Greet you with MSG parking garage trash talk
- Compare every blown lead to the Spurs in the third quarter
- Call your checkmate an OG tip-in with 1.2 seconds left

She's still a terrible loser. Now she's a terrible loser in Knicks colors.

Live through the Finals, then she goes back to normal. Probably.

The fun way to learn chess — link in bio.

#chess #learnchess #knicks #nbafinals #newyorkknicks #chessapp #duolingoforchess #nba`;

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
  const imageUrl = await uploadToBlob(IMAGE, 'social/knicks-takeover-ig.jpg');
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
