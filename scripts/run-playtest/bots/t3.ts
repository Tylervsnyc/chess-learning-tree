/**
 * T3 — Casual. MCTS-rollouts with a low budget.
 *
 * `settleEnemyTurns` is still exported here because simulate.ts and the
 * t4/t5 bots import it from this module. Keep that helper here even though
 * the bot itself is now factory-built.
 */

import { stepEnemyTurn } from '../../../lib/run/pawn-ai';
import type { BoardState } from '../../../lib/run/types';
import { createMctsBot } from './mcts';
import type { Bot } from '../types';

export const T3: Bot = createMctsBot({
  id: 'T3',
  name: 'T3 Casual (MCTS-40)',
  rolloutCount: 40,
});

/** Resolve enemy turns until control returns to Rookie (or game ends). */
export function settleEnemyTurns(state: BoardState): BoardState {
  let s = state;
  let guard = 0;
  while (s.status === 'playing' && s.turn === 'enemy' && guard < 64) {
    const next = stepEnemyTurn(s);
    if (next === s) break;
    s = next;
    guard++;
  }
  return s;
}
