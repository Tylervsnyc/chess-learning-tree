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
  cbGoldBody,
  cbGoldHeading,
  cbButtonWrap,
  cbFootnote,
  cbLink,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingLaunchPartyProps } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=celebration&utm_campaign=cb_launch_party';

/**
 * cb_launch_party — the celebration. Chess Boxing is on the App Store.
 *
 * This is the loudest email in the set and the only one that gets the red
 * rule. It is deliberately NOT the same beat as chess_boxing_launch: that one
 * is Rookie explaining what chess boxing is and asking you to try it. This one
 * is the night of the fight — the poster, the room it was built in, and the
 * people in it. Built once, sent once.
 *
 * Structure is a fight poster read top to bottom: the billing, the venue
 * photograph, the card, the door.
 */
export function BoxingLaunchParty({ appUrl, unsubscribeUrl }: BoxingLaunchPartyProps) {
  const store = `${CB_APP_STORE}?${UTM}`;
  const web = `${appUrl}/box?${UTM}&utm_content=web`;
  const workout = `${appUrl}/workout?${UTM}&utm_content=workout`;
  const bout = `${appUrl}/box/bout?${UTM}&utm_content=bout`;

  return (
    <BoxingEmailLayout
      preview="Chess Boxing is on the App Store. Rounds of puzzles and punches, free."
      unsubscribeUrl={unsubscribeUrl}
      accent="red"
    >
      {/* The billing — ONE announcement. An "IT'S LIVE" banner stacked above a
          "CHESS BOXING" wordmark was the same news told twice, and the header
          already carries the wordmark. */}
      <Section style={{ textAlign: 'center' as const, margin: '0 0 6px 0' }}>
        <Img
          src={`${CB_IMG}/icon.png`}
          alt="Chess Boxing"
          width={88}
          height={88}
          style={{ borderRadius: '19px', display: 'block', margin: '0 auto', width: '88px', height: '88px' }}
        />
      </Section>

      <Text style={billing}>It&apos;s live</Text>
      <Text style={billingSub}>
        Chess Boxing is on the App Store. Free. No ads, no trial, no card.
      </Text>

      {/* The door is open before the pitch, not only after it. Most people who
          are already sold should never have to scroll to act. */}
      <Section style={topButtonWrap}>
        <FightButton href={store} tone="red">
          Get it on the App Store
        </FightButton>
      </Section>

      <CornerLine label="FROM TYLER, WHO BUILT IT">
        <>
          I love chess boxing. You play chess for 3 minutes, then you box for 3
          minutes. The first person to get checkmated or knocked out loses.
        </>
        <>
          I was shocked to learn there wasn&apos;t a chess boxing app. So over the
          past 2 months I&apos;ve been building one.
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
      <Text style={cardHeading}>Chess Boxing Features</Text>

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
        href={store}
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
        <FightButton href={store} tone="red">
          Download Chess Boxing
        </FightButton>
        <Text style={cbFootnote}>
          Not on an iPhone? It runs in the browser at{' '}
          <Link href={web} style={cbLink}>
            chesspath.app/box
          </Link>
          .
        </Text>
      </Section>

      <Section style={askBox}>
        <Text style={cbGoldHeading}>One undignified request</Text>
        <Text style={cbGoldBody}>
          We launched with zero ratings. A blank space where the stars go. If you
          download it and it does not ruin your day, leaving a rating takes about
          eleven seconds and does more for this app than anything else I know how
          to do.
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
  color: CB.ink,
  fontSize: '38px',
  fontWeight: 900,
  letterSpacing: '-0.02em',
  lineHeight: '40px',
  margin: '10px 0 6px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

const billingSub = {
  color: CB.ink70,
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '22px',
  margin: '0 0 18px 0',
  textAlign: 'center' as const,
};

const topButtonWrap = { margin: '4px 0 20px', textAlign: 'center' as const };

const cardHeading = {
  color: CB.ink,
  fontSize: '13px',
  fontWeight: 900,
  letterSpacing: '0.26em',
  lineHeight: '16px',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

const askBox = {
  backgroundColor: CB.gold,
  borderRadius: '10px',
  padding: '14px 16px',
  margin: '20px 0 0 0',
};

export default BoxingLaunchParty;
