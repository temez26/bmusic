import { Injectable, inject } from '@angular/core';
import { PlayerStore } from '@entities/player';
import { Song, SongStore } from '@entities/song';

/** Starts songs and moves through the queue; every started song counts as a play. */
@Injectable({ providedIn: 'root' })
export class PlaybackService {
  private readonly player = inject(PlayerStore);
  private readonly songs = inject(SongStore);

  /** Plays a song; `queue` is the list it was picked from (defaults to the whole library). */
  play(song: Song, queue: Song[] = this.songs.songs()): void {
    this.player.load(song, queue.length ? queue : this.songs.songs());
    this.songs.recordPlay(song.id);
  }

  next(): void {
    const song = this.player.shuffle() ? this.randomSong() : this.neighbour(1);
    if (song) this.play(song, this.queue());
  }

  previous(): void {
    const song = this.neighbour(-1);
    if (song) this.play(song, this.queue());
  }

  onTrackEnded(): void {
    const current = this.player.current();
    if (this.player.repeat() && current) {
      this.play(current, this.queue());
    } else {
      this.next();
    }
  }

  private queue(): Song[] {
    const queue = this.player.queue();
    return queue.length ? queue : this.songs.songs();
  }

  private neighbour(offset: number): Song | null {
    const queue = this.queue();
    if (!queue.length) return null;
    const index = queue.findIndex((s) => s.id === this.player.current()?.id);
    if (index === -1) return queue[0];
    return queue[(index + offset + queue.length) % queue.length];
  }

  private randomSong(): Song | null {
    const currentId = this.player.current()?.id;
    const candidates = this.queue().filter((s) => s.id !== currentId);
    const pool = candidates.length ? candidates : this.queue();
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }
}
