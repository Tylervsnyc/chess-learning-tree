'use client';

import { useEffect, useState } from 'react';
import { ALARM_VARIANTS } from '@/lib/rookie-os/types';
import type { SpeechLine } from '@/lib/speech/priority-queue';
import { loadSoreLoserLines, type Stage } from '../stage';

// "train-horn.mp3" → "Train horn"
const sfxLabel = (file: string) => {
  const s = file.replace(/\.mp3$/, '').replace(/-/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const randomAlarm = () => ALARM_VARIANTS[Math.floor(Math.random() * ALARM_VARIANTS.length)];

export function Sabotage({ stage }: { stage: Stage }) {
  const [sfxLines, setSfxLines] = useState<SpeechLine[]>([]);
  const [textLines, setTextLines] = useState<SpeechLine[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    loadSoreLoserLines().then((all) => {
      setSfxLines(all.filter((l) => l.sfx));
      setTextLines(all.filter((l) => !l.sfx).slice(0, 8));
    });
  }, []);

  const play = (line: SpeechLine) => {
    setActive(line.id);
    stage.say(line.text, { mood: 'panicking', alarm: randomAlarm(), sfx: line.sfx });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sfxLines.map((l) => (
          <button
            key={l.id}
            onClick={() => play(l)}
            className={`text-left bg-white rounded-2xl p-4 min-h-[44px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition ${
              active === l.id ? 'ring-2 ring-chess-red' : 'hover:-translate-y-0.5'
            }`}
          >
            <span className="inline-block rounded-full bg-chess-red/10 text-chess-red text-[11px] font-black uppercase tracking-wider px-2 py-0.5">
              {sfxLabel(l.sfx!.file)}
            </span>
            <span className="mt-2 block text-[15px] font-semibold leading-snug">
              {l.text.replace('[SFX]', '…').trim()}
            </span>
          </button>
        ))}
      </div>

      {textLines.length > 0 && (
        <>
          <p className="mt-8 text-xs font-bold uppercase tracking-wider text-chess-text-faint">More from the meltdown</p>
          <div className="mt-2 flex flex-col gap-2">
            {textLines.map((l) => (
              <button
                key={l.id}
                onClick={() => play(l)}
                className={`text-left bg-white rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium shadow-[0_1px_6px_rgba(0,0,0,0.05)] ${
                  active === l.id ? 'ring-2 ring-chess-red' : ''
                }`}
              >
                {l.text}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
