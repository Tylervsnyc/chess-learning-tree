// ELO Parser + Personalized Link Generator
// Parses ELO from free-text DMs/comments and maps to level-test URLs

const BASE_URL = 'https://chesspath.app';

type EloTier = 'beginner' | 'intermediate' | 'advancing' | 'advanced' | 'expert' | 'unknown';

type EloResult = {
  elo: number | null;
  tier: EloTier;
  link: string;
};

/**
 * Parse ELO rating from free text.
 * Handles: "1200", "~1200", "about 1.2k", "rated 800 on lichess", "my elo is 1200"
 */
export function parseElo(text: string): number | null {
  const normalized = text.toLowerCase().trim();

  // Match "1.2k", "1.5k", "~1.2k" etc
  const kMatch = normalized.match(/~?\s*(\d+\.?\d*)\s*k\b/);
  if (kMatch) {
    return Math.round(parseFloat(kMatch[1]) * 1000);
  }

  // Match plain numbers 100-3500 (reasonable ELO range)
  // Look for numbers preceded by common ELO-related words or standalone
  const patterns = [
    /(?:elo|rating|rated|rank|mmr|level)\s*(?:is|of|at|:)?\s*~?\s*(\d{3,4})\b/,
    /~?\s*(\d{3,4})\s*(?:elo|rating|rated|on\s+(?:chess\.?com|lichess|rapid|blitz|bullet))/,
    /\b(\d{3,4})\b/,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      const num = parseInt(match[1]);
      if (num >= 100 && num <= 3500) return num;
    }
  }

  return null;
}

/**
 * Map ELO to tier name (used for template selection)
 */
export function eloToTier(elo: number | null): EloTier {
  if (elo === null) return 'unknown';
  if (elo < 800) return 'beginner';
  if (elo < 1200) return 'intermediate';
  if (elo < 1400) return 'advancing';
  if (elo < 1600) return 'advanced';
  return 'expert';
}

/**
 * Map ELO to the appropriate level-test path
 */
function eloToPath(elo: number | null): string {
  if (elo === null || elo < 800) return '';
  if (elo < 1000) return '/level-test/1-2';
  if (elo < 1200) return '/level-test/2-3';
  if (elo < 1400) return '/level-test/3-4';
  if (elo < 1600) return '/level-test/4-5';
  return '/level-test/5-6';
}

type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
};

/**
 * Build a full personalized link with UTM params
 */
export function buildLink(
  elo: number | null,
  utm: UtmParams = {}
): string {
  const tier = eloToTier(elo);
  const path = eloToPath(elo);
  const url = new URL(path || '/', BASE_URL);

  url.searchParams.set('utm_source', utm.source || 'instagram');
  url.searchParams.set('utm_medium', utm.medium || 'social_dm');
  url.searchParams.set('utm_campaign', utm.campaign || 'elo_funnel');
  url.searchParams.set('utm_content', tier);

  return url.toString();
}

/**
 * Full pipeline: parse text → detect ELO → build personalized link
 */
export function mapEloToLink(
  text: string,
  utm?: UtmParams
): EloResult {
  const elo = parseElo(text);
  const tier = eloToTier(elo);
  const link = buildLink(elo, utm);
  return { elo, tier, link };
}
