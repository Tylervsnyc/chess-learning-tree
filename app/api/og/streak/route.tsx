import { ImageResponse } from 'next/og';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';

export const runtime = 'edge';

/**
 * Reel/story-sized (1080x1920) share card for a Chess Path streak.
 * "Campfire at night" — Rookie burns as a campfire against a dark sky, the
 * streak number glowing beside the fire she's keeping alive.
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
  if (streak >= 2) return 'The fire is still going.';
  return 'The fire is lit.';
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Static "lit" frame of RookieCampfire: red at her base → yellow at her top.
function rookieCampfire(bs: number) {
  const gap = bs * 1.16;
  return (
    <div style={{ position: 'relative', width: 4 * gap + bs, height: 5 * gap + bs, display: 'flex' }}>
      {ROOK_BLOCKS.map((b, i) => {
        const flameHeight = 1 - b.y / 5; // hotter toward the top
        const flicker = seededRandom(i) * 0.4;
        const fireHue = flameHeight * 50; // 0 red → 50 yellow-orange
        const bg = hslToHex(fireHue + flicker * 20, 90 - flameHeight * 20, 30 + flameHeight * 30 + flicker * 15);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x * gap,
              top: b.y * gap,
              width: bs,
              height: bs,
              borderRadius: bs * 0.22,
              background: bg,
              boxShadow: `0 0 ${bs * 0.5}px ${hslToGlow(fireHue)}`,
              display: 'flex',
            }}
          />
        );
      })}
    </div>
  );
}

function hslToGlow(hue: number): string {
  // Warm bloom around each block, brighter toward the top of the fire.
  return `rgba(255, ${Math.round(120 + hue * 2)}, 40, 0.55)`;
}

// Flat rainbow rook for the footer wordmark.
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const streak = Math.max(0, parseInt(searchParams.get('streak') || '1', 10) || 0);
  const gold = streak >= 100;

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
          justifyContent: 'space-between',
          // Night sky cooling into warm embers at the base.
          background: 'linear-gradient(180deg, #0B1A2E 0%, #102236 42%, #2A1C12 80%, #3A2410 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '90px 72px 96px',
        }}
      >
        {/* Top wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {rookieLogo(15)}
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 900, letterSpacing: '0.04em', color: '#EAF2FA' }}>
            Chess Path
          </div>
        </div>

        {/* Hero: campfire + glowing streak number */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Warm bloom behind the fire */}
          <div
            style={{
              position: 'absolute',
              top: -120,
              width: 760,
              height: 760,
              borderRadius: 760,
              background: 'radial-gradient(circle, rgba(255,150,45,0.42) 0%, rgba(255,120,30,0.16) 38%, rgba(255,120,30,0) 66%)',
              display: 'flex',
            }}
          />

          {rookieCampfire(58)}

          {/* Streak number */}
          <div
            style={{
              display: 'flex',
              fontSize: 300,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              marginTop: 30,
              color: gold ? '#FFD15C' : '#FFE7B8',
              textShadow: '0 0 60px rgba(255,150,45,0.65)',
            }}
          >
            {streak}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 46,
              fontWeight: 900,
              letterSpacing: '0.32em',
              paddingLeft: '0.32em',
              marginTop: 8,
              color: 'rgba(255,220,170,0.78)',
            }}
          >
            DAY STREAK
          </div>
        </div>

        {/* Footer: headline + line + handle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              fontSize: 66,
              fontWeight: 900,
              color: '#FFF6EA',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Keeping the fire alive on Chess Path
          </div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: '#E0A86A' }}>
            {streakLine(streak)}
          </div>
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 900, color: 'rgba(234,242,250,0.55)', marginTop: 8 }}>
            chesspath.app
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
  response.headers.set('Cache-Control', 'public, s-maxage=86400');
  return response;
}
