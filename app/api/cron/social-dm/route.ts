import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/cron-auth';
import { getConversations, getConversationMessages, sendInboxMessage, ACCOUNTS } from '@/lib/late';
import { mapEloToLink } from '@/lib/social/elo-mapper';
import { getDmReply } from '@/lib/social/response-templates';
import { logFunnelEvent, hasRepliedToConversation } from '@/lib/social/funnel-tracker';

type Conversation = {
  id: string;
  accountId: string;
  platform: string;
};

type Message = {
  direction: string;
  text: string;
};

/**
 * DM Polling Cron — runs every 30 min.
 * Polls all 3 platforms for unread conversations, auto-replies with personalized links.
 */
export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const platforms = ['instagram', 'twitter', 'youtube'] as const;
  let replied = 0;
  let skipped = 0;
  let errors = 0;

  for (const platform of platforms) {
    try {
      const accountId = ACCOUNTS[platform];
      const conversations = await getConversations(accountId);
      const convos: Conversation[] = conversations?.data || conversations || [];

      for (const convo of convos) {
        try {
          // Skip if already replied
          if (await hasRepliedToConversation(convo.id)) {
            skipped++;
            continue;
          }

          // Get messages to find what they said
          const messages = await getConversationMessages(convo.id, accountId);
          const msgList: Message[] = messages?.data || messages || [];
          const inbound = msgList.filter((m) => m.direction === 'inbound');

          if (inbound.length === 0) {
            skipped++;
            continue;
          }

          // Use the latest inbound message for ELO parsing
          const latestMessage = inbound[inbound.length - 1];
          const { elo, tier, link } = mapEloToLink(latestMessage.text || '', {
            source: platform,
            medium: 'social_dm',
          });

          const reply = getDmReply(tier, elo, link);

          // Send reply via Late API
          await sendInboxMessage(convo.id, accountId, reply);

          // Log
          await logFunnelEvent({
            event_type: 'dm_reply',
            platform,
            conversation_id: convo.id,
            elo_detected: elo,
            link_sent: link,
          });

          replied++;
        } catch (err) {
          console.error(`Failed to process conversation ${convo.id}:`, err);
          errors++;
        }
      }
    } catch (err) {
      console.error(`Failed to poll ${platform} DMs:`, err);
      errors++;
    }
  }

  return NextResponse.json({ ok: true, replied, skipped, errors });
}
