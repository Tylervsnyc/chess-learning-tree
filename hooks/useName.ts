'use client';

import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { getPlayerName, setPlayerName as setLocalPlayerName } from '@/components/onboarding/RookieNameAsk';
import { normalizePlayerName } from '@/lib/speech/sanitize';

export function useName() {
  const { user, profile, refetchProfile } = useUser();
  const [localName, setLocalName] = useState<string | null>(null);

  useEffect(() => {
    setLocalName(normalizePlayerName(getPlayerName()));
  }, []);

  const dbName = normalizePlayerName(profile?.display_name);
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
