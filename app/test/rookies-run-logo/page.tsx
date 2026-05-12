'use client';

import { ROOK_BLOCKS, getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

const BLOCK = 22;
const GAP = 3;
const COLS = 5;
const ROWS = 6;
const LEAN = 5;

const SPEED_LINE_LENGTH = BLOCK * 2.8;
const SPEED_LINE_HEIGHT = 4;
const SPEED_ROWS = [1, 2, 3];

function Mascot() {
  const leanTop = (ROWS - 1) * LEAN;
  const innerW = COLS * BLOCK + (COLS - 1) * GAP + leanTop;
  const innerH = ROWS * BLOCK + (ROWS - 1) * GAP;
  const tailroom = BLOCK * 3.5;

  return (
    <div
      style={{
        position: 'relative',
        width: tailroom + innerW,
        height: innerH,
      }}
    >
      {ROOK_BLOCKS.map((b) => {
        const lean = b.y * LEAN;
        const left = tailroom + b.x * (BLOCK + GAP) + lean;
        const top = b.y * (BLOCK + GAP);
        return (
          <div
            key={`b-${b.x}-${b.y}`}
            style={{
              position: 'absolute',
              left,
              top,
              width: BLOCK,
              height: BLOCK,
              borderRadius: 2,
              background: getMatteBackground(b.color),
              boxShadow: getMatteBoxShadow(b.color, BLOCK / 14),
            }}
          />
        );
      })}
    </div>
  );
}

function Wordmark() {
  return (
    <div
      className="self-stretch leading-none flex flex-col items-stretch justify-between"
      style={{ paddingBottom: 5 }}
    >
      <div
        className="text-[52px] font-black tracking-tight text-chess-text leading-none"
        style={{ marginTop: '-0.18em' }}
      >
        Rookie&rsquo;s
      </div>
      <div className="px-6 py-3 rounded-2xl bg-chess-blue shadow-[0_5px_0_#1899D6] text-center">
        <span className="text-[60px] font-black tracking-tight text-white leading-none">
          RUN
        </span>
      </div>
    </div>
  );
}

export default function RookiesRunLogoPage() {
  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-chess-text">
            Rookie&apos;s Run — logo
          </h1>
          <p className="text-sm text-chess-text-muted mt-1">
            Lean + 3 equal-width speed lines. Embroidery-safe.
          </p>
        </header>

        <section className="rounded-2xl bg-chess-surface shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-chess-page flex items-center justify-center p-10 min-h-[240px]">
            <div className="flex items-stretch gap-1">
              <Mascot />
              <Wordmark />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
