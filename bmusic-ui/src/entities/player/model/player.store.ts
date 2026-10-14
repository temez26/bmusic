import { Injectable, computed, effect, signal } from '@angular/core';
import type { Song } from '@entities/song';

interface PlayerState {
  current: Song | null;
  /** Songs that next/previous/shuffle move through. */
  queue: Song[];
  isPlaying: boolean;
  shuffle: boolean;
  repeat: boolean;
  /** 0-100 */
  volume: number;
  /** Seconds */
  position: number;
  duration: number;
}

/** A new object for every track (re)load so the audio element always reacts. */
export interface TrackRequest {
  song: Song;
  startAt: number;
}

const STORAGE_KEY = 'bmusic.player';

const initialState: PlayerState = {
  current: null,
  queue: [],
  isPlaying: false,
  shuffle: false,
  repeat: false,
  volume: 50,
  position: 0,
  duration: 0,
};

const restore = (): PlayerState => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    // Browsers block autoplay after a reload, so a restored session starts paused.
    return saved ? { ...initialState, ...saved, isPlaying: false } : initialState;
  } catch {
    return initialState;
  }
};

@Injectable({ providedIn: 'root' })
export class PlayerStore {
  private readonly state = signal<PlayerState>(restore());
  private readonly trackRequest = signal<TrackRequest | null>(this.restoredTrack());

  readonly current = computed(() => this.state().current);
  readonly queue = computed(() => this.state().queue);
  readonly isPlaying = computed(() => this.state().isPlaying);
  readonly shuffle = computed(() => this.state().shuffle);
  readonly repeat = computed(() => this.state().repeat);
  readonly volume = computed(() => this.state().volume);
  readonly position = computed(() => this.state().position);
  readonly duration = computed(() => this.state().duration);
  readonly track = this.trackRequest.asReadonly();

  constructor() {
    effect(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
      } catch {
        // Storage can be unavailable (private mode, quota); playback still works.
      }
    });
  }

  load(song: Song, queue: Song[]): void {
    this.patch({ current: song, queue, isPlaying: true, position: 0, duration: 0 });
    this.trackRequest.set({ song, startAt: 0 });
  }

  setPlaying(isPlaying: boolean): void {
    this.patch({ isPlaying });
  }

  toggleShuffle(): void {
    this.patch({ shuffle: !this.state().shuffle });
  }

  toggleRepeat(): void {
    this.patch({ repeat: !this.state().repeat });
  }

  setVolume(volume: number): void {
    this.patch({ volume: Math.min(100, Math.max(0, volume)) });
  }

  setPosition(position: number): void {
    this.patch({ position });
  }

  setDuration(duration: number): void {
    this.patch({ duration });
  }

  private patch(changes: Partial<PlayerState>): void {
    this.state.update((state) => ({ ...state, ...changes }));
  }

  private restoredTrack(): TrackRequest | null {
    const { current, position } = this.state();
    return current ? { song: current, startAt: position } : null;
  }
}
