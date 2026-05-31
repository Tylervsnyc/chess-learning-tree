import { Section, Text, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, SmallRookIcon } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { WinbackProps } from '@/types/email';

const UTM_BASE = 'utm_source=email&utm_medium=winback&utm_campaign=winback_14d';

const FEATURE_IMAGES = {
  run: 'https://chesspath.app/email/rookies-run-board.jpg',
  dailyRook: 'https://chesspath.app/email/dailyrook.png',
};

const PILL_COLORS: Record<string, { bg: string; shadow: string }> = {
  green: { bg: '#58CC02', shadow: '#3d8c01' },
  purple: { bg: '#CE82FF', shadow: '#a855f7' },
  blue: { bg: '#1CB0F6', shadow: '#0d7ec4' },
  orange: { bg: '#FF9600', shadow: '#cc6f00' },
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

export function Winback({
  displayName,
  appUrl,
  unsubscribeUrl,
}: WinbackProps) {
  const greeting = displayName ? `${displayName}. ` : '';
  const runHref = `${appUrl}/run?${UTM_BASE}&utm_content=run`;
  return (
    <EmailLayout
      preview="The board's still set up. It's been set up the whole time."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>The Board&apos;s Still Set Up</Text>

      <Section style={rookQuote}>
        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '48px', paddingRight: '10px', paddingTop: '4px' }}>
                <SmallRookIcon />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <Text style={quoteText}>
                  &ldquo;{greeting}It&apos;s been a while. I won&apos;t make it
                  weird. I&apos;ll just say I kept the board set up. It&apos;s
                  been set up the whole time. I taught a bishop to feel regret
                  while you were gone -- unrelated, mostly -- and I caught myself
                  thinking the Runs would&apos;ve been more fun with you here. Which
                  is a thing I apparently think now. There&apos;s a fresh one today.
                  The board&apos;s ready when you are.&rdquo;
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Hr style={divider} />

      <FeatureCard
        title="Rookie's Run"
        titleColor="orange"
        tagline="One Tap. A Fresh Run Today."
        description="No catching up, no guilt. There&apos;s a brand-new Run today, same as every day -- me against a board full of enemies, fighting to the other side. Play one. That&apos;s the whole ask. Today is a perfectly good day to start from."
        href={runHref}
        cta="Play Today's Run"
        imageUrl={FEATURE_IMAGES.run}
        imageAlt="Rookie's Run -- daily roguelike chess"
      />

      <Section style={buttonContainer}>
        <ChessButton href={runHref}>
          Come Back To The Board
        </ChessButton>
      </Section>

      <Text style={signoff}>
        I&apos;ll be right here,<br />
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

export default Winback;
