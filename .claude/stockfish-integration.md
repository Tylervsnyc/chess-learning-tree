# Stockfish WASM Integration

A complete Web Worker-based Stockfish integration for Next.js 16 / React 19 / TypeScript chess app.

## Architecture

```
useStockfish (React hook)
    ↓
stockfishAdapter (singleton)
    ↓
Web Worker (/public/stockfish/stockfish.worker.js)
    ↓
Stockfish WASM (/public/stockfish/stockfish.wasm)
```

## Installation & Setup

### 1. Dependencies

The package `stockfish.wasm` is already installed. Files are in `/node_modules/stockfish.wasm`:
- `stockfish.js` — Main JavaScript file
- `stockfish.worker.js` — Worker wrapper
- `stockfish.wasm` — Binary engine (~350KB)

### 2. Public Files

Stockfish files are copied to `/public/stockfish/` for Next.js to serve:
- `/public/stockfish/stockfish.wasm`
- `/public/stockfish/stockfish.worker.js`
- `/public/stockfish/stockfish.js`

These are served at runtime as `/stockfish/stockfish.wasm`, etc.

## Usage

### Basic Example

```typescript
import { useStockfish } from '@/hooks/useStockfish';

export function Board({ fen }: { fen: string }) {
  const eval = useStockfish(fen, { depth: 20 });

  return (
    <div>
      <p>Eval: {eval.eval ? (eval.eval / 100).toFixed(2) : '—'}</p>
      <p>Depth: {eval.depth}</p>
      <p>Best move: {eval.bestMove}</p>
    </div>
  );
}
```

### With EvalBar Component

The existing `EvalBar` component can display Stockfish results:

```typescript
import { EvalBar } from '@/components/2026candidates';

export function Game() {
  const eval = useStockfish(fen);

  return (
    <EvalBar
      eval={eval.eval || 0}
      white={whitePlayer}
      black={blackPlayer}
    />
  );
}
```

### Hook Options

```typescript
useStockfish(fen, {
  depth: 20,        // Max search depth (default: 20)
  multiPv: 1,       // Number of principal variations (default: 1)
  threads: 1,       // CPU threads (default: 1)
  enabled: true,    // Toggle evaluation on/off (default: true)
})
```

### Return Value

```typescript
interface StockfishResult {
  eval: number | null;          // Centipawns (positive = white advantage)
  mate: number | null;          // Mate in N moves (or null if not mate)
  bestLine: string[];           // Best line as UCI moves
  bestMove: string | null;      // Best move in UCI format
  depth: number;                // Current search depth
  isReady: boolean;             // Engine initialized and ready
  isSearching: boolean;         // Currently searching
}
```

## Implementation Details

### `lib/stockfish/stockfish-worker.ts`

Singleton adapter that manages the Web Worker lifecycle:

- **`initialize()`** — Loads worker and initializes Stockfish engine
- **`setPosition(fen)`** — Sets board position
- **`go(options)`** — Starts search with depth/multiPV options
- **`stop()`** — Stops current search
- **`onMessage(handler)`** — Subscribe to evaluation updates
- **`terminate()`** — Clean up worker

### `hooks/useStockfish.ts`

React hook that:

- Initializes Stockfish on mount (only once, in browser)
- Triggers new search when FEN changes
- Parses UCI output (info/bestmove lines)
- Extracts eval, mate, best line, depth
- Handles SSR safety (checks `typeof window`)
- Auto-stops searches when unmounting

### Message Flow

1. Hook calls `stockfishAdapter.setPosition(fen)`
2. Adapter sends UCI command to worker: `position fen ...`
3. Hook calls `stockfishAdapter.go(options)`
4. Worker receives and executes search
5. Worker sends back `info` lines (every depth increase)
6. Adapter parses `info` and broadcasts updates
7. Hook state updates, component re-renders
8. When search completes, worker sends `bestmove`

## UCI Parsing

Info lines are parsed to extract:

```
info depth 20 cp +85 pv e2e4 c7c5 ...
       ↓     ↓      ↓  ↓
     depth  eval   bestLine
```

Mate lines:

```
info depth 10 mate 3 pv Qh5+ g6 Qh6#
                  ↓
             mate in 3
```

## File Structure

```
lib/stockfish/
  └── stockfish-worker.ts    # Adapter & worker management

hooks/
  └── useStockfish.ts        # React hook

components/2026candidates/
  ├── EvalBar.tsx            # Existing eval bar display
  ├── StockfishDemo.tsx      # Demo component
  └── index.ts               # Exports

public/stockfish/
  ├── stockfish.wasm         # Binary (~350KB)
  ├── stockfish.worker.js    # Worker wrapper
  └── stockfish.js           # Main engine JS
```

## Performance Notes

- **Web Worker** — Runs on separate thread, doesn't block UI
- **Depth 20** — ~100-300ms per position (varies by position complexity)
- **Depth 30** — ~2-5 seconds (use for deep analysis only)
- **WASM** — ~2-3x slower than native Stockfish, but still strong
- **Memory** — ~100MB once loaded (engine + transposition tables)

## SSR Safety

The hook checks `typeof window` on initialization. Components that use the hook must be client-side:

```typescript
'use client';  // Required at top of file
```

## Development

### Test the Hook

See `components/2026candidates/StockfishDemo.tsx` for a full working example.

### Type Checking

```bash
npm run check
```

Ensures no TS errors in hook/worker files.

### Run Dev Server

```bash
npm run dev
```

Then navigate to any component using `useStockfish` to see it in action.

## Troubleshooting

### "Worker failed to initialize"

- Check `/public/stockfish/` files exist
- Check browser console for CORS/404 errors
- Verify Next.js is serving public files (dev server should handle this)

### Evaluations are wrong

- Verify FEN is valid
- Check that position wasn't modified mid-search (hook handles this)
- Try increasing depth if search feels shallow

### High CPU usage

- Lower `depth` option (20-25 is reasonable)
- Reduce `multiPv` if using > 1
- Only enable evaluation for positions you're viewing

## Future Improvements

- [ ] Multi-variation (multiPv > 1) display
- [ ] Opening book integration
- [ ] Skill level adjustment
- [ ] Save/export evaluations
- [ ] Syzygy tablebases (if needed)
