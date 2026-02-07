import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { BOARD_COLORS } from '@/lib/puzzle-utils';
import { getPieceDataUri } from '@/lib/share/piece-svgs';

export const runtime = 'edge';

// Classic knight fork position - Knight just moved d3→e5 (forking king and rook)
// Black to move - board shown from black's perspective
const DEFAULT_BOARD = [
  ['r', null, 'b', null, null, 'r', 'k', null],
  ['p', 'p', null, null, null, 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, 'N', null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', null, null, 'P', 'P', 'P'],
  ['R', null, 'B', 'Q', null, 'R', 'K', null],
];

// Last move: Knight d3→e5 → highlight from row5,col3 and to row3,col4
const LAST_MOVE_FROM = { row: 5, col: 3 };
const LAST_MOVE_TO = { row: 3, col: 4 };

// Flip board for black's perspective (rotate 180°)
function flipBoard(board: (string | null)[][]): (string | null)[][] {
  return board.slice().reverse().map(row => row.slice().reverse());
}

// Brand logo block positions and colors
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const score = searchParams.get('score') || '6';
  const lesson = searchParams.get('lesson') || 'Lesson';
  const level = searchParams.get('level') || '1';
  const levelName = searchParams.get('levelName') || '';
  const accuracy = searchParams.get('accuracy') || '100';

  const LIGHT: string = BOARD_COLORS.light;
  const DARK: string = BOARD_COLORS.dark;
  const SQ = 56;

  const BLOCK_SIZE = 22;
  const BLOCK_SPACING = 25;

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
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 5,
            background: 'linear-gradient(90deg, #58CC02, #1CB0F6, #A560E8)',
            display: 'flex',
          }}
        />

        {/* Left side - branding + stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px 0 40px 52px',
            width: 700,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
            <div style={{ display: 'flex', position: 'relative', width: BLOCK_SPACING * 4 + BLOCK_SIZE, height: BLOCK_SPACING * 5 + BLOCK_SIZE }}>
              {LOGO_BLOCKS.map((b, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: b.x * BLOCK_SPACING,
                    top: b.y * BLOCK_SPACING,
                    width: BLOCK_SIZE,
                    height: BLOCK_SIZE,
                    borderRadius: 4,
                    backgroundColor: b.color,
                    display: 'flex',
                  }}
                />
              ))}
            </div>
            {/* Wordmark with gradient "path" */}
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ color: '#2A3C45', fontWeight: 700, fontSize: 64 }}>chess</span>
              <span style={{
                fontWeight: 700,
                fontSize: 64,
                backgroundImage: 'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>path</span>
            </div>
          </div>

          {/* Level name - big and prominent */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div
              style={{
                padding: '4px 14px',
                borderRadius: 8,
                background: 'rgba(165,96,232,0.12)',
                border: '2px solid rgba(165,96,232,0.25)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#A560E8', fontWeight: 800, fontSize: 20 }}>L{level}</span>
            </div>
            {levelName && (
              <span style={{ color: '#2A3C45', fontWeight: 700, fontSize: 32 }}>
                {levelName}
              </span>
            )}
          </div>

          {/* Lesson Complete pill */}
          <div style={{ display: 'flex', marginBottom: 20 }}>
            <div
              style={{
                padding: '7px 22px',
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 1.5,
                background: 'linear-gradient(135deg, #58CC02, #46A302)',
                color: '#ffffff',
                display: 'flex',
              }}
            >
              LESSON COMPLETE
            </div>
          </div>

          {/* Big score */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 88, fontWeight: 900, color: '#58CC02', lineHeight: 1 }}>
                {score}
              </span>
            </div>
            <div style={{ fontSize: 22, color: 'rgba(70,163,2,0.7)', display: 'flex' }}>
              {accuracy}% accuracy
            </div>
          </div>

          {/* Lesson name */}
          <div
            style={{
              marginTop: 20,
              padding: '8px 18px',
              borderRadius: 10,
              background: 'rgba(28,176,246,0.08)',
              border: '2px solid rgba(28,176,246,0.2)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#1CB0F6', fontWeight: 600, fontSize: 18 }}>{lesson}</span>
          </div>
        </div>

        {/* Right side - decorative chess board (from black's perspective) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 500,
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
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            }}
          >
            {flipBoard(DEFAULT_BOARD).flat().map((piece, i) => {
              const displayRow = Math.floor(i / 8);
              const displayCol = i % 8;
              // Map back to original coords for highlights
              const origRow = 7 - displayRow;
              const origCol = 7 - displayCol;
              const isLight = (origRow + origCol) % 2 === 0;
              let bgColor = isLight ? LIGHT : DARK;

              // Highlight last move squares
              if (origRow === LAST_MOVE_FROM.row && origCol === LAST_MOVE_FROM.col) {
                bgColor = isLight ? '#f5e6a3' : '#b9ca43';
              }
              if (origRow === LAST_MOVE_TO.row && origCol === LAST_MOVE_TO.col) {
                bgColor = isLight ? '#f2e09a' : '#aabb33';
              }

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
          {/* Side to move label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 14,
              padding: '6px 16px',
              borderRadius: 8,
              background: 'rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#1A1A1A',
                border: '2px solid rgba(0,0,0,0.15)',
                display: 'flex',
              }}
            />
            <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: 18, fontWeight: 700 }}>
              Black to move
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 1200,
            height: 40,
            background: 'rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: 'rgba(0,0,0,0.25)', fontSize: 14, letterSpacing: 0.5 }}>
            chesspath.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
