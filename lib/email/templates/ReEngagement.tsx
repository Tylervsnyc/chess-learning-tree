import { Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { ReEngagementProps } from '@/types/email';

export function ReEngagement({
  displayName,
  daysSinceLastPlay,
  previousStreak,
  appUrl,
  unsubscribeUrl,
}: ReEngagementProps) {
  return (
    <EmailLayout
      preview="We miss you at The Chess Path!"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>
        We miss you!
      </Text>

      <Text style={paragraph}>
        Hey {displayName},
      </Text>

      <Text style={paragraph}>
        It&apos;s been {daysSinceLastPlay} days since your last chess puzzle.
        Your chess skills are waiting to be sharpened!
      </Text>

      <Section style={messageBox}>
        <Text style={messageText}>
          {previousStreak > 0 ? (
            <>
              Remember when you had a {previousStreak}-day streak?
              That kind of consistency shows real dedication.
              Let&apos;s get back to building those skills!
            </>
          ) : (
            <>
              Every chess master started somewhere. The best time to
              improve is today. Let&apos;s work on some puzzles together!
            </>
          )}
        </Text>
      </Section>

      <Hr style={divider} />

      <Text style={sectionTitle}>What&apos;s waiting for you:</Text>

      <Section style={featureList}>
        <Text style={featureItem}>
          ✓ Fresh daily challenges ready to solve
        </Text>
        <Text style={featureItem}>
          ✓ New puzzles based on your skill level
        </Text>
        <Text style={featureItem}>
          ✓ Your progress is saved - pick up where you left off
        </Text>
      </Section>

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/daily-challenge`}>
          Jump Back In
        </ChessButton>
      </Section>

      <Hr style={divider} />

      <Text style={footerNote}>
        Just 5 minutes a day can make a big difference in your chess game.
        We&apos;re here to help you improve, one puzzle at a time.
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

const messageBox = {
  backgroundColor: '#1A2C35',
  borderRadius: '12px',
  margin: '24px 0',
  padding: '24px',
  textAlign: 'center' as const,
};

const messageText = {
  color: '#FFFFFF',
  fontSize: '18px',
  fontStyle: 'italic',
  lineHeight: '28px',
  margin: '0',
};

const divider = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: '24px 0',
};

const sectionTitle = {
  color: '#FFFFFF',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const featureList = {
  margin: '0 0 24px 0',
};

const featureItem = {
  color: '#B8C5CC',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 8px 0',
  paddingLeft: '8px',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const footerNote = {
  color: '#6B7C85',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '20px',
  margin: '0',
  textAlign: 'center' as const,
};

export default ReEngagement;
