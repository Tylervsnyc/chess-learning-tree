import { createHmac } from 'crypto';
import { getResendClient, EMAIL_FROM, CB_EMAIL_FROM } from './resend';
import { createServiceClient } from '@/lib/supabase/service';
import type { SendEmailParams, EmailPreferences, EmailType } from '@/types/email';

// HMAC signing for unsubscribe tokens
function getHmacSecret(): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for HMAC signing');
  return secret;
}

export function generateUnsubscribeToken(userId: string, emailType?: string): string {
  const payload = emailType ? `${userId}:${emailType}` : userId;
  return createHmac('sha256', getHmacSecret()).update(payload).digest('hex');
}

export function verifyUnsubscribeToken(userId: string, emailType: string | undefined, token: string): boolean {
  const expected = generateUnsubscribeToken(userId, emailType);
  return token === expected;
}

// Check if user has opted out of this email type
function shouldSendEmail(
  preferences: EmailPreferences | null,
  emailType: EmailType
): boolean {
  // No preferences = send all emails
  if (!preferences) return true;

  // Transactional emails always send regardless of preferences
  const alwaysSendTypes: EmailType[] = ['welcome', 'patron_thank_you'];
  if (alwaysSendTypes.includes(emailType)) return true;

  // Global unsubscribe blocks everything except transactional
  if (preferences.unsubscribed_all) return false;

  // Check specific preference
  switch (emailType) {
    case 'drip_day1':
    case 'drip_day3':
    case 'drip_day7':
    case 'winback':
    case 'update_april_2026':
    case 'rating_reveal':
    case 'streak_science':
    case 'chess_boxing_launch':
    case 'cb_welcome':
    case 'cb_weekly_report':
    case 'cb_comeback':
    case 'cb_highscore':
    case 'cb_launch_party':
      return preferences.marketing;
    default:
      return true;
  }
}

// Log email to database
async function logEmail(
  params: {
    userId?: string;
    emailType: EmailType;
    emailAddress: string;
    resendId?: string;
    status: 'sent' | 'failed';
    metadata?: Record<string, unknown>;
  }
) {
  try {
    const supabase = createServiceClient();
    await supabase.from('email_log').insert({
      user_id: params.userId || null,
      email_type: params.emailType,
      email_address: params.emailAddress,
      resend_id: params.resendId || null,
      status: params.status,
      metadata: params.metadata || null,
    });
  } catch (error) {
    console.error('Failed to log email:', error);
  }
}

// Get user's email preferences
export async function getEmailPreferences(
  userId: string
): Promise<EmailPreferences | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('email_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  return data;
}

// Main send function
export async function sendEmail(params: SendEmailParams): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  const { to, userId, type, subject, react, metadata } = params;

  // Check preferences if we have a userId
  if (userId) {
    const preferences = await getEmailPreferences(userId);
    if (!shouldSendEmail(preferences, type)) {
      return {
        success: false,
        error: 'User has opted out of this email type'
      };
    }
  }

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: type.startsWith('cb_') ? CB_EMAIL_FROM : EMAIL_FROM,
      to,
      subject,
      react,
    });

    if (error) {
      await logEmail({
        userId,
        emailType: type,
        emailAddress: to,
        status: 'failed',
        metadata: { ...metadata, error: error.message },
      });
      return { success: false, error: error.message };
    }

    await logEmail({
      userId,
      emailType: type,
      emailAddress: to,
      resendId: data?.id,
      status: 'sent',
      metadata,
    });

    return { success: true, id: data?.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logEmail({
      userId,
      emailType: type,
      emailAddress: to,
      status: 'failed',
      metadata: { ...metadata, error: errorMessage },
    });
    return { success: false, error: errorMessage };
  }
}

// Generate unsubscribe URL with HMAC token
export function getUnsubscribeUrl(userId: string, emailType?: EmailType): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chesspath.app';
  const params = new URLSearchParams({ userId });
  if (emailType) params.append('type', emailType);
  const token = generateUnsubscribeToken(userId, emailType);
  params.append('token', token);
  return `${appUrl}/api/email/unsubscribe?${params.toString()}`;
}

// Get app URL helper
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://chesspath.app';
}
