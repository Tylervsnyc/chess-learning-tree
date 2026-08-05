'use client';

/**
 * /test/calibrate — DEV TOOL. Measures Rookie's real playing strength.
 *
 * Not a user-facing page and never linked from the app. Run it, let it grind,
 * paste the resulting ELOs into ROOKIE_LEVELS in lib/rookie-levels.ts with the
 * date and sample size in a comment. Re-run only when an engine config changes.
 *
 * Method (see lib/rookie/calibrate.ts): one absolute anchor against Maia inside
 * its honest rating band, plus adjacent-pair matches down the whole ladder,
 * solved outward from the anchor.
 *
 * Runtime: L1-L4 are depth 3-5 and fly. L7-L10 at depth 12-14 dominate — a
 * full sweep at 60 games a pair is a couple of unattended hours. Drop to 20-30
 * for a quick read.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ROOKIE_LEVELS } from '@/lib/rookie-levels';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { maia, type MaiaStatus } from '@/lib/maia/maia-adapter';
import {
  playMatch,
  solveLadder,
  playerLabel,
  MAIA_MIN_ELO,
  MAIA_MAX_ELO,
  type MatchResult,
} from '@/lib/rookie/calibrate';

/** Level we try to anchor on first, and the Maia rating we try it against. */
const ANCHOR_CANDIDATES: { level: number; maiaElo: number }[] = [
  { level: 8, maiaElo: 1500 },
  { level: 9, maiaElo: 1700 },
  { level: 7, maiaElo: 1300 },
  { level: 10, maiaElo: MAIA_MAX_ELO },
  { level: 6, maiaElo: MAIA_MIN_ELO },
];

export default function CalibratePage() {
  const [games, setGames] = useState(20);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('Idle.');
  const [maiaStatus, setMaiaStatus] = useState<MaiaStatus>('idle');
  const [gaps, setGaps] = useState<MatchResult[]>([]);
  const [anchor, setAnchor] = useState<{ level: number; maiaElo: number; scoreShare: number } | null>(null);
  const [elos, setElos] = useState<number[]>([]);
  const [uncertain, setUncertain] = useState<number[]>([]);
  const [maiaProbe, setMaiaProbe] = useState<MatchResult | null>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    const off = maia.addListener({ onStatus: setMaiaStatus });
    void maia.init();
    void stockfish.init();
    return () => {
      off();
    };
  }, []);

  /**
   * Check the YARDSTICK before measuring anything with it: play Maia's lowest
   * band against its highest. If the strength knob works, the high band wins
   * decisively. If it comes out near 50%, Maia is not rating-conditioned the
   * way we think and every anchor built on it is meaningless — which is
   * exactly the bug that made Level 6 weaker than Level 5.
   */
  const probe = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setMaiaProbe(null);
    try {
      setStatus('Waiting for Maia…');
      await maia.ensureReady();
      if (maia.getStatus() !== 'ready') {
        setStatus('Maia is not available.');
        setRunning(false);
        return;
      }
      const res = await playMatch(
        { kind: 'maia', elo: MAIA_MAX_ELO },
        { kind: 'maia', elo: MAIA_MIN_ELO },
        games,
        (p, t) => setStatus(`Maia ${MAIA_MAX_ELO} vs Maia ${MAIA_MIN_ELO} — game ${p}/${t}`),
        () => stopRef.current,
      );
      setMaiaProbe(res);
      setStatus(
        res.scoreA > 0.65
          ? `Yardstick OK — Maia ${MAIA_MAX_ELO} scored ${(res.scoreA * 100).toFixed(0)}% vs ${MAIA_MIN_ELO}.`
          : `YARDSTICK BROKEN — Maia ${MAIA_MAX_ELO} only scored ${(res.scoreA * 100).toFixed(0)}% vs ${MAIA_MIN_ELO}. Do not trust any anchor.`,
      );
    } catch (err) {
      setStatus(`Failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setRunning(false);
    }
  }, [games]);

  const run = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setGaps([]);
    setElos([]);
    setAnchor(null);
    setUncertain([]);

    try {
      setStatus('Waiting for Maia to be ready…');
      await maia.ensureReady();
      if (maia.getStatus() !== 'ready') {
        setStatus('Maia is not available — cannot anchor. Aborting.');
        setRunning(false);
        return;
      }

      // ── 1. Absolute anchor ────────────────────────────────────────────────
      // Try candidates until one lands in the informative band. A score of 0
      // or 1 tells us "somewhere below/above" and nothing more.
      let found: { level: number; maiaElo: number; scoreShare: number } | null = null;
      for (const cand of ANCHOR_CANDIDATES) {
        if (stopRef.current) break;
        setStatus(`Anchoring: Rookie L${cand.level} vs Maia ${cand.maiaElo}…`);
        const res = await playMatch(
          { kind: 'rookie', level: cand.level },
          { kind: 'maia', elo: cand.maiaElo },
          games,
          (p, t) => setStatus(`Anchoring L${cand.level} vs Maia ${cand.maiaElo} — game ${p}/${t}`),
          () => stopRef.current,
        );
        if (res.games === 0) break;
        if (!res.saturated && res.scoreA > 0.2 && res.scoreA < 0.8) {
          found = { level: cand.level, maiaElo: cand.maiaElo, scoreShare: res.scoreA };
          break;
        }
        setStatus(
          `L${cand.level} scored ${(res.scoreA * 100).toFixed(0)}% vs Maia ${cand.maiaElo} — not informative, trying another anchor.`,
        );
      }

      if (!found) {
        setStatus('No anchor landed in the informative band. Widen ANCHOR_CANDIDATES.');
        setRunning(false);
        return;
      }
      setAnchor(found);

      // ── 2. Adjacent-pair chain ────────────────────────────────────────────
      const chain: MatchResult[] = [];
      for (let lvl = 1; lvl < 10; lvl++) {
        if (stopRef.current) break;
        const res = await playMatch(
          { kind: 'rookie', level: lvl },
          { kind: 'rookie', level: lvl + 1 },
          games,
          (p, t) => setStatus(`L${lvl} vs L${lvl + 1} — game ${p}/${t}`),
          () => stopRef.current,
        );
        chain.push(res);
        setGaps([...chain]);
      }

      // ── 3. Solve ──────────────────────────────────────────────────────────
      // Maia's rating is the opponent's; the anchor level's rating follows
      // from how it scored against that opponent.
      const { diff } = { diff: -400 * Math.log10(1 / found.scoreShare - 1) };
      const anchorElo = Math.round(found.maiaElo + diff);
      const solved = solveLadder(found.level, anchorElo, chain);
      setElos(solved.elos);
      setUncertain(solved.uncertain);
      setStatus(stopRef.current ? 'Stopped early — partial results.' : 'Done.');
    } catch (err) {
      setStatus(`Failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setRunning(false);
    }
  }, [games]);

  const snippet = elos.length
    ? elos
        .map((e, i) => (Number.isFinite(e) ? `  ${i + 1}: ${e},` : `  ${i + 1}: null, // not solved`))
        .join('\n')
    : '';

  return (
    // Test pages MUST scroll — body has overflow:hidden globally.
    <div className="h-full overflow-auto bg-chess-page p-4 md:p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        <header>
          <h1 className="text-2xl font-black text-chess-text">Rookie calibration</h1>
          <p className="text-sm font-semibold text-chess-text-muted mt-1 leading-snug">
            Measures what each level actually plays at. Dev tool — results get pasted into{' '}
            <code className="text-xs">ROOKIE_LEVELS</code>, never computed at runtime.
          </p>
        </header>

        <div className="bg-chess-surface rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
                Games per match
              </span>
              <input
                type="number"
                min={2}
                max={200}
                step={2}
                value={games}
                onChange={(e) => setGames(Math.max(2, Math.min(200, Number(e.target.value) || 2)))}
                disabled={running}
                className="w-28 rounded-xl border-2 border-slate-200 px-3 py-2 font-bold text-chess-text tabular-nums"
              />
            </label>
            <button
              onClick={() => void run()}
              disabled={running}
              className="rounded-xl bg-chess-blue text-white font-black px-5 py-2.5 min-h-[44px] disabled:opacity-50"
            >
              {running ? 'Running…' : 'Run sweep'}
            </button>
            <button
              onClick={() => void probe()}
              disabled={running}
              className="rounded-xl border-2 border-slate-200 text-chess-text font-black px-5 py-2.5 min-h-[44px] disabled:opacity-50"
            >
              Check yardstick
            </button>
            <button
              onClick={() => {
                stopRef.current = true;
              }}
              disabled={!running}
              className="rounded-xl border-2 border-slate-200 text-chess-text font-black px-5 py-2.5 min-h-[44px] disabled:opacity-50"
            >
              Stop
            </button>
          </div>
          <p className="text-sm font-semibold text-chess-text">{status}</p>
          <p className="text-xs font-bold text-chess-text-muted">
            Maia: {maiaStatus} · 10 matches (1 anchor + 9 pairs) × {games} games ={' '}
            {10 * games} games total
          </p>
        </div>

        {maiaProbe && (
          <div
            className={`rounded-2xl border p-4 ${
              maiaProbe.scoreA > 0.65
                ? 'bg-chess-surface border-slate-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted mb-1">
              Yardstick check
            </h2>
            <p className="text-sm font-bold text-chess-text">
              Maia {MAIA_MAX_ELO} scored {(maiaProbe.scoreA * 100).toFixed(1)}% against Maia{' '}
              {MAIA_MIN_ELO} over {maiaProbe.games} games
              {maiaProbe.scoreA > 0.65
                ? ' — the strength knob works.'
                : ' — the knob is INERT. Anchors are meaningless until this is fixed.'}
            </p>
          </div>
        )}

        {anchor && (
          <div className="bg-chess-surface rounded-2xl border border-slate-200 p-4">
            <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted mb-1">
              Anchor
            </h2>
            <p className="text-sm font-bold text-chess-text">
              Rookie L{anchor.level} scored {(anchor.scoreShare * 100).toFixed(1)}% against Maia{' '}
              {anchor.maiaElo}
            </p>
          </div>
        )}

        {gaps.length > 0 && (
          <div className="bg-chess-surface rounded-2xl border border-slate-200 p-4 overflow-x-auto">
            <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted mb-2">
              Adjacent gaps
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-chess-text-muted font-bold text-xs">
                  <th className="py-1">Match</th>
                  <th className="py-1 text-right">Lower scored</th>
                  <th className="py-1 text-right">Gap</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((g, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-1.5 font-bold text-chess-text">
                      {playerLabel(g.a)} vs {playerLabel(g.b)}
                    </td>
                    <td className="py-1.5 text-right tabular-nums font-semibold text-chess-text-muted">
                      {(g.scoreA * 100).toFixed(0)}%
                    </td>
                    <td className="py-1.5 text-right tabular-nums font-bold text-chess-text">
                      {Math.round(-g.eloDiff)}
                      {g.saturated && <span className="text-[#e5484d]"> (bound)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {elos.length > 0 && (
          <div className="bg-chess-surface rounded-2xl border border-slate-200 p-4 overflow-x-auto">
            <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted mb-2">
              Measured ladder
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-chess-text-muted font-bold text-xs">
                  <th className="py-1">Level</th>
                  <th className="py-1 text-right">Claimed</th>
                  <th className="py-1 text-right">Measured</th>
                  <th className="py-1 text-right">Off by</th>
                </tr>
              </thead>
              <tbody>
                {elos.map((e, i) => {
                  const claimed = ROOKIE_LEVELS[i].elo;
                  const ok = Number.isFinite(e);
                  return (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="py-1.5 font-bold text-chess-text">
                        L{i + 1} · {ROOKIE_LEVELS[i].title}
                        {uncertain.includes(i + 1) && (
                          <span className="text-[#e5484d] font-bold"> ·  uncertain</span>
                        )}
                      </td>
                      <td className="py-1.5 text-right tabular-nums text-chess-text-muted">
                        {claimed}
                      </td>
                      <td className="py-1.5 text-right tabular-nums font-black text-chess-text">
                        {ok ? e : '—'}
                      </td>
                      <td className="py-1.5 text-right tabular-nums font-bold text-chess-text-muted">
                        {ok ? (e - claimed > 0 ? `+${e - claimed}` : e - claimed) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <pre className="mt-3 text-xs bg-chess-page rounded-xl p-3 overflow-x-auto text-chess-text">
              {snippet}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
