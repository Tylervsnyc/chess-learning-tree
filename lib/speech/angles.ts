// Post-game "angle" — the ONE thing Rookie chooses to dwell on this game.
// Picked client-side per game (like pickThread) so her recaps vary in what they
// notice, instead of always leading with the player's worst blunder.

export type PostGameAngle =
  | 'opening_choice'
  | 'turning_point'
  | 'endgame'
  | 'arc'
  | 'comeback'
  | 'her_feelings'
  | 'cool_move'
  | 'time_or_tempo'
  | 'a_piece';

interface AngleDef {
  id: PostGameAngle;
  /** Instruction injected into the prompt telling her what to notice this game. */
  lens: string;
}

const ANGLES: AngleDef[] = [
  { id: 'opening_choice', lens: "Comment mainly on the OPENING they chose and how it shaped the game — was it a fighting opening, a quiet one, a surprise?" },
  { id: 'turning_point',  lens: "Zero in on the ONE turning point — the move where the game tilted. Name it and say why it mattered." },
  { id: 'endgame',        lens: "Talk about the ENDGAME and how it finished — the technique, the final sequence, who converted." },
  { id: 'arc',            lens: "Tell the STORY of the whole game in two sentences — its shape, its arc, how it felt start to finish." },
  { id: 'comeback',       lens: "Frame it as a COMEBACK or a collapse — who was winning, who clawed back." },
  { id: 'her_feelings',   lens: "Make it about YOUR feelings — what this game stirred up in you. You're an AI discovering emotions; be honest and a little weird about it." },
  { id: 'cool_move',      lens: "Single out ONE genuinely cool move (theirs or yours) and geek out about it." },
  { id: 'time_or_tempo',  lens: "Comment on TEMPO and pace — fast and sharp, a long grind, a sudden flurry. The rhythm of the game." },
  { id: 'a_piece',        lens: "View the whole game through ONE piece — a heroic rook, a tragic bishop, a pawn that almost promoted. Lean into how you see that piece." },
];

const DEFAULT_LENS = ANGLES.find(a => a.id === 'arc')!.lens;

export interface PickAngleOpts {
  /** Was there a meaningful eval swing? Gates 'comeback' / 'turning_point'. */
  hadSwing?: boolean;
  /** Did the game reach an endgame (long enough)? Gates 'endgame'. */
  hadEndgame?: boolean;
  /** Were there brilliant moves? Gates 'cool_move'. */
  hadBrilliant?: boolean;
  /** Recent angle ids to avoid repeating back-to-back. */
  recentAngles?: PostGameAngle[];
}

/**
 * Pick a post-game angle. Filters out angles whose data doesn't exist
 * (no 'comeback' when nothing swung, etc.) and avoids the last few angles.
 */
export function pickAngle(opts?: PickAngleOpts): AngleDef {
  let pool = ANGLES;
  if (opts?.hadSwing === false) pool = pool.filter(a => a.id !== 'comeback' && a.id !== 'turning_point');
  if (opts?.hadEndgame === false) pool = pool.filter(a => a.id !== 'endgame');
  if (opts?.hadBrilliant === false) pool = pool.filter(a => a.id !== 'cool_move');
  if (opts?.recentAngles?.length) {
    const filtered = pool.filter(a => !opts.recentAngles!.includes(a.id));
    if (filtered.length) pool = filtered;
  }
  if (pool.length === 0) pool = ANGLES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export { DEFAULT_LENS };
