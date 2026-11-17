// GENERATED — do not edit by hand. Source: magnuscarlsen's real chess.com games (blitz, bullet, rapid).
import type { OpeningLesson } from '@/types/opening-lesson'

const MAGNUS_FRENCH_LESSONS: Record<string, OpeningLesson> = {
  "mf-1": {
    "id": "mf-1",
    "title": "The French",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "Magnus's French Defence. He played it in 127 games on chess.com over the last two years and scored 76%. Every move here comes from those games."
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
        "text": "Answer 1.e4 with e6, the French Defence. Magnus plays it in about one game in seven against 1.e4.",
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "e6",
        "prompt": "Play e6.",
        "hint": "Pawn e7 to e6.",
        "correctFeedback": "e6. White takes the center with d4.",
        "wrongFeedback": "Play e6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "Strike at e4 with d5.",
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "d5",
        "prompt": "Play d5.",
        "hint": "Pawn d7 to d5.",
        "correctFeedback": "d5. White pushes past with e5, the Advance Variation.",
        "wrongFeedback": "Play d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "text": "3.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "text": "White's pawns point at your kingside. Hit the base of the chain right away: c5 attacks d4.",
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "correctMove": "c5",
        "prompt": "Play c5.",
        "hint": "Pawn c7 to c5.",
        "correctFeedback": "c5. White backs up d4 with c3.",
        "wrongFeedback": "Play c5.",
        "orientation": "black",
        "postMoveArrow": [
          "c5",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "text": "4.c3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c2",
          "c3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "text": "Recall: e6, d5, c5."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "correctMove": "e6",
        "prompt": "Your move.",
        "hint": "e6.",
        "correctFeedback": "e6.",
        "wrongFeedback": "e6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "text": "3.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "correctMove": "c5",
        "prompt": "Your move.",
        "hint": "c5.",
        "correctFeedback": "c5.",
        "wrongFeedback": "c5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "text": "e6, d5, c5. White grabbed space with e5, and you are already attacking the base of the pawn chain. One warning: with your e-pawn moved, a White bishop on g5 would hit your queen. If it comes, block with Be7."
      }
    ]
  },
  "mf-2": {
    "id": "mf-2",
    "title": "Pressure on d4",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "text": "White defends d4 with c3 and Nf3. Keep piling up on it, Magnus style."
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
        "correctMove": "e6",
        "prompt": "Your move.",
        "hint": "e6.",
        "correctFeedback": "e6.",
        "wrongFeedback": "e6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "text": "3.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "correctMove": "c5",
        "prompt": "Your move.",
        "hint": "c5.",
        "correctFeedback": "c5.",
        "wrongFeedback": "c5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "text": "4.c3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c2",
          "c3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "text": "Develop Nc6. A second attacker on d4.",
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "correctMove": "Nc6",
        "prompt": "Play Nc6.",
        "hint": "Knight b8 to c6.",
        "correctFeedback": "Nc6. White develops Nf3.",
        "wrongFeedback": "Play Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "text": "5.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "text": "Magnus's quiet move: Bd7. The bishop gets out, and the c-file is ready for your rook.",
        "highlightSquares": [
          "c8",
          "d7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "correctMove": "Bd7",
        "prompt": "Play Bd7.",
        "hint": "Bishop c8 to d7.",
        "correctFeedback": "Bd7. White develops Be2.",
        "wrongFeedback": "Play Bd7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/2ppP3/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 4 6",
        "text": "6.Be2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "e2"
        ]
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/2ppP3/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 4 6",
        "text": "Trade on d4. That opens the c-file.",
        "highlightSquares": [
          "c5",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/2ppP3/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 4 6",
        "correctMove": "cxd4",
        "prompt": "Capture cxd4.",
        "hint": "Pawn c5 takes d4.",
        "correctFeedback": "cxd4. White takes back.",
        "wrongFeedback": "Play cxd4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "text": "7.cxd4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c3",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "text": "Recall: Nc6, Bd7, cxd4."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "correctMove": "Nc6",
        "prompt": "Your move.",
        "hint": "Nc6.",
        "correctFeedback": "Nc6.",
        "wrongFeedback": "Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "text": "5.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "correctMove": "Bd7",
        "prompt": "Your move.",
        "hint": "Bd7.",
        "correctFeedback": "Bd7.",
        "wrongFeedback": "Bd7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/2ppP3/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 4 6",
        "text": "6.Be2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "e2"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/2ppP3/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 4 6",
        "correctMove": "cxd4",
        "prompt": "Your move.",
        "hint": "cxd4.",
        "correctFeedback": "cxd4.",
        "wrongFeedback": "cxd4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "text": "Nc6, Bd7, cxd4. The c-file is open and d4 is the target."
      }
    ]
  },
  "mf-3": {
    "id": "mf-3",
    "title": "The Knight on f5",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "text": "Your other knight joins the attack on d4 by a roundabout route: e7, then f5."
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
        "correctMove": "e6",
        "prompt": "Your move.",
        "hint": "e6.",
        "correctFeedback": "e6.",
        "wrongFeedback": "e6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "text": "3.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "correctMove": "c5",
        "prompt": "Your move.",
        "hint": "c5.",
        "correctFeedback": "c5.",
        "wrongFeedback": "c5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "text": "4.c3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c2",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "correctMove": "Nc6",
        "prompt": "Your move.",
        "hint": "Nc6.",
        "correctFeedback": "Nc6.",
        "wrongFeedback": "Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "text": "5.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "correctMove": "Bd7",
        "prompt": "Your move.",
        "hint": "Bd7.",
        "correctFeedback": "Bd7.",
        "wrongFeedback": "Bd7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/2ppP3/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 4 6",
        "text": "6.Be2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "e2"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/2ppP3/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 4 6",
        "correctMove": "cxd4",
        "prompt": "Your move.",
        "hint": "cxd4.",
        "correctFeedback": "cxd4.",
        "wrongFeedback": "cxd4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "text": "7.cxd4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c3",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "text": "Knight to e7. It is heading for f5, where it will hit d4.",
        "highlightSquares": [
          "g8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "correctMove": "Nge7",
        "prompt": "Play Nge7.",
        "hint": "Knight g8 to e7.",
        "correctFeedback": "Nge7. White develops Na3.",
        "wrongFeedback": "Play Nge7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1bnppp/2n1p3/3pP3/3P4/N4N2/PP2BPPP/R1BQK2R b KQkq - 2 8",
        "text": "8.Na3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "a3"
        ]
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1bnppp/2n1p3/3pP3/3P4/N4N2/PP2BPPP/R1BQK2R b KQkq - 2 8",
        "text": "Nf5. Now both your knights attack d4.",
        "highlightSquares": [
          "e7",
          "f5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1bnppp/2n1p3/3pP3/3P4/N4N2/PP2BPPP/R1BQK2R b KQkq - 2 8",
        "correctMove": "Nf5",
        "prompt": "Play Nf5.",
        "hint": "Knight e7 to f5.",
        "correctFeedback": "Nf5. White guards d4 with Nc2.",
        "wrongFeedback": "Play Nf5.",
        "orientation": "black",
        "postMoveArrow": [
          "f5",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1b1ppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQK2R b KQkq - 4 9",
        "text": "9.Nc2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "a3",
          "c2"
        ]
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1b1ppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQK2R b KQkq - 4 9",
        "text": "Develop Be7 and get ready to castle.",
        "highlightSquares": [
          "f8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1b1ppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQK2R b KQkq - 4 9",
        "correctMove": "Be7",
        "prompt": "Play Be7.",
        "hint": "Bishop f8 to e7.",
        "correctFeedback": "Be7. White castles.",
        "wrongFeedback": "Play Be7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qk2r/pp1bbppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQ1RK1 b kq - 6 10",
        "text": "10.O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "text": "Recall: Nge7, Nf5, Be7."
      },
      {
        "type": "play-move",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "correctMove": "Nge7",
        "prompt": "Your move.",
        "hint": "Nge7.",
        "correctFeedback": "Nge7.",
        "wrongFeedback": "Nge7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1bnppp/2n1p3/3pP3/3P4/N4N2/PP2BPPP/R1BQK2R b KQkq - 2 8",
        "text": "8.Na3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "a3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1bnppp/2n1p3/3pP3/3P4/N4N2/PP2BPPP/R1BQK2R b KQkq - 2 8",
        "correctMove": "Nf5",
        "prompt": "Your move.",
        "hint": "Nf5.",
        "correctFeedback": "Nf5.",
        "wrongFeedback": "Nf5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1b1ppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQK2R b KQkq - 4 9",
        "text": "9.Nc2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "a3",
          "c2"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1b1ppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQK2R b KQkq - 4 9",
        "correctMove": "Be7",
        "prompt": "Your move.",
        "hint": "Be7.",
        "correctFeedback": "Be7.",
        "wrongFeedback": "Be7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qk2r/pp1bbppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQ1RK1 b kq - 6 10",
        "text": "Nge7, Nf5, Be7. Both knights hit d4 and you are about to castle. Magnus scored 88% in the 16 games that reached 7...Nge7."
      }
    ]
  },
  "mf-dev-4nf3": {
    "id": "mf-dev-4nf3",
    "title": "If 4.Nf3",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4",
        "text": "White skips c3, plays Nf3 and Bd3, and offers the d4 pawn. Magnus takes it."
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
        "correctMove": "e6",
        "prompt": "Your move.",
        "hint": "e6.",
        "correctFeedback": "e6.",
        "wrongFeedback": "e6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "text": "3.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "correctMove": "c5",
        "prompt": "Your move.",
        "hint": "c5.",
        "correctFeedback": "c5.",
        "wrongFeedback": "c5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4",
        "text": "4.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4",
        "text": "Develop Nc6, attacking d4 again.",
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4",
        "correctMove": "Nc6",
        "prompt": "Play Nc6.",
        "hint": "Knight b8 to c6.",
        "correctFeedback": "Nc6. White plays Bd3 instead of defending d4.",
        "wrongFeedback": "Play Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/3B1N2/PPP2PPP/RNBQK2R b KQkq - 3 5",
        "text": "5.Bd3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "d3"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/3B1N2/PPP2PPP/RNBQK2R b KQkq - 3 5",
        "text": "White left d4 hanging. Take it.",
        "highlightSquares": [
          "c5",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/3B1N2/PPP2PPP/RNBQK2R b KQkq - 3 5",
        "correctMove": "cxd4",
        "prompt": "Capture cxd4.",
        "hint": "Pawn c5 takes d4.",
        "correctFeedback": "cxd4. White castles.",
        "wrongFeedback": "Play cxd4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/3pP3/3p4/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 6",
        "text": "6.O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/3pP3/3p4/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 6",
        "text": "Develop Nge7. It can go to g6 or f5 next.",
        "highlightSquares": [
          "g8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/3pP3/3p4/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 6",
        "correctMove": "Nge7",
        "prompt": "Play Nge7.",
        "hint": "Knight g8 to e7.",
        "correctFeedback": "Nge7. A pawn up, with a solid position.",
        "wrongFeedback": "Play Nge7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4",
        "text": "Recall: Nc6, cxd4, Nge7."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4",
        "correctMove": "Nc6",
        "prompt": "Your move.",
        "hint": "Nc6.",
        "correctFeedback": "Nc6.",
        "wrongFeedback": "Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/3B1N2/PPP2PPP/RNBQK2R b KQkq - 3 5",
        "text": "5.Bd3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "d3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/3B1N2/PPP2PPP/RNBQK2R b KQkq - 3 5",
        "correctMove": "cxd4",
        "prompt": "Your move.",
        "hint": "cxd4.",
        "correctFeedback": "cxd4.",
        "wrongFeedback": "cxd4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/3pP3/3p4/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 6",
        "text": "6.O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/3pP3/3p4/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 6",
        "correctMove": "Nge7",
        "prompt": "Your move.",
        "hint": "Nge7.",
        "correctFeedback": "Nge7.",
        "wrongFeedback": "Nge7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pp2nppp/2n1p3/3pP3/3p4/3B1N2/PPP2PPP/RNBQ1RK1 w kq - 2 7",
        "text": "Nc6, cxd4, Nge7. You are a pawn up, and the knight is heading for f5 or g6."
      }
    ]
  },
  "mf-dev-3nc3": {
    "id": "mf-dev-3nc3",
    "title": "If 3.Nc3",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        "text": "Against 3.Nc3, Magnus splits almost evenly between Bb4 and Nf6. This is the Nf6 line, where he gives up the center for quick development."
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
        "correctMove": "e6",
        "prompt": "Your move.",
        "hint": "e6.",
        "correctFeedback": "e6.",
        "wrongFeedback": "e6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        "text": "Develop Nf6, adding a second attacker on e4.",
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        "correctMove": "Nf6",
        "prompt": "Play Nf6.",
        "hint": "Knight g8 to f6.",
        "correctFeedback": "Nf6. White pins it with Bg5.",
        "wrongFeedback": "Play Nf6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4",
        "text": "4.Bg5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c1",
          "g5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4",
        "text": "Take on e4. This releases the tension and the pin matters less.",
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4",
        "correctMove": "dxe4",
        "prompt": "Capture dxe4.",
        "hint": "Pawn d5 takes e4.",
        "correctFeedback": "dxe4. White takes back with the knight.",
        "wrongFeedback": "Play dxe4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6B1/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 5",
        "text": "5.Nxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c3",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6B1/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 5",
        "text": "Develop Be7, unpinning the knight.",
        "highlightSquares": [
          "f8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6B1/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 5",
        "correctMove": "Be7",
        "prompt": "Play Be7.",
        "hint": "Bishop f8 to e7.",
        "correctFeedback": "Be7. White takes on f6.",
        "wrongFeedback": "Play Be7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1bppp/4pB2/8/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 6",
        "text": "6.Bxf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g5",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        "text": "Recall: Nf6, dxe4, Be7."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        "correctMove": "Nf6",
        "prompt": "Your move.",
        "hint": "Nf6.",
        "correctFeedback": "Nf6.",
        "wrongFeedback": "Nf6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4",
        "text": "4.Bg5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c1",
          "g5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4",
        "correctMove": "dxe4",
        "prompt": "Your move.",
        "hint": "dxe4.",
        "correctFeedback": "dxe4.",
        "wrongFeedback": "dxe4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6B1/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 5",
        "text": "5.Nxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c3",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6B1/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 5",
        "correctMove": "Be7",
        "prompt": "Your move.",
        "hint": "Be7.",
        "correctFeedback": "Be7.",
        "wrongFeedback": "Be7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1bppp/4pB2/8/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 6",
        "text": "Nf6, dxe4, Be7. If White takes on f6, Magnus takes back with the g-pawn and gets the bishop pair."
      }
    ]
  },
  "mf-test-1": {
    "id": "mf-test-1",
    "title": "Lvl 1 Test",
    "defaultOrientation": "black",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Test time. Play Magnus's French: the Advance main line plus 4.Nf3 and 3.Nc3. No hints.",
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
        "correctMove": "e6",
        "prompt": "Your move.",
        "hint": "e6.",
        "correctFeedback": "e6.",
        "wrongFeedback": "e6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "text": "3.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "correctMove": "c5",
        "prompt": "Your move.",
        "hint": "c5.",
        "correctFeedback": "c5.",
        "wrongFeedback": "c5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "text": "4.c3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c2",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "correctMove": "Nc6",
        "prompt": "Your move.",
        "hint": "Nc6.",
        "correctFeedback": "Nc6.",
        "wrongFeedback": "Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "text": "5.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "correctMove": "Bd7",
        "prompt": "Your move.",
        "hint": "Bd7.",
        "correctFeedback": "Bd7.",
        "wrongFeedback": "Bd7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/2ppP3/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 4 6",
        "text": "6.Be2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "e2"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/2ppP3/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 4 6",
        "correctMove": "cxd4",
        "prompt": "Your move.",
        "hint": "cxd4.",
        "correctFeedback": "cxd4.",
        "wrongFeedback": "cxd4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "text": "7.cxd4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c3",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkbnr/pp1b1ppp/2n1p3/3pP3/3P4/5N2/PP2BPPP/RNBQK2R b KQkq - 0 7",
        "correctMove": "Nge7",
        "prompt": "Your move.",
        "hint": "Nge7.",
        "correctFeedback": "Nge7.",
        "wrongFeedback": "Nge7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1bnppp/2n1p3/3pP3/3P4/N4N2/PP2BPPP/R1BQK2R b KQkq - 2 8",
        "text": "8.Na3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "a3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1bnppp/2n1p3/3pP3/3P4/N4N2/PP2BPPP/R1BQK2R b KQkq - 2 8",
        "correctMove": "Nf5",
        "prompt": "Your move.",
        "hint": "Nf5.",
        "correctFeedback": "Nf5.",
        "wrongFeedback": "Nf5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1b1ppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQK2R b KQkq - 4 9",
        "text": "9.Nc2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "a3",
          "c2"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1b1ppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQK2R b KQkq - 4 9",
        "correctMove": "Be7",
        "prompt": "Your move.",
        "hint": "Be7.",
        "correctFeedback": "Be7.",
        "wrongFeedback": "Be7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r2qk2r/pp1bbppp/2n1p3/3pPn2/3P4/5N2/PPN1BPPP/R1BQ1RK1 b kq - 6 10",
        "text": "10.O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 4.Nf3 —"
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
        "correctMove": "e6",
        "prompt": "Your move.",
        "hint": "e6.",
        "correctFeedback": "e6.",
        "wrongFeedback": "e6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "text": "3.e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e4",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "correctMove": "c5",
        "prompt": "Your move.",
        "hint": "c5.",
        "correctFeedback": "c5.",
        "wrongFeedback": "c5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4",
        "text": "4.Nf3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4",
        "correctMove": "Nc6",
        "prompt": "Your move.",
        "hint": "Nc6.",
        "correctFeedback": "Nc6.",
        "wrongFeedback": "Nc6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/3B1N2/PPP2PPP/RNBQK2R b KQkq - 3 5",
        "text": "5.Bd3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f1",
          "d3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/3B1N2/PPP2PPP/RNBQK2R b KQkq - 3 5",
        "correctMove": "cxd4",
        "prompt": "Your move.",
        "hint": "cxd4.",
        "correctFeedback": "cxd4.",
        "wrongFeedback": "cxd4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/3pP3/3p4/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 6",
        "text": "6.O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/3pP3/3p4/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 6",
        "correctMove": "Nge7",
        "prompt": "Your move.",
        "hint": "Nge7.",
        "correctFeedback": "Nge7.",
        "wrongFeedback": "Nge7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 3.Nc3 —"
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
        "correctMove": "e6",
        "prompt": "Your move.",
        "hint": "e6.",
        "correctFeedback": "e6.",
        "wrongFeedback": "e6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "text": "2.d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "correctMove": "d5",
        "prompt": "Your move.",
        "hint": "d5.",
        "correctFeedback": "d5.",
        "wrongFeedback": "d5.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        "text": "3.Nc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        "correctMove": "Nf6",
        "prompt": "Your move.",
        "hint": "Nf6.",
        "correctFeedback": "Nf6.",
        "wrongFeedback": "Nf6.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4",
        "text": "4.Bg5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c1",
          "g5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4",
        "correctMove": "dxe4",
        "prompt": "Your move.",
        "hint": "dxe4.",
        "correctFeedback": "dxe4.",
        "wrongFeedback": "dxe4.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6B1/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 5",
        "text": "5.Nxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c3",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6B1/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 5",
        "correctMove": "Be7",
        "prompt": "Your move.",
        "hint": "Be7.",
        "correctFeedback": "Be7.",
        "wrongFeedback": "Be7.",
        "orientation": "black"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Level 1 complete. You can now play Magnus's French."
      }
    ]
  }
}

export function getMagnusFrenchLesson(id: string): OpeningLesson | undefined {
  return MAGNUS_FRENCH_LESSONS[id]
}
