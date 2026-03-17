# Rookie Voice Design

## Status: Prototype complete, parked for now

## What we have
- **ElevenLabs voice ID**: `dvN3cZ0LSQXkWXaOPGvp` (sounds great clean)
- **Voice studio**: `scripts/voice/server.py` + `scripts/voice/studio.html` — local web UI to type lines and hear them
- **GLaDOS TTS model**: `scripts/voice/glados-tts/` — open-source neural net trained on Ellen McLain's Portal lines (works but ElevenLabs sounds better)

## How to run the studio
```bash
scripts/voice/.venv/bin/python scripts/voice/server.py
# Opens http://localhost:8899
```

## How GLaDOS voice was actually made (from Valve wiki)
Ellen McLain performed flat/monotone, then processed in Melodyne:

1. **Pitch snap** — every syllable snapped to nearest chromatic note (kills natural sliding)
2. **Pitch modulation flatten** — flattens vibrato/wobble within each note (biggest contributor to the sound)
3. **Formant shift UP ~3 semitones** — shifts vocal resonances higher, makes it sound like a synthetic throat. This is the secret sauce.

They did NOT use vocoder, ring modulation, or heavy pitch shifting. It's subtle processing on a deliberately robotic performance.

## What works
- ElevenLabs base voice sounds great
- Formant shift up via Web Audio BiquadFilters (clean, no distortion)
- Chorus and reverb for subtle texture

## What doesn't work well
- Frame-by-frame pitch correction in JS (too crude, introduces artifacts)
- macOS `say` as base voice (terrible quality)
- rubberband/sox processing chain (crackling/distortion)
- Waveshaper "metallic" effect (just sounds distorted)

## Next steps when we revisit
- Try a proper pitch correction library (Melodyne-quality) server-side
- Or just lean into the ElevenLabs voice as-is — it's already good
- Consider voice cloning to make Rookie sound distinct from the stock voice
- Build batch export for all Rookie lines in the app

## Key files
- `scripts/voice/server.py` — Python server (ElevenLabs backend)
- `scripts/voice/studio.html` — Web UI with sliders
- `scripts/voice/glados-tts/` — Open-source GLaDOS model (backup option)
- `scripts/voice/.venv/` — Python venv with deps
- `voice-output/` — Generated audio files (gitignored)

## References
- [Valve wiki: Creating a Portal AI Voice](https://developer.valvesoftware.com/wiki/Creating_a_Portal_AI_Voice)
- [Melodyne recreation tutorial](https://ulethelectro.wordpress.com/2015/03/21/how-to-make-your-voice-sound-like-a-portal-style-robot-using-melodyne-editor/)
- [R2D2FISH/glados-tts](https://github.com/R2D2FISH/glados-tts) (neural model)
- [nerdaxic/glados-tts](https://github.com/nerdaxic/glados-tts) (version we cloned)
