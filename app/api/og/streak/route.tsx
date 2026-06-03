import { ImageResponse } from 'next/og';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';

export const runtime = 'edge';

/**
 * Reel/story-sized (1080x1920) share card for a Chess Path streak.
 * Mirrors the in-app streak popup: blue dome header with Rookie + the streak
 * number, then a clear "I just hit my N-day streak" headline.
 *
 * Query params:
 *   streak — streak number (default 1)
 */

function streakLine(streak: number): string {
  if (streak >= 365) return 'A full year. Every single day.';
  if (streak >= 100) return 'One hundred days. Gold-plated.';
  if (streak >= 30) return 'A whole month of chess.';
  if (streak >= 14) return 'Two weeks strong.';
  if (streak >= 7) return 'A full week, no misses.';
  if (streak >= 2) return 'The streak is alive.';
  return 'The streak starts today.';
}

// Flat-color rook logo (keeps satori fast).
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const streak = Math.max(0, parseInt(searchParams.get('streak') || '1', 10) || 0);
  const gold = streak >= 100;
  const blue = '#1CB0F6';
  const blueDark = '#1899D6';

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
          alignItems: 'center',
          justifyContent: 'center',
          background: '#DBEBF7',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 60,
        }}
      >
        {/* One clean card — mirrors the in-app streak popup */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            background: '#FFFFFF',
            borderRadius: 56,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(21,50,74,0.25)',
          }}
        >
          {/* Blue dome header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: `linear-gradient(180deg, ${blue} 0%, ${blueDark} 100%)`,
              padding: '70px 60px 96px',
              color: '#FFFFFF',
            }}
          >
            {/* White badge so Rookie pops off the blue header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 300,
                height: 320,
                borderRadius: 64,
                background: '#FFFFFF',
                boxShadow: '0 12px 0 0 rgba(13,126,196,0.55)',
              }}
            >
              {rookieLogo(42, gold)}
            </div>
            <div style={{ display: 'flex', fontSize: 220, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.05em', marginTop: 28, color: gold ? '#FFE27A' : '#FFFFFF' }}>
              {streak}
            </div>
            <div style={{ display: 'flex', fontSize: 42, fontWeight: 900, letterSpacing: '0.2em', paddingLeft: '0.2em', marginTop: 18, opacity: 0.92 }}>
              DAY STREAK
            </div>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 70px 88px', gap: 48, marginTop: -40 }}>
            {/* Clear headline */}
            <div
              style={{
                display: 'flex',
                textAlign: 'center',
                fontSize: 76,
                fontWeight: 900,
                color: '#15324A',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              I just hit my {streak}-day streak on Chess Path!
            </div>

            <div style={{ display: 'flex', textAlign: 'center', fontSize: 40, fontWeight: 700, color: '#5B7A93', lineHeight: 1.3 }}>
              {streakLine(streak)}
            </div>

            {/* Footer wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
              {rookieLogo(16, false)}
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 900, color: '#15324A' }}>chesspath.app</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
  response.headers.set('Cache-Control', 'public, s-maxage=86400');
  return response;
}
