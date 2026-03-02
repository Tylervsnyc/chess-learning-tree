// Social Funnel Tracker — dedup + Supabase logging
// Table: social_funnel_log (service-role only, RLS enabled)

import { createServiceClient } from '@/lib/supabase/service';

export type FunnelEventType =
  | 'dm_reply'
  | 'comment_like'
  | 'comment_reply'
  | 'comment_dm'
  | 'video_post'
  | 'engagement_post';

export type FunnelEvent = {
  event_type: FunnelEventType;
  platform: string;
  conversation_id?: string;
  comment_id?: string;
  post_id?: string;
  elo_detected?: number | null;
  link_sent?: string;
  content_type?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Log a funnel event to Supabase
 */
export async function logFunnelEvent(event: FunnelEvent): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from('social_funnel_log').insert({
    event_type: event.event_type,
    platform: event.platform,
    conversation_id: event.conversation_id || null,
    comment_id: event.comment_id || null,
    post_id: event.post_id || null,
    elo_detected: event.elo_detected ?? null,
    link_sent: event.link_sent || null,
    content_type: event.content_type || null,
    metadata: event.metadata || null,
  });

  if (error) {
    console.error('Failed to log funnel event:', error);
  }
}

/**
 * Check if we've already replied to a conversation (dedup DMs)
 */
export async function hasRepliedToConversation(
  conversationId: string
): Promise<boolean> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('social_funnel_log')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('event_type', 'dm_reply')
    .limit(1);

  return (data?.length ?? 0) > 0;
}

/**
 * Check if we've already engaged with a comment (dedup comments)
 */
export async function hasEngagedComment(
  commentId: string,
  eventType: FunnelEventType
): Promise<boolean> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('social_funnel_log')
    .select('id')
    .eq('comment_id', commentId)
    .eq('event_type', eventType)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

/**
 * Get recent engagement post types (last N days) for dedup
 */
export async function getRecentPostTypes(days: number = 3): Promise<string[]> {
  const supabase = createServiceClient();
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const { data } = await supabase
    .from('social_funnel_log')
    .select('content_type')
    .eq('event_type', 'engagement_post')
    .gte('created_at', since);

  return (data || []).map((row) => row.content_type).filter(Boolean) as string[];
}

/**
 * Check if a video has already been posted (dedup daily video)
 */
export async function hasPostedVideo(puzzleId: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('social_funnel_log')
    .select('id')
    .eq('event_type', 'video_post')
    .eq('post_id', puzzleId)
    .limit(1);

  return (data?.length ?? 0) > 0;
}
