import { Section, Text, Img, Link } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CardRule,
  CornerLine,
  FightButton,
  ScoreCard,
  CB,
  CB_APP_STORE,
  CB_IMG,
  cbBody,
  cbButtonWrap,
  cbFootnote,
  cbLink,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingWinbackProps } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_winback';

/**
 * cb_winback — two weeks or more since any boxing.
 *
 * Spine: the empty gym. Their gloves are still on the hook and their numbers
 * are still on the card; nobody took either away. It leads with what they did,
 * never with what they owe, and the closing argument is that the leaderboard
 * resets daily so the gap cost them nothing.
 */
export function BoxingWinback({
  displayName,
  appUrl,
  unsubscribeUrl,
  bestRound,
  punches,
  bouts,
}: BoxingWinbackProps) {
  const greeting = displayName ? `${displayName}. ` : '';
  const home = `${appUrl}/box?${UTM}&utm_content=home`;
  const workout = `${appUrl}/workout?${UTM}&utm_content=workout`;
  const store = `${CB_APP_STORE}?${UTM}`;

  const stats: { label: string; value: string }[] = [];
  if (typeof bouts === 'number' && bouts > 0) stats.push({ label: 'Bouts', value: String(bouts) });
  if (typeof bestRound === 'number' && bestRound > 0) stats.push({ label: 'Best round', value: String(bestRound) });
  if (typeof punches === 'number' && punches > 0) stats.push({ label: 'Punches', value: String(punches) });

  // Some lapsed users only ever did workouts from before punches and
  // best-round were tracked, so every number is zero. Don't promise them a
  // figure we can't print.
  const hasStats = stats.length > 0;

  return (
    <BoxingEmailLayout
      preview={
        hasStats
          ? 'Your gloves are still on the hook. So is your best round.'
          : 'Your gloves are still on the hook. Nobody moved them.'
      }
      unsubscribeUrl={unsubscribeUrl}
    >
      {/* The gloves are the whole opening image — hanging, unused, waiting. */}
      <Section style={{ textAlign: 'center' as const, margin: '0 0 4px 0' }}>
        <Img
          src={`${CB_IMG}/gloves.png`}
          alt=""
          width={150}
          style={{ display: 'block', margin: '0 auto', width: '150px', height: 'auto' }}
        />
      </Section>

      <Text style={heading}>Still on the hook</Text>
      <Text style={dek}>Nobody moved them. I checked more than once.</Text>

      <CornerLine>
        &ldquo;{greeting}It has been a couple of weeks. I am not going to make it a
        thing. I only want you to know the ring is exactly where you left it and I
        have been standing in it the whole time, which in hindsight was a
        choice.&rdquo;
      </CornerLine>

      {hasStats && <ScoreCard title="STILL ON YOUR CARD" items={stats} />}

      <CardRule />

      <Text style={cbBody}>
        Start light. One Puzzle Boxing round takes a few minutes, it scores you,
        and it puts you back on today&apos;s board. There is nothing to catch up
        on either &mdash; the board resets every day, so two weeks away cost you
        exactly nothing.
      </Text>

      <Section style={cbButtonWrap}>
        <FightButton href={workout}>Throw one round</FightButton>
        <Text style={cbFootnote}>
          Or just{' '}
          <Link href={home} style={cbLink}>
            open the app
          </Link>
          . Deleted it?{' '}
          <Link href={store} style={cbLink}>
            It is still free
          </Link>
          .
        </Text>
      </Section>

      <Text style={cbSignoff}>
        Gloves up,
        <br />
        Rookie
      </Text>
    </BoxingEmailLayout>
  );
}

const heading = {
  color: CB.ink,
  fontSize: '30px',
  fontWeight: 900,
  letterSpacing: '-0.01em',
  lineHeight: '34px',
  margin: '6px 0 6px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

const dek = {
  color: CB.ink70,
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 18px 0',
  textAlign: 'center' as const,
};

export default BoxingWinback;
