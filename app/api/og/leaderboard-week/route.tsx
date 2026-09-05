import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/**
 * Story-sized (1080x1920) Chess Boxing high-score card — built to be SHARED.
 *
 * Reads like the in-app leaderboard widget (components/chessboxing/RingHome.tsx
 * Board / BoardRow / MeRow / RankBadge / TrophyIcon) with a brand lockup on top
 * and a call to action on the bottom. No dates, no slogans.
 *
 * Edge runtime, so everything arrives via params (the cron computes the recap
 * with lib/leaderboard/weekly-recap.ts and builds this URL):
 *   rows    — "name:points,name:points,..." in rank order (max 10)
 *   me      — username to highlight as the sharer's row (case-insensitive)
 *   cta     — override the call to action (default: BEAT MY SCORE / BEAT THESE SCORES)
 *   sow     — "name:points:acc" → the BEST SESSION card
 *   perfect — 1 to mark the best session as perfect
 *   ws / total — accepted and ignored (kept for URL compatibility)
 *
 * Flat colours only (satori). No emoji anywhere.
 */

// Palette straight from RingHome.
const GYM = '#131a2e';
const SURFACE = '#1a2138';
const ROW_BORDER = 'rgba(255,255,255,0.10)';
const ROW_BG = 'rgba(255,255,255,0.05)';
const CREAM = '#f3e9d2';
const TEXT_90 = 'rgba(255,255,255,0.90)';
const TEXT_55 = 'rgba(255,255,255,0.55)';
const TEXT_40 = 'rgba(255,255,255,0.40)';
const TITLE_BG = 'rgba(229,72,77,0.25)'; // chess-red/25
const TITLE_FG = '#ff9d9d';
const GOLD = '#f6c445';
const GOLD_INK = '#3d2e00';
const ME_BG = 'rgba(246,196,69,0.16)';
const ME_BORDER = 'rgba(246,196,69,0.50)';

// RankBadge medal colours (bg / text / border), exactly as in the app.
const MEDAL: Record<number, { bg: string; fg: string; border: string }> = {
  1: { bg: '#f6c445', fg: '#3d2e00', border: '#b8860b' },
  2: { bg: '#cbd5e1', fg: '#334155', border: '#94a3b8' },
  3: { bg: '#d9955c', fg: '#4a2a10', border: '#a5642f' },
};

// The app's row is 12.5px text at ~360 wide; the card is 3x that.
const S = 3;

/** RingHome's TrophyIcon, inline for satori. */
function TrophyIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4a2 2 0 0 0 2 5M17 6h3a2 2 0 0 1-2 5" />
    </svg>
  );
}

function fmtPts(pts: number) {
  return pts >= 1000 ? `${(pts / 1000).toFixed(1)}k` : String(pts);
}

function parseRows(raw: string): { name: string; points: number }[] {
  return raw
    .split(',')
    .map((chunk) => {
      const i = chunk.lastIndexOf(':');
      if (i < 0) return null;
      const name = chunk.slice(0, i).trim().slice(0, 18);
      const points = Math.max(0, parseInt(chunk.slice(i + 1), 10) || 0);
      return name ? { name, points } : null;
    })
    .filter((r): r is { name: string; points: number } => r !== null)
    .slice(0, 10);
}

function RankBadge({ rank, dim }: { rank: number; dim?: boolean }) {
  const w = 26 * S;
  if (rank > 3) {
    return (
      <div
        style={{
          display: 'flex',
          width: w,
          justifyContent: 'center',
          fontSize: 14 * S,
          fontWeight: 900,
          color: dim ? GOLD : TEXT_40,
        }}
      >
        {rank}
      </div>
    );
  }
  const m = MEDAL[rank];
  return (
    <div
      style={{
        display: 'flex',
        width: w,
        height: w,
        borderRadius: w / 2,
        border: `${2 * S}px solid ${m.border}`,
        background: m.bg,
        color: m.fg,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12 * S,
        fontWeight: 900,
      }}
    >
      {rank}
    </div>
  );
}

function BoardRow({ rank, name, points, me }: { rank: number; name: string; points: number; me: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9 * S,
        padding: `${6 * S}px ${8 * S}px`,
        color: me ? GOLD : TEXT_90,
        background: me ? ME_BG : 'transparent',
        border: me ? `${S}px solid ${ME_BORDER}` : `${S}px solid transparent`,
        borderRadius: 12 * S,
      }}
    >
      <RankBadge rank={rank} dim={me} />
      <div style={{ display: 'flex', flexGrow: 1, fontSize: 14 * S, fontWeight: me ? 900 : 700 }}>{name}</div>
      <div style={{ display: 'flex', fontSize: 13 * S, fontWeight: 900, color: me ? GOLD : TEXT_55 }}>{fmtPts(points)}</div>
    </div>
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rows = parseRows(searchParams.get('rows') || '');
  const meName = (searchParams.get('me') || '').trim().toLowerCase();
  const sowRaw = searchParams.get('sow') || '';
  const perfect = searchParams.get('perfect') === '1';

  let sow: { name: string; points: number; acc: number } | null = null;
  if (sowRaw) {
    const parts = sowRaw.split(':');
    if (parts.length >= 3) {
      const acc = parseInt(parts[parts.length - 1], 10) || 0;
      const points = parseInt(parts[parts.length - 2], 10) || 0;
      const name = parts.slice(0, -2).join(':').slice(0, 18);
      if (name) sow = { name, points, acc };
    }
  }

  // Same origin as this request, so the mark resolves on localhost and prod alike.
  const iconUrl = new URL('/email/boxing/icon.png', req.url).toString();
  const photoUrl = new URL('/email/boxing/photo-crew-gloves.jpg', req.url).toString();

  // The people who post this are on the board, so the dare is personal.
  // `cta` overrides it, so the line can be tested without a deploy.
  const cta = (searchParams.get('cta') || (meName ? 'BEAT MY SCORE' : 'BEAT THESE SCORES'))
    .slice(0, 24)
    .toUpperCase();

  const W = 1080;
  const H = 1920;
  const PAD = 18 * S;

  const response = new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          flexDirection: 'column',
          background: GYM,
          backgroundImage: `url(${photoUrl})`,
          backgroundSize: '2560px 1920px',
          backgroundPosition: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: PAD,
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Scrim over the gym, so the board reads at a glance. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: W,
            height: H,
            display: 'flex',
            background: 'rgba(11,16,30,0.90)',
          }}
        />
        {/* Brand lockup — the real Chess Boxing app mark. */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 * S, paddingTop: 4 * S }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 * S }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- satori renders raw img, not next/image */}
            <img src={iconUrl} alt="" width={32 * S} height={32 * S} style={{ borderRadius: 8 * S }} />
            <div style={{ display: 'flex', fontSize: 27 * S, fontWeight: 900, color: CREAM, letterSpacing: '-0.01em' }}>
              CHESS BOXING
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 9 * S, fontWeight: 800, letterSpacing: '0.34em', color: TEXT_40 }}>
            BY CHESS PATH
          </div>
        </div>

        {/* The board widget */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16 * S,
            background: SURFACE,
            border: `${S}px solid ${ROW_BORDER}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6 * S,
              padding: `${10 * S}px ${12 * S}px`,
              background: TITLE_BG,
              color: TITLE_FG,
              fontSize: 11 * S,
              fontWeight: 900,
              letterSpacing: '0.22em',
            }}
          >
            <TrophyIcon size={12 * S} color={TITLE_FG} />
            PUZZLE BOXING HIGH SCORES
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', padding: `${8 * S}px ${8 * S}px`, gap: 2 * S }}>
            {rows.length === 0 ? (
              <div style={{ display: 'flex', padding: `${12 * S}px ${8 * S}px`, fontSize: 12 * S, fontWeight: 600, color: TEXT_55 }}>
                No fights this window yet.
              </div>
            ) : (
              rows.map((r, i) => (
                <BoardRow key={i} rank={i + 1} name={r.name} points={r.points} me={!!meName && r.name.toLowerCase() === meName} />
              ))
            )}
          </div>
        </div>

        {/* Best session — one more row-card in the same style */}
        {sow ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 16 * S,
              background: SURFACE,
              border: `${S}px solid ${ROW_BORDER}`,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: `${7 * S}px ${12 * S}px`,
                background: ROW_BG,
                color: TEXT_55,
                fontSize: 10 * S,
                fontWeight: 900,
                letterSpacing: '0.22em',
              }}
            >
              BEST SESSION
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9 * S,
                padding: `${11 * S}px ${14 * S}px`,
                color: TEXT_90,
              }}
            >
              <TrophyIcon size={17 * S} color={GOLD} />
              <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', gap: 8 * S, fontSize: 14 * S, fontWeight: 700 }}>
                {sow.name}
                {perfect ? (
                  <div
                    style={{
                      display: 'flex',
                      fontSize: 9 * S,
                      fontWeight: 900,
                      letterSpacing: '0.14em',
                      color: GOLD_INK,
                      background: GOLD,
                      borderRadius: 4 * S,
                      padding: `${1 * S}px ${5 * S}px`,
                    }}
                  >
                    PERFECT
                  </div>
                ) : null}
              </div>
              <div style={{ display: 'flex', fontSize: 12 * S, fontWeight: 900, color: TEXT_55 }}>{sow.acc}%</div>
              <div style={{ display: 'flex', fontSize: 12 * S, fontWeight: 900, color: GOLD }}>{fmtPts(sow.points)}</div>
            </div>
          </div>
        ) : null}

        {/* Call to action */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 * S, paddingTop: 2 * S }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              borderRadius: 14 * S,
              background: GOLD,
              color: GOLD_INK,
              padding: `${11 * S}px 0`,
              fontSize: 16 * S,
              fontWeight: 900,
              letterSpacing: '0.06em',
            }}
          >
            {cta}
          </div>
          <div style={{ display: 'flex', fontSize: 11 * S, fontWeight: 800, letterSpacing: '0.06em', color: TEXT_55 }}>
            chesspath.app  ·  free on iOS
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
  response.headers.set('Cache-Control', 'public, s-maxage=86400');
  return response;
}
