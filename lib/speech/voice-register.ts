// Voice register classifier — the single source of truth for which Rookie
// lines may be made more encouraging vs which are FROZEN (her mood / sore-loser
// register). Imported by the re-voicing pipeline (scripts/rookie-voice/*) AND
// the voice lint, so the freeze boundary is defined in exactly one place.
//
// See .claude/rookie-voice-bible.md and CHE-371.

import type { SpeechLine, LineConditions } from '@/lib/speech/priority-queue';

/**
 * A line is FROZEN — left exactly as authored — when it belongs to Rookie's
 * mood / sore-loser register. That's either:
 *   - tone 'spicy' (the grudging, trash-talky, red-meltdown register), OR
 *   - an evalMood line for when SHE is losing ('losing' or 'desperate').
 *
 * These carry Rookie's moods and the part Tyler explicitly wants preserved.
 * Everything else is eligible to be warmed up / made more encouraging.
 */
export function isFrozen(line: Pick<SpeechLine, 'conditions'>): boolean {
  const c: LineConditions | undefined = line.conditions;
  if (!c) return false;
  if (c.tone === 'spicy') return true;
  if (c.evalMoods && (c.evalMoods.includes('losing') || c.evalMoods.includes('desperate'))) {
    return true;
  }
  return false;
}

export type Register = 'frozen' | 'proud' | 'warm';

/**
 * The encouragement register for an eligible line, used to calibrate the
 * rewrite so we don't flatten her moods:
 *   - 'frozen' → do not touch (mood / sore-loser).
 *   - 'proud'  → Rookie is winning/ahead: proud, excited, a little smug-but-warm.
 *   - 'warm'   → even or moodless: warm, rooting-for-you, keep her wit.
 */
export function register(line: Pick<SpeechLine, 'conditions'>): Register {
  if (isFrozen(line)) return 'frozen';
  const moods = line.conditions?.evalMoods;
  if (moods && moods.includes('winning')) return 'proud';
  return 'warm';
}

/** Human-readable description of a line's firing context, for the rewriter prompt. */
export function describeContext(line: Pick<SpeechLine, 'conditions' | 'category'>): string {
  const parts: string[] = [];
  const c = line.conditions;
  if (line.category) parts.push(`category ${line.category}`);
  if (c?.events?.length) parts.push(`event: ${c.events.join('/')}`);
  if (c?.beats?.length) parts.push(`beat: ${c.beats.join('/')}`);
  if (c?.evalMoods?.length) parts.push(`Rookie is ${c.evalMoods.join('/')}`);
  if (c?.movedBy) parts.push(`${c.movedBy} just moved`);
  if (c?.movedPiece) parts.push(`piece: ${c.movedPiece}`);
  if (c?.tone) parts.push(`tone: ${c.tone}`);
  if (c?.timeOfDay) parts.push(`time: ${c.timeOfDay}`);
  return parts.length ? parts.join(', ') : 'general / any context';
}
