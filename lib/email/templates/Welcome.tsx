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
      preview="Welcome to The Chess Path - your journey begins!"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>
        Welcome to The Chess Path!
      </Text>

      <Text style={paragraph}>
        Hey {displayName},
      </Text>

      <Text style={paragraph}>
        We&apos;re excited to have you join us! The Chess Path is designed to help
        you improve your chess skills through focused practice and a structured
        learning curriculum.
      </Text>

      <Hr style={divider} />

      <Text style={sectionTitle}>Here&apos;s how to get started:</Text>

      <Section style={stepBox}>
        <Text style={stepNumber}>1</Text>
        <Text style={stepText}>
          <strong>Take the diagnostic test</strong> - We&apos;ll figure out your
          current skill level and create a personalized learning path.
        </Text>
      </Section>

      <Section style={stepBox}>
        <Text style={stepNumber}>2</Text>
        <Text style={stepText}>
          <strong>Complete daily puzzles</strong> - Build your streak and keep
          your tactics sharp with a new puzzle every day.
        </Text>
      </Section>

      <Section style={stepBox}>
        <Text style={stepNumber}>3</Text>
        <Text style={stepText}>
          <strong>Master the skill tree</strong> - Work through lessons on forks,
          pins, skewers, and more to level up your game.
        </Text>
      </Section>

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/learn`}>
          Start Your Journey
        </ChessButton>
      </Section>

      <Hr style={divider} />

      <Section style={tipBox}>
        <Text style={tipTitle}>💡 Pro Tip</Text>
        <Text style={tipText}>
          The best way to improve at chess is consistent practice. Try to solve
          at least a few puzzles every day, and you&apos;ll be surprised how
          quickly you improve!
        </Text>
      </Section>

      <Text style={signoff}>
        Happy learning!<br />
        The Chess Path Team
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

const sectionTitle = {
  color: '#FFFFFF',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const stepBox = {
  backgroundColor: '#1A2C35',
  borderRadius: '8px',
  display: 'flex',
  margin: '0 0 12px 0',
  padding: '16px',
};

const stepNumber = {
  backgroundColor: '#58CC02',
  borderRadius: '50%',
  color: '#131F24',
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
  color: '#B8C5CC',
  fontSize: '14px',
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

const tipBox = {
  backgroundColor: '#1A2C35',
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
  color: '#B8C5CC',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const signoff = {
  color: '#B8C5CC',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

export default Welcome;
