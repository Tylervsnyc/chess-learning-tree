import { Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { DripDay3Props } from '@/types/email';

export function DripDay3LeftOff({
  displayName,
  currentLevel,
  currentLesson,
  appUrl,
  unsubscribeUrl,
}: DripDay3Props) {
  return (
    <EmailLayout
      preview={`Your pieces miss you — ${currentLesson}`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>Your pieces miss you</Text>

      <Text style={paragraph}>
        Hey {displayName} — the rook&apos;s been pacing back and forth
        (straight lines only, so it&apos;s not great at pacing). The bishop
        keeps walking diagonally into walls. They need you back.
      </Text>

      <Hr style={divider} />

      <Section style={progressBox}>
        <Text style={progressLabel}>Where you left off</Text>
        <Text style={progressValue}>{currentLevel}</Text>
        <Text style={progressLesson}>{currentLesson}</Text>
      </Section>

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/learn`}>
          Rescue Your Pieces
        </ChessButton>
      </Section>

      <Section style={tipBox}>
        <Text style={tipText}>
          <strong style={{ color: '#1CB0F6' }}>30 seconds.</strong> That&apos;s
          one puzzle. Less time than reading this email.
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
        Your move,<br />
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

const progressBox = {
  backgroundColor: '#EEF6FC',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const progressLabel = {
  color: '#94A3B8',
  fontSize: '11px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  margin: '0 0 6px 0',
  textTransform: 'uppercase' as const,
};

const progressValue = {
  color: '#2A3C45',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 2px 0',
};

const progressLesson = {
  color: '#58CC02',
  fontSize: '14px',
  fontWeight: 'bold' as const,
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

export default DripDay3LeftOff;
