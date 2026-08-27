import { Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import {
  BoxingButton,
  RookQuote,
  boxingBody,
  boxingButtonContainer,
  boxingHeading,
  boxingSignoff,
  boxingSubheading,
} from './components/BoxingBits';
import type { BoxingStreakRiskProps } from '@/types/email';

const UTM_BASE = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_streak_risk';

/**
 * cb_streak_risk — streak of 3+ with nothing finished today.
 *
 * The shortest email in the set on purpose. One number, one deadline, one
 * button. Anything else and they read instead of acting.
 */
export function BoxingStreakRisk({
  displayName,
  appUrl,
  unsubscribeUrl,
  currentStreak,
}: BoxingStreakRiskProps) {
  const greeting = displayName ? `${displayName}. ` : '';
  const boxHref = `${appUrl}/box?${UTM_BASE}&utm_content=home`;

  return (
    <EmailLayout
      preview={`Day ${currentStreak} ends at midnight and nothing has happened yet.`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={boxingHeading}>{currentStreak} Days</Text>
      <Text style={boxingSubheading}>Ends at midnight unless you do something.</Text>

      <RookQuote>
        &ldquo;{greeting}You are {currentStreak} days deep and today is still
        blank. One round fixes it. Any round.&rdquo;
      </RookQuote>

      <Text style={boxingBody}>
        A bout, a Puzzle Boxing round, a lesson. Whichever is fastest. The streak
        does not care which one, it just wants a finished thing.
      </Text>

      <Section style={boxingButtonContainer}>
        <BoxingButton href={boxHref} color="gold">
          Keep the streak
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

export default BoxingStreakRisk;
