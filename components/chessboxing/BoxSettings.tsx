'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { useProGate } from '@/hooks/useProGate';

/**
 * BoxSettings — the Chess Boxing app's settings screen (/box/settings).
 *
 * HARD RULE (docs/chess-boxing-app-structure.md): no scrolling — the screen is
 * a compact row list that fits 375×667 minus the tab bar. Handle and Crew open
 * small SUB-PANELS (view swap, obvious back arrow) instead of expanding the
 * list, so no state can make the page taller than the window.
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
 * Logged-out users can still use the camera row; account-backed rows collapse
 * into a sign-in prompt.
 */

const CAMERA_KEY = 'cp:punch-camera';
const ACCENT = '#e5484d';

interface Crew {
  id: string;
  name: string;
}

type View = 'list' | 'handle' | 'crew' | 'delete';

export function BoxSettings() {
  // undefined = still loading; null = logged out.
  const [username, setUsername] = useState<string | null | undefined>(undefined);
  const [loggedOut, setLoggedOut] = useState(false);
  const [crew, setCrew] = useState<Crew | null>(null);
  const [optIn, setOptIn] = useState<boolean | null>(null);
  const [view, setView] = useState<View>('list');
  // CHESSBOXING_PRO: the "Go Pro" row + paywall (nothing renders while off).
  const pro = useProGate();

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

  const backToList = () => setView('list');

  return (
    <div className="h-full overflow-hidden bg-chess-page">
      <div className="max-w-lg md:max-w-xl mx-auto w-full h-full px-4 md:px-6 pt-3 pb-3 flex flex-col gap-3">
        {/* Header — back goes up one level, never traps */}
        <div className="flex items-center gap-2 shrink-0">
          {view === 'list' ? (
            <Link
              href="/box"
              aria-label="Back to Chess Boxing"
              className="flex items-center justify-center w-11 h-11 -ml-2 rounded-xl text-chess-text-muted tap-highlight"
            >
              <BackIcon />
            </Link>
          ) : (
            <button
              onClick={backToList}
              aria-label="Back to settings"
              className="flex items-center justify-center w-11 h-11 -ml-2 rounded-xl text-chess-text-muted tap-highlight"
            >
              <BackIcon />
            </button>
          )}
          <h1 className="text-xl md:text-2xl font-black text-chess-text">
            {view === 'list' ? 'Settings' : view === 'handle' ? 'Handle' : view === 'crew' ? 'Crew' : 'Delete account'}
          </h1>
        </div>

        {view === 'handle' && (
          <HandlePanel username={username} onSaved={(u) => { setUsername(u); backToList(); }} />
        )}
        {view === 'crew' && (
          <CrewPanel crew={crew} onChanged={(c) => { setCrew(c); backToList(); }} />
        )}
        {view === 'delete' && <DeletePanel onCancel={backToList} />}

        {view === 'list' && (
          <div className="flex flex-col gap-3 min-h-0">
            {loggedOut ? (
              <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 shrink-0">
                <div>
                  <h2 className="font-black text-chess-text">Your fighter profile</h2>
                  <p className="text-sm text-chess-text-muted mt-1">
                    Sign in to pick a handle, join a crew, and appear on the
                    leaderboards.{FEATURE_FLAGS.WORKOUT_PUNCH_CAM
                      ? ' Camera settings below work without an account.'
                      : ''}
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
              <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 shrink-0">
                <NavRow
                  title="Handle"
                  value={
                    username === undefined
                      ? 'Loading…'
                      : username
                        ? username
                        : 'Not set'
                  }
                  onClick={() => setView('handle')}
                  disabled={username === undefined}
                />
                <NavRow
                  title="Crew"
                  value={crew ? crew.name : 'Not in a crew'}
                  onClick={() => setView('crew')}
                />
                <div className="px-4 py-2.5">
                  <ToggleRow
                    title="Global leaderboard"
                    sub="Show my handle and scores on the global board."
                    on={optIn ?? true}
                    disabled={optIn === null}
                    onToggle={() => {
                      if (optIn === null) return;
                      const next = !optIn;
                      setOptIn(next); // optimistic; server confirms
                      fetch('/api/profile/leaderboard-opt-in', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ optIn: next }),
                      })
                        .then((r) => {
                          if (!r.ok) setOptIn(!next);
                        })
                        .catch(() => setOptIn(!next));
                    }}
                  />
                </div>
              </section>
            )}

            {FEATURE_FLAGS.CHESSBOXING_PRO && (
              <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 shrink-0">
                <NavRow
                  title="Chess Boxing Pro"
                  value={pro.isPro ? 'Active' : 'Go Pro'}
                  onClick={() => {
                    if (!pro.isPro) pro.openPaywall('settings');
                  }}
                  disabled={pro.isPro}
                />
              </section>
            )}

            {FEATURE_FLAGS.WORKOUT_PUNCH_CAM && <CameraSection />}

            {/* Account — Apple 5.1.1(v): in-app account deletion, reachable
                from settings. Row opens a sub-panel (view swap, no scroll). */}
            {!loggedOut && (
              <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 shrink-0">
                <NavRow
                  title="Sign out"
                  value=""
                  onClick={() => {
                    try { localStorage.clear(); } catch {}
                    window.location.href = '/api/auth/logout?next=/box';
                  }}
                />
                <NavRow title="Delete account" value="" danger onClick={() => setView('delete')} />
              </section>
            )}
          </div>
        )}
      </div>
      {pro.paywall}
    </div>
  );
}

/* ── Delete-account sub-panel ────────────────────────────────────────────── */

// Same endpoint as the web profile (/api/account/delete) — one implementation.
function DeletePanel({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const armed = text.trim() === 'DELETE';

  const onDelete = async () => {
    if (!armed || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      if (!res.ok) throw new Error('Delete failed');
      try { localStorage.clear(); } catch {}
      router.replace('/box');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again or email support.');
      setBusy(false);
    }
  };

  return (
    <section className="bg-chess-surface rounded-2xl border border-red-200 shadow-sm p-4 flex flex-col gap-3 shrink-0">
      <p className="text-sm text-chess-text">
        This permanently deletes your account, streak, rating, bouts and
        leaderboard entries. Type <strong>DELETE</strong> to confirm.
      </p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="DELETE"
        autoCapitalize="characters"
        autoCorrect="off"
        className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 text-sm text-chess-text bg-white focus:outline-none focus:border-red-400"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="flex-1 min-h-[44px] rounded-xl border border-slate-300 text-sm font-semibold text-chess-text-muted tap-highlight"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={!armed || busy}
          className="flex-1 min-h-[44px] rounded-xl bg-red-600 text-white text-sm font-bold disabled:opacity-40 tap-highlight"
        >
          {busy ? 'Deleting...' : 'Delete my account'}
        </button>
      </div>
    </section>
  );
}

/* ── Handle sub-panel ────────────────────────────────────────────────────── */

function HandlePanel({
  username,
  onSaved,
}: {
  username: string | null | undefined;
  onSaved: (u: string) => void;
}) {
  const [input, setInput] = useState(username ?? '');
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
      if (res.ok) onSaved(d.username);
      else setErr(d.error ?? 'Could not save handle.');
    } catch {
      setErr('Network error — try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 shrink-0">
      <p className="text-sm text-chess-text-muted">
        The name other fighters see on the boards.
      </p>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. brooklyn_bishop"
        maxLength={20}
        autoFocus
        autoCapitalize="none"
        autoCorrect="off"
        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 min-h-[44px] text-chess-text outline-none focus:border-[#e5484d]"
      />
      <p className="text-xs text-chess-text-muted">
        3–20 characters — letters, numbers, underscore.
      </p>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <button
        onClick={save}
        disabled={saving || input.trim().length < 3}
        className="rounded-xl text-white font-bold py-3 min-h-[44px] disabled:opacity-50 tap-highlight"
        style={{ backgroundColor: ACCENT }}
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </section>
  );
}

/* ── Crew sub-panel ──────────────────────────────────────────────────────── */

function CrewPanel({
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
      if (res.ok) onChanged(d.crew);
      else setErr(d.error ?? 'Could not join.');
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
      if (res.ok) onChanged(d.crew ?? null);
      else setErr(d.error ?? 'Could not leave.');
    } catch {
      setErr('Network error — try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 shrink-0">
      <p className="text-sm text-chess-text-muted">
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

      {!crew && (
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Crew code"
            autoFocus
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
    <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm px-4 py-2.5 flex flex-col gap-1 shrink-0">
      <ToggleRow
        title="Punch counter camera"
        sub="Counts punches during boxing rounds. Video never leaves your device."
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

/* ── Shared rows ─────────────────────────────────────────────────────────── */

function NavRow({
  title,
  value,
  onClick,
  disabled,
  danger,
}: {
  title: string;
  value: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 min-h-[52px] text-left tap-highlight disabled:opacity-60"
    >
      <span className={`font-black shrink-0 ${danger ? 'text-red-600' : 'text-chess-text'}`}>{title}</span>
      <span className="flex items-center gap-1.5 min-w-0">
        <span className="text-sm text-chess-text-muted truncate">{value}</span>
        <ChevronIcon />
      </span>
    </button>
  );
}

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
        <p className="text-xs text-chess-text-muted mt-0.5">{sub}</p>
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

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-slate-300 shrink-0">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
