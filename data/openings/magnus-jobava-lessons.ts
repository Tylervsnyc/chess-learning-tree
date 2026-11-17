// GENERATED — do not edit by hand. Source: magnuscarlsen's real chess.com games (blitz, bullet, rapid).
import type { OpeningLesson } from '@/types/opening-lesson'

const MAGNUS_JOBAVA_LESSONS: Record<string, OpeningLesson> = {
  "mj-1": {
    "id": "mj-1",
    "title": "The Jobava Setup",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Magnus's Jobava London. He reached this setup in 85 games on chess.com over the last two years and scored 77%. Every move here comes from those games."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Open with 1.d4.",
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "d4",
        "prompt": "Play d4.",
        "hint": "Pawn d2 to d4.",
        "correctFeedback": "d4. Black develops Nf6.",
        "wrongFeedback": "Play d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "Knight to c3, before the c-pawn moves. This is what makes it the Jobava London: the knight can jump to b5 in one move.",
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Play Nc3.",
        "hint": "Knight b1 to c3.",
        "correctFeedback": "Nc3. Black takes the center with d5.",
        "wrongFeedback": "Play Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "Bishop out to f4, the London bishop. It eyes c7, which your knight can also reach from b5.",
        "highlightSquares": [
          "c1",
          "f4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Play Bf4.",
        "hint": "Bishop c1 to f4.",
        "correctFeedback": "Bf4. Black plays a6, keeping your knight off b5.",
        "wrongFeedback": "Play Bf4.",
        "orientation": "white",
        "postMoveArrow": [
          "f4",
          "c7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "3...a6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "a7",
          "a6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Recall: d4, Nc3, Bf4."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Your move.",
        "hint": "Bf4.",
        "correctFeedback": "Bf4.",
        "wrongFeedback": "Bf4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "d4, Nc3, Bf4. Knight and bishop both aim at c7, which is why Black plays a6. Next, Magnus goes after the kingside."
      }
    ]
  },
  "mj-2": {
    "id": "mj-2",
    "title": "The g4 Lunge",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Black has stopped your knight with a6 and played a solid e6. Magnus answers by throwing his g-pawn up the board."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Your move.",
        "hint": "Bf4.",
        "correctFeedback": "Bf4.",
        "wrongFeedback": "Bf4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "3...a6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "a7",
          "a6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Black stopped Nb5. Play e3, backing up d4 and opening a path for the f1 bishop. One warning: with e2 empty, a Black bishop on g4 would hit your queen. If it comes, block with Be2.",
        "highlightSquares": [
          "e2",
          "e3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Play e3.",
        "hint": "Pawn e2 to e3.",
        "correctFeedback": "e3. Black plays e6.",
        "wrongFeedback": "Play e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp2ppp/p3pn2/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "4...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp2ppp/p3pn2/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "Now Magnus's signature: g4! He lunges with the g-pawn in 9 of his 11 games here. Next, g5 kicks the f6 knight.",
        "highlightSquares": [
          "g2",
          "g4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp2ppp/p3pn2/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "correctMove": "g4",
        "prompt": "Lunge with g4.",
        "hint": "Pawn g2 to g4.",
        "correctFeedback": "g4. Black pins your knight with Bb4.",
        "wrongFeedback": "Play g4.",
        "orientation": "white",
        "postMoveArrow": [
          "g4",
          "g5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/1pp2ppp/p3pn2/3p4/1b1P1BP1/2N1P3/PPP2P1P/R2QKBNR w KQkq - 1 6",
        "text": "5...Bb4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "b4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/1pp2ppp/p3pn2/3p4/1b1P1BP1/2N1P3/PPP2P1P/R2QKBNR w KQkq - 1 6",
        "text": "Bishop to g2. From there it presses on d5 along the long diagonal.",
        "highlightSquares": [
          "f1",
          "g2"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/1pp2ppp/p3pn2/3p4/1b1P1BP1/2N1P3/PPP2P1P/R2QKBNR w KQkq - 1 6",
        "correctMove": "Bg2",
        "prompt": "Play Bg2.",
        "hint": "Bishop f1 to g2.",
        "correctFeedback": "Bg2. Black strikes back with c5.",
        "wrongFeedback": "Play Bg2.",
        "orientation": "white",
        "postMoveArrow": [
          "g2",
          "d5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/1p3ppp/p3pn2/2pp4/1b1P1BP1/2N1P3/PPP2PBP/R2QK1NR w KQkq - 0 7",
        "text": "6...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Recall: e3, g4, Bg2."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp2ppp/p3pn2/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "4...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp2ppp/p3pn2/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "correctMove": "g4",
        "prompt": "Your move.",
        "hint": "g4.",
        "correctFeedback": "g4.",
        "wrongFeedback": "g4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/1pp2ppp/p3pn2/3p4/1b1P1BP1/2N1P3/PPP2P1P/R2QKBNR w KQkq - 1 6",
        "text": "5...Bb4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "b4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/1pp2ppp/p3pn2/3p4/1b1P1BP1/2N1P3/PPP2P1P/R2QKBNR w KQkq - 1 6",
        "correctMove": "Bg2",
        "prompt": "Your move.",
        "hint": "Bg2.",
        "correctFeedback": "Bg2.",
        "wrongFeedback": "Bg2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/1p3ppp/p3pn2/2pp4/1b1P1BP1/2N1P3/PPP2PBP/R2QK1NR w KQkq - 0 7",
        "text": "e3, g4, Bg2. In Magnus's games, g5 comes next, kicking the f6 knight away from the center."
      }
    ]
  },
  "mj-dev-3c5": {
    "id": "mj-dev-3c5",
    "title": "If 3...c5",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Black hits your center right away with c5. Magnus keeps it simple."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Your move.",
        "hint": "Bf4.",
        "correctFeedback": "Bf4.",
        "wrongFeedback": "Bf4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "3...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Play e3, backing up d4. Magnus played it every time here.",
        "highlightSquares": [
          "e2",
          "e3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Play e3.",
        "hint": "Pawn e2 to e3.",
        "correctFeedback": "e3. Black trades on d4.",
        "wrongFeedback": "Play e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/3p4/3p1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "4...cxd4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c5",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/3p4/3p1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "Take back with the e-pawn. That opens a path for your f1 bishop.",
        "highlightSquares": [
          "e3",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/5n2/3p4/3p1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "correctMove": "exd4",
        "prompt": "Capture exd4.",
        "hint": "Pawn e3 takes d4.",
        "correctFeedback": "exd4. Black develops Bg4, attacking your queen.",
        "wrongFeedback": "Play exd4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/5n2/3p4/3P1Bb1/2N5/PPP2PPP/R2QKBNR w KQkq - 1 6",
        "text": "5...Bg4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "g4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/5n2/3p4/3P1Bb1/2N5/PPP2PPP/R2QKBNR w KQkq - 1 6",
        "text": "Black's bishop on g4 attacks your queen. Block it with Be2.",
        "highlightSquares": [
          "f1",
          "e2"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2pppp/5n2/3p4/3P1Bb1/2N5/PPP2PPP/R2QKBNR w KQkq - 1 6",
        "correctMove": "Be2",
        "prompt": "Play Be2.",
        "hint": "Bishop f1 to e2.",
        "correctFeedback": "Be2. Black trades bishops.",
        "wrongFeedback": "Play Be2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/5n2/3p4/3P1B2/2N5/PPP1bPPP/R2QK1NR w KQkq - 0 7",
        "text": "6...Bxe2.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g4",
          "e2"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Recall: e3, exd4, Be2."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/3p4/3p1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "4...cxd4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c5",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/5n2/3p4/3p1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "correctMove": "exd4",
        "prompt": "Your move.",
        "hint": "exd4.",
        "correctFeedback": "exd4.",
        "wrongFeedback": "exd4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/5n2/3p4/3P1Bb1/2N5/PPP2PPP/R2QKBNR w KQkq - 1 6",
        "text": "5...Bg4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "g4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2pppp/5n2/3p4/3P1Bb1/2N5/PPP2PPP/R2QKBNR w KQkq - 1 6",
        "correctMove": "Be2",
        "prompt": "Your move.",
        "hint": "Be2.",
        "correctFeedback": "Be2.",
        "wrongFeedback": "Be2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/5n2/3p4/3P1B2/2N5/PPP1bPPP/R2QK1NR w KQkq - 0 7",
        "text": "e3, exd4, Be2. The bishops come off and your queen lands on e2. Magnus scored 87% in the 26 games that reached 4.e3 here."
      }
    ]
  },
  "mj-dev-3g6": {
    "id": "mj-dev-3g6",
    "title": "If 3...g6",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pp1p/5np1/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Black fianchettoes with g6 and doesn't stop Nb5. Time for the classic Jobava trick."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Your move.",
        "hint": "Bf4.",
        "correctFeedback": "Bf4.",
        "wrongFeedback": "Bf4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pp1p/5np1/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "3...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pp1p/5np1/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Play e3 first. Watch for a Black bishop on g4 hitting your queen now that e2 is empty; if it comes, block with Be2.",
        "highlightSquares": [
          "e2",
          "e3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pp1p/5np1/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Play e3.",
        "hint": "Pawn e2 to e3.",
        "correctFeedback": "e3. Black puts the bishop on g7.",
        "wrongFeedback": "Play e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1ppbp/5np1/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 1 5",
        "text": "4...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1ppbp/5np1/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 1 5",
        "text": "The Jobava trick: Nb5! With the f4 bishop behind it, the knight threatens Nxc7+, forking king and rook.",
        "highlightSquares": [
          "c3",
          "b5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/ppp1ppbp/5np1/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 1 5",
        "correctMove": "Nb5",
        "prompt": "Jump to Nb5.",
        "hint": "Knight c3 to b5.",
        "correctFeedback": "Nb5. Black has to defend c7 with Na6.",
        "wrongFeedback": "Play Nb5.",
        "orientation": "white",
        "postMoveArrow": [
          "b5",
          "c7"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp1ppbp/n4np1/1N1p4/3P1B2/4P3/PPP2PPP/R2QKBNR w KQkq - 3 6",
        "text": "5...Na6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "a6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp1ppbp/n4np1/1N1p4/3P1B2/4P3/PPP2PPP/R2QKBNR w KQkq - 3 6",
        "text": "Play h3. If Black ever attacks your bishop with Nh5, it has a safe square on h2.",
        "highlightSquares": [
          "h2",
          "h3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp1ppbp/n4np1/1N1p4/3P1B2/4P3/PPP2PPP/R2QKBNR w KQkq - 3 6",
        "correctMove": "h3",
        "prompt": "Play h3.",
        "hint": "Pawn h2 to h3.",
        "correctFeedback": "h3. Black castles.",
        "wrongFeedback": "Play h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/ppp1ppbp/n4np1/1N1p4/3P1B2/4P2P/PPP2PP1/R2QKBNR w KQ - 1 7",
        "text": "6...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pp1p/5np1/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Recall: e3, Nb5, h3."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pp1p/5np1/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1ppbp/5np1/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 1 5",
        "text": "4...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/ppp1ppbp/5np1/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 1 5",
        "correctMove": "Nb5",
        "prompt": "Your move.",
        "hint": "Nb5.",
        "correctFeedback": "Nb5.",
        "wrongFeedback": "Nb5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp1ppbp/n4np1/1N1p4/3P1B2/4P3/PPP2PPP/R2QKBNR w KQkq - 3 6",
        "text": "5...Na6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "a6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp1ppbp/n4np1/1N1p4/3P1B2/4P3/PPP2PPP/R2QKBNR w KQkq - 3 6",
        "correctMove": "h3",
        "prompt": "Your move.",
        "hint": "h3.",
        "correctFeedback": "h3.",
        "wrongFeedback": "h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/ppp1ppbp/n4np1/1N1p4/3P1B2/4P2P/PPP2PP1/R2QKBNR w KQ - 1 7",
        "text": "e3, Nb5, h3. Black had to defend c7 with Na6, a clumsy square for a knight."
      }
    ]
  },
  "mj-dev-4h6": {
    "id": "mj-dev-4h6",
    "title": "If 4...h6",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Black plays h6, so a g4-g5 lunge would meet resistance. Magnus pushes the other pawn instead."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Your move.",
        "hint": "Bf4.",
        "correctFeedback": "Bf4.",
        "wrongFeedback": "Bf4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "3...a6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "a7",
          "a6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Same start: e3. If a Black bishop ever lands on g4, block with Be2.",
        "highlightSquares": [
          "e2",
          "e3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Play e3.",
        "hint": "Pawn e2 to e3.",
        "correctFeedback": "e3. Black plays h6.",
        "wrongFeedback": "Play e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1ppp1/p4n1p/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "4...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1ppp1/p4n1p/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "Push the h-pawn: h4. If Black plays g5 to chase your bishop, you take with the h-pawn.",
        "highlightSquares": [
          "h2",
          "h4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp1ppp1/p4n1p/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "correctMove": "h4",
        "prompt": "Play h4.",
        "hint": "Pawn h2 to h4.",
        "correctFeedback": "h4. Black hits the center with c5.",
        "wrongFeedback": "Play h4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1p2ppp1/p4n1p/2pp4/3P1B1P/2N1P3/PPP2PP1/R2QKBNR w KQkq - 0 6",
        "text": "5...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1p2ppp1/p4n1p/2pp4/3P1B1P/2N1P3/PPP2PP1/R2QKBNR w KQkq - 0 6",
        "text": "Develop Nf3, guarding d4.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1p2ppp1/p4n1p/2pp4/3P1B1P/2N1P3/PPP2PP1/R2QKBNR w KQkq - 0 6",
        "correctMove": "Nf3",
        "prompt": "Play Nf3.",
        "hint": "Knight g1 to f3.",
        "correctFeedback": "Nf3. Black pins it with Bg4.",
        "wrongFeedback": "Play Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/1p2ppp1/p4n1p/2pp4/3P1BbP/2N1PN2/PPP2PP1/R2QKB1R w KQkq - 2 7",
        "text": "6...Bg4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "g4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "Recall: e3, h4, Nf3."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1ppp1/p4n1p/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "4...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp1ppp1/p4n1p/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "correctMove": "h4",
        "prompt": "Your move.",
        "hint": "h4.",
        "correctFeedback": "h4.",
        "wrongFeedback": "h4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1p2ppp1/p4n1p/2pp4/3P1B1P/2N1P3/PPP2PP1/R2QKBNR w KQkq - 0 6",
        "text": "5...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1p2ppp1/p4n1p/2pp4/3P1B1P/2N1P3/PPP2PP1/R2QKBNR w KQkq - 0 6",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/1p2ppp1/p4n1p/2pp4/3P1BbP/2N1PN2/PPP2PP1/R2QKB1R w KQkq - 2 7",
        "text": "e3, h4, Nf3. If Black ever plays g5, your h-pawn is ready to take."
      }
    ]
  },
  "mj-test-1": {
    "id": "mj-test-1",
    "title": "Lvl 1 Test",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Test time. Play Magnus's Jobava London: the g4 main line plus Black's three key alternatives. No hints.",
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Your move.",
        "hint": "Bf4.",
        "correctFeedback": "Bf4.",
        "wrongFeedback": "Bf4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "3...a6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "a7",
          "a6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp2ppp/p3pn2/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "4...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp2ppp/p3pn2/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "correctMove": "g4",
        "prompt": "Your move.",
        "hint": "g4.",
        "correctFeedback": "g4.",
        "wrongFeedback": "g4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/1pp2ppp/p3pn2/3p4/1b1P1BP1/2N1P3/PPP2P1P/R2QKBNR w KQkq - 1 6",
        "text": "5...Bb4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "b4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/1pp2ppp/p3pn2/3p4/1b1P1BP1/2N1P3/PPP2P1P/R2QKBNR w KQkq - 1 6",
        "correctMove": "Bg2",
        "prompt": "Your move.",
        "hint": "Bg2.",
        "correctFeedback": "Bg2.",
        "wrongFeedback": "Bg2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/1p3ppp/p3pn2/2pp4/1b1P1BP1/2N1P3/PPP2PBP/R2QK1NR w KQkq - 0 7",
        "text": "6...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 3...c5 —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Your move.",
        "hint": "Bf4.",
        "correctFeedback": "Bf4.",
        "wrongFeedback": "Bf4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "3...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/3p4/3p1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "4...cxd4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c5",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/5n2/3p4/3p1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "correctMove": "exd4",
        "prompt": "Your move.",
        "hint": "exd4.",
        "correctFeedback": "exd4.",
        "wrongFeedback": "exd4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/5n2/3p4/3P1Bb1/2N5/PPP2PPP/R2QKBNR w KQkq - 1 6",
        "text": "5...Bg4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "g4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2pppp/5n2/3p4/3P1Bb1/2N5/PPP2PPP/R2QKBNR w KQkq - 1 6",
        "correctMove": "Be2",
        "prompt": "Your move.",
        "hint": "Be2.",
        "correctFeedback": "Be2.",
        "wrongFeedback": "Be2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 3...g6 —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Your move.",
        "hint": "Bf4.",
        "correctFeedback": "Bf4.",
        "wrongFeedback": "Bf4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pp1p/5np1/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "3...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pp1p/5np1/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1ppbp/5np1/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 1 5",
        "text": "4...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/ppp1ppbp/5np1/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 1 5",
        "correctMove": "Nb5",
        "prompt": "Your move.",
        "hint": "Nb5.",
        "correctFeedback": "Nb5.",
        "wrongFeedback": "Nb5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppp1ppbp/n4np1/1N1p4/3P1B2/4P3/PPP2PPP/R2QKBNR w KQkq - 3 6",
        "text": "5...Na6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "a6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppp1ppbp/n4np1/1N1p4/3P1B2/4P3/PPP2PPP/R2QKBNR w KQkq - 3 6",
        "correctMove": "h3",
        "prompt": "Your move.",
        "hint": "h3.",
        "correctFeedback": "h3.",
        "wrongFeedback": "h3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 4...h6 —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bf4",
        "prompt": "Your move.",
        "hint": "Bf4.",
        "correctFeedback": "Bf4.",
        "wrongFeedback": "Bf4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "text": "3...a6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "a7",
          "a6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp1pppp/p4n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1pp1ppp1/p4n1p/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "text": "4...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1pp1ppp1/p4n1p/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
        "correctMove": "h4",
        "prompt": "Your move.",
        "hint": "h4.",
        "correctFeedback": "h4.",
        "wrongFeedback": "h4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/1p2ppp1/p4n1p/2pp4/3P1B1P/2N1P3/PPP2PP1/R2QKBNR w KQkq - 0 6",
        "text": "5...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/1p2ppp1/p4n1p/2pp4/3P1B1P/2N1P3/PPP2PP1/R2QKBNR w KQkq - 0 6",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Level 1 complete. You can now play Magnus's Jobava London."
      }
    ]
  }
}

export function getMagnusJobavaLesson(id: string): OpeningLesson | undefined {
  return MAGNUS_JOBAVA_LESSONS[id]
}
