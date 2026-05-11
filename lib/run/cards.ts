/**
 * Card system for Rookie's Run.
 *
 * Cards are an orthogonal resource to tempo. The tempo meter fills from
 * captures (existing behavior); when it tops out, the player draws — picks 1
 * of 2 offered cards into a hand of max 2. Cards are then played on Rookie's
 * turn to trigger powerful one-off effects (queen mode, bomb, freeze,
 * telekinesis).
 *
 * Step 1: types + registry skeleton only. Effects + draw flow land later.
 */

export type CardId =
  | 'move-bishop'
  | 'move-knight'
  | 'queen-mode'
  | 'bomb'
  | 'freeze'
  | 'telekinesis';

export const HAND_SIZE = 2;

export interface CardDef {
  id: CardId;
  name: string;
  /** One-line description shown on the card face. */
  blurb: string;
  /**
   * How the player targets this card.
   *   none   — instant (movement-mode cards apply to Rookie)
   *   enemy  — pick one enemy piece (freeze, telekinesis source)
   *   square — pick any board square (bomb center, telekinesis destination)
   */
  target: 'none' | 'enemy' | 'square';
}

export const CARD_DEFS: Record<CardId, CardDef> = {
  'move-bishop': {
    id: 'move-bishop',
    name: 'Bishop',
    blurb: 'Move like a bishop for 2 turns.',
    target: 'none',
  },
  'move-knight': {
    id: 'move-knight',
    name: 'Knight',
    blurb: 'Move like a knight for 2 turns.',
    target: 'none',
  },
  'queen-mode': {
    id: 'queen-mode',
    name: 'Queen',
    blurb: 'Move like a queen for 1 turn.',
    target: 'none',
  },
  bomb: {
    id: 'bomb',
    name: 'Bomb',
    blurb: 'Destroy enemies in a 3×3 area.',
    target: 'square',
  },
  freeze: {
    id: 'freeze',
    name: 'Freeze',
    blurb: 'Pick an enemy — it skips its next turn.',
    target: 'enemy',
  },
  telekinesis: {
    id: 'telekinesis',
    name: 'Telekinesis',
    blurb: 'Move any enemy to any empty square.',
    target: 'enemy',
  },
};

/**
 * Cards eligible to appear in the draw pool right now. Bomb / freeze /
 * telekinesis are defined but not drawable until their targeting UIs land.
 */
export const DRAWABLE_POOL: CardId[] = ['move-bishop', 'move-knight', 'queen-mode'];

export const ALL_CARD_IDS: CardId[] = Object.keys(CARD_DEFS) as CardId[];

/** Pick `n` distinct cards from the drawable pool. */
export function rollDraw(n: number, pool: CardId[] = DRAWABLE_POOL): CardId[] {
  const copy = [...pool];
  const out: CardId[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return out;
}
