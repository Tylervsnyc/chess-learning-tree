import { Section, Text, Hr, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, SmallRookIcon } from './components/EmailLayout';
import { rookieRating, type EloSeriesPoint } from '@/lib/elo/rookie-rating';

const UTM_BASE = 'utm_source=email&utm_medium=blast&utm_campaign=rating_reveal';

export interface RatingRevealProps {
  displayName?: string;
  rating: number;
  series?: EloSeriesPoint[];
  appUrl: string;
  unsubscribeUrl: string;
}

/**
 * RatingReveal — a one-off Rookie-voiced email that shows the user their
 * estimated chess rating. Voice is shared with the in-app card via
 * lib/elo/rookie-rating.ts so Rookie sounds identical in both places.
 */
export function RatingReveal({
  displayName,
  rating,
  series = [],
  appUrl,
  unsubscribeUrl,
}: RatingRevealProps) {
  const greeting = displayName ? `${displayName}, ` : '';
  const r = rookieRating(rating, series);

  return (
    <EmailLayout
      preview="I worked out your chess rating. I have feelings about it."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>{r.headline}</Text>

      <Section style={rookQuote}>
        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '48px', paddingRight: '10px', paddingTop: '4px' }}>
                <SmallRookIcon />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <Text style={quoteText}>&ldquo;{greeting}{r.line}&rdquo;</Text>
                {r.trend && <Text style={quoteTextMuted}>&ldquo;{r.trend}&rdquo;</Text>}
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* The number */}
      <Section style={numberCard}>
        <Text style={numberLabel}>YOUR CHESS PATH ELO</Text>
        <Text style={numberValue}>{rating.toLocaleString()}</Text>
        <Text style={tierPill}>{r.tier}</Text>
      </Section>

      <Hr style={divider} />

      <Section style={{ textAlign: 'center' as const }}>
        <Text style={ctaIntro}>Want to watch it climb? Play me a game.</Text>
        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
          <tbody>
            <tr>
              <td style={ctaButton}>
                <Link href={`${appUrl}/play?${UTM_BASE}&utm_content=play`} style={ctaLink}>
                  Play Rookie
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
        <Text style={ctaSub}>
          Or check the full chart on{' '}
          <Link href={`${appUrl}/profile?${UTM_BASE}&utm_content=profile`} style={inlineLink}>
            your profile
          </Link>
          .
        </Text>
      </Section>
    </EmailLayout>
  );
}

const heading = {
  color: '#2A3C45',
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const rookQuote = {
  backgroundColor: '#EEF6FC',
  borderRadius: '10px',
  borderLeft: '3px solid #1CB0F6',
  padding: '12px 14px',
  margin: '0 0 16px 0',
};

const quoteText = {
  color: '#2A3C45',
  fontSize: '15px',
  lineHeight: '24px',
  fontStyle: 'italic' as const,
  margin: '0',
};

const quoteTextMuted = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  fontStyle: 'italic' as const,
  margin: '8px 0 0 0',
};

const numberCard = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #DCE8F0',
  borderRadius: '16px',
  padding: '20px',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const numberLabel = {
  color: '#6B7C8A',
  fontSize: '11px',
  fontWeight: 'bold' as const,
  letterSpacing: '0.5px',
  margin: '0 0 4px 0',
};

const numberValue = {
  color: '#2A3C45',
  fontSize: '52px',
  fontWeight: 'bold' as const,
  lineHeight: '1',
  margin: '0 0 10px 0',
};

const tierPill = {
  display: 'inline-block',
  backgroundColor: '#1CB0F6',
  color: '#FFFFFF',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  borderRadius: '999px',
  padding: '5px 14px',
  margin: '0',
};

const divider = { borderColor: '#EEF6FC', margin: '20px 0' };

const ctaIntro = {
  color: '#2A3C45',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  margin: '0 0 12px 0',
};

const ctaButton = {
  backgroundColor: '#FF9600',
  borderRadius: '10px',
  padding: '10px 24px',
  boxShadow: '0 2px 0 0 #cc6f00',
};

const ctaLink = {
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
};

const ctaSub = {
  color: '#6B7C8A',
  fontSize: '13px',
  margin: '14px 0 0 0',
};

const inlineLink = { color: '#1CB0F6', textDecoration: 'underline' };

export default RatingReveal;
