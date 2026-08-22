'use client';

import Link from 'next/link';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BoxingLogoLoader } from '@/components/chessboxing/BoxingLogoLoader';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { BoxOnboardEvents } from '@/lib/analytics/posthog';

/**
 * OnboardFlow — the Chess Boxing app's first-launch onboarding.
 *
 * Steps: what chess boxing is → pick username → join a crew → camera
 * permission. The crew step only exists for logged-in users (anon can't
 * join); the camera step only exists while WORKOUT_PUNCH_CAM is on — with
 * the punch camera flagged off there is nothing to ask permission for.
 * Swipeable + tappable, progress dots, always skippable (never trap).
 * Completing OR skipping sets localStorage 'cp:box-onboarded' so the
 * OnboardGate in app/box/layout.tsx stops redirecting.
 *
 * Username reuses the existing leaderboard handle API
 * (/api/profile/username) — same validation, same errors. Logged-out
 * users can continue; the handle comes with an account (matches the
 * /leaderboard gate behavior, which 401s silently).
 *
 * Camera: getUserMedia with the same constraints as PunchTracker — inside
 * the Capacitor shell this triggers the native iOS prompt. We stop the
 * tracks immediately; we only want the permission, not the stream.
 */

export const ONBOARDED_KEY = 'cp:box-onboarded';

const CAMERA_STEP = FEATURE_FLAGS.WORKOUT_PUNCH_CAM;
const SWIPE_MIN = 48;

type StepKey = 'what' | 'username' | 'crew' | 'camera';
// undefined=loading, 'anon'=not logged in, null=needs handle, string=has one
type UsernameState = string | null | 'anon' | undefined;

export function OnboardFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const touchX = useRef<number | null>(null);

  // Fetched once here so the flow knows whether to include the crew step
  // (anon users can't join a crew — /api/leaderboard/join 401s).
  const [username, setUsername] = useState<UsernameState>(undefined);
  useEffect(() => {
    fetch('/api/profile/username')
      .then((r) => {
        if (r.status === 401) return 'anon' as const;
        return r.ok ? r.json().then((d) => d.username ?? null) : null;
      })
      .then((v) => setUsername(v))
      .catch(() => setUsername(null));
  }, []);

  const stepKeys: StepKey[] = [
    'what',
    'username',
    ...(username !== 'anon' ? (['crew'] as const) : []),
    ...(CAMERA_STEP ? (['camera'] as const) : []),
  ];
  const STEPS = stepKeys.length;
  // If the anon check resolves while past the crew step, clamp.
  const stepIdx = Math.min(step, STEPS - 1);
  const stepKey = stepKeys[stepIdx];

  useEffect(() => {
    if (stepKey) BoxOnboardEvents.stepViewed(stepKey, stepIdx);
  }, [stepKey, stepIdx]);

  const finish = useCallback(() => {
    BoxOnboardEvents.completed();
    try {
      localStorage.setItem(ONBOARDED_KEY, '1');
    } catch {
      /* private mode — gate just won't persist */
    }
    router.replace('/box');
  }, [router]);

  const skip = useCallback(() => {
    BoxOnboardEvents.skipped(stepKey);
    try {
      localStorage.setItem(ONBOARDED_KEY, '1');
    } catch {
      /* private mode — gate just won't persist */
    }
    router.replace('/box');
  }, [router, stepKey]);

  const next = useCallback(() => {
    setStep((s) => (s >= STEPS - 1 ? s : s + 1));
  }, [STEPS]);
  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    touchX.current = null;
    if (dx <= -SWIPE_MIN) next();
    else if (dx >= SWIPE_MIN) back();
  };

  return (
    // HARD RULE (docs/chess-boxing-app-structure.md): no scroll — each card
    // fits a 375×667 window (tab bar hidden on this route).
    <div className="h-full overflow-hidden bg-chess-page">
      <div className="max-w-lg md:max-w-xl mx-auto w-full h-full px-4 md:px-6 pt-3 pb-5 flex flex-col">
        {/* Top bar: dots + skip */}
        <div className="flex items-center justify-between min-h-[44px]">
          <div className="flex items-center gap-2" aria-label={`Step ${stepIdx + 1} of ${STEPS}`}>
            {Array.from({ length: STEPS }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
                className="p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center tap-highlight"
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === stepIdx ? 'w-6 h-2 bg-[#e5484d]' : 'w-2 h-2 bg-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            onClick={skip}
            className="text-sm font-bold text-chess-text-muted px-3 py-2 min-h-[44px] tap-highlight"
          >
            Skip
          </button>
        </div>

        {/* Card */}
        <div
          className="flex-1 min-h-0 flex flex-col justify-center py-2"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {stepKey === 'what' && <StepWhat />}
          {stepKey === 'username' && (
            <StepUsername username={username} setUsername={setUsername} />
          )}
          {stepKey === 'crew' && (
            <StepCrew onSkip={stepIdx === STEPS - 1 ? finish : next} />
          )}
          {stepKey === 'camera' && <StepCamera onDone={finish} />}
        </div>

        {/* Bottom nav (the camera step owns its own buttons) */}
        {stepKey !== 'camera' && (
          <div className="flex gap-3 pt-2">
            {stepIdx > 0 && (
              <button
                onClick={back}
                className="rounded-2xl border-2 border-slate-200 text-chess-text-muted font-black px-5 py-3 min-h-[48px]"
              >
                Back
              </button>
            )}
            <button
              onClick={stepIdx === STEPS - 1 ? finish : next}
              className="flex-1 rounded-2xl bg-chess-green text-white font-black py-3 min-h-[48px] shadow-sm"
            >
              {stepIdx === STEPS - 1 ? 'Gloves on' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Step 1 — what chess boxing is ---------------- */

function StepWhat() {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <BoxingLogoLoader size={96} />
      <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight">
        This is chess boxing.
      </h1>
      <p className="text-sm text-chess-text-muted max-w-sm">
        A real sport. One fight, alternating rounds: chess at the board, boxing
        in the ring, then back to the same game — heart pounding. Win by
        checkmate or knockout.
      </p>
      <p className="text-sm text-chess-text-muted max-w-sm">
        Here you train it: puzzles between boxing rounds while your pulse tries
        to wreck your calculation. Streaks, scores, leaderboards.
      </p>
    </div>
  );
}

/* ---------------- Step 2 — pick your username ---------------- */

function StepUsername({
  username,
  setUsername,
}: {
  username: UsernameState;
  setUsername: (v: UsernameState) => void;
}) {
  const [input, setInput] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setErr(null);
    setSaving(true);
    try {
      const res = await fetch('/api/profile/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: input.trim() }),
      });
      const d = await res.json();
      if (res.ok) {
        setUsername(d.username);
        BoxOnboardEvents.usernameSaved();
      } else setErr(d.error ?? 'Could not save handle.');
    } catch {
      setErr('Network error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-3">
      <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight">
        Pick your fighter name
      </h1>
      <p className="text-sm text-chess-text-muted max-w-sm">
        It goes on the leaderboard — every round you fight, other fighters see
        this name climb.
      </p>

      {username === undefined && (
        <div className="w-full max-w-sm h-12 rounded-xl bg-slate-100 animate-pulse" />
      )}

      {username === 'anon' && (
        <div className="w-full max-w-sm bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
          <p className="text-sm text-chess-text-muted">
            Your fighter name comes with a free account — it takes about 30 seconds.
          </p>
          <Link
            href="/auth/signup?redirect=/box/onboarding"
            className="rounded-xl bg-chess-green text-white font-bold py-3 min-h-[44px] text-center"
          >
            Create account
          </Link>
          <Link
            href="/auth/login?redirect=/box/onboarding"
            className="text-sm font-bold text-chess-text-muted underline underline-offset-2"
          >
            Already have one? Sign in
          </Link>
        </div>
      )}

      {typeof username === 'string' && username !== 'anon' && (
        <div className="w-full max-w-sm bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs font-bold text-chess-text-muted uppercase tracking-wide">
            Fighting as
          </div>
          <div className="text-xl font-black text-chess-green mt-1 break-all">{username}</div>
        </div>
      )}

      {username === null && (
        <div className="w-full max-w-sm flex flex-col gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. brooklyn_bishop"
            maxLength={20}
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 min-h-[44px] text-chess-text focus:border-chess-green outline-none bg-chess-surface"
          />
          {err && <p className="text-sm text-red-500">{err}</p>}
          <button
            onClick={save}
            disabled={saving || input.trim().length < 3}
            className="rounded-xl bg-chess-green text-white font-bold py-3 min-h-[44px] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save name'}
          </button>
          <p className="text-xs text-chess-text-muted">
            3–20 characters. Letters, numbers, underscore.
          </p>
        </div>
      )}

    </div>
  );
}

/* ---------------- Step 3 — join a crew (logged-in only) ---------------- */

function StepCrew({ onSkip }: { onSkip: () => void }) {
  // Mirrors the join-crew card on /leaderboard — same endpoint, same errors.
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState<string | null>(null); // crew name

  const join = async () => {
    setErr(null);
    setJoining(true);
    try {
      const res = await fetch('/api/leaderboard/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const d = await res.json();
      if (res.ok) {
        const name = d.crew?.name ?? 'your crew';
        setJoined(name);
        BoxOnboardEvents.crewJoined(name);
      } else setErr(d.error ?? 'Could not join.');
    } catch {
      setErr('Network error.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-3">
      <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight">
        Got a crew code?
      </h1>
      <p className="text-sm text-chess-text-muted max-w-sm">
        Crews get their own board — your club against itself. Chessboxing NYC?
        Use code <span className="font-bold text-chess-text">NYC</span>.
      </p>

      {joined ? (
        <div className="w-full max-w-sm bg-chess-surface rounded-2xl border-2 border-chess-green shadow-sm p-4">
          <div className="text-xs font-bold text-chess-text-muted uppercase tracking-wide">
            You&apos;re in
          </div>
          <div className="text-xl font-black text-chess-green mt-1 break-all">{joined}</div>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Crew code"
            autoCapitalize="characters"
            autoCorrect="off"
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 min-h-[44px] text-chess-text focus:border-chess-green outline-none uppercase bg-chess-surface"
          />
          {err && <p className="text-sm text-red-500">{err}</p>}
          <button
            onClick={join}
            disabled={joining || !code.trim()}
            className="rounded-xl bg-chess-green text-white font-bold py-3 min-h-[44px] disabled:opacity-50"
          >
            {joining ? 'Joining…' : 'Join crew'}
          </button>
          <button
            onClick={onSkip}
            className="text-sm font-bold text-chess-text-muted py-2 min-h-[44px] tap-highlight"
          >
            No crew yet — you can join later from the leaderboard
          </button>
        </div>
      )}

    </div>
  );
}

/* ---------------- Step 4 — camera permission ---------------- */

function StepCamera({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<'idle' | 'asking' | 'granted' | 'denied'>('idle');

  const ask = async () => {
    setState('asking');
    try {
      // Same constraints as PunchTracker. Inside the Capacitor shell this
      // fires the native iOS camera prompt. We only want the permission —
      // stop the stream immediately.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());
      setState('granted');
      BoxOnboardEvents.cameraResult(true);
    } catch {
      setState('denied');
      BoxOnboardEvents.cameraResult(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-3">
      <CameraArt />
      <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight">
        Count every punch
      </h1>
      <p className="text-sm text-chess-text-muted max-w-sm">
        Prop your phone up during boxing rounds and the camera counts your
        punches live. Nothing is recorded or uploaded — it all stays on your
        phone.
      </p>

      {state === 'granted' && (
        <div className="w-full max-w-sm bg-chess-surface rounded-2xl border-2 border-chess-green shadow-sm p-4 text-sm font-bold text-chess-green">
          Camera ready. Gloves on.
        </div>
      )}
      {state === 'denied' && (
        <div className="w-full max-w-sm bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 text-sm text-chess-text-muted">
          No camera, no problem — you can tap the screen to count punches, and
          turn the camera on later in Settings.
        </div>
      )}

      <div className="w-full max-w-sm flex flex-col gap-2 pt-1">
        {state === 'granted' || state === 'denied' ? (
          <button
            onClick={onDone}
            className="rounded-2xl bg-chess-green text-white font-black py-3 min-h-[48px] shadow-sm"
          >
            Start fighting
          </button>
        ) : (
          <>
            <button
              onClick={ask}
              disabled={state === 'asking'}
              className="rounded-2xl bg-chess-green text-white font-black py-3 min-h-[48px] shadow-sm disabled:opacity-60"
            >
              {state === 'asking' ? 'Asking…' : 'Enable the punch counter'}
            </button>
            <button
              onClick={onDone}
              className="rounded-2xl border-2 border-slate-200 text-chess-text-muted font-black py-3 min-h-[48px]"
            >
              Not now — I&apos;ll tap to count
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/** Tiny inline camera-in-the-corner art — no assets, no emoji. */
function CameraArt() {
  return (
    <svg width="80" height="80" viewBox="0 0 96 96" fill="none" aria-hidden>
      <rect x="8" y="8" width="80" height="80" rx="18" fill="#101a33" />
      <rect x="16" y="16" width="64" height="64" rx="10" fill="none" stroke="#e5484d" strokeWidth="4" />
      <circle cx="48" cy="46" r="14" fill="none" stroke="#fff" strokeWidth="4" />
      <circle cx="48" cy="46" r="5" fill="#e5484d" />
      <rect x="38" y="66" width="20" height="6" rx="3" fill="#fff" opacity="0.7" />
    </svg>
  );
}
