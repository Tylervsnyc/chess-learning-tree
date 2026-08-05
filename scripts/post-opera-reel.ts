/**
 * One-off: publish the Opera Game (Knicks edition) Remotion reel.
 *
 *   npx tsx scripts/post-opera-reel.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-opera-reel.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/OperaGameReel.tsx (out/opera-game-knicks-v6.mp4).
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/opera-game-reel.mp4';

const CAPTION = `The Knicks are CHAMPIONS — so Rookie's celebrating the only way she knows how: showing you her favorite game of all time.

Paris, 1858. A duke and a count teamed up against Paul Morphy at the opera. Two minds on one board — and he still mated them in 17 moves. Knight sac, rook sac, queen sac, finished by a rook (obviously).

There's a moment where you can pause and find the winning move yourself. Get it? Say "found it" in the comments — no spoilers.

Orange and blue, champions forever. Come play Rookie before she calms down.

The fun way to learn chess — link in bio.

#chess #learnchess #chesspuzzle #paulmorphy #chesshistory #knicks #nbachampions #newyorkknicks #chessreels #duolingoforchess`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/opera-game-reel.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
