import { ImageResponse } from 'next/og';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';
import { PIECE_DATA_URIS } from '@/lib/og/chess-pieces';
import { BOARD_COLORS } from '@/lib/puzzle-utils';

export const runtime = 'edge';

/**
 * Reel/story-sized (1080x1920) share card for a day on Chess Path.
 * Branded + windowed. Window 2 shows a chess board of what the user did.
 *
 * Query params:
 *   streak  — streak number after today (default 1)
 *   kind    — 'puzzle' | 'opening' | 'game' (default 'puzzle')
 *   fen     — board to render (board field is all that's read)
 *   label   — big title in the activity window (overrides the kind default)
 *   result  — small chip under the title (e.g. "Solved", "Checkmate")
 */

// FEN letter -> react-chessboard piece code (uppercase = white).
function pieceCode(ch: string): string {
  return (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase();
}

function parseBoard(fen: string): (string | null)[][] {
  const field = (fen || '').trim().split(/\s+/)[0] || '8/8/8/8/8/8/8/8';
  return field.split('/').slice(0, 8).map((rank) => {
    const row: (string | null)[] = [];
    for (const ch of rank) {
      if (/\d/.test(ch)) for (let i = 0; i < parseInt(ch, 10); i++) row.push(null);
      else row.push(ch);
    }
    while (row.length < 8) row.push(null);
    return row.slice(0, 8);
  });
}

const KIND_COPY: Record<string, { eyebrow: string; title: string; subtitle?: string }> = {
  puzzle: { eyebrow: 'I just solved', title: "Today's Puzzle" },
  opening: { eyebrow: 'I just learned', title: 'A new opening' },
  game: { eyebrow: 'I just played', title: 'Rookie' },
  daily: { eyebrow: 'I just finished my', title: 'Daily Workout', subtitle: 'A daily set of chess puzzles' },
};

function streakLine(streak: number): string {
  if (streak >= 365) return 'A full year. Every single day.';
  if (streak >= 100) return 'One hundred days. Gold-plated.';
  if (streak >= 30) return 'A whole month of chess.';
  if (streak >= 14) return 'Two weeks strong.';
  if (streak >= 7) return 'A full week, no misses.';
  if (streak >= 2) return 'The streak is alive.';
  return 'The streak starts today.';
}

// Flat-color blocks (no gradient / multi-layer shadow) — keeps satori fast.
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
  const streak = Math.max(1, parseInt(searchParams.get('streak') || '1', 10) || 1);
  const kind = (searchParams.get('kind') || 'puzzle') as keyof typeof KIND_COPY;
  const fenParam = searchParams.get('fen');
  const copy = KIND_COPY[kind] || KIND_COPY.puzzle;
  const orient = searchParams.get('orient') === 'black' ? 'black' : 'white';
  const outcome = searchParams.get('outcome') || ''; // game: win | loss | draw
  const gold = streak >= 100;
  // Board renders only when we have a real position (daily summary has none).
  const showBoard = kind !== 'daily' && !!fenParam;
  const subtitle = copy.subtitle;

  // Headline + chip per activity.
  let eyebrow = copy.eyebrow;
  let title = searchParams.get('label') || copy.title;
  let chip = searchParams.get('result') || (kind === 'daily' ? 'Complete' : '');
  let chipBg = gold ? '#F4B40A' : '#58CC02';
  let chipShadow = gold ? '#C9930A' : '#46A100';

  if (kind === 'game') {
    eyebrow = 'I just played Rookie';
    if (outcome === 'win') {
      title = 'I won';
      chip = chip || 'Checkmate';
      chipBg = '#58CC02';
      chipShadow = '#46A100';
    } else if (outcome === 'loss') {
      title = 'Rookie won';
      chip = chip || 'Checkmate';
      chipBg = '#FF4B4B';
      chipShadow = '#C9302C';
    } else if (outcome === 'draw') {
      title = "It's a draw";
      chip = chip || 'Draw';
      chipBg = '#7C8B99';
      chipShadow = '#5A6675';
    }
  }

  const W = 1080;
  const H = 1920;

  let board = parseBoard(fenParam || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  if (orient === 'black') board = board.slice().reverse().map((row) => row.slice().reverse());
  const SQ = 76;
  const LIGHT = BOARD_COLORS.light;
  const DARK = BOARD_COLORS.dark;

  const response = new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          flexDirection: 'column',
          background: '#DBEBF7',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 44,
          gap: 26,
        }}
      >
        {/* ── Brand bar (centered) ── */}
        <div
          style={{
            ...WINDOW,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '26px 44px',
            gap: 24,
          }}
        >
          {rookieLogo(22, false)}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 58,
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#15324A',
                lineHeight: 1,
              }}
            >
              Chess Path
            </div>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#5B7A93', marginTop: 6 }}>
              The fun way to learn chess
            </div>
          </div>
        </div>

        {/* ── Activity: what they did, with the board ── */}
        <div
          style={{
            ...WINDOW,
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '56px 44px',
            gap: 44,
          }}
        >
          {/* heading group */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: '0.2em',
                paddingLeft: '0.2em', // offset trailing letter-spacing so it stays centered
                color: '#5B7A93',
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 86,
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#15324A',
                lineHeight: 1.05,
                textAlign: 'center',
              }}
            >
              {title}
            </div>
            {chip ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: chipBg,
                  color: '#FFFFFF',
                  fontSize: 32,
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  paddingLeft: 36, // ~34px + trailing letter-spacing, keeps text centered
                  paddingRight: 34,
                  paddingTop: 12,
                  paddingBottom: 12,
                  borderRadius: 999,
                  boxShadow: `0 6px 0 0 ${chipShadow}`,
                }}
              >
                {chip.toUpperCase()}
              </div>
            ) : null}
            {subtitle ? (
              <div style={{ display: 'flex', fontSize: 34, fontWeight: 600, color: '#5B7A93', marginTop: 4 }}>
                {subtitle}
              </div>
            ) : null}
          </div>

          {/* Board — app's green/cream squares + the board's own piece SVGs */}
          {showBoard ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 8px 26px rgba(0,0,0,0.28)',
            }}
          >
            {board.map((row, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {row.map((piece, c) => {
                  const dark = (r + c) % 2 === 1;
                  return (
                    <div
                      key={c}
                      style={{
                        width: SQ,
                        height: SQ,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: dark ? DARK : LIGHT,
                      }}
                    >
                      {piece ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={PIECE_DATA_URIS[pieceCode(piece)]}
                          width={SQ}
                          height={SQ}
                          alt=""
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          ) : null}
        </div>

        {/* ── Streak ── */}
        <div
          style={{
            ...WINDOW,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 44px',
            gap: 40,
          }}
        >
          {rookieLogo(34, gold)}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 150,
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.05em',
                color: gold ? '#F4B40A' : '#15324A',
              }}
            >
              {streak}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 40,
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#5B7A93',
                  textTransform: 'uppercase',
                }}
              >
                Day Streak
              </div>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#2C4E68', marginTop: 4 }}>
                {streakLine(streak)}
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div
          style={{
            ...WINDOW,
            background: '#15324A',
            border: '3px solid #15324A',
            boxShadow: '0 10px 0 0 #0E2335',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 44px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#FFFFFF' }}>
            Start your streak at chesspath.app
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
  response.headers.set('Cache-Control', 'public, s-maxage=31536000, immutable');
  return response;
}
