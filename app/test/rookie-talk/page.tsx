'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BreathingRook, RookieMood } from '@/components/ui/BreathingRook';

const DIALOG_SAMPLES: { mood: RookieMood; text: string }[] = [
  { mood: 'neutral', text: "I've already calculated 4.2 million responses. Take your time though." },
  { mood: 'happy', text: "You played that perfectly! I think I'm... proud? My circuits feel warm." },
  { mood: 'nervous', text: "That's a lot of pressure on my d4 pawn. I'm fine. Everything is fine." },
  { mood: 'excited', text: "CHECKMATE! I want to be gracious but I'm very excited. Is my excitement showing?" },
  { mood: 'smug', text: "Interesting. I mean, statistically it's fine. Emotionally I have no opinion." },
  { mood: 'surprised', text: "Check?! On ME? I need to recalibrate my feelings about you." },
  { mood: 'scheming', text: "I see something. Don't look at me like that. Just... trust me for three more moves." },
  { mood: 'angry', text: "You took my knight. I was using that. This must be what loss feels like." },
  { mood: 'panicking', text: "My queen is trapped. MY QUEEN IS TRAPPED. This is not a drill." },
  { mood: 'zen', text: "The position is balanced. Like a perfectly tuned circuit. I could stay here forever." },
  { mood: 'defeated', text: "I resign. My processors need a moment. Please don't watch me reboot." },
  { mood: 'embarrassed', text: "I just hung my rook. A ROOK. I am literally a rook. The irony is not lost on me." },
];

/**
 * Hook that runs a rAF loop reading amplitude from an AnalyserNode.
 * Returns a 0–1 intensity value updated every frame.
 */
function useAudioIntensity(analyserRef: React.RefObject<AnalyserNode | null>, active: boolean) {
  const [intensity, setIntensity] = useState(0);
  const rafRef = useRef<number>(0);
  const smoothedRef = useRef(0);

  useEffect(() => {
    if (!active) {
      smoothedRef.current = 0;
      setIntensity(0);
      return;
    }

    const loop = () => {
      const analyser = analyserRef.current;
      if (!analyser) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(data);

      // Compute RMS amplitude (0–1)
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const sample = (data[i] - 128) / 128; // normalize to -1..1
        sum += sample * sample;
      }
      const rms = Math.sqrt(sum / data.length);

      // Amplify — speech RMS is usually 0.05–0.3, we want 0–1 range
      const amplified = Math.min(1, rms * 4);

      // Smooth: fast attack (jump up quickly on syllables), slow decay (fade out between)
      const prev = smoothedRef.current;
      const smoothed = amplified > prev
        ? prev + (amplified - prev) * 0.6  // fast attack
        : prev + (amplified - prev) * 0.15; // slow decay
      smoothedRef.current = smoothed;

      setIntensity(smoothed);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, analyserRef]);

  return intensity;
}

export default function RookieTalkTest() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isTalking, setIsTalking] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [audioOn, setAudioOn] = useState(true);
  const [audioStatus, setAudioStatus] = useState<string | null>(null);
  const [drama, setDrama] = useState(1); // 0–2 multiplier

  // Audio refs
  const manifestRef = useRef<Record<string, string> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const intensity = useAudioIntensity(analyserRef, isTalking);

  // Load voice manifest on mount
  useEffect(() => {
    fetch('/rookie-voice/manifest.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          manifestRef.current = data;
          setAudioStatus(`${Object.keys(data).length} cached voices loaded`);
        }
      })
      .catch(() => setAudioStatus('No voice cache found'));

    return () => {
      if (currentSourceRef.current) { try { currentSourceRef.current.stop(); } catch {} currentSourceRef.current = null; }
      if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null; }
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;
    }
    return audioCtxRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch {}
      currentSourceRef.current = null;
    }
  }, []);

  const speakText = useCallback(async (text: string, onEnd: () => void) => {
    if (!audioOn) { onEnd(); return; }
    stopAudio();

    const ctx = getAudioContext();
    const analyser = analyserRef.current!;
    if (ctx.state === 'suspended') await ctx.resume();

    // Try manifest cache first — fetch + decodeAudioData (avoids CORS issues with MediaElement)
    const manifest = manifestRef.current;
    if (manifest && manifest[text]) {
      try {
        const res = await fetch(`/rookie-voice/${manifest[text]}`);
        if (res.ok) {
          const arrayBuf = await res.arrayBuffer();
          const buf = await ctx.decodeAudioData(arrayBuf);
          const src = ctx.createBufferSource();
          src.buffer = buf;
          src.connect(analyser);
          analyser.connect(ctx.destination);
          src.onended = () => {
            try { src.disconnect(); } catch {}
            try { analyser.disconnect(); } catch {}
            onEnd();
          };
          src.start();
          currentSourceRef.current = src;
          setAudioStatus('Playing from cache');
          return;
        }
      } catch {
        // Fall through to API
      }
    }

    // Call the API to generate + cache
    setAudioStatus('Generating voice...');
    try {
      const res = await fetch('/api/rookie-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speakOnly: text, generateAudio: true }),
      });
      const data = await res.json();
      if (data.audio) {
        const bin = atob(data.audio);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const buf = await ctx.decodeAudioData(bytes.buffer);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(analyser);
        analyser.connect(ctx.destination);
        src.onended = () => {
          try { src.disconnect(); } catch {}
          try { analyser.disconnect(); } catch {}
          onEnd();
        };
        src.start();
        currentSourceRef.current = src;
        setAudioStatus('Playing (freshly generated)');
      } else {
        setAudioStatus('No audio returned (check API keys)');
        onEnd();
      }
    } catch {
      setAudioStatus('Voice API error');
      onEnd();
    }
  }, [audioOn, stopAudio, getAudioContext]);

  const startTalking = useCallback((index: number) => {
    stopAudio();
    setActiveIndex(index);
    setIsTalking(true);
    setTypedText('');

    speakText(DIALOG_SAMPLES[index].text, () => {
      setIsTalking(false);
    });
  }, [speakText, stopAudio]);

  // Typewriter effect — runs alongside audio
  useEffect(() => {
    if (activeIndex === null || !isTalking) return;
    const fullText = DIALOG_SAMPLES[activeIndex].text;
    let charIndex = 0;

    const interval = setInterval(() => {
      charIndex++;
      setTypedText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [activeIndex, isTalking]);

  // When talking stops, show full text
  useEffect(() => {
    if (!isTalking && activeIndex !== null) {
      setTypedText(DIALOG_SAMPLES[activeIndex].text);
    }
  }, [isTalking, activeIndex]);

  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text overflow-auto">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-black">Rookie Talk Animation</h1>
          <p className="text-chess-text-muted text-sm">
            Tap any line — Rookie&apos;s blocks pulse with each syllable
          </p>
        </div>

        {/* Audio toggle + status */}
        <div className="flex items-center justify-between bg-chess-surface rounded-xl px-4 py-3">
          <button
            onClick={() => setAudioOn(v => !v)}
            className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-all ${
              audioOn ? 'bg-chess-green/20 text-chess-green' : 'bg-chess-text-faint/10 text-chess-text-muted'
            }`}
          >
            Voice {audioOn ? 'ON' : 'OFF'}
          </button>
          <div className="flex items-center gap-3">
            {isTalking && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-3 bg-chess-green/60 rounded-full" style={{ transform: `scaleY(${0.3 + intensity * 0.7})`, transition: 'transform 0.05s' }} />
                <div className="w-1 h-3 bg-chess-green/60 rounded-full" style={{ transform: `scaleY(${0.2 + intensity * 0.8})`, transition: 'transform 0.08s' }} />
                <div className="w-1 h-3 bg-chess-green/60 rounded-full" style={{ transform: `scaleY(${0.4 + intensity * 0.6})`, transition: 'transform 0.06s' }} />
              </div>
            )}
            {audioStatus && (
              <span className="text-[11px] text-chess-text-faint">{audioStatus}</span>
            )}
          </div>
        </div>

        {/* Drama slider */}
        <div className="bg-chess-surface rounded-xl px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-chess-text">Drama</span>
            <span className="text-xs text-chess-text-muted font-mono w-10 text-right">{drama.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={drama}
            onChange={e => setDrama(parseFloat(e.target.value))}
            className="w-full accent-chess-green"
          />
          <div className="flex justify-between text-[10px] text-chess-text-faint">
            <span>Subtle</span>
            <span>Default</span>
            <span>Dramatic</span>
          </div>
        </div>

        {/* Large preview */}
        <div className="bg-chess-surface rounded-3xl p-6 flex items-start gap-4">
          <div className="flex-shrink-0 pt-1">
            <BreathingRook
              size="lg"
              mood={activeIndex !== null ? DIALOG_SAMPLES[activeIndex].mood : 'neutral'}
              animate={!isTalking}
              talkIntensity={isTalking ? Math.min(1, intensity * drama) : undefined}
            />
          </div>
          <div className="flex-1 min-h-[100px] flex items-center">
            {activeIndex !== null ? (
              <div className="relative">
                <div
                  className="absolute top-4 -left-[6px] w-3 h-3 bg-chess-surface rotate-45 rounded-[2px]"
                  style={{ boxShadow: '-1px 1px 2px rgba(0,0,0,0.04)' }}
                />
                <div className="relative bg-chess-surface rounded-2xl px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]">
                  <p className="text-chess-text text-[14px] leading-relaxed font-medium">
                    {typedText}
                    {isTalking && <span className="inline-block w-[2px] h-[14px] bg-chess-text/50 ml-0.5 align-middle animate-pulse" />}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-chess-text-faint text-sm italic">Tap a line below...</p>
            )}
          </div>
        </div>

        {/* Dialog list */}
        <div className="space-y-2">
          {DIALOG_SAMPLES.map((sample, i) => (
            <button
              key={i}
              onClick={() => startTalking(i)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeIndex === i
                  ? 'bg-chess-green/15 ring-2 ring-chess-green'
                  : 'bg-chess-surface hover:bg-chess-surface/80'
              }`}
            >
              <div className="flex-shrink-0">
                <BreathingRook size="xs" mood={sample.mood} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-chess-text-muted capitalize">{sample.mood}</p>
                <p className="text-[13px] text-chess-text leading-snug truncate">{sample.text}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="pb-8" />
      </div>
    </div>
  );
}
