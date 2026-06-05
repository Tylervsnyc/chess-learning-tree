/**
 * T5 — Expert. MCTS-rollouts with the biggest budget.
 *
 * Replaces the prior 3-ply minimax (T5_V01) wrapper. The old v0.1/v0.2
 * benchmark files still reference T5_V01 from t5-v01.ts; that file is
 * left in place so benchmarks keep working.
 */

import { createMctsBot } from './mcts';
import type { Bot } from '../types';

export const T5: Bot = createMctsBot({
  id: 'T5',
  name: 'T5 Expert (MCTS-160)',
  rolloutCount: 160,
});
