import { Section, Text, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { getMatteBackground } from '@/lib/daily-rook-blocks';
import type { StreakScienceProps } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=broadcast&utm_campaign=streak_science';

// Rook silhouette, recolored as fire: red at the base, yellow at the top.
// Static (table cells) so it renders in every email client, no JS or hosting.
const ROOK_GRID: (string | null)[][] = [
  ['#FFE08A', null, '#FFD24D', null, '#FFC23D'],
  ['#FFC23D', '#FFB020', '#FF9600', '#FF8A00', '#FF7A00'],
  [null, '#FF8A00', '#FF7A00', '#FF6A00', null],
  [null, '#FF6A00', '#F24A00', '#E83A00', null],
  [null, '#E83A00', '#E22A00', '#D42400', null],
  ['#FF7A00', '#F24A00', '#E22A00', '#D42400', '#C22000'],
];
const CELL = 14;

function FlamingRook() {
  return (
    <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
      <tbody>
        {ROOK_GRID.map((row, ri) => (
          <tr key={ri}>
            {row.map((color, ci) => (
              <td key={ci} style={{ width: CELL, height: CELL, padding: 1 }}>
                {color && (
                  <div
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 3,
                      backgroundColor: color,
                      background: getMatteBackground(color),
                    }}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HeroCard() {
  return (
    <Section style={heroCard}>
      <div style={{ marginBottom: '18px' }}>
        <FlamingRook />
      </div>
      <Text style={heroHeadline}>
        Showing up
        <br />
        <span style={{ color: '#FF9500' }}>beats talent.</span>
      </Text>
    </Section>
  );
}

function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
      <tbody>
        <tr>
          <td style={{ backgroundColor: '#58CC02', borderRadius: '12px', boxShadow: '0 3px 0 0 #46A302' }}>
            <Link
              href={href}
              style={{
                display: 'inline-block',
                color: '#FFFFFF',
                fontSize: '17px',
                fontWeight: 'bold',
                textDecoration: 'none',
                padding: '14px 34px',
              }}
            >
              {children}
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function StreakScience({ displayName, appUrl, unsubscribeUrl }: StreakScienceProps) {
  const greeting = displayName ? `${displayName}, ` : '';
  const link = (path: string) => `${appUrl}${path}?${UTM}`;

  return (
    <EmailLayout
      preview="A little practice every day beats a long grind once a month."
      unsubscribeUrl={unsubscribeUrl}
    >
      <HeroCard />

      <Text style={paragraph}>
        {greeting}nobody gets good at chess in one sitting. The players who improve
        are simply the ones who keep showing up.
      </Text>

      <Text style={paragraph}>
        A little practice every day beats a long grind once a month, and it&apos;s
        not willpower, it&apos;s how memory works. Chess is pattern recognition, and
        you only build it by seeing the shapes often. A few minutes a day quietly
        wins.
      </Text>

      <Text style={paragraph}>
        So we built streaks into Chess Path. Do <strong>anything</strong> in a day
        (a lesson, a puzzle, or a game) and the day counts. Keep it going and Rookie
        catches fire on your profile. That little bit of &ldquo;don&apos;t break
        the streak&rdquo; is the accountability that turns chess into a habit.
      </Text>

      <Section style={{ textAlign: 'center', margin: '24px 0 4px' }}>
        <CtaButton href={link('/')}>Start your streak today</CtaButton>
      </Section>

      <Text style={signoff}>
        See you on the board,
        <br />
        Rookie
      </Text>
    </EmailLayout>
  );
}

const heroCard = {
  background: 'linear-gradient(180deg, #2A3C45 0%, #33373f 55%, #3a2e26 100%)',
  backgroundColor: '#2A3C45',
  borderRadius: '16px',
  padding: '32px 24px 28px',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
};

const heroHeadline = {
  color: '#FFFFFF',
  fontSize: '40px',
  fontWeight: 'bold' as const,
  lineHeight: '42px',
  letterSpacing: '-1px',
  margin: '0',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#2A3C45',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px 0',
};

const signoff = {
  color: '#2A3C45',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0 0 0',
};

export default StreakScience;
