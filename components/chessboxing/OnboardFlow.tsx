'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BoxingLogoLoader } from '@/components/chessboxing/BoxingLogoLoader';
import { WelcomeHero } from '@/components/chessboxing/WelcomeHero';
import { BoxOnboardEvents } from '@/lib/analytics/posthog';
import { signUpWithEmail } from '@/lib/auth/signup';
import { createClient } from '@/lib/supabase/client';
import { humanizeAuthError } from '@/lib/auth-utils';
import { validateUsername, USERNAME_MAX } from '@/lib/username/validate';

/**
 * OnboardFlow — the Chess Boxing app's first-launch onboarding.
 *
 * Reworked 2026-08-25 (Tyler's review). Three things changed:
 *
 * 1. NAME FIRST, THEN ACCOUNT. The old flow showed a "create an account" card
 *    on the name step, so an anonymous user was asked for an email before they
 *    had any reason to care. Now they pick the fighter name — the fun part,
 *    the thing that goes on the board — and the email/password step comes
 *    after, framed as saving the name they just chose.
 *
 *    That inverts one thing technically: the name is chosen BEFORE the account
 *    exists, so it can't be written yet. It's validated and availability-checked
 *    against /api/profile/username/check (anon-safe, advisory), held in state,
 *    and written the moment signup succeeds.
 *
 * 2. ACCOUNT IS MANDATORY. No Skip. This is a competition app — the whole home
 *    screen is leaderboards, and a fighter with no account is invisible on all
 *    of them. The OnboardGate keeps sending people back here until they finish.
 *
 * 3. THE PROGRESS BAR SHOWS THE WHOLE FLOW. Named segments, so you can see how
 *    many steps there are and where you are before you commit to the first one.
 *
 * Validation rules (format, reserved, slur filter) are NOT duplicated here —
 * lib/username/validate.ts is the one source of truth, shared with the server
 * route, so the client can never accept a name the server will refuse.
 *
 * HARD RULE (docs/chess-boxing-app-structure.md): no scroll — every card fits
 * a 375×667 window with the tab bar hidden.
 */

export const ONBOARDED_KEY = 'cp:box-onboarded';

type StepKey = 'welcome' | 'name' | 'account' | 'crew';

const STEP_LABEL: Record<StepKey, string> = {
  welcome: 'Welcome',
  name: 'Your name',
  account: 'Account',
  crew: 'Crew',
};

/** undefined = still loading. */
type AuthState = { signedIn: boolean; username: string | null } | undefined;

export function OnboardFlow() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>(undefined);
  const [step, setStep] = useState(0);

  /** The name chosen on the name step, held until an account exists to put it on. */
  const [chosenName, setChosenName] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 401 = no account. ok + null username = account, no handle yet.
      let state: Exclude<AuthState, undefined> = { signedIn: false, username: null };
      try {
        const res = await fetch('/api/profile/username');
        if (res.ok) {
          const d = await res.json();
          state = { signedIn: true, username: (d?.username as string | null) ?? null };
        }
      } catch {
        /* offline — treat as signed out; the account step re-checks on submit */
      }
      if (!cancelled) setAuth(state);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // The steps this particular user needs. Someone who already has an account
  // and a handle (reinstall, second device) shouldn't be asked again.
  //
  // While auth is still loading we show the FULL first-launch flow rather than
  // a placeholder: showing the whole path is the entire point of the rail, and
  // a rail that grows from one segment to four a moment after paint is worse
  // than one that occasionally shortens. The user is on the welcome step for
  // that whole window, so nothing under them moves.
  const steps: StepKey[] = useMemo(() => {
    if (!auth) return ['welcome', 'name', 'account', 'crew'];
    if (auth.username) return ['welcome', 'crew'];
    if (auth.signedIn) return ['welcome', 'name', 'crew'];
    return ['welcome', 'name', 'account', 'crew'];
  }, [auth]);

  const stepIdx = Math.min(step, steps.length - 1);
  const stepKey = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  useEffect(() => {
    if (stepKey) BoxOnboardEvents.stepViewed(stepKey, stepIdx);
  }, [stepKey, stepIdx]);

  const next = useCallback(() => setStep((s) => s + 1), []);

  const finish = useCallback(() => {
    BoxOnboardEvents.completed();
    try {
      localStorage.setItem(ONBOARDED_KEY, '1');
    } catch {
      /* private mode — the gate re-checks the account server-side anyway */
    }
    // Straight into the app (Tyler, v3). The first-bout explainer card that
    // used to greet people here was one beat too many after crew → "no crew"
    // → "gloves on"; the home screen can introduce itself.
    router.replace('/box');
  }, [router]);

  /** Signup succeeded: write the held name, then move on. */
  const onAccountCreated = useCallback(async () => {
    if (chosenName) {
      try {
        const res = await fetch('/api/profile/username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: chosenName }),
        });
        if (res.ok) BoxOnboardEvents.usernameSaved();
      } catch {
        /* The name is recoverable from Settings → Handle; never block here. */
      }
    }
    setAuth({ signedIn: true, username: chosenName || null });
    next();
  }, [chosenName, next]);

  return (
    <div className="h-full overflow-hidden bg-chess-page">
      <div className="max-w-lg md:max-w-xl mx-auto w-full h-full px-4 md:px-6 pt-3 pb-5 flex flex-col">
        <ProgressRail steps={steps} current={stepIdx} />

        <div className="flex-1 min-h-0 flex flex-col justify-center py-2">
          {stepKey === 'welcome' && <StepWelcome />}
          {stepKey === 'name' && (
            <StepName
              signedIn={auth?.signedIn ?? false}
              initial={chosenName}
              onChosen={(name) => {
                setChosenName(name);
                if (auth?.signedIn) setAuth({ signedIn: true, username: name });
                next();
              }}
            />
          )}
          {stepKey === 'account' && (
            <StepAccount name={chosenName} onCreated={onAccountCreated} />
          )}
          {stepKey === 'crew' && <StepCrew onDone={finish} />}
        </div>

        {/* Only the welcome step gets a generic bottom button. Every other step
            owns its own primary action, because each one has to complete real
            work (a valid name, a created account) before it may advance —
            a shared "Next" would let people walk past all of it. */}
        {stepKey === 'welcome' && (
          <button
            onClick={isLast ? finish : next}
            className="w-full rounded-2xl bg-chess-green text-white font-black py-3 min-h-[48px] shadow-sm active:translate-y-[2px] transition-transform tap-highlight"
          >
            {isLast ? 'Gloves on' : "Let's go"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Progress rail ---------------- */

/**
 * The whole flow at a glance: one labeled segment per step, so the length of
 * onboarding is visible on the first screen instead of being discovered a dot
 * at a time. Done steps fill in and get a tick; the current one is wide and
 * red; the rest sit grey and legible.
 *
 * Not tappable. Steps gate on real work now (a valid name, a created account),
 * so jumping between them isn't meaningful — and a tappable bar that refuses
 * the tap reads as broken.
 */
function ProgressRail({ steps, current }: { steps: StepKey[]; current: number }) {
  return (
    <div
      className="pt-1 pb-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-valuenow={current + 1}
      aria-label={`Step ${current + 1} of ${steps.length}: ${STEP_LABEL[steps[current]]}`}
    >
      {/* One continuous hairline track that fills left to right, rather than
          separate bars per step — a single line reads as one journey and
          doesn't shout. Equal widths keep it even; the label below names the
          step you're on, so the segments don't need to. */}
      <div className="flex items-center gap-1" aria-hidden>
        {steps.map((key, i) => (
          <span key={key} className="flex-1 h-[3px] rounded-full bg-slate-200/90 overflow-hidden">
            <span
              className="block h-full rounded-full bg-chess-text transition-transform duration-500 ease-out origin-left"
              style={{ transform: `scaleX(${i <= current ? 1 : 0})` }}
            />
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-baseline justify-between" aria-hidden>
        <span className="text-[11px] font-bold text-chess-text tracking-tight">
          {STEP_LABEL[steps[current]]}
        </span>
        <span className="text-[10px] font-semibold text-chess-text-muted tabular-nums tracking-wide">
          {current + 1} of {steps.length}
        </span>
      </div>
    </div>
  );
}

/* ---------------- Step 1 — welcome ---------------- */

/**
 * Real photographs, not an explanation. The old version led with a logo and a
 * paragraph about alternating rounds — a rules briefing before anyone had a
 * reason to care. The rules can wait for the first bout; this screen has one
 * job, which is to make someone want in.
 */
function StepWelcome() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-center">
      {/* The animated logo is the brand and stays the hero (Tyler, v3). */}
      <BoxingLogoLoader size={84} />

      <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight">
        Welcome to Chess Boxing.
      </h1>
      <p className="text-[13.5px] leading-snug text-chess-text-muted max-w-[19rem]">
        The only app where you can practice boxing and chess skills — in
        community with people around the world.
      </p>

      {/* Proof, at supporting size — capped so it can never dominate the logo
          or push the screen past the no-scroll budget on a 375×667 window. */}
      <div className="w-full max-w-[17rem] aspect-[4/3] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5">
        <WelcomeHero />
      </div>
    </div>
  );
}

/* ---------------- Step 2 — what should we call you ---------------- */

function StepName({
  signedIn,
  initial,
  onChosen,
}: {
  signedIn: boolean;
  initial: string;
  onChosen: (name: string) => void;
}) {
  const [input, setInput] = useState(initial);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const reqId = useRef(0);

  const local = validateUsername(input);
  const canSubmit = local.ok && !busy;

  // Clear a stale server message as soon as the text changes.
  useEffect(() => {
    setErr(null);
  }, [input]);

  const submit = async () => {
    const checked = validateUsername(input);
    if (!checked.ok) {
      setErr(checked.message);
      return;
    }
    setBusy(true);
    setErr(null);
    const id = ++reqId.current;
    try {
      if (signedIn) {
        // Already have an account — write it straight through.
        const res = await fetch('/api/profile/username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: checked.value }),
        });
        const d = await res.json().catch(() => ({}));
        if (id !== reqId.current) return;
        if (!res.ok) {
          setErr(d.error ?? 'Could not save that name.');
          return;
        }
        BoxOnboardEvents.usernameSaved();
      } else {
        // No account yet — just make sure it's free before we ask for an email.
        const res = await fetch('/api/profile/username/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: checked.value }),
        });
        const d = await res.json().catch(() => ({ ok: true }));
        if (id !== reqId.current) return;
        if (!d.ok) {
          setErr(d.error ?? 'Try another name.');
          return;
        }
      }
      onChosen(checked.value);
    } catch {
      if (id === reqId.current) setErr('Network error. Try again.');
    } finally {
      if (id === reqId.current) setBusy(false);
    }
  };

  // Show format guidance only once they've typed enough to mean it.
  const hint = err ?? (input.length >= 3 && !local.ok ? local.message : null);

  return (
    <div className="flex flex-col items-center text-center gap-3">
      <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight">
        What should we call you?
      </h1>
      <p className="text-sm text-chess-text-muted max-w-sm">
        This goes on the leaderboard.
        {!signedIn && ' Your fighter name comes with a free account. Takes about 30 seconds.'}
      </p>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canSubmit) void submit();
          }}
          placeholder="e.g. brooklyn_bishop"
          maxLength={USERNAME_MAX}
          autoCapitalize="none"
          autoCorrect="off"
          autoFocus
          aria-label="Fighter name"
          aria-invalid={hint !== null}
          className={`w-full rounded-xl border-2 px-4 py-3 min-h-[44px] text-chess-text outline-none bg-chess-surface transition-colors ${
            hint ? 'border-red-400' : 'border-slate-200 focus:border-chess-green'
          }`}
        />
        {hint && <p className="text-sm text-red-500 text-left">{hint}</p>}
        <button
          onClick={() => void submit()}
          disabled={!canSubmit}
          className="rounded-2xl bg-chess-green text-white font-black py-3 min-h-[48px] shadow-sm disabled:opacity-50 active:translate-y-[2px] transition-transform tap-highlight"
        >
          {busy ? 'Checking…' : 'That’s me'}
        </button>
        <p className="text-xs text-chess-text-muted">
          You can change this later in Settings.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Step 3 — create the account ---------------- */

/**
 * Email + password only, on purpose. Inside the Capacitor shell an OAuth tap
 * escapes to Safari, which has no PKCE verifier, so Google and Apple sign-in
 * cannot complete (see lib/auth/webview.ts). Offering them here would be a
 * guaranteed dead end on the one screen a new fighter cannot skip.
 */
function StepAccount({ name, onCreated }: { name: string; onCreated: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);
  const [busy, setBusy] = useState(false);

  const canSubmit = email.includes('@') && password.length >= 6 && !busy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setErr(null);
    setDuplicate(false);

    const result = await signUpWithEmail(email.trim(), password);
    if (result.ok) {
      await onCreated();
      return;
    }
    setErr(result.error);
    setDuplicate(result.duplicateEmail);
    setBusy(false);
  };

  /** Existing account: sign in right here rather than bouncing them out. */
  const signIn = async () => {
    setBusy(true);
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setErr(humanizeAuthError(error.message));
      setBusy(false);
      return;
    }
    await onCreated();
  };

  return (
    <form onSubmit={submit} className="flex flex-col items-center text-center gap-3">
      <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight">
        Save your name
      </h1>
      <p className="text-sm text-chess-text-muted max-w-sm">
        {name ? (
          <>
            <span className="font-black text-chess-green">{name}</span> is yours
            as soon as you make a free account — that&apos;s what puts you on the
            leaderboard.
          </>
        ) : (
          'A free account puts you on the leaderboard and keeps your streak.'
        )}
      </p>

      <div className="w-full max-w-sm flex flex-col gap-2.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="email"
          inputMode="email"
          aria-label="Email"
          className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 min-h-[44px] text-chess-text focus:border-chess-green outline-none bg-chess-surface"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (6+ characters)"
            autoComplete="new-password"
            aria-label="Password"
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 pr-16 min-h-[44px] text-chess-text focus:border-chess-green outline-none bg-chess-surface"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[40px] px-2 text-xs font-black text-chess-text-muted tap-highlight"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {err && <p className="text-sm text-red-500 text-left">{err}</p>}

        {duplicate ? (
          <button
            type="button"
            onClick={() => void signIn()}
            disabled={busy}
            className="rounded-2xl bg-chess-blue text-white font-black py-3 min-h-[48px] shadow-sm disabled:opacity-50 tap-highlight"
          >
            {busy ? 'Signing in…' : 'Sign in instead'}
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-2xl bg-chess-green text-white font-black py-3 min-h-[48px] shadow-sm disabled:opacity-50 active:translate-y-[2px] transition-transform tap-highlight"
          >
            {busy ? 'Creating…' : 'Create my account'}
          </button>
        )}
      </div>
    </form>
  );
}

/* ---------------- Step 4 — join a crew (optional) ---------------- */

function StepCrew({ onDone }: { onDone: () => void }) {
  // Mirrors the join-crew card on /leaderboard — same endpoint, same errors.
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState<string | null>(null);

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
        <div className="w-full max-w-sm flex flex-col gap-3">
          <div className="bg-chess-surface rounded-2xl border-2 border-chess-green shadow-sm p-4">
            <div className="text-xs font-bold text-chess-text-muted uppercase tracking-wide">
              You&apos;re in
            </div>
            <div className="text-xl font-black text-chess-green mt-1 break-all">{joined}</div>
          </div>
          <button
            onClick={onDone}
            className="rounded-2xl bg-chess-green text-white font-black py-3 min-h-[48px] shadow-sm active:translate-y-[2px] transition-transform tap-highlight"
          >
            Gloves on
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Crew code"
            autoCapitalize="characters"
            autoCorrect="off"
            aria-label="Crew code"
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 min-h-[44px] text-chess-text focus:border-chess-green outline-none uppercase bg-chess-surface"
          />
          {err && <p className="text-sm text-red-500 text-left">{err}</p>}
          <button
            onClick={() => void join()}
            disabled={joining || !code.trim()}
            className="rounded-xl bg-chess-blue text-white font-bold py-3 min-h-[44px] disabled:opacity-50 tap-highlight"
          >
            {joining ? 'Joining…' : 'Join crew'}
          </button>
          <button
            onClick={onDone}
            className="rounded-2xl bg-chess-green text-white font-black py-3 min-h-[48px] shadow-sm active:translate-y-[2px] transition-transform tap-highlight"
          >
            No crew — gloves on
          </button>
        </div>
      )}
    </div>
  );
}
