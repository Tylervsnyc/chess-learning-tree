'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * BoxSettings — the Chess Boxing app's settings screen (/box/settings).
 *
 * Reuses the leaderboard identity APIs — no second implementation:
 * - Username:  GET/POST /api/profile/username (validation + lockdown live there)
 * - Crew:      GET/DELETE /api/leaderboard/crew + POST /api/leaderboard/join
 * - Opt-in:    GET/POST /api/profile/leaderboard-opt-in (profiles.leaderboard_opt_in,
 *              the column the global board already honors)
 *
 * Camera is device-local: localStorage `cp:punch-camera` ('1' | '0', default on).
 * The workout's punch counter doesn't read this key yet — the toggle is the
 * preference of record for future wiring, labeled honestly in the UI.
 *
 * Logged-out users can still use the camera section; account-backed sections
 * collapse into a sign-in prompt.
 */

const CAMERA_KEY = 'cp:punch-camera';
const ACCENT = '#e5484d';

interface Crew {
  id: string;
  name: string;
}

export function BoxSettings() {
  // undefined = still loading; null = logged out.
  const [username, setUsername] = useState<string | null | undefined>(undefined);
  const [loggedOut, setLoggedOut] = useState(false);
  const [crew, setCrew] = useState<Crew | null>(null);
  const [optIn, setOptIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/profile/username')
      .then((r) => {
        if (r.status === 401) {
          setLoggedOut(true);
          setUsername(null);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((d) => {
        if (d) setUsername(d.username ?? null);
      })
      .catch(() => setUsername(null));

    fetch('/api/leaderboard/crew')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setCrew(d?.crew ?? null))
      .catch(() => setCrew(null));

    fetch('/api/profile/leaderboard-opt-in')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.optIn === 'boolean') setOptIn(d.optIn);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-lg md:max-w-xl mx-auto w-full px-4 md:px-6 pt-4 pb-10 flex flex-col gap-4">
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/box"
            aria-label="Back to Chess Boxing"
            className="flex items-center justify-center w-11 h-11 -ml-2 rounded-xl text-chess-text-muted tap-highlight"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-chess-text">Settings</h1>
        </div>

        {loggedOut ? (
          <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
            <div>
              <h2 className="font-black text-chess-text">Your fighter profile</h2>
              <p className="text-sm text-chess-text-muted mt-1">
                Sign in to pick a handle, join a crew, and appear on the
                leaderboards. Camera settings below work without an account.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="rounded-xl text-white font-bold py-3 min-h-[44px] text-center tap-highlight"
              style={{ backgroundColor: ACCENT, boxShadow: '0 3px 0 #b53437' }}
            >
              Sign in
            </Link>
          </section>
        ) : (
          <>
            <UsernameSection username={username} onSaved={setUsername} />
            <CrewSection crew={crew} onChanged={setCrew} />
            <OptInSection optIn={optIn} onChanged={setOptIn} />
          </>
        )}

        <CameraSection />
      </div>
    </div>
  );
}

/* ── Username ────────────────────────────────────────────────────────────── */

function UsernameSection({
  username,
  onSaved,
}: {
  username: string | null | undefined;
  onSaved: (u: string) => void;
}) {
  const [editing, setEditing] = useState(false);
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
        onSaved(d.username);
        setEditing(false);
        setInput('');
      } else {
        setErr(d.error ?? 'Could not save handle.');
      }
    } catch {
      setErr('Network error — try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-black text-chess-text">Handle</h2>
          <p className="text-sm text-chess-text-muted mt-0.5 truncate">
            {username === undefined
              ? 'Loading…'
              : username
                ? username
                : 'Not set — pick one to get on the board.'}
          </p>
        </div>
        {!editing && username !== undefined && (
          <button
            onClick={() => {
              setInput(username ?? '');
              setEditing(true);
            }}
            className="shrink-0 rounded-xl border-2 font-bold text-sm px-4 py-2 min-h-[44px] tap-highlight"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            {username ? 'Change' : 'Set handle'}
          </button>
        )}
      </div>

      {editing && (
        <div className="flex flex-col gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. brooklyn_bishop"
            maxLength={20}
            autoFocus
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 min-h-[44px] text-chess-text outline-none focus:border-[#e5484d]"
          />
          <p className="text-xs text-chess-text-muted">
            3–20 characters — letters, numbers, underscore. This is the name
            other fighters see.
          </p>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving || input.trim().length < 3}
              className="flex-1 rounded-xl text-white font-bold py-3 min-h-[44px] disabled:opacity-50 tap-highlight"
              style={{ backgroundColor: ACCENT }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setErr(null);
              }}
              className="flex-1 rounded-xl border border-slate-200 font-bold py-3 min-h-[44px] text-chess-text-muted tap-highlight"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Crew ────────────────────────────────────────────────────────────────── */

function CrewSection({
  crew,
  onChanged,
}: {
  crew: Crew | null;
  onChanged: (c: Crew | null) => void;
}) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const join = async () => {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch('/api/leaderboard/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const d = await res.json();
      if (res.ok) {
        onChanged(d.crew);
        setCode('');
      } else {
        setErr(d.error ?? 'Could not join.');
      }
    } catch {
      setErr('Network error — try again.');
    } finally {
      setBusy(false);
    }
  };

  const leave = async () => {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch('/api/leaderboard/crew', { method: 'DELETE' });
      const d = await res.json();
      if (res.ok) {
        onChanged(d.crew ?? null);
        setConfirmLeave(false);
      } else {
        setErr(d.error ?? 'Could not leave.');
      }
    } catch {
      setErr('Network error — try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
      <div>
        <h2 className="font-black text-chess-text">Crew</h2>
        <p className="text-sm text-chess-text-muted mt-0.5">
          {crew ? (
            <>
              You fight for <span className="font-bold text-chess-text">{crew.name}</span>.
            </>
          ) : (
            <>
              Not in a crew. Training at Gleason&apos;s? Use code{' '}
              <span className="font-bold text-chess-text">NYC</span>.
            </>
          )}
        </p>
      </div>

      {!crew && (
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Crew code"
            className="flex-1 min-w-0 rounded-xl border-2 border-slate-200 px-4 py-3 min-h-[44px] text-chess-text outline-none focus:border-[#e5484d] uppercase"
          />
          <button
            onClick={join}
            disabled={busy || !code.trim()}
            className="shrink-0 rounded-xl text-white font-bold px-5 py-3 min-h-[44px] disabled:opacity-50 tap-highlight"
            style={{ backgroundColor: ACCENT }}
          >
            {busy ? 'Joining…' : 'Join'}
          </button>
        </div>
      )}

      {crew &&
        (confirmLeave ? (
          <div className="flex gap-2">
            <button
              onClick={leave}
              disabled={busy}
              className="flex-1 rounded-xl text-white font-bold py-3 min-h-[44px] disabled:opacity-50 tap-highlight"
              style={{ backgroundColor: ACCENT }}
            >
              {busy ? 'Leaving…' : `Yes, leave ${crew.name}`}
            </button>
            <button
              onClick={() => setConfirmLeave(false)}
              className="flex-1 rounded-xl border border-slate-200 font-bold py-3 min-h-[44px] text-chess-text-muted tap-highlight"
            >
              Stay
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmLeave(true)}
            className="self-start rounded-xl border-2 font-bold text-sm px-4 py-2 min-h-[44px] tap-highlight"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            Leave crew
          </button>
        ))}

      {err && <p className="text-sm text-red-500">{err}</p>}
    </section>
  );
}

/* ── Leaderboard opt-in ──────────────────────────────────────────────────── */

function OptInSection({
  optIn,
  onChanged,
}: {
  optIn: boolean | null;
  onChanged: (v: boolean) => void;
}) {
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (optIn === null || busy) return;
    const next = !optIn;
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch('/api/profile/leaderboard-opt-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optIn: next }),
      });
      if (res.ok) {
        onChanged(next);
      } else {
        const d = await res.json().catch(() => null);
        setErr(d?.error ?? 'Could not save.');
      }
    } catch {
      setErr('Network error — try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2">
      <ToggleRow
        title="Global leaderboard"
        sub="Show my handle and scores on the global board. Crew boards always show crew members."
        on={optIn ?? true}
        disabled={optIn === null || busy}
        onToggle={toggle}
      />
      {err && <p className="text-sm text-red-500">{err}</p>}
    </section>
  );
}

/* ── Camera ──────────────────────────────────────────────────────────────── */

type CamPermission = 'granted' | 'denied' | 'prompt' | 'unknown';

function CameraSection() {
  const [camOn, setCamOn] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<CamPermission>('unknown');

  useEffect(() => {
    try {
      setCamOn(localStorage.getItem(CAMERA_KEY) !== '0'); // default on
    } catch {
      setCamOn(true);
    }

    // Cheap read of the browser permission state, where supported.
    try {
      navigator.permissions
        ?.query({ name: 'camera' as PermissionName })
        .then((status) => {
          setPermission(status.state as CamPermission);
          status.onchange = () => setPermission(status.state as CamPermission);
        })
        .catch(() => {});
    } catch {
      /* Safari without camera permission query — leave as unknown */
    }
  }, []);

  const toggle = () => {
    if (camOn === null) return;
    const next = !camOn;
    setCamOn(next);
    try {
      localStorage.setItem(CAMERA_KEY, next ? '1' : '0');
    } catch {
      /* private mode — toggle is session-only */
    }
  };

  const permissionLabel: Record<CamPermission, string | null> = {
    granted: 'Camera access: allowed',
    denied: 'Camera access: blocked in your device settings',
    prompt: 'Camera access: you will be asked when the round starts',
    unknown: null,
  };

  return (
    <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2">
      <ToggleRow
        title="Punch counter camera"
        sub="Use the front camera to count punches during boxing rounds. Video stays on your device — nothing is recorded or uploaded."
        on={camOn ?? true}
        disabled={camOn === null}
        onToggle={toggle}
      />
      {permissionLabel[permission] && (
        <p
          className={`text-xs font-semibold ${
            permission === 'denied' ? 'text-red-500' : 'text-chess-text-muted'
          }`}
        >
          {permissionLabel[permission]}
        </p>
      )}
      <p className="text-xs text-chess-text-muted">
        Saved on this device. For now the workout also asks at the start of
        each session.
      </p>
    </section>
  );
}

/* ── Shared toggle row ───────────────────────────────────────────────────── */

function ToggleRow({
  title,
  sub,
  on,
  disabled,
  onToggle,
}: {
  title: string;
  sub: string;
  on: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-black text-chess-text">{title}</h2>
        <p className="text-sm text-chess-text-muted mt-0.5">{sub}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={title}
        onClick={onToggle}
        disabled={disabled}
        className="shrink-0 relative w-[52px] h-8 rounded-full transition-colors disabled:opacity-50 tap-highlight"
        style={{ backgroundColor: on ? ACCENT : '#cbd5e1' }}
      >
        <span
          className="absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all"
          style={{ left: on ? 24 : 4 }}
        />
      </button>
    </div>
  );
}
