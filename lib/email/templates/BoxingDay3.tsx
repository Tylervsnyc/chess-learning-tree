import { Section, Text, Img } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CardRule,
  CornerLine,
  FightButton,
  ModeRow,
  PosterBanner,
  ScoreCard,
  CB,
  CB_IMG,
  cbBody,
  cbButtonWrap,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingDay3Props } from '@/types/email';

const UTM = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_day3';

/**
 * cb_day3 — boxed, then went quiet for three days.
 *
 * Spine: the judges' card. Their record is the thing they came for and the
 * thing that stops moving when they stop showing up, so it is the whole top of
 * the email. The heavy bag hangs beside it, unswung.
 */
export function BoxingDay3({
  displayName,
  appUrl,
  unsubscribeUrl,
  wins = 0,
  losses = 0,
  draws = 0,
  bestRound,
}: BoxingDay3Props) {
  const greeting = displayName ? `${displayName}. ` : '';
  const bout = `${appUrl}/box/bout?${UTM}&utm_content=bout`;
  const workout = `${appUrl}/workout?${UTM}&utm_content=workout`;

  const total = wins + losses + draws;
  const stats = [
    { label: 'Record', value: `${wins}-${losses}-${draws}` },
    { label: 'Bouts', value: String(total) },
  ];
  if (typeof bestRound === 'number' && bestRound > 0) {
    stats.push({ label: 'Best round', value: String(bestRound) });
  }

  return (
    <BoxingEmailLayout
      preview="Your record has not moved in three days. I checked. Twice."
      unsubscribeUrl={unsubscribeUrl}
    >
      <PosterBanner kicker="NO CONTEST FOR THREE DAYS" headline="Same record" />

      {/* The card and the bag, side by side: the numbers that stopped, and the
          thing hanging still next to them. Speed bag rather than heavy bag —
          the heavy bag's 1:3.6 aspect towers over the scorecard and opens a
          hole under it. */}
      <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'middle', paddingRight: '14px' }}>
              {total > 0 ? (
                <ScoreCard title="THE JUDGES' CARD" items={stats} />
              ) : (
                <Text style={cbBody}>
                  Nothing on the card yet. That is fixable in about ten minutes.
                </Text>
              )}
            </td>
            <td style={{ verticalAlign: 'middle', width: '62px' }}>
              <Img
                src={`${CB_IMG}/speedbag.png`}
                alt=""
                width={62}
                style={{ display: 'block', width: '62px', height: 'auto' }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <CornerLine>
        &ldquo;{greeting}I have been holding the pads for three days. I am a rook. I
        do not have arms. You can imagine how this looks to the rest of the
        gym.&rdquo;
      </CornerLine>

      <CardRule />

      <ModeRow
        icon={`${CB_IMG}/corner-play.png`}
        name="Bout Mode"
        line="Your ranked bout today is unused. One game, board freezes at the bell. Ten minutes and the record moves."
        href={bout}
        cta="Fight a bout"
      />

      <ModeRow
        icon={`${CB_IMG}/corner-puzzle.png`}
        name="Puzzle Boxing"
        line="Shorter. Puzzle rounds and exercise rounds on a clock, scored, straight onto the board."
        href={workout}
        cta="Train a round"
      />

      <Section style={cbButtonWrap}>
        <FightButton href={bout}>Get back in</FightButton>
      </Section>

      <Text style={cbSignoff}>
        Gloves up,
        <br />
        Rookie
      </Text>
    </BoxingEmailLayout>
  );
}

export default BoxingDay3;
