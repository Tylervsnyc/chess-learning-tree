import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';
import { getPieceDataUri } from '@/lib/share/piece-svgs';

export const runtime = 'edge';

const ROOK_BLOCKS = [
  { x: 0, y: 0, color: '#1CB0F6' }, { x: 2, y: 0, color: '#2FCBEF' }, { x: 4, y: 0, color: '#A560E8' },
  { x: 0, y: 1, color: '#58CC02' }, { x: 1, y: 1, color: '#FFC800' }, { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' }, { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' }, { x: 2, y: 2, color: '#2FCBEF' }, { x: 3, y: 2, color: '#A560E8' },
  { x: 1, y: 3, color: '#58CC02' }, { x: 2, y: 3, color: '#FFC800' }, { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' }, { x: 2, y: 4, color: '#FF4B4B' }, { x: 3, y: 4, color: '#1CB0F6' },
  { x: 0, y: 5, color: '#2FCBEF' }, { x: 1, y: 5, color: '#A560E8' }, { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' }, { x: 4, y: 5, color: '#FF9600' },
];

// Match the app's board colors from lib/puzzle-utils.ts
const BOARD_COLORS = {
  light: '#edeed1',
  dark: '#779952',
};

function parseFen(fen: string): (string | null)[][] {
  const board: (string | null)[][] = [];
  const ranks = fen.split(' ')[0].split('/');
  for (const rank of ranks) {
    const row: (string | null)[] = [];
    for (const ch of rank) {
      if (ch >= '1' && ch <= '8') {
        for (let i = 0; i < parseInt(ch); i++) row.push(null);
      } else {
        row.push(ch);
      }
    }
    board.push(row);
  }
  return board;
}

function renderChessBoard(fen: string, size: number) {
  const board = parseFen(fen);
  const sq = Math.floor(size / 8);
  const pieceImgSize = sq - 6;

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', width: size, height: size,
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    }}>
      {board.map((rank, row) =>
        rank.map((piece, col) => {
          const isLight = (row + col) % 2 === 0;
          return (
            <div key={`${row}-${col}`} style={{
              width: sq, height: sq,
              backgroundColor: isLight ? BOARD_COLORS.light : BOARD_COLORS.dark,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 3,
            }}>
              {piece ? (
                <img
                  src={getPieceDataUri(piece)}
                  width={pieceImgSize}
                  height={pieceImgSize}
                />
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateConfetti(zoneIndex: number, count: number, color: string): Array<{
  x: number; y: number; w: number; h: number; color: string; rotation: number; opacity: number; shape: 'rect' | 'circle' | 'streamer';
}> {
  const colors = [color, '#FFC800', '#58CC02', '#1CB0F6', color, '#A560E8', color];
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const seed = zoneIndex * 1000 + i;
    const rand = (offset: number) => seededRandom(seed + offset);
    const shape: 'rect' | 'circle' | 'streamer' = rand(100) < 0.7 ? 'rect' : rand(200) < 0.5 ? 'circle' : 'streamer';
    const w = shape === 'streamer' ? 16 : Math.round(8 + rand(400) * 6);
    const h = shape === 'streamer' ? Math.round(32 + rand(500) * 8) : w;
    const c = colors[Math.floor(rand(600) * colors.length)];
    const rotation = Math.round(rand(700) * 360);
    const opacity = 0.4 + rand(800) * 0.4;
    let x = 0, y = 0;
    if (zoneIndex === 0) { x = Math.round(100 + rand(1000) * 800); y = Math.round(40 + rand(1100) * 100); }
    else if (zoneIndex === 1) { x = Math.round(20 + rand(1200) * 120); y = Math.round(250 + rand(1300) * 650); }
    else if (zoneIndex === 2) { x = Math.round(900 + rand(1400) * 120); y = Math.round(250 + rand(1500) * 650); }
    else if (zoneIndex === 3) { x = Math.round(300 + rand(1600) * 480); y = Math.round(350 + rand(1700) * 400); }
    else { x = Math.round(150 + rand(1800) * 780); y = Math.round(900 + rand(1900) * 120); }
    pieces.push({ x, y, w, h, color: c, rotation, opacity, shape });
  }
  return pieces;
}

function renderSmallRookLogo() {
  const iconSize = 18;
  const iconSpacing = Math.round(iconSize * 1.14);
  return (
    <div style={{ display: 'flex', position: 'relative', width: iconSpacing * 4 + iconSize, height: iconSpacing * 5 + iconSize }}>
      {ROOK_BLOCKS.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x * iconSpacing, top: b.y * iconSpacing,
          width: iconSize, height: iconSize, borderRadius: 4,
          background: getMatteBackground(b.color), boxShadow: getMatteBoxShadow(b.color, iconSize / 14), display: 'flex',
        }} />
      ))}
    </div>
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const opening = searchParams.get('opening') || 'Opening';
  const score = searchParams.get('score') || '5/5';
  const color = searchParams.get('color') || '#FF9600';
  const moves = searchParams.get('moves') || '';
  const fen = searchParams.get('fen') || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  const [num, denom] = score.split('/').map(Number);
  const isPerfect = num === denom;

  const confetti = [5, 4, 4, 5, 3].flatMap((count, zoneIndex) =>
    generateConfetti(zoneIndex, count, color)
  );

  const response = new ImageResponse(
    (
      <div
        style={{
          width: 1080, height: 1080, display: 'flex', padding: 24,
          background: `linear-gradient(135deg, ${color}, #FFC800, ${color}, #1CB0F6, ${color})`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: '#eef6fc', borderRadius: 32, position: 'relative',
            overflow: 'hidden', justifyContent: 'center',
          }}
        >
          {/* Confetti */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex' }}>
            {confetti.map((c, i) => (
              <div key={i} style={{
                position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h,
                backgroundColor: c.color,
                borderRadius: c.shape === 'circle' ? '50%' : c.shape === 'streamer' ? 4 : 8,
                transform: `rotate(${c.rotation}deg)`, opacity: c.opacity, display: 'flex',
              }} />
            ))}
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', gap: 20 }}>
            {/* Logo row */}
            <div style={{
              background: 'white', borderRadius: 24, padding: '20px 40px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 0 0 3px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {renderSmallRookLogo()}
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: 32, color: '#2A3C45' }}>chess</span>
                  <span style={{
                    fontWeight: 800, fontSize: 32,
                    backgroundImage: 'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}>path</span>
                </div>
              </div>
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 900, color: '#94a3b8', letterSpacing: 0.6 }}>
                The fun way to learn chess.
              </div>
            </div>

            {/* Opening name + result */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'white', borderRadius: 24, padding: '16px 48px 20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 0 0 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                display: 'flex', fontSize: 48, fontWeight: 900, color, letterSpacing: -0.5,
              }}>
                {opening}
              </div>
              <div style={{
                display: 'flex', fontSize: 56, fontWeight: 900,
                color: isPerfect ? '#FFC800' : '#58CC02', letterSpacing: -1,
              }}>
                {isPerfect ? 'Perfect!' : 'Completed!'}
              </div>
            </div>

            {/* Chess board + moves side by side */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 32,
              background: 'white', borderRadius: 28, padding: 28,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 0 0 3px rgba(0,0,0,0.04)',
            }}>
              {/* Board */}
              {renderChessBoard(fen, 400)}

              {/* Moves + score */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360,
              }}>
                {moves && (() => {
                  // Parse into full moves: "1. e4 c5", "2. Nf3 d6", etc.
                  const tokens = moves.split(' ')
                  const lines: string[] = []
                  let i = 0
                  while (i < tokens.length) {
                    const moveNum = tokens[i]?.match(/^(\d+)\./) ? tokens[i] : null
                    if (moveNum) {
                      // Normalize "1.e4" → "1. e4" (add space after dot if missing)
                      const normalized = moveNum.replace(/^(\d+\.)(\S)/, '$1 $2')
                      const white = normalized.includes(' ') ? normalized : (tokens[++i] ? `${normalized} ${tokens[i]}` : normalized)
                      i++
                      const black = (i < tokens.length && !tokens[i]?.match(/^\d+\./)) ? tokens[i++] : ''
                      lines.push(black ? `${white}  ${black}` : white)
                    } else {
                      lines.push(tokens[i++]!)
                    }
                  }
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {lines.map((line, idx) => (
                        <div key={idx} style={{
                          display: 'flex', fontSize: 26, fontWeight: 700, color: '#2A3C45',
                          letterSpacing: 0.3, fontFamily: 'ui-monospace, monospace',
                        }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )
                })()}
                <div style={{
                  display: 'flex', fontSize: 48, fontWeight: 900,
                  color: isPerfect ? '#FFC800' : color,
                  marginTop: 8,
                }}>
                  {score}
                </div>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div style={{
            position: 'absolute', bottom: 24, display: 'flex',
            fontSize: 20, color: 'rgba(0,0,0,0.18)', letterSpacing: 1,
          }}>
            chesspath.app
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );

  response.headers.set('Cache-Control', 'public, s-maxage=31536000, immutable');
  return response;
}
