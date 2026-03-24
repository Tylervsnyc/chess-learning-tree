export type Beat =
  | 'opening'
  | 'early_game'
  | 'turning_point'
  | 'late_game'
  | 'game_end'
  | 'post_game';

export type EvalMood = 'winning' | 'losing' | 'even' | 'desperate';

export interface BeatState {
  currentBeat: Beat;
  evalMood: EvalMood;
  turningPointFired: boolean;
  biggestSwing: number;
  biggestSwingMove: number;
  moveCount: number;
}

export interface BeatInput {
  moveNumber: number;
  rookieWinPercent: number; // 0-100, from Rookie's perspective
  prevRookieWinPercent?: number;
  isGameOver: boolean;
  isPostGame: boolean;
  piecesRemaining: number; // total pieces on board
}

/** Create initial beat state */
export function createBeatState(): BeatState {
  return {
    currentBeat: 'opening',
    evalMood: 'even',
    turningPointFired: false,
    biggestSwing: 0,
    biggestSwingMove: 0,
    moveCount: 0,
  };
}

/** Map rookieWinPercent to an EvalMood */
export function getEvalMood(rookieWinPercent: number): EvalMood {
  if (rookieWinPercent >= 60) return 'winning';
  if (rookieWinPercent >= 40) return 'even';
  if (rookieWinPercent >= 20) return 'losing';
  return 'desperate';
}

const TURNING_POINT_MIN_MOVE = 4;
const TURNING_POINT_THRESHOLD = 15;
const LATE_GAME_MOVE = 20;
const LATE_GAME_PIECES = 16;

/** Determine which beat should be current based on move count / pieces (ignoring turning_point) */
function getBaselineBeat(moveNumber: number, piecesRemaining: number): Beat {
  if (moveNumber <= 1) return 'opening';
  if (moveNumber >= LATE_GAME_MOVE || piecesRemaining < LATE_GAME_PIECES) return 'late_game';
  return 'early_game';
}

/** Update beat state after a move. Returns the new state + whether the beat changed. */
export function updateBeat(
  state: BeatState,
  input: BeatInput
): { state: BeatState; beatChanged: boolean; newBeat: Beat | null } {
  const { moveNumber, rookieWinPercent, prevRookieWinPercent, isGameOver, isPostGame, piecesRemaining } = input;

  const evalMood = getEvalMood(rookieWinPercent);
  const prevBeat = state.currentBeat;

  // Post-game always wins
  if (isPostGame) {
    const next: BeatState = {
      ...state,
      currentBeat: 'post_game',
      evalMood,
      moveCount: moveNumber,
    };
    const changed = prevBeat !== 'post_game';
    return { state: next, beatChanged: changed, newBeat: changed ? 'post_game' : null };
  }

  // Game end always wins
  if (isGameOver) {
    const next: BeatState = {
      ...state,
      currentBeat: 'game_end',
      evalMood,
      moveCount: moveNumber,
    };
    const changed = prevBeat !== 'game_end';
    return { state: next, beatChanged: changed, newBeat: changed ? 'game_end' : null };
  }

  // Track swing
  let turningPointFired = state.turningPointFired;
  let biggestSwing = state.biggestSwing;
  let biggestSwingMove = state.biggestSwingMove;
  let fireTurningPoint = false;

  if (prevRookieWinPercent !== undefined) {
    const swing = Math.abs(rookieWinPercent - prevRookieWinPercent);
    if (swing > biggestSwing) {
      biggestSwing = swing;
      biggestSwingMove = moveNumber;
    }
    // Fire turning_point if threshold met, past min move, and hasn't fired yet
    if (
      !turningPointFired &&
      swing > TURNING_POINT_THRESHOLD &&
      swing >= biggestSwing &&
      moveNumber > TURNING_POINT_MIN_MOVE
    ) {
      fireTurningPoint = true;
      turningPointFired = true;
    }
  }

  // Determine current beat
  let currentBeat: Beat;
  if (fireTurningPoint) {
    currentBeat = 'turning_point';
  } else {
    currentBeat = getBaselineBeat(moveNumber, piecesRemaining);
  }

  const next: BeatState = {
    currentBeat,
    evalMood,
    turningPointFired,
    biggestSwing,
    biggestSwingMove,
    moveCount: moveNumber,
  };

  const changed = prevBeat !== currentBeat;
  return { state: next, beatChanged: changed, newBeat: changed ? currentBeat : null };
}
