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

function getHoncho(): Honcho {
  if (!_honcho) {
    _honcho = new Honcho({
      workspaceId: 'chess-path',
      apiKey: process.env.HONCHO_API_KEY,
    });
  }
  return _honcho;
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

/**
 * Create a Honcho session for a game.
 * Returns session + both peers for message logging.
 */
export async function createHonchoGameSession(gameId: string, userId: string) {
  const honcho = getHoncho();
  const session = await honcho.session(gameId);
  const user = await getUserPeer(userId);
  const rookie = await getRookiePeer();

  await session.addPeers([user, rookie]);

  // Rookie is not observed — Honcho doesn't need to model her
  await session.setPeerConfiguration('rookie', { observeMe: false });

  return { session, user, rookie };
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
