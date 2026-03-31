/**
 * Honcho SDK — Memory layer for personalized Rookie commentary.
 *
 * Two peers per game:
 *   - User peer (observed) — Honcho models their chess behavior
 *   - Rookie peer (not observed) — deterministic, no modeling needed
 *
 * @see CHE-198 https://linear.app/chesspathapp/issue/CHE-198
 */

import { Honcho } from '@honcho-ai/sdk';
import {
  EMPTY_HONCHO_SUMMARY,
  type HonchoPlayerSummary,
} from '@/lib/rookie-memory';

// ════════════════════════════════
// CLIENT
// ════════════════════════════════

let _honcho: Honcho | null = null;
let _workspaceConfigured = false;

function getHoncho(): Honcho {
  if (!_honcho) {
    _honcho = new Honcho({
      workspaceId: 'chess-path',
      apiKey: process.env.HONCHO_API_KEY,
    });
  }
  return _honcho;
}

/**
 * Ensure workspace-level config is set (once per cold start).
 * Reasoning must be enabled at the workspace level for conclusions to form.
 */
async function ensureWorkspaceConfig() {
  if (_workspaceConfigured) return;
  const honcho = getHoncho();
  await honcho.setConfiguration({
    reasoning: { enabled: true },
    peerCard: { create: true, use: true },
    dream: { enabled: true },
  });
  _workspaceConfigured = true;
}

// ════════════════════════════════
// PEERS
// ════════════════════════════════

/**
 * Get or create the user's peer (observed by Honcho).
 * Peer ID = Supabase user ID for stability.
 */
export async function getUserPeer(userId: string) {
  return getHoncho().peer(userId);
}

/**
 * Get the Rookie peer (not observed — she's deterministic).
 */
export async function getRookiePeer() {
  return getHoncho().peer('rookie');
}

// ════════════════════════════════
// SESSIONS
// ════════════════════════════════

// Cache initialized sessions so we don't re-add peers on every log call
const _sessionCache = new Map<string, ReturnType<typeof _initSession>>();

async function _initSession(gameId: string, userId: string) {
  await ensureWorkspaceConfig();

  const honcho = getHoncho();
  const session = await honcho.session(gameId);
  const user = await getUserPeer(userId);
  const rookie = await getRookiePeer();

  await session.addPeers([user, rookie]);

  // User is observed — Honcho models their chess behavior
  await session.setPeerConfiguration(user, { observeMe: true });
  // Rookie is not observed — she's deterministic
  await session.setPeerConfiguration('rookie', { observeMe: false });

  return { session, user, rookie };
}

/**
 * Get or create a Honcho session for a game.
 * Caches session setup so repeated calls (e.g. per-message logging) don't
 * re-add peers or re-set config.
 */
export async function createHonchoGameSession(gameId: string, userId: string) {
  const cacheKey = `${gameId}:${userId}`;
  let cached = _sessionCache.get(cacheKey);
  if (!cached) {
    cached = _initSession(gameId, userId);
    _sessionCache.set(cacheKey, cached);
  }
  return cached;
}

// ════════════════════════════════
// PEER CARD (seed on first game)
// ════════════════════════════════

/**
 * Seed the user's Peer Card with initial grounding context.
 * Call once on signup or first game — gives Rookie something to work with
 * before Honcho has enough data (~3-4 games) to generate its own summaries.
 */
export async function seedPeerCard(
  userId: string,
  profile: {
    estimatedElo?: number;
    colorPreference?: string;
    experience?: string;
  },
) {
  await ensureWorkspaceConfig();
  const user = await getUserPeer(userId);
  const card: string[] = [];

  if (profile.estimatedElo) card.push(`Estimated ELO: ${profile.estimatedElo}`);
  if (profile.colorPreference) card.push(`Prefers playing: ${profile.colorPreference}`);
  if (profile.experience) card.push(`Experience level: ${profile.experience}`);

  if (card.length > 0) {
    await user.setCard(card);
  }
}

// ════════════════════════════════
// HELPERS
// ════════════════════════════════

/**
 * Log a message to a Honcho session (fire-and-forget).
 * Never awaited in the game trigger path.
 */
export function logToHoncho(
  session: Awaited<ReturnType<typeof createHonchoGameSession>>['session'],
  peer: Awaited<ReturnType<typeof createHonchoGameSession>>['user'],
  message: string,
) {
  session.addMessages([peer.message(message)]).catch((err) => {
    console.error('Honcho log failed:', err);
  });
}

/**
 * Trigger a Honcho dream to consolidate observations into conclusions.
 * Call at end-of-game so Honcho processes everything from the session.
 */
export async function triggerDream(userId: string) {
  try {
    await ensureWorkspaceConfig();
    const honcho = getHoncho();
    const user = await getUserPeer(userId);
    await honcho.scheduleDream({ observer: user });
  } catch (err) {
    console.error('Honcho dream scheduling failed:', err);
  }
}

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function parseHonchoSummary(response: string): HonchoPlayerSummary | null {
  const trimmed = response.trim();
  if (trimmed.length < 20) return null;

  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    return {
      ...EMPTY_HONCHO_SUMMARY,
      raw: trimmed,
    };
  }

  try {
    const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as Record<string, unknown>;
    const summary: HonchoPlayerSummary = {
      raw: trimmed,
      profile: sanitizeStringArray(parsed.profile),
      recentPatterns: sanitizeStringArray(parsed.recentPatterns),
      openings: sanitizeStringArray(parsed.openings),
      strengths: sanitizeStringArray(parsed.strengths),
      weaknesses: sanitizeStringArray(parsed.weaknesses),
    };

    const hasStructuredData = Object.values(summary).some((value) => Array.isArray(value) && value.length > 0);
    return hasStructuredData ? summary : { ...EMPTY_HONCHO_SUMMARY, raw: trimmed };
  } catch {
    return {
      ...EMPTY_HONCHO_SUMMARY,
      raw: trimmed,
    };
  }
}

/**
 * Query what Honcho knows about a player for Rookie's context.
 * Returns a brief player summary or null if insufficient data.
 */
export async function getPlayerContext(userId: string): Promise<HonchoPlayerSummary | null> {
  try {
    await ensureWorkspaceConfig();
    const user = await getUserPeer(userId);
    const response = await user.chat(
      `Summarize what you know about this chess player as JSON.

Return exactly one JSON object with these keys:
- "profile": stable traits or recurring identity facts
- "recentPatterns": things they have been doing lately
- "openings": openings or opening families they play or face often
- "strengths": things they tend to do well
- "weaknesses": things they tend to struggle with

Rules:
- Each key must map to an array of short strings.
- Include concrete facts only. No commentary, no prose outside JSON.
- Use empty arrays when unknown.
- If you only know one fact, still return the JSON object with that fact in the best bucket.
- Do not say you lack information.`,
      { reasoningLevel: 'low' },
    );
    if (!response || typeof response !== 'string' || response.length < 20) {
      return null;
    }
    if (response.toLowerCase().includes('don\'t have enough') || response.toLowerCase().includes('no information')) {
      return null;
    }
    return parseHonchoSummary(response);
  } catch (err) {
    console.error('Honcho player context failed:', err);
    return null;
  }
}

/**
 * Get the player's full representation via session.context().
 * This is the broad, open-ended call — returns summaries + conclusions + peer card,
 * formatted and ready to inject into a prompt. Use this for system prompt context.
 *
 * peer.chat() = targeted question ("what happened last game?")
 * session.context() = broad context dump ("tell me everything about this player")
 */
export async function getPlayerRepresentation(userId: string): Promise<string | null> {
  try {
    await ensureWorkspaceConfig();
    const honcho = getHoncho();
    const user = await getUserPeer(userId);

    // Get the user's most recent session to query context from
    const sessions = await user.sessions();
    const items = (sessions as unknown as { _data?: { items?: Array<{ id: string }> } })?._data?.items;
    if (!items || items.length === 0) return null;

    // Use the most recent session
    const latestSessionId = items[items.length - 1].id;
    const session = await honcho.session(latestSessionId);

    const context = await session.context({
      tokens: 800,
      peerTarget: userId,
    });

    // Extract the peer representation if available
    const rep = (context as { peerRepresentation?: string }).peerRepresentation;
    const card = (context as { peerCard?: string[] }).peerCard;

    const parts: string[] = [];
    if (rep && typeof rep === 'string' && rep.length > 10) {
      parts.push(rep);
    }
    if (card && Array.isArray(card) && card.length > 0) {
      parts.push('Player card: ' + card.join('. '));
    }

    return parts.length > 0 ? parts.join('\n\n') : null;
  } catch (err) {
    console.error('Honcho representation failed:', err);
    return null;
  }
}

/**
 * Ask Honcho specifically about the player's most recent game.
 * Returns a short narrative summary or null if no history.
 */
export async function getLastGameSummary(userId: string): Promise<string | null> {
  try {
    const user = await getUserPeer(userId);
    const response = await user.chat(
      `What happened in this player's most recent chess game? Include: the opening they played, the result (win/loss/draw), their accuracy, and any notable mistakes or brilliant moves. Keep it to 2-3 sentences. If you have no game history for this player, respond with exactly "no history".`,
      { reasoningLevel: 'low' },
    );
    if (
      !response ||
      typeof response !== 'string' ||
      response.length < 20 ||
      response.toLowerCase().includes('no history') ||
      response.toLowerCase().includes('no game') ||
      response.toLowerCase().includes('don\'t have')
    ) {
      return null;
    }
    return response.trim();
  } catch (err) {
    console.error('Honcho last game summary failed:', err);
    return null;
  }
}
