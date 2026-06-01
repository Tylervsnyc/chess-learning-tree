/**
 * Share the Daily Workout streak as a reel/story-sized image.
 *
 * Mobile (supports sharing files): opens the native share sheet with the
 * generated image so the user can post to IG/stories/etc.
 * Desktop / unsupported: opens the image in a new tab to save manually.
 *
 * NOTE: the desktop fallback must open the tab synchronously inside the
 * click gesture — calling window.open() after `await fetch()` gets blocked
 * as a popup. So we feature-detect first and only fetch when we can share.
 */
export async function shareWorkoutStreak(streak: number): Promise<void> {
  const url = `/api/og/workout?kind=daily&streak=${encodeURIComponent(streak)}`;

  const canShareFiles =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function';

  // Desktop / no file-share support: open in a new tab, synchronously.
  if (!canShareFiles) {
    window.open(url, '_blank');
    return;
  }

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const file = new File([blob], `chesspath-workout-streak-${streak}.png`, {
      type: blob.type || 'image/png',
    });

    const shareData: ShareData = {
      title: 'My chess workout streak',
      text: `Day ${streak} of my daily chess workout on chesspath.app`,
      files: [file],
    };

    if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return;
    }
  } catch {
    // user cancelled or share failed — fall through
  }

  window.open(url, '_blank');
}
