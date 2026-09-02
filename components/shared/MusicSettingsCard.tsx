'use client';

import { useSyncExternalStore } from 'react';
import {
  MUSIC_TRACKS,
  getMusicPrefs,
  setMusicTrack,
  setMusicVolume,
  startMusicIfEnabled,
  subscribeMusic,
  type MusicTrackId,
} from '@/lib/music';
import { TrackRow } from '@/components/shared/MusicMenu';

const SERVER_PREFS = { track: null, volume: 0 } as const;

/**
 * Settings-card version of the /play music menu, for the profile screen.
 * Music keeps playing after you leave /play (one shared player), so this is
 * where you turn it off or change tracks from anywhere in the app. Same prefs
 * (lib/music.ts, localStorage) as the note button on /play.
 */
export function MusicSettingsCard() {
  const prefs = useSyncExternalStore(subscribeMusic, getMusicPrefs, () => SERVER_PREFS);
  const isOn = prefs.track !== null;

  return (
    <section className="mt-6 bg-chess-surface rounded-2xl border border-slate-200 shadow-sm px-4 py-3 flex flex-col gap-1">
      <p className="px-2 text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted">
        Music
      </p>

      <TrackRow label="Off" selected={prefs.track === null} onSelect={() => setMusicTrack(null)} />
      {MUSIC_TRACKS.map((t) => (
        <TrackRow
          key={t.id}
          label={t.name}
          selected={prefs.track === t.id}
          onSelect={() => {
            startMusicIfEnabled(); // this tap is the browser's audio-unlock gesture
            setMusicTrack(t.id as MusicTrackId);
          }}
        />
      ))}

      <div className="px-2 pt-2 pb-1 flex items-center gap-2">
        <span className="text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted w-10">
          Vol
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={Math.round(prefs.volume * 100)}
          onChange={(e) => setMusicVolume(Number(e.target.value) / 100)}
          disabled={!isOn}
          aria-label="Music volume"
          className="flex-1 h-11 accent-chess-text disabled:opacity-40"
        />
        <span className="text-[10px] font-bold tabular-nums text-chess-text-muted w-7 text-right">
          {Math.round(prefs.volume * 100)}
        </span>
      </div>

      <p className="px-2 pb-1 text-xs text-chess-text-muted">
        Saved on this device. The note button on Play does the same thing.
      </p>
    </section>
  );
}
