/**
 * Instagram Login API — token validation + (optional) test post.
 *
 *   npx tsx scripts/ig-test-post.ts            # read-only: validates token, prints account
 *   npx tsx scripts/ig-test-post.ts --post URL # publishes a single test post (image or video URL)
 *
 * Uses the Instagram API with Instagram Login (graph.instagram.com).
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const TOKEN = process.env.IG_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.IG_ACCOUNT_ID;
const BASE = 'https://graph.instagram.com/v21.0';

async function api(path: string, params: Record<string, string> = {}, method: 'GET' | 'POST' = 'GET') {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set('access_token', TOKEN!);
  if (method === 'GET') for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const init: RequestInit = { method };
  if (method === 'POST') {
    const body = new URLSearchParams({ access_token: TOKEN!, ...params });
    init.body = body;
  }
  const res = await fetch(url, init);
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
  return json;
}

async function main() {
  if (!TOKEN || !ACCOUNT_ID) {
    console.error('Missing IG_ACCESS_TOKEN or IG_ACCOUNT_ID in .env.local');
    process.exit(1);
  }

  // 1. Validate token + read account
  console.log('Validating token...');
  const me = await api('me', { fields: 'id,username,account_type,media_count' });
  console.log('OK — connected account:');
  console.log(`   username:     @${me.username}`);
  console.log(`   account_type: ${me.account_type}`);
  console.log(`   media_count:  ${me.media_count}`);
  console.log(`   id:           ${me.id}`);

  if (me.id !== ACCOUNT_ID) {
    console.warn(`\n   NOTE: token's account id (${me.id}) != IG_ACCOUNT_ID (${ACCOUNT_ID}).`);
    console.warn('   Update IG_ACCOUNT_ID in .env.local to the id above.');
  }

  const postArg = process.argv.indexOf('--post');
  if (postArg === -1) {
    console.log('\nRead-only check complete. To publish a test post:');
    console.log('   npx tsx scripts/ig-test-post.ts --post <public-image-or-video-url>');
    return;
  }

  // 2. Optional: publish a test post
  const mediaUrl = process.argv[postArg + 1];
  if (!mediaUrl) { console.error('Pass a media URL after --post'); process.exit(1); }
  const isVideo = /\.(mp4|mov)(\?|$)/i.test(mediaUrl);
  console.log(`\nCreating ${isVideo ? 'video (REELS)' : 'image'} container...`);
  const container = await api(`${me.id}/media`, isVideo
    ? { media_type: 'REELS', video_url: mediaUrl, caption: 'Rookie test post — learning chess the fun way. chesspath.app' }
    : { image_url: mediaUrl, caption: 'Rookie test post — learning chess the fun way. chesspath.app' },
    'POST');
  console.log(`   container id: ${container.id}`);

  // Video needs processing time before publish
  if (isVideo) {
    console.log('   waiting for video processing...');
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const status = await api(container.id, { fields: 'status_code' });
      console.log(`   status: ${status.status_code}`);
      if (status.status_code === 'FINISHED') break;
      if (status.status_code === 'ERROR') throw new Error('Video processing failed');
    }
  }

  console.log('Publishing...');
  const published = await api(`${me.id}/media_publish`, { creation_id: container.id }, 'POST');
  console.log(`Published! media id: ${published.id}`);
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
