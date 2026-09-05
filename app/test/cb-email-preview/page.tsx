import { render } from '@react-email/render';
import { ChessBoxingLaunch } from '@/lib/email/templates/ChessBoxingLaunch';
import { BoxingLaunchParty } from '@/lib/email/templates/BoxingLaunchParty';
import { BoxingWelcome } from '@/lib/email/templates/BoxingWelcome';
import { BoxingWeeklyReport } from '@/lib/email/templates/BoxingWeeklyReport';
import { BoxingComeback } from '@/lib/email/templates/BoxingComeback';
import { BoxingHighScore } from '@/lib/email/templates/BoxingHighScore';
import { BoxingWorkoutReport } from '@/lib/email/templates/BoxingWorkoutReport';
import { BoxingWeeklyTop10 } from '@/lib/email/templates/BoxingWeeklyTop10';

// Preview-only. NEVER queries real users — all data below is fake sample data.
const SAMPLE = {
  displayName: 'Tyler',
  appUrl: 'https://chesspath.app',
  unsubscribeUrl: 'https://chesspath.app/api/email/unsubscribe?preview=1',
};

// Weekly Top 10 sample: ten fake fighters, one perfect session. The card images
// hit the real OG routes with these same fake rows so the preview is honest.
const TOP10_WEEK = '2026-08-31';
const TOP10_ROWS = [
  ['Los_tiki', 1240, 812], ['ironjaw', 1105, 640], ['queenside_q', 980, 555],
  ['rook_ruth', 902, 480], ['tempo_tom', 855, 501], ['bishop_b', 790, 300],
  ['jab_and_mate', 744, 610], ['castle_kat', 701, 220], ['en_passant_ed', 660, 415],
  ['zugzwang_z', 612, 390],
].map(([username, points, punches], i) => ({
  rank: i + 1,
  userId: `user-${i + 1}`,
  username: String(username),
  points: Number(points),
  punches: Number(punches),
}));
const TOP10_SOW = { username: 'queenside_q', points: 214, correct: 15, wrong: 0, accuracyPct: 100, perfect: true };
const TOP10_TOTAL = 27;
const top10CardUrl = (() => {
  const q = new URLSearchParams({
    ws: TOP10_WEEK,
    rows: TOP10_ROWS.map((r) => `${r.username}:${r.points}`).join(','),
    total: String(TOP10_TOTAL),
    sow: `${TOP10_SOW.username}:${TOP10_SOW.points}:${TOP10_SOW.accuracyPct}`,
    perfect: '1',
  });
  return `/api/og/leaderboard-week?${q.toString()}`;
})();
const top10Recap = { weekStart: TOP10_WEEK, top: TOP10_ROWS, sessionOfWeek: TOP10_SOW, totalCompetitors: TOP10_TOTAL };
const top10Common = {
  recap: top10Recap,
  cardUrl: top10CardUrl,
  leaderboardUrl: 'https://chesspath.app/leaderboard?period=weekly',
  unsubscribeUrl: SAMPLE.unsubscribeUrl,
};

export default async function CbEmailPreviewPage() {
  const previews: { label: string; angle: string; html: string }[] = [
    {
      label: 'cb_weekly_top10 — Puzzle Boxing High Scores, Monday to the whole list (reader is #3)',
      angle:
        'Styled like the app\'s own leaderboard widget (RingHome) — no date, no slogans. Same board for everyone; only the bottom line changes per reader. Reader in the Top 10 -> their row is gold + YOU tag + a link to their own rank card. Sent by /api/cron/weekly-top10 (Mon 12:00 UTC), gated by CB_WEEKLY_TOP10_EMAIL. Card image: ' +
        top10CardUrl,
      html: await render(
        BoxingWeeklyTop10({
          ...top10Common,
          recipient: { displayName: 'Tyler', rank: 3, points: 980, isTop10: true },
        }),
      ),
    },
    {
      label: 'cb_weekly_top10 — reader finished #14 (off the board)',
      angle: '"You finished #14 with 310 points. The board resets Monday." No gold row.',
      html: await render(
        BoxingWeeklyTop10({
          ...top10Common,
          recipient: { displayName: 'Tyler', rank: 14, points: 310, isTop10: false },
        }),
      ),
    },
    {
      label: 'cb_weekly_top10 — reader did not compete (most of the list)',
      angle: '"You weren\'t on the board this week. One workout puts you on it." This is the version 90% of the list receives.',
      html: await render(
        BoxingWeeklyTop10({
          ...top10Common,
          recipient: { displayName: undefined, rank: null, points: null, isTop10: false },
        }),
      ),
    },
    {
      label: 'cb_workout_report — sent the moment a workout lands (misses → report link, hardest solve on a board)',
      angle:
        'Fired from /api/workout/finish via after(). The card for THIS workout, Rookie\'s line, then the one button: /workout/report/[id] (red = what you played, green = the answer → Fix-It). Web-only report, so this is how a phone user reaches it. Dedupe: one per session id in email_log. Gate: WORKOUT_REPORT_EMAIL flag + CB_EMAIL_LIFECYCLE_ENABLED.',
      html: await render(
        BoxingWorkoutReport({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
          sessionId: '00000000-0000-0000-0000-000000000000',
          score: 212,
          correct: 14,
          wrong: 3,
          punches: 187,
          bestRound: 96,
          isPersonalBest: true,
          previousBest: 180,
          currentStreak: 4,
          hardest: { fen: 'r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 0 1', rating: 1840, orient: 'white' },
        }),
      ),
    },
    {
      label: 'cb_workout_report — clean card (no misses → Fix-It link instead)',
      angle:
        'Same email when there is nothing to replay: the button goes to /workout/fixit, which the skill profile can always build.',
      html: await render(
        BoxingWorkoutReport({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
          sessionId: '00000000-0000-0000-0000-000000000000',
          score: 160,
          correct: 12,
          wrong: 0,
          bestRound: 88,
          currentStreak: 1,
          hardest: { fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 b - - 0 1', rating: 1210, orient: 'black' },
        }),
      ),
    },
    {
      label: 'cb_welcome — the day after their FIRST ever bout or workout',
      angle:
        'Literally the launch-party structure: the billing, Tyler\'s personal note, the crew-gloves photo, the features card, the door. Never discourages — no loss commentary, no scores. Primary CTA -> /box.',
      html: await render(
        BoxingWelcome({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
          result: 'loss',
          punches: 47,
        }),
      ),
    },
    {
      label: 'cb_weekly_report — 3+ workouts in the trailing 7 days (at most once per 7 days)',
      angle:
        'Your week on the card: workouts, punches, best round, streak, and the bout record if they fought. Only sends to people already training — a cornerman reading the tale of the tape, not a nudge. Dedupe: weekly via email_log. Primary CTA -> /workout.',
      html: await render(
        BoxingWeeklyReport({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
          workouts: 5,
          punches: 438,
          bestRound: 180,
          currentStreak: 4,
          wins: 2,
          losses: 1,
          draws: 0,
        }),
      ),
    },
    {
      label: 'cb_comeback — 7+ days since any boxing',
      angle:
        'Leads with what they already did, not what they owe. Best round + punches thrown are theirs. Reassures that the daily leaderboard reset means a week away costs nothing. Primary CTA -> /workout.',
      html: await render(
        BoxingComeback({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
          bestRound: 180,
          punches: 612,
          bouts: 9,
        }),
      ),
    },
    {
      label: 'cb_highscore — yesterday set a new personal-best workout score',
      angle:
        'The shortest celebration we can print: the number huge in gold, one line from the corner, one button back to /workout. Fires the morning after the record; dedupe daily. Beats every other CB email in the priority ladder.',
      html: await render(
        BoxingHighScore({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
          score: 212,
          previousBest: 180,
        }),
      ),
    },
    {
      label: 'cb_launch_party — THE CELEBRATION (the app is live)',
      angle:
        'The showpiece fight poster: the billing, the Gleason\'s photograph, the card, the door. Sibling of chess_boxing_launch — send ONE of the two. Primary CTA -> App Store.',
      html: await render(
        BoxingLaunchParty({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
        }),
      ),
    },
    {
      label: 'chess_boxing_launch — the explainer version of the same moment',
      angle:
        'Rookie tells the story of finding out chess boxing is real, then three full-width photo blocks. Sent by hand via scripts/send-chess-boxing-launch.ts. Primary CTA -> App Store.',
      html: await render(
        ChessBoxingLaunch({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
        }),
      ),
    },
  ];

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        background: '#0b101e',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1
          style={{
            color: '#f3e9d2',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.04em',
            margin: '0 0 4px',
          }}
        >
          CHESS BOXING — Email Preview
        </h1>
        <p
          style={{
            color: '#a8a598',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            margin: '0 0 24px',
          }}
        >
          The full Chess Boxing set, nothing else. Fake sample data — no real
          users are queried. Lifecycle sends (cb_*) are gated behind
          CB_EMAIL_LIFECYCLE_ENABLED, which defaults OFF. Chess Path emails
          live at /test/email-preview.
        </p>

        {previews.map((p) => (
          <div key={p.label} style={{ marginBottom: 40 }}>
            <div
              style={{
                color: '#f6c445',
                fontFamily: 'system-ui, sans-serif',
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 2,
              }}
            >
              {p.label}
            </div>
            <div
              style={{
                color: '#a8a598',
                fontFamily: 'system-ui, sans-serif',
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {p.angle}
            </div>
            <iframe
              srcDoc={p.html}
              style={{
                width: '100%',
                height: 900,
                border: 0,
                borderRadius: 12,
                background: '#0b101e',
              }}
              title={p.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
