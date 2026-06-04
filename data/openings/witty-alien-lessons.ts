// GENERATED — do not edit by hand. Source: witty_alien's real chess.com games.
import type { OpeningLesson } from '@/types/opening-lesson'

const WITTY_ALIEN_LESSONS: Record<string, OpeningLesson> = {
  "wa-1": {
    "id": "wa-1",
    "title": "The Caro Setup",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "The Alien Gambit — Witty's signature f7 knight sacrifice against the Caro-Kann. First, the normal setup."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Open 1.e4 — Black answers with the Caro-Kann, c6.",
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
        "correctFeedback": "e4.",
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
        "text": "Grab the center with d4.",
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "d4",
        "prompt": "Play d4.",
        "hint": "Pawn d2 to d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "Play d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "Develop the knight to d2, heading for e4.",
        "highlightSquares": [
          "b1",
          "d2"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Play Nd2.",
        "hint": "Knight b1 to d2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Play Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
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
        "text": "Recall: e4, d4, Nd2."
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "e4, d4, Nd2 — the standard Caro setup. Black takes on e4 and develops Nf6. Now the trap springs."
      }
    ]
  },
  "wa-2": {
    "id": "wa-2",
    "title": "The f7 Sacrifice",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "Recapture, jump to g5 aiming at f7, and when Black kicks with h6 — sacrifice the knight on f7."
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "Recapture on e4 — the knight eyes g5 and f7.",
        "highlightSquares": [
          "d2",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Recapture Nxe4.",
        "hint": "Knight d2 takes e4.",
        "correctFeedback": "Nxe4. Black develops Nf6.",
        "wrongFeedback": "Play Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "Leap to g5 — the knight stares straight at f7.",
        "highlightSquares": [
          "e4",
          "g5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "correctMove": "Ng5",
        "prompt": "Play Ng5.",
        "hint": "Knight e4 to g5.",
        "correctFeedback": "Ng5! Threatening f7.",
        "wrongFeedback": "Play Ng5.",
        "orientation": "white",
        "postMoveArrow": [
          "g5",
          "f7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "5...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "THE SACRIFICE. Black kicked with h6 — don't retreat, take f7! Nxf7 drags the king out into the open.",
        "highlightSquares": [
          "g5",
          "f7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "correctMove": "Nxf7",
        "prompt": "Sacrifice — Nxf7!",
        "hint": "Knight g5 takes f7.",
        "correctFeedback": "Nxf7!! The signature Alien sac. The king must take.",
        "wrongFeedback": "Play Nxf7.",
        "orientation": "white",
        "postMoveArrow": [
          "f7",
          "h8"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "text": "6...Kxf7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "f7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "Recall: Nxe4, Ng5, Nxf7."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "5...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "correctMove": "Nxf7",
        "prompt": "Your move.",
        "hint": "Nxf7.",
        "correctFeedback": "Nxf7.",
        "wrongFeedback": "Nxf7.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "text": "Nxe4, Ng5, Nxf7!! — a whole knight for the f7 pawn and a king with no cover. Now hunt it."
      }
    ]
  },
  "wa-3": {
    "id": "wa-3",
    "title": "The King Hunt",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "text": "The king is on f7 with no shelter. Develop with checks — Nf3, Ne5+, Bc4+ — and chase it home."
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "5...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "correctMove": "Nxf7",
        "prompt": "Your move.",
        "hint": "Nxf7.",
        "correctFeedback": "Nxf7.",
        "wrongFeedback": "Nxf7.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "text": "6...Kxf7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "f7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "text": "Develop with tempo — Nf3 heads for e5 and the bare king.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "correctMove": "Nf3",
        "prompt": "Develop Nf3.",
        "hint": "Knight g1 to f3.",
        "correctFeedback": "Nf3. The hunt begins.",
        "wrongFeedback": "Play Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "text": "7...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c6",
          "c5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "text": "Check! Ne5+ forks into the attack and drives the king back.",
        "highlightSquares": [
          "f3",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "correctMove": "Ne5+",
        "prompt": "Play Ne5+.",
        "hint": "Knight f3 to e5, check.",
        "correctFeedback": "Ne5+. The king scrambles.",
        "wrongFeedback": "Play Ne5+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp2p1p1/5n1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9",
        "text": "8...Kg8.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f7",
          "g8"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp2p1p1/5n1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9",
        "text": "Another check — Bc4+ rakes the a2-g8 diagonal at the king.",
        "highlightSquares": [
          "f1",
          "c4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1bkr/pp2p1p1/5n1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9",
        "correctMove": "Bc4+",
        "prompt": "Play Bc4+.",
        "hint": "Bishop f1 to c4, check.",
        "correctFeedback": "Bc4+. Black must block with e6.",
        "wrongFeedback": "Play Bc4+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "text": "9...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "text": "Recall: Nf3, Ne5+, Bc4+."
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "text": "7...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c6",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "correctMove": "Ne5+",
        "prompt": "Your move.",
        "hint": "Ne5+.",
        "correctFeedback": "Ne5+.",
        "wrongFeedback": "Ne5+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp2p1p1/5n1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9",
        "text": "8...Kg8.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f7",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1bkr/pp2p1p1/5n1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9",
        "correctMove": "Bc4+",
        "prompt": "Your move.",
        "hint": "Bc4+.",
        "correctFeedback": "Bc4+.",
        "wrongFeedback": "Bc4+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "text": "Nf3, Ne5+, Bc4+ — every move with tempo, driving the king back and piling pieces toward it."
      }
    ]
  },
  "wa-4": {
    "id": "wa-4",
    "title": "Cash In the Attack",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "text": "King boxed in the corner. Castle to swing the rook onto the f-file, fork with Ng6, and pour the queen in."
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "5...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "correctMove": "Nxf7",
        "prompt": "Your move.",
        "hint": "Nxf7.",
        "correctFeedback": "Nxf7.",
        "wrongFeedback": "Nxf7.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "text": "6...Kxf7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "f7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "text": "7...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c6",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "correctMove": "Ne5+",
        "prompt": "Your move.",
        "hint": "Ne5+.",
        "correctFeedback": "Ne5+.",
        "wrongFeedback": "Ne5+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp2p1p1/5n1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9",
        "text": "8...Kg8.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f7",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1bkr/pp2p1p1/5n1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9",
        "correctMove": "Bc4+",
        "prompt": "Your move.",
        "hint": "Bc4+.",
        "correctFeedback": "Bc4+.",
        "wrongFeedback": "Bc4+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "text": "9...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "text": "Tuck the king away and bring the rook to the open f-file with O-O.",
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "correctMove": "O-O",
        "prompt": "Castle O-O.",
        "hint": "Castle kingside.",
        "correctFeedback": "O-O. Rook on f1, attack fully mobilized.",
        "wrongFeedback": "Play O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1bkr/pp4p1/2n1pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQ1RK1 w - - 2 11",
        "text": "10...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bq1bkr/pp4p1/2n1pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQ1RK1 w - - 2 11",
        "text": "Ng6! The knight forks the h8 rook and keeps the king pinned in the corner.",
        "highlightSquares": [
          "e5",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1bkr/pp4p1/2n1pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQ1RK1 w - - 2 11",
        "correctMove": "Ng6",
        "prompt": "Play Ng6.",
        "hint": "Knight e5 to g6.",
        "correctFeedback": "Ng6. Winning the exchange while the attack rolls.",
        "wrongFeedback": "Play Ng6.",
        "orientation": "white",
        "postMoveArrow": [
          "g6",
          "h8"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1b2bkr/pp4p1/2n1pnNp/2p5/2Bq4/8/PPP2PPP/R1BQ1RK1 w - - 0 12",
        "text": "11...Qxd4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d8",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1b2bkr/pp4p1/2n1pnNp/2p5/2Bq4/8/PPP2PPP/R1BQ1RK1 w - - 0 12",
        "text": "Keep developing into the attack — Qe2 connects the rooks and eyes the kingside.",
        "highlightSquares": [
          "d1",
          "e2"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1b2bkr/pp4p1/2n1pnNp/2p5/2Bq4/8/PPP2PPP/R1BQ1RK1 w - - 0 12",
        "correctMove": "Qe2",
        "prompt": "Play Qe2.",
        "hint": "Queen d1 to e2.",
        "correctFeedback": "Qe2. A raging attack for the piece — Witty scores ~80% here. Unsound by the engine, brutal in bullet.",
        "wrongFeedback": "Play Qe2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "text": "Recall: O-O, Ng6, Qe2."
      },
      {
        "type": "play-move",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "correctMove": "O-O",
        "prompt": "Your move.",
        "hint": "O-O.",
        "correctFeedback": "O-O.",
        "wrongFeedback": "O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1bkr/pp4p1/2n1pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQ1RK1 w - - 2 11",
        "text": "10...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1bkr/pp4p1/2n1pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQ1RK1 w - - 2 11",
        "correctMove": "Ng6",
        "prompt": "Your move.",
        "hint": "Ng6.",
        "correctFeedback": "Ng6.",
        "wrongFeedback": "Ng6.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1b2bkr/pp4p1/2n1pnNp/2p5/2Bq4/8/PPP2PPP/R1BQ1RK1 w - - 0 12",
        "text": "11...Qxd4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d8",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1b2bkr/pp4p1/2n1pnNp/2p5/2Bq4/8/PPP2PPP/R1BQ1RK1 w - - 0 12",
        "correctMove": "Qe2",
        "prompt": "Your move.",
        "hint": "Qe2.",
        "correctFeedback": "Qe2.",
        "wrongFeedback": "Qe2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1b2bkr/pp4p1/2n1pnNp/2p5/2Bq4/8/PPP1QPPP/R1B2RK1 b - - 1 12",
        "text": "O-O, Ng6, Qe2 — winning the exchange with a raging attack for the piece. ~80% in real bullet games."
      }
    ]
  },
  "wa-dev-Bf5": {
    "id": "wa-dev-Bf5",
    "title": "If 5...Bf5",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6",
        "text": "Instead of h6, Black develops the bishop to f5. No sacrifice — just chase the bishop and grab the bishop pair."
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6",
        "text": "5...Bf5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "f5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6",
        "text": "Develop the second knight — no sac needed here.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6",
        "correctMove": "N1f3",
        "prompt": "Develop N1f3.",
        "hint": "Knight g1 to f3.",
        "correctFeedback": "N1f3.",
        "wrongFeedback": "Play N1f3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1npppp/2p2n2/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 5 7",
        "text": "6...Nbd7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "d7"
        ]
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1npppp/2p2n2/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 5 7",
        "text": "Reroute to h4, attacking the f5 bishop.",
        "highlightSquares": [
          "f3",
          "h4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1npppp/2p2n2/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 5 7",
        "correctMove": "Nh4",
        "prompt": "Play Nh4.",
        "hint": "Knight f3 to h4.",
        "correctFeedback": "Nh4. Hunting the bishop.",
        "wrongFeedback": "Play Nh4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1npppp/2p2nb1/6N1/3P3N/8/PPP2PPP/R1BQKB1R w KQkq - 7 8",
        "text": "7...Bg6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f5",
          "g6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1npppp/2p2nb1/6N1/3P3N/8/PPP2PPP/R1BQKB1R w KQkq - 7 8",
        "text": "Trade off Black's best piece — Nxg6.",
        "highlightSquares": [
          "h4",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1npppp/2p2nb1/6N1/3P3N/8/PPP2PPP/R1BQKB1R w KQkq - 7 8",
        "correctMove": "Nxg6",
        "prompt": "Capture Nxg6.",
        "hint": "Knight h4 takes g6.",
        "correctFeedback": "Nxg6. Bishop pair won, easy game.",
        "wrongFeedback": "Play Nxg6.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1nppp1/2p2np1/6N1/3P4/8/PPP2PPP/R1BQKB1R w KQkq - 0 9",
        "text": "8...hxg6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "g6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6",
        "text": "Recall: N1f3, Nh4, Nxg6."
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6",
        "correctMove": "N1f3",
        "prompt": "Your move.",
        "hint": "N1f3.",
        "correctFeedback": "N1f3.",
        "wrongFeedback": "N1f3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1npppp/2p2n2/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 5 7",
        "text": "6...Nbd7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "d7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1npppp/2p2n2/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 5 7",
        "correctMove": "Nh4",
        "prompt": "Your move.",
        "hint": "Nh4.",
        "correctFeedback": "Nh4.",
        "wrongFeedback": "Nh4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1npppp/2p2nb1/6N1/3P3N/8/PPP2PPP/R1BQKB1R w KQkq - 7 8",
        "text": "7...Bg6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f5",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1npppp/2p2nb1/6N1/3P3N/8/PPP2PPP/R1BQKB1R w KQkq - 7 8",
        "correctMove": "Nxg6",
        "prompt": "Your move.",
        "hint": "Nxg6.",
        "correctFeedback": "Nxg6.",
        "wrongFeedback": "Nxg6.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1nppp1/2p2np1/6N1/3P4/8/PPP2PPP/R1BQKB1R w KQkq - 0 9",
        "text": "N1f3, Nh4, Nxg6 — Black's good bishop is gone and you have a safe, pleasant edge."
      }
    ]
  },
  "wa-dev-e6": {
    "id": "wa-dev-e6",
    "title": "If 5...e6",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp3ppp/2p1pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "Black plays e6 to keep things solid. No sac — develop classically and aim at the kingside."
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp3ppp/2p1pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "5...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp3ppp/2p1pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "Develop the second knight.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp3ppp/2p1pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "correctMove": "N1f3",
        "prompt": "Develop N1f3.",
        "hint": "Knight g1 to f3.",
        "correctFeedback": "N1f3.",
        "wrongFeedback": "Play N1f3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pbpn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 2 7",
        "text": "6...Bd6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "d6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pbpn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 2 7",
        "text": "Aim the bishop at h7 with Bd3 — the classic Caro attacking battery.",
        "highlightSquares": [
          "f1",
          "d3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/pp3ppp/2pbpn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 2 7",
        "correctMove": "Bd3",
        "prompt": "Develop Bd3.",
        "hint": "Bishop f1 to d3.",
        "correctFeedback": "Bd3. Pointed at the king.",
        "wrongFeedback": "Play Bd3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp3ppp/2pbpn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 8",
        "text": "7...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp3ppp/2pbpn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 8",
        "text": "Bring the queen to e2, supporting ideas of Ng5 and a kingside push.",
        "highlightSquares": [
          "d1",
          "e2"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/pp3ppp/2pbpn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 8",
        "correctMove": "Qe2",
        "prompt": "Play Qe2.",
        "hint": "Queen d1 to e2.",
        "correctFeedback": "Qe2. Pieces poised for the attack.",
        "wrongFeedback": "Play Qe2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp3pp1/2pbpn1p/6N1/3P4/3B1N2/PPP1QPPP/R1B1K2R w KQ - 0 9",
        "text": "8...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp3ppp/2p1pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "Recall: N1f3, Bd3, Qe2."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp3ppp/2p1pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "correctMove": "N1f3",
        "prompt": "Your move.",
        "hint": "N1f3.",
        "correctFeedback": "N1f3.",
        "wrongFeedback": "N1f3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pbpn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 2 7",
        "text": "6...Bd6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/pp3ppp/2pbpn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 2 7",
        "correctMove": "Bd3",
        "prompt": "Your move.",
        "hint": "Bd3.",
        "correctFeedback": "Bd3.",
        "wrongFeedback": "Bd3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp3ppp/2pbpn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 8",
        "text": "7...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/pp3ppp/2pbpn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 8",
        "correctMove": "Qe2",
        "prompt": "Your move.",
        "hint": "Qe2.",
        "correctFeedback": "Qe2.",
        "wrongFeedback": "Qe2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp3pp1/2pbpn1p/6N1/3P4/3B1N2/PPP1QPPP/R1B1K2R w KQ - 0 9",
        "text": "N1f3, Bd3, Qe2 — smooth development with the bishop pointed at h7. A comfortable attacking setup."
      }
    ]
  },
  "wa-test-1": {
    "id": "wa-test-1",
    "title": "Lvl 1 Test",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Test time. Play the Alien Gambit — the f7 sacrifice and king hunt, plus the quiet deviations. No hints.",
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "5...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "correctMove": "Nxf7",
        "prompt": "Your move.",
        "hint": "Nxf7.",
        "correctFeedback": "Nxf7.",
        "wrongFeedback": "Nxf7.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "text": "6...Kxf7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "f7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "text": "7...c5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c6",
          "c5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "correctMove": "Ne5+",
        "prompt": "Your move.",
        "hint": "Ne5+.",
        "correctFeedback": "Ne5+.",
        "wrongFeedback": "Ne5+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp2p1p1/5n1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9",
        "text": "8...Kg8.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f7",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1bkr/pp2p1p1/5n1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9",
        "correctMove": "Bc4+",
        "prompt": "Your move.",
        "hint": "Bc4+.",
        "correctFeedback": "Bc4+.",
        "wrongFeedback": "Bc4+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "text": "9...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1bkr/pp4p1/4pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10",
        "correctMove": "O-O",
        "prompt": "Your move.",
        "hint": "O-O.",
        "correctFeedback": "O-O.",
        "wrongFeedback": "O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1bkr/pp4p1/2n1pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQ1RK1 w - - 2 11",
        "text": "10...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1bkr/pp4p1/2n1pn1p/2p1N3/2BP4/8/PPP2PPP/R1BQ1RK1 w - - 2 11",
        "correctMove": "Ng6",
        "prompt": "Your move.",
        "hint": "Ng6.",
        "correctFeedback": "Ng6.",
        "wrongFeedback": "Ng6.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1b2bkr/pp4p1/2n1pnNp/2p5/2Bq4/8/PPP2PPP/R1BQ1RK1 w - - 0 12",
        "text": "11...Qxd4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d8",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1b2bkr/pp4p1/2n1pnNp/2p5/2Bq4/8/PPP2PPP/R1BQ1RK1 w - - 0 12",
        "correctMove": "Qe2",
        "prompt": "Your move.",
        "hint": "Qe2.",
        "correctFeedback": "Qe2.",
        "wrongFeedback": "Qe2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 5...Bf5 —"
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6",
        "text": "5...Bf5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "c8",
          "f5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6",
        "correctMove": "N1f3",
        "prompt": "Your move.",
        "hint": "N1f3.",
        "correctFeedback": "N1f3.",
        "wrongFeedback": "N1f3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1npppp/2p2n2/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 5 7",
        "text": "6...Nbd7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "d7"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1npppp/2p2n2/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 5 7",
        "correctMove": "Nh4",
        "prompt": "Your move.",
        "hint": "Nh4.",
        "correctFeedback": "Nh4.",
        "wrongFeedback": "Nh4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r2qkb1r/pp1npppp/2p2nb1/6N1/3P3N/8/PPP2PPP/R1BQKB1R w KQkq - 7 8",
        "text": "7...Bg6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f5",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r2qkb1r/pp1npppp/2p2nb1/6N1/3P3N/8/PPP2PPP/R1BQKB1R w KQkq - 7 8",
        "correctMove": "Nxg6",
        "prompt": "Your move.",
        "hint": "Nxg6.",
        "correctFeedback": "Nxg6.",
        "wrongFeedback": "Nxg6.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— If 5...e6 —"
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
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "text": "2...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "correctMove": "Nd2",
        "prompt": "Your move.",
        "hint": "Nd2.",
        "correctFeedback": "Nd2.",
        "wrongFeedback": "Nd2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "text": "3...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/pp2pppp/2p5/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "text": "4...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/pp3ppp/2p1pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "text": "5...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/pp3ppp/2p1pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6",
        "correctMove": "N1f3",
        "prompt": "Your move.",
        "hint": "N1f3.",
        "correctFeedback": "N1f3.",
        "wrongFeedback": "N1f3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/pp3ppp/2pbpn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 2 7",
        "text": "6...Bd6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/pp3ppp/2pbpn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 2 7",
        "correctMove": "Bd3",
        "prompt": "Your move.",
        "hint": "Bd3.",
        "correctFeedback": "Bd3.",
        "wrongFeedback": "Bd3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/pp3ppp/2pbpn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 8",
        "text": "7...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/pp3ppp/2pbpn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 8",
        "correctMove": "Qe2",
        "prompt": "Your move.",
        "hint": "Qe2.",
        "correctFeedback": "Qe2.",
        "wrongFeedback": "Qe2.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Level 1 complete. The Alien's Nxf7!! is yours. Go drag a king into the open."
      }
    ]
  }
}

export function getWittyAlienLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_LESSONS[id]
}
