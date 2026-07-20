/**
 * Publish Chess Path Classics No. 3 — The Two-Pawn Checkmate.
 * Scheduled for 2026-07-19 10:00 (Tyler-approved).
 *
 *   npx tsx scripts/post-classics-chosen-one.ts          # dry run
 *   npx tsx scripts/post-classics-chosen-one.ts --post   # publish to @chesspath.app
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-chosen-one.mp4';

const CAPTION = `Chess Path Classics, No. 3: The Two-Pawn Checkmate.

Every move in this study looks like a mistake. White keeps giving pieces away — and every gift is the only move that wins. By the end, White has two pawns left. It is exactly enough.

Rookie takes her time with this one: the double fork sacrifices, the trap where winning the queen only draws (a fortress), three forced moves in a row, and a king walled in by his own army.

Composer unknown to us — if you know this study, tell us in the comments. We found it thanks to @pietrocheckmate.

A new classic position, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #endgame #chessstudy #checkmate #chesshistory #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-chosen-one.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
