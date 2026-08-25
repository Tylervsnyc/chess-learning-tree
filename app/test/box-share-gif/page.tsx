'use client';

import { useEffect, useState } from 'react';
import { buildGameShareFrames, buildPuzzleShareFrames } from '@/lib/share/fight-night-frames';
import type { FightNightBout, FightNightFrame } from '@/lib/og/fight-night-data';

/**
 * /test/box-share-gif — proves the on-device Fight Night GIF renderer
 * (lib/share/fight-night-gif.ts) for all three shares that use the card:
 * the BOUT, a Puzzle Boxing SOLVE, and a /play win. Each renders on mount and
 * reports its render time. This is the exact path the Share buttons use.
 */

const SCHOLARS: FightNightFrame[] = [
  { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR' },
  { fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR', last: 'd1h5' },
  { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR', last: 'g8f6' },
  { fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR', last: 'h5f7', stamp: true },
];

/* A /play finish, built the way the page builds it: the last plies of the
   game, flipped because this sample was played from Black's side. */
const PLAY_FRAMES = buildGameShareFrames(
  [
    { from: 'f2', to: 'f3', fenAfter: 'rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq - 0 1' },
    { from: 'e7', to: 'e5', fenAfter: 'rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2' },
    { from: 'g2', to: 'g4', fenAfter: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2' },
    { from: 'd8', to: 'h4', fenAfter: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3' },
  ],
  true,
  true,
);

const PUZZLE_FRAMES = buildPuzzleShareFrames(
  '2kr3r/ppp2ppp/2n1b3/8/2B5/2N5/PPP2PPP/2KR3R w - - 0 1',
  ['c4e6', 'f7e6', 'd1d8'],
);

const CARDS: { key: string; label: string; frames: FightNightFrame[]; bout: FightNightBout }[] = [
  {
    key: 'bout',
    label: 'Bout (Chess Boxing)',
    frames: SCHOLARS,
    bout: { outcome: 'ko_win', username: 'tyler', moves: 24, rounds: 3, clock: '1:24' },
  },
  {
    key: 'puzzle',
    label: 'Puzzle Boxing — toughest solve',
    frames: PUZZLE_FRAMES,
    bout: {
      outcome: 'puzzle_win',
      username: 'tyler',
      opponent: '1650 PUZZLE',
      moves: 0,
      rounds: 0,
      clock: '',
      headline: { big: 'SOLVED', rest: 'a 1650 puzzle', win: true },
      stats: [
        ['14', 'SOLVED'],
        ['320', 'POINTS'],
        ['1650', 'TOUGHEST'],
      ],
      stampText: 'SOLVED',
    },
  },
  {
    key: 'play',
    label: '/play — beat Rookie',
    frames: PLAY_FRAMES,
    bout: {
      outcome: 'play_win',
      username: 'tyler',
      opponent: 'Rookie',
      moves: 3,
      rounds: 0,
      clock: '',
      brand: { title: 'Chess Path', sub: 'Play Rookie' },
      cta: 'Play Rookie at chesspath.app',
      headline: { big: 'WIN', rest: 'by checkmate', win: true },
      stats: [
        ['2', 'MOVES'],
        ['L4', 'ROOKIE LEVEL'],
        ['1:12', 'TIME'],
      ],
      stampText: 'CHECKMATE',
    },
  },
];

function Card({ frames, bout, label }: (typeof CARDS)[number]) {
  const [url, setUrl] = useState<string | null>(null);
  const [ms, setMs] = useState<number | null>(null);
  const [bytes, setBytes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let obj: string | null = null;
    (async () => {
      try {
        const t0 = performance.now();
        const { renderFightNightGif } = await import('@/lib/share/fight-night-gif');
        const blob = await renderFightNightGif(frames, bout);
        setMs(Math.round(performance.now() - t0));
        setBytes(blob.size);
        obj = URL.createObjectURL(blob);
        setUrl(obj);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      if (obj) URL.revokeObjectURL(obj);
    };
  }, [frames, bout]);

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-sm font-black">{label}</h2>
      <p className="text-xs text-white/60 text-center" data-testid="timing">
        {error
          ? `FAILED: ${error}`
          : ms === null
            ? 'Rendering…'
            : `${ms}ms · ${((bytes ?? 0) / 1024).toFixed(0)}KB`}
      </p>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={`${label} share GIF`} className="w-[300px] rounded-2xl" />
      )}
    </div>
  );
}

export default function BoxShareGifTest() {
  return (
    <div className="h-full overflow-auto bg-chess-bg text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col items-center gap-6">
        <h1 className="text-xl font-black">On-device Fight Night GIF — all three shares</h1>
        <div className="flex flex-col md:flex-row items-start justify-center gap-8">
          {CARDS.map((c) => (
            <Card key={c.key} label={c.label} frames={c.frames} bout={c.bout} />
          ))}
        </div>
      </div>
    </div>
  );
}
