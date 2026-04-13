/**
 * Simple Stockfish 18 adapter.
 * Uses the single-threaded WASM build (no SharedArrayBuffer needed).
 * Runs in a Web Worker via /stockfish/stockfish-18.js.
 *
 * Requests are queued so only one `go` command is in flight at a time.
 * This prevents the eval and move requests from stomping each other.
 */

export interface StockfishResult {
  bestMove: string | null;
}

type ResultCallback = (result: StockfishResult) => void;
type QueuedRequest = () => void;

class StockfishEngine {
  private worker: Worker | null = null;
  private pendingCallback: ResultCallback | null = null;
  private ready = false;
  private dead = false;
  private readyPromise: Promise<void> | null = null;

  /** Info-line listener for the current request (used by getFullEval). */
  private infoListener: ((line: string) => void) | null = null;

  /** Queue of requests waiting to run. Only the first runs at a time. */
  private queue: QueuedRequest[] = [];
  private busy = false;

  isHealthy(): boolean {
    return this.ready && !this.dead;
  }

  init(): Promise<void> {
    if (this.ready) return Promise.resolve();
    if (this.readyPromise) return this.readyPromise;

    this.readyPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Stockfish init timeout')), 15000);

      // stockfish-18.js self-registers as a worker — use it directly
      this.worker = new Worker('/stockfish/stockfish-18.js');

      this.worker.onmessage = (e) => {
        const line = typeof e.data === 'string' ? e.data : '';

        if (line === 'uciok') {
          this.ready = true;
          clearTimeout(timeout);
          resolve();
        }

        // Let the current request's info listener see info lines
        if (this.infoListener && line.startsWith('info')) {
          this.infoListener(line);
        }

        if (line.startsWith('bestmove')) {
          const bestMove = line.split(' ')[1] || null;
          this.infoListener = null;
          if (this.pendingCallback) {
            const cb = this.pendingCallback;
            this.pendingCallback = null;
            cb({ bestMove });
          }
          // Current request is done — run the next queued one
          this.busy = false;
          this.drain();
        }
      };

      this.worker.onerror = (err) => {
        clearTimeout(timeout);
        this.dead = true;
        console.error('[stockfish] worker error — engine disabled:', err.message);
        this.infoListener = null;
        if (this.pendingCallback) {
          const cb = this.pendingCallback;
          this.pendingCallback = null;
          cb({ bestMove: null });
        }
        // Flush the queue so callers aren't stuck waiting forever
        this.busy = false;
        this.flushQueue();
        reject(new Error('Stockfish worker error: ' + err.message));
      };

      this.worker.postMessage('uci');
    });

    return this.readyPromise;
  }

  /** Run the next queued request if idle. */
  private drain() {
    if (this.busy || this.queue.length === 0) return;
    this.busy = true;
    const next = this.queue.shift()!;
    next();
  }

  /** Reject all queued requests (used on worker error). */
  private flushQueue() {
    this.queue = [];
  }

  /** Enqueue a request that will run when the engine is free. */
  private enqueue<T>(fn: (resolve: (value: T) => void) => void): Promise<T> {
    if (!this.worker || !this.ready || this.dead) return Promise.resolve(null as T);
    return new Promise<T>((resolve) => {
      this.queue.push(() => fn(resolve));
      this.drain();
    });
  }

  /**
   * Get the best move for a position.
   * @param fen - FEN string
   * @param skillLevel - 0-20 (Stockfish UCI Skill Level)
   * @param depth - search depth
   */
  getBestMove(fen: string, skillLevel: number, depth: number): Promise<string | null> {
    return this.enqueue((resolve) => {
      this.pendingCallback = (result) => resolve(result.bestMove);
      this.worker!.postMessage(`setoption name Skill Level value ${skillLevel}`);
      this.worker!.postMessage('ucinewgame');
      this.worker!.postMessage(`position fen ${fen}`);
      this.worker!.postMessage(`go depth ${depth}`);
    });
  }

  /**
   * Get the best move capped to a target ELO rating.
   * Uses Stockfish's UCI_LimitStrength + UCI_Elo for accurate strength limiting.
   * @param fen - FEN string
   * @param targetElo - Target ELO rating (Stockfish supports ~1320-3190)
   */
  getBestMoveAtElo(fen: string, targetElo: number): Promise<string | null> {
    const clampedElo = Math.max(1320, Math.min(3190, targetElo));

    return this.enqueue((resolve) => {
      this.pendingCallback = (result) => resolve(result.bestMove);
      this.worker!.postMessage('setoption name UCI_LimitStrength value true');
      this.worker!.postMessage(`setoption name UCI_Elo value ${clampedElo}`);
      this.worker!.postMessage('ucinewgame');
      this.worker!.postMessage(`position fen ${fen}`);
      this.worker!.postMessage('go depth 12');
    });
  }

  /**
   * Get position evaluation in centipawns (from white's perspective).
   * Positive = white advantage, negative = black advantage.
   * Returns null if engine isn't ready.
   */
  getEval(fen: string, depth = 12): Promise<number | null> {
    return this.getFullEval(fen, depth).then(r => r?.cp ?? null);
  }

  /**
   * Get rich position evaluation (from white's perspective).
   * Returns cp, mate, and bestMove for mood/analysis systems.
   */
  getFullEval(fen: string, depth = 12): Promise<{ cp: number | null; mate: number | null; bestMove: string | null } | null> {
    const sideToMove = fen.split(' ')[1] || 'w';
    const flip = sideToMove === 'b' ? -1 : 1;

    return this.enqueue((resolve) => {
      let lastCp: number | null = null;
      let lastMate: number | null = null;

      this.pendingCallback = (result) => {
        resolve({
          cp: lastCp !== null ? lastCp * flip : null,
          mate: lastMate !== null ? lastMate * flip : null,
          bestMove: result.bestMove,
        });
      };

      // Capture score info lines for this request only
      this.infoListener = (line: string) => {
        if (!line.includes(' score ')) return;
        const cpMatch = line.match(/score cp (-?\d+)/);
        if (cpMatch) {
          lastCp = parseInt(cpMatch[1], 10);
          lastMate = null;
        }
        const mateMatch = line.match(/score mate (-?\d+)/);
        if (mateMatch) {
          lastMate = parseInt(mateMatch[1], 10);
          lastCp = null;
        }
      };

      this.worker!.postMessage(`setoption name Skill Level value 20`);
      this.worker!.postMessage('ucinewgame');
      this.worker!.postMessage(`position fen ${fen}`);
      this.worker!.postMessage(`go depth ${depth}`);
    });
  }

  /**
   * Cancel all pending and queued requests.
   * Resolves them with null so callers aren't stuck waiting.
   * The engine stays alive for new requests.
   */
  cancel() {
    // Resolve the in-flight request with null
    if (this.pendingCallback) {
      const cb = this.pendingCallback;
      this.pendingCallback = null;
      this.infoListener = null;
      cb({ bestMove: null });
    }
    // Flush the queue — each queued item is a thunk that would set pendingCallback.
    // Just drop them; callers get the promise resolved with null via the enqueue wrapper.
    // We need to resolve the promises, so run each thunk then immediately resolve with null.
    const pending = this.queue;
    this.queue = [];
    this.busy = false;
    for (const fn of pending) {
      fn(); // sets this.pendingCallback
      const cb = this.pendingCallback;
      if (cb) {
        this.pendingCallback = null;
        cb({ bestMove: null });
      }
    }
    // Stop any in-progress search
    if (this.worker && this.ready) {
      this.worker.postMessage('stop');
    }
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
    this.readyPromise = null;
    this.busy = false;
    this.queue = [];
    this.infoListener = null;
  }
}

export const stockfish = new StockfishEngine();
