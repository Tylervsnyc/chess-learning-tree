// Background music for Chess Path /play (ported from Rookie's Revenge, 2026-09-02).
//
// One <audio> element, one persisted preference. Browsers block audio
// until a user gesture, so `startIfEnabled()` is called from the same tap
// that warms up the SFX AudioContext — if the user has music on, it begins
// on their first touch of the board. The playlist runs like a jukebox: when a
// track ends, the next one in MUSIC_TRACKS starts (wrapping around), and the
// selection in the menu follows along.

export const MUSIC_TRACKS = [
  { id: 'dust-on-the-cartridge', name: 'Dust on the Cartridge', src: '/music/dust-on-the-cartridge.mp3' },
  { id: 'lost-checkpoint', name: 'Lost Checkpoint', src: '/music/lost-checkpoint.mp3' },
  { id: 'distant-horizon', name: 'Distant Horizon', src: '/music/distant-horizon.mp3' },
] as const;

export type MusicTrackId = (typeof MUSIC_TRACKS)[number]['id'];

export type MusicPrefs = {
  /** null = music off */
  track: MusicTrackId | null;
  /** 0..1 */
  volume: number;
};

const STORAGE_KEY = 'cp_music_v1';
// Off by default on Chess Path — Rookie talks during /play, so music is opt-in.
const DEFAULT_PREFS: MusicPrefs = { track: null, volume: 0.35 };

let audio: HTMLAudioElement | null = null;
let prefs: MusicPrefs | null = null;
let unlocked = false; // a user gesture has happened
const listeners = new Set<() => void>();

function loadPrefs(): MusicPrefs {
  if (prefs) return prefs;
  prefs = { ...DEFAULT_PREFS };
  if (typeof window === 'undefined') return prefs;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MusicPrefs>;
      const validTrack = MUSIC_TRACKS.some((t) => t.id === parsed.track);
      prefs = {
        track: parsed.track === null ? null : validTrack ? (parsed.track as MusicTrackId) : DEFAULT_PREFS.track,
        volume: typeof parsed.volume === 'number' ? Math.min(1, Math.max(0, parsed.volume)) : DEFAULT_PREFS.volume,
      };
    }
  } catch {
    // ignore — defaults
  }
  return prefs;
}

function savePrefs() {
  if (typeof window === 'undefined' || !prefs) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

function ensureAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!audio) {
    audio = new Audio();
    audio.loop = false; // the playlist advances on 'ended' instead of looping one track
    audio.preload = 'auto';
    audio.addEventListener('ended', playNextTrack);
    // Stop when the app is closed or sent to the background (tab hidden, phone
    // locked, app switcher), and pick back up when it returns. Without this
    // the track keeps playing behind whatever the user switched to.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') audio?.pause();
      else apply();
    });
    window.addEventListener('pagehide', () => audio?.pause());
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as { __cpMusic?: HTMLAudioElement }).__cpMusic = audio;
    }
  }
  return audio;
}

function apply() {
  const el = ensureAudio();
  if (!el) return;
  const p = loadPrefs();
  el.volume = p.volume;

  const track = MUSIC_TRACKS.find((t) => t.id === p.track);
  if (!track) {
    el.pause();
    return;
  }
  const wantSrc = new URL(track.src, window.location.origin).href;
  if (el.src !== wantSrc) {
    el.src = track.src;
    el.load();
  }
  if (unlocked && el.paused) {
    void el.play().catch(() => {
      // Autoplay refused — will retry on the next gesture via startIfEnabled.
    });
  }
}

/** Advance to the next track in the playlist (wraps around). No-op when music is off. */
function playNextTrack() {
  const p = loadPrefs();
  if (p.track === null) return;
  const idx = MUSIC_TRACKS.findIndex((t) => t.id === p.track);
  const next = MUSIC_TRACKS[(idx + 1) % MUSIC_TRACKS.length];
  setMusicTrack(next.id);
}

/** Read current prefs (safe on server: returns defaults). */
export function getMusicPrefs(): MusicPrefs {
  return loadPrefs();
}

export function setMusicTrack(track: MusicTrackId | null) {
  loadPrefs();
  prefs = { ...prefs!, track };
  savePrefs();
  apply();
}

export function setMusicVolume(volume: number) {
  loadPrefs();
  prefs = { ...prefs!, volume: Math.min(1, Math.max(0, volume)) };
  savePrefs();
  apply();
}

/**
 * Call from a user gesture (tap/click). Marks audio as unlocked and starts
 * the chosen track if music is on. Idempotent.
 */
export function startMusicIfEnabled() {
  unlocked = true;
  apply();
}

/** Pause without changing the saved preference (e.g. tab hidden). */
export function pauseMusic() {
  audio?.pause();
}

/** Subscribe to pref changes (for the menu UI). Returns unsubscribe. */
export function subscribeMusic(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
