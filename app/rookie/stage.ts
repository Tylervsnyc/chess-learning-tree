import type { RookieMood, AlarmVariant } from '@/lib/rookie-os/types';
import type { SpeechLine } from '@/lib/speech/priority-queue';
import type { RookBlock } from '@/lib/daily-rook-blocks';

export interface SayOptions {
  mood?: RookieMood;
  alarm?: AlarmVariant | null;
  sfx?: SpeechLine['sfx'];
}

/** What every chapter demo gets: a way to make the big stage Rookie talk and react. */
export interface Stage {
  /** Interrupt whatever she's saying and say this (optionally in a mood / with an SFX). */
  say: (text: string, opts?: SayOptions) => void;
  /** Change her look without speaking. */
  setLook: (mood: RookieMood, alarm?: AlarmVariant | null) => void;
  /** Re-color Rookie's 22 blocks one at a time, base to crown (null = her own colors). */
  dressUp: (blocks: RookBlock[] | null) => void;
  mood: RookieMood;
  /** Live 0–1 voice loudness (what drives the per-syllable pulse). */
  talkIntensity: number;
  isTalking: boolean;
}

/** Sore-loser lines live in the 282KB line pool — load it only when a chapter needs it. */
export async function loadSoreLoserLines(): Promise<SpeechLine[]> {
  const { AUTHORED_LINES } = await import('@/lib/speech/line-pool');
  return AUTHORED_LINES.filter((l) => l.id.startsWith('sore_loser'));
}
