/**
 * Client-side signal that the user just did something that counts toward their
 * daily workout streak (finished a run, completed a lesson, solved a puzzle).
 * The header streak badge listens for this and refetches, so the number updates
 * live without a navigation or reload.
 */
export const WORKOUT_ACTIVITY_EVENT = 'workout-activity';

/** Fire after a streak-affecting action is recorded server-side. No-op on the server. */
export function notifyWorkoutActivity() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(WORKOUT_ACTIVITY_EVENT));
  }
}
