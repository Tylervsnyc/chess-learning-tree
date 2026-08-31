import { Section, Text } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CardRule,
  CornerLine,
  FightButton,
  PosterBanner,
  ScoreCard,
  cbBody,
  cbButtonWrap,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingWeeklyReportProps } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_weekly_report';

/**
 * cb_weekly_report — the week's numbers, for anyone with 3+ workouts in the
 * trailing 7 days.
 *
 * Spine: the fight poster for a week that already happened. Nothing is asked
 * for until the very end — the whole email is their own numbers printed like a
 * card on the wall. Only sends to people already training, so the tone is a
 * cornerman reading the tale of the tape, not a nudge.
 */
export function BoxingWeeklyReport({
  displayName,
  appUrl,
  unsubscribeUrl,
  workouts,
  punches,
  bestRound,
  currentStreak,
  wins = 0,
  losses = 0,
  draws = 0,
}: BoxingWeeklyReportProps) {
  const greeting = displayName ? `${displayName}. ` : '';
  const workout = `${appUrl}/workout?${UTM}&utm_content=workout`;

  const trainStats: { label: string; value: string }[] = [
    { label: 'Workouts', value: String(workouts) },
  ];
  if (typeof punches === 'number' && punches > 0)
    trainStats.push({ label: 'Punches', value: String(punches) });
  if (typeof bestRound === 'number' && bestRound > 0)
    trainStats.push({ label: 'Best round', value: String(bestRound) });

  const bouted = wins + losses + draws > 0;
  const fightStats: { label: string; value: string }[] = [];
  if (bouted) fightStats.push({ label: 'Record', value: `${wins}-${losses}-${draws}` });
  if (typeof currentStreak === 'number' && currentStreak > 0)
    fightStats.push({ label: 'Streak', value: `${currentStreak}d` });

  return (
    <BoxingEmailLayout
      preview={`${workouts} workouts this week. The card is in.`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <PosterBanner kicker="THE LAST SEVEN DAYS" headline="Your week on the card" />

      <ScoreCard title="TRAINING" items={trainStats} />

      {fightStats.length > 0 && <ScoreCard title="THE FIGHTS" items={fightStats} />}

      <CornerLine>
        &ldquo;{greeting}{workouts} workouts in a week is not dabbling, that is
        training camp. I counted every punch personally, which is my favorite kind
        of counting.&rdquo;
      </CornerLine>

      <CardRule />

      <Text style={cbBody}>
        Next week&rsquo;s card is blank, which is the best thing a card can be.
        {typeof bestRound === 'number' && bestRound > 0
          ? ` And ${bestRound} is a number that can be beaten. I have seen you do it to smaller numbers.`
          : ' First round of the week sets the bar.'}
      </Text>

      <Section style={cbButtonWrap}>
        <FightButton href={workout}>Open next week&rsquo;s card</FightButton>
      </Section>

      <Text style={cbSignoff}>
        Gloves up,
        <br />
        Rookie
      </Text>
    </BoxingEmailLayout>
  );
}

export default BoxingWeeklyReport;
