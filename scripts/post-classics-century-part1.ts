/**
 * Publish Chess Path Classics No. 7 — Game of the Century, Part 1: The Windmill.
 *
 *   npx tsx scripts/post-classics-century-part1.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-classics-century-part1.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/CenturyReel.tsx.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-century-part1.mp4';

const CAPTION = `Chess Path Classics, No. 7: Game of the Century — Part 1, The Windmill (1956).

A thirteen-year-old lets a grandmaster capture his queen — on purpose — and it becomes one of the most famous games ever played.

Here is the logic, not just the moves. White plays Bc5, attacking Fischer's queen. Instead of saving it, Fischer plays Be6 and simply offers the queen away. Once White takes it, the machine starts turning: a windmill — a discovered check that repeats. The bishop on c4 pins the white king to a diagonal while the knight shuttles back and forth, and every single spin the king is in check and can never capture the knight. It just takes as it goes. It was never a gamble — Fischer had counted the material before he gave the queen, and he ends this position two bishops and a pawn ahead.

Donald Byrne vs Bobby Fischer, Rosenwald Memorial, New York, 1956 — a game so famous it earned its own name: the Game of the Century.

Part 2 tomorrow: how Fischer turned this into checkmate. Follow so you do not miss the finish.

A new classic, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #chesstactics #fischer #chesshistory #windmill #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-century-part1.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
