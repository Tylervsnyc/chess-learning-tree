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
type QueuedRequest = { run: () => void; cancel: () => void };

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
    next.run();
  }

  /** Resolve all queued requests with null (used on worker error). */
  private flushQueue() {
    const pending = this.queue;
    this.queue = [];
    for (const req of pending) req.cancel();
  }

  /** Enqueue a request that will run when the engine is free. */
  private enqueue<T>(fn: (resolve: (value: T) => void) => void): Promise<T> {
    if (!this.worker || !this.ready || this.dead) return Promise.resolve(null as T);
    return new Promise<T>((resolve) => {
      this.queue.push({
        run: () => fn(resolve),
        cancel: () => resolve(null as T),
      });
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
      this.worker!.postMessage('setoption name UCI_LimitStrength value false');
      this.worker!.postMessage('setoption name MultiPV value 1');
      this.worker!.postMessage(`setoption name Skill Level value ${skillLevel}`);
      this.worker!.postMessage('ucinewgame');
      this.worker!.postMessage(`position fen ${fen}`);
      this.worker!.postMessage(`go depth ${depth}`);
    });
  }

  /**
   * Get a move sampled from Stockfish's top MultiPV candidates.
   * At low Skill + shallow depth + wide pool, Rookie plays like a weak human
   * who considered several plausible moves — not an engine that hangs a queen.
   *
   * `tolerance` (centipawns) switches on EVAL-GATED sampling: instead of taking
   * the single best move (pure argmax, which makes Rookie replay identical games
   * from identical positions), she picks uniformly among every candidate within
   * `tolerance` of the top eval. One clearly-best move → she plays it. Two near-
   * equal moves → she varies. Strength holds because she never picks a move that's
   * meaningfully worse than best — but games diverge wherever a real choice exists.
   * When `tolerance` is undefined, behavior is the original top-`poolSize` uniform pick.
   */
  getBestMoveSampled(
    fen: string,
    skillLevel: number,
    depth: number,
    multiPV: number,
    poolSize: number,
    tolerance?: number,
  ): Promise<string | null> {
    const candidates: (string | null)[] = new Array(multiPV).fill(null);
    const scores: (number | null)[] = new Array(multiPV).fill(null);

    return this.enqueue((resolve) => {
      this.pendingCallback = (result) => {
        const populated = candidates
          .map((move, i) => ({ move, score: scores[i] }))
          .filter((c): c is { move: string; score: number | null } => !!c.move);

        if (populated.length === 0) {
          resolve(result.bestMove);
          return;
        }

        // Eval-gated sampling — pick among moves within `tolerance` cp of the best.
        // Scores are from the side-to-move's perspective (higher = better for Rookie).
        if (tolerance !== undefined) {
          const scored = populated.filter(
            (c): c is { move: string; score: number } => c.score !== null,
          );
          if (scored.length > 0) {
            const best = Math.max(...scored.map((c) => c.score));
            const near = scored.filter((c) => best - c.score <= tolerance);
            resolve(near[Math.floor(Math.random() * near.length)].move);
            return;
          }
        }

        // Default — uniform pick from the top `poolSize` candidates.
        const pool = populated.slice(0, Math.min(poolSize, populated.length));
        resolve(pool[Math.floor(Math.random() * pool.length)].move);
      };

      this.infoListener = (line: string) => {
        const mpvMatch = line.match(/ multipv (\d+)/);
        const pvMatch = line.match(/ pv ([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (!mpvMatch || !pvMatch) return;
        const idx = parseInt(mpvMatch[1], 10) - 1;
        if (idx < 0 || idx >= multiPV) return;
        candidates[idx] = pvMatch[1];

        // Capture this line's eval so we can gate by it. Mate scores collapse to a
        // huge cp value (mate-in-1 beats mate-in-5), so a mate always clears tolerance.
        const cpMatch = line.match(/ score cp (-?\d+)/);
        const mateMatch = line.match(/ score mate (-?\d+)/);
        if (cpMatch) {
          scores[idx] = parseInt(cpMatch[1], 10);
        } else if (mateMatch) {
          const m = parseInt(mateMatch[1], 10);
          scores[idx] = m > 0 ? 100000 - m : -100000 - m;
        }
      };

      this.worker!.postMessage('setoption name UCI_LimitStrength value false');
      this.worker!.postMessage(`setoption name Skill Level value ${skillLevel}`);
      this.worker!.postMessage(`setoption name MultiPV value ${multiPV}`);
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
    // Resolve every queued caller with null so nobody hangs.
    const pending = this.queue;
    this.queue = [];
    this.busy = false;
    for (const req of pending) req.cancel();
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
