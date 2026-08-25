import { PIECE_DATA_URIS } from '@/lib/og/chess-pieces';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';
import { BOARD_COLORS } from '@/lib/puzzle-utils';
import {
  CROWD_ROWS,
  crowdJitter,
  fightNightChrome,
  orientBoard,
  squareAt,
  lastSquares,
  parseBoard,
  pieceCode,
  tickFlashes,
  type FightNightBout,
  type FightNightFrame,
} from '@/lib/og/fight-night-data';

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

export type { FightNightFrame } from '@/lib/og/fight-night-data';

export type FightNightProps = {
  frame: FightNightFrame;
  outcome: string;
  username: string;
  moves: number;
  rounds: number;
  clock: string;
  /** Scale factor: 1 = 300x533. Static card uses 3.6 (1080x1920). */
  s: number;
  /** Rotates which ambient flashbulbs fire — pass the GIF frame index so
      they pop around the house as the GIF plays. */
  flashSeed?: number;
  /** Pre-rendered crowd band (data URI) — the GIF route bakes the heads
      once and reuses it, so per-frame renders only redraw the flashes. */
  crowdImg?: string;
  /** Per-kind chrome overrides (brand / opponent / headline / stats / stamp /
      CTA) — same shape the canvas GIF renderer takes, resolved by the shared
      fightNightChrome() so the two renderers can never drift. */
  chrome?: Pick<FightNightBout, 'headline' | 'stats' | 'stampText' | 'brand' | 'opponent' | 'cta'>;
};

export { parseBoard } from '@/lib/og/fight-night-data';

/** The static parts of the house: glow + terraced heads + fade. Rendered
    inline for single-frame cards, or baked to a PNG once per GIF. */
export function CrowdBand({ s }: { s: number }) {
  const heads: React.ReactNode[] = [];
  CROWD_ROWS.forEach((row, ri) => {
    for (let x = row.off - row.sp, i = 0; x <= 300 + row.sp; x += row.sp, i++) {
      const { dx, dy } = crowdJitter(i, ri);
      const jx = x + dx;
      const jy = row.y + dy;
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

/** The full house: static band (inline or pre-baked image) + the flash
    layer, which is cheap and varies every frame. */
function Crowd({ s, lit, seed, img }: { s: number; lit: boolean; seed: number; img?: string }) {
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
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} width={300 * s} height={150 * s} alt="" />
      ) : (
        <CrowdBand s={s} />
      )}
      {/* cameras: a rotating spread pops every flash tick; the knockout is a
          full flurry — the whole pool plus a reshuffling scatter on top */}
      {tickFlashes(seed, lit).map((f, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            position: 'absolute',
            left: (f.x - f.size / 2) * s,
            top: (f.y - f.size / 2) * s,
            width: f.size * s,
            height: f.size * s,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.95)',
            boxShadow: `0 0 ${(lit ? 11 : 8) * s}px ${(lit ? 5 : 3) * s}px rgba(255,255,255,${lit ? 0.65 : 0.5})`,
          }}
        />
      ))}
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

export function FightNightCard({ frame, outcome, username, moves, rounds, clock, s, flashSeed = 0, crowdImg, chrome }: FightNightProps) {
  const W = 300 * s;
  const H = 533 * s;
  const c = fightNightChrome({ outcome, username, moves, rounds, clock, ...chrome });
  const head = c.headline;
  const board = orientBoard(parseBoard(frame.fen), frame.flip);
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
      <Crowd s={s} lit={!!frame.stamp} seed={flashSeed} img={crowdImg} />

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
              {c.brandTitle}
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
              {c.brandSub}
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
          <Corner s={s} red name={c.username} tag="Red corner" />
          <Corner s={s} red={false} name={c.opponent} tag="Blue corner" />
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
                const sq = squareAt(r, c, frame.flip);
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
                {c.stampText}
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
          {c.stats.map(([v, l]) => (
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
          {c.cta}
        </div>
      </div>
    </div>
  );
}
