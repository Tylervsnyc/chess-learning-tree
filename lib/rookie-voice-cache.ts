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

const BUCKET = 'rookie-voice';

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
  const supabase = createServiceClient();
  const hash = textToHash(text);
  const filePath = `${hash}.mp3`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(filePath);

  if (error || !data) {
    return { hit: false, url: null, audioBase64: null };
  }

  const arrayBuffer = await data.arrayBuffer();
  const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

  return { hit: true, url: filePath, audioBase64 };
}

/**
 * Upload audio to Supabase Storage cache.
 */
async function saveToCache(text: string, audioBuffer: Buffer): Promise<void> {
  const supabase = createServiceClient();
  const hash = textToHash(text);
  const filePath = `${hash}.mp3`;

  await supabase.storage
    .from(BUCKET)
    .upload(filePath, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    });
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

  // Cache it (fire and forget — don't block the response)
  saveToCache(text, audioBuffer).catch((err) =>
    console.error('Voice cache save failed:', err)
  );

  return {
    audioBase64: audioBuffer.toString('base64'),
    fromCache: false,
  };
}
