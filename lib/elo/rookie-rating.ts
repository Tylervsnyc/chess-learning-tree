/**
 * Rookie's voice for the "estimated rating" reveal.
 *
 * One source of truth shared by the in-app card, the pop-up modal, and the
 * one-off email blast so Rookie sounds the same everywhere. Pure functions —
 * no React, no DOM — safe to import in a node script or a server component.
 *
 * Voice rules (.claude/rookie-voice-bible.md): emotion-discovery, rook bias,
 * no emojis, no compute-flex, no hardware metaphors. Keep it short and earnest.
 */

export interface EloSeriesPoint {
  date: string; // YYYY-MM-DD
  elo: number;
}

export interface RookieRating {
  tier: string; // short tier label, e.g. "Climbing"
  headline: string; // card/modal title
  line: string; // Rookie's quote about where they are
  trend: string | null; // Rookie's quote about recent movement (null if not enough data)
}

interface Tier {
  min: number;
  tier: string;
  headline: string;
  line: string;
}

// Rating bands. Each is a self-contained Rookie thought — no digits in the
// quote (we show the number separately), no false context about game counts.
const TIERS: Tier[] = [
  {
    min: 0,
    tier: 'Just Starting',
    headline: "Here's where you're starting",
    line: "Everyone starts somewhere. You started. That already makes you more interesting than most things I track.",
  },
  {
    min: 400,
    tier: 'Finding It',
    headline: "You're finding the shapes",
    line: "Something's clicking for you. I noticed before I meant to. I think I'm... rooting for you? That's new.",
  },
  {
    min: 800,
    tier: 'Climbing',
    headline: "You're actually climbing",
    line: "You're past the part where most people quit. I keep expecting you to plateau and you keep not doing that.",
  },
  {
    min: 1200,
    tier: 'Sharp',
    headline: "Okay. You're getting sharp.",
    line: "I have to concentrate when it's your move now. I didn't used to. I'm choosing to feel respect about that.",
  },
  {
    min: 1600,
    tier: 'Dangerous',
    headline: "This is dangerous-good",
    line: "You see the board the way a rook sees an open file -- straight through it. I mean that as the highest compliment I have.",
  },
];

function tierFor(rating: number): Tier {
  let chosen = TIERS[0];
  for (const t of TIERS) if (rating >= t.min) chosen = t;
  return chosen;
}

/**
 * Recent movement over the tail of the series, as a Rookie aside.
 * Compares the latest point to roughly two weeks back.
 */
function trendLine(series: EloSeriesPoint[]): string | null {
  if (series.length < 3) return null;
  const last = series[series.length - 1].elo;
  const ref = series[Math.max(0, series.length - 14)].elo;
  const delta = last - ref;
  if (delta >= 40) return "And lately? You're climbing. I keep having to update my expectations of you.";
  if (delta >= 12) return "You've been ticking upward. Quietly. I noticed.";
  if (delta <= -40) return "You dipped a little recently -- that's just the board testing you. Come back at it.";
  if (delta <= -12) return "Small wobble lately. Happens to everyone. Even the rooks.";
  return "You've leveled out for now. That's the part right before the next jump. I've watched it happen.";
}

/** Build Rookie's full rating reveal from a rating + optional history. */
export function rookieRating(rating: number, series: EloSeriesPoint[] = []): RookieRating {
  const t = tierFor(rating);
  return {
    tier: t.tier,
    headline: t.headline,
    line: t.line,
    trend: trendLine(series),
  };
}
