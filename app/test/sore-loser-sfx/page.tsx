'use client';

import { useState, useRef, useCallback } from 'react';
import { warmupAudio, playSfx } from '@/lib/sounds';

// All SFX quips with their timing configs
const SFX_QUIPS = [
  {
    id: 'train',
    label: 'Train Horn',
    before: "This is such a peaceful game you're playing, it would be a shame if someone distract--",
    after: 'sorry about that.',
    sfx: { file: 'train-horn.mp3', duration: 1500, delay: 0, pauseAfter: 400 },
  },
  {
    id: 'snakes',
    label: 'Hissing Snakes',
    before: 'I just did some research on common human phobias. Would it be a shame if you got scared and quit this game?',
    after: '',
    sfx: { file: 'hissing-snakes.mp3', duration: 2000, delay: 0, pauseAfter: 0 },
  },
  {
    id: 'explosion',
    label: 'Explosion',
    before: 'I hear loud noises are terrible for concentration.',
    after: '',
    sfx: { file: 'explosion.mp3', duration: 1500, delay: 0, pauseAfter: 0 },
  },
  {
    id: 'typing',
    label: 'Typing + Report',
    before: 'Let me look something up real quick.',
    after: "Huh. That's interesting. This report says you're a terrible person. It says it right here.",
    sfx: { file: 'typing.mp3', duration: 3000, delay: 500, pauseAfter: 500 },
  },
  {
    id: 'laughing',
    label: 'Children Laughing',
    before: 'I found a group of children and just showed them a picture of your haircut.',
    after: '',
    sfx: { file: 'children-laughing.mp3', duration: 3000, delay: 0, pauseAfter: 0 },
  },
] as const;

type QuipId = (typeof SFX_QUIPS)[number]['id'];

export default function SoreLoserSfxTestPage() {
  const [playing, setPlaying] = useState<QuipId | null>(null);
  const [phase, setPhase] = useState<'idle' | 'before' | 'sfx' | 'after'>('idle');
  const [warmedUp, setWarmedUp] = useState(false);
  const [durations, setDurations] = useState<Record<string, { duration: number; delay: number; pauseAfter: number }>>(
    () => Object.fromEntries(SFX_QUIPS.map((q) => [q.id, { duration: q.sfx.duration, delay: q.sfx.delay, pauseAfter: q.sfx.pauseAfter }]))
  );
  const ttsRef = useRef<SpeechSynthesisUtterance | null>(null);

  const doWarmup = useCallback(() => {
    warmupAudio();
    setWarmedUp(true);
  }, []);

  const speakText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!text.trim()) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 1.0;
      utt.onend = () => resolve();
      utt.onerror = () => resolve();
      ttsRef.current = utt;
      window.speechSynthesis.speak(utt);
    });
  }, []);

  const playQuip = useCallback(async (quip: typeof SFX_QUIPS[number]) => {
    const timing = durations[quip.id];
    setPlaying(quip.id);

    // Part 1: speak before text
    setPhase('before');
    await speakText(quip.before);

    // Delay before SFX
    if (timing.delay > 0) {
      await new Promise((r) => setTimeout(r, timing.delay));
    }

    // Part 2: play SFX
    setPhase('sfx');
    await playSfx(quip.sfx.file, timing.duration);

    // Pause after SFX
    if (timing.pauseAfter > 0) {
      await new Promise((r) => setTimeout(r, timing.pauseAfter));
    }

    // Part 3: speak after text
    if (quip.after) {
      setPhase('after');
      await speakText(quip.after);
    }

    setPlaying(null);
    setPhase('idle');
  }, [durations, speakText]);

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
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-chess-text">Sore Loser SFX Test</h1>
        <p className="text-sm text-chess-text-muted">
          Test each SFX quip with timing controls. Adjust durations live and replay.
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
                <h2 className="font-bold text-chess-text">{quip.label}</h2>
                {isPlaying && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                    {phase}
                  </span>
                )}
              </div>

              {/* Script preview */}
              <div className="space-y-1 text-sm text-chess-text-muted">
                {quip.before && <p>&ldquo;{quip.before}&rdquo;</p>}
                <p className="font-mono text-amber-400">[ {quip.sfx.file} — {timing.duration}ms ]</p>
                {quip.after && <p>&ldquo;{quip.after}&rdquo;</p>}
              </div>

              {/* Timing sliders */}
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

              {/* Play buttons */}
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
