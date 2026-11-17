// GENERATED — do not edit by hand. Source: hikaru's real chess.com blitz and bullet games.
import type { OpeningLesson } from '@/types/opening-lesson'

const HIKARU_CARO_LESSONS: Record<string, OpeningLesson> = {
  "hc-1": {
    "id": "hc-1",
    "title": "Two Knights",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Hikaru's answer to the Caro-Kann. He skips d4 and brings both knights out first. Every move here comes from his real blitz and bullet games."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Open with 1.e4. Black answers with the Caro-Kann.",
        "highlightSquares": [
          "e2",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Play e4.",
        "hint": "Pawn e2 to e4.",
        "correctFeedback": "e4. Black plays c6, the Caro-Kann.",
        "wrongFeedback": "Play e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "Skip the usual d4. Hikaru develops the knight first with Nc3.",
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Play Nc3.",
        "hint": "Knight b1 to c3.",
        "correctFeedback": "Nc3. Black plays d5 anyway.",
        "wrongFeedback": "Play Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "Develop the second knight with Nf3. This is the Two Knights setup against the Caro-Kann.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Play Nf3.",
        "hint": "Knight g1 to f3.",
        "correctFeedback": "Nf3. Black takes on e4.",
        "wrongFeedback": "Play Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Recall: e4, Nc3, Nf3."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "e4, Nc3, Nf3. Two knights out, and Black has given up the center by taking on e4."
      }
    ]
  },
  "hc-2": {
    "id": "hc-2",
    "title": "Knight to g3",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "Take back on e4, then avoid the knight trade. Black will try to chase your knight with the h-pawn."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "Take back on e4 with the knight.",
        "highlightSquares": [
          "c3",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Capture Nxe4.",
        "hint": "Knight c3 takes e4.",
        "correctFeedback": "Nxe4. Black challenges it with Nf6.",
        "wrongFeedback": "Play Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "text": "Don't trade knights. Step aside to g3. Hikaru keeps more pieces on the board.",
        "highlightSquares": [
          "e4",
          "g3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "correctMove": "Ng3",
        "prompt": "Play Ng3.",
        "hint": "Knight e4 to g3.",
        "correctFeedback": "Ng3. Black pushes h5, threatening to chase the knight.",
        "wrongFeedback": "Play Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/7p/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "5...h5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/7p/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "Ignore it and develop: Bc4, aiming at f7.",
        "highlightSquares": [
          "f1",
          "c4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/7p/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "correctMove": "Bc4",
        "prompt": "Play Bc4.",
        "hint": "Bishop f1 to c4.",
        "correctFeedback": "Bc4. Black pushes h4, attacking your knight.",
        "wrongFeedback": "Play Bc4.",
        "orientation": "white",
        "postMoveArrow": [
          "c4",
          "f7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "6...h4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h5",
          "h4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "Recall: Nxe4, Ng3, Bc4."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "correctMove": "Ng3",
        "prompt": "Your move.",
        "hint": "Ng3.",
        "correctFeedback": "Ng3.",
        "wrongFeedback": "Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/7p/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "5...h5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/7p/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "Nxe4, Ng3, Bc4. Black pushes h4 to kick the knight. Next comes Hikaru's strangest move."
      }
    ]
  },
  "hc-3": {
    "id": "hc-3",
    "title": "The Nf1 Retreat",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "Black's h-pawn hits your knight on g3. Hikaru doesn't go forward. He goes all the way back to f1."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "correctMove": "Ng3",
        "prompt": "Your move.",
        "hint": "Ng3.",
        "correctFeedback": "Ng3.",
        "wrongFeedback": "Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/7p/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "5...h5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/7p/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "6...h4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h5",
          "h4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "Hikaru's strangest move: back to f1! The knight is safe there and can come out again to e3. He played it every single time here.",
        "highlightSquares": [
          "g3",
          "f1"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "correctMove": "Nf1",
        "prompt": "Retreat Nf1.",
        "hint": "Knight g3 to f1.",
        "correctFeedback": "Nf1. Black keeps pushing with h3.",
        "wrongFeedback": "Play Nf1.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B5/5N1p/PPPP1PPP/R1BQKN1R w KQkq - 0 8",
        "text": "7...h3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h4",
          "h3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B5/5N1p/PPPP1PPP/R1BQKN1R w KQkq - 0 8",
        "text": "Don't let Black take on g2. Push past with g3. Now the h3 pawn is cut off.",
        "highlightSquares": [
          "g2",
          "g3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B5/5N1p/PPPP1PPP/R1BQKN1R w KQkq - 0 8",
        "correctMove": "g3",
        "prompt": "Play g3.",
        "hint": "Pawn g2 to g3.",
        "correctFeedback": "g3. Black develops Bf5.",
        "wrongFeedback": "Play g3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/5b2/2B5/5NPp/PPPP1P1P/R1BQKN1R w KQkq - 1 9",
        "text": "8...Bf5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "f5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/5b2/2B5/5NPp/PPPP1P1P/R1BQKN1R w KQkq - 1 9",
        "text": "Bring the knight back out to e3. It hits the f5 bishop.",
        "highlightSquares": [
          "f1",
          "e3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/5b2/2B5/5NPp/PPPP1P1P/R1BQKN1R w KQkq - 1 9",
        "correctMove": "Ne3",
        "prompt": "Play Ne3.",
        "hint": "Knight f1 to e3.",
        "correctFeedback": "Ne3. Black moves the bishop to e4.",
        "wrongFeedback": "Play Ne3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/8/2B1b3/4NNPp/PPPP1P1P/R1BQK2R w KQkq - 3 10",
        "text": "9...Be4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f5",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "Recall: Nf1, g3, Ne3."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "correctMove": "Nf1",
        "prompt": "Your move.",
        "hint": "Nf1.",
        "correctFeedback": "Nf1.",
        "wrongFeedback": "Nf1.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B5/5N1p/PPPP1PPP/R1BQKN1R w KQkq - 0 8",
        "text": "7...h3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h4",
          "h3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B5/5N1p/PPPP1PPP/R1BQKN1R w KQkq - 0 8",
        "correctMove": "g3",
        "prompt": "Your move.",
        "hint": "g3.",
        "correctFeedback": "g3.",
        "wrongFeedback": "g3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/5b2/2B5/5NPp/PPPP1P1P/R1BQKN1R w KQkq - 1 9",
        "text": "8...Bf5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "f5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/5b2/2B5/5NPp/PPPP1P1P/R1BQKN1R w KQkq - 1 9",
        "correctMove": "Ne3",
        "prompt": "Your move.",
        "hint": "Ne3.",
        "correctFeedback": "Ne3.",
        "wrongFeedback": "Ne3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/8/2B1b3/4NNPp/PPPP1P1P/R1BQK2R w KQkq - 3 10",
        "text": "Nf1, g3, Ne3. The knight went back and came out again, and Black's h3 pawn is stuck far from home."
      }
    ]
  },
  "hc-dev-5g6": {
    "id": "hc-dev-5g6",
    "title": "If 5...g6",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pp1p/2p2np1/8/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "Black fianchettoes with g6 instead of pushing the h-pawn. Develop simply and castle."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "correctMove": "Ng3",
        "prompt": "Your move.",
        "hint": "Ng3.",
        "correctFeedback": "Ng3.",
        "wrongFeedback": "Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pp1p/2p2np1/8/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "5...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pp1p/2p2np1/8/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "Develop Bc4, aiming at f7.",
        "highlightSquares": [
          "f1",
          "c4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pp1p/2p2np1/8/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "correctMove": "Bc4",
        "prompt": "Play Bc4.",
        "hint": "Bishop f1 to c4.",
        "correctFeedback": "Bc4. Black puts the bishop on g7.",
        "wrongFeedback": "Play Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQK2R w KQkq - 2 7",
        "text": "6...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQK2R w KQkq - 2 7",
        "text": "Castle.",
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQK2R w KQkq - 2 7",
        "correctMove": "O-O",
        "prompt": "Castle.",
        "hint": "King e1 to g1.",
        "correctFeedback": "O-O. Black castles too.",
        "wrongFeedback": "Play O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQ1RK1 w - - 4 8",
        "text": "7...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQ1RK1 w - - 4 8",
        "text": "Put the rook on e1, the open file.",
        "highlightSquares": [
          "f1",
          "e1"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQ1RK1 w - - 4 8",
        "correctMove": "Re1",
        "prompt": "Play Re1.",
        "hint": "Rook f1 to e1.",
        "correctFeedback": "Re1. Black develops Nbd7.",
        "wrongFeedback": "Play Re1.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/pp1nppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQR1K1 w - - 6 9",
        "text": "8...Nbd7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "d7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pp1p/2p2np1/8/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "Recall: Bc4, O-O, Re1."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pp1p/2p2np1/8/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQK2R w KQkq - 2 7",
        "text": "6...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQK2R w KQkq - 2 7",
        "correctMove": "O-O",
        "prompt": "Your move.",
        "hint": "O-O.",
        "correctFeedback": "O-O.",
        "wrongFeedback": "O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQ1RK1 w - - 4 8",
        "text": "7...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQ1RK1 w - - 4 8",
        "correctMove": "Re1",
        "prompt": "Your move.",
        "hint": "Re1.",
        "correctFeedback": "Re1.",
        "wrongFeedback": "Re1.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/pp1nppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQR1K1 w - - 6 9",
        "text": "Bc4, O-O, Re1. Everything is developed and the rook backs up a future push in the center."
      }
    ]
  },
  "hc-dev-5bg4": {
    "id": "hc-dev-5bg4",
    "title": "If 5...Bg4",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/8/6b1/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 3 6",
        "text": "Black pins your f3 knight with Bg4. Develop, then ask the bishop what it wants with h3."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "correctMove": "Ng3",
        "prompt": "Your move.",
        "hint": "Ng3.",
        "correctFeedback": "Ng3.",
        "wrongFeedback": "Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/8/6b1/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 3 6",
        "text": "5...Bg4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "g4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/8/6b1/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 3 6",
        "text": "Develop Bc4 anyway. If Black takes on f3 instead of e6, just take back with the queen.",
        "highlightSquares": [
          "f1",
          "c4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/8/6b1/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 3 6",
        "correctMove": "Bc4",
        "prompt": "Play Bc4.",
        "hint": "Bishop f1 to c4.",
        "correctFeedback": "Bc4. Black plays e6.",
        "wrongFeedback": "Play Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B3b1/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "6...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B3b1/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "Kick the bishop with h3.",
        "highlightSquares": [
          "h2",
          "h3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B3b1/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "correctMove": "h3",
        "prompt": "Play h3.",
        "hint": "Pawn h2 to h3.",
        "correctFeedback": "h3. Black trades the bishop for your knight.",
        "wrongFeedback": "Play h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B5/5bNP/PPPP1PP1/R1BQK2R w KQkq - 0 8",
        "text": "7...Bxf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g4",
          "f3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B5/5bNP/PPPP1PP1/R1BQK2R w KQkq - 0 8",
        "text": "Take back with the queen. Now you have both bishops.",
        "highlightSquares": [
          "d1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B5/5bNP/PPPP1PP1/R1BQK2R w KQkq - 0 8",
        "correctMove": "Qxf3",
        "prompt": "Capture Qxf3.",
        "hint": "Queen d1 takes f3.",
        "correctFeedback": "Qxf3. Black develops Nbd7.",
        "wrongFeedback": "Play Qxf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1n1ppp/2p1pn2/8/2B5/5QNP/PPPP1PP1/R1B1K2R w KQkq - 1 9",
        "text": "8...Nbd7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "d7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/8/6b1/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 3 6",
        "text": "Recall: Bc4, h3, Qxf3."
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/8/6b1/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 3 6",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B3b1/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "6...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B3b1/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "correctMove": "h3",
        "prompt": "Your move.",
        "hint": "h3.",
        "correctFeedback": "h3.",
        "wrongFeedback": "h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B5/5bNP/PPPP1PP1/R1BQK2R w KQkq - 0 8",
        "text": "7...Bxf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g4",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B5/5bNP/PPPP1PP1/R1BQK2R w KQkq - 0 8",
        "correctMove": "Qxf3",
        "prompt": "Your move.",
        "hint": "Qxf3.",
        "correctFeedback": "Qxf3.",
        "wrongFeedback": "Qxf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1n1ppp/2p1pn2/8/2B5/5QNP/PPPP1PP1/R1B1K2R w KQkq - 1 9",
        "text": "Bc4, h3, Qxf3. You get the bishop pair and your queen is active. Hikaru scored 100% in these games."
      }
    ]
  },
  "hc-dev-3bg4": {
    "id": "hc-dev-3bg4",
    "title": "If 3...Bg4",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P1b1/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4",
        "text": "Black pins the f3 knight right away. Hikaru kicks it immediately, takes back with the queen, and fianchettoes."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P1b1/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4",
        "text": "3...Bg4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "g4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P1b1/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4",
        "text": "Kick the bishop with h3.",
        "highlightSquares": [
          "h2",
          "h3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P1b1/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4",
        "correctMove": "h3",
        "prompt": "Play h3.",
        "hint": "Pawn h2 to h3.",
        "correctFeedback": "h3. Black takes your knight.",
        "wrongFeedback": "Play h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P3/2N2b1P/PPPP1PP1/R1BQKB1R w KQkq - 0 5",
        "text": "4...Bxf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g4",
          "f3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P3/2N2b1P/PPPP1PP1/R1BQKB1R w KQkq - 0 5",
        "text": "Take back with the queen.",
        "highlightSquares": [
          "d1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P3/2N2b1P/PPPP1PP1/R1BQKB1R w KQkq - 0 5",
        "correctMove": "Qxf3",
        "prompt": "Capture Qxf3.",
        "hint": "Queen d1 takes f3.",
        "correctFeedback": "Qxf3. Black plays e6.",
        "wrongFeedback": "Play Qxf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3p4/4P3/2N2Q1P/PPPP1PP1/R1B1KB1R w KQkq - 0 6",
        "text": "5...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3p4/4P3/2N2Q1P/PPPP1PP1/R1B1KB1R w KQkq - 0 6",
        "text": "Play g3, making room for the bishop on g2.",
        "highlightSquares": [
          "g2",
          "g3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3p4/4P3/2N2Q1P/PPPP1PP1/R1B1KB1R w KQkq - 0 6",
        "correctMove": "g3",
        "prompt": "Play g3.",
        "hint": "Pawn g2 to g3.",
        "correctFeedback": "g3. Black develops Nf6.",
        "wrongFeedback": "Play g3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/3p4/4P3/2N2QPP/PPPP1P2/R1B1KB1R w KQkq - 1 7",
        "text": "6...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P1b1/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4",
        "text": "Recall: h3, Qxf3, g3."
      },
      {
        "type": "play-move",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P1b1/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4",
        "correctMove": "h3",
        "prompt": "Your move.",
        "hint": "h3.",
        "correctFeedback": "h3.",
        "wrongFeedback": "h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P3/2N2b1P/PPPP1PP1/R1BQKB1R w KQkq - 0 5",
        "text": "4...Bxf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g4",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P3/2N2b1P/PPPP1PP1/R1BQKB1R w KQkq - 0 5",
        "correctMove": "Qxf3",
        "prompt": "Your move.",
        "hint": "Qxf3.",
        "correctFeedback": "Qxf3.",
        "wrongFeedback": "Qxf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3p4/4P3/2N2Q1P/PPPP1PP1/R1B1KB1R w KQkq - 0 6",
        "text": "5...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3p4/4P3/2N2Q1P/PPPP1PP1/R1B1KB1R w KQkq - 0 6",
        "correctMove": "g3",
        "prompt": "Your move.",
        "hint": "g3.",
        "correctFeedback": "g3.",
        "wrongFeedback": "g3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/3p4/4P3/2N2QPP/PPPP1P2/R1B1KB1R w KQkq - 1 7",
        "text": "h3, Qxf3, g3. Next comes Bg2, and you have the bishop pair."
      }
    ]
  },
  "hc-test-1": {
    "id": "hc-test-1",
    "title": "Lvl 1 Test",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Test time. Play Hikaru's Anti-Caro: the Nf1 main line plus Black's three key alternatives. No hints.",
        "buttonText": "LET'S GO"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— Main line —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "correctMove": "Ng3",
        "prompt": "Your move.",
        "hint": "Ng3.",
        "correctFeedback": "Ng3.",
        "wrongFeedback": "Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/7p/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "5...h5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/7p/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "6...h4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h5",
          "h4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B4p/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "correctMove": "Nf1",
        "prompt": "Your move.",
        "hint": "Nf1.",
        "correctFeedback": "Nf1.",
        "wrongFeedback": "Nf1.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B5/5N1p/PPPP1PPP/R1BQKN1R w KQkq - 0 8",
        "text": "7...h3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h4",
          "h3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n2/8/2B5/5N1p/PPPP1PPP/R1BQKN1R w KQkq - 0 8",
        "correctMove": "g3",
        "prompt": "Your move.",
        "hint": "g3.",
        "correctFeedback": "g3.",
        "wrongFeedback": "g3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/5b2/2B5/5NPp/PPPP1P1P/R1BQKN1R w KQkq - 1 9",
        "text": "8...Bf5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "f5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/5b2/2B5/5NPp/PPPP1P1P/R1BQKN1R w KQkq - 1 9",
        "correctMove": "Ne3",
        "prompt": "Your move.",
        "hint": "Ne3.",
        "correctFeedback": "Ne3.",
        "wrongFeedback": "Ne3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2ppp1/2p2n2/8/2B1b3/4NNPp/PPPP1P1P/R1BQK2R w KQkq - 3 10",
        "text": "9...Be4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f5",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 5...g6 —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "correctMove": "Ng3",
        "prompt": "Your move.",
        "hint": "Ng3.",
        "correctFeedback": "Ng3.",
        "wrongFeedback": "Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pp1p/2p2np1/8/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "text": "5...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pp1p/2p2np1/8/8/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 0 6",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQK2R w KQkq - 2 7",
        "text": "6...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQK2R w KQkq - 2 7",
        "correctMove": "O-O",
        "prompt": "Your move.",
        "hint": "O-O.",
        "correctFeedback": "O-O.",
        "wrongFeedback": "O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQ1RK1 w - - 4 8",
        "text": "7...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/pp2ppbp/2p2np1/8/2B5/5NN1/PPPP1PPP/R1BQ1RK1 w - - 4 8",
        "correctMove": "Re1",
        "prompt": "Your move.",
        "hint": "Re1.",
        "correctFeedback": "Re1.",
        "wrongFeedback": "Re1.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 5...Bg4 —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5",
        "correctMove": "Ng3",
        "prompt": "Your move.",
        "hint": "Ng3.",
        "correctFeedback": "Ng3.",
        "wrongFeedback": "Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/8/6b1/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 3 6",
        "text": "5...Bg4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "g4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/8/6b1/5NN1/PPPP1PPP/R1BQKB1R w KQkq - 3 6",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B3b1/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "text": "6...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B3b1/5NN1/PPPP1PPP/R1BQK2R w KQkq - 0 7",
        "correctMove": "h3",
        "prompt": "Your move.",
        "hint": "h3.",
        "correctFeedback": "h3.",
        "wrongFeedback": "h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B5/5bNP/PPPP1PP1/R1BQK2R w KQkq - 0 8",
        "text": "7...Bxf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g4",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp3ppp/2p1pn2/8/2B5/5bNP/PPPP1PP1/R1BQK2R w KQkq - 0 8",
        "correctMove": "Qxf3",
        "prompt": "Your move.",
        "hint": "Qxf3.",
        "correctFeedback": "Qxf3.",
        "wrongFeedback": "Qxf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 3...Bg4 —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "e4",
        "prompt": "Your move.",
        "hint": "e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P1b1/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4",
        "text": "3...Bg4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "g4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P1b1/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4",
        "correctMove": "h3",
        "prompt": "Your move.",
        "hint": "h3.",
        "correctFeedback": "h3.",
        "wrongFeedback": "h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P3/2N2b1P/PPPP1PP1/R1BQKB1R w KQkq - 0 5",
        "text": "4...Bxf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g4",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkbnr/pp2pppp/2p5/3p4/4P3/2N2b1P/PPPP1PP1/R1BQKB1R w KQkq - 0 5",
        "correctMove": "Qxf3",
        "prompt": "Your move.",
        "hint": "Qxf3.",
        "correctFeedback": "Qxf3.",
        "wrongFeedback": "Qxf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3p4/4P3/2N2Q1P/PPPP1PP1/R1B1KB1R w KQkq - 0 6",
        "text": "5...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3p4/4P3/2N2Q1P/PPPP1PP1/R1B1KB1R w KQkq - 0 6",
        "correctMove": "g3",
        "prompt": "Your move.",
        "hint": "g3.",
        "correctFeedback": "g3.",
        "wrongFeedback": "g3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Level 1 complete. You can now play Hikaru's Anti-Caro, Nf1 retreat included."
      }
    ]
  }
}

export function getHikaruCaroLesson(id: string): OpeningLesson | undefined {
  return HIKARU_CARO_LESSONS[id]
}
