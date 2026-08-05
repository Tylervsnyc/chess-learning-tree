'use client';

import { useEffect, useState } from 'react';

/**
 * useBoxShell — THE one way to ask "are we inside the Chess Boxing app?"
 *
 * True when running in the Capacitor native shell, or when the ?boxapp=1
 * debug key is present / persisted in sessionStorage (so a web preview keeps
 * behaving like the app across navigation for the whole session).
 *
 * Used by NavHeader (hide the website chrome), BoxTabBar (show the app tabs),
 * and any screen that renders differently inside the app. Do not re-implement
 * this detection anywhere else.
 */
const DEBUG_KEY = 'cp:boxapp';

export function useBoxShell(): boolean {
  const [inShell, setInShell] = useState(false);

  useEffect(() => {
    const isNative = window.Capacitor?.isNativePlatform?.() === true;
    let isDebug = false;
    try {
      if (new URLSearchParams(window.location.search).has('boxapp')) {
        sessionStorage.setItem(DEBUG_KEY, '1');
      }
      isDebug = sessionStorage.getItem(DEBUG_KEY) === '1';
    } catch {
      /* private mode — native detection still works */
    }
    setInShell(isNative || isDebug);
  }, []);

  return inShell;
}
