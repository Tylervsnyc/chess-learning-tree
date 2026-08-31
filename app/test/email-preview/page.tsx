import { render } from '@react-email/render';
import { DripDay1 } from '@/lib/email/templates/DripDay1';
import { DripDay3LeftOff } from '@/lib/email/templates/DripDay3LeftOff';
import { DripDay7 } from '@/lib/email/templates/DripDay7';
import { Winback } from '@/lib/email/templates/Winback';
import { PatronThankYou } from '@/lib/email/templates/PatronThankYou';
import { StreakScience } from '@/lib/email/templates/StreakScience';
import { ChessBoxingLaunch } from '@/lib/email/templates/ChessBoxingLaunch';
import { BoxingLaunchParty } from '@/lib/email/templates/BoxingLaunchParty';
import { BoxingWelcome } from '@/lib/email/templates/BoxingWelcome';
import { BoxingWeeklyReport } from '@/lib/email/templates/BoxingWeeklyReport';
import { BoxingComeback } from '@/lib/email/templates/BoxingComeback';
import { BoxingHighScore } from '@/lib/email/templates/BoxingHighScore';

// Preview-only. NEVER queries real users — all data below is fake sample data.
const SAMPLE = {
  displayName: 'Tyler',
  appUrl: 'https://chesspath.app',
  unsubscribeUrl: 'https://chesspath.app/api/email/unsubscribe?preview=1',
};

export default async function EmailPreviewPage() {
  const previews: { label: string; angle: string; html: string }[] = [
    {
      label: 'streak_science — standalone broadcast to the list',
      angle: 'Explains the new streak feature + the real learning science behind why daily practice works (spacing effect, pattern recognition, retrieval practice, streak accountability). From Rookie, no emojis, no em-dashes. Primary CTA -> start your streak.',
      html: await render(
        StreakScience({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
        }),
      ),
    },
    {
      label: 'patron_thank_you — sent when someone becomes a patron',
      angle: 'A personal note from Tyler (not Rookie) with his headshot. "I love chess, I love making things for people who love chess, your support means a lot." No upsell — patron unlocks nothing but the gold profile.',
      html: await render(
        PatronThankYou({
          displayName: SAMPLE.displayName,
          // Local origin so the headshot loads in this preview (prod is stale).
          appUrl: 'http://localhost:3000',
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
        }),
      ),
    },
    {
      label: 'drip_day1 — ~1 day post-signup, no return',
      angle: 'Warm, curious nudge. Rookie noticed she was "waiting" — featuring today\'s Run as the come-back hook. Primary CTA → /run.',
      html: await render(
        DripDay1({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
        }),
      ),
    },
    {
      label: 'drip_day3 — existing (left off) — LIVE, now leads with the Run',
      angle: 'Day-3 "You Made Rookie Cry" — this one SENDS in production. Now leads with Rookie\'s Run as the top come-back option. Primary CTA → /run.',
      html: await render(
        DripDay3LeftOff({
          displayName: SAMPLE.displayName,
          currentLevel: '',
          currentLesson: '',
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
        }),
      ),
    },
    {
      label: 'drip_day7 — week-one check-in (with streak)',
      angle: 'Week-one milestone. Today\'s Run is the daily habit + streak keeper; "players who show up every day get good." Primary CTA → /run.',
      html: await render(
        DripDay7({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
          currentStreak: 5,
        }),
      ),
    },
    {
      label: 'drip_day7 — week-one check-in (no streak)',
      angle: 'Same email when no streak data is available (streak badge hidden). Still leads with today\'s Run. Primary CTA → /run.',
      html: await render(
        DripDay7({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
        }),
      ),
    },
    {
      label: 'winback — inactive 14+ days',
      angle: 'Rookie misses them. "The board\'s still set up." A fresh Run today — one tap, no guilt, no catching up. Primary CTA → /run.',
      html: await render(
        Winback({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
        }),
      ),
    },
    {
      label: 'cb_launch_party — THE CELEBRATION (the app is live)',
      angle: 'The showpiece. Read as a fight poster top to bottom: the billing, the venue photograph (Chessboxing NYC at Gleason\'s), the card, the door. Only email in the set with the red rule. Sibling of chess_boxing_launch -- send ONE of the two. Primary CTA -> App Store.',
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
      angle: 'Rookie tells the story of finding out chess boxing is real, then three full-width photo blocks (Workout / Bout / Crews) and an undignified ask for a rating. Sent by hand via scripts/send-chess-boxing-launch.ts. Primary CTA -> App Store.',
      html: await render(
        ChessBoxingLaunch({
          displayName: SAMPLE.displayName,
          appUrl: SAMPLE.appUrl,
          unsubscribeUrl: SAMPLE.unsubscribeUrl,
        }),
      ),
    },
    {
      label: 'cb_welcome — the day after their FIRST ever bout or workout',
      angle: 'The features tour: Puzzle Boxing, Bout Mode, the streak, the daily board — each with its engraved icon. Rookie reacts to how the first bout actually went. Primary CTA -> /box.',
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
      label: 'cb_weekly_report — 3+ workouts in the trailing 7 days (once per 7 days)',
      angle: 'Your week on the card: workouts, punches, best round, streak, plus the bout record if they fought. Only sends to people already training. Dedupe: weekly via email_log. Primary CTA -> /workout.',
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
      angle: 'Leads with what they already did, not what they owe. Best round + punches thrown are theirs. Reassures that the daily leaderboard reset means a week away costs nothing. Primary CTA -> /workout.',
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
      angle: 'The shortest celebration we can print: the number huge in gold, one line from the corner, one button back to /workout. Fires the morning after the record; dedupe daily. Top of the CB priority ladder.',
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
  ];

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        background: '#0F172A',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1
          style={{
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 22,
            margin: '0 0 4px',
          }}
        >
          Lifecycle Email Preview
        </h1>
        <p
          style={{
            color: '#94A3B8',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            margin: '0 0 24px',
          }}
        >
          Fake sample data. No real users are queried. Chess Path lifecycle
          sends are gated behind EMAIL_LIFECYCLE_ENABLED; the Chess Boxing set
          (cb_*) is gated behind its own CB_EMAIL_LIFECYCLE_ENABLED, which
          defaults OFF.
        </p>

        {previews.map((p) => (
          <div key={p.label} style={{ marginBottom: 40 }}>
            <div
              style={{
                color: '#E2E8F0',
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
                color: '#94A3B8',
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
                height: 760,
                border: 0,
                borderRadius: 12,
                background: '#fff',
              }}
              title={p.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
