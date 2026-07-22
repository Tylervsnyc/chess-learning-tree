/**
 * Publish Chess Path Classics No. 6 — Légal's Mate (1750).
 *
 *   npx tsx scripts/post-classics-legal.ts          # dry run — prints caption, does NOT publish
 *   npx tsx scripts/post-classics-legal.ts --post   # actually publishes to @chesspath.app
 *
 * Video: rendered from remotion/LegalReel.tsx.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { postVideoToInstagram, stripEmojis } from '../lib/instagram';

const VIDEO = 'public/social/classics-legal.mp4';

const CAPTION = `Chess Path Classics, No. 6: Légal's Mate (1750).

White is about to give away his queen — on purpose — and it is completely winning. This is the oldest trap in chess, and after nearly three hundred years, players still fall into it.

It starts with a pin. Black's bishop pins the knight to the queen, so moving that knight should lose it. White moves it anyway — knight takes e5, hanging the queen. Declining is only a lost pawn, but the free queen is too tempting: Black grabs it, and Bishop takes f7, Knight to d5 is checkmate. The king is trapped by his own queen, bishop, and pawn.

Played by de Kermur, Sire de Légal, against Saint Brie at the Café de la Régence in Paris, around 1750. Modeled on the Légal's Mate breakdown by @gothamchess.

A new classic position, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #checkmate #chesstrap #chesshistory #chessreels #chesseducation`;

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
  const mediaId = await postVideoToInstagram(VIDEO, CAPTION, 'social/classics-legal.mp4');
  console.log(`\nPublished! media id: ${mediaId}`);
  console.log('View: https://instagram.com/chesspath.app');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
