'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BOXING_THEMES } from '@/lib/boxing/themes';

export default function BoxingPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<string>('mixed');
  const [pages, setPages] = useState<number>(4);
  const [showThemes, setShowThemes] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/boxing/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ theme, pages, showThemes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Generation failed');
      router.push(`/boxing/print/${json.drawId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chess-bg text-white overflow-auto">
      <div className="mx-auto max-w-xl px-5 pt-10 pb-20">
        <h1 className="text-3xl font-bold tracking-tight">Chess Boxing Puzzle Sheets</h1>
        <p className="mt-2 text-white/70">
          Generate printable tactics sheets for your meetup. 6 puzzles per page,
          easy to hard. Each puzzle is drawn once — no repeats at future events.
        </p>

        <div className="mt-8 space-y-6 rounded-2xl bg-white/5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full rounded-lg bg-chess-bg border border-white/15 px-3 py-2 text-white"
            >
              <option value="mixed">Mixed (all themes)</option>
              {BOXING_THEMES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">
              Pages ({pages * 6} puzzles)
            </label>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-white/50">
              <span>1</span>
              <span>8 max</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white/80">Show theme labels</div>
              <div className="text-xs text-white/50">
                Print the tactic name under each board (fork, pin, etc.)
              </div>
            </div>
            <button
              onClick={() => setShowThemes((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition ${
                showThemes ? 'bg-chess-green' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  showThemes ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-lg bg-chess-green py-3 font-semibold text-white hover:bg-chess-green/90 disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate sheet'}
          </button>

          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/40 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-white/40">
          Each generated puzzle is removed from the pool so future sheets stay fresh.
        </p>
      </div>
    </div>
  );
}
