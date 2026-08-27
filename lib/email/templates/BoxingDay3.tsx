import { Section, Text, Hr, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import {
  BoxingButton,
  PillTitle,
  RookQuote,
  StatRow,
  boxingBody,
  boxingButtonContainer,
  boxingDivider,
  boxingHeading,
  boxingSignoff,
  boxingSubheading,
} from './components/BoxingBits';
import type { BoxingDay3Props } from '@/types/email';

const UTM_BASE = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_day3';

/**
 * cb_day3 — boxed, then went quiet for three days.
 *
 * Leads with their own fight record, because the record is the thing they came
 * for and the thing that stops moving when they stop showing up.
 */
export function BoxingDay3({
  displayName,
  appUrl,
  unsubscribeUrl,
  wins = 0,
  losses = 0,
  draws = 0,
  bestRound,
}: BoxingDay3Props) {
  const greeting = displayName ? `${displayName}. ` : '';
  const boutHref = `${appUrl}/box/bout?${UTM_BASE}&utm_content=bout`;
  const workoutHref = `${appUrl}/workout?${UTM_BASE}&utm_content=workout`;

  const total = wins + losses + draws;
  const stats: { label: string; value: string }[] = [
    { label: 'Record', value: `${wins}-${losses}-${draws}` },
    { label: 'Bouts fought', value: String(total) },
  ];
  if (typeof bestRound === 'number' && bestRound > 0) {
    stats.push({ label: 'Best round', value: String(bestRound) });
  }

  return (
    <EmailLayout
      preview="Your record has not moved in three days. I checked. Twice."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={boxingHeading}>Three Days, Same Record</Text>
      <Text style={boxingSubheading}>The mitts are still up.</Text>

      <RookQuote>
        &ldquo;{greeting}I have been standing here holding the pads for three
        days. I am a rook. I do not have arms. You can imagine how this looks.
        Come throw something.&rdquo;
      </RookQuote>

      {total > 0 && <StatRow items={stats} />}

      <Hr style={boxingDivider} />

      <Section style={modeCard}>
        <div style={{ marginBottom: '6px' }}>
          <PillTitle text="BOUT MODE" color="purple" href={boutHref} />
        </div>
        <Text style={boxingBody}>
          Your ranked bout for today is unused. One game, split across the card,
          board freezes at the bell. Ten minutes and the record moves.
        </Text>
        <Link href={boutHref} style={inlineLink}>
          Fight a bout &rarr;
        </Link>
      </Section>

      <Section style={modeCard}>
        <div style={{ marginBottom: '6px' }}>
          <PillTitle text="PUZZLE BOXING" color="green" href={workoutHref} />
        </div>
        <Text style={boxingBody}>
          Shorter. Puzzle rounds and exercise rounds on a clock, scored, straight
          onto the leaderboard.
        </Text>
        <Link href={workoutHref} style={inlineLink}>
          Train a round &rarr;
        </Link>
      </Section>

      <Section style={boxingButtonContainer}>
        <BoxingButton href={boutHref} color="purple">
          Get back in
        </BoxingButton>
      </Section>

      <Text style={boxingSignoff}>
        Gloves up,
        <br />
        Rookie
      </Text>
    </EmailLayout>
  );
}

const modeCard = {
  backgroundColor: '#EEF6FC',
  borderRadius: '12px',
  border: '1px solid #DCE8F0',
  padding: '16px',
  margin: '0 0 12px 0',
};

const inlineLink = {
  color: '#1CB0F6',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
};

export default BoxingDay3;
