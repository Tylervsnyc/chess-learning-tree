'use client';

/**
 * Native App Store rating prompt (2026-09-02, Tyler).
 *
 * ONE way to ask for a rating: `maybeRequestReview()` after a finished unit.
 * Wraps Apple's SKStoreReviewController via @capacitor-community/in-app-review.
 * We only *request*; iOS decides whether the sheet actually appears (max 3
 * prompts per user per year per app, never in TestFlight/simulator, never if
 * the user disabled ratings in Settings). The plugin is imported lazily so it
 * never ships to the web bundle.
 *
 * Our gate (per device, localStorage):
 *   - only inside the native shell (web = no-op)
 *   - only on the user's 2nd finished session or later
 *   - at most once every 30 days
 * Call it from completion screens ONLY, after the streak celebration — never
 * mid-activity.
 */
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { isNativeApp } from '@/lib/native-app';

const COUNT_KEY = 'cp:review:sessions';
const LAST_KEY = 'cp:review:last';
const MIN_SESSIONS = 2;
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

function readNum(key: string): number {
  try {
    return Number(localStorage.getItem(key) ?? 0) || 0;
  } catch {
    return 0;
  }
}

/** Count a finished session and, if the gate opens, ask iOS for the rating sheet. */
export async function maybeRequestReview(): Promise<boolean> {
  if (!FEATURE_FLAGS.NATIVE_REVIEW_PROMPT || !isNativeApp()) return false;

  const sessions = readNum(COUNT_KEY) + 1;
  try {
    localStorage.setItem(COUNT_KEY, String(sessions));
  } catch {
    /* private mode — still fine to continue */
  }
  if (sessions < MIN_SESSIONS) return false;
  if (Date.now() - readNum(LAST_KEY) < COOLDOWN_MS) return false;

  try {
    const { InAppReview } = await import('@capacitor-community/in-app-review');
    await InAppReview.requestReview();
    localStorage.setItem(LAST_KEY, String(Date.now()));
    return true;
  } catch {
    return false;
  }
}
