import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

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

function renderCelebrationRook() {
  const blockSize = 56;
  const spacing = 74;
  const radius = Math.round(blockSize * 0.22);
  return (
    <div style={{ display: 'flex', position: 'relative', width: spacing * 4 + blockSize, height: spacing * 5 + blockSize }}>
      {ROOK_BLOCKS.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x * spacing, top: b.y * spacing,
          width: blockSize, height: blockSize, borderRadius: radius,
          background: getMatteBackground(b.color), boxShadow: getMatteBoxShadow(b.color, blockSize / 14), display: 'flex',
        }} />
      ))}
    </div>
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const outcome = searchParams.get('outcome') || 'win';
  const level = searchParams.get('level') || '1';

  const isWin = outcome === 'win';
  const headlineColor = isWin ? '#58CC02' : '#FF6B6B';
  const headline = isWin ? 'Victory!' : outcome === 'draw' ? 'Draw!' : 'Good Game!';

  return new ImageResponse(
    (
      <div style={{
        width: 1080, height: 1080, display: 'flex', padding: 24,
        background: isWin
          ? 'linear-gradient(135deg, #58CC02, #FFC800, #FF9600, #1CB0F6, #A560E8)'
          : 'linear-gradient(135deg, #64748b, #94a3b8, #475569, #64748b)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: '#eef6fc', borderRadius: 32, position: 'relative', overflow: 'hidden', justifyContent: 'center',
        }}>
          {/* Logo + tagline */}
          <div style={{
            background: 'white', borderRadius: 28, padding: '24px 56px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 0 0 3px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {renderSmallRookLogo()}
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <div style={{ display: 'flex', fontWeight: 700, fontSize: 36, color: '#2A3C45' }}>chess</div>
                <div style={{ display: 'flex', fontWeight: 700, fontSize: 36, color: '#FFC800' }}>path</div>
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: 22, fontWeight: 600, color: '#94a3b8', letterSpacing: 0.6 }}>
              The fun way to learn chess.
            </div>
          </div>

          {/* Result */}
          <div style={{
            background: 'white', borderRadius: 28, padding: '24px 56px', marginTop: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 0 0 3px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#6b7c8a', letterSpacing: 3, textTransform: 'uppercase' as const }}>
              Level {level}
            </div>
            <div style={{ display: 'flex', fontSize: 76, fontWeight: 900, color: headlineColor, letterSpacing: -1, marginTop: 4 }}>
              {headline}
            </div>
          </div>

          {/* Rook */}
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {renderCelebrationRook()}
          </div>

          {/* Watermark */}
          <div style={{ position: 'absolute', bottom: 24, display: 'flex', fontSize: 20, color: 'rgba(0,0,0,0.18)', letterSpacing: 1 }}>
            chesspath.app
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 },
  );
}
