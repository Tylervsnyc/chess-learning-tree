/**
 * Publish Chess Path Classics No. 11 — The Two Knights.
 *
 *   npx tsx scripts/post-classics-knightmare.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-classics-knightmare.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/KnightmareReel.tsx.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-knightmare.mp4';

const CAPTION = `Chess Path Classics, No. 11: The Two Knights.

Two knights alone can never force checkmate. In this study, Black wins with exactly two knights — against a pawn one step from becoming a queen.

Rookie shows the whole idea: the knight checks that chase the king, the quiet king step that freezes the pawn (promoting to a queen would be checkmate), White's only defense — promoting to a KNIGHT instead — and the zugzwang that finishes it anyway. Six legal moves, six checkmates.

We found this study thanks to @pietrocheckmate. Composer unknown to us — if you know this study, tell us in the comments.

A new classic, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #endgame #chessstudy #zugzwang #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-knightmare.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
