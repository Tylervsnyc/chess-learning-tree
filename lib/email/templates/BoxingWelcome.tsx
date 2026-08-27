import { Section, Text, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import {
  APP_STORE_URL,
  BoxingButton,
  IMAGE_BASE,
  PillTitle,
  RookQuote,
  StatRow,
  boxingAppIcon,
  boxingBody,
  boxingButtonContainer,
  boxingDivider,
  boxingHeading,
  boxingSignoff,
  boxingSubheading,
  boxingWebLink,
  boxingWebNote,
} from './components/BoxingBits';
import type { BoxingWelcomeProps } from '@/types/email';

const UTM_BASE = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_welcome';

/**
 * cb_welcome — the day after someone's first ever bout.
 *
 * They fought one thing. This email tells them what the other rounds are, in
 * the app's own language (BOUT MODE / PUZZLE BOXING), and points at the streak
 * as the reason to come back tomorrow.
 */
export function BoxingWelcome({
  displayName,
  appUrl,
  unsubscribeUrl,
  result,
  punches,
  imageBase = IMAGE_BASE,
}: BoxingWelcomeProps) {
  const greeting = displayName ? `${displayName}. ` : '';
  const boxHref = `${appUrl}/box?${UTM_BASE}&utm_content=home`;
  const workoutHref = `${appUrl}/workout?${UTM_BASE}&utm_content=workout`;
  const boutHref = `${appUrl}/box/bout?${UTM_BASE}&utm_content=bout`;
  const storeHref = `${APP_STORE_URL}?${UTM_BASE}`;

  const outcomeLine =
    result === 'win'
      ? 'You won your first one. That is not how these usually go for the other guy.'
      : result === 'loss'
        ? 'You lost your first one. Everybody does. I have lost hundreds and I am made of math.'
        : 'You drew your first one. The judges are still arguing about it.';

  return (
    <EmailLayout
      preview="You fought one. Here is what the rest of the card looks like."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section style={{ textAlign: 'center' as const, margin: '0 0 4px 0' }}>
        <Img
          src={`${imageBase}/social/chessboxing-app-icon.png`}
          alt="Chess Boxing app icon"
          width={84}
          style={boxingAppIcon}
        />
      </Section>

      <Text style={boxingHeading}>You Fought One</Text>
      <Text style={boxingSubheading}>Welcome to the gym.</Text>

      <RookQuote>
        &ldquo;{greeting}You got through a bout. {outcomeLine} The hard part of
        this sport is not the chess and it is not the punching. It is playing
        chess right after the punching, while your hands are still shaking.
        That is the whole thing. That is what we train.&rdquo;
      </RookQuote>

      {typeof punches === 'number' && punches > 0 && (
        <StatRow
          items={[
            { label: 'First bout', value: '1' },
            { label: 'Punches thrown', value: String(punches) },
          ]}
        />
      )}

      <Hr style={boxingDivider} />

      <Section style={modeCard}>
        <div style={{ marginBottom: '6px' }}>
          <PillTitle text="PUZZLE BOXING" color="green" href={workoutHref} />
        </div>
        <Text style={boxingBody}>
          The ranked mode. Puzzle rounds and exercise rounds, alternating, on a
          clock. This is the one that scores you and puts you on the board.
        </Text>
        <Link href={workoutHref} style={inlineLink}>
          Train a round &rarr;
        </Link>
      </Section>

      <Section style={modeCard}>
        <div style={{ marginBottom: '6px' }}>
          <PillTitle text="BOUT MODE" color="purple" href={boutHref} />
        </div>
        <Text style={boxingBody}>
          One game against me, split across the card. The board freezes at the
          bell whether you like the position or not. One ranked bout a day.
        </Text>
        <Link href={boutHref} style={inlineLink}>
          Fight again &rarr;
        </Link>
      </Section>

      <Section style={streakBox}>
        <Text style={streakHeading}>Come back tomorrow</Text>
        <Text style={boxingBody}>
          Any finished round keeps your streak alive. A bout, a workout, a
          lesson. One a day is the whole ask.
        </Text>
      </Section>

      <Section style={boxingButtonContainer}>
        <BoxingButton href={boxHref}>Back to the ring</BoxingButton>
        <Text style={boxingWebNote}>
          Not on your phone yet?{' '}
          <Link href={storeHref} style={boxingWebLink}>
            Get it on the App Store
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

const modeCard = {
  backgroundColor: '#EEF6FC',
  borderRadius: '12px',
  border: '1px solid #DCE8F0',
  padding: '16px',
  margin: '0 0 12px 0',
};

const streakBox = {
  backgroundColor: '#FFF8E1',
  borderRadius: '10px',
  border: '1px solid #FFE9A8',
  padding: '14px 16px',
  margin: '8px 0 0 0',
};

const streakHeading = {
  color: '#2A3C45',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  margin: '0 0 6px 0',
};

const inlineLink = {
  color: '#1CB0F6',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
};

export default BoxingWelcome;
