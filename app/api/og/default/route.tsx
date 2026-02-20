import { ImageResponse } from 'next/og';
import { BOARD_COLORS } from '@/lib/puzzle-utils';
import { getPieceDataUri } from '@/lib/share/piece-svgs';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

export const runtime = 'edge';

// Brand logo block positions and colors (rook shape — shared across OG routes)
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

// Starting position (white's perspective, row 0 = rank 8 = black's back rank)
const STARTING_BOARD: (string | null)[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

export async function GET() {
  const BLOCK_SIZE = 28;
  const BLOCK_SPACING = 32;

  const LIGHT: string = BOARD_COLORS.light;
  const DARK: string = BOARD_COLORS.dark;
  const SQ = 60;

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
            height: 5,
            background: 'linear-gradient(90deg, #58CC02, #1CB0F6, #A560E8, #FF9600)',
            display: 'flex',
          }}
        />

        {/* Left content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '50px 60px',
            width: 680,
          }}
        >
          {/* Logo row: rook blocks + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {/* Rook logo blocks */}
            <div
              style={{
                display: 'flex',
                position: 'relative',
                width: BLOCK_SPACING * 4 + BLOCK_SIZE,
                height: BLOCK_SPACING * 5 + BLOCK_SIZE,
              }}
            >
              {LOGO_BLOCKS.map((b, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: b.x * BLOCK_SPACING,
                    top: b.y * BLOCK_SPACING,
                    width: BLOCK_SIZE,
                    height: BLOCK_SIZE,
                    borderRadius: 5,
                    background: getMatteBackground(b.color),
                    boxShadow: getMatteBoxShadow(b.color, BLOCK_SIZE / 14),
                    display: 'flex',
                  }}
                />
              ))}
            </div>

            {/* Wordmark with gradient "path" */}
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ color: '#2A3C45', fontWeight: 800, fontSize: 72 }}>chess</span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 72,
                  backgroundImage:
                    'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                path
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div style={{ marginTop: 24, display: 'flex' }}>
            <span
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: '#6b7c8a',
                fontStyle: 'italic',
              }}
            >
              The Fun Way to Learn Chess.
            </span>
          </div>

          {/* Value prop pills */}
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <div
              style={{
                padding: '12px 24px',
                borderRadius: 50,
                background: 'rgba(88,204,2,0.12)',
                border: '2px solid rgba(88,204,2,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4"
                  stroke="#58CC02"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="10" stroke="#58CC02" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#58CC02' }}>
                Interactive Puzzles
              </span>
            </div>

            <div
              style={{
                padding: '12px 24px',
                borderRadius: 50,
                background: 'rgba(28,176,246,0.12)',
                border: '2px solid rgba(28,176,246,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="#1CB0F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1CB0F6' }}>
                Skill Tree Curriculum
              </span>
            </div>

            <div
              style={{
                padding: '12px 24px',
                borderRadius: 50,
                background: 'rgba(255,150,0,0.12)',
                border: '2px solid rgba(255,150,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#FF9500" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="#FF9500" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#FF9500' }}>
                Daily Challenges
              </span>
            </div>
          </div>
        </div>

        {/* Right side - chess board with starting position */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 520,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: SQ * 8,
              height: SQ * 8,
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
            }}
          >
            {STARTING_BOARD.flat().map((piece, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isLight = (row + col) % 2 === 0;
              const bgColor = isLight ? LIGHT : DARK;

              return (
                <div
                  key={i}
                  style={{
                    width: SQ,
                    height: SQ,
                    backgroundColor: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 3,
                  }}
                >
                  {piece ? (
                    <img
                      src={getPieceDataUri(piece)}
                      width={SQ - 6}
                      height={SQ - 6}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom footer bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 1200,
            height: 36,
            background: 'rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: 'rgba(0,0,0,0.22)', fontSize: 14, letterSpacing: 0.5, fontWeight: 500 }}>
            chesspath.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
