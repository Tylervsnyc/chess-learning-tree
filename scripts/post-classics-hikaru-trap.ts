/**
 * Publish Chess Path Classics No. 12 — Hikaru's Queen Sacrifice.
 *
 *   npx tsx scripts/post-classics-hikaru-trap.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-classics-hikaru-trap.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/HikaruTrapReel.tsx.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-hikaru-trap.mp4';

const CAPTION = `Chess Path Classics, No. 12: Hikaru's Queen Sacrifice (2026).

Hikaru Nakamura gave away his queen on purpose — and mated a 2800-rated master with two bishops and a rook.

Rookie walks through the whole trap: the rook that looks lost on c7, the double sacrifice Rc2, why grabbing on g2 first actually fails, and the exact move order — Bc5 check first — that makes the king hunt unstoppable. Both corner escapes are shown as live checkmates so you can see why the king had nowhere to run.

Game: Nakamura vs WIM Margarita Potapova, chess.com 3+0 Thursday, July 23, 2026. We found this gem thanks to @sam_copeland — his breakdown called it his favorite combination of the year, and we agree.

A new classic, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #queensacrifice #hikaru #chesstactics #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-hikaru-trap.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
