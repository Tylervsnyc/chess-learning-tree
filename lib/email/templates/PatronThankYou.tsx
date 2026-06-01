import { Section, Text, Hr, Img } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';

export interface PatronThankYouProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
}

export function PatronThankYou({
  displayName,
  appUrl,
  unsubscribeUrl,
}: PatronThankYouProps) {
  const greeting = displayName ? `${displayName}, thank you.` : 'Thank you.';
  const headshotUrl = `${appUrl}/email/tyler-headshot.jpg`;

  return (
    <EmailLayout
      preview="A personal thank you from Tyler, the person behind Chess Path."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>{greeting}</Text>

      <Section style={signatureBlock}>
        <Img
          src={headshotUrl}
          alt="Tyler, founder of Chess Path"
          width={220}
          style={headshot}
        />
        <Text style={fromName}>Tyler</Text>
        <Text style={fromRole}>I make Chess Path</Text>
      </Section>

      <Text style={body}>
        I want to say this myself, not through Rookie.
      </Text>

      <Text style={body}>
        I love chess. And I love making things for people who love chess. Chess
        Path is a labor of that love -- every puzzle, every lesson, every weird
        little detail Rookie says along the way.
      </Text>

      <Text style={body}>
        Becoming a patron doesn&apos;t unlock anything you didn&apos;t already
        have. You just decided to back this thing because you believe in it.
        That means more to me than I can really put into an email. It&apos;s what
        keeps me building.
      </Text>

      <Text style={body}>
        So, truly: thank you. Your support means a lot.
      </Text>

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/profile`} variant="premium">
          See Your Gold Profile
        </ChessButton>
      </Section>

      <Hr style={divider} />

      <Text style={signoff}>
        See you on the board,<br />
        Tyler
      </Text>
    </EmailLayout>
  );
}

const heading = {
  color: '#2A3C45',
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const signatureBlock = {
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
};

const headshot = {
  borderRadius: '12px',
  display: 'block' as const,
  margin: '0 auto 14px',
  height: 'auto' as const,
  maxWidth: '100%',
};

const fromName = {
  color: '#2A3C45',
  fontSize: '17px',
  fontWeight: 'bold' as const,
  margin: '0',
  textAlign: 'center' as const,
};

const fromRole = {
  color: '#6B7C8A',
  fontSize: '13px',
  margin: '2px 0 0 0',
  textAlign: 'center' as const,
};

const body = {
  color: '#2A3C45',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const buttonContainer = { margin: '28px 0 8px', textAlign: 'center' as const };

const divider = { borderColor: '#EEF6FC', margin: '24px 0 20px' };

const signoff = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

export default PatronThankYou;
