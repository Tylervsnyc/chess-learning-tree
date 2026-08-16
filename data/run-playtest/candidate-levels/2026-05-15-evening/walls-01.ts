/**
 * Candidate: walls-01
 * Template: WALLS
 * Knobs.d: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * Forms: knight from L4, bishop from L7
 *
 * Results (vs target curve 95/90/80/70/60/50/35/25/15/8):
// L1: T3=100% T4=100% T5=100% (target T4=95%)
// L2: T3=100% T4=100% T5=100% (target T4=90%)
// L3: T3=100% T4=100% T5=100% (target T4=80%)
// L4: T3=100% T4=100% T5=100% (target T4=70%)
// L5: T3=100% T4=100% T5=100% (target T4=60%)
// L6: T3=53% T4=100% T5=100% (target T4=50%)
// L7: T3=13% T4=47% T5=67% (target T4=35%)
// L8: T3=13% T4=27% T5=40% (target T4=25%)
// L9: T3=7% T4=27% T5=0% (target T4=15%)
// L10: T3=0% T4=0% T5=20% (target T4=8%)
 * L10 no-ability T5: 0%
 */

import { LevelBuilder, make, pawn, knight, bishop, queen } from './_shared';

export const template = 'walls';
export const notes = 'Auto-generated 2026-05-15-evening session.';

export const levels: ReadonlyArray<LevelBuilder> = [
  make(1, [pawn(2, 3), pawn(5, 3), pawn(7, 3)]),
  make(2, [pawn(2, 3), pawn(5, 3), pawn(7, 3)]),
  make(3, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), knight(4, 6)]),
  make(4, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), knight(4, 6)], { allowedForms: ['knight'], enemiesPerTurn: 2 }),
  make(5, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), knight(4, 6), bishop(5, 6), pawn(4, 7)], { allowedForms: ['knight'], enemiesPerTurn: 2 }),
  make(6, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), knight(4, 6), bishop(5, 6), knight(3, 6), pawn(4, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }], allowedForms: ['knight'], enemiesPerTurn: 2 }),
  make(7, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), pawn(4, 7), queen(4, 8)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }], moveLimit: 22, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  make(8, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  make(9, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7), knight(3, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  make(10, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7), knight(3, 7), queen(5, 8)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }, { file: 4, rank: 7 }, { file: 5, rank: 7 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 }),
];
