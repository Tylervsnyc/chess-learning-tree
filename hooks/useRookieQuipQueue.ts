'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { playSfx } from '@/lib/sounds';
import { safeRenderText } from '@/lib/speech/sanitize';

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
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Wait for TTS to finish: first waits for isTalking to become true (started), then waits for it to become false (done). */
  const waitForSpeechDone = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      let started = false;
      let attempts = 0;
      const MAX_WAIT_FOR_START = 30; // 3s max to wait for TTS to start (30 * 100ms)
      const check = () => {
        if (!started) {
          if (isTalkingRef.current) {
            started = true;
          } else {
            attempts++;
            // If TTS never starts after MAX_WAIT, resolve anyway (e.g. empty text, error)
            if (attempts >= MAX_WAIT_FOR_START) { resolve(); return; }
          }
        }
        if (started && !isTalkingRef.current) {
          resolve();
        } else {
          waitTimerRef.current = setTimeout(check, 100);
        }
      };
      // Give TTS a moment to kick off before polling
      waitTimerRef.current = setTimeout(check, 150);
    });
  }, [isTalkingRef]);

  const processQueue = useCallback(() => {
    if (processingRef.current) return;
    if (queueRef.current.length === 0) return;

    processingRef.current = true;
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

        // Play sound effect (with optional duration clip)
        await playSfx(file, duration);

        // Pause after SFX before part 2
        if (pauseAfter > 0) await new Promise(r => setTimeout(r, pauseAfter));

        // Speak second part
        if (after.trim()) {
          speakQuip(after.trim());
          await waitForSpeechDone();
        }

        // Ensure minimum display time
        const remaining = MIN_DISPLAY_MS - (Date.now() - startTime);
        if (remaining > 0) await new Promise(r => setTimeout(r, remaining));
        processingRef.current = false;
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

    // Poll until BOTH audio is done AND minimum display time has passed.
    // This prevents quips from being visually interrupted.
    const waitForDone = () => {
      const elapsed = Date.now() - startTime;
      const audioStillPlaying = isTalkingRef.current;
      const needsMoreDisplayTime = elapsed < MIN_DISPLAY_MS;

      if (audioStillPlaying || needsMoreDisplayTime) {
        waitTimerRef.current = setTimeout(waitForDone, 100);
      } else {
        processingRef.current = false;
        // Gap before next quip
        if (queueRef.current.length > 0) {
          gapTimerRef.current = setTimeout(processQueue, GAP_MS);
        }
      }
    };
    // Start checking after a minimum time (speech may not have started yet)
    waitTimerRef.current = setTimeout(waitForDone, 300);
  }, [speakQuip, isTalkingRef, waitForSpeechDone]);

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
    return new Promise((resolve) => {
      const check = () => {
        if (!processingRef.current && queueRef.current.length === 0 && !isTalkingRef.current) {
          resolve();
        } else {
          idleTimerRef.current = setTimeout(check, 100);
        }
      };
      check();
    });
  }, [isTalkingRef]);

  /** Clear the queue (e.g. on new game). */
  const clearQueue = useCallback(() => {
    queueRef.current = [];
    processingRef.current = false;
    if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setDisplayText(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
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
