import { ImageResponse } from 'next/og';
import { PIECE_DATA_URIS } from '@/lib/og/chess-pieces';
import { BOARD_COLORS } from '@/lib/puzzle-utils';

export const runtime = 'edge';

/**
 * A bare board as a PNG — for emails, which cannot run the real board.
 *
 *   /api/og/board?fen=<fen>&orient=white|black&size=480
 *
 * Only the board field of the FEN is read. Same squares + piece art as the
 * share cards (app/api/og/workout).
 */

function pieceCode(ch: string): string {
  return (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase();
}

function parseBoard(fen: string): (string | null)[][] {
  const field = (fen || '').trim().split(/\s+/)[0] || '8/8/8/8/8/8/8/8';
  return field.split('/').slice(0, 8).map((rank) => {
    const row: (string | null)[] = [];
    for (const ch of rank) {
      if (/\d/.test(ch)) for (let i = 0; i < parseInt(ch, 10); i++) row.push(null);
      else if (/[prnbqkPRNBQK]/.test(ch)) row.push(ch);
    }
    while (row.length < 8) row.push(null);
    return row.slice(0, 8);
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(1024, Math.max(160, parseInt(searchParams.get('size') || '480', 10) || 480));
  const orient = searchParams.get('orient') === 'black' ? 'black' : 'white';
  let board = parseBoard(searchParams.get('fen') || '');
  if (orient === 'black') board = board.slice().reverse().map((row) => row.slice().reverse());
  const SQ = Math.floor(size / 8);
  const W = SQ * 8;

  const response = new ImageResponse(
    (
      <div style={{ width: W, height: W, display: 'flex', flexDirection: 'column' }}>
        {board.map((row, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {row.map((piece, c) => (
              <div
                key={c}
                style={{
                  width: SQ,
                  height: SQ,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (r + c) % 2 === 1 ? BOARD_COLORS.dark : BOARD_COLORS.light,
                }}
              >
                {piece && PIECE_DATA_URIS[pieceCode(piece)] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={PIECE_DATA_URIS[pieceCode(piece)]} width={SQ} height={SQ} alt="" />
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
    { width: W, height: W },
  );
  response.headers.set('Cache-Control', 'public, s-maxage=31536000, immutable');
  return response;
}
