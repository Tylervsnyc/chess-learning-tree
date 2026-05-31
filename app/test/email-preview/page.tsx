import { render } from '@react-email/render';
import { DripDay1 } from '@/lib/email/templates/DripDay1';
import { DripDay3LeftOff } from '@/lib/email/templates/DripDay3LeftOff';
import { DripDay7 } from '@/lib/email/templates/DripDay7';
import { Winback } from '@/lib/email/templates/Winback';

// Preview-only. NEVER queries real users — all data below is fake sample data.
const SAMPLE = {
  displayName: 'Tyler',
  appUrl: 'https://chesspath.app',
  unsubscribeUrl: 'https://chesspath.app/api/email/unsubscribe?preview=1',
};

export default async function EmailPreviewPage() {
  const previews: { label: string; angle: string; html: string }[] = [
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
          Fake sample data. No real users are queried. Sends are gated behind
          EMAIL_LIFECYCLE_ENABLED (defaults OFF).
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
