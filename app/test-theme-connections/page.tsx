'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface Puzzle {
  puzzleId: string;
  fen: string;           // Original FEN before setup
  puzzleFen: string;     // FEN after setup (player's turn)
  moves: string;
  rating: number;
  themes: string[];
  playerColor: 'white' | 'black';
  setupMove: string;     // Opponent's setup move in SAN
  solutionMoves: string[]; // Solution moves in SAN
  lastMoveFrom: string;
  lastMoveTo: string;
}

interface ExploreState {
  theme1: string;
  theme2: string;
  puzzles: Puzzle[];
  currentIndex: number;
  loading: boolean;
  currentFen: string;
  moveIndex: number;     // 0 = puzzle start (after setup), 1+ = solution moves
  playerColor: 'white' | 'black';
  lastMoveSquares: { from: string; to: string } | null;
  excludedThemes: string[];
}

// Common themes to offer as filter options
const FILTER_THEMES = [
  'backRankMate',
  'promotion',
  'advancedPawn',
  'smotheredMate',
  'sacrifice',
  'hangingPiece',
  'exposedKing',
  'quietMove',
];

// Theme connection data structure
interface ThemeConnection {
  theme: string;
  count: number;
  percentage: number;
}

interface ThemeData {
  theme: string;
  totalPuzzles: number;
  connections: ThemeConnection[];
}

interface BracketData {
  bracket: string;
  ratingRange: string;
  totalPuzzles: number;
  themes: ThemeData[];
  topConnections: { theme1: string; theme2: string; count: number; percentage: number }[];
}

// Theme colors - distinctive colors for each theme category
const THEME_COLORS: Record<string, string> = {
  // Checkmate themes - reds/oranges
  mateIn1: '#FF6B6B',
  mateIn2: '#FF8E53',
  mateIn3: '#FFA94D',
  backRankMate: '#E03131',
  smotheredMate: '#C92A2A',

  // Tactical themes - blues/cyans
  fork: '#4DABF7',
  pin: '#339AF0',
  skewer: '#228BE6',
  discoveredAttack: '#1C7ED6',
  discoveredCheck: '#15AABF',
  doubleCheck: '#1971C2',

  // Forcing themes - purples
  deflection: '#B197FC',
  attraction: '#9775FA',
  sacrifice: '#845EF7',
  clearance: '#7950F2',
  intermezzo: '#F783AC',

  // Material themes - greens
  hangingPiece: '#69DB7C',
  trappedPiece: '#51CF66',

  // Pawn themes - yellows
  advancedPawn: '#FFD43B',
  promotion: '#FCC419',

  // Positional themes - teals
  quietMove: '#38D9A9',
  defensiveMove: '#20C997',
  exposedKing: '#12B886',

  // Others
  xRayAttack: '#E599F7',
};

const getThemeColor = (theme: string): string => {
  return THEME_COLORS[theme] || '#868E96';
};

// Display names for themes
const THEME_NAMES: Record<string, string> = {
  mateIn1: 'Mate in 1',
  mateIn2: 'Mate in 2',
  mateIn3: 'Mate in 3',
  backRankMate: 'Back Rank',
  smotheredMate: 'Smothered',
  fork: 'Fork',
  pin: 'Pin',
  skewer: 'Skewer',
  discoveredAttack: 'Discovery',
  discoveredCheck: 'Disc. Check',
  doubleCheck: 'Double Check',
  deflection: 'Deflection',
  attraction: 'Attraction',
  sacrifice: 'Sacrifice',
  clearance: 'Clearance',
  hangingPiece: 'Hanging',
  trappedPiece: 'Trapped',
  advancedPawn: 'Adv. Pawn',
  promotion: 'Promotion',
  quietMove: 'Quiet Move',
  defensiveMove: 'Defensive',
  exposedKing: 'Exposed King',
  intermezzo: 'Intermezzo',
  xRayAttack: 'X-Ray',
};

// Static data embedded for reliability
const THEME_DATA: BracketData[] = [
  {
    bracket: "0400-0800",
    ratingRange: "Level 1",
    totalPuzzles: 492496,
    themes: [
      { theme: "mateIn1", totalPuzzles: 266490, connections: [
        { theme: "backRankMate", count: 24042, percentage: 9 },
        { theme: "hangingPiece", count: 23426, percentage: 9 },
        { theme: "smotheredMate", count: 2234, percentage: 1 },
        { theme: "advancedPawn", count: 1675, percentage: 1 },
        { theme: "promotion", count: 925, percentage: 0 },
        { theme: "pin", count: 671, percentage: 0 },
      ]},
      { theme: "mateIn2", totalPuzzles: 146720, connections: [
        { theme: "backRankMate", count: 62703, percentage: 43 },
        { theme: "sacrifice", count: 12674, percentage: 9 },
        { theme: "fork", count: 4005, percentage: 3 },
        { theme: "hangingPiece", count: 3879, percentage: 3 },
        { theme: "advancedPawn", count: 1542, percentage: 1 },
        { theme: "promotion", count: 1293, percentage: 1 },
      ]},
      { theme: "backRankMate", totalPuzzles: 93444, connections: [
        { theme: "mateIn2", count: 62703, percentage: 67 },
        { theme: "mateIn1", count: 24042, percentage: 26 },
        { theme: "sacrifice", count: 10252, percentage: 11 },
        { theme: "hangingPiece", count: 6657, percentage: 7 },
        { theme: "mateIn3", count: 6618, percentage: 7 },
        { theme: "fork", count: 2201, percentage: 2 },
      ]},
      { theme: "fork", totalPuzzles: 81721, connections: [
        { theme: "mateIn2", count: 12759, percentage: 16 },
        { theme: "backRankMate", count: 8084, percentage: 10 },
        { theme: "hangingPiece", count: 1881, percentage: 2 },
        { theme: "advancedPawn", count: 995, percentage: 1 },
        { theme: "mateIn3", count: 935, percentage: 1 },
        { theme: "discoveredCheck", count: 562, percentage: 1 },
        { theme: "discoveredAttack", count: 472, percentage: 1 },
        { theme: "promotion", count: 379, percentage: 0 },
        { theme: "sacrifice", count: 246, percentage: 0 },
        { theme: "exposedKing", count: 179, percentage: 0 },
        { theme: "attraction", count: 128, percentage: 0 },
        { theme: "doubleCheck", count: 128, percentage: 0 },
        { theme: "pin", count: 100, percentage: 0 },
      ]},
      { theme: "hangingPiece", totalPuzzles: 30566, connections: [
        { theme: "mateIn1", count: 23426, percentage: 77 },
        { theme: "backRankMate", count: 6657, percentage: 22 },
        { theme: "mateIn2", count: 3879, percentage: 13 },
        { theme: "fork", count: 642, percentage: 2 },
      ]},
      { theme: "advancedPawn", totalPuzzles: 17543, connections: [
        { theme: "promotion", count: 11346, percentage: 65 },
        { theme: "quietMove", count: 4325, percentage: 25 },
        { theme: "mateIn1", count: 1675, percentage: 10 },
        { theme: "mateIn2", count: 1542, percentage: 9 },
      ]},
      { theme: "sacrifice", totalPuzzles: 15307, connections: [
        { theme: "mateIn2", count: 12674, percentage: 83 },
        { theme: "backRankMate", count: 10252, percentage: 67 },
        { theme: "mateIn3", count: 2332, percentage: 15 },
      ]},
      { theme: "promotion", totalPuzzles: 11346, connections: [
        { theme: "advancedPawn", count: 11346, percentage: 100 },
        { theme: "quietMove", count: 2815, percentage: 25 },
        { theme: "mateIn2", count: 1293, percentage: 11 },
        { theme: "mateIn1", count: 925, percentage: 8 },
      ]},
      { theme: "mateIn3", totalPuzzles: 10038, connections: [
        { theme: "backRankMate", count: 6618, percentage: 66 },
        { theme: "sacrifice", count: 2332, percentage: 23 },
      ]},
      { theme: "skewer", totalPuzzles: 17931, connections: [
        { theme: "deflection", count: 727, percentage: 4 },
        { theme: "hangingPiece", count: 218, percentage: 1 },
        { theme: "sacrifice", count: 113, percentage: 1 },
        { theme: "exposedKing", count: 105, percentage: 1 },
        { theme: "attraction", count: 37, percentage: 0 },
        { theme: "discoveredAttack", count: 27, percentage: 0 },
      ]},
      { theme: "discoveredAttack", totalPuzzles: 10724, connections: [
        { theme: "deflection", count: 841, percentage: 8 },
        { theme: "mateIn2", count: 731, percentage: 7 },
        { theme: "advancedPawn", count: 683, percentage: 6 },
        { theme: "fork", count: 472, percentage: 4 },
        { theme: "promotion", count: 318, percentage: 3 },
        { theme: "mateIn1", count: 164, percentage: 2 },
        { theme: "backRankMate", count: 113, percentage: 1 },
        { theme: "pin", count: 99, percentage: 1 },
        { theme: "sacrifice", count: 58, percentage: 1 },
      ]},
      { theme: "quietMove", totalPuzzles: 5314, connections: [
        { theme: "advancedPawn", count: 4325, percentage: 81 },
        { theme: "promotion", count: 2815, percentage: 53 },
      ]},
      { theme: "smotheredMate", totalPuzzles: 2234, connections: [
        { theme: "mateIn1", count: 2234, percentage: 100 },
      ]},
      { theme: "discoveredCheck", totalPuzzles: 2474, connections: [
        { theme: "discoveredAttack", count: 1360, percentage: 55 },
        { theme: "doubleCheck", count: 1114, percentage: 45 },
        { theme: "mateIn1", count: 910, percentage: 37 },
        { theme: "advancedPawn", count: 900, percentage: 36 },
        { theme: "fork", count: 562, percentage: 23 },
      ]},
      { theme: "doubleCheck", totalPuzzles: 1119, connections: [
        { theme: "discoveredCheck", count: 1114, percentage: 100 },
        { theme: "mateIn1", count: 751, percentage: 67 },
        { theme: "advancedPawn", count: 274, percentage: 24 },
        { theme: "mateIn2", count: 232, percentage: 21 },
        { theme: "promotion", count: 202, percentage: 18 },
        { theme: "fork", count: 128, percentage: 11 },
      ]},
      { theme: "pin", totalPuzzles: 5005, connections: [
        { theme: "mateIn1", count: 1640, percentage: 33 },
        { theme: "defensiveMove", count: 596, percentage: 12 },
        { theme: "mateIn2", count: 596, percentage: 12 },
        { theme: "hangingPiece", count: 289, percentage: 6 },
        { theme: "clearance", count: 151, percentage: 3 },
        { theme: "advancedPawn", count: 131, percentage: 3 },
        { theme: "promotion", count: 101, percentage: 2 },
        { theme: "fork", count: 100, percentage: 2 },
        { theme: "discoveredAttack", count: 99, percentage: 2 },
        { theme: "attraction", count: 88, percentage: 2 },
        { theme: "sacrifice", count: 33, percentage: 1 },
        { theme: "deflection", count: 24, percentage: 0 },
      ]},
      { theme: "deflection", totalPuzzles: 3955, connections: [
        { theme: "mateIn2", count: 1098, percentage: 28 },
        { theme: "discoveredAttack", count: 841, percentage: 21 },
        { theme: "skewer", count: 727, percentage: 18 },
        { theme: "advancedPawn", count: 714, percentage: 18 },
        { theme: "promotion", count: 649, percentage: 16 },
        { theme: "backRankMate", count: 172, percentage: 4 },
        { theme: "mateIn3", count: 87, percentage: 2 },
        { theme: "exposedKing", count: 48, percentage: 1 },
        { theme: "discoveredCheck", count: 46, percentage: 1 },
        { theme: "hangingPiece", count: 43, percentage: 1 },
        { theme: "pin", count: 24, percentage: 1 },
        { theme: "sacrifice", count: 20, percentage: 1 },
        { theme: "fork", count: 10, percentage: 0 },
      ]},
    ],
    topConnections: [
      { theme1: "backRankMate", theme2: "mateIn2", count: 62703, percentage: 67 },
      { theme1: "backRankMate", theme2: "mateIn1", count: 24042, percentage: 26 },
      { theme1: "hangingPiece", theme2: "mateIn1", count: 23426, percentage: 77 },
      { theme1: "mateIn2", theme2: "sacrifice", count: 12674, percentage: 83 },
      { theme1: "advancedPawn", theme2: "promotion", count: 11346, percentage: 100 },
      { theme1: "backRankMate", theme2: "sacrifice", count: 10252, percentage: 67 },
      { theme1: "backRankMate", theme2: "hangingPiece", count: 6657, percentage: 22 },
      { theme1: "backRankMate", theme2: "mateIn3", count: 6618, percentage: 7 },
      { theme1: "quietMove", theme2: "advancedPawn", count: 4325, percentage: 81 },
      { theme1: "fork", theme2: "mateIn2", count: 4005, percentage: 10 },
      { theme1: "mateIn2", theme2: "hangingPiece", count: 3879, percentage: 3 },
      { theme1: "quietMove", theme2: "promotion", count: 2815, percentage: 53 },
      { theme1: "mateIn3", theme2: "sacrifice", count: 2332, percentage: 23 },
      { theme1: "smotheredMate", theme2: "mateIn1", count: 2234, percentage: 100 },
      { theme1: "fork", theme2: "backRankMate", count: 2201, percentage: 5 },
      { theme1: "mateIn1", theme2: "advancedPawn", count: 1675, percentage: 1 },
      { theme1: "mateIn2", theme2: "advancedPawn", count: 1542, percentage: 1 },
      { theme1: "mateIn2", theme2: "promotion", count: 1293, percentage: 1 },
      { theme1: "mateIn1", theme2: "promotion", count: 925, percentage: 0 },
      { theme1: "pin", theme2: "mateIn1", count: 671, percentage: 31 },
      { theme1: "fork", theme2: "hangingPiece", count: 642, percentage: 2 },
      { theme1: "fork", theme2: "mateIn3", count: 387, percentage: 1 },
      { theme1: "deflection", theme2: "mateIn2", count: 324, percentage: 24 },
      { theme1: "fork", theme2: "advancedPawn", count: 257, percentage: 1 },
      { theme1: "pin", theme2: "mateIn2", count: 227, percentage: 11 },
      { theme1: "discoveredAttack", theme2: "deflection", count: 841, percentage: 8 },
      { theme1: "discoveredAttack", theme2: "mateIn2", count: 731, percentage: 7 },
      { theme1: "discoveredAttack", theme2: "advancedPawn", count: 683, percentage: 6 },
      { theme1: "discoveredAttack", theme2: "fork", count: 472, percentage: 4 },
      { theme1: "discoveredAttack", theme2: "promotion", count: 318, percentage: 3 },
      { theme1: "pin", theme2: "mateIn1", count: 1640, percentage: 33 },
      { theme1: "pin", theme2: "mateIn2", count: 596, percentage: 12 },
      { theme1: "pin", theme2: "defensiveMove", count: 596, percentage: 12 },
      { theme1: "skewer", theme2: "deflection", count: 727, percentage: 4 },
      { theme1: "deflection", theme2: "skewer", count: 727, percentage: 18 },
      { theme1: "deflection", theme2: "discoveredAttack", count: 841, percentage: 21 },
      { theme1: "fork", theme2: "discoveredCheck", count: 562, percentage: 1 },
    ]
  },
  {
    bracket: "0800-1200",
    ratingRange: "Level 2",
    totalPuzzles: 1286530,
    themes: [
      { theme: "mateIn1", totalPuzzles: 386363, connections: [
        { theme: "hangingPiece", count: 16141, percentage: 4 },
        { theme: "smotheredMate", count: 12442, percentage: 3 },
        { theme: "backRankMate", count: 8027, percentage: 2 },
        { theme: "pin", count: 6086, percentage: 2 },
      ]},
      { theme: "mateIn2", totalPuzzles: 318066, connections: [
        { theme: "backRankMate", count: 36268, percentage: 11 },
        { theme: "sacrifice", count: 28502, percentage: 9 },
        { theme: "deflection", count: 15233, percentage: 5 },
        { theme: "fork", count: 13032, percentage: 4 },
        { theme: "advancedPawn", count: 7894, percentage: 2 },
      ]},
      { theme: "fork", totalPuzzles: 467250, connections: [
        { theme: "mateIn2", count: 35423, percentage: 8 },
        { theme: "attraction", count: 15092, percentage: 3 },
        { theme: "exposedKing", count: 13377, percentage: 3 },
        { theme: "backRankMate", count: 13140, percentage: 3 },
        { theme: "sacrifice", count: 11809, percentage: 3 },
        { theme: "discoveredAttack", count: 10177, percentage: 2 },
        { theme: "advancedPawn", count: 9539, percentage: 2 },
        { theme: "mateIn3", count: 9123, percentage: 2 },
        { theme: "discoveredCheck", count: 8596, percentage: 2 },
        { theme: "hangingPiece", count: 8596, percentage: 2 },
        { theme: "pin", count: 6333, percentage: 1 },
      ]},
      { theme: "discoveredAttack", totalPuzzles: 132027, connections: [
        { theme: "discoveredCheck", count: 34520, percentage: 26 },
        { theme: "mateIn2", count: 17277, percentage: 13 },
        { theme: "deflection", count: 11517, percentage: 9 },
        { theme: "advancedPawn", count: 10591, percentage: 8 },
        { theme: "fork", count: 10177, percentage: 8 },
        { theme: "pin", count: 5535, percentage: 4 },
        { theme: "sacrifice", count: 5190, percentage: 4 },
        { theme: "backRankMate", count: 3471, percentage: 3 },
      ]},
      { theme: "backRankMate", totalPuzzles: 70494, connections: [
        { theme: "mateIn2", count: 36268, percentage: 51 },
        { theme: "sacrifice", count: 25857, percentage: 37 },
        { theme: "mateIn3", count: 25845, percentage: 37 },
        { theme: "mateIn1", count: 8027, percentage: 11 },
      ]},
      { theme: "advancedPawn", totalPuzzles: 64391, connections: [
        { theme: "promotion", count: 31754, percentage: 49 },
        { theme: "mateIn2", count: 7894, percentage: 12 },
        { theme: "quietMove", count: 5450, percentage: 8 },
      ]},
      { theme: "sacrifice", totalPuzzles: 61444, connections: [
        { theme: "mateIn2", count: 28502, percentage: 46 },
        { theme: "backRankMate", count: 25857, percentage: 42 },
        { theme: "mateIn3", count: 25116, percentage: 41 },
        { theme: "attraction", count: 6159, percentage: 10 },
        { theme: "fork", count: 3610, percentage: 6 },
      ]},
      { theme: "pin", totalPuzzles: 107546, connections: [
        { theme: "mateIn2", count: 15338, percentage: 14 },
        { theme: "mateIn1", count: 13957, percentage: 13 },
        { theme: "deflection", count: 7215, percentage: 7 },
        { theme: "fork", count: 6333, percentage: 6 },
        { theme: "discoveredAttack", count: 5535, percentage: 5 },
        { theme: "advancedPawn", count: 5275, percentage: 5 },
        { theme: "attraction", count: 3979, percentage: 4 },
        { theme: "sacrifice", count: 3366, percentage: 3 },
        { theme: "defensiveMove", count: 2927, percentage: 3 },
        { theme: "clearance", count: 2611, percentage: 2 },
      ]},
      { theme: "deflection", totalPuzzles: 138437, connections: [
        { theme: "mateIn2", count: 47457, percentage: 34 },
        { theme: "discoveredAttack", count: 11517, percentage: 8 },
        { theme: "backRankMate", count: 11420, percentage: 8 },
        { theme: "skewer", count: 10700, percentage: 8 },
        { theme: "advancedPawn", count: 10668, percentage: 8 },
        { theme: "promotion", count: 8541, percentage: 6 },
        { theme: "mateIn3", count: 8000, percentage: 6 },
        { theme: "pin", count: 7215, percentage: 5 },
        { theme: "attraction", count: 6391, percentage: 5 },
        { theme: "exposedKing", count: 6353, percentage: 5 },
      ]},
      { theme: "mateIn3", totalPuzzles: 52975, connections: [
        { theme: "backRankMate", count: 25845, percentage: 49 },
        { theme: "sacrifice", count: 25116, percentage: 47 },
      ]},
      { theme: "hangingPiece", totalPuzzles: 51955, connections: [
        { theme: "mateIn1", count: 16141, percentage: 31 },
        { theme: "mateIn2", count: 6576, percentage: 13 },
      ]},
      { theme: "skewer", totalPuzzles: 111997, connections: [
        { theme: "deflection", count: 10700, percentage: 10 },
        { theme: "exposedKing", count: 7057, percentage: 6 },
        { theme: "attraction", count: 2850, percentage: 3 },
        { theme: "hangingPiece", count: 1572, percentage: 1 },
        { theme: "discoveredAttack", count: 1475, percentage: 1 },
        { theme: "sacrifice", count: 1438, percentage: 1 },
        { theme: "fork", count: 1264, percentage: 1 },
        { theme: "advancedPawn", count: 1109, percentage: 1 },
      ]},
      { theme: "promotion", totalPuzzles: 31754, connections: [
        { theme: "advancedPawn", count: 31754, percentage: 100 },
        { theme: "mateIn2", count: 5848, percentage: 18 },
      ]},
      { theme: "attraction", totalPuzzles: 17367, connections: [
        { theme: "sacrifice", count: 6159, percentage: 35 },
        { theme: "fork", count: 4730, percentage: 27 },
      ]},
      { theme: "smotheredMate", totalPuzzles: 12816, connections: [
        { theme: "mateIn1", count: 12442, percentage: 97 },
      ]},
      { theme: "discoveredCheck", totalPuzzles: 41330, connections: [
        { theme: "discoveredAttack", count: 34520, percentage: 84 },
        { theme: "advancedPawn", count: 10829, percentage: 26 },
        { theme: "fork", count: 8596, percentage: 21 },
        { theme: "mateIn2", count: 8060, percentage: 20 },
        { theme: "doubleCheck", count: 7146, percentage: 17 },
      ]},
      { theme: "doubleCheck", totalPuzzles: 7267, connections: [
        { theme: "discoveredCheck", count: 7146, percentage: 98 },
        { theme: "mateIn2", count: 3461, percentage: 48 },
        { theme: "advancedPawn", count: 1998, percentage: 27 },
        { theme: "mateIn1", count: 1815, percentage: 25 },
        { theme: "fork", count: 1179, percentage: 16 },
        { theme: "promotion", count: 996, percentage: 14 },
      ]},
    ],
    topConnections: [
      { theme1: "backRankMate", theme2: "mateIn2", count: 36268, percentage: 51 },
      { theme1: "advancedPawn", theme2: "promotion", count: 31754, percentage: 100 },
      { theme1: "mateIn2", theme2: "sacrifice", count: 28502, percentage: 46 },
      { theme1: "backRankMate", theme2: "sacrifice", count: 25857, percentage: 42 },
      { theme1: "backRankMate", theme2: "mateIn3", count: 25845, percentage: 49 },
      { theme1: "mateIn3", theme2: "sacrifice", count: 25116, percentage: 47 },
      { theme1: "hangingPiece", theme2: "mateIn1", count: 16141, percentage: 31 },
      { theme1: "deflection", theme2: "mateIn2", count: 15233, percentage: 28 },
      { theme1: "fork", theme2: "mateIn2", count: 13032, percentage: 5 },
      { theme1: "mateIn1", theme2: "smotheredMate", count: 12442, percentage: 97 },
      { theme1: "backRankMate", theme2: "mateIn1", count: 8027, percentage: 11 },
      { theme1: "mateIn2", theme2: "advancedPawn", count: 7894, percentage: 2 },
      { theme1: "hangingPiece", theme2: "mateIn2", count: 6576, percentage: 13 },
      { theme1: "attraction", theme2: "sacrifice", count: 6159, percentage: 35 },
      { theme1: "pin", theme2: "mateIn1", count: 6086, percentage: 11 },
      { theme1: "mateIn2", theme2: "promotion", count: 5848, percentage: 18 },
      { theme1: "discoveredAttack", theme2: "mateIn2", count: 5717, percentage: 7 },
      { theme1: "quietMove", theme2: "advancedPawn", count: 5450, percentage: 8 },
      { theme1: "pin", theme2: "mateIn2", count: 5231, percentage: 9 },
      { theme1: "attraction", theme2: "fork", count: 4730, percentage: 27 },
      { theme1: "exposedKing", theme2: "fork", count: 4302, percentage: 2 },
      { theme1: "sacrifice", theme2: "fork", count: 3610, percentage: 6 },
      { theme1: "discoveredAttack", theme2: "fork", count: 3554, percentage: 5 },
      { theme1: "discoveredAttack", theme2: "deflection", count: 3502, percentage: 5 },
      { theme1: "discoveredAttack", theme2: "advancedPawn", count: 3136, percentage: 4 },
      { theme1: "deflection", theme2: "fork", count: 2936, percentage: 5 },
      { theme1: "pin", theme2: "fork", count: 2402, percentage: 4 },
      { theme1: "deflection", theme2: "pin", count: 2020, percentage: 4 },
      { theme1: "discoveredAttack", theme2: "pin", count: 2013, percentage: 3 },
      { theme1: "discoveredAttack", theme2: "discoveredCheck", count: 34520, percentage: 26 },
      { theme1: "skewer", theme2: "deflection", count: 10700, percentage: 10 },
      { theme1: "skewer", theme2: "exposedKing", count: 7057, percentage: 6 },
      { theme1: "fork", theme2: "discoveredCheck", count: 8596, percentage: 2 },
      { theme1: "pin", theme2: "deflection", count: 7215, percentage: 7 },
    ]
  },
  {
    bracket: "1200-1600",
    ratingRange: "Level 3",
    totalPuzzles: 979054,
    themes: [
      { theme: "fork", totalPuzzles: 386182, connections: [
        { theme: "attraction", count: 86164, percentage: 22 },
        { theme: "sacrifice", count: 76885, percentage: 20 },
        { theme: "exposedKing", count: 41468, percentage: 11 },
        { theme: "mateIn2", count: 24260, percentage: 6 },
        { theme: "deflection", count: 19685, percentage: 5 },
        { theme: "pin", count: 16407, percentage: 4 },
        { theme: "advancedPawn", count: 14676, percentage: 4 },
        { theme: "discoveredAttack", count: 14644, percentage: 4 },
        { theme: "mateIn3", count: 11822, percentage: 3 },
        { theme: "discoveredCheck", count: 7660, percentage: 2 },
        { theme: "backRankMate", count: 6547, percentage: 2 },
      ]},
      { theme: "mateIn2", totalPuzzles: 185703, connections: [
        { theme: "sacrifice", count: 33659, percentage: 18 },
        { theme: "attraction", count: 13074, percentage: 7 },
        { theme: "pin", count: 12301, percentage: 7 },
        { theme: "fork", count: 9373, percentage: 5 },
        { theme: "backRankMate", count: 8485, percentage: 5 },
        { theme: "deflection", count: 7949, percentage: 4 },
      ]},
      { theme: "mateIn1", totalPuzzles: 129802, connections: [
        { theme: "pin", count: 6535, percentage: 5 },
        { theme: "hangingPiece", count: 3783, percentage: 3 },
        { theme: "smotheredMate", count: 2076, percentage: 2 },
      ]},
      { theme: "sacrifice", totalPuzzles: 106489, connections: [
        { theme: "attraction", count: 39388, percentage: 37 },
        { theme: "mateIn2", count: 33659, percentage: 32 },
        { theme: "mateIn3", count: 27164, percentage: 26 },
        { theme: "fork", count: 22257, percentage: 21 },
        { theme: "backRankMate", count: 10084, percentage: 9 },
        { theme: "pin", count: 7354, percentage: 7 },
      ]},
      { theme: "pin", totalPuzzles: 198559, connections: [
        { theme: "mateIn2", count: 33939, percentage: 17 },
        { theme: "sacrifice", count: 24621, percentage: 12 },
        { theme: "deflection", count: 19841, percentage: 10 },
        { theme: "attraction", count: 17324, percentage: 9 },
        { theme: "fork", count: 16407, percentage: 8 },
        { theme: "mateIn1", count: 14531, percentage: 7 },
        { theme: "discoveredAttack", count: 13040, percentage: 7 },
        { theme: "advancedPawn", count: 10632, percentage: 5 },
        { theme: "exposedKing", count: 7474, percentage: 4 },
        { theme: "clearance", count: 6803, percentage: 3 },
        { theme: "promotion", count: 6001, percentage: 3 },
      ]},
      { theme: "discoveredAttack", totalPuzzles: 154314, connections: [
        { theme: "discoveredCheck", count: 44440, percentage: 29 },
        { theme: "mateIn2", count: 16151, percentage: 10 },
        { theme: "fork", count: 14644, percentage: 9 },
        { theme: "sacrifice", count: 13573, percentage: 9 },
        { theme: "pin", count: 13040, percentage: 8 },
        { theme: "deflection", count: 11991, percentage: 8 },
        { theme: "advancedPawn", count: 11774, percentage: 8 },
        { theme: "attraction", count: 8855, percentage: 6 },
        { theme: "exposedKing", count: 8689, percentage: 6 },
        { theme: "mateIn3", count: 3761, percentage: 2 },
      ]},
      { theme: "advancedPawn", totalPuzzles: 83067, connections: [
        { theme: "promotion", count: 33386, percentage: 40 },
        { theme: "quietMove", count: 6269, percentage: 8 },
        { theme: "mateIn2", count: 5908, percentage: 7 },
        { theme: "sacrifice", count: 4830, percentage: 6 },
      ]},
      { theme: "deflection", totalPuzzles: 188605, connections: [
        { theme: "advancedPawn", count: 24426, percentage: 13 },
        { theme: "attraction", count: 23902, percentage: 13 },
        { theme: "mateIn2", count: 23877, percentage: 13 },
        { theme: "pin", count: 19841, percentage: 11 },
        { theme: "fork", count: 19685, percentage: 10 },
        { theme: "exposedKing", count: 19373, percentage: 10 },
        { theme: "promotion", count: 18759, percentage: 10 },
        { theme: "sacrifice", count: 14875, percentage: 8 },
        { theme: "discoveredAttack", count: 11991, percentage: 6 },
        { theme: "mateIn3", count: 11294, percentage: 6 },
        { theme: "skewer", count: 8344, percentage: 4 },
      ]},
      { theme: "attraction", totalPuzzles: 67258, connections: [
        { theme: "sacrifice", count: 39388, percentage: 59 },
        { theme: "fork", count: 24648, percentage: 37 },
        { theme: "mateIn2", count: 13074, percentage: 19 },
        { theme: "mateIn3", count: 8725, percentage: 13 },
        { theme: "exposedKing", count: 7326, percentage: 11 },
        { theme: "deflection", count: 6705, percentage: 10 },
      ]},
      { theme: "mateIn3", totalPuzzles: 52062, connections: [
        { theme: "sacrifice", count: 27164, percentage: 52 },
        { theme: "backRankMate", count: 9859, percentage: 19 },
        { theme: "attraction", count: 8725, percentage: 17 },
        { theme: "exposedKing", count: 6616, percentage: 13 },
      ]},
      { theme: "hangingPiece", totalPuzzles: 48616, connections: [
        { theme: "mateIn1", count: 3783, percentage: 8 },
      ]},
      { theme: "exposedKing", totalPuzzles: 39433, connections: [
        { theme: "fork", count: 12276, percentage: 31 },
        { theme: "attraction", count: 7326, percentage: 19 },
        { theme: "mateIn3", count: 6616, percentage: 17 },
      ]},
      { theme: "skewer", totalPuzzles: 79820, connections: [
        { theme: "exposedKing", count: 12037, percentage: 15 },
        { theme: "deflection", count: 8344, percentage: 10 },
        { theme: "attraction", count: 6243, percentage: 8 },
        { theme: "sacrifice", count: 5786, percentage: 7 },
        { theme: "quietMove", count: 2535, percentage: 3 },
        { theme: "fork", count: 2435, percentage: 3 },
        { theme: "advancedPawn", count: 2125, percentage: 3 },
        { theme: "discoveredAttack", count: 1919, percentage: 2 },
      ]},
      { theme: "promotion", totalPuzzles: 33389, connections: [
        { theme: "advancedPawn", count: 33386, percentage: 100 },
      ]},
      { theme: "backRankMate", totalPuzzles: 20169, connections: [
        { theme: "sacrifice", count: 10084, percentage: 50 },
        { theme: "mateIn3", count: 9859, percentage: 49 },
        { theme: "mateIn2", count: 8485, percentage: 42 },
      ]},
      { theme: "discoveredCheck", totalPuzzles: 55742, connections: [
        { theme: "discoveredAttack", count: 44440, percentage: 80 },
        { theme: "advancedPawn", count: 11747, percentage: 21 },
        { theme: "doubleCheck", count: 11611, percentage: 21 },
        { theme: "mateIn2", count: 10689, percentage: 19 },
        { theme: "sacrifice", count: 7973, percentage: 14 },
        { theme: "fork", count: 7660, percentage: 14 },
      ]},
      { theme: "doubleCheck", totalPuzzles: 11933, connections: [
        { theme: "discoveredCheck", count: 11611, percentage: 97 },
        { theme: "mateIn2", count: 4678, percentage: 39 },
        { theme: "advancedPawn", count: 3682, percentage: 31 },
        { theme: "sacrifice", count: 3309, percentage: 28 },
        { theme: "mateIn3", count: 3051, percentage: 26 },
        { theme: "smotheredMate", count: 2030, percentage: 17 },
        { theme: "promotion", count: 1770, percentage: 15 },
      ]},
    ],
    topConnections: [
      { theme1: "attraction", theme2: "sacrifice", count: 39388, percentage: 59 },
      { theme1: "mateIn2", theme2: "sacrifice", count: 33659, percentage: 32 },
      { theme1: "advancedPawn", theme2: "promotion", count: 33386, percentage: 100 },
      { theme1: "mateIn3", theme2: "sacrifice", count: 27164, percentage: 52 },
      { theme1: "attraction", theme2: "fork", count: 24648, percentage: 37 },
      { theme1: "fork", theme2: "sacrifice", count: 22257, percentage: 21 },
      { theme1: "attraction", theme2: "mateIn2", count: 13074, percentage: 19 },
      { theme1: "mateIn2", theme2: "pin", count: 12301, percentage: 12 },
      { theme1: "exposedKing", theme2: "fork", count: 12276, percentage: 31 },
      { theme1: "backRankMate", theme2: "sacrifice", count: 10084, percentage: 50 },
      { theme1: "backRankMate", theme2: "mateIn3", count: 9859, percentage: 49 },
      { theme1: "fork", theme2: "mateIn2", count: 9373, percentage: 5 },
      { theme1: "attraction", theme2: "mateIn3", count: 8725, percentage: 17 },
      { theme1: "backRankMate", theme2: "mateIn2", count: 8485, percentage: 42 },
      { theme1: "deflection", theme2: "mateIn2", count: 7949, percentage: 10 },
      { theme1: "pin", theme2: "sacrifice", count: 7354, percentage: 7 },
      { theme1: "attraction", theme2: "exposedKing", count: 7326, percentage: 19 },
      { theme1: "attraction", theme2: "deflection", count: 6705, percentage: 10 },
      { theme1: "mateIn3", theme2: "exposedKing", count: 6616, percentage: 17 },
      { theme1: "pin", theme2: "mateIn1", count: 6535, percentage: 7 },
      { theme1: "quietMove", theme2: "advancedPawn", count: 6269, percentage: 8 },
      { theme1: "deflection", theme2: "fork", count: 5954, percentage: 8 },
      { theme1: "mateIn2", theme2: "advancedPawn", count: 5908, percentage: 7 },
      { theme1: "deflection", theme2: "pin", count: 5861, percentage: 8 },
      { theme1: "discoveredAttack", theme2: "mateIn2", count: 5675, percentage: 7 },
      { theme1: "deflection", theme2: "advancedPawn", count: 5208, percentage: 7 },
      { theme1: "discoveredAttack", theme2: "fork", count: 5112, percentage: 6 },
      { theme1: "sacrifice", theme2: "advancedPawn", count: 4830, percentage: 6 },
      { theme1: "discoveredAttack", theme2: "pin", count: 4825, percentage: 6 },
      { theme1: "discoveredAttack", theme2: "sacrifice", count: 4355, percentage: 5 },
      { theme1: "discoveredAttack", theme2: "deflection", count: 3979, percentage: 5 },
      { theme1: "hangingPiece", theme2: "mateIn1", count: 3783, percentage: 8 },
      { theme1: "smotheredMate", theme2: "mateIn1", count: 2076, percentage: 2 },
      { theme1: "discoveredAttack", theme2: "discoveredCheck", count: 44440, percentage: 29 },
      { theme1: "fork", theme2: "attraction", count: 86164, percentage: 22 },
      { theme1: "fork", theme2: "sacrifice", count: 76885, percentage: 20 },
      { theme1: "fork", theme2: "exposedKing", count: 41468, percentage: 11 },
      { theme1: "pin", theme2: "sacrifice", count: 24621, percentage: 12 },
      { theme1: "pin", theme2: "deflection", count: 19841, percentage: 10 },
      { theme1: "pin", theme2: "attraction", count: 17324, percentage: 9 },
      { theme1: "deflection", theme2: "advancedPawn", count: 24426, percentage: 13 },
      { theme1: "deflection", theme2: "attraction", count: 23902, percentage: 13 },
      { theme1: "deflection", theme2: "exposedKing", count: 19373, percentage: 10 },
      { theme1: "skewer", theme2: "exposedKing", count: 12037, percentage: 15 },
      { theme1: "skewer", theme2: "deflection", count: 8344, percentage: 10 },
      { theme1: "skewer", theme2: "attraction", count: 6243, percentage: 8 },
    ]
  }
];

// Node position calculation
interface NodePosition {
  x: number;
  y: number;
  theme: string;
  puzzles: number;
  radius: number;
}

function calculateNodePositions(themes: ThemeData[], width: number, height: number): NodePosition[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.38;

  // Sort by puzzle count for sizing
  const sorted = [...themes].sort((a, b) => b.totalPuzzles - a.totalPuzzles);
  const maxPuzzles = sorted[0]?.totalPuzzles || 1;

  return sorted.map((theme, index) => {
    // Place in concentric circles based on size
    const tier = index < 5 ? 0 : index < 10 ? 1 : 2;
    const tierRadius = maxRadius * (0.3 + tier * 0.35);

    // Position within tier
    const tierThemes = sorted.filter((_, i) => {
      if (tier === 0) return i < 5;
      if (tier === 1) return i >= 5 && i < 10;
      return i >= 10;
    });
    const tierIndex = tier === 0 ? index : tier === 1 ? index - 5 : index - 10;
    const angleOffset = tier * Math.PI / 6;
    const angle = (tierIndex / tierThemes.length) * Math.PI * 2 + angleOffset - Math.PI / 2;

    // Node size based on puzzle count
    const sizeRatio = Math.sqrt(theme.totalPuzzles / maxPuzzles);
    const radius = 12 + sizeRatio * 28;

    return {
      x: centerX + Math.cos(angle) * tierRadius,
      y: centerY + Math.sin(angle) * tierRadius,
      theme: theme.theme,
      puzzles: theme.totalPuzzles,
      radius,
    };
  });
}

export default function ThemeConnectionsPage() {
  const [selectedBracket, setSelectedBracket] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Puzzle exploration state
  const [exploreState, setExploreState] = useState<ExploreState | null>(null);
  const [showExplorer, setShowExplorer] = useState(false);

  const currentData = THEME_DATA[selectedBracket];

  // Load puzzles for a theme connection
  const explorePuzzles = async (theme1: string, theme2: string, excludedThemes: string[] = []) => {
    setShowExplorer(true);
    setExploreState({
      theme1,
      theme2,
      puzzles: [],
      currentIndex: 0,
      loading: true,
      currentFen: '',
      moveIndex: 0,
      playerColor: 'white',
      lastMoveSquares: null,
      excludedThemes,
    });

    try {
      const bracket = THEME_DATA[selectedBracket].bracket;
      const excludeParam = excludedThemes.length > 0 ? `&exclude=${excludedThemes.join(',')}` : '';
      const res = await fetch(`/api/theme-puzzles?theme1=${theme1}&theme2=${theme2}&bracket=${bracket}&limit=20${excludeParam}`);
      const data = await res.json();

      if (data.puzzles && data.puzzles.length > 0) {
        const puzzle = data.puzzles[0];
        setExploreState({
          theme1,
          theme2,
          puzzles: data.puzzles,
          currentIndex: 0,
          loading: false,
          currentFen: puzzle.puzzleFen,
          moveIndex: 0,
          playerColor: puzzle.playerColor,
          lastMoveSquares: { from: puzzle.lastMoveFrom, to: puzzle.lastMoveTo },
          excludedThemes,
        });
      } else {
        setExploreState(prev => prev ? { ...prev, loading: false } : null);
      }
    } catch (err) {
      console.error('Failed to load puzzles:', err);
      setExploreState(prev => prev ? { ...prev, loading: false } : null);
    }
  };

  // Navigate to a specific puzzle
  const goToPuzzle = (index: number) => {
    if (!exploreState || index < 0 || index >= exploreState.puzzles.length) return;

    const puzzle = exploreState.puzzles[index];
    setExploreState({
      ...exploreState,
      currentIndex: index,
      currentFen: puzzle.puzzleFen,
      moveIndex: 0,
      playerColor: puzzle.playerColor,
      lastMoveSquares: { from: puzzle.lastMoveFrom, to: puzzle.lastMoveTo },
    });
  };

  // Navigate moves through the solution
  const goToMove = (moveIdx: number) => {
    if (!exploreState) return;
    const puzzle = exploreState.puzzles[exploreState.currentIndex];
    if (!puzzle) return;

    // Clamp to valid range: 0 to solutionMoves.length
    const idx = Math.max(0, Math.min(moveIdx, puzzle.solutionMoves.length));

    // Rebuild position by replaying moves
    const chess = new Chess(puzzle.puzzleFen);
    let lastFrom = puzzle.lastMoveFrom;
    let lastTo = puzzle.lastMoveTo;

    // Replay solution moves up to idx
    const moveList = puzzle.moves.split(' ');
    for (let i = 0; i < idx; i++) {
      const uci = moveList[i + 1]; // +1 because first move is setup
      if (!uci) break;
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci[4];
      try {
        chess.move({ from, to, promotion });
        lastFrom = from;
        lastTo = to;
      } catch {
        break;
      }
    }

    setExploreState({
      ...exploreState,
      currentFen: chess.fen(),
      moveIndex: idx,
      lastMoveSquares: { from: lastFrom, to: lastTo },
    });
  };
  const nodes = calculateNodePositions(currentData.themes, dimensions.width, dimensions.height);

  // Get node by theme name
  const getNode = useCallback((theme: string) => nodes.find(n => n.theme === theme), [nodes]);

  // Get connections for a theme
  const getConnections = useCallback((theme: string) => {
    const themeData = currentData.themes.find(t => t.theme === theme);
    return themeData?.connections || [];
  }, [currentData]);

  // Check if a connection should be highlighted
  const isConnectionHighlighted = useCallback((theme1: string, theme2: string) => {
    if (!selectedTheme && !hoveredTheme) return false;
    const activeTheme = selectedTheme || hoveredTheme;
    const connections = getConnections(activeTheme!);
    return activeTheme === theme1 || activeTheme === theme2 ||
           connections.some(c => c.theme === theme1 || c.theme === theme2);
  }, [selectedTheme, hoveredTheme, getConnections]);

  // Resize handler
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement;
        if (parent) {
          setDimensions({
            width: parent.clientWidth,
            height: Math.min(parent.clientHeight, 650),
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate connections to draw
  const connections: { from: NodePosition; to: NodePosition; count: number; percentage: number }[] = [];
  const drawnPairs = new Set<string>();

  currentData.themes.forEach(theme => {
    const fromNode = getNode(theme.theme);
    if (!fromNode) return;

    theme.connections.forEach(conn => {
      const pairKey = [theme.theme, conn.theme].sort().join('-');
      if (drawnPairs.has(pairKey)) return;
      drawnPairs.add(pairKey);

      const toNode = getNode(conn.theme);
      if (!toNode) return;

      if (conn.count > 100) { // Show more connections (lowered threshold)
        connections.push({
          from: fromNode,
          to: toNode,
          count: conn.count,
          percentage: conn.percentage,
        });
      }
    });
  });

  // Sort connections by count for layering
  connections.sort((a, b) => a.count - b.count);

  const activeTheme = selectedTheme || hoveredTheme;
  const activeThemeData = activeTheme ? currentData.themes.find(t => t.theme === activeTheme) : null;

  return (
    <div className="min-h-screen text-white" style={{ background: '#0A1214' }}>
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight" style={{ fontFamily: 'system-ui' }}>
                Theme <span className="font-semibold">Constellation</span>
              </h1>
              <p className="text-sm text-white/40 mt-1">
                How chess puzzle themes naturally interconnect
              </p>
            </div>

            {/* Bracket selector */}
            <div className="flex gap-2">
              {THEME_DATA.map((bracket, index) => (
                <button
                  key={bracket.bracket}
                  onClick={() => {
                    setSelectedBracket(index);
                    setSelectedTheme(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedBracket === index
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {bracket.ratingRange}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Visualization */}
        <div className="flex-1 relative">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
          >
            {/* Glow filter */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Gradient for connections */}
              {nodes.map(node => (
                <radialGradient key={`grad-${node.theme}`} id={`grad-${node.theme}`}>
                  <stop offset="0%" stopColor={getThemeColor(node.theme)} stopOpacity="1"/>
                  <stop offset="100%" stopColor={getThemeColor(node.theme)} stopOpacity="0.3"/>
                </radialGradient>
              ))}
            </defs>

            {/* Connections */}
            <g className="connections">
              {connections.map((conn, index) => {
                const isHighlighted = activeTheme && (
                  conn.from.theme === activeTheme || conn.to.theme === activeTheme
                );
                const opacity = activeTheme
                  ? isHighlighted ? 0.8 : 0.05
                  : Math.min(0.4, conn.count / 50000);
                const strokeWidth = Math.max(1, Math.min(8, conn.count / 5000));

                return (
                  <line
                    key={`${conn.from.theme}-${conn.to.theme}`}
                    x1={conn.from.x}
                    y1={conn.from.y}
                    x2={conn.to.x}
                    y2={conn.to.y}
                    stroke={isHighlighted ? getThemeColor(activeTheme!) : '#ffffff'}
                    strokeWidth={isHighlighted ? strokeWidth * 1.5 : strokeWidth}
                    strokeOpacity={opacity}
                    className="transition-all duration-300"
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {nodes.map(node => {
                const isActive = activeTheme === node.theme;
                const isConnected = activeTheme && getConnections(activeTheme).some(c => c.theme === node.theme);
                const shouldDim = activeTheme && !isActive && !isConnected;

                return (
                  <g
                    key={node.theme}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer transition-all duration-300"
                    style={{ opacity: shouldDim ? 0.2 : 1 }}
                    onClick={() => setSelectedTheme(selectedTheme === node.theme ? null : node.theme)}
                    onMouseEnter={() => setHoveredTheme(node.theme)}
                    onMouseLeave={() => setHoveredTheme(null)}
                  >
                    {/* Outer glow */}
                    {(isActive || isConnected) && (
                      <circle
                        r={node.radius + 8}
                        fill={getThemeColor(node.theme)}
                        opacity={0.2}
                        filter="url(#glow)"
                      />
                    )}

                    {/* Main circle */}
                    <circle
                      r={node.radius}
                      fill={getThemeColor(node.theme)}
                      opacity={isActive ? 1 : 0.85}
                      stroke={isActive ? '#fff' : 'transparent'}
                      strokeWidth={2}
                      className="transition-all duration-200"
                    />

                    {/* Label */}
                    <text
                      y={node.radius + 16}
                      textAnchor="middle"
                      fill={shouldDim ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)'}
                      fontSize="11"
                      fontWeight="500"
                      className="pointer-events-none select-none"
                      style={{ fontFamily: 'system-ui' }}
                    >
                      {THEME_NAMES[node.theme] || node.theme}
                    </text>

                    {/* Puzzle count (on hover/active) */}
                    {(isActive || (hoveredTheme === node.theme && !selectedTheme)) && (
                      <text
                        y={4}
                        textAnchor="middle"
                        fill="rgba(0,0,0,0.8)"
                        fontSize="10"
                        fontWeight="600"
                        className="pointer-events-none select-none"
                        style={{ fontFamily: 'system-ui' }}
                      >
                        {(node.puzzles / 1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Stats overlay */}
          <div className="absolute bottom-4 left-4 text-xs text-white/40">
            {currentData.totalPuzzles.toLocaleString()} puzzles analyzed
          </div>
        </div>

        {/* Side panel */}
        <div className="w-80 border-l border-white/5 bg-black/20 overflow-auto">
          <div className="p-5">
            {activeThemeData ? (
              <>
                {/* Selected theme header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getThemeColor(activeThemeData.theme) }}
                    />
                    <h2 className="text-lg font-semibold">
                      {THEME_NAMES[activeThemeData.theme] || activeThemeData.theme}
                    </h2>
                  </div>
                  <p className="text-sm text-white/50">
                    {activeThemeData.totalPuzzles.toLocaleString()} puzzles
                  </p>
                </div>

                {/* Connections */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-white/30 mb-3">
                    Strongest Connections
                  </h3>
                  <div className="space-y-2">
                    {activeThemeData.connections
                      .filter(c => c.percentage > 0)
                      .slice(0, 8)
                      .map(conn => (
                        <div
                          key={conn.theme}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setSelectedTheme(conn.theme)}
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getThemeColor(conn.theme) }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {THEME_NAMES[conn.theme] || conn.theme}
                              </div>
                              <div className="text-xs text-white/40">
                                {conn.count.toLocaleString()} shared
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className="text-sm font-bold"
                                style={{ color: getThemeColor(conn.theme) }}
                              >
                                {conn.percentage}%
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              explorePuzzles(activeThemeData.theme, conn.theme);
                            }}
                            className="mt-2 w-full py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded transition-colors"
                          >
                            Explore Puzzles →
                          </button>
                        </div>
                      ))}
                  </div>

                  {activeThemeData.connections.filter(c => c.percentage > 0).length === 0 && (
                    <p className="text-sm text-white/30 italic">
                      No significant connections at this level
                    </p>
                  )}
                </div>

                {/* Insight */}
                <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">
                    Curriculum Insight
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {activeThemeData.connections[0]?.percentage >= 50 ? (
                      <>
                        <span className="font-semibold" style={{ color: getThemeColor(activeThemeData.connections[0].theme) }}>
                          {THEME_NAMES[activeThemeData.connections[0].theme]}
                        </span>
                        {' '}is a natural prerequisite — {activeThemeData.connections[0].percentage}% overlap suggests teaching it first.
                      </>
                    ) : activeThemeData.connections.length > 0 ? (
                      <>
                        This theme has moderate connections — teach as standalone with review integration.
                      </>
                    ) : (
                      <>
                        This is an independent theme — teach as a focused section without dependencies.
                      </>
                    )}
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Default view - top connections */}
                <h2 className="text-lg font-semibold mb-4">
                  Top Connections
                </h2>
                <p className="text-sm text-white/50 mb-6">
                  Click any theme to explore its relationships
                </p>

                <div className="space-y-2">
                  {currentData.topConnections.slice(0, 15).map((conn, index) => (
                    <div
                      key={`${conn.theme1}-${conn.theme2}-${index}`}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getThemeColor(conn.theme1) }}
                        />
                        <span className="text-sm font-medium">
                          {THEME_NAMES[conn.theme1] || conn.theme1}
                        </span>
                        <span className="text-white/30">+</span>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getThemeColor(conn.theme2) }}
                        />
                        <span className="text-sm font-medium">
                          {THEME_NAMES[conn.theme2] || conn.theme2}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-white/40">
                        <span>{conn.count.toLocaleString()} puzzles</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white/60">{conn.percentage}%</span>
                          <button
                            onClick={() => explorePuzzles(conn.theme1, conn.theme2)}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white/70 hover:text-white transition-colors"
                          >
                            Explore
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Puzzle Explorer Modal */}
      {showExplorer && exploreState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D1A1F] border border-white/10 rounded-2xl w-[900px] max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getThemeColor(exploreState.theme1) }}
                  />
                  <span className="font-medium">{THEME_NAMES[exploreState.theme1] || exploreState.theme1}</span>
                </div>
                <span className="text-white/30">+</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getThemeColor(exploreState.theme2) }}
                  />
                  <span className="font-medium">{THEME_NAMES[exploreState.theme2] || exploreState.theme2}</span>
                </div>
              </div>
              <button
                onClick={() => setShowExplorer(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {exploreState.loading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="mt-4 text-white/50">Loading puzzles...</p>
              </div>
            ) : exploreState.puzzles.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-white/50">No puzzles found with both themes.</p>
              </div>
            ) : (() => {
              const currentPuzzle = exploreState.puzzles[exploreState.currentIndex];
              const totalMoves = currentPuzzle?.solutionMoves?.length || 0;

              // Build square styles for last move highlight
              const squareStyles: Record<string, React.CSSProperties> = {};
              if (exploreState.lastMoveSquares) {
                squareStyles[exploreState.lastMoveSquares.from] = { backgroundColor: 'rgba(255, 255, 0, 0.3)' };
                squareStyles[exploreState.lastMoveSquares.to] = { backgroundColor: 'rgba(255, 255, 0, 0.5)' };
              }

              return (
              <div className="flex">
                {/* Chessboard Section */}
                <div className="flex-1 p-6">
                  {/* Turn indicator */}
                  <div className="text-center mb-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      exploreState.playerColor === 'white' ? 'bg-white text-black' : 'bg-gray-800 text-white border border-white/20'
                    }`}>
                      <span className={`w-3 h-3 rounded-full ${exploreState.playerColor === 'white' ? 'bg-gray-800' : 'bg-white'}`} />
                      {exploreState.playerColor === 'white' ? 'White' : 'Black'} to move
                    </span>
                    {exploreState.moveIndex === 0 && (
                      <p className="text-xs text-white/40 mt-1">
                        Setup: {currentPuzzle?.setupMove}
                      </p>
                    )}
                  </div>

                  <div className="w-full max-w-[400px] mx-auto">
                    <Chessboard
                      options={{
                        position: exploreState.currentFen,
                        boardOrientation: exploreState.playerColor,
                        squareStyles,
                        boardStyle: { borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' },
                        darkSquareStyle: { backgroundColor: '#779952' },
                        lightSquareStyle: { backgroundColor: '#edeed1' },
                      }}
                    />
                  </div>

                  {/* Move Navigation */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToMove(0)}
                      disabled={exploreState.moveIndex === 0}
                      className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => goToMove(exploreState.moveIndex - 1)}
                      disabled={exploreState.moveIndex === 0}
                      className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="px-4 text-sm text-white/50">
                      Move {exploreState.moveIndex} / {totalMoves}
                    </span>
                    <button
                      onClick={() => goToMove(exploreState.moveIndex + 1)}
                      disabled={exploreState.moveIndex >= totalMoves}
                      className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => goToMove(totalMoves)}
                      disabled={exploreState.moveIndex >= totalMoves}
                      className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Move List */}
                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-white/40 mb-2">Solution:</div>
                    <div className="flex flex-wrap gap-1">
                      {currentPuzzle?.solutionMoves?.map((move, i) => {
                        const isPlayerMove = i % 2 === 0;
                        const moveNum = Math.floor(i / 2) + 1;
                        return (
                          <button
                            key={i}
                            onClick={() => goToMove(i + 1)}
                            className={`px-2 py-1 rounded text-sm transition-colors ${
                              exploreState.moveIndex === i + 1
                                ? 'bg-white text-black font-bold'
                                : 'hover:bg-white/10'
                            } ${isPlayerMove ? 'text-white' : 'text-white/60'}`}
                          >
                            {isPlayerMove && <span className="text-white/40 mr-1">{moveNum}.</span>}
                            {!isPlayerMove && <span className="text-white/40 mr-1">...</span>}
                            {move}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Info Panel */}
                <div className="w-72 border-l border-white/10 p-4 overflow-auto max-h-[70vh]">
                  {/* Filter Toggles */}
                  <div className="mb-6">
                    <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Exclude Patterns</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {FILTER_THEMES
                        .filter(t => t !== exploreState.theme1 && t !== exploreState.theme2)
                        .map(theme => {
                          const isExcluded = exploreState.excludedThemes.includes(theme);
                          return (
                            <button
                              key={theme}
                              onClick={() => {
                                const newExcluded = isExcluded
                                  ? exploreState.excludedThemes.filter(t => t !== theme)
                                  : [...exploreState.excludedThemes, theme];
                                setExploreState(prev => prev ? { ...prev, excludedThemes: newExcluded } : null);
                              }}
                              className={`px-2 py-1 text-xs rounded-full transition-all ${
                                isExcluded
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 line-through'
                                  : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                              }`}
                            >
                              {THEME_NAMES[theme] || theme}
                            </button>
                          );
                        })}
                    </div>
                    <button
                      onClick={() => explorePuzzles(exploreState.theme1, exploreState.theme2, exploreState.excludedThemes)}
                      className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium rounded-lg transition-colors text-sm border border-blue-500/30"
                    >
                      ↻ Refresh Puzzles
                    </button>
                  </div>

                  {/* Puzzle Info */}
                  <div className="mb-6">
                    <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Puzzle</h3>
                    <p className="font-mono text-sm">{exploreState.puzzles[exploreState.currentIndex]?.puzzleId}</p>
                    <p className="text-sm text-white/50 mt-1">
                      Rating: {exploreState.puzzles[exploreState.currentIndex]?.rating}
                    </p>
                    <a
                      href={`https://lichess.org/training/${exploreState.puzzles[exploreState.currentIndex]?.puzzleId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm text-blue-400 hover:underline"
                    >
                      View on Lichess →
                    </a>
                  </div>

                  {/* All Themes */}
                  <div className="mb-6">
                    <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">All Themes</h3>
                    <div className="flex flex-wrap gap-1">
                      {exploreState.puzzles[exploreState.currentIndex]?.themes.map(theme => (
                        <span
                          key={theme}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: getThemeColor(theme) + '30',
                            color: getThemeColor(theme),
                            border: `1px solid ${getThemeColor(theme)}50`
                          }}
                        >
                          {THEME_NAMES[theme] || theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Puzzle Navigator */}
                  <div className="mb-6">
                    <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">
                      Puzzles ({exploreState.currentIndex + 1} / {exploreState.puzzles.length})
                    </h3>
                    <div className="flex gap-1 flex-wrap">
                      {exploreState.puzzles.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goToPuzzle(i)}
                          className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                            i === exploreState.currentIndex
                              ? 'bg-white text-black'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Rating Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => {
                        console.log('GOOD:', currentPuzzle?.puzzleId, exploreState.theme1, '+', exploreState.theme2);
                        // Auto-advance to next puzzle
                        if (exploreState.currentIndex < exploreState.puzzles.length - 1) {
                          goToPuzzle(exploreState.currentIndex + 1);
                        }
                      }}
                      className="flex-1 py-3 bg-[#58CC02] hover:bg-[#4CAD02] text-black font-bold rounded-lg transition-colors"
                    >
                      ✓ Good
                    </button>
                    <button
                      onClick={() => {
                        console.log('NOT GOOD:', currentPuzzle?.puzzleId, exploreState.theme1, '+', exploreState.theme2);
                        // Auto-advance to next puzzle
                        if (exploreState.currentIndex < exploreState.puzzles.length - 1) {
                          goToPuzzle(exploreState.currentIndex + 1);
                        }
                      }}
                      className="flex-1 py-3 bg-[#FF4B4B] hover:bg-[#E04343] text-white font-bold rounded-lg transition-colors"
                    >
                      ✗ Not Good
                    </button>
                  </div>

                  {/* Copy for Discussion */}
                  <button
                    onClick={() => {
                      const p = currentPuzzle;
                      if (!p) return;
                      const text = `**Puzzle ${p.puzzleId}** (Rating: ${p.rating})
https://lichess.org/training/${p.puzzleId}

**Exploring:** ${THEME_NAMES[exploreState.theme1] || exploreState.theme1} + ${THEME_NAMES[exploreState.theme2] || exploreState.theme2}

**Setup:** ${p.setupMove}
**Solution:** ${p.solutionMoves.join(' ')}

**All themes:** ${p.themes.join(', ')}`;
                      navigator.clipboard.writeText(text);
                      alert('Copied! Paste this into our chat.');
                    }}
                    className="w-full mb-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Copy for Discussion
                  </button>

                  {/* Analysis Question */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <h3 className="text-amber-400 font-medium mb-2">Question for Analysis</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Does <strong style={{ color: getThemeColor(exploreState.theme1) }}>{THEME_NAMES[exploreState.theme1]}</strong> actually
                      {' '}enable or connect to{' '}
                      <strong style={{ color: getThemeColor(exploreState.theme2) }}>{THEME_NAMES[exploreState.theme2]}</strong> in this puzzle?
                    </p>
                    <p className="text-xs text-white/40 mt-2">
                      Step through the moves to see if Theme A leads to Theme B, or if they are just incidentally tagged together.
                    </p>
                  </div>
                </div>
              </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
