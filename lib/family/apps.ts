/**
 * The product family — ONE source of truth for "the other apps".
 *
 * Chess Path (learn + play), Chess Boxing (fight + play) and Rookie's Revenge
 * (the daily game) are three ship targets on one account. Every cross-app
 * link in the codebase goes through here so a store id or web URL is changed
 * in exactly one place.
 *
 * Opening rules (One Family plan §1.1):
 *   - Inside a native shell (either iOS app) a tile ALWAYS opens the App Store
 *     page externally via `window.open(url, '_system')`. Never same-window
 *     navigate a WKWebView to apps.apple.com — that replaces the app's own
 *     page with Apple's and there is no way back. The store page shows "Open"
 *     when the app is already installed, so no installed-app detection or
 *     URL-scheme probing is needed (unreliable in WKWebView anyway).
 *   - On the web a tile opens the app's web home in a new tab.
 */
import { IS_CHESSBOXING_APP, IS_CHESSPATH_APP } from '@/lib/config/offline';
import { isNativeApp } from '@/lib/native-app';

export type FamilyAppId = 'chesspath' | 'chessboxing' | 'revenge';

export interface FamilyApp {
  id: FamilyAppId;
  name: string;
  /** App Store page. null = not on the store yet (opens webUrl instead). */
  storeUrl: string | null;
  /** Web home for this app. */
  webUrl: string;
}

export const FAMILY_APPS: Record<FamilyAppId, FamilyApp> = {
  chesspath: {
    id: 'chesspath',
    name: 'Chess Path',
    storeUrl: 'https://apps.apple.com/us/app/id6806865294',
    webUrl: 'https://chesspath.app/play',
  },
  chessboxing: {
    id: 'chessboxing',
    name: 'Chess Boxing',
    storeUrl: 'https://apps.apple.com/us/app/chess-boxing-by-chess-path/id6796812770',
    webUrl: 'https://chesspath.app/box',
  },
  revenge: {
    id: 'revenge',
    name: "Rookie's Revenge",
    storeUrl: null,
    webUrl: 'https://run.chesspath.app',
  },
};

/**
 * Which member of the family this bundle IS. 'web' on chesspath.app — the
 * web serves Chess Path and Chess Boxing from one origin, so it is neither.
 * Build-time constants: dead branches are stripped from the browser bundle.
 */
export function currentApp(): FamilyAppId | 'web' {
  if (IS_CHESSPATH_APP) return 'chesspath';
  if (IS_CHESSBOXING_APP) return 'chessboxing';
  return 'web';
}

/** Every family app except the one we're running inside. */
export function otherFamilyApps(): FamilyApp[] {
  const here = currentApp();
  return (Object.keys(FAMILY_APPS) as FamilyAppId[])
    .filter((id) => id !== here)
    .map((id) => FAMILY_APPS[id]);
}

/**
 * The URL a tap on `app` should open from where we are right now.
 * `path` (e.g. '/workout/fixit') is appended to the web URL's origin on the
 * web only — a store page can't deep-link into the app.
 */
export function familyAppHref(app: FamilyAppId, path?: string): string {
  const def = FAMILY_APPS[app];
  if (isNativeApp()) return def.storeUrl ?? def.webUrl;
  if (!path) return def.webUrl;
  const origin = new URL(def.webUrl).origin;
  return origin + (path.startsWith('/') ? path : `/${path}`);
}

/**
 * Open another family app. External in a shell (`_system` = Capacitor's
 * "hand this to iOS" target: Safari / App Store), a new tab on the web.
 * No-op on the server.
 */
export function openFamilyApp(app: FamilyAppId, path?: string): void {
  if (typeof window === 'undefined') return;
  const url = familyAppHref(app, path);
  if (isNativeApp()) {
    window.open(url, '_system');
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
