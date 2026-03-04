import { Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { DripDay7Props } from '@/types/email';

export function DripDay7Premium({
  displayName,
  appUrl,
  unsubscribeUrl,
}: DripDay7Props) {
  return (
    <EmailLayout
      preview="One week in — want to keep going?"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>Want to keep going?</Text>

      <Text style={paragraph}>
        Hey {displayName} — you&apos;ve been at it for a week. If you&apos;re
        bumping into daily limits, Premium removes them.
      </Text>

      <Hr style={divider} />

      {/* Premium pitch card — gold/orange accent like the in-app modal */}
      <Section style={premiumCard}>
        <Text style={premiumHeading}>Unlimited Chess Path</Text>

        <Text style={premiumFeature}>Unlimited puzzles every day</Text>
        <Text style={premiumFeature}>All 8 levels unlocked</Text>
        <Text style={premiumFeature}>No ads</Text>

        <Section style={priceRow}>
          <Text style={priceAmount}>$4.99</Text>
          <Text style={pricePeriod}>/month</Text>
        </Section>

        <Section style={buttonContainer}>
          <ChessButton href={`${appUrl}/pricing`} variant="premium">
            See Premium
          </ChessButton>
        </Section>

        <Text style={cancelNote}>Cancel anytime</Text>
      </Section>

      <Hr style={divider} />

      <Text style={tipText}>
        Totally optional — the free plan works great for casual practice.
        Premium is there whenever you want it.
      </Text>

      <Text style={signoff}>
        Keep at it,<br />
        The Chess Path Team
      </Text>
    </EmailLayout>
  );
}

const heading = {
  color: '#2A3C45',
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#2A3C45',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 8px 0',
};

const divider = { borderColor: '#EEF6FC', margin: '20px 0' };

const premiumCard = {
  backgroundColor: '#FFFBEB',
  border: '1px solid #FDE68A',
  borderRadius: '12px',
  padding: '24px 20px',
  textAlign: 'center' as const,
};

const premiumHeading = {
  color: '#2A3C45',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const premiumFeature = {
  color: '#2A3C45',
  fontSize: '14px',
  lineHeight: '16px',
  margin: '0 0 8px 0',
};

const priceRow = {
  margin: '16px 0 0 0',
  textAlign: 'center' as const,
};

const priceAmount = {
  color: '#58CC02',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1',
  display: 'inline' as const,
};

const pricePeriod = {
  color: '#6B7C8A',
  fontSize: '14px',
  margin: '0',
  display: 'inline' as const,
};

const buttonContainer = { margin: '20px 0 12px', textAlign: 'center' as const };

const cancelNote = {
  color: '#94A3B8',
  fontSize: '12px',
  margin: '0',
};

const tipText = {
  color: '#6B7C8A',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 20px 0',
};

const signoff = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

export default DripDay7Premium;
