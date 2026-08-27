import { Section, Text, Link } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CardRule,
  CornerLine,
  FightButton,
  GymPhoto,
  ModeRow,
  PosterBanner,
  ScoreCard,
  CB,
  CB_APP_STORE,
  CB_IMG,
  cbGoldBody,
  cbGoldHeading,
  cbButtonWrap,
  cbFootnote,
  cbLink,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingWelcomeProps } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_welcome';

/**
 * cb_welcome — the day after someone's first ever bout.
 *
 * Spine: the card for the rest of the night. They fought one thing; this names
 * the others in the app's own language and plants the streak. Rookie reacts to
 * how the first bout actually went, because she watched it.
 */
export function BoxingWelcome({
  displayName,
  appUrl,
  unsubscribeUrl,
  result,
  punches,
}: BoxingWelcomeProps) {
  const greeting = displayName ? `${displayName}. ` : '';
  const home = `${appUrl}/box?${UTM}&utm_content=home`;
  const workout = `${appUrl}/workout?${UTM}&utm_content=workout`;
  const bout = `${appUrl}/box/bout?${UTM}&utm_content=bout`;
  const store = `${CB_APP_STORE}?${UTM}`;

  const outcome =
    result === 'win'
      ? 'You won it. That is not how these usually go for the other guy.'
      : result === 'loss'
        ? 'You lost it. Everybody loses the first one. I have lost hundreds and I am made of arithmetic.'
        : 'You drew it. The judges are still arguing.';

  return (
    <BoxingEmailLayout
      preview="You fought one. Here is the rest of the card."
      unsubscribeUrl={unsubscribeUrl}
    >
      <PosterBanner kicker="ROUND ONE IS IN THE BOOKS" headline="You fought one" />

      <CornerLine>
        &ldquo;{greeting}{outcome} The hard part of this sport is not the chess and
        it is not the punching. It is the chess right after the punching. That is
        the whole thing, and you just did it once.&rdquo;
      </CornerLine>

      {typeof punches === 'number' && punches > 0 && (
        <ScoreCard
          title="YOUR FIRST CARD"
          items={[
            { label: 'Bouts', value: '1' },
            { label: 'Punches', value: String(punches) },
          ]}
        />
      )}

      <CardRule />

      <Text style={sectionHeading}>What else is on the card</Text>

      <ModeRow
        icon={`${CB_IMG}/corner-puzzle.png`}
        name="Puzzle Boxing"
        line="The ranked one. Puzzle rounds and exercise rounds on a clock. It scores you and puts you on the board."
        href={workout}
        cta="Train a round"
      />

      <ModeRow
        icon={`${CB_IMG}/corner-play.png`}
        name="Bout Mode"
        line="One game against me, split across the card. One ranked bout a day, so it always counts for something."
        href={bout}
        cta="Fight again"
      />

      <GymPhoto
        src={`${CB_IMG}/photo-boards.jpg`}
        alt="Boards set up on tables at Gleason's Gym between rounds"
        caption="BETWEEN ROUNDS AT GLEASON'S"
      />

      <Section style={streakBox}>
        <Text style={cbGoldHeading}>Then come back tomorrow</Text>
        <Text style={cbGoldBody}>
          Any finished round keeps the streak alive. A bout, a Puzzle Boxing round,
          a lesson. One a day is the whole ask.
        </Text>
      </Section>

      <Section style={cbButtonWrap}>
        <FightButton href={home} tone="ink">
          Back to the ring
        </FightButton>
        <Text style={cbFootnote}>
          Only played in the browser so far?{' '}
          <Link href={store} style={cbLink}>
            The app is on the App Store
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

const sectionHeading = {
  color: CB.ink,
  fontSize: '12px',
  fontWeight: 900,
  letterSpacing: '0.26em',
  lineHeight: '15px',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

const streakBox = {
  backgroundColor: CB.gold,
  borderRadius: '10px',
  padding: '14px 16px',
  margin: '0 0 4px 0',
};

export default BoxingWelcome;
