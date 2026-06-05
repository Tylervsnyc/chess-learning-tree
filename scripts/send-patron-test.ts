import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Resend } from 'resend';
import { PatronThankYou } from '@/lib/email/templates/PatronThankYou';

async function main() {
  const to = process.argv[2] || 'tyler@learnthroughstories.com';
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM_ADDRESS || 'Rookie from Chess Path <noreply@chesspath.app>',
    to,
    subject: 'A thank you, from Tyler',
    react: PatronThankYou({
      displayName: 'Tyler',
      appUrl: 'https://chesspath.app',
      unsubscribeUrl: 'https://chesspath.app/api/email/unsubscribe?preview=1',
    }),
  });

  if (error) {
    console.error('Send failed:', error);
    process.exit(1);
  }
  console.log(`Sent to ${to} — id: ${data?.id}`);
}

main();
