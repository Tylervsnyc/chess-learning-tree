import { Section, Text, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, SmallRookIcon } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';
import type { DripDay7Props } from '@/types/email';

const UTM_BASE = 'utm_source=email&utm_medium=drip&utm_campaign=drip_day7';

const FEATURE_IMAGES = {
  run: 'https://chesspath.app/email/rookies-run-board.jpg',
  path: 'https://chesspath.app/email/chesspath.png',
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

export function DripDay7({
  displayName,
  appUrl,
  unsubscribeUrl,
  currentStreak,
}: DripDay7Props) {
  const greeting = displayName ? `${displayName}, ` : '';
  const hasStreak = typeof currentStreak === 'number' && currentStreak > 0;
  return (
    <EmailLayout
      preview="One week in. I'm keeping notes. Don't worry about it."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>It&apos;s Been A Week</Text>

      <Section style={rookQuote}>
        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '48px', paddingRight: '10px', paddingTop: '4px' }}>
                <SmallRookIcon />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <Text style={quoteText}>
                  &ldquo;{greeting}it&apos;s been seven days since you joined. I&apos;ve
                  been keeping notes. Not on you, specifically. Mostly on me. I think
                  I&apos;m -- attached? My king says that&apos;s &lsquo;unprofessional.&rsquo;
                  He filed something. Point is, the players who show up every day are
                  the ones who actually get good. There&apos;s a fresh Run waiting --
                  one a day, every day. Show up for today&apos;s and keep the streak
                  going.&rdquo;
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {hasStreak && (
        <Section style={streakBadge}>
          <Text style={streakText}>
            Your streak right now: <strong style={{ color: '#FF9600' }}>{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</strong>. Today&apos;s Run keeps it alive.
          </Text>
        </Section>
      )}

      <Hr style={divider} />

      <FeatureCard
        title="Rookie's Run"
        titleColor="orange"
        tagline="Your Daily Reason To Show Up"
        description="A fresh Run drops every day -- me against a board full of enemies, fighting to the other side. It&apos;s the same idea as a streak, except it&apos;s also me, in peril, asking you to show up. Rooks understand consistency. Today&apos;s Run is waiting."
        href={`${appUrl}/run?${UTM_BASE}&utm_content=run`}
        cta="Play Today's Run"
        imageUrl={FEATURE_IMAGES.run}
        imageAlt="Rookie's Run -- daily roguelike chess"
      />

      <FeatureCard
        title="Path"
        titleColor="green"
        tagline="The Habit That Compounds"
        description="A few puzzles a day is all it takes. Each one builds on the last -- forks lead to pins, pins lead to skewers, and one day the pattern just appears in your head before you finish reading the board."
        href={`${appUrl}/path?${UTM_BASE}&utm_content=path`}
        cta="Continue Training"
        imageUrl={FEATURE_IMAGES.path}
        imageAlt="The Path -- structured chess lessons"
      />

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/run?${UTM_BASE}&utm_content=cta`}>
          Play Today's Run
        </ChessButton>
      </Section>

      <Text style={signoff}>
        Taking notes, fondly,<br />
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

const streakBadge = {
  backgroundColor: '#FFF7E6',
  borderRadius: '10px',
  border: '1px solid #FFE2A8',
  padding: '10px 14px',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const streakText = {
  color: '#2A3C45',
  fontSize: '14px',
  lineHeight: '20px',
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

export default DripDay7;
