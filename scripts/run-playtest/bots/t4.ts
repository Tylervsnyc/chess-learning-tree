/**
 * T4 — Sharp. MCTS-rollouts with a mid budget.
 */

import { createMctsBot } from './mcts';
import type { Bot } from '../types';

export const T4: Bot = createMctsBot({
  id: 'T4',
  name: 'T4 Sharp (MCTS-80)',
  rolloutCount: 80,
});
