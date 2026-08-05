/**
 * lib/rookie/level-client.ts
 *
 * THE client-side read for "how strong should Rookie play". Every surface goes
 * through here — /play, the workout's Fight Rounds, /box/bout — so two screens
 * can never show a different Rookie, the same way lib/streak-client.ts is the
 * one read for the streak.
 *
 * Logged in  → the server owns it (/api/rookie/level, derived from the Rookie
 *              rating). localStorage is only a cache so the first paint isn't
 *              blank and so a dropped connection doesn't reset anyone.
 * Logged out → localStorage alone. It merges up the moment they log in and the
 *              server's answer arrives.
 *
 * The server is always the authority when it answers. A cached value is never
 * written back over a fresher server value.
 */

import { matchLevel } from './matchmaking';

const LEVEL_KEY = 'rookie-level';

export interface RookieLevelState {
  level: number;
  /** Present only for logged-in players; null when we're on the local cache. */
  rating: number | null;
  /** True while the rating is still finding its feet (few games). */
  provisional: boolean;
  /** Where the level came from — 'server' is authoritative. */
  source: 'server' | 'cache';
}

let cached: RookieLevelState | null = null;
let inflight: Promise<RookieLevelState> | null = null;

function readLocalLevel(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const raw = parseInt(window.localStorage.getItem(LEVEL_KEY) || '1', 10);
    return Number.isFinite(raw) ? Math.max(1, Math.min(10, raw)) : 1;
  } catch {
    return 1;
  }
}

function writeLocalLevel(level: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LEVEL_KEY, String(level));
  } catch {
    /* private mode — the server copy still holds for logged-in players */
  }
}

/** The cached level with no network call — for a first paint that can't wait. */
export function peekRookieLevel(): RookieLevelState {
  if (cached) return cached;
  return { level: readLocalLevel(), rating: null, provisional: true, source: 'cache' };
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
        const body = (await res.json()) as {
          level?: number;
          rating?: number;
          provisional?: boolean;
        };
        if (typeof body.level === 'number') {
          const state: RookieLevelState = {
            level: Math.max(1, Math.min(10, body.level)),
            rating: typeof body.rating === 'number' ? body.rating : null,
            provisional: body.provisional !== false,
            source: 'server',
          };
          writeLocalLevel(state.level);
          cached = state;
          return state;
        }
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
  /** Which way the level moved as a result of this game. */
  change: 'up' | 'down' | 'same';
}

/**
 * Record a finished game and get the new level back.
 *
 * A loss lowers the rating, which can lower the level — that is the feature,
 * not a failure state. Logged-out players get a 'same' with their cached level
 * (nothing to record without an account).
 */
export async function recordGameResult(
  level: number,
  result: 'win' | 'loss' | 'draw',
): Promise<LevelUpdate> {
  const before = peekRookieLevel();
  try {
    const res = await fetch('/api/rookie/level', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, result }),
    });
    if (res.ok) {
      const body = (await res.json()) as {
        level?: number;
        rating?: number;
        provisional?: boolean;
        change?: 'up' | 'down' | 'same';
      };
      if (typeof body.level === 'number') {
        const state: RookieLevelState = {
          level: Math.max(1, Math.min(10, body.level)),
          rating: typeof body.rating === 'number' ? body.rating : null,
          provisional: body.provisional !== false,
          source: 'server',
        };
        writeLocalLevel(state.level);
        cached = state;
        return { ...state, change: body.change ?? 'same' };
      }
    }
  } catch {
    /* offline — fall through */
  }
  return { ...before, change: 'same' };
}

/**
 * How far the rating sits between the current level's strength and the next
 * one's, 0..1 — the sub-level fill on the progress bar. Replaces "wins out of
 * 3", which measured a counter rather than the player.
 */
export function levelProgress(state: RookieLevelState): number {
  if (state.rating === null) return 0;
  const here = matchLevel(state.rating).snapError;
  // snapError is (level elo - target). Negative means the player has outgrown
  // this rung and is heading for the next one.
  const span = 200; // nominal gap between rungs
  return Math.max(0, Math.min(1, -here / span));
}
