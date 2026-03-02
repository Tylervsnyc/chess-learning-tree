import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/cron-auth';
import {
  getCommentablePosts,
  getPostComments,
  likeComment,
  replyToComment,
  privateReplyToComment,
  ACCOUNTS,
} from '@/lib/late';
import { parseElo, eloToTier, buildLink } from '@/lib/social/elo-mapper';
import { getCommentReply, getDmReply } from '@/lib/social/response-templates';
import {
  logFunnelEvent,
  hasEngagedComment,
} from '@/lib/social/funnel-tracker';

type PostWithComments = {
  id: string;
  commentCount: number;
};

type Comment = {
  id: string;
  text: string;
  authorId: string;
};

/**
 * Comment Engagement Cron — runs every 2 hours.
 * - Auto-likes all comments
 * - Replies to comments containing ELO numbers
 * - Instagram: sends private DM with personalized link
 */
export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const platforms = ['instagram', 'twitter', 'youtube'] as const;
  let liked = 0;
  let replied = 0;
  let dmsent = 0;
  let errors = 0;

  for (const platform of platforms) {
    try {
      const accountId = ACCOUNTS[platform];
      const postsData = await getCommentablePosts(accountId);
      const posts: PostWithComments[] = postsData?.data || postsData || [];

      for (const post of posts) {
        if (!post.commentCount || post.commentCount === 0) continue;

        try {
          const commentsData = await getPostComments(post.id, accountId);
          const comments: Comment[] = commentsData?.data || commentsData || [];

          for (const comment of comments) {
            // --- Auto-like all comments ---
            if (!(await hasEngagedComment(comment.id, 'comment_like'))) {
              try {
                await likeComment(comment.id, accountId);
                await logFunnelEvent({
                  event_type: 'comment_like',
                  platform,
                  comment_id: comment.id,
                  post_id: post.id,
                });
                liked++;
              } catch (err) {
                console.error(`Failed to like comment ${comment.id}:`, err);
                errors++;
              }
            }

            // --- Reply to ELO comments ---
            const elo = parseElo(comment.text || '');
            if (elo === null) continue;

            const tier = eloToTier(elo);

            // Public reply (encouraging, no link)
            if (!(await hasEngagedComment(comment.id, 'comment_reply'))) {
              try {
                const publicReply = getCommentReply(tier, elo);
                await replyToComment(accountId, post.id, publicReply, comment.id);
                await logFunnelEvent({
                  event_type: 'comment_reply',
                  platform,
                  comment_id: comment.id,
                  post_id: post.id,
                  elo_detected: elo,
                });
                replied++;
              } catch (err) {
                console.error(`Failed to reply to comment ${comment.id}:`, err);
                errors++;
              }
            }

            // Instagram only: private DM with personalized link
            if (
              platform === 'instagram' &&
              !(await hasEngagedComment(comment.id, 'comment_dm'))
            ) {
              try {
                const link = buildLink(elo, {
                  source: 'instagram',
                  medium: 'social_comment',
                  campaign: 'elo_funnel',
                });
                const dmText = getDmReply(tier, elo, link);
                await privateReplyToComment(accountId, comment.id, dmText);
                await logFunnelEvent({
                  event_type: 'comment_dm',
                  platform: 'instagram',
                  comment_id: comment.id,
                  post_id: post.id,
                  elo_detected: elo,
                  link_sent: link,
                });
                dmsent++;
              } catch (err) {
                console.error(`Failed to DM commenter ${comment.id}:`, err);
                errors++;
              }
            }
          }
        } catch (err) {
          console.error(`Failed to process post ${post.id} comments:`, err);
          errors++;
        }
      }
    } catch (err) {
      console.error(`Failed to process ${platform} comments:`, err);
      errors++;
    }
  }

  return NextResponse.json({ ok: true, liked, replied, dmsent, errors });
}
