import { NextRequest, NextResponse } from 'next/server';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { publishReel } from '@/lib/instagram';
import { loadQueue, saveQueue, nextForDate } from '@/lib/ig-queue';

// Posting is gated by a flag, per the growth guardrails. Set IG_AUTOPOST=true
// (Vercel env) to go live; anything else is a dry run that logs but doesn't post.
const AUTOPOST = process.env.IG_AUTOPOST === 'true';

// Allow up to 5 min — IG video processing can take a couple minutes.
export const maxDuration = 300;

export const GET = withCronHeartbeat('ig-post', async (_request: NextRequest) => {
  const queue = await loadQueue();
  const pick = nextForDate(queue, new Date());

  if (!pick) {
    return NextResponse.json({ ok: true, posted: false, reason: 'queue empty' });
  }

  const { item: next, wantedDifficult, fellBack } = pick;

  if (!AUTOPOST) {
    return NextResponse.json({
      ok: true,
      posted: false,
      reason: 'IG_AUTOPOST not true (dry run)',
      wantedDifficult,
      fellBack,
      wouldPost: { date: next.date, difficult: !!next.difficult, caption: next.caption.slice(0, 60) },
    });
  }

  const mediaId = await publishReel(next.videoUrl, next.caption);

  next.posted = true;
  next.postedAt = new Date().toISOString();
  next.mediaId = mediaId;
  await saveQueue(queue);

  const remainingNormal = queue.filter(i => !i.posted && !i.difficult).length;
  const remainingDifficult = queue.filter(i => !i.posted && i.difficult).length;
  return NextResponse.json({
    ok: true,
    posted: true,
    date: next.date,
    difficult: !!next.difficult,
    wantedDifficult,
    fellBack,
    mediaId,
    remaining: { normal: remainingNormal, difficult: remainingDifficult },
  });
});
