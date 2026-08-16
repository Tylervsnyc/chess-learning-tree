/**
 * Candidate: normal-03
 * Template: NORMAL
 * Knobs.d: [2, 3, 4, 5, 6, 7, 7, 8, 9, 10]
 * Forms: knight from L3, bishop from L6
 *
 * Results (vs target curve 95/90/80/70/60/50/35/25/15/8):
// L1: T3=100% T4=100% T5=100% (target T4=95%)
// L2: T3=100% T4=100% T5=100% (target T4=90%)
// L3: T3=100% T4=100% T5=100% (target T4=80%)
// L4: T3=100% T4=100% T5=100% (target T4=70%)
// L5: T3=100% T4=100% T5=100% (target T4=60%)
// L6: T3=100% T4=100% T5=100% (target T4=50%)
// L7: T3=100% T4=100% T5=100% (target T4=35%)
// L8: T3=7% T4=73% T5=100% (target T4=25%)
// L9: T3=7% T4=60% T5=80% (target T4=15%)
// L10: T3=0% T4=7% T5=13% (target T4=8%)
 * L10 no-ability T5: 0%
 */

import { LevelBuilder, make, pawn, knight, bishop, queen } from './_shared';

export const template = 'normal';
export const notes = 'Auto-generated 2026-05-15-evening session.';

export const levels: ReadonlyArray<LevelBuilder> = [
  make(1, [pawn(3, 7), pawn(6, 7), knight(4, 8)]),
  make(2, [pawn(3, 7), pawn(6, 7), pawn(5, 7), knight(4, 8), pawn(2, 6), pawn(7, 6)]),
  make(3, [pawn(3, 7), pawn(6, 7), pawn(5, 7), knight(4, 8), bishop(6, 8), pawn(2, 6), pawn(7, 6)], { allowedForms: ['knight'] }),
  make(4, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6)], { allowedForms: ['knight'] }),
  make(5, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 4), pawn(6, 4)], { allowedForms: ['knight'], enemiesPerTurn: 2 }),
  make(6, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4)], { moveLimit: 24, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 }),
  make(7, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4)], { moveLimit: 24, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 }),
  make(8, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 20, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 }),
  make(9, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), knight(7, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  make(10, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), knight(7, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4), pawn(4, 4), pawn(5, 4), pawn(2, 4), pawn(7, 4), pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3), queen(5, 8)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
];
