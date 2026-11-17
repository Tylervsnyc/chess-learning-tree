// GENERATED — do not edit by hand. Source: witty_alien's real chess.com games.
import type { OpeningLesson } from '@/types/opening-lesson'

const WITTY_ALIEN_SCANDI_ALIEN_LESSONS: Record<string, OpeningLesson> = {
  "wsa-1": {
    "id": "wsa-1",
    "title": "Invite the Capture",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Black plays the Scandinavian, 1...d5. Witty doesn't trade — he plays 2.Nc3 and lets Black take on e4."
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Open 1.e4 — Black answers with the Scandinavian, d5, hitting your pawn.",
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
        "hint": "Pawn e2-e4.",
        "correctFeedback": "e4.",
        "wrongFeedback": "Play e4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "Don't take on d5. Witty plays Nc3 — defend e4 and dare Black to grab it.",
        "highlightSquares": [
          "b1",
          "c3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Play Nc3.",
        "hint": "Knight b1-c3.",
        "correctFeedback": "Nc3. Inviting dxe4.",
        "wrongFeedback": "Play Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "Recapture with the knight. Look familiar? It's the same knight on e4 as the Alien Gambit — now it eyes g5 and f7.",
        "highlightSquares": [
          "c3",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nxe4",
        "prompt": "Recapture Nxe4.",
        "hint": "Knight c3 takes e4.",
        "correctFeedback": "Nxe4. Black develops Nf6.",
        "wrongFeedback": "Play Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
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
        "text": "Recall: e4, Nc3, Nxe4."
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
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "text": "e4, Nc3, Nxe4 — your knight sits on e4, the exact spot it reaches in the Alien Gambit. You know what's next."
      }
    ]
  },
  "wsa-2": {
    "id": "wsa-2",
    "title": "The Alien Sac Returns",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "text": "Same plan as the Alien Gambit: jump to g5, and when Black kicks with h6 — sacrifice on f7."
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
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "text": "3...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "text": "Leap to g5 — exactly like the Alien. The knight stares straight at f7.",
        "highlightSquares": [
          "e4",
          "g5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "correctMove": "Ng5",
        "prompt": "Play Ng5.",
        "hint": "Knight e4-g5.",
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
        "fen": "rnbqkb1r/ppp1ppp1/5n1p/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "4...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1ppp1/5n1p/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "THE ALIEN SAC. Black kicked with h6 — don't retreat, take f7! Nxf7 drags the king into the open.",
        "highlightSquares": [
          "g5",
          "f7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1ppp1/5n1p/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "correctMove": "Nxf7",
        "prompt": "Sacrifice — Nxf7!",
        "hint": "Knight g5 takes f7.",
        "correctFeedback": "Nxf7!! Same sac, different opening. The king must take.",
        "wrongFeedback": "Play Nxf7.",
        "orientation": "white",
        "postMoveArrow": [
          "f7",
          "h8"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/ppp1pkp1/5n1p/8/8/8/PPPP1PPP/R1BQKBNR w KQ - 0 6",
        "text": "5...Kxf7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "f7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/ppp1pkp1/5n1p/8/8/8/PPPP1PPP/R1BQKBNR w KQ - 0 6",
        "text": "Develop with tempo toward the bare king — Nf3 heads for e5.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/ppp1pkp1/5n1p/8/8/8/PPPP1PPP/R1BQKBNR w KQ - 0 6",
        "correctMove": "Nf3",
        "prompt": "Develop Nf3.",
        "hint": "Knight g1-f3.",
        "correctFeedback": "Nf3. A knight down, but the hunt is on. Witty scores 82% from here.",
        "wrongFeedback": "Play Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "text": "6...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "text": "Recall: Ng5, Nxf7, Nf3."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1ppp1/5n1p/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "4...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1ppp1/5n1p/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "correctMove": "Nxf7",
        "prompt": "Your move.",
        "hint": "Nxf7.",
        "correctFeedback": "Nxf7.",
        "wrongFeedback": "Nxf7.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/ppp1pkp1/5n1p/8/8/8/PPPP1PPP/R1BQKBNR w KQ - 0 6",
        "text": "5...Kxf7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "f7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/ppp1pkp1/5n1p/8/8/8/PPPP1PPP/R1BQKBNR w KQ - 0 6",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "text": "Ng5, Nxf7!!, Nf3 — a knight for a pawn and a naked king. Witty scores 82% in these 114 games."
      }
    ]
  },
  "wsa-3": {
    "id": "wsa-3",
    "title": "Aim Everything at the King",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "text": "King on f7, no shelter. Take the center, aim the bishop, and castle the rook onto the f-file."
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
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "text": "3...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1ppp1/5n1p/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "4...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1ppp1/5n1p/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "correctMove": "Nxf7",
        "prompt": "Your move.",
        "hint": "Nxf7.",
        "correctFeedback": "Nxf7.",
        "wrongFeedback": "Nxf7.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/ppp1pkp1/5n1p/8/8/8/PPPP1PPP/R1BQKBNR w KQ - 0 6",
        "text": "5...Kxf7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "f7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/ppp1pkp1/5n1p/8/8/8/PPPP1PPP/R1BQKBNR w KQ - 0 6",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "text": "6...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "text": "Grab the center with d4 — it takes e5 away from the c6 knight and opens your c1 bishop.",
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "correctMove": "d4",
        "prompt": "Play d4.",
        "hint": "Pawn d2-d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "Play d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp2kp1/2n1pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "text": "7...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp2kp1/2n1pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "text": "Aim the bishop at g6 and h7 — Bd3, pointed at the king's shelter.",
        "highlightSquares": [
          "f1",
          "d3"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1b1r/ppp2kp1/2n1pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "correctMove": "Bd3",
        "prompt": "Develop Bd3.",
        "hint": "Bishop f1-d3.",
        "correctFeedback": "Bd3. Pointed at the king.",
        "wrongFeedback": "Play Bd3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq3r/ppp2kp1/2nbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 2 9",
        "text": "8...Bd6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "d6"
        ]
      },
      {
        "type": "instruction",
        "fen": "r1bq3r/ppp2kp1/2nbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 2 9",
        "text": "Castle — the rook lands on the half-open f-file, right under the king.",
        "highlightSquares": [
          "e1",
          "g1"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq3r/ppp2kp1/2nbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 2 9",
        "correctMove": "O-O",
        "prompt": "Castle O-O.",
        "hint": "Castle kingside.",
        "correctFeedback": "O-O. Every piece aimed at the king. Honest: the engine says Black is better — but bullet players rarely survive it.",
        "wrongFeedback": "Play O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "text": "Recall: d4, Bd3, O-O."
      },
      {
        "type": "play-move",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp2kp1/2n1pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "text": "7...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1b1r/ppp2kp1/2n1pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "correctMove": "Bd3",
        "prompt": "Your move.",
        "hint": "Bd3.",
        "correctFeedback": "Bd3.",
        "wrongFeedback": "Bd3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq3r/ppp2kp1/2nbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 2 9",
        "text": "8...Bd6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq3r/ppp2kp1/2nbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 2 9",
        "correctMove": "O-O",
        "prompt": "Your move.",
        "hint": "O-O.",
        "correctFeedback": "O-O.",
        "wrongFeedback": "O-O.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq3r/ppp2kp1/2nbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 b - - 3 9",
        "text": "d4, Bd3, O-O — every piece pointed at the king. Unsound by the engine, brutal in bullet."
      }
    ]
  },
  "wsa-dev-e6": {
    "id": "wsa-dev-e6",
    "title": "If 4...e6",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "Instead of h6, Black plays e6 and guards f7. No sacrifice — build the attack and wait for h6."
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
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "text": "3...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "4...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "Black played e6 instead of h6 — the f7 pawn is guarded and there's nothing to sac yet. Take the center with d4.",
        "highlightSquares": [
          "d2",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "correctMove": "d4",
        "prompt": "Play d4.",
        "hint": "Pawn d2-d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "Play d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1bppp/4pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 1 6",
        "text": "5...Be7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "e7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1bppp/4pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 1 6",
        "text": "Develop the second knight. Keep the g5 knight where it is — it still stares at f7 and h7.",
        "highlightSquares": [
          "g1",
          "f3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/ppp1bppp/4pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 1 6",
        "correctMove": "N1f3",
        "prompt": "Develop N1f3.",
        "hint": "Knight g1-f3.",
        "correctFeedback": "N1f3.",
        "wrongFeedback": "Play N1f3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 3 7",
        "text": "6...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 3 7",
        "text": "Bd3 — bishop and g5 knight both aim at h7. If Black ever plays h6, the Nxf7 sac is back on.",
        "highlightSquares": [
          "f1",
          "d3"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 3 7",
        "correctMove": "Bd3",
        "prompt": "Develop Bd3.",
        "hint": "Bishop f1-d3.",
        "correctFeedback": "Bd3. A comfortable attacking setup — roughly equal by the engine.",
        "wrongFeedback": "Play Bd3.",
        "orientation": "white",
        "postMoveArrow": [
          "d3",
          "h7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "Recall: d4, N1f3, Bd3."
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1bppp/4pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 1 6",
        "text": "5...Be7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/ppp1bppp/4pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 1 6",
        "correctMove": "N1f3",
        "prompt": "Your move.",
        "hint": "N1f3.",
        "correctFeedback": "N1f3.",
        "wrongFeedback": "N1f3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 3 7",
        "text": "6...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 3 7",
        "correctMove": "Bd3",
        "prompt": "Your move.",
        "hint": "Bd3.",
        "correctFeedback": "Bd3.",
        "wrongFeedback": "Bd3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R b KQ - 4 7",
        "text": "d4, N1f3, Bd3 — solid and aimed at h7. If Black ever plays h6, Nxf7 is back on the menu."
      }
    ]
  },
  "wsa-dev-d4": {
    "id": "wsa-dev-d4",
    "title": "The Qh5 Trap (2...d4)",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/3pP3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "Sometimes Black skips dxe4 and pushes 2...d4, hitting your knight. Witty answers Bc4 — and if Black gets greedy with e5, the queen comes in."
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
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/3pP3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "d4"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/3pP3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "Black pushes d4 and hits your knight. Witty doesn't move it — Bc4! aims at f7 and offers the knight. (Honest: if Black just takes dxc3, it's a real gambit — engine says Black is better.)",
        "highlightSquares": [
          "f1",
          "c4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/3pP3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bc4",
        "prompt": "Play Bc4.",
        "hint": "Bishop f1-c4.",
        "correctFeedback": "Bc4! Pointed at f7.",
        "wrongFeedback": "Play Bc4.",
        "orientation": "white",
        "postMoveArrow": [
          "c4",
          "f7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/8/4p3/2BpP3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4",
        "text": "3...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/8/4p3/2BpP3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4",
        "text": "Black got greedy with e5 — now Qh5! threatens Qxf7 checkmate AND hits the e5 pawn.",
        "highlightSquares": [
          "d1",
          "h5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/8/4p3/2BpP3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4",
        "correctMove": "Qh5",
        "prompt": "Play Qh5.",
        "hint": "Queen d1-h5.",
        "correctFeedback": "Qh5! Mate on f7 is threatened.",
        "wrongFeedback": "Play Qh5.",
        "orientation": "white",
        "postMoveArrow": [
          "h5",
          "f7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2p1p/6p1/4p2Q/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 0 5",
        "text": "4...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2p1p/6p1/4p2Q/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 0 5",
        "text": "g6 stops the mate and kicks the queen — but it leaves e5 hanging. Qxe5+ with check, and the queen also stares at the h8 rook.",
        "highlightSquares": [
          "h5",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2p1p/6p1/4p2Q/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 0 5",
        "correctMove": "Qxe5+",
        "prompt": "Take with check — Qxe5+.",
        "hint": "Queen h5 takes e5.",
        "correctFeedback": "Qxe5+! Check — and a fork on h8.",
        "wrongFeedback": "Play Qxe5+.",
        "orientation": "white",
        "postMoveArrow": [
          "e5",
          "h8"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnb1kbnr/ppp1qp1p/6p1/4Q3/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 1 6",
        "text": "5...Qe7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d8",
          "e7"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnb1kbnr/ppp1qp1p/6p1/4Q3/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 1 6",
        "text": "Black blocks with the queen. The rook in the corner is free — grab it! Qxh8.",
        "highlightSquares": [
          "e5",
          "h8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnb1kbnr/ppp1qp1p/6p1/4Q3/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 1 6",
        "correctMove": "Qxh8",
        "prompt": "Grab the rook — Qxh8.",
        "hint": "Queen e5 takes h8.",
        "correctFeedback": "Qxh8! A whole rook up. Witty wins 91% of the games where Black falls for 3...e5.",
        "wrongFeedback": "Play Qxh8.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnb1kbnQ/ppp1qp1p/6p1/8/2B1P3/2p5/PPPP1PPP/R1B1K1NR w KQq - 0 7",
        "text": "6...dxc3.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d4",
          "c3"
        ]
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/3pP3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "Recall: Bc4, Qh5, Qxe5+, Qxh8."
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/3pP3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/8/4p3/2BpP3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4",
        "text": "3...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/8/4p3/2BpP3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4",
        "correctMove": "Qh5",
        "prompt": "Your move.",
        "hint": "Qh5.",
        "correctFeedback": "Qh5.",
        "wrongFeedback": "Qh5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2p1p/6p1/4p2Q/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 0 5",
        "text": "4...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2p1p/6p1/4p2Q/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 0 5",
        "correctMove": "Qxe5+",
        "prompt": "Your move.",
        "hint": "Qxe5+.",
        "correctFeedback": "Qxe5+.",
        "wrongFeedback": "Qxe5+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnb1kbnr/ppp1qp1p/6p1/4Q3/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 1 6",
        "text": "5...Qe7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnb1kbnr/ppp1qp1p/6p1/4Q3/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 1 6",
        "correctMove": "Qxh8",
        "prompt": "Your move.",
        "hint": "Qxh8.",
        "correctFeedback": "Qxh8.",
        "wrongFeedback": "Qxh8.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnb1kbnQ/ppp1qp1p/6p1/8/2B1P3/2p5/PPPP1PPP/R1B1K1NR w KQq - 0 7",
        "text": "Bc4, Qh5, Qxe5+, Qxh8 — a rook up by move six. 91% for Witty when Black walks into it."
      }
    ]
  },
  "wsa-test-1": {
    "id": "wsa-test-1",
    "title": "Lvl 1 Test",
    "defaultOrientation": "white",
    "steps": [
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Test time. Play the Alien vs the Scandinavian — the f7 sac, the 4...e6 setup, and the Qh5 trap. No hints.",
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
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "text": "3...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1ppp1/5n1p/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "4...h6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "h7",
          "h6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1ppp1/5n1p/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "correctMove": "Nxf7",
        "prompt": "Your move.",
        "hint": "Nxf7.",
        "correctFeedback": "Nxf7.",
        "wrongFeedback": "Nxf7.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1b1r/ppp1pkp1/5n1p/8/8/8/PPPP1PPP/R1BQKBNR w KQ - 0 6",
        "text": "5...Kxf7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "f7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1b1r/ppp1pkp1/5n1p/8/8/8/PPPP1PPP/R1BQKBNR w KQ - 0 6",
        "correctMove": "Nf3",
        "prompt": "Your move.",
        "hint": "Nf3.",
        "correctFeedback": "Nf3.",
        "wrongFeedback": "Nf3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "text": "6...Nc6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "b8",
          "c6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1b1r/ppp1pkp1/2n2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 2 7",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq1b1r/ppp2kp1/2n1pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "text": "7...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq1b1r/ppp2kp1/2n1pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8",
        "correctMove": "Bd3",
        "prompt": "Your move.",
        "hint": "Bd3.",
        "correctFeedback": "Bd3.",
        "wrongFeedback": "Bd3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "r1bq3r/ppp2kp1/2nbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 2 9",
        "text": "8...Bd6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "d6"
        ]
      },
      {
        "type": "play-move",
        "fen": "r1bq3r/ppp2kp1/2nbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 2 9",
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
        "text": "— If 4...e6 —"
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
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...dxe4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "e4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Nxe4",
        "prompt": "Your move.",
        "hint": "Nxe4.",
        "correctFeedback": "Nxe4.",
        "wrongFeedback": "Nxe4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "text": "3...Nf6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g8",
          "f6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/4N3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        "correctMove": "Ng5",
        "prompt": "Your move.",
        "hint": "Ng5.",
        "correctFeedback": "Ng5.",
        "wrongFeedback": "Ng5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "text": "4...e6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/6N1/8/8/PPPP1PPP/R1BQKBNR w KQkq - 0 5",
        "correctMove": "d4",
        "prompt": "Your move.",
        "hint": "d4.",
        "correctFeedback": "d4.",
        "wrongFeedback": "d4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqk2r/ppp1bppp/4pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 1 6",
        "text": "5...Be7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "f8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqk2r/ppp1bppp/4pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 1 6",
        "correctMove": "N1f3",
        "prompt": "Your move.",
        "hint": "N1f3.",
        "correctFeedback": "N1f3.",
        "wrongFeedback": "N1f3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 3 7",
        "text": "6...O-O.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e8",
          "g8"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 3 7",
        "correctMove": "Bd3",
        "prompt": "Your move.",
        "hint": "Bd3.",
        "correctFeedback": "Bd3.",
        "wrongFeedback": "Bd3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "— The Qh5 Trap (2...d4) —"
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
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "text": "1...d5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d7",
          "d5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "correctMove": "Nc3",
        "prompt": "Your move.",
        "hint": "Nc3.",
        "correctFeedback": "Nc3.",
        "wrongFeedback": "Nc3.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp1pppp/8/8/3pP3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "text": "2...d4.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d5",
          "d4"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp1pppp/8/8/3pP3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
        "correctMove": "Bc4",
        "prompt": "Your move.",
        "hint": "Bc4.",
        "correctFeedback": "Bc4.",
        "wrongFeedback": "Bc4.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2ppp/8/4p3/2BpP3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4",
        "text": "3...e5.",
        "autoAdvance": 800,
        "highlightSquares": [
          "e7",
          "e5"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2ppp/8/4p3/2BpP3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4",
        "correctMove": "Qh5",
        "prompt": "Your move.",
        "hint": "Qh5.",
        "correctFeedback": "Qh5.",
        "wrongFeedback": "Qh5.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/ppp2p1p/6p1/4p2Q/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 0 5",
        "text": "4...g6.",
        "autoAdvance": 800,
        "highlightSquares": [
          "g7",
          "g6"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnbqkbnr/ppp2p1p/6p1/4p2Q/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 0 5",
        "correctMove": "Qxe5+",
        "prompt": "Your move.",
        "hint": "Qxe5+.",
        "correctFeedback": "Qxe5+.",
        "wrongFeedback": "Qxe5+.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnb1kbnr/ppp1qp1p/6p1/4Q3/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 1 6",
        "text": "5...Qe7.",
        "autoAdvance": 800,
        "highlightSquares": [
          "d8",
          "e7"
        ]
      },
      {
        "type": "play-move",
        "fen": "rnb1kbnr/ppp1qp1p/6p1/4Q3/2BpP3/2N5/PPPP1PPP/R1B1K1NR w KQkq - 1 6",
        "correctMove": "Qxh8",
        "prompt": "Your move.",
        "hint": "Qxh8.",
        "correctFeedback": "Qxh8.",
        "wrongFeedback": "Qxh8.",
        "orientation": "white"
      },
      {
        "type": "instruction",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "text": "Level 1 complete. 1...d5 doesn't save them from the Alien."
      }
    ]
  }
}

export function getWittyAlienScandiAlienLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_SCANDI_ALIEN_LESSONS[id]
}
