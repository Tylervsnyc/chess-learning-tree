/**
 * Publish Chess Path Classics No. 4 — The Immortal Game.
 *
 *   npx tsx scripts/post-classics-immortal.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-classics-immortal.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/ImmortalReel.tsx.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-immortal.mp4';

const CAPTION = `Chess Path Classics, No. 4: The Immortal Game (1851).

Adolf Anderssen gives away his queen, both rooks, and a bishop — and it ends in checkmate. For him.

But the finish is not luck, it is logic. Anderssen wants to mate with his bishop on e7 — except the knight on g8 is guarding that square. So he overloads it: a queen sacrifice on f6 the knight cannot refuse. It captures, abandons its post, and the bishop delivers mate. One defender given two jobs at once — that idea is called an overload.

Adolf Anderssen vs Lionel Kieseritzky, London, 1851. One of the most famous games ever played.

A new classic position, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #checkmate #chesstactics #chesshistory #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-immortal.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
