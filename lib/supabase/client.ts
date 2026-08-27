import { createBrowserClient } from '@supabase/ssr';
import { IS_OFFLINE_APP } from '@/lib/config/offline';

/**
 * Session storage for the offline app bundle.
 *
 * @supabase/ssr keeps the session in document.cookie so the server can read
 * it. Two reasons that's wrong inside the app: the server never sees these
 * cookies anyway (pages are served from capacitor://localhost, and the API is
 * called with a bearer token instead — see lib/supabase/server.ts), and
 * WKWebView is unreliable about persisting cookies on a custom scheme, which
 * would sign the user out on every cold start. localStorage persists.
 *
 * Same key names as the cookie transport, so nothing else has to know.
 */
const localStorageCookies = {
  getAll() {
    try {
      return Object.keys(localStorage)
        .filter((name) => name.startsWith('sb-'))
        .map((name) => ({ name, value: localStorage.getItem(name) ?? '' }));
    } catch {
      return [];
    }
  },
  setAll(cookies: { name: string; value: string }[]) {
    try {
      for (const { name, value } of cookies) {
        if (value) localStorage.setItem(name, value);
        else localStorage.removeItem(name);
      }
    } catch {
      /* private mode / quota — the session just won't persist this launch */
    }
  },
};

// Singleton client instance to avoid multiple instances
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (clientInstance) return clientInstance;

  clientInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    IS_OFFLINE_APP ? { cookies: localStorageCookies } : undefined
  );

  return clientInstance;
}

/**
 * Clear invalid auth tokens from storage
 * Call this when you get "Refresh Token Not Found" errors
 */
export function clearAuthTokens() {
  if (typeof window === 'undefined') return;

  // Find and remove Supabase auth keys from localStorage
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Reset client instance so a fresh one is created
  clientInstance = null;
}
