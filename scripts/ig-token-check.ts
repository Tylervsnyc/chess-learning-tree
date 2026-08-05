/**
 * Instagram token + account diagnostics. READ ONLY.
 *
 *   npx tsx scripts/ig-token-check.ts
 *
 * Publishing lives in exactly one place — /api/cron/ig-post, fed by the Blob
 * queue (lib/ig-queue.ts). This script deliberately cannot post: side-channel
 * posting scripts bypassed the queue's posted-state and put the same puzzle on
 * the account twice (2026-08). If you need to post now, run the cron endpoint.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const TOKEN = process.env.IG_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.IG_ACCOUNT_ID;
const BASE = 'https://graph.instagram.com/v21.0';

async function main() {
  if (!TOKEN || !ACCOUNT_ID) {
    console.error('Missing IG_ACCESS_TOKEN or IG_ACCOUNT_ID in .env.local');
    process.exit(1);
  }

  const url = new URL(`${BASE}/me`);
  url.searchParams.set('access_token', TOKEN);
  url.searchParams.set('fields', 'id,username,account_type,media_count');
  const res = await fetch(url);
  const me = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(me)}`);

  console.log('OK — connected account:');
  console.log(`   username:     @${me.username}`);
  console.log(`   account_type: ${me.account_type}`);
  console.log(`   media_count:  ${me.media_count}`);
  console.log(`   id:           ${me.id}`);

  if (me.id !== ACCOUNT_ID) {
    console.warn(`\n   NOTE: token's account id (${me.id}) != IG_ACCOUNT_ID (${ACCOUNT_ID}).`);
    console.warn('   Update IG_ACCOUNT_ID to the id above.');
  }
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
