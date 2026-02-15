import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { PaymentFailed } from '@/lib/email/templates/PaymentFailed';
import { verifyCronSecret } from '@/lib/cron-auth';
import { createServiceClient } from '@/lib/supabase/service';
import { stripe } from '@/lib/stripe';

const DUNNING_SCHEDULE = [
  { daysAfter: 3, attemptNumber: 2 as const, subject: 'Your Chess Path subscription is at risk' },
  { daysAfter: 7, attemptNumber: 3 as const, subject: 'Final notice — your subscription will be cancelled' },
];

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const appUrl = getAppUrl();

    const results = {
      sent: 0,
      skipped: 0,
      errors: 0,
    };

    for (const step of DUNNING_SCHEDULE) {
      // Find payment_failed emails sent exactly `daysAfter` days ago (with a 1-day window)
      const targetDate = new Date(Date.now() - step.daysAfter * 86400000);
      const windowStart = new Date(targetDate.getTime() - 12 * 3600000).toISOString(); // 12h before
      const windowEnd = new Date(targetDate.getTime() + 12 * 3600000).toISOString(); // 12h after

      // Find initial payment_failed emails (attempt 1) sent in the target window
      const { data: initialEmails, error } = await supabase
        .from('email_log')
        .select('user_id, email_address, metadata')
        .eq('email_type', 'payment_failed')
        .eq('status', 'sent')
        .gte('sent_at', windowStart)
        .lte('sent_at', windowEnd);

      if (error) {
        console.error(`Database error fetching dunning targets for attempt ${step.attemptNumber}:`, error);
        continue;
      }

      for (const emailRecord of initialEmails || []) {
        // Only follow up on attempt 1 (initial webhook email)
        const attemptNum = (emailRecord.metadata as Record<string, unknown>)?.attempt_number;
        if (attemptNum !== 1) {
          continue;
        }

        const userId = emailRecord.user_id;
        if (!userId) {
          results.skipped++;
          continue;
        }

        // Check if we already sent this dunning step
        const { data: alreadySent } = await supabase
          .from('email_log')
          .select('id')
          .eq('user_id', userId)
          .eq('email_type', 'payment_failed')
          .eq('status', 'sent')
          .filter('metadata->>attempt_number', 'eq', String(step.attemptNumber))
          .limit(1);

        if (alreadySent && alreadySent.length > 0) {
          results.skipped++;
          continue;
        }

        // Check if user has since resolved payment (subscription is active)
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, stripe_customer_id, display_name')
          .eq('id', userId)
          .single();

        if (!profile || profile.subscription_status === 'premium') {
          // Payment resolved, skip dunning
          results.skipped++;
          continue;
        }

        if (!profile.stripe_customer_id) {
          results.skipped++;
          continue;
        }

        try {
          // Generate fresh billing portal URL
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${appUrl}/settings`,
          });

          const stripeInvoiceId = (emailRecord.metadata as Record<string, unknown>)?.stripe_invoice_id as string | undefined;

          const result = await sendEmail({
            to: emailRecord.email_address,
            userId,
            type: 'payment_failed',
            subject: step.subject,
            react: PaymentFailed({
              displayName: profile.display_name || 'Chess Player',
              attemptNumber: step.attemptNumber,
              billingPortalUrl: portalSession.url,
              appUrl,
              unsubscribeUrl: getUnsubscribeUrl(userId, 'payment_failed'),
            }),
            metadata: {
              attempt_number: step.attemptNumber,
              stripe_customer_id: profile.stripe_customer_id,
              stripe_invoice_id: stripeInvoiceId || null,
            },
          });

          if (result.success) {
            results.sent++;
          } else {
            results.errors++;
          }
        } catch (error) {
          console.error(`Failed to send dunning email (attempt ${step.attemptNumber}) for user ${userId}:`, error);
          results.errors++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dunning cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
