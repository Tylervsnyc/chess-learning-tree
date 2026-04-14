/**
 * Session breadcrumbs — lightweight context for "what did the user just do?"
 * Written by /daily-challenge and /lesson pages, read by /play landing.
 * Uses sessionStorage so it resets on tab close.
 */

const KEY = 'chess-path-breadcrumb';

export type SessionBreadcrumb =
  | { type: 'daily'; score: number; total: number }
  | { type: 'lesson'; lessonName: string; lessonId: string; score?: number; total?: number }
  | { type: 'opening'; lessonName: string; openingName: string; lessonId: string; score?: number; total?: number };

export function writeBreadcrumb(crumb: SessionBreadcrumb): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...crumb, ts: Date.now() }));
  } catch {}
}

/** Read and consume the breadcrumb (one-shot). Returns null if stale (>30 min) or missing. */
export function consumeBreadcrumb(): SessionBreadcrumb | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw);
    // Stale after 30 minutes
    if (Date.now() - parsed.ts > 30 * 60 * 1000) return null;
    return parsed as SessionBreadcrumb;
  } catch {
    return null;
  }
}
