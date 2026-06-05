/**
 * One-off: publish the animated "Showing up beats talent" streak Reel to IG.
 *
 * Render first:  npx remotion render remotion/index.ts StreakReel out/streak-reel.mp4
 *
 *   npx tsx scripts/post-streak-reel.ts          # dry run — uploads to Blob, prints URL + caption, does NOT publish
 *   npx tsx scripts/post-streak-reel.ts --post   # actually publishes the Reel to @chesspath.app
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { uploadToBlob, publishReel, stripEmojis } from '../lib/instagram';

const VIDEO = 'out/streak-reel.mp4';

const CAPTION = `Nobody got good at chess in one sitting.

The players who improve aren't the most talented. They're the ones who keep showing up. Five focused minutes a day beats a three-hour grind once a month, every time. That's not motivation talk, it's how your brain actually learns: a little, often, with a reason to come back.

So we built streaks into Chess Path. Do one thing a day (a lesson, a puzzle, a game) and Rookie catches fire. Miss a day and she cools off. Simple, but it's the accountability that makes the habit stick.

Start your streak at chesspath.app

#chess #learnchess #chessimprovement #chesspuzzles #chesstok #chessbeginner`;

async function main() {
  if (!process.env.IG_ACCESS_TOKEN || !process.env.IG_ACCOUNT_ID) {
    throw new Error('Missing IG_ACCESS_TOKEN / IG_ACCOUNT_ID in .env.local');
  }

  console.log('Uploading reel to Blob...');
  const videoUrl = await uploadToBlob(VIDEO, 'social/streak-reel.mp4');
  console.log(`   public URL: ${videoUrl}`);

  if (!process.argv.includes('--post')) {
    console.log('\nDry run. Caption preview:\n');
    console.log(stripEmojis(CAPTION));
    console.log('\nRe-run with --post to publish the Reel.');
    return;
  }

  console.log('Publishing Reel (video processing can take ~30s)...');
  const id = await publishReel(videoUrl, CAPTION);
  console.log(`\nPublished! media id: ${id}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
