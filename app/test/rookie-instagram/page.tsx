'use client';

import { Player } from '@remotion/player';
import { useMemo, useState } from 'react';
import {
  RookieInstagramReel,
  type RookieInstagramReelProps,
  type RookieTone,
} from '@/remotion/RookieInstagramReel';
import { FPS, FRAME_W, FRAME_H } from '@/remotion/lib/timing';
import { IG_DEFAULT_TOTAL } from '@/remotion/lib/instagram-timing';
import type { IGBubble } from '@/remotion/components/InstagramChrome';

const TONES: RookieTone[] = ['polite', 'neutral', 'spicy', 'confrontational'];

const SAMPLE_BUBBLES: Record<RookieTone, IGBubble[]> = {
  polite: [
    { from: 'user', text: 'rookie, review my last game?', startFrame: 30, endFrame: 90 },
    { from: 'rookie', text: "Of course! I'd love to.\nYou played really thoughtfully.", startFrame: 80, endFrame: 200 },
    { from: 'rookie', text: "Move 14 — the knight retreat —\nwas a small missed chance.", startFrame: 200, endFrame: 340 },
    { from: 'rookie', text: "But overall? Lovely game.", startFrame: 340, endFrame: 450 },
  ],
  neutral: [
    { from: 'user', text: 'coach review pls', startFrame: 30, endFrame: 90 },
    { from: 'rookie', text: "Sure. Game analyzed.", startFrame: 80, endFrame: 160 },
    { from: 'rookie', text: "Move 14: inaccuracy.\nMove 22: blunder.\nElsewhere: solid.", startFrame: 160, endFrame: 340 },
    { from: 'rookie', text: "Net: +0.3 pawns vs optimal.", startFrame: 340, endFrame: 450 },
  ],
  spicy: [
    { from: 'user', text: 'how bad was it', startFrame: 30, endFrame: 90 },
    { from: 'rookie', text: "Oh. Oh sweetie.", startFrame: 80, endFrame: 160 },
    { from: 'rookie', text: "Your knight on move 14\nhad a whole plan.\nYou ignored it.", startFrame: 160, endFrame: 340 },
    { from: 'rookie', text: "It's fine. I'm fine. 🙂", startFrame: 340, endFrame: 450 },
  ],
  confrontational: [
    { from: 'user', text: 'rookie. be honest.', startFrame: 30, endFrame: 90 },
    { from: 'rookie', text: "FINALLY. You asked.", startFrame: 80, endFrame: 160 },
    { from: 'rookie', text: "Move 14 was a CRIME.\nI watched it happen.\nI couldn't stop you.", startFrame: 160, endFrame: 340 },
    { from: 'rookie', text: "Do better. I believe in you.\nBarely.", startFrame: 340, endFrame: 450 },
  ],
};

const TOPIC_BY_TONE: Record<RookieTone, string> = {
  polite: 'Post-game coaching · polite',
  neutral: 'Post-game coaching · neutral',
  spicy: 'Post-game coaching · spicy',
  confrontational: 'Post-game coaching · confrontational',
};

export default function RookieInstagramTestPage() {
  const [tone, setTone] = useState<RookieTone>('polite');

  const inputProps: RookieInstagramReelProps = useMemo(
    () => ({
      displayName: 'Rookie',
      handle: 'rookie_the_rook',
      tone,
      topic: TOPIC_BY_TONE[tone],
      bubbles: SAMPLE_BUBBLES[tone],
      typingWindows: [
        { startFrame: 50, endFrame: 78 },
        { startFrame: 140, endFrame: 198 },
      ],
      durationFrames: IG_DEFAULT_TOTAL,
    }),
    [tone],
  );

  return (
    <div
      style={{ minHeight: '100vh', background: '#0E1113', color: 'white' }}
      className="overflow-auto p-6"
    >
      <div className="mx-auto max-w-[520px] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight">Rookie · Instagram Reel</h1>
          <a
            href="/test"
            className="text-sm text-white/60 hover:text-white"
          >
            ← test pages
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={
                'px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition ' +
                (t === tone
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20')
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
          <Player
            component={RookieInstagramReel as any}
            inputProps={inputProps as any}
            durationInFrames={IG_DEFAULT_TOTAL}
            fps={FPS}
            compositionWidth={FRAME_W}
            compositionHeight={FRAME_H}
            style={{ width: '100%', aspectRatio: `${FRAME_W} / ${FRAME_H}` }}
            controls
            loop
            autoPlay
          />
        </div>

        <p className="text-xs text-white/50 leading-relaxed">
          Placeholder bubbles + simulated syllable pulse (no audio yet). Voice pipeline
          + real audio-reactive pulse comes in step 2. ElevenLabs credits return 2026-04-28.
        </p>
      </div>
    </div>
  );
}
