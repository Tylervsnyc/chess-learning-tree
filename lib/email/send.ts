import { getResendClient, EMAIL_FROM } from './resend';
import { createClient } from '@supabase/supabase-js';
import type { SendEmailParams, EmailPreferences, EmailType } from '@/types/email';

// Create a Supabase client with service role for cron jobs
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase URL or service role key not configured');
  }

  return createClient(url, serviceKey);
}

// Check if user has opted out of this email type
function shouldSendEmail(
  preferences: EmailPreferences | null,
  emailType: EmailType
): boolean {
  // No preferences = send all emails
  if (!preferences) return true;

  // Global unsubscribe blocks everything
  if (preferences.unsubscribed_all) return false;

  // Check specific preference
  switch (emailType) {
    case 'streak_warning':
    case 'streak_lost':
      return preferences.streak_warnings;
    case 'weekly_digest':
      return preferences.weekly_digest;
    case 'welcome':
      return true; // Always send welcome emails
    case 're_engagement':
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
    const supabase = getServiceClient();
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
  const supabase = getServiceClient();
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
      from: EMAIL_FROM,
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

// Generate unsubscribe URL
export function getUnsubscribeUrl(userId: string, emailType?: EmailType): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chesspath.app';
  const params = new URLSearchParams({ userId });
  if (emailType) params.append('type', emailType);
  return `${appUrl}/api/email/unsubscribe?${params.toString()}`;
}

// Get app URL helper
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://chesspath.app';
}
