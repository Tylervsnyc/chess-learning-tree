#!/usr/bin/env python3
"""
Rookie Voice Designer — fully local CLI prototype.
No APIs. Uses macOS `say` for TTS + rubberband/sox for GLaDOS-style processing.

Target: GLaDOS from Portal 2
  - Smooth feminine base (Samantha voice)
  - Formant-shifted cold/synthetic
  - Pitch-corrected to musical notes (hard auto-tune)
  - Metallic shimmer via chorus
  - Deliberate, controlled pacing
  - Tight "inside a machine" reverb

Usage:
  # Basic — generates and plays immediately:
  ./rookie-voice.py "I think I'm experiencing what humans call pride."

  # Try different presets:
  ./rookie-voice.py --preset glados "Was that your best move?"
  ./rookie-voice.py --preset rookie "Your knight is in danger."

  # Tweak individual params:
  ./rookie-voice.py --formant -4 --metallic 0.9 "Fascinating."

  # Compare all presets side by side:
  ./rookie-voice.py --compare "I'm not angry. Just disappointed."

  # Use a different macOS voice as base:
  ./rookie-voice.py --voice Shelley "Checkmate."

  # Skip playback:
  ./rookie-voice.py --no-play "Silent generation"
"""

import argparse
import os
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

RUBBERBAND = "rubberband"
SOX = "sox"

# ---------------------------------------------------------------------------
# Presets — tuned for GLaDOS-family voices
# ---------------------------------------------------------------------------
PRESETS = {
    "glados": {
        "formant": -3.5,      # Strong formant drop — cold, inhuman
        "pitch": -1.0,        # Slightly lower
        "metallic": 0.8,      # Heavy shimmer
        "speed": 0.95,        # Deliberate, measured
        "reverb": 15,         # Tight "inside the chassis"
        "voice": "Samantha",  # Clean feminine base
    },
    "rookie": {
        "formant": -2.0,      # Moderate — clearly AI but friendly
        "pitch": 0.0,
        "metallic": 0.5,
        "speed": 1.0,
        "reverb": 12,
        "voice": "Samantha",
    },
    "rookie-warm": {
        "formant": -1.5,      # Gentler — for encouragement
        "pitch": 0.5,
        "metallic": 0.3,
        "speed": 1.02,
        "reverb": 8,
        "voice": "Samantha",
    },
    "rookie-glitch": {
        "formant": -4.0,      # Heavy — confusion/error states
        "pitch": -1.5,
        "metallic": 0.95,
        "speed": 0.92,
        "reverb": 30,
        "voice": "Samantha",
    },
}


def check_deps():
    """Verify rubberband and sox are installed."""
    missing = []
    for cmd in [RUBBERBAND, SOX]:
        try:
            subprocess.run([cmd, "--version"], capture_output=True, check=False)
        except FileNotFoundError:
            missing.append(cmd)
    if missing:
        print(f"Missing: {', '.join(missing)}")
        print(f"Install: brew install {' '.join(missing)}")
        sys.exit(1)


def generate_tts(text: str, voice: str, output_path: str):
    """Generate speech using macOS built-in `say` command."""
    print(f"  TTS: macOS say (voice={voice})")

    # say outputs AIFF, we need WAV — use a temp file then convert
    with tempfile.NamedTemporaryFile(suffix=".aiff", delete=False) as tmp:
        aiff_path = tmp.name

    try:
        # Generate with say
        result = subprocess.run(
            ["say", "-v", voice, "-o", aiff_path, "--", text],
            capture_output=True, text=True, check=False,
        )
        if result.returncode != 0:
            print(f"  ERROR: say failed: {result.stderr}")
            print(f"  Available voices: say -v '?' | grep en_US")
            sys.exit(1)

        # Convert AIFF to WAV via sox (preserves quality)
        subprocess.run(
            [SOX, aiff_path, "-r", "22050", "-c", "1", output_path],
            capture_output=True, check=True,
        )
    finally:
        os.unlink(aiff_path)


def apply_formant_shift(input_path: str, output_path: str, semitones: float):
    """
    Shift formants without changing pitch.
    Trick: pitch up (formants move), then pitch back down with --formant (formants stay).
    Negative semitones = deeper/robotic. This is the core of the GLaDOS sound.
    """
    if abs(semitones) < 0.01:
        data, sr = sf.read(input_path)
        sf.write(output_path, data, sr)
        return

    print(f"  Formant shift: {semitones:+.1f} semitones")

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        # Pitch up (formants follow)
        subprocess.run([
            RUBBERBAND, "--pitch", str(semitones), "--crisp", "6",
            input_path, tmp_path,
        ], capture_output=True, check=True)

        # Pitch back down with formant lock (formants stay shifted)
        subprocess.run([
            RUBBERBAND, "--pitch", str(-semitones), "--formant", "--crisp", "6",
            tmp_path, output_path,
        ], capture_output=True, check=True)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def apply_pitch_shift(input_path: str, output_path: str, semitones: float):
    """Shift overall pitch (with formant preservation so it doesn't go chipmunk)."""
    if abs(semitones) < 0.01:
        data, sr = sf.read(input_path)
        sf.write(output_path, data, sr)
        return

    print(f"  Pitch shift: {semitones:+.1f} semitones")
    subprocess.run([
        RUBBERBAND, "--pitch", str(semitones), "--formant", "--crisp", "6",
        input_path, output_path,
    ], capture_output=True, check=True)


def apply_speed(input_path: str, output_path: str, speed: float):
    """Time-stretch without pitch change."""
    if abs(speed - 1.0) < 0.01:
        data, sr = sf.read(input_path)
        sf.write(output_path, data, sr)
        return

    print(f"  Speed: {speed:.2f}x")
    subprocess.run([
        RUBBERBAND, "--time", str(1.0 / speed), "--crisp", "6",
        input_path, output_path,
    ], capture_output=True, check=True)


def apply_metallic(input_path: str, output_path: str, amount: float, reverb: int):
    """
    GLaDOS metallic shimmer via sox effects chain:
    - Chorus for doubled/shimmering sound
    - Light overdrive for harmonic crunch
    - Small-room reverb for "inside a computer" feel
    - Upper-mid EQ boost for metallic presence
    """
    if amount < 0.01:
        data, sr = sf.read(input_path)
        sf.write(output_path, data, sr)
        return

    print(f"  Metallic: {amount:.0%}, reverb: {reverb}%")

    effects = []

    # Chorus — the shimmering doubled GLaDOS quality
    depth = 0.5 + (amount * 2.0)
    decay = 0.3 + (amount * 0.4)
    effects += [
        "chorus", "0.7", "0.9", "25", str(decay), "1.3", str(depth), "-s",
    ]

    # Second chorus voice at higher amounts
    if amount > 0.4:
        effects += [
            "chorus", "0.6", "0.9", "35", str(decay * 0.8),
            "0.7", str(depth * 1.3), "-t",
        ]

    # Overdrive — subtle harmonic distortion
    if amount > 0.3:
        effects += ["overdrive", str(amount * 8), "0"]

    # Reverb — tight, small room
    if reverb > 0:
        effects += ["reverb", str(reverb), "50", "80", "100", "0", "0"]

    # EQ — boost presence frequencies for metallic character
    if amount > 0.2:
        boost = 2 + (amount * 6)
        effects += [
            "equalizer", "3500", "1.5q", str(boost),
            "equalizer", "6000", "2q", str(boost * 0.6),
        ]

    # Clean up
    effects += ["highpass", "120", "norm", "-1"]

    result = subprocess.run(
        [SOX, input_path, output_path] + effects,
        capture_output=True, text=True, check=False,
    )
    if result.returncode != 0:
        print(f"  WARNING: sox failed: {result.stderr}")
        data, sr = sf.read(input_path)
        sf.write(output_path, data, sr)


def process_voice(input_path, output_path, formant, pitch, metallic, speed, reverb):
    """Full GLaDOS-style processing pipeline."""
    with tempfile.TemporaryDirectory() as tmp:
        current = input_path

        step = os.path.join(tmp, "01_formant.wav")
        apply_formant_shift(current, step, formant)
        current = step

        step = os.path.join(tmp, "02_pitch.wav")
        apply_pitch_shift(current, step, pitch)
        current = step

        step = os.path.join(tmp, "03_speed.wav")
        apply_speed(current, step, speed)
        current = step

        apply_metallic(current, output_path, metallic, reverb)

    print(f"  Output: {output_path}")


def slugify(text: str) -> str:
    s = text[:40].lower().replace(" ", "-")
    return "".join(c for c in s if c.isalnum() or c == "-").strip("-")


def main():
    parser = argparse.ArgumentParser(
        description="Rookie Voice — GLaDOS-style voice for the Chess Path rook mascot",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Presets:
  glados         Cold, deliberate, synthetic (the target sound)
  rookie         Balanced — AI but friendly (default)
  rookie-warm    Gentle for encouragement
  rookie-glitch  Heavy for confusion/error states

Examples:
  %(prog)s "I believe that's called a fork."
  %(prog)s --preset glados "Was that your best move?"
  %(prog)s --compare "I'm not angry. Just disappointed."
  %(prog)s --formant -4 --metallic 0.9 "Fascinating."
        """,
    )
    parser.add_argument("text", help="What Rookie says")
    parser.add_argument("--input", "-i", help="Use existing WAV instead of TTS")
    parser.add_argument("--output", "-o", help="Output path (default: voice-output/)")
    parser.add_argument("--preset", "-p", choices=PRESETS.keys(), default="rookie")
    parser.add_argument("--formant", type=float)
    parser.add_argument("--pitch", type=float)
    parser.add_argument("--metallic", type=float)
    parser.add_argument("--speed", type=float)
    parser.add_argument("--reverb", type=int)
    parser.add_argument("--voice", help="macOS TTS voice (default: Samantha)")
    parser.add_argument("--compare", action="store_true", help="Generate all presets")
    parser.add_argument("--no-play", action="store_true", help="Don't auto-play result")

    args = parser.parse_args()
    check_deps()

    out_dir = Path(__file__).parent.parent.parent / "voice-output"
    out_dir.mkdir(exist_ok=True)
    slug = slugify(args.text)

    if args.compare:
        print(f'\nComparing presets: "{args.text}"\n')

        # Generate base TTS once per unique voice
        bases = {}
        for name, preset in PRESETS.items():
            v = args.voice or preset["voice"]
            if v not in bases:
                base_path = str(out_dir / f"{slug}_base_{v}.wav")
                if args.input:
                    bases[v] = args.input
                else:
                    generate_tts(args.text, v, base_path)
                    bases[v] = base_path

        for name, preset in PRESETS.items():
            print(f"\n--- {name} ---")
            v = args.voice or preset["voice"]
            out_path = str(out_dir / f"{slug}_{name}.wav")
            process_voice(
                bases[v], out_path,
                formant=preset["formant"], pitch=preset["pitch"],
                metallic=preset["metallic"], speed=preset["speed"],
                reverb=preset["reverb"],
            )
            if not args.no_play:
                print(f"  Playing {name}...")
                subprocess.run(["afplay", out_path], check=False)

        print(f"\nAll outputs in: {out_dir}/")
        return

    # Single generation
    preset = PRESETS[args.preset]
    params = {
        "formant": args.formant if args.formant is not None else preset["formant"],
        "pitch": args.pitch if args.pitch is not None else preset["pitch"],
        "metallic": args.metallic if args.metallic is not None else preset["metallic"],
        "speed": args.speed if args.speed is not None else preset["speed"],
        "reverb": args.reverb if args.reverb is not None else preset["reverb"],
    }
    voice = args.voice or preset["voice"]
    output_path = args.output or str(out_dir / f"{slug}_{args.preset}.wav")

    print(f"\nRookie Voice Designer (GLaDOS target)")
    print(f'  "{args.text}"')
    print(f"  Preset: {args.preset} | Voice: {voice}")
    print(f"  formant={params['formant']:+.1f}  pitch={params['pitch']:+.1f}  "
          f"metallic={params['metallic']:.0%}  speed={params['speed']:.2f}x  reverb={params['reverb']}%")
    print()

    # TTS
    if args.input:
        base_path = args.input
    else:
        base_path = str(out_dir / f"{slug}_base_{voice}.wav")
        if not os.path.exists(base_path):
            generate_tts(args.text, voice, base_path)
        else:
            print(f"  Cached TTS: {base_path}")

    # Process
    process_voice(base_path, output_path, **params)

    # Play
    if not args.no_play:
        print(f"\n  Playing processed...")
        subprocess.run(["afplay", output_path], check=False)
        print(f"  Playing base for comparison...")
        subprocess.run(["afplay", base_path], check=False)

    print(f"\n  Processed: {output_path}")
    print(f"  Base: {base_path}")


if __name__ == "__main__":
    main()
