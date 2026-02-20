import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

export const runtime = 'edge';

// The 22 blocks that form the rook shape — colors match the app's celebration rook
const ROOK_BLOCKS = [
  // Row 0 (top — battlements)
  { x: 0, y: 0, color: '#1CB0F6' }, { x: 2, y: 0, color: '#2FCBEF' }, { x: 4, y: 0, color: '#A560E8' },
  // Row 1
  { x: 0, y: 1, color: '#58CC02' }, { x: 1, y: 1, color: '#FFC800' }, { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' }, { x: 4, y: 1, color: '#FF4B4B' },
  // Row 2
  { x: 1, y: 2, color: '#1CB0F6' }, { x: 2, y: 2, color: '#2FCBEF' }, { x: 3, y: 2, color: '#A560E8' },
  // Row 3
  { x: 1, y: 3, color: '#58CC02' }, { x: 2, y: 3, color: '#FFC800' }, { x: 3, y: 3, color: '#FF9600' },
  // Row 4
  { x: 1, y: 4, color: '#FF6B6B' }, { x: 2, y: 4, color: '#FF4B4B' }, { x: 3, y: 4, color: '#1CB0F6' },
  // Row 5 (base)
  { x: 0, y: 5, color: '#2FCBEF' }, { x: 1, y: 5, color: '#A560E8' }, { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' }, { x: 4, y: 5, color: '#FF9600' },
];

// Seeded random for consistent confetti across regenerations
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate confetti pieces for a given zone
function generateConfetti(zoneIndex: number, count: number, isPerfect: boolean): Array<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  rotation: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'streamer';
}> {
  const colors = ['#FFC800', '#FF6B6B', '#58CC02', '#1CB0F6', '#A560E8', '#FF9600', '#FF4B4B', '#2FCBEF'];
  const pieces = [];

  for (let i = 0; i < count; i++) {
    const seed = zoneIndex * 1000 + i;
    const rand = (offset: number) => seededRandom(seed + offset);

    let x = 0, y = 0;
    const shape: 'rect' | 'circle' | 'streamer' = rand(100) < 0.7 ? 'rect' : rand(200) < 0.5 ? 'circle' : 'streamer';
    const w = shape === 'streamer' ? 16 : Math.round(8 + rand(400) * 6);
    const h = shape === 'streamer' ? Math.round(32 + rand(500) * 8) : w;
    const color = colors[Math.floor(rand(600) * colors.length)];
    const rotation = Math.round(rand(700) * 360);
    const opacity = 0.5 + rand(800) * 0.45;

    // Zone-specific positioning
    if (zoneIndex === 0) {
      // Top burst
      x = Math.round(100 + rand(1000) * 800);
      y = Math.round(40 + rand(1100) * 100);
    } else if (zoneIndex === 1) {
      // Left cascade
      x = Math.round(20 + rand(1200) * 120);
      y = Math.round(250 + rand(1300) * 650);
    } else if (zoneIndex === 2) {
      // Right cascade
      x = Math.round(900 + rand(1400) * 120);
      y = Math.round(250 + rand(1500) * 650);
    } else if (zoneIndex === 3) {
      // Mid-field
      x = Math.round(300 + rand(1600) * 480);
      y = Math.round(350 + rand(1700) * 400);
    } else if (zoneIndex === 4) {
      // Bottom scatter
      x = Math.round(150 + rand(1800) * 780);
      y = Math.round(900 + rand(1900) * 120);
    }

    pieces.push({ x, y, w, h, color, rotation, opacity, shape });
  }

  return pieces;
}

// Render a 4-point star sparkle (two perpendicular bars)
function renderSparkle(x: number, y: number, size: number, color: string, rotation: number) {
  const barH = Math.round(size * 0.35);
  const barV = Math.round(size * 0.35);
  const offsetH = Math.round((size - barH) / 2);
  const offsetV = Math.round((size - barV) / 2);

  return (
    <div
      key={`sparkle-${x}-${y}`}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        display: 'flex',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Horizontal bar */}
      <div
        style={{
          position: 'absolute',
          width: size,
          height: barH,
          top: offsetH,
          left: 0,
          borderRadius: Math.round(barH / 2),
          background: color,
          display: 'flex',
        }}
      />
      {/* Vertical bar */}
      <div
        style={{
          position: 'absolute',
          width: barV,
          height: size,
          top: 0,
          left: offsetV,
          borderRadius: Math.round(barV / 2),
          background: color,
          display: 'flex',
        }}
      />
    </div>
  );
}

// Render the rook logo (small, for logo area)
function renderSmallRookLogo() {
  const iconSize = 18; // 9px * 2 scale
  const iconSpacing = Math.round(iconSize * 1.14);

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: iconSpacing * 4 + iconSize,
        height: iconSpacing * 5 + iconSize,
      }}
    >
      {ROOK_BLOCKS.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x * iconSpacing,
            top: b.y * iconSpacing,
            width: iconSize,
            height: iconSize,
            borderRadius: 4,
            background: getMatteBackground(b.color),
            boxShadow: getMatteBoxShadow(b.color, iconSize / 14),
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

// Render the large celebration rook
function renderCelebrationRook() {
  const blockSize = 68;
  const spacing = 90;
  const radius = Math.round(blockSize * 0.22);
  const bottomShadow = Math.round(blockSize * 0.08);

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: spacing * 4 + blockSize,
          height: spacing * 5 + blockSize + bottomShadow,
        }}
      >
        {ROOK_BLOCKS.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x * spacing,
              top: b.y * spacing,
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              background: getMatteBackground(b.color),
              boxShadow: getMatteBoxShadow(b.color, blockSize / 14),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const level = searchParams.get('level') || '1';
  const lesson = searchParams.get('lesson') || '1';
  const score = searchParams.get('score') || '5/6';

  // Parse score: if numerator === denominator, it's perfect
  const [numerator, denominator] = score.split('/').map(Number);
  const isPerfect = numerator === denominator && numerator === 6;

  // Generate confetti
  const confettiRegularDensities = [8, 7, 7, 8, 5]; // top, left, right, mid, bottom
  const confettiMegaDensities = [15, 12, 12, 12, 14]; // top, left, right, mid, bottom
  const densities = isPerfect ? confettiMegaDensities : confettiRegularDensities;

  const confetti = densities.flatMap((count, zoneIndex) => generateConfetti(zoneIndex, count, isPerfect));

  // Sparkle positions (scaled 2x from mockup)
  const sparkles = [
    { x: -40, y: -20, size: 36, color: '#FFC800', rotation: 15 },
    { x: 280, y: -30, size: 32, color: '#FF9600', rotation: -20 },
    { x: 300, y: 220, size: 40, color: '#A560E8', rotation: 30 },
    { x: -50, y: 360, size: 32, color: '#1CB0F6', rotation: -10 },
    { x: 310, y: 520, size: 24, color: '#58CC02', rotation: 45 },
    { x: -30, y: 580, size: 28, color: '#FF6B6B', rotation: -25 },
    { x: 130, y: -80, size: 20, color: '#2FCBEF', rotation: 60 },
    { x: 270, y: 680, size: 32, color: '#FFC800', rotation: 10 },
  ];

  const response = new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          display: 'flex',
          padding: 24,
          borderRadius: 0,
          background: 'linear-gradient(135deg, #FF9600, #FFC800, #FF6B6B, #FF4B4B, #A560E8, #CE82FF, #1CB0F6, #2FCBEF, #58CC02)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Inner card with gradient border visible */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#eef6fc',
            borderRadius: 32,
            position: 'relative',
            overflow: 'hidden',
            justifyContent: 'center',
          }}
        >
          {/* Confetti layer (behind everything) */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex' }}>
            {confetti.map((c, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: c.x,
                  top: c.y,
                  width: c.w,
                  height: c.h,
                  backgroundColor: c.color,
                  borderRadius:
                    c.shape === 'circle'
                      ? '50%'
                      : c.shape === 'streamer'
                        ? 4
                        : 8,
                  transform: `rotate(${c.rotation}deg)`,
                  opacity: c.opacity,
                  display: 'flex',
                }}
              />
            ))}
          </div>

          {/* Content wrapper */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              // zIndex not needed — content is after confetti in DOM order
              gap: 20,
            }}
          >
            {/* Logo + tagline in white fun-box */}
            <div
              style={{
                background: 'white',
                borderRadius: 28,
                padding: '24px 56px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 0 0 3px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14, // 7px * 2 scale
                }}
              >
                {renderSmallRookLogo()}
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: 700,
                      fontSize: 36, // 18px * 2 scale
                      color: '#2A3C45',
                    }}
                  >
                    chess
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: 700,
                      fontSize: 36,
                      color: '#FFC800',
                    }}
                  >
                    path
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 22, // 11px * 2 scale
                  fontWeight: 600,
                  color: '#94a3b8',
                  letterSpacing: 0.6,
                }}
              >
                The fun way to learn chess.
              </div>
            </div>

            {/* Level + Result in white fun-box */}
            <div
              style={{
                background: 'white',
                borderRadius: 28,
                padding: '24px 56px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 0 0 3px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 28, // 14px * 2 scale
                  fontWeight: 700,
                  color: '#6b7c8a',
                  letterSpacing: 3,
                  textTransform: 'uppercase' as const,
                }}
              >
                Level {level}, Lesson {lesson}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 76, // 38px * 2 scale
                  fontWeight: 900,
                  color: isPerfect ? '#FFC800' : '#58CC02',
                  letterSpacing: -1,
                  marginTop: 4,
                }}
              >
                {isPerfect ? 'Perfect!' : 'Completed!'}
              </div>
            </div>

            {/* Rook with sparkles */}
            <div
              style={{
                position: 'relative',
                marginTop: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Sparkles */}
              {sparkles.map((s) => renderSparkle(s.x, s.y, s.size, s.color, s.rotation))}

              {/* Rook */}
              {renderCelebrationRook()}
            </div>
          </div>

          {/* Watermark at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              display: 'flex',
              fontSize: 20, // 10px * 2 scale
              color: 'rgba(0,0,0,0.18)',
              letterSpacing: 1,
            }}
          >
            chesspath.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    }
  );
  response.headers.set('Cache-Control', 'public, s-maxage=31536000, immutable');
  return response;
}
