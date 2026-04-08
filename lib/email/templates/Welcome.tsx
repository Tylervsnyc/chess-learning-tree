import { Section, Text, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, MiniRookIcon } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { WelcomeProps } from '@/types/email';

const UTM_BASE = 'utm_source=email&utm_medium=welcome&utm_campaign=welcome_features';

const FEATURE_IMAGES = {
  path: 'https://chesspath.app/email/chesspath.png',
  openings: 'https://chesspath.app/email/openingtree.png',
  dailyRook: 'https://chesspath.app/email/dailyrook.png',
};

const PILL_COLORS: Record<string, { bg: string; shadow: string }> = {
  green: { bg: '#58CC02', shadow: '#3d8c01' },
  purple: { bg: '#CE82FF', shadow: '#a855f7' },
  blue: { bg: '#1CB0F6', shadow: '#0d7ec4' },
};

function PillTitle({ text, color, href }: { text: string; color: keyof typeof PILL_COLORS; href: string }) {
  const c = PILL_COLORS[color];
  return (
    <table cellPadding="0" cellSpacing="0" role="presentation">
      <tbody>
        <tr>
          <td
            style={{
              backgroundColor: c.bg,
              borderRadius: '8px',
              padding: '4px 12px',
              boxShadow: `0 2px 0 0 ${c.shadow}`,
            }}
          >
            <Link href={href} style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>
              {text}
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function FeatureCard({
  title,
  titleColor,
  tagline,
  description,
  href,
  cta,
  imageUrl,
  imageAlt,
}: {
  title: string;
  titleColor: keyof typeof PILL_COLORS;
  tagline: string;
  description: string;
  href: string;
  cta: string;
  imageUrl: string;
  imageAlt: string;
}) {
  const c = PILL_COLORS[titleColor];
  return (
    <Section style={featureCard}>
      <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={textCell}>
              <div style={{ marginBottom: '6px' }}>
                <PillTitle text={title} color={titleColor} href={href} />
              </div>
              <Text style={featureTagline}>{tagline}</Text>
              <Text style={featureDesc}>{description}</Text>
              <table cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td
                      style={{
                        backgroundColor: c.bg,
                        borderRadius: '10px',
                        padding: '10px 20px',
                        boxShadow: `0 3px 0 0 ${c.shadow}`,
                      }}
                    >
                      <Link
                        href={href}
                        style={{
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textDecoration: 'none',
                        }}
                      >
                        {cta}
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style={imageCell}>
              <Link href={href}>
                <Img
                  src={imageUrl}
                  alt={imageAlt}
                  width={200}
                  height={200}
                  style={featureImage}
                />
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

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
      <Text style={heading}>Your Chess Era Starts Now!</Text>

      <Section style={rookQuote}>
        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '36px', paddingRight: '10px', paddingTop: '4px' }}>
                <MiniRookIcon />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <Text style={quoteText}>
                  &ldquo;I&apos;m Rookie, and I&apos;m here to make sure you
                  actually get better at chess -- the fun way. Here are the
                  three ways to play:&rdquo;
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Hr style={divider} />

      <FeatureCard
        title="Path"
        titleColor="green"
        tagline="Tactical Trainer"
        description="Incredible puzzles that take you from beginner to 2000 ELO. Forks, pins, skewers, discovered attacks -- each lesson builds on the last, getting harder as you level up."
        href={`${appUrl}/path?${UTM_BASE}&utm_content=path`}
        cta="Start Training"
        imageUrl={FEATURE_IMAGES.path}
        imageAlt="The Path -- structured chess lessons"
      />

      <FeatureCard
        title="Openings"
        titleColor="purple"
        tagline="Opening Theory Trainer"
        description="Learn real opening lines move by move. Master the Italian Game, Sicilian Defense, London System, and more. Every move is backed by the Lichess masters database -- no bad habits."
        href={`${appUrl}/openings?${UTM_BASE}&utm_content=openings`}
        cta="Learn An Opening"
        imageUrl={FEATURE_IMAGES.openings}
        imageAlt="Openings -- interactive opening trainer"
      />

      <FeatureCard
        title="Daily"
        titleColor="blue"
        tagline="Wordle, But For Chess"
        description="22 fresh puzzles every single day, climbing from 400 to 2300 ELO. It&apos;s a mini boss fight for your brain. A new set drops at midnight -- see how far you can get."
        href={`${appUrl}/daily-challenge?${UTM_BASE}&utm_content=daily_rook`}
        cta="Play Today's"
        imageUrl={FEATURE_IMAGES.dailyRook}
        imageAlt="The Daily Rook -- daily puzzle challenge"
      />

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/path?${UTM_BASE}&utm_content=cta`}>
          Make Your First Move
        </ChessButton>
      </Section>

      <Text style={signoff}>
        See you on the board,<br />
        Rookie
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

const rookQuote = {
  backgroundColor: '#EEF6FC',
  borderRadius: '10px',
  borderLeft: '3px solid #1CB0F6',
  padding: '12px 14px',
  margin: '0 0 8px 0',
};

const quoteText = {
  color: '#2A3C45',
  fontSize: '15px',
  lineHeight: '24px',
  fontStyle: 'italic' as const,
  margin: '0',
};

const divider = { borderColor: '#EEF6FC', margin: '20px 0' };

const featureCard = {
  backgroundColor: '#EEF6FC',
  borderRadius: '12px',
  border: '1px solid #DCE8F0',
  padding: '16px',
  margin: '0 0 12px 0',
};

const textCell = {
  verticalAlign: 'top' as const,
  paddingRight: '12px',
  width: '50%',
};

const imageCell = {
  verticalAlign: 'top' as const,
  width: '50%',
};

const featureImage = {
  borderRadius: '8px',
  width: '100%',
  height: 'auto',
  display: 'block' as const,
};

const featureTagline = {
  color: '#2A3C45',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  lineHeight: '20px',
  margin: '0 0 6px 0',
};

const featureDesc = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 14px 0',
};

const buttonContainer = { margin: '24px 0', textAlign: 'center' as const };

const signoff = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

export default Welcome;
