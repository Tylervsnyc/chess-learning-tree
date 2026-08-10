/**
 * Slack notification helper — one place that knows how to post to a channel.
 *
 * Two webhooks, deliberately separate:
 *  - SLACK_WEBHOOK_URL        the daily reports / morning brief channel
 *  - SLACK_LIVE_WEBHOOK_URL   #chessboxing, the real-time pulse channel
 *
 * Never throws: a monitoring tool that can crash the thing it monitors is
 * worse than no monitoring. Returns whether the post landed.
 *
 * NOTE (hard-won, see CLAUDE.md): the Vercel CLI silently stores EMPTY env
 * values, so a webhook that "looks set" may be an empty string. Always treat
 * a missing/blank URL as "not configured" and say so in the return value
 * rather than assuming it worked.
 */

export type SlackChannel = 'reports' | 'live';

function webhookFor(channel: SlackChannel): string | null {
  const raw =
    channel === 'live'
      ? process.env.SLACK_LIVE_WEBHOOK_URL
      : process.env.SLACK_WEBHOOK_URL;
  const url = (raw ?? '').trim();
  return url.startsWith('https://hooks.slack.com/') ? url : null;
}

export async function postToSlack(
  channel: SlackChannel,
  text: string,
  blocks?: unknown[]
): Promise<{ ok: boolean; reason?: string }> {
  const url = webhookFor(channel);
  if (!url) return { ok: false, reason: 'webhook not configured' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Slack caps a message around 40k chars.
      body: JSON.stringify({ text: text.slice(0, 38000), ...(blocks ? { blocks } : {}) }),
    });
    if (!res.ok) {
      return { ok: false, reason: `HTTP ${res.status}: ${(await res.text()).slice(0, 120)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}
