'use client';

/**
 * useMissAnalysis — the data behind /workout/report/[id].
 *
 * For every missed puzzle in a workout session we reconstruct the exact
 * position where the miss happened, the move the user played vs. the right
 * one, and then ask the browser Stockfish for an eval of both outcomes so the
 * report can show "Qxc5 → −0.7" next to "Ne4 → +4.0". When the engine pass is
 * done we POST the misses to /api/workout/report-lines for Rookie's one-liners
 * + the "what these have in common" diagnosis.
 *
 * The final result is cached in localStorage (cp_report_<sessionId>) so
 * re-opening a report is instant and never re-runs the engine or the LLM.
 */

import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { parseUciMove, processPuzzle } from '@/lib/puzzle-utils';
import type { WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';

/** Same depth as the bout review — good quality, quick enough on a phone. */
const ENGINE_DEPTH = 14;
/** Mate is reported as ±100 pawns (the lines-route contract). */
const MATE_PAWNS = 100;

export interface MissAnalysis {
  puzzleId: string;
  rating: number;
  themes: string[];
  playerColor: 'white' | 'black';
  /** Position after the opponent's setup move — where the puzzle starts. */
  puzzleFen: string;
  /** Position where the miss happened (after the moves the user got right). */
  fenAtMiss: string;
  /** Index into solutionMoves where the miss happened. */
  failedAtMove: number;
  /** The full solver line (UCI) — solver moves at even indices from puzzleFen. */
  solutionMoves: string[];
  /** SAN for the whole solution line, aligned with solutionMoves. */
  solutionSan: string[];
  /** The right move at fenAtMiss (UCI + SAN). */
  correctUci: string;
  correctSan: string;
  /** What the user played — null when we didn't record it or it was illegal. */
  playedUci: string | null;
  playedSan: string | null;
  fenAfterCorrect: string | null;
  fenAfterPlayed: string | null;
  /** Evals in PAWNS from the solver's perspective; mate = ±100. null = ungradable. */
  evalCorrect: number | null;
  evalPlayed: number | null;
  /** Mate-in-N (signed for the solver) when the engine found one. */
  mateCorrect: number | null;
  matePlayed: number | null;
  /** evalCorrect − evalPlayed (pawns). null when either side is ungradable. */
  swing: number | null;
}

export interface ThemeStat {
  theme: string;
  accuracy: number;
  attempts: number;
}

export interface MissProfile {
  weakest: ThemeStat[];
  strongest: ThemeStat[];
  userLevel: number | null;
}

export type MissAnalysisStatus = 'idle' | 'engine' | 'rookie' | 'done' | 'error';

export interface MissAnalysisResult {
  analyses: MissAnalysis[];
  /** 0..1 across the engine pass. */
  progress: number;
  /** One Rookie line per miss, same order as analyses. Empty until 'done'. */
  lines: string[];
  diagnosis: string | null;
  profile: MissProfile | null;
  status: MissAnalysisStatus;
}

interface CachedReport {
  analyses: MissAnalysis[];
  lines: string[];
  diagnosis: string | null;
  profile: MissProfile | null;
}

const cacheKey = (sessionId: string) => `cp_report_${sessionId}`;

function readCache(sessionId: string): CachedReport | null {
  try {
    const raw = localStorage.getItem(cacheKey(sessionId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedReport;
    if (!Array.isArray(parsed?.analyses)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(sessionId: string, report: CachedReport) {
  try {
    localStorage.setItem(cacheKey(sessionId), JSON.stringify(report));
  } catch {
    /* private mode / full — the report still renders */
  }
}

function tryMove(fen: string, uci: string): { fen: string; san: string } | null {
  try {
    const chess = new Chess(fen);
    const mv = chess.move(parseUciMove(uci));
    return mv ? { fen: chess.fen(), san: mv.san } : null;
  } catch {
    return null;
  }
}

/** Static (engine-free) reconstruction of one miss. */
function buildAnalysis(raw: WorkoutPuzzleData): MissAnalysis | null {
  const moves = Array.isArray(raw.moves) ? raw.moves : String(raw.moves ?? '').split(' ').filter(Boolean);
  if (moves.length < 2 || !raw.fen) return null;
  let processed;
  try {
    processed = processPuzzle({
      id: raw.puzzleId || raw.id || '',
      fen: raw.fen,
      moves,
      rating: raw.rating,
      themes: raw.themes,
    });
  } catch {
    return null;
  }
  const { puzzleFen, solutionMoves, playerColor } = processed;
  if (solutionMoves.length === 0) return null;

  // Clamp to a solver move index (even) inside the line.
  let failedAtMove = typeof raw.failedAtMove === 'number' && raw.failedAtMove >= 0 ? raw.failedAtMove : 0;
  if (failedAtMove >= solutionMoves.length) failedAtMove = 0;
  if (failedAtMove % 2 !== 0) failedAtMove = Math.max(0, failedAtMove - 1);

  // Walk the line up to the miss, collecting SAN as we go.
  const chess = new Chess(puzzleFen);
  const solutionSan: string[] = [];
  let fenAtMiss = puzzleFen;
  for (let i = 0; i < solutionMoves.length; i++) {
    if (i === failedAtMove) fenAtMiss = chess.fen();
    try {
      const mv = chess.move(parseUciMove(solutionMoves[i]));
      solutionSan.push(mv?.san ?? solutionMoves[i]);
    } catch {
      solutionSan.push(solutionMoves[i]);
    }
  }

  const correctUci = solutionMoves[failedAtMove];
  const correct = tryMove(fenAtMiss, correctUci);
  const played = raw.playedMove ? tryMove(fenAtMiss, raw.playedMove) : null;

  return {
    puzzleId: raw.puzzleId || raw.id || '',
    rating: raw.rating,
    themes: Array.isArray(raw.themes) ? raw.themes : [],
    playerColor,
    puzzleFen,
    fenAtMiss,
    failedAtMove,
    solutionMoves,
    solutionSan,
    correctUci,
    correctSan: correct?.san ?? solutionSan[failedAtMove] ?? correctUci,
    playedUci: played ? raw.playedMove ?? null : null,
    playedSan: played?.san ?? null,
    fenAfterCorrect: correct?.fen ?? null,
    fenAfterPlayed: played?.fen ?? null,
    evalCorrect: null,
    evalPlayed: null,
    mateCorrect: null,
    matePlayed: null,
    swing: null,
  };
}

/** Engine result (white's view) → pawns from the solver's perspective. */
function toSolverPawns(
  result: { cp: number | null; mate: number | null } | null,
  solver: 'white' | 'black',
): { pawns: number | null; mate: number | null } {
  if (!result) return { pawns: null, mate: null };
  const sign = solver === 'white' ? 1 : -1;
  if (result.mate !== null && result.mate !== 0) {
    const mate = result.mate * sign;
    return { pawns: mate > 0 ? MATE_PAWNS : -MATE_PAWNS, mate };
  }
  if (result.cp === null) return { pawns: null, mate: null };
  return { pawns: (result.cp / 100) * sign, mate: null };
}

export function useMissAnalysis(
  missedPuzzles: WorkoutPuzzleData[] | null,
  sessionId: string | null | undefined,
): MissAnalysisResult {
  const [state, setState] = useState<MissAnalysisResult>({
    analyses: [],
    progress: 0,
    lines: [],
    diagnosis: null,
    profile: null,
    status: 'idle',
  });
  // Monotonic run token — bumping it orphans the in-flight loop (StrictMode-safe).
  const runIdRef = useRef(0);

  useEffect(() => {
    if (!sessionId || !missedPuzzles || missedPuzzles.length === 0) return;
    const runId = ++runIdRef.current;
    const cancelled = () => runIdRef.current !== runId;

    const cached = readCache(sessionId);
    if (cached) {
      setState({
        analyses: cached.analyses,
        progress: 1,
        lines: Array.isArray(cached.lines) ? cached.lines : [],
        diagnosis: cached.diagnosis ?? null,
        profile: cached.profile ?? null,
        status: 'done',
      });
      return;
    }

    const analyses = missedPuzzles
      .map(buildAnalysis)
      .filter((a): a is MissAnalysis => a !== null);

    if (analyses.length === 0) {
      setState((s) => ({ ...s, analyses: [], status: 'error' }));
      return;
    }

    setState({ analyses, progress: 0, lines: [], diagnosis: null, profile: null, status: 'engine' });

    (async () => {
      try {
        await stockfish.init();
        if (cancelled()) return;

        // Sequential — the adapter serializes anyway, and this keeps progress honest.
        const total = analyses.reduce(
          (n, a) => n + (a.fenAfterCorrect ? 1 : 0) + (a.fenAfterPlayed ? 1 : 0),
          0,
        );
        let done = 0;
        const bump = () => {
          done++;
          if (!cancelled()) {
            setState((s) => ({ ...s, progress: total ? done / total : 1 }));
          }
        };

        for (const a of analyses) {
          if (cancelled()) return;
          if (a.fenAfterCorrect) {
            const r = await stockfish.getFullEval(a.fenAfterCorrect, ENGINE_DEPTH);
            if (cancelled()) return;
            const { pawns, mate } = toSolverPawns(r, a.playerColor);
            a.evalCorrect = pawns;
            a.mateCorrect = mate;
            bump();
          }
          if (a.fenAfterPlayed) {
            const r = await stockfish.getFullEval(a.fenAfterPlayed, ENGINE_DEPTH);
            if (cancelled()) return;
            const { pawns, mate } = toSolverPawns(r, a.playerColor);
            a.evalPlayed = pawns;
            a.matePlayed = mate;
            bump();
          }
          a.swing =
            a.evalCorrect !== null && a.evalPlayed !== null ? a.evalCorrect - a.evalPlayed : null;
          if (!cancelled()) setState((s) => ({ ...s, analyses: [...analyses] }));
        }
        if (cancelled()) return;

        setState((s) => ({ ...s, analyses: [...analyses], progress: 1, status: 'rookie' }));

        // Rookie's lines — garnish. 401/429/network → report still shows.
        let lines: string[] = [];
        let diagnosis: string | null = null;
        let profile: MissProfile | null = null;
        try {
          const res = await fetch('/api/workout/report-lines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              misses: analyses.map((a) => ({
                puzzleId: a.puzzleId,
                rating: a.rating,
                themes: a.themes,
                solutionSan: a.solutionSan,
                failedAtMove: a.failedAtMove,
                playedSan: a.playedSan,
                evalPlayed: a.evalPlayed,
                evalCorrect: a.evalCorrect,
              })),
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.lines)) lines = data.lines.map((l: unknown) => String(l ?? ''));
            if (typeof data?.diagnosis === 'string') diagnosis = data.diagnosis;
            if (data?.profile && typeof data.profile === 'object') {
              profile = {
                weakest: Array.isArray(data.profile.weakest) ? data.profile.weakest : [],
                strongest: Array.isArray(data.profile.strongest) ? data.profile.strongest : [],
                userLevel: typeof data.profile.userLevel === 'number' ? data.profile.userLevel : null,
              };
            }
          }
        } catch {
          /* no lines — fine */
        }
        if (cancelled()) return;

        const final: CachedReport = { analyses, lines, diagnosis, profile };
        // Only cache a complete report — a rate-limited one should retry next open.
        if (lines.length === analyses.length) writeCache(sessionId, final);
        setState({ ...final, progress: 1, status: 'done' });
      } catch (err) {
        console.error('[useMissAnalysis] failed:', err);
        if (!cancelled()) setState((s) => ({ ...s, status: 'error' }));
      }
    })();

    return () => {
      // Run token, not a DOM ref — bumping the LIVE value is the whole point.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      runIdRef.current++;
      stockfish.cancel();
    };
  }, [missedPuzzles, sessionId]);

  return state;
}
