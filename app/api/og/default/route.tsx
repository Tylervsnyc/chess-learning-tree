import { ImageResponse } from 'next/og';
import { getMatteBackground, getMatteBoxShadow, darken } from '@/lib/daily-rook-blocks';

export const runtime = 'edge';

// Rook shape blocks
const LOGO_BLOCKS = [
  { x: 0, y: 0, color: '#1CB0F6' }, { x: 2, y: 0, color: '#2FCBEF' }, { x: 4, y: 0, color: '#A560E8' },
  { x: 0, y: 1, color: '#58CC02' }, { x: 1, y: 1, color: '#FFC800' }, { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' }, { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' }, { x: 2, y: 2, color: '#2FCBEF' }, { x: 3, y: 2, color: '#A560E8' },
  { x: 1, y: 3, color: '#58CC02' }, { x: 2, y: 3, color: '#FFC800' }, { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' }, { x: 2, y: 4, color: '#FF4B4B' }, { x: 3, y: 4, color: '#1CB0F6' },
  { x: 0, y: 5, color: '#2FCBEF' }, { x: 1, y: 5, color: '#A560E8' }, { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' }, { x: 4, y: 5, color: '#FF9600' },
];

// Real chess piece SVG paths from the app
const KNIGHT_PATH_1 = 'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21';
const KNIGHT_PATH_2 = 'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3';
const STAR_POINTS = '12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26';

const BTN_SIZE = 116;
const BTN_DEPTH = 10;

// Nav icon paths (from NavHeader dropdown)
const TACTICS_PATHS = [
  'M14.5 17.5L3 6V3h3l11.5 11.5',
  'M13 19l6-6', 'M16 16l4 4', 'M19 21l2-2',
  'M14.5 6.5L18 3h3v3l-3.5 3.5',
  'M5 14l4 4', 'M7 17l-3 3', 'M3 21l2-2',
];
const OPENINGS_PATH = 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z';

export async function GET() {
  const BS = 64;
  const GAP = 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          background: '#eef6fc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent gradient bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 8,
            background: 'linear-gradient(90deg, #58CC02, #1CB0F6, #A560E8, #FF9600)',
            display: 'flex',
          }}
        />

        {/* Left side — Big Rookie with speech bubble */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 500,
            padding: '20px 20px 20px 60px',
            position: 'relative',
          }}
        >
          {/* Speech bubble */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'white',
              borderRadius: 24,
              padding: '16px 24px',
              boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
              marginBottom: 16,
              position: 'relative',
              maxWidth: 380,
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: '#2A3C45',
                textAlign: 'center',
                lineHeight: 1.35,
              }}
            >
              Let's play chess!
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#94a3b8',
                textAlign: 'center',
                marginTop: 2,
              }}
            >
              Fair warning, I'm a sore loser.
            </span>
            {/* Bubble tail */}
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              style={{
                position: 'absolute',
                bottom: -11,
                left: '50%',
                marginLeft: -12,
              }}
            >
              <path d="M0 0 L12 12 L24 0" fill="white" />
            </svg>
          </div>

          {/* Big Rookie blocks */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: GAP * 4 + BS,
              height: GAP * 5 + BS,
            }}
          >
            {LOGO_BLOCKS.map((b, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: b.x * GAP,
                  top: b.y * GAP,
                  width: BS,
                  height: BS,
                  borderRadius: 11,
                  background: getMatteBackground(b.color),
                  boxShadow: getMatteBoxShadow(b.color, BS / 14),
                  display: 'flex',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right side — wordmark + tagline + buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '40px 60px 40px 30px',
            width: 700,
          }}
        >
          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ color: '#2A3C45', fontWeight: 800, fontSize: 120 }}>chess</span>
            <span
              style={{
                fontWeight: 800,
                fontSize: 120,
                backgroundImage:
                  'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              path
            </span>
          </div>

          {/* Tagline */}
          <div style={{ marginTop: 4, display: 'flex' }}>
            <span
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: '#6b7c8a',
                fontStyle: 'italic',
              }}
            >
              The Fun Way to Learn Chess.
            </span>
          </div>

          {/* Four 3D buttons with labels */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginTop: 36 }}>
            {/* Tactics button (red — crossed swords icon) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: BTN_SIZE, height: BTN_SIZE + BTN_DEPTH, display: 'flex' }}>
                <div
                  style={{
                    position: 'absolute', top: BTN_DEPTH, left: 0,
                    width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%',
                    backgroundColor: darken('#FF4B4B', 35), display: 'flex',
                  }}
                />
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%',
                    backgroundColor: '#FF4B4B', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {TACTICS_PATHS.map((d, i) => (
                      <path key={i} d={d} />
                    ))}
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#FF4B4B' }}>Tactics</span>
            </div>

            {/* Openings button (purple — book icon) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: BTN_SIZE, height: BTN_SIZE + BTN_DEPTH, display: 'flex' }}>
                <div
                  style={{
                    position: 'absolute', top: BTN_DEPTH, left: 0,
                    width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%',
                    backgroundColor: darken('#CE82FF', 35), display: 'flex',
                  }}
                />
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%',
                    backgroundColor: '#CE82FF', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="56" height="56" viewBox="0 0 24 24">
                    <path d={OPENINGS_PATH} fill="white" />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#CE82FF' }}>Openings</span>
            </div>

            {/* Play button (blue — knight icon) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: BTN_SIZE, height: BTN_SIZE + BTN_DEPTH, display: 'flex' }}>
                <div
                  style={{
                    position: 'absolute', top: BTN_DEPTH, left: 0,
                    width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%',
                    backgroundColor: darken('#1CB0F6', 35), display: 'flex',
                  }}
                />
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%',
                    backgroundColor: '#1CB0F6', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="60" height="60" viewBox="0 0 45 45">
                    <g opacity="0.12" transform="translate(3, 3)"><path d={KNIGHT_PATH_1} fill="#000" /><path d={KNIGHT_PATH_2} fill="#000" /></g>
                    <g opacity="0.08" transform="translate(2, 2)"><path d={KNIGHT_PATH_1} fill="#000" /><path d={KNIGHT_PATH_2} fill="#000" /></g>
                    <g opacity="0.04" transform="translate(1, 1)"><path d={KNIGHT_PATH_1} fill="#000" /><path d={KNIGHT_PATH_2} fill="#000" /></g>
                    <path d={KNIGHT_PATH_1} fill="white" />
                    <path d={KNIGHT_PATH_2} fill="white" />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1CB0F6' }}>Play</span>
            </div>

            {/* Daily button (orange — star icon) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: BTN_SIZE, height: BTN_SIZE + BTN_DEPTH, display: 'flex' }}>
                <div
                  style={{
                    position: 'absolute', top: BTN_DEPTH, left: 0,
                    width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%',
                    backgroundColor: darken('#FF9500', 35), display: 'flex',
                  }}
                />
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%',
                    backgroundColor: '#FF9500', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="54" height="54" viewBox="0 0 24 24">
                    <g opacity="0.12"><polygon points={STAR_POINTS} fill="#000" transform="translate(1.5, 1.5)" /></g>
                    <g opacity="0.08"><polygon points={STAR_POINTS} fill="#000" transform="translate(1, 1)" /></g>
                    <g opacity="0.04"><polygon points={STAR_POINTS} fill="#000" transform="translate(0.5, 0.5)" /></g>
                    <polygon points={STAR_POINTS} fill="white" />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#FF9500' }}>Daily</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
