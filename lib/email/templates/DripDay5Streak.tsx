import { Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { DripDay5Props } from '@/types/email';

export function DripDay5Streak({
  displayName,
  appUrl,
  unsubscribeUrl,
}: DripDay5Props) {
  return (
    <EmailLayout
      preview="22 puzzles. One shot. How far can you get?"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>Have you met the Daily Rook?</Text>

      <Text style={paragraph}>
        Hey {displayName} — every day we drop 22 fresh puzzles that climb
        from &ldquo;I got this&rdquo; to &ldquo;wait, is that legal?&rdquo;
        It&apos;s basically a mini boss fight for your brain.
      </Text>

      <Hr style={divider} />

      <Section style={featureBox}>
        <Text style={featureText}>
          <strong style={{ color: '#1CB0F6' }}>New every day</strong> — yesterday&apos;s
          are gone. Like Cinderella, but for tactics.
        </Text>
      </Section>

      <Section style={featureBox}>
        <Text style={featureText}>
          <strong style={{ color: '#FF9500' }}>400 → 2300 ELO</strong> — first 3
          are a warm hug. Puzzle 22 is not.
        </Text>
      </Section>

      <Section style={featureBox}>
        <Text style={featureText}>
          <strong style={{ color: '#CE82FF' }}>Track your progress</strong> — see
          how you improve day over day. Your only competition is yesterday&apos;s you.
        </Text>
      </Section>

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/daily-challenge`}>
          Try Today&apos;s Daily Rook
        </ChessButton>
      </Section>

      <Section style={tipBox}>
        <Text style={tipText}>
          <strong style={{ color: '#1CB0F6' }}>Rook fact:</strong> It looks boring
          and moves in straight lines, but in the endgame it&apos;s the CEO of
          the board. Respect the rook.
        </Text>
      </Section>

      <Section style={upsellBox}>
        <Text style={upsellText}>
          <strong>Want unlimited puzzles?</strong> Premium removes daily limits.
        </Text>
        <Section style={upsellButtonRow}>
          <ChessButton href={`${appUrl}/pricing`} variant="premium">
            See Premium Plans
          </ChessButton>
        </Section>
      </Section>

      <Text style={signoff}>
        May your rooks find open files,<br />
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

const featureBox = {
  backgroundColor: '#EEF6FC',
  borderRadius: '8px',
  margin: '0 0 8px 0',
  padding: '12px 16px',
};

const featureText = {
  color: '#2A3C45',
  fontSize: '14px',
  lineHeight: '21px',
  margin: '0',
};

const buttonContainer = { margin: '24px 0', textAlign: 'center' as const };

const tipBox = {
  backgroundColor: '#EEF6FC',
  borderRadius: '8px',
  padding: '12px 16px',
  margin: '0 0 20px 0',
};

const tipText = {
  color: '#6B7C8A',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
};

const upsellBox = {
  backgroundColor: '#FFFBEB',
  border: '1px solid #FDE68A',
  borderRadius: '10px',
  padding: '16px',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const upsellText = {
  color: '#2A3C45',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px 0',
};

const upsellButtonRow = { textAlign: 'center' as const };

const signoff = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

export default DripDay5Streak;
