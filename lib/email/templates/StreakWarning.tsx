import { Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { StreakWarningProps } from '@/types/email';

export function StreakWarning({
  displayName,
  currentStreak,
  appUrl,
  unsubscribeUrl,
}: StreakWarningProps) {
  const streakEmoji = currentStreak >= 7 ? '🔥' : '⚡';

  return (
    <EmailLayout
      preview={`Your ${currentStreak}-day streak is at risk!`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>
        {streakEmoji} Your streak is at risk!
      </Text>

      <Text style={paragraph}>
        Hey {displayName},
      </Text>

      <Text style={paragraph}>
        You haven&apos;t played today and your <strong>{currentStreak}-day streak</strong> is about
        to end! Don&apos;t let all that progress slip away.
      </Text>

      <Section style={streakBox}>
        <Text style={streakNumber}>{currentStreak}</Text>
        <Text style={streakLabel}>day streak</Text>
      </Section>

      <Text style={paragraph}>
        Just one puzzle is all it takes to keep your streak alive. It only takes a minute!
      </Text>

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/daily-challenge`}>
          Save My Streak
        </ChessButton>
      </Section>

      <Hr style={divider} />

      <Text style={tipText}>
        💡 <strong>Tip:</strong> Try setting a daily reminder to play at the same time each day.
        Consistency is key to improvement!
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

const streakBox = {
  backgroundColor: '#1A2C35',
  borderRadius: '12px',
  margin: '24px 0',
  padding: '24px',
  textAlign: 'center' as const,
};

const streakNumber = {
  color: '#FF9600',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0',
};

const streakLabel = {
  color: '#6B7C85',
  fontSize: '14px',
  margin: '4px 0 0 0',
  textTransform: 'uppercase' as const,
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

export default StreakWarning;
