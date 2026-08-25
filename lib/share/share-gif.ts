/**
 * One way to hand a rendered share asset to the OS. Every Fight Night share
 * (bout, Puzzle Boxing solve, /play win) funnels through here so the phone
 * flow and the desktop fallback are identical everywhere.
 */

/** Native file share when the device supports it; a download otherwise. */
export async function shareOrSaveBlob(
  blob: Blob,
  filename: string,
  meta: { title: string; text: string },
): Promise<void> {
  const file = new File([blob], filename, { type: blob.type });
  const nav = navigator as Navigator & { canShare?: (d?: unknown) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    await nav.share({ files: [file], title: meta.title, text: meta.text });
    return;
  }
  // No file-share (desktop): download the asset instead.
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** A share asset that starts rendering before anyone taps Share. */
export type PendingShareGif = {
  promise: Promise<Blob>;
  filename: string;
  title: string;
  text: string;
};
