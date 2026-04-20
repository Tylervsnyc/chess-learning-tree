// Unified selection facade over QUIP_POOL.
// Thin wrapper around priority-queue's selectLine / selectByCategory — no new logic.

import {
  selectLine as baseSelectLine,
  selectByCategory as baseSelectByCategory,
  type QueueContext,
  type QueueState,
  type SpeechLine,
} from '@/lib/speech/priority-queue';
import { QUIP_POOL } from '@/lib/quips/quip-pool';

/** Select a game-context quip from the unified pool. */
export function selectQuip(
  context: QueueContext,
  state: QueueState,
): { line: SpeechLine; text: string; templateText: string } | null {
  return baseSelectLine(QUIP_POOL, context, state);
}

/** Select by category from the unified pool. Supports prefix matching. */
export function selectQuipByCategory(
  category: string,
  state?: QueueState,
  playerName?: string,
  substitutions?: Partial<QueueContext>,
): { line: SpeechLine; text: string } | null {
  return baseSelectByCategory(QUIP_POOL, category, state, playerName, substitutions);
}
