import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/cron-auth';
import { getLatestRender, postVideoAsDraft } from '@/lib/social/video-poster';
import { logFunnelEvent, hasPostedVideo } from '@/lib/social/funnel-tracker';

/**
 * Daily Video Post Cron — runs daily at noon UTC.
 * Reads the latest rendered puzzle video and uploads as a draft to Late.dev.
 * Tyler approves the draft before it goes live.
 */
export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the latest rendered video
    const render = getLatestRender();
    if (!render) {
      return NextResponse.json({
        ok: false,
        error: 'No rendered videos found in video-puzzle-usage.json',
      });
    }

    // Dedup: don't post same puzzle twice
    if (await hasPostedVideo(render.puzzleId)) {
      return NextResponse.json({
        ok: true,
        skipped: `Already posted puzzle ${render.puzzleId}`,
      });
    }

    // Upload video and create draft post
    const { post, caption } = await postVideoAsDraft(render);

    // Log to funnel
    await logFunnelEvent({
      event_type: 'video_post',
      platform: 'all',
      post_id: render.puzzleId,
      metadata: {
        file: render.file,
        date: render.date,
        caption: caption.slice(0, 200),
        latePostId: (post as { id?: string })?.id,
      },
    });

    return NextResponse.json({
      ok: true,
      puzzleId: render.puzzleId,
      file: render.file,
      status: 'draft_created',
    });
  } catch (error) {
    console.error('Daily video post failed:', error);
    return NextResponse.json(
      { error: 'Video posting failed', details: String(error) },
      { status: 500 }
    );
  }
}
