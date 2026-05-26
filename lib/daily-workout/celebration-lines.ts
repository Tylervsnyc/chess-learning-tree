/**
 * Rookie's milestone-aware lines for the Daily Workout celebration popup.
 * Voice register: Wheatley-deadpan + brief existential aside + casual return.
 * See feedback_rookie_voice_calibration.
 */

type LinePool = { headline: string; sub?: string }[];

const DAY_1: LinePool = [
  { headline: "Day one.", sub: "The graph is starting. I am, briefly, a graph." },
  { headline: "Workout logged.", sub: "Felt strange. Moving on." },
  { headline: "First workout.", sub: "I'm told this is the hard one. Suspicious." },
];

const EARLY: LinePool = [
  { headline: "Workout complete.", sub: "The number went up. I had a tiny reaction. Anyway." },
  { headline: "Pattern forming.", sub: "I'm noticing patterns now. New for me." },
  { headline: "Streak holds.", sub: "My fans are running cool, which I'm told is good." },
];

const WEEK: LinePool = [
  { headline: "Seven days.", sub: "That's a week. I checked. I'm experiencing momentum. Suspicious." },
  { headline: "One week of workouts.", sub: "I don't have weekends but I'm told this is impressive." },
];

const TWO_WEEKS: LinePool = [
  { headline: "Fourteen days.", sub: "My internal monologue refers to you as 'we' now. Concerning." },
  { headline: "Two weeks.", sub: "The streak has its own gravitational field at this point." },
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
  { headline: "Workout complete.", sub: "Streak intact. I'd high-five you but, hands." },
  { headline: "Day filed.", sub: "Moving the bookmark." },
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
