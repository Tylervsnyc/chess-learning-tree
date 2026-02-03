# Chess Puzzle Rules

This document defines how Lichess puzzles should be interpreted and displayed.

## The Golden Rule: First Move is Opponent's Move

**CRITICAL: In Lichess puzzles, the first move (`moves[0]`) is ALWAYS the opponent's move, NOT the player's move.**

### Puzzle Loading Sequence

1. **Load the FEN** - This is the position BEFORE the puzzle starts
2. **Apply `moves[0]`** - This is the opponent's move that creates the puzzle
3. **Highlight `moves[0]`** - Show the opponent's last move with orange highlighting
4. **Display the board** - Now it's the player's turn to solve
5. **Player's color** - Determined by whose turn it is AFTER `moves[0]`

### Move Array Structure

```
moves[0] = Opponent's setup move (auto-played, highlighted)
moves[1] = Player's first move (must solve)
moves[2] = Opponent's response (auto-played after correct move)
moves[3] = Player's second move (must solve)
... and so on
```

### Implementation Pattern

```typescript
// Load puzzle
const chess = new Chess(puzzle.fen);

// Apply and track opponent's move
const opponentMove = puzzle.moves[0];
const from = opponentMove.slice(0, 2);
const to = opponentMove.slice(2, 4);

chess.move({
  from,
  to,
  promotion: opponentMove.length > 4 ? opponentMove[4] : undefined,
});

// Track for highlighting
setLastMoveFrom(from);
setLastMoveTo(to);

// Now puzzle is ready - player's turn
const playerColor = chess.turn() === 'w' ? 'white' : 'black';
```

### Highlighting the Opponent's Move

Always highlight the opponent's last move with orange to show what just happened:

```typescript
const squareStyles = useMemo(() => {
  const styles: Record<string, React.CSSProperties> = {};
  if (lastMoveFrom && lastMoveTo) {
    styles[lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
    styles[lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
  }
  return styles;
}, [lastMoveFrom, lastMoveTo]);
```

### Validating Player Moves

Player moves are at odd indices: `moves[1]`, `moves[3]`, `moves[5]`, etc.

```typescript
// moveIndex starts at 1 (after opponent's move)
const expectedMove = puzzle.moves[moveIndex];
const playerMove = sourceSquare + targetSquare;

if (playerMove === expectedMove.slice(0, 4)) {
  // Correct!
  // Apply move, then auto-play opponent's response if exists
  if (puzzle.moves[moveIndex + 1]) {
    // Auto-play opponent response from moves[moveIndex + 1]
  }
  moveIndex += 2;
}
```

### Common Mistakes to Avoid

1. **Showing raw FEN without applying `moves[0]`** - Player sees wrong position
2. **Not highlighting opponent's move** - Player doesn't know what happened
3. **Validating against `moves[0]`** - That's the opponent's move, not the solution
4. **Wrong player color** - Must check turn AFTER applying `moves[0]`

### Board Orientation

Orient the board so the player's pieces are at the bottom:

```typescript
const boardOrientation = chess.turn() === 'w' ? 'white' : 'black';
```

## Files That Use This Pattern

- `/app/lesson/[lessonId]/page.tsx` - Main lesson page
- `/app/daily-challenge/page.tsx` - Daily challenge
- `/app/level-test/[transition]/page.tsx` - Level tests

Always refer to this document when implementing puzzle functionality.
