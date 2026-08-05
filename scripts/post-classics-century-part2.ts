/**
 * Publish Chess Path Classics No. 8 — Game of the Century, Part 2: The Mating Net.
 *
 *   npx tsx scripts/post-classics-century-part2.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-classics-century-part2.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/CenturyReel2.tsx.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-century-part2.mp4';

const CAPTION = `Chess Path Classics, No. 8: Game of the Century — Part 2, The Mating Net (1956).

Part 1, Fischer gave up his queen and a windmill won him a rook, two bishops, and a pawn. He is completely winning. But winning is not finishing.

Here is the logic, not just the moves. First the technique: Fischer trades pieces and grabs pawns until White is left with a lonely king on the kingside. Then he turns to hunt it. The star idea is a mating net — two bishops and a knight take away every escape square while a single check pushes the king along. Bishop c5, knight g3, bishop b4, bishop b3, knight e2, knight c3 — check after check drives the king g1 to f1 to e1 to d1 to c1, into the corner. With every flight square already covered, a lone rook finishes it: Rc2, checkmate.

One queen, given up on purpose twenty-four moves earlier. It was never a gamble.

Donald Byrne vs Bobby Fischer, Rosenwald Memorial, New York, 1956 — the Game of the Century.

A new classic, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #chesstactics #fischer #chesshistory #checkmate #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-century-part2.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
