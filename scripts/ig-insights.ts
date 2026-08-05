/**
 * Read-only Instagram performance for @chesspath.app posts.
 * Uses the same Instagram Login token we post with (graph.instagram.com).
 *
 *   npx tsx scripts/ig-insights.ts            # recent posts + insights
 *   npx tsx scripts/ig-insights.ts <mediaId>  # one post, incl. comments
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const BASE = 'https://graph.instagram.com/v21.0';
const TOKEN = process.env.IG_ACCESS_TOKEN!;
const ACCOUNT = process.env.IG_ACCOUNT_ID!;

async function g(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set('access_token', TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? JSON.stringify(json));
  return json;
}

async function insights(mediaId: string): Promise<Record<string, number>> {
  // Try the rich reel metric set; degrade to whatever the API returns.
  const metrics = ['reach', 'views', 'likes', 'comments', 'saved', 'shares', 'total_interactions'];
  const out: Record<string, number> = {};
  try {
    const r = await g(`${mediaId}/insights`, { metric: metrics.join(',') });
    for (const m of r.data ?? []) out[m.name] = m.values?.[0]?.value ?? 0;
  } catch (e) {
    // Some metrics unsupported per media type — retry a minimal safe set
    try {
      const r = await g(`${mediaId}/insights`, { metric: 'reach,saved,shares' });
      for (const m of r.data ?? []) out[m.name] = m.values?.[0]?.value ?? 0;
    } catch { /* insights not permitted */ }
  }
  return out;
}

async function main() {
  if (!TOKEN || !ACCOUNT) throw new Error('Missing IG_ACCESS_TOKEN / IG_ACCOUNT_ID');

  const single = process.argv[2];
  if (single) {
    const m = await g(single, { fields: 'caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count' });
    console.log(`\n${m.permalink}\n${(m.caption ?? '').split('\n')[0]}`);
    console.log(`posted ${m.timestamp} · ${m.like_count} likes · ${m.comments_count} comments`);
    console.log('insights:', JSON.stringify(await insights(single), null, 0));
    const cs = await g(`${single}/comments`, { fields: 'text,username,timestamp,like_count', limit: '30' }).catch(() => ({ data: [] }));
    console.log(`\ncomments (${cs.data?.length ?? 0}):`);
    for (const c of cs.data ?? []) console.log(`  @${c.username}: ${c.text}`);
    return;
  }

  const media = await g(`${ACCOUNT}/media`, {
    fields: 'id,caption,media_type,media_product_type,timestamp,permalink,like_count,comments_count',
    limit: '15',
  });

  console.log(`\n@chesspath.app — last ${media.data.length} posts\n`);
  console.log('date       type    likes  comm  reach   views   saves  shares  first line');
  console.log('-'.repeat(100));
  for (const m of media.data) {
    const ins = await insights(m.id);
    const date = (m.timestamp ?? '').slice(0, 10);
    const type = (m.media_product_type ?? m.media_type ?? '').slice(0, 6).padEnd(6);
    const line = (m.caption ?? '').split('\n')[0].slice(0, 42);
    const col = (v: unknown, w: number) => String(v ?? '-').padStart(w);
    console.log(
      `${date}  ${type}  ${col(m.like_count, 5)}  ${col(m.comments_count, 4)}  ${col(ins.reach, 5)}  ${col(ins.views, 6)}  ${col(ins.saved, 5)}  ${col(ins.shares, 6)}  ${line}`
    );
  }
  console.log('\n(Run with a media id for one post + its comments.)');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
