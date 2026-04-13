/**
 * Maia3 adapter — singleton that manages the ONNX web worker.
 * Mirrors the stockfish-adapter pattern: lazy init, queue-based, off main thread.
 */

import { preprocessMaia3, processOutputsMaia3 } from './tensor';

// All possible statuses the Maia engine can be in
export type MaiaStatus = 'idle' | 'loading' | 'no-cache' | 'downloading' | 'ready' | 'error';
// The status field is narrowed at assignment time but can be any MaiaStatus at runtime
type InternalStatus = MaiaStatus;

interface PendingInference {
  resolve: (value: { logitsMove: Float32Array; logitsValue: Float32Array }) => void;
  reject: (error: Error) => void;
}

interface StatusListener {
  onStatus?: (status: MaiaStatus) => void;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

const MODEL_URL = '/maia3/maia3_simplified.onnx';
const MODEL_VERSION = '3';

class MaiaEngine {
  private worker: Worker | null = null;
  private status: InternalStatus = 'idle';
  private pendingInferences = new Map<number, PendingInference>();
  private nextId = 0;
  private initPromise: Promise<void> | null = null;
  private downloadPromise: Promise<void> | null = null;
  private listeners = new Set<StatusListener>();

  getStatus(): MaiaStatus { return this.status; }

  addListener(listener: StatusListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(status: MaiaStatus) {
    this.status = status;
    for (const l of this.listeners) l.onStatus?.(status);
  }

  init(): Promise<void> {
    if (this.status === 'ready') return Promise.resolve();
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve) => {
      if (typeof window === 'undefined' || typeof Worker === 'undefined') {
        resolve();
        return;
      }

      this.worker = new Worker('/maia-worker.js');

      this.worker.onmessage = (e) => {
        const msg = e.data;
        switch (msg.type) {
          case 'status':
            this.notify(msg.status);
            if (msg.status === 'ready' || msg.status === 'no-cache') resolve();
            break;
          case 'progress':
            for (const l of this.listeners) l.onProgress?.(msg.progress);
            break;
          case 'error':
            if (msg.id !== undefined) {
              const pending = this.pendingInferences.get(msg.id);
              if (pending) {
                pending.reject(new Error(msg.message));
                this.pendingInferences.delete(msg.id);
              }
            } else {
              this.notify('error');
              for (const l of this.listeners) l.onError?.(msg.message);
            }
            break;
          case 'inference-result': {
            const pending = this.pendingInferences.get(msg.id);
            if (pending) {
              pending.resolve({
                logitsMove: new Float32Array(msg.logitsMove),
                logitsValue: new Float32Array(msg.logitsValue),
              });
              this.pendingInferences.delete(msg.id);
            }
            break;
          }
        }
      };

      this.worker.onerror = (err) => {
        console.error('[maia] worker error:', err);
        this.notify('error');
        resolve();
      };

      this.worker.postMessage({ type: 'init', modelUrl: MODEL_URL, modelVersion: MODEL_VERSION });
    });

    return this.initPromise;
  }

  /** Download model (if not cached). Returns when ready. */
  async ensureReady(): Promise<boolean> {
    await this.init();
    // Status is set asynchronously by worker messages, so check via getter
    if (this.getStatus() === 'ready') return true;
    if (this.getStatus() === 'error') return false;

    // Need to download
    if (this.downloadPromise) {
      await this.downloadPromise;
      return this.getStatus() === 'ready';
    }

    this.downloadPromise = new Promise<void>((resolve) => {
      const unsub = this.addListener({
        onStatus: (s) => {
          if (s === 'ready' || s === 'error') {
            unsub();
            resolve();
          }
        },
      });
      this.worker?.postMessage({ type: 'download' });
    });

    await this.downloadPromise;
    return this.getStatus() === 'ready';
  }

  /**
   * Evaluate a position: returns move probabilities + win probability.
   * @param fen - Position to evaluate
   * @param eloSelf - Player's approximate ELO (1100-1900)
   * @param eloOppo - Opponent's approximate ELO
   */
  async evaluate(
    fen: string,
    eloSelf: number,
    eloOppo: number,
  ): Promise<{ policy: Record<string, number>; winProb: number } | null> {
    if (this.status !== 'ready' || !this.worker) return null;

    const { boardTokens, legalMoves } = preprocessMaia3(fen);
    const id = this.nextId++;

    const result = await new Promise<{ logitsMove: Float32Array; logitsValue: Float32Array }>((resolve, reject) => {
      this.pendingInferences.set(id, { resolve, reject });
      this.worker!.postMessage(
        {
          type: 'inference',
          id,
          tokens: boardTokens.buffer,
          eloSelfs: Float32Array.from([eloSelf]).buffer,
          eloOppos: Float32Array.from([eloOppo]).buffer,
          batchSize: 1,
        },
        [boardTokens.buffer, Float32Array.from([eloSelf]).buffer, Float32Array.from([eloOppo]).buffer],
      );
    });

    return processOutputsMaia3(fen, result.logitsMove, result.logitsValue, legalMoves);
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    this.status = 'idle';
    this.initPromise = null;
    this.downloadPromise = null;
    this.pendingInferences.clear();
  }
}

export const maia = new MaiaEngine();
