/**
 * App-ready signal for the native cold-start splash.
 *
 * NativeSplash (root layout) keeps its overlay up until the first real screen
 * has painted, instead of guessing with a timer. Two things can flip it:
 *   - NativeSplash itself, when the pathname leaves '/' (the root redirect
 *     landed on /play) and two frames have painted;
 *   - the root page calling markAppReady() when it decides to show
 *     onboarding in place (pathname stays '/').
 */
let ready = false;
const subs = new Set<() => void>();

export function markAppReady(): void {
  if (ready) return;
  ready = true;
  subs.forEach((fn) => fn());
  subs.clear();
}

export function isAppReady(): boolean {
  return ready;
}

export function onAppReady(fn: () => void): () => void {
  if (ready) {
    fn();
    return () => {};
  }
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}
