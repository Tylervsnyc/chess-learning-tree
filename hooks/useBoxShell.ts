'use client';

import { useIsNativeApp } from '@/lib/native-app';
import { IS_CHESSPATH_APP } from '@/lib/config/offline';

/**
 * useBoxShell — "are we inside the Chess Boxing app?" (native shell or the
 * ?boxapp=1 web-preview key). Thin wrapper over lib/native-app so there is ONE
 * detection; used by NavHeader, BoxTabBar, and any screen that renders
 * differently inside the app. Do not re-implement this detection anywhere else.
 *
 * The Chess Path app is ALSO a Capacitor shell but is NOT the boxing app, so
 * this is always false there — otherwise every "boxing shell" surface (the
 * gym-styled /play, the tab bar, hidden NavHeader) leaks into Chess Path.
 * IS_CHESSPATH_APP is a build-time constant, so the web and boxing bundles
 * compile to exactly the old behavior.
 */
export function useBoxShell(): boolean {
  const native = useIsNativeApp();
  return native && !IS_CHESSPATH_APP;
}
