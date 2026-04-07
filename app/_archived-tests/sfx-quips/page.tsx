'use client';

import { useState, useRef, useCallback } from 'react';
import { warmupAudio, playSfx } from '@/lib/sounds';
import { useRookieVoice } from '@/hooks/useRookieVoice';

const SFX_QUIPS = [
  {
    id: 'drink',
    label: 'Mama Needs a Drink',
    before: "You know what? Mama needs a drink.",
    after: "Ok. I feel better now. Where were we.",
    sfx: { file: 'pouring-drink.mp3', duration: 3000, delay: 200, pauseAfter: 500 },
  },
  {
    id: 'printer',
    label: 'Printing Your Resignation',
    before: "Hold on, I'm printing something.",
    after: "It's your resignation letter. I took the liberty.",
    sfx: { file: 'printer1.mp3', duration: 3000, delay: 0, pauseAfter: 300 },
  },
  {
    id: 'record-scratch',
    label: 'Record Scratch',
    before: "Yep, that's me. You're probably wondering how I ended up in this position.",
    after: "It all started when you moved that pawn.",
    sfx: { file: 'record-scratch.mp3', duration: 1500, delay: 0, pauseAfter: 600 },
  },
  {
    id: 'horse',
    label: 'Knight Arrival',
    before: "Did you hear that? My knight is coming.",
    after: "He's here. And he's angry.",
    sfx: { file: 'horse-stampede.mp3', duration: 2500, delay: 200, pauseAfter: 400 },
  },
  {
    id: 'heartbeat',
    label: 'Rookie Discovers Anxiety',
    before: "I think something is wrong with me. Do you hear that?",
    after: "I looked it up. I think I have anxiety now. Thanks for that.",
    sfx: { file: 'heartbeat.mp3', duration: 3000, delay: 300, pauseAfter: 500 },
  },
  {
    id: 'sad-trombone',
    label: 'Sad Trombone',
    before: "That move deserves its own soundtrack.",
    after: "Yeah. That felt right.",
    sfx: { file: 'sad-trombone.mp3', duration: 2000, delay: 0, pauseAfter: 400 },
  },
] as const;

type QuipId = (typeof SFX_QUIPS)[number]['id'];

export default function SfxQuipsTestPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'before' | 'sfx' | 'after'>('idle');
  const [warmedUp, setWarmedUp] = useState(false);
  const [durations, setDurations] = useState<Record<string, { duration: number; delay: number; pauseAfter: number }>>(
    () => Object.fromEntries(SFX_QUIPS.map((q) => [q.id, { duration: q.sfx.duration, delay: q.sfx.delay, pauseAfter: q.sfx.pauseAfter }]))
  );

  const { speakQuip, isTalking } = useRookieVoice(warmedUp);
  const isTalkingRef = useRef(false);
  isTalkingRef.current = isTalking;

  const doWarmup = useCallback(() => {
    warmupAudio();
    setWarmedUp(true);
  }, []);

  const waitForVoiceDone = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      let started = false;
      let attempts = 0;
      const check = () => {
        if (!started) {
          if (isTalkingRef.current) started = true;
          else { attempts++; if (attempts >= 30) { resolve(); return; } }
        }
        if (started && !isTalkingRef.current) resolve();
        else setTimeout(check, 100);
      };
      setTimeout(check, 150);
    });
  }, []);

  const playQuip = useCallback(async (quip: typeof SFX_QUIPS[number]) => {
    const timing = durations[quip.id];
    setPlaying(quip.id);

    if (quip.before) {
      setPhase('before');
      speakQuip(quip.before);
      await waitForVoiceDone();
    }

    if (timing.delay > 0) {
      await new Promise((r) => setTimeout(r, timing.delay));
    }

    setPhase('sfx');
    await playSfx(quip.sfx.file, timing.duration);

    if (timing.pauseAfter > 0) {
      await new Promise((r) => setTimeout(r, timing.pauseAfter));
    }

    if (quip.after) {
      setPhase('after');
      speakQuip(quip.after);
      await waitForVoiceDone();
    }

    setPlaying(null);
    setPhase('idle');
  }, [durations, speakQuip, waitForVoiceDone]);

  const playSfxOnly = useCallback(async (quip: typeof SFX_QUIPS[number]) => {
    const timing = durations[quip.id];
    setPlaying(quip.id);
    setPhase('sfx');
    await playSfx(quip.sfx.file, timing.duration);
    setPlaying(null);
    setPhase('idle');
  }, [durations]);

  const updateTiming = useCallback((id: string, field: 'duration' | 'delay' | 'pauseAfter', value: number) => {
    setDurations((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }, []);

  return (
    <div className="h-[100dvh] overflow-auto bg-chess-bg p-4">
      <div className="mx-auto max-w-lg space-y-6 pb-20">
        <h1 className="text-2xl font-bold text-chess-text">SFX Quip Lab</h1>
        <p className="text-sm text-chess-text-muted">
          Test new Rookie quips with sound effects. Tap to unlock audio first.
        </p>

        {!warmedUp && (
          <button
            onClick={doWarmup}
            className="w-full rounded-xl bg-chess-primary py-3 font-bold text-white"
          >
            Tap to unlock audio
          </button>
        )}

        {SFX_QUIPS.map((quip) => {
          const timing = durations[quip.id];
          const isPlaying = playing === quip.id;
          return (
            <div key={quip.id} className="space-y-3 rounded-2xl border border-chess-border bg-chess-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-chess-text">{quip.label}</h3>
                {isPlaying && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                    {phase}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-sm text-chess-text-muted">
                {quip.before && <p>&ldquo;{quip.before}&rdquo;</p>}
                <p className="font-mono text-amber-400">[ {quip.sfx.file} &mdash; {timing.duration}ms ]</p>
                {quip.after && <p>&ldquo;{quip.after}&rdquo;</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs text-chess-text-muted">
                  <span>SFX Duration</span>
                  <span className="font-mono">{timing.duration}ms</span>
                </label>
                <input
                  type="range"
                  min={200}
                  max={8000}
                  step={100}
                  value={timing.duration}
                  onChange={(e) => updateTiming(quip.id, 'duration', Number(e.target.value))}
                  className="w-full accent-chess-primary"
                />

                <label className="flex items-center justify-between text-xs text-chess-text-muted">
                  <span>Delay before SFX</span>
                  <span className="font-mono">{timing.delay}ms</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={timing.delay}
                  onChange={(e) => updateTiming(quip.id, 'delay', Number(e.target.value))}
                  className="w-full accent-chess-primary"
                />

                <label className="flex items-center justify-between text-xs text-chess-text-muted">
                  <span>Pause after SFX</span>
                  <span className="font-mono">{timing.pauseAfter}ms</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={timing.pauseAfter}
                  onChange={(e) => updateTiming(quip.id, 'pauseAfter', Number(e.target.value))}
                  className="w-full accent-chess-primary"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => playQuip(quip)}
                  disabled={playing !== null}
                  className="flex-1 rounded-xl bg-chess-primary py-2 text-sm font-bold text-white disabled:opacity-40"
                >
                  Play Full Quip
                </button>
                <button
                  onClick={() => playSfxOnly(quip)}
                  disabled={playing !== null}
                  className="rounded-xl border border-chess-border px-4 py-2 text-sm font-medium text-chess-text disabled:opacity-40"
                >
                  SFX Only
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
