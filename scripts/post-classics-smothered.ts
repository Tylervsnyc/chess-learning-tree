/**
 * Publish Chess Path Classics No. 5 — The Smothered Mate.
 *
 *   npx tsx scripts/post-classics-smothered.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-classics-smothered.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/SmotheredReel.tsx.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-smothered.mp4';

const CAPTION = `Chess Path Classics, No. 5: The Smothered Mate.

This might be the most satisfying checkmate in chess — a lone knight mates a king trapped by his own army.

And here is the logic, not just the moves. The knight checks, the king hides in the corner, then comes a double check — you cannot block two pieces at once, so the king is forced back. Now White sacrifices the queen on g8. Why? To drag Black's own rook onto that square, sealing the king's last escape. Then the knight returns for mate. Every flight square is blocked by Black's own pieces — that is a smothered mate, and only a knight can do it, because a knight's check can never be blocked.

The pattern is centuries old — often called Philidor's Legacy, though it appears in Lucena's writings as far back as 1497.

A new classic, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #checkmate #smotheredmate #chesstactics #chessbasics #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-smothered.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
