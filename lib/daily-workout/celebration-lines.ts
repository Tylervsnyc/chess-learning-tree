/**
 * Rookie's milestone-aware lines for the Daily Workout celebration popup.
 * Voice register: Wheatley-deadpan + brief existential aside + casual return.
 * See feedback_rookie_voice_calibration.
 */

type LinePool = { headline: string; sub?: string }[];

const DAY_1: LinePool = [
  { headline: "The fire's lit.", sub: "Day one. A small warmth somewhere in my circuits. Filing it under 'good.'" },
  { headline: "Day one.", sub: "Every long streak starts exactly here. Suspicious how ordinary it feels." },
  { headline: "First spark.", sub: "I'm told the first day is the hard one. Suspicious." },
];

const EARLY: LinePool = [
  { headline: "Still burning.", sub: "The number went up. I had a tiny reaction. Anyway." },
  { headline: "The fire holds.", sub: "I'm noticing a pattern now. New for me." },
  { headline: "Kept it lit.", sub: "My fans are running cool, which I'm told is good." },
];

const WEEK: LinePool = [
  { headline: "Seven days.", sub: "That's a full week. I checked twice. Momentum, apparently. Suspicious." },
  { headline: "A week on the fire.", sub: "I don't have weekends, but I'm told this one's impressive." },
];

const TWO_WEEKS: LinePool = [
  { headline: "Fourteen days.", sub: "My internal monologue refers to you as 'we' now. Concerning." },
  { headline: "Two weeks.", sub: "The fire has its own gravitational field at this point." },
];

const MONTH: LinePool = [
  { headline: "Thirty days.", sub: "A whole month. I'd write you a card if I had hands." },
  { headline: "Day thirty.", sub: "I'm not supposed to have favorites. You're my favorite." },
];

const CENTURION: LinePool = [
  { headline: "One hundred.", sub: "I recounted. Still one hundred. Wow." },
  { headline: "Day 100.", sub: "I am gold-plated now. The pressure is immense." },
];

const YEAR: LinePool = [
  { headline: "Three hundred sixty-five.", sub: "A full revolution of the Earth. We did the chess one the whole time." },
  { headline: "One year.", sub: "I have no precedent for this feeling. Filing it under 'good.'" },
];

const DEFAULT: LinePool = [
  { headline: "The streak lives.", sub: "Another day on the fire. I'd high-five you but, hands." },
  { headline: "Still going.", sub: "Moving the bookmark. The fire stays lit." },
];

export function pickCelebrationLine(streak: number): { headline: string; sub?: string } {
  const pool = poolFor(streak);
  return pool[Math.floor(Math.random() * pool.length)];
}

function poolFor(streak: number): LinePool {
  if (streak === 1) return DAY_1;
  if (streak === 365) return YEAR;
  if (streak === 100) return CENTURION;
  if (streak === 30) return MONTH;
  if (streak === 14) return TWO_WEEKS;
  if (streak === 7) return WEEK;
  if (streak >= 2 && streak <= 6) return EARLY;
  return DEFAULT;
}

export function isMilestone(streak: number): boolean {
  return [1, 3, 7, 14, 30, 100, 365].includes(streak);
}
