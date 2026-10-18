'use client';

import { useEffect, useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { ALARM_VARIANTS, type AlarmVariant } from '@/lib/rookie-os/types';
import type { SpeechLine } from '@/lib/speech/priority-queue';
import { loadSoreLoserLines, type Stage } from '../stage';

const LABELS: Record<AlarmVariant | 'siren', string> = {
  siren: 'Red siren',
  heartbeat: 'Heartbeat',
  sos: 'SOS',
  shiver: 'Shiver',
  ringPulse: 'Ring pulse',
  flickerOut: 'Flicker out',
};

const OPTIONS: (AlarmVariant | 'siren')[] = ['siren', ...ALARM_VARIANTS];

export function Meltdown({ stage }: { stage: Stage }) {
  const [lines, setLines] = useState<SpeechLine[]>([]);
  const [active, setActive] = useState<AlarmVariant | 'siren' | null>(null);

  // Text-only sore-loser lines (verbatim from the frozen pool).
  useEffect(() => {
    loadSoreLoserLines().then((all) => setLines(all.filter((l) => !l.sfx)));
  }, []);

  const trigger = (opt: AlarmVariant | 'siren', i: number) => {
    setActive(opt);
    const alarm = opt === 'siren' ? null : opt;
    const line = lines[i % Math.max(1, lines.length)];
    if (line) stage.say(line.text, { mood: 'panicking', alarm });
    else stage.setLook('panicking', alarm);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {OPTIONS.map((opt, i) => (
        <button
          key={opt}
          onClick={() => trigger(opt, i)}
          className={`bg-white rounded-2xl p-4 flex flex-col items-center gap-2 min-h-[44px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition ${
            active === opt ? 'ring-2 ring-chess-red' : 'hover:-translate-y-0.5'
          }`}
        >
          <BreathingRook size="sm" mood="panicking" animate alarmVariant={opt === 'siren' ? null : opt} />
          <span className="font-black text-sm">{LABELS[opt]}</span>
        </button>
      ))}
    </div>
  );
}
