import { Chess } from 'chess.js';

interface PuzzleData {
  id: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string;
  url: string;
}

const puzzles: PuzzleData[] = [
  {
    id: "001KR",
    fen: "6Qk/p1p3pp/4N3/1p6/2q1r1n1/2B5/PP4PP/3R1R1K b - - 0 28",
    moves: "h8g8 f1f8",
    rating: 552,
    themes: "mate mateIn1 middlegame oneMove",
    url: "https://lichess.org/TaT1Zl7z/black#56"
  },
  {
    id: "0030b",
    fen: "6k1/5ppp/5nb1/pp6/6rP/5N1Q/Pq2r1P1/3R2RK b - - 4 32",
    moves: "g6e4 d1d8 f6e8 d8e8",
    rating: 605,
    themes: "backRankMate mate mateIn2 middlegame short",
    url: "https://lichess.org/mhIZR6Mc/black#64"
  },
  {
    id: "002GQ",
    fen: "5rk1/5ppp/4p3/4N3/8/1Pn5/5PPP/5RK1 w - - 0 28",
    moves: "f1c1 c3e2 g1f1 e2c1",
    rating: 654,
    themes: "crushing endgame fork short",
    url: "https://lichess.org/2K7g2pDT#55"
  },
  {
    id: "053Mo",
    fen: "8/p1k2ppp/1p1n4/2PP1P2/BK3B1P/P7/4rP2/8 b - - 0 44",
    moves: "b6c5 b4c5 e2e4 f4d6",
    rating: 764,
    themes: "crushing endgame pin short",
    url: "https://lichess.org/0lc3bx1t/black#88"
  },
  {
    id: "005N7",
    fen: "r6k/2q3pp/8/2p1n3/R1Qp4/7P/2PB1PP1/6K1 b - - 0 32",
    moves: "e5c4 a4a8 c7b8 a8b8",
    rating: 664,
    themes: "backRankMate endgame hangingPiece mate mateIn2 short",
    url: "https://lichess.org/jxZhmGhg/black#64"
  },
  {
    id: "05YD6",
    fen: "2r5/8/5k2/6p1/p3R1Pp/PpK4P/1P6/8 w - - 9 45",
    moves: "e4c4 c8c4 c3c4 f6e5",
    rating: 767,
    themes: "crushing defensiveMove endgame rookEndgame short",
    url: "https://lichess.org/yO3UGMse#89"
  },
  {
    id: "0135c",
    fen: "8/3n1k2/p3p1p1/3p2P1/2pP2N1/PrP1KP2/1P4R1/8 w - - 4 41",
    moves: "e3d2 b3b2 d2e1 b2g2",
    rating: 797,
    themes: "crushing endgame short skewer",
    url: "https://lichess.org/cKkSaaA1#81"
  },
  {
    id: "00mvr",
    fen: "7r/ppp1Nk1p/2n5/8/8/2P2pP1/P6P/R1Br1BK1 b - - 0 20",
    moves: "f7e7 c1g5 e7e6 a1d1",
    rating: 726,
    themes: "crushing discoveredAttack endgame master short",
    url: "https://lichess.org/R3FdESiy/black#40"
  },
  {
    id: "00XoP",
    fen: "6r1/p6k/1p4rp/3q1Q2/8/P7/4Rp1P/5R1K w - - 0 37",
    moves: "f5d5 g6g1 f1g1 f2g1q",
    rating: 686,
    themes: "advancedPawn endgame mate mateIn2 promotion queenRookEndgame short",
    url: "https://lichess.org/KLJMqvTZ#73"
  },
  {
    id: "00TU2",
    fen: "1k1r4/1p3Qp1/p2q3p/3N4/1b6/8/PP3PPP/2R3K1 w - - 4 22",
    moves: "d5b4 d6d1 c1d1 d8d1",
    rating: 633,
    themes: "backRankMate endgame mate mateIn2 sacrifice short",
    url: "https://lichess.org/p32396Rd#43"
  }
];

function analyzePuzzle(puzzle: PuzzleData): void {
  console.log("=".repeat(80));
  console.log(`PUZZLE ${puzzle.id} (Rating: ${puzzle.rating})`);
  console.log(`Lichess Tags: ${puzzle.themes}`);
  console.log(`URL: ${puzzle.url}`);
  console.log();

  const chess = new Chess(puzzle.fen);
  const moveList = puzzle.moves.split(' ');

  // First move is opponent's setup move
  const setupMove = moveList[0];
  const solutionMoves = moveList.slice(1);

  // Apply setup move and get SAN
  const from1 = setupMove.slice(0, 2);
  const to1 = setupMove.slice(2, 4);
  const promo1 = setupMove.length > 4 ? setupMove[4] : undefined;
  const setupSan = chess.move({ from: from1, to: to1, promotion: promo1 });

  console.log(`Setup (opponent's move): ${setupSan?.san || setupMove}`);

  // Now get solution in SAN
  const solutionSan: string[] = [];
  for (let i = 0; i < solutionMoves.length; i++) {
    const move = solutionMoves[i];
    const from = move.slice(0, 2);
    const to = move.slice(2, 4);
    const promo = move.length > 4 ? move[4] : undefined;
    const result = chess.move({ from, to, promotion: promo });
    if (result) {
      solutionSan.push(result.san);
    }
  }

  // Format with move numbers
  const playerColor = setupSan ? (chess.turn() === 'w' ? 'White' : 'Black') : 'Unknown';
  console.log(`Your color: ${playerColor === 'White' ? 'Black' : 'White'}`);
  console.log(`Solution: ${formatSolution(solutionSan)}`);

  // Analyze outcome
  if (chess.isCheckmate()) {
    console.log(`Outcome: CHECKMATE`);
  } else if (chess.isGameOver()) {
    console.log(`Outcome: Game over (stalemate/draw)`);
  } else {
    console.log(`Outcome: Material/Positional gain`);
  }

  console.log();
}

function formatSolution(moves: string[]): string {
  if (moves.length === 0) return '';
  const parts: string[] = [];
  let moveNum = 1;
  for (let i = 0; i < moves.length; i += 2) {
    if (i + 1 < moves.length) {
      parts.push(`${moveNum}.${moves[i]} ${moves[i+1]}`);
    } else {
      parts.push(`${moveNum}.${moves[i]}`);
    }
    moveNum++;
  }
  return parts.join(' ');
}

// Run analysis
for (const puzzle of puzzles) {
  analyzePuzzle(puzzle);
}
