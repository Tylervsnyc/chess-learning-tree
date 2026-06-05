/**
 * Debug script: dump what Honcho "knows" about a player.
 *
 * Usage:
 *   npx tsx scripts/debug-honcho-conclusions.ts [userId]
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

  console.log(`\n=== Honcho Debug for peer: ${userId} ===\n`);

  // 1. peer.chat() — targeted summary
  console.log('--- peer.chat() summary ---');
  try {
    const chatResponse = await user.chat(
      `Summarize everything you know about this chess player. Include all conclusions, patterns, strengths, weaknesses, and any other observations. Be thorough.`,
      { reasoningLevel: 'low' },
    );
    console.log(chatResponse ?? '(null)');
  } catch (err) {
    console.error('peer.chat() failed:', err);
  }

  // 2. session.context() — broad dump with conclusions
  console.log('\n--- session.context() (representation + conclusions) ---');
  try {
    const sessions = await user.sessions();
    const items = (sessions as any)?._data?.items;
    if (!items || items.length === 0) {
      console.log('(no sessions found)');
    } else {
      console.log(`Found ${items.length} session(s). Using latest: ${items[items.length - 1].id}`);
      const session = await honcho.session(items[items.length - 1].id);
      const context = await session.context({
        tokens: 2000,
        peerTarget: userId,
      });
      console.log(JSON.stringify(context, null, 2));
    }
  } catch (err) {
    console.error('session.context() failed:', err);
  }

  // 3. Peer card
  console.log('\n--- Peer Card ---');
  try {
    const card = await (user as any).getCard?.();
    console.log(card ?? '(no getCard method or empty)');
  } catch (err) {
    console.error('Peer card fetch failed:', err);
  }

  console.log('\n=== Done ===\n');
}

main().catch(console.error);
