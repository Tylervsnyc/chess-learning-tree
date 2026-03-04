import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// RUY LOPEZ LESSONS (rl-1 through rl-4)
//
// FENs are pre-computed from the main line:
// 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7
// 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3
// ═══════════════════════════════════════════════════════════

// Key FEN positions along the main line
const FEN = {
  start:      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:   'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:   'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Bb5:  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  after_a6:   'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
  after_Ba4:  'r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 4',
  after_Nf6:  'r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 5',
  after_OO:   'r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 3 5',
  after_Be7:  'r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 6',
  after_Re1:  'r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQR1K1 b kq - 5 6',
  after_b5:   'r1bqk2r/2ppbppp/p1n2n2/1p2p3/B3P3/5N2/PPPP1PPP/RNBQR1K1 w kq - 0 7',
  after_Bb3:  'r1bqk2r/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 b kq - 1 7',
  after_d6:   'r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w kq - 0 8',
  after_c3:   'r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 b kq - 0 8',
  after_OO_b: 'r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 1 9',
  after_h3:   'r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 b - - 0 9',

  // Bb5 vs Bd3 comparison
  after_Bd3: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/3B1N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  after_Bd3_d5: 'r1bqkbnr/ppp2ppp/2n5/3pp3/4P3/3B1N2/PPPP1PPP/RNBQK2R w KQkq d6 0 4',

  // Opponent deviation: 2...d6 instead of 2...Nc6
  after_e5_d6: 'rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',

  // "The Why" — bxc6 vs dxc6
  why_bxc6:          'r1bqkbnr/2pp1ppp/p1p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5',
  why_bxc6_Nxe5:     'r1bqkbnr/2pp1ppp/p1p5/4N3/4P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 5',
  why_dxc6_Nxe5:     'r1bqkbnr/1pp2ppp/p1p5/4N3/4P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 5',
  why_Qd4:           'r1b1kbnr/1pp2ppp/p1p5/4N3/3qP3/8/PPPP1PPP/RNBQK2R w KQkq - 1 6',
  why_Qg5:           'r1b1kbnr/1pp2ppp/p1p5/4N1q1/4P3/8/PPPP1PPP/RNBQK2R w KQkq - 1 6',

  // rl-2 Why Step: Why not Ng5? (after 4.Ba4 Nf6)
  why_Ng5:      'r1bqkb1r/1ppp1ppp/p1n2n2/4p1N1/B3P3/8/PPPP1PPP/RNBQK2R b KQkq - 3 5',
  why_Ng5_d5:   'r1bqkb1r/1pp2ppp/p1n2n2/3pp1N1/B3P3/8/PPPP1PPP/RNBQK2R w KQkq d6 0 6',

  // rl-2 Opponent deviation: 4...b5 (too aggressive, no development)
  dev_Ba4_b5:     'r1bqkbnr/2pp1ppp/p1n5/1p2p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5',
  dev_Ba4_b5_Bb3: 'r1bqkbnr/2pp1ppp/p1n5/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQK2R b KQkq - 1 5',

  // rl-3 Why Step: Why not Bxc6? (trading the bishop too early)
  why_Bxc6_6:     'r1bqk2r/1pppbppp/p1B2n2/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 0 6',
  why_Bxc6_dxc6:  'r1bqk2r/1pp1bppp/p1p2n2/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 7',

  // rl-3 Correct line: Re1 defends e4, Black tries Nxe4, Rxe4 wins it back
  why_Re1_Nxe4:   'r1bqk2r/1pppbppp/p1n5/4p3/B3n3/5N2/PPPP1PPP/RNBQR1K1 w kq - 0 7',
  why_Re1_Rxe4:   'r1bqk2r/1pppbppp/p1n5/4p3/B3R3/5N2/PPPP1PPP/RNBQ2K1 b kq - 0 7',

  // rl-3 Opponent deviation: 6...d5 (premature center strike)
  dev_Re1_d5:     'r1bqk2r/1pp1bppp/p1n2n2/3pp3/B3P3/5N2/PPPP1PPP/RNBQR1K1 w kq - 0 7',

  // Exchange Variation (3...a6 4.Bxc6 dxc6 5.O-O f6 6.d4 Bg4)
  exch_after_Bxc6: 'r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4',
  exch_after_dxc6: 'r1bqkbnr/1pp2ppp/p1p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5',
  exch_after_OO:   'r1bqkbnr/1pp2ppp/p1p5/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 1 5',
  exch_after_f6:   'r1bqkbnr/1pp3pp/p1p2p2/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 6',
  exch_after_d4:   'r1bqkbnr/1pp3pp/p1p2p2/4p3/3PP3/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 6',
  exch_after_Bg4:  'r2qkbnr/1pp3pp/p1p2p2/4p3/3PP1b1/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 7',

  // Berlin Defense (3...Nf6 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5)
  berlin_after_Nf6:  'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  berlin_after_OO:   'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4',
  berlin_after_Nxe4: 'r1bqkb1r/pppp1ppp/2n5/1B2p3/4n3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 5',
  berlin_after_d4:   'r1bqkb1r/pppp1ppp/2n5/1B2p3/3Pn3/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 5',
  berlin_after_Nd6:  'r1bqkb1r/pppp1ppp/2nn4/1B2p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 6',
  berlin_after_Bxc6: 'r1bqkb1r/pppp1ppp/2Bn4/4p3/3P4/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 6',
  berlin_after_dxc6: 'r1bqkb1r/ppp2ppp/2pn4/4p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 7',
  berlin_after_dxe5: 'r1bqkb1r/ppp2ppp/2pn4/4P3/8/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 7',
  berlin_after_Nf5:  'r1bqkb1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 8',

  // Marshall Attack (7...O-O 8.c3 d5)
  marshall_after_OO: 'r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w - - 2 8',
  marshall_after_c3: 'r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 b - - 0 8',
  marshall_after_d5: 'r1bq1rk1/2p1bppp/p1n2n2/1p1pp3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 0 9',

  // Open Ruy Lopez (5...Nxe4 6.d4 b5 7.Bb3 d5 8.dxe5 Be6)
  open_after_Nxe4:  'r1bqkb1r/1ppp1ppp/p1n5/4p3/B3n3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 6',
  open_after_d4:    'r1bqkb1r/1ppp1ppp/p1n5/4p3/B2Pn3/5N2/PPP2PPP/RNBQ1RK1 b kq d3 0 6',
  open_after_b5:    'r1bqkb1r/2pp1ppp/p1n5/1p2p3/B2Pn3/5N2/PPP2PPP/RNBQ1RK1 w kq b6 0 7',
  open_after_Bb3:   'r1bqkb1r/2pp1ppp/p1n5/1p2p3/3Pn3/1B3N2/PPP2PPP/RNBQ1RK1 b kq - 1 7',
  open_after_d5:    'r1bqkb1r/2p2ppp/p1n5/1p1pp3/3Pn3/1B3N2/PPP2PPP/RNBQ1RK1 w kq d6 0 8',
  open_after_dxe5:  'r1bqkb1r/2p2ppp/p1n5/1p1pP3/4n3/1B3N2/PPP2PPP/RNBQ1RK1 b kq - 0 8',
  open_after_Be6:   'r2qkb1r/2p2ppp/p1n1b3/1p1pP3/4n3/1B3N2/PPP2PPP/RNBQ1RK1 w kq - 1 9',

  // RL-1 punish: After 3.Bb5, Black plays 3...Nge7? (blocks bishop, slow)
  // White plays 4.d4! blowing open the center
  punish1_after_Nge7: 'r1bqkb1r/ppppnppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  punish1_after_d4:   'r1bqkb1r/ppppnppp/2n5/1B2p3/3PP3/5N2/PPP2PPP/RNBQK2R b KQkq d3 0 4',
  punish1_after_exd4: 'r1bqkb1r/ppppnppp/2n5/1B6/3pP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
  punish1_after_Nxd4: 'r1bqkb1r/ppppnppp/2n5/1B6/3NP3/8/PPP2PPP/RNBQK2R b KQkq - 0 5',

  // RL-2 punish: After 5.O-O, Black grabs 5...Nxe4? White plays 6.Re1! pinning/winning back
  // (uses open_after_Nxe4 for Black's grab, then Re1)
  punish2_after_Re1:  'r1bqkb1r/1ppp1ppp/p1n5/4p3/B3n3/5N2/PPPP1PPP/RNBQR1K1 b kq - 1 6',
  punish2_after_d5:   'r1bqkb1r/1pp2ppp/p1n5/3pp3/B3n3/5N2/PPPP1PPP/RNBQR1K1 w kq d6 0 7',
  punish2_after_Nxe5: 'r1bqkb1r/1pp2ppp/p1n5/3pN3/B3n3/8/PPPP1PPP/RNBQR1K1 b kq - 0 7',

  // RL-3 punish: After 6.Re1, Black plays 6...d5? (instead of b5 — premature)
  // Branch from after_Re1! No b5 on the board.
  // 7.exd5 Nxd5 8.Nxe5! — White wins a pawn (Nc6 is PINNED by Ba4, can't recapture)
  punish3_after_d5_premature: 'r1bqk2r/1pp1bppp/p1n2n2/3pp3/B3P3/5N2/PPPP1PPP/RNBQR1K1 w kq - 0 7',
  punish3_after_exd5:         'r1bqk2r/1pp1bppp/p1n2n2/3Pp3/B7/5N2/PPPP1PPP/RNBQR1K1 b kq - 0 7',
  punish3_after_Nxd5:         'r1bqk2r/1pp1bppp/p1n5/3np3/B7/5N2/PPPP1PPP/RNBQR1K1 w kq - 0 8',
  punish3_after_Nxe5:         'r1bqk2r/1pp1bppp/p1n5/3nN3/B7/8/PPPP1PPP/RNBQR1K1 b kq - 0 8',

  // Punish f6 (2...f6?? 3.Nxe5! fxe5 4.Qh5+ g6 5.Qxe5+)
  punish_after_f6:    'rnbqkbnr/pppp2pp/5p2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
  punish_after_Nxe5:  'rnbqkbnr/pppp2pp/5p2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3',
  punish_after_fxe5:  'rnbqkbnr/pppp2pp/8/4p3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4',
  punish_after_Qh5:   'rnbqkbnr/pppp2pp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KB1R b KQkq - 1 4',
  punish_after_g6:    'rnbqkbnr/pppp3p/6p1/4p2Q/4P3/8/PPPP1PPP/RNB1KB1R w KQkq - 0 5',
  punish_after_Qxe5:  'rnbqkbnr/pppp3p/6p1/4Q3/4P3/8/PPPP1PPP/RNB1KB1R b KQkq - 0 5',
  punish_after_Qe7:   'rnb1kbnr/ppppq2p/6p1/4Q3/4P3/8/PPPP1PPP/RNB1KB1R w KQkq - 1 6',
  punish_after_Qxh8:  'rnb1kbnQ/ppppq2p/6p1/8/4P3/8/PPPP1PPP/RNB1KB1R b Qq - 0 6',

  // RL-4 punish: After 8.c3, Black plays 8...Bg4? (premature pin before castling)
  punish4_after_Bg4:  'r2qk2r/2p1bppp/p1np1n2/1p2p3/4P1b1/1BP2N2/PP1P1PPP/RNBQR1K1 w kq - 1 9',
  punish4_after_h3:   'r2qk2r/2p1bppp/p1np1n2/1p2p3/4P1b1/1BP2N1P/PP1P1PP1/RNBQR1K1 b kq - 0 9',
  punish4_after_Bh5:  'r2qk2r/2p1bppp/p1np1n2/1p2p2b/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 w kq - 1 10',
  punish4_after_d4:   'r2qk2r/2p1bppp/p1np1n2/1p2p2b/3PP3/1BP2N1P/PP3PP1/RNBQR1K1 b kq - 0 10',

  // Exchange-1 punish: After 4.Bxc6, Black plays 4...bxc6? (wrong recapture)
  exch_punish_bxc6:   'r1bqkbnr/2pp1ppp/p1p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5',
  exch_punish_OO:     'r1bqkbnr/2pp1ppp/p1p5/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 1 5',
  exch_punish_Nf6:    'r1bqkb1r/2pp1ppp/p1p2n2/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 2 6',
  exch_punish_d4:     'r1bqkb1r/2pp1ppp/p1p2n2/4p3/3PP3/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 6',

  // Exchange-2 punish: After 5.O-O, Black plays 5...Nf6? (doesn't protect e5)
  exch2_punish_Nf6:   'r1bqkb1r/1pp2ppp/p1p2n2/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 2 6',
  exch2_punish_Nxe5:  'r1bqkb1r/1pp2ppp/p1p2n2/4N3/4P3/8/PPPP1PPP/RNBQ1RK1 b kq - 0 6',

  // Berlin-1 punish: After 4.O-O, Black plays 4...d6? (passive, doesn't grab e4)
  berlin1_punish_d6:   'r1bqkb1r/ppp2ppp/2np1n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 5',
  berlin1_punish_d4:   'r1bqkb1r/ppp2ppp/2np1n2/1B2p3/3PP3/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 5',
  berlin1_punish_exd4: 'r1bqkb1r/ppp2ppp/2np1n2/1B6/3pP3/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 6',
  berlin1_punish_Nxd4: 'r1bqkb1r/ppp2ppp/2np1n2/1B6/3NP3/8/PPP2PPP/RNBQ1RK1 b kq - 0 6',

  // Berlin-2 punish: After 5.d4, Black plays 5...Nc5? (wrong retreat)
  berlin2_punish_Nc5:  'r1bqkb1r/pppp1ppp/2n5/1Bn1p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 6',
  berlin2_punish_Nxe5: 'r1bqkb1r/pppp1ppp/2n5/1Bn1N3/3P4/8/PPP2PPP/RNBQ1RK1 b kq - 0 6',

  // Marshall-1 punish: After 7.Bb3, Black plays 7...d6? (too slow)
  marshall1_punish_d6:  'r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w kq - 0 8',
  marshall1_punish_c3:  'r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 b kq - 0 8',
  marshall1_punish_OO:  'r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 1 9',
  marshall1_punish_d4:  'r1bq1rk1/2p1bppp/p1np1n2/1p2p3/3PP3/1BP2N2/PP3PPP/RNBQR1K1 b - - 0 9',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The Opening Moves (White + Black review)
// Teaches: 1.e4 e5 2.Nf3 Nc6 3.Bb5
// Flow: Guided teach → White review → Black review
// ═══════════════════════════════════════════════════════════

export const RL_LESSON_1: OpeningLesson = {
  id: 'rl-1',
  title: 'The Opening Moves',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: TEACH (1.e4 e5 2.Nf3 Nc6 3.Bb5)
    // ═══════════════════════════════════════════

    // --- Move 1: e4 ---
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Ruy Lopez — a 500-year-old opening and still one of the best ways to start a game as White.",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The most important rule of the opening: control the center. Pawns in the center control more squares than pawns on the side.",
      highlightSquares: ['d4', 'd5', 'e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Grab the center with a pawn!',
      hint: 'Push the e-pawn two squares forward.',
      correctFeedback: "e4 — now your pawn controls d5 and f5. That's the center!",
      wrongFeedback: "We want a pawn in the center — try the e-pawn.",
      highlightSquares: ['e2', 'e4'],
    },

    // --- Black responds 1...e5 ---
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Black mirrors you — e5. Now both sides have a stake in the center.",
      autoAdvance: 1500,
    },

    // --- Move 2: Nf3 ---
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Next opening rule: develop your pieces. Knights and bishops need to get off the back rank so they can fight for the center.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: "Develop a piece — and attack Black's e5 pawn at the same time.",
      hint: "Your knight on g1 can go to f3, where it attacks e5.",
      correctFeedback: "Nf3 does two things at once — develops AND attacks. That's efficiency.",
      wrongFeedback: "Look for a piece that can develop AND pressure e5.",
      highlightSquares: ['g1', 'f3'],
      postMoveArrow: ['f3', 'e5'],
    },

    // --- Black responds 2...Nc6 ---
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Black develops their knight to c6, defending the e5 pawn. Solid response.",
      arrow: ['c6', 'e5'],
      autoAdvance: 2000,
    },

    // --- Move 3: Bb5 (the Ruy Lopez!) ---
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Here's where the Ruy Lopez gets its name. Your bishop has two good squares — c4 or b5. Both develop the bishop, but b5 is special.",
      highlightSquares: ['c4', 'b5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bb5',
      prompt: "Put your bishop on the square that pressures the knight defending e5.",
      hint: "That knight on c6 is the only thing holding e5 together. Attack it.",
      correctFeedback: "Bb5! You're threatening the defender of e5. That's the idea behind the whole opening.",
      wrongFeedback: "Think about which piece is defending Black's e5 pawn — and attack it.",
      highlightSquares: ['f1', 'b5'],
      postMoveArrow: ['b5', 'c6'],
    },


    // ═══════════════════════════════════════════
    // OPPONENT DEVIATION: What if 2...d6?
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Quick — what if Black doesn't play Nc6? Beginners often play 2...d6 instead. That's actually fine for you.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e5_d6,
      text: "After 2...d6, Black defends the pawn but blocks their own bishop. You just keep developing — Bc4 or d4, and you're ahead in activity.",
      highlightSquares: ['c8', 'f8'],
    },

    // ═══════════════════════════════════════════
    // PUNISH: What if 3...Nge7?
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.punish1_after_Nge7,
      text: "What if Black plays 3...Nge7? It looks safe — develops a piece, doesn't block the d-pawn. But it blocks the f8 bishop and is slow.",
      highlightSquares: ['e7', 'f8'],
    },
    {
      type: 'play-move',
      fen: FEN.punish1_after_Nge7,
      correctMove: 'd4',
      prompt: "Black is slow. Strike the center before they catch up.",
      hint: "Push d4 — open the position while Black's pieces are tangled.",
      correctFeedback: "d4! Black's knight on e7 is in the way and their bishop is stuck. You're already winning the opening.",
      wrongFeedback: "When your opponent is slow, open the center — d4!",
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.punish1_after_Nxd4,
      text: "After exd4 Nxd4 — you dominate the center with a knight on d4, active pieces, and Black's bishop is still stuck behind the knight. That's what happens when Black plays too passively.",
      highlightSquares: ['d4', 'e7', 'f8'],
    },

    // ═══════════════════════════════════════════
    // WHITE RECALL (from move 1)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's run it back. Play all three White moves — remember WHY each one is played.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'e5.',
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: 'Nc6.',
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bb5',
      prompt: 'Your move.',
      hint: 'Bb5.',
      correctFeedback: 'Bb5.',
      wrongFeedback: 'Bb5.',
    },

  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: The Morphy Defense
// Teaches: 3...a6, 4.Ba4, 4...Nf6, 5.O-O, 5...Be7
// Template: Recap → Teach → White Recall → Black Recall
// ~20 steps
// ═══════════════════════════════════════════════════════════

export const RL_LESSON_2: OpeningLesson = {
  id: 'rl-2',
  title: 'The Morphy Defense',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 e5 2.Nf3 Nc6 3.Bb5)
    // ═══════════════════════════════════════════

    // 1
    {
      type: 'instruction',
      fen: FEN.after_Bb5,
      text: "Last time we reached the Ruy Lopez — Bb5 pressuring the knight that defends e5. Now Black fights back.",
      arrow: ['b5', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3...a6 4.Ba4 Nf6 5.O-O Be7)
    // ═══════════════════════════════════════════

    // 2
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "a6 — the Morphy Defense. One tiny pawn move says: \"Move your bishop or I'll chase it with b5.\"",
      arrow: ['a6', 'b5'],
      autoAdvance: 1800,
    },
    // 3
    {
      type: 'play-move',
      fen: FEN.after_a6,
      correctMove: 'Ba4',
      prompt: "Your bishop is challenged. Retreat it, but keep the pressure on c6.",
      hint: 'a4 keeps the bishop aimed at the knight.',
      correctFeedback: "Ba4 — one square back, but the pressure on c6 hasn't changed. Patient chess.",
      wrongFeedback: "Find the retreat square that keeps your bishop lined up with the c6 knight.",
      highlightSquares: ['b5', 'a4'],
      postMoveArrow: ['a4', 'c6'],
    },
    // 4
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nf6 — Black develops AND attacks your e4 pawn. They're not just defending anymore, they're creating threats.",
      arrow: ['f6', 'e4'],
      autoAdvance: 1800,
    },
    // 5
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'O-O',
      prompt: "Your e4 pawn is attacked. But something is more important right now.",
      hint: "King safety first — if e4 falls, Re1 wins it back.",
      correctFeedback: "O-O! King safe, rook activated. If Black takes e4, Re1 recovers it instantly.",
      wrongFeedback: "Don't panic about e4 — your king in the center is the real problem. Castle!",
      highlightSquares: ['e1', 'g1'],
    },
    // 6
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Be7 — Black develops calmly and prepares to castle. The Morphy Defense is complete.",
      autoAdvance: 1800,
    },
    // 7
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Both sides developed naturally: 3...a6 4.Ba4 Nf6 5.O-O Be7. The real fight starts next lesson.",
      highlightSquares: ['a4', 'f3', 'e4', 'f6', 'c6', 'e7'],
    },

    // ═══════════════════════════════════════════
    // PUNISH: What if 5...Nxe4?
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.open_after_Nxe4,
      text: "What if Black gets greedy and grabs e4 with 5...Nxe4? Your rook just castled onto f1 — it can punish this.",
      arrow: ['f6', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.open_after_Nxe4,
      correctMove: 'Re1',
      prompt: "The knight on e4 looks comfortable. Make it uncomfortable.",
      hint: "Your rook can slide to e1 — pinning the knight to the king.",
      correctFeedback: "Re1! The knight is pinned. If it moves, the king is exposed on the e-file.",
      wrongFeedback: "Which piece can attack the knight from behind — on the e-file?",
      highlightSquares: ['f1', 'e1'],
      postMoveArrow: ['e1', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.punish2_after_d5,
      text: "Black tries d5 to save the knight, but after Nxe5 you win the e5 pawn and Black's center crumbles. Grabbing e4 too early backfires.",
      highlightSquares: ['e4', 'e5'],
    },

    // ═══════════════════════════════════════════
    // WHITE RECALL (from move 1)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the whole line as White — remember WHY each move is played.",
      buttonText: "LET'S GO",
    },
    // 9
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },
    // 10
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6.', autoAdvance: 800 },
    // 11
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bb5',
      prompt: 'Your move.',
      hint: 'Bb5.',
      correctFeedback: 'Bb5.',
      wrongFeedback: 'Bb5.',
    },
    { type: 'instruction', fen: FEN.after_a6, text: 'a6 — the Morphy Defense.', autoAdvance: 800 },
    // 12
    {
      type: 'play-move',
      fen: FEN.after_a6,
      correctMove: 'Ba4',
      prompt: 'Your move.',
      hint: 'Ba4.',
      correctFeedback: 'Ba4.',
      wrongFeedback: 'Ba4.',
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 — attacks e4.', autoAdvance: 800 },
    // 13
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Be7. Morphy Defense complete.', autoAdvance: 800 },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: Building the Center
// Teaches: 6.Re1, 6...b5, 7.Bb3
// Template: Recap → Teach → White Recall → Black Recall
// ~20 steps
// ═══════════════════════════════════════════════════════════

export const RL_LESSON_3: OpeningLesson = {
  id: 'rl-3',
  title: 'Building the Center',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: CONTEXT
    // ═══════════════════════════════════════════

    // 1
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Both sides have developed. Now White needs a plan — and that plan is d4, fighting for the center.",
      highlightSquares: ['d2', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (6.Re1 b5 7.Bb3)
    // ═══════════════════════════════════════════

    // 2
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "But before d4, the e4 pawn needs backup. If it falls, your whole center collapses.",
      arrow: ['f6', 'e4'],
    },
    // 3
    {
      type: 'play-move',
      fen: FEN.after_Be7,
      correctMove: 'Re1',
      prompt: "Support e4 from behind. Which piece can guard it?",
      hint: "Your rook on f1 can slide to e1 — right behind the pawn.",
      correctFeedback: "Re1! Supports e4 AND X-rays toward Black's king on e8.",
      wrongFeedback: "Which piece can slide behind e4 to protect it?",
      highlightSquares: ['f1', 'e1'],
      postMoveArrow: ['e1', 'e8'],
    },
    // 4
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "b5 — Black continues the plan from a6, chasing your bishop further. This is the follow-up.",
      arrow: ['b5', 'a4'],
      autoAdvance: 1800,
    },
    // 5
    {
      type: 'play-move',
      fen: FEN.after_b5,
      correctMove: 'Bb3',
      prompt: "Bishop's attacked. Retreat it toward Black's weakest square.",
      hint: "f7 is only defended by the king — aim your bishop there.",
      correctFeedback: "Bb3! Now the bishop targets f7 — the softest spot in Black's position.",
      wrongFeedback: "Think about Black's weaknesses. f7 is only defended by the king.",
      highlightSquares: ['a4', 'b3'],
      postMoveArrow: ['b3', 'f7'],
    },
    // 6
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "Look at White's setup: e4 pawn, rook behind it, bishop aimed at f7, knight controlling the center. Everything points toward d4.",
      highlightSquares: ['e4', 'e1', 'b3', 'f3'],
    },

    // ═══════════════════════════════════════════
    // PUNISH: What if 6...d5? (premature)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.punish3_after_d5_premature,
      text: "Back to after Re1 — what if Black skips b5 and plays d5 right away? It looks active, but the timing is wrong.",
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.punish3_after_d5_premature,
      correctMove: 'exd5',
      prompt: "Black opened the center too early. Take the pawn.",
      hint: "Capture on d5 — you'll see why this is so strong.",
      correctFeedback: "exd5! Now Black has to recapture — watch what happens.",
      wrongFeedback: "Take the d5 pawn — it opens a tactic on e5.",
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'instruction',
      fen: FEN.punish3_after_Nxd5,
      text: "Nxd5 — Black recaptures, but now the e5 pawn has lost its defender.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.punish3_after_Nxd5,
      correctMove: 'Nxe5',
      prompt: "The e5 pawn is undefended. Grab it.",
      hint: "Your knight can take the free pawn on e5.",
      correctFeedback: "Nxe5! And here's the key — the c6 knight is PINNED by your bishop on a4. Black can't recapture!",
      wrongFeedback: "Look at e5 — no one's guarding it.",
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.punish3_after_Nxe5,
      text: "The Ba4 pins the c6 knight to the king — it can't take back on e5. White wins a clean pawn. That's why Black waits for b5 before playing d5.",
      highlightSquares: ['a4', 'c6', 'e8'],
      arrow: ['a4', 'e8'],
    },

    // ═══════════════════════════════════════════
    // WHITE RECALL (from move 1)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the whole line as White — all 7 moves.",
      buttonText: "LET'S GO",
    },
    // 8
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },
    // 9
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6.', autoAdvance: 800 },
    // 10
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bb5',
      prompt: 'Your move.',
      hint: 'Bb5.',
      correctFeedback: 'Bb5.',
      wrongFeedback: 'Bb5.',
    },
    { type: 'instruction', fen: FEN.after_a6, text: 'a6.', autoAdvance: 800 },
    // 11
    {
      type: 'play-move',
      fen: FEN.after_a6,
      correctMove: 'Ba4',
      prompt: 'Your move.',
      hint: 'Ba4.',
      correctFeedback: 'Ba4.',
      wrongFeedback: 'Ba4.',
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800 },
    // 12
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Be7.', autoAdvance: 800 },
    // 13
    {
      type: 'play-move',
      fen: FEN.after_Be7,
      correctMove: 'Re1',
      prompt: 'Your move.',
      hint: 'Re1.',
      correctFeedback: 'Re1.',
      wrongFeedback: 'Re1.',
    },
    { type: 'instruction', fen: FEN.after_b5, text: 'b5.', autoAdvance: 800 },
    // 14
    {
      type: 'play-move',
      fen: FEN.after_b5,
      correctMove: 'Bb3',
      prompt: 'Your move.',
      hint: 'Bb3.',
      correctFeedback: 'Bb3.',
      wrongFeedback: 'Bb3.',
    },

  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: The Closed Ruy Lopez
// ═══════════════════════════════════════════════════════════

export const RL_LESSON_4: OpeningLesson = {
  id: 'rl-4',
  title: 'The Closed Ruy Lopez',
  defaultOrientation: 'white',
  steps: [

    // ===========================================
    // ACT 1: CONTEXT — Setting the stage
    // ===========================================

    // 1
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "White's setup is almost complete — king castled, rook on e1, bishop aimed at f7. One thing's missing: d4.",
      highlightSquares: ['g1', 'e1', 'b3', 'd2'],
    },
    // 2
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "But you can't play d4 yet — the pawn needs support. This lesson is about building the foundation for that breakthrough.",
      arrow: ['d2', 'd4'],
    },

    // ===========================================
    // ACT 2: TEACH (7...d6, 8.c3, 8...O-O, 9.h3)
    // ===========================================

    // 3 — 7...d6 (Black's move, auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "d6 — Black holds the center modestly. The pawn on d6 supports e5, keeping things solid.",
      arrow: ['d6', 'e5'],
      autoAdvance: 1800,
    },

    // 4 — 8.c3 (White play-move)
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'c3',
      prompt: "You want d4 — but it needs a bodyguard first. Which pawn supports it?",
      hint: "c3 gives your d-pawn backup when it advances to d4.",
      correctFeedback: "c3! Now d4 is ready to go whenever you want it. That's how you build a center.",
      wrongFeedback: "Think about which pawn can support d4 from the side.",
      highlightSquares: ['c2', 'c3'],
      postMoveArrow: ['c3', 'd4'],
    },

    // 5 — 8...O-O (Black castles, auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "O-O — Black castles, getting the king to safety before any action starts. Smart timing.",
      autoAdvance: 1500,
    },

    // 6 — 9.h3 (White play-move)
    {
      type: 'play-move',
      fen: FEN.after_OO_b,
      correctMove: 'h3',
      prompt: "Before d4, one more quiet move. Black's bishop on c8 might come to g4 and pin your knight. Prevent that.",
      hint: "A small pawn move on the kingside — h3 stops Bg4 forever.",
      correctFeedback: "h3! Prophylaxis — that means preventing the opponent's idea before it happens. No more Bg4 pin.",
      wrongFeedback: "Think about which enemy piece might cause problems on g4.",
      highlightSquares: ['h2', 'h3'],
    },

    // 7 — Summary
    {
      type: 'instruction',
      fen: FEN.after_h3,
      text: "This is the Closed Ruy Lopez — one of the most popular positions in all of chess. White has c3 ready for d4, h3 preventing Bg4, and all pieces developed.",
      highlightSquares: ['c3', 'h3', 'e4', 'e1', 'b3', 'f3'],
    },

    // ===========================================
    // ACT 3: PUNISH — 8...Bg4? (premature pin)
    // ===========================================

    // 8
    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "Back to after c3 — what if Black skips castling and pins your knight with 8...Bg4 instead? It looks clever, but the timing is wrong.",
      arrow: ['c8', 'g4'],
    },
    // 9
    {
      type: 'instruction',
      fen: FEN.punish4_after_Bg4,
      text: "Bg4 — the bishop pins your knight to the queen. Annoying, right? But Black forgot something important: the king is still on e8.",
      highlightSquares: ['g4', 'f3', 'd1', 'e8'],
      autoAdvance: 1800,
    },
    // 10
    {
      type: 'play-move',
      fen: FEN.punish4_after_Bg4,
      correctMove: 'h3',
      prompt: "Challenge the bishop. Make it move or stay where it's uncomfortable.",
      hint: "Push h3 — the bishop has nowhere good to go.",
      correctFeedback: "h3! The bishop is kicked. It'll retreat to h5 where it's out of play.",
      wrongFeedback: "Attack the bishop with a pawn — h3.",
      highlightSquares: ['h2', 'h3'],
    },
    // 11 — Bh5 auto-advance
    {
      type: 'instruction',
      fen: FEN.punish4_after_Bh5,
      text: "Bh5 — the bishop retreats, but now it's sidelined on the rim.",
      autoAdvance: 1200,
    },
    // 12
    {
      type: 'play-move',
      fen: FEN.punish4_after_Bh5,
      correctMove: 'd4',
      prompt: "Black's king is still in the center and their bishop is offside. Strike now!",
      hint: "d4 — open the center against the uncastled king.",
      correctFeedback: "d4! The center opens while Black's king is stuck on e8. That's why you castle before pinning — the punishment for bad timing.",
      wrongFeedback: "Open the center while their king is exposed — d4!",
      highlightSquares: ['d2', 'd4'],
    },
    // 13
    {
      type: 'instruction',
      fen: FEN.punish4_after_d4,
      text: "Castle first, THEN develop aggressively. Pinning before castling lets White rip open the center against your exposed king.",
      highlightSquares: ['e8', 'd4', 'e1'],
    },

    // ===========================================
    // ACT 4: WHITE RECALL (new moves only)
    // ===========================================

    // 14
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "Your turn — play the new moves you learned. Start from the Bb3 position.",
      buttonText: "LET'S GO",
    },
    // 15 — d6 auto-advance
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: 'd6.',
      autoAdvance: 800,
    },
    // 16
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'c3',
      prompt: 'Your move.',
      hint: 'c3.',
      correctFeedback: 'c3.',
      wrongFeedback: 'c3.',
    },
    // 17 — O-O auto-advance
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: 'O-O.',
      autoAdvance: 800,
    },
    // 18
    {
      type: 'play-move',
      fen: FEN.after_OO_b,
      correctMove: 'h3',
      prompt: 'Your move.',
      hint: 'h3.',
      correctFeedback: 'h3.',
      wrongFeedback: 'h3.',
    },

  ],
}

// ═══════════════════════════════════════════════════════════
// EXCHANGE VARIATION 1 (White, 9 steps)
// ═══════════════════════════════════════════════════════════

export const RL_EXCHANGE_1: OpeningLesson = {
  id: 'rl-exchange-1',
  title: 'The Exchange',
  defaultOrientation: 'white',
  steps: [

    // ===========================================
    // ACT 1: RECAP (1.e4 e5 2.Nf3 Nc6 3.Bb5)
    // ===========================================

    // 1
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Control the center.',
      hint: 'e-pawn forward two squares.',
      correctFeedback: 'e4 — center control.',
      wrongFeedback: "Grab the center.",
      highlightSquares: ['e2', 'e4'],
    },
    // 2
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'e5.',
      autoAdvance: 800,
    },
    // 3
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Develop and attack.',
      hint: 'Knight to f3.',
      correctFeedback: 'Nf3 — develops AND threatens e5.',
      wrongFeedback: "Develop toward the center.",
      highlightSquares: ['g1', 'f3'],
    },
    // 4
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: 'Nc6.',
      autoAdvance: 800,
    },
    // 5
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bb5',
      prompt: 'Pressure the defender.',
      hint: 'Bishop to b5.',
      correctFeedback: "Bb5 — the Ruy Lopez.",
      wrongFeedback: "Target the knight defending e5.",
      highlightSquares: ['f1', 'b5'],
    },

    // ===========================================
    // ACT 2: TEACH (3...a6 4.Bxc6 dxc6)
    // ===========================================

    // 6 — 3...a6 auto-advance
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "a6 — Black challenges the bishop again. In the Morphy Defense, you retreated. But this time you have a different idea.",
      arrow: ['a6', 'b5'],
      autoAdvance: 1800,
    },
    // 7
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "Instead of retreating, White takes the knight immediately. This is the Exchange Variation.",
    },
    // 8 — 4.Bxc6 play-move
    {
      type: 'play-move',
      fen: FEN.after_a6,
      correctMove: 'Bxc6',
      prompt: "Take the knight! You're giving up the bishop pair, but you're about to wreck Black's pawn structure.",
      hint: "Capture the knight on c6 with your bishop.",
      correctFeedback: "Bxc6! The Exchange. You traded your bishop for the knight — but watch what happens to Black's pawns.",
      wrongFeedback: "This time, capture the knight instead of retreating.",
      highlightSquares: ['b5', 'c6'],
    },
    // 9 — 4...dxc6 auto-advance
    {
      type: 'instruction',
      fen: FEN.exch_after_dxc6,
      text: "dxc6 — Black recaptures toward the center. This is the correct recapture.",
      autoAdvance: 1500,
    },
    // 10
    {
      type: 'instruction',
      fen: FEN.exch_after_dxc6,
      text: "Why dxc6? It opens the diagonal for Black's c8 bishop and puts two pawns in the center. Black gets the bishop pair and active piece play.",
      highlightSquares: ['c6', 'e5', 'c8'],
      arrow: ['c8', 'f5'],
    },
    // 11
    {
      type: 'instruction',
      fen: FEN.exch_after_dxc6,
      text: "White's plan: use the better pawn structure in the endgame. Black has doubled c-pawns but active pieces. It's a fair trade.",
      highlightSquares: ['a6', 'c6'],
    },

    // ===========================================
    // ACT 3: PUNISH — 4...bxc6? (wrong recapture)
    // ===========================================

    // 12
    {
      type: 'instruction',
      fen: FEN.exch_punish_bxc6,
      text: "What if Black recaptures with the b-pawn instead? bxc6 — the c8 bishop is still blocked, the a6 pawn is isolated, and the queenside is shattered.",
      highlightSquares: ['a6', 'c6', 'c8'],
    },
    // 14 — O-O auto-advance
    {
      type: 'instruction',
      fen: FEN.exch_punish_OO,
      text: 'O-O — White castles, developing smoothly.',
      autoAdvance: 1200,
    },
    // 15 — Nf6 auto-advance
    {
      type: 'instruction',
      fen: FEN.exch_punish_Nf6,
      text: 'Nf6 — Black develops the knight.',
      autoAdvance: 1200,
    },
    // 16
    {
      type: 'play-move',
      fen: FEN.exch_punish_Nf6,
      correctMove: 'd4',
      prompt: "Black's bishop is stuck and pawns are weak. Open the center!",
      hint: "d4 — open the position while Black's pieces are tangled.",
      correctFeedback: "d4! The center opens and Black is struggling. The bishop on c8 has no good diagonal, and those doubled c-pawns are a long-term weakness.",
      wrongFeedback: "Push d4 to open the center against Black's weak structure.",
      highlightSquares: ['d2', 'd4'],
    },
    // 17
    {
      type: 'instruction',
      fen: FEN.exch_punish_d4,
      text: "Always recapture with dxc6 — it opens the diagonal for the bishop and keeps the center strong. bxc6 leaves your pawns weak and your bishop stuck.",
      highlightSquares: ['c8', 'c6', 'a6'],
    },

    // ===========================================
    // ACT 4: WHITE RECALL (Exchange sequence)
    // ===========================================

    // 18
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Quick recall — play the Exchange Variation from after Nc6.",
      buttonText: "LET'S GO",
    },
    // 19
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bb5',
      prompt: 'Your move.',
      hint: 'Bb5.',
      correctFeedback: 'Bb5.',
      wrongFeedback: 'Bb5.',
    },
    // 20 — a6 auto-advance
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: 'a6.',
      autoAdvance: 800,
    },
    // 21
    {
      type: 'play-move',
      fen: FEN.after_a6,
      correctMove: 'Bxc6',
      prompt: 'Your move.',
      hint: 'Bxc6.',
      correctFeedback: 'Bxc6.',
      wrongFeedback: 'Bxc6.',
    },

  ],
}

// ═══════════════════════════════════════════════════════════
// EXCHANGE VARIATION 2: Exchange Middlegame
// ═══════════════════════════════════════════════════════════

export const RL_EXCHANGE_2: OpeningLesson = {
  id: 'rl-exchange-2',
  title: 'Exchange Middlegame',
  defaultOrientation: 'white',
  steps: [

    // ===================================
    // ACT 1: RECAP
    // ===================================

    // 1. Context
    {
      type: 'instruction',
      fen: FEN.exch_after_dxc6,
      text: "You traded your bishop for the knight. Black has doubled c-pawns but the bishop pair. Now what?",
      highlightSquares: ['c6', 'c7'],
    },

    // ===================================
    // ACT 2: TEACH (O-O, f6, d4, Bg4)
    // ===================================

    // 2. Play O-O
    {
      type: 'play-move',
      fen: FEN.exch_after_dxc6,
      correctMove: 'O-O',
      prompt: "Get your king safe and connect the rooks.",
      hint: "Castle kingside -- king to g1.",
      correctFeedback: "O-O! King is tucked away. Now plan d4 to open the center.",
      wrongFeedback: "Castle first -- safety before attack.",
      highlightSquares: ['e1', 'g1'],
    },

    // 3. Auto: f6
    {
      type: 'instruction',
      fen: FEN.exch_after_f6,
      text: "f6 -- Black props up the e5 pawn with a pawn. Ugly but necessary.",
      autoAdvance: 1500,
    },

    // 4. Why f6?
    {
      type: 'instruction',
      fen: FEN.exch_after_f6,
      text: "The e5 pawn lost its knight defender (it was traded on c6). f6 holds it solid so White can't grab it for free.",
      highlightSquares: ['e5', 'f6'],
    },

    // 5. Play d4
    {
      type: 'play-move',
      fen: FEN.exch_after_f6,
      correctMove: 'd4',
      prompt: "Challenge Black's center -- this is White's whole plan in the Exchange.",
      hint: "Push d2 to d4. Attack e5 and open lines.",
      correctFeedback: "d4! Challenging the center. White wants open lines for the rooks.",
      wrongFeedback: "Push d4 -- fight for the center while you have the better structure.",
      highlightSquares: ['d2', 'd4'],
    },

    // 6. Auto: Bg4
    {
      type: 'instruction',
      fen: FEN.exch_after_Bg4,
      text: "Bg4 -- Black pins your knight to the queen. This is how Black uses the bishop pair.",
      arrow: ['g4', 'd1'],
      autoAdvance: 1500,
    },

    // 7. Summary
    {
      type: 'instruction',
      fen: FEN.exch_after_Bg4,
      text: "Black has the bishop pair, White has the better pawn structure. That's the Exchange Variation -- a positional battle.",
      highlightSquares: ['c6', 'c7', 'g4'],
    },

    // ===================================
    // ACT 3: PUNISH THE MISTAKE (5...Nf6?)
    // ===================================

    // 8. Setup the mistake
    {
      type: 'instruction',
      fen: FEN.exch_after_OO,
      text: "What if Black develops the knight with Nf6 instead of f6? Looks natural -- but e5 is hanging.",
      arrow: ['g8', 'f6'],
    },

    // 9. Auto: Nf6 played
    {
      type: 'instruction',
      fen: FEN.exch2_punish_Nf6,
      text: "Nf6 develops a piece but doesn't protect e5. The knight that used to guard e5 was traded on c6!",
      highlightSquares: ['e5', 'f6'],
      autoAdvance: 1800,
    },

    // 10. Play Nxe5!
    {
      type: 'play-move',
      fen: FEN.exch2_punish_Nf6,
      correctMove: 'Nxe5',
      prompt: "The e5 pawn is undefended. Grab it!",
      hint: "Your knight can take the free pawn on e5.",
      correctFeedback: "Nxe5! A clean extra pawn. Nf6 looked natural but it forgot about e5.",
      wrongFeedback: "The e5 pawn has no defender -- take it with your knight.",
      highlightSquares: ['f3', 'e5'],
    },

    // 11. Teaching point
    {
      type: 'instruction',
      fen: FEN.exch2_punish_Nxe5,
      text: "In the Exchange, the e5 pawn has no knight defender -- it was traded. f6 looks ugly but it's the move. Nf6 lets White grab e5 for free.",
      highlightSquares: ['e5'],
    },

    // ===================================
    // ACT 4: WHITE RECALL (O-O and d4)
    // ===================================

    // 12. Recall intro
    {
      type: 'instruction',
      fen: FEN.exch_after_dxc6,
      text: "Your turn. Play White's plan from the Exchange position.",
      buttonText: "LET'S GO",
    },

    // 13. Play O-O
    {
      type: 'play-move',
      fen: FEN.exch_after_dxc6,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // 14. Auto: f6
    { type: 'instruction', fen: FEN.exch_after_f6, text: 'f6.', autoAdvance: 800 },

    // 15. Play d4
    {
      type: 'play-move',
      fen: FEN.exch_after_f6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },

    // 16. Auto: Bg4
    { type: 'instruction', fen: FEN.exch_after_Bg4, text: 'Bg4.', autoAdvance: 800 },

    // 17. Wrap-up
    {
      type: 'instruction',
      fen: FEN.exch_after_Bg4,
      text: "O-O then d4 -- that's White's plan in the Exchange. Better pawns vs the bishop pair. A fair fight.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// BERLIN DEFENSE 1: The Berlin Wall
// ═══════════════════════════════════════════════════════════

export const RL_BERLIN_1: OpeningLesson = {
  id: 'rl-berlin-1',
  title: 'The Berlin Wall',
  defaultOrientation: 'white',
  steps: [

    // ===================================
    // ACT 1: RECAP (play to Bb5)
    // ===================================

    // 1. Play e4
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: "Let's get to where the Berlin begins. First move!",
      hint: "King's pawn -- e4.",
      correctFeedback: "e4!",
      wrongFeedback: "Start with e4.",
      highlightSquares: ['e2', 'e4'],
    },

    // 2. Auto: e5
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },

    // 3. Play Nf3
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: "Develop and attack e5.",
      hint: "Knight to f3.",
      correctFeedback: "Nf3!",
      wrongFeedback: "Knight to f3.",
      highlightSquares: ['g1', 'f3'],
    },

    // 4. Auto: Nc6
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6.', autoAdvance: 800 },

    // 5. Play Bb5
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bb5',
      prompt: "The Ruy Lopez!",
      hint: "Bishop to b5.",
      correctFeedback: "Bb5! Now -- instead of a6, Black has a different idea.",
      wrongFeedback: "Bishop to b5.",
      highlightSquares: ['f1', 'b5'],
    },

    // ===================================
    // ACT 2: TEACH (Nf6, O-O, Nxe4)
    // ===================================

    // 6. Introduce the Berlin
    {
      type: 'instruction',
      fen: FEN.after_Bb5,
      text: "Instead of chasing your bishop with a6, Black counterattacks the e4 pawn directly. This is the Berlin Defense.",
    },

    // 7. Auto: Nf6
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nf6,
      text: "Nf6! Black attacks e4 instead of worrying about the bishop on b5.",
      arrow: ['f6', 'e4'],
      autoAdvance: 1500,
    },

    // 8. Play O-O
    {
      type: 'play-move',
      fen: FEN.berlin_after_Nf6,
      correctMove: 'O-O',
      prompt: "Castle! Seems like you're ignoring the threat to e4 -- but you have a plan.",
      hint: "Castle kingside.",
      correctFeedback: "O-O! Your king is safe. And yes, e4 is hanging -- but that's the trick.",
      wrongFeedback: "Castle -- O-O.",
      highlightSquares: ['e1', 'g1'],
    },

    // 9. Explain the tension
    {
      type: 'instruction',
      fen: FEN.berlin_after_OO,
      text: "Wait -- isn't e4 hanging? Yes, and Black should take it! That's the whole point of the Berlin.",
      arrow: ['f6', 'e4'],
    },

    // 10. Auto: Nxe4
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nxe4,
      text: "Nxe4! Black grabs the center pawn. White gets it back later with d4, but Black trades into a fortress.",
      highlightSquares: ['e4'],
      autoAdvance: 1800,
    },

    // 11. Summary
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nxe4,
      text: "The Berlin Defense -- Black grabs the center pawn and heads for one of the most famous endgames in chess. Kramnik used it to dethrone Kasparov.",
    },

    // ===================================
    // ACT 3: PUNISH THE MISTAKE (4...d6?)
    // ===================================

    // 12. Setup the mistake
    {
      type: 'instruction',
      fen: FEN.berlin_after_OO,
      text: "What if Black plays d6 instead of taking e4? It looks safe -- but it's too timid.",
      arrow: ['d7', 'd6'],
    },

    // 13. Auto: d6 played
    {
      type: 'instruction',
      fen: FEN.berlin1_punish_d6,
      text: "d6 -- Black protects e5 but misses the chance to grab e4. Now White strikes.",
      highlightSquares: ['d6', 'e4'],
      autoAdvance: 1500,
    },

    // 14. Play d4!
    {
      type: 'play-move',
      fen: FEN.berlin1_punish_d6,
      correctMove: 'd4',
      prompt: "Black was passive. Open the center!",
      hint: "Push d4 -- blow the position open.",
      correctFeedback: "d4! Opening the center against Black's uncastled king. This is why you can't be timid in the Berlin.",
      wrongFeedback: "Push d4 -- punish Black's passivity.",
      highlightSquares: ['d2', 'd4'],
    },

    // 15. Auto: exd4
    {
      type: 'instruction',
      fen: FEN.berlin1_punish_exd4,
      text: "exd4 -- Black has to take, but the center opens up.",
      autoAdvance: 1200,
    },

    // 16. Play Nxd4
    {
      type: 'play-move',
      fen: FEN.berlin1_punish_exd4,
      correctMove: 'Nxd4',
      prompt: "Recapture -- your knight lands on a dominant square.",
      hint: "Knight takes d4.",
      correctFeedback: "Nxd4! Centralized knight, open position, and Black's king is still stuck. d6 was too passive.",
      wrongFeedback: "Recapture with the knight on d4.",
      highlightSquares: ['f3', 'd4'],
    },

    // 17. Teaching point
    {
      type: 'instruction',
      fen: FEN.berlin1_punish_Nxd4,
      text: "In the Berlin, you MUST take the e4 pawn. Playing d6 lets White open the center with d4 and dominate with a huge knight on d4.",
      highlightSquares: ['d4'],
      arrow: ['d4', 'c6'],
    },

    // ===================================
    // ACT 4: WHITE RECALL (play O-O)
    // ===================================

    // 18. Recall intro
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nf6,
      text: "Black just played Nf6, attacking e4. What's White's move?",
      buttonText: "LET'S GO",
    },

    // 19. Play O-O
    {
      type: 'play-move',
      fen: FEN.berlin_after_Nf6,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // 20. Auto: Nxe4
    { type: 'instruction', fen: FEN.berlin_after_Nxe4, text: 'Nxe4.', autoAdvance: 800 },
  ],
}

// ═══════════════════════════════════════════════════════════
// BERLIN DEFENSE 2: Berlin Endgame
// ═══════════════════════════════════════════════════════════

export const RL_BERLIN_2: OpeningLesson = {
  id: 'rl-berlin-2',
  title: 'Berlin Endgame',
  defaultOrientation: 'white',
  steps: [

    // ===========================================
    // ACT 1: RECAP — Context from after Nxe4
    // ===========================================

    // 1
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nxe4,
      text: "Black grabbed your e4 pawn with Nxe4. The knight is deep in your territory — but it's about to get chased.",
      highlightSquares: ['e4'],
    },

    // ===========================================
    // ACT 2: TEACH (5.d4, Nd6, Bxc6, dxc6, dxe5, Nf5)
    // ===========================================

    // 2 — 5.d4 (play-move)
    {
      type: 'play-move',
      fen: FEN.berlin_after_Nxe4,
      correctMove: 'd4',
      prompt: "Strike the center while Black's knight is stuck on e4. Open lines!",
      hint: "Push d4 — attack e5 and make that knight uncomfortable.",
      correctFeedback: "d4! You're attacking e5 and the knight has to move. The center is yours.",
      wrongFeedback: "The center is open for the taking — which pawn crashes through?",
      highlightSquares: ['d2', 'd4'],
      postMoveArrow: ['d4', 'e5'],
    },

    // 3 — 5...Nd6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nd6,
      text: "Nd6 — looks weird, right? The knight blocks the d-pawn. But it's the only good square. From d6, it'll jump to f5 later.",
      highlightSquares: ['d6', 'f5'],
      autoAdvance: 1800,
    },

    // 4 — 6.Bxc6 (play-move)
    {
      type: 'play-move',
      fen: FEN.berlin_after_Nd6,
      correctMove: 'Bxc6',
      prompt: "Trade the bishop for the knight — force Black to wreck their pawn structure.",
      hint: "Capture on c6. Black has to take back, and their pawns get doubled.",
      correctFeedback: "Bxc6! Black must recapture, and either way the pawns get ugly. You're trading your bishop for a long-term structural edge.",
      wrongFeedback: "Take the knight on c6 — damage Black's pawns for the rest of the game.",
      highlightSquares: ['b5', 'c6'],
    },

    // 5 — 6...dxc6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.berlin_after_dxc6,
      text: "dxc6 — Black recaptures with the d-pawn. Doubled c-pawns, but the d-file is now open for Black's rook.",
      highlightSquares: ['c6', 'c7'],
      autoAdvance: 1500,
    },

    // 6 — 7.dxe5 (play-move)
    {
      type: 'play-move',
      fen: FEN.berlin_after_dxc6,
      correctMove: 'dxe5',
      prompt: "Grab the center pawn. Open lines while you're ahead in development.",
      hint: "Capture on e5 — win a pawn and open the position.",
      correctFeedback: "dxe5! You won the center pawn. The position is opening up in your favor.",
      wrongFeedback: "There's a free pawn on e5 — take it!",
      highlightSquares: ['d4', 'e5'],
    },

    // 7 — 7...Nf5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nf5,
      text: "Nf5 — the knight hops to its best square, eyeing d4 and e3. Remember when it looked silly on d6? This was the plan all along.",
      arrow: ['f5', 'd4'],
      autoAdvance: 1800,
    },

    // 8 — Summary
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nf5,
      text: "This is the Berlin Endgame position. White has better pawns and a central majority. Black has the bishop pair and active pieces. Both sides have chances.",
      highlightSquares: ['e5', 'f5'],
    },

    // ===========================================
    // ACT 3: PUNISH — 5...Nc5? (wrong retreat)
    // ===========================================

    // 9
    {
      type: 'instruction',
      fen: FEN.berlin_after_d4,
      text: "What if Black retreats the knight to c5 instead of d6? It attacks your bishop — but watch what happens to e5.",
      highlightSquares: ['e4', 'c5'],
    },

    // 10 — Show the mistake
    {
      type: 'instruction',
      fen: FEN.berlin2_punish_Nc5,
      text: "Nc5 — the knight attacks the bishop, sure. But look at e5. Nobody's guarding it anymore.",
      arrow: ['c5', 'b3'],
      autoAdvance: 1500,
    },

    // 11 — Punish with Nxe5!
    {
      type: 'play-move',
      fen: FEN.berlin2_punish_Nc5,
      correctMove: 'Nxe5',
      prompt: "The e5 pawn is hanging. Take it!",
      hint: "Your knight can grab e5 for free.",
      correctFeedback: "Nxe5! Free pawn. Nc5 attacked the bishop but left e5 completely undefended.",
      wrongFeedback: "Look at e5 — nobody's protecting it.",
      highlightSquares: ['f3', 'e5'],
    },

    // 12 — Teaching point
    {
      type: 'instruction',
      fen: FEN.berlin2_punish_Nxe5,
      text: "Nc5 attacks the bishop, but it leaves e5 wide open. Nd6 is the only move — it looks ugly blocking the d-pawn, but the knight jumps to f5 later.",
      highlightSquares: ['e5', 'd6'],
    },

    // ===========================================
    // ACT 4: WHITE RECALL
    // ===========================================

    // 13
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nxe4,
      text: "Your turn — play the Berlin sequence from memory. Black just took on e4.",
      buttonText: "LET'S GO",
    },

    // 14 — d4
    {
      type: 'play-move',
      fen: FEN.berlin_after_Nxe4,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    // 15 — Nd6
    { type: 'instruction', fen: FEN.berlin_after_Nd6, text: 'Nd6.', autoAdvance: 800 },

    // 16 — Bxc6
    {
      type: 'play-move',
      fen: FEN.berlin_after_Nd6,
      correctMove: 'Bxc6',
      prompt: 'Your move.',
      hint: 'Bxc6.',
      correctFeedback: 'Bxc6.',
      wrongFeedback: 'Bxc6.',
    },
    // 17 — dxc6
    { type: 'instruction', fen: FEN.berlin_after_dxc6, text: 'dxc6.', autoAdvance: 800 },

    // 18 — dxe5
    {
      type: 'play-move',
      fen: FEN.berlin_after_dxc6,
      correctMove: 'dxe5',
      prompt: 'Your move.',
      hint: 'dxe5.',
      correctFeedback: 'dxe5.',
      wrongFeedback: 'dxe5.',
    },
    // 19 — Nf5
    {
      type: 'instruction',
      fen: FEN.berlin_after_Nf5,
      text: "Nf5. You played it perfectly: d4, Bxc6, dxe5 — the Berlin Endgame. White's pawn structure is cleaner and you're ready to play.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// MARSHALL ATTACK: The Marshall Gambit
// ═══════════════════════════════════════════════════════════

export const RL_MARSHALL_1: OpeningLesson = {
  id: 'rl-marshall-1',
  title: 'The Marshall Gambit',
  defaultOrientation: 'white',
  steps: [

    // ===========================================
    // ACT 1: CONTEXT — After Bb3, a choice
    // ===========================================

    // 1
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "After Bb3, most players play d6 and enter the Closed Ruy Lopez. But there's a much more exciting option for Black.",
      highlightSquares: ['b3'],
    },
    // 2
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "What if Black skips d6 and castles immediately? That's the start of the Marshall Gambit — one of the most dangerous attacks in chess.",
      arrow: ['e8', 'g8'],
    },

    // ===========================================
    // ACT 2: TEACH (7...O-O, 8.c3, 8...d5!)
    // ===========================================

    // 3 — 7...O-O (auto-advance, Black's move)
    {
      type: 'instruction',
      fen: FEN.marshall_after_OO,
      text: "O-O — Black castles right away, delaying d6. The king is safe, and Black is preparing something aggressive.",
      highlightSquares: ['g8', 'f8'],
      autoAdvance: 1800,
    },

    // 4 — 8.c3 (play-move, White's normal move)
    {
      type: 'play-move',
      fen: FEN.marshall_after_OO,
      correctMove: 'c3',
      prompt: "Play White's standard move — prepare the d4 push just like in the Closed Ruy Lopez.",
      hint: "c3 supports a future d4. It's the normal plan.",
      correctFeedback: "c3 — preparing d4 as usual. White doesn't suspect anything yet.",
      wrongFeedback: "White wants to push d4 — which pawn supports it?",
      highlightSquares: ['c2', 'c3'],
      postMoveArrow: ['c3', 'd4'],
    },

    // 5 — 8...d5! (auto-advance, THE GAMBIT)
    {
      type: 'instruction',
      fen: FEN.marshall_after_d5,
      text: "d5!! THE MARSHALL GAMBIT! Black sacrifices the e5 pawn to blow open the center. This changes everything.",
      highlightSquares: ['d5', 'e5'],
      autoAdvance: 1800,
    },

    // 6 — Explain the gambit
    {
      type: 'instruction',
      fen: FEN.marshall_after_d5,
      text: "Black gives up the e5 pawn but gets rapid piece development, open lines toward White's king, and a fierce kingside attack. Many grandmasters avoid this with White.",
      arrow: ['c8', 'h3'],
    },

    // 7 — Highlight the open lines
    {
      type: 'instruction',
      fen: FEN.marshall_after_d5,
      text: "Look at the board — Black's bishop will come to c8-h3 diagonal, the rook has the open f-file, and the knight can jump to e4 or g4. White's king is under pressure.",
      highlightSquares: ['f8', 'f3', 'g1'],
    },

    // 8 — Summary
    {
      type: 'instruction',
      fen: FEN.marshall_after_d5,
      text: "The Marshall Gambit: castle first, then strike with d5. A pawn for a devastating attack. Some of the most brilliant games in history came from this position.",
    },

    // ===========================================
    // ACT 3: PUNISH — 7...d6? (too slow)
    // ===========================================

    // 9
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "What if Black plays the 'normal' 7...d6 instead of castling? They miss the Marshall timing completely.",
      highlightSquares: ['d7'],
    },

    // 10 — Show 7...d6
    {
      type: 'instruction',
      fen: FEN.marshall1_punish_d6,
      text: "d6 — solid but slow. Now White gets to build the perfect center without any counterplay from Black.",
      autoAdvance: 1500,
    },

    // 11 — 8.c3 (play-move)
    {
      type: 'play-move',
      fen: FEN.marshall1_punish_d6,
      correctMove: 'c3',
      prompt: "Black wasted their chance. Build your ideal center — prepare d4.",
      hint: "c3 supports d4, same as always.",
      correctFeedback: "c3 — you're building the dream center. Black has no counterattack brewing.",
      wrongFeedback: "Prepare d4 with a pawn move.",
      highlightSquares: ['c2', 'c3'],
    },

    // 12 — 8...O-O (auto-advance)
    {
      type: 'instruction',
      fen: FEN.marshall1_punish_OO,
      text: "O-O — Black castles, but now it's too late for d5 to be a gambit. White is ready.",
      autoAdvance: 1200,
    },

    // 13 — 9.d4 (play-move)
    {
      type: 'play-move',
      fen: FEN.marshall1_punish_OO,
      correctMove: 'd4',
      prompt: "Now push d4! You have the perfect center.",
      hint: "d4 — the move you prepared with c3. Claim the center.",
      correctFeedback: "d4! Perfect center, full development, and Black has no attack. That's what happens when they play d6 too early.",
      wrongFeedback: "You prepared this — push d4!",
      highlightSquares: ['d2', 'd4'],
    },

    // 14 — Teaching point
    {
      type: 'instruction',
      fen: FEN.marshall1_punish_d4,
      text: "In the Marshall, timing is everything. Castle first, THEN strike with d5. If Black plays d6 first, White gets the perfect center and there's no attack.",
      highlightSquares: ['d4', 'e4', 'c3'],
    },

    // ===========================================
    // ACT 4: WHITE RECALL
    // ===========================================

    // 15
    {
      type: 'instruction',
      fen: FEN.marshall_after_OO,
      text: "Quick recall — Black just castled in the Marshall move order. What's your move?",
      buttonText: "LET'S GO",
    },

    // 16 — c3
    {
      type: 'play-move',
      fen: FEN.marshall_after_OO,
      correctMove: 'c3',
      prompt: 'Your move.',
      hint: 'c3.',
      correctFeedback: 'c3.',
      wrongFeedback: 'c3.',
    },

    // 17 — d5 final
    {
      type: 'instruction',
      fen: FEN.marshall_after_d5,
      text: "d5! The Marshall Gambit. You know the idea now — Black sacrifices a pawn for a devastating kingside attack. Watch out for this one.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// BRANCH: Open Ruy Lopez — "The Pawn Grab"
// Position: After 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Nxe4
// Teaches: 6.d4 b5 7.Bb3 d5 8.dxe5 Be6
// Theme: The pawn wasn't free — White counter-attacks in the center
// ═══════════════════════════════════════════════════════════

export const RL_OPEN_1: OpeningLesson = {
  id: 'rl-open-1',
  title: 'The Pawn Grab',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // SETUP — Black takes the pawn
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "You just castled. Black's knight on f6 is eyeing your e4 pawn — and this time, they take it.",
      arrow: ['f6', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.open_after_Nxe4,
      text: "Nxe4! Black grabbed a pawn. But you're about to get it back — with interest.",
      autoAdvance: 1800,
    },

    // ═══════════════════════════════════════════
    // TEACH — 6.d4! the counter-strike
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.open_after_Nxe4,
      text: "The pawn wasn't free. This is your chance to blow open the center while Black's knight is stuck on e4.",
      highlightSquares: ['e4', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.open_after_Nxe4,
      correctMove: 'd4',
      prompt: "Strike the center! Black's knight is in the way and their king is still on e8.",
      hint: "Push your d-pawn two squares. It attacks e5 and opens lines for your pieces.",
      correctFeedback: "d4! Now you're attacking e5, and if Black's e-pawn moves, the whole center opens up — bad news when their king hasn't castled.",
      wrongFeedback: "The center is vulnerable. What pawn push attacks e5 and opens the position?",
      highlightSquares: ['d2', 'd4'],
      postMoveArrow: ['d4', 'e5'],
    },

    // Black plays b5
    {
      type: 'instruction',
      fen: FEN.open_after_b5,
      text: "b5 — Black chases your bishop before dealing with the center. They need room to breathe.",
      arrow: ['b5', 'a4'],
      autoAdvance: 1800,
    },
    {
      type: 'play-move',
      fen: FEN.open_after_b5,
      correctMove: 'Bb3',
      prompt: "Your bishop is under attack. Retreat it — but aim it somewhere useful.",
      hint: "From b3, the bishop stares at d5 and f7.",
      correctFeedback: "Bb3 — retreated but deadly. It's aimed at d5 and f7, two critical squares.",
      wrongFeedback: "Retreat the bishop where it still has targets. b3 aims at both d5 and f7.",
      highlightSquares: ['a4', 'b3'],
      postMoveArrow: ['b3', 'f7'],
    },

    // Black plays d5
    {
      type: 'instruction',
      fen: FEN.open_after_d5,
      text: "d5 — Black protects the knight and claims space. But the center is about to open.",
      autoAdvance: 1800,
    },
    {
      type: 'play-move',
      fen: FEN.open_after_d5,
      correctMove: 'dxe5',
      prompt: "Take the e5 pawn. Open the center while Black's king is stuck.",
      hint: "Capture on e5 — your passed e-pawn will be a headache for Black.",
      correctFeedback: "dxe5! You got the pawn back — and then some. Passed e-pawn, open lines, and Black still hasn't castled.",
      wrongFeedback: "Capture on e5 to open the center against Black's uncastled king.",
      highlightSquares: ['d4', 'e5'],
    },

    // Black plays Be6
    {
      type: 'instruction',
      fen: FEN.open_after_Be6,
      text: "Be6 — Black finally develops, shielding d5 from your bishop. But look at the position.",
      highlightSquares: ['e5', 'b3', 'f1'],
    },
    {
      type: 'instruction',
      fen: FEN.open_after_Be6,
      text: "Material is equal — but the position isn't. You have a passed e5 pawn, open lines, active pieces, and a safe king. Black is cramped with no castling in sight. That's the Open Ruy Lopez.",
      highlightSquares: ['e5', 'b3', 'f3', 'g1'],
    },

    // ═══════════════════════════════════════════
    // RECALL — Play the whole sequence
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.open_after_Nxe4,
      text: "Now play it from the top. Black just grabbed your e4 pawn — make them regret it.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.open_after_Nxe4,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    { type: 'instruction', fen: FEN.open_after_b5, text: 'b5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.open_after_b5,
      correctMove: 'Bb3',
      prompt: 'Your move.',
      hint: 'Bb3.',
      correctFeedback: 'Bb3.',
      wrongFeedback: 'Bb3.',
    },
    { type: 'instruction', fen: FEN.open_after_d5, text: 'd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.open_after_d5,
      correctMove: 'dxe5',
      prompt: 'Your move.',
      hint: 'dxe5.',
      correctFeedback: 'dxe5.',
      wrongFeedback: 'dxe5.',
    },
    {
      type: 'instruction',
      fen: FEN.open_after_Be6,
      text: "Be6. You know how to punish the pawn grab: d4, Bb3, dxe5. Equal material, but White's position is way better.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// PUNISH: 2...f6?? — "Don't Block With f6"
// Position: After 1.e4 e5 2.Nf3, Black plays 2...f6??
// Teaches: 3.Nxe5! fxe5 4.Qh5+ g6 5.Qxe5+ (fork king + rook)
// Theme: f6 weakens the king — sacrifice the knight, win the rook
// ═══════════════════════════════════════════════════════════

export const RL_PUNISH_F6: OpeningLesson = {
  id: 'rl-punish-f6',
  title: "Punishing f6",
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // SETUP — Black plays f6
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "After 2.Nf3, your knight attacks the e5 pawn. Beginners sometimes try to defend it with f6. It looks logical — but it's a serious mistake.",
      arrow: ['f3', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_f6,
      text: "2...f6?? The pawn defends e5, sure. But f6 weakens the diagonal from e8 to h5 — and the king is sitting right on it.",
      highlightSquares: ['e8', 'f7', 'g6', 'h5'],
    },

    // ═══════════════════════════════════════════
    // TEACH — The knight sacrifice
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.punish_after_f6,
      text: "Your knight is attacked by the f6 pawn. But what if you just... take anyway?",
      highlightSquares: ['f3', 'e5', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_f6,
      correctMove: 'Nxe5',
      prompt: "Take the pawn — even though f6 defends it.",
      hint: "Sacrifice the knight on e5. Black will capture, but the f-file opens.",
      correctFeedback: "Nxe5! It looks like you're giving away a knight. But watch what happens when Black takes back.",
      wrongFeedback: "Don't be afraid — take on e5. The knight sacrifice opens the king.",
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_fxe5,
      text: "fxe5 — Black takes the knight and thinks they're up material. But the f-file just ripped open, and the king is exposed.",
      highlightSquares: ['e8', 'f7'],
      autoAdvance: 2000,
    },

    // ═══════════════════════════════════════════
    // TEACH — Qh5+ the killer check
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.punish_after_fxe5,
      text: "With no pawn on f7, the diagonal to Black's king is wide open. Your queen can exploit it immediately.",
      arrow: ['d1', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_fxe5,
      correctMove: 'Qh5+',
      prompt: "Check the king along the open diagonal.",
      hint: "Your queen can reach h5 — and that's check.",
      correctFeedback: "Qh5+! Check. Black's king has nowhere safe to go.",
      wrongFeedback: "Look at the diagonal to the king — your queen can give check from h5.",
      postMoveArrow: ['h5', 'e8'],
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_g6,
      text: "g6 — the only way to block. But now your queen has an even bigger target.",
      autoAdvance: 1500,
    },

    // ═══════════════════════════════════════════
    // TEACH — Qxe5+ the fork
    // ═══════════════════════════════════════════

    {
      type: 'play-move',
      fen: FEN.punish_after_g6,
      correctMove: 'Qxe5+',
      prompt: "Take the pawn — with check. Look what else the queen attacks.",
      hint: "Qxe5+ is check AND attacks the rook on h8.",
      correctFeedback: "Qxe5+! Check, and the rook on h8 is hanging. Black can't save both.",
      wrongFeedback: "Capture the e5 pawn with your queen — it's check and a fork.",
      highlightSquares: ['e5', 'e8', 'h8'],
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_Qxe5,
      text: "The queen forks the king and the rook. Black has to deal with the check — and the rook is lost.",
      arrow: ['e5', 'e8'],
      highlightSquares: ['h8'],
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_Qe7,
      text: "Qe7 blocks the check — but nothing can save the rook.",
      autoAdvance: 1500,
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_Qxh8,
      text: "Qxh8. You sacrificed a knight but won a rook — that's a huge trade. And Black's king is still stuck in the center. All because of f6.",
      highlightSquares: ['h8', 'e7'],
    },

    // ═══════════════════════════════════════════
    // RECALL — Play the whole sequence
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.punish_after_f6,
      text: "Your turn. Black just played f6 — punish it.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_f6,
      correctMove: 'Nxe5',
      prompt: 'Your move.',
      hint: 'Nxe5.',
      correctFeedback: 'Nxe5.',
      wrongFeedback: 'Nxe5.',
    },
    { type: 'instruction', fen: FEN.punish_after_fxe5, text: 'fxe5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_fxe5,
      correctMove: 'Qh5+',
      prompt: 'Your move.',
      hint: 'Qh5+.',
      correctFeedback: 'Qh5+.',
      wrongFeedback: 'Qh5+.',
    },
    { type: 'instruction', fen: FEN.punish_after_g6, text: 'g6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_g6,
      correctMove: 'Qxe5+',
      prompt: 'Your move.',
      hint: 'Qxe5+.',
      correctFeedback: 'Qxe5+.',
      wrongFeedback: 'Qxe5+.',
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LEVEL 1 TEST: Play the full main line + handle deviations
// No teaching. No highlights. Just recall.
// ═══════════════════════════════════════════════════════════

export const RL_TEST_1: OpeningLesson = {
  id: 'rl-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // PART 1: MAIN LINE RECALL (9 White moves)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Time to prove you know the Ruy Lopez. Play the full main line from memory.",
    },

    // --- 1. e4 ---
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: "This is a test. I can't help you.",
      correctFeedback: 'e4!',
      wrongFeedback: 'Not quite. Try again.',
    },
    { type: 'instruction', fen: FEN.after_e5, text: '1...e5', autoAdvance: 800 },

    // --- 2. Nf3 ---
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Keep going.',
      hint: "Baby bird, you have to fly on your own.",
      correctFeedback: 'Nf3!',
      wrongFeedback: 'Not that one.',
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: '2...Nc6', autoAdvance: 800 },

    // --- 3. Bb5 ---
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bb5',
      prompt: 'You know this one.',
      hint: "I believe in you, but I can't help you.",
      correctFeedback: 'Bb5!',
      wrongFeedback: "That's not it.",
    },
    { type: 'instruction', fen: FEN.after_a6, text: '3...a6', autoAdvance: 800 },

    // --- 4. Ba4 ---
    {
      type: 'play-move',
      fen: FEN.after_a6,
      correctMove: 'Ba4',
      prompt: 'What now?',
      hint: "Nope. You studied this. Think.",
      correctFeedback: 'Ba4!',
      wrongFeedback: 'Try again.',
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: '4...Nf6', autoAdvance: 800 },

    // --- 5. O-O ---
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'O-O',
      prompt: 'Next.',
      hint: "The nest is behind you. Keep flying.",
      correctFeedback: 'O-O!',
      wrongFeedback: 'Nope.',
    },
    { type: 'instruction', fen: FEN.after_Be7, text: '5...Be7', autoAdvance: 800 },

    // --- 6. Re1 ---
    {
      type: 'play-move',
      fen: FEN.after_Be7,
      correctMove: 'Re1',
      prompt: 'Go.',
      hint: "Still a test. Still can't help.",
      correctFeedback: 'Re1!',
      wrongFeedback: 'Not that.',
    },
    { type: 'instruction', fen: FEN.after_b5, text: '6...b5', autoAdvance: 800 },

    // --- 7. Bb3 ---
    {
      type: 'play-move',
      fen: FEN.after_b5,
      correctMove: 'Bb3',
      prompt: 'Your move.',
      hint: "Wings growing yet?",
      correctFeedback: 'Bb3!',
      wrongFeedback: 'Try again.',
    },
    { type: 'instruction', fen: FEN.after_d6, text: '7...d6', autoAdvance: 800 },

    // --- 8. c3 ---
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'c3',
      prompt: 'Almost there.',
      hint: "You're so close. I'm rooting for you. But I can't help.",
      correctFeedback: 'c3!',
      wrongFeedback: 'Not quite.',
    },
    { type: 'instruction', fen: FEN.after_OO_b, text: '8...O-O', autoAdvance: 800 },

    // --- 9. h3 ---
    {
      type: 'play-move',
      fen: FEN.after_OO_b,
      correctMove: 'h3',
      prompt: 'Last one.',
      hint: "I literally cannot give you hints. It's a test.",
      correctFeedback: "h3! The full Closed Ruy Lopez. You nailed it.",
      wrongFeedback: 'One more try.',
    },

    // ═══════════════════════════════════════════
    // PART 2: DEVIATION HANDLING
    // ═══════════════════════════════════════════

    // --- Deviation 1: After Re1, Black plays d5? (premature) ---
    {
      type: 'instruction',
      fen: FEN.after_Re1,
      text: "Main line complete. Now — what if Black goes off-script?",
    },
    {
      type: 'instruction',
      fen: FEN.punish3_after_d5_premature,
      text: "After Re1, Black pushes d5 too early. Punish it.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish3_after_d5_premature,
      correctMove: 'exd5',
      prompt: 'They blundered. Find it.',
      hint: "Time to leave the nest.",
      correctFeedback: 'exd5!',
      wrongFeedback: 'Look at what they just pushed.',
    },
    { type: 'instruction', fen: FEN.punish3_after_Nxd5, text: '7...Nxd5', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish3_after_Nxd5,
      correctMove: 'Nxe5',
      prompt: 'Finish the punishment.',
      hint: "Something is undefended. You got this.",
      correctFeedback: "Nxe5! The pin wins a clean pawn.",
      wrongFeedback: "Something's hanging.",
    },

    // --- Deviation 2: Berlin — Black plays d6? instead of Nxe4 ---
    {
      type: 'instruction',
      fen: FEN.berlin_after_OO,
      text: "New scenario. Berlin Defense — Black plays the passive d6 instead of grabbing e4.",
    },
    {
      type: 'instruction',
      fen: FEN.berlin1_punish_d6,
      text: "Black played d6. Too slow.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.berlin1_punish_d6,
      correctMove: 'd4',
      prompt: 'Make them regret it.',
      hint: "They gave you a free move. Use it.",
      correctFeedback: 'd4!',
      wrongFeedback: 'Think bigger.',
    },
    { type: 'instruction', fen: FEN.berlin1_punish_exd4, text: '5...exd4', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.berlin1_punish_exd4,
      correctMove: 'Nxd4',
      prompt: 'Clean it up.',
      hint: "Baby bird has landed. Just take it.",
      correctFeedback: "Nxd4! Dominant center, open lines. You passed the test.",
      wrongFeedback: 'Recapture.',
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// ALL LESSONS (for lookup)
// ═══════════════════════════════════════════════════════════

const RUY_LOPEZ_LESSONS: Record<string, OpeningLesson> = {
  'rl-1': RL_LESSON_1,
  'rl-2': RL_LESSON_2,
  'rl-3': RL_LESSON_3,
  'rl-4': RL_LESSON_4,
  'rl-open-1': RL_OPEN_1,
  'rl-punish-f6': RL_PUNISH_F6,
  'rl-exchange-1': RL_EXCHANGE_1,
  'rl-exchange-2': RL_EXCHANGE_2,
  'rl-berlin-1': RL_BERLIN_1,
  'rl-berlin-2': RL_BERLIN_2,
  'rl-marshall-1': RL_MARSHALL_1,
  'rl-test-1': RL_TEST_1,
}

export function getRuyLopezLesson(id: string): OpeningLesson | undefined {
  return RUY_LOPEZ_LESSONS[id]
}
