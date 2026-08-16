/**
 * Candidate: mixed-02
 * Template: MIXED
 * Knobs.d: [1, 2, 4, 5, 6, 7, 8, 9, 10, 10]
 * Forms: knight from L4, bishop from L7
 *
 * Results (vs target curve 95/90/80/70/60/50/35/25/15/8):
// L1: T3=100% T4=100% T5=100% (target T4=95%)
// L2: T3=100% T4=100% T5=100% (target T4=90%)
// L3: T3=100% T4=100% T5=100% (target T4=80%)
// L4: T3=100% T4=100% T5=100% (target T4=70%)
// L5: T3=100% T4=100% T5=100% (target T4=60%)
// L6: T3=87% T4=100% T5=100% (target T4=50%)
// L7: T3=7% T4=73% T5=100% (target T4=35%)
// L8: T3=7% T4=73% T5=100% (target T4=25%)
// L9: T3=7% T4=20% T5=20% (target T4=15%)
// L10: T3=7% T4=20% T5=7% (target T4=8%)
 * L10 no-ability T5: 8%
 */

import { LevelBuilder, make, pawn, knight, bishop, queen } from './_shared';

export const template = 'mixed';
export const notes = 'Auto-generated 2026-05-15-evening session.';

export const levels: ReadonlyArray<LevelBuilder> = [
  make(1, [bishop(2, 6), pawn(4, 4)]),
  make(2, [bishop(2, 6), pawn(4, 4), bishop(7, 6)]),
  make(3, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4)], { enemiesPerTurn: 2 }),
  make(4, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }], allowedForms: ['knight'], enemiesPerTurn: 2 }),
  make(5, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }], allowedForms: ['knight'], enemiesPerTurn: 2 }),
  make(6, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 22, allowedForms: ['knight'], enemiesPerTurn: 2 }),
  make(7, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  make(8, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5), bishop(5, 8), pawn(4, 6), pawn(5, 6)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  make(9, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5), bishop(5, 8), pawn(4, 6), pawn(5, 6), queen(2, 8), queen(7, 8), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), knight(4, 6), knight(5, 6)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }, { file: 4, rank: 6 }, { file: 5, rank: 6 }], moveLimit: 15, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  make(10, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5), bishop(5, 8), pawn(4, 6), pawn(5, 6), queen(2, 8), queen(7, 8), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), knight(4, 6), knight(5, 6)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }, { file: 4, rank: 6 }, { file: 5, rank: 6 }], moveLimit: 15, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
];
