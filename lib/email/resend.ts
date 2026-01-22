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

export const EMAIL_FROM = process.env.EMAIL_FROM_ADDRESS || 'The Chess Path <noreply@chesspath.com>';
