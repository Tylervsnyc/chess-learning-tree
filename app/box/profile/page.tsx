'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useProfileData } from '@/hooks/useProfileData';
import { CornerRoom, Framed, RoomBackdrop } from '@/components/chessboxing/CornerRoom';

/**
 * /box/profile — the Chess Boxing app's Profile tab. "Your corner".
 *
 * A QUIET ROOM (Tyler, 2026-08-25: "make it a little more minimal, we don't
 * need medals, just a chill looking room"). The previous version stacked a
 * trophy case, an ELO card with a toggle, lifetime tiles, Pro history sheets
 * and a week chart into one no-scroll screen; it was a dashboard, not a place.
 *
 * What's here now, and nothing else:
 *   - your name on a locker plate
 *   - three numbers that actually mean something day to day
 *   - the week
 *
 * The look lives in components/chessboxing/CornerRoom — this route owns auth
 * and data only. Iterate on the room at /test/box-profile, which renders it
 * with mock numbers; signed-out screenshots of THIS route only ever show the
 * sign-in gate, which is how v1 shipped flat.
 *
 * The 88 medals still exist and still unlock on the finish screens; they just
 * don't live on this wall any more.
 *
 * Data comes from useProfileData() — the same hook /profile uses, so the two
 * screens can never disagree about the same person.
 *
 * HARD RULE (docs/chess-boxing-app-structure.md): fits the window, never
 * scrolls.
 */

export default function BoxProfilePage() {
  const { user, profile, loading: userLoading } = useUser();
  const { streak, elo, week, record, loading } = useProfileData();

  if (!userLoading && !user) return <SignedOut />;

  const name =
    profile?.username?.trim()
    || profile?.display_name?.trim()
    || user?.email?.split('@')[0]
    || 'Fighter';

  return (
    <CornerRoom
      name={name}
      days={loading ? null : streak?.current ?? 0}
      record={
        loading
          ? null
          : {
              wins: record?.wins ?? 0,
              losses: record?.losses ?? 0,
              kos: record?.kos ?? 0,
              total: record?.total ?? 0,
            }
      }
      elo={elo}
      loading={loading}
      week={week}
    />
  );
}

function SignedOut() {
  return (
    <div className="h-full overflow-hidden bg-[#c8975c] relative">
      <RoomBackdrop />
      {/* On a card — dark copy sitting straight on the wood was unreadable. */}
      <div className="relative max-w-lg mx-auto w-full h-full px-6 flex flex-col items-center justify-center">
        <Framed className="w-full max-w-xs" thickness={5} outer="rounded-3xl" inner="rounded-[19px]">
          <div className="px-5 py-6 flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-black text-chess-text">Your corner</h1>
          <p className="text-sm font-semibold text-chess-text-muted">
            Sign in to keep a streak, climb the standings, and build a fight record.
          </p>
          <Link
            href="/auth/login"
            className="mt-1 w-full rounded-2xl bg-chess-green text-white text-center font-black py-3.5 shadow-[0_4px_0_0_var(--color-chess-green-shadow)] active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-bold text-chess-blue tap-highlight py-2 min-h-[44px] inline-flex items-center"
          >
            Create an account
          </Link>
          </div>
        </Framed>
      </div>
    </div>
  );
}
