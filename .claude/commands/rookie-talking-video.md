---
name: rookie-talking-video
description: Make a Remotion video of Rookie speaking an audio clip with frame-perfect lip-sync via ElevenLabs forced alignment.
---

# Rookie Talking Video Pipeline

Use this when Tyler has an mp3 of Rookie saying something and wants a video reel
(Instagram/TikTok) where Rookie's blocks animate in sync with her voice.

## The pipeline — three steps

### 1. Transcribe with word-level timestamps

```bash
cd scripts/voice
./.venv/bin/python align-voice.py <path-to-mp3>
```

Produces `<mp3>.align.json` next to the mp3:
```json
{
  "text": "full transcript",
  "words": [{ "word": "hi", "start": 0.12, "end": 0.34, "type": "word" }, ...],
  "duration": 7.52
}
```

**Requires:** `ELEVENLABS_API_KEY` in `.env.local` **with `speech_to_text` permission enabled**.
The TTS-only key does NOT have this by default — flip the checkbox in the ElevenLabs dashboard.

### 2. Drop audio + alignment into public/

```bash
mkdir -p public/rookie-voice/<name>
cp <mp3>           public/rookie-voice/<name>/voice.mp3
cp <mp3>.align.json public/rookie-voice/<name>/voice.mp3.align.json
```

### 3. Register a composition in `remotion/Root.tsx`

```tsx
<Composition
  id="Rookie<Name>"
  component={RookieVoicePost as any}
  durationInFrames={ROOKIE_VOICE_POST_ENTRANCE + Math.round(AUDIO_SECONDS * FPS) + ROOKIE_VOICE_POST_OUTRO}
  fps={FPS}
  width={FRAME_W}
  height={FRAME_H}
  defaultProps={{
    audioSrc: 'rookie-voice/<name>/voice.mp3',
    alignSrc: 'rookie-voice/<name>/voice.mp3.align.json',
    accentColor: '#FF9600',
    entranceFrames: ROOKIE_VOICE_POST_ENTRANCE,
    durationFrames: ROOKIE_VOICE_POST_ENTRANCE + Math.round(AUDIO_SECONDS * FPS) + ROOKIE_VOICE_POST_OUTRO,
    captions: [
      // phrase-level groupings of the transcript, timed in frames from AUDIO START
      // (NOT from composition start — component offsets these by entranceFrames automatically).
      { text: 'Line one', startFrame: 0, endFrame: 66 },
      { text: 'Line two', startFrame: 66, endFrame: 120 },
    ],
  } as any}
/>
```

Then `npm run video:studio` → pick the composition → render.

## What the component does

`remotion/RookieVoicePost.tsx`:

- **Entrance (60 frames / 2s):** teleport reassemble — blocks dissolve in with cyan→normal hue shift, brightness flash
- **Speaking:** 3D heartbeat driven by aligned envelope. Each word gives a gentle scale pulse (1.0 → 1.1), subtle saturation lift (+25%), brightness lift (+20%), continuous perspective skew tilt
- **Outro (150 frames / 5s):** DataRiver-style endcap — ReelLogo + 4 OG-style 3D buttons (Tactics, Openings, Play, Daily) + `chesspath.app` URL + "Free to play" badge
- **Top-left:** `chess`**`path`** wordmark fades in over first 20 frames, stays through speaking

## Tuning knobs

In `RookieVoicePost.tsx`:
- `blockSize` (currently 140) — Rookie's overall size
- `beatScale` coefficient (0.1) — how much blocks pulse
- `hbSaturate` coefficient (0.25) — color pop intensity
- `ENTRANCE_FRAMES` / `OUTRO_FRAMES` — pacing

In `scripts/voice/align-voice.py`:
- `alignedEnvelope()` attack/release (60ms / 100ms) — how snappy each word feels

## Test page for iterating on speaking animations

`app/test/rookie-speaking/page.tsx` — 9 speaking-animation variants synced to the mp3 via
both live FFT envelope follower AND forced-alignment JSON. Use to prototype new styles
before porting into the Remotion component.

## Why ElevenLabs STT over Whisper

- Fast (cloud API, no local model download)
- Same key as TTS (just needs the permission flag)
- Returns word-level timing directly in the schema we need
- Offline fallback: install `openai-whisper` pip package if ElevenLabs is down

## Don't

- Don't re-run the align script on every render — the JSON is static, check it into the repo alongside the mp3
- Don't try to generate a voiceover from the `captions` prop — captions are display-only now; the animation runs off the alignment JSON
- Don't skip the entrance/outro by setting them to 0 unless you really know what you want — Rookie needs her moment
