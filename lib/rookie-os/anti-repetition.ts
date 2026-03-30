/**
 * Layer 5: Post-History Anti-Repetition Engine
 *
 * Dynamically builds instructions injected AFTER all chat history,
 * right before the LLM generates. This position has 20-30% more
 * impact than the system prompt due to LLM recency bias.
 *
 * Tracks: recent quips, response styles, length, catchphrases,
 * and suggests callbacks from the narrative state.
 *
 * @see CHE-188 https://linear.app/chesspathapp/issue/CHE-188
 */

import type { NarrativeStateFull } from './narrative-state';
import { getUsableCallbacks } from './narrative-state';
import type { RookieMood } from './types';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export type ResponseStyle =
  | 'empathetic_humor'
  | 'deadpan_shock'
  | 'coaching_pivot'
  | 'callback_contrast'
  | 'silent_acknowledgment'
  | 'genuine_excitement'
  | 'stunned_understatement'
  | 'statistical_awe'
  | 'narrative_momentum';

export type LengthCategory = 'short' | 'medium' | 'long';

interface QuipLogEntry {
  moveNumber: number;
  text: string;
  style: ResponseStyle | null;
  lengthCategory: LengthCategory;
}

/** Persistent state for the anti-repetition engine across a game */
export interface AntiRepetitionState {
  /** Last 8 quips Rookie has said this game */
  recentQuips: QuipLogEntry[];
  /** Which response styles have been used this game */
  usedStyles: ResponseStyle[];
  /** Number of "signature" catchphrases used this game */
  catchphraseCount: number;
  /** Max catchphrases allowed per game */
  catchphraseBudget: number;
  /** Length of last response */
  lastLength: LengthCategory | null;
  /** Consecutive same-length responses */
  consecutiveSameLength: number;
}

// ════════════════════════════════
// CREATION
// ════════════════════════════════

export function createAntiRepetitionState(): AntiRepetitionState {
  return {
    recentQuips: [],
    usedStyles: [],
    catchphraseCount: 0,
    catchphraseBudget: 2,
    lastLength: null,
    consecutiveSameLength: 0,
  };
}

// ════════════════════════════════
// CATCHPHRASE DETECTION
// ════════════════════════════════

/**
 * Rookie's signature phrases that should be used sparingly.
 * If she uses these every game, they lose their charm.
 */
const CATCHPHRASES = [
  'my circuits',
  'processing error',
  'filed under',
  'side project',
  'I don\'t have a face',
  'I was using that',
  'noted',
  'this is new',
  'I\'m working on it',
  'I felt something',
];

function containsCatchphrase(text: string): boolean {
  const lower = text.toLowerCase();
  return CATCHPHRASES.some(phrase => lower.includes(phrase));
}

// ════════════════════════════════
// LENGTH CLASSIFICATION
// ════════════════════════════════

function classifyLength(text: string): LengthCategory {
  const words = text.split(/\s+/).length;
  if (words <= 8) return 'short';
  if (words <= 25) return 'medium';
  return 'long';
}

// ════════════════════════════════
// STATE UPDATE (call after every Rookie response)
// ════════════════════════════════

export function logQuip(
  state: AntiRepetitionState,
  moveNumber: number,
  text: string,
  style: ResponseStyle | null,
): AntiRepetitionState {
  const lengthCategory = classifyLength(text);
  const hasCatchphrase = containsCatchphrase(text);

  const entry: QuipLogEntry = { moveNumber, text, style, lengthCategory };

  // Keep last 8 quips
  const recentQuips = [...state.recentQuips, entry].slice(-8);

  // Track styles
  const usedStyles = style
    ? [...new Set([...state.usedStyles, style])]
    : state.usedStyles;

  // Track catchphrases
  const catchphraseCount = hasCatchphrase
    ? state.catchphraseCount + 1
    : state.catchphraseCount;

  // Track length consistency
  const sameAsLast = state.lastLength === lengthCategory;
  const consecutiveSameLength = sameAsLast
    ? state.consecutiveSameLength + 1
    : 1;

  return {
    recentQuips,
    usedStyles,
    catchphraseCount,
    catchphraseBudget: state.catchphraseBudget,
    lastLength: lengthCategory,
    consecutiveSameLength,
  };
}

// ════════════════════════════════
// POST-HISTORY INSTRUCTION BUILDER
// ════════════════════════════════

const ALL_STYLES: ResponseStyle[] = [
  'empathetic_humor',
  'deadpan_shock',
  'coaching_pivot',
  'callback_contrast',
  'silent_acknowledgment',
  'genuine_excitement',
  'stunned_understatement',
  'statistical_awe',
  'narrative_momentum',
];

/**
 * Build the post-history instructions injected right before generation.
 * This is the "director's note" that shapes the response.
 */
export function buildPostHistoryInstructions(
  state: AntiRepetitionState,
  narrativeState: NarrativeStateFull,
  mood: RookieMood,
): string {
  const lines: string[] = ['[DIRECTION FOR THIS RESPONSE]'];

  // ── Recent quips (DO NOT reuse) ──
  if (state.recentQuips.length > 0) {
    lines.push('');
    lines.push('Recent quips this game (DO NOT reuse phrases, metaphors, or sentence structures):');
    for (const q of state.recentQuips.slice(-5)) {
      // Truncate long quips for token budget
      const preview = q.text.length > 60 ? q.text.slice(0, 60) + '...' : q.text;
      lines.push(`- Move ${q.moveNumber}: "${preview}"`);
    }
  }

  // ── Response style guidance ──
  const recentStyles = state.usedStyles.slice(-3);
  const availableStyles = ALL_STYLES.filter(s => !recentStyles.includes(s));
  if (recentStyles.length > 0 && availableStyles.length > 0) {
    lines.push('');
    const usedList = recentStyles.map(s => s.replace(/_/g, ' ')).join(', ');
    const availList = availableStyles.slice(0, 4).map(s => s.replace(/_/g, ' ')).join(', ');
    lines.push(`Style: Recently used [${usedList}]. Choose from: [${availList}].`);
  }

  // ── Length variation ──
  if (state.consecutiveSameLength >= 2 && state.lastLength) {
    lines.push('');
    const alternatives = (['short', 'medium', 'long'] as LengthCategory[])
      .filter(l => l !== state.lastLength);
    lines.push(`Length: Last ${state.consecutiveSameLength} responses were ${state.lastLength}. Make this one ${alternatives.join(' or ')}.`);
  }

  // ── Catchphrase budget ──
  if (state.catchphraseCount >= state.catchphraseBudget) {
    lines.push('');
    lines.push('Catchphrase budget SPENT. Do NOT use: "my circuits", "processing error", "side project", "I don\'t have a face", or similar signature phrases. Find new ways to express emotion.');
  } else {
    const remaining = state.catchphraseBudget - state.catchphraseCount;
    if (remaining === 1) {
      lines.push('');
      lines.push('Catchphrase budget: 1 remaining. Save it for a big moment.');
    }
  }

  // ── Callback suggestion ──
  const usableCallbacks = getUsableCallbacks(narrativeState);
  if (usableCallbacks.length > 0) {
    const best = usableCallbacks[usableCallbacks.length - 1]; // most recent
    lines.push('');
    lines.push(`Callback opportunity: Move ${best.moveNumber} — "${best.description}" (mood was ${best.mood}). Consider referencing if it connects to the current moment.`);
  }

  // ── Energy / emotional direction ──
  lines.push('');
  lines.push(`Energy: ${narrativeState.rookieEnergy}. Mood: ${mood}. ${narrativeState.playerMomentumDescription}`);

  // ── Core reminders (always last for maximum impact) ──
  lines.push('');
  lines.push('REMEMBER: You are Rookie. The Chess Briefing is ground truth. 1-2 sentences max. Silence ("...") is always valid. Write for voice.');

  return lines.join('\n');
}

// ════════════════════════════════
// INFERENCE PARAMETERS
// ════════════════════════════════

/**
 * Recommended Claude API parameters for narrative generation.
 * Higher temperature + penalties = more variety.
 */
export const NARRATIVE_INFERENCE_PARAMS = {
  temperature: 0.9,
  top_p: 0.9,
  max_tokens: 150, // default, overridden by decision gate
} as const;

/**
 * Get max_tokens based on the response type.
 * Short quips need fewer tokens, turning points get more room.
 */
export function getMaxTokens(responseType: 'short' | 'normal' | 'extended'): number {
  switch (responseType) {
    case 'short': return 50;
    case 'normal': return 150;
    case 'extended': return 300;
  }
}
