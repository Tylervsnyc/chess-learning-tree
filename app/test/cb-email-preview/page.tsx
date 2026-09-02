import { render } from '@react-email/render';
import { ChessBoxingLaunch } from '@/lib/email/templates/ChessBoxingLaunch';
import { BoxingLaunchParty } from '@/lib/email/templates/BoxingLaunchParty';
import { BoxingWelcome } from '@/lib/email/templates/BoxingWelcome';
import { BoxingWeeklyReport } from '@/lib/email/templates/BoxingWeeklyReport';
import { BoxingComeback } from '@/lib/email/templates/BoxingComeback';
import { BoxingHighScore } from '@/lib/email/templates/BoxingHighScore';
import { BoxingWorkoutReport } from '@/lib/email/templates/BoxingWorkoutReport';

// Preview-only. NEVER queries real users — all data below is fake sample data.
const SAMPLE = {
  displayName: 'Tyler',
  appUrl: 'https://chesspath.app',
  unsubscribeUrl: 'https://chesspath.app/api/email/unsubscribe?preview=1',
};

export default async function CbEmailPreviewPage() {
  const previews: { label: string; angle: string; html: string }[] = [
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
