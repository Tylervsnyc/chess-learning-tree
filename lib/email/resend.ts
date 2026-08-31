import { Resend } from 'resend';

// Lazy initialization to avoid issues during build time
let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export const EMAIL_FROM = process.env.EMAIL_FROM_ADDRESS || 'Rookie from Chess Path <noreply@chesspath.app>';

// Chess Boxing emails wear the Chess Boxing name. Same verified domain, so no
// new DNS — only the display name changes. cb_* types resolve to this in send.ts.
export const CB_EMAIL_FROM =
  process.env.CB_EMAIL_FROM_ADDRESS || 'Tyler from Chess Boxing <noreply@chesspath.app>';
