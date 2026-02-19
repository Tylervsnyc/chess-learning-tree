/**
 * ShuffleBag — draw items without repeats until the bag is exhausted.
 *
 * Used by the quip system (RULES.md §25-26) to cycle through all quips
 * before any quip repeats, giving a "shuffled deck" feel.
 */
export class ShuffleBag<T = string> {
  private readonly items: T[];
  private bag: T[];
  private index: number;

  constructor(items: T[]) {
    this.items = [...items];
    this.bag = [];
    this.index = 0;
    this.reset();
  }

  /** Fisher-Yates shuffle (in-place). */
  private shuffle(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  /** Draw the next item. Auto-reshuffles when exhausted. */
  draw(): T {
    if (this.index >= this.bag.length) {
      this.reset();
    }
    return this.bag[this.index++];
  }

  /**
   * Draw the next item that isn't in the skip set.
   * Walks forward from the current position, skipping matches.
   * Returns null if all remaining items are in the skip set
   * (does NOT reshuffle — caller handles fallback).
   */
  drawWithSkip(skip: Set<T>): T | null {
    const start = this.index;
    while (this.index < this.bag.length) {
      const item = this.bag[this.index++];
      if (!skip.has(item)) {
        return item;
      }
    }
    // Exhausted the bag without finding a non-skipped item.
    // Don't reshuffle — let the caller decide what to do.
    return null;
  }

  /** Reshuffle and reset position to start. */
  reset(): void {
    this.bag = [...this.items];
    this.shuffle(this.bag);
    this.index = 0;
  }
}
