/**
 * Stockfish Web Worker wrapper
 * Manages Stockfish UCI engine in a separate thread
 */

export interface StockfishMessage {
  type: 'eval' | 'bestmove' | 'error' | 'ready';
  eval?: number | null;
  mate?: number | null;
  bestLine?: string[];
  bestMove?: string | null;
  depth?: number;
  nodes?: number;
  error?: string;
}

export interface StockfishOptions {
  depth?: number;
  multiPv?: number;
  threads?: number;
}

type MessageHandler = (message: StockfishMessage) => void;

class StockfishWorkerAdapter {
  private worker: Worker | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private isInitialized = false;
  private isSearching = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.initializeInternal();
    return this.initPromise;
  }

  private async initializeInternal(): Promise<void> {
    try {
      // Load worker from public/stockfish directory
      // Next.js serves /public files at the root path
      this.worker = new Worker('/stockfish/sf-worker.js');

      this.worker.onmessage = (event) => {
        this.handleWorkerMessage(event.data);
      };

      this.worker.onerror = (error) => {
        console.error('Stockfish worker error:', error);
        this.broadcastMessage({
          type: 'error',
          error: error.message,
        });
      };

      // Wait for engine ready or timeout after 5 seconds
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.messageHandlers.delete(handler);
          reject(new Error('Stockfish initialization timeout'));
        }, 15000);

        const handler = (msg: StockfishMessage) => {
          if (msg.type === 'ready') {
            clearTimeout(timeout);
            this.messageHandlers.delete(handler);
            resolve();
          }
        };
        this.messageHandlers.add(handler);
        this.sendUCI('uci');
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Stockfish worker:', error);
      throw error;
    }
  }

  private handleWorkerMessage(data: string): void {
    if (!data || typeof data !== 'string') return;

    const lines = data.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;

      if (line.startsWith('info')) {
        this.parseInfoLine(line);
      } else if (line.startsWith('bestmove')) {
        this.parseBestmoveLine(line);
        this.isSearching = false;
      } else if (line === 'uciok') {
        this.broadcastMessage({ type: 'ready' });
      } else if (line.startsWith('error:')) {
        console.error('Stockfish:', line);
        this.broadcastMessage({ type: 'error', error: line });
      }
      // Silently ignore other UCI output (option, id, etc.)
    }
  }

  private parseInfoLine(line: string): void {
    const parts = line.split(' ');
    const message: StockfishMessage = {
      type: 'eval',
      eval: null,
      mate: null,
      bestLine: [],
      depth: 0,
      nodes: 0,
    };

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part === 'depth' && parts[i + 1]) {
        message.depth = parseInt(parts[i + 1], 10);
        i++;
      } else if (part === 'nodes' && parts[i + 1]) {
        message.nodes = parseInt(parts[i + 1], 10);
        i++;
      } else if (part === 'cp' && parts[i + 1]) {
        message.eval = parseInt(parts[i + 1], 10);
        message.mate = null;
        i++;
      } else if (part === 'mate' && parts[i + 1]) {
        message.mate = parseInt(parts[i + 1], 10);
        message.eval = null;
        i++;
      } else if (part === 'pv' && i + 1 < parts.length) {
        // Collect all remaining parts as the best line
        message.bestLine = parts.slice(i + 1);
        break;
      }
    }

    if (message.depth! > 0) {
      this.broadcastMessage(message);
    }
  }

  private parseBestmoveLine(line: string): void {
    const parts = line.split(' ');
    const bestMove = parts[1] || null;
    const ponderMove = parts[3] || null;

    this.broadcastMessage({
      type: 'bestmove',
      bestMove,
    });
  }

  private broadcastMessage(message: StockfishMessage): void {
    Array.from(this.messageHandlers).forEach((handler) => {
      handler(message);
    });
  }

  private sendUCI(command: string): void {
    if (!this.worker) {
      console.error('Worker not initialized');
      return;
    }
    this.worker.postMessage(command);
  }

  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public setPosition(fen: string): void {
    this.stop();
    this.sendUCI(`position fen ${fen}`);
  }

  public setPositionMoves(moves: string[]): void {
    this.stop();
    this.sendUCI(`position startpos moves ${moves.join(' ')}`);
  }

  public go(options: StockfishOptions = {}): void {
    const { depth = 20, multiPv = 1, threads = 1 } = options;

    this.sendUCI(`setoption name Threads value ${threads}`);
    this.sendUCI(`setoption name MultiPV value ${multiPv}`);

    this.sendUCI(`go depth ${depth}`);
    this.isSearching = true;
  }

  public stop(): void {
    if (this.isSearching) {
      this.sendUCI('stop');
      this.isSearching = false;
    }
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public isSearchingNow(): boolean {
    return this.isSearching;
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.messageHandlers.clear();
    this.isInitialized = false;
    this.isSearching = false;
  }
}

export const stockfishAdapter = new StockfishWorkerAdapter();
