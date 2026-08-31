import { Section, Text, Img, Link } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CornerLine,
  FightButton,
  GymPhoto,
  ModeRow,
  ScoreCard,
  CardRule,
  CB,
  CB_APP_STORE,
  CB_IMG,
  cbBody,
  cbSectionHeading,
  cbButtonWrap,
  cbFootnote,
  cbLink,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingWelcomeProps } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_welcome';

/**
 * cb_welcome — the day after someone's first ever bout or workout.
 *
 * Literally the cb_launch_party structure, per Tyler: the fight-poster
 * celebration — billing, Tyler's personal note, the crew-gloves photograph,
 * the card of modes, the door. Adapted from "it's live" to "you're in".
 * NEVER discourages: no loss commentary, no scores, no result reactions.
 */
export function BoxingWelcome({ appUrl, unsubscribeUrl }: BoxingWelcomeProps) {
  const store = `${CB_APP_STORE}?${UTM}`;
  const home = `${appUrl}/box?${UTM}&utm_content=home`;
  const workout = `${appUrl}/workout?${UTM}&utm_content=workout`;
  const bout = `${appUrl}/box/bout?${UTM}&utm_content=bout`;

  return (
    <BoxingEmailLayout
      preview="Welcome to Chess Boxing. Rounds of puzzles and punches, free."
      unsubscribeUrl={unsubscribeUrl}
      accent="red"
    >
      {/* The billing. */}
      <Section style={{ textAlign: 'center' as const, margin: '0 0 6px 0' }}>
        <Img
          src={`${CB_IMG}/icon.png`}
          alt="Chess Boxing"
          width={88}
          height={88}
          style={{ borderRadius: '19px', display: 'block', margin: '0 auto', width: '88px', height: '88px' }}
        />
      </Section>

      <Text style={billing}>You&apos;re in</Text>
      <Text style={billingSub}>
        Welcome to Chess Boxing. Free. No ads, no trial, no card.
      </Text>

      {/* The door is open before the pitch. */}
      <Section style={topButtonWrap}>
        <FightButton href={home} tone="red">
          Back to the ring
        </FightButton>
      </Section>

      <CornerLine label="FROM TYLER, WHO BUILT IT">
        <>
          I love chess boxing. You play chess for 3 minutes, then you box for 3
          minutes. The first person to get checkmated or knocked out loses.
        </>
        <>
          I was shocked to learn there wasn&apos;t a chess boxing app. So I built
          one — and yesterday you stepped into it. Welcome to the gym.
        </>
      </CornerLine>

      {/* The venue. */}
      <GymPhoto
        src={`${CB_IMG}/photo-crew-gloves.jpg`}
        alt="The Chessboxing NYC crew in the ring at Gleason's Gym, gloves up"
        caption="CHESSBOXING NYC AT GLEASON'S — THE PEOPLE THIS WAS BUILT FOR"
      />

      <Text style={{ ...cbBody, textAlign: 'center' as const, margin: '0 0 4px 0' }}>
        The official format runs eleven alternating rounds. The hard part is not
        the chess and it is not the punching &mdash; it is the chess right after
        the punching, while your hands are still shaking. That is almost
        impossible to practise anywhere else.
      </Text>

      <CardRule />

      {/* What the app actually does. */}
      <Text style={cbSectionHeading}>Chess Boxing Features</Text>

      <ModeRow
        icon={`${CB_IMG}/corner-puzzle.png`}
        iconWidth={52}
        name="Puzzle Boxing"
        line="Puzzle rounds and exercise rounds, alternating, on a clock. Scored, ranked, straight onto the board."
        href={workout}
        cta="Train a round"
      />

      <ModeRow
        icon={`${CB_IMG}/corner-play.png`}
        iconWidth={52}
        name="Bout Mode"
        line="One game against Rookie, split across the card. The board freezes at the bell whether you like your position or not."
        href={bout}
        cta="Fight a bout"
      />

      <ModeRow
        icon={`${CB_IMG}/gloves.png`}
        iconWidth={52}
        name="Crews"
        line="You compete against people from your own club. Who will come out on top?"
        href={home}
        cta="Start a crew"
      />

      <ScoreCard
        title="THE OFFICIAL CARD"
        items={[
          { label: 'Rounds', value: '11' },
          { label: 'Modes', value: '3' },
          { label: 'Price', value: 'Free' },
        ]}
      />

      {/* The door. */}
      <Section style={cbButtonWrap}>
        <FightButton href={home} tone="red">
          Come back for day two
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
        Tyler
      </Text>
    </BoxingEmailLayout>
  );
}

const billing = {
  color: CB.cream,
  fontSize: '38px',
  fontWeight: 900,
  letterSpacing: '-0.02em',
  lineHeight: '40px',
  margin: '10px 0 6px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

const billingSub = {
  color: CB.text70,
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '22px',
  margin: '0 0 18px 0',
  textAlign: 'center' as const,
};

const topButtonWrap = { margin: '4px 0 20px', textAlign: 'center' as const };

export default BoxingWelcome;
