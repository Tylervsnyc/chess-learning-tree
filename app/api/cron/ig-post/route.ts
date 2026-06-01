import { NextRequest, NextResponse } from 'next/server';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { publishReel } from '@/lib/instagram';
import { loadQueue, saveQueue, nextUnposted } from '@/lib/ig-queue';

// Posting is gated by a flag, per the growth guardrails. Set IG_AUTOPOST=true
// (Vercel env) to go live; anything else is a dry run that logs but doesn't post.
const AUTOPOST = process.env.IG_AUTOPOST === 'true';

// Allow up to 5 min — IG video processing can take a couple minutes.
export const maxDuration = 300;

export const GET = withCronHeartbeat('ig-post', async (_request: NextRequest) => {
  const queue = await loadQueue();
  const next = nextUnposted(queue);

  if (!next) {
    return NextResponse.json({ ok: true, posted: false, reason: 'queue empty' });
  }

  if (!AUTOPOST) {
    return NextResponse.json({
      ok: true,
      posted: false,
      reason: 'IG_AUTOPOST not true (dry run)',
      wouldPost: { date: next.date, caption: next.caption.slice(0, 60) },
    });
  }

  const mediaId = await publishReel(next.videoUrl, next.caption);

  next.posted = true;
  next.postedAt = new Date().toISOString();
  next.mediaId = mediaId;
  await saveQueue(queue);

  const remaining = queue.filter(i => !i.posted).length;
  return NextResponse.json({ ok: true, posted: true, date: next.date, mediaId, remaining });
});
