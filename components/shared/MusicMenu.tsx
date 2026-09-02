'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  MUSIC_TRACKS,
  getMusicPrefs,
  setMusicTrack,
  setMusicVolume,
  startMusicIfEnabled,
  subscribeMusic,
  type MusicTrackId,
} from '@/lib/music';

const SERVER_PREFS = { track: null, volume: 0 } as const;

function NoteGlyph({ size = 16, muted }: { size?: number; muted: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18V6l10-2v12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="18" r="2.5" fill="currentColor" />
      <circle cx="16.5" cy="16" r="2.5" fill="currentColor" />
      {muted && (
        <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      )}
    </svg>
  );
}

/**
 * Small music control for the gameplay header: a note button that opens a
 * dropdown with a track picker (Off / tracks) and a volume slider.
 * Prefs live in lib/music.ts (localStorage) so they survive reloads.
 * Ported from Rookie's Revenge (same button, same playlist behaviour).
 */
export function MusicMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Re-render on pref changes; identical snapshot on the server for hydration.
  const prefs = useSyncExternalStore(subscribeMusic, getMusicPrefs, () => SERVER_PREFS);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isOn = prefs.track !== null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          startMusicIfEnabled(); // this tap counts as the unlock gesture
          setOpen((o) => !o);
        }}
        aria-label="Music"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`w-11 h-11 rounded-lg hover:bg-chess-surface-subtle flex items-center justify-center active:scale-90 transition-transform ${
          isOn ? 'text-chess-text' : 'text-chess-text-faint'
        }`}
      >
        <NoteGlyph size={16} muted={!isOn} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-56 rounded-xl bg-chess-surface shadow-lg border border-chess-text/10 p-2 flex flex-col gap-1"
        >
          <p className="px-2 pt-1 text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted">
            Music
          </p>

          <TrackRow
            label="Off"
            selected={prefs.track === null}
            onSelect={() => setMusicTrack(null)}
          />
          {MUSIC_TRACKS.map((t) => (
            <TrackRow
              key={t.id}
              label={t.name}
              selected={prefs.track === t.id}
              onSelect={() => {
                startMusicIfEnabled();
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
        </div>
      )}
    </div>
  );
}

export function TrackRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      onClick={onSelect}
      className={`w-full min-h-[44px] px-2 rounded-lg flex items-center justify-between text-left text-sm font-bold transition-colors ${
        selected ? 'bg-chess-text/10 text-chess-text' : 'text-chess-text-muted hover:bg-chess-text/5'
      }`}
    >
      <span className="truncate">{label}</span>
      {selected && <span className="text-xs font-black">✓</span>}
    </button>
  );
}
