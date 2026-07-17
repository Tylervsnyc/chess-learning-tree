/**
 * Publish Chess Path Classics No. 1 — The Saavedra Position.
 *
 *   npx tsx scripts/post-classics-saavedra.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-classics-saavedra.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/SaavedraReel.tsx (SaavedraTeachReel composition).
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-saavedra.mp4';

const CAPTION = `Chess Path Classics, No. 1: The Saavedra Position (1895).

White is down an entire rook — and wins. This is one of the most famous endgame studies ever composed: one pawn, a king walk down the board, and an underpromotion that turns a dead draw into a win.

Rookie walks through why every natural try only draws — the skewer waiting on d1, the pin on d7, the stalemate trap — and the quiet king move that beats them all.

A new classic position, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #endgame #chessstudy #saavedra #chesshistory #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-saavedra.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
