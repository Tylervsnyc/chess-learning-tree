// Video Poster — reads rendered video + caption, uploads to Late.dev as draft
// Bridges render-daily-video.ts output → social posting

import fs from 'fs';
import path from 'path';
import { uploadMedia, createPost, getBestTimeToPost, ACCOUNTS } from '@/lib/late';

type VideoRender = {
  puzzleId: string;
  date: string;
  file: string;
};

type VideoUsageData = {
  usedPuzzleIds: string[];
  renders: VideoRender[];
};

const VIDEO_USAGE_PATH = path.join(process.cwd(), 'data', 'video-puzzle-usage.json');
const VIDEO_OUTPUT_DIR = path.join(process.cwd(), 'out', 'videos');

/**
 * Get the latest rendered video entry from video-puzzle-usage.json
 */
export function getLatestRender(): VideoRender | null {
  if (!fs.existsSync(VIDEO_USAGE_PATH)) return null;
  const data: VideoUsageData = JSON.parse(fs.readFileSync(VIDEO_USAGE_PATH, 'utf-8'));
  if (!data.renders || data.renders.length === 0) return null;
  return data.renders[data.renders.length - 1];
}

/**
 * Find the video file path for a render entry
 */
export function getVideoPath(render: VideoRender): string | null {
  const videoPath = path.join(VIDEO_OUTPUT_DIR, render.date, render.file);
  if (fs.existsSync(videoPath)) return videoPath;

  const directPath = path.join(VIDEO_OUTPUT_DIR, render.file);
  if (fs.existsSync(directPath)) return directPath;

  return null;
}

/**
 * Get the caption file (.txt) for a render entry
 */
export function getCaptionText(render: VideoRender): string | null {
  const captionFile = render.file.replace('.mp4', '.txt');

  const captionPath = path.join(VIDEO_OUTPUT_DIR, render.date, captionFile);
  if (fs.existsSync(captionPath)) return fs.readFileSync(captionPath, 'utf-8').trim();

  const directPath = path.join(VIDEO_OUTPUT_DIR, captionFile);
  if (fs.existsSync(directPath)) return fs.readFileSync(directPath, 'utf-8').trim();

  return null;
}

/**
 * Upload video to Late.dev and create a draft post across platforms.
 * Returns the created post object.
 */
export async function postVideoAsDraft(render: VideoRender): Promise<{
  post: Record<string, unknown>;
  caption: string;
}> {
  const videoPath = getVideoPath(render);
  if (!videoPath) {
    throw new Error(`Video file not found for render: ${render.file}`);
  }

  // Read video file and upload
  const videoBuffer = fs.readFileSync(videoPath);
  const publicUrl = await uploadMedia(videoBuffer, render.file, 'video/mp4');

  // Get caption (or generate default)
  const caption = getCaptionText(render) || generateDefaultCaption(render.puzzleId);

  // Try to get optimal schedule time
  let scheduleDate: string | undefined;
  try {
    const bestTime = await getBestTimeToPost(ACCOUNTS.instagram);
    if (bestTime) scheduleDate = bestTime;
  } catch {
    // Fall back to no schedule (saves as draft)
  }

  // Create draft post on all platforms
  const post = await createPost({
    content: caption,
    platforms: ['instagram', 'youtube', 'twitter'],
    mediaUrls: [publicUrl],
    scheduleDate,
    publishNow: false, // Draft — Tyler approves
  });

  return { post, caption };
}

function generateDefaultCaption(puzzleId: string): string {
  return `Can you solve today's puzzle?\n\nPause the video and try to find the best move!\n\nPlay the daily challenge free at chesspath.app/daily-challenge\n\n#chess #chesspuzzle #dailychess #chesspath #chessimprovement\n\nPuzzle: ${puzzleId}`;
}
