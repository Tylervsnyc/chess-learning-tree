// New York Knicks Finals celebration for the Play + Welcome screens.
//
// Game 4, 2026 NBA Finals (2026-06-10 @ MSG): the Knicks came back from 29
// down — the largest comeback in Finals history — to beat the Spurs 107-106 on
// OG Anunoby's tip-in with 1.2 seconds left. 3-1 series lead, one win from
// their first title since 1973.
//
// This runs for the REST OF THE FINALS (plus a buffer day): 2026-06-11 →
// 2026-06-19 ET. Worst case the series goes to a Game 7 (~6/18); if the Knicks
// clinch sooner, the orange-and-blue takeover just becomes a championship
// party — that's fine. Everything keyed off `isKnicksTime()` turns off on its
// own after the window, so there's nothing to revert. Set
// NEXT_PUBLIC_KNICKS_DAY=true to force it on, or adjust the dates below.

import type { RookBlock } from '@/lib/daily-rook-blocks';

/** Inclusive window the takeover is live (ET, YYYY-MM-DD). */
const KNICKS_START = '2026-06-11';
const KNICKS_END = '2026-06-14'; // Takeover ended early — back to normal (was 2026-06-19).

// Official New York Knicks palette.
export const KNICKS_BLUE = '#1D428A';
export const KNICKS_ORANGE = '#F58426';
export const KNICKS_SILVER = '#BEC0C2';

/** Today's date as YYYY-MM-DD in New York time. */
function todayInET(): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** True while the Knicks Finals takeover is live (ET), or when the flag is set. */
export function isKnicksTime(): boolean {
  if (process.env.NEXT_PUBLIC_KNICKS_DAY === 'true') return true;
  try {
    const today = todayInET();
    return today >= KNICKS_START && today <= KNICKS_END;
  } catch {
    return false;
  }
}

// Orange-and-blue takeover of Rookie's 22-block body. Same grid coordinates as
// ROOK_BLOCKS — blue base, orange crown + a checker of accents down the spine.
export const KNICKS_ROOK_BLOCKS: RookBlock[] = [
  // Row 0: Crown points — all orange
  { x: 0, y: 0, color: KNICKS_ORANGE },
  { x: 2, y: 0, color: KNICKS_ORANGE },
  { x: 4, y: 0, color: KNICKS_ORANGE },
  // Row 1: Crown rim — orange/blue alternating
  { x: 0, y: 1, color: KNICKS_BLUE },
  { x: 1, y: 1, color: KNICKS_ORANGE },
  { x: 2, y: 1, color: KNICKS_BLUE },
  { x: 3, y: 1, color: KNICKS_ORANGE },
  { x: 4, y: 1, color: KNICKS_BLUE },
  // Row 2: Head — blue with orange center
  { x: 1, y: 2, color: KNICKS_BLUE },
  { x: 2, y: 2, color: KNICKS_ORANGE },
  { x: 3, y: 2, color: KNICKS_BLUE },
  // Row 3: Neck — orange flanks, blue center
  { x: 1, y: 3, color: KNICKS_ORANGE },
  { x: 2, y: 3, color: KNICKS_BLUE },
  { x: 3, y: 3, color: KNICKS_ORANGE },
  // Row 4: Body — blue with orange center
  { x: 1, y: 4, color: KNICKS_BLUE },
  { x: 2, y: 4, color: KNICKS_ORANGE },
  { x: 3, y: 4, color: KNICKS_BLUE },
  // Row 5: Base — orange ends, blue body
  { x: 0, y: 5, color: KNICKS_ORANGE },
  { x: 1, y: 5, color: KNICKS_BLUE },
  { x: 2, y: 5, color: KNICKS_ORANGE },
  { x: 3, y: 5, color: KNICKS_BLUE },
  { x: 4, y: 5, color: KNICKS_ORANGE },
];
