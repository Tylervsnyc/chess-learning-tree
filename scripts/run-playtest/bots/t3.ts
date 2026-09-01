/**
 * T3 — Casual. MCTS-rollouts with a low budget.
 *
 * `settleEnemyTurns` is still exported here because simulate.ts and the
 * t4/t5 bots import it from this module. Keep that helper here even though
 * the bot itself is now factory-built.
 */

import { stepEnemyTurn } from '../../../lib/run/pawn-ai';
import { stepAllyTurn, stepDroneTurn } from '../../../lib/run/abilities';
import type { BoardState } from '../../../lib/run/types';
import { createMctsBot } from './mcts';
import type { Bot } from '../types';

export const T3: Bot = createMctsBot({
  id: 'T3',
  name: 'T3 Casual (MCTS-40)',
  rolloutCount: 40,
});

/**
 * Resolve every non-Rookie phase until control returns to Rookie (or the game
 * ends). The engine hands off rookie → allies → enemy → rookie, and a Drones
 * cast inserts a 'drones' phase; the UI ticks each one step at a time. Before
 * 2026-08-15 this only stepped 'enemy', so any board with allies or drones
 * stalled on an un-steppable turn and was scored as a dead-end — every
 * Squad / Convert / Phalanx / Drones measurement was bogus.
 */
export function settleEnemyTurns(state: BoardState): BoardState {
  let s = state;
  let guard = 0;
  while (s.status === 'playing' && s.turn !== 'rookie' && guard < 256) {
    const next =
      s.turn === 'allies'
        ? stepAllyTurn(s)
        : s.turn === 'drones'
          ? stepDroneTurn(s)
          : stepEnemyTurn(s);
    if (next === s) break;
    s = next;
    guard++;
  }
  return s;
}
