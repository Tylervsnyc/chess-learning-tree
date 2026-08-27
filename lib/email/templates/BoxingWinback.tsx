import { Section, Text, Hr, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import {
  APP_STORE_URL,
  BoxingButton,
  RookQuote,
  StatRow,
  boxingBody,
  boxingButtonContainer,
  boxingDivider,
  boxingHeading,
  boxingSignoff,
  boxingSubheading,
  boxingWebLink,
  boxingWebNote,
} from './components/BoxingBits';
import type { BoxingWinbackProps } from '@/types/email';

const UTM_BASE = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_winback';

/**
 * cb_winback — two weeks or more since any boxing.
 *
 * Leads with what they already did rather than what they owe. The best round
 * and the punch count are theirs; nobody took them away.
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
  const boxHref = `${appUrl}/box?${UTM_BASE}&utm_content=home`;
  const workoutHref = `${appUrl}/workout?${UTM_BASE}&utm_content=workout`;
  const storeHref = `${APP_STORE_URL}?${UTM_BASE}`;

  const stats: { label: string; value: string }[] = [];
  if (typeof bouts === 'number' && bouts > 0) stats.push({ label: 'Bouts fought', value: String(bouts) });
  if (typeof bestRound === 'number' && bestRound > 0) stats.push({ label: 'Best round', value: String(bestRound) });
  if (typeof punches === 'number' && punches > 0) stats.push({ label: 'Punches thrown', value: String(punches) });

  // Some lapsed users only ever did workouts before punches/best-round were
  // tracked, so every stat is zero. Don't promise them a number we can't show.
  const hasStats = stats.length > 0;

  return (
    <EmailLayout
      preview={
        hasStats
          ? 'The ring is still here. So is your best round.'
          : 'The ring is still here. Nobody moved it.'
      }
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={boxingHeading}>{hasStats ? 'Still Your Best Round' : 'The Ring Is Still Here'}</Text>
      <Text style={boxingSubheading}>
        {hasStats ? 'Nobody has beaten it since you left.' : 'Nobody moved it. I checked.'}
      </Text>

      <RookQuote>
        &ldquo;{greeting}It has been a couple of weeks. I am not going to make it
        a thing. I just want you to know the ring is exactly where you left it
        and I have been in it the entire time, which in hindsight was a choice.&rdquo;
      </RookQuote>

      {hasStats && <StatRow items={stats} />}

      <Hr style={boxingDivider} />

      <Text style={boxingBody}>
        Start light. One Puzzle Boxing round is a few minutes, it scores you, and
        it puts you back on today&apos;s board. Nothing to catch up on. The
        leaderboard resets daily, so a two week gap costs you exactly nothing.
      </Text>

      <Section style={boxingButtonContainer}>
        <BoxingButton href={workoutHref}>Throw one round</BoxingButton>
        <Text style={boxingWebNote}>
          Or just{' '}
          <Link href={boxHref} style={boxingWebLink}>
            open the app
          </Link>
          . Not installed anymore?{' '}
          <Link href={storeHref} style={boxingWebLink}>
            Get it again
          </Link>
          .
        </Text>
      </Section>

      <Text style={boxingSignoff}>
        Gloves up,
        <br />
        Rookie
      </Text>
    </EmailLayout>
  );
}

export default BoxingWinback;
