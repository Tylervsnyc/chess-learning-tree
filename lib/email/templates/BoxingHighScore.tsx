import { Section, Text } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CornerLine,
  FightButton,
  CB,
  cbButtonWrap,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingHighScoreProps } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_highscore';

/**
 * cb_highscore — yesterday's workout set a new personal-best score.
 *
 * The shortest celebration we can print: the number huge in gold, one line
 * from the corner, one button back to the ring. Nothing else competes with
 * the number — same discipline as the old streak-risk email, opposite mood.
 */
export function BoxingHighScore({
  displayName,
  appUrl,
  unsubscribeUrl,
  score,
  previousBest,
}: BoxingHighScoreProps) {
  const greeting = displayName ? `${displayName}. ` : '';
  const workout = `${appUrl}/workout?${UTM}&utm_content=workout`;

  const line =
    typeof previousBest === 'number' && previousBest > 0
      ? `The old record was ${previousBest}, and the only fighter who ever held it was you. My condolences to that guy.`
      : 'That is the best score this gym has ever seen out of you. I wrote it on the wall myself.';

  return (
    <BoxingEmailLayout
      preview={`${score}. New personal best.`}
      unsubscribeUrl={unsubscribeUrl}
      accent="gold"
    >
      <Text style={kicker}>NEW PERSONAL BEST</Text>

      {/* The number IS the email. Nothing competes with it. */}
      <Text style={bigNumber}>{score}</Text>
      <Text style={bigLabel}>Your best workout score, as of yesterday</Text>

      <CornerLine>
        &ldquo;{greeting}{line}&rdquo;
      </CornerLine>

      <Section style={cbButtonWrap}>
        <FightButton href={workout} tone="gold">
          Defend it
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

const kicker = {
  color: CB.gold,
  fontSize: '12px',
  fontWeight: 900,
  letterSpacing: '0.3em',
  lineHeight: '16px',
  margin: '4px 0 6px 0',
  textAlign: 'center' as const,
};

const bigNumber = {
  color: CB.cream,
  fontSize: '84px',
  fontWeight: 900,
  letterSpacing: '-0.02em',
  lineHeight: '88px',
  margin: '0 0 4px 0',
  textAlign: 'center' as const,
};

const bigLabel = {
  color: CB.text55,
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.14em',
  lineHeight: '16px',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

export default BoxingHighScore;
