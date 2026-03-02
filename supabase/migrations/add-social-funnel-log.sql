-- Social Funnel Log — tracks all automated social engagement
-- Service-role only (RLS enabled, no user policies)

CREATE TABLE IF NOT EXISTS social_funnel_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,       -- dm_reply, comment_like, comment_reply, comment_dm, video_post, engagement_post
  platform TEXT NOT NULL,         -- instagram, twitter, youtube
  conversation_id TEXT,           -- Late.dev conversation ID (for DM dedup)
  comment_id TEXT,                -- Late.dev comment ID (for comment dedup)
  post_id TEXT,                   -- puzzle ID or post ID
  elo_detected INTEGER,           -- parsed ELO rating (null if none detected)
  link_sent TEXT,                 -- personalized link sent to user
  content_type TEXT,              -- engagement post type (for rotation dedup)
  metadata JSONB,                 -- extra context
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for dedup lookups
CREATE INDEX IF NOT EXISTS idx_social_funnel_conversation
  ON social_funnel_log (conversation_id, event_type)
  WHERE conversation_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_social_funnel_comment
  ON social_funnel_log (comment_id, event_type)
  WHERE comment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_social_funnel_post
  ON social_funnel_log (post_id, event_type)
  WHERE post_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_social_funnel_engagement_type
  ON social_funnel_log (event_type, content_type, created_at)
  WHERE event_type = 'engagement_post';

-- RLS: service-role only
ALTER TABLE social_funnel_log ENABLE ROW LEVEL SECURITY;
