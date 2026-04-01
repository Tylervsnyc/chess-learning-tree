/**
 * Simple Stockfish 18 adapter.
 * Uses the single-threaded WASM build (no SharedArrayBuffer needed).
 * Runs in a Web Worker via /stockfish/stockfish-18.js.
 */

export interface StockfishResult {
  bestMove: string | null;
}

type ResultCallback = (result: StockfishResult) => void;

class StockfishEngine {
  private worker: Worker | null = null;
  private pendingCallback: ResultCallback | null = null;
  private ready = false;
  private readyPromise: Promise<void> | null = null;

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

        if (line.startsWith('bestmove')) {
          const bestMove = line.split(' ')[1] || null;
          if (this.pendingCallback) {
            const cb = this.pendingCallback;
            this.pendingCallback = null;
            cb({ bestMove });
          }
        }
      };

      this.worker.onerror = (err) => {
        clearTimeout(timeout);
        reject(new Error('Stockfish worker error: ' + err.message));
      };

      this.worker.postMessage('uci');
    });

    return this.readyPromise;
  }

  /**
   * Get the best move for a position.
   * @param fen - FEN string
   * @param skillLevel - 0-20 (Stockfish UCI Skill Level)
   * @param depth - search depth
   */
  getBestMove(fen: string, skillLevel: number, depth: number): Promise<string | null> {
    if (!this.worker || !this.ready) return Promise.resolve(null);

    return new Promise((resolve) => {
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
    if (!this.worker || !this.ready) return Promise.resolve(null);

    const clampedElo = Math.max(1320, Math.min(3190, targetElo));

    return new Promise((resolve) => {
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
    if (!this.worker || !this.ready) return Promise.resolve(null);

    const sideToMove = fen.split(' ')[1] || 'w';
    const flip = sideToMove === 'b' ? -1 : 1;

    return new Promise((resolve) => {
      let lastCp: number | null = null;
      let lastMate: number | null = null;

      this.pendingCallback = (result) => {
        resolve({
          cp: lastCp !== null ? lastCp * flip : null,
          mate: lastMate !== null ? lastMate * flip : null,
          bestMove: result.bestMove,
        });
      };

      const origOnMessage = this.worker!.onmessage;
      this.worker!.onmessage = (e) => {
        const line = typeof e.data === 'string' ? e.data : '';

        if (line.startsWith('info') && line.includes(' score ')) {
          const cpMatch = line.match(/score cp (-?\d+)/);
          if (cpMatch) {
            lastCp = parseInt(cpMatch[1], 10);
            lastMate = null; // cp and mate are mutually exclusive per info line
          }

          const mateMatch = line.match(/score mate (-?\d+)/);
          if (mateMatch) {
            lastMate = parseInt(mateMatch[1], 10);
            lastCp = null;
          }
        }

        if (origOnMessage && this.worker) origOnMessage.call(this.worker, e);
      };

      this.worker!.postMessage(`setoption name Skill Level value 20`);
      this.worker!.postMessage('ucinewgame');
      this.worker!.postMessage(`position fen ${fen}`);
      this.worker!.postMessage(`go depth ${depth}`);
    });
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
    this.readyPromise = null;
  }
}

export const stockfish = new StockfishEngine();
