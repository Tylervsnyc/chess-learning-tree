import { Section, Text, Hr, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { WelcomeProps } from '@/types/email';

export function Welcome({
  displayName,
  appUrl,
  unsubscribeUrl,
}: WelcomeProps) {
  return (
    <EmailLayout
      preview="You're in! Here's everything waiting for you on Chess Path."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>You&apos;re in!</Text>

      <Text style={paragraph}>
        Welcome {displayName} — you just joined a chess tactics app that&apos;s
        basically Duolingo for not blundering your pieces. Here&apos;s what&apos;s
        waiting for you:
      </Text>

      <Hr style={divider} />

      <Section style={featureCard}>
        <Text style={featureEmoji}>&#x265F;</Text>
        <Text style={featureTitle}>Structured Lessons</Text>
        <Text style={featureDesc}>
          Forks, pins, skewers, discovered attacks — learn them step by step.
          Each lesson is a set of puzzles that gets progressively harder.
        </Text>
        <Link href={`${appUrl}/learn`} style={featureLink}>Start learning →</Link>
      </Section>

      <Section style={featureCard}>
        <Text style={featureEmoji}>&#x265C;</Text>
        <Text style={featureTitle}>The Daily Rook</Text>
        <Text style={featureDesc}>
          22 fresh puzzles every day, climbing from 400 to 2300 ELO.
          A mini boss fight for your brain. New set drops at midnight.
        </Text>
        <Link href={`${appUrl}/daily-challenge`} style={featureLink}>Try today&apos;s →</Link>
      </Section>

      <Section style={featureCard}>
        <Text style={featureEmoji}>&#x265A;</Text>
        <Text style={featureTitle}>Diagnostic Test</Text>
        <Text style={featureDesc}>
          Find your level so you&apos;re not stuck learning how the horsey
          moves. Skip ahead to where it actually gets challenging.
        </Text>
        <Link href={`${appUrl}/learn`} style={featureLink}>Take the test →</Link>
      </Section>

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/learn`}>
          Make Your First Move
        </ChessButton>
      </Section>

      <Section style={tipBox}>
        <Text style={tipText}>
          <strong style={{ color: '#1CB0F6' }}>Pro tip:</strong> Even 5 minutes
          a day adds up to 30 hours a year of tactics training. That&apos;s enough
          to go from &ldquo;is that a horse?&rdquo; to &ldquo;actually it&apos;s
          called a knight.&rdquo;
        </Text>
      </Section>

      <Text style={signoff}>
        May your bishops never be blocked,<br />
        The Chess Path Team
      </Text>
    </EmailLayout>
  );
}

const heading = {
  color: '#2A3C45',
  fontSize: '28px',
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

const featureCard = {
  backgroundColor: '#EEF6FC',
  borderRadius: '10px',
  padding: '16px',
  margin: '0 0 10px 0',
};

const featureEmoji = {
  fontSize: '24px',
  margin: '0 0 6px 0',
};

const featureTitle = {
  color: '#2A3C45',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const featureDesc = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '21px',
  margin: '0 0 8px 0',
};

const featureLink = {
  color: '#1CB0F6',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  textDecoration: 'none' as const,
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

const signoff = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

export default Welcome;
