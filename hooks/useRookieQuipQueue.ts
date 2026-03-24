'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

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

interface QueueItem {
  text: string;
  priority: Priority;
}

const GAP_MS = 600; // pause between quips

export function useRookieQuipQueue(
  speakQuip: (text: string) => void,
  isTalkingRef: React.RefObject<boolean>,
) {
  const [displayText, setDisplayText] = useState<string | null>(null);
  const [msgKey, setMsgKey] = useState(0);
  const queueRef = useRef<QueueItem[]>([]);
  const processingRef = useRef(false);
  const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processQueue = useCallback(() => {
    if (processingRef.current) return;
    if (queueRef.current.length === 0) return;

    processingRef.current = true;
    const item = queueRef.current.shift()!;

    setDisplayText(item.text);
    setMsgKey(k => k + 1);
    speakQuip(item.text);

    // Poll until speech is done, then process next after gap
    const waitForDone = () => {
      if (isTalkingRef.current) {
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
  }, [speakQuip, isTalkingRef]);

  /** Queue a quip. Plays immediately if idle, otherwise waits in line. */
  const queueQuip = useCallback((text: string, priority: Priority = 'normal') => {
    // Low priority gets dropped if anything is queued or playing
    if (priority === 'low' && (queueRef.current.length > 0 || processingRef.current)) {
      return;
    }

    const item: QueueItem = { text, priority };

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
