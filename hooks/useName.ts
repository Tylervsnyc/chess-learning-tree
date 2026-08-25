'use client';

import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { getPlayerName, setPlayerName as setLocalPlayerName } from '@/components/onboarding/RookieNameAsk';
import { normalizePlayerName } from '@/lib/speech/sanitize';

/**
 * useName — what Rookie calls you.
 *
 * ONE identity, in priority order (2026-08-25):
 *   1. `profiles.display_name` — what you explicitly told Rookie to call you.
 *   2. `profiles.username`     — your fighter handle, set in Chess Boxing
 *                                onboarding and shown on every leaderboard.
 *   3. the local name          — logged-out web tutorial users only.
 *
 * The username fallback is the point. Before it, the two fields were separate
 * identities that could disagree: a Chess Boxing user picked a fighter name
 * during onboarding, `display_name` stayed null, and four moves into their
 * first game Rookie interrupted to ask their name — a name they had just
 * given us on the previous screen. Anything that needs "what do I call this
 * person" reads this hook; nothing reads `display_name` directly.
 *
 * `setName` still writes display_name, so telling Rookie to call you something
 * else does NOT rename you on the leaderboard. Those are genuinely different
 * things — the handle is public and uniqueness-checked, this is not.
 */
export function useName() {
  const { user, profile, refetchProfile } = useUser();
  const [localName, setLocalName] = useState<string | null>(null);

  useEffect(() => {
    setLocalName(normalizePlayerName(getPlayerName()));
  }, []);

  const dbName = normalizePlayerName(profile?.display_name) ?? normalizePlayerName(profile?.username);
  const name = user ? dbName : localName;

  const setName = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setLocalPlayerName(trimmed);
    setLocalName(trimmed);
    if (user) {
      fetch('/api/profile/display-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })
        .then((res) => { if (res.ok) refetchProfile(); })
        .catch(() => {});
    }
  }, [user, refetchProfile]);

  return { name, setName };
}
