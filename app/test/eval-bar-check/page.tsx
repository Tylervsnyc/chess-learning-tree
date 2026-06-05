'use client';

/**
 * Eval Bar Sanity Check
 *
 * Compares our local Stockfish + sigmoid (what the game-review eval bar uses)
 * against Lichess's published cloud eval for the same FEN.
 *
 * If our number diverges from Lichess on the same position, the bar is wrong.
 * If they match, the math is fine and any "feels off" is perception/perspective.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { evalToWinPercent } from '@/lib/game-eval';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// A few well-known positions to spot-check.
const PRESETS: { label: string; fen: string; note: string }[] = [
  { label: 'Starting position', fen: START_FEN, note: 'Should be ~0.0 / 50%' },
  {
    label: 'White up a queen',
    fen: 'rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    note: 'Massive white advantage (~+9, ~95%+)',
  },
  {
    label: 'Black up a queen',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1',
    note: 'Massive black advantage (~-9, ~5% or less)',
  },
  {
    label: 'Scholar\'s mate position (white to move, Qxf7#)',
    fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4',
    note: 'Black is checkmated — our bar should show "M" (mated)',
  },
  {
    label: 'Mate in 1 for white (back rank)',
    fen: '6k1/5ppp/8/8/8/8/8/R3K3 w Q - 0 1',
    note: 'Ra8# — should show M1 for white',
  },
];

type CloudEval = {
  cp: number | null;
  mate: number | null;
  depth: number;
  knodes: number;
} | { error: string };

async function fetchLichessCloud(fen: string): Promise<CloudEval> {
  try {
    const url = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=1`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) return { error: 'Not in Lichess cloud cache' };
      return { error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    const pv = data.pvs?.[0];
    if (!pv) return { error: 'No PV in response' };
    // Lichess returns cp/mate from white's perspective (same convention as us).
    return {
      cp: typeof pv.cp === 'number' ? pv.cp : null,
      mate: typeof pv.mate === 'number' ? pv.mate : null,
      depth: data.depth ?? 0,
      knodes: data.knodes ?? 0,
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'fetch failed' };
  }
}

function formatEval(cp: number | null, mate: number | null): string {
  if (mate !== null) {
    if (mate === 0) return 'M';
    return mate > 0 ? `M${mate}` : `-M${Math.abs(mate)}`;
  }
  if (cp === null) return '—';
  const val = cp / 100;
  return (val >= 0 ? '+' : '') + val.toFixed(2);
}

function whitePercent(cp: number | null, mate: number | null): number {
  if (cp === null && mate === null) return 50;
  return evalToWinPercent(cp, mate);
}

type Row = {
  fen: string;
  label: string;
  note: string;
  ours: { cp: number | null; mate: number | null } | null;
  lichess: CloudEval | null;
  status: 'pending' | 'running' | 'done' | 'error';
};

export default function EvalBarCheckPage() {
  const [rows, setRows] = useState<Row[]>(
    PRESETS.map(p => ({ ...p, ours: null, lichess: null, status: 'pending' })),
  );
  const [customFen, setCustomFen] = useState(START_FEN);
  const [customRow, setCustomRow] = useState<Row | null>(null);
  const [depth, setDepth] = useState(18);
  const [running, setRunning] = useState(false);
  const sfReady = useRef(false);

  useEffect(() => {
    stockfish.init().then(() => { sfReady.current = true; }).catch(() => {});
    return () => { /* keep engine alive */ };
  }, []);

  async function analyzeOne(fen: string): Promise<{ ours: { cp: number | null; mate: number | null }; lichess: CloudEval }> {
    // Run in parallel — our engine + Lichess fetch are independent.
    const [ours, lichess] = await Promise.all([
      stockfish.getFullEval(fen, depth),
      fetchLichessCloud(fen),
    ]);
    return {
      ours: ours ? { cp: ours.cp, mate: ours.mate } : { cp: null, mate: null },
      lichess,
    };
  }

  async function runAll() {
    if (running) return;
    setRunning(true);
    // Wait for stockfish ready
    let tries = 0;
    while (!sfReady.current && tries < 50) {
      await new Promise(r => setTimeout(r, 100));
      tries++;
    }
    for (let i = 0; i < rows.length; i++) {
      setRows(r => r.map((row, idx) => idx === i ? { ...row, status: 'running' } : row));
      try {
        const { ours, lichess } = await analyzeOne(rows[i].fen);
        setRows(r => r.map((row, idx) => idx === i ? { ...row, ours, lichess, status: 'done' } : row));
      } catch {
        setRows(r => r.map((row, idx) => idx === i ? { ...row, status: 'error' } : row));
      }
    }
    setRunning(false);
  }

  async function runCustom() {
    let chess: Chess;
    try { chess = new Chess(customFen); } catch {
      setCustomRow({ fen: customFen, label: 'Custom', note: 'Invalid FEN', ours: null, lichess: null, status: 'error' });
      return;
    }
    const fen = chess.fen();
    setCustomRow({ fen, label: 'Custom', note: '', ours: null, lichess: null, status: 'running' });
    let tries = 0;
    while (!sfReady.current && tries < 50) {
      await new Promise(r => setTimeout(r, 100));
      tries++;
    }
    const { ours, lichess } = await analyzeOne(fen);
    setCustomRow({ fen, label: 'Custom', note: '', ours, lichess, status: 'done' });
  }

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#1a1a1a] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Eval Bar Sanity Check</h1>
          <p className="text-white/60 text-sm mt-1">
            Compares our local Stockfish + Lichess sigmoid (what the game-review eval bar uses)
            against Lichess&apos;s published cloud eval. If our number matches theirs on the same FEN,
            the bar is correct.
          </p>
        </header>

        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <label className="text-sm text-white/70">Stockfish depth:</label>
          <input
            type="number"
            min={8}
            max={24}
            value={depth}
            onChange={e => setDepth(parseInt(e.target.value, 10) || 18)}
            className="w-20 px-2 py-1 bg-white/10 rounded text-sm"
          />
          <button
            onClick={runAll}
            disabled={running}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded font-semibold text-sm"
          >
            {running ? 'Running…' : 'Run preset checks'}
          </button>
          <span className="text-xs text-white/40 ml-auto">
            Lichess cloud cache typically depth 20-30. Match depth for fairer comparison.
          </span>
        </div>

        <div className="space-y-3">
          {rows.map((row, i) => (
            <RowCard key={i} row={row} />
          ))}
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <h2 className="text-lg font-semibold">Custom FEN</h2>
          <div className="flex gap-2">
            <input
              value={customFen}
              onChange={e => setCustomFen(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/10 rounded font-mono text-xs"
              placeholder="paste a FEN here"
            />
            <button
              onClick={runCustom}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold text-sm"
            >
              Check this FEN
            </button>
          </div>
          {customRow && <RowCard row={customRow} />}
        </div>

        <div className="pt-6 border-t border-white/10">
          <PgnChecker depth={depth} sfReady={sfReady} />
        </div>

        <div className="pt-6 border-t border-white/10">
          <LichessGameChecker depth={depth} sfReady={sfReady} />
        </div>
      </div>
    </div>
  );
}

// ─── Lichess Game Checker ──────────────────────────────────────────────────
// Pulls a game + its computer analysis directly from Lichess's game export API.
// Works for any analyzed Lichess game (unlike cloud-eval which only caches
// popular positions). Gives us full-game comparison move-by-move.

type LichessMoveEval = {
  san: string;
  evalPawns: number | null; // from white's perspective, in pawn units
  mate: number | null;      // from white's perspective
};

function extractLichessGameId(input: string): string | null {
  // Accept full URL or bare ID
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/lichess\.org\/(?:embed\/)?([a-zA-Z0-9]{8,12})/);
  if (urlMatch) return urlMatch[1].slice(0, 8); // game ID is first 8 chars
  if (/^[a-zA-Z0-9]{8,12}$/.test(trimmed)) return trimmed.slice(0, 8);
  return null;
}

async function fetchLichessGame(gameId: string): Promise<{ pgn: string; moves: LichessMoveEval[] } | { error: string }> {
  try {
    // PGN export with eval annotations. Format: `1. e4 { [%eval 0.36] } e5 { [%eval 0.19] }`
    const res = await fetch(`https://lichess.org/game/export/${gameId}?evals=1&clocks=0&literate=0`, {
      headers: { Accept: 'application/x-chess-pgn' },
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const pgn = await res.text();

    // Parse the move section (after the headers, blank line separates).
    const parts = pgn.split(/\n\n/);
    const moveText = parts.slice(1).join('\n\n');

    // Walk through moves, capturing SAN tokens and their following [%eval ...] if present.
    // Strategy: tokenize on whitespace, find SAN tokens, then look ahead for the eval comment.
    const moves: LichessMoveEval[] = [];
    // Split into tokens preserving brace comments.
    const tokenRe = /(\d+\.{1,3}|\{[^}]*\}|[^\s{}]+)/g;
    const tokens = moveText.match(tokenRe) || [];

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      // Skip move numbers, result markers, NAGs
      if (/^\d+\.{1,3}$/.test(t)) continue;
      if (/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)) continue;
      if (/^\{/.test(t)) continue; // comment without preceding SAN — ignore
      if (/^\$\d+/.test(t)) continue;

      // This should be a SAN token
      const san = t;
      // Look at next token for eval comment
      let evalPawns: number | null = null;
      let mate: number | null = null;
      const next = tokens[i + 1];
      if (next && next.startsWith('{')) {
        const m = next.match(/%eval\s+(#?-?\d+(?:\.\d+)?)/);
        if (m) {
          const v = m[1];
          if (v.startsWith('#')) {
            mate = parseInt(v.slice(1), 10);
          } else if (v.startsWith('-#')) {
            mate = -parseInt(v.slice(2), 10);
          } else {
            evalPawns = parseFloat(v);
          }
        }
      }
      moves.push({ san, evalPawns, mate });
    }

    return { pgn, moves };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'fetch failed' };
  }
}

function LichessGameChecker({ depth, sfReady }: { depth: number; sfReady: React.MutableRefObject<boolean> }) {
  const [input, setInput] = useState('');
  const [points, setPoints] = useState<PgnPoint[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    const gameId = extractLichessGameId(input);
    if (!gameId) {
      setError('Could not parse Lichess game ID or URL');
      return;
    }
    if (running) return;
    setRunning(true);
    setProgress('Fetching game from Lichess…');

    const result = await fetchLichessGame(gameId);
    if ('error' in result) {
      setError(result.error);
      setRunning(false);
      setProgress('');
      return;
    }

    // Replay PGN to build FEN-per-ply, attaching Lichess evals (which are
    // recorded AFTER each move).
    const chess = new Chess();
    try { chess.loadPgn(result.pgn); } catch {
      setError('Could not parse PGN from Lichess');
      setRunning(false);
      setProgress('');
      return;
    }
    const history = chess.history({ verbose: true });
    const replay = new Chess();
    const initialPts: PgnPoint[] = [{
      ply: 0,
      moveLabel: 'Start',
      fen: replay.fen(),
      ours: null,
      lichess: null,
      status: 'pending',
    }];
    history.forEach((mv, i) => {
      replay.move(mv.san);
      const moveNum = Math.floor(i / 2) + 1;
      const isWhite = i % 2 === 0;
      const lichessMv = result.moves[i];
      let lichessEval: CloudEval | null = null;
      if (lichessMv && (lichessMv.evalPawns !== null || lichessMv.mate !== null)) {
        lichessEval = {
          cp: lichessMv.evalPawns !== null ? Math.round(lichessMv.evalPawns * 100) : null,
          mate: lichessMv.mate,
          depth: 0,
          knodes: 0,
        };
      }
      initialPts.push({
        ply: i + 1,
        moveLabel: isWhite ? `${moveNum}.${mv.san}` : `${moveNum}...${mv.san}`,
        fen: replay.fen(),
        ours: null,
        lichess: lichessEval,
        status: 'pending',
      });
    });
    setPoints(initialPts);

    // Wait for SF, then run our local eval per position
    let tries = 0;
    while (!sfReady.current && tries < 50) {
      await new Promise(r => setTimeout(r, 100));
      tries++;
    }

    for (let i = 0; i < initialPts.length; i++) {
      setProgress(`Our engine: position ${i + 1}/${initialPts.length} (${initialPts[i].moveLabel})`);
      setPoints(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'running' } : p));
      const ours = await stockfish.getFullEval(initialPts[i].fen, depth);
      setPoints(prev => prev.map((p, idx) => idx === i ? {
        ...p,
        ours: ours ? { cp: ours.cp, mate: ours.mate } : { cp: null, mate: null },
        status: 'done',
      } : p));
    }
    setProgress('');
    setRunning(false);
  }

  // Stats (reuse same logic as PgnChecker)
  const completed = points.filter(p => p.status === 'done');
  const diffs = completed
    .map(p => {
      const ours = p.ours ? whitePercent(p.ours.cp, p.ours.mate) : null;
      const lichess = p.lichess && !('error' in p.lichess)
        ? whitePercent((p.lichess as { cp: number | null; mate: number | null }).cp, (p.lichess as { cp: number | null; mate: number | null }).mate)
        : null;
      if (ours === null || lichess === null) return null;
      return { ours, lichess, diff: ours - lichess, abs: Math.abs(ours - lichess) };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const meanDiff = diffs.length ? diffs.reduce((a, b) => a + b.diff, 0) / diffs.length : 0;
  const meanAbs = diffs.length ? diffs.reduce((a, b) => a + b.abs, 0) / diffs.length : 0;
  const maxAbs = diffs.length ? Math.max(...diffs.map(d => d.abs)) : 0;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Lichess Game (with Computer Analysis)</h2>
      <p className="text-xs text-white/50">
        Paste a Lichess game URL or ID. Pulls the game + computer-analysis evals from
        Lichess&apos;s game export API. Works for any game that&apos;s been analyzed on Lichess.
        This is the most accurate way to spot-check the bar across a full game.
      </p>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-3 py-2 bg-white/10 rounded font-mono text-xs"
          placeholder="https://lichess.org/abcd1234  or  abcd1234"
        />
        <button
          onClick={run}
          disabled={running}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 rounded font-semibold text-sm"
        >
          {running ? 'Running…' : 'Compare game'}
        </button>
      </div>
      {progress && <div className="text-xs text-white/60">{progress}</div>}
      {error && <div className="text-sm text-red-400">{error}</div>}

      {completed.length > 0 && (
        <div className="p-3 bg-white/5 rounded-lg space-y-1 text-sm">
          <div>Positions compared: <span className="font-mono">{diffs.length}</span> / {completed.length} (others have no Lichess eval)</div>
          <div>Mean signed diff (ours − Lichess): <span className="font-mono">{meanDiff.toFixed(2)}%pt</span></div>
          <div>Mean absolute diff: <span className="font-mono">{meanAbs.toFixed(2)}%pt</span></div>
          <div>Max absolute diff: <span className="font-mono">{maxAbs.toFixed(2)}%pt</span></div>
        </div>
      )}

      {points.length > 0 && (
        <div className="space-y-1">
          <ChartBars points={points} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead className="text-white/50">
                <tr>
                  <th className="text-left p-1">Move</th>
                  <th className="text-right p-1">Ours</th>
                  <th className="text-right p-1">Ours %</th>
                  <th className="text-right p-1">Lichess</th>
                  <th className="text-right p-1">Lichess %</th>
                  <th className="text-right p-1">Δ%pt</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p, i) => {
                  const ours = p.ours ? whitePercent(p.ours.cp, p.ours.mate) : null;
                  const lichessOk = p.lichess && !('error' in p.lichess) ? p.lichess as { cp: number | null; mate: number | null } : null;
                  const lichess = lichessOk ? whitePercent(lichessOk.cp, lichessOk.mate) : null;
                  const diff = (ours !== null && lichess !== null) ? Math.abs(ours - lichess) : null;
                  const diffColor = diff === null ? 'text-white/30'
                    : diff < 3 ? 'text-emerald-400'
                    : diff < 10 ? 'text-yellow-400'
                    : 'text-red-400';
                  return (
                    <tr key={i} className="border-t border-white/5">
                      <td className="p-1">{p.moveLabel}</td>
                      <td className="text-right p-1">{p.ours ? formatEval(p.ours.cp, p.ours.mate) : p.status === 'running' ? '…' : '—'}</td>
                      <td className="text-right p-1 text-white/60">{ours?.toFixed(1) ?? '—'}</td>
                      <td className="text-right p-1">{lichessOk ? formatEval(lichessOk.cp, lichessOk.mate) : '—'}</td>
                      <td className="text-right p-1 text-white/60">{lichess?.toFixed(1) ?? '—'}</td>
                      <td className={`text-right p-1 font-bold ${diffColor}`}>{diff?.toFixed(1) ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PGN Checker ────────────────────────────────────────────────────────────

type PgnPoint = {
  ply: number;
  moveLabel: string; // e.g. "1.e4" or "1...e5"
  fen: string;
  ours: { cp: number | null; mate: number | null } | null;
  lichess: CloudEval | null;
  status: 'pending' | 'running' | 'done' | 'error';
};

const SAMPLE_PGN = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7`;

function PgnChecker({ depth, sfReady }: { depth: number; sfReady: React.MutableRefObject<boolean> }) {
  const [pgn, setPgn] = useState(SAMPLE_PGN);
  const [points, setPoints] = useState<PgnPoint[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState('');

  function parse(): PgnPoint[] | null {
    try {
      const chess = new Chess();
      chess.loadPgn(pgn);
      // Replay from start collecting FEN after each move.
      const history = chess.history({ verbose: true });
      const replay = new Chess();
      const pts: PgnPoint[] = [{
        ply: 0,
        moveLabel: 'Start',
        fen: replay.fen(),
        ours: null,
        lichess: null,
        status: 'pending',
      }];
      history.forEach((mv, i) => {
        replay.move(mv.san);
        const moveNum = Math.floor(i / 2) + 1;
        const isWhite = i % 2 === 0;
        pts.push({
          ply: i + 1,
          moveLabel: isWhite ? `${moveNum}.${mv.san}` : `${moveNum}...${mv.san}`,
          fen: replay.fen(),
          ours: null,
          lichess: null,
          status: 'pending',
        });
      });
      return pts;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function run() {
    if (running) return;
    const parsed = parse();
    if (!parsed) {
      alert('Could not parse PGN');
      return;
    }
    setPoints(parsed);
    setRunning(true);

    let tries = 0;
    while (!sfReady.current && tries < 50) {
      await new Promise(r => setTimeout(r, 100));
      tries++;
    }

    for (let i = 0; i < parsed.length; i++) {
      setProgress(`Position ${i + 1}/${parsed.length}: ${parsed[i].moveLabel}`);
      setPoints(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'running' } : p));
      const fen = parsed[i].fen;
      const [ours, lichess] = await Promise.all([
        stockfish.getFullEval(fen, depth),
        fetchLichessCloud(fen),
      ]);
      setPoints(prev => prev.map((p, idx) => idx === i ? {
        ...p,
        ours: ours ? { cp: ours.cp, mate: ours.mate } : { cp: null, mate: null },
        lichess,
        status: 'done',
      } : p));
      // Be polite to Lichess
      await new Promise(r => setTimeout(r, 150));
    }
    setProgress('');
    setRunning(false);
  }

  // Stats
  const completed = points.filter(p => p.status === 'done');
  const diffs = completed
    .map(p => {
      const ours = p.ours ? whitePercent(p.ours.cp, p.ours.mate) : null;
      const lichess = p.lichess && !('error' in p.lichess)
        ? whitePercent((p.lichess as { cp: number | null; mate: number | null }).cp, (p.lichess as { cp: number | null; mate: number | null }).mate)
        : null;
      if (ours === null || lichess === null) return null;
      return { ours, lichess, diff: ours - lichess, abs: Math.abs(ours - lichess) };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const meanDiff = diffs.length ? diffs.reduce((a, b) => a + b.diff, 0) / diffs.length : 0;
  const meanAbs = diffs.length ? diffs.reduce((a, b) => a + b.abs, 0) / diffs.length : 0;
  const maxAbs = diffs.length ? Math.max(...diffs.map(d => d.abs)) : 0;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Full Game (PGN)</h2>
      <p className="text-xs text-white/50">
        Paste a PGN. We&apos;ll eval every position with our local Stockfish AND Lichess cloud,
        then chart the divergence move-by-move. Lichess cloud may not have all positions cached
        (especially mid/endgame) — those rows will show errors but the rest still works.
      </p>
      <textarea
        value={pgn}
        onChange={e => setPgn(e.target.value)}
        rows={5}
        className="w-full px-3 py-2 bg-white/10 rounded font-mono text-xs"
        placeholder="paste PGN here"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={run}
          disabled={running}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded font-semibold text-sm"
        >
          {running ? 'Analyzing…' : 'Analyze full game'}
        </button>
        {progress && <span className="text-xs text-white/60">{progress}</span>}
      </div>

      {completed.length > 0 && (
        <div className="p-3 bg-white/5 rounded-lg space-y-1 text-sm">
          <div>Positions compared: <span className="font-mono">{diffs.length}</span></div>
          <div>Mean signed diff (ours − Lichess): <span className="font-mono">{meanDiff.toFixed(2)}%pt</span> {Math.abs(meanDiff) < 1 ? '(no systematic bias)' : meanDiff < 0 ? '(we underestimate white)' : '(we overestimate white)'}</div>
          <div>Mean absolute diff: <span className="font-mono">{meanAbs.toFixed(2)}%pt</span></div>
          <div>Max absolute diff: <span className="font-mono">{maxAbs.toFixed(2)}%pt</span></div>
        </div>
      )}

      {points.length > 0 && (
        <div className="space-y-1">
          {/* Chart */}
          <ChartBars points={points} />
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead className="text-white/50">
                <tr>
                  <th className="text-left p-1">Move</th>
                  <th className="text-right p-1">Ours</th>
                  <th className="text-right p-1">Ours %</th>
                  <th className="text-right p-1">Lichess</th>
                  <th className="text-right p-1">Lichess %</th>
                  <th className="text-right p-1">Δ%pt</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p, i) => {
                  const ours = p.ours ? whitePercent(p.ours.cp, p.ours.mate) : null;
                  const lichessOk = p.lichess && !('error' in p.lichess) ? p.lichess as { cp: number | null; mate: number | null; depth: number } : null;
                  const lichess = lichessOk ? whitePercent(lichessOk.cp, lichessOk.mate) : null;
                  const diff = (ours !== null && lichess !== null) ? Math.abs(ours - lichess) : null;
                  const diffColor = diff === null ? 'text-white/30'
                    : diff < 3 ? 'text-emerald-400'
                    : diff < 10 ? 'text-yellow-400'
                    : 'text-red-400';
                  return (
                    <tr key={i} className="border-t border-white/5">
                      <td className="p-1">{p.moveLabel}</td>
                      <td className="text-right p-1">{p.ours ? formatEval(p.ours.cp, p.ours.mate) : p.status === 'running' ? '…' : '—'}</td>
                      <td className="text-right p-1 text-white/60">{ours?.toFixed(1) ?? '—'}</td>
                      <td className="text-right p-1">{lichessOk ? formatEval(lichessOk.cp, lichessOk.mate) : (p.lichess && 'error' in p.lichess ? <span className="text-red-400/60">{(p.lichess as { error: string }).error}</span> : '—')}</td>
                      <td className="text-right p-1 text-white/60">{lichess?.toFixed(1) ?? '—'}</td>
                      <td className={`text-right p-1 font-bold ${diffColor}`}>{diff?.toFixed(1) ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ChartBars({ points }: { points: PgnPoint[] }) {
  // Two stacked horizontal bands: ours (top), lichess (bottom).
  // Each column = one position. Height of white = whitePercent.
  return (
    <div className="space-y-1 my-3">
      <div className="text-xs text-white/50">Eval over game (top = ours, bottom = Lichess). Tall white = white winning.</div>
      <div className="flex gap-px h-16 bg-black/30 rounded overflow-hidden">
        {points.map((p, i) => {
          const ours = p.ours ? whitePercent(p.ours.cp, p.ours.mate) : null;
          return (
            <div key={i} className="flex-1 relative bg-[#222]" title={`${p.moveLabel}: ${ours?.toFixed(1) ?? '—'}%`}>
              {ours !== null && (
                <div className="absolute bottom-0 left-0 right-0 bg-white" style={{ height: `${ours}%` }} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-px h-16 bg-black/30 rounded overflow-hidden">
        {points.map((p, i) => {
          const lichessOk = p.lichess && !('error' in p.lichess) ? p.lichess as { cp: number | null; mate: number | null } : null;
          const lichess = lichessOk ? whitePercent(lichessOk.cp, lichessOk.mate) : null;
          return (
            <div key={i} className="flex-1 relative bg-[#222]" title={`${p.moveLabel}: ${lichess?.toFixed(1) ?? '—'}%`}>
              {lichess !== null && (
                <div className="absolute bottom-0 left-0 right-0 bg-sky-300" style={{ height: `${lichess}%` }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RowCard({ row }: { row: Row }) {
  const oursPct = row.ours ? whitePercent(row.ours.cp, row.ours.mate) : null;
  const lichessHasErr = row.lichess && 'error' in row.lichess;
  const lichessOk = row.lichess && !('error' in row.lichess) ? row.lichess as Exclude<CloudEval, { error: string }> : null;
  const lichessPct = lichessOk ? whitePercent(lichessOk.cp, lichessOk.mate) : null;

  // Divergence: %pt difference between our bar and Lichess's bar.
  const divergence = (oursPct !== null && lichessPct !== null) ? Math.abs(oursPct - lichessPct) : null;
  const divergenceColor = divergence === null ? 'text-white/40'
    : divergence < 3 ? 'text-emerald-400'
    : divergence < 10 ? 'text-yellow-400'
    : 'text-red-400';

  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="w-32 shrink-0">
          <MiniBoard fen={row.fen} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-semibold">{row.label}</div>
              {row.note && <div className="text-xs text-white/40">{row.note}</div>}
            </div>
            <div className="text-xs text-white/40">{row.status}</div>
          </div>
          <div className="font-mono text-[10px] text-white/30 mt-1 break-all">{row.fen}</div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <EvalCell label="Ours (local SF)" eval={row.ours} pct={oursPct} />
            <EvalCell
              label="Lichess cloud"
              eval={lichessOk}
              pct={lichessPct}
              error={lichessHasErr ? (row.lichess as { error: string }).error : null}
              extra={lichessOk ? `d${lichessOk.depth}` : null}
            />
          </div>

          {divergence !== null && (
            <div className={`mt-3 text-sm ${divergenceColor}`}>
              Divergence: {divergence.toFixed(1)}%pt
              {divergence < 3 && ' — bars match ✓'}
              {divergence >= 3 && divergence < 10 && ' — small drift (probably depth difference)'}
              {divergence >= 10 && ' — significant disagreement, worth investigating'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EvalCell({
  label,
  eval: ev,
  pct,
  error,
  extra,
}: {
  label: string;
  eval: { cp: number | null; mate: number | null } | null;
  pct: number | null;
  error?: string | null;
  extra?: string | null;
}) {
  return (
    <div className="p-2 bg-black/30 rounded">
      <div className="text-[11px] text-white/50 flex justify-between">
        <span>{label}</span>
        {extra && <span>{extra}</span>}
      </div>
      {error ? (
        <div className="text-red-400 text-sm mt-1">{error}</div>
      ) : ev ? (
        <>
          <div className="text-lg font-mono mt-1">{formatEval(ev.cp, ev.mate)}</div>
          <div className="relative h-3 rounded overflow-hidden bg-[#333] mt-1">
            <div className="h-full bg-white" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[10px] text-white/50 mt-0.5">{pct?.toFixed(1)}% white</div>
        </>
      ) : (
        <div className="text-white/30 text-sm mt-1">—</div>
      )}
    </div>
  );
}

function MiniBoard({ fen }: { fen: string }) {
  return (
    <div className="w-32 h-32">
      <ChessPathBoard
        options={{
          position: fen,
          boardOrientation: 'white',
          allowDragging: false,
        }}
      />
    </div>
  );
}
