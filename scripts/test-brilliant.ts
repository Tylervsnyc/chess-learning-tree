/**
 * Brilliant-move detection tests. Run: npx tsx scripts/test-brilliant.ts
 */
import { Chess } from 'chess.js';
import { isBrilliant, isSacrifice, analyzeGameMoves, legendaryRulesForLevel, type PositionEval } from '../lib/game-eval';
import { applyBookMoves } from '../lib/review/book-moves';

let failed = 0;
function check(name: string, got: boolean, want: boolean) {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  (got ${got}, want ${want})`);
}
function after(fen: string, san: string) {
  const c = new Chess(fen);
  c.move(san);
  return c.fen();
}
const good = { winPercentDelta: 0, winPercentBefore: 60, winPercentAfter: 80 };

// 1a. Exchange sac: Rxe6 fxe6 — white gives R(5) for B(3), net -2.
const sacFen = '2r3k1/5ppp/4b3/8/8/8/5PPP/4R1K1 w - - 0 1';
const sacAfter = after(sacFen, 'Rxe6');
check('exchange sac Rxe6 is a sacrifice', isSacrifice(sacFen, sacAfter), true);
check('exchange sac Rxe6 is brilliant', isBrilliant({ fenBefore: sacFen, fenAfter: sacAfter, san: 'Rxe6', ...good }), true);

// 1b. Queen sac: Qg6 offers the queen to ...fxg6 (Rc8# follows) — sacrifice.
const qSacFen = '6k1/5p2/8/8/8/6Q1/7P/2R3K1 w - - 0 1';
const qSacAfter = after(qSacFen, 'Qg6');
check('queen offered on g6 (fxg6) is a sacrifice', isSacrifice(qSacFen, qSacAfter), true);
check('queen sac leading to mate is brilliant',
  isBrilliant({ fenBefore: qSacFen, fenAfter: qSacAfter, san: 'Qg6', winPercentDelta: 0, winPercentBefore: 70, winPercentAfter: 99 }), true);

// 2. Plain recapture: black just played ...Rxe1+, white answers Rxe1.
const recapFen = '6k1/8/8/8/8/8/4R3/4r1K1 w - - 0 1';
check('recapture on the same square as the opponent capture is not brilliant',
  isBrilliant({ fenBefore: recapFen, fenAfter: after(recapFen, 'Rxe1'), san: 'Rxe1', prevSan: 'Rxe1+', ...good }), false);

// 3. Hanging-piece blunder: Rc1 walks into ...Rxc1+ with a collapsed eval.
const hangFen = '2r3k1/8/8/8/8/8/8/R5K1 w - - 0 1';
const hangAfter = after(hangFen, 'Rc1');
check('hanging a rook has the sacrifice shape', isSacrifice(hangFen, hangAfter), true);
check('hanging a rook with a collapsed eval is NOT brilliant',
  isBrilliant({ fenBefore: hangFen, fenAfter: hangAfter, san: 'Rc1', winPercentDelta: 45, winPercentBefore: 55, winPercentAfter: 10 }), false);

// 4. Equal trade: Bxe6 fxe6 — B(3) for N(3), not a sac.
const tradeFen = '6k1/5p2/4n3/8/2B5/8/8/6K1 w - - 0 1';
const tradeAfter = after(tradeFen, 'Bxe6');
check('equal trade Bxe6 fxe6 is not a sacrifice', isSacrifice(tradeFen, tradeAfter), false);
check('equal trade is not brilliant', isBrilliant({ fenBefore: tradeFen, fenAfter: tradeAfter, san: 'Bxe6', ...good }), false);

// 4b. Defended piece "offered" but recapturable for equal value: not a sac.
const defFen = '6k1/8/8/3r4/8/8/3R4/3R2K1 w - - 0 1';
const defAfter = after(defFen, 'Rd4'); // ...Rxd4 Rxd4: rook for rook
check('trade offer with equal recapture is not a sacrifice', isSacrifice(defFen, defAfter), false);

// 5. Gates: already crushing / losing after / mate-for-mover / only move.
check('crushing before (wp 97) is not brilliant',
  isBrilliant({ fenBefore: sacFen, fenAfter: sacAfter, san: 'Rxe6', winPercentDelta: 0, winPercentBefore: 97, winPercentAfter: 98 }), false);
check('dead lost after (wp 5) is not brilliant',
  isBrilliant({ fenBefore: sacFen, fenAfter: sacAfter, san: 'Rxe6', winPercentDelta: 0, winPercentBefore: 8, winPercentAfter: 5 }), false);

// 5b. A piece that was ALREADY hanging is not a sacrifice this move made
// (Walker's "Legendary" king shuffles, 2026-09-21).
const alreadyHangFen = '6k1/8/8/5p2/1b6/8/3N4/6K1 w - - 0 1'; // Nd2 already en prise to Bb4
check('king move with a piece already hanging is not a sacrifice',
  isSacrifice(alreadyHangFen, after(alreadyHangFen, 'Kh2')), false);
// ...but moving the attacked piece onto ANOTHER attacked square still is.
check('moving an attacked knight onto a new attacked square is a sacrifice',
  isSacrifice(alreadyHangFen, after(alreadyHangFen, 'Ne4')), true);

// 5c. In check, only the moved piece can be the sac: a king step never is.
const checkFen = '4r1k1/8/8/8/8/8/3N4/4K3 w - - 0 1'; // Re8+ check, Nd2 otherwise safe
check('king escape from check is not a sacrifice', isSacrifice(checkFen, after(checkFen, 'Kf2')), false);

// 5d. Level scaling: 1.2 pawns worse than best is fine at L1, not at L10.
const cpSac = { fenBefore: sacFen, fenAfter: sacAfter, san: 'Rxe6', winPercentDelta: 3, winPercentBefore: 60, winPercentAfter: 57, cpLoss: 120 };
check('L1 tolerates a 120cp sac', isBrilliant(cpSac, legendaryRulesForLevel(1)), true);
check('L10 does not', isBrilliant(cpSac, legendaryRulesForLevel(10)), false);
check('mate-for-mover before is not brilliant',
  isBrilliant({ fenBefore: sacFen, fenAfter: sacAfter, san: 'Rxe6', evalBefore: { mate: 3 }, ...good }), false);
check('not near-best (delta 10) is not brilliant',
  isBrilliant({ fenBefore: sacFen, fenAfter: sacAfter, san: 'Rxe6', winPercentDelta: 10, winPercentBefore: 60, winPercentAfter: 50 }), false);
const onlyMoveFen = '7k/8/8/8/8/8/6q1/7K w - - 0 1'; // Kxg2 is the only legal move
check('only legal move is not brilliant',
  isBrilliant({ fenBefore: onlyMoveFen, fenAfter: after(onlyMoveFen, 'Kxg2'), san: 'Kxg2', ...good }), false);

// 6. analyzeGameMoves wiring.
const ev = (cp: number): PositionEval => ({ cp, mate: null, bestMove: null, bestLine: [], depth: 12 });
const ga = analyzeGameMoves([ev(50), ev(150)], [{ san: 'Rxe6', movedBy: 'player', moveNumber: 1, fenAfter: sacAfter }], 'white', sacFen);
check('analyzeGameMoves classifies the sac as brilliant', ga.moves[0].classification === 'brilliant', true);
check('analyzeGameMoves counts brilliantMoves', ga.brilliantMoves === 1, true);
const ga2 = analyzeGameMoves([ev(50), ev(150)], [{ san: 'Rxe6', movedBy: 'player', moveNumber: 1 }], 'white', sacFen);
check('without fenAfter it is never brilliant', ga2.moves[0].classification !== 'brilliant', true);

// 7. Book moves are never Legendary (Tyler, 2026-09-21).
{
  const scotch = ['e4', 'e5', 'Nf3', 'Nc6', 'd4'];
  const c = new Chess();
  const recs = scotch.map((san, i) => { c.move(san); return { san, movedBy: (i % 2 === 0 ? 'player' : 'rookie') as 'player' | 'rookie', moveNumber: i + 1, fenAfter: c.fen() }; });
  const fake = analyzeGameMoves(recs.map(() => ev(0)).concat([ev(0)]), recs, 'white');
  fake.moves[4].classification = 'brilliant';
  applyBookMoves(fake, scotch, 'white');
  check('a book move graded brilliant becomes book', fake.moves[4].classification === 'book', true);
  check('...and is not counted', fake.brilliantMoves === 0, true);
}

console.log(failed ? `\n${failed} FAILED` : '\nall passed');
process.exit(failed ? 1 : 0);
