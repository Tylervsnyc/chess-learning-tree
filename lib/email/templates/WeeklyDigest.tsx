import { Section, Text, Hr, Row, Column } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { WeeklyDigestProps } from '@/types/email';

export function WeeklyDigest({
  displayName,
  puzzlesSolved,
  accuracy,
  currentStreak,
  eloChange,
  topTheme,
  appUrl,
  unsubscribeUrl,
}: WeeklyDigestProps) {
  const eloChangeText = eloChange >= 0 ? `+${eloChange}` : `${eloChange}`;
  const eloColor = eloChange >= 0 ? '#58CC02' : '#FF4B4B';

  return (
    <EmailLayout
      preview={`Your week in chess: ${puzzlesSolved} puzzles solved`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>
        Your Week in Chess
      </Text>

      <Text style={paragraph}>
        Hey {displayName}, here&apos;s how you did this week!
      </Text>

      {/* Stats Grid */}
      <Section style={statsGrid}>
        <Row>
          <Column style={statBox}>
            <Text style={statNumber}>{puzzlesSolved}</Text>
            <Text style={statLabel}>Puzzles Solved</Text>
          </Column>
          <Column style={statBox}>
            <Text style={statNumber}>{accuracy}%</Text>
            <Text style={statLabel}>Accuracy</Text>
          </Column>
        </Row>
        <Row>
          <Column style={statBox}>
            <Text style={statNumber}>{currentStreak}</Text>
            <Text style={statLabel}>Day Streak</Text>
          </Column>
          <Column style={statBox}>
            <Text style={{ ...statNumber, color: eloColor }}>{eloChangeText}</Text>
            <Text style={statLabel}>Rating Change</Text>
          </Column>
        </Row>
      </Section>

      {topTheme && (
        <>
          <Hr style={divider} />
          <Section style={highlightBox}>
            <Text style={highlightLabel}>🎯 Your Best Theme This Week</Text>
            <Text style={highlightValue}>{topTheme}</Text>
            <Text style={highlightSubtext}>
              Keep practicing to master more tactical patterns!
            </Text>
          </Section>
        </>
      )}

      <Hr style={divider} />

      {puzzlesSolved > 0 ? (
        <Text style={paragraph}>
          Great progress this week! Consistency is the key to chess improvement.
          Keep up the momentum!
        </Text>
      ) : (
        <Text style={paragraph}>
          Looks like you took a break this week. No worries - jump back in and
          pick up where you left off!
        </Text>
      )}

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/learn`}>
          Continue Learning
        </ChessButton>
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

const statsGrid = {
  margin: '24px 0',
};

const statBox = {
  backgroundColor: '#1A2C35',
  borderRadius: '8px',
  margin: '4px',
  padding: '16px',
  textAlign: 'center' as const,
};

const statNumber = {
  color: '#FFFFFF',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
};

const statLabel = {
  color: '#6B7C85',
  fontSize: '12px',
  margin: '4px 0 0 0',
  textTransform: 'uppercase' as const,
};

const divider = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: '24px 0',
};

const highlightBox = {
  backgroundColor: '#1A2C35',
  borderRadius: '12px',
  padding: '20px',
  textAlign: 'center' as const,
};

const highlightLabel = {
  color: '#6B7C85',
  fontSize: '12px',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
};

const highlightValue = {
  color: '#58CC02',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textTransform: 'capitalize' as const,
};

const highlightSubtext = {
  color: '#B8C5CC',
  fontSize: '14px',
  margin: '0',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

export default WeeklyDigest;
