'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { useRookieVoice } from '@/hooks/useRookieVoice';
import { useRookieQuipQueue } from '@/hooks/useRookieQuipQueue';
import { warmupAudio } from '@/lib/sounds';
import type { RookieMood, AlarmVariant } from '@/lib/rookie-os/types';
import { CHAPTERS } from './script';
import type { Stage, SayOptions } from './stage';
import { PlayGrid } from './chapters/PlayGrid';
import { PieceOpinions } from './chapters/PieceOpinions';
import { MoodGallery } from './chapters/MoodGallery';
import { EvalStage } from './chapters/EvalStage';
import { TalkDemo } from './chapters/TalkDemo';
import { Meltdown } from './chapters/Meltdown';
import { Sabotage } from './chapters/Sabotage';
import { WhyRookie, type TourStats } from './chapters/WhyRookie';

type OneShot = 'powerOn' | 'enter' | 'celebrate' | null;

export function RookieTour({ stats }: { stats: TourStats }) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [mood, setMood] = useState<RookieMood>('neutral');
  const [alarm, setAlarm] = useState<AlarmVariant | null>(null);
  const [oneShot, setOneShot] = useState<OneShot>(null);
  const oneShotTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { speakQuip, talkIntensity, isTalking, isTalkingRef, stopAudio } = useRookieVoice(started);
  const { queueQuip, clearQueue, displayText, msgKey } = useRookieQuipQueue(speakQuip, isTalkingRef);

  const chapter = CHAPTERS[idx];

  const playOneShot = useCallback((anim: OneShot, ms = 2200) => {
    if (oneShotTimer.current) clearTimeout(oneShotTimer.current);
    setOneShot(anim);
    oneShotTimer.current = setTimeout(() => setOneShot(null), ms);
  }, []);
  useEffect(() => () => { if (oneShotTimer.current) clearTimeout(oneShotTimer.current); }, []);

  const interrupt = useCallback(() => {
    clearQueue();
    stopAudio();
  }, [clearQueue, stopAudio]);

  const setLook = useCallback((m: RookieMood, a: AlarmVariant | null = null) => {
    setMood(m);
    setAlarm(a);
  }, []);

  const say = useCallback((text: string, opts: SayOptions = {}) => {
    interrupt();
    if (opts.mood) setLook(opts.mood, opts.alarm ?? null);
    queueQuip(text, 'normal', undefined, opts.sfx);
  }, [interrupt, setLook, queueQuip]);

  // Opening a chapter: reset her look and queue the narration.
  useEffect(() => {
    if (!started) return;
    interrupt();
    setLook(chapter.mood, null);
    if (chapter.id === 'intro') playOneShot('powerOn', 2600);
    else if (chapter.id === 'why') playOneShot('celebrate');
    else playOneShot('enter', 900);
    for (const line of chapter.lines) queueQuip(line);
    // Only re-run when the chapter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, idx]);

  const start = () => {
    warmupAudio();
    setStarted(true);
  };

  const go = (next: number) => {
    setIdx(Math.max(0, Math.min(CHAPTERS.length - 1, next)));
    document.getElementById('tour-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stage: Stage = useMemo(
    () => ({ say, setLook, mood, talkIntensity, isTalking }),
    [say, setLook, mood, talkIntensity, isTalking],
  );

  const rookProps = {
    mood,
    alarmVariant: alarm,
    animate: !isTalking && !oneShot,
    animation: !isTalking && oneShot ? oneShot : undefined,
    talkIntensity: isTalking ? talkIntensity : undefined,
  } as const;

  if (!started) {
    return (
      <div className="h-full overflow-y-auto bg-chess-page text-chess-text">
        <div className="min-h-full flex flex-col items-center justify-center px-4 py-10 text-center">
          <BreathingRook size="xl" mood="neutral" animate />
          <h1 className="mt-6 text-3xl md:text-4xl font-black tracking-tight">Meet Rookie</h1>
          <p className="mt-3 max-w-md text-chess-text-muted">
            A guided tour of Chess Path&apos;s mascot, given by the mascot. Turn your sound on.
          </p>
          <button
            onClick={start}
            className="mt-8 min-h-[52px] px-8 rounded-2xl bg-chess-green text-white font-bold text-lg shadow-[0_4px_0_var(--color-chess-green-shadow)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-chess-green-shadow)] transition"
          >
            Start the tour
          </button>
          <p className="mt-3 text-xs text-chess-text-faint">About 5 minutes · sound on</p>
        </div>
      </div>
    );
  }

  const bubbleText = displayText ?? chapter.lines[chapter.lines.length - 1];

  return (
    <div id="tour-scroll" className="h-full overflow-y-auto overflow-x-hidden bg-chess-page text-chess-text">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 pb-16 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10">
        {/* Stage — sticky Rookie + her speech bubble */}
        <aside className="sticky top-0 z-10 -mx-4 px-4 pt-3 pb-3 bg-chess-page/95 backdrop-blur lg:mx-0 lg:px-0 lg:pt-10 lg:self-start lg:bg-transparent lg:backdrop-blur-none">
          <div className="flex items-center gap-3 lg:flex-col lg:gap-6">
            <div className="lg:hidden flex-shrink-0">
              <BreathingRook size="md" {...rookProps} />
            </div>
            <div className="hidden lg:flex justify-center w-full min-h-[260px] items-center">
              <BreathingRook size="xl" {...rookProps} />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div
                key={msgKey}
                className="relative bg-white rounded-2xl px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] min-h-[64px] lg:min-h-[96px] flex items-center animate-[fadeIn_200ms_ease-out]"
              >
                <p className="text-[14px] lg:text-[16px] leading-snug font-semibold">{bubbleText}</p>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-chess-text-faint">
                <span>Mood: {mood}{alarm ? ` · ${alarm}` : ''}</span>
                <button onClick={() => { interrupt(); chapter.lines.forEach((l) => queueQuip(l)); }} className="min-h-[44px] px-2 hover:text-chess-text">
                  Replay
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Chapter */}
        <main className="pt-4 lg:pt-10 min-w-0">
          {/* Progress */}
          <nav className="flex flex-wrap gap-1.5 mb-5" aria-label="Tour chapters">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => go(i)}
                className={`min-h-[32px] px-2.5 rounded-full text-[12px] font-bold transition ${
                  i === idx ? 'bg-chess-text text-white' : i < idx ? 'bg-chess-green/15 text-chess-green-dark' : 'bg-white text-chess-text-muted'
                }`}
              >
                {c.label}
              </button>
            ))}
          </nav>

          <p className="text-xs font-bold uppercase tracking-wider text-chess-text-faint">
            {idx + 1} / {CHAPTERS.length}
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-black tracking-tight">{chapter.title}</h2>
          <p className="mt-2 text-chess-text-muted max-w-prose">{chapter.blurb}</p>

          <section className="mt-6">
            {chapter.id === 'intro' && <IntroDemo />}
            {chapter.id === 'play' && <PlayGrid stage={stage} />}
            {chapter.id === 'pieces' && <PieceOpinions stage={stage} />}
            {chapter.id === 'colors' && <MoodGallery stage={stage} />}
            {chapter.id === 'eval' && <EvalStage stage={stage} />}
            {chapter.id === 'talk' && <TalkDemo stage={stage} />}
            {chapter.id === 'meltdown' && <Meltdown stage={stage} />}
            {chapter.id === 'sabotage' && <Sabotage stage={stage} />}
            {chapter.id === 'why' && <WhyRookie stats={stats} />}
          </section>

          <div className="mt-10 flex gap-3">
            {idx > 0 && (
              <button
                onClick={() => go(idx - 1)}
                className="min-h-[48px] px-5 rounded-2xl bg-white text-chess-text font-bold shadow-[0_4px_0_rgba(0,0,0,0.08)] active:translate-y-[2px]"
              >
                Back
              </button>
            )}
            {idx < CHAPTERS.length - 1 && (
              <button
                onClick={() => go(idx + 1)}
                className="flex-1 md:flex-none min-h-[48px] px-8 rounded-2xl bg-chess-green text-white font-bold shadow-[0_4px_0_var(--color-chess-green-shadow)] active:translate-y-[2px]"
              >
                Next: {CHAPTERS[idx + 1].title}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function IntroDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[
        ['A rook', 'Rookie sees the board in straight lines and judges every other piece for it.'],
        ['A color language', 'Rookie\'s 22 blocks re-tint with every mood, driven live by the game.'],
        ['A sore loser', 'When Rookie is losing, Rookie melts down, out loud, with sound effects.'],
      ].map(([title, body]) => (
        <div key={title} className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
          <p className="font-black">{title}</p>
          <p className="mt-1 text-sm text-chess-text-muted">{body}</p>
        </div>
      ))}
    </div>
  );
}
