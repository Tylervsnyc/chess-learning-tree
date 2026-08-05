/**
 * Publish Chess Path Classics No. 8 — Pawns of Destiny.
 *
 *   npx tsx scripts/post-classics-pawns-destiny.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-classics-pawns-destiny.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/PawnsDestinyReel.tsx → out/pawns-destiny.mp4,
 * copied to public/social/classics-pawns-destiny.mp4 before posting.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const SRC = 'out/pawns-destiny.mp4';
const VIDEO = 'public/social/classics-pawns-destiny.mp4';

const CAPTION = `Chess Path Classics, No. 9: The Longest Walk.

White is down a rook. He has two pawns — and he wins, without ever making a queen until the very last move.

The rook checks forever, so the king walks. Up the edge it climbs, dodging every check — because one step toward the center lets the rook reach the back rank and stop both pawns at once. Then the star move breaks its own rule: the king strides to d7 and marches the whole width of the board to the other pawn. On that side there is no Black king to back the checks, they run dry, Black must finally stop one pawn, and the other one queens.

The whole point: the king was the strongest piece on the board all along.

Study composer unknown to us — if you know who composed it, tell us in the comments. We found this position thanks to @pietrocheckmate.

A new classic position, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #endgame #chessstudy #chesshistory #chessreels #chesseducation`;

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

  fs.copyFileSync(SRC, VIDEO);
  console.log('Uploading + publishing Reel (IG processing takes ~30-60s)...');
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-pawns-destiny.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
