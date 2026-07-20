/**
 * Publish Chess Path Classics No. 2 — Zugzwang (A. Gurvich, 1959).
 *
 *   npx tsx scripts/post-classics-zugzwang.ts          # dry run
 *   npx tsx scripts/post-classics-zugzwang.ts --post   # publish to @chesspath.app
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-zugzwang.mp4';

const CAPTION = `Chess Path Classics, No. 2: Zugzwang (1959).

White does not win this position by attacking. White wins by taking away every move Black has — until the only legal move left loses the game. It is called zugzwang, and this study is one of the cleanest examples ever composed.

Rookie walks through the whole trap: why chasing the rook fails to a skewer, why hiding fails to a pin, the quiet rook move that seems to ignore everything, and the pawn push that seals a rook inside a perfect cage — with checkmate one forced move later.

Study by A. Gurvich, 1959. We found it thanks to @pietrocheckmate.

A new classic position, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #endgame #chessstudy #zugzwang #chesshistory #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-zugzwang.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
