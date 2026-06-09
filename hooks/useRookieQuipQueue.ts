'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { playSfx } from '@/lib/sounds';
import { safeRenderText } from '@/lib/speech/sanitize';
import { SPEECH_START_EVENT, SPEECH_END_EVENT } from '@/hooks/useRookieVoice';

/**
 * Unified quip queue for Rookie.
 *
 * All speech goes through this queue. Rookie finishes one quip before
 * starting the next. Moves wait for speech via `waitForIdle()`.
 *
 * Priority levels:
 * - 'high': game-end, coaching — goes to front of queue
 * - 'normal': game quips, mood shifts — FIFO
 * - 'low': ambient commentary — dropped if queue has items
 */

type Priority = 'high' | 'normal' | 'low';

interface SfxConfig {
  file: string;
  duration?: number;
  overlap?: number;
  delay?: number;
  pauseAfter?: number;
}

interface QueueItem {
  text: string;
  priority: Priority;
  /** Pre-substitution template text for voice cache lookup */
  voiceKey?: string;
  /** Sound effect config */
  sfx?: SfxConfig;
  /** If true, show text bubble but skip TTS (for Claude-generated unique text) */
  textOnly?: boolean;
}

const GAP_MS = 600; // pause between quips
const MIN_DISPLAY_MS = 2500; // minimum time a quip stays visible (even if audio finishes sooner)
const MAX_WAIT_FOR_START_MS = 3000; // if TTS never starts (audio off, error), resolve anyway

export function useRookieQuipQueue(
  speakQuip: (text: string, voiceKey?: string) => void,
  isTalkingRef: React.RefObject<boolean>,
) {
  const [displayText, setDisplayText] = useState<string | null>(null);
  const [msgKey, setMsgKey] = useState(0);
  const queueRef = useRef<QueueItem[]>([]);
  const processingRef = useRef(false);
  const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bumped by clearQueue() so in-flight async processing chains from a
  // cleared queue can detect they're stale and bail out.
  const epochRef = useRef(0);
  // Pending waitForIdle() resolvers — flushed whenever the queue drains.
  const idleResolversRef = useRef<(() => void)[]>([]);

  const isIdle = useCallback(
    () => !processingRef.current && queueRef.current.length === 0 && !isTalkingRef.current,
    [isTalkingRef],
  );

  /** Resolve any waitForIdle() callers if the queue is fully drained. */
  const notifyIfIdle = useCallback(() => {
    if (!isIdle() || idleResolversRef.current.length === 0) return;
    const resolvers = idleResolversRef.current;
    idleResolversRef.current = [];
    for (const r of resolvers) r();
  }, [isIdle]);

  /**
   * Wait for TTS to finish — event-driven (no 100ms polling). The speech layer
   * (useRookieVoice) dispatches SPEECH_START/END events on playback transitions.
   * Waits for speech to start, then for it to end. If speech never starts
   * within MAX_WAIT_FOR_START_MS (empty text, audio off, error), resolves anyway
   * so the queue can't get stuck.
   *
   * Must be called synchronously after speakQuip(): the listeners attach before
   * the (async) speakQuip can start playback, so the start event is never missed.
   */
  const waitForSpeechDone = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      let started = false;
      let settled = false;
      let startTimer: ReturnType<typeof setTimeout> | null = null;
      const onStart = () => {
        started = true;
        if (startTimer) { clearTimeout(startTimer); startTimer = null; }
      };
      const onEnd = () => { if (started) settle(); };
      const settle = () => {
        if (settled) return;
        settled = true;
        if (startTimer) clearTimeout(startTimer);
        window.removeEventListener(SPEECH_START_EVENT, onStart);
        window.removeEventListener(SPEECH_END_EVENT, onEnd);
        resolve();
      };
      window.addEventListener(SPEECH_START_EVENT, onStart);
      window.addEventListener(SPEECH_END_EVENT, onEnd);
      // Fallback: resolve if TTS never starts (empty text, audio off, error).
      startTimer = setTimeout(() => { if (!started) settle(); }, MAX_WAIT_FOR_START_MS);
    });
  }, []);

  const processQueue = useCallback(() => {
    if (processingRef.current) return;
    if (queueRef.current.length === 0) return;

    processingRef.current = true;
    const epoch = epochRef.current; // stale if clearQueue() runs mid-quip
    const item = queueRef.current.shift()!;
    const startTime = Date.now();

    // ── SFX quip: split at [SFX], speak part 1, play SFX, speak part 2 ──
    if (item.sfx && item.text.includes('[SFX]')) {
      const sanitizedText = safeRenderText(item.text, 'useRookieQuipQueue.sfx');
      const [before, after] = sanitizedText.split('[SFX]');
      const fullDisplay = sanitizedText.replace('[SFX]', '');
      const { file, duration, overlap = 0, delay = 0, pauseAfter = 0 } = item.sfx;

      setDisplayText(fullDisplay);
      setMsgKey(k => k + 1);

      (async () => {
        // Speak first part
        if (before.trim()) {
          speakQuip(before.trim());

          if (overlap > 0) {
            // SFX should cut into the end of speech.
            // Wait for speech, then subtract overlap (min 0) — so SFX fires
            // slightly before speech would naturally end. Since we can't predict
            // TTS duration, we poll and fire SFX `overlap`ms before TTS ends.
            // Practical approach: wait for speech done, then fire immediately
            // (the overlap value just means "no gap"). True mid-speech overlap
            // would need TTS duration prediction which we don't have.
            await waitForSpeechDone();
          } else {
            await waitForSpeechDone();
            if (delay > 0) await new Promise(r => setTimeout(r, delay));
          }
        }

        // Queue cleared while waiting (new game) — don't fire the SFX.
        if (epoch !== epochRef.current) return;

        // Play sound effect (with optional duration clip)
        await playSfx(file, duration);

        // Pause after SFX before part 2
        if (pauseAfter > 0) await new Promise(r => setTimeout(r, pauseAfter));

        // Speak second part
        if (after.trim() && epoch === epochRef.current) {
          speakQuip(after.trim());
          await waitForSpeechDone();
        }

        // Ensure minimum display time
        const remaining = MIN_DISPLAY_MS - (Date.now() - startTime);
        if (remaining > 0) await new Promise(r => setTimeout(r, remaining));
        if (epoch !== epochRef.current) return; // queue was cleared mid-quip
        processingRef.current = false;
        notifyIfIdle();
        if (queueRef.current.length > 0) {
          gapTimerRef.current = setTimeout(processQueue, GAP_MS);
        }
      })();
      return;
    }

    // ── Normal quip ──
    const cleanText = safeRenderText(item.text, 'useRookieQuipQueue.normal');
    setDisplayText(cleanText);
    setMsgKey(k => k + 1);
    if (!item.textOnly) {
      speakQuip(cleanText, item.voiceKey);
    }

    // Finish when BOTH audio is done AND minimum display time has passed —
    // event-driven: a single timer for the display floor, plus a speech-end
    // listener if audio is still playing when the floor elapses. This prevents
    // quips from being visually interrupted.
    let normalSettled = false;
    const finishNormal = () => {
      if (normalSettled) return;
      if (epoch !== epochRef.current) { // queue was cleared mid-quip
        normalSettled = true;
        window.removeEventListener(SPEECH_END_EVENT, finishNormal);
        return;
      }
      const remaining = MIN_DISPLAY_MS - (Date.now() - startTime);
      if (remaining > 0) {
        waitTimerRef.current = setTimeout(finishNormal, remaining);
        return;
      }
      if (isTalkingRef.current) return; // speech-end listener re-invokes us
      normalSettled = true;
      window.removeEventListener(SPEECH_END_EVENT, finishNormal);
      processingRef.current = false;
      notifyIfIdle();
      // Gap before next quip
      if (queueRef.current.length > 0) {
        gapTimerRef.current = setTimeout(processQueue, GAP_MS);
      }
    };
    window.addEventListener(SPEECH_END_EVENT, finishNormal);
    // Initial check after a minimum time (speech may not have started yet)
    waitTimerRef.current = setTimeout(finishNormal, 300);
  }, [speakQuip, isTalkingRef, waitForSpeechDone, notifyIfIdle]);

  /** Queue a quip. Plays immediately if idle, otherwise waits in line. */
  const queueQuip = useCallback((text: string, priority: Priority = 'normal', voiceKey?: string, sfx?: SfxConfig, textOnly?: boolean) => {
    // Low priority gets dropped if anything is queued or playing
    if (priority === 'low' && (queueRef.current.length > 0 || processingRef.current)) {
      return;
    }

    const item: QueueItem = { text, priority, voiceKey, sfx, textOnly };

    if (priority === 'high') {
      // Insert at front (after any other high-priority items)
      const firstNonHigh = queueRef.current.findIndex(q => q.priority !== 'high');
      if (firstNonHigh === -1) {
        queueRef.current.push(item);
      } else {
        queueRef.current.splice(firstNonHigh, 0, item);
      }
    } else {
      queueRef.current.push(item);
    }

    // Kick off processing if idle
    if (!processingRef.current) {
      processQueue();
    }
  }, [processQueue]);

  /** Returns a promise that resolves when the queue is empty and speech is done. */
  const waitForIdle = useCallback((): Promise<void> => {
    if (isIdle()) return Promise.resolve();
    return new Promise((resolve) => {
      idleResolversRef.current.push(resolve);
    });
  }, [isIdle]);

  // Idle waiters may be blocked only on speech (e.g. a quip spoken outside the
  // queue) — re-check whenever any speech ends.
  useEffect(() => {
    const onEnd = () => notifyIfIdle();
    window.addEventListener(SPEECH_END_EVENT, onEnd);
    return () => window.removeEventListener(SPEECH_END_EVENT, onEnd);
  }, [notifyIfIdle]);

  /** Clear the queue (e.g. on new game). */
  const clearQueue = useCallback(() => {
    epochRef.current++; // invalidate any in-flight processing chains
    queueRef.current = [];
    processingRef.current = false;
    if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    setDisplayText(null);
    notifyIfIdle();
  }, [notifyIfIdle]);

  // Cleanup on unmount — bump the epoch so any in-flight processing chain
  // bails instead of speaking/scheduling after unmount.
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps -- epochRef is a counter, not a DOM node; we intentionally bump the live value
      epochRef.current++;
      if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    };
  }, []);

  /** Clear the speech bubble text (e.g. after N moves) */
  const clearDisplay = useCallback(() => {
    setDisplayText(null);
  }, []);

  return {
    /** Queue a quip to be spoken */
    queueQuip,
    /** Wait for all queued speech to finish (use before Rookie moves) */
    waitForIdle,
    /** Clear the queue */
    clearQueue,
    /** Clear just the display text */
    clearDisplay,
    /** Current display text (for speech bubble) */
    displayText,
    /** Key for animation reset */
    msgKey,
  };
}
