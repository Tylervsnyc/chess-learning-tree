/**
 * lib/rookie/level-client.ts
 *
 * THE client-side read for "how strong should Rookie play". Every surface goes
 * through here — /play, the workout's Fight Rounds, /box/bout — so two screens
 * can never show a different Rookie, the same way lib/streak-client.ts is the
 * one read for the streak.
 *
 * WIN-COUNTER LADDER (restored 2026-08-31, Tyler's call — RULES.md §20b):
 * beat Rookie 3 times at your current level and she levels up. The level only
 * ever goes UP; losses and draws change nothing, and wins don't have to be
 * consecutive.
 *
 * Logged in  → the server owns it (/api/rookie/level, derived by replaying
 *              the user's win history). localStorage is only a cache so the
 *              first paint isn't blank and a dropped connection doesn't reset
 *              anyone.
 * Logged out → localStorage alone ('rookie-level' + 'rookie-level-wins', the
 *              original keys). The server's answer wins the moment they log
 *              in and it arrives.
 */

import {
  applyWin,
  maxLevel,
  WINS_TO_ADVANCE,
  type WinLadderState,
} from './win-ladder';

export { WINS_TO_ADVANCE };

const LEVEL_KEY = 'rookie-level';
const WINS_KEY = 'rookie-level-wins';

export interface RookieLevelState extends WinLadderState {
  /** Where the ladder came from — 'server' is authoritative. */
  source: 'server' | 'cache';
}

let cached: RookieLevelState | null = null;
let inflight: Promise<RookieLevelState> | null = null;

function clampLevel(level: number): number {
  return Math.max(1, Math.min(maxLevel(), level));
}

function clampWins(wins: number): number {
  return Math.max(0, Math.min(WINS_TO_ADVANCE - 1, wins));
}

function readLocal(): WinLadderState {
  if (typeof window === 'undefined') return { level: 1, winsAtLevel: 0 };
  try {
    const level = parseInt(window.localStorage.getItem(LEVEL_KEY) || '1', 10);
    const wins = parseInt(window.localStorage.getItem(WINS_KEY) || '0', 10);
    return {
      level: Number.isFinite(level) ? clampLevel(level) : 1,
      winsAtLevel: Number.isFinite(wins) ? clampWins(wins) : 0,
    };
  } catch {
    return { level: 1, winsAtLevel: 0 };
  }
}

function writeLocal(state: WinLadderState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LEVEL_KEY, String(state.level));
    window.localStorage.setItem(WINS_KEY, String(state.winsAtLevel));
  } catch {
    /* private mode — the server copy still holds for logged-in players */
  }
}

/** The cached ladder with no network call — for a first paint that can't wait. */
export function peekRookieLevel(): RookieLevelState {
  if (cached) return cached;
  return { ...readLocal(), source: 'cache' };
}

function stateFromBody(body: Record<string, unknown>): RookieLevelState | null {
  if (typeof body.level !== 'number') return null;
  const state: RookieLevelState = {
    level: clampLevel(body.level),
    winsAtLevel:
      typeof body.winsAtLevel === 'number' ? clampWins(body.winsAtLevel) : 0,
    source: 'server',
  };
  writeLocal(state);
  cached = state;
  return state;
}

/**
 * The level Rookie should play at. Asks the server when logged in; falls back
 * to the local cache on 401 (logged out) or any failure — a network blip must
 * never silently drop somebody back to Baby Mode.
 */
export async function getRookieLevel(opts: { fresh?: boolean } = {}): Promise<RookieLevelState> {
  if (cached && !opts.fresh) return cached;
  if (inflight) return inflight;

  inflight = (async (): Promise<RookieLevelState> => {
    try {
      const res = await fetch('/api/rookie/level');
      if (res.ok) {
        const state = stateFromBody((await res.json()) as Record<string, unknown>);
        if (state) return state;
      }
    } catch {
      /* offline — the cache below is the honest answer */
    }
    const fallback = peekRookieLevel();
    cached = fallback;
    return fallback;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export interface LevelUpdate extends RookieLevelState {
  /** 'up' when this game's win was the 3rd at the level. Never 'down'. */
  change: 'up' | 'same';
}

/**
 * Record a finished game and get the new ladder state back.
 *
 * Only a WIN moves the counter; a loss or draw changes nothing — no demotion,
 * no reset (Tyler, 2026-08-31). Logged-out players are counted locally in
 * localStorage, same rules.
 */
export async function recordGameResult(
  level: number,
  result: 'win' | 'loss' | 'draw',
): Promise<LevelUpdate> {
  try {
    const res = await fetch('/api/rookie/level', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, result }),
    });
    if (res.ok) {
      const body = (await res.json()) as Record<string, unknown>;
      const state = stateFromBody(body);
      if (state) {
        return { ...state, change: body.change === 'up' ? 'up' : 'same' };
      }
    }
  } catch {
    /* offline — fall through to the local ladder */
  }

  // Logged out (401) or offline: the localStorage ladder is the authority.
  const before = peekRookieLevel();
  if (result !== 'win') return { ...before, change: 'same' };
  const next: RookieLevelState = { ...applyWin(before), source: before.source };
  writeLocal(next);
  cached = next;
  return { ...next, change: next.level > before.level ? 'up' : 'same' };
}

/**
 * Wins banked toward the next level as a 0..1 fill — the sub-level fill on
 * the progress bar (winsAtLevel / WINS_TO_ADVANCE). Full at the level cap.
 */
export function levelProgress(state: RookieLevelState): number {
  if (state.level >= maxLevel()) return 1;
  return Math.max(0, Math.min(1, state.winsAtLevel / WINS_TO_ADVANCE));
}
