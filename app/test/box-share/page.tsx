'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PIECE_DATA_URIS } from '@/lib/og/chess-pieces';
import { Crowd, ARENA_CSS } from '@/components/chessboxing/Arena';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';
import { BOARD_COLORS } from '@/lib/puzzle-utils';

/**
 * /test/box-share — 5 concepts for the Chess Boxing post-bout share asset.
 *
 * Each card is reel-sized (9:16) and combines:
 *   1. An animated replay of the last moves before checkmate (the "GIF" —
 *      here a looping CSS animation; the export pipeline would render the
 *      same frames to an actual GIF/MP4).
 *   2. The bout result card language from the Chess Boxing landing
 *      (RingHome corners/coin/gold) and the existing bout OG family.
 *
 * Sample game: scholar's mate finish — Qh5, Nf6??, Qxf7#.
 */

/* ──────────────────────────── animated board ──────────────────────────── */

type Piece = { id: string; code: string; sq: string };
type Move = { id: string; to: string; captures?: string; mate?: boolean };

const BASE: Piece[] = [
  { id: 'wRa', code: 'wR', sq: 'a1' }, { id: 'wNb', code: 'wN', sq: 'b1' },
  { id: 'wBc', code: 'wB', sq: 'c1' }, { id: 'wQ', code: 'wQ', sq: 'd1' },
  { id: 'wK', code: 'wK', sq: 'e1' }, { id: 'wBf', code: 'wB', sq: 'c4' },
  { id: 'wNg', code: 'wN', sq: 'g1' }, { id: 'wRh', code: 'wR', sq: 'h1' },
  { id: 'wPa', code: 'wP', sq: 'a2' }, { id: 'wPb', code: 'wP', sq: 'b2' },
  { id: 'wPc', code: 'wP', sq: 'c2' }, { id: 'wPd', code: 'wP', sq: 'd2' },
  { id: 'wPe', code: 'wP', sq: 'e4' }, { id: 'wPf', code: 'wP', sq: 'f2' },
  { id: 'wPg', code: 'wP', sq: 'g2' }, { id: 'wPh', code: 'wP', sq: 'h2' },
  { id: 'bRa', code: 'bR', sq: 'a8' }, { id: 'bNc', code: 'bN', sq: 'c6' },
  { id: 'bBc', code: 'bB', sq: 'c8' }, { id: 'bQ', code: 'bQ', sq: 'd8' },
  { id: 'bK', code: 'bK', sq: 'e8' }, { id: 'bBf', code: 'bB', sq: 'f8' },
  { id: 'bNg', code: 'bN', sq: 'g8' }, { id: 'bRh', code: 'bR', sq: 'h8' },
  { id: 'bPa', code: 'bP', sq: 'a7' }, { id: 'bPb', code: 'bP', sq: 'b7' },
  { id: 'bPc', code: 'bP', sq: 'c7' }, { id: 'bPd', code: 'bP', sq: 'd7' },
  { id: 'bPe', code: 'bP', sq: 'e5' }, { id: 'bPf', code: 'bP', sq: 'f7' },
  { id: 'bPg', code: 'bP', sq: 'g7' }, { id: 'bPh', code: 'bP', sq: 'h7' },
];

const MOVES: Move[] = [
  { id: 'wQ', to: 'h5' },
  { id: 'bNg', to: 'f6' },
  { id: 'wQ', to: 'f7', captures: 'bPf', mate: true },
];

const MOVE_MS = 1100;
const MATE_HOLD_MS = 2600;

function sqXY(sq: string): { x: number; y: number } {
  return { x: sq.charCodeAt(0) - 97, y: 8 - Number(sq[1]) };
}

/** Board state (piece → square, captured set, last move) after n moves. */
function frameAt(n: number) {
  const pos = new Map(BASE.map((p) => [p.id, p.sq]));
  const gone = new Set<string>();
  let last: { from: string; to: string } | null = null;
  for (let i = 0; i < n; i++) {
    const m = MOVES[i];
    last = { from: pos.get(m.id)!, to: m.to };
    pos.set(m.id, m.to);
    if (m.captures) gone.add(m.captures);
  }
  return { pos, gone, last, mate: n === MOVES.length };
}

function AnimatedBoard({ stamp = true }: { stamp?: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const atEnd = step === MOVES.length;
    const t = setTimeout(
      () => setStep(atEnd ? 0 : step + 1),
      atEnd ? MATE_HOLD_MS : MOVE_MS,
    );
    return () => clearTimeout(t);
  }, [step]);

  const { pos, gone, last, mate } = frameAt(step);
  const jump = step === 0; // reset is a cut, not a slide backwards

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-[4%]">
      {/* squares */}
      {Array.from({ length: 64 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const sq = String.fromCharCode(97 + x) + (8 - y);
        const hl = last && (last.from === sq || last.to === sq);
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${x * 12.5}%`,
              top: `${y * 12.5}%`,
              width: '12.5%',
              height: '12.5%',
              background: (x + y) % 2 ? BOARD_COLORS.dark : BOARD_COLORS.light,
            }}
          >
            {hl && <div className="absolute inset-0 bg-[#f6c445]/55" />}
          </div>
        );
      })}
      {/* pieces */}
      {BASE.map((p) => {
        const { x, y } = sqXY(pos.get(p.id)!);
        const captured = gone.has(p.id);
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.id}
            src={PIECE_DATA_URIS[p.code]}
            alt=""
            className="absolute pointer-events-none"
            style={{
              left: `${x * 12.5}%`,
              top: `${y * 12.5}%`,
              width: '12.5%',
              height: '12.5%',
              transition: jump
                ? 'none'
                : 'left 0.45s ease, top 0.45s ease, opacity 0.3s ease',
              opacity: captured ? 0 : 1,
              zIndex: p.id === 'wQ' ? 3 : 2,
            }}
          />
        );
      })}
      {/* checkmate stamp */}
      {stamp && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-300 ${
            mate ? 'opacity-100 scale-100' : 'opacity-0 scale-125'
          }`}
        >
          <div className="rotate-[-8deg] rounded-xl border-4 border-chess-red bg-chess-bg/85 px-4 py-1.5 text-chess-red text-xl font-black uppercase tracking-widest shadow-[0_4px_18px_rgba(0,0,0,0.5)]">
            Checkmate
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── brand bits ──────────────────────────── */

function RookieLogo({ bs }: { bs: number }) {
  const gap = bs * 1.16;
  return (
    <div className="relative" style={{ width: 4 * gap + bs, height: 5 * gap + bs }}>
      {ROOK_BLOCKS.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
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

/** Sample bout result every card shares. */
const BOUT = {
  name: 'tyler',
  headline: 'KO — CHECKMATE',
  material: 'Up a queen at the bell',
  moves: 24,
  rounds: 3,
  clock: '1:24',
  points: 850,
};

function Coin({ label, size = 44 }: { label: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-[#f6c445] border-[3px] border-[#b8860b] shadow-[0_3px_0_0_#8a6508] flex items-center justify-center rotate-[-8deg]"
      style={{ width: size, height: size }}
    >
      <span className="font-black text-[#3d2e00] tracking-tight" style={{ fontSize: size * 0.34 }}>
        {label}
      </span>
    </div>
  );
}

/* ──────────────────────────── the 5 options ──────────────────────────── */

function Reel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-[300px] shrink-0 aspect-[9/16] overflow-hidden rounded-3xl ${className}`}>
      {children}
    </div>
  );
}

/** 1 — Fight Night: the Living Ring landing, as a share card. */
function FightNight() {
  return (
    <Reel className="bg-[#131a2e] text-white">
      <style>{ARENA_CSS}</style>
      {/* the house — the Living Ring landing's exact recipe: breathing gold
          spotlight over the terraced crowd + flashbulbs, fading into the card */}
      <div
        className="ring-breathe absolute inset-x-0 top-0 h-[240px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 70% 90% at 50% -10%, rgba(246,196,69,0.16), transparent 68%)' }}
      />
      {/* same crowd as the landing at its native 390px width (cropped at the
          sides) so the heads render landing-size, plus a slight lift so the
          band reads at card scale */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[390px] h-[196px] [filter:brightness(1.35)]">
        <Crowd />
      </div>
      <div className="absolute inset-x-0 top-[120px] h-[80px] bg-gradient-to-b from-transparent to-[#131a2e] pointer-events-none z-[1]" />

      <div className="relative z-[2] h-full flex flex-col px-4 pt-4 pb-2.5">
        <div className="flex items-center justify-center gap-2">
          <RookieLogo bs={7} />
          <div>
            <div className="text-[17px] font-black leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">Chess Boxing</div>
            <div className="text-[8.5px] font-bold text-white/70 mt-0.5 uppercase tracking-[0.18em]">
              Fight Night
            </div>
          </div>
        </div>

        {/* tale of the tape */}
        <div className="mt-3 relative grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-chess-red border-2 border-[#e86060] shadow-[0_4px_0_0_#CC3939] py-1.5 text-center">
            <div className="text-[13px] font-black uppercase">{BOUT.name}</div>
            <div className="text-[8px] font-black uppercase tracking-[0.14em] text-[#ffd7a1]">Red corner</div>
          </div>
          <div className="rounded-xl bg-chess-blue border-2 border-[#54c2f8] shadow-[0_4px_0_0_#0d7ec4] py-1.5 text-center">
            <div className="text-[13px] font-black uppercase">Rookie</div>
            <div className="text-[8px] font-black uppercase tracking-[0.14em] text-[#d8f1ff]">Blue corner</div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Coin label="VS" size={34} />
          </div>
        </div>

        <div className="mt-3 mx-2 rounded-2xl border-2 border-[#f6c445] shadow-[0_0_24px_rgba(246,196,69,0.25)] overflow-hidden">
          <AnimatedBoard />
        </div>

        <div className="mt-2.5 flex items-baseline justify-center gap-2 italic uppercase">
          <span className="text-[30px] font-black leading-none text-[#f6c445] drop-shadow-[0_3px_0_rgba(0,0,0,0.45)]">
            KO
          </span>
          <span className="text-[19px] font-black leading-none tracking-tight text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.45)]">
            by checkmate
          </span>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-1.5 text-center">
          {[
            [String(BOUT.moves), 'Moves'],
            [`R${BOUT.rounds}`, 'Round'],
            [BOUT.clock, 'Clock left'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg bg-white/[0.07] border border-white/10 py-1.5">
              <div className="text-[15px] font-black tabular-nums">{v}</div>
              <div className="text-[7.5px] font-black uppercase tracking-[0.16em] text-white/45">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-xl bg-[#f6c445] py-2 text-center text-[11px] font-black uppercase tracking-wide text-[#3d2e00] shadow-[0_3px_0_0_#b8860b]">
          Box + solve at chesspath.app
        </div>
      </div>
    </Reel>
  );
}

/** 2 — Judges' Card: the existing light bout-OG family, board window animated. */
function JudgesCard() {
  return (
    <Reel className="bg-[#DBEBF7]">
      <div className="h-full flex flex-col gap-2 p-3">
        <div className="rounded-2xl bg-white border-2 border-[#DCE8F1] shadow-[0_3px_0_0_#D2E0EC] flex items-center justify-center gap-2.5 py-2.5">
          <RookieLogo bs={6} />
          <div>
            <div className="text-[16px] font-black text-[#15324A] leading-none">Chess Boxing</div>
            <div className="text-[8px] font-bold text-[#5B7A93] mt-0.5">
              Three rounds of chess. Two of gloves.
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl bg-white border-2 border-[#DCE8F1] shadow-[0_3px_0_0_#D2E0EC] flex flex-col items-center justify-around px-3 py-3">
          <div className="text-[8.5px] font-extrabold uppercase tracking-[0.2em] text-[#5B7A93]">
            vs Rookie
          </div>
          <div className="text-[22px] font-black text-chess-green tracking-tight leading-none">
            {BOUT.headline}
          </div>
          <div className="text-[13px] font-black text-[#15324A]">{BOUT.name}</div>

          <div className="w-full mt-1.5 rounded-xl overflow-hidden border-2 border-[#DCE8F1] shadow-[0_6px_18px_rgba(21,50,74,0.15)]">
            <AnimatedBoard />
          </div>
          <div className="mt-1.5 w-full rounded-lg bg-[#F1F7FC] border-2 border-[#DCE8F1] py-1.5 text-center">
            <div className="text-[7.5px] font-extrabold uppercase tracking-[0.18em] text-[#5B7A93]">
              The finish
            </div>
            <div className="text-[12px] font-black text-[#15324A]">{BOUT.material}</div>
          </div>

          <div className="mt-1.5 flex gap-5">
            {[
              [String(BOUT.moves), 'Moves'],
              [String(BOUT.rounds), 'Rounds'],
              [BOUT.clock, 'Clock'],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-[16px] font-black text-[#15324A] tabular-nums leading-none">{v}</div>
                <div className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#5B7A93] mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#15324A] shadow-[0_3px_0_0_#0E2335] py-2.5 text-center text-[11px] font-black text-white">
          Box + solve at chesspath.app
        </div>
      </div>
    </Reel>
  );
}

/** 3 — Fight Poster: diagonal red/blue split, big matchup type. */
function FightPoster() {
  return (
    <Reel className="bg-chess-bg text-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(115deg, #FF4B4B 0%, #CC3939 46%, #0d7ec4 54%, #1CB0F6 100%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative h-full flex flex-col items-center px-4 pt-5 pb-3">
        <div className="text-[8.5px] font-black uppercase tracking-[0.4em] text-white/80">
          Chess Boxing presents
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[24px] font-black uppercase italic drop-shadow-[0_2px_0_rgba(0,0,0,0.4)]">
            {BOUT.name}
          </span>
          <Coin label="VS" size={30} />
          <span className="text-[24px] font-black uppercase italic drop-shadow-[0_2px_0_rgba(0,0,0,0.4)]">
            Rookie
          </span>
        </div>

        <div className="mt-4 w-full rounded-xl border-4 border-white/90 shadow-[0_14px_34px_rgba(0,0,0,0.5)] rotate-[-2deg] overflow-hidden">
          <AnimatedBoard />
        </div>

        <div className="mt-5 rotate-[-2deg] rounded-lg bg-white px-4 py-1.5 shadow-[0_4px_0_0_rgba(0,0,0,0.3)]">
          <span className="text-[16px] font-black uppercase tracking-tight text-[#15324A]">
            KO · Round {BOUT.rounds} · {BOUT.moves} moves
          </span>
        </div>
        <div className="mt-2 text-[11px] font-bold text-white/85">{BOUT.material}</div>

        <div className="mt-auto flex items-center gap-2">
          <RookieLogo bs={5} />
          <span className="text-[11px] font-black">chesspath.app</span>
        </div>
      </div>
    </Reel>
  );
}

/** 4 — Instant Replay: broadcast-replay chrome around the finish. */
function InstantReplay() {
  return (
    <Reel className="bg-[#0D1A1F] text-white">
      <div className="h-full flex flex-col px-4 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-chess-red animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
              Instant replay
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wide text-[#f6c445]">
            Round {BOUT.rounds}
          </span>
        </div>

        <div className="mt-3 relative rounded-xl overflow-hidden border border-white/15">
          <AnimatedBoard />
          {/* scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{ background: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)' }}
          />
          {/* lower-third */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent px-3 pt-6 pb-2 flex items-end justify-between">
            <span className="text-[12px] font-black uppercase">{BOUT.name} · Qxf7#</span>
            <span className="text-[10px] font-bold text-white/70 tabular-nums">{BOUT.clock} left</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-[30px] font-black leading-none tracking-tight">
            <span className="text-chess-red">KO</span> BY CHECKMATE
          </div>
          <div className="mt-1.5 text-[11px] font-bold text-white/60">
            {BOUT.material} · {BOUT.moves} moves
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/boxing/locker/gloves.webp"
              alt=""
              width={38}
              height={34}
              className="object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
            />
            <div>
              <div className="text-[12px] font-black leading-none">Chess Boxing</div>
              <div className="text-[8px] font-bold text-white/50 mt-0.5">by The Chess Path</div>
            </div>
          </div>
          <div className="rounded-full bg-chess-green px-3 py-1.5 text-[10px] font-black uppercase shadow-[0_3px_0_0_#3d8c01]">
            Fight me
          </div>
        </div>
      </div>
    </Reel>
  );
}

/** 5 — The Knockout: minimal, board is the whole story. */
function MinimalKO() {
  return (
    <Reel className="bg-[#0D1A1F] text-white">
      <div className="absolute inset-0 border-[3px] border-[#f6c445]/60 rounded-3xl pointer-events-none z-10" />
      <div className="h-full flex flex-col items-center justify-center px-5">
        <RookieLogo bs={8} />
        <div className="mt-5 w-full rounded-lg overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.6)]">
          <AnimatedBoard stamp={false} />
        </div>
        <div className="mt-6 text-center">
          <div className="text-[19px] font-black tracking-tight leading-snug">
            Checkmate. {BOUT.moves} moves.
            <br />
            Round {BOUT.rounds} of the gloves.
          </div>
          <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            Chess Boxing · chesspath.app
          </div>
        </div>
      </div>
    </Reel>
  );
}

/* ──────────────────────────── page ──────────────────────────── */

const OPTIONS: { name: string; note: string; el: React.ReactNode }[] = [
  {
    name: '1 · Fight Night',
    note: 'The Living Ring landing as a card — tale of the tape, gold-roped board, corner colors.',
    el: <FightNight />,
  },
  {
    name: "2 · Judges' Card",
    note: 'Matches the existing bout OG family (light windows) with the board window animated.',
    el: <JudgesCard />,
  },
  {
    name: '3 · Fight Poster',
    note: 'Red/blue diagonal matchup poster — the bout as an event, board tilted like a taped-up flyer.',
    el: <FightPoster />,
  },
  {
    name: '4 · Instant Replay',
    note: 'Broadcast replay chrome — REC dot, lower-third with the mating move, KO headline.',
    el: <InstantReplay />,
  },
  {
    name: '5 · The Knockout',
    note: 'Minimal: gold ring border, the board is the whole story, one line of copy.',
    el: <MinimalKO />,
  },
];

export default function BoxSharePage() {
  return (
    <div className="h-full overflow-auto bg-chess-bg text-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-2xl font-black">Chess Boxing — share asset concepts</h1>
        <p className="mt-1 text-sm text-white/60 max-w-2xl">
          5 reel-sized (9:16) options. Each loops the final moves before checkmate
          (sample: Qh5, Nf6, Qxf7#) — the export pipeline would render the same
          frames to a real GIF/MP4 with the card baked in.
        </p>

        <div className="mt-8 flex flex-wrap gap-8">
          {OPTIONS.map((o) => (
            <div key={o.name}>
              {o.el}
              <div className="mt-3 w-[300px]">
                <div className="text-sm font-black">{o.name}</div>
                <div className="mt-0.5 text-xs text-white/55 leading-snug">{o.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
