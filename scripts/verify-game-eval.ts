/**
 * Sanity checks for lib/game-eval.ts move grading (no test framework in repo).
 * Run: npx tsx scripts/verify-game-eval.ts
 *
 * Covers the bugs behind "Nxf7 losing sac graded good":
 * - Lichess-scale thresholds (winning-chances 0.3/0.2/0.1 = 15/10/5 win% pts)
 * - a +0.3 → -2.5 pawn swing for the mover grades as a blunder
 * - null evals mark moves 'unknown', never 'good'
 * - startFen with black to move first keeps parity straight
 * - engine best-move SAN is surfaced
 * - checkmate move grades '#' even with no eval of the terminal position
 */
import {
  analyzeGameMoves,
  classifyMove,
  cpToWinningChances,
  type PositionEval,
} from '../lib/game-eval';

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures++;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const ev = (cp: number | null, mate: number | null = null, bestMove: string | null = null): PositionEval => ({
  cp, mate, bestMove, bestLine: [], depth: 14,
});

// ── Sigmoid sanity ──────────────────────────────────────────────
check('wc(0) = 0', Math.abs(cpToWinningChances(0)) < 1e-9);
check('wc capped at ±1000cp', cpToWinningChances(5000) === cpToWinningChances(1000));

// ── classifyMove thresholds (win% points, mover perspective) ────
check('16% drop = blunder', classifyMove(16, false) === 'blunder');
check('12% drop = mistake', classifyMove(12, false) === 'mistake');
check('6% drop = inaccuracy', classifyMove(6, false) === 'inaccuracy');
check('3% drop = good', classifyMove(3, false) === 'good');

// ── Nxf7-style swing: +0.3 before, -2.5 after (mover = white) ───
// Position evals are white-perspective. White plays a losing knight sac.
{
  const swing = analyzeGameMoves(
    [ev(30), ev(-250)],
    [{ san: 'Nxf7', movedBy: 'player', moveNumber: 1 }],
    'white',
  );
  check('losing sac (+0.3 → -2.5) = blunder', swing.moves[0].classification === 'blunder',
    `got ${swing.moves[0].classification} (delta ${swing.moves[0].winPercentDelta.toFixed(1)})`);
}

// ── Null evals → unknown, never good ────────────────────────────
{
  const a = analyzeGameMoves(
    [ev(null, null), ev(null, null), ev(10)],
    [
      { san: 'Nxf7', movedBy: 'player', moveNumber: 1 },
      { san: 'Kxf7', movedBy: 'rookie', moveNumber: 2 },
    ],
    'white',
  );
  check('move with no eval = unknown', a.moves[0].classification === 'unknown',
    `got ${a.moves[0].classification}`);
  check('move after null-eval position = unknown too', a.moves[1].classification === 'unknown',
    `got ${a.moves[1].classification}`);
  check('one entry per move (index alignment preserved)', a.moves.length === 2);
  check('unknown excluded from player accuracy', a.playerAccuracy === 0 && a.playerMoveCount === 0);
}
{
  // A hole in the middle (missing/null array entry) must not shift grading.
  const a = analyzeGameMoves(
    [ev(0), null, ev(0), ev(-300)],
    [
      { san: 'e4', movedBy: 'player', moveNumber: 1 },
      { san: 'e5', movedBy: 'rookie', moveNumber: 2 },
      { san: 'Qh5', movedBy: 'player', moveNumber: 3 },
    ],
    'white',
  );
  check('moves around a hole = unknown', a.moves[0].classification === 'unknown' && a.moves[1].classification === 'unknown');
  check('move after the hole still graded (blunder)', a.moves[2].classification === 'blunder',
    `got ${a.moves[2].classification}`);
}

// ── startFen parity: black moves first ──────────────────────────
{
  // After 1.e4, black to move. Black then blunders (eval goes from -30 to
  // +300, white perspective). With correct parity the mover is BLACK and it
  // grades a blunder; with the old i%2 logic the mover read as white and the
  // same move graded as a huge gain ("good").
  const afterE4 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
  const a = analyzeGameMoves(
    [ev(-30), ev(300)],
    [{ san: 'f6', movedBy: 'player', moveNumber: 1 }],
    'black',
    afterE4,
  );
  check('black-first startFen: losing move = blunder', a.moves[0].classification === 'blunder',
    `got ${a.moves[0].classification} (delta ${a.moves[0].winPercentDelta.toFixed(1)})`);
}

// ── Engine best move surfaced as SAN ────────────────────────────
{
  // Start position, engine best e2e4, player plays a3 and drops 12 win% pts.
  const a = analyzeGameMoves(
    [ev(20, null, 'e2e4'), ev(-230)],
    [{ san: 'a3', movedBy: 'player', moveNumber: 1, fenAfter: 'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1' }],
    'white',
  );
  check('bestMoveSan filled from engine bestmove', a.moves[0].bestMoveSan === 'e4',
    `got ${a.moves[0].bestMoveSan}`);
  check('bad move still graded despite bestMove present', a.moves[0].classification === 'blunder',
    `got ${a.moves[0].classification}`);
}
{
  // Playing the engine's best move counts as best even with a small delta.
  const a = analyzeGameMoves(
    [ev(20, null, 'e2e4'), ev(25)],
    [{ san: 'e4', movedBy: 'player', moveNumber: 1, fenAfter: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1' }],
    'white',
  );
  check('played engine best = good, bestMoveSan = own move',
    a.moves[0].classification === 'good' && a.moves[0].bestMoveSan === 'e4');
}

// ── Checkmate move with unevaluable terminal position ───────────
{
  const a = analyzeGameMoves(
    [ev(900), ev(null, null)],
    [{ san: 'Qf7#', movedBy: 'player', moveNumber: 1 }],
    'white',
  );
  check('mating move = checkmate (not unknown)', a.moves[0].classification === 'checkmate',
    `got ${a.moves[0].classification}`);
  check('mating move accuracy = 100', a.moves[0].accuracy === 100);
}

// ── Brilliant gate: ungradable move can never be brilliant ──────
{
  const a = analyzeGameMoves(
    [ev(null, null), ev(null, null)],
    [{
      san: 'Bxh7+', movedBy: 'player', moveNumber: 1,
      fenAfter: 'rnbqkb1r/ppppppnB/8/8/8/8/PPPPPPPP/RNBQK1NR b KQkq - 0 1',
    }],
    'white',
  );
  check('no eval → never brilliant', a.moves[0].classification === 'unknown',
    `got ${a.moves[0].classification}`);
}

console.log(failures === 0 ? '\nAll game-eval checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
