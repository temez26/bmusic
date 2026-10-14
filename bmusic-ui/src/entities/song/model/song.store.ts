import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SongApi } from '../api/song.api';
import { Song } from './song';

@Injectable({ providedIn: 'root' })
export class SongStore {
  private readonly api = inject(SongApi);
  private readonly state = signal<Song[]>([]);

  /** All songs, ordered by id. */
  readonly songs = this.state.asReadonly();

  load(): void {
    this.api.getAll().subscribe({
      next: (songs) => this.state.set(songs),
      error: (err) => console.error('Failed to load songs', err),
    });
  }

  remove(id: number): Observable<void> {
    return this.api
      .delete(id)
      .pipe(tap(() => this.state.update((songs) => songs.filter((s) => s.id !== id))));
  }

  recordPlay(id: number): void {
    this.api.recordPlay(id).subscribe({
      next: ({ playCount }) =>
        this.state.update((songs) =>
          songs.map((s) => (s.id === id ? { ...s, play_count: playCount } : s))
        ),
      error: (err) => console.error('Failed to record play', err),
    });
  }
}
