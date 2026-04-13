'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getSharedAudioContext } from '@/lib/sounds';

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

  // Keep ref in sync for non-reactive reads (e.g. inside setTimeout)
  useEffect(() => { isTalkingRef.current = isTalking; }, [isTalking]);

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
    setIsTalking(false);
  }, []);

  const playBuffer = useCallback(async (arrayBuffer: ArrayBuffer) => {
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

    const buf = await ctx.decodeAudioData(arrayBuffer);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(analyser);
    analyser.connect(ctx.destination);
    src.onended = () => {
      try { src.disconnect(); } catch {}
      try { analyser.disconnect(); } catch {}
      currentSourceRef.current = null;
      lastSpokeAtRef.current = Date.now();
      setIsTalking(false);
    };
    src.start();
    currentSourceRef.current = src;
    setIsTalking(true);
  }, [getAudioContext]);

  const speakQuip = useCallback(async (text: string, voiceKey?: string) => {
    if (!audioOn) return;
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
          const res = await fetch(`/rookie-voice/${manifest[cacheKey]}`);
          if (res.ok) {
            await playBuffer(await res.arrayBuffer());
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
  }, [audioOn, stopAudio, playBuffer]);

  /** Ref to timestamp (ms) when audio last finished playing */
  return { speakQuip, talkIntensity: intensity, isTalking, isTalkingRef, stopAudio, lastSpokeAtRef };
}
