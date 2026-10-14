import { Component, Input, computed, inject, numberAttribute, signal } from '@angular/core';
import { SongsTableComponent } from '@widgets/songs-table';
import { Playlist, PlaylistApi, playlistImage } from '@entities/playlist';
import { SongStore } from '@entities/song';

@Component({
  selector: 'app-playlist-page',
  standalone: true,
  imports: [SongsTableComponent],
  templateUrl: './playlist-page.component.html',
  styleUrl: './playlist-page.component.scss',
})
export class PlaylistPageComponent {
  private readonly api = inject(PlaylistApi);
  private readonly songStore = inject(SongStore);
  private readonly songIds = signal<number[]>([]);
  private id = 0;

  readonly playlist = signal<Playlist | null>(null);
  /** Resolved through the song store so deleted songs disappear immediately. */
  readonly songs = computed(() => {
    const ids = new Set(this.songIds());
    return this.songStore.songs().filter((s) => ids.has(s.id));
  });
  readonly image = computed(() => {
    const playlist = this.playlist();
    return playlist ? playlistImage(playlist) : '';
  });

  /** Bound from the :playlistId route parameter. */
  @Input({ transform: numberAttribute })
  set playlistId(id: number) {
    this.id = id;
    this.api.get(id).subscribe({
      next: (playlist) => this.playlist.set(playlist),
      error: (err) => console.error('Failed to load playlist', err),
    });
    this.loadSongs();
  }

  loadSongs(): void {
    this.api.getSongs(this.id).subscribe({
      next: (songs) => this.songIds.set(songs.map((s) => s.id)),
      error: (err) => console.error('Failed to load playlist songs', err),
    });
  }
}
