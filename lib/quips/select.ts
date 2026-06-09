// Unified selection facade over QUIP_POOL.
// Thin wrapper around priority-queue's selectLine / selectByCategory — no new logic.
//
// CHE-373: the pool is ~282KB of speech data, so it's loaded on demand via
// lib/quips/load-quip-pool (cached after the first call). That makes these
// selectors async — callers should show a hard-coded fallback if they need
// text before the pool resolves.

import {
  selectLine as baseSelectLine,
  selectByCategory as baseSelectByCategory,
  type QueueContext,
  type QueueState,
  type SpeechLine,
} from '@/lib/speech/priority-queue';
import { getQuipPool } from '@/lib/quips/load-quip-pool';

/** Select a game-context quip from the unified pool. */
export async function selectQuip(
  context: QueueContext,
  state: QueueState,
): Promise<{ line: SpeechLine; text: string; templateText: string } | null> {
  return baseSelectLine(await getQuipPool(), context, state);
}

/** Select by category from the unified pool. Supports prefix matching. */
export async function selectQuipByCategory(
  category: string,
  state?: QueueState,
  playerName?: string,
  substitutions?: Partial<QueueContext>,
): Promise<{ line: SpeechLine; text: string } | null> {
  return baseSelectByCategory(await getQuipPool(), category, state, playerName, substitutions);
}
