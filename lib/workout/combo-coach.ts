/**
 * Combo Coach (WORKOUT_COMBO_CALLS): Rookie calls boxing combos during the
 * exercise segments of the Chess Boxing workout — the standard number system
 * (1 jab … 6 rear uppercut) plus slips and rolls — randomized each call so the
 * user reacts instead of memorizing a script.
 *
 * Curriculum (Duolingo for punches): moves unlock over COMPLETED workout
 * sessions, tracked by a localStorage counter bumped once per finished session
 * (bumpComboSessions, called from the workout finish path). The first exercise
 * segment after an unlock opens with a short Rookie teach clip explaining the
 * new move.
 *
 * Audio: pre-generated Rookie voice clips in public/audio/combo-coach/
 * (scripts/generate-combo-voice.ts). One clip per atomic move ("one", "slip")
 * so any combo can be composed client-side; plus teach + hype clips.
 */

export interface ComboMove {
  /** Clip id + stable key ("one" … "six", "slip", "roll"). */
  id: string;
  /** What the big visual cue shows ("1", "SLIP"). */
  cue: string;
  /** Small label under the cue ("JAB"). */
  name: string;
}

export const MOVES: Record<string, ComboMove> = {
  one: { id: 'one', cue: '1', name: 'JAB' },
  two: { id: 'two', cue: '2', name: 'CROSS' },
  three: { id: 'three', cue: '3', name: 'L HOOK' },
  four: { id: 'four', cue: '4', name: 'R HOOK' },
  five: { id: 'five', cue: '5', name: 'L UPPER' },
  six: { id: 'six', cue: '6', name: 'R UPPER' },
  slip: { id: 'slip', cue: 'SLIP', name: 'DIP' },
  roll: { id: 'roll', cue: 'ROLL', name: 'UNDER' },
};

export interface ComboLevel {
  /** Completed sessions needed to unlock this level. */
  sessions: number;
  /** Move ids introduced at this level. */
  unlocks: string[];
  /** Teach clip id played the first segment at this level. */
  teachClip: string;
  /** Card copy shown while the teach clip plays. */
  teachTitle: string;
  teachText: string;
  /** Combos ADDED at this level (drawn cumulatively with earlier levels). */
  combos: string[][];
}

// Real boxing combos only — every sequence here is a standard pad combination.
export const CURRICULUM: ComboLevel[] = [
  {
    sessions: 0,
    unlocks: ['one', 'two'],
    teachClip: 'teach-1-2',
    teachTitle: 'The jab and the cross',
    teachText:
      'Boxers number their punches. 1 = jab (lead hand, straight). 2 = cross (power hand). Rookie calls the numbers — you throw them.',
    combos: [['one'], ['one', 'two'], ['one', 'one'], ['one', 'one', 'two'], ['two']],
  },
  {
    sessions: 1,
    unlocks: ['three'],
    teachClip: 'teach-3',
    teachTitle: 'The lead hook',
    teachText: '3 = lead hook. Swing your front hand around like you are slamming a door.',
    combos: [
      ['one', 'two', 'three'],
      ['two', 'three'],
      ['three'],
      ['one', 'two', 'three', 'two'],
    ],
  },
  {
    sessions: 2,
    unlocks: ['four'],
    teachClip: 'teach-4',
    teachTitle: 'The rear hook',
    teachText: '4 = rear hook. Same door, other hand — turn your hips into it.',
    combos: [
      ['three', 'four'],
      ['one', 'two', 'three', 'four'],
      ['two', 'three', 'two'],
      ['one', 'four'],
    ],
  },
  {
    sessions: 3,
    unlocks: ['five', 'six'],
    teachClip: 'teach-5-6',
    teachTitle: 'The uppercuts',
    teachText:
      '5 = lead uppercut, 6 = rear uppercut. Drop the hand and drive up, like lifting a piece off the board.',
    combos: [
      ['one', 'two', 'five'],
      ['five', 'two'],
      ['six', 'three'],
      ['one', 'six', 'three'],
      ['two', 'five', 'two'],
    ],
  },
  {
    sessions: 5,
    unlocks: ['slip'],
    teachClip: 'teach-slip',
    teachTitle: 'The slip',
    teachText:
      'Defense. On SLIP, bend your knees and dip your head off the line. A punch you are not there for is a punch that missed.',
    combos: [
      ['one', 'two', 'slip'],
      ['slip', 'two'],
      ['one', 'slip', 'two'],
      ['slip', 'three'],
    ],
  },
  {
    sessions: 7,
    unlocks: ['roll'],
    teachClip: 'teach-roll',
    teachTitle: 'The roll',
    teachText:
      'On ROLL, sink under the punch and come up on the other side. Smooth, like a rook sliding behind a pawn.',
    combos: [
      ['one', 'two', 'roll'],
      ['roll', 'three'],
      ['two', 'three', 'roll', 'three'],
      ['one', 'two', 'roll', 'two'],
    ],
  },
];

const SESSIONS_KEY = 'cp_combo_sessions';
const TEACH_SEEN_KEY = 'cp_combo_teach_seen';
export const MUTE_KEY = 'cp_combo_muted';

export function comboSessionCount(): number {
  if (typeof window === 'undefined') return 0;
  const n = parseInt(window.localStorage.getItem(SESSIONS_KEY) || '0', 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Bump once per FINISHED workout session (idempotence guarded by caller). */
export function bumpComboSessions(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSIONS_KEY, String(comboSessionCount() + 1));
}

/** Highest curriculum index unlocked at this session count. */
export function levelIndexForSessions(sessions: number): number {
  let idx = 0;
  for (let i = 0; i < CURRICULUM.length; i++) {
    if (sessions >= CURRICULUM[i].sessions) idx = i;
  }
  return idx;
}

/** The level whose teach clip hasn't played yet, if any (lowest first). */
export function pendingTeachLevel(): ComboLevel | null {
  if (typeof window === 'undefined') return null;
  const maxIdx = levelIndexForSessions(comboSessionCount());
  const seen = new Set(
    (window.localStorage.getItem(TEACH_SEEN_KEY) || '').split(',').filter(Boolean),
  );
  for (let i = 0; i <= maxIdx; i++) {
    if (!seen.has(CURRICULUM[i].teachClip)) return CURRICULUM[i];
  }
  return null;
}

export function markTeachSeen(teachClip: string): void {
  if (typeof window === 'undefined') return;
  const seen = (window.localStorage.getItem(TEACH_SEEN_KEY) || '')
    .split(',')
    .filter(Boolean);
  if (!seen.includes(teachClip)) {
    seen.push(teachClip);
    window.localStorage.setItem(TEACH_SEEN_KEY, seen.join(','));
  }
}

/** All moves unlocked at a level index (for the legend UI). */
export function unlockedMoves(levelIdx: number): ComboMove[] {
  const out: ComboMove[] = [];
  for (let i = 0; i <= levelIdx && i < CURRICULUM.length; i++) {
    for (const id of CURRICULUM[i].unlocks) out.push(MOVES[id]);
  }
  return out;
}

/**
 * Pick the next combo. Draw pool is cumulative up to levelIdx, weighted toward
 * the newest level's combos (they appear twice) so fresh material gets reps.
 * Never repeats the immediately previous combo.
 */
export function pickCombo(levelIdx: number, prev: string[] | null): string[] {
  const pool: string[][] = [];
  for (let i = 0; i <= levelIdx && i < CURRICULUM.length; i++) {
    pool.push(...CURRICULUM[i].combos);
    if (i === levelIdx) pool.push(...CURRICULUM[i].combos);
  }
  for (let attempt = 0; attempt < 10; attempt++) {
    const combo = pool[Math.floor(Math.random() * pool.length)];
    if (!prev || combo.join('-') !== prev.join('-')) return combo;
  }
  return pool[0];
}

/**
 * Rest between combos, ramping from a gentle opener to fight pace over the
 * segment (elapsed01 = fraction of the segment elapsed, 0..1).
 */
export function comboGapMs(elapsed01: number): number {
  const start = 4200;
  const end = 2400;
  return Math.round(start + (end - start) * Math.min(1, Math.max(0, elapsed01)));
}

/** Clip URL for an atomic move / teach / hype clip id. */
export function clipUrl(id: string): string {
  return `/audio/combo-coach/${id}.mp3`;
}

export const HYPE_CLIPS = ['hype1', 'hype2', 'hype3'];
export const ROUND_START_CLIP = 'handsup';
