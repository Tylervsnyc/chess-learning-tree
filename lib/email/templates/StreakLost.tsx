import { Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { StreakLostProps } from '@/types/email';

export function StreakLost({
  displayName,
  lostStreak,
  appUrl,
  unsubscribeUrl,
}: StreakLostProps) {
  return (
    <EmailLayout
      preview="Your streak ended - but you can start fresh!"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>
        Your streak ended
      </Text>

      <Text style={paragraph}>
        Hey {displayName},
      </Text>

      <Text style={paragraph}>
        Your <strong>{lostStreak}-day streak</strong> has come to an end. But don&apos;t
        worry - every chess master has setbacks. What matters is getting back on the board!
      </Text>

      <Section style={motivationBox}>
        <Text style={quoteText}>
          &ldquo;The most important thing in chess is the next game.&rdquo;
        </Text>
        <Text style={quoteAuthor}>— Garry Kasparov</Text>
      </Section>

      <Text style={paragraph}>
        The good news? You can start building a new streak right now. Your first puzzle
        of a new streak is always waiting.
      </Text>

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/daily-challenge`}>
          Start a New Streak
        </ChessButton>
      </Section>

      <Hr style={divider} />

      <Section style={statsBox}>
        <Text style={statsTitle}>Your Achievement</Text>
        <Text style={statsText}>
          You maintained a {lostStreak}-day streak - that&apos;s {lostStreak} days of
          dedicated practice. Now let&apos;s beat that record!
        </Text>
      </Section>
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

const motivationBox = {
  backgroundColor: '#1A2C35',
  borderLeft: '4px solid #58CC02',
  borderRadius: '0 8px 8px 0',
  margin: '24px 0',
  padding: '20px 24px',
};

const quoteText = {
  color: '#FFFFFF',
  fontSize: '18px',
  fontStyle: 'italic',
  lineHeight: '26px',
  margin: '0 0 8px 0',
};

const quoteAuthor = {
  color: '#6B7C85',
  fontSize: '14px',
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

const statsBox = {
  backgroundColor: '#1A2C35',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center' as const,
};

const statsTitle = {
  color: '#58CC02',
  fontSize: '12px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
};

const statsText = {
  color: '#B8C5CC',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

export default StreakLost;
