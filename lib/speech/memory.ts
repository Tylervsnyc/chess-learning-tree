/**
 * Speech Memory — persists Rookie's cross-game state to Supabase.
 *
 * Loads on game start, saves on game end. Two things persisted:
 * 1. usedRecently — line IDs that should be deprioritized (not blocked)
 * 2. playerFacts — discrete observations for Claude's opening line
 */

import { createClient } from '@/lib/supabase/client';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface SpeechMemory {
  usedRecently: string[];
  playerFacts: string[];
  gamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
}

const EMPTY_MEMORY: SpeechMemory = {
  usedRecently: [],
  playerFacts: [],
  gamesPlayed: 0,
  totalWins: 0,
  totalLosses: 0,
  totalDraws: 0,
};

// Cap usedRecently to avoid unbounded growth — keep last 200 line IDs
const MAX_USED_RECENTLY = 200;
// Cap player facts — keep most recent 20
const MAX_PLAYER_FACTS = 20;

// ════════════════════════════════
// LOAD
// ════════════════════════════════

/** Load speech memory for the current user. Returns empty memory if none exists. */
export async function loadSpeechMemory(userId: string): Promise<SpeechMemory> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('speech_memory')
    .select('used_recently, player_facts, games_played, total_wins, total_losses, total_draws')
    .eq('user_id', userId)
    .single();

  if (error || !data) return { ...EMPTY_MEMORY };

  return {
    usedRecently: (data.used_recently as string[]) ?? [],
    playerFacts: (data.player_facts as string[]) ?? [],
    gamesPlayed: data.games_played ?? 0,
    totalWins: data.total_wins ?? 0,
    totalLosses: data.total_losses ?? 0,
    totalDraws: data.total_draws ?? 0,
  };
}

// ════════════════════════════════
// SAVE
// ════════════════════════════════

/** Save speech memory after a game ends. Upserts — creates if first game. */
export async function saveSpeechMemory(
  userId: string,
  memory: SpeechMemory,
): Promise<void> {
  const supabase = createClient();

  // Trim to caps
  const usedRecently = memory.usedRecently.slice(-MAX_USED_RECENTLY);
  const playerFacts = memory.playerFacts.slice(-MAX_PLAYER_FACTS);

  const { error } = await supabase
    .from('speech_memory')
    .upsert(
      {
        user_id: userId,
        used_recently: usedRecently,
        player_facts: playerFacts,
        games_played: memory.gamesPlayed,
        total_wins: memory.totalWins,
        total_losses: memory.totalLosses,
        total_draws: memory.totalDraws,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

  if (error) console.error('Failed to save speech memory:', error);
}
