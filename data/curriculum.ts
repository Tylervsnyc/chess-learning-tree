import { Lesson, Theme } from '@/types/curriculum';

// Helper function to create themes for a lesson
function createThemes(lessonId: string, themeNames: string[]): Theme[] {
  return themeNames.map((name, index) => ({
    id: `${lessonId}.${index + 1}`,
    lessonId,
    name,
    order: index + 1,
  }));
}

export const curriculum: Lesson[] = [
  // Level 1 - Beginner (400-600 ELO)
  {
    id: '1.1',
    name: 'Mate in 1',
    order: 1,
    themes: createThemes('1.1', [
      'Queen delivers mate',
      'Rook delivers mate',
      'Bishop delivers mate',
      'Knight delivers mate',
      'Pawn delivers mate',
      'Back rank mate patterns',
    ]),
  },
  {
    id: '1.2',
    name: 'Piece Values',
    order: 2,
    themes: createThemes('1.2', [
      'Pawn value basics',
      'Minor pieces comparison',
      'Major pieces comparison',
      'Queen value assessment',
      'Material counting',
      'Trading pieces wisely',
    ]),
  },
  {
    id: '1.3',
    name: 'Capturing',
    order: 3,
    themes: createThemes('1.3', [
      'Safe captures',
      'Winning material',
      'Recapturing principles',
      'Capture sequences',
      'Avoiding bad captures',
      'En passant captures',
    ]),
  },
  {
    id: '1.4',
    name: 'Protecting',
    order: 4,
    themes: createThemes('1.4', [
      'Defending attacked pieces',
      'Adding defenders',
      'Moving away safely',
      'Blocking attacks',
      'Counter-attacking',
      'Piece coordination defense',
    ]),
  },
  {
    id: '1.5',
    name: 'Check',
    order: 5,
    themes: createThemes('1.5', [
      'Recognizing check',
      'Blocking check',
      'Moving the king',
      'Capturing the attacker',
      'Double check concepts',
      'Discovered check basics',
    ]),
  },
  {
    id: '1.6',
    name: 'Basic Checkmates',
    order: 6,
    themes: createThemes('1.6', [
      'King + Queen vs King',
      'King + Rook vs King',
      'Two Rooks mate',
      'King + 2 Bishops vs King',
      'Ladder mate technique',
      'Box mate technique',
    ]),
  },
  {
    id: '1.7',
    name: 'Stalemate',
    order: 7,
    themes: createThemes('1.7', [
      'Recognizing stalemate',
      'Avoiding stalemate (winning)',
      'Seeking stalemate (drawing)',
      'Stalemate traps',
      'King safety and stalemate',
      'Endgame stalemate patterns',
    ]),
  },
  {
    id: '1.8',
    name: 'Opening Principles',
    order: 8,
    themes: createThemes('1.8', [
      'Control the center',
      'Develop your pieces',
      'King safety basics',
      'Dont move pieces twice',
      'Connect your rooks',
      'Avoid early queen moves',
    ]),
  },
  {
    id: '1.9',
    name: 'Simple Tactics',
    order: 9,
    themes: createThemes('1.9', [
      'Hanging pieces',
      'Simple forks',
      'Simple pins',
      'Simple skewers',
      'Removing the defender',
      'Winning exchanges',
    ]),
  },
  {
    id: '1.10',
    name: 'Pawn Basics',
    order: 10,
    themes: createThemes('1.10', [
      'Pawn structure intro',
      'Passed pawns',
      'Pawn promotion',
      'Pawn chains',
      'Isolated pawns',
      'Doubled pawns',
    ]),
  },
  // Level 2 - Intermediate (600-800 ELO)
  {
    id: '2.1',
    name: 'Mate in 2',
    order: 11,
    themes: createThemes('2.1', [
      'Forcing mate patterns',
      'Queen sacrifice mates',
      'Smothered mate',
      'Arabian mate',
      'Anastasia mate',
      'Boden mate',
    ]),
  },
  {
    id: '2.2',
    name: 'Forks',
    order: 12,
    themes: createThemes('2.2', [
      'Knight forks',
      'Pawn forks',
      'Bishop forks',
      'Queen forks',
      'Royal forks',
      'Setting up forks',
    ]),
  },
  {
    id: '2.3',
    name: 'Pins',
    order: 13,
    themes: createThemes('2.3', [
      'Absolute pins',
      'Relative pins',
      'Pin to the king',
      'Pin to the queen',
      'Exploiting pins',
      'Breaking pins',
    ]),
  },
  {
    id: '2.4',
    name: 'Skewers',
    order: 14,
    themes: createThemes('2.4', [
      'Basic skewer patterns',
      'Queen skewers',
      'Rook skewers',
      'Bishop skewers',
      'Skewer vs Pin difference',
      'Setting up skewers',
    ]),
  },
  {
    id: '2.5',
    name: 'Discovered Attacks',
    order: 15,
    themes: createThemes('2.5', [
      'Discovered check',
      'Double check',
      'Discovered attack on queen',
      'Mill tactic',
      'Setting up discoveries',
      'Defending against discoveries',
    ]),
  },
  {
    id: '2.6',
    name: 'Double Attack',
    order: 16,
    themes: createThemes('2.6', [
      'Queen double attacks',
      'Knight double attacks',
      'Bishop double attacks',
      'Rook double attacks',
      'Combined threats',
      'Creating double attacks',
    ]),
  },
  {
    id: '2.7',
    name: 'Basic Endgames',
    order: 17,
    themes: createThemes('2.7', [
      'King and pawn endgames',
      'Opposition',
      'Key squares',
      'Rook endgame basics',
      'Lucena position',
      'Philidor position',
    ]),
  },
  {
    id: '2.8',
    name: 'Castling',
    order: 18,
    themes: createThemes('2.8', [
      'Kingside castling',
      'Queenside castling',
      'When to castle',
      'Castling rights',
      'Opposite side castling',
      'Delaying castling',
    ]),
  },
  {
    id: '2.9',
    name: 'Opening Repertoire',
    order: 19,
    themes: createThemes('2.9', [
      'Italian Game basics',
      'Spanish Game intro',
      'Sicilian Defense intro',
      'French Defense intro',
      'Queens Gambit basics',
      'London System intro',
    ]),
  },
  {
    id: '2.10',
    name: 'Piece Activity',
    order: 20,
    themes: createThemes('2.10', [
      'Active vs passive pieces',
      'Piece coordination',
      'Outposts',
      'Good vs bad bishops',
      'Knight vs bishop',
      'Piece mobility',
    ]),
  },
  // Level 3 - Advanced Beginner (800-1000 ELO)
  {
    id: '3.1',
    name: 'Mate in 3',
    order: 21,
    themes: createThemes('3.1', [
      'Calculation practice',
      'Sacrifice and mate',
      'Quiet moves in mating',
      'Deflection for mate',
      'Decoy for mate',
      'Complex mate patterns',
    ]),
  },
  {
    id: '3.2',
    name: 'Combination Patterns',
    order: 22,
    themes: createThemes('3.2', [
      'Deflection tactics',
      'Decoy tactics',
      'Interference',
      'Overloading',
      'X-ray attacks',
      'Zwischenzug',
    ]),
  },
  {
    id: '3.3',
    name: 'Positional Concepts',
    order: 23,
    themes: createThemes('3.3', [
      'Pawn structure strategy',
      'Weak squares',
      'Open files',
      'Seventh rank control',
      'Space advantage',
      'Piece exchanges',
    ]),
  },
  {
    id: '3.4',
    name: 'Advanced Endgames',
    order: 24,
    themes: createThemes('3.4', [
      'Rook vs pawns',
      'Bishop endgames',
      'Knight endgames',
      'Queen endgames',
      'Minor piece endgames',
      'Practical endgame play',
    ]),
  },
  {
    id: '3.5',
    name: 'Game Analysis',
    order: 25,
    themes: createThemes('3.5', [
      'Analyzing your games',
      'Finding mistakes',
      'Critical moments',
      'Alternative moves',
      'Pattern recognition',
      'Learning from masters',
    ]),
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return curriculum.find(lesson => lesson.id === id);
}

export function getThemeById(id: string): Theme | undefined {
  for (const lesson of curriculum) {
    const theme = lesson.themes.find(t => t.id === id);
    if (theme) return theme;
  }
  return undefined;
}
