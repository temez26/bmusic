import { Component, Input, computed, inject, numberAttribute, signal } from '@angular/core';
import { SongsTableComponent } from '@widgets/songs-table';
import { ArtistStore } from '@entities/artist';
import { SongStore, formatGenre } from '@entities/song';

@Component({
  selector: 'app-artist-page',
  standalone: true,
  imports: [SongsTableComponent],
  templateUrl: './artist-page.component.html',
  styleUrl: './artist-page.component.scss',
})
export class ArtistPageComponent {
  private readonly songStore = inject(SongStore);
  private readonly artistStore = inject(ArtistStore);
  private readonly id = signal(0);

  /** Bound from the :artistId route parameter. */
  @Input({ transform: numberAttribute })
  set artistId(id: number) {
    this.id.set(id);
  }

  readonly songs = computed(() => this.songStore.songs().filter((s) => s.artist_id === this.id()));
  readonly name = computed(
    () => this.artistStore.artists().find((a) => a.id === this.id())?.name ?? this.songs()[0]?.artist ?? ''
  );
  readonly genre = computed(() => formatGenre(this.songs()[0]?.genre ?? null));
}
