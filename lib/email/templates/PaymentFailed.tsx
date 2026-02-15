import { Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { PaymentFailedProps } from '@/types/email';

const CONTENT = {
  1: {
    subject: 'Your payment failed — update your billing info',
    preview: 'Your latest payment didn\'t go through. Update your billing info to keep your subscription.',
    heading: 'Your payment didn\'t go through',
    body: 'We couldn\'t process your latest payment. This usually happens when a card expires or has insufficient funds. Update your billing info to keep your premium access.',
    buttonText: 'Update Billing Info',
    urgency: 'low' as const,
  },
  2: {
    subject: 'Your Chess Path subscription is at risk',
    preview: 'We still can\'t process your payment. Update your billing info to avoid losing premium access.',
    heading: 'Your subscription is at risk',
    body: 'We\'ve tried to process your payment again but it still didn\'t go through. If we can\'t collect payment soon, you\'ll lose access to premium features including unlimited puzzles and all lesson content.',
    buttonText: 'Fix Payment Now',
    urgency: 'medium' as const,
  },
  3: {
    subject: 'Final notice — your subscription will be cancelled',
    preview: 'This is your last chance to update your billing info before your subscription is cancelled.',
    heading: 'Final notice: subscription cancellation',
    body: 'This is your last chance to update your billing info. If we can\'t process your payment, your subscription will be cancelled and you\'ll lose access to all premium content. Don\'t let your progress go to waste.',
    buttonText: 'Save My Subscription',
    urgency: 'high' as const,
  },
};

export function PaymentFailed({
  displayName,
  attemptNumber,
  billingPortalUrl,
  appUrl,
  unsubscribeUrl,
}: PaymentFailedProps) {
  const content = CONTENT[attemptNumber];

  return (
    <EmailLayout
      preview={content.preview}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>
        {content.urgency === 'high' ? '🚨' : content.urgency === 'medium' ? '⚠️' : '💳'} {content.heading}
      </Text>

      <Text style={paragraph}>
        Hey {displayName},
      </Text>

      <Text style={paragraph}>
        {content.body}
      </Text>

      {content.urgency !== 'low' && (
        <Section style={warningBox}>
          <Text style={warningText}>
            {content.urgency === 'high'
              ? 'Your subscription will be cancelled if payment is not updated.'
              : 'Premium access will be suspended without a valid payment method.'}
          </Text>
        </Section>
      )}

      <Section style={buttonContainer}>
        <ChessButton href={billingPortalUrl}>
          {content.buttonText}
        </ChessButton>
      </Section>

      <Hr style={divider} />

      <Text style={tipText}>
        If you&apos;ve already updated your payment method, you can ignore this email.
        Having trouble? Reply to this email and we&apos;ll help.
      </Text>
    </EmailLayout>
  );
}

const heading = {
  color: '#FFFFFF',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#B8C5CC',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const warningBox = {
  backgroundColor: '#2A1A1A',
  border: '1px solid #FF4444',
  borderRadius: '12px',
  margin: '24px 0',
  padding: '16px 20px',
  textAlign: 'center' as const,
};

const warningText = {
  color: '#FF6B6B',
  fontSize: '14px',
  fontWeight: 'bold',
  lineHeight: '20px',
  margin: '0',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const divider = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: '24px 0',
};

const tipText = {
  color: '#6B7C85',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

export default PaymentFailed;
