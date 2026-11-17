// GENERATED — do not edit by hand. Source: hikaru's real chess.com blitz games.
import type { OpeningLesson } from '@/types/opening-lesson'

const HIKARU_MODERN_LESSONS: Record<string, OpeningLesson> = {
  "hm-1": {
    "id": "hm-1",
    "title": "The ...a6 Modern",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "Hikaru's answer to 1.e4: g6, Bg7, and then a6. He reached this position in 181 blitz games over the last two years and scored 91%."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "1.e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e2",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "Answer 1.e4 with g6. This is Hikaru's most common reply to 1.e4 in blitz.",
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Play g6.",
        "hint": "Pawn g7 to g6.",
        "correctFeedback": "g6. White takes the full center with d4.",
        "wrongFeedback": "Play g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "Put the bishop on g7. It aims down the long diagonal at d4 and the whole White center.",
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Play Bg7.",
        "hint": "Bishop f8 to g7.",
        "correctFeedback": "Bg7. White develops with Nc3.",
        "wrongFeedback": "Play Bg7.",
        "orientation": "black",
        "postMoveArrow": [
          "g7",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "text": "Now Hikaru's signature: a6. It gets ready for b5, grabbing space on the queenside before you even develop a knight.",
        "highlightSquares": [
          "a7",
          "a6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "correctMove": "a6",
        "prompt": "Play a6.",
        "hint": "Pawn a7 to a6.",
        "correctFeedback": "a6. White develops the bishop to e3.",
        "wrongFeedback": "Play a6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "text": "4.Be3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c1",
          "e3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "Recall: g6, Bg7, a6."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Your move.",
        "hint": "g6.",
        "correctFeedback": "g6.",
        "wrongFeedback": "g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Your move.",
        "hint": "Bg7.",
        "correctFeedback": "Bg7.",
        "wrongFeedback": "Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "correctMove": "a6",
        "prompt": "Your move.",
        "hint": "a6.",
        "correctFeedback": "a6.",
        "wrongFeedback": "a6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "text": "g6, Bg7, a6. You let White build a big center, then get ready to hit it from the side with b5."
      }
    ]
  },
  "hm-2": {
    "id": "hm-2",
    "title": "Queenside Rush",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "text": "White sets up Be3 and Qd2, the most common plan against you. Develop quietly, and when White castles queenside, go straight at that king."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "1.e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e2",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Your move.",
        "hint": "g6.",
        "correctFeedback": "g6.",
        "wrongFeedback": "g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Your move.",
        "hint": "Bg7.",
        "correctFeedback": "Bg7.",
        "wrongFeedback": "Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "correctMove": "a6",
        "prompt": "Your move.",
        "hint": "a6.",
        "correctFeedback": "a6.",
        "wrongFeedback": "a6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "text": "4.Be3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c1",
          "e3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "text": "Play d6. It controls e5 and opens a path for your c8 bishop.",
        "highlightSquares": [
          "d7",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "correctMove": "d6",
        "prompt": "Play d6.",
        "hint": "Pawn d7 to d6.",
        "correctFeedback": "d6. White brings the queen to d2.",
        "wrongFeedback": "Play d6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/R3KBNR b KQkq - 1 5",
        "text": "5.Qd2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d1",
          "d2"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/R3KBNR b KQkq - 1 5",
        "text": "Knight to d7, not f6. It keeps the g7 bishop's diagonal open and can jump to b6 later.",
        "highlightSquares": [
          "b8",
          "d7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/R3KBNR b KQkq - 1 5",
        "correctMove": "Nd7",
        "prompt": "Play Nd7.",
        "hint": "Knight b8 to d7.",
        "correctFeedback": "Nd7. White castles queenside.",
        "wrongFeedback": "Play Nd7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/1ppnppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/2KR1BNR b kq - 3 6",
        "text": "6.O-O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "c1"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/1ppnppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/2KR1BNR b kq - 3 6",
        "text": "White's king just went to the queenside. Push b5 and start the attack right there.",
        "highlightSquares": [
          "b7",
          "b5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk1nr/1ppnppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/2KR1BNR b kq - 3 6",
        "correctMove": "b5",
        "prompt": "Play b5.",
        "hint": "Pawn b7 to b5.",
        "correctFeedback": "b5. Your pawns are already marching at the White king. Next comes Bb7.",
        "wrongFeedback": "Play b5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/2pnppbp/p2p2p1/1p6/3PP3/2N1BP2/PPPQ2PP/2KR1BNR b kq - 0 7",
        "text": "7.f3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f2",
          "f3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "text": "Recall: d6, Nd7, b5."
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "correctMove": "d6",
        "prompt": "Your move.",
        "hint": "d6.",
        "correctFeedback": "d6.",
        "wrongFeedback": "d6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/R3KBNR b KQkq - 1 5",
        "text": "5.Qd2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d1",
          "d2"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/R3KBNR b KQkq - 1 5",
        "correctMove": "Nd7",
        "prompt": "Your move.",
        "hint": "Nd7.",
        "correctFeedback": "Nd7.",
        "wrongFeedback": "Nd7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/1ppnppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/2KR1BNR b kq - 3 6",
        "text": "6.O-O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "c1"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk1nr/1ppnppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/2KR1BNR b kq - 3 6",
        "correctMove": "b5",
        "prompt": "Your move.",
        "hint": "b5.",
        "correctFeedback": "b5.",
        "wrongFeedback": "b5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/2pnppbp/p2p2p1/1p6/3PP3/2N1BP2/PPPQ2PP/2KR1BNR b kq - 0 7",
        "text": "d6, Nd7, b5. Your pawns are heading for the White king. In Hikaru's games, Bb7 comes next to add the bishop to the attack."
      }
    ]
  },
  "hm-dev-4f4": {
    "id": "hm-dev-4f4",
    "title": "If 4.f4",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4",
        "text": "White goes aggressive with f4, grabbing even more center. Hikaru switches plans and hits back with c6 and d5."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "1.e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e2",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Your move.",
        "hint": "g6.",
        "correctFeedback": "g6.",
        "wrongFeedback": "g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Your move.",
        "hint": "Bg7.",
        "correctFeedback": "Bg7.",
        "wrongFeedback": "Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "correctMove": "a6",
        "prompt": "Your move.",
        "hint": "a6.",
        "correctFeedback": "a6.",
        "wrongFeedback": "a6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4",
        "text": "4.f4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f2",
          "f4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4",
        "text": "Play c6. It prepares d5 to challenge the e4 pawn.",
        "highlightSquares": [
          "c7",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4",
        "correctMove": "c6",
        "prompt": "Play c6.",
        "hint": "Pawn c7 to c6.",
        "correctFeedback": "c6. White develops Nf3.",
        "wrongFeedback": "Play c6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1p1pppbp/p1p3p1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 1 5",
        "text": "5.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1p1pppbp/p1p3p1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 1 5",
        "text": "Now strike: d5, hitting e4.",
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1p1pppbp/p1p3p1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 1 5",
        "correctMove": "d5",
        "prompt": "Play d5.",
        "hint": "Pawn d7 to d5.",
        "correctFeedback": "d5. White pushes past with e5.",
        "wrongFeedback": "Play d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1p2ppbp/p1p3p1/3pP3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 0 6",
        "text": "6.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1p2ppbp/p1p3p1/3pP3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 0 6",
        "text": "Pin the f3 knight with Bg4. That knight is the piece holding White's center together.",
        "highlightSquares": [
          "c8",
          "g4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1p2ppbp/p1p3p1/3pP3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 0 6",
        "correctMove": "Bg4",
        "prompt": "Play Bg4.",
        "hint": "Bishop c8 to g4.",
        "correctFeedback": "Bg4. White kicks it with h3.",
        "wrongFeedback": "Play Bg4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rn1qk1nr/1p2ppbp/p1p3p1/3pP3/3P1Pb1/2N2N1P/PPP3P1/R1BQKB1R b KQkq - 0 7",
        "text": "7.h3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h2",
          "h3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4",
        "text": "Recall: c6, d5, Bg4."
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4",
        "correctMove": "c6",
        "prompt": "Your move.",
        "hint": "c6.",
        "correctFeedback": "c6.",
        "wrongFeedback": "c6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1p1pppbp/p1p3p1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 1 5",
        "text": "5.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1p1pppbp/p1p3p1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 1 5",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1p2ppbp/p1p3p1/3pP3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 0 6",
        "text": "6.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1p2ppbp/p1p3p1/3pP3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 0 6",
        "correctMove": "Bg4",
        "prompt": "Your move.",
        "hint": "Bg4.",
        "correctFeedback": "Bg4.",
        "wrongFeedback": "Bg4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rn1qk1nr/1p2ppbp/p1p3p1/3pP3/3P1Pb1/2N2N1P/PPP3P1/R1BQKB1R b KQkq - 0 7",
        "text": "c6, d5, Bg4. After 7.h3 Hikaru trades the bishop for the f3 knight and plays e6: a locked center where White's big pawns can't move."
      }
    ]
  },
  "hm-dev-3nf3": {
    "id": "hm-dev-3nf3",
    "title": "If 3.Nf3",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 3",
        "text": "White plays Nf3 instead of Nc3. Hikaru plays a6 anyway, then builds up to hit the center with e5."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "1.e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e2",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Your move.",
        "hint": "g6.",
        "correctFeedback": "g6.",
        "wrongFeedback": "g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Your move.",
        "hint": "Bg7.",
        "correctFeedback": "Bg7.",
        "wrongFeedback": "Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 3",
        "text": "3.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 3",
        "text": "Same idea against Nf3: a6.",
        "highlightSquares": [
          "a7",
          "a6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 3",
        "correctMove": "a6",
        "prompt": "Play a6.",
        "hint": "Pawn a7 to a6.",
        "correctFeedback": "a6. White develops Bd3.",
        "wrongFeedback": "Play a6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4",
        "text": "4.Bd3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "d3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4",
        "text": "Play d6, covering e5.",
        "highlightSquares": [
          "d7",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4",
        "correctMove": "d6",
        "prompt": "Play d6.",
        "hint": "Pawn d7 to d6.",
        "correctFeedback": "d6. White castles.",
        "wrongFeedback": "Play d6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5",
        "text": "5.O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5",
        "text": "Develop Nc6. It puts more pressure on d4 and supports e5.",
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5",
        "correctMove": "Nc6",
        "prompt": "Play Nc6.",
        "hint": "Knight b8 to c6.",
        "correctFeedback": "Nc6. White props up d4 with c3.",
        "wrongFeedback": "Play Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/1pp1ppbp/p1np2p1/8/3PP3/2PB1N2/PP3PPP/RNBQ1RK1 b kq - 0 6",
        "text": "6.c3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c2",
          "c3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 3",
        "text": "Recall: a6, d6, Nc6."
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 3",
        "correctMove": "a6",
        "prompt": "Your move.",
        "hint": "a6.",
        "correctFeedback": "a6.",
        "wrongFeedback": "a6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4",
        "text": "4.Bd3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "d3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4",
        "correctMove": "d6",
        "prompt": "Your move.",
        "hint": "d6.",
        "correctFeedback": "d6.",
        "wrongFeedback": "d6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5",
        "text": "5.O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5",
        "correctMove": "Nc6",
        "prompt": "Your move.",
        "hint": "Nc6.",
        "correctFeedback": "Nc6.",
        "wrongFeedback": "Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/1pp1ppbp/p1np2p1/8/3PP3/2PB1N2/PP3PPP/RNBQ1RK1 b kq - 0 6",
        "text": "a6, d6, Nc6. Next Hikaru strikes in the center with e5."
      }
    ]
  },
  "hm-dev-1d4": {
    "id": "hm-dev-1d4",
    "title": "Against 1.d4",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "text": "Hikaru plays the same setup against 1.d4. Half his blitz games against 1.d4 start with 1...g6."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "text": "1.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "text": "Against 1.d4, same first move: g6.",
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Play g6.",
        "hint": "Pawn g7 to g6.",
        "correctFeedback": "g6. White takes space with c4.",
        "wrongFeedback": "Play g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.c4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c2",
          "c4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "text": "Bishop to g7, aiming at d4.",
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Play Bg7.",
        "hint": "Bishop f8 to g7.",
        "correctFeedback": "Bg7. White develops Nc3.",
        "wrongFeedback": "Play Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 2 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 2 3",
        "text": "Play d6. Same Modern shape as against 1.e4.",
        "highlightSquares": [
          "d7",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 2 3",
        "correctMove": "d6",
        "prompt": "Play d6.",
        "hint": "Pawn d7 to d6.",
        "correctFeedback": "d6. White grabs the center with e4.",
        "wrongFeedback": "Play d6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppp1ppbp/3p2p1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4",
        "text": "4.e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e2",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "text": "Recall: g6, Bg7, d6."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Your move.",
        "hint": "g6.",
        "correctFeedback": "g6.",
        "wrongFeedback": "g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.c4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c2",
          "c4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Your move.",
        "hint": "Bg7.",
        "correctFeedback": "Bg7.",
        "wrongFeedback": "Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 2 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 2 3",
        "correctMove": "d6",
        "prompt": "Your move.",
        "hint": "d6.",
        "correctFeedback": "d6.",
        "wrongFeedback": "d6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppp1ppbp/3p2p1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4",
        "text": "g6, Bg7, d6. The same Modern shape against 1.d4. When White plays e4, Hikaru goes Nd7, just like the main line."
      }
    ]
  },
  "hm-test-1": {
    "id": "hm-test-1",
    "title": "Lvl 1 Test",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Test time. Play Hikaru's ...a6 Modern: the main line plus White's three most common alternatives. No hints.",
        "buttonText": "LET'S GO"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— Main line —"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "1.e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e2",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Your move.",
        "hint": "g6.",
        "correctFeedback": "g6.",
        "wrongFeedback": "g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Your move.",
        "hint": "Bg7.",
        "correctFeedback": "Bg7.",
        "wrongFeedback": "Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "correctMove": "a6",
        "prompt": "Your move.",
        "hint": "a6.",
        "correctFeedback": "a6.",
        "wrongFeedback": "a6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "text": "4.Be3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c1",
          "e3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4",
        "correctMove": "d6",
        "prompt": "Your move.",
        "hint": "d6.",
        "correctFeedback": "d6.",
        "wrongFeedback": "d6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/R3KBNR b KQkq - 1 5",
        "text": "5.Qd2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d1",
          "d2"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/R3KBNR b KQkq - 1 5",
        "correctMove": "Nd7",
        "prompt": "Your move.",
        "hint": "Nd7.",
        "correctFeedback": "Nd7.",
        "wrongFeedback": "Nd7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/1ppnppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/2KR1BNR b kq - 3 6",
        "text": "6.O-O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "c1"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk1nr/1ppnppbp/p2p2p1/8/3PP3/2N1B3/PPPQ1PPP/2KR1BNR b kq - 3 6",
        "correctMove": "b5",
        "prompt": "Your move.",
        "hint": "b5.",
        "correctFeedback": "b5.",
        "wrongFeedback": "b5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/2pnppbp/p2p2p1/1p6/3PP3/2N1BP2/PPPQ2PP/2KR1BNR b kq - 0 7",
        "text": "7.f3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f2",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk1nr/2pnppbp/p2p2p1/1p6/3PP3/2N1BP2/PPPQ2PP/2KR1BNR b kq - 0 7",
        "correctMove": "Bb7",
        "prompt": "Your move.",
        "hint": "Bb7.",
        "correctFeedback": "Bb7.",
        "wrongFeedback": "Bb7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 4.f4 —"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "1.e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e2",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Your move.",
        "hint": "g6.",
        "correctFeedback": "g6.",
        "wrongFeedback": "g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Your move.",
        "hint": "Bg7.",
        "correctFeedback": "Bg7.",
        "wrongFeedback": "Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "correctMove": "a6",
        "prompt": "Your move.",
        "hint": "a6.",
        "correctFeedback": "a6.",
        "wrongFeedback": "a6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4",
        "text": "4.f4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f2",
          "f4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4",
        "correctMove": "c6",
        "prompt": "Your move.",
        "hint": "c6.",
        "correctFeedback": "c6.",
        "wrongFeedback": "c6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1p1pppbp/p1p3p1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 1 5",
        "text": "5.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1p1pppbp/p1p3p1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 1 5",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1p2ppbp/p1p3p1/3pP3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 0 6",
        "text": "6.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1p2ppbp/p1p3p1/3pP3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 0 6",
        "correctMove": "Bg4",
        "prompt": "Your move.",
        "hint": "Bg4.",
        "correctFeedback": "Bg4.",
        "wrongFeedback": "Bg4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 3.Nf3 —"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "1.e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e2",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Your move.",
        "hint": "g6.",
        "correctFeedback": "g6.",
        "wrongFeedback": "g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Your move.",
        "hint": "Bg7.",
        "correctFeedback": "Bg7.",
        "wrongFeedback": "Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 3",
        "text": "3.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 3",
        "correctMove": "a6",
        "prompt": "Your move.",
        "hint": "a6.",
        "correctFeedback": "a6.",
        "wrongFeedback": "a6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4",
        "text": "4.Bd3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "d3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pppppbp/p5p1/8/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4",
        "correctMove": "d6",
        "prompt": "Your move.",
        "hint": "d6.",
        "correctFeedback": "d6.",
        "wrongFeedback": "d6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5",
        "text": "5.O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/1pp1ppbp/p2p2p1/8/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5",
        "correctMove": "Nc6",
        "prompt": "Your move.",
        "hint": "Nc6.",
        "correctFeedback": "Nc6.",
        "wrongFeedback": "Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— Against 1.d4 —"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "text": "1.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "g6",
        "prompt": "Your move.",
        "hint": "g6.",
        "correctFeedback": "g6.",
        "wrongFeedback": "g6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.c4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c2",
          "c4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppp1p/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "Bg7",
        "prompt": "Your move.",
        "hint": "Bg7.",
        "correctFeedback": "Bg7.",
        "wrongFeedback": "Bg7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 2 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk1nr/ppppppbp/6p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 2 3",
        "correctMove": "d6",
        "prompt": "Your move.",
        "hint": "d6.",
        "correctFeedback": "d6.",
        "wrongFeedback": "d6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Level 1 complete. You can now play Hikaru's Modern against 1.e4 and 1.d4."
      }
    ]
  }
}

export function getHikaruModernLesson(id: string): OpeningLesson | undefined {
  return HIKARU_MODERN_LESSONS[id]
}
