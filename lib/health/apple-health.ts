import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

/**
 * Apple Health bridge — Chess Boxing iOS shell only.
 *
 * The Capacitor shell injects `window.Capacitor` into the remote site and
 * registers a local `HealthWorkout` plugin (ios/App/App/HealthWorkoutPlugin.swift)
 * that saves finished sessions into Apple Health as boxing workouts. In a
 * normal browser none of that exists, so everything here is a cheap no-op —
 * zero bundle weight (no Capacitor npm import) and zero behavior change for
 * web users.
 */

type HealthWorkoutPlugin = {
  saveWorkout: (opts: {
    startMs: number;
    endMs: number;
    calories: number;
  }) => Promise<{ saved?: boolean; reason?: string }>;
};

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  Plugins?: Record<string, unknown>;
};

function getPlugin(): HealthWorkoutPlugin | null {
  if (!FEATURE_FLAGS.APPLE_HEALTH) return null;
  if (typeof window === 'undefined') return null;
  const cap = (window as { Capacitor?: CapacitorGlobal }).Capacitor;
  if (!cap?.isNativePlatform?.()) return null;
  const plugin = cap.Plugins?.HealthWorkout as HealthWorkoutPlugin | undefined;
  return plugin && typeof plugin.saveWorkout === 'function' ? plugin : null;
}

export function isAppleHealthAvailable(): boolean {
  return getPlugin() !== null;
}

/**
 * Rough session calories: shadowboxing rounds ~8 kcal/min, chess + rest
 * segments ~1.5 kcal/min (we don't know the user's weight — this is a
 * deliberate mid-range estimate, not a measurement).
 */
export function estimateWorkoutCalories(exerciseSeconds: number, otherSeconds: number): number {
  return Math.max(1, Math.round((exerciseSeconds / 60) * 8 + (otherSeconds / 60) * 1.5));
}

/**
 * Save a finished session to Apple Health. Resolves false on web, denied
 * permission, or any native failure — never throws, never blocks the finish
 * screen. The first call triggers iOS's Health permission sheet.
 */
export async function logWorkoutToAppleHealth(opts: {
  startMs: number;
  endMs: number;
  calories: number;
}): Promise<boolean> {
  const plugin = getPlugin();
  if (!plugin) return false;
  try {
    const res = await plugin.saveWorkout(opts);
    return res?.saved === true;
  } catch {
    return false;
  }
}
