/**
 * Gather every (runId, levelIndex) → RunPuzzle from the canonical RUNS array.
 *
 * Uses a fixed Rookie start file so sweep results aren't date-dependent. We
 * pick file 4 (d-file) — central, in the b-g legal range, far from corner
 * edge cases.
 */

import { RUNS } from '../../../lib/run/runs';
import type { Coord, RunPuzzle } from '../../../lib/run/types';

export interface CatalogEntry {
  levelId: string;        // `${runId}/${levelIndex}`
  runId: string;
  runName: string;
  levelIndex: number;     // 0-based
  puzzle: RunPuzzle;
}

export const SWEEP_ROOKIE_START: Coord = { file: 4, rank: 1 };

export function buildLevelCatalog(): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const run of RUNS) {
    run.levels.forEach((builder, idx) => {
      const puzzle = builder(SWEEP_ROOKIE_START);
      out.push({
        levelId: `${run.id}/${idx}`,
        runId: run.id,
        runName: run.name,
        levelIndex: idx,
        puzzle,
      });
    });
  }
  return out;
}
