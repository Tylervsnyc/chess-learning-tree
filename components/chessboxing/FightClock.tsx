'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getSharedAudioContext,
  playBoxingBell,
  playTabSwitchSound,
  warmupAudio,
} from '@/lib/sounds';
import {
  BANK_SECONDS_PER_CHESS_ROUND,
  BOUT_FORMATS,
  BOXING_ROUND_SECONDS,
  BREAK_SECONDS,
  CHESS_ROUND_SECONDS,
  OFFICIAL_CARD,
} from '@/lib/bout/bout';

/**
 * FightClock — the /box/clock screen, two modes picked at the top:
 *
 *   Chess Clock  — the phone lies flat between two players at a real board:
 *                  two tap halves (top rotated 180° for the opponent), tap your
 *                  own half to end your turn. Fischer increment, pause, low-time
 *                  warning, bell on flag.
 *   Boxing Timer — the full chess boxing format for two real people at a board
 *                  and a bag: chess round → bell → break → boxing round → bell →
 *                  break → chess round … using the round constants from
 *                  lib/bout/bout.ts. During chess rounds the two-sided chess
 *                  clock runs (same halves); each player's clock pauses across
 *                  the boxing round and resumes at the next chess bell. Boxing
 *                  rounds and breaks are one big countdown mirrored so both
 *                  sides of the phone can read it.
 *
 * Fully offline once loaded — no account, no network, nothing stored
 * server-side. Prefs live in localStorage.
 *
 * Timing is deadline-based (Date.now() against a stored deadline), not
 * tick-counting, so background-tab throttling can't drift the clock.
 */

type Mode = 'chess' | 'boxing';
const MODE_KEY = 'cp_clock_mode';

function loadMode(): Mode {
  try {
    return localStorage.getItem(MODE_KEY) === 'boxing' ? 'boxing' : 'chess';
  } catch {
    return 'chess';
  }
}

function saveMode(m: Mode) {
  try {
    localStorage.setItem(MODE_KEY, m);
  } catch {
    /* private mode */
  }
}

type Preset = { label: string; group: string; minutes: number; increment: number };

const PRESETS: Preset[] = [
  { label: '1+0', group: 'Bullet', minutes: 1, increment: 0 },
  { label: '2+1', group: 'Bullet', minutes: 2, increment: 1 },
  { label: '3+0', group: 'Blitz', minutes: 3, increment: 0 },
  { label: '3+2', group: 'Blitz', minutes: 3, increment: 2 },
  { label: '5+0', group: 'Blitz', minutes: 5, increment: 0 },
  { label: '5+3', group: 'Blitz', minutes: 5, increment: 3 },
  { label: '10+0', group: 'Rapid', minutes: 10, increment: 0 },
  { label: '10+5', group: 'Rapid', minutes: 10, increment: 5 },
  { label: '15+10', group: 'Rapid', minutes: 15, increment: 10 },
];

const PREFS_KEY = 'cp_fight_clock_prefs';

type Side = 'top' | 'bottom';
type Phase = 'setup' | 'ready' | 'running' | 'paused' | 'flagged';

type ClockState = {
  /** ms remaining for each side, authoritative while that side is NOT running */
  remaining: Record<Side, number>;
  /** Date.now() at which the running side hits zero (only while running) */
  deadline: number | null;
  active: Side | null;
  moves: Record<Side, number>;
};

function loadPrefs(): { minutes: number; increment: number; sound: boolean } {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.minutes === 'number' && typeof p.increment === 'number') {
        return { minutes: p.minutes, increment: p.increment, sound: p.sound !== false };
      }
    }
  } catch {
    /* fresh device */
  }
  return { minutes: 5, increment: 0, sound: true };
}

function savePrefs(p: { minutes: number; increment: number; sound: boolean }) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    /* private mode */
  }
}

/** m:ss above 20s, m:ss.t at 20s and under — tenths when it matters. */
function formatMs(ms: number, low: boolean): string {
  const clamped = Math.max(0, ms);
  const totalSec = Math.floor(clamped / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (low) {
    const tenths = Math.floor((clamped % 1000) / 100);
    return `${m}:${String(s).padStart(2, '0')}.${tenths}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Short beep for the low-time threshold crossing. */
function playLowTimeBeep() {
  const ctx = getSharedAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

/** Keep the screen awake while a clock lives (re-acquired when the tab returns). */
function useWakeLock(active: boolean) {
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const request = async () => {
      try {
        wakeLock.current = await navigator.wakeLock?.request('screen');
        if (cancelled) void wakeLock.current?.release();
      } catch {
        /* not supported / low battery — clock still works */
      }
    };
    void request();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void request();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      void wakeLock.current?.release();
      wakeLock.current = null;
    };
  }, [active]);
}

/* ---------------- mode switch ---------------- */

export function FightClock() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('chess');

  useEffect(() => {
    setMode(loadMode());
  }, []);

  const pick = (m: Mode) => {
    setMode(m);
    saveMode(m);
  };
  const onExit = () => router.push('/box');
  const modeSwitch = <ModeSwitch mode={mode} onPick={pick} />;

  return mode === 'boxing' ? (
    <BoxingTimer modeSwitch={modeSwitch} onExit={onExit} />
  ) : (
    <ChessClock modeSwitch={modeSwitch} onExit={onExit} />
  );
}

function ModeSwitch({ mode, onPick }: { mode: Mode; onPick: (m: Mode) => void }) {
  const options: { id: Mode; label: string }[] = [
    { id: 'chess', label: 'Chess Clock' },
    { id: 'boxing', label: 'Boxing Timer' },
  ];
  return (
    <div
      role="tablist"
      aria-label="Clock mode"
      className="mt-4 grid grid-cols-2 gap-1 rounded-2xl border-2 border-slate-700 bg-slate-800 p-1"
    >
      {options.map((o) => {
        const selected = o.id === mode;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onPick(o.id)}
            className="rounded-xl py-2.5 text-sm font-black transition-colors tap-highlight"
            style={{
              background: selected ? '#FF4B4B' : 'transparent',
              color: selected ? '#fff' : '#94a3b8',
              boxShadow: selected ? '0 3px 0 0 #CC3939' : 'none',
              minHeight: 44,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Chess Clock ---------------- */

function ChessClock({ modeSwitch, onExit }: { modeSwitch: React.ReactNode; onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [minutes, setMinutes] = useState(5);
  const [increment, setIncrement] = useState(0);
  const [sound, setSound] = useState(true);
  const [clock, setClock] = useState<ClockState>({
    remaining: { top: 0, bottom: 0 },
    deadline: null,
    active: null,
    moves: { top: 0, bottom: 0 },
  });
  /** repaint driver while running — the deadline holds the truth */
  const [, setTick] = useState(0);
  const lowBeepFired = useRef<Record<Side, boolean>>({ top: false, bottom: false });

  useEffect(() => {
    const p = loadPrefs();
    setMinutes(p.minutes);
    setIncrement(p.increment);
    setSound(p.sound);
  }, []);

  const baseMs = minutes * 60_000;
  const lowThreshold = Math.min(20_000, Math.max(5_000, baseMs / 10));

  const remainingOf = useCallback(
    (side: Side): number => {
      if (clock.active === side && clock.deadline !== null && phase === 'running') {
        return clock.deadline - Date.now();
      }
      return clock.remaining[side];
    },
    [clock, phase],
  );

  /* ---- ticking + flag detection ---- */
  useEffect(() => {
    if (phase !== 'running' || !clock.active || clock.deadline === null) return;
    const id = setInterval(() => {
      const left = clock.deadline! - Date.now();
      const side = clock.active!;
      if (left <= lowThreshold && !lowBeepFired.current[side]) {
        lowBeepFired.current[side] = true;
        if (sound) playLowTimeBeep();
      }
      if (left <= 0) {
        setClock((c) => ({
          ...c,
          remaining: { ...c.remaining, [side]: 0 },
          deadline: null,
        }));
        setPhase('flagged');
        if (sound) void playBoxingBell();
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        return;
      }
      setTick((t) => t + 1);
    }, 100);
    return () => clearInterval(id);
  }, [phase, clock.active, clock.deadline, lowThreshold, sound]);

  useWakeLock(phase !== 'setup');

  /* ---- actions ---- */

  const startGame = () => {
    warmupAudio();
    savePrefs({ minutes, increment, sound });
    lowBeepFired.current = { top: false, bottom: false };
    setClock({
      remaining: { top: baseMs, bottom: baseMs },
      deadline: null,
      active: null,
      moves: { top: 0, bottom: 0 },
    });
    setPhase('ready');
  };

  const tapSide = (side: Side) => {
    if (phase === 'ready') {
      // First tap: the tapper is ready — the OTHER player's clock starts.
      const other: Side = side === 'top' ? 'bottom' : 'top';
      setClock((c) => ({
        ...c,
        active: other,
        deadline: Date.now() + c.remaining[other],
      }));
      setPhase('running');
      if (sound) void playTabSwitchSound();
      return;
    }
    if (phase !== 'running' || clock.active !== side || clock.deadline === null) return;
    // My move is done: bank my time (+ increment), start the opponent.
    const left = Math.max(0, clock.deadline - Date.now());
    const other: Side = side === 'top' ? 'bottom' : 'top';
    const banked = left + increment * 1000;
    if (banked > lowThreshold) lowBeepFired.current[side] = false;
    setClock((c) => ({
      remaining: { ...c.remaining, [side]: banked },
      deadline: Date.now() + c.remaining[other],
      active: other,
      moves: { ...c.moves, [side]: c.moves[side] + 1 },
    }));
    if (sound) void playTabSwitchSound();
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const pause = () => {
    if (phase !== 'running' || !clock.active || clock.deadline === null) return;
    const left = Math.max(0, clock.deadline - Date.now());
    setClock((c) => ({
      ...c,
      remaining: { ...c.remaining, [c.active!]: left },
      deadline: null,
    }));
    setPhase('paused');
  };

  const resume = () => {
    if (phase !== 'paused' || !clock.active) return;
    setClock((c) => ({ ...c, deadline: Date.now() + c.remaining[c.active!] }));
    setPhase('running');
  };

  const toSetup = () => setPhase('setup');

  /* ---- render ---- */

  if (phase === 'setup') {
    return (
      <SetupScreen
        minutes={minutes}
        increment={increment}
        sound={sound}
        setMinutes={setMinutes}
        setIncrement={setIncrement}
        setSound={(s) => {
          setSound(s);
          savePrefs({ minutes, increment, sound: s });
        }}
        onStart={startGame}
        onExit={onExit}
        modeSwitch={modeSwitch}
      />
    );
  }

  const flaggedSide: Side | null =
    phase === 'flagged' ? (clock.remaining.top === 0 ? 'top' : 'bottom') : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 select-none" style={{ touchAction: 'manipulation' }}>
      <ClockHalf
        side="top"
        rotated
        phase={phase}
        active={clock.active === 'top'}
        ms={remainingOf('top')}
        total={baseMs}
        low={remainingOf('top') <= lowThreshold}
        moves={clock.moves.top}
        flagged={flaggedSide === 'top'}
        winner={flaggedSide === 'bottom'}
        onTap={() => tapSide('top')}
      />

      {/* center strip — readable from the bottom player's seat */}
      <div className="shrink-0 bg-slate-900 border-y-2 border-slate-800 px-4 py-2 flex items-center justify-center gap-3">
        {phase === 'flagged' ? (
          <>
            <ControlButton label="Rematch" accent="#58CC02" onClick={startGame} />
            <ControlButton label="New clock" accent="#1CB0F6" onClick={toSetup} />
          </>
        ) : phase === 'paused' ? (
          <>
            <ControlButton label="Resume" accent="#58CC02" onClick={resume} />
            <ControlButton label="Reset" accent="#FF4B4B" onClick={startGame} />
            <ControlButton label="Exit" accent="#1CB0F6" onClick={toSetup} />
          </>
        ) : phase === 'ready' ? (
          <p className="text-sm font-extrabold text-slate-300 text-center py-1.5">
            Tap your side when ready — it starts your opponent
          </p>
        ) : (
          <ControlButton label="Pause" accent="#FFC800" dark onClick={pause} />
        )}
      </div>

      <ClockHalf
        side="bottom"
        rotated={false}
        phase={phase}
        active={clock.active === 'bottom'}
        ms={remainingOf('bottom')}
        total={baseMs}
        low={remainingOf('bottom') <= lowThreshold}
        moves={clock.moves.bottom}
        flagged={flaggedSide === 'bottom'}
        winner={flaggedSide === 'top'}
        onTap={() => tapSide('bottom')}
      />
    </div>
  );
}

function ClockHalf({
  rotated,
  phase,
  active,
  ms,
  total,
  low,
  moves,
  flagged,
  winner,
  onTap,
}: {
  side: Side;
  rotated: boolean;
  phase: Phase;
  active: boolean;
  ms: number;
  /** Starting time for this side, so the fill can show what's left. */
  total: number;
  low: boolean;
  moves: number;
  flagged: boolean;
  winner: boolean;
  onTap: () => void;
}) {
  const live = phase === 'running' && active;
  const tappable = live || phase === 'ready';
  // The half's color FILLS in proportion to time left: full at the start,
  // draining toward the player's own edge (the top half is rotated, so its
  // "bottom" is the top of the phone — each player watches their own pool).
  // Increment can push a clock above its start; clamp so it never overflows.
  const fraction = total > 0 ? Math.max(0, Math.min(1, ms / total)) : 1;
  const fill = flagged
    ? '#7f1d1d'
    : winner
      ? '#14532d'
      : live
        ? low
          ? '#b91c1c'
          : '#166534'
        : '#1e293b';
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={phase === 'paused' || phase === 'flagged'}
      className="relative flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden tap-highlight"
      style={{
        background: '#0f172a',
        transform: rotated ? 'rotate(180deg)' : undefined,
        opacity: phase === 'paused' ? 0.6 : 1,
        cursor: tappable ? 'pointer' : 'default',
      }}
      aria-label={rotated ? 'Opponent clock' : 'Your clock'}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 transition-[height,background-color] duration-200 ease-linear"
        style={{ height: `${fraction * 100}%`, background: fill }}
      />
      <span
        className={`relative font-black tabular-nums leading-none ${low && live ? 'animate-pulse' : ''}`}
        style={{
          fontSize: 'min(24vw, 18vh)',
          color: live || flagged || winner ? '#fff' : '#94a3b8',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatMs(ms, ms <= 20_000)}
      </span>
      <span className="relative mt-2 text-sm font-bold" style={{ color: live ? 'rgba(255,255,255,0.8)' : '#64748b' }}>
        {flagged
          ? 'Flag — out of time'
          : winner
            ? 'Wins on time'
            : phase === 'ready'
              ? 'Tap when ready'
              : live
                ? 'Your move — tap when done'
                : `Moves: ${moves}`}
      </span>
    </button>
  );
}

function ControlButton({
  label,
  accent,
  dark,
  onClick,
}: {
  label: string;
  accent: string;
  dark?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl px-5 py-2 text-sm font-black text-white active:translate-y-[2px] active:shadow-none transition-transform tap-highlight"
      style={{
        background: accent,
        color: dark ? '#3c3000' : '#fff',
        boxShadow: `0 3px 0 0 rgba(0,0,0,0.35)`,
        minHeight: 44,
      }}
    >
      {label}
    </button>
  );
}

/* ---------------- setup ---------------- */

function SetupScreen({
  minutes,
  increment,
  sound,
  setMinutes,
  setIncrement,
  setSound,
  onStart,
  onExit,
  modeSwitch,
}: {
  minutes: number;
  increment: number;
  sound: boolean;
  setMinutes: (m: number) => void;
  setIncrement: (i: number) => void;
  setSound: (s: boolean) => void;
  onStart: () => void;
  onExit: () => void;
  modeSwitch: React.ReactNode;
}) {
  const activePreset = PRESETS.find((p) => p.minutes === minutes && p.increment === increment);
  const groups = ['Bullet', 'Blitz', 'Rapid'];
  return (
    <SetupShell
      title="Chess Clock"
      blurb="Lay the phone between you. Tap your side to end your turn."
      modeSwitch={modeSwitch}
      onExit={onExit}
    >
        {groups.map((g) => (
          <div key={g} className="mt-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">{g}</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {PRESETS.filter((p) => p.group === g).map((p) => {
                const selected = activePreset?.label === p.label;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setMinutes(p.minutes);
                      setIncrement(p.increment);
                    }}
                    className="rounded-2xl border-2 py-3 text-lg font-black transition-transform active:translate-y-[2px] tap-highlight"
                    style={{
                      background: selected ? '#FF4B4B' : '#1e293b',
                      borderColor: selected ? '#CC3939' : '#334155',
                      boxShadow: selected ? '0 3px 0 0 #CC3939' : 'none',
                      color: selected ? '#fff' : '#cbd5e1',
                      minHeight: 44,
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Custom</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Stepper label="Minutes" value={minutes} min={1} max={90} onChange={setMinutes} />
            <Stepper label="Increment (s)" value={increment} min={0} max={60} onChange={setIncrement} />
          </div>
        </div>

        <SoundToggle sound={sound} setSound={setSound} />

        <div className="flex-1" />

        <StartButton label={`Start ${minutes}+${increment}`} onClick={onStart} />
    </SetupShell>
  );
}

/** Shared chrome for both setup screens: title, Close, mode switch, blurb. */
function SetupShell({
  title,
  blurb,
  modeSwitch,
  onExit,
  children,
}: {
  title: string;
  blurb: string;
  modeSwitch: React.ReactNode;
  onExit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-auto">
      <div className="w-full max-w-lg mx-auto px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-[calc(env(safe-area-inset-bottom)+20px)] flex flex-col min-h-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">{title}</h1>
          <button
            type="button"
            onClick={onExit}
            className="text-sm font-bold text-slate-400 px-3 py-2 tap-highlight"
            style={{ minHeight: 44 }}
          >
            Close
          </button>
        </div>
        {modeSwitch}
        <p className="mt-3 text-sm font-semibold text-slate-400">{blurb}</p>
        {children}
      </div>
    </div>
  );
}

function SoundToggle({ sound, setSound }: { sound: boolean; setSound: (s: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => setSound(!sound)}
      className="mt-4 flex items-center justify-between rounded-2xl border-2 border-slate-700 bg-slate-800 px-4 py-3 tap-highlight"
      style={{ minHeight: 44 }}
    >
      <span className="text-sm font-bold text-slate-200">Sounds</span>
      <span
        className="text-xs font-black rounded-full px-3 py-1"
        style={{ background: sound ? '#58CC02' : '#334155', color: sound ? '#fff' : '#94a3b8' }}
      >
        {sound ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}

function StartButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 w-full rounded-2xl bg-[#58CC02] py-4 text-lg font-black text-white active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
      style={{ boxShadow: '0 4px 0 0 #3d8c01', minHeight: 44 }}
    >
      {label}
    </button>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-700 bg-slate-800 px-3 py-2">
      <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1 flex items-center justify-between">
        <StepBtn label="−" onClick={() => onChange(Math.max(min, value - 1))} />
        <span className="text-xl font-black tabular-nums">{value}</span>
        <StepBtn label="+" onClick={() => onChange(Math.min(max, value + 1))} />
      </div>
    </div>
  );
}

function StepBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-11 h-11 rounded-xl bg-slate-700 text-xl font-black text-white active:translate-y-[2px] transition-transform tap-highlight"
    >
      {label}
    </button>
  );
}

/* ---------------- Boxing Timer ---------------- */

/**
 * The card for two real people: chess rounds alternate with boxing rounds, a
 * break between every round. Boxing rounds are always chess rounds minus one
 * (chess opens and closes the match — same rule as lib/bout/bout.ts).
 */
type TimerCard = {
  chessRounds: number;
  chessMinutes: number;
  boxingMinutes: number;
  breakMinutes: number;
  /** each player's chess clock for the whole match, in minutes */
  clockMinutes: number;
};

type TimerPreset = { id: string; label: string; sub: string; card: TimerCard };

const TIMER_PREFS_KEY = 'cp_boxing_timer_prefs';

/** Each player's chess clock: the sport's per-round bank × rounds, in minutes. */
const bankMinutes = (chessRounds: number) =>
  Math.max(1, Math.round((chessRounds * BANK_SECONDS_PER_CHESS_ROUND) / 60));

function stockCard(chessRounds: number, chessSeconds = CHESS_ROUND_SECONDS, boxingSeconds = BOXING_ROUND_SECONDS): TimerCard {
  return {
    chessRounds,
    chessMinutes: Math.max(1, Math.round(chessSeconds / 60)),
    boxingMinutes: Math.max(1, Math.round(boxingSeconds / 60)),
    breakMinutes: Math.round(BREAK_SECONDS / 60),
    clockMinutes: bankMinutes(chessRounds),
  };
}

const TIMER_PRESETS: TimerPreset[] = [
  {
    id: 'sparring',
    label: BOUT_FORMATS.sparring.label,
    sub: `${BOUT_FORMATS.sparring.chessRounds} chess · ${BOUT_FORMATS.sparring.chessRounds - 1} boxing`,
    card: stockCard(BOUT_FORMATS.sparring.chessRounds),
  },
  {
    id: 'standard',
    label: BOUT_FORMATS.standard.label,
    sub: `${BOUT_FORMATS.standard.chessRounds} chess · ${BOUT_FORMATS.standard.chessRounds - 1} boxing`,
    card: stockCard(BOUT_FORMATS.standard.chessRounds),
  },
  {
    id: 'official',
    label: 'Official',
    sub: `${OFFICIAL_CARD.chessRounds * 2 - 1} rounds · ${OFFICIAL_CARD.chessRounds} chess · ${OFFICIAL_CARD.chessRounds - 1} boxing`,
    card: stockCard(OFFICIAL_CARD.chessRounds, OFFICIAL_CARD.chessSeconds, OFFICIAL_CARD.boxingSeconds),
  },
];

const sameCard = (a: TimerCard, b: TimerCard) =>
  a.chessRounds === b.chessRounds &&
  a.chessMinutes === b.chessMinutes &&
  a.boxingMinutes === b.boxingMinutes &&
  a.breakMinutes === b.breakMinutes &&
  a.clockMinutes === b.clockMinutes;

function loadTimerPrefs(): { card: TimerCard; sound: boolean } {
  try {
    const raw = localStorage.getItem(TIMER_PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const c = p.card;
      if (
        c &&
        [c.chessRounds, c.chessMinutes, c.boxingMinutes, c.breakMinutes, c.clockMinutes].every(
          (v) => typeof v === 'number' && Number.isFinite(v),
        )
      ) {
        return { card: c as TimerCard, sound: p.sound !== false };
      }
    }
  } catch {
    /* fresh device */
  }
  return { card: TIMER_PRESETS[1].card, sound: true };
}

function saveTimerPrefs(p: { card: TimerCard; sound: boolean }) {
  try {
    localStorage.setItem(TIMER_PREFS_KEY, JSON.stringify(p));
  } catch {
    /* private mode */
  }
}

type SegKind = 'chess' | 'boxing' | 'break';
type Seg = { kind: SegKind; ms: number; round: number };

/** chess 1 · break · boxing 1 · break · chess 2 · … · chess N. Zero-minute breaks are skipped. */
function buildTimerSegments(card: TimerCard): Seg[] {
  const segs: Seg[] = [];
  for (let i = 1; i <= card.chessRounds; i++) {
    segs.push({ kind: 'chess', ms: card.chessMinutes * 60_000, round: i });
    if (i < card.chessRounds) {
      if (card.breakMinutes > 0) segs.push({ kind: 'break', ms: card.breakMinutes * 60_000, round: i });
      segs.push({ kind: 'boxing', ms: card.boxingMinutes * 60_000, round: i });
      if (card.breakMinutes > 0) segs.push({ kind: 'break', ms: card.breakMinutes * 60_000, round: i });
    }
  }
  return segs;
}

function segTitle(seg: Seg, card: TimerCard): string {
  if (seg.kind === 'chess') return `Chess round ${seg.round} of ${card.chessRounds}`;
  if (seg.kind === 'boxing') return `Boxing round ${seg.round} of ${card.chessRounds - 1}`;
  return 'Break';
}

function nextTitle(segs: Seg[], idx: number, card: TimerCard): string {
  const next = segs[idx + 1];
  return next ? `Next: ${segTitle(next, card)}` : 'Next: final bell';
}

const ROUND_WARNING_MS = 10_000;

/** Bank the running side's time so the chess clock stops. */
function freezeClock(c: ClockState): ClockState {
  if (!c.active || c.deadline === null) return c;
  return {
    ...c,
    remaining: { ...c.remaining, [c.active]: Math.max(0, c.deadline - Date.now()) },
    deadline: null,
  };
}

type TimerPhase = 'setup' | 'ready' | 'running' | 'paused' | 'flagged' | 'done';

function BoxingTimer({ modeSwitch, onExit }: { modeSwitch: React.ReactNode; onExit: () => void }) {
  const [phase, setPhase] = useState<TimerPhase>('setup');
  const [card, setCard] = useState<TimerCard>(TIMER_PRESETS[1].card);
  const [sound, setSound] = useState(true);
  const [segs, setSegs] = useState<Seg[]>([]);
  const [segIdx, setSegIdx] = useState(0);
  /** Date.now() at which the current round/break ends (only while it runs) */
  const [segDeadline, setSegDeadline] = useState<number | null>(null);
  /** ms left in the current round/break, authoritative while it is NOT running */
  const [segRemaining, setSegRemaining] = useState(0);
  const [clock, setClock] = useState<ClockState>({
    remaining: { top: 0, bottom: 0 },
    deadline: null,
    active: null,
    moves: { top: 0, bottom: 0 },
  });
  const [, setTick] = useState(0);
  const lowBeepFired = useRef<Record<Side, boolean>>({ top: false, bottom: false });
  const warnFired = useRef(false);

  useEffect(() => {
    const p = loadTimerPrefs();
    setCard(p.card);
    setSound(p.sound);
  }, []);

  useWakeLock(phase !== 'setup');

  const seg: Seg | undefined = segs[segIdx];
  const bankMs = card.clockMinutes * 60_000;
  const lowThreshold = Math.min(20_000, Math.max(5_000, bankMs / 10));

  const segLeft = segDeadline !== null ? segDeadline - Date.now() : segRemaining;

  const remainingOf = useCallback(
    (side: Side): number => {
      if (clock.active === side && clock.deadline !== null && phase === 'running') {
        return clock.deadline - Date.now();
      }
      return clock.remaining[side];
    },
    [clock, phase],
  );

  /** Round over: bell, freeze the chess clock, move to the next segment. */
  const advance = useCallback(
    (fromIdx: number) => {
      if (sound) void playBoxingBell();
      if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
      warnFired.current = false;
      const next = segs[fromIdx + 1];
      if (!next) {
        setClock((c) => freezeClock(c));
        setSegDeadline(null);
        setSegRemaining(0);
        setPhase('done');
        return;
      }
      const now = Date.now();
      setSegIdx(fromIdx + 1);
      setSegDeadline(now + next.ms);
      setSegRemaining(next.ms);
      setClock((c) => {
        const frozen = freezeClock(c);
        if (next.kind === 'chess' && frozen.active) {
          // The bell restarts whoever was to move.
          return { ...frozen, deadline: now + frozen.remaining[frozen.active] };
        }
        return frozen;
      });
      // A chess round nobody has tapped into yet waits for the first tap.
      setPhase(next.kind === 'chess' && !clock.active ? 'ready' : 'running');
    },
    [segs, sound, clock.active],
  );

  /* ---- ticking: round bell, 10-second warning, chess flag ---- */
  useEffect(() => {
    if (phase !== 'running' && phase !== 'ready') return;
    if (segDeadline === null) return;
    const id = setInterval(() => {
      const left = segDeadline - Date.now();
      if (left <= ROUND_WARNING_MS && !warnFired.current) {
        warnFired.current = true;
        if (sound) playLowTimeBeep();
      }
      if (left <= 0) {
        advance(segIdx);
        return;
      }
      if (phase === 'running' && seg?.kind === 'chess' && clock.active && clock.deadline !== null) {
        const chessLeft = clock.deadline - Date.now();
        const side = clock.active;
        if (chessLeft <= lowThreshold && !lowBeepFired.current[side]) {
          lowBeepFired.current[side] = true;
          if (sound) playLowTimeBeep();
        }
        if (chessLeft <= 0) {
          setClock((c) => ({ ...c, remaining: { ...c.remaining, [side]: 0 }, deadline: null }));
          setSegRemaining(Math.max(0, left));
          setSegDeadline(null);
          setPhase('flagged');
          if (sound) void playBoxingBell();
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          return;
        }
      }
      setTick((t) => t + 1);
    }, 100);
    return () => clearInterval(id);
  }, [phase, segDeadline, segIdx, seg?.kind, clock.active, clock.deadline, lowThreshold, sound, advance]);

  /* ---- actions ---- */

  const startMatch = () => {
    warmupAudio();
    saveTimerPrefs({ card, sound });
    lowBeepFired.current = { top: false, bottom: false };
    warnFired.current = false;
    const built = buildTimerSegments(card);
    setSegs(built);
    setSegIdx(0);
    setSegDeadline(null);
    setSegRemaining(built[0].ms);
    setClock({
      remaining: { top: bankMs, bottom: bankMs },
      deadline: null,
      active: null,
      moves: { top: 0, bottom: 0 },
    });
    setPhase('ready');
  };

  const tapSide = (side: Side) => {
    if (!seg || seg.kind !== 'chess') return;
    const other: Side = side === 'top' ? 'bottom' : 'top';
    if (phase === 'ready') {
      // First tap: the tapper is ready — the OTHER player's clock starts, and
      // so does the round if it hasn't already.
      const now = Date.now();
      setClock((c) => ({ ...c, active: other, deadline: now + c.remaining[other] }));
      if (segDeadline === null) setSegDeadline(now + segRemaining);
      setPhase('running');
      if (sound) void playTabSwitchSound();
      return;
    }
    if (phase !== 'running' || clock.active !== side || clock.deadline === null) return;
    const left = Math.max(0, clock.deadline - Date.now());
    if (left > lowThreshold) lowBeepFired.current[side] = false;
    setClock((c) => ({
      remaining: { ...c.remaining, [side]: left },
      deadline: Date.now() + c.remaining[other],
      active: other,
      moves: { ...c.moves, [side]: c.moves[side] + 1 },
    }));
    if (sound) void playTabSwitchSound();
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const pause = () => {
    if (phase !== 'running' || segDeadline === null) return;
    setSegRemaining(Math.max(0, segDeadline - Date.now()));
    setSegDeadline(null);
    setClock((c) => freezeClock(c));
    setPhase('paused');
  };

  const resume = () => {
    if (phase !== 'paused') return;
    const now = Date.now();
    setSegDeadline(now + segRemaining);
    setClock((c) =>
      seg?.kind === 'chess' && c.active ? { ...c, deadline: now + c.remaining[c.active] } : c,
    );
    setPhase('running');
  };

  /** Both fighters ready early: end the break now. */
  const skipBreak = () => {
    if (phase !== 'running' || seg?.kind !== 'break') return;
    advance(segIdx);
  };

  const toSetup = () => setPhase('setup');

  /* ---- render ---- */

  if (phase === 'setup') {
    return (
      <BoxingSetup
        card={card}
        sound={sound}
        setCard={setCard}
        setSound={(s) => {
          setSound(s);
          saveTimerPrefs({ card, sound: s });
        }}
        onStart={startMatch}
        onExit={onExit}
        modeSwitch={modeSwitch}
      />
    );
  }

  if (!seg) return null;

  const flaggedSide: Side | null =
    phase === 'flagged' ? (clock.remaining.top === 0 ? 'top' : 'bottom') : null;
  const title = phase === 'done' ? 'Final bell' : phase === 'flagged' ? 'Flag' : segTitle(seg, card);
  const sub =
    phase === 'done'
      ? 'That is the match'
      : phase === 'flagged'
        ? 'Decided on the clock'
        : nextTitle(segs, segIdx, card);
  const chessLayout = seg.kind === 'chess' || phase === 'flagged' || phase === 'done';

  const controls =
    phase === 'done' || phase === 'flagged' ? (
      <>
        <ControlButton label="Rematch" accent="#58CC02" onClick={startMatch} />
        <ControlButton label="New timer" accent="#1CB0F6" onClick={toSetup} />
      </>
    ) : phase === 'paused' ? (
      <>
        <ControlButton label="Resume" accent="#58CC02" onClick={resume} />
        <ControlButton label="Reset" accent="#FF4B4B" onClick={startMatch} />
        <ControlButton label="Exit" accent="#1CB0F6" onClick={toSetup} />
      </>
    ) : phase === 'ready' ? (
      <p className="text-sm font-extrabold text-slate-300 text-center py-1.5">
        Tap your side when ready — it starts your opponent
      </p>
    ) : (
      <>
        <ControlButton label="Pause" accent="#FFC800" dark onClick={pause} />
        {seg.kind === 'break' && <ControlButton label="Skip break" accent="#1CB0F6" onClick={skipBreak} />}
      </>
    );

  if (!chessLayout) {
    // Boxing round or break: one big countdown, mirrored so both corners read it.
    const low = segLeft <= ROUND_WARNING_MS && phase === 'running';
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 select-none" style={{ touchAction: 'manipulation' }}>
        <RoundHalf rotated kind={seg.kind} title={title} sub={sub} ms={segLeft} low={low} paused={phase === 'paused'} />
        <div className="shrink-0 bg-slate-900 border-y-2 border-slate-800 px-4 py-2 flex items-center justify-center gap-3">
          {controls}
        </div>
        <RoundHalf rotated={false} kind={seg.kind} title={title} sub={sub} ms={segLeft} low={low} paused={phase === 'paused'} />
      </div>
    );
  }

  const halfPhase: Phase =
    phase === 'done' ? 'flagged' : phase;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 select-none" style={{ touchAction: 'manipulation' }}>
      <ClockHalf
        side="top"
        rotated
        phase={halfPhase}
        active={clock.active === 'top'}
        ms={remainingOf('top')}
        total={bankMs}
        low={remainingOf('top') <= lowThreshold}
        moves={clock.moves.top}
        flagged={flaggedSide === 'top'}
        winner={flaggedSide === 'bottom'}
        onTap={() => tapSide('top')}
      />

      {/* center strip — round + countdown, readable from the bottom player's seat */}
      <div className="shrink-0 bg-slate-900 border-y-2 border-slate-800 px-4 py-2 flex flex-col items-center justify-center gap-1.5">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">{title}</span>
          {phase !== 'done' && (
            <span
              className={`text-2xl font-black tabular-nums leading-none ${segLeft <= ROUND_WARNING_MS && phase === 'running' ? 'text-[#FF4B4B] animate-pulse' : 'text-white'}`}
            >
              {formatMs(segLeft, false)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">{controls}</div>
      </div>

      <ClockHalf
        side="bottom"
        rotated={false}
        phase={halfPhase}
        active={clock.active === 'bottom'}
        ms={remainingOf('bottom')}
        total={bankMs}
        low={remainingOf('bottom') <= lowThreshold}
        moves={clock.moves.bottom}
        flagged={flaggedSide === 'bottom'}
        winner={flaggedSide === 'top'}
        onTap={() => tapSide('bottom')}
      />
    </div>
  );
}

/** One mirrored half of the boxing-round / break countdown. */
function RoundHalf({
  rotated,
  kind,
  title,
  sub,
  ms,
  low,
  paused,
}: {
  rotated: boolean;
  kind: SegKind;
  title: string;
  sub: string;
  ms: number;
  low: boolean;
  paused: boolean;
}) {
  const bg = kind === 'boxing' ? (low ? '#b91c1c' : '#7f1d1d') : low ? '#1d4ed8' : '#1e3a8a';
  return (
    <div
      className="relative flex-1 min-h-0 flex flex-col items-center justify-center transition-colors duration-150"
      style={{ background: bg, transform: rotated ? 'rotate(180deg)' : undefined, opacity: paused ? 0.6 : 1 }}
      aria-hidden={rotated}
    >
      <span className="text-sm font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {title}
      </span>
      <span
        className={`mt-1 font-black tabular-nums leading-none text-white ${low ? 'animate-pulse' : ''}`}
        style={{ fontSize: 'min(24vw, 18vh)', fontVariantNumeric: 'tabular-nums' }}
      >
        {formatMs(ms, false)}
      </span>
      <span className="mt-2 text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {paused ? 'Paused' : sub}
      </span>
    </div>
  );
}

function BoxingSetup({
  card,
  sound,
  setCard,
  setSound,
  onStart,
  onExit,
  modeSwitch,
}: {
  card: TimerCard;
  sound: boolean;
  setCard: (c: TimerCard) => void;
  setSound: (s: boolean) => void;
  onStart: () => void;
  onExit: () => void;
  modeSwitch: React.ReactNode;
}) {
  const activePreset = TIMER_PRESETS.find((p) => sameCard(p.card, card));
  const boxingRounds = card.chessRounds - 1;
  const totalMin =
    card.chessRounds * card.chessMinutes +
    boxingRounds * card.boxingMinutes +
    2 * boxingRounds * card.breakMinutes;
  const patch = (p: Partial<TimerCard>) => setCard({ ...card, ...p });

  return (
    <SetupShell
      title="Boxing Timer"
      blurb="Chess round, bell, boxing round, bell, break. The phone runs the whole match."
      modeSwitch={modeSwitch}
      onExit={onExit}
    >
      <div className="mt-5">
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">Format</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TIMER_PRESETS.map((p) => {
            const selected = activePreset?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setCard(p.card)}
                className="rounded-2xl border-2 px-2 py-3 transition-transform active:translate-y-[2px] tap-highlight"
                style={{
                  background: selected ? '#FF4B4B' : '#1e293b',
                  borderColor: selected ? '#CC3939' : '#334155',
                  boxShadow: selected ? '0 3px 0 0 #CC3939' : 'none',
                  color: selected ? '#fff' : '#cbd5e1',
                  minHeight: 44,
                }}
              >
                <span className="block text-lg font-black leading-tight">{p.label}</span>
                <span
                  className="block text-[11px] font-bold leading-tight mt-0.5"
                  style={{ color: selected ? 'rgba(255,255,255,0.85)' : '#94a3b8' }}
                >
                  {p.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">Custom</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Stepper
            label="Chess rounds"
            value={card.chessRounds}
            min={2}
            max={12}
            onChange={(v) => patch({ chessRounds: v, clockMinutes: bankMinutes(v) })}
          />
          <Stepper label="Each clock (min)" value={card.clockMinutes} min={1} max={60} onChange={(v) => patch({ clockMinutes: v })} />
          <Stepper label="Chess round (min)" value={card.chessMinutes} min={1} max={10} onChange={(v) => patch({ chessMinutes: v })} />
          <Stepper label="Boxing round (min)" value={card.boxingMinutes} min={1} max={10} onChange={(v) => patch({ boxingMinutes: v })} />
          <Stepper label="Break (min)" value={card.breakMinutes} min={0} max={5} onChange={(v) => patch({ breakMinutes: v })} />
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-400">
          {card.chessRounds} chess · {boxingRounds} boxing · {card.clockMinutes} min on each player&apos;s clock · about {totalMin} min total
        </p>
      </div>

      <SoundToggle sound={sound} setSound={setSound} />

      <div className="flex-1" />

      <StartButton label="Start Boxing Timer" onClick={onStart} />
    </SetupShell>
  );
}
