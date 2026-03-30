/**
 * Rookie OS — Shared types for the 6-layer character engine.
 *
 * This is the single source of truth for Rookie's personality system.
 * All layers import from here.
 */

// ════════════════════════════════
// LAYER 1: CHARACTER CARD (SillyTavern V2)
// ════════════════════════════════

export interface CharacterCardV2 {
  /** Anti-hallucination rules + role definition. Position: FIRST in prompt. */
  system_prompt: string;

  /** Backstory, quirks, values. 250-400 tokens. Position: after system prompt. */
  description: string;

  /** Comma-separated trait summary. 30-80 tokens. Position: after description. */
  personality: string;

  /** Dynamic template filled per-game by Layer 2. Position: after personality. */
  scenario: string;

  /** 15-20 example dialogues showing voice range. Position: before chat history. */
  mes_example: string;

  /** Default game-opening message. */
  first_mes: string;

  /** 5+ alternate openers rotated per game. */
  alternate_greetings: string[];

  /** Dynamically built per-move by Layer 5. Position: LAST (highest impact). */
  post_history_instructions: string;
}

// ════════════════════════════════
// MOOD (cross-cutting state from Layer 2)
// ════════════════════════════════

export type RookieMood =
  | 'neutral'
  | 'happy'
  | 'nervous'
  | 'angry'
  | 'smug'
  | 'surprised'
  | 'embarrassed'
  | 'excited'
  | 'defeated'
  | 'scheming'
  | 'panicking'
  | 'zen';

// ════════════════════════════════
// LAYER 2: CHESS BRIEFING (output of Chess Intelligence Agent)
// ════════════════════════════════

export interface ChessBriefing {
  /** Plain-English position summary for the LLM. */
  positionSummary: string;

  /** Current mood computed from eval + swing detection. */
  mood: RookieMood;

  /** Whether mood changed from the previous move. */
  moodChanged: boolean;

  /** Previous mood (for transition context). */
  previousMood: RookieMood | null;

  /** Is the position still in opening book? */
  inBook: boolean;

  /** Opening name if detected. */
  openingName: string | null;

  /** Is this a turning point? (drives Decision Gate) */
  isTurningPoint: boolean;

  /** Why it's a turning point, in plain English. */
  turningPointReason: string | null;

  /** Game phase. */
  phase: 'opening' | 'middlegame' | 'endgame';

  /** Who just moved. */
  movedBy: 'player' | 'rookie';

  /** What piece moved (lowercase). */
  movedPiece: string | null;

  /** Game events detected this move. */
  events: GameEvent[];

  /** Move number. */
  moveNumber: number;

  /** Player's name. */
  playerName: string;

  /** Player's color. */
  playerColor: 'white' | 'black';
}

export type GameEvent =
  | 'capture'
  | 'check'
  | 'checkmate'
  | 'castle'
  | 'blunder'
  | 'great_move'
  | 'stalemate'
  | 'resign'
  | 'promotion'
  | 'fork'
  | 'pin'
  | 'skewer'
  | 'capture_sequence'
  | 'mood_change';

// ════════════════════════════════
// LAYER 3: NARRATIVE STATE
// ════════════════════════════════

export interface NarrativeState {
  /** Current story chapter. */
  chapter: 'opening_moves' | 'development' | 'tension' | 'crisis' | 'resolution';

  /** Key moments worth referencing later. */
  callbacks: NarrativeCallback[];

  /** Running emotional arc summary. */
  emotionalArc: string;

  /** Number of games played this session. */
  gamesThisSession: number;
}

export interface NarrativeCallback {
  moveNumber: number;
  description: string;
  mood: RookieMood;
  referenced: boolean;
}

// ════════════════════════════════
// LAYER 6: DECISION GATE
// ════════════════════════════════

export type ResponseRoute =
  | { type: 'silence' }
  | { type: 'authored_quip'; quipId: string; text: string }
  | { type: 'llm_narrative'; briefing: ChessBriefing; narrativeState: NarrativeState };
