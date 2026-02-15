import { Section, Text, Hr } from '@react-email/components';
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
      preview="Welcome to The Chess Path — your opening move starts here."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>
        Your opening move starts now
      </Text>

      <Text style={paragraph}>
        Hey {displayName},
      </Text>

      <Text style={paragraph}>
        Welcome to The Chess Path! We teach chess tactics through puzzles —
        think Duolingo, but instead of Spanish you learn how to fork a king
        and rook at the same time.
      </Text>

      <Text style={paragraph}>
        No boring lectures. No 400-page opening theory. Just you, a board,
        and that satisfying feeling when you spot the winning move.
      </Text>

      <Hr style={divider} />

      <Text style={sectionTitle}>Three moves to get started:</Text>

      <Section style={stepBox}>
        <Text style={stepNumber}>1</Text>
        <Text style={stepText}>
          <strong>Take the diagnostic test</strong> — We&apos;ll figure out
          your level so you&apos;re not stuck learning how the horsey moves.
        </Text>
      </Section>

      <Section style={stepBox}>
        <Text style={stepNumber}>2</Text>
        <Text style={stepText}>
          <strong>Solve daily puzzles</strong> — 5 minutes a day keeps the
          blunders away. (We made that up, but it&apos;s true.)
        </Text>
      </Section>

      <Section style={stepBox}>
        <Text style={stepNumber}>3</Text>
        <Text style={stepText}>
          <strong>Climb the skill tree</strong> — Forks, pins, skewers —
          learn the tactics that make your opponents say &ldquo;wait, what?&rdquo;
        </Text>
      </Section>

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/learn`}>
          Make Your First Move
        </ChessButton>
      </Section>

      <Hr style={divider} />

      <Section style={tipBox}>
        <Text style={tipTitle}>Fun fact</Text>
        <Text style={tipText}>
          The word &ldquo;checkmate&rdquo; comes from the Persian &ldquo;shāh māt&rdquo;
          — meaning &ldquo;the king is helpless.&rdquo; Don&apos;t worry, yours won&apos;t be.
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
  color: '#131F24',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#4B5563',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px 0',
};

const sectionTitle = {
  color: '#131F24',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const stepBox = {
  backgroundColor: '#F9FAFB',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  display: 'flex',
  margin: '0 0 12px 0',
  padding: '16px',
};

const stepNumber = {
  backgroundColor: '#58CC02',
  borderRadius: '50%',
  color: '#FFFFFF',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 'bold',
  height: '24px',
  lineHeight: '24px',
  marginRight: '12px',
  textAlign: 'center' as const,
  width: '24px',
  flexShrink: 0,
};

const stepText = {
  color: '#4B5563',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const divider = {
  borderColor: '#E5E7EB',
  margin: '24px 0',
};

const tipBox = {
  backgroundColor: '#EFF6FF',
  borderLeft: '4px solid #1CB0F6',
  borderRadius: '0 8px 8px 0',
  padding: '16px 20px',
  margin: '0 0 24px 0',
};

const tipTitle = {
  color: '#1CB0F6',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const tipText = {
  color: '#4B5563',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const signoff = {
  color: '#6B7280',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

export default Welcome;
