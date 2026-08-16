/**
 * Generator for the 2026-05-15-evening session. Produces 10-level RunDefs
 * parameterized by difficulty knobs per template.
 *
 * This is a one-shot tool — kept under scripts/ for tsx import convenience.
 */

import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import { simulateGame } from './simulate';
import { SWEEP_ROOKIE_START } from './utils/levels';
import type { Bot, TierId, FailMode } from './types';
import type {
  Coord,
  EnemyPiece,
  RookieForm,
  RunPuzzle,
} from '../../lib/run/types';

type LevelBuilder = (rookieStart: Coord) => RunPuzzle;

const pawn = (file: number, rank: number): EnemyPiece => ({
  type: 'pawn', color: 'black', file, rank,
});
const knight = (file: number, rank: number): EnemyPiece => ({
  type: 'knight', color: 'black', file, rank,
});
const bishop = (file: number, rank: number): EnemyPiece => ({
  type: 'bishop', color: 'black', file, rank,
});
const queen = (file: number, rank: number): EnemyPiece => ({
  type: 'queen', color: 'black', file, rank,
});

const make = (
  level: number,
  pieces: EnemyPiece[],
  opts: {
    hazards?: Coord[];
    moveLimit?: number;
    allowedForms?: RookieForm[];
    enemiesPerTurn?: number;
  } = {},
): LevelBuilder => (rookieStart) => ({
  level,
  rookieStart,
  pieces: pieces.map((p) => ({ ...p })),
  hazards: opts.hazards?.map((h) => ({ ...h })),
  moveLimit: opts.moveLimit,
  allowedForms: opts.allowedForms,
  enemiesPerTurn: opts.enemiesPerTurn,
});

// ─────────────────────────────────────────────────────────────────────────────
// Knob systems

type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface CandidateKnobs {
  /** Per-level difficulty 1..10 (1=trivial, 10=brutal). */
  d: Difficulty[];
  /** Allow forms unlock pattern. */
  formsAt: { knightFromLevel: number; bishopFromLevel: number };
  /** Extra pressure: extra enemies per turn at level X. */
  rngSeed: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// NORMAL CHESS TEMPLATE
// Pieces concentrate on rank 6-8 (back rank), advancing pawns appear at rank
// 4-5 at higher difficulty. Feels like a real chess endgame collapsing.

function buildNormalLevel(level: number, d: Difficulty, forms: { knight: boolean; bishop: boolean }): LevelBuilder {
  const pieces: EnemyPiece[] = [];
  const hazards: Coord[] = [];
  let moveLimit: number | undefined;
  let enemiesPerTurn: number | undefined;
  const allowedForms: RookieForm[] = [];
  if (forms.knight) allowedForms.push('knight');
  if (forms.bishop) allowedForms.push('bishop');

  // NORMAL — gentler escalation. Bots are very strong; we widen the medium-
  // difficulty zone by introducing pressure (hazards, moveLimit) WITHOUT
  // jumping enemiesPerTurn until late levels.

  // Back-rank pawns (rank 7) — always sparse, never a full row
  if (d >= 1) pieces.push(pawn(3, 7), pawn(6, 7));
  if (d >= 3) pieces.push(pawn(5, 7));
  if (d >= 5) pieces.push(pawn(4, 7));

  // Back-rank pieces (rank 8)
  if (d >= 2) pieces.push(knight(4, 8));
  if (d >= 4) pieces.push(bishop(6, 8));
  if (d >= 6) pieces.push(queen(4, 8));
  if (d >= 7) pieces.push(knight(2, 8), bishop(3, 8));
  if (d >= 9) pieces.push(knight(7, 8));

  // Advancing pawns at rank 6 (block files)
  if (d >= 3) pieces.push(pawn(2, 6), pawn(7, 6));
  if (d >= 5) pieces.push(pawn(4, 6), pawn(6, 6));
  if (d >= 7) pieces.push(pawn(3, 6), pawn(5, 6));

  // Forward pawns at rank 4 (close-in blockers)
  if (d >= 6) pieces.push(pawn(3, 4), pawn(6, 4));
  if (d >= 8) pieces.push(pawn(1, 4), pawn(8, 4));
  if (d >= 10) pieces.push(pawn(4, 4), pawn(5, 4), pawn(2, 4), pawn(7, 4));
  // L10 capstone: a defended rank-3 wall to deny the rook-rush solution
  if (d >= 10) pieces.push(pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3), queen(5, 8));

  // Pressure mechanics — slower than v1
  if (d >= 6) enemiesPerTurn = 2;
  if (d >= 9) enemiesPerTurn = 3;
  if (d >= 10) enemiesPerTurn = 3; // never 4 for normal (kept legible)

  if (d >= 7) moveLimit = 24;
  if (d >= 8) moveLimit = 20;
  if (d >= 9) moveLimit = 18;
  if (d >= 10) moveLimit = 16;

  if (d >= 8) hazards.push({ file: 1, rank: 5 }, { file: 8, rank: 5 });
  if (d >= 10) hazards.push({ file: 4, rank: 4 }, { file: 5, rank: 4 });

  return make(level, pieces, {
    hazards: hazards.length > 0 ? hazards : undefined,
    moveLimit,
    allowedForms: allowedForms.length > 0 ? allowedForms : undefined,
    enemiesPerTurn,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// WALLS TEMPLATE
// Iron Curtain DNA — layered pawn walls + defended chains at ranks 3-4.

function buildWallsLevel(level: number, d: Difficulty, forms: { knight: boolean; bishop: boolean }): LevelBuilder {
  const pieces: EnemyPiece[] = [];
  const hazards: Coord[] = [];
  let moveLimit: number | undefined;
  let enemiesPerTurn: number | undefined;
  const allowedForms: RookieForm[] = [];
  if (forms.knight) allowedForms.push('knight');
  if (forms.bishop) allowedForms.push('bishop');

  // WALLS — Iron Curtain DNA, but gentler ramp than v1.
  // Sparse rank-3 wall always
  pieces.push(pawn(2, 3), pawn(5, 3), pawn(7, 3));

  if (d >= 3) pieces.push(pawn(3, 4), pawn(6, 4));
  if (d >= 4) pieces.push(pawn(1, 3), pawn(3, 3));
  if (d >= 5) pieces.push(pawn(1, 4), pawn(8, 4));
  if (d >= 6) pieces.push(pawn(4, 3), pawn(6, 3), pawn(8, 3));
  if (d >= 7) pieces.push(pawn(2, 4), pawn(5, 4), pawn(7, 4));

  // Mid-board threats
  if (d >= 3) pieces.push(knight(4, 6));
  if (d >= 5) pieces.push(bishop(5, 6));
  if (d >= 6) pieces.push(knight(3, 6));
  if (d >= 7) pieces.push(bishop(6, 6));
  if (d >= 8) pieces.push(knight(7, 6));

  // Back rank
  if (d >= 5) pieces.push(pawn(4, 7));
  if (d >= 7) pieces.push(queen(4, 8));
  if (d >= 8) pieces.push(pawn(5, 7), bishop(5, 7));
  if (d >= 9) pieces.push(knight(3, 7));
  if (d >= 10) pieces.push(queen(5, 8));

  // Slower pressure ramp than v1
  if (d >= 4) enemiesPerTurn = 2;
  if (d >= 7) enemiesPerTurn = 3;
  if (d >= 10) enemiesPerTurn = 4;

  if (d >= 7) moveLimit = 22;
  if (d >= 8) moveLimit = 18;
  if (d >= 9) moveLimit = 16;
  if (d >= 10) moveLimit = 16;

  if (d >= 6) hazards.push({ file: 4, rank: 5 }, { file: 5, rank: 5 });
  if (d >= 8) hazards.push({ file: 1, rank: 5 }, { file: 8, rank: 5 });
  if (d >= 10) hazards.push({ file: 4, rank: 7 }, { file: 5, rank: 7 });

  return make(level, pieces, {
    hazards: hazards.length > 0 ? hazards : undefined,
    moveLimit,
    allowedForms: allowedForms.length > 0 ? allowedForms : undefined,
    enemiesPerTurn,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MIXED TEMPLATE
// Queen sightlines + hazards + bishops on diagonals. Less wall, more lockdown.

function buildMixedLevel(level: number, d: Difficulty, forms: { knight: boolean; bishop: boolean }): LevelBuilder {
  const pieces: EnemyPiece[] = [];
  const hazards: Coord[] = [];
  let moveLimit: number | undefined;
  let enemiesPerTurn: number | undefined;
  const allowedForms: RookieForm[] = [];
  if (forms.knight) allowedForms.push('knight');
  if (forms.bishop) allowedForms.push('bishop');

  // MIXED — queen sightlines + knight outposts + bishops on diagonals.
  // Slower ramp than v2; mixed should also feel different from walls.
  pieces.push(bishop(2, 6), pawn(4, 4));
  if (d >= 2) pieces.push(bishop(7, 6));
  if (d >= 3) pieces.push(knight(4, 5), pawn(5, 4));
  if (d >= 4) pieces.push(pawn(3, 4), pawn(6, 4));
  if (d >= 5) pieces.push(queen(5, 6), pawn(2, 3), pawn(7, 3));
  if (d >= 6) pieces.push(knight(6, 5), bishop(3, 7));
  if (d >= 7) pieces.push(queen(4, 7), pawn(1, 4), pawn(8, 4));
  if (d >= 8) pieces.push(knight(2, 5), knight(7, 5));
  if (d >= 9) pieces.push(bishop(5, 8), pawn(4, 6), pawn(5, 6));
  if (d >= 10) pieces.push(
    queen(2, 8), queen(7, 8),
    // L10 capstone: dense rank-3 wall + diagonal locks
    pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3),
    knight(4, 6), knight(5, 6),
  );

  if (d >= 4) enemiesPerTurn = 2;
  if (d >= 8) enemiesPerTurn = 3;

  if (d >= 7) moveLimit = 22;
  if (d >= 8) moveLimit = 18;
  if (d >= 9) moveLimit = 16;
  if (d >= 10) moveLimit = 15;

  if (d >= 5) hazards.push({ file: 4, rank: 3 }, { file: 5, rank: 3 });
  if (d >= 7) hazards.push({ file: 1, rank: 4 }, { file: 8, rank: 4 });
  if (d >= 10) hazards.push({ file: 4, rank: 6 }, { file: 5, rank: 6 });

  return make(level, pieces, {
    hazards: hazards.length > 0 ? hazards : undefined,
    moveLimit,
    allowedForms: allowedForms.length > 0 ? allowedForms : undefined,
    enemiesPerTurn,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Build a full 10-level run from knobs

function buildRun(template: 'normal' | 'walls' | 'mixed', knobs: CandidateKnobs): LevelBuilder[] {
  const builders: LevelBuilder[] = [];
  for (let i = 0; i < 10; i++) {
    const level = i + 1;
    const d = knobs.d[i];
    const forms = {
      knight: level >= knobs.formsAt.knightFromLevel,
      bishop: level >= knobs.formsAt.bishopFromLevel,
    };
    if (template === 'normal') builders.push(buildNormalLevel(level, d, forms));
    else if (template === 'walls') builders.push(buildWallsLevel(level, d, forms));
    else builders.push(buildMixedLevel(level, d, forms));
  }
  return builders;
}

// ─────────────────────────────────────────────────────────────────────────────
// Test a candidate run

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

interface LevelResult {
  level: number;
  byTier: Record<TierId, { wins: number; trials: number; winPct: number }>;
  failModes: Record<FailMode, number>;
}

function testRun(levels: LevelBuilder[], trials: number): LevelResult[] {
  const tiers: TierId[] = ['T3', 'T4', 'T5'];
  const results: LevelResult[] = [];
  for (let i = 0; i < levels.length; i++) {
    const puzzle = levels[i](SWEEP_ROOKIE_START);
    const byTier: LevelResult['byTier'] = {
      T3: { wins: 0, trials: 0, winPct: 0 },
      T4: { wins: 0, trials: 0, winPct: 0 },
      T5: { wins: 0, trials: 0, winPct: 0 },
    };
    const failModes: Record<FailMode, number> = {
      won: 0, captured: 0, 'move-limit': 0, 'dead-end': 0,
    };
    for (const tier of tiers) {
      const bot = BOTS[tier];
      for (let t = 0; t < trials; t++) {
        const seed = `evening__L${i + 1}__${tier}__${t}`;
        const r = simulateGame({ puzzle, bot, seed });
        byTier[tier].trials++;
        if (r.win) byTier[tier].wins++;
        failModes[r.failMode]++;
      }
      byTier[tier].winPct = Math.round(
        (byTier[tier].wins / byTier[tier].trials) * 100,
      );
    }
    results.push({ level: puzzle.level, byTier, failModes });
  }
  return results;
}

function testNoAbil(lastBuilder: LevelBuilder, trials: number): number {
  const all = new Set([
    'bishop-step', 'knight-hop', 'queen-pulse', 'pawn-charge', 'freeze-ray',
    'poison-dart', 'rabies-dart', 'phase-step', 'leap', 'surge', 'aegis', 'decoy',
  ]);
  const puzzle = lastBuilder(SWEEP_ROOKIE_START);
  let wins = 0;
  for (let t = 0; t < trials; t++) {
    const r = simulateGame({
      puzzle, bot: T5,
      seed: `evening__L10__noabil__${t}`,
      excludedAbilities: all as ReadonlySet<never>,
    });
    if (r.win) wins++;
  }
  return Math.round((wins / trials) * 100);
}

function fitToTarget(results: LevelResult[]): number {
  // Realistic target curve given bot strength — L1-5 will be ~100% T4 in
  // practice (same as all existing runs). The interesting fit happens L6-L10.
  // We weight late levels 3x to push selection toward smooth-drop candidates.
  const targets = [95, 90, 80, 70, 60, 50, 35, 25, 15, 8];
  const weights = [1, 1, 1, 1, 1, 2, 3, 3, 3, 4];
  let sse = 0;
  for (let i = 0; i < 10; i++) {
    sse += weights[i] * (results[i].byTier.T4.winPct - targets[i]) ** 2;
  }
  return Math.sqrt(sse);
}

// ─────────────────────────────────────────────────────────────────────────────
// Emit candidate .ts file

function emitCandidateFile(
  outPath: string,
  template: 'normal' | 'walls' | 'mixed',
  knobs: CandidateKnobs,
  results: LevelResult[],
  l10NoAbil: number,
): void {
  const targets = [95, 90, 80, 70, 60, 50, 35, 25, 15, 8];
  const summary = results.map((r, i) =>
    `// L${i + 1}: T3=${r.byTier.T3.winPct}% T4=${r.byTier.T4.winPct}% T5=${r.byTier.T5.winPct}% (target T4=${targets[i]}%)`,
  ).join('\n');

  const buildFnName =
    template === 'normal' ? 'buildNormalLevel'
    : template === 'walls' ? 'buildWallsLevel'
    : 'buildMixedLevel';
  void buildFnName;

  // Resolve the puzzles statically so the candidate file is self-contained.
  const builders = buildRun(template, knobs);
  const puzzles = builders.map((b) => b(SWEEP_ROOKIE_START));

  const literal = puzzles.map((p, i) => {
    const piecesStr = p.pieces.map((pc) =>
      `${pc.type === 'pawn' ? 'pawn' : pc.type === 'knight' ? 'knight' : pc.type === 'bishop' ? 'bishop' : 'queen'}(${pc.file}, ${pc.rank})`,
    ).join(', ');
    const optsBits: string[] = [];
    if (p.hazards && p.hazards.length > 0) {
      optsBits.push(`hazards: [${p.hazards.map((h) => `{ file: ${h.file}, rank: ${h.rank} }`).join(', ')}]`);
    }
    if (p.moveLimit) optsBits.push(`moveLimit: ${p.moveLimit}`);
    if (p.allowedForms && p.allowedForms.length > 0) {
      optsBits.push(`allowedForms: [${p.allowedForms.map((f) => `'${f}'`).join(', ')}]`);
    }
    if (p.enemiesPerTurn) optsBits.push(`enemiesPerTurn: ${p.enemiesPerTurn}`);
    const opts = optsBits.length > 0 ? `, { ${optsBits.join(', ')} }` : '';
    return `  make(${i + 1}, [${piecesStr}]${opts}),`;
  }).join('\n');

  const content = `/**
 * Candidate: ${path.basename(outPath, '.ts')}
 * Template: ${template.toUpperCase()}
 * Knobs.d: [${knobs.d.join(', ')}]
 * Forms: knight from L${knobs.formsAt.knightFromLevel}, bishop from L${knobs.formsAt.bishopFromLevel}
 *
 * Results (vs target curve 95/90/80/70/60/50/35/25/15/8):
${summary}
 * L10 no-ability T5: ${l10NoAbil}%
 */

import { LevelBuilder, make, pawn, knight, bishop, queen } from './_shared';

export const template = '${template}';
export const notes = 'Auto-generated 2026-05-15-evening session.';

export const levels: ReadonlyArray<LevelBuilder> = [
${literal}
];
`;
  writeFileSync(outPath, content, 'utf-8');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main: iterate candidates per template, test, emit, log

interface CandidateResult {
  template: 'normal' | 'walls' | 'mixed';
  name: string;
  knobs: CandidateKnobs;
  results: LevelResult[];
  l10NoAbil: number;
  fit: number;
}

async function main(): Promise<void> {
  const outDir = path.resolve('data/run-playtest/candidate-levels/2026-05-15-evening');
  mkdirSync(outDir, { recursive: true });

  // Calibration insight from pass 1: the bots are very strong. Anything below
  // knob d=7 is essentially 100% T4. Real difficulty curve runs d=7→10 across
  // L7→L10. So we keep d=4..7 for the warmup levels (gives a felt-difficulty
  // ramp even if T4 stays at 100%) and concentrate variation at L7-10.
  const candidateKnobsByTemplate: Record<string, CandidateKnobs[]> = {
    normal: [
      // Gentle ramp, hard finish — best for matching "joy" early-game feel.
      { d: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], formsAt: { knightFromLevel: 4, bishopFromLevel: 7 }, rngSeed: 1 },
      // Faster ramp, peaks slightly higher at L10.
      { d: [1, 2, 4, 5, 6, 7, 8, 9, 10, 10], formsAt: { knightFromLevel: 4, bishopFromLevel: 7 }, rngSeed: 2 },
      // Earlier real-difficulty arrival.
      { d: [2, 3, 4, 5, 6, 7, 7, 8, 9, 10], formsAt: { knightFromLevel: 3, bishopFromLevel: 6 }, rngSeed: 3 },
      // Most aggressive — capstone-heavy.
      { d: [1, 3, 5, 6, 7, 7, 8, 9, 10, 10], formsAt: { knightFromLevel: 4, bishopFromLevel: 7 }, rngSeed: 4 },
    ],
    walls: [
      { d: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], formsAt: { knightFromLevel: 4, bishopFromLevel: 7 }, rngSeed: 11 },
      { d: [1, 2, 4, 5, 6, 7, 7, 8, 9, 10], formsAt: { knightFromLevel: 4, bishopFromLevel: 7 }, rngSeed: 12 },
      { d: [2, 3, 4, 5, 6, 7, 8, 8, 9, 10], formsAt: { knightFromLevel: 3, bishopFromLevel: 6 }, rngSeed: 13 },
      { d: [1, 3, 4, 5, 6, 7, 7, 8, 9, 10], formsAt: { knightFromLevel: 4, bishopFromLevel: 7 }, rngSeed: 14 },
    ],
    mixed: [
      { d: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], formsAt: { knightFromLevel: 4, bishopFromLevel: 7 }, rngSeed: 21 },
      { d: [1, 2, 4, 5, 6, 7, 8, 9, 10, 10], formsAt: { knightFromLevel: 4, bishopFromLevel: 7 }, rngSeed: 22 },
      { d: [2, 3, 4, 5, 6, 7, 7, 8, 9, 10], formsAt: { knightFromLevel: 3, bishopFromLevel: 6 }, rngSeed: 23 },
      { d: [1, 3, 5, 6, 7, 7, 8, 9, 10, 10], formsAt: { knightFromLevel: 4, bishopFromLevel: 7 }, rngSeed: 24 },
    ],
  };

  const trialsPerTier = 15;
  const ablationTrials = 12;
  const allResults: CandidateResult[] = [];

  for (const template of ['normal', 'walls', 'mixed'] as const) {
    const candidates = candidateKnobsByTemplate[template];
    for (let i = 0; i < candidates.length; i++) {
      const knobs = candidates[i];
      const name = `${template}-${String(i + 1).padStart(2, '0')}`;
      process.stdout.write(`[gen] ${name}... `);
      const t0 = Date.now();
      const builders = buildRun(template, knobs);
      const results = testRun(builders, trialsPerTier);
      const l10NoAbil = testNoAbil(builders[9], ablationTrials);
      const fit = fitToTarget(results);
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`fit=${fit.toFixed(1)} L10-no-abil=${l10NoAbil}% (${dt}s)`);

      const outPath = path.join(outDir, `${name}.ts`);
      emitCandidateFile(outPath, template, knobs, results, l10NoAbil);
      allResults.push({ template, name, knobs, results, l10NoAbil, fit });
    }
  }

  // Write session digest.
  const targets = [95, 90, 80, 70, 60, 50, 35, 25, 15, 8];
  const sessionPath = path.resolve('data/run-playtest/sessions/2026-05-15-evening.md');
  mkdirSync(path.dirname(sessionPath), { recursive: true });
  let md = `# 2026-05-15 Evening Level-Generation Session\n\nTarget T4 curve: ${targets.join(' / ')}\n\n`;
  md += `## Summary\n\n`;
  md += `| Candidate | Template | Fit (lower=better) | L10 no-abil T5 |\n`;
  md += `|-----------|----------|--------------------|-----------------|\n`;
  for (const r of allResults) {
    md += `| ${r.name} | ${r.template} | ${r.fit.toFixed(1)} | ${r.l10NoAbil}% |\n`;
  }
  md += `\n## Per-candidate details\n\n`;
  for (const r of allResults) {
    md += `### ${r.name} (${r.template})\n\n`;
    md += `Knobs.d: [${r.knobs.d.join(', ')}]\n\n`;
    md += `| Lvl | T3 | T4 | T5 | Target T4 | Δ | Failures (won/cap/ml/de) |\n`;
    md += `|----:|---:|---:|---:|----------:|--:|--------------------------|\n`;
    for (let i = 0; i < r.results.length; i++) {
      const lv = r.results[i];
      const fm = lv.failModes;
      const t4 = lv.byTier.T4.winPct;
      md += `| ${i + 1} | ${lv.byTier.T3.winPct}% | ${t4}% | ${lv.byTier.T5.winPct}% | ${targets[i]}% | ${t4 - targets[i] >= 0 ? '+' : ''}${t4 - targets[i]} | ${fm.won}/${fm.captured}/${fm['move-limit']}/${fm['dead-end']} |\n`;
    }
    md += `\nL10 no-abil T5: ${r.l10NoAbil}%\n\n`;
  }

  // Pick top 2 per template by lowest fit.
  md += `## Top 2 per template (winners)\n\n`;
  const winners: CandidateResult[] = [];
  for (const tmpl of ['normal', 'walls', 'mixed'] as const) {
    const inTmpl = allResults.filter((r) => r.template === tmpl).sort((a, b) => a.fit - b.fit);
    md += `**${tmpl}:** ${inTmpl.slice(0, 2).map((w) => `${w.name} (fit ${w.fit.toFixed(1)})`).join(', ')}\n\n`;
    winners.push(...inTmpl.slice(0, 2));
  }

  writeFileSync(sessionPath, md, 'utf-8');
  console.log(`\n[gen] wrote ${sessionPath}`);
  console.log(`[gen] winners: ${winners.map((w) => w.name).join(', ')}`);

  // Also write a winners.json that the shipper consumes.
  const winnersPath = path.resolve('data/run-playtest/sessions/2026-05-15-evening-winners.json');
  writeFileSync(winnersPath, JSON.stringify({ winners: winners.map((w) => ({ name: w.name, template: w.template, knobs: w.knobs })) }, null, 2));
  console.log(`[gen] wrote ${winnersPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
