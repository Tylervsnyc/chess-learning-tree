/**
 * One-off: publish the Knicks trash-talk screen recording as a Reel.
 *
 *   npx tsx scripts/post-knicks-reel.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-knicks-reel.ts --post   # actually publishes to @chesspath.app
 *
 * Video prepped from Tyler's iPhone screen recording (Safari chrome cropped,
 * 1080x1920, DM Sans title strip). Re-render: see git log for the ffmpeg line.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/knicks-trashtalk-reel.mp4';

const CAPTION = `Sound on. Our AI rook found out the Knicks won and now she won't stop.

Real game from this morning. She opened with "Cleveland had a plan. The plan was 'lose to the Knicks.' Bold. Effective." and it only got worse from there.

For the rest of the Finals, Rookie is orange and blue with 140+ new lines of trash talk. Play her before she calms down.

The fun way to learn chess — link in bio.

#chess #learnchess #knicks #nbafinals #newyorkknicks #nba #chessapp #duolingoforchess #trashtalk`;

async function main() {
  if (!process.env.IG_ACCESS_TOKEN || !process.env.IG_ACCOUNT_ID) {
    throw new Error('Missing IG_ACCESS_TOKEN / IG_ACCOUNT_ID in .env.local');
  }

  if (!process.argv.includes('--post')) {
    console.log('Dry run. Caption preview:\n');
    console.log(stripEmojis(CAPTION));
    console.log('\nRe-run with --post to publish.');
    return;
  }

  console.log('Uploading + publishing Reel (IG processing takes ~30-60s)...');
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/knicks-trashtalk-reel.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
