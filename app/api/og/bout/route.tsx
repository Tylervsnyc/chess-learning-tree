import { ImageResponse } from 'next/og';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';

export const runtime = 'edge';

/**
 * Reel/story-sized (1080x1920) share card for a finished Chess Boxing BOUT.
 *
 * The bout brag card — "KO in round 2, and I was up a rook." Models
 * app/api/og/leaderboard (same window chrome, same brand bar, same CTA) so the
 * two cards read as one family in a feed.
 *
 * Query params:
 *   outcome  — ko_win | decision_win | draw | decision_loss | ko_loss | flag_loss
 *   username — handle (optional; omitted line if absent)
 *   material — material balance in pawns at the end, from the user's side
 *   rounds   — boxing rounds survived
 *   moves    — moves played
 *   clock    — seconds left on the user's bank at the end
 *   points   — points earned
 */

function rookieLogo(bs: number) {
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
            background: b.color,
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

const HEADLINE: Record<string, string> = {
  ko_win: 'KO — CHECKMATE',
  ko_loss: 'KO — ROOKIE MATES ME',
  flag_loss: 'LOSS ON TIME',
  decision_win: 'WIN ON THE BOARD',
  decision_loss: 'ROOKIE TAKES THE DECISION',
  draw: 'DRAW',
};

const WINS = new Set(['ko_win', 'decision_win']);

/** "a rook" / "2 pawns" — material spoken the way a person would say it. */
function fmtMaterial(pawns: number): string {
  const n = Math.abs(pawns);
  if (n === 9) return 'a queen';
  if (n === 5) return 'a rook';
  if (n === 3) return 'a piece';
  if (n === 1) return 'a pawn';
  return `${n} pawns`;
}

function fmtClock(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', fontSize: 84, fontWeight: 900, color: '#15324A' }}>{value}</div>
      <div
        style={{
          display: 'flex',
          fontSize: 30,
          fontWeight: 700,
          color: '#5B7A93',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </div>
    </div>
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const outcome = searchParams.get('outcome') || 'decision_win';
  const username = (searchParams.get('username') || '').slice(0, 20);
  const material = Math.max(-99, Math.min(99, parseInt(searchParams.get('material') || '0', 10) || 0));
  const rounds = Math.max(0, Math.min(9, parseInt(searchParams.get('rounds') || '0', 10) || 0));
  const moves = Math.max(0, parseInt(searchParams.get('moves') || '0', 10) || 0);
  const clock = Math.max(0, parseInt(searchParams.get('clock') || '0', 10) || 0);
  const points = Math.max(0, parseInt(searchParams.get('points') || '0', 10) || 0);

  const headline = HEADLINE[outcome] || 'BOUT COMPLETE';
  const won = WINS.has(outcome);
  const accent = won ? '#58CC02' : '#E5484D';
  const materialLine =
    material > 0
      ? `Up ${fmtMaterial(material)} at the bell`
      : material < 0
        ? `Down ${fmtMaterial(-material)} at the bell`
        : 'Dead level at the bell';

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
        <div
          style={{
            ...WINDOW,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '26px 44px',
            gap: 24,
          }}
        >
          {rookieLogo(22)}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 58,
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#15324A',
                lineHeight: 1,
              }}
            >
              Chess Boxing
            </div>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#5B7A93', marginTop: 6 }}>
              Three rounds of chess. Two of gloves.
            </div>
          </div>
        </div>

        {/* The result + judges' cards */}
        <div
          style={{
            ...WINDOW,
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
            // space-around, not center: the card is taller than its content, and
            // centering leaves two dead bands. This distributes the slack.
            // (Satori supports only center/flex-start/flex-end/space-between/
            // space-around — space-evenly throws at render time.)
            justifyContent: 'space-around',
            padding: '56px 44px',
            gap: 6,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '0.18em',
              paddingLeft: '0.18em',
              color: '#5B7A93',
              textTransform: 'uppercase',
            }}
          >
            vs Rookie
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: headline.length > 18 ? 74 : 92,
              fontWeight: 900,
              color: accent,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              textAlign: 'center',
              marginTop: 10,
            }}
          >
            {headline}
          </div>
          {username ? (
            <div
              style={{
                display: 'flex',
                fontSize: 52,
                fontWeight: 900,
                color: '#15324A',
                marginTop: 14,
              }}
            >
              {username}
            </div>
          ) : null}

          {/* The decision — the position, not a scorecard. Nothing about the
              boxing rounds is measured, so there is nothing to tabulate. */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              marginTop: 34,
              borderRadius: 24,
              border: '3px solid #DCE8F1',
              background: '#F1F7FC',
              padding: '34px 30px',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: '0.16em',
                color: '#5B7A93',
                textTransform: 'uppercase',
              }}
            >
              On the board
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 54,
                fontWeight: 900,
                color: material >= 0 ? '#15324A' : '#E5484D',
                textAlign: 'center',
              }}
            >
              {materialLine}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, marginTop: 34 }}>
            <Stat value={String(moves)} label="Moves" />
            {rounds > 0 ? <Stat value={String(rounds)} label="Rounds" /> : null}
            <Stat value={fmtClock(clock)} label="Clock left" />
            {points > 0 ? <Stat value={points.toLocaleString()} label="Points" /> : null}
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
