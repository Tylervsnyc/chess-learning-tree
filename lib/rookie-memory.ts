import type { SpeechMemory } from '@/lib/speech/memory';

export interface HonchoPlayerSummary {
  raw: string | null;
  profile: string[];
  recentPatterns: string[];
  openings: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface RookieMemoryContext {
  usedRecently: string[];
  playerFacts: string[];
  /** Last few LLM-generated opening + game-end lines, so Rookie doesn't repeat herself. */
  recentLines: string[];
  gamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  honchoSummary: HonchoPlayerSummary | null;
  lastGameContext: string | null;
  /** Broad representation from session.context() — summaries + conclusions + peer card */
  honchoRepresentation: string | null;
}

export const EMPTY_HONCHO_SUMMARY: HonchoPlayerSummary = {
  raw: null,
  profile: [],
  recentPatterns: [],
  openings: [],
  strengths: [],
  weaknesses: [],
};

export const EMPTY_ROOKIE_MEMORY: RookieMemoryContext = {
  usedRecently: [],
  playerFacts: [],
  recentLines: [],
  gamesPlayed: 0,
  totalWins: 0,
  totalLosses: 0,
  totalDraws: 0,
  honchoSummary: null,
  lastGameContext: null,
  honchoRepresentation: null,
};

export function buildRookieMemoryContext(input?: {
  speechMemory?: SpeechMemory | null;
  honchoSummary?: HonchoPlayerSummary | null;
  lastGameContext?: string | null;
  honchoRepresentation?: string | null;
}): RookieMemoryContext {
  const speechMemory = input?.speechMemory;

  return {
    usedRecently: speechMemory?.usedRecently ?? [],
    playerFacts: speechMemory?.playerFacts ?? [],
    recentLines: speechMemory?.recentLines ?? [],
    gamesPlayed: speechMemory?.gamesPlayed ?? 0,
    totalWins: speechMemory?.totalWins ?? 0,
    totalLosses: speechMemory?.totalLosses ?? 0,
    totalDraws: speechMemory?.totalDraws ?? 0,
    honchoSummary: input?.honchoSummary ?? null,
    lastGameContext: input?.lastGameContext ?? null,
    honchoRepresentation: input?.honchoRepresentation ?? null,
  };
}

export function toSpeechMemory(memory: RookieMemoryContext): SpeechMemory {
  return {
    usedRecently: memory.usedRecently,
    playerFacts: memory.playerFacts,
    recentLines: memory.recentLines,
    gamesPlayed: memory.gamesPlayed,
    totalWins: memory.totalWins,
    totalLosses: memory.totalLosses,
    totalDraws: memory.totalDraws,
  };
}

export function updateRookieMemoryContext(
  memory: RookieMemoryContext,
  updates: Partial<RookieMemoryContext>,
): RookieMemoryContext {
  return {
    ...memory,
    ...updates,
  };
}

function appendSection(lines: string[], label: string, items: string[]) {
  if (items.length === 0) return;
  lines.push(`${label}:`);
  items.forEach((item) => lines.push(`- ${item}`));
}

export function formatHonchoSummaryForPrompt(summary: HonchoPlayerSummary | null): string | null {
  if (!summary) return null;

  const lines: string[] = [];
  appendSection(lines, 'Stable traits', summary.profile);
  appendSection(lines, 'Recent patterns', summary.recentPatterns);
  appendSection(lines, 'Openings', summary.openings);
  appendSection(lines, 'Strengths', summary.strengths);
  appendSection(lines, 'Weaknesses', summary.weaknesses);

  if (lines.length > 0) {
    return lines.join('\n');
  }

  return summary.raw;
}
