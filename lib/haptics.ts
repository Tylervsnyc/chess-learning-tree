/**
 * Native haptic feedback, no-op on web.
 *
 * Why this exists beyond feel: the iOS app is a WKWebView pointed at
 * run.chesspath.app, which is squarely in Apple Guideline 4.2 ("minimum
 * functionality") territory. Haptics are the cheapest honest answer to
 * "what does this do that the website doesn't" — a reviewer feels them.
 *
 * Chess Path shipped @capacitor/haptics as a dependency and never imported it
 * anywhere. Don't repeat that: every call site is paired with an existing
 * sound cue, so the two stay in step.
 *
 * The import is dynamic so the plugin never lands in the web bundle, and every
 * call is fire-and-forget — haptics must never block or throw into gameplay.
 */

type Impact = 'light' | 'medium' | 'heavy';

function isNative(): boolean {
  return typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.() === true;
}

/** A physical bump. `light` for moves, `medium` for captures, `heavy` for abilities. */
export function haptic(style: Impact): void {
  if (!isNative()) return;
  void import('@capacitor/haptics')
    .then(({ Haptics, ImpactStyle }) =>
      Haptics.impact({
        style: { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy }[style],
      })
    )
    .catch(() => {
      /* plugin unavailable — feel is optional, never fatal */
    });
}

/** The double-tap success pattern. Level cleared. */
export function hapticSuccess(): void {
  if (!isNative()) return;
  void import('@capacitor/haptics')
    .then(({ Haptics, NotificationType }) =>
      Haptics.notification({ type: NotificationType.Success })
    )
    .catch(() => {});
}

/** The buzz. Rookie died. */
export function hapticError(): void {
  if (!isNative()) return;
  void import('@capacitor/haptics')
    .then(({ Haptics, NotificationType }) =>
      Haptics.notification({ type: NotificationType.Error })
    )
    .catch(() => {});
}
