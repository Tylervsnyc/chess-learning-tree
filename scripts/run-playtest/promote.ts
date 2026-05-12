/**
 * Promote a candidate level or ability into the live game.
 *
 * Usage:
 *   npx tsx scripts/run-playtest/promote.ts level <path>
 *   npx tsx scripts/run-playtest/promote.ts level <path> --into=<runId>
 *   npx tsx scripts/run-playtest/promote.ts ability <path>
 *
 * WHY this is its own script instead of an API route: promotion edits
 * source code (lib/run/runs.ts) and moves files in `data/`. We want a
 * dry-run-able CLI we can iterate on, and the admin page just shells out
 * to it via a child process for parity with manual operator flow.
 *
 * Safety bars (refuse + exit non-zero on failure):
 *   level    — T5 ≥ 70%, T3 ∈ [25, 70], ≥1 mutation applied, no duplicate
 *              vs runs.ts / daily-levels.ts.
 *   ability  — id unique, all 5 tiers, mechanics hint present.
 *
 * Ability promotion is STUBBED tonight — we generate a .patch skeleton
 * for `lib/run/abilities.ts` but don't actually edit the file. Promoting
 * an ability requires engine logic the operator must wire by hand.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  isCandidateAbility,
  isCandidateLevel,
  type CandidateAbility,
  type CandidateLevel,
} from './candidate-schema';
import type { EnemyPiece, RookieForm, RunPuzzle } from '../../lib/run/types';
import { ALL_ABILITY_IDS } from '../../lib/run/abilities';
import type { LevelMutation } from './mutations';

// ── path constants ──────────────────────────────────────────────────────────
// Resolve relative to repo root (two levels up from this script).
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const RUNS_TS = path.join(REPO_ROOT, 'lib', 'run', 'runs.ts');
const DAILY_LEVELS_TS = path.join(REPO_ROOT, 'lib', 'run', 'daily-levels.ts');
const PROMOTED_LEVELS_DIR = path.join(
  REPO_ROOT,
  'data',
  'run-playtest',
  'promoted-levels',
);
const PROMOTED_ABILITIES_DIR = path.join(
  REPO_ROOT,
  'data',
  'run-playtest',
  'promoted-abilities',
);

// ── tiny logger ─────────────────────────────────────────────────────────────
function ok(msg: string): void {
  console.log(`[promote] ${msg}`);
}
function fail(msg: string): never {
  console.error(`[promote] ERROR: ${msg}`);
  process.exit(1);
}

// ── CLI plumbing ────────────────────────────────────────────────────────────
interface ParsedArgs {
  kind: 'level' | 'ability';
  filePath: string;
  intoRunId?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  if (args.length < 2) {
    fail(
      'Usage: npx tsx scripts/run-playtest/promote.ts <level|ability> <path> [--into=<runId>]',
    );
  }
  const kind = args[0];
  if (kind !== 'level' && kind !== 'ability') {
    fail(`Unknown kind "${kind}". Expected "level" or "ability".`);
  }
  const filePath = path.resolve(args[1]);
  let intoRunId: string | undefined;
  for (const a of args.slice(2)) {
    if (a.startsWith('--into=')) intoRunId = a.slice('--into='.length);
  }
  return { kind, filePath, intoRunId };
}

function readJson<T>(p: string): T {
  if (!fs.existsSync(p)) fail(`File not found: ${p}`);
  const raw = fs.readFileSync(p, 'utf8');
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    fail(`Invalid JSON in ${p}: ${(e as Error).message}`);
  }
}

// ── LEVEL PROMOTION ─────────────────────────────────────────────────────────

/**
 * Build a duplicate-detection signature from a puzzle. We hash by:
 *   - pieces (sorted by file/rank/type)
 *   - hazards (sorted)
 *   - moveLimit / allowedForms / enemiesPerTurn
 *
 * `rookieStart` is intentionally excluded because the same puzzle may be
 * built with different starts. Level number is also excluded — that's
 * positional within a run, not part of the puzzle's identity.
 */
function puzzleSignature(p: {
  pieces: EnemyPiece[];
  hazards?: { file: number; rank: number }[];
  moveLimit?: number | null;
  allowedForms?: RookieForm[];
  enemiesPerTurn?: number;
}): string {
  const pieces = [...p.pieces]
    .map((q) => `${q.type}@${q.file},${q.rank}`)
    .sort()
    .join('|');
  const hazards = (p.hazards ?? [])
    .map((h) => `${h.file},${h.rank}`)
    .sort()
    .join('|');
  const forms = (p.allowedForms ?? []).slice().sort().join(',');
  return [
    `pieces:${pieces}`,
    `hazards:${hazards}`,
    `moveLimit:${p.moveLimit ?? 'null'}`,
    `forms:${forms}`,
    `epT:${p.enemiesPerTurn ?? 1}`,
  ].join('||');
}

/**
 * Walk a TS source string and extract every literal level builder's puzzle
 * signature. We're not building a full TS parser — we lean on the highly
 * regular `pawn(f, r)` / `knight(f, r)` etc. literal pattern used in both
 * `runs.ts` and `daily-levels.ts`. False positives here would only mean
 * "candidate flagged as dup" which is fine — operator can inspect.
 */
function extractSignaturesFromSource(src: string): string[] {
  // Split on `make(` or `build(` (daily-levels.ts) and process each chunk.
  // Each chunk should start with the level number and end at the matching
  // close paren / opts brace. We grab everything up to the next `make(` or
  // `build(` or `RUN_` declaration.
  const chunks = src.split(/\b(?:make|build)\s*\(/);
  const sigs: string[] = [];
  for (let i = 1; i < chunks.length; i++) {
    const chunk = chunks[i];
    // Pieces — find every `pawn(f, r)` / `knight(f, r)` / `bishop(f, r)` /
    // `queen(f, r)` inside this chunk.
    const pieces: EnemyPiece[] = [];
    const pieceRe = /\b(pawn|knight|bishop|queen)\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/g;
    let pm: RegExpExecArray | null;
    while ((pm = pieceRe.exec(chunk)) !== null) {
      pieces.push({
        type: pm[1] as EnemyPiece['type'],
        color: 'black',
        file: parseInt(pm[2], 10),
        rank: parseInt(pm[3], 10),
      });
    }
    if (pieces.length === 0) continue;

    // Hazards — `{ file: F, rank: R }` literals INSIDE a `hazards:` block.
    const hazards: { file: number; rank: number }[] = [];
    const hazMatch = chunk.match(/hazards\s*:\s*\[([\s\S]*?)\]/);
    if (hazMatch) {
      const hazRe = /\{\s*file\s*:\s*(\d+)\s*,\s*rank\s*:\s*(\d+)\s*\}/g;
      let hm: RegExpExecArray | null;
      while ((hm = hazRe.exec(hazMatch[1])) !== null) {
        hazards.push({ file: parseInt(hm[1], 10), rank: parseInt(hm[2], 10) });
      }
    }

    // moveLimit / enemiesPerTurn / allowedForms.
    const moveLimit = (() => {
      const m = chunk.match(/moveLimit\s*:\s*(\d+)/);
      return m ? parseInt(m[1], 10) : undefined;
    })();
    const enemiesPerTurn = (() => {
      const m = chunk.match(/enemiesPerTurn\s*:\s*(\d+)/);
      return m ? parseInt(m[1], 10) : undefined;
    })();
    const allowedForms = (() => {
      const m = chunk.match(/allowedForms\s*:\s*\[([^\]]*)\]/);
      if (!m) return undefined;
      const forms: RookieForm[] = [];
      const fRe = /'([a-z]+)'/g;
      let fm: RegExpExecArray | null;
      while ((fm = fRe.exec(m[1])) !== null) {
        if (
          fm[1] === 'rook' ||
          fm[1] === 'knight' ||
          fm[1] === 'bishop' ||
          fm[1] === 'queen'
        ) {
          forms.push(fm[1]);
        }
      }
      return forms;
    })();

    sigs.push(
      puzzleSignature({
        pieces,
        hazards,
        moveLimit,
        allowedForms,
        enemiesPerTurn,
      }),
    );
  }
  return sigs;
}

/** Render a piece literal `pawn(f, r)` / `knight(f, r)` etc. */
function pieceLiteral(p: EnemyPiece): string {
  return `${p.type}(${p.file}, ${p.rank})`;
}

/**
 * Build the TS source for a single LevelBuilder factory call. Returns a
 * string like `make(3, [pawn(1,3), knight(4,5)], { moveLimit: 14 })`.
 *
 * Pieces are grouped four-per-line for readability, mirroring the existing
 * runs.ts hand-written formatting.
 */
function renderBuilderCall(
  level: number,
  puzzle: Omit<RunPuzzle, 'rookieStart'>,
): string {
  const piecesByRank = new Map<number, EnemyPiece[]>();
  for (const p of puzzle.pieces) {
    const arr = piecesByRank.get(p.rank) ?? [];
    arr.push(p);
    piecesByRank.set(p.rank, arr);
  }
  const ranks = [...piecesByRank.keys()].sort((a, b) => a - b);
  const piecesLines = ranks
    .map((r) => {
      const row = (piecesByRank.get(r) ?? [])
        .sort((a, b) => a.file - b.file)
        .map(pieceLiteral)
        .join(', ');
      return `        ${row},`;
    })
    .join('\n');

  const optsLines: string[] = [];
  if (puzzle.hazards && puzzle.hazards.length > 0) {
    const hazStr = puzzle.hazards
      .map((h) => `{ file: ${h.file}, rank: ${h.rank} }`)
      .join(', ');
    optsLines.push(`        hazards: [${hazStr}],`);
  }
  if (typeof puzzle.moveLimit === 'number') {
    optsLines.push(`        moveLimit: ${puzzle.moveLimit},`);
  }
  if (puzzle.allowedForms && puzzle.allowedForms.length > 0) {
    optsLines.push(
      `        allowedForms: [${puzzle.allowedForms.map((f) => `'${f}'`).join(', ')}],`,
    );
  }
  if (typeof puzzle.enemiesPerTurn === 'number') {
    optsLines.push(`        enemiesPerTurn: ${puzzle.enemiesPerTurn},`);
  }

  const opts = optsLines.length > 0 ? `,\n      {\n${optsLines.join('\n')}\n      }` : '';
  return `    make(
      ${level},
      [
${piecesLines}
      ]${opts},
    )`;
}

/** Insert a candidate into RUNS in runs.ts. Two paths:
 *   - --into=<existing run id>: append builder to that RunDef's `levels:`
 *   - default: create / append to RUN_CANDIDATE_POOL
 */
function appendCandidateToRuns(
  src: string,
  builderSrc: string,
  intoRunId: string | undefined,
): { newSrc: string; targetRunId: string } {
  if (intoRunId) {
    // Find the RunDef with matching id and append builder before `],` of
    // its `levels:` array.
    const runDefRe = new RegExp(
      `const RUN_[A-Z_]+\\s*:\\s*RunDef\\s*=\\s*\\{[\\s\\S]*?id:\\s*'${intoRunId}'[\\s\\S]*?levels:\\s*\\[([\\s\\S]*?)\\]`,
      'm',
    );
    const m = runDefRe.exec(src);
    if (!m) fail(`Could not find existing run with id="${intoRunId}" in runs.ts`);
    const insertAt = m.index + m[0].length - 1; // before closing `]`
    const before = src.slice(0, insertAt);
    const after = src.slice(insertAt);
    // The existing array body — make sure we terminate the previous element
    // with a comma if needed. Simplest: always prepend a comma + newline.
    const inserted = `,\n${builderSrc}\n  `;
    return {
      newSrc: before + inserted + after,
      targetRunId: intoRunId,
    };
  }

  // Default: candidate pool. Look for existing RUN_CANDIDATE_POOL.
  const poolRe =
    /const\s+RUN_CANDIDATE_POOL\s*:\s*RunDef\s*=\s*\{[\s\S]*?levels:\s*\[([\s\S]*?)\][\s\S]*?\};/m;
  if (poolRe.test(src)) {
    const m = poolRe.exec(src);
    if (!m) fail('Internal: RUN_CANDIDATE_POOL regex matched then unmatched');
    // Insert before the closing `]` of the levels array.
    const fullMatch = m[0];
    const start = m.index;
    const levelsArrStart = fullMatch.indexOf('levels:');
    const arrOpenAbs = start + levelsArrStart + fullMatch.slice(levelsArrStart).indexOf('[');
    // Find matching closing bracket.
    let depth = 0;
    let arrCloseAbs = -1;
    for (let i = arrOpenAbs; i < src.length; i++) {
      const c = src[i];
      if (c === '[') depth++;
      else if (c === ']') {
        depth--;
        if (depth === 0) {
          arrCloseAbs = i;
          break;
        }
      }
    }
    if (arrCloseAbs < 0) fail('Could not find end of RUN_CANDIDATE_POOL.levels array');
    // Check whether array currently has any builders to decide on separator.
    const inner = src.slice(arrOpenAbs + 1, arrCloseAbs);
    const innerTrimmed = inner.trim();
    if (innerTrimmed.length === 0) {
      // Empty array — just drop the builder in.
      const before = src.slice(0, arrCloseAbs);
      const after = src.slice(arrCloseAbs);
      return {
        newSrc: before + '\n' + builderSrc + ',\n  ' + after,
        targetRunId: 'candidate-pool',
      };
    }
    // Non-empty — find the last non-whitespace char before the closing `]`.
    // If it's `,` we just append. If it's `)` (no trailing comma) we splice
    // one in. This keeps the formatting clean either way.
    let lastNonWsIdx = arrCloseAbs - 1;
    while (lastNonWsIdx > arrOpenAbs && /\s/.test(src[lastNonWsIdx])) lastNonWsIdx--;
    const hasTrailingComma = src[lastNonWsIdx] === ',';
    const before = src.slice(0, lastNonWsIdx + 1);
    const after = src.slice(arrCloseAbs);
    const prefix = hasTrailingComma ? '\n' : ',\n';
    return {
      newSrc: before + prefix + builderSrc + ',\n  ' + after,
      targetRunId: 'candidate-pool',
    };
  }

  // Need to create RUN_CANDIDATE_POOL AND register it in RUNS.
  // Insert the new RunDef just before the `export const RUNS` declaration.
  const runsArrRe = /export\s+const\s+RUNS\s*:\s*ReadonlyArray<RunDef>\s*=\s*\[/m;
  const arrMatch = runsArrRe.exec(src);
  if (!arrMatch) fail('Could not find RUNS array in runs.ts');

  const poolDef = `// ─────────────────────────────────────────────────────────────────────────────
// Run — Candidate Pool. Auto-populated by scripts/run-playtest/promote.ts.
// Levels here are promoted candidates pending curation into themed runs.

const RUN_CANDIDATE_POOL: RunDef = {
  id: 'candidate-pool',
  name: 'Candidate Pool',
  blurb: 'Promoted candidate levels awaiting curation.',
  levels: [
${builderSrc}
  ],
};

`;

  // Insert RUN_CANDIDATE_POOL before the RUNS export. Also add it to the
  // array (last entry).
  const insertAt = arrMatch.index;
  const newSrc1 = src.slice(0, insertAt) + poolDef + src.slice(insertAt);

  // Now patch the RUNS array — append RUN_CANDIDATE_POOL before the closing `];`.
  const runsArrCloseRe = /(\n\s*RUN_GAUNTLET,\s*\n)(\];)/m;
  const closeMatch = runsArrCloseRe.exec(newSrc1);
  let newSrc2: string;
  if (closeMatch) {
    newSrc2 =
      newSrc1.slice(0, closeMatch.index) +
      closeMatch[1] +
      '  RUN_CANDIDATE_POOL,\n' +
      closeMatch[2] +
      newSrc1.slice(closeMatch.index + closeMatch[0].length);
  } else {
    // Fall back: insert before `];` whatever comes last.
    const fallback = /(\n\];\s*\n\s*export\s+const\s+DEFAULT_RUN_ID)/m.exec(newSrc1);
    if (!fallback) fail('Could not patch RUNS array — please add RUN_CANDIDATE_POOL manually.');
    newSrc2 =
      newSrc1.slice(0, fallback.index) +
      '  RUN_CANDIDATE_POOL,\n];\n\nexport const DEFAULT_RUN_ID' +
      newSrc1.slice(fallback.index + fallback[0].length);
  }

  return { newSrc: newSrc2, targetRunId: 'candidate-pool' };
}

function promoteLevel(filePath: string, intoRunId: string | undefined): void {
  ok(`Loading candidate level: ${filePath}`);
  const raw = readJson<unknown>(filePath);
  if (!isCandidateLevel(raw)) {
    fail('File is not a CandidateLevel (missing candidate:true / puzzle / mutations / tierCurve).');
  }
  const c: CandidateLevel = raw;

  // ── Safety bar ───────────────────────────────────────────────────────────
  const { T3, T4, T5 } = c.tierCurve;
  ok(`Tier curve — T3 ${(T3 * 100).toFixed(0)}% · T4 ${(T4 * 100).toFixed(0)}% · T5 ${(T5 * 100).toFixed(0)}%`);
  if (typeof T5 !== 'number' || T5 < 0.70) {
    fail(`T5 win-rate ${(T5 * 100).toFixed(0)}% < 70% — level may be unsolvable for the strongest tier.`);
  }
  if (typeof T3 !== 'number' || T3 < 0.25 || T3 > 0.70) {
    fail(`T3 win-rate ${(T3 * 100).toFixed(0)}% outside fun-hard zone [25, 70].`);
  }
  if (!Array.isArray(c.mutations) || c.mutations.length === 0) {
    fail('No mutations applied — refusing trivial promotion.');
  }
  ok(`${c.mutations.length} mutation(s) applied: ${c.mutations.map((m: LevelMutation) => m.kind).join(', ')}`);

  // ── Duplicate check ──────────────────────────────────────────────────────
  const incomingSig = puzzleSignature(c.puzzle);
  const runsSrc = fs.readFileSync(RUNS_TS, 'utf8');
  const dailySrc = fs.readFileSync(DAILY_LEVELS_TS, 'utf8');
  const existingSigs = new Set<string>([
    ...extractSignaturesFromSource(runsSrc),
    ...extractSignaturesFromSource(dailySrc),
  ]);
  if (existingSigs.has(incomingSig)) {
    fail('Duplicate level — identical pieces/hazards/moveLimit signature already in runs.ts or daily-levels.ts.');
  }
  ok('Duplicate check passed.');

  // ── Generate builder & patch runs.ts ─────────────────────────────────────
  const builderSrc = renderBuilderCall(c.puzzle.level, c.puzzle);
  const { newSrc, targetRunId } = appendCandidateToRuns(runsSrc, builderSrc, intoRunId);
  fs.writeFileSync(RUNS_TS, newSrc, 'utf8');
  ok(`Patched lib/run/runs.ts — appended to run "${targetRunId}".`);

  // ── Move candidate JSON to promoted-levels/YYYY-MM-DD/ ───────────────────
  const today = new Date().toISOString().slice(0, 10);
  const destDir = path.join(PROMOTED_LEVELS_DIR, today);
  fs.mkdirSync(destDir, { recursive: true });
  const destFile = path.join(destDir, path.basename(path.dirname(filePath)) + '__' + path.basename(filePath));
  fs.renameSync(filePath, destFile);
  ok(`Moved candidate to ${path.relative(REPO_ROOT, destFile)}`);

  console.log('');
  console.log('Summary:');
  console.log(`  Run:       ${targetRunId}`);
  console.log(`  Level:     ${c.puzzle.level}`);
  console.log(`  Pieces:    ${c.puzzle.pieces.length}`);
  console.log(`  Hazards:   ${c.puzzle.hazards?.length ?? 0}`);
  console.log(`  MoveLimit: ${c.puzzle.moveLimit ?? '—'}`);
  console.log(`  TierCurve: T3=${(T3 * 100).toFixed(0)}% · T4=${(T4 * 100).toFixed(0)}% · T5=${(T5 * 100).toFixed(0)}%`);
}

// ── ABILITY PROMOTION (stub) ────────────────────────────────────────────────

function promoteAbility(filePath: string): void {
  ok(`Loading candidate ability: ${filePath}`);
  const raw = readJson<unknown>(filePath);
  if (!isCandidateAbility(raw)) {
    fail('File is not a CandidateAbility (missing candidate:true / id / name / activation / blurbs).');
  }
  const c: CandidateAbility = raw;

  // ── Safety bar ───────────────────────────────────────────────────────────
  if ((ALL_ABILITY_IDS as string[]).includes(c.id)) {
    fail(`Ability id "${c.id}" already exists in lib/run/abilities.ts.`);
  }
  // blurbs may be keyed numerically or as strings — normalize.
  const tiers: number[] = [1, 2, 3, 4, 5];
  for (const t of tiers) {
    const v =
      (c.blurbs as Record<string | number, string | undefined>)[t] ??
      (c.blurbs as Record<string | number, string | undefined>)[String(t)];
    if (typeof v !== 'string' || v.trim().length === 0) {
      fail(`Missing or empty blurb for tier ${t}.`);
    }
  }
  if (!c.mechanics) {
    fail(
      'No mechanics hint provided. Ability promotion requires a mechanics:{kind, params} block describing the engine logic. Wire the engine in lib/run/abilities.ts before promoting.',
    );
  }
  ok('Safety bar passed.');

  // ── Generate skeleton patch ──────────────────────────────────────────────
  fs.mkdirSync(PROMOTED_ABILITIES_DIR, { recursive: true });
  const patchFile = path.join(PROMOTED_ABILITIES_DIR, `${c.id}.patch`);

  const blurbCases: string[] = tiers
    .map((t) => {
      const v =
        (c.blurbs as Record<string | number, string>)[t] ??
        (c.blurbs as Record<string | number, string>)[String(t)];
      const safe = v.replace(/'/g, "\\'");
      if (t === 5) return `      return '${safe}';`;
      return `      if (tier === ${t}) return '${safe}';`;
    })
    .reverse(); // higher tiers first, matching the existing switch style

  const patch = `# Ability promotion skeleton — ${c.id}
# Generated by scripts/run-playtest/promote.ts on ${new Date().toISOString()}
#
# Ability promotion is NOT YET AUTOMATED. This file documents the edits an
# engineer needs to make to lib/run/abilities.ts to wire this candidate into
# the engine. Once those edits land, re-run the promote script with --commit
# to record the promotion.

## Step 1 — Add to AbilityId union (lib/run/abilities.ts, line ~15)
| '${c.id}'

## Step 2 — Add to ABILITY_DEFS (lib/run/abilities.ts, line ~61)
'${c.id}': {
  id: '${c.id}',
  name: ${JSON.stringify(c.name)},
  activation: '${c.activation}',
  typeLine: ${JSON.stringify(c.typeLine)},
  description: ${JSON.stringify(c.description)},
},

## Step 3 — Add to maxUsesForTier switch (line ~142)
case '${c.id}':
  // TODO: per-tier uses per level. -1 = unlimited.
  return 1;

## Step 4 — Add to blurbForTier switch (line ~213)
case '${c.id}':
${blurbCases.join('\n')}

## Step 5 — Engine wiring (mechanics)
# Mechanics hint:
${JSON.stringify(c.mechanics, null, 2)
  .split('\n')
  .map((l) => `#   ${l}`)
  .join('\n')}
#
# Implement the resolution path in applyAbilityActivate / applyAbilityMove
# / applyAbilityTargeted depending on activation. Add legal-moves logic to
# abilityLegalMoves if movement-style.
`;

  fs.writeFileSync(patchFile, patch, 'utf8');
  console.log('');
  console.log('Ability promotion not yet automated; requires engine logic in lib/run/abilities.ts.');
  console.log(`Generated TypeScript skeleton at ${path.relative(REPO_ROOT, patchFile)}.`);
  console.log('Review the patch, hand-port the edits, then re-run the promote script.');
}

// ── main ────────────────────────────────────────────────────────────────────
function main(): void {
  const args = parseArgs(process.argv);
  if (args.kind === 'level') {
    promoteLevel(args.filePath, args.intoRunId);
  } else {
    promoteAbility(args.filePath);
  }
}

main();
