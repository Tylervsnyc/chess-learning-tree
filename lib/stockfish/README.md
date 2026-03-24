# Stockfish WASM Integration

Lightweight Web Worker-based Stockfish evaluation for Next.js/React.

## Quick Start

```typescript
import { useStockfish } from '@/hooks/useStockfish';

function MyComponent() {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const result = useStockfish(fen, { depth: 20 });

  return (
    <div>
      <p>Eval: {result.eval ? (result.eval / 100).toFixed(2) : '—'}</p>
      <p>Best move: {result.bestMove}</p>
      <p>Status: {result.isSearching ? 'Searching...' : 'Ready'}</p>
    </div>
  );
}
```

## Hook Signature

```typescript
function useStockfish(
  fen: string | null,
  options?: {
    depth?: number;      // 1-30, default 20
    multiPv?: number;    // 1+, default 1
    threads?: number;    // 1+, default 1
    enabled?: boolean;   // default true
  }
): StockfishResult
```

## Result Interface

```typescript
interface StockfishResult {
  eval: number | null;       // Centipawns (+100 = +1 pawn advantage)
  mate: number | null;       // Mate in N moves
  bestLine: string[];        // Best line as UCI moves
  bestMove: string | null;   // Best move in UCI
  depth: number;             // Current search depth
  isReady: boolean;          // Engine ready
  isSearching: boolean;      // Currently searching
}
```

## Files

- `stockfish-worker.ts` — Worker adapter
- `README.md` — This file

## See Also

- `hooks/useStockfish.ts` — React hook
- `components/2026candidates/StockfishDemo.tsx` — Full example
- `.claude/stockfish-integration.md` — Complete guide
