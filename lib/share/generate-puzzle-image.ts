import { toPng } from 'html-to-image';

/**
 * Generates a PNG image from the puzzle share card element
 * @param element - The DOM element to capture (should be #puzzle-share-card)
 * @returns Promise<Blob> - The PNG image as a Blob
 */
export async function generatePuzzleImage(element: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 1, // 1080x1080 is already high res
    cacheBust: true,
  });

  // Convert data URL to Blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return blob;
}

/**
 * Generates a PNG and returns it as a File object for sharing
 */
export async function generatePuzzleImageFile(element: HTMLElement): Promise<File> {
  const blob = await generatePuzzleImage(element);
  return new File([blob], 'chess-puzzle.png', { type: 'image/png' });
}
