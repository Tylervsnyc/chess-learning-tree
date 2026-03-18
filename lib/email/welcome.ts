import { sendEmail, getUnsubscribeUrl, getAppUrl } from './send';
import { Welcome } from './templates/Welcome';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * Send welcome email if user hasn't already received one.
 * Safe to call multiple times — deduplicates via email_log.
 */
export async function sendWelcomeIfNew(
  userId: string,
  email: string,
  displayName: string
) {
  if (!email) return;

  const supabase = createServiceClient();

  // Check if we already sent (or attempted) a welcome email to this user
  const { data: existing } = await supabase
    .from('email_log')
    .select('id')
    .eq('user_id', userId)
    .eq('email_type', 'welcome')
    .limit(1);

  if (existing && existing.length > 0) return;

  const appUrl = getAppUrl();
  const unsubscribeUrl = getUnsubscribeUrl(userId);

  await sendEmail({
    to: email,
    userId,
    type: 'welcome',
    subject: 'Welcome to Chess Path!',
    react: Welcome({ displayName, appUrl, unsubscribeUrl }),
  });
}
