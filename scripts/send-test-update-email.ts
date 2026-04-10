/**
 * Send the April 2026 update email (Play Rookie launch) to a single address for testing.
 *
 * Usage:
 *   npx tsx scripts/send-test-update-email.ts you@example.com
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getResendClient, EMAIL_FROM } from '../lib/email/resend';
import { UpdateApril2026 } from '../lib/email/templates/UpdateApril2026';
import { getAppUrl } from '../lib/email/send';

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error('Usage: npx tsx scripts/send-test-update-email.ts you@example.com');
    process.exit(1);
  }

  const resend = getResendClient();
  const appUrl = getAppUrl();

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: '[TEST] You can finally play me. (I\'m nervous.)',
    react: UpdateApril2026({
      displayName: 'Tyler',
      appUrl,
      unsubscribeUrl: `${appUrl}/api/email/unsubscribe?test=1`,
    }),
  });

  if (error) {
    console.error('Failed to send:', error);
    process.exit(1);
  }

  console.log(`Sent test email to ${to} (id: ${data?.id})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
