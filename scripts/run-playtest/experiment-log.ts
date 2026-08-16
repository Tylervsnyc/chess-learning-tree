/**
 * Append-only JSONL log of every hypothesis ever tested.
 *
 * WHY: a self-improving system needs persistent memory. The model + the
 * hypothesis queue both look at history to decide what to test next. Storing
 * each line as JSON (one record per line) means we can append cheaply and
 * read everything by streaming a file. The file is checked into git so the
 * memory survives across machines and is auditable.
 *
 * File: data/run-playtest/experiments.jsonl
 */

import { existsSync, readFileSync, mkdirSync, appendFileSync } from 'fs';
import { dirname, join } from 'path';
import type { LevelMutation } from './mutations';
import type { TierId } from './types';

export type Verdict = 'confirmed' | 'falsified' | 'inconclusive';

export interface ExperimentPrediction {
  tier: TierId;
  winRate: number;        // 0..1 expected
  confidence: number;     // 0..1 — multiplied into the verdict thresholds
}

export interface ExperimentActual {
  tier: TierId;
  winRate: number;        // 0..1 measured
  trials: number;
}

export interface Experiment {
  date: string;           // YYYY-MM-DD when the experiment ran
  hypothesisId: string;   // stable id (e.g. `drift-T4-iron-curtain-3-2026-05-12`)
  modelVersion: number;   // the model version that PRODUCED the prediction
  hypothesis: string;     // one-line plain-English statement
  levelId: string;        // which level was mutated
  mutation: LevelMutation;
  prediction: ExperimentPrediction;
  actual: ExperimentActual;
  verdict: Verdict;
  deltaPp: number;        // (actual - predicted) * 100 — sign carries direction
  notes?: string;
}

const LOG_REL = 'data/run-playtest/experiments.jsonl';

function repoRoot(): string {
  // WHY: __dirname → scripts/run-playtest/ ; the data dir is two levels up.
  return join(__dirname, '..', '..');
}

function logPath(): string {
  return join(repoRoot(), LOG_REL);
}

export function appendExperiment(record: Experiment): void {
  const path = logPath();
  mkdirSync(dirname(path), { recursive: true });
  const line = JSON.stringify(record) + '\n';
  appendFileSync(path, line);
}

export function readAll(): Experiment[] {
  const path = logPath();
  if (!existsSync(path)) return [];
  const text = readFileSync(path, 'utf8');
  const out: Experiment[] = [];
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    try {
      out.push(JSON.parse(line) as Experiment);
    } catch {
      // WHY: skip malformed lines rather than throw — log is appended-to from
      // many runs, partial writes shouldn't crash the next night's pipeline.
    }
  }
  return out;
}

export function recentN(n: number): Experiment[] {
  const all = readAll();
  return all.slice(Math.max(0, all.length - n));
}

export function falsified(): Experiment[] {
  return readAll().filter((e) => e.verdict === 'falsified');
}

/** Group experiments by ISO date (most recent first). */
export function byDate(): Map<string, Experiment[]> {
  const out = new Map<string, Experiment[]>();
  for (const e of readAll()) {
    const arr = out.get(e.date) ?? [];
    arr.push(e);
    out.set(e.date, arr);
  }
  return out;
}
