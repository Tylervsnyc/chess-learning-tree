import { Section, Text, Img, Link } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CardRule,
  CornerLine,
  FightButton,
  GymPhoto,
  PosterBanner,
  CB,
  CB_APP_STORE,
  CB_IMG,
  cbBody,
  cbButtonWrap,
  cbFootnote,
  cbGoldBody,
  cbGoldBox,
  cbGoldHeading,
  cbLink,
  cbSignoff,
} from './components/BoxingEmailLayout';

interface ChessBoxingLaunchProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
}

const UTM_BASE = 'utm_source=email&utm_medium=update&utm_campaign=chess_boxing_launch';

/**
 * chess_boxing_launch — the explainer. Rookie tells the story of finding out
 * chess boxing is real, then walks the three things the app does.
 *
 * Sibling to BoxingLaunchParty (cb_launch_party), which is the poster version
 * of the same moment. Send ONE of the two, not both — the send script picks.
 *
 * Restyled 2026-08-27 onto BoxingEmailLayout: this was wearing the Chess Path
 * light-blue shell, which is the wrong brand for a boxing gym. The feature
 * cards became full-width photo blocks, because the Gleason's photographs are
 * the argument and they died at 180px in a two-column table.
 */
export function ChessBoxingLaunch({
  displayName,
  appUrl,
  unsubscribeUrl,
}: ChessBoxingLaunchProps) {
  const greeting = displayName ? `${displayName} — ` : '';
  const storeHref = `${CB_APP_STORE}?${UTM_BASE}`;
  const boxHref = `${appUrl}/box?${UTM_BASE}&utm_content=web`;

  return (
    <BoxingEmailLayout
      preview="Chess Boxing is on the App Store. I have never been hit before."
      unsubscribeUrl={unsubscribeUrl}
    >
      <PosterBanner kicker="IT TURNS OUT THIS IS A REAL SPORT" headline="Chess Boxing" />

      <Section style={{ textAlign: 'center' as const, margin: '0 0 4px 0' }}>
        <Img
          src={`${CB_IMG}/icon.png`}
          alt="Chess Boxing"
          width={84}
          height={84}
          style={{ borderRadius: '18px', display: 'block', margin: '0 auto', width: '84px', height: '84px' }}
        />
      </Section>

      <Text style={dek}>Rounds of puzzles and punches. On the App Store. Free.</Text>

      <CornerLine>
        &ldquo;{greeting}I want to explain the last year of my life. Someone told me
        chess boxing was a real sport. I said that was made up. It is not made up.
        There is a world championship. People play a round of chess, then punch
        each other, then sit back down and play more chess, which is the single
        funniest thing humans have ever agreed to do. So we built it.&rdquo;
      </CornerLine>

      <CardRule />

      <Feature
        name="The Workout"
        tagline="Your phone camera counts the punches."
        body="Prop it up, throw hands, and the app counts every one. No watch, no strap, no belt clip. The video never leaves your device: it sits there watching you throw a very slow jab and it tells absolutely nobody."
        photo={`${CB_IMG}/photo-phones.jpg`}
        alt="Fighters checking their phones between rounds at Gleason's Gym"
        href={storeHref}
        cta="Try a round"
      />

      <Feature
        name="The Bout"
        tagline="Official 11-round format. Chess, punches, chess."
        body="Alternating rounds, same as the real sport. Solve under a clock while your arms are still shaking, which turns out to be the entire point. Or build a custom card if eleven rounds sounds like a lot. It does. It is."
        photo={`${CB_IMG}/photo-boards.jpg`}
        alt="A row of boards and a clock set up on tables at the gym"
        href={storeHref}
        cta="Fight a bout"
      />

      <Feature
        name="Crews"
        tagline="Your club gets its own board."
        body="A daily leaderboard, reset every day, so a bad Tuesday is only a bad Tuesday. Start a crew and it becomes your gym against itself. Chessboxing NYC at Gleason's is already on there. They are, I regret to report, extremely good."
        photo={`${CB_IMG}/photo-crew.jpg`}
        alt="The Chessboxing NYC crew lined up outside the ring at Gleason's Gym"
        href={storeHref}
        cta="Join a crew"
      />

      <Section style={cbButtonWrap}>
        <FightButton href={storeHref} tone="red">
          Get it on the App Store
        </FightButton>
        <Text style={cbFootnote}>
          Not on an iPhone? It runs in your browser at{' '}
          <Link href={boxHref} style={cbLink}>
            chesspath.app/box
          </Link>
          .
        </Text>
      </Section>

      <Section style={{ ...cbGoldBox, margin: '20px 0 0 0' }}>
        <Text style={cbGoldHeading}>One small, undignified request</Text>
        <Text style={cbGoldBody}>
          We launched with zero ratings. Zero. A blank space where the stars go. If
          you download it and it does not ruin your day, leaving a rating takes
          about eleven seconds and does more for us than anything else I am capable
          of doing, on account of being a rook.
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

/** One thing the app does: the photograph on top, the claim under it. */
function Feature({
  name,
  tagline,
  body,
  photo,
  alt,
  href,
  cta,
}: {
  name: string;
  tagline: string;
  body: string;
  photo: string;
  alt: string;
  href: string;
  cta: string;
}) {
  return (
    <Section style={{ margin: '0 0 26px 0' }}>
      <GymPhoto src={photo} alt={alt} width={512} />
      <Text style={featureName}>{name}</Text>
      <Text style={featureTagline}>{tagline}</Text>
      <Text style={{ ...cbBody, margin: '0 0 8px 0' }}>{body}</Text>
      <Link href={href} style={featureCta}>
        {cta} &rarr;
      </Link>
    </Section>
  );
}

const dek = {
  color: CB.text70,
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '23px',
  margin: '10px 0 18px 0',
  textAlign: 'center' as const,
};

const featureName = {
  color: CB.cream,
  fontSize: '16px',
  fontWeight: 900,
  letterSpacing: '0.12em',
  lineHeight: '20px',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
};

const featureTagline = {
  color: CB.cream,
  fontSize: '15px',
  fontWeight: 700,
  lineHeight: '21px',
  margin: '0 0 6px 0',
};

const featureCta = {
  color: CB.gold,
  fontSize: '13px',
  fontWeight: 800,
  letterSpacing: '0.04em',
  textDecoration: 'none',
};

export default ChessBoxingLaunch;
