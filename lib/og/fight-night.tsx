import { PIECE_DATA_URIS } from '@/lib/og/chess-pieces';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';
import { BOARD_COLORS } from '@/lib/puzzle-utils';

/**
 * Fight Night — the Chess Boxing share card, rendered by satori (next/og).
 * Approved on /test/box-share (2026-08-07). One component serves both:
 *   - /api/og/bout      — static PNG of the final position (1080x1920)
 *   - /api/og/bout-gif  — animated GIF frames of the last moves (540x960)
 *
 * Everything is sized off a scale factor `s` (design space = the 300x533
 * test-page card), so the same JSX renders crisp at any output size.
 *
 * Satori constraints honored here: every div has display:flex, no CSS
 * animations, no SVG filters — the crowd is plain positioned divs.
 */

export type FightNightFrame = {
  /** FEN (board field is all that's read). */
  fen: string;
  /** Last move squares to highlight, e.g. "h5f7". */
  last?: string;
  /** Show the CHECKMATE stamp over the board. */
  stamp?: boolean;
};

export type FightNightProps = {
  frame: FightNightFrame;
  outcome: string;
  username: string;
  moves: number;
  rounds: number;
  clock: string;
  /** Scale factor: 1 = 300x533. Static card uses 3.6 (1080x1920). */
  s: number;
};

/** FEN letter -> piece code (uppercase = white). */
function pieceCode(ch: string): string {
  return (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase();
}

export function parseBoard(fen: string): (string | null)[][] {
  const field = (fen || '').trim().split(/\s+/)[0] || '8/8/8/8/8/8/8/8';
  const rows = field.split('/').slice(0, 8);
  return rows.map((row) => {
    const out: (string | null)[] = [];
    for (const ch of row) {
      if (/[1-8]/.test(ch)) {
        for (let i = 0; i < Number(ch); i++) out.push(null);
      } else if (/[prnbqkPRNBQK]/.test(ch)) {
        out.push(ch);
      }
      if (out.length >= 8) break;
    }
    while (out.length < 8) out.push(null);
    return out;
  });
}

/** "h5f7" -> Set of square names to highlight. */
function lastSquares(last?: string): Set<string> {
  const out = new Set<string>();
  if (last && /^[a-h][1-8][a-h][1-8]$/.test(last)) {
    out.add(last.slice(0, 2));
    out.add(last.slice(2, 4));
  }
  return out;
}

/* ── outcome copy: gold word + white rest, mirroring the bout card family ── */
const HEADLINES: Record<string, { big: string; rest: string; win: boolean }> = {
  ko_win: { big: 'KO', rest: 'by checkmate', win: true },
  ko_loss: { big: 'KO', rest: 'Rookie mates me', win: false },
  flag_loss: { big: 'LOSS', rest: 'on time', win: false },
  decision_win: { big: 'WIN', rest: 'on the board', win: true },
  decision_loss: { big: 'LOSS', rest: 'on the decision', win: false },
  draw: { big: 'DRAW', rest: 'at the final bell', win: false },
};

/* Crowd: components/chessboxing/Arena.tsx CROWD_ROWS scaled from its
   390-wide viewBox into the 300-wide design space (x0.77) — same terraces,
   same fills, same jitter, so the card's house matches the box homepage. */
const CROWD_ROWS = [
  { y: 7.7, r: 2.3, sp: 10.0, off: 0, fill: '#121b30', op: 0.6 },
  { y: 18.5, r: 2.6, sp: 10.8, off: 5.4, fill: '#121b30', op: 0.62 },
  { y: 30.8, r: 2.9, sp: 11.6, off: 2.3, fill: '#111a2e', op: 0.65 },
  { y: 43.9, r: 3.3, sp: 13.1, off: 6.9, fill: '#111a2e', op: 0.68 },
  { y: 57.8, r: 3.7, sp: 13.9, off: 3.9, fill: '#101828', op: 0.7 },
  { y: 72.4, r: 4.2, sp: 15.4, off: 8.5, fill: '#101828', op: 0.72 },
  { y: 87.8, r: 4.6, sp: 16.9, off: 3.1, fill: '#0e1526', op: 0.78 },
  { y: 104.0, r: 5.4, sp: 18.5, off: 9.2, fill: '#0e1526', op: 0.85 },
  { y: 121.7, r: 6.9, sp: 20.8, off: 4.6, fill: '#0a101f', op: 1 },
];

/** Flashbulbs (design-space coords). `lit` renders them firing. */
const FLASHES = [
  { x: 26, y: 14 }, { x: 74, y: 40 }, { x: 128, y: 10 },
  { x: 187, y: 52 }, { x: 236, y: 22 }, { x: 281, y: 46 },
];

function Crowd({ s, lit }: { s: number; lit: boolean }) {
  const heads: React.ReactNode[] = [];
  CROWD_ROWS.forEach((row, ri) => {
    for (let x = row.off - row.sp, i = 0; x <= 300 + row.sp; x += row.sp, i++) {
      const jx = x + (((i + ri) % 3) - 1) * 1.6;
      const jy = row.y + (((i * 2 + ri) % 4) - 1.5) * 1.3;
      // Head circle + shoulder block, same construction as Arena's SVG.
      heads.push(
        <div
          key={`h${ri}-${i}`}
          style={{
            display: 'flex',
            position: 'absolute',
            left: (jx - row.r) * s,
            top: (jy - row.r) * s,
            width: row.r * 2 * s,
            height: row.r * 2 * s,
            borderRadius: 999,
            background: row.fill,
            opacity: row.op,
          }}
        />,
        <div
          key={`s${ri}-${i}`}
          style={{
            display: 'flex',
            position: 'absolute',
            left: (jx - row.r * 1.2) * s,
            top: (jy + row.r * 0.75) * s,
            width: row.r * 2.4 * s,
            height: row.r * 2.2 * s,
            borderRadius: row.r * 0.9 * s,
            background: row.fill,
            opacity: row.op,
          }}
        />,
      );
    }
  });
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        left: 0,
        top: 0,
        width: 300 * s,
        height: 150 * s,
        overflow: 'hidden',
      }}
    >
      {/* Arena's house glow, lifted ~1.35x so it reads at card scale */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: 0,
          top: 0,
          width: 300 * s,
          height: 150 * s,
          background:
            'linear-gradient(to bottom, rgba(63,78,120,0.46), rgba(52,66,105,0.35) 45%, rgba(40,52,86,0.22) 78%, rgba(19,26,46,0))',
        }}
      />
      {/* breathing gold spotlight, frozen at full */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: 30 * s,
          top: -60 * s,
          width: 240 * s,
          height: 160 * s,
          borderRadius: 999,
          background: 'rgba(246,196,69,0.12)',
        }}
      />
      {heads}
      {lit &&
        FLASHES.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              position: 'absolute',
              left: (f.x - 4) * s,
              top: (f.y - 4) * s,
              width: 8 * s,
              height: 8 * s,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.92)',
              boxShadow: `0 0 ${8 * s}px ${3 * s}px rgba(255,255,255,0.55)`,
            }}
          />
        ))}
      {/* fade into the card */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: 0,
          top: 100 * s,
          width: 300 * s,
          height: 50 * s,
          background: 'linear-gradient(to bottom, rgba(19,26,46,0), #131a2e)',
        }}
      />
    </div>
  );
}

function RookieLogo({ bs }: { bs: number }) {
  const gap = bs * 1.16;
  return (
    <div style={{ display: 'flex', position: 'relative', width: 4 * gap + bs, height: 5 * gap + bs }}>
      {ROOK_BLOCKS.map((b, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            position: 'absolute',
            left: b.x * gap,
            top: b.y * gap,
            width: bs,
            height: bs,
            borderRadius: bs * 0.2,
            background: b.color,
          }}
        />
      ))}
    </div>
  );
}

function Corner({ s, red, name, tag }: { s: number; red: boolean; name: string; tag: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        width: 0,
        borderRadius: 12 * s,
        border: `${2 * s}px solid ${red ? '#e86060' : '#54c2f8'}`,
        background: red ? '#FF4B4B' : '#1CB0F6',
        boxShadow: `0 ${4 * s}px 0 0 ${red ? '#CC3939' : '#0d7ec4'}`,
        padding: `${6 * s}px 0 ${5 * s}px`,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 13 * s,
          fontWeight: 900,
          color: '#FFFFFF',
          textTransform: 'uppercase',
        }}
      >
        {name}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 8 * s,
          fontWeight: 900,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: red ? '#ffd7a1' : '#d8f1ff',
        }}
      >
        {tag}
      </div>
    </div>
  );
}

export function FightNightCard({ frame, outcome, username, moves, rounds, clock, s }: FightNightProps) {
  const W = 300 * s;
  const H = 533 * s;
  const head = HEADLINES[outcome] || { big: 'BOUT', rest: 'complete', win: false };
  const board = parseBoard(frame.fen);
  const hl = lastSquares(frame.last);
  // Integer square size — fractional squares leave sub-pixel seam lines
  // between ranks/files in satori's rasterizer.
  const SQ = Math.round((252 * s) / 8);
  const BOARD_W = SQ * 8;

  return (
    <div
      style={{
        width: W,
        height: H,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: '#131a2e',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <Crowd s={s} lit={!!frame.stamp} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: W,
          height: H,
          padding: `${16 * s}px ${16 * s}px ${10 * s}px`,
        }}
      >
        {/* brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 * s }}>
          <RookieLogo bs={7 * s} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 17 * s, fontWeight: 900, color: '#FFFFFF' }}>
              Chess Boxing
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 8.5 * s,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginTop: 1 * s,
              }}
            >
              Fight Night
            </div>
          </div>
        </div>

        {/* tale of the tape */}
        <div
          style={{
            display: 'flex',
            position: 'relative',
            gap: 8 * s,
            marginTop: 12 * s,
            alignItems: 'center',
          }}
        >
          <Corner s={s} red name={username || 'You'} tag="Red corner" />
          <Corner s={s} red={false} name="Rookie" tag="Blue corner" />
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              left: W / 2 - 16 * s - 17 * s,
              top: '50%',
              transform: 'translateY(-50%) rotate(-8deg)',
              width: 34 * s,
              height: 34 * s,
              borderRadius: 999,
              background: '#f6c445',
              border: `${3 * s}px solid #b8860b`,
              boxShadow: `0 ${3 * s}px 0 0 #8a6508`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', fontSize: 12 * s, fontWeight: 900, color: '#3d2e00' }}>VS</div>
          </div>
        </div>

        {/* the board in gold ropes */}
        <div
          style={{
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            marginTop: 12 * s,
            alignSelf: 'center',
            width: BOARD_W + 4 * s,
            borderRadius: 14 * s,
            border: `${2 * s}px solid #f6c445`,
            boxShadow: `0 0 ${24 * s}px rgba(246,196,69,0.25)`,
            overflow: 'hidden',
          }}
        >
          {board.map((row, r) => (
            <div key={r} style={{ display: 'flex' }}>
              {row.map((piece, c) => {
                const sq = String.fromCharCode(97 + c) + (8 - r);
                return (
                  <div
                    key={c}
                    style={{
                      width: SQ,
                      height: SQ,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      background: (r + c) % 2 ? BOARD_COLORS.dark : BOARD_COLORS.light,
                    }}
                  >
                    {hl.has(sq) && (
                      <div
                        style={{
                          display: 'flex',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: SQ,
                          height: SQ,
                          background: 'rgba(246,196,69,0.55)',
                        }}
                      />
                    )}
                    {piece ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={PIECE_DATA_URIS[pieceCode(piece)]} width={SQ} height={SQ} alt="" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
          {frame.stamp && (
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                left: 0,
                top: 0,
                width: BOARD_W,
                height: BOARD_W,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  transform: 'rotate(-8deg)',
                  borderRadius: 10 * s,
                  border: `${3.5 * s}px solid #FF4B4B`,
                  background: 'rgba(13,26,31,0.85)',
                  padding: `${5 * s}px ${14 * s}px`,
                  fontSize: 19 * s,
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#FF4B4B',
                }}
              >
                Checkmate
              </div>
            </div>
          )}
        </div>

        {/* result */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 7 * s,
            marginTop: 10 * s,
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 30 * s,
              fontWeight: 900,
              color: head.win ? '#f6c445' : '#FF4B4B',
              transform: 'rotate(-2deg)',
            }}
          >
            {head.big}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 17 * s,
              fontWeight: 900,
              color: '#FFFFFF',
              transform: 'rotate(-2deg)',
            }}
          >
            {head.rest}
          </div>
        </div>

        {/* stats */}
        <div style={{ display: 'flex', gap: 6 * s, marginTop: 'auto' }}>
          {[
            [String(moves), 'Moves'],
            [rounds > 0 ? `R${rounds}` : '—', 'Round'],
            [clock, 'Clock left'],
          ].map(([v, l]) => (
            <div
              key={l}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexGrow: 1,
                width: 0,
                borderRadius: 8 * s,
                background: 'rgba(255,255,255,0.07)',
                border: `${1 * s}px solid rgba(255,255,255,0.1)`,
                padding: `${6 * s}px 0`,
              }}
            >
              <div style={{ display: 'flex', fontSize: 15 * s, fontWeight: 900, color: '#FFFFFF' }}>{v}</div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 7.5 * s,
                  fontWeight: 900,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8 * s,
            borderRadius: 12 * s,
            background: '#f6c445',
            boxShadow: `0 ${3 * s}px 0 0 #b8860b`,
            padding: `${8 * s}px 0`,
            fontSize: 11 * s,
            fontWeight: 900,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#3d2e00',
          }}
        >
          Box + solve at chesspath.app
        </div>
      </div>
    </div>
  );
}
