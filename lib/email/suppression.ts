import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Addresses we must stop mailing.
 *
 * WHY THIS EXISTS: sendEmail() writes an email_log row with status 'sent' at
 * the moment Resend accepts the message. Whether it actually landed is decided
 * afterwards, and nothing ever wrote that back — so the database believed
 * every address was healthy while Resend knew several were dead. The Chess
 * Boxing launch send surfaced 6 bounces the DB had recorded as 'sent'.
 *
 * scripts/sync-email-bounces.ts reconciles email_log.status from Resend; this
 * is the read side. Every broadcast and every lifecycle send filters through
 * it, so one bounce anywhere retires the address everywhere.
 *
 * Suppression is keyed on the ADDRESS, not the user id: Apple private-relay
 * aliases (the bulk of real bounces — they die when someone revokes Sign in
 * with Apple) can outlive the profile row they were attached to.
 *
 * This is deliberately NOT email_preferences.unsubscribed_all. That column
 * means "the person asked us to stop", which is intent. This means "the
 * mailbox does not exist", which is fact. Conflating them would show a bounce
 * as an opt-out in every funnel we report on.
 */

const PAGE = 1000;

/**
 * ONLY 'bounced' means the mailbox is dead.
 *
 * 'failed' looks like it belongs here and does not: sendEmail() writes it when
 * the Resend API call itself errors, so those rows carry no resend_id and mean
 * "we never got the message out", which is usually transient. Including it
 * suppressed five perfectly live addresses — among them Tyler's own, which had
 * a 'failed' welcome row from March and had just received the launch email.
 *
 * 'bounced' is only ever written by scripts/sync-email-bounces.ts from
 * Resend's own delivery event, so it is authoritative.
 */
const DEAD = ['bounced'] as const;

export async function fetchSuppressedAddresses(
  supabase: SupabaseClient,
): Promise<Set<string>> {
  const out = new Set<string>();
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from('email_log')
      .select('email_address')
      .in('status', DEAD as unknown as string[])
      .range(from, from + PAGE - 1);

    if (error) {
      // A broadcast must not silently mail a list it could not screen.
      throw new Error(`suppression read failed: ${error.message}`);
    }
    for (const r of data ?? []) {
      if (r.email_address) out.add(String(r.email_address).toLowerCase());
    }
    if (!data || data.length < PAGE) break;
    from += PAGE;
  }

  return out;
}

/** Convenience for a single address. */
export function isSuppressed(suppressed: Set<string>, email: string | null): boolean {
  return !!email && suppressed.has(email.toLowerCase());
}
