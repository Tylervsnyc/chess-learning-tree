import { Img, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import {
  BoxingEmailLayout,
  CB,
  CardRule,
  FightButton,
  ScoreCard,
  cbBody,
  cbHeading,
  cbButtonWrap,
  cbFootnote,
  cbLink,
  cbSectionHeading,
  cbSignoff,
} from './components/BoxingEmailLayout';
import type { BoxingWeeklyTop10Props } from '@/types/email';

/** Subject line. No date — the board speaks for itself. */
export function weeklyTop10Subject(_weekStart?: string): string {
  return 'Puzzle Boxing High Scores';
}

/**
 * cb_weekly_top10 — Monday morning, the whole list gets last week's board.
 *
 * Looks like the app's own leaderboard, not a poster: heading, the ten rows,
 * the best session, the shareable card, then where YOU stood. No date, no
 * slogans, no quotes. Everyone gets the same board; only the bottom line
 * changes per reader.
 */
export function BoxingWeeklyTop10({
  recap,
  recipient,
  cardUrl,
  leaderboardUrl,
  unsubscribeUrl,
}: BoxingWeeklyTop10Props) {
  const leader = recap.top[0];
  const sow = recap.sessionOfWeek;

  const sowItems: { label: string; value: string }[] = sow
    ? [
        { label: 'Points', value: sow.points.toLocaleString() },
        { label: 'Correct', value: `${sow.correct}/${sow.correct + sow.wrong}` },
        { label: 'Accuracy', value: `${sow.accuracyPct}%` },
      ]
    : [];

  let standing: React.ReactNode;
  if (recipient.isTop10 && recipient.rank) {
    standing = (
      <>
        You are on the board. #{recipient.rank} with {recipient.points?.toLocaleString() ?? 0}{' '}
        points, and your name is on the card above. The board resets Monday.
      </>
    );
  } else if (recipient.rank && recipient.points !== null) {
    standing = (
      <>
        You finished #{recipient.rank} with {recipient.points.toLocaleString()} points. The
        board resets Monday.
      </>
    );
  } else {
    standing = <>You weren&rsquo;t on the board this week. One workout puts you on it.</>;
  }

  return (
    <BoxingEmailLayout
      preview={
        leader
          ? `${leader.username} leads with ${leader.points.toLocaleString()} points.`
          : 'Puzzle Boxing High Scores'
      }
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={cbHeading}>Puzzle Boxing High Scores</Text>

      {/* The Top 10 */}
      <Section style={boardWrap}>
        <Text style={boardTitle}>GLOBAL</Text>
        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
          <tbody>
            {recap.top.map((row) => {
              const me = recipient.isTop10 && recipient.rank === row.rank;
              const first = row.rank === 1;
              const rowBg = me ? CB.gold : first ? CB.surface : 'transparent';
              const fg = me ? CB.goldInk : CB.cream;
              const rankFg = me ? CB.goldInk : CB.gold;
              return (
                <tr key={row.userId}>
                  <td style={{ ...rankCell, backgroundColor: rowBg, color: rankFg }}>#{row.rank}</td>
                  <td style={{ ...nameCell, backgroundColor: rowBg, color: fg }}>
                    {row.username}
                    {me ? <span style={youTag}>YOU</span> : null}
                  </td>
                  <td style={{ ...ptsCell, backgroundColor: rowBg, color: fg }}>
                    {row.points.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {recap.totalCompetitors > recap.top.length && (
          <Text style={boardFoot}>
            {recap.totalCompetitors} fighters on the board this week.
          </Text>
        )}
      </Section>

      {/* Session of the week */}
      {sow && (
        <>
          <Text style={cbSectionHeading}>BEST SESSION</Text>
          <Text style={sowName}>
            {sow.username}
            {sow.perfect ? <span style={perfectTag}>PERFECT</span> : null}
          </Text>
          <ScoreCard items={sowItems} />
        </>
      )}

      <CardRule />

      {/* The shareable card */}
      <Section style={{ margin: '0 0 8px 0' }}>
        <Link href={cardUrl}>
          <Img
            src={cardUrl}
            alt="Puzzle Boxing High Scores"
            width={300}
            style={cardImg}
          />
        </Link>
        <Text style={cbFootnote}>
          Save this and post it. Tag{' '}
          <Link href="https://instagram.com/chesspath.app" style={cbLink}>
            @chesspath.app
          </Link>
          .
        </Text>
      </Section>

      <CardRule />

      <Text style={cbBody}>{standing}</Text>

      <Section style={cbButtonWrap}>
        <FightButton href={leaderboardUrl}>See the live board</FightButton>
      </Section>

      <Text style={cbSignoff}>
        Gloves up,
        <br />
        Rookie
      </Text>
    </BoxingEmailLayout>
  );
}

export default BoxingWeeklyTop10;

// --- styles -----------------------------------------------------------------

const boardWrap = {
  backgroundColor: CB.gym,
  border: `1px solid ${CB.square}`,
  borderRadius: '12px',
  padding: '12px 8px 10px',
  margin: '0 0 18px 0',
};

const boardTitle = {
  color: CB.gold,
  fontSize: '9px',
  fontWeight: 900,
  letterSpacing: '0.26em',
  lineHeight: '12px',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const cellBase = {
  padding: '9px 10px',
  fontSize: '15px',
  lineHeight: '20px',
  borderBottom: `1px solid ${CB.square}`,
  whiteSpace: 'nowrap' as const,
};

const rankCell = {
  ...cellBase,
  width: '44px',
  fontWeight: 900,
  textAlign: 'left' as const,
};

const nameCell = {
  ...cellBase,
  fontWeight: 800,
  textAlign: 'left' as const,
  whiteSpace: 'normal' as const,
};

const ptsCell = {
  ...cellBase,
  fontWeight: 900,
  textAlign: 'right' as const,
};

const youTag = {
  display: 'inline-block',
  marginLeft: '8px',
  padding: '1px 6px',
  borderRadius: '6px',
  backgroundColor: CB.goldInk,
  color: CB.gold,
  fontSize: '9px',
  fontWeight: 900,
  letterSpacing: '0.16em',
  verticalAlign: 'middle',
};

const boardFoot = {
  color: CB.text55,
  fontSize: '11px',
  lineHeight: '16px',
  margin: '10px 0 0 0',
  textAlign: 'center' as const,
};

const sowName = {
  color: CB.cream,
  fontSize: '22px',
  fontWeight: 900,
  lineHeight: '26px',
  margin: '-6px 0 10px 0',
  textAlign: 'center' as const,
};

const perfectTag = {
  display: 'inline-block',
  marginLeft: '10px',
  padding: '2px 8px',
  borderRadius: '6px',
  backgroundColor: CB.gold,
  color: CB.goldInk,
  fontSize: '10px',
  fontWeight: 900,
  letterSpacing: '0.16em',
  verticalAlign: 'middle',
};

const cardImg = {
  display: 'block' as const,
  margin: '0 auto',
  width: '300px',
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '12px',
  border: `1px solid ${CB.square}`,
};
