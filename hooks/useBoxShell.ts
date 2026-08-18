'use client';

/**
 * useBoxShell — "are we inside the Chess Boxing app?" (native shell or the
 * ?boxapp=1 web-preview key). Thin alias over lib/native-app so there is ONE
 * detection; used by NavHeader, BoxTabBar, and any screen that renders
 * differently inside the app. Do not re-implement this detection anywhere else.
 */
export { useIsNativeApp as useBoxShell } from '@/lib/native-app';
