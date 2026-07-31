// Canonical "difficult puzzle" cadence — ONE source of truth for both the
// renderer (scripts/render-daily-video.ts) and the poster (lib/ig-queue.ts).
// Difficult reels post 5 days/week — Mon(1), Tue(2), Thu(4), Fri(5), Sat(6).
// Wed(3) + Sun(0) stay normal for variety. See RULES.md §44.
export const DIFFICULT_DOW = new Set([1, 2, 4, 5, 6]);
