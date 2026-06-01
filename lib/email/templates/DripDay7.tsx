import { Section, Text, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, SmallRookIcon } from './components/EmailLayout';
import type { DripDay7Props } from '@/types/email';

const UTM_BASE = 'utm_source=email&utm_medium=drip&utm_campaign=drip_day7';

const FEATURE_IMAGES = {
  play: 'https://iklsd8qlm1eiwekn.public.blob.vercel-storage.com/email/play-thumb-lQaKaUIMzuK25yTmglKIYmS4A7Puao.png',
  tactics: 'https://iklsd8qlm1eiwekn.public.blob.vercel-storage.com/email/tactics-thumb-0FdHyIdLSWaIKLUKNWfuUGIhdJVpmN.png',
  learn: 'https://iklsd8qlm1eiwekn.public.blob.vercel-storage.com/email/learn-thumb-PAGdUJevECbwv0sH116nkvDXuaNHCU.png',
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
            <td style={{ verticalAlign: 'middle', width: '120px', paddingRight: '14px' }}>
              <Link href={href}>
                <Img src={imageUrl} alt={imageAlt} width="120" height="120" style={featureImage} />
              </Link>
            </td>
            <td style={{ verticalAlign: 'middle' }}>
              <div style={{ marginBottom: '4px' }}>
                <PillTitle text={title} color={titleColor} href={href} />
              </div>
              <Text style={featureTagline}>{tagline}</Text>
              <table cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td
                      style={{
                        backgroundColor: c.bg,
                        borderRadius: '8px',
                        padding: '6px 14px',
                        boxShadow: `0 2px 0 0 ${c.shadow}`,
                      }}
                    >
                      <Link
                        href={href}
                        style={{
                          color: '#FFFFFF',
                          fontSize: '13px',
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
                  &ldquo;{greeting}a week in and I think I&apos;m attached. The
                  players who show up daily are the ones who get good.&rdquo;
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {hasStreak && (
        <Section style={streakBadge}>
          <Text style={streakText}>
            Your streak right now: <strong style={{ color: '#FF9600' }}>{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</strong>. One game today keeps it alive.
          </Text>
        </Section>
      )}

      <Hr style={divider} />

      <FeatureCard
        title="Play"
        titleColor="orange"
        tagline="Your Daily Reason To Show Up"
        description="One game a day. That&apos;s the habit."
        href={`${appUrl}/play?${UTM_BASE}&utm_content=play`}
        cta="Play Rookie"
        imageUrl={FEATURE_IMAGES.play}
        imageAlt="Play Rookie"
      />

      <FeatureCard
        title="Tactics"
        titleColor="green"
        tagline="The Habit That Compounds"
        description="A few a day, until the pattern appears."
        href={`${appUrl}/path?${UTM_BASE}&utm_content=path`}
        cta="Continue Training"
        imageUrl={FEATURE_IMAGES.tactics}
        imageAlt="Daily tactics"
      />

      <FeatureCard
        title="Learn"
        titleColor="purple"
        tagline="Learn A Real Opening"
        description="Real lines, one move at a time."
        href={`${appUrl}/openings?${UTM_BASE}&utm_content=openings`}
        cta="Learn An Opening"
        imageUrl={FEATURE_IMAGES.learn}
        imageAlt="Learn openings"
      />
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
  padding: '12px',
  margin: '0 0 12px 0',
};

const featureImage = {
  borderRadius: '8px',
  width: '120px',
  height: '120px',
  display: 'block' as const,
};

const featureTagline = {
  color: '#2A3C45',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  lineHeight: '18px',
  margin: '0 0 8px 0',
};

const featureDesc = {
  color: '#6B7C8A',
  fontSize: '13px',
  lineHeight: '18px',
  margin: '0 0 8px 0',
};

export default DripDay7;
