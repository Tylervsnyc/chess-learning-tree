/**
 * Boxing quips for the /play setup screen inside the Chess Boxing shell
 * (Tyler-approved set, 2026-08-07, from /test/play-boxing-bg). Rookie as an
 * over-invested cornerwoman: ≤2 sentences, no emojis, no context assumptions.
 *
 * Setup-screen pool only — pre-fight corner talk. The in-game registers
 * (captures, meltdown) live with the in-game quip system when we wire them.
 */
export const BOXING_PLAY_TAP_QUIPS = [
  'Hands up. Bishops too.',
  'Footwork. Knights are ALL footwork.',
  'Protect the chin. The chin is your king.',
  'Float like a bishop. Sting like a rook.',
  'I shadowboxed some pawns this morning. They won.',
  'Work the body. The body is the center squares.',
  'My corner told me to castle. I AM my corner.',
  'Keep the guard up — f7 is a glass jaw.',
  'The rook is my haymaker. She knows it. Everyone knows it.',
  'Ring the bell whenever. I was born ready. Mostly.',
  'Breathe between moves. I would, if I breathed.',
  'Southpaw opening. Bold. I respect it and I fear it.',
] as const;

/** Fallback bubble line before any speech/tap, boxing register. */
export const BOXING_PLAY_DEFAULT_LINE = 'Ring the bell whenever. I was born ready. Mostly.';
