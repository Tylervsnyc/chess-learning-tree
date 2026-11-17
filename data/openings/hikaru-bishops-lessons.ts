// GENERATED — do not edit by hand. Source: hikaru's real chess.com blitz games.
import type { OpeningLesson } from '@/types/opening-lesson'

const HIKARU_BISHOPS_LESSONS: Record<string, OpeningLesson> = {
  "hb-1": {
    "id": "hb-1",
    "title": "The Bishop's Opening",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Hikaru's 2.Bc4, the Bishop's Opening. He played it in 140 blitz games over the last two years and scored 90%. Every move here comes from those games."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Open with 1.e4.",
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
        "correctFeedback": "e4. Black answers e5.",
        "wrongFeedback": "Play e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "Skip Nf3 and put the bishop on c4 right away. Hikaru plays this in about half his blitz games after 1.e4 e5.",
        "highlightSquares": [
          "f1",
          "c4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bc4",
        "prompt": "Play Bc4.",
        "hint": "Bishop f1 to c4.",
        "correctFeedback": "Bc4. The bishop already eyes f7. Black develops Nf6.",
        "wrongFeedback": "Play Bc4.",
        "orientation": "white",
        "postMoveArrow": [
          "c4",
          "f7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "text": "Black's knight attacks e4. Defend it calmly with d3.",
        "highlightSquares": [
          "d2",
          "d3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Play d3.",
        "hint": "Pawn d2 to d3.",
        "correctFeedback": "d3. Black develops Nc6.",
        "wrongFeedback": "Play d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "text": "3...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Recall: e4, Bc4, d3."
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
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Your move.",
        "hint": "d3.",
        "correctFeedback": "d3.",
        "wrongFeedback": "d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "text": "e4, Bc4, d3. A quiet, solid start with the bishop pointed at f7. Next, Hikaru develops his knights in an unusual way."
      }
    ]
  },
  "hb-2": {
    "id": "hb-2",
    "title": "Knight to e2",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "text": "Black pins your c3 knight with Bb4. Hikaru answers with a knight move most players would never think of."
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
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Your move.",
        "hint": "d3.",
        "correctFeedback": "d3.",
        "wrongFeedback": "d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "text": "3...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "text": "Develop Nc3. Your f-pawn stays free, because the other knight hasn't gone to f3 yet.",
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "correctMove": "Nc3",
        "prompt": "Play Nc3.",
        "hint": "Knight b1 to c3.",
        "correctFeedback": "Nc3. Black pins it with Bb4.",
        "wrongFeedback": "Play Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "text": "4...Bb4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "b4"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "text": "Hikaru's knight goes to e2, not f3. If Black ever takes on c3, this knight can recapture and keep your pawns healthy.",
        "highlightSquares": [
          "g1",
          "e2"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "correctMove": "Ne2",
        "prompt": "Play Ne2.",
        "hint": "Knight g1 to e2.",
        "correctFeedback": "Ne2. Black strikes in the center with d5.",
        "wrongFeedback": "Play Ne2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2n2n2/3pp3/1bB1P3/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 6",
        "text": "5...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2n2n2/3pp3/1bB1P3/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 6",
        "text": "Take on d5.",
        "highlightSquares": [
          "e4",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/2n2n2/3pp3/1bB1P3/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 6",
        "correctMove": "exd5",
        "prompt": "Capture exd5.",
        "hint": "Pawn e4 takes d5.",
        "correctFeedback": "exd5. Black takes back with the knight.",
        "wrongFeedback": "Play exd5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2n5/3np3/1bB5/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 7",
        "text": "6...Nxd5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f6",
          "d5"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "text": "Recall: Nc3, Ne2, exd5."
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "text": "4...Bb4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "b4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "correctMove": "Ne2",
        "prompt": "Your move.",
        "hint": "Ne2.",
        "correctFeedback": "Ne2.",
        "wrongFeedback": "Ne2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2n2n2/3pp3/1bB1P3/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 6",
        "text": "5...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/2n2n2/3pp3/1bB1P3/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 6",
        "correctMove": "exd5",
        "prompt": "Your move.",
        "hint": "exd5.",
        "correctFeedback": "exd5.",
        "wrongFeedback": "exd5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2n5/3np3/1bB5/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 7",
        "text": "Nc3, Ne2, exd5. In Hikaru's games, he castles next and the position is calm and comfortable for White."
      }
    ]
  },
  "hb-dev-3c6": {
    "id": "hb-dev-3c6",
    "title": "If 3...c6",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp1p1ppp/2p2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "text": "Black plays c6, getting ready for d5 to kick your bishop. Hikaru develops and steps the bishop back before it gets hit."
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
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Your move.",
        "hint": "d3.",
        "correctFeedback": "d3.",
        "wrongFeedback": "d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp1p1ppp/2p2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "text": "3...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp1p1ppp/2p2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "text": "Develop Nf3. It attacks e5.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp1p1ppp/2p2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "correctMove": "Nf3",
        "prompt": "Play Nf3.",
        "hint": "Knight g1 to f3.",
        "correctFeedback": "Nf3. Black pushes d5, attacking your bishop.",
        "wrongFeedback": "Play Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp3ppp/2p2n2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "text": "4...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp3ppp/2p2n2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "text": "Move the bishop back to b3. It stays on the diagonal aiming at f7.",
        "highlightSquares": [
          "c4",
          "b3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp3ppp/2p2n2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "correctMove": "Bb3",
        "prompt": "Play Bb3.",
        "hint": "Bishop c4 to b3.",
        "correctFeedback": "Bb3. Black develops Bd6.",
        "wrongFeedback": "Play Bb3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pb1n2/3pp3/4P3/1B1P1N2/PPP2PPP/RNBQK2R w KQkq - 2 6",
        "text": "5...Bd6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "d6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pb1n2/3pp3/4P3/1B1P1N2/PPP2PPP/RNBQK2R w KQkq - 2 6",
        "text": "Develop Nc3, adding pressure to d5.",
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/pp3ppp/2pb1n2/3pp3/4P3/1B1P1N2/PPP2PPP/RNBQK2R w KQkq - 2 6",
        "correctMove": "Nc3",
        "prompt": "Play Nc3.",
        "hint": "Knight b1 to c3.",
        "correctFeedback": "Nc3. Black pushes d4 to kick the knight.",
        "wrongFeedback": "Play Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pb1n2/4p3/3pP3/1BNP1N2/PPP2PPP/R1BQK2R w KQkq - 0 7",
        "text": "6...d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp1p1ppp/2p2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "text": "Recall: Nf3, Bb3, Nc3."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp1p1ppp/2p2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp3ppp/2p2n2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "text": "4...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp3ppp/2p2n2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "correctMove": "Bb3",
        "prompt": "Your move.",
        "hint": "Bb3.",
        "correctFeedback": "Bb3.",
        "wrongFeedback": "Bb3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pb1n2/3pp3/4P3/1B1P1N2/PPP2PPP/RNBQK2R w KQkq - 2 6",
        "text": "5...Bd6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/pp3ppp/2pb1n2/3pp3/4P3/1B1P1N2/PPP2PPP/RNBQK2R w KQkq - 2 6",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pb1n2/4p3/3pP3/1BNP1N2/PPP2PPP/R1BQK2R w KQkq - 0 7",
        "text": "Nf3, Bb3, Nc3. The bishop is tucked on b3, still aiming at f7. Hikaru scored 100% in his 30 blitz games from 3...c6."
      }
    ]
  },
  "hb-dev-4bc5": {
    "id": "hb-dev-4bc5",
    "title": "If 4...Bc5",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "text": "Black develops the bishop to c5 instead of pinning. Hikaru plays h3 first, keeping Black's bishop off g4, then the same Ne2 idea."
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
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Your move.",
        "hint": "d3.",
        "correctFeedback": "d3.",
        "wrongFeedback": "d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "text": "3...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "text": "4...Bc5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "c5"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "text": "Play h3. It keeps Black's bishop and knight off g4.",
        "highlightSquares": [
          "h2",
          "h3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "correctMove": "h3",
        "prompt": "Play h3.",
        "hint": "Pawn h2 to h3.",
        "correctFeedback": "h3. Black plays d6.",
        "wrongFeedback": "Play h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP3P/PPP2PP1/R1BQK1NR w KQkq - 0 6",
        "text": "5...d6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP3P/PPP2PP1/R1BQK1NR w KQkq - 0 6",
        "text": "Same idea as the main line: the knight goes to e2.",
        "highlightSquares": [
          "g1",
          "e2"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP3P/PPP2PP1/R1BQK1NR w KQkq - 0 6",
        "correctMove": "Nge2",
        "prompt": "Play Nge2.",
        "hint": "Knight g1 to e2.",
        "correctFeedback": "Nge2. Black goes after your bishop with Na5.",
        "wrongFeedback": "Play Nge2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/3p1n2/n1b1p3/2B1P3/2NP3P/PPP1NPP1/R1BQK2R w KQkq - 2 7",
        "text": "6...Na5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c6",
          "a5"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/3p1n2/n1b1p3/2B1P3/2NP3P/PPP1NPP1/R1BQK2R w KQkq - 2 7",
        "text": "Castle. If Black takes the bishop, you recapture with the d-pawn.",
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/3p1n2/n1b1p3/2B1P3/2NP3P/PPP1NPP1/R1BQK2R w KQkq - 2 7",
        "correctMove": "O-O",
        "prompt": "Castle.",
        "hint": "King e1 to g1.",
        "correctFeedback": "O-O. Black takes the bishop with Nxc4.",
        "wrongFeedback": "Play O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/3p1n2/2b1p3/2n1P3/2NP3P/PPP1NPP1/R1BQ1RK1 w kq - 0 8",
        "text": "7...Nxc4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "a5",
          "c4"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "text": "Recall: h3, Nge2, O-O."
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "correctMove": "h3",
        "prompt": "Your move.",
        "hint": "h3.",
        "correctFeedback": "h3.",
        "wrongFeedback": "h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP3P/PPP2PP1/R1BQK1NR w KQkq - 0 6",
        "text": "5...d6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP3P/PPP2PP1/R1BQK1NR w KQkq - 0 6",
        "correctMove": "Nge2",
        "prompt": "Your move.",
        "hint": "Nge2.",
        "correctFeedback": "Nge2.",
        "wrongFeedback": "Nge2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/3p1n2/n1b1p3/2B1P3/2NP3P/PPP1NPP1/R1BQK2R w KQkq - 2 7",
        "text": "6...Na5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c6",
          "a5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/3p1n2/n1b1p3/2B1P3/2NP3P/PPP1NPP1/R1BQK2R w KQkq - 2 7",
        "correctMove": "O-O",
        "prompt": "Your move.",
        "hint": "O-O.",
        "correctFeedback": "O-O.",
        "wrongFeedback": "O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/3p1n2/2b1p3/2n1P3/2NP3P/PPP1NPP1/R1BQ1RK1 w kq - 0 8",
        "text": "h3, Nge2, O-O. If Black takes your bishop with Nxc4, take back with the d-pawn and you are still solid."
      }
    ]
  },
  "hb-test-1": {
    "id": "hb-test-1",
    "title": "Lvl 1 Test",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Test time. Play Hikaru's Bishop's Opening: the main line plus Black's two key alternatives. No hints.",
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
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Your move.",
        "hint": "d3.",
        "correctFeedback": "d3.",
        "wrongFeedback": "d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "text": "3...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "text": "4...Bb4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "b4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "correctMove": "Ne2",
        "prompt": "Your move.",
        "hint": "Ne2.",
        "correctFeedback": "Ne2.",
        "wrongFeedback": "Ne2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2n2n2/3pp3/1bB1P3/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 6",
        "text": "5...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/2n2n2/3pp3/1bB1P3/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 6",
        "correctMove": "exd5",
        "prompt": "Your move.",
        "hint": "exd5.",
        "correctFeedback": "exd5.",
        "wrongFeedback": "exd5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2n5/3np3/1bB5/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 7",
        "text": "6...Nxd5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f6",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/2n5/3np3/1bB5/2NP4/PPP1NPPP/R1BQK2R w KQkq - 0 7",
        "correctMove": "O-O",
        "prompt": "Your move.",
        "hint": "O-O.",
        "correctFeedback": "O-O.",
        "wrongFeedback": "O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qk2r/ppp2ppp/2n1b3/3np3/1bB5/2NP4/PPP1NPPP/R1BQ1RK1 w kq - 2 8",
        "text": "7...Be6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "e6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 3...c6 —"
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
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Your move.",
        "hint": "d3.",
        "correctFeedback": "d3.",
        "wrongFeedback": "d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp1p1ppp/2p2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "text": "3...c6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp1p1ppp/2p2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp3ppp/2p2n2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "text": "4...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp3ppp/2p2n2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "correctMove": "Bb3",
        "prompt": "Your move.",
        "hint": "Bb3.",
        "correctFeedback": "Bb3.",
        "wrongFeedback": "Bb3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pb1n2/3pp3/4P3/1B1P1N2/PPP2PPP/RNBQK2R w KQkq - 2 6",
        "text": "5...Bd6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/pp3ppp/2pb1n2/3pp3/4P3/1B1P1N2/PPP2PPP/RNBQK2R w KQkq - 2 6",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 4...Bc5 —"
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
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Your move.",
        "hint": "d3.",
        "correctFeedback": "d3.",
        "wrongFeedback": "d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "text": "3...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "text": "4...Bc5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR w KQkq - 3 5",
        "correctMove": "h3",
        "prompt": "Your move.",
        "hint": "h3.",
        "correctFeedback": "h3.",
        "wrongFeedback": "h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP3P/PPP2PP1/R1BQK1NR w KQkq - 0 6",
        "text": "5...d6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP3P/PPP2PP1/R1BQK1NR w KQkq - 0 6",
        "correctMove": "Nge2",
        "prompt": "Your move.",
        "hint": "Nge2.",
        "correctFeedback": "Nge2.",
        "wrongFeedback": "Nge2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp2ppp/3p1n2/n1b1p3/2B1P3/2NP3P/PPP1NPP1/R1BQK2R w KQkq - 2 7",
        "text": "6...Na5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c6",
          "a5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp2ppp/3p1n2/n1b1p3/2B1P3/2NP3P/PPP1NPP1/R1BQK2R w KQkq - 2 7",
        "correctMove": "O-O",
        "prompt": "Your move.",
        "hint": "O-O.",
        "correctFeedback": "O-O.",
        "wrongFeedback": "O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Level 1 complete. You can now play Hikaru's Bishop's Opening."
      }
    ]
  }
}

export function getHikaruBishopsLesson(id: string): OpeningLesson | undefined {
  return HIKARU_BISHOPS_LESSONS[id]
}
