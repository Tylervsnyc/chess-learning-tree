/**
 * Post a rendered daily puzzle video to Instagram.
 *   npx tsx scripts/ig-post-daily.ts <date-folder>   e.g. 5.31.26
 * Omit the date to use the most recent rendered video.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { postVideoToInstagram } from '../lib/instagram';

const VIDEOS_DIR = 'out/videos';

function findVideo(dateArg?: string): { mp4: string; caption: string; date: string } {
  let dir: string;
  if (dateArg) {
    dir = join(VIDEOS_DIR, dateArg);
  } else {
    const dirs = readdirSync(VIDEOS_DIR)
      .map(d => join(VIDEOS_DIR, d))
      .filter(p => statSync(p).isDirectory())
      .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
    dir = dirs[0];
  }
  const files = readdirSync(dir);
  const mp4 = files.find(f => f.startsWith('daily.') && f.endsWith('.mp4'));
  const txt = files.find(f => f.startsWith('daily.') && f.endsWith('.txt'));
  if (!mp4 || !txt) throw new Error(`No daily video/caption in ${dir}`);
  return { mp4: join(dir, mp4), caption: readFileSync(join(dir, txt), 'utf8'), date: dir.split('/').pop()! };
}

async function main() {
  const { mp4, caption, date } = findVideo(process.argv[2]);
  console.log(`Posting ${mp4}`);
  const id = await postVideoToInstagram(mp4, caption, `daily/${date}.mp4`);
  console.log(`LIVE! media id: ${id}`);
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
