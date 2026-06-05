/**
 * Wipe all Honcho conclusions and peer card for a user.
 *
 * Usage:
 *   npx tsx scripts/wipe-honcho.ts [userId]
 *
 * Defaults to Tyler's peer ID if no arg given.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Honcho } from '@honcho-ai/sdk';

const DEFAULT_USER_ID = 'e52d08d3-c76f-4eba-bacd-91ff050a4019'; // Tyler

async function main() {
  const userId = process.argv[2] || DEFAULT_USER_ID;

  const honcho = new Honcho({
    workspaceId: 'chess-path',
    apiKey: process.env.HONCHO_API_KEY,
  });

  await honcho.setConfiguration({
    reasoning: { enabled: true },
    peerCard: { create: true, use: true },
    dream: { enabled: true },
  });

  const user = await honcho.peer(userId);

  // 1. Delete all self-conclusions
  console.log(`Wiping conclusions for peer: ${userId}...`);
  let deleted = 0;
  let page = 1;
  while (true) {
    const conclusions = await user.conclusions.list({ page, size: 50 });
    const items = conclusions.items;
    if (!items || items.length === 0) break;
    for (const c of items) {
      await user.conclusions.delete(c.id);
      deleted++;
    }
    // Always re-fetch page 1 since we're deleting
    page = 1;
  }
  console.log(`  Deleted ${deleted} self-conclusions.`);

  // 2. Clear peer card
  console.log('Clearing peer card...');
  await user.setCard([]);
  console.log('  Peer card cleared.');

  // 3. Verify
  console.log('\nVerifying...');
  const card = await user.getCard();
  console.log(`  Peer card: ${JSON.stringify(card)}`);

  const remaining = await user.conclusions.list({ page: 1, size: 1 });
  console.log(`  Remaining conclusions: ${remaining.items.length}`);

  console.log('\nDone. Honcho is a blank slate.');
}

main().catch(console.error);
