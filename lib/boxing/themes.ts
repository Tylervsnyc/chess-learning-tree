export const BOXING_THEMES = [
  'fork', 'pin', 'skewer', 'discoveredAttack', 'hangingPiece', 'sacrifice',
  'deflection', 'attraction', 'trappedPiece', 'backRankMate', 'exposedKing',
  'mateIn1', 'mateIn2', 'advancedPawn', 'clearance', 'defensiveMove',
  'interference', 'promotion', 'quietMove',
] as const;

export type BoxingTheme = typeof BOXING_THEMES[number] | 'mixed';
