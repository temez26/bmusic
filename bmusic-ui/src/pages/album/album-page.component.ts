import { Component, Input, computed, inject, numberAttribute, signal } from '@angular/core';
import { SongsTableComponent } from '@widgets/songs-table';
import { AlbumStore } from '@entities/album';
import { SongStore } from '@entities/song';
import { coverUrl } from '@shared/api';

@Component({
  selector: 'app-album-page',
  standalone: true,
  imports: [SongsTableComponent],
  templateUrl: './album-page.component.html',
  styleUrl: './album-page.component.scss',
})
export class AlbumPageComponent {
  private readonly songStore = inject(SongStore);
  private readonly albumStore = inject(AlbumStore);
  private readonly id = signal(0);

  /** Bound from the :albumId route parameter. */
  @Input({ transform: numberAttribute })
  set albumId(id: number) {
    this.id.set(id);
  }

  readonly album = computed(() => this.albumStore.albums().find((a) => a.id === this.id()));
  readonly songs = computed(() => this.songStore.songs().filter((s) => s.album_id === this.id()));
  readonly artist = computed(() => this.songs()[0]?.artist ?? '');
  readonly cover = computed(() => coverUrl(this.album()?.cover_image_url));
}
