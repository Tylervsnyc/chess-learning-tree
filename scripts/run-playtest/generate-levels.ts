#!/usr/bin/env -S npx tsx
/**
 * Rookie's Run — candidate level generator.
 *
 * Emits 50 candidate levels (10 archetype templates × 5 seeded variations
 * each) and playtests every one with T3 + T4 bots. Writes per-level markdown
 * files and an INDEX.md ranked by a "fun-hard" score that targets a sweet
 * spot: T3 winning 30-55% and T4 winning 70%+.
 *
 * WHY a separate script (not part of nightly's sweep): the canonical RUNS
 * catalogue is hand-tuned and stable. This script generates *new* puzzles
 * out-of-tree, scores them, and produces TypeScript-syntactic snippets ready
 * to paste into runs.ts. Nothing here writes to lib/run.
 *
 * Determinism: all randomness flows through mulberry32 seeded from a fixed
 * archetype string + variant index + global offset. Re-running with the same
 * offset produces byte-identical level definitions.
 *
 * Archetype design draws on:
 *   - run-strategy-bible.md (open-file mandate, queen sightlines, defended chains)
 *   - hazards_SUMMARY_2026-05-13.md (most hazards hurt the player; only place
 *     them when they block a SPECIFIC enemy attack line — iron-curtain/7 +
 *     hornets-nest/8 templates)
 *   - SUMMARY_2026-05-13 ability rankings (Detonate, Mirror, Aegis, Tempo
 *     Vault dominate — but levels here ONLY use SHIPPED abilities, so
 *     allowedForms drives form-based counters)
 *
 * CLI:
 *   npx tsx scripts/run-playtest/generate-levels.ts [trialsPerCell=20] [seedOffset=0]
 *
 * Full run cost: 50 levels × 40 sims ≈ 100 min at default trial counts.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { mulberry32 } from '../../lib/run/seed';
import type {
  Coord,
  EnemyPiece,
  PieceType,
  RookieForm,
  RunPuzzle,
} from '../../lib/run/types';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { simulateGame } from './simulate';
import type { Bot, TierId } from './types';

// ─── Coord + piece helpers ────────────────────────────────────────────────

type RNG = () => number;

const pawn = (file: number, rank: number): EnemyPiece => ({
  type: 'pawn',
  color: 'black',
  file,
  rank,
});
const knight = (file: number, rank: number): EnemyPiece => ({
  type: 'knight',
  color: 'black',
  file,
  rank,
});
const bishop = (file: number, rank: number): EnemyPiece => ({
  type: 'bishop',
  color: 'black',
  file,
  rank,
});
const queen = (file: number, rank: number): EnemyPiece => ({
  type: 'queen',
  color: 'black',
  file,
  rank,
});

/** Pick a random integer in [lo, hi] inclusive. */
function randInt(rng: RNG, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/**
 * Choose `k` distinct files from a pool. WHY: most archetypes want a
 * sparse-but-shaped row, not random scatter that could overlap.
 */
function pickFiles(rng: RNG, pool: number[], k: number): number[] {
  const copy = [...pool];
  const out: number[] = [];
  for (let i = 0; i < k && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return out.sort((a, b) => a - b);
}

/** Dedupe pieces by square — last write wins. WHY: archetype helpers may add
 *  pieces in layers; we don't want two-on-one-square to crash the engine. */
function dedupePieces(pieces: EnemyPiece[]): EnemyPiece[] {
  const map = new Map<string, EnemyPiece>();
  for (const p of pieces) {
    map.set(`${p.file},${p.rank}`, p);
  }
  return Array.from(map.values());
}

/** Drop hazards that collide with a piece — engine doesn't tolerate overlap. */
function pruneHazards(hazards: Coord[], pieces: EnemyPiece[]): Coord[] {
  const occupied = new Set(pieces.map((p) => `${p.file},${p.rank}`));
  return hazards.filter((h) => !occupied.has(`${h.file},${h.rank}`));
}

// ─── Archetype builders ───────────────────────────────────────────────────

interface ArchetypeMeta {
  /** Slug used in filenames. */
  id: string;
  /** Human-readable label for the markdown. */
  name: string;
  /** Design intent shown in the per-level file. */
  intent: string;
}

interface ArchetypeOutput {
  pieces: EnemyPiece[];
  hazards: Coord[];
  moveLimit: number;
  allowedForms: RookieForm[];
  enemiesPerTurn: number;
}

type ArchetypeFn = (rng: RNG) => ArchetypeOutput;

interface Archetype {
  meta: ArchetypeMeta;
  fn: ArchetypeFn;
}

/**
 * 1. Pawn Wall — layered pawn rows on ranks 3, 5, 6. Capturing the outermost
 *    opens a file. 8-14 pawns, occasional minor piece above. At most 1-2
 *    strategic hazards (we lean toward zero — the hazard data says hazards
 *    usually just narrow Rookie's path).
 */
const archPawnWall: ArchetypeFn = (rng) => {
  // Denser than the existing L1 daily — we want T3 win rate in the 30-55%
  // band, which requires actual obstruction, not a sparse line.
  const r3 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 4, 5));
  const r5 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 4, 5));
  const r6 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 3, 4));
  const pieces: EnemyPiece[] = [];
  for (const f of r3) pieces.push(pawn(f, 3));
  for (const f of r5) pieces.push(pawn(f, 5));
  for (const f of r6) pieces.push(pawn(f, 6));
  // Maybe a minor capping piece on rank 7. WHY: opens the bonus-tempo lure
  // of "stop short to capture" without raising the threat density.
  if (rng() < 0.5) {
    const cap = rng() < 0.5 ? knight : bishop;
    pieces.push(cap(randInt(rng, 3, 6), 7));
  }
  const hazards: Coord[] = [];
  // At most one hazard, placed to block a single-square gap on rank 4
  // (between pawn columns). WHY zero or one only: hazard ablation says
  // adding hazards usually hurts the player; we restrain ourselves here.
  if (rng() < 0.3) {
    hazards.push({ file: randInt(rng, 3, 6), rank: 4 });
  }
  return {
    pieces: dedupePieces(pieces),
    hazards: pruneHazards(hazards, pieces),
    moveLimit: randInt(rng, 16, 20),
    allowedForms: [],
    enemiesPerTurn: 1,
  };
};

/**
 * 2. Queen Shielded — 1-2 queens at rank 4-5 behind a pawn shield. Knight
 *    transform required (allowedForms = ['knight']) so Rookie can leap the
 *    shield. 0 hazards — let the queen sightlines do the work.
 */
const archQueenShielded: ArchetypeFn = (rng) => {
  const queenCount = randInt(rng, 1, 2);
  const queenFiles = pickFiles(rng, [2, 3, 4, 5, 6, 7], queenCount);
  const pieces: EnemyPiece[] = [];
  for (const f of queenFiles) {
    const r = randInt(rng, 4, 5);
    pieces.push(queen(f, r));
    // Shield pawn directly in front of the queen. WHY: capturing the shield
    // exposes Rookie to the queen — exactly the "defended pawn chain" lesson.
    if (r >= 3) pieces.push(pawn(f, r - 1));
    // A second shield pawn diagonally (so the queen has a defended-pawn
    // partner). Forces Rookie to go around or knight-hop.
    if (rng() < 0.6 && r >= 3) {
      const sideFile = f + (rng() < 0.5 ? -1 : 1);
      if (sideFile >= 1 && sideFile <= 8) pieces.push(pawn(sideFile, r - 1));
    }
  }
  // Fuller pawn rank 3 cover — wide enough to actually obstruct.
  const buffers = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 3, 5));
  for (const f of buffers) pieces.push(pawn(f, 3));
  // Plus a stagger pawn on rank 6 to slow the climb after the queens are dealt with.
  const r6 = pickFiles(rng, [2, 3, 4, 5, 6, 7], randInt(rng, 1, 2));
  for (const f of r6) pieces.push(pawn(f, 6));
  return {
    pieces: dedupePieces(pieces),
    hazards: [],
    moveLimit: randInt(rng, 16, 20),
    allowedForms: ['knight'],
    enemiesPerTurn: 1,
  };
};

/**
 * 3. Knight Forks — 2-3 enemy knights at ranks 5-6 placed where their
 *    L-shape coverage overlaps Rookie's natural climbing files. allowedForms
 *    includes 'knight' so Rookie can fight back. Optional 1 hazard that
 *    blocks a knight L-jump (the hornets-nest/8 template).
 */
const archKnightForks: ArchetypeFn = (rng) => {
  const count = randInt(rng, 2, 3);
  const pieces: EnemyPiece[] = [];
  const usedSquares = new Set<string>();
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    while (attempts < 8) {
      const f = randInt(rng, 2, 7);
      const r = randInt(rng, 5, 6);
      const key = `${f},${r}`;
      if (!usedSquares.has(key)) {
        usedSquares.add(key);
        pieces.push(knight(f, r));
        break;
      }
      attempts++;
    }
  }
  // Fuller pawn cover on rank 3 — without it Rookie just slides around the
  // knights. The knights' L-coverage has to be the bottleneck.
  const r3 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 3, 5));
  for (const f of r3) pieces.push(pawn(f, 3));
  const r7 = pickFiles(rng, [2, 3, 4, 5, 6, 7], randInt(rng, 1, 2));
  for (const f of r7) pieces.push(pawn(f, 7));
  // Maybe one strategic hazard at rank 4 or 5 to block a specific L-jump
  // square. WHY: hornets-nest/8 showed hazards blocking knight L-jumps are
  // among the very few hazard placements that actually HELP the player.
  const hazards: Coord[] = [];
  if (rng() < 0.4 && pieces.length > 0) {
    const k = pieces.find((p) => p.type === 'knight');
    if (k) {
      // Pick an L-jump square one rank below the knight, on a flanking file.
      const flankFile = k.file + (rng() < 0.5 ? -1 : 1);
      const targetRank = k.rank - 2;
      if (flankFile >= 1 && flankFile <= 8 && targetRank >= 2) {
        hazards.push({ file: flankFile, rank: targetRank });
      }
    }
  }
  return {
    pieces: dedupePieces(pieces),
    hazards: pruneHazards(hazards, pieces),
    moveLimit: randInt(rng, 16, 20),
    allowedForms: ['knight'],
    enemiesPerTurn: 1,
  };
};

/**
 * 4. Bishop Cross — 2-3 bishops on rank 6-7 with overlapping diagonals.
 *    Rookie has to track which colour squares are safe. allowedForms
 *    includes 'bishop' so Rookie can mirror the threat.
 */
const archBishopCross: ArchetypeFn = (rng) => {
  const count = randInt(rng, 2, 3);
  const files = pickFiles(rng, [2, 3, 4, 5, 6, 7], count);
  const pieces: EnemyPiece[] = [];
  for (const f of files) {
    pieces.push(bishop(f, randInt(rng, 6, 7)));
  }
  // Denser pawn texture. Bishop diagonals only matter if pawns slow Rookie
  // long enough for her to cross a bishop sightline.
  const r3 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 4, 5));
  for (const f of r3) pieces.push(pawn(f, 3));
  const r5 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 2, 3));
  for (const f of r5) pieces.push(pawn(f, 5));
  return {
    pieces: dedupePieces(pieces),
    hazards: [],
    moveLimit: randInt(rng, 16, 19),
    allowedForms: ['bishop'],
    enemiesPerTurn: 1,
  };
};

/**
 * 5. Strategic Hazards — 4 hazards each placed to block a SPECIFIC enemy
 *    attack line (the iron-curtain/7 template that proved hazards-as-walls
 *    works). Moderate piece count so the hazards have meaningful targets.
 */
const archStrategicHazards: ArchetypeFn = (rng) => {
  // Place 1-2 queens or bishops at rank 4-5 so their sightlines hit Rookie's
  // approach. Then drop hazards on the squares directly between them and
  // Rookie's start (rank 1, files 2-7).
  const pieces: EnemyPiece[] = [];
  const hazards: Coord[] = [];
  const threatCount = randInt(rng, 1, 2);
  for (let i = 0; i < threatCount; i++) {
    const isQueen = rng() < 0.5;
    const f = randInt(rng, 2, 7);
    const r = randInt(rng, 4, 5);
    pieces.push(isQueen ? queen(f, r) : bishop(f, r));
    // Hazard on the file directly between Rookie's likely climb file (4)
    // and the threat. WHY: this is the "blocks the queen sightline aimed at
    // d-file" placement that iron-curtain/7 exemplifies.
    if (r >= 2) hazards.push({ file: f, rank: r - 1 });
  }
  // Add 2 more hazards on flanks, blocking the same threat's diagonal lines.
  hazards.push({ file: 1, rank: randInt(rng, 4, 5) });
  hazards.push({ file: 8, rank: randInt(rng, 4, 5) });
  // Denser pawn texture on rank 3 and 6 so the hazards bite.
  const r3 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 4, 5));
  for (const f of r3) pieces.push(pawn(f, 3));
  const r6 = pickFiles(rng, [2, 3, 4, 5, 6, 7], randInt(rng, 2, 3));
  for (const f of r6) pieces.push(pawn(f, 6));
  return {
    pieces: dedupePieces(pieces),
    hazards: pruneHazards(hazards.slice(0, 4), pieces),
    moveLimit: randInt(rng, 17, 20),
    allowedForms: ['knight', 'bishop'],
    enemiesPerTurn: 1,
  };
};

/**
 * 6. Choke Point — heavy pieces on rank 4-5 except for 1-2 safe files.
 *    Rookie threads the needle. allowedForms knight + bishop. 0-1 hazards.
 */
const archChokePoint: ArchetypeFn = (rng) => {
  // Pick 1-2 safe files to leave gaps. WHY: the level must be solvable —
  // a fully sealed rank-4 wall is unfair.
  const safeFiles = pickFiles(rng, [2, 3, 4, 5, 6, 7], randInt(rng, 1, 2));
  const wallFiles = [1, 2, 3, 4, 5, 6, 7, 8].filter(
    (f) => !safeFiles.includes(f),
  );
  const pieces: EnemyPiece[] = [];
  for (const f of wallFiles) {
    const r = rng() < 0.5 ? 4 : 5;
    // Heavy piece mix — mostly pawns, occasional knight/bishop.
    const roll = rng();
    if (roll < 0.7) pieces.push(pawn(f, r));
    else if (roll < 0.85) pieces.push(knight(f, r));
    else pieces.push(bishop(f, r));
  }
  // Rear-rank wall (rank 6 or 7) so the choke isn't the only obstacle.
  const rear = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 3, 4));
  for (const f of rear) pieces.push(pawn(f, randInt(rng, 6, 7)));
  const hazards: Coord[] = [];
  if (rng() < 0.4) {
    // Hazard outside the safe corridor. WHY: narrows the choke a bit more
    // without making it unwinnable.
    const off = wallFiles[Math.floor(rng() * wallFiles.length)];
    if (off !== undefined) hazards.push({ file: off, rank: 6 });
  }
  return {
    pieces: dedupePieces(pieces),
    hazards: pruneHazards(hazards, pieces),
    moveLimit: randInt(rng, 16, 19),
    allowedForms: ['knight', 'bishop'],
    enemiesPerTurn: 1,
  };
};

/**
 * 7. Tempo Cliff — moderate piece count, TIGHT move limit (target ~1.5x
 *    minimum reasonable). Forces speed. allowedForms include 'queen' so
 *    Rookie can dash. No hazards (preserving the focus on speed).
 */
const archTempoCliff: ArchetypeFn = (rng) => {
  const pieces: EnemyPiece[] = [];
  // Solid fence on rank 3 — without one Rookie can just slide to rank 8.
  const r3 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 4, 5));
  for (const f of r3) pieces.push(pawn(f, 3));
  // A few mid-board threats so detours aren't free.
  const upper = pickFiles(rng, [2, 3, 4, 5, 6, 7], randInt(rng, 2, 3));
  for (const f of upper) {
    const roll = rng();
    if (roll < 0.5) pieces.push(pawn(f, randInt(rng, 5, 6)));
    else if (roll < 0.85) pieces.push(knight(f, randInt(rng, 5, 6)));
    else pieces.push(bishop(f, randInt(rng, 5, 6)));
  }
  return {
    pieces: dedupePieces(pieces),
    hazards: [],
    // Average climb 1→8 with two walls is 5-7 Rookie moves; we cap at
    // 8-11 so a single wrong route loses the level.
    moveLimit: randInt(rng, 8, 11),
    allowedForms: ['knight', 'bishop'],
    enemiesPerTurn: 1,
  };
};

/**
 * 8. Multi-Threat — mix of pieces (2 knights + 1 bishop + 4 pawns + 1 queen).
 *    High threat density. allowedForms knight + bishop. Restraint on hazards.
 */
const archMultiThreat: ArchetypeFn = (rng) => {
  const pieces: EnemyPiece[] = [];
  // 4 pawns on rank 3 (varied files)
  const r3 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], 4);
  for (const f of r3) pieces.push(pawn(f, 3));
  // 2 knights on rank 5
  const knightFiles = pickFiles(rng, [2, 3, 4, 5, 6, 7], 2);
  for (const f of knightFiles) pieces.push(knight(f, 5));
  // 1 bishop on rank 6
  pieces.push(bishop(randInt(rng, 3, 6), 6));
  // 1 queen at rank 7 (back-rank guard)
  pieces.push(queen(randInt(rng, 3, 6), 7));
  return {
    pieces: dedupePieces(pieces),
    hazards: [],
    moveLimit: randInt(rng, 17, 20),
    allowedForms: ['knight', 'bishop'],
    enemiesPerTurn: 1,
  };
};

/**
 * 9. Open Approach — sparse rank 2-3 (Rookie gets a free run forward) then
 *    dense rank 5-7 (hard wall to crack). 0-1 hazards.
 */
const archOpenApproach: ArchetypeFn = (rng) => {
  const pieces: EnemyPiece[] = [];
  // Very sparse rank 3 — at most 1 pawn to keep the approach open.
  if (rng() < 0.5) pieces.push(pawn(randInt(rng, 2, 7), 3));
  // Solid rank-5 wall. WHY full: the "open approach" is supposed to lure
  // Rookie up fast and HIT a wall — so the wall must be a wall.
  const r5 = pickFiles(rng, [1, 2, 3, 4, 5, 6, 7, 8], randInt(rng, 5, 6));
  for (const f of r5) pieces.push(pawn(f, 5));
  // Rank 6 has the high-value pieces — knights, bishops, threats Rookie has
  // to dispatch AFTER cracking the wall.
  const r6 = pickFiles(rng, [2, 3, 4, 5, 6, 7], randInt(rng, 3, 4));
  for (const f of r6) {
    const roll = rng();
    if (roll < 0.5) pieces.push(pawn(f, 6));
    else if (roll < 0.8) pieces.push(knight(f, 6));
    else pieces.push(bishop(f, 6));
  }
  const r7 = pickFiles(rng, [3, 4, 5, 6], randInt(rng, 1, 2));
  for (const f of r7) pieces.push(pawn(f, 7));
  const hazards: Coord[] = [];
  if (rng() < 0.35) {
    // Hazard in the wall area, blocking a flank.
    hazards.push({ file: rng() < 0.5 ? 1 : 8, rank: 5 });
  }
  return {
    pieces: dedupePieces(pieces),
    hazards: pruneHazards(hazards, pieces),
    moveLimit: randInt(rng, 15, 18),
    allowedForms: ['knight', 'bishop'],
    enemiesPerTurn: 1,
  };
};

/**
 * 10. Boss Single — 1 queen + heavy support (4-5 pieces). Queen at d7 or d8.
 *     allowedForms knight + bishop. 0-2 strategic hazards blocking queen
 *     sightlines.
 */
const archBossSingle: ArchetypeFn = (rng) => {
  const pieces: EnemyPiece[] = [];
  // Boss queen on the d or e file, rank 7 or 8.
  const qFile = rng() < 0.5 ? 4 : 5;
  const qRank = rng() < 0.5 ? 7 : 8;
  pieces.push(queen(qFile, qRank));
  // Support layer rank 5-6 — 4 to 5 pieces.
  const supportCount = randInt(rng, 4, 5);
  const supportFiles = pickFiles(
    rng,
    [1, 2, 3, 4, 5, 6, 7, 8].filter((f) => f !== qFile),
    supportCount,
  );
  for (const f of supportFiles) {
    const r = randInt(rng, 5, 6);
    const roll = rng();
    if (roll < 0.55) pieces.push(pawn(f, r));
    else if (roll < 0.8) pieces.push(knight(f, r));
    else pieces.push(bishop(f, r));
  }
  // 0-2 hazards in the queen's primary attack line (its file, below it).
  const hazards: Coord[] = [];
  const hazardCount = randInt(rng, 0, 2);
  for (let i = 0; i < hazardCount; i++) {
    // Block one square in the queen's file between rank 2-5. WHY: this is
    // the iron-curtain/7 pattern — hazard takes a square the queen would
    // otherwise use to slide down on Rookie.
    hazards.push({ file: qFile, rank: randInt(rng, 2, 5) });
  }
  return {
    pieces: dedupePieces(pieces),
    hazards: pruneHazards(hazards, pieces),
    moveLimit: randInt(rng, 18, 22),
    allowedForms: ['knight', 'bishop'],
    enemiesPerTurn: 1,
  };
};

const ARCHETYPES: Archetype[] = [
  {
    meta: {
      id: 'pawn-wall',
      name: 'Pawn Wall',
      intent:
        'Layered pawn rows on ranks 3, 5, 6. Capture an outer pawn to open the file behind it. Tests "defended-chain" awareness.',
    },
    fn: archPawnWall,
  },
  {
    meta: {
      id: 'queen-shielded',
      name: 'Queen Shielded',
      intent:
        'Queens behind pawn shields. Capturing the shield exposes Rookie to the queen sightline. Knight transform required to leap.',
    },
    fn: archQueenShielded,
  },
  {
    meta: {
      id: 'knight-forks',
      name: 'Knight Forks',
      intent:
        'Enemy knights cover overlapping L-jumps. Rookie can transform to knight and fight back. Optional hazard blocks a fork square.',
    },
    fn: archKnightForks,
  },
  {
    meta: {
      id: 'bishop-cross',
      name: 'Bishop Cross',
      intent:
        'Overlapping bishop diagonals. Stay colour-aware. Bishop transform lets Rookie counter on her own diagonals.',
    },
    fn: archBishopCross,
  },
  {
    meta: {
      id: 'strategic-hazards',
      name: 'Strategic Hazards',
      intent:
        '4 hazards placed to block specific enemy attack lines (iron-curtain/7 template). Hazards make the level EASIER by walling off threats.',
    },
    fn: archStrategicHazards,
  },
  {
    meta: {
      id: 'choke-point',
      name: 'Choke Point',
      intent:
        'Heavy rank-4/5 wall except for 1-2 safe files. Thread the needle. Knight/bishop transforms help when the corridor is too narrow.',
    },
    fn: archChokePoint,
  },
  {
    meta: {
      id: 'tempo-cliff',
      name: 'Tempo Cliff',
      intent:
        'Tight move limit (~10-13). Modest piece count. Forces straight-line speed; can\'t pause for captures.',
    },
    fn: archTempoCliff,
  },
  {
    meta: {
      id: 'multi-threat',
      name: 'Multi-Threat',
      intent:
        '2 knights + 1 bishop + 4 pawns + 1 queen. Boss-density without the boss-queen drama. Forces multi-piece awareness.',
    },
    fn: archMultiThreat,
  },
  {
    meta: {
      id: 'open-approach',
      name: 'Open Approach',
      intent:
        'Sparse rank 2-3, dense rank 5-7. Free run forward then a hard wall to crack. Tests pacing.',
    },
    fn: archOpenApproach,
  },
  {
    meta: {
      id: 'boss-single',
      name: 'Boss Single',
      intent:
        '1 queen at d7/d8 + 4-5 supporting pieces. Strategic hazards on queen file. Climax level template.',
    },
    fn: archBossSingle,
  },
];

const VARIATIONS_PER_ARCHETYPE = 5;

// ─── Hash + RNG plumbing ──────────────────────────────────────────────────

/** FNV-1a — same hash used elsewhere in the playtest harness. */
function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/**
 * Per-(archetype, variant) RNG. WHY: a single seed per variation makes the
 * piece placements reproducible — the same offset always yields the same 50
 * levels. The seedOffset lets us re-run with a fresh seed family if needed.
 */
function rngFor(archetypeId: string, variantIndex: number, seedOffset: number): RNG {
  return mulberry32(hashString(`${archetypeId}__${variantIndex}__${seedOffset}`));
}

// ─── Candidate definition ─────────────────────────────────────────────────

interface Candidate {
  /** Sequential 1..50. */
  index: number;
  archetype: ArchetypeMeta;
  variantIndex: number;
  /** Generator output baked into a RunPuzzle. */
  puzzle: RunPuzzle;
}

const ROOKIE_START: Coord = { file: 4, rank: 1 };

/**
 * Layer blockers on Rookie's starting and adjacent files so the level can't
 * be solved by a single rook slide.
 *
 * WHY this matters: Rookie starts at d1 with the rook form. If the d-file
 * is empty from rank 2 to rank 7, she wins in ONE move regardless of every
 * other piece on the board (rook slides d1→d8). The c-file and e-file are
 * the next-easiest sidesteps, so we also require at least one piece on
 * those columns to keep "slide one square right, slide up" off the menu.
 *
 * Strategy:
 *   - d-file (start file): ≥1 blocker on rank 2-7
 *   - c-file and e-file: ≥1 blocker each on rank 2-7
 *
 * Inserts pawns when the archetype's RNG produced a gap. Doesn't displace
 * existing pieces; only fills holes.
 */
function ensureStartFileBlocked(
  pieces: EnemyPiece[],
  hazards: Coord[],
  rng: RNG,
): EnemyPiece[] {
  const startFile = ROOKIE_START.file;
  let working = [...pieces];

  // EVERY file must have a PAWN on rank 3 — or some other stationary blocker
  // (pawn / hazard) somewhere on rank 2-7. WHY a pawn specifically: pawns
  // hold their ground (they only advance one rank per turn and only when
  // unobstructed). Minor pieces like knights can scatter on the first enemy
  // turn, exposing their file. The strategy-bible open-file mandate cuts
  // both ways: the level designer must close every file or the puzzle is a
  // 2-move slide.
  for (let f = 1; f <= 8; f++) {
    const hasPawnFence =
      working.some(
        (p) => p.file === f && p.type === 'pawn' && p.rank >= 2 && p.rank <= 4,
      ) ||
      hazards.some((h) => h.file === f && h.rank >= 2 && h.rank <= 4);
    if (!hasPawnFence) {
      working = dedupePieces([...working, pawn(f, 3)]);
    }
  }

  // Additionally — Rookie's start file (d) needs a SECOND, higher blocker
  // (rank 5-7) so capturing the rank-3 pawn doesn't trigger a one-slide
  // win. Adjacent files (c, e) similarly benefit from a higher blocker
  // for the same reason on her sidesteps.
  const needsUpperBlocker = (f: number): boolean => {
    return (
      !working.some((p) => p.file === f && p.rank >= 5 && p.rank <= 7) &&
      !hazards.some((h) => h.file === f && h.rank >= 5 && h.rank <= 7)
    );
  };
  for (const f of [startFile - 1, startFile, startFile + 1]) {
    if (f < 1 || f > 8) continue;
    if (needsUpperBlocker(f)) {
      working = dedupePieces([...working, pawn(f, randInt(rng, 5, 7))]);
    }
  }
  return working;
}

/**
 * Move any enemy that landed on rank 8 down to rank 7. WHY: Rookie wins by
 * reaching rank 8; an enemy ON rank 8 is a free capture that ends the game
 * in 1 move. Boss-single intentionally allows queens on rank 8 (it sets the
 * dramatic apex), so this guard is opt-in via `keepRank8`.
 */
function pushRank8Down(pieces: EnemyPiece[], keepRank8: boolean): EnemyPiece[] {
  if (keepRank8) return pieces;
  return pieces.map((p) => (p.rank === 8 ? { ...p, rank: 7 } : p));
}

function buildCandidates(seedOffset: number): Candidate[] {
  const out: Candidate[] = [];
  let idx = 1;
  for (const archetype of ARCHETYPES) {
    for (let v = 0; v < VARIATIONS_PER_ARCHETYPE; v++) {
      const rng = rngFor(archetype.meta.id, v, seedOffset);
      const built = archetype.fn(rng);
      // Boss Single deliberately places the queen on rank 8 as a climactic
      // capture-the-king moment — we let those through. Every other
      // archetype gets its rank-8 pieces nudged down.
      const keepRank8 = archetype.meta.id === 'boss-single';
      let pieces = pushRank8Down(built.pieces, keepRank8);
      // Force a blocker in Rookie's start file so the level can't be solved
      // by a single d1→d8 rook slide.
      pieces = ensureStartFileBlocked(pieces, built.hazards, rng);
      const hazards = pruneHazards(built.hazards, pieces);
      const puzzle: RunPuzzle = {
        level: idx,
        rookieStart: { ...ROOKIE_START },
        pieces: pieces.map((p) => ({ ...p })),
        hazards: hazards.map((h) => ({ ...h })),
        moveLimit: built.moveLimit,
        allowedForms: [...built.allowedForms],
        enemiesPerTurn: built.enemiesPerTurn,
      };
      out.push({
        index: idx,
        archetype: archetype.meta,
        variantIndex: v,
        puzzle,
      });
      idx++;
    }
  }
  return out;
}

// ─── Simulation harness ───────────────────────────────────────────────────

interface TierResult {
  tier: TierId;
  trials: number;
  wins: number;
  winRate: number; // 0..1
  meanMoves: number;
  failModes: Record<string, number>;
  meanCaptures: number;
}

interface CandidateResult {
  candidate: Candidate;
  perTier: TierResult[];
  funHardScore: number;
}

const BOTS: Bot[] = [T3, T4];

function runTier(
  candidate: Candidate,
  bot: Bot,
  trials: number,
  seedOffset: number,
): TierResult {
  let wins = 0;
  let totalMoves = 0;
  let totalCaptures = 0;
  const failModes: Record<string, number> = {};
  for (let t = 0; t < trials; t++) {
    // WHY include seedOffset: lets a re-run produce a distinct sim sample
    // while keeping the same level layouts (the layout RNG already absorbed
    // seedOffset). Keeps every cell fully reproducible.
    const seed = `gen__${candidate.archetype.id}__${candidate.variantIndex}__${bot.id}__${t}__${seedOffset}`;
    const r = simulateGame({ puzzle: candidate.puzzle, bot, seed });
    if (r.win) wins++;
    totalMoves += r.movesUsed;
    totalCaptures += r.captures.length;
    failModes[r.failMode] = (failModes[r.failMode] ?? 0) + 1;
  }
  return {
    tier: bot.id,
    trials,
    wins,
    winRate: wins / Math.max(1, trials),
    meanMoves: totalMoves / Math.max(1, trials),
    failModes,
    meanCaptures: totalCaptures / Math.max(1, trials),
  };
}

/**
 * Fun-hard scoring. 100 = perfect. Penalty sums:
 *   T3 too high or too low (target 30–55): max(0, abs(T3 − 42.5) − 12.5)
 *   T4 too low (target 70+): max(0, 70 − T4)
 * Lower score = worse. WHY this shape: we want levels where casual players
 * (T3) survive a third to half the time (challenge but not punishing) and
 * skilled players (T4) breeze through. That curve is the "fun-hard" sweet spot.
 */
function scoreFunHard(perTier: TierResult[]): number {
  const t3 = perTier.find((r) => r.tier === 'T3');
  const t4 = perTier.find((r) => r.tier === 'T4');
  if (!t3 || !t4) return 0;
  const t3pct = t3.winRate * 100;
  const t4pct = t4.winRate * 100;
  const penaltyT3 = Math.max(0, Math.abs(t3pct - 42.5) - 12.5);
  const penaltyT4 = Math.max(0, 70 - t4pct);
  return Math.max(0, 100 - penaltyT3 - penaltyT4);
}

// ─── Markdown rendering ───────────────────────────────────────────────────

function asciiBoard(puzzle: RunPuzzle): string {
  // 8x8 grid, rank 8 at top. R = rookie, p/n/b/q = enemy pieces, # = hazard,
  // . = empty. WHY include this: humans skim level files faster with a tiny
  // board diagram than reading coordinate lists.
  const grid: string[][] = [];
  for (let r = 8; r >= 1; r--) {
    const row: string[] = [];
    for (let f = 1; f <= 8; f++) {
      row.push('.');
    }
    grid.push(row);
  }
  const setSquare = (file: number, rank: number, ch: string): void => {
    const rowIdx = 8 - rank;
    grid[rowIdx][file - 1] = ch;
  };
  for (const h of puzzle.hazards ?? []) setSquare(h.file, h.rank, '#');
  for (const p of puzzle.pieces) {
    const ch =
      p.type === 'pawn' ? 'p' : p.type === 'knight' ? 'n' : p.type === 'bishop' ? 'b' : 'q';
    setSquare(p.file, p.rank, ch);
  }
  setSquare(puzzle.rookieStart.file, puzzle.rookieStart.rank, 'R');
  const lines = grid.map(
    (row, i) => `${8 - i} | ${row.join(' ')}`,
  );
  lines.push('    a b c d e f g h');
  return lines.join('\n');
}

function pieceToCtor(type: PieceType): string {
  switch (type) {
    case 'pawn':
      return 'pawn';
    case 'knight':
      return 'knight';
    case 'bishop':
      return 'bishop';
    case 'queen':
      return 'queen';
  }
}

function renderLevelTs(puzzle: RunPuzzle): string {
  // Produce a snippet ready to paste into runs.ts's `make(...)` factory.
  const pieceLines: string[] = [];
  // Group pieces by rank for readability — matches the existing style in
  // runs.ts / daily-levels.ts.
  const byRank = new Map<number, EnemyPiece[]>();
  for (const p of puzzle.pieces) {
    if (!byRank.has(p.rank)) byRank.set(p.rank, []);
    byRank.get(p.rank)!.push(p);
  }
  const sortedRanks = [...byRank.keys()].sort((a, b) => a - b);
  for (const r of sortedRanks) {
    const row = byRank
      .get(r)!
      .sort((a, b) => a.file - b.file)
      .map((p) => `${pieceToCtor(p.type)}(${p.file}, ${p.rank})`)
      .join(', ');
    pieceLines.push(`  ${row},`);
  }
  const hazardStr = (puzzle.hazards ?? []).length
    ? puzzle.hazards!
        .map((h) => `{ file: ${h.file}, rank: ${h.rank} }`)
        .join(', ')
    : '';
  const optsParts: string[] = [];
  if (hazardStr) optsParts.push(`hazards: [${hazardStr}]`);
  if (puzzle.moveLimit !== undefined)
    optsParts.push(`moveLimit: ${puzzle.moveLimit}`);
  if (puzzle.allowedForms && puzzle.allowedForms.length > 0) {
    optsParts.push(
      `allowedForms: [${puzzle.allowedForms.map((f) => `'${f}'`).join(', ')}]`,
    );
  }
  if (puzzle.enemiesPerTurn !== undefined && puzzle.enemiesPerTurn !== 1)
    optsParts.push(`enemiesPerTurn: ${puzzle.enemiesPerTurn}`);
  const optsStr =
    optsParts.length > 0 ? `\n    { ${optsParts.join(', ')} },` : '';
  return [
    `make(`,
    `  <LEVEL_NUMBER>,`,
    `  [`,
    pieceLines.join('\n'),
    `  ],${optsStr}`,
    `)`,
  ].join('\n');
}

function renderCandidateMd(result: CandidateResult): string {
  const { candidate, perTier, funHardScore } = result;
  const t3 = perTier.find((r) => r.tier === 'T3');
  const t4 = perTier.find((r) => r.tier === 'T4');
  const tierTable = perTier
    .map((r) => {
      const failBits = Object.entries(r.failModes)
        .filter(([k]) => k !== 'won')
        .sort((a, b) => b[1] - a[1])
        .map(([mode, count]) => `${mode}:${count}`)
        .join(', ');
      return `| ${r.tier} | ${r.trials} | ${(r.winRate * 100).toFixed(1)}% | ${r.meanMoves.toFixed(1)} | ${r.meanCaptures.toFixed(2)} | ${failBits || '—'} |`;
    })
    .join('\n');
  const lines: string[] = [];
  lines.push(`# ${candidate.archetype.name} — variant ${candidate.variantIndex + 1}`);
  lines.push('');
  lines.push(`**Archetype:** ${candidate.archetype.name} (id: \`${candidate.archetype.id}\`)`);
  lines.push(`**Variant:** ${candidate.variantIndex + 1} / ${VARIATIONS_PER_ARCHETYPE}`);
  lines.push(`**Sequential index:** ${candidate.index}`);
  lines.push(
    `**Fun-hard score:** **${funHardScore.toFixed(1)}** (target T3 30–55%, T4 70%+)`,
  );
  lines.push(`**T3 win rate:** ${t3 ? (t3.winRate * 100).toFixed(1) + '%' : '—'}  `);
  lines.push(`**T4 win rate:** ${t4 ? (t4.winRate * 100).toFixed(1) + '%' : '—'}`);
  lines.push('');
  lines.push(`## Design intent`);
  lines.push('');
  lines.push(candidate.archetype.intent);
  lines.push('');
  lines.push(`## Board diagram`);
  lines.push('');
  lines.push('```');
  lines.push(asciiBoard(candidate.puzzle));
  lines.push('```');
  lines.push('');
  lines.push(`## Stats`);
  lines.push('');
  lines.push('| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |');
  lines.push('|---|---:|---:|---:|---:|---|');
  lines.push(tierTable);
  lines.push('');
  lines.push(`## Level definition (paste into runs.ts)`);
  lines.push('');
  lines.push('```ts');
  lines.push(renderLevelTs(candidate.puzzle));
  lines.push('```');
  lines.push('');
  lines.push(`## Parameters`);
  lines.push('');
  lines.push(`- pieces: ${candidate.puzzle.pieces.length}`);
  lines.push(`- hazards: ${(candidate.puzzle.hazards ?? []).length}`);
  lines.push(`- moveLimit: ${candidate.puzzle.moveLimit ?? 'none'}`);
  lines.push(
    `- allowedForms: ${candidate.puzzle.allowedForms?.length ? candidate.puzzle.allowedForms.join(', ') : 'rook only'}`,
  );
  lines.push(`- enemiesPerTurn: ${candidate.puzzle.enemiesPerTurn ?? 1}`);
  lines.push('');
  return lines.join('\n');
}

function renderIndexMd(
  results: CandidateResult[],
  trialsPerCell: number,
  seedOffset: number,
  date: string,
  durationSec: number,
): string {
  const sortedByScore = [...results].sort((a, b) => b.funHardScore - a.funHardScore);
  const byArchetype = new Map<string, CandidateResult[]>();
  for (const r of results) {
    if (!byArchetype.has(r.candidate.archetype.id)) {
      byArchetype.set(r.candidate.archetype.id, []);
    }
    byArchetype.get(r.candidate.archetype.id)!.push(r);
  }
  const archetypeSummary: { id: string; name: string; meanScore: number; hits: number }[] = [];
  for (const [id, rs] of byArchetype) {
    const meanScore = rs.reduce((s, r) => s + r.funHardScore, 0) / rs.length;
    // "Hit" = score above 70 — comfortably inside the fun-hard band.
    const hits = rs.filter((r) => r.funHardScore >= 70).length;
    archetypeSummary.push({
      id,
      name: rs[0].candidate.archetype.name,
      meanScore,
      hits,
    });
  }
  archetypeSummary.sort((a, b) => b.meanScore - a.meanScore);
  const lines: string[] = [];
  lines.push(`# Candidate levels — ${date}`);
  lines.push('');
  lines.push(
    `**Generated:** 10 archetypes × ${VARIATIONS_PER_ARCHETYPE} variants = ${results.length} candidate levels.`,
  );
  lines.push(`**Trials per (level, tier):** ${trialsPerCell}`);
  lines.push(`**Seed offset:** ${seedOffset}`);
  lines.push(`**Duration:** ${durationSec.toFixed(1)} s`);
  lines.push('');
  lines.push('## Scoring rubric');
  lines.push('');
  lines.push('Fun-hard score = 100 − penalty.');
  lines.push('- **T3 penalty**: `max(0, |T3% − 42.5| − 12.5)` — target T3 win rate 30–55%.');
  lines.push('- **T4 penalty**: `max(0, 70 − T4%)` — target T4 win rate ≥ 70%.');
  lines.push('- Higher = better. Hits (≥ 70) = clearly inside the fun-hard band.');
  lines.push('');
  lines.push('## Top 10 by fun-hard score');
  lines.push('');
  lines.push('| Rank | Archetype | Variant | T3 | T4 | Score | File |');
  lines.push('|---:|---|---:|---:|---:|---:|---|');
  for (let i = 0; i < Math.min(10, sortedByScore.length); i++) {
    const r = sortedByScore[i];
    const t3 = r.perTier.find((x) => x.tier === 'T3');
    const t4 = r.perTier.find((x) => x.tier === 'T4');
    lines.push(
      `| ${i + 1} | ${r.candidate.archetype.name} | ${r.candidate.variantIndex + 1} | ${t3 ? (t3.winRate * 100).toFixed(0) + '%' : '—'} | ${t4 ? (t4.winRate * 100).toFixed(0) + '%' : '—'} | **${r.funHardScore.toFixed(1)}** | \`${r.candidate.archetype.id}_${r.candidate.variantIndex + 1}.md\` |`,
    );
  }
  lines.push('');
  lines.push('## Archetype leaderboard');
  lines.push('');
  lines.push('| Rank | Archetype | Mean score | Hits (≥70) |');
  lines.push('|---:|---|---:|---:|');
  archetypeSummary.forEach((a, i) => {
    lines.push(`| ${i + 1} | ${a.name} | ${a.meanScore.toFixed(1)} | ${a.hits} / ${VARIATIONS_PER_ARCHETYPE} |`);
  });
  lines.push('');
  lines.push('## All 50 candidates (ranked)');
  lines.push('');
  lines.push('| # | Archetype | Variant | T3 | T4 | Score | File |');
  lines.push('|---:|---|---:|---:|---:|---:|---|');
  sortedByScore.forEach((r, i) => {
    const t3 = r.perTier.find((x) => x.tier === 'T3');
    const t4 = r.perTier.find((x) => x.tier === 'T4');
    lines.push(
      `| ${i + 1} | ${r.candidate.archetype.name} | ${r.candidate.variantIndex + 1} | ${t3 ? (t3.winRate * 100).toFixed(0) + '%' : '—'} | ${t4 ? (t4.winRate * 100).toFixed(0) + '%' : '—'} | ${r.funHardScore.toFixed(1)} | \`${r.candidate.archetype.id}_${r.candidate.variantIndex + 1}.md\` |`,
    );
  });
  lines.push('');
  return lines.join('\n');
}

// ─── Main entry ───────────────────────────────────────────────────────────

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface GenerateLevelsOpts {
  trialsPerCell: number;
  seedOffset: number;
  /** Override the date directory (mostly for tests). Defaults to today's ISO. */
  date?: string;
  /** Override the output root. Defaults to data/run-playtest/candidate-levels. */
  outRoot?: string;
  /** Progress callback — receives one-line status strings. */
  onProgress?: (line: string) => void;
}

export interface GenerateLevelsResult {
  date: string;
  outDir: string;
  results: CandidateResult[];
  topByScore: CandidateResult[];
  archetypeRanking: { id: string; name: string; meanScore: number; hits: number }[];
  durationSec: number;
}

/**
 * Programmatic entry — the nightly pipeline calls this when --enable-level-gen
 * is set. CLI's `main()` wraps this with argv parsing.
 */
export function generateLevels(opts: GenerateLevelsOpts): GenerateLevelsResult {
  const { trialsPerCell, seedOffset, onProgress } = opts;
  const date = opts.date ?? today();
  const repoRoot = join(__dirname, '..', '..');
  const outRoot =
    opts.outRoot ??
    join(repoRoot, 'data', 'run-playtest', 'candidate-levels');
  const outDir = join(outRoot, date);
  mkdirSync(outDir, { recursive: true });
  const candidates = buildCandidates(seedOffset);
  const t0 = Date.now();
  const results: CandidateResult[] = [];
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    onProgress?.(
      `[generate-levels] ${i + 1}/${candidates.length} ${c.archetype.id} v${c.variantIndex + 1}`,
    );
    const perTier: TierResult[] = [];
    for (const bot of BOTS) {
      perTier.push(runTier(c, bot, trialsPerCell, seedOffset));
    }
    const funHardScore = scoreFunHard(perTier);
    const result: CandidateResult = { candidate: c, perTier, funHardScore };
    results.push(result);
    const filename = `${c.archetype.id}_${c.variantIndex + 1}.md`;
    writeFileSync(join(outDir, filename), renderCandidateMd(result));
  }
  const durationSec = (Date.now() - t0) / 1000;
  const indexPath = join(outDir, 'INDEX.md');
  writeFileSync(
    indexPath,
    renderIndexMd(results, trialsPerCell, seedOffset, date, durationSec),
  );
  onProgress?.(`[generate-levels] wrote INDEX.md (${results.length} levels, ${durationSec.toFixed(1)}s)`);
  const sortedByScore = [...results].sort((a, b) => b.funHardScore - a.funHardScore);
  const byArch = new Map<string, CandidateResult[]>();
  for (const r of results) {
    if (!byArch.has(r.candidate.archetype.id)) byArch.set(r.candidate.archetype.id, []);
    byArch.get(r.candidate.archetype.id)!.push(r);
  }
  const archetypeRanking: GenerateLevelsResult['archetypeRanking'] = [];
  for (const [id, rs] of byArch) {
    const meanScore = rs.reduce((s, r) => s + r.funHardScore, 0) / rs.length;
    const hits = rs.filter((r) => r.funHardScore >= 70).length;
    archetypeRanking.push({ id, name: rs[0].candidate.archetype.name, meanScore, hits });
  }
  archetypeRanking.sort((a, b) => b.meanScore - a.meanScore);
  return {
    date,
    outDir,
    results,
    topByScore: sortedByScore,
    archetypeRanking,
    durationSec,
  };
}

async function main(): Promise<void> {
  const trialsPerCell = parseInt(process.argv[2] ?? '20', 10);
  const seedOffset = parseInt(process.argv[3] ?? '0', 10);
  console.log(
    `[generate-levels] trialsPerCell=${trialsPerCell}, seedOffset=${seedOffset}`,
  );
  const r = generateLevels({
    trialsPerCell,
    seedOffset,
    onProgress: (s) => console.log(s),
  });
  console.log(`[generate-levels] outDir: ${r.outDir}`);
  console.log(`[generate-levels] top 5:`);
  for (let i = 0; i < Math.min(5, r.topByScore.length); i++) {
    const c = r.topByScore[i];
    const t3 = c.perTier.find((x) => x.tier === 'T3');
    const t4 = c.perTier.find((x) => x.tier === 'T4');
    console.log(
      `  ${i + 1}. ${c.candidate.archetype.name} v${c.candidate.variantIndex + 1} — score ${c.funHardScore.toFixed(1)} (T3 ${t3 ? (t3.winRate * 100).toFixed(0) : '?'}% / T4 ${t4 ? (t4.winRate * 100).toFixed(0) : '?'}%)`,
    );
  }
  console.log(`[generate-levels] archetype ranking:`);
  for (let i = 0; i < r.archetypeRanking.length; i++) {
    const a = r.archetypeRanking[i];
    console.log(
      `  ${i + 1}. ${a.name} — mean ${a.meanScore.toFixed(1)} (${a.hits}/${VARIATIONS_PER_ARCHETYPE} hits)`,
    );
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
