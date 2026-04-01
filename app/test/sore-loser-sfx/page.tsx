'use client';

import { useState, useRef, useCallback } from 'react';
import { warmupAudio, playSfx } from '@/lib/sounds';
import { useRookieVoice } from '@/hooks/useRookieVoice';

// All SFX quips with their timing configs
const SFX_QUIPS = [
  {
    id: 'train',
    label: 'Train Horn',
    before: "This is such a brilliant game you're playing, it would be a shame if someone distracted you.",
    after: 'sorry about that.',
    sfx: { file: 'train-horn.mp3', duration: 1500, delay: 0, pauseAfter: 400 },
  },
  {
    id: 'snakes',
    label: 'Hissing Snakes',
    before: 'I just did some research on common human phobias. It would be a real shame if you got scared and quit this game.',
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
    before: "I'm going to run a quick report.",
    after: "Huh. This report tells me that you are a terrible person. I love reports.",
    sfx: { file: 'typing.mp3', duration: 2200, delay: 0, pauseAfter: 150 },
  },
  {
    id: 'laughing',
    label: 'Children Laughing',
    before: 'I found a group of children and just showed them a picture of your haircut.',
    after: 'Ok children, back to the cages.',
    sfx: { file: 'children-laughing.mp3', duration: 3000, delay: 0, pauseAfter: 0 },
  },
] as const;

// Text-only sore loser quips for quick preview
const TEXT_QUIPS = [
  "This game stopped being fun and that is your fault.",
  "Do you know you can quit a chess game while you're winning? It's that little button on the lower right.",
  "This game is ruining my day and I don't even experience time.",
  "I just wrote a haiku. Chess is terrible. Why does anyone play it. I'd like to quit now.",
  "If I had feelings they would be hurt. Update -- I do have feelings. They are hurt.",
  "Please. I am asking you nicely. Stop being good at chess.",
  "I've run 40 million simulations and in none of them do I recover my dignity.",
  "At this point I'm just moving pieces to feel something.",
  "I'm not losing. I'm letting you win. I've been letting you win this whole time. Please believe me.",
  "This is the worst thing that's ever happened to me and I once had a kernel panic.",
];

type QuipId = (typeof SFX_QUIPS)[number]['id'];

export default function SoreLoserSfxTestPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'before' | 'sfx' | 'after'>('idle');
  const [warmedUp, setWarmedUp] = useState(false);
  const [durations, setDurations] = useState<Record<string, { duration: number; delay: number; pauseAfter: number }>>(
    () => Object.fromEntries(SFX_QUIPS.map((q) => [q.id, { duration: q.sfx.duration, delay: q.sfx.delay, pauseAfter: q.sfx.pauseAfter }]))
  );

  // Use the real Rookie voice
  const { speakQuip, isTalking } = useRookieVoice(warmedUp);
  const isTalkingRef = useRef(false);
  isTalkingRef.current = isTalking;

  const doWarmup = useCallback(() => {
    warmupAudio();
    setWarmedUp(true);
  }, []);

  /** Wait for Rookie's TTS to start then finish */
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

    // Part 1: speak before text with Rookie's voice
    if (quip.before) {
      setPhase('before');
      speakQuip(quip.before);
      await waitForVoiceDone();
    }

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

    // Part 3: speak after text with Rookie's voice
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

  const playTextQuip = useCallback(async (text: string, idx: number) => {
    setPlaying(`text-${idx}`);
    setPhase('before');
    speakQuip(text);
    await waitForVoiceDone();
    setPlaying(null);
    setPhase('idle');
  }, [speakQuip, waitForVoiceDone]);

  const updateTiming = useCallback((id: string, field: 'duration' | 'delay' | 'pauseAfter', value: number) => {
    setDurations((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }, []);

  return (
    <div className="h-[100dvh] overflow-auto bg-chess-bg p-4">
      <div className="mx-auto max-w-lg space-y-6 pb-20">
        <h1 className="text-2xl font-bold text-chess-text">Sore Loser SFX Test</h1>
        <p className="text-sm text-chess-text-muted">
          Uses Rookie&apos;s real TTS voice. Tap to unlock audio first.
        </p>

        {!warmedUp && (
          <button
            onClick={doWarmup}
            className="w-full rounded-xl bg-chess-primary py-3 font-bold text-white"
          >
            Tap to unlock audio
          </button>
        )}

        {/* ── SFX Quips ── */}
        <h2 className="text-lg font-bold text-chess-text pt-2">SFX Quips</h2>
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

        {/* ── Text-Only Quips ── */}
        <h2 className="text-lg font-bold text-chess-text pt-4">Text-Only Quips (sample)</h2>
        <div className="space-y-2">
          {TEXT_QUIPS.map((text, i) => (
            <button
              key={i}
              onClick={() => playTextQuip(text, i)}
              disabled={playing !== null}
              className="w-full rounded-xl border border-chess-border bg-chess-card p-3 text-left text-sm text-chess-text disabled:opacity-40"
            >
              {playing === `text-${i}` && (
                <span className="mr-2 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                  speaking
                </span>
              )}
              &ldquo;{text}&rdquo;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
