#!/usr/bin/env python3
"""
Rookie Voice Studio — ElevenLabs TTS server.
Uses a custom ElevenLabs voice for Rookie.

Usage:
  scripts/voice/.venv/bin/python scripts/voice/server.py
"""

import http.server
import io
import json
import time
import webbrowser
from pathlib import Path

from elevenlabs import ElevenLabs

PORT = 8899
SCRIPT_DIR = Path(__file__).parent
VOICE_ID = "dvN3cZ0LSQXkWXaOPGvp"

# Load API key from .env.local
env_path = SCRIPT_DIR.parent.parent / ".env.local"
api_key = None
if env_path.exists():
    for line in env_path.read_text().splitlines():
        if line.startswith("ELEVENLABS_API_KEY="):
            api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

if not api_key:
    print("ERROR: ELEVENLABS_API_KEY not found in .env.local")
    exit(1)

client = ElevenLabs(api_key=api_key)
print("ElevenLabs client ready.")


def generate_speech(text: str) -> bytes:
    """Generate speech via ElevenLabs, return audio bytes."""
    audio_iter = client.text_to_speech.convert(
        voice_id=VOICE_ID,
        text=text,
        model_id="eleven_turbo_v2_5",
        output_format="mp3_44100_128",
    )
    buf = io.BytesIO()
    for chunk in audio_iter:
        buf.write(chunk)
    return buf.getvalue()


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        msg = args[0] if args else ''
        if '/api/' in str(msg):
            print(f"  {msg}")

    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            html = (SCRIPT_DIR / 'studio.html').read_text()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/api/tts':
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length))
            text = body.get('text', '').strip()

            if not text:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'No text')
                return

            try:
                t0 = time.time()
                audio_bytes = generate_speech(text)
                print(f"  Generated in {time.time() - t0:.1f}s: \"{text[:50]}\"")

                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(audio_bytes)))
                self.end_headers()
                self.wfile.write(audio_bytes)
            except Exception as e:
                print(f"  ERROR: {e}")
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            self.send_response(404)
            self.end_headers()


def main():
    server = http.server.HTTPServer(('127.0.0.1', PORT), Handler)
    print(f"\nRookie Voice Studio (ElevenLabs)")
    print(f"  http://localhost:{PORT}")
    print(f"  Ctrl+C to stop\n")
    webbrowser.open(f'http://localhost:{PORT}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.server_close()


if __name__ == '__main__':
    main()
