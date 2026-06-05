'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { warmupAudio, playSfx, getSharedAudioContext } from '@/lib/sounds';

const SFX_LIBRARY = [
  'alarm-clock.mp3', 'camera-shutter.mp3', 'cash-register.mp3', 'children-laughing.mp3',
  'cinematic-logo.mp3', 'clock-countdown.mp3', 'clock-ticking.mp3', 'deep-foghorn.mp3',
  'divine-thunder.mp3', 'door-closing.mp3', 'doorbell.mp3', 'epic-music.mp3',
  'explosion.mp3', 'fast-typing.mp3', 'grandfather-clock.mp3', 'heartbeat.mp3',
  'heavenly-intro.mp3', 'hissing-snakes.mp3', 'horse-galloping.mp3', 'horse-stampede.mp3',
  'horse-whinny.mp3', 'inception-horn.mp3', 'loud-siren.mp3', 'machine-breaking.mp3',
  'magic-energy.mp3', 'magical-story.mp3', 'mouse-click.mp3', 'ocean-waves.mp3',
  'old-phone-ringing.mp3', 'phone-dialing.mp3', 'phone-ringing.mp3', 'phone-vibrating.mp3',
  'poof.mp3', 'pouring-drink.mp3', 'printer1.mp3', 'printer2.mp3', 'printer3.mp3', 'printer4.mp3',
  'radio-static.mp3', 'rainforest.mp3', 'rainstorm.mp3', 'record-scratch.mp3',
  'relaxing-harp.mp3', 'rewind.mp3', 'sad-music.mp3', 'sad-trombone.mp3',
  'scary-alien.mp3', 'train-horn.mp3', 'typewriter.mp3', 'typing.mp3',
  'war-music.mp3', 'wolf-howl.mp3',
];

const DEFAULT_QUIP = "I'm going to run a quick report. [SFX] Huh. This report tells me that you are a terrible person. I love reports.";

export default function QuipSfxBuilderPage() {
  const [warmedUp, setWarmedUp] = useState(false);
  const [text, setText] = useState(DEFAULT_QUIP);
  const [sfxFile, setSfxFile] = useState('typing.mp3');
  const [duration, setDuration] = useState(2200);
  const [delay, setDelay] = useState(0);
  const [pauseAfter, setPauseAfter] = useState(150);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'before' | 'sfx' | 'after'>('idle');
  const [filter, setFilter] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const isTalkingRef = useRef(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const speakQuip = useCallback(async (line: string): Promise<void> => {
    if (!warmedUp) return;
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') { try { await ctx.resume(); } catch {} }
    if (ctx.state !== 'running') return;

    setVoiceError(null);
    let res: Response;
    try {
      res = await fetch('/api/rookie-voice-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speakOnly: line }),
      });
    } catch (err) {
      setVoiceError(`Network error: ${String(err)}`);
      return;
    }
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      setVoiceError(`TTS ${res.status}: ${body.slice(0, 200)}`);
      return;
    }
    const data = await res.json();
    if (!data.audio) {
      setVoiceError(data.error ?? 'No audio returned (check ELEVENLABS_API_KEY)');
      return;
    }
    const bin = atob(data.audio);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const buf = await ctx.decodeAudioData(bytes.buffer);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    isTalkingRef.current = true;
    currentSourceRef.current = src;
    await new Promise<void>((resolve) => {
      src.onended = () => {
        try { src.disconnect(); } catch {}
        currentSourceRef.current = null;
        isTalkingRef.current = false;
        resolve();
      };
      src.start();
    });
  }, [warmedUp]);

  const filteredSfx = useMemo(
    () => SFX_LIBRARY.filter((f) => f.toLowerCase().includes(filter.toLowerCase())),
    [filter]
  );

  const [before, after] = useMemo(() => {
    if (!text.includes('[SFX]')) return [text, ''];
    const parts = text.split('[SFX]');
    return [parts[0].trim(), (parts[1] ?? '').trim()];
  }, [text]);

  const doWarmup = useCallback(() => {
    warmupAudio();
    setWarmedUp(true);
  }, []);

  const playFull = useCallback(async () => {
    setPlaying(true);
    try {
      if (before) {
        setPhase('before');
        await speakQuip(before);
      }
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
      setPhase('sfx');
      await playSfx(sfxFile, duration);
      if (pauseAfter > 0) await new Promise((r) => setTimeout(r, pauseAfter));
      if (after) {
        setPhase('after');
        await speakQuip(after);
      }
    } finally {
      setPlaying(false);
      setPhase('idle');
    }
  }, [before, after, sfxFile, duration, delay, pauseAfter, speakQuip]);

  const previewSfx = useCallback(async (file: string) => {
    await playSfx(file, 4000);
  }, []);

  const generatedCode = useMemo(() => {
    const sfxObj: Record<string, number | string> = { file: sfxFile, duration };
    if (delay > 0) sfxObj.delay = delay;
    if (pauseAfter > 0) sfxObj.pauseAfter = pauseAfter;
    const sfxParts = Object.entries(sfxObj).map(([k, v]) =>
      typeof v === 'string' ? `${k}: '${v}'` : `${k}: ${v}`
    ).join(', ');
    return `{
  id: 'YOUR_ID',
  text: ${JSON.stringify(text)},
  conditions: { beats: ['early_game', 'turning_point', 'late_game'], evalMoods: ['desperate'], tone: 'spicy' },
  priority: 70,
  source: 'authored',
  sfx: { ${sfxParts} },
},`;
  }, [text, sfxFile, duration, delay, pauseAfter]);

  return (
    <div className="h-[100dvh] overflow-auto bg-white">
      <div className="mx-auto max-w-2xl space-y-8 px-6 py-10 pb-32">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Quip + SFX Builder</h1>
          <p className="mt-2 text-base text-slate-600">
            Write a quip. Drop <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-800">[SFX]</code> where the sound plays. Pick a sound. Hit play.
          </p>
        </header>

        {voiceError && (
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <strong>Voice error:</strong> {voiceError}
          </div>
        )}

        {!warmedUp && (
          <button
            onClick={doWarmup}
            className="w-full rounded-xl bg-slate-900 py-4 text-base font-bold text-white shadow-lg hover:bg-slate-800"
          >
            Tap to unlock audio
          </button>
        )}

        {/* Step 1: Quip text */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">1</div>
            <h2 className="text-lg font-bold text-slate-900">Write the quip</h2>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-base text-slate-900 focus:border-slate-900 focus:outline-none"
          />
          <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed">
            <div className="flex items-start justify-between gap-3">
              <p className="flex-1 text-slate-700">{before || <em className="text-slate-400">(nothing before SFX)</em>}</p>
              {before && (
                <button
                  onClick={() => speakQuip(before)}
                  disabled={!warmedUp || playing}
                  className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-40"
                >
                  ▶ Hear
                </button>
              )}
            </div>
            <p className="my-2 font-mono text-amber-600">▸ {sfxFile} ({duration}ms)</p>
            <div className="flex items-start justify-between gap-3">
              <p className="flex-1 text-slate-700">{after || <em className="text-slate-400">(nothing after SFX)</em>}</p>
              {after && (
                <button
                  onClick={() => speakQuip(after)}
                  disabled={!warmedUp || playing}
                  className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-40"
                >
                  ▶ Hear
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => speakQuip(text.replace('[SFX]', ' ').replace(/\s+/g, ' ').trim())}
            disabled={!warmedUp || playing}
            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-40"
          >
            ▶ Hear full text (ElevenLabs, no SFX)
          </button>
        </section>

        {/* Step 2: Pick SFX */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">2</div>
            <h2 className="text-lg font-bold text-slate-900">Pick a sound effect</h2>
          </div>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search 52 sounds…"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-slate-900 focus:outline-none"
          />
          <div className="grid max-h-80 grid-cols-1 gap-2 overflow-auto sm:grid-cols-2">
            {filteredSfx.map((file) => {
              const selected = sfxFile === file;
              return (
                <div
                  key={file}
                  className={`flex items-center gap-2 rounded-xl border-2 p-1 ${
                    selected ? 'border-slate-900 bg-slate-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <button
                    onClick={() => setSfxFile(file)}
                    className={`flex-1 truncate rounded-lg px-3 py-2 text-left text-sm font-medium ${
                      selected ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {file.replace('.mp3', '').replace(/-/g, ' ')}
                  </button>
                  <button
                    onClick={() => previewSfx(file)}
                    className={`rounded-lg px-3 py-2 text-base ${
                      selected ? 'text-white hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                    title="Preview"
                  >
                    ▶
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 3: Timing */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">3</div>
            <h2 className="text-lg font-bold text-slate-900">Tune timing</h2>
          </div>
          {[
            { label: 'How long the SFX plays', value: duration, set: setDuration, min: 200, max: 8000, step: 100 },
            { label: 'Pause before SFX starts', value: delay, set: setDelay, min: 0, max: 2000, step: 50 },
            { label: 'Pause after SFX ends', value: pauseAfter, set: setPauseAfter, min: 0, max: 2000, step: 50 },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{s.label}</span>
                <span className="rounded-md bg-white px-2 py-1 font-mono text-sm font-bold text-slate-900">{s.value}ms</span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="w-full accent-slate-900"
              />
            </div>
          ))}
        </section>

        {/* Step 4: Play */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">4</div>
            <h2 className="text-lg font-bold text-slate-900">Play it</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={playFull}
              disabled={playing || !warmedUp}
              className="flex-1 rounded-xl bg-emerald-600 py-4 text-base font-bold text-white shadow-lg hover:bg-emerald-700 disabled:opacity-40"
            >
              {playing ? `Playing… (${phase})` : '▶ Play Full Quip'}
            </button>
            <button
              onClick={() => previewSfx(sfxFile)}
              disabled={playing}
              className="rounded-xl border-2 border-slate-200 bg-white px-5 py-4 text-base font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-40"
            >
              SFX only
            </button>
          </div>
        </section>

        {/* Code output */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Code to paste</h2>
            <button
              onClick={() => navigator.clipboard.writeText(generatedCode)}
              className="rounded-lg border-2 border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Copy
            </button>
          </div>
          <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
{generatedCode}
          </pre>
          <p className="text-sm text-slate-500">
            Paste into <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700">lib/speech/line-pool.ts</code>
          </p>
        </section>
      </div>
    </div>
  );
}
