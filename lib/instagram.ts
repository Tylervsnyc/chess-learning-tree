/**
 * Instagram posting via the Instagram Login API (graph.instagram.com).
 * Posts a local video as a Reel: upload to Vercel Blob -> public URL -> publish.
 *
 * Env: IG_ACCESS_TOKEN, IG_ACCOUNT_ID, BLOB_READ_WRITE_TOKEN
 * Token longevity (exchange/refresh) lives in lib/instagram-token.ts.
 */
import { readFile } from 'fs/promises';
import { put } from '@vercel/blob';

const BASE = 'https://graph.instagram.com/v21.0';

/** Strip emoji / pictographic characters — Tyler's no-emoji rule. */
export function stripEmojis(text: string): string {
  // Strip pictographic emoji + dingbats/stars, but keep typographic arrows (→).
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ +\n/g, '\n')
    .trim();
}

async function igFetch(path: string, params: Record<string, string>, method: 'GET' | 'POST' = 'GET') {
  const token = process.env.IG_ACCESS_TOKEN!;
  const url = new URL(`${BASE}/${path}`);
  const init: RequestInit = { method };
  if (method === 'GET') {
    url.searchParams.set('access_token', token);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  } else {
    init.body = new URLSearchParams({ access_token: token, ...params });
  }
  const res = await fetch(url, init);
  const json = await res.json();
  if (!res.ok) throw new Error(`IG ${path} -> ${res.status} ${JSON.stringify(json)}`);
  return json;
}

/** Upload a local file to Vercel Blob and return its public URL. */
export async function uploadToBlob(localPath: string, blobName: string): Promise<string> {
  const data = await readFile(localPath);
  const { url } = await put(blobName, data, {
    access: 'public',
    contentType: blobName.endsWith('.mp4') ? 'video/mp4' : undefined,
    addRandomSuffix: true,
  });
  return url;
}

/** Publish a Reel from a public video URL. Returns the published media id. */
export async function publishReel(videoUrl: string, caption: string): Promise<string> {
  const accountId = process.env.IG_ACCOUNT_ID!;
  const clean = stripEmojis(caption);

  const container = await igFetch(`${accountId}/media`, {
    media_type: 'REELS',
    video_url: videoUrl,
    caption: clean,
  }, 'POST');

  // Video must finish processing before publish.
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const status = await igFetch(container.id, { fields: 'status_code' });
    if (status.status_code === 'FINISHED') break;
    if (status.status_code === 'ERROR') throw new Error('IG video processing failed');
    if (i === 29) throw new Error('IG video processing timed out');
  }

  const published = await igFetch(`${accountId}/media_publish`, { creation_id: container.id }, 'POST');
  return published.id;
}

/** End-to-end: local video file + caption -> live Reel. */
export async function postVideoToInstagram(localPath: string, caption: string, blobName: string): Promise<string> {
  const publicUrl = await uploadToBlob(localPath, blobName);
  return publishReel(publicUrl, caption);
}
