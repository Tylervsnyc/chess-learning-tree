import { Section, Text, Img } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CornerLine,
  FightButton,
  CB,
  CB_IMG,
  cbBody,
  cbButtonWrap,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingStreakRiskProps } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_streak_risk';

/**
 * cb_streak_risk — streak of 3+ and nothing finished today.
 *
 * The shortest email in the set, on purpose: one number, one deadline, one
 * button. No modes, no photo, no scorecard — anything else and they read
 * instead of acting.
 *
 * The gym's hanging sign carries it. "THERE IS NO TOMORROW" is already painted
 * on the wall in the app (components/chessboxing/GymBackdrop), and it happens
 * to be the literal argument this email is making, so it does the work a
 * headline would otherwise have to.
 */
export function BoxingStreakRisk({
  displayName,
  appUrl,
  unsubscribeUrl,
  currentStreak,
}: BoxingStreakRiskProps) {
  const greeting = displayName ? `${displayName}. ` : '';
  const home = `${appUrl}/box?${UTM}&utm_content=home`;

  return (
    <BoxingEmailLayout
      preview={`Day ${currentStreak} ends at midnight and today is still blank.`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section style={{ textAlign: 'center' as const, margin: '0 0 20px 0' }}>
        <Img
          src={`${CB_IMG}/sign.png`}
          alt="There is no tomorrow"
          width={260}
          style={{ display: 'block', margin: '0 auto', width: '260px', maxWidth: '100%', height: 'auto' }}
        />
      </Section>

      {/* The number IS the headline. Nothing competes with it. */}
      <Text style={bigNumber}>{currentStreak}</Text>
      <Text style={bigLabel}>Days, ending at midnight</Text>

      <CornerLine>
        &ldquo;{greeting}You are {currentStreak} days deep and today is still blank.
        One round fixes it. Any round.&rdquo;
      </CornerLine>

      <Text style={{ ...cbBody, textAlign: 'center' as const }}>
        A bout, a Puzzle Boxing round, a lesson. Whichever is fastest. The streak
        does not care which, it just wants a finished thing.
      </Text>

      <Section style={cbButtonWrap}>
        <FightButton href={home} tone="gold">
          Keep the streak
        </FightButton>
      </Section>

      <Text style={{ ...cbSignoff, textAlign: 'center' as const }}>
        Gloves up,
        <br />
        Rookie
      </Text>
    </BoxingEmailLayout>
  );
}

const bigNumber = {
  color: CB.ink,
  fontSize: '76px',
  fontWeight: 900,
  letterSpacing: '-0.04em',
  lineHeight: '76px',
  margin: '0 0 2px 0',
  textAlign: 'center' as const,
};

const bigLabel = {
  color: CB.ink55,
  fontSize: '12px',
  fontWeight: 900,
  letterSpacing: '0.22em',
  lineHeight: '16px',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

export default BoxingStreakRisk;
