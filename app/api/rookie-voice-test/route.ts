import { NextRequest, NextResponse } from 'next/server';
import { lookupVoiceCache } from '@/lib/rookie-voice-cache';
import { renderLine } from '@/lib/speech/sanitize';

// Unguarded TTS endpoint for /test/quip-sfx-builder. Dev-only.
// Bypasses ai-guard auth AND the dev-mode TTS block so the test page can
// hear new copy through ElevenLabs without needing TTS_FORCE_LIVE.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const body = (await request.json()) as { speakOnly?: string };
  const text = body.speakOnly?.trim();
  if (!text) return NextResponse.json({ error: 'speakOnly required' }, { status: 400 });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    return NextResponse.json(
      { error: 'ElevenLabs not configured (missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID)' },
      { status: 500 },
    );
  }

  const safe = renderLine(text);

  // Try the cache first (cheap, free)
  try {
    const cached = await lookupVoiceCache(safe);
    if (cached.hit && cached.audioBase64) {
      return NextResponse.json({ text: safe, audio: cached.audioBase64, fromCache: true });
    }
  } catch {}

  // Cache miss — call ElevenLabs directly. We deliberately skip assertTtsAllowed
  // so the test page can preview new copy in dev.
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: safe,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.35, similarity_boost: 0.55, style: 0.55 },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `ElevenLabs ${res.status}: ${err.slice(0, 300)}` },
        { status: 500 },
      );
    }
    const buf = await res.arrayBuffer();
    const audioBase64 = Buffer.from(buf).toString('base64');
    return NextResponse.json({ text: safe, audio: audioBase64, fromCache: false });
  } catch (err) {
    console.error('[rookie-voice-test] TTS error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
