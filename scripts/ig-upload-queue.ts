/**
 * Upload rendered daily videos to Vercel Blob and (re)build the post queue.
 *
 *   npx tsx scripts/ig-upload-queue.ts          # add any not-yet-queued videos
 *   npx tsx scripts/ig-upload-queue.ts --rebuild # wipe + rebuild from scratch
 *
 * Idempotent: videos already in the queue (by date) are skipped, so you can
 * re-run it after rendering new ones to top up the queue.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { uploadToBlob, stripEmojis } from '../lib/instagram';
import { loadQueue, saveQueue, dateToSortKey, type QueueItem } from '../lib/ig-queue';

const VIDEOS_DIR = 'out/videos';

function discoverVideos(): { date: string; mp4: string; caption: string }[] {
  return readdirSync(VIDEOS_DIR)
    .map(d => join(VIDEOS_DIR, d))
    .filter(p => statSync(p).isDirectory())
    .map(dir => {
      const files = readdirSync(dir);
      const mp4 = files.find(f => f.startsWith('daily.') && f.endsWith('.mp4'));
      const txt = files.find(f => f.startsWith('daily.') && f.endsWith('.txt'));
      if (!mp4) return null;
      return {
        date: dir.split('/').pop()!,
        mp4: join(dir, mp4),
        caption: txt ? readFileSync(join(dir, txt), 'utf8') : '',
      };
    })
    .filter((v): v is { date: string; mp4: string; caption: string } => !!v);
}

async function main() {
  const rebuild = process.argv.includes('--rebuild');
  let queue: QueueItem[] = rebuild ? [] : await loadQueue();
  const have = new Set(queue.map(i => i.date));

  const videos = discoverVideos();
  console.log(`Found ${videos.length} rendered videos on disk; queue has ${queue.length}.`);

  let added = 0;
  for (const v of videos) {
    if (have.has(v.date)) continue;
    process.stdout.write(`Uploading ${v.date}... `);
    const videoUrl = await uploadToBlob(v.mp4, `ig-queue/videos/${v.date}.mp4`);
    queue.push({
      date: v.date,
      caption: stripEmojis(v.caption),
      videoUrl,
      sortKey: dateToSortKey(v.date),
      posted: false,
    });
    added++;
    console.log('done');
  }

  queue.sort((a, b) => a.sortKey - b.sortKey);
  await saveQueue(queue);

  const remaining = queue.filter(i => !i.posted).length;
  console.log(`\nAdded ${added}. Queue: ${queue.length} total, ${remaining} unposted (~${remaining} days of content).`);
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
