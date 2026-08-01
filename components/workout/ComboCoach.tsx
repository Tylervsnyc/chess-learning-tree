'use client';

/**
 * Combo Coach UI (WORKOUT_COMBO_CALLS): lives inside the workout's exercise
 * segments. Rookie calls combos out loud (pre-generated clips, sequenced
 * client-side with randomization) while a big visual cue shows the numbers —
 * so it works muted too. First segment after a curriculum unlock opens with a
 * short teach clip + card for the new move (lib/workout/combo-coach.ts).
 *
 * Audio is chained per-word via the 'ended' event with a short inter-word gap;
 * when muted (or a clip 404s) a fixed per-word timer keeps the visual cadence.
 */

import { useEffect, useRef, useState } from 'react';
import {
  MOVES,
  MUTE_KEY,
  HYPE_CLIPS,
  ROUND_START_CLIP,
  clipUrl,
  comboGapMs,
  comboSessionCount,
  levelIndexForSessions,
  markTeachSeen,
  pendingTeachLevel,
  pickCombo,
  unlockedMoves,
} from '@/lib/workout/combo-coach';

/** Visual pace per word when audio isn't driving the rhythm. */
const MUTED_WORD_MS = 550;
/** Silence between words inside one combo call. */
const WORD_GAP_MS = 240;
/** Play a hype clip after this many combos (roughly). */
const HYPE_EVERY = 7;

export function ComboCoach({
  segmentSeconds,
  className = '',
}: {
  /** Length of this exercise segment (drives the cadence ramp). */
  segmentSeconds: number;
  className?: string;
}) {
  const [muted, setMuted] = useState(false);
  const [combo, setCombo] = useState<string[] | null>(null);
  const [litIndex, setLitIndex] = useState(-1);
  const [teach, setTeach] = useState<{ title: string; text: string } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const aliveRef = useRef(true);
  const mutedRef = useRef(false);
  const startedAtRef = useRef(0);
  const combosCalledRef = useRef(0);
  const prevComboRef = useRef<string[] | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    aliveRef.current = true;
    startedAtRef.current = Date.now();
    const stored = window.localStorage.getItem(MUTE_KEY) === '1';
    setMuted(stored);
    mutedRef.current = stored;

    const levelIdx = levelIndexForSessions(comboSessionCount());
    // Preload the atomic clips so calls land on the beat.
    for (const m of unlockedMoves(levelIdx)) {
      const a = new Audio(clipUrl(m.id));
      a.preload = 'auto';
    }

    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        if (aliveRef.current) fn();
      }, ms);
      timersRef.current.push(t);
    };

    /** Play one clip; resolve on end (or on a timer when muted / missing). */
    const play = (id: string, fallbackMs: number) =>
      new Promise<void>((resolve) => {
        if (!aliveRef.current) return resolve();
        if (mutedRef.current) return later(resolve, fallbackMs);
        const a = new Audio(clipUrl(id));
        audioRef.current = a;
        let done = false;
        const finish = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };
        a.onended = finish;
        a.onerror = () => later(finish, fallbackMs);
        a.play().catch(() => later(finish, fallbackMs));
        // Backstop: never let a wedged clip stall the round.
        later(finish, Math.max(fallbackMs, 4000));
      });

    const callCombo = async (moves: string[]) => {
      setCombo(moves);
      setLitIndex(-1);
      for (let i = 0; i < moves.length; i++) {
        if (!aliveRef.current) return;
        setLitIndex(i);
        await play(moves[i], MUTED_WORD_MS);
        if (i < moves.length - 1) await new Promise((r) => later(() => r(null), WORD_GAP_MS));
      }
      setLitIndex(moves.length); // whole combo shown as done
    };

    const loop = async () => {
      while (aliveRef.current) {
        const moves = pickCombo(levelIdx, prevComboRef.current);
        prevComboRef.current = moves;
        await callCombo(moves);
        combosCalledRef.current += 1;
        if (
          combosCalledRef.current % HYPE_EVERY === HYPE_EVERY - 1 &&
          !mutedRef.current
        ) {
          await play(HYPE_CLIPS[Math.floor(Math.random() * HYPE_CLIPS.length)], 0);
        }
        const elapsed01 =
          (Date.now() - startedAtRef.current) / 1000 / Math.max(30, segmentSeconds);
        await new Promise((r) => later(() => r(null), comboGapMs(elapsed01)));
      }
    };

    const start = async () => {
      const pending = pendingTeachLevel();
      if (pending) {
        setTeach({ title: pending.teachTitle, text: pending.teachText });
        markTeachSeen(pending.teachClip);
        await play(pending.teachClip, 6500);
        await new Promise((r) => later(() => r(null), 800));
        if (!aliveRef.current) return;
        setTeach(null);
      } else {
        await play(ROUND_START_CLIP, 1200);
      }
      loop();
    };
    start();

    return () => {
      aliveRef.current = false;
      for (const t of timersRef.current) clearTimeout(t);
      timersRef.current = [];
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const levelIdx = levelIndexForSessions(comboSessionCount());
  const legend = unlockedMoves(levelIdx);

  return (
    <div className={`w-full max-w-xs mx-auto ${className}`}>
      <div className="relative rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-4 pt-3 pb-3.5 text-center">
        <button
          onClick={() => {
            const next = !muted;
            setMuted(next);
            window.localStorage.setItem(MUTE_KEY, next ? '1' : '0');
            if (next && audioRef.current) audioRef.current.pause();
          }}
          aria-label={muted ? 'Unmute Rookie' : 'Mute Rookie'}
          className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-chess-text-muted"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {muted ? (
              <>
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <path d="m22 9-6 6M16 9l6 6" />
              </>
            ) : (
              <>
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
              </>
            )}
          </svg>
        </button>

        {teach ? (
          <div className="py-2">
            <div className="text-[11px] font-black uppercase tracking-widest text-amber-500">
              New move unlocked
            </div>
            <div className="text-lg font-black text-chess-text mt-1">{teach.title}</div>
            <p className="text-sm text-chess-text-muted mt-1.5 leading-relaxed">{teach.text}</p>
          </div>
        ) : combo ? (
          <>
            <div className="text-[11px] font-black uppercase tracking-widest text-chess-text-muted">
              Rookie calls it
            </div>
            <div className="flex items-end justify-center gap-3 mt-1.5 min-h-[64px]">
              {combo.map((id, i) => (
                <div key={`${id}-${i}`} className="flex flex-col items-center">
                  <span
                    className={`text-5xl font-black tabular-nums leading-none transition-all duration-150 ${
                      i === litIndex
                        ? 'text-amber-500 scale-110'
                        : i < litIndex
                          ? 'text-chess-text'
                          : 'text-slate-300'
                    }`}
                  >
                    {MOVES[id].cue}
                  </span>
                  <span
                    className={`text-[10px] font-bold tracking-wide mt-1 ${
                      i <= litIndex ? 'text-chess-text-muted' : 'text-slate-300'
                    }`}
                  >
                    {MOVES[id].name}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-4 text-sm font-semibold text-chess-text-muted">
            Hands up…
          </div>
        )}
      </div>

      {/* Unlocked-moves legend — the curriculum made visible */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2">
        {legend.map((m) => (
          <span key={m.id} className="text-[10px] font-bold text-chess-text-muted">
            <span className="text-chess-text">{m.cue}</span> {m.name}
          </span>
        ))}
      </div>
    </div>
  );
}
