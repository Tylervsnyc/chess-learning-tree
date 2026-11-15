// GENERATED — do not edit by hand. Source: hikaru's real chess.com blitz games.
import type { OpeningLesson } from '@/types/opening-lesson'

const HIKARU_LARSEN_LESSONS: Record<string, OpeningLesson> = {
  "hl-1": {
    "id": "hl-1",
    "title": "The Larsen Setup",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Hikaru's 1.b3, the Nimzo-Larsen Attack. He has played it in 1,693 blitz games on chess.com over the last two years and scored 93%. Every move here comes from those games."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Open with 1.b3. This is Hikaru's move: he plays it in over 40% of his White blitz games.",
        "highlightSquares": [
          "b2",
          "b3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Play b3.",
        "hint": "Pawn b2 to b3.",
        "correctFeedback": "b3. Black grabs the center with e5.",
        "wrongFeedback": "Play b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "Put the bishop on b2. It looks down the long diagonal straight at e5 and g7.",
        "highlightSquares": [
          "c1",
          "b2"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bb2",
        "prompt": "Play Bb2.",
        "hint": "Bishop c1 to b2.",
        "correctFeedback": "Bb2. The e5 pawn is already under fire. Black defends it with Nc6.",
        "wrongFeedback": "Play Bb2.",
        "orientation": "white",
        "postMoveArrow": [
          "b2",
          "e5"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "2...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "Grab space on the queenside with c4. Hikaru picks this most of the time here.",
        "highlightSquares": [
          "c2",
          "c4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "c4",
        "prompt": "Play c4.",
        "hint": "Pawn c2 to c4.",
        "correctFeedback": "c4. Black develops the knight to f6.",
        "wrongFeedback": "Play c4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "text": "3...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Recall: b3, Bb2, c4."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "2...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "c4",
        "prompt": "Your move.",
        "hint": "c4.",
        "correctFeedback": "c4.",
        "wrongFeedback": "c4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "text": "b3, Bb2, c4. The bishop owns the long diagonal and you have space on the queenside. Next, Black pushes e4 and your knight starts hopping."
      }
    ]
  },
  "hl-2": {
    "id": "hl-2",
    "title": "Knight Hops",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "text": "Black's knight lands on f6. You develop yours, Black pushes e4 to kick it, and instead of retreating your knight goes forward."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "2...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "c4",
        "prompt": "Your move.",
        "hint": "c4.",
        "correctFeedback": "c4.",
        "wrongFeedback": "c4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "text": "3...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "text": "Develop the knight to f3. It hits e5, which only the c6 knight defends.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "correctMove": "Nf3",
        "prompt": "Play Nf3.",
        "hint": "Knight g1 to f3.",
        "correctFeedback": "Nf3. Black kicks it with e4.",
        "wrongFeedback": "Play Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/2P1p3/1P3N2/PB1PPPPP/RN1QKB1R w KQkq - 0 5",
        "text": "4...e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e5",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/2P1p3/1P3N2/PB1PPPPP/RN1QKB1R w KQkq - 0 5",
        "text": "Don't retreat. Jump into the center with Nd4. Hikaru played this in every one of his games here.",
        "highlightSquares": [
          "f3",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/2P1p3/1P3N2/PB1PPPPP/RN1QKB1R w KQkq - 0 5",
        "correctMove": "Nd4",
        "prompt": "Jump to Nd4.",
        "hint": "Knight f3 to d4.",
        "correctFeedback": "Nd4. Black develops the bishop to c5, hitting your knight.",
        "wrongFeedback": "Play Nd4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2PNp3/1P6/PB1PPPPP/RN1QKB1R w KQkq - 2 6",
        "text": "5...Bc5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "c5"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2PNp3/1P6/PB1PPPPP/RN1QKB1R w KQkq - 2 6",
        "text": "The c5 bishop attacks your knight. Hop again, to f5. From there it eyes g7 and d6.",
        "highlightSquares": [
          "d4",
          "f5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2PNp3/1P6/PB1PPPPP/RN1QKB1R w KQkq - 2 6",
        "correctMove": "Nf5",
        "prompt": "Hop to Nf5.",
        "hint": "Knight d4 to f5.",
        "correctFeedback": "Nf5. Black castles.",
        "wrongFeedback": "Play Nf5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "text": "6...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "text": "Recall: Nf3, Nd4, Nf5."
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/2P1p3/1P3N2/PB1PPPPP/RN1QKB1R w KQkq - 0 5",
        "text": "4...e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/2P1p3/1P3N2/PB1PPPPP/RN1QKB1R w KQkq - 0 5",
        "correctMove": "Nd4",
        "prompt": "Your move.",
        "hint": "Nd4.",
        "correctFeedback": "Nd4.",
        "wrongFeedback": "Nd4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2PNp3/1P6/PB1PPPPP/RN1QKB1R w KQkq - 2 6",
        "text": "5...Bc5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2PNp3/1P6/PB1PPPPP/RN1QKB1R w KQkq - 2 6",
        "correctMove": "Nf5",
        "prompt": "Your move.",
        "hint": "Nf5.",
        "correctFeedback": "Nf5.",
        "wrongFeedback": "Nf5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "text": "Nf3, Nd4, Nf5. Three knight moves, each one dodging an attack and getting more active. Next, the knight goes after the e4 pawn."
      }
    ]
  },
  "hl-3": {
    "id": "hl-3",
    "title": "Win the e4 Fight",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "text": "Black's e4 pawn is far from home. Your knight swings to g3 to attack it, and the b2 bishop removes one of its defenders."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "2...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "c4",
        "prompt": "Your move.",
        "hint": "c4.",
        "correctFeedback": "c4.",
        "wrongFeedback": "c4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "text": "3...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/2P1p3/1P3N2/PB1PPPPP/RN1QKB1R w KQkq - 0 5",
        "text": "4...e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/2P1p3/1P3N2/PB1PPPPP/RN1QKB1R w KQkq - 0 5",
        "correctMove": "Nd4",
        "prompt": "Your move.",
        "hint": "Nd4.",
        "correctFeedback": "Nd4.",
        "wrongFeedback": "Nd4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2PNp3/1P6/PB1PPPPP/RN1QKB1R w KQkq - 2 6",
        "text": "5...Bc5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2PNp3/1P6/PB1PPPPP/RN1QKB1R w KQkq - 2 6",
        "correctMove": "Nf5",
        "prompt": "Your move.",
        "hint": "Nf5.",
        "correctFeedback": "Nf5.",
        "wrongFeedback": "Nf5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "text": "6...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "text": "One more hop: Ng3. Now the knight attacks the e4 pawn Black pushed so far forward.",
        "highlightSquares": [
          "f5",
          "g3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "correctMove": "Ng3",
        "prompt": "Play Ng3.",
        "hint": "Knight f5 to g3.",
        "correctFeedback": "Ng3. Black defends e4 with Re8.",
        "wrongFeedback": "Play Ng3.",
        "orientation": "white",
        "postMoveArrow": [
          "g3",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqr1k1/pppp1ppp/2n2n2/2b5/2P1p3/1P4N1/PB1PPPPP/RN1QKB1R w KQ - 6 8",
        "text": "7...Re8.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "e8"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqr1k1/pppp1ppp/2n2n2/2b5/2P1p3/1P4N1/PB1PPPPP/RN1QKB1R w KQ - 6 8",
        "text": "A quiet move: e3. It stops the e-pawn from going any further and opens a path for your f1 bishop.",
        "highlightSquares": [
          "e2",
          "e3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqr1k1/pppp1ppp/2n2n2/2b5/2P1p3/1P4N1/PB1PPPPP/RN1QKB1R w KQ - 6 8",
        "correctMove": "e3",
        "prompt": "Play e3.",
        "hint": "Pawn e2 to e3.",
        "correctFeedback": "e3. Black hits back in the center with d5.",
        "wrongFeedback": "Play e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqr1k1/ppp2ppp/2n2n2/2bp4/2P1p3/1P2P1N1/PB1P1PPP/RN1QKB1R w KQ - 0 9",
        "text": "8...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqr1k1/ppp2ppp/2n2n2/2bp4/2P1p3/1P2P1N1/PB1P1PPP/RN1QKB1R w KQ - 0 9",
        "text": "Now take the f6 knight. It was defending e4. After the recapture, Nc3 hits e4 a second time.",
        "highlightSquares": [
          "b2",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqr1k1/ppp2ppp/2n2n2/2bp4/2P1p3/1P2P1N1/PB1P1PPP/RN1QKB1R w KQ - 0 9",
        "correctMove": "Bxf6",
        "prompt": "Capture Bxf6.",
        "hint": "Bishop b2 takes f6.",
        "correctFeedback": "Bxf6. Black recaptures with the queen. Next comes Nc3, and e4 is under heavy pressure.",
        "wrongFeedback": "Play Bxf6.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1b1r1k1/ppp2ppp/2n2q2/2bp4/2P1p3/1P2P1N1/P2P1PPP/RN1QKB1R w KQ - 0 10",
        "text": "9...Qxf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "text": "Recall: Ng3, e3, Bxf6."
      },
      {
        "type": "play-move",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "correctMove": "Ng3",
        "prompt": "Your move.",
        "hint": "Ng3.",
        "correctFeedback": "Ng3.",
        "wrongFeedback": "Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqr1k1/pppp1ppp/2n2n2/2b5/2P1p3/1P4N1/PB1PPPPP/RN1QKB1R w KQ - 6 8",
        "text": "7...Re8.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "e8"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqr1k1/pppp1ppp/2n2n2/2b5/2P1p3/1P4N1/PB1PPPPP/RN1QKB1R w KQ - 6 8",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqr1k1/ppp2ppp/2n2n2/2bp4/2P1p3/1P2P1N1/PB1P1PPP/RN1QKB1R w KQ - 0 9",
        "text": "8...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqr1k1/ppp2ppp/2n2n2/2bp4/2P1p3/1P2P1N1/PB1P1PPP/RN1QKB1R w KQ - 0 9",
        "correctMove": "Bxf6",
        "prompt": "Your move.",
        "hint": "Bxf6.",
        "correctFeedback": "Bxf6.",
        "wrongFeedback": "Bxf6.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1b1r1k1/ppp2ppp/2n2q2/2bp4/2P1p3/1P2P1N1/P2P1PPP/RN1QKB1R w KQ - 0 10",
        "text": "Ng3, e3, Bxf6. You gave up the long bishop to win the fight for e4. In Hikaru's games, Nc3 comes next and the knight takes back on e4."
      }
    ]
  },
  "hl-dev-3g6": {
    "id": "hl-dev-3g6",
    "title": "If 3...g6",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 0 4",
        "text": "Black answers c4 with g6, getting ready to put a bishop on g7. Hikaru copies the idea on his side of the board."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "2...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "c4",
        "prompt": "Your move.",
        "hint": "c4.",
        "correctFeedback": "c4.",
        "wrongFeedback": "c4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 0 4",
        "text": "3...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 0 4",
        "text": "Copy the idea with g3. It makes room for your other bishop.",
        "highlightSquares": [
          "g2",
          "g3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 0 4",
        "correctMove": "g3",
        "prompt": "Play g3.",
        "hint": "Pawn g2 to g3.",
        "correctFeedback": "g3. Black puts the bishop on g7.",
        "wrongFeedback": "Play g3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/pppp1pbp/2n3p1/4p3/2P5/1P4P1/PB1PPP1P/RN1QKBNR w KQkq - 1 5",
        "text": "4...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/pppp1pbp/2n3p1/4p3/2P5/1P4P1/PB1PPP1P/RN1QKBNR w KQkq - 1 5",
        "text": "Bishop to g2. Now both your bishops sit on long diagonals.",
        "highlightSquares": [
          "f1",
          "g2"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk1nr/pppp1pbp/2n3p1/4p3/2P5/1P4P1/PB1PPP1P/RN1QKBNR w KQkq - 1 5",
        "correctMove": "Bg2",
        "prompt": "Play Bg2.",
        "hint": "Bishop f1 to g2.",
        "correctFeedback": "Bg2. Black develops with Nge7.",
        "wrongFeedback": "Play Bg2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppppnpbp/2n3p1/4p3/2P5/1P4P1/PB1PPPBP/RN1QK1NR w KQkq - 3 6",
        "text": "5...Nge7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "e7"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppppnpbp/2n3p1/4p3/2P5/1P4P1/PB1PPPBP/RN1QK1NR w KQkq - 3 6",
        "text": "Develop Nc3. Together with c4 and the g2 bishop it controls d5, the key square in the center.",
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppppnpbp/2n3p1/4p3/2P5/1P4P1/PB1PPPBP/RN1QK1NR w KQkq - 3 6",
        "correctMove": "Nc3",
        "prompt": "Play Nc3.",
        "hint": "Knight b1 to c3.",
        "correctFeedback": "Nc3. Black castles.",
        "wrongFeedback": "Play Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/ppppnpbp/2n3p1/4p3/2P5/1PN3P1/PB1PPPBP/R2QK1NR w KQ - 5 7",
        "text": "6...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 0 4",
        "text": "Recall: g3, Bg2, Nc3."
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 0 4",
        "correctMove": "g3",
        "prompt": "Your move.",
        "hint": "g3.",
        "correctFeedback": "g3.",
        "wrongFeedback": "g3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/pppp1pbp/2n3p1/4p3/2P5/1P4P1/PB1PPP1P/RN1QKBNR w KQkq - 1 5",
        "text": "4...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk1nr/pppp1pbp/2n3p1/4p3/2P5/1P4P1/PB1PPP1P/RN1QKBNR w KQkq - 1 5",
        "correctMove": "Bg2",
        "prompt": "Your move.",
        "hint": "Bg2.",
        "correctFeedback": "Bg2.",
        "wrongFeedback": "Bg2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppppnpbp/2n3p1/4p3/2P5/1P4P1/PB1PPPBP/RN1QK1NR w KQkq - 3 6",
        "text": "5...Nge7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppppnpbp/2n3p1/4p3/2P5/1P4P1/PB1PPPBP/RN1QK1NR w KQkq - 3 6",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/ppppnpbp/2n3p1/4p3/2P5/1PN3P1/PB1PPPBP/R2QK1NR w KQ - 5 7",
        "text": "g3, Bg2, Nc3. Both your bishops sit on long diagonals and you control d5. Hikaru scores 96% from here."
      }
    ]
  },
  "hl-dev-1d5": {
    "id": "hl-dev-1d5",
    "title": "If 1...d5",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "Black's most common answer to 1.b3 is 1...d5. Hikaru doesn't race for the center with pawns. He builds a small, solid setup and lets Black come to him."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "Play d3. It covers e4, so Black's knight can't jump there.",
        "highlightSquares": [
          "d2",
          "d3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Play d3.",
        "hint": "Pawn d2 to d3.",
        "correctFeedback": "d3. Black takes space with c5.",
        "wrongFeedback": "Play d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/8/1P1P4/PBP1PPPP/RN1QKBNR w KQkq - 0 4",
        "text": "3...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/8/1P1P4/PBP1PPPP/RN1QKBNR w KQkq - 0 4",
        "text": "Knight to d2, not c3. It also covers e4 and keeps your c-pawn free to move.",
        "highlightSquares": [
          "b1",
          "d2"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/8/1P1P4/PBP1PPPP/RN1QKBNR w KQkq - 0 4",
        "correctMove": "Nd2",
        "prompt": "Play Nd2.",
        "hint": "Knight b1 to d2.",
        "correctFeedback": "Nd2. Black develops with Nc6.",
        "wrongFeedback": "Play Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pp2pppp/2n2n2/2pp4/8/1P1P4/PBPNPPPP/R2QKBNR w KQkq - 2 5",
        "text": "4...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pp2pppp/2n2n2/2pp4/8/1P1P4/PBPNPPPP/R2QKBNR w KQkq - 2 5",
        "text": "Bring out the other knight: Ngf3.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pp2pppp/2n2n2/2pp4/8/1P1P4/PBPNPPPP/R2QKBNR w KQkq - 2 5",
        "correctMove": "Ngf3",
        "prompt": "Play Ngf3.",
        "hint": "Knight g1 to f3.",
        "correctFeedback": "Ngf3. Black plays g6.",
        "wrongFeedback": "Play Ngf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pp2pp1p/2n2np1/2pp4/8/1P1P1N2/PBPNPPPP/R2QKB1R w KQkq - 0 6",
        "text": "5...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "Recall: d3, Nd2, Ngf3."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Your move.",
        "hint": "d3.",
        "correctFeedback": "d3.",
        "wrongFeedback": "d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/8/1P1P4/PBP1PPPP/RN1QKBNR w KQkq - 0 4",
        "text": "3...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/8/1P1P4/PBP1PPPP/RN1QKBNR w KQkq - 0 4",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pp2pppp/2n2n2/2pp4/8/1P1P4/PBPNPPPP/R2QKBNR w KQkq - 2 5",
        "text": "4...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pp2pppp/2n2n2/2pp4/8/1P1P4/PBPNPPPP/R2QKBNR w KQkq - 2 5",
        "correctMove": "Ngf3",
        "prompt": "Your move.",
        "hint": "Ngf3.",
        "correctFeedback": "Ngf3.",
        "wrongFeedback": "Ngf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pp2pp1p/2n2np1/2pp4/8/1P1P1N2/PBPNPPPP/R2QKB1R w KQkq - 0 6",
        "text": "d3, Nd2, Ngf3. A compact setup that controls e4, while the b2 bishop does the long-range work."
      }
    ]
  },
  "hl-dev-1nf6": {
    "id": "hl-dev-1nf6",
    "title": "If 1...Nf6 2.Bb2 g6",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 0 3",
        "text": "Against 1...Nf6 and 2...g6, Black wants the g7 bishop to fight your b2 bishop. Hikaru switches plans and takes the center with d4."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Quick recap to the position."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 0 3",
        "text": "2...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 0 3",
        "text": "Push d4. The bishop Black is about to put on g7 will run into this pawn.",
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 0 3",
        "correctMove": "d4",
        "prompt": "Play d4.",
        "hint": "Pawn d2 to d4.",
        "correctFeedback": "d4. Black puts the bishop on g7 anyway.",
        "wrongFeedback": "Play d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppppppbp/5np1/8/3P4/1P6/PBP1PPPP/RN1QKBNR w KQkq - 1 4",
        "text": "3...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppppppbp/5np1/8/3P4/1P6/PBP1PPPP/RN1QKBNR w KQkq - 1 4",
        "text": "Develop Nf3. It guards d4 and covers e5.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/ppppppbp/5np1/8/3P4/1P6/PBP1PPPP/RN1QKBNR w KQkq - 1 4",
        "correctMove": "Nf3",
        "prompt": "Play Nf3.",
        "hint": "Knight g1 to f3.",
        "correctFeedback": "Nf3. Black castles.",
        "wrongFeedback": "Play Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppppppbp/5np1/8/3P4/1P3N2/PBP1PPPP/RN1QKB1R w KQ - 3 5",
        "text": "4...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppppppbp/5np1/8/3P4/1P3N2/PBP1PPPP/RN1QKB1R w KQ - 3 5",
        "text": "Play e3. Your center is solid, and the f1 bishop can come out.",
        "highlightSquares": [
          "e2",
          "e3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/ppppppbp/5np1/8/3P4/1P3N2/PBP1PPPP/RN1QKB1R w KQ - 3 5",
        "correctMove": "e3",
        "prompt": "Play e3.",
        "hint": "Pawn e2 to e3.",
        "correctFeedback": "e3. Black plays d6.",
        "wrongFeedback": "Play e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppp1ppbp/3p1np1/8/3P4/1P2PN2/PBP2PPP/RN1QKB1R w KQ - 0 6",
        "text": "5...d6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 0 3",
        "text": "Recall: d4, Nf3, e3."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 0 3",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppppppbp/5np1/8/3P4/1P6/PBP1PPPP/RN1QKBNR w KQkq - 1 4",
        "text": "3...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/ppppppbp/5np1/8/3P4/1P6/PBP1PPPP/RN1QKBNR w KQkq - 1 4",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppppppbp/5np1/8/3P4/1P3N2/PBP1PPPP/RN1QKB1R w KQ - 3 5",
        "text": "4...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/ppppppbp/5np1/8/3P4/1P3N2/PBP1PPPP/RN1QKB1R w KQ - 3 5",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppp1ppbp/3p1np1/8/3P4/1P2PN2/PBP2PPP/RN1QKB1R w KQ - 0 6",
        "text": "d4, Nf3, e3. A solid center that blunts the g7 bishop. From here Hikaru plays Be2 and castles."
      }
    ]
  },
  "hl-test-1": {
    "id": "hl-test-1",
    "title": "Lvl 1 Test",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Test time. Play Hikaru's 1.b3: the main line against 1...e5 plus the three key replies. No hints.",
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
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "2...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "c4",
        "prompt": "Your move.",
        "hint": "c4.",
        "correctFeedback": "c4.",
        "wrongFeedback": "c4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "text": "3...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 1 4",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/2P1p3/1P3N2/PB1PPPPP/RN1QKB1R w KQkq - 0 5",
        "text": "4...e4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/2P1p3/1P3N2/PB1PPPPP/RN1QKB1R w KQkq - 0 5",
        "correctMove": "Nd4",
        "prompt": "Your move.",
        "hint": "Nd4.",
        "correctFeedback": "Nd4.",
        "wrongFeedback": "Nd4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2PNp3/1P6/PB1PPPPP/RN1QKB1R w KQkq - 2 6",
        "text": "5...Bc5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2PNp3/1P6/PB1PPPPP/RN1QKB1R w KQkq - 2 6",
        "correctMove": "Nf5",
        "prompt": "Your move.",
        "hint": "Nf5.",
        "correctFeedback": "Nf5.",
        "wrongFeedback": "Nf5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "text": "6...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b2N2/2P1p3/1P6/PB1PPPPP/RN1QKB1R w KQ - 4 7",
        "correctMove": "Ng3",
        "prompt": "Your move.",
        "hint": "Ng3.",
        "correctFeedback": "Ng3.",
        "wrongFeedback": "Ng3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqr1k1/pppp1ppp/2n2n2/2b5/2P1p3/1P4N1/PB1PPPPP/RN1QKB1R w KQ - 6 8",
        "text": "7...Re8.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "e8"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqr1k1/pppp1ppp/2n2n2/2b5/2P1p3/1P4N1/PB1PPPPP/RN1QKB1R w KQ - 6 8",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqr1k1/ppp2ppp/2n2n2/2bp4/2P1p3/1P2P1N1/PB1P1PPP/RN1QKB1R w KQ - 0 9",
        "text": "8...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqr1k1/ppp2ppp/2n2n2/2bp4/2P1p3/1P2P1N1/PB1P1PPP/RN1QKB1R w KQ - 0 9",
        "correctMove": "Bxf6",
        "prompt": "Your move.",
        "hint": "Bxf6.",
        "correctFeedback": "Bxf6.",
        "wrongFeedback": "Bxf6.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1b1r1k1/ppp2ppp/2n2q2/2bp4/2P1p3/1P2P1N1/P2P1PPP/RN1QKB1R w KQ - 0 10",
        "text": "9...Qxf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 3...g6 —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "2...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "c4",
        "prompt": "Your move.",
        "hint": "c4.",
        "correctFeedback": "c4.",
        "wrongFeedback": "c4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 0 4",
        "text": "3...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/1P6/PB1PPPPP/RN1QKBNR w KQkq - 0 4",
        "correctMove": "g3",
        "prompt": "Your move.",
        "hint": "g3.",
        "correctFeedback": "g3.",
        "wrongFeedback": "g3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk1nr/pppp1pbp/2n3p1/4p3/2P5/1P4P1/PB1PPP1P/RN1QKBNR w KQkq - 1 5",
        "text": "4...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk1nr/pppp1pbp/2n3p1/4p3/2P5/1P4P1/PB1PPP1P/RN1QKBNR w KQkq - 1 5",
        "correctMove": "Bg2",
        "prompt": "Your move.",
        "hint": "Bg2.",
        "correctFeedback": "Bg2.",
        "wrongFeedback": "Bg2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqk2r/ppppnpbp/2n3p1/4p3/2P5/1P4P1/PB1PPPBP/RN1QK1NR w KQkq - 3 6",
        "text": "5...Nge7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqk2r/ppppnpbp/2n3p1/4p3/2P5/1P4P1/PB1PPPBP/RN1QK1NR w KQkq - 3 6",
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
        "text": "— If 1...d5 —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "text": "2...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 2 3",
        "correctMove": "d3",
        "prompt": "Your move.",
        "hint": "d3.",
        "correctFeedback": "d3.",
        "wrongFeedback": "d3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/8/1P1P4/PBP1PPPP/RN1QKBNR w KQkq - 0 4",
        "text": "3...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c7",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/8/1P1P4/PBP1PPPP/RN1QKBNR w KQkq - 0 4",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bqkb1r/pp2pppp/2n2n2/2pp4/8/1P1P4/PBPNPPPP/R2QKBNR w KQkq - 2 5",
        "text": "4...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bqkb1r/pp2pppp/2n2n2/2pp4/8/1P1P4/PBPNPPPP/R2QKBNR w KQkq - 2 5",
        "correctMove": "Ngf3",
        "prompt": "Your move.",
        "hint": "Ngf3.",
        "correctFeedback": "Ngf3.",
        "wrongFeedback": "Ngf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 1...Nf6 2.Bb2 g6 —"
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "correctMove": "b3",
        "prompt": "Your move.",
        "hint": "b3.",
        "correctFeedback": "b3.",
        "wrongFeedback": "b3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppppp/5n2/8/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 1 2",
        "text": "1...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppppp/5n2/8/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 1 2",
        "correctMove": "Bb2",
        "prompt": "Your move.",
        "hint": "Bb2.",
        "correctFeedback": "Bb2.",
        "wrongFeedback": "Bb2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 0 3",
        "text": "2...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/8/1P6/PBPPPPPP/RN1QKBNR w KQkq - 0 3",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppppppbp/5np1/8/3P4/1P6/PBP1PPPP/RN1QKBNR w KQkq - 1 4",
        "text": "3...Bg7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "g7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/ppppppbp/5np1/8/3P4/1P6/PBP1PPPP/RN1QKBNR w KQkq - 1 4",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppppppbp/5np1/8/3P4/1P3N2/PBP1PPPP/RN1QKB1R w KQ - 3 5",
        "text": "4...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/ppppppbp/5np1/8/3P4/1P3N2/PBP1PPPP/RN1QKB1R w KQ - 3 5",
        "correctMove": "e3",
        "prompt": "Your move.",
        "hint": "e3.",
        "correctFeedback": "e3.",
        "wrongFeedback": "e3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Level 1 complete. You can now play Hikaru's 1.b3 against Black's three most common replies."
      }
    ]
  }
}

export function getHikaruLarsenLesson(id: string): OpeningLesson | undefined {
  return HIKARU_LARSEN_LESSONS[id]
}
