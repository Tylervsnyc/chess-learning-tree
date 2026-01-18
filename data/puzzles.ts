import { Puzzle } from '@/types/curriculum';

// Puzzles for theme 1.4.4 - Blocking attacks
// These puzzles focus on interposing a piece to block an attack
export const puzzles: Record<string, Puzzle[]> = {
  '1.4.4': [
    {
      id: '1.4.4.1',
      themeId: '1.4.4',
      // White king checked by queen on a1-e1 diagonal, block with rook on a1
      fen: '4k3/8/8/8/8/8/R7/q3K3 w - - 0 1',
      solution: ['a2a1'],
      playerColor: 'white',
    },
    {
      id: '1.4.4.2',
      themeId: '1.4.4',
      // White king checked by rook on d1, block with bishop
      fen: '4k3/8/8/8/8/4B3/8/3rK3 w - - 0 1',
      solution: ['e3d2'],
      playerColor: 'white',
    },
    {
      id: '1.4.4.3',
      themeId: '1.4.4',
      // White king checked by rook on e8, block with rook on e4
      fen: '4r2k/8/8/8/4R3/8/8/4K3 w - - 0 1',
      solution: ['e4e5'],
      playerColor: 'white',
    },
    {
      id: '1.4.4.4',
      themeId: '1.4.4',
      // Black king checked by queen on a8-h1 diagonal, block with bishop
      fen: '7k/6b1/8/8/8/8/8/Q3K3 b - - 0 1',
      solution: ['g7d4'],
      playerColor: 'black',
    },
    {
      id: '1.4.4.5',
      themeId: '1.4.4',
      // White king checked by queen on d8, block with queen
      fen: '3qk3/8/8/8/8/8/3Q4/4K3 w - - 0 1',
      solution: ['d2d4'],
      playerColor: 'white',
    },
    {
      id: '1.4.4.6',
      themeId: '1.4.4',
      // Black king checked by rook on h8, block with rook
      fen: '6Rk/5r2/8/8/8/8/8/4K3 b - - 0 1',
      solution: ['f7g7'],
      playerColor: 'black',
    },
    {
      id: '1.4.4.7',
      themeId: '1.4.4',
      // White king checked by bishop on b4, block with pawn
      fen: '4k3/8/8/8/1b6/3P4/8/4K3 w - - 0 1',
      solution: ['d3c4'],
      playerColor: 'white',
    },
    {
      id: '1.4.4.8',
      themeId: '1.4.4',
      // White king checked by queen, block with knight
      fen: '4k3/8/8/8/q7/8/2N5/4K3 w - - 0 1',
      solution: ['c2d4'],
      playerColor: 'white',
    },
    {
      id: '1.4.4.9',
      themeId: '1.4.4',
      // Black king checked by rook on a8, block with knight
      fen: 'R3k3/8/4n3/8/8/8/8/4K3 b - - 0 1',
      solution: ['e6c7'],
      playerColor: 'black',
    },
    {
      id: '1.4.4.10',
      themeId: '1.4.4',
      // White king checked by bishop on a3, block with rook
      fen: '4k3/8/8/8/8/b7/4R3/4K3 w - - 0 1',
      solution: ['e2c2'],
      playerColor: 'white',
    },
  ],
};

export function getPuzzlesByTheme(themeId: string): Puzzle[] {
  return puzzles[themeId] || [];
}

export function getPuzzleById(puzzleId: string): Puzzle | undefined {
  for (const themePuzzles of Object.values(puzzles)) {
    const puzzle = themePuzzles.find(p => p.id === puzzleId);
    if (puzzle) return puzzle;
  }
  return undefined;
}
