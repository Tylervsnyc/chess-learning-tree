import { ImageResponse } from 'next/og';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';

export const runtime = 'edge';

/**
 * Reel/story-sized (1080x1920) share card for a Chess Boxing leaderboard rank.
 * The crew brag card — "I'm #3 on the NYC board this week."
 *
 * Query params:
 *   rank      — placement (required, e.g. 3)
 *   username  — handle (required)
 *   points    — total points in the window
 *   punches   — total punches in the window (hidden if 0/absent)
 *   period    — daily | weekly | monthly (default weekly)
 *   scope     — crew | global (default global)
 *   crew      — crew name when scope=crew (e.g. "CHESSBOXING NYC")
 *   total     — number of ranked fighters (optional, shows "of N")
 */

function rookieLogo(bs: number, gold: boolean) {
  const gap = bs * 1.16;
  return (
    <div style={{ position: 'relative', width: 4 * gap + bs, height: 5 * gap + bs, display: 'flex' }}>
      {ROOK_BLOCKS.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x * gap,
            top: b.y * gap,
            width: bs,
            height: bs,
            borderRadius: bs * 0.2,
            background: gold ? '#F4B40A' : b.color,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

const WINDOW: React.CSSProperties = {
  display: 'flex',
  background: '#FFFFFF',
  borderRadius: 36,
  border: '3px solid #DCE8F1',
  boxShadow: '0 10px 0 0 #D2E0EC',
};

const PERIOD_LABEL: Record<string, string> = {
  daily: 'today',
  weekly: 'this week',
  monthly: 'this month',
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rank = Math.max(1, parseInt(searchParams.get('rank') || '1', 10) || 1);
  const username = (searchParams.get('username') || 'you').slice(0, 20);
  const points = Math.max(0, parseInt(searchParams.get('points') || '0', 10) || 0);
  const punches = Math.max(0, parseInt(searchParams.get('punches') || '0', 10) || 0);
  const period = searchParams.get('period') || 'weekly';
  const scope = searchParams.get('scope') === 'crew' ? 'crew' : 'global';
  const crew = (searchParams.get('crew') || '').slice(0, 28);
  const total = parseInt(searchParams.get('total') || '0', 10) || 0;

  const periodLabel = PERIOD_LABEL[period] || 'this week';
  const scopeLabel = scope === 'crew' && crew ? crew : 'GLOBAL';
  const gold = rank === 1;
  const accent = gold ? '#F4B40A' : '#58CC02';

  const W = 1080;
  const H = 1920;

  const response = new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          flexDirection: 'column',
          background: '#DBEBF7',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 44,
          gap: 26,
        }}
      >
        {/* Brand bar */}
        <div style={{ ...WINDOW, alignItems: 'center', justifyContent: 'center', padding: '26px 44px', gap: 24 }}>
          {rookieLogo(22, false)}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', fontSize: 58, fontWeight: 900, letterSpacing: '-0.03em', color: '#15324A', lineHeight: 1 }}>
              Chess Boxing
            </div>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#5B7A93', marginTop: 6 }}>
              Train your brain like a fighter
            </div>
          </div>
        </div>

        {/* The rank */}
        <div
          style={{
            ...WINDOW,
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 44px',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '0.18em',
              paddingLeft: '0.18em',
              color: '#5B7A93',
              textTransform: 'uppercase',
            }}
          >
            {scopeLabel} · {periodLabel}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <div style={{ display: 'flex', fontSize: 200, fontWeight: 900, color: accent, letterSpacing: '-0.04em', lineHeight: 1 }}>
              #{rank}
            </div>
          </div>
          {total > 0 ? (
            <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: '#5B7A93' }}>
              of {total} fighters
            </div>
          ) : null}
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 900,
              color: '#15324A',
              letterSpacing: '-0.02em',
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            {username}
          </div>

          {/* Stats: points + punches */}
          <div style={{ display: 'flex', gap: 28, marginTop: 34 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 76, fontWeight: 900, color: '#15324A' }}>
                {points.toLocaleString()}
              </div>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#5B7A93', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Points
              </div>
            </div>
            {punches > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', fontSize: 76, fontWeight: 900, color: '#15324A' }}>
                  {punches.toLocaleString()}
                </div>
                <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#5B7A93', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Punches
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            ...WINDOW,
            background: '#15324A',
            border: '3px solid #15324A',
            boxShadow: '0 10px 0 0 #0E2335',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 44px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#FFFFFF' }}>
            Box + solve at chesspath.app
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
  response.headers.set('Cache-Control', 'public, s-maxage=86400');
  return response;
}
