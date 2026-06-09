'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getSharedAudioContext } from '@/lib/sounds';

// Decoded voice clips, LRU by Map insertion order, shared across hook
// instances. Repeated lines were re-fetched + re-decoded on every play.
const VOICE_CACHE_MAX = 20;
const voiceBufferCache = new Map<string, AudioBuffer>();

/**
 * Hook that manages Rookie's voice playback with real-time audio analysis.
 *
 * Uses the shared AudioContext from lib/sounds.ts (unlocked by warmupAudio on
 * first user gesture) so that iOS Safari doesn't block voice playback.
 *
 * Returns:
 * - speakQuip(text): play TTS for a line (cached or generated)
 * - talkIntensity: 0–1 live amplitude for driving BreathingRook
 * - isTalking: whether audio is currently playing
 * - stopAudio: cancel current playback
 */

/** Window events fired when TTS playback starts/ends — the quip queue awaits
 * these instead of polling isTalkingRef every 100ms. */
export const SPEECH_START_EVENT = 'cp:speech-start';
export const SPEECH_END_EVENT = 'cp:speech-end';

export function useRookieVoice(audioOn: boolean) {
  const [isTalking, setIsTalking] = useState(false);
  const [intensity, setIntensity] = useState(0);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const manifestRef = useRef<Record<string, string> | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rafRef = useRef<number>(0);
  const smoothedRef = useRef(0);
  const lastSpokeAtRef = useRef(0); // timestamp when audio last finished
  const isTalkingRef = useRef(false); // ref mirror for non-reactive reads

  // Load manifest
  useEffect(() => {
    fetch('/rookie-voice/manifest.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) manifestRef.current = data; })
      .catch(() => {});

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (currentSourceRef.current) { try { currentSourceRef.current.stop(); } catch {} }
      // Don't close the shared AudioContext — it's shared across the app
    };
  }, []);

  // Single transition point for talking state: updates the ref SYNCHRONOUSLY
  // (the state mirror lags a render) and dispatches start/end events so the
  // quip queue can await speech instead of polling.
  const setTalking = useCallback((talking: boolean) => {
    isTalkingRef.current = talking;
    setIsTalking(talking);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(talking ? SPEECH_START_EVENT : SPEECH_END_EVENT));
    }
  }, []);

  // rAF amplitude loop
  useEffect(() => {
    if (!isTalking) {
      smoothedRef.current = 0;
      setIntensity(0);
      return;
    }

    const loop = () => {
      const analyser = analyserRef.current;
      if (!analyser) { rafRef.current = requestAnimationFrame(loop); return; }

      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(data);

      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const sample = (data[i] - 128) / 128;
        sum += sample * sample;
      }
      const rms = Math.sqrt(sum / data.length);
      const amplified = Math.min(1, rms * 4);

      const prev = smoothedRef.current;
      const smoothed = amplified > prev
        ? prev + (amplified - prev) * 0.6
        : prev + (amplified - prev) * 0.15;
      smoothedRef.current = smoothed;
      setIntensity(smoothed);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isTalking]);

  const getAudioContext = useCallback(() => {
    const ctx = getSharedAudioContext();
    if (!ctx) throw new Error('AudioContext unavailable');
    // Create analyser lazily (once per hook instance)
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;
    }
    return ctx;
  }, []);

  const stopAudio = useCallback(() => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch {}
      currentSourceRef.current = null;
    }
    setTalking(false);
  }, [setTalking]);

  const playDecoded = useCallback(async (buf: AudioBuffer) => {
    const ctx = getAudioContext();
    const analyser = analyserRef.current!;

    // Try to resume if suspended (warmupAudio should have already unlocked it)
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch {}
    }

    // If still suspended after resume attempt, iOS hasn't unlocked audio yet.
    // Drop this quip rather than queueing it (prevents the "all play at once" bug).
    if (ctx.state !== 'running') {
      console.warn('[RookieVoice] AudioContext not running — dropping quip. State:', ctx.state);
      return;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(analyser);
    analyser.connect(ctx.destination);
    src.onended = () => {
      try { src.disconnect(); } catch {}
      try { analyser.disconnect(); } catch {}
      currentSourceRef.current = null;
      lastSpokeAtRef.current = Date.now();
      setTalking(false);
    };
    src.start();
    currentSourceRef.current = src;
    setTalking(true);
  }, [getAudioContext, setTalking]);

  const playBuffer = useCallback(async (arrayBuffer: ArrayBuffer) => {
    const ctx = getAudioContext();
    const buf = await ctx.decodeAudioData(arrayBuffer);
    return playDecoded(buf);
  }, [getAudioContext, playDecoded]);

  const speakQuip = useCallback(async (text: string, voiceKey?: string) => {
    if (!audioOn) return;
    // Don't attempt TTS before a user gesture — AudioContext will be suspended
    // and the browser will log autoplay warnings. The text bubble still shows.
    const ctx = getSharedAudioContext();
    if (!ctx || ctx.state === 'suspended') return;
    stopAudio();

    // Try manifest cache — check voiceKey (template text) first, then exact text.
    // Skip any key containing { — pre-baked audio from templates would say placeholders literally.
    const manifest = manifestRef.current;
    if (manifest) {
      const voiceKeyUsable = voiceKey && !voiceKey.includes('{') && manifest[voiceKey];
      const textUsable = !text.includes('{') && manifest[text];
      const cacheKey = voiceKeyUsable ? voiceKey : textUsable ? text : null;
      if (cacheKey) {
        try {
          const file = manifest[cacheKey];
          // Decoded-buffer LRU: a repeated line plays from memory instead of
          // re-fetching + re-decoding the clip (~200-400ms saved on 3G).
          const cached = voiceBufferCache.get(file);
          if (cached) {
            voiceBufferCache.delete(file);
            voiceBufferCache.set(file, cached);
            await playDecoded(cached);
            return;
          }
          const res = await fetch(`/rookie-voice/${file}`);
          if (res.ok) {
            const buf = await getSharedAudioContext()!.decodeAudioData(await res.arrayBuffer());
            voiceBufferCache.set(file, buf);
            if (voiceBufferCache.size > VOICE_CACHE_MAX) {
              const oldest = voiceBufferCache.keys().next().value;
              if (oldest) voiceBufferCache.delete(oldest);
            }
            await playDecoded(buf);
            return;
          }
        } catch {}
      }
    }

    // Fall back to API
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
        await playBuffer(bytes.buffer);
      }
    } catch {}
  }, [audioOn, stopAudio, playBuffer, playDecoded]);

  /** Ref to timestamp (ms) when audio last finished playing */
  return { speakQuip, talkIntensity: intensity, isTalking, isTalkingRef, stopAudio, lastSpokeAtRef };
}
