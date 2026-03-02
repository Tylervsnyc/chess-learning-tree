// Late.dev - Unified Social Media API client
// Docs: https://docs.getlate.dev

const LATE_API_URL = 'https://getlate.dev/api/v1';

const ACCOUNTS = {
  instagram: '69a5a9b2dc8cab9432b27187',
  twitter: '69a5a9d4dc8cab9432b271e7',
  youtube: '69a5a9e3dc8cab9432b27202',
} as const;

type Platform = keyof typeof ACCOUNTS;

function getApiKey(): string {
  const key = process.env.LATE_API_KEY;
  if (!key) throw new Error('LATE_API_KEY not set in environment');
  return key;
}

function headers() {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    'Content-Type': 'application/json',
  };
}

async function lateRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${LATE_API_URL}${path}`, {
    ...options,
    headers: { ...headers(), ...options.headers },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Late API error ${res.status}: ${body}`);
  }

  return res.json();
}

// --- Posts ---

export type PostOptions = {
  content: string;
  platforms?: Platform[];
  mediaUrls?: string[];
  scheduleDate?: string; // ISO 8601
  publishNow?: boolean;
};

export async function createPost({
  content,
  platforms = ['instagram', 'twitter', 'youtube'],
  mediaUrls,
  scheduleDate,
  publishNow = false,
}: PostOptions) {
  const platformAccounts = platforms.map((p) => ({
    platform: p,
    accountId: ACCOUNTS[p],
  }));

  return lateRequest('/posts/create-post', {
    method: 'POST',
    body: JSON.stringify({
      content,
      platforms: platformAccounts,
      mediaUrls,
      scheduledFor: scheduleDate,
      publishNow,
    }),
  });
}

export async function getPosts(limit = 20) {
  return lateRequest(`/posts/list-posts?limit=${limit}`);
}

export async function deletePost(postId: string) {
  return lateRequest(`/posts/${postId}`, { method: 'DELETE' });
}

// --- Media Upload ---

/**
 * Upload media to Late.dev via presigned URL flow.
 * 1. GET presigned upload URL
 * 2. PUT file buffer to presigned URL
 * 3. Return the publicUrl for use in posts
 */
export async function uploadMedia(
  fileBuffer: Uint8Array,
  filename: string,
  contentType: string
): Promise<string> {
  // Step 1: Get presigned upload URL
  const params = new URLSearchParams({ filename, contentType });
  const { uploadUrl, publicUrl } = await lateRequest(
    `/media/get-media-presigned-url?${params}`
  );

  // Step 2: Upload to presigned URL
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: fileBuffer as unknown as BodyInit,
  });

  if (!uploadRes.ok) {
    throw new Error(`Media upload failed: ${uploadRes.status}`);
  }

  return publicUrl;
}

// --- Inbox / Conversations (DMs) ---

export async function getConversations(accountId?: string) {
  const params = accountId ? `?accountId=${accountId}` : '';
  return lateRequest(`/messages/list-inbox-conversations${params}`);
}

export async function getConversationMessages(
  conversationId: string,
  accountId: string
) {
  const params = new URLSearchParams({ conversationId, accountId });
  return lateRequest(`/messages/get-inbox-conversation-messages?${params}`);
}

export async function sendInboxMessage(
  conversationId: string,
  accountId: string,
  text: string
) {
  return lateRequest('/messages/send-inbox-message', {
    method: 'POST',
    body: JSON.stringify({ conversationId, accountId, text }),
  });
}

// --- Comments ---

/**
 * List posts with comment counts
 */
export async function getCommentablePosts(accountId?: string) {
  const params = accountId ? `?accountId=${accountId}` : '';
  return lateRequest(`/comments/list-inbox-comments${params}`);
}

/**
 * Get comments on a specific post
 */
export async function getPostComments(postId: string, accountId: string) {
  const params = new URLSearchParams({ postId, accountId });
  return lateRequest(`/comments/get-inbox-post-comments?${params}`);
}

/**
 * Reply to a post or specific comment
 */
export async function replyToComment(
  accountId: string,
  postId: string,
  text: string,
  parentCommentId?: string
) {
  return lateRequest('/comments/reply-to-inbox-post', {
    method: 'POST',
    body: JSON.stringify({
      accountId,
      postId,
      text,
      ...(parentCommentId && { parentCommentId }),
    }),
  });
}

/**
 * Like a comment
 */
export async function likeComment(commentId: string, accountId: string) {
  const params = new URLSearchParams({ commentId, accountId });
  return lateRequest(`/comments/like-inbox-comment?${params}`, {
    method: 'POST',
  });
}

/**
 * Send a private reply to a comment (Instagram/Facebook only — 7-day window, one per comment)
 */
export async function privateReplyToComment(
  accountId: string,
  commentId: string,
  message: string
) {
  return lateRequest('/comments/send-private-reply-to-comment', {
    method: 'POST',
    body: JSON.stringify({ accountId, commentId, message }),
  });
}

// --- Webhooks (post events only — no DM events) ---

export async function registerWebhook(
  name: string,
  url: string,
  events: string[]
) {
  return lateRequest('/webhooks/settings', {
    method: 'POST',
    body: JSON.stringify({ name, url, events, isActive: true }),
  });
}

export async function getWebhooks() {
  return lateRequest('/webhooks/settings');
}

// --- Analytics ---

export async function getAnalytics(accountId?: string) {
  const query = accountId ? `?accountId=${accountId}` : '';
  return lateRequest(`/analytics${query}`);
}

/**
 * Get best time to post for an account.
 * Returns optimal posting time or null.
 */
export async function getBestTimeToPost(
  accountId: string
): Promise<string | null> {
  try {
    const data = await lateRequest(
      `/analytics/get-best-time-to-post?accountId=${accountId}`
    );
    return data?.bestTime || null;
  } catch {
    return null;
  }
}

// --- Helpers ---

export { ACCOUNTS };
export type { Platform };
