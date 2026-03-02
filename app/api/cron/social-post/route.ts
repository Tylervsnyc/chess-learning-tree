import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/cron-auth';
import { createPost, getBestTimeToPost, ACCOUNTS } from '@/lib/late';
import { getEngagementPost } from '@/lib/social/response-templates';
import { logFunnelEvent, getRecentPostTypes } from '@/lib/social/funnel-tracker';

/**
 * Engagement Content Cron — runs daily at 6pm UTC.
 * Picks a non-recently-used engagement post template and saves as draft in Late.dev.
 * Tyler approves before publishing.
 */
export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get recent post types to avoid repeats
    const recentTypes = await getRecentPostTypes(3);

    // Pick a non-recent engagement post
    const post = getEngagementPost(recentTypes);
    if (!post) {
      return NextResponse.json({
        ok: true,
        skipped: 'All engagement types used recently — waiting for rotation',
      });
    }

    // Try to get optimal schedule time
    let scheduleDate: string | undefined;
    try {
      const bestTime = await getBestTimeToPost(ACCOUNTS.instagram);
      if (bestTime) scheduleDate = bestTime;
    } catch {
      // No schedule = saves as draft
    }

    // Create draft post
    const result = await createPost({
      content: post.text,
      platforms: post.platforms,
      scheduleDate,
      publishNow: false, // Draft — Tyler approves
    });

    // Log to funnel
    await logFunnelEvent({
      event_type: 'engagement_post',
      platform: post.platforms.join(','),
      content_type: post.type,
      metadata: {
        latePostId: result?.id,
        scheduleDate,
      },
    });

    return NextResponse.json({
      ok: true,
      type: post.type,
      platforms: post.platforms,
      status: 'draft_created',
    });
  } catch (error) {
    console.error('Engagement post failed:', error);
    return NextResponse.json(
      { error: 'Engagement post failed', details: String(error) },
      { status: 500 }
    );
  }
}
