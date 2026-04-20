/**
 * Speech sanitization — single source of truth for {name} substitution
 * and template-leak prevention.
 *
 * Every Rookie-facing text should pass through `renderLine` (when a playerName
 * is known) or `stripLeakedPlaceholders` (as a final render-time safety net).
 */

const BAD_NAMES = new Set([
  '', 'null', 'undefined', 'friend', '{name}', 'nan', 'name',
]);

/**
 * Normalize an arbitrary profile display_name into a usable name, or null.
 * Rejects empty, whitespace-only, placeholder-shaped, or suspicious values.
 */
export function normalizePlayerName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (BAD_NAMES.has(trimmed.toLowerCase())) return null;
  if (/^\{.*\}$/.test(trimmed)) return null;
  if (/^[\s\p{P}]+$/u.test(trimmed)) return null;
  if (trimmed.length > 40) return null;
  return trimmed;
}

/**
 * Remove `{name}` from text when no name is available. Handles leading and
 * trailing punctuation (comma, period, bang, question, dash, ellipsis) so
 * removal never leaves orphaned punctuation like ". Noted." or "-- back".
 */
function stripNamePlaceholder(text: string): string {
  return text
    .replace(/[,.\-–—!?]?\s*\{name\}[,.\-–—!?]?\s*/g, ' ')
    .replace(/^[\s,.\-–—!?]+/, '')
    .replace(/([,.!?])\1+/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Catch-all sweep for any remaining `{whatever}` placeholder tokens.
 * Runs after specific substitutions as a final safety net — future-proofs
 * against `{opponent}`, `{piece}`, etc. that might slip past their handlers.
 */
export function stripLeakedPlaceholders(text: string): string {
  if (!text || !text.includes('{')) return text;
  return text
    // SillyTavern-style double-curly (e.g. {{user}}, {{char}})
    .replace(/\{\{[a-zA-Z_][a-zA-Z0-9_]*\}\}/g, '')
    // Single-curly placeholders (e.g. {name}, {piece})
    .replace(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g, '')
    .replace(/^[\s,.\-–—!?]+/, '')
    .replace(/([,.!?])\1+/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Render a line: substitute `{name}` when a valid name is provided,
 * otherwise strip it gracefully. Always runs a final sweep for any
 * other leaked placeholders.
 */
export function renderLine(text: string, playerName?: string | null): string {
  const name = normalizePlayerName(playerName);
  const afterName = name
    ? text.replace(/\{name\}/g, name)
    : stripNamePlaceholder(text);
  return stripLeakedPlaceholders(afterName);
}

/**
 * Dev-only leak detector. Logs and swallows — never throws. Returns input.
 */
export function assertNoTemplateLeak(text: string, where: string): string {
  if (
    process.env.NODE_ENV !== 'production' &&
    /\{[a-zA-Z_][a-zA-Z0-9_]*\}/.test(text)
  ) {
    console.error(`[template-leak] ${where}: "${text}"`);
  }
  return text;
}

/**
 * Belt-and-suspenders render: clean any stray placeholders before showing
 * text to the user, and log in dev if anything was cleaned.
 */
export function safeRenderText(text: string, where: string): string {
  const cleaned = stripLeakedPlaceholders(text);
  if (process.env.NODE_ENV !== 'production' && cleaned !== text) {
    console.error(`[template-leak] ${where} cleaned: "${text}" -> "${cleaned}"`);
  }
  return cleaned;
}
