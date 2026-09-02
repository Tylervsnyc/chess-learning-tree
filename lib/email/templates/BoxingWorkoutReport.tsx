import { Img, Section, Text, Link } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CardRule,
  CornerLine,
  FightButton,
  PosterBanner,
  ScoreCard,
  CB,
  cbBody,
  cbButtonWrap,
  cbFootnote,
  cbLink,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingWorkoutReportProps } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=transactional&utm_campaign=cb_workout_report';

/**
 * cb_workout_report — sent the moment a workout lands (from /api/workout/finish).
 *
 * "Great workout." The card, then the hardest puzzle they SOLVED on a board
 * (so the first thing they see is a win), then one button into the thing
 * the app built from this workout: the interactive report (red = what you
 * played, green = the answer → Fix-It). The report is web-only, so this
 * email is also how a phone user reaches it.
 *
 * A clean card has no misses and therefore no report — the button goes to
 * Fix-It instead, which the skill profile can always build.
 */
export function BoxingWorkoutReport({
  displayName,
  appUrl,
  unsubscribeUrl,
  sessionId,
  score,
  correct,
  wrong,
  punches,
  bestRound,
  isPersonalBest,
  currentStreak,
  hardest,
}: BoxingWorkoutReportProps) {
  const hasMisses = wrong > 0;
  const total = correct + wrong;

  const reportUrl = `${appUrl}/workout/report/${sessionId}?${UTM}&utm_content=report`;
  const fixitUrl = `${appUrl}/workout/fixit?${UTM}&utm_content=fixit`;
  const workoutUrl = `${appUrl}/workout?${UTM}&utm_content=workout`;

  const stats: { label: string; value: string }[] = [
    { label: 'Score', value: String(score) },
    { label: 'Solved', value: `${correct}/${total}` },
  ];
  if (typeof punches === 'number' && punches > 0) stats.push({ label: 'Punches', value: String(punches) });
  else if (typeof bestRound === 'number' && bestRound > 0) stats.push({ label: 'Best round', value: String(bestRound) });
  else if (typeof currentStreak === 'number' && currentStreak > 1) stats.push({ label: 'Streak', value: `${currentStreak}d` });

  const boardUrl = hardest
    ? `${appUrl}/api/og/board?fen=${encodeURIComponent(hardest.fen)}&orient=${hardest.orient}&size=640`
    : null;

  // Rookie's line: short, about what they did. No record talk.
  const name = displayName ? `${displayName}. ` : '';
  let line: string;
  if (hardest && hardest.rating >= 1500) {
    line = `${name}A ${hardest.rating} puzzle, solved, with your heart rate up. Most people can't do that sitting down.`;
  } else if (hardest) {
    line = `${name}The ${hardest.rating} below was the hardest one on the card today, and you found it.`;
  } else if (!hasMisses) {
    line = `${name}${correct} for ${correct}. I checked twice.`;
  } else {
    line = `${name}${correct} of ${total}, between rounds. That is a real workout.`;
  }

  const kicker = isPersonalBest ? 'NEW PERSONAL BEST' : 'WORKOUT COMPLETE';

  return (
    <BoxingEmailLayout
      preview={`Great workout. ${correct}/${total}.`}
      unsubscribeUrl={unsubscribeUrl}
      accent={isPersonalBest ? 'gold' : undefined}
    >
      <PosterBanner kicker={kicker} headline="Great workout!" tone={isPersonalBest ? 'gold' : 'ink'} />

      <ScoreCard title="TODAY" items={stats} />

      {hardest && boardUrl && (
        <Section style={boardWrap}>
          <Text style={boardKicker}>THE HARDEST ONE YOU SOLVED</Text>
          <Img
            src={boardUrl}
            alt={`The ${hardest.rating}-rated puzzle you solved`}
            width={320}
            height={320}
            style={boardImg}
          />
          <Text style={boardCaption}>
            Rated {hardest.rating} &middot; {hardest.orient === 'white' ? 'White' : 'Black'} to move &middot; you found it
          </Text>
        </Section>
      )}

      <CornerLine>&ldquo;{line}&rdquo;</CornerLine>

      <CardRule />

      {hasMisses ? (
        <>
          <Text style={cbBody}>
            Your report is built. Every miss is set up on a board: the move you played in red, the
            answer in green, the line plays itself, and I say what the position was about.
            At the end it hands you a Fix-It round built from exactly these positions.
          </Text>
          <Section style={cbButtonWrap}>
            <FightButton href={reportUrl}>Open your report</FightButton>
          </Section>
          <Text style={{ ...cbFootnote, textAlign: 'center' as const }}>
            Or go straight to the{' '}
            <Link href={fixitUrl} style={cbLink}>
              Fix-It round
            </Link>
            .
          </Text>
        </>
      ) : (
        <>
          <Text style={cbBody}>
            Nothing to replay today. Your Fix-It round is built from the patterns you have missed
            before. Ten puzzles, untimed, no bell.
          </Text>
          <Section style={cbButtonWrap}>
            <FightButton href={fixitUrl}>Start your Fix-It round</FightButton>
          </Section>
          <Text style={{ ...cbFootnote, textAlign: 'center' as const }}>
            Or just{' '}
            <Link href={workoutUrl} style={cbLink}>
              go again
            </Link>
            .
          </Text>
        </>
      )}

      <Text style={{ ...cbSignoff, color: CB.text70 }}>
        Gloves up,
        <br />
        Rookie
      </Text>
    </BoxingEmailLayout>
  );
}

const boardWrap = {
  margin: '0 0 18px 0',
  textAlign: 'center' as const,
};

const boardKicker = {
  color: CB.gold,
  fontSize: '11px',
  fontWeight: 900,
  letterSpacing: '0.24em',
  lineHeight: '16px',
  margin: '0 0 10px 0',
  textAlign: 'center' as const,
};

const boardImg = {
  display: 'block',
  margin: '0 auto',
  width: '320px',
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '10px',
  border: `3px solid ${CB.square}`,
};

const boardCaption = {
  color: CB.text55,
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  lineHeight: '16px',
  margin: '10px 0 0 0',
  textAlign: 'center' as const,
};

export default BoxingWorkoutReport;
