'use client';

import { useEffect, useState } from 'react';

/**
 * /test/box-share-gif — proves the on-device Fight Night GIF renderer
 * (lib/share/fight-night-gif.ts): renders the scholar's-mate sample on mount,
 * shows the GIF, and reports how long the render took. This is the exact
 * path the bout Share button uses.
 */

const FRAMES = [
  { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR' },
  { fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR', last: 'd1h5' },
  { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR', last: 'g8f6' },
  { fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR', last: 'h5f7', stamp: true },
];

const BOUT = { outcome: 'ko_win', username: 'tyler', moves: 24, rounds: 3, clock: '1:24' };

export default function BoxShareGifTest() {
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
        const blob = await renderFightNightGif(FRAMES, BOUT);
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
  }, []);

  return (
    <div className="h-full overflow-auto bg-chess-bg text-white">
      <div className="mx-auto max-w-xl px-5 py-10 flex flex-col items-center gap-4">
        <h1 className="text-xl font-black">On-device Fight Night GIF</h1>
        <p className="text-sm text-white/60 text-center" data-testid="timing">
          {error
            ? `FAILED: ${error}`
            : ms === null
              ? 'Rendering…'
              : `Rendered in ${ms}ms · ${((bytes ?? 0) / 1024).toFixed(0)}KB (import + 14 frames + encode)`}
        </p>
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Fight Night share GIF" className="w-[300px] rounded-2xl" />
        )}
      </div>
    </div>
  );
}
