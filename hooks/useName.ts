'use client';

import { useUser } from '@/hooks/useUser';
import { normalizePlayerName } from '@/lib/speech/sanitize';

/**
 * useName — what Rookie calls you.
 *
 * THE APP NEVER ASKS FOR A NAME (Tyler, 2026-08-25: "it's all about your
 * handle"). Rookie used to stop a game after four moves to ask, and the
 * Basics tutorial used to ask after the rook — both are gone. Your identity
 * is the fighter handle you pick once, in Chess Boxing onboarding.
 *
 * Resolution order:
 *   1. `profiles.username`     — the fighter handle. The identity of record:
 *                                public, unique, and the name on every board.
 *   2. `profiles.display_name` — legacy. Still honoured for the accounts that
 *                                already have one (and for the guest-name
 *                                migration in useUser), but nothing sets it
 *                                any more. Do not add a new writer.
 *
 * Returns null when there's no name — logged out, or signed up but no handle
 * yet. That is a supported state, not a gap to fill with a prompt:
 * `fillNamePlaceholder` in lib/speech/sanitize.ts drops `{name}` cleanly, so
 * Rookie simply doesn't use a name in that line.
 */
export function useName() {
  const { profile } = useUser();

  const name =
    normalizePlayerName(profile?.username) ?? normalizePlayerName(profile?.display_name);

  return { name };
}
