'use client';

import { installOfflineFetch } from '@/lib/net/offline-fetch';

/**
 * Installs the offline app's network adapter (lib/net/offline-fetch.ts).
 *
 * Called at MODULE scope, not in an effect: hooks fire their first requests
 * from effects during the initial render, and an effect here would race them —
 * the very first /api call of a cold start would slip through unpatched and
 * 404 against the app bundle. Module scope runs at import, before any of that.
 *
 * No-op on the web: installOfflineFetch() returns immediately unless the bundle
 * was built by scripts/build-offline.mjs.
 */
installOfflineFetch();

export function OfflineBridge() {
  return null;
}
