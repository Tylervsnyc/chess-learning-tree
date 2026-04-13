/**
 * Maia3 tensor encoding — converts FEN positions to ONNX input format.
 * Ported from maia-platform-frontend (MIT license).
 */

import { Chess } from 'chess.js';
import allMovesMaia3 from './data/all_moves_maia3.json';
import allMovesMaia3Reversed from './data/all_moves_maia3_reversed.json';

const moveToIndex = allMovesMaia3 as Record<string, number>;
const indexToMove = allMovesMaia3Reversed as Record<string, string>;

export const MOVE_SPACE_SIZE = Object.keys(moveToIndex).length; // 4352

// ── FEN mirroring (always encode from white's perspective) ──────────────────

function mirrorSquare(square: string): string {
  const file = square.charAt(0);
  const rank = (9 - parseInt(square.charAt(1))).toString();
  return file + rank;
}

export function mirrorMove(moveUci: string): string {
  const from = mirrorSquare(moveUci.substring(0, 2));
  const to = mirrorSquare(moveUci.substring(2, 4));
  const promo = moveUci.length > 4 ? moveUci.substring(4) : '';
  return from + to + promo;
}

function swapColorsInRank(rank: string): string {
  let out = '';
  for (const ch of rank) {
    if (/[A-Z]/.test(ch)) out += ch.toLowerCase();
    else if (/[a-z]/.test(ch)) out += ch.toUpperCase();
    else out += ch;
  }
  return out;
}

function swapCastlingRights(castling: string): string {
  if (castling === '-') return '-';
  const rights = new Set(castling.split(''));
  let out = '';
  if (rights.has('k')) out += 'K';
  if (rights.has('q')) out += 'Q';
  if (rights.has('K')) out += 'k';
  if (rights.has('Q')) out += 'q';
  return out || '-';
}

function mirrorFEN(fen: string): string {
  const [position, color, castling, ep, half, full] = fen.split(' ');
  const mirrored = position.split('/').reverse().map(swapColorsInRank).join('/');
  const mirroredColor = color === 'w' ? 'b' : 'w';
  const mirroredEp = ep !== '-' ? mirrorSquare(ep) : '-';
  return `${mirrored} ${mirroredColor} ${swapCastlingRights(castling)} ${mirroredEp} ${half} ${full}`;
}

// ── Board → tensor ──────────────────────────────────────────────────────────

const PIECE_TYPES = ['P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k'];

function boardToMaia3Tokens(fen: string): Float32Array {
  const piecePlacement = fen.split(' ')[0];
  const tensor = new Float32Array(64 * 12);
  const rows = piecePlacement.split('/');

  for (let rank = 0; rank < 8; rank++) {
    const row = 7 - rank;
    let file = 0;
    for (const ch of rows[rank]) {
      if (isNaN(parseInt(ch))) {
        const pieceIdx = PIECE_TYPES.indexOf(ch);
        if (pieceIdx >= 0) {
          tensor[(row * 8 + file) * 12 + pieceIdx] = 1.0;
        }
        file++;
      } else {
        file += parseInt(ch);
      }
    }
  }
  return tensor;
}

// ── Preprocessing ───────────────────────────────────────────────────────────

export function preprocessMaia3(fen: string): {
  boardTokens: Float32Array;
  legalMoves: Float32Array;
} {
  let board = new Chess(fen);
  if (fen.split(' ')[1] === 'b') {
    board = new Chess(mirrorFEN(board.fen()));
  }

  const boardTokens = boardToMaia3Tokens(board.fen());
  const legalMoves = new Float32Array(MOVE_SPACE_SIZE);

  for (const move of board.moves({ verbose: true })) {
    const promo = move.promotion || '';
    const idx = moveToIndex[move.from + move.to + promo];
    if (idx !== undefined) legalMoves[idx] = 1.0;
  }

  return { boardTokens, legalMoves };
}

// ── Output processing ───────────────────────────────────────────────────────

export function processOutputsMaia3(
  fen: string,
  logitsMove: Float32Array,
  logitsValue: Float32Array,
  legalMoves: Float32Array,
): { policy: Record<string, number>; winProb: number } {
  const isBlack = fen.split(' ')[1] === 'b';

  // Win probability from LDW logits
  const maxWdl = Math.max(logitsValue[0], logitsValue[1], logitsValue[2]);
  const expL = Math.exp(logitsValue[0] - maxWdl);
  const expD = Math.exp(logitsValue[1] - maxWdl);
  const expW = Math.exp(logitsValue[2] - maxWdl);
  const sumExp = expL + expD + expW;
  let winProb = (expW + 0.5 * expD) / sumExp;
  if (isBlack) winProb = 1 - winProb;
  winProb = Math.round(winProb * 10000) / 10000;

  // Policy: softmax over legal moves only
  const legalIndices: number[] = [];
  for (let i = 0; i < legalMoves.length; i++) {
    if (legalMoves[i] > 0) legalIndices.push(i);
  }

  const legalLogits = legalIndices.map(i => logitsMove[i]);
  const maxLogit = Math.max(...legalLogits);
  const expLogits = legalLogits.map(l => Math.exp(l - maxLogit));
  const sumExpMoves = expLogits.reduce((a, b) => a + b, 0);

  const policy: Record<string, number> = {};
  for (let i = 0; i < legalIndices.length; i++) {
    let move = indexToMove[String(legalIndices[i])];
    if (isBlack) move = mirrorMove(move);
    policy[move] = expLogits[i] / sumExpMoves;
  }

  // Sort by probability descending
  const sorted = Object.entries(policy).sort((a, b) => b[1] - a[1]);
  const result: Record<string, number> = {};
  for (const [m, p] of sorted) result[m] = p;

  return { policy: result, winProb };
}
