/**
 * Progressive TTS cache for Rookie's voice — backed by Supabase Storage.
 *
 * Generate audio once, serve it forever. The library grows over time
 * so ElevenLabs costs approach zero.
 *
 * Cache key = MD5 hash of the exact text. Same text = same file, always.
 *
 * Flow:
 *   1. Text comes in
 *   2. Check Supabase Storage for {hash}.mp3
 *   3. HIT:  download and return (no ElevenLabs call)
 *   4. MISS: call ElevenLabs, upload to Supabase, return audio
 */

import * as crypto from 'crypto';
import { createServiceClient } from '@/lib/supabase/service';
import { assertTtsAllowed, recordTtsUsage } from '@/lib/tts-guard';

const BUCKET = 'rookie-voice';

const MEMORY_CACHE_MAX = 64;
const memoryCache = new Map<string, string>();

function rememberInMemory(hash: string, audioBase64: string): void {
  if (memoryCache.has(hash)) memoryCache.delete(hash);
  memoryCache.set(hash, audioBase64);
  while (memoryCache.size > MEMORY_CACHE_MAX) {
    const oldest = memoryCache.keys().next().value;
    if (oldest === undefined) break;
    memoryCache.delete(oldest);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function textToHash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

export interface CacheLookupResult {
  hit: boolean;
  url: string | null;
  audioBase64: string | null;
}

/**
 * Check if audio for this text exists in Supabase Storage.
 */
export async function lookupVoiceCache(text: string): Promise<CacheLookupResult> {
  const hash = textToHash(text);

  const memHit = memoryCache.get(hash);
  if (memHit) {
    return { hit: true, url: `${hash}.mp3`, audioBase64: memHit };
  }

  const supabase = createServiceClient();
  const filePath = `${hash}.mp3`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(filePath);

  if (error || !data) {
    return { hit: false, url: null, audioBase64: null };
  }

  const arrayBuffer = await data.arrayBuffer();
  const audioBase64 = Buffer.from(arrayBuffer).toString('base64');
  rememberInMemory(hash, audioBase64);

  return { hit: true, url: filePath, audioBase64 };
}

/**
 * Upload audio to Supabase Storage cache. Retries up to 3 attempts with
 * exponential backoff. Throws if all attempts fail so callers can log/alert.
 */
async function saveToCache(text: string, audioBuffer: Buffer): Promise<void> {
  const supabase = createServiceClient();
  const hash = textToHash(text);
  const filePath = `${hash}.mp3`;

  const delays = [0, 200, 400];
  let lastError: unknown = null;
  for (const delay of delays) {
    if (delay) await sleep(delay);
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      });
    if (!error) return;
    lastError = error;
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/**
 * Generate TTS via ElevenLabs and cache in Supabase Storage.
 * Returns base64-encoded audio.
 *
 * If the text is already cached, returns from cache (no API call).
 */
export async function generateAndCache(
  text: string,
  apiKey: string,
  voiceId: string
): Promise<{ audioBase64: string; fromCache: boolean }> {
  // Check cache first
  const cached = await lookupVoiceCache(text);
  if (cached.hit && cached.audioBase64) {
    return { audioBase64: cached.audioBase64, fromCache: true };
  }

  // Cache miss — gate live synth through the TTS guard
  assertTtsAllowed(text);

  // Generate via ElevenLabs
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.35,
          similarity_boost: 0.55,
          style: 0.55,
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`ElevenLabs TTS error ${res.status}: ${await res.text()}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const audioBuffer = Buffer.from(arrayBuffer);
  const audioBase64 = audioBuffer.toString('base64');
  recordTtsUsage(text);

  // Always populate in-memory cache so a failed Supabase write doesn't cost
  // a second synthesis on the next request within this process.
  rememberInMemory(textToHash(text), audioBase64);

  try {
    await saveToCache(text, audioBuffer);
  } catch (err) {
    console.error('[TTS] tts.cache_write_failed — served from memory, persistent cache missing:', err);
  }

  return {
    audioBase64,
    fromCache: false,
  };
}
