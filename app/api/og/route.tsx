import { ImageResponse } from 'next/og';
import { ROOK_BLOCKS, getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

export const runtime = 'edge';

/**
 * OG image for Rookies Run.
 * Design: /normalize Centered Hero — cream wash, multi-colored rookie, three pills.
 */
export async function GET() {
  const BS = 44; // block size
  const GAP = 50; // grid pitch
  const rookieW = 4 * GAP + BS;
  const rookieH = 5 * GAP + BS;

  const pills: { label: string; bg: string; fg: string }[] = [
    { label: 'Unlock powers', bg: '#F5E69A', fg: '#5A4314' },
    { label: 'Clear 10 levels', bg: '#F8D9C0', fg: '#6B2818' },
    { label: 'New board daily', bg: '#CDE3F2', fg: '#1A3D6B' },
  ];

  const response = new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FBF6EC',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* warm wash at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 1200,
            height: 320,
            background: 'radial-gradient(60% 100% at 50% 100%, #F4DDA5 0%, rgba(244,221,165,0) 70%)',
            display: 'flex',
          }}
        />

        {/* Rookie block grid */}
        <div
          style={{
            position: 'relative',
            width: rookieW,
            height: rookieH,
            display: 'flex',
          }}
        >
          {ROOK_BLOCKS.map((b, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: b.x * GAP,
                top: b.y * GAP,
                width: BS,
                height: BS,
                borderRadius: 8,
                background: getMatteBackground(b.color),
                boxShadow: getMatteBoxShadow(b.color, BS / 14),
                display: 'flex',
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: '#1F1D2E',
            letterSpacing: '-0.035em',
            marginTop: 32,
            display: 'flex',
          }}
        >
          Rookie&apos;s Run
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: '#7C6644',
            letterSpacing: '-0.015em',
            marginTop: 4,
            display: 'flex',
          }}
        >
          A daily chess roguelike.
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {pills.map((p) => (
            <div
              key={p.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: p.bg,
                color: p.fg,
                borderRadius: 999,
                padding: '10px 22px',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
  response.headers.set('Cache-Control', 'public, s-maxage=31536000, immutable');
  return response;
}
