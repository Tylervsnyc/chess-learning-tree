import { NextRequest, NextResponse } from 'next/server';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { publishReel } from '@/lib/instagram';
import { loadQueue, saveQueue, nextForDate, queueRunway, tierOf } from '@/lib/ig-queue';
import { postToSlack } from '@/lib/slack/notify';

// Posting is gated by a flag, per the growth guardrails. Set IG_AUTOPOST=true
// (Vercel env) to go live; anything else is a dry run that logs but doesn't post.
const AUTOPOST = process.env.IG_AUTOPOST === 'true';

// Below this many unposted reels in a tier, say so in Slack. The refill Action
// (.github/workflows/ig-refill.yml) should keep every tier well above it.
const LOW_WATER = 4;

// Allow up to 5 min — IG video processing can take a couple minutes.
export const maxDuration = 300;

export const GET = withCronHeartbeat('ig-post', async (_request: NextRequest) => {
  const queue = await loadQueue();
  const pick = nextForDate(queue, new Date());

  if (!pick) {
    await postToSlack('reports', 'IG autopost: queue is EMPTY — nothing posted today. ' +
      'Run: npx tsx scripts/ig-refill.ts --top-up --max=20');
    return NextResponse.json({ ok: true, posted: false, reason: 'queue empty' });
  }

  const { item: next, wantedTier, fellBack } = pick;

  if (!AUTOPOST) {
    return NextResponse.json({
      ok: true,
      posted: false,
      reason: 'IG_AUTOPOST not true (dry run)',
      wantedTier,
      fellBack,
      wouldPost: { date: next.date, tier: tierOf(next), caption: next.caption.slice(0, 60) },
    });
  }

  const mediaId = await publishReel(next.videoUrl, next.caption);

  next.posted = true;
  next.postedAt = new Date().toISOString();
  next.mediaId = mediaId;
  await saveQueue(queue);

  // Never run dry silently again: a fallback or a low tier goes to Slack.
  const runway = queueRunway(queue);
  const low = (Object.keys(runway) as (keyof typeof runway)[]).filter(t => runway[t].count < LOW_WATER);
  if (fellBack || low.length) {
    await postToSlack('reports', [
      fellBack ? `IG autopost: wanted a ${wantedTier} reel, bucket empty — posted ${tierOf(next)} instead.` : null,
      low.length ? `IG queue low: ${low.map(t => `${t} ${runway[t].count}`).join(', ')}.` : null,
      'The daily refill Action should catch up; if not: npx tsx scripts/ig-refill.ts --top-up --max=20',
    ].filter(Boolean).join('\n'));
  }

  return NextResponse.json({
    ok: true,
    posted: true,
    date: next.date,
    tier: tierOf(next),
    wantedTier,
    fellBack,
    mediaId,
    remaining: Object.fromEntries(Object.entries(runway).map(([t, r]) => [t, r.count])),
  });
});
